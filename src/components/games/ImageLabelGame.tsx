import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import { SpeakButton } from '../SpeakButton';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LabelQuestion {
  id: string;
  imageEmoji: string;
  imageAlt: string;
  correctLabel: string;
  correctLabelTr: string;
  options: string[];
  phonetic?: string;
}

export interface ImageLabelGameProps {
  questions: LabelQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

type OptionState = 'idle' | 'correct' | 'wrong';

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

// ── Component ─────────────────────────────────────────────────────────────────

export const ImageLabelGame: React.FC<ImageLabelGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [completed, setCompleted] = useState(false);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        SFX.celebration();
        autoCompleteTimeoutRef.current = setTimeout(() => onComplete(nextScore, questions.length), 4000);
      } else {
        setSlideDir(1);
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setAnswered(false);
          setOptionStates({});
          setShowFeedback(null);
        }, 600);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  const handleOptionPress = useCallback(
    (option: string) => {
      if (answered || !currentQuestion) return;
      setAnswered(true);
      const isCorrect = option === currentQuestion.correctLabel;

      if (isCorrect) {
        setOptionStates({ [option]: 'correct' });
        setShowFeedback('correct');
        SFX.correct();
        advanceQuestion(score + 1);
        setScore((prev) => prev + 1);
      } else {
        setOptionStates({ [option]: 'wrong', [currentQuestion.correctLabel]: 'correct' });
        setShowFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setOptionStates({});
          setShowFeedback(null);
        }, 1200);
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
    setAnswered(false);
    setOptionStates({});
    setCompleted(false);
    setShowFeedback(null);
    setSlideDir(1);
  }, []);

  // ── Completion screen ──────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {pct >= 90 && <ConfettiRain />}
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

          <h2 className="text-2xl font-bold text-gray-800">{t('games.greatJob')}</h2>
          <p className="text-3xl font-black text-gray-700">{score} / {questions.length}</p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBounce, delay: 0.4 + i * 0.15 }}>
                <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <Sparkles size={14} /> +{score * 10} XP
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

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto" role="application" aria-label="Image label game">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{t('games.labelThePicture')}</h2>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-emerald-400 rounded-full" animate={{ width: `${progress}%` }} transition={springGentle} />
      </div>

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" className="min-h-[40px]">
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`text-center py-2 px-4 rounded-xl font-semibold ${showFeedback === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct' ? t('games.amazing') : t('games.tryAgainYouGotThis')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Picture + question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentIndex}`}
          initial={{ x: slideDir * 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideDir * -80, opacity: 0 }}
          transition={springGentle}
        >
          {/* Picture box */}
          <div
            className="flex flex-col items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-6 mb-4"
            role="img"
            aria-label={currentQuestion.imageAlt}
          >
            <WordIllustration word={currentQuestion.correctLabel} size={120} />
            <SpeakButton text={currentQuestion.correctLabel} autoPlay size="md" />
            {currentQuestion.phonetic && (
              <span className="text-sm text-indigo-400 font-mono">/{currentQuestion.phonetic}/</span>
            )}
          </div>

          {/* Translation hint after correct */}
          <div className="min-h-[24px] text-center mb-3" aria-live="polite">
            {showFeedback === 'correct' && (
              <motion.span
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentQuestion.correctLabel} = {currentQuestion.correctLabelTr}
              </motion.span>
            )}
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3" role="group" aria-label={t('games.labelThePicture')}>
            {currentQuestion.options.map((option, idx) => {
              const state: OptionState = optionStates[option] ?? 'idle';
              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleOptionPress(option)}
                  disabled={answered && state === 'idle'}
                  aria-pressed={state !== 'idle'}
                  className={`
                    flex items-center justify-center px-4 py-4 min-h-[56px] rounded-xl font-semibold text-base transition-all
                    ${state === 'correct' ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 shadow-md' : ''}
                    ${state === 'wrong' ? 'bg-red-50 border-2 border-red-300 text-red-600' : ''}
                    ${state === 'idle' ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm' : ''}
                    disabled:opacity-40
                  `}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={
                    state === 'correct'
                      ? { opacity: 1, y: 0, scale: [1, 1.08, 1] }
                      : state === 'wrong'
                        ? { opacity: 1, y: 0, scale: 1, x: [-4, 4, -4, 0] }
                        : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={{ ...springGentle, delay: idx * 0.07 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

ImageLabelGame.displayName = 'ImageLabelGame';
