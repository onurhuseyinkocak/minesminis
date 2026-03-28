import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Sparkles, Trophy, Star, Check, RotateCcw, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import './PronunciationGame.css';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface GameProps {
  words: WordItem[];
  onComplete: (score: number, totalPossible: number) => void;
  onXpEarned?: (xp: number) => void;
  onWrongAnswer?: () => void;
}

const WORDS_PER_ROUND = 5;

// ── Levenshtein distance for fuzzy matching ───────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Returns similarity ratio 0–1 between two strings.
 * Tolerates Turkish accent patterns (e.g. "epıl" vs "apple", "cat" vs "kat").
 * Threshold: >= 0.65 is accepted as correct.
 */
function similarityScore(heard: string, target: string): number {
  if (!heard || !target) return 0;

  // Normalize: lowercase, strip punctuation
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .trim();

  const h = normalize(heard);
  const t = normalize(target);

  if (h === t) return 1;

  // Exact word boundary match: "apple" inside "the apple" is fine
  // but "cap" inside "captain" should NOT pass — use word-boundary check
  const heardWords = h.split(/\s+/);
  if (heardWords.includes(t)) return 1;

  // Levenshtein similarity on target vs each heard word
  const maxLen = Math.max(h.length, t.length);
  if (maxLen === 0) return 1;

  // Check against each word in heard transcript for multi-word phrases
  let bestWordScore = 0;
  for (const word of heardWords) {
    const dist = levenshtein(word, t);
    const wordLen = Math.max(word.length, t.length);
    const score = wordLen === 0 ? 1 : 1 - dist / wordLen;
    if (score > bestWordScore) bestWordScore = score;
  }

  // Also check full heard string vs target (handles run-on speech)
  const fullDist = levenshtein(h, t);
  const fullScore = 1 - fullDist / maxLen;

  return Math.max(bestWordScore, fullScore);
}

const SIMILARITY_THRESHOLD = 0.65; // 65% similarity accepted for Turkish accents

// ── Error type classification ─────────────────────────────────────────────────
type SpeechError = 'no-speech' | 'not-allowed' | 'network' | 'other';

function classifyError(error: string): SpeechError {
  if (error === 'no-speech') return 'no-speech';
  if (error === 'not-allowed' || error === 'permission-denied') return 'not-allowed';
  if (error === 'network') return 'network';
  return 'other';
}

function getSpeechRecognitionConstructor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export const PronunciationGame: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);
  const roundWords = words.slice(0, WORDS_PER_ROUND);
  const total = roundWords.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [heardText, setHeardText] = useState('');
  const [speechError, setSpeechError] = useState<SpeechError | null>(null);
  const [completed, setCompleted] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Use ref to track score for closure-safe reads
  const scoreRef = useRef(0);

  const currentWord = roundWords[currentIndex];
  const SRConstructor = getSpeechRecognitionConstructor();
  const isSupported = SRConstructor !== null;

  const speakWord = useCallback((text: string) => {
    setIsPlaying(true);
    try {
      speak(text);
    } catch {
      /* TTS not available */
    }
    setTimeout(() => setIsPlaying(false), 1200);
  }, []);

  if (words.length < 1) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        {t('games.noWordsToReview') || 'No words to review.'}
      </div>
    );
  }

  const advanceToNext = useCallback(
    (currentScore: number) => {
      if (currentIndex + 1 >= total) {
        setCompleted(true);
        autoCompleteTimeoutRef.current = setTimeout(() => onComplete(currentScore, total), 4000);
      } else {
        setCurrentIndex((i) => i + 1);
        setFeedback(null);
        setHeardText('');
        setSpeechError(null);
        setMissCount(0);
      }
    },
    [currentIndex, total, onComplete],
  );

  const goToNext = useCallback(() => {
    // Skip: uses scoreRef to avoid stale closure
    advanceToNext(scoreRef.current);
  }, [advanceToNext]);

  const handleResult = useCallback(
    (spoken: string, alternatives?: string[]) => {
      if (!currentWord) return;

      const target = currentWord.english.trim().toLowerCase();

      // Check spoken + all alternatives — accept best match
      const candidates = [spoken, ...(alternatives ?? [])];
      let bestScore = 0;
      let bestCandidate = spoken;
      for (const candidate of candidates) {
        const s = similarityScore(candidate, target);
        if (s > bestScore) {
          bestScore = s;
          bestCandidate = candidate;
        }
      }

      const isCorrect = bestScore >= SIMILARITY_THRESHOLD;

      setHeardText(bestCandidate);
      setSpeechError(null);

      if (isCorrect) {
        setFeedback('correct');
        SFX.correct();
        const newScore = scoreRef.current + 1;
        scoreRef.current = newScore;
        setScore(newScore);
        onXpEarned?.(15);

        setTimeout(() => {
          advanceToNext(newScore);
        }, 1500);
      } else {
        setFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        if (hearts - 1 <= 0) {
          setShowNoHearts(true);
        }
        setMissCount((prev) => prev + 1);
      }
    },
    [currentWord, advanceToNext, onXpEarned, onWrongAnswer, loseHeart, hearts],
  );

  const startListening = useCallback(() => {
    if (!SRConstructor || isListening) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* ignore */
      }
    }

    const recognition = new SRConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    // Increase alternatives so Turkish-accented speech has more chances
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback(null);
      setHeardText('');
      setSpeechError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0];
      if (result && result[0]) {
        // Collect all alternatives
        const alternatives: string[] = [];
        for (let i = 1; i < result.length; i++) {
          alternatives.push(result[i].transcript);
        }
        handleResult(result[0].transcript, alternatives);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const errType = classifyError(event.error);
      setSpeechError(errType);
      // Do NOT set feedback to 'wrong' — this is a system error, not a wrong answer
      // Only no-speech resets to neutral so user can retry
      if (errType !== 'no-speech') {
        // For not-allowed / network, show persistent error — don't trigger wrong feedback
        setFeedback(null);
        setHeardText('');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, isListening, handleResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    setIsListening(false);
  }, []);

  // Unsupported browser
  if (!isSupported) {
    return (
      <div className="pronunciation-game">
        <div className="pronunciation-game__unsupported">
          <h2>{t('games.speechUnavailable')}</h2>
          <p>{t('games.speechUnavailableMsg')}</p>
          <button
            type="button"
            className="pronunciation-game__btn pronunciation-game__btn--skip"
            onClick={() => onComplete(0, total)}
          >
            {t('games.skip') || 'Skip'}
          </button>
        </div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setIsListening(false);
    setFeedback(null);
    setHeardText('');
    setSpeechError(null);
    setMissCount(0);
    setCompleted(false);
  };

  // Completed
  if (completed) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    const isPerfect = pct === 100;
    return (
      <div className="pronunciation-game" style={{ position: 'relative' }}>
        {isPerfect && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl" className="pronunciation-game__results">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="pronunciation-game__results-content"
          >
            <motion.span
              className="pronunciation-game__results-emoji"
              role="img"
              aria-label="celebration"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
            >
              {pct >= 90 ? (
                <Trophy size={48} color="var(--warning)" />
              ) : pct >= 60 ? (
                <Star size={48} fill="var(--warning)" color="var(--warning)" />
              ) : (
                <Check size={48} color="var(--success)" />
              )}
            </motion.span>
            <h2 className="pronunciation-game__results-title">
              {pct >= 90
                ? t('games.amazingPronunciation')
                : pct >= 60
                  ? t('games.goodEffort')
                  : t('games.keepPracticing')}
            </h2>
            <p className="pronunciation-game__results-score">
              {t('games.youPronounced')
                .replace('{score}', String(score))
                .replace('{total}', String(total))}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.55 + i * 0.12 }}
                >
                  <Star size={32} fill={i < stars ? 'var(--primary)' : 'none'} color={i < stars ? 'var(--primary)' : 'var(--border-strong, #ccc)'} />
                </motion.span>
              ))}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 15} XP
              </Badge>
            </motion.div>
            <div className="pronunciation-game__results-actions">
              <button
                type="button"
                className="pronunciation-game__results-btn pronunciation-game__results-btn--secondary"
                onClick={() => {
                  if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                  onComplete(score, total);
                }}
              >
                <ArrowRight size={16} /> {t('games.backToGames') || 'Back'}
              </button>
              <button
                type="button"
                className="pronunciation-game__results-btn pronunciation-game__results-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} /> {t('games.playAgain') || 'Play Again'}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  const progress = (currentIndex / total) * 100;
  const cardClass = [
    'pronunciation-game__card',
    feedback === 'correct' && 'pronunciation-game__card--correct',
    feedback === 'wrong' && 'pronunciation-game__card--wrong',
  ]
    .filter(Boolean)
    .join(' ');

  // Persistent error banner (mic denied / network) — separate from wrong feedback
  const showErrorBanner =
    speechError === 'not-allowed' || speechError === 'network';
  const errorBannerMsg =
    speechError === 'not-allowed'
      ? t('games.micPermissionDenied') || 'Microphone access denied. Please allow microphone in your browser settings.'
      : t('games.networkError') || 'Network error. Check your connection and try again.';

  return (
    <>
    {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}
    <div className="pronunciation-game" role="application" aria-label="Pronunciation practice game">
      <div className="pronunciation-game__header">
        <h2 className="pronunciation-game__title">{t('games.sayTheWord')}</h2>
        <Badge variant="info">
          {t('games.word')} {currentIndex + 1}/{total}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <p className="pronunciation-game__counter">
        {t('games.score')}: {score}/{total}
      </p>

      {/* Persistent system error banner — mic denied / network */}
      {showErrorBanner && (
        <motion.div
          className="pronunciation-game__error-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="assertive"
          role="alert"
        >
          <AlertCircle size={18} />
          <span>{errorBannerMsg}</span>
          {speechError === 'not-allowed' && (
            <button
              type="button"
              className="pronunciation-game__btn pronunciation-game__btn--skip"
              style={{ marginLeft: '0.5rem' }}
              onClick={goToNext}
            >
              {t('games.skip') || 'Skip'}
            </button>
          )}
        </motion.div>
      )}

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={cardClass}
      >
        <div
          className={`pronunciation-game__emoji${currentWord.emoji ? '' : ' pronunciation-game__emoji--fallback'}`}
        >
          {currentWord.emoji || currentWord.english.charAt(0).toUpperCase()}
        </div>
        <div className="pronunciation-game__word">{currentWord.english}</div>
        <div className="pronunciation-game__turkish">{currentWord.turkish}</div>

        <div className="pronunciation-game__buttons">
          <button
            type="button"
            className={`pronunciation-game__btn pronunciation-game__btn--listen ${isPlaying ? 'playing' : ''}`}
            onClick={() => speakWord(currentWord.english)}
            disabled={isListening}
            aria-label="Listen to pronunciation"
          >
            <Volume2 size={20} /> {t('games.listen')}
          </button>

          {feedback !== 'correct' && !showErrorBanner && (
            <button
              type="button"
              className={`pronunciation-game__btn pronunciation-game__btn--speak ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              <Mic size={20} /> {isListening ? t('games.listening') : t('games.speak')}
            </button>
          )}
        </div>

        {/* no-speech hint — soft, not wrong feedback */}
        {speechError === 'no-speech' && !feedback && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
          >
            {t('games.noSpeechDetected') || 'No speech detected. Speak clearly and try again.'}
          </motion.div>
        )}

        {feedback === 'correct' && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--correct"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 size={20} /> {t('games.perfectWellDone')}
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--wrong"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>{t('games.notQuiteRight')}</div>
            {heardText && (
              <div className="pronunciation-game__heard">
                {t('games.youSaid')} &quot;<strong>{heardText}</strong>&quot; —{' '}
                {t('games.expected')} &quot;<strong>{currentWord.english}</strong>&quot;
              </div>
            )}
            <div className="pronunciation-game__feedback-actions">
              {/* Always show retry — but warn after 3 misses to reduce frustration */}
              <button
                type="button"
                className="pronunciation-game__btn pronunciation-game__btn--try-again"
                onClick={startListening}
              >
                <Mic size={18} />{' '}
                {missCount >= 3
                  ? t('games.tryOnceMore') || 'Try once more'
                  : t('games.tryAgain')}
              </button>
              <button
                type="button"
                className="pronunciation-game__btn pronunciation-game__btn--skip"
                onClick={goToNext}
              >
                {t('games.skip')}
              </button>
            </div>
            {missCount >= 3 && (
              <div className="pronunciation-game__miss-hint" aria-live="polite">
                {t('games.pronunciationTip') ||
                  'Tip: Speak slowly and clearly. You can skip and come back.'}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
    </>
  );
};

PronunciationGame.displayName = 'PronunciationGame';
