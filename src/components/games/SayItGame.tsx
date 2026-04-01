import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw, AlertCircle, Mic, SkipForward } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { SpeakButton } from '../SpeakButton';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';

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

function similarityScore(heard: string, target: string): number {
  if (!heard || !target) return 0;
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const h = normalize(heard);
  const t = normalize(target);
  if (h === t) return 1;
  const heardWords = h.split(/\s+/);
  if (heardWords.includes(t)) return 1;
  let bestWordScore = 0;
  for (const word of heardWords) {
    const dist = levenshtein(word, t);
    const wordLen = Math.max(word.length, t.length);
    const s = wordLen === 0 ? 1 : 1 - dist / wordLen;
    if (s > bestWordScore) bestWordScore = s;
  }
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

type MicState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

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
  const scoreRef = useRef(0);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
        recognitionRef.current = null;
      }
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const SRConstructor = getSpeechRecognitionConstructor();
  const isSpeechSupported = SRConstructor !== null;
  const currentQuestion = questions[currentIndex];

  // Auto-speak word when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    const id = setTimeout(() => {
      speak(currentQuestion.word, { lang: 'en-US', rate: 0.8, pitch: 1.1 });
    }, 400);
    return () => clearTimeout(id);
  }, [currentIndex, currentQuestion]);

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

  const handleSpeechResult = useCallback(
    (spoken: string, alternatives?: string[]) => {
      if (!currentQuestion) return;
      const target = currentQuestion.word.trim().toLowerCase();
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
        if (newMisses >= 2) loseHeart();
      }
    },
    [currentQuestion, missCount, advanceQuestion, onWrongAnswer, loseHeart],
  );

  const startListening = useCallback(() => {
    if (!SRConstructor || micState === 'listening') return;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }
    const recognition = new SRConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
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
        for (let i = 1; i < result.length; i++) alternatives.push(result[i].transcript);
        handleSpeechResult(result[0].transcript, alternatives);
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errType = classifyError(event.error);
      setSpeechError(errType);
      if (errType === 'no-speech') {
        setMicState('idle');
        setFeedbackType(null);
        setHeardText('');
      } else {
        setMicState('error');
        setFeedbackType(null);
        setHeardText('');
      }
    };
    recognition.onend = () => setMicState((prev) => (prev === 'listening' ? 'idle' : prev));
    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, micState, handleSpeechResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setMicState('idle');
  }, []);

  const handleSkip = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }
    onWrongAnswer?.();
    advanceQuestion(scoreRef.current);
  }, [advanceQuestion, onWrongAnswer]);

  const handleMarkDone = useCallback(() => {
    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);
    advanceQuestion(nextScore);
  }, [advanceQuestion]);

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
      <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
        <UnifiedMascot state="thinking" size={100} />
        <h2 className="text-xl font-bold text-gray-700">{t('games.speechUnavailable') || 'Speech recognition not supported'}</h2>
        <p className="text-gray-500">
          {t('games.speechUnavailableMsg') || 'This exercise requires speech recognition. Try Chrome or tap to continue.'}
        </p>
        {currentQuestion && (
          <div className="mb-4">
            <span className="text-3xl font-black text-gray-800 block">{currentQuestion.word}</span>
            <span className="text-sm text-gray-400 block mt-1">{currentQuestion.wordTr}</span>
          </div>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={handleMarkDone} className="px-5 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
            {t('games.markAsDone') || 'Mark as done'}
          </button>
          <button type="button" onClick={handleSkip} className="px-5 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors">
            {t('games.skip')}
          </button>
        </div>
      </div>
    );
  }

  // ── Completion screen ────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={springBounce}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-5"
        >
          <UnifiedMascot state="celebrating" size={120} />

          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springBounce, delay: 0.2 }}>
            {pct >= 90 ? <Trophy size={48} className="text-indigo-500" /> : pct >= 60 ? <Star size={48} className="text-indigo-500 fill-indigo-500" /> : <Check size={48} className="text-emerald-500" />}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">
            {pct >= 80 ? t('games.amazingPronunciation') : pct >= 50 ? t('games.goodEffort') : t('games.keepPracticing')}
          </h2>
          <p className="text-3xl font-black text-gray-700">{score} / {questions.length}</p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBounce, delay: 0.4 + i * 0.15 }}>
                <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <Sparkles size={14} /> +{score * 15} XP
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button type="button" onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, questions.length); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
              <ArrowRight size={16} /> {t('games.backToGames')}
            </button>
            <button type="button" onClick={handlePlayAgain} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
              <RotateCcw size={16} /> {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const showPermissionError = speechError === 'not-allowed';
  const showNetworkError = speechError === 'network';
  const showNoSpeechHint = speechError === 'no-speech' && !feedbackType;

  const micLabel =
    micState === 'listening' ? t('games.listening') || 'Listening...'
    : micState === 'processing' ? t('games.processing') || 'Processing...'
    : micState === 'success' ? t('games.great') || 'Great!'
    : micState === 'error' ? t('games.tryAgain') || 'Try again'
    : t('games.speak') || 'Say it';

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto" role="application" aria-label="Say It pronunciation practice game">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{t('games.sayIt') || 'Say It!'}</h2>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-emerald-400 rounded-full" animate={{ width: `${progress}%` }} transition={springGentle} />
      </div>

      <p className="text-sm text-gray-400 text-center">{t('games.score')}: {score}/{questions.length}</p>

      {/* Permission error banner */}
      {showPermissionError && (
        <motion.div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="alert" aria-live="assertive">
          <AlertCircle size={18} className="shrink-0" />
          <span className="flex-1">{t('games.micPermissionDenied') || 'Microphone access denied.'}</span>
          <button type="button" onClick={handleSkip} className="px-3 py-1 min-h-[36px] rounded-lg bg-red-100 text-red-700 font-medium text-sm">{t('games.skip')}</button>
        </motion.div>
      )}

      {/* Network error banner */}
      {showNetworkError && (
        <motion.div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="alert" aria-live="assertive">
          <AlertCircle size={18} className="shrink-0" />
          <span>{t('games.networkError') || 'Network error. Check your connection and try again.'}</span>
        </motion.div>
      )}

      {/* Word card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentIndex}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={springGentle}
          className={`
            flex flex-col items-center gap-4 p-6 rounded-2xl border-2 bg-white
            ${feedbackType === 'correct' ? 'border-emerald-400 bg-emerald-50' : feedbackType === 'wrong' ? 'border-red-300 bg-red-50' : 'border-gray-100'}
          `}
        >
          <WordIllustration word={currentQuestion.word} size={110} />

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-800 break-all">{currentQuestion.word}</span>
            <SpeakButton text={currentQuestion.word} size="md" />
          </div>
          <div className="text-sm text-gray-400">{currentQuestion.wordTr}</div>

          {currentQuestion.phonetic && (
            <div className="text-sm text-indigo-400 font-mono">/{currentQuestion.phonetic}/</div>
          )}

          {currentQuestion.hint && (
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5">{currentQuestion.hint}</div>
          )}

          {/* No-speech soft hint */}
          {showNoSpeechHint && (
            <motion.div className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-2 w-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-live="polite">
              {t('games.noSpeechDetected') || 'No speech detected. Speak clearly and try again.'}
            </motion.div>
          )}

          {/* Mic button */}
          {!showPermissionError && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <button
                type="button"
                onClick={micState === 'listening' ? stopListening : startListening}
                disabled={micState === 'processing' || feedbackType === 'correct'}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg
                  ${micState === 'listening'
                    ? 'bg-red-500 text-white animate-pulse scale-110'
                    : micState === 'success'
                      ? 'bg-emerald-500 text-white'
                      : micState === 'error'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }
                  disabled:opacity-40
                `}
                aria-label={micState === 'listening' ? t('games.stopRecording') || 'Stop recording' : t('games.startSpeaking') || 'Start speaking'}
              >
                <Mic size={34} />
              </button>
              <span className="text-sm font-medium text-gray-500" aria-live="polite">{micLabel}</span>
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {feedbackType && (
              <motion.div
                key={feedbackType}
                className={`w-full text-center rounded-xl px-4 py-3 ${feedbackType === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-live="assertive"
              >
                <div className="font-semibold">
                  {feedbackType === 'correct' ? t('games.perfectWellDone') : t('games.notQuiteRight')}
                </div>

                {feedbackType === 'wrong' && heardText && (
                  <div className="text-sm mt-1 text-gray-500">
                    {t('games.youSaid')} &ldquo;<strong>{heardText}</strong>&rdquo; &mdash;{' '}
                    {t('games.expected')} &ldquo;<strong>{currentQuestion.word}</strong>&rdquo;
                  </div>
                )}

                {feedbackType === 'wrong' && (
                  <div className="flex gap-2 justify-center mt-3">
                    <button type="button" onClick={startListening} className="flex items-center gap-1.5 px-4 py-2.5 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
                      <Mic size={16} />
                      {missCount >= 3 ? t('games.tryOnceMore') || 'Try once more' : t('games.tryAgain')}
                    </button>
                    <button type="button" onClick={handleSkip} className="flex items-center gap-1.5 px-4 py-2.5 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors">
                      <SkipForward size={16} /> {t('games.skip')}
                    </button>
                  </div>
                )}

                {feedbackType === 'wrong' && missCount >= 3 && (
                  <div className="text-xs text-gray-400 mt-2" aria-live="polite">
                    {t('games.pronunciationTip') || 'Tip: Speak slowly and clearly. You can skip and come back.'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Always-visible skip */}
      {!feedbackType && (
        <div className="flex justify-center">
          <button type="button" onClick={handleSkip} className="flex items-center gap-1.5 px-4 py-2 min-h-[48px] text-gray-400 font-medium hover:text-gray-600 transition-colors">
            <SkipForward size={16} /> {t('games.skip')}
          </button>
        </div>
      )}
    </div>
  );
};

SayItGame.displayName = 'SayItGame';
