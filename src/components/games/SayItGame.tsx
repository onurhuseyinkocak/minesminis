import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { SpeakButton } from '../SpeakButton';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import './SayItGame.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SayItQuestion {
  id: string;
  word: string;
  wordTr: string;
  phonetic?: string;
  hint?: string;
  hintTr?: string;
}

export interface SayItGameProps {
  questions: SayItQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Speech Recognition helpers ────────────────────────────────────────────────

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
};

function getSpeechRecognitionConstructor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as SpeechRecognitionWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

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
 * Returns similarity ratio 0–1.
 * Threshold >= 0.65 accepted as correct (Turkish accent tolerant).
 * Word-boundary aware: "the apple" contains "apple" (pass),
 * but "captain" does NOT contain "cap" as a word-boundary match (fail).
 */
function similarityScore(heard: string, target: string): number {
  if (!heard || !target) return 0;

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .trim();

  const h = normalize(heard);
  const t = normalize(target);

  if (h === t) return 1;

  // Word-boundary match: target must be a whole word in heard transcript
  const heardWords = h.split(/\s+/);
  if (heardWords.includes(t)) return 1;

  // Levenshtein per word — best match
  let bestWordScore = 0;
  for (const word of heardWords) {
    const dist = levenshtein(word, t);
    const wordLen = Math.max(word.length, t.length);
    const s = wordLen === 0 ? 1 : 1 - dist / wordLen;
    if (s > bestWordScore) bestWordScore = s;
  }

  // Full-string comparison
  const maxLen = Math.max(h.length, t.length);
  const fullScore = maxLen === 0 ? 1 : 1 - levenshtein(h, t) / maxLen;

  return Math.max(bestWordScore, fullScore);
}

const SIMILARITY_THRESHOLD = 0.65;

// ── Error type classification ─────────────────────────────────────────────────

type SpeechErrorType = 'no-speech' | 'not-allowed' | 'network' | 'other';

function classifyError(error: string): SpeechErrorType {
  if (error === 'no-speech') return 'no-speech';
  if (error === 'not-allowed' || error === 'permission-denied') return 'not-allowed';
  if (error === 'network') return 'network';
  return 'other';
}

// ── Mic button states ─────────────────────────────────────────────────────────

type MicState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

// ── Mic SVG icon ──────────────────────────────────────────────────────────────

function MicIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const SayItGame: React.FC<SayItGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [micState, setMicState] = useState<MicState>('idle');
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [heardText, setHeardText] = useState('');
  const [missCount, setMissCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [speechError, setSpeechError] = useState<SpeechErrorType | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // scoreRef keeps closure-safe score for advanceQuestion
  const scoreRef = useRef(0);

  // Cleanup speech recognition + timers on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          /* ignore */
        }
        recognitionRef.current = null;
      }
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const SRConstructor = getSpeechRecognitionConstructor();
  const isSpeechSupported = SRConstructor !== null;

  const currentQuestion = questions[currentIndex];

  // ── Auto-speak word when question changes ────────────────────────────────
  useEffect(() => {
    if (!currentQuestion) return;
    const id = setTimeout(() => {
      speak(currentQuestion.word, { lang: 'en-US', rate: 0.8, pitch: 1.1 });
    }, 400);
    return () => clearTimeout(id);
  }, [currentIndex, currentQuestion]);

  // ── Advance to next question ─────────────────────────────────────────────

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        SFX.celebration();
        autoCompleteTimeoutRef.current = setTimeout(
          () => onComplete(nextScore, questions.length),
          4000,
        );
      } else {
        if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = setTimeout(() => {
          setCurrentIndex(nextIndex);
          setFeedbackType(null);
          setHeardText('');
          setMicState('idle');
          setMissCount(0);
          setSpeechError(null);
        }, 1200);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  // ── Handle recognised speech result ─────────────────────────────────────

  const handleSpeechResult = useCallback(
    (spoken: string, alternatives?: string[]) => {
      if (!currentQuestion) return;

      const target = currentQuestion.word.trim().toLowerCase();

      // Evaluate spoken + all SR alternatives — accept best match
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
      setMicState(isCorrect ? 'success' : 'error');

      if (isCorrect) {
        setFeedbackType('correct');
        SFX.correct();
        const nextScore = scoreRef.current + 1;
        scoreRef.current = nextScore;
        setScore(nextScore);
        advanceQuestion(nextScore);
      } else {
        setFeedbackType('wrong');
        SFX.wrong();
        onWrongAnswer?.();

        const newMisses = missCount + 1;
        setMissCount(newMisses);
        // Lose a heart only after 2 failed attempts (not on first miss)
        if (newMisses >= 2) {
          loseHeart();
        }
      }
    },
    [currentQuestion, missCount, advanceQuestion, onWrongAnswer, loseHeart],
  );

  // ── Start listening ──────────────────────────────────────────────────────

  const startListening = useCallback(() => {
    if (!SRConstructor || micState === 'listening') return;

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
    // 3 alternatives improves Turkish accent matching significantly
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setMicState('listening');
      setFeedbackType(null);
      setHeardText('');
      setSpeechError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setMicState('processing');
      const result = event.results[0];
      if (result?.[0]) {
        const alternatives: string[] = [];
        for (let i = 1; i < result.length; i++) {
          alternatives.push(result[i].transcript);
        }
        handleSpeechResult(result[0].transcript, alternatives);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errType = classifyError(event.error);
      setSpeechError(errType);

      if (errType === 'no-speech') {
        // Soft reset — user just didn't speak, not an error
        setMicState('idle');
        setFeedbackType(null);
        setHeardText('');
      } else {
        // System error (not-allowed, network) — show error state but NOT wrong feedback
        setMicState('error');
        setFeedbackType(null);
        setHeardText('');
      }
    };

    recognition.onend = () => {
      setMicState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, micState, handleSpeechResult]);

  // ── Stop listening ───────────────────────────────────────────────────────

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    setMicState('idle');
  }, []);

  // ── Skip current question ────────────────────────────────────────────────

  const handleSkip = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* ignore */
      }
    }
    onWrongAnswer?.();
    // Use scoreRef to avoid stale closure
    advanceQuestion(scoreRef.current);
  }, [advanceQuestion, onWrongAnswer]);

  // ── Mark as done (no speech support fallback) ────────────────────────────
  // Correctly increments scoreRef first, then advances with that value.

  const handleMarkDone = useCallback(() => {
    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);
    advanceQuestion(nextScore);
  }, [advanceQuestion]);

  // ── Play again ───────────────────────────────────────────────────────────

  const handlePlayAgain = useCallback(() => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setMicState('idle');
    setFeedbackType(null);
    setHeardText('');
    setMissCount(0);
    setSpeechError(null);
    setCompleted(false);
  }, []);

  // ── Unsupported browser ──────────────────────────────────────────────────

  if (!isSpeechSupported) {
    return (
      <div className="sig">
        <div className="sig__unsupported">
          <UnifiedMascot state="thinking" size={100} />
          <h2>{t('games.speechUnavailable') || 'Speech recognition not supported'}</h2>
          <p>
            {t('games.speechUnavailableMsg') ||
              'This exercise requires speech recognition. Try Chrome or tap to continue.'}
          </p>
          {currentQuestion && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="sig__word">{currentQuestion.word}</span>
              <br />
              <span className="sig__translation">{currentQuestion.wordTr}</span>
            </div>
          )}
          <div className="sig__actions">
            <button
              type="button"
              className="sig__btn sig__btn--mark-done"
              onClick={handleMarkDone}
            >
              {t('games.markAsDone') || 'Mark as done'}
            </button>
            <button
              type="button"
              className="sig__btn sig__btn--skip"
              onClick={handleSkip}
            >
              {t('games.skip')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Completion screen ────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="sig">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl" className="sig__completion">
          <motion.div
            className="sig__completion-content"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <UnifiedMascot state="celebrating" size={120} />

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? (
                <Trophy size={48} color="var(--primary)" />
              ) : pct >= 60 ? (
                <Star size={48} fill="var(--primary)" color="var(--primary)" />
              ) : (
                <Check size={48} color="var(--success)" />
              )}
            </motion.span>

            <h2 className="sig__completion-title">
              {pct >= 80
                ? t('games.amazingPronunciation')
                : pct >= 50
                  ? t('games.goodEffort')
                  : t('games.keepPracticing')}
            </h2>

            <p className="sig__completion-score">
              {score} / {questions.length}
            </p>

            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 12,
                    delay: 0.4 + i * 0.15,
                  }}
                >
                  <Star
                    size={32}
                    fill={i < stars ? 'var(--primary)' : 'none'}
                    color={i < stars ? 'var(--primary)' : 'var(--border-strong, #ccc)'}
                  />
                </motion.span>
              ))}
            </span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 15} XP
              </Badge>
            </motion.div>

            <div className="sig__completion-actions">
              <button
                type="button"
                className="sig__completion-btn sig__completion-btn--secondary"
                onClick={() => {
                  if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                  onComplete(score, questions.length);
                }}
              >
                <ArrowRight size={16} />
                {t('games.backToGames')}
              </button>
              <button
                type="button"
                className="sig__completion-btn sig__completion-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} />
                {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  const cardClass = [
    'sig__card',
    feedbackType === 'correct' && 'sig__card--correct',
    feedbackType === 'wrong' && 'sig__card--wrong',
  ]
    .filter(Boolean)
    .join(' ');

  const micLabel =
    micState === 'listening'
      ? t('games.listening') || 'Listening...'
      : micState === 'processing'
        ? t('games.processing') || 'Processing...'
        : micState === 'success'
          ? t('games.great') || 'Great!'
          : micState === 'error'
            ? t('games.tryAgain') || 'Try again'
            : t('games.speak') || 'Say it';

  // System error states — separate from wrong feedback
  const showPermissionError = speechError === 'not-allowed';
  const showNetworkError = speechError === 'network';
  const showNoSpeechHint = speechError === 'no-speech' && !feedbackType;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="sig" role="application" aria-label="Say It pronunciation practice game">
      {/* Header */}
      <div className="sig__header">
        <h2 className="sig__title">{t('games.sayIt') || 'Say It!'}</h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <p className="sig__score-row">
        {t('games.score')}: {score}/{questions.length}
      </p>

      {/* Mic permission denied — persistent banner, not wrong feedback */}
      {showPermissionError && (
        <motion.div
          className="sig__error-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={18} />
          <span>
            {t('games.micPermissionDenied') ||
              'Microphone access denied. Allow microphone access in your browser settings, then reload.'}
          </span>
          <button
            type="button"
            className="sig__btn sig__btn--skip"
            style={{ marginLeft: '0.5rem' }}
            onClick={handleSkip}
          >
            {t('games.skip')}
          </button>
        </motion.div>
      )}

      {/* Network error — persistent banner */}
      {showNetworkError && (
        <motion.div
          className="sig__error-banner sig__error-banner--network"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={18} />
          <span>
            {t('games.networkError') || 'Network error. Check your connection and try again.'}
          </span>
        </motion.div>
      )}

      {/* Word card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentIndex}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={cardClass}
        >
          {/* Illustration */}
          <WordIllustration word={currentQuestion.word} size={110} />

          {/* Word */}
          <div className="sig__word">
            {currentQuestion.word}
            <SpeakButton text={currentQuestion.word} size="md" />
          </div>
          <div className="sig__translation">{currentQuestion.wordTr}</div>

          {currentQuestion.phonetic && (
            <div className="sig__phonetic">/{currentQuestion.phonetic}/</div>
          )}

          {currentQuestion.hint && <div className="sig__hint">{currentQuestion.hint}</div>}

          {/* No-speech soft hint */}
          {showNoSpeechHint && (
            <motion.div
              className="sig__feedback sig__feedback--hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-live="polite"
            >
              {t('games.noSpeechDetected') || 'No speech detected. Speak clearly and try again.'}
            </motion.div>
          )}

          {/* Mic button — hidden when permission denied (useless to show) */}
          {!showPermissionError && (
            <div className="sig__mic-wrap">
              <button
                type="button"
                className={`sig__mic-btn sig__mic-btn--${micState}`}
                onClick={micState === 'listening' ? stopListening : startListening}
                disabled={micState === 'processing' || feedbackType === 'correct'}
                aria-label={
                  micState === 'listening'
                    ? t('games.stopRecording') || 'Stop recording'
                    : t('games.startSpeaking') || 'Start speaking'
                }
              >
                <MicIcon size={34} />
              </button>
              <span className="sig__mic-label" aria-live="polite">
                {micLabel}
              </span>
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {feedbackType && (
              <motion.div
                key={feedbackType}
                className={`sig__feedback sig__feedback--${feedbackType}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-live="assertive"
              >
                {feedbackType === 'correct'
                  ? t('games.perfectWellDone')
                  : t('games.notQuiteRight')}

                {feedbackType === 'wrong' && heardText && (
                  <div className="sig__heard">
                    {t('games.youSaid')} &ldquo;<strong>{heardText}</strong>&rdquo; —{' '}
                    {t('games.expected')} &ldquo;<strong>{currentQuestion.word}</strong>&rdquo;
                  </div>
                )}

                {feedbackType === 'wrong' && (
                  <div className="sig__actions" style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="sig__btn sig__btn--retry"
                      onClick={startListening}
                    >
                      <MicIcon size={16} />
                      {missCount >= 3
                        ? t('games.tryOnceMore') || 'Try once more'
                        : t('games.tryAgain')}
                    </button>
                    <button
                      type="button"
                      className="sig__btn sig__btn--skip"
                      onClick={handleSkip}
                    >
                      {t('games.skip')}
                    </button>
                  </div>
                )}

                {feedbackType === 'wrong' && missCount >= 3 && (
                  <div className="sig__miss-hint" aria-live="polite">
                    {t('games.pronunciationTip') ||
                      'Tip: Speak slowly and clearly. You can skip and come back.'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Always-visible skip (when not showing feedback skip) */}
      {!feedbackType && (
        <div className="sig__skip-row">
          <button type="button" className="sig__btn sig__btn--skip" onClick={handleSkip}>
            {t('games.skip')}
          </button>
        </div>
      )}
    </div>
  );
};

SayItGame.displayName = 'SayItGame';
