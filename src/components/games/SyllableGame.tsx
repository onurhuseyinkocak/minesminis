import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, X, Star, Trophy, Sparkles, ArrowLeft, RotateCcw, Hand } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { speak } from '../../services/ttsService';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SyllableQuestion {
  id: string;
  word: string;
  wordTr: string;
  syllables: string[];
  syllableCount: number;
  imageWord?: string;
}

export interface SyllableGameProps {
  questions: SyllableQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Phase type ──────────────────────────────────────────────────────────────

type Phase = 'tapping' | 'choices' | 'result-correct' | 'result-wrong';

// ── Choice option state ────────────────────────────────────────────────────

type ChoiceState = 'idle' | 'correct' | 'wrong';

// ── Build multiple-choice options 1-4 ─────────────────────────────────────

function buildChoices(_correct: number): number[] {
  return [1, 2, 3, 4];
}

// ── Spring configs ──────────────────────────────────────────────────────────

const springBouncy = { type: 'spring' as const, stiffness: 300, damping: 18 };
const springGentle = { type: 'spring' as const, stiffness: 260, damping: 24 };

// ── Component ──────────────────────────────────────────────────────────────

export const SyllableGame: React.FC<SyllableGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>('tapping');
  const [tapCount, setTapCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [choiceStates, setChoiceStates] = useState<Record<number, ChoiceState>>({});
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [ripples, setRipples] = useState<number[]>([]);
  const rippleIdRef = useRef(0);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];
  const choices = buildChoices(currentQuestion?.syllableCount ?? 1);

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        SFX.celebration();
        autoCompleteTimeoutRef.current = setTimeout(() => onComplete(nextScore, questions.length), 4000);
      } else {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setPhase('tapping');
          setTapCount(0);
          setChoiceStates({});
          setAnswered(false);
          setShowFeedback(null);
        }, 900);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  const handleDrumTap = useCallback(() => {
    if (phase !== 'tapping') return;
    SFX.click();
    setTapCount((prev) => prev + 1);
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 280);

    // Add ripple effect
    const id = rippleIdRef.current++;
    setRipples((prev) => [...prev, id]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== id));
    }, 600);
  }, [phase]);

  const handleDone = useCallback(() => {
    if (phase !== 'tapping' || tapCount === 0) return;
    setPhase('choices');
  }, [phase, tapCount]);

  const handleReset = useCallback(() => {
    setTapCount(0);
    setPhase('tapping');
  }, []);

  const handleChoice = useCallback(
    (choice: number) => {
      if (answered || !currentQuestion) return;
      setAnswered(true);

      const isCorrect = choice === currentQuestion.syllableCount;
      if (isCorrect) {
        setChoiceStates({ [choice]: 'correct' });
        setShowFeedback('correct');
        setPhase('result-correct');
        SFX.correct();
        advanceQuestion(score + 1);
        setScore((prev) => prev + 1);
      } else {
        setChoiceStates({ [choice]: 'wrong', [currentQuestion.syllableCount]: 'correct' });
        setShowFeedback('wrong');
        setPhase('result-wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setChoiceStates({});
          setShowFeedback(null);
          advanceQuestion(score);
        }, 1400);
      }
    },
    [answered, currentQuestion, score, advanceQuestion, loseHeart, onWrongAnswer],
  );

  const handlePlayAgain = useCallback(() => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setScore(0);
    setPhase('tapping');
    setTapCount(0);
    setIsPulsing(false);
    setChoiceStates({});
    setAnswered(false);
    setCompleted(false);
    setShowFeedback(null);
  }, []);

  // ── Completion screen ─────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="flex flex-col items-center justify-center gap-6 p-6 w-full max-w-lg mx-auto relative">
        <ConfettiRain duration={3500} />

        <motion.div
          className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-white border-2 border-slate-100 shadow-xl w-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <UnifiedMascot state="celebrating" size={120} />

          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          >
            {pct >= 90 ? (
              <Trophy size={48} className="text-amber-500" />
            ) : pct >= 60 ? (
              <Star size={48} fill="#f59e0b" className="text-amber-500" />
            ) : (
              <Check size={48} className="text-emerald-500" />
            )}
          </motion.span>

          <h2 className="text-2xl font-extrabold text-slate-800">{t('games.greatJob')}</h2>
          <p className="text-4xl font-black text-purple-600">
            {score} / {questions.length}
          </p>

          {/* Stars */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 + i * 0.15 }}
              >
                <Star
                  size={36}
                  fill={i < stars ? '#f59e0b' : 'none'}
                  className={i < stars ? 'text-amber-500' : 'text-slate-300'}
                />
              </motion.span>
            ))}
          </div>

          {/* XP Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, delay: 0.75 }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 rounded-full"
          >
            <Sparkles size={16} className="text-emerald-600" />
            <span className="font-bold text-emerald-700 text-sm">+{score * 10} XP</span>
          </motion.div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                onComplete(score, questions.length);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200
                text-slate-700 font-bold text-sm transition-colors min-h-[48px]"
            >
              <ArrowLeft size={16} />
              {t('games.backToGames')}
            </button>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl
                bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
                text-white font-bold text-sm shadow-lg shadow-purple-200 transition-all min-h-[48px]"
            >
              <RotateCcw size={16} />
              {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const showChoices = phase === 'choices' || phase === 'result-correct' || phase === 'result-wrong';
  const showSyllables = phase === 'result-correct';

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-xl mx-auto" role="application" aria-label="Syllable segmentation game">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-extrabold text-slate-800">{t('games.syllableGame')}</h2>
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={springGentle}
        />
      </div>

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" className="min-h-[40px] w-full">
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                ${showFeedback === 'correct'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
                }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct' ? (
                <><Check size={16} /> {t('games.amazing')}</>
              ) : (
                <>
                  <X size={16} />
                  {`${t('games.xSyllables').replace('{count}', String(currentQuestion.syllableCount)).replace('{unit}', currentQuestion.syllableCount === 1 ? t('games.syllable') : t('games.syllablesPlural'))} ${t('games.tryAgainYouGotThis')}`}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          className="w-full flex flex-col items-center gap-5"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={springGentle}
        >
          {/* Word display card */}
          <motion.div
            className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gradient-to-b from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springBouncy}
          >
            <WordIllustration word={currentQuestion.imageWord ?? currentQuestion.word} size={96} />
            <p className="text-3xl font-extrabold text-purple-800">{currentQuestion.word}</p>
            <p className="text-sm font-medium text-purple-500">{currentQuestion.wordTr}</p>
            <button
              type="button"
              onClick={() => speak(currentQuestion.word, { lang: 'en-US', rate: 0.85 })}
              className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
              aria-label={`Listen to ${currentQuestion.word}`}
            >
              <Volume2 size={20} className="text-purple-600" />
            </button>
          </motion.div>

          {/* Instruction */}
          <p className="text-base font-bold text-slate-600 text-center" aria-live="polite">
            {phase === 'tapping' && t('games.tapDrumPerSyllable')}
            {phase === 'choices' && t('games.howManySyllables')}
            {phase === 'result-correct' && t('games.hereAreTheSyllables')}
            {phase === 'result-wrong' && t('games.keepTrying')}
          </p>

          {/* Tapping area */}
          {phase === 'tapping' && (
            <div className="flex flex-col items-center gap-4">
              {/* Tap count dots */}
              <div className="flex gap-2 min-h-[24px]" aria-label={`${tapCount} taps`} aria-live="polite">
                {Array.from({ length: tapCount }, (_, i) => (
                  <motion.div
                    key={i}
                    className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springBouncy}
                  />
                ))}
              </div>

              {/* Big tap target with ripple effect */}
              <div className="relative">
                <motion.button
                  type="button"
                  className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center gap-1
                    bg-gradient-to-b from-orange-300 to-orange-500 shadow-xl shadow-orange-200
                    border-4 border-orange-200 overflow-hidden
                    ${isPulsing ? 'scale-95' : ''} transition-transform`}
                  onClick={handleDrumTap}
                  aria-label={`Tap drum (${tapCount} taps so far)`}
                  whileTap={{ scale: 0.88 }}
                >
                  <Hand size={36} className="text-white" />
                  <span className="text-white font-bold text-lg">{tapCount}</span>

                  {/* Ripple effects */}
                  <AnimatePresence>
                    {ripples.map((id) => (
                      <motion.div
                        key={id}
                        className="absolute inset-0 rounded-full border-4 border-white"
                        initial={{ scale: 0.3, opacity: 0.7 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ pointerEvents: 'none' }}
                      />
                    ))}
                  </AnimatePresence>
                </motion.button>
              </div>

              <p className="text-sm text-slate-500 font-medium text-center">
                {t('games.tapHereOneTapPerSyllable')}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap justify-center">
                {tapCount > 0 && (
                  <motion.button
                    type="button"
                    onClick={handleReset}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springBouncy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200
                      text-slate-600 font-bold text-sm transition-colors min-h-[44px]"
                    aria-label="Reset taps"
                  >
                    <RotateCcw size={14} />
                    {t('games.reset')}
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={handleDone}
                  disabled={tapCount === 0}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
                    text-white font-bold text-sm shadow-lg shadow-purple-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all min-h-[44px]"
                  aria-label="Done tapping"
                >
                  <Check size={16} />
                  {t('games.doneExcl')}
                </motion.button>
              </div>
            </div>
          )}

          {/* Multiple choice */}
          {showChoices && (
            <div className="flex gap-3 flex-wrap justify-center" role="group" aria-label="Choose syllable count">
              {choices.map((num, idx) => {
                const state: ChoiceState = choiceStates[num] ?? 'idle';
                const bgClass =
                  state === 'correct'
                    ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300 text-emerald-800'
                    : state === 'wrong'
                      ? 'bg-red-100 border-red-400 ring-2 ring-red-300 text-red-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50';

                return (
                  <motion.button
                    key={num}
                    type="button"
                    className={`flex flex-col items-center gap-1 w-[64px] h-[72px] sm:w-[72px] sm:h-[80px] rounded-2xl border-2 shadow-sm
                      font-extrabold text-xl sm:text-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${bgClass}`}
                    onClick={() => handleChoice(num)}
                    disabled={answered && state === 'idle'}
                    aria-pressed={state !== 'idle'}
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...springBouncy, delay: idx * 0.07 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <span>{num}</span>
                    <span className="text-xs font-semibold opacity-70">
                      {num === 1 ? t('games.syllable') : t('games.syllablesPlural')}
                    </span>
                    {state === 'correct' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springBouncy}>
                        <Check size={16} className="text-emerald-600" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Syllable tiles after correct answer */}
          {showSyllables && (
            <motion.div
              className="flex gap-2 flex-wrap justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {currentQuestion.syllables.map((syl, i) => (
                <motion.span
                  key={`${syl}-${i}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-b from-purple-100 to-purple-200
                    text-purple-800 font-extrabold text-xl border-2 border-purple-300 shadow-sm"
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.12, ...springBouncy }}
                >
                  {syl}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Mascot */}
          <UnifiedMascot
            state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
            size={56}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

SyllableGame.displayName = 'SyllableGame';
