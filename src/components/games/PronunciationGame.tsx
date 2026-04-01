import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Sparkles, Trophy, Star, Check, RotateCcw, ArrowRight, CheckCircle2, AlertCircle, SkipForward } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';

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

function similarityScore(heard: string, target: string): number {
  if (!heard || !target) return 0;
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const h = normalize(heard);
  const t = normalize(target);
  if (h === t) return 1;
  const heardWords = h.split(/\s+/);
  if (heardWords.includes(t)) return 1;
  const maxLen = Math.max(h.length, t.length);
  if (maxLen === 0) return 1;
  let bestWordScore = 0;
  for (const word of heardWords) {
    const dist = levenshtein(word, t);
    const wordLen = Math.max(word.length, t.length);
    const score = wordLen === 0 ? 1 : 1 - dist / wordLen;
    if (score > bestWordScore) bestWordScore = score;
  }
  const fullDist = levenshtein(h, t);
  const fullScore = 1 - fullDist / maxLen;
  return Math.max(bestWordScore, fullScore);
}

const SIMILARITY_THRESHOLD = 0.65;

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

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

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
      <div className="flex items-center justify-center p-8 text-gray-400 text-center">
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
    advanceToNext(scoreRef.current);
  }, [advanceToNext]);

  const handleResult = useCallback(
    (spoken: string, alternatives?: string[]) => {
      if (!currentWord) return;
      const target = currentWord.english.trim().toLowerCase();
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
        setTimeout(() => advanceToNext(newScore), 1500);
      } else {
        setFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        if (hearts - 1 <= 0) setShowNoHearts(true);
        setMissCount((prev) => prev + 1);
      }
    },
    [currentWord, advanceToNext, onXpEarned, onWrongAnswer, loseHeart, hearts],
  );

  const startListening = useCallback(() => {
    if (!SRConstructor || isListening) return;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }
    const recognition = new SRConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
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
        const alternatives: string[] = [];
        for (let i = 1; i < result.length; i++) alternatives.push(result[i].transcript);
        handleResult(result[0].transcript, alternatives);
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const errType = classifyError(event.error);
      setSpeechError(errType);
      if (errType !== 'no-speech') {
        setFeedback(null);
        setHeardText('');
      }
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, isListening, handleResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, []);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-xl font-bold text-gray-700">{t('games.speechUnavailable')}</h2>
        <p className="text-gray-500">{t('games.speechUnavailableMsg')}</p>
        <button
          type="button"
          onClick={() => onComplete(0, total)}
          className="px-6 py-3 min-h-[48px] rounded-xl bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 transition-colors"
        >
          {t('games.skip') || 'Skip'}
        </button>
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

  // Completed screen
  if (completed) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {pct === 100 && <ConfettiRain duration={3000} />}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={springBounce}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-5"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springBounce, delay: 0.3 }}
          >
            {pct >= 90 ? <Trophy size={48} className="text-amber-500" /> : pct >= 60 ? <Star size={48} className="text-amber-500 fill-amber-500" /> : <Check size={48} className="text-emerald-500" />}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">
            {pct >= 90 ? t('games.amazingPronunciation') : pct >= 60 ? t('games.goodEffort') : t('games.keepPracticing')}
          </h2>
          <p className="text-lg text-gray-500">
            {t('games.youPronounced').replace('{score}', String(score)).replace('{total}', String(total))}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBounce, delay: 0.55 + i * 0.12 }}>
                <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <Sparkles size={14} /> +{score * 15} XP
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button type="button" onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, total); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
              <ArrowRight size={16} /> {t('games.backToGames') || 'Back'}
            </button>
            <button type="button" onClick={handlePlayAgain} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
              <RotateCcw size={16} /> {t('games.playAgain') || 'Play Again'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentWord) return null;

  const progress = (currentIndex / total) * 100;
  const showErrorBanner = speechError === 'not-allowed' || speechError === 'network';
  const errorBannerMsg = speechError === 'not-allowed'
    ? t('games.micPermissionDenied') || 'Microphone access denied. Please allow microphone in your browser settings.'
    : t('games.networkError') || 'Network error. Check your connection and try again.';

  // Accuracy meter based on similarity
  const accuracyPct = heardText && currentWord ? Math.round(similarityScore(heardText, currentWord.english) * 100) : 0;

  return (
    <>
      {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}
      <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto" role="application" aria-label="Pronunciation practice game">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{t('games.sayTheWord')}</h2>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {t('games.word')} {currentIndex + 1}/{total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-emerald-400 rounded-full" animate={{ width: `${progress}%` }} transition={springGentle} />
        </div>

        <p className="text-sm text-gray-400 text-center">{t('games.score')}: {score}/{total}</p>

        {/* Error banner */}
        {showErrorBanner && (
          <motion.div
            className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span className="flex-1">{errorBannerMsg}</span>
            {speechError === 'not-allowed' && (
              <button type="button" onClick={goToNext} className="px-3 py-1 min-h-[36px] rounded-lg bg-red-100 text-red-700 font-medium text-sm hover:bg-red-200 transition-colors">
                {t('games.skip') || 'Skip'}
              </button>
            )}
          </motion.div>
        )}

        {/* Word Card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springGentle}
          className={`
            flex flex-col items-center gap-4 p-6 rounded-2xl border-2 bg-white
            ${feedback === 'correct' ? 'border-emerald-400 bg-emerald-50' : feedback === 'wrong' ? 'border-red-300 bg-red-50' : 'border-gray-100'}
          `}
        >
          {/* Word display */}
          <div className="text-5xl font-black text-gray-800 tracking-tight">
            {currentWord.english}
          </div>
          <div className="text-base text-gray-400">{currentWord.turkish}</div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => speakWord(currentWord.english)}
              disabled={isListening}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl font-semibold transition-all
                ${isPlaying ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'}
              `}
              aria-label="Listen to pronunciation"
            >
              <Volume2 size={20} /> {t('games.listen')}
            </button>

            {feedback !== 'correct' && !showErrorBanner && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl font-semibold transition-all
                  ${isListening
                    ? 'bg-red-500 text-white border-2 border-red-500 animate-pulse'
                    : 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                  }
                `}
                aria-label={isListening ? 'Stop listening' : 'Start speaking'}
              >
                <Mic size={20} /> {isListening ? t('games.listening') : t('games.speak')}
              </button>
            )}
          </div>

          {/* No-speech hint */}
          {speechError === 'no-speech' && !feedback && (
            <motion.div
              className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-2 w-full text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              aria-live="polite"
            >
              {t('games.noSpeechDetected') || 'No speech detected. Speak clearly and try again.'}
            </motion.div>
          )}

          {/* Accuracy meter */}
          {heardText && feedback && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Accuracy</span>
                <span>{accuracyPct}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${accuracyPct >= 65 ? 'bg-emerald-400' : 'bg-red-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracyPct}%` }}
                  transition={springGentle}
                />
              </div>
            </div>
          )}

          {/* Correct feedback */}
          {feedback === 'correct' && (
            <motion.div
              className="flex items-center gap-2 text-emerald-700 font-semibold"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springBounce}
            >
              <CheckCircle2 size={20} /> {t('games.perfectWellDone')}
            </motion.div>
          )}

          {/* Wrong feedback */}
          {feedback === 'wrong' && (
            <motion.div
              className="flex flex-col items-center gap-3 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-red-600 font-semibold">{t('games.notQuiteRight')}</div>
              {heardText && (
                <div className="text-sm text-gray-500 text-center">
                  {t('games.youSaid')} &quot;<strong>{heardText}</strong>&quot; &mdash;{' '}
                  {t('games.expected')} &quot;<strong>{currentWord.english}</strong>&quot;
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startListening}
                  className="flex items-center gap-1.5 px-4 py-2.5 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
                >
                  <Mic size={18} />
                  {missCount >= 3 ? t('games.tryOnceMore') || 'Try once more' : t('games.tryAgain')}
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="flex items-center gap-1.5 px-4 py-2.5 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <SkipForward size={18} /> {t('games.skip')}
                </button>
              </div>
              {missCount >= 3 && (
                <div className="text-xs text-gray-400 text-center" aria-live="polite">
                  {t('games.pronunciationTip') || 'Tip: Speak slowly and clearly. You can skip and come back.'}
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
