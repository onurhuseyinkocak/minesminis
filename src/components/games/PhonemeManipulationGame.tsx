import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Star, Trophy, Check, X, ArrowLeft, RotateCcw,
  Trash2, RefreshCw, Plus, ArrowRightLeft,
} from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { speak } from '../../services/ttsService';
import { Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ManipulationType = 'delete' | 'substitute' | 'add' | 'reverse';

export interface PhonemeManipulationQuestion {
  id: string;
  type: ManipulationType;
  prompt: string;
  promptTr: string;
  targetWord: string;
  targetWordPhonemes: string[];
  changeInstruction: string;
  correctAnswer: string;
  options: string[];
  difficulty: 1 | 2 | 3;
  hint?: string;
}

export interface PhonemeManipulationGameProps {
  questions: PhonemeManipulationQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const VOWEL_PHONEMES = new Set([
  'æ', 'ɑ', 'ɒ', 'ə', 'ɛ', 'ɪ', 'ɔ', 'ʌ', 'ʊ', 'uː', 'iː', 'eɪ', 'aɪ',
  'ɔɪ', 'aʊ', 'oʊ', 'a', 'e', 'i', 'o', 'u',
]);

type PhonemeCategory = 'consonant' | 'vowel' | 'blend';

function classifyPhoneme(phoneme: string): PhonemeCategory {
  if (phoneme.length > 1 && !VOWEL_PHONEMES.has(phoneme)) return 'blend';
  if (VOWEL_PHONEMES.has(phoneme)) return 'vowel';
  return 'consonant';
}

const PHONEME_CATEGORY_STYLES: Record<PhonemeCategory, { bg: string; border: string; text: string }> = {
  consonant: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  vowel: { bg: '#FCE7F3', border: '#EC4899', text: '#9D174D' },
  blend: { bg: '#EDE9FE', border: '#8B5CF6', text: '#5B21B6' },
};

const TYPE_CONFIG: Record<ManipulationType, { icon: typeof Trash2; label: string; color: string; bg: string }> = {
  delete: { icon: Trash2, label: 'Delete a Sound', color: '#DC2626', bg: '#FEE2E2' },
  substitute: { icon: RefreshCw, label: 'Swap a Sound', color: '#7C3AED', bg: '#EDE9FE' },
  add: { icon: Plus, label: 'Add a Sound', color: '#059669', bg: '#D1FAE5' },
  reverse: { icon: ArrowRightLeft, label: 'Reverse', color: '#2563EB', bg: '#DBEAFE' },
};

type OptionState = 'idle' | 'correct' | 'wrong';
type Phase = 'showing' | 'animating' | 'result' | 'choices';

// ── Spring configs ───────────────────────────────────────────────────────────

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springSmooth = { type: 'spring' as const, stiffness: 260, damping: 28 };
const springPop = { type: 'spring' as const, stiffness: 300, damping: 20 };

// ── Component ──────────────────────────────────────────────────────────────────

export const PhonemeManipulationGame: React.FC<PhonemeManipulationGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t, lang } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>('showing');
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);

  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const resetForNext = useCallback(() => {
    setPhase('showing');
    setOptionStates({});
    setAnswered(false);
    setShowFeedback(null);
    setDeletedIndex(null);
  }, []);

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
          resetForNext();
        }, 650);
      }
    },
    [currentIndex, questions.length, onComplete, resetForNext],
  );

  const handleStartManipulation = useCallback(() => {
    if (phase !== 'showing') return;
    setPhase('animating');

    if (currentQuestion.type === 'delete') {
      const phonemes = currentQuestion.targetWordPhonemes;
      const answer = currentQuestion.correctAnswer.toLowerCase();
      let remaining = answer;
      let foundIdx = 0;
      for (let i = 0; i < phonemes.length; i++) {
        const p = phonemes[i].toLowerCase();
        const pos = remaining.indexOf(p);
        if (pos === -1) {
          foundIdx = i;
          break;
        } else {
          remaining = remaining.slice(0, pos) + remaining.slice(pos + p.length);
        }
      }
      setDeletedIndex(foundIdx);
    }

    SFX.click();
    try { speak(currentQuestion.targetWord); } catch { /* silent */ }

    setTimeout(() => {
      setPhase('choices');
      setDeletedIndex(null);
    }, 950);
  }, [phase, currentQuestion]);

  const handleOptionPress = useCallback(
    (option: string) => {
      if (answered || !currentQuestion) return;
      setAnswered(true);

      const isCorrect = option === currentQuestion.correctAnswer;

      if (isCorrect) {
        setOptionStates({ [option]: 'correct' });
        setShowFeedback('correct');
        SFX.correct();
        const nextScore = score + 1;
        setScore(nextScore);
        advanceQuestion(nextScore);
      } else {
        setOptionStates({
          [option]: 'wrong',
          [currentQuestion.correctAnswer]: 'correct',
        });
        setShowFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setOptionStates({});
          setShowFeedback(null);
          advanceQuestion(score);
        }, 1300);
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
    setCompleted(false);
    resetForNext();
  }, [resetForNext]);

  // ── Completion screen ──────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] p-6 bg-gradient-to-b from-purple-50 to-white rounded-3xl relative overflow-hidden">
        {pct >= 90 && <ConfettiRain />}

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={springBounce}
        >
          <UnifiedMascot state="celebrating" size={120} />

          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100">
            {pct >= 90 ? (
              <Trophy size={40} className="text-amber-500" />
            ) : pct >= 60 ? (
              <Star size={40} className="text-amber-500 fill-amber-500" />
            ) : (
              <Check size={40} className="text-emerald-500" />
            )}
          </span>

          <h2 className="text-2xl font-bold text-gray-800">{t('games.greatJob')}</h2>

          <p className="text-4xl font-extrabold text-purple-600">
            {score} / {questions.length}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springBounce, delay: 0.3 + i * 0.15 }}
              >
                <Star
                  size={32}
                  fill={i < stars ? '#F59E0B' : 'none'}
                  color={i < stars ? '#F59E0B' : '#D1D5DB'}
                />
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springPop, delay: 0.75 }}
          >
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 10} XP
            </Badge>
          </motion.div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                onComplete(score, questions.length);
              }}
              className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl bg-gray-100 text-gray-700 font-semibold text-base hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={18} />
              {t('games.backToGames')}
            </button>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl bg-purple-500 text-white font-semibold text-base hover:bg-purple-600 transition-colors"
            >
              <RotateCcw size={18} />
              {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const prompt = lang === 'tr' ? currentQuestion.promptTr : currentQuestion.prompt;
  const typeConfig = TYPE_CONFIG[currentQuestion.type];
  const TypeIcon = typeConfig.icon;

  // Difficulty bar segments
  const difficultyLabel = currentQuestion.difficulty === 1
    ? (t('games.easy') || 'Easy')
    : currentQuestion.difficulty === 2
      ? (t('games.medium') || 'Medium')
      : (t('games.hard') || 'Hard');

  const difficultyColors = ['bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-red-100 text-red-700'];

  return (
    <div
      className="flex flex-col gap-5 p-5 bg-gradient-to-b from-violet-50 to-white rounded-3xl min-h-[480px]"
      role="application"
      aria-label="Phoneme manipulation game"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          {t('games.soundPlay') || 'Sound Play'}
        </h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Difficulty indicator */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`h-2 w-8 rounded-full ${
                level <= currentQuestion.difficulty ? 'bg-purple-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${difficultyColors[currentQuestion.difficulty - 1]}`}>
          {difficultyLabel}
        </span>
      </div>

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" className="min-h-[40px]">
        <AnimatePresence>
          {showFeedback === 'correct' && (
            <motion.div
              key="correct"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 font-semibold justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={springSmooth}
            >
              <Check size={20} /> {t('games.amazing')}
            </motion.div>
          )}
          {showFeedback === 'wrong' && (
            <motion.div
              key="wrong"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-100 text-red-700 font-semibold justify-center"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <X size={20} /> {`${t('games.correctAnswerWas') || 'The answer was'}: "${currentQuestion.correctAnswer}"`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          className="flex flex-col items-center gap-4"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={springSmooth}
        >
          {/* Type badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm"
            style={{ backgroundColor: typeConfig.bg, color: typeConfig.color }}
          >
            <TypeIcon size={16} />
            {currentQuestion.type === 'delete'
              ? (t('games.deleteASound') || typeConfig.label)
              : currentQuestion.type === 'substitute'
                ? (t('games.swapASound') || typeConfig.label)
                : currentQuestion.type === 'add'
                  ? (t('games.addASound') || typeConfig.label)
                  : (t('games.reverse') || typeConfig.label)}
          </div>

          {/* Target word card */}
          <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm w-full max-w-xs">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {t('games.theWord') || 'The word'}
            </span>
            <motion.span
              key={`word-${currentIndex}`}
              className="text-3xl font-extrabold text-gray-800"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springPop}
            >
              {currentQuestion.targetWord}
            </motion.span>
          </div>

          {/* Instruction card */}
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl w-full max-w-sm text-center" aria-live="polite">
            <p className="text-base font-semibold text-amber-800">{prompt}</p>
            {lang !== 'tr' && currentQuestion.promptTr && (
              <p className="text-sm text-amber-600 mt-1">{currentQuestion.promptTr}</p>
            )}
          </div>

          {/* Phoneme tiles */}
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {t('games.soundsInTheWord') || 'Sounds in the word'}
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap" role="group" aria-label="Phoneme tiles">
              <AnimatePresence>
                {currentQuestion.targetWordPhonemes.map((phoneme, index) => {
                  const category = classifyPhoneme(phoneme);
                  const style = PHONEME_CATEGORY_STYLES[category];
                  const isBeingDeleted =
                    phase === 'animating' &&
                    currentQuestion.type === 'delete' &&
                    deletedIndex === index;
                  const isSubstituting =
                    phase === 'animating' &&
                    currentQuestion.type === 'substitute' &&
                    index === 0;

                  return (
                    <motion.div
                      key={`${currentQuestion.id}-tile-${index}`}
                      className="flex flex-col items-center justify-center min-w-[56px] min-h-[64px] px-3 py-2 rounded-xl border-2"
                      style={{
                        backgroundColor: isBeingDeleted ? '#FEE2E2' : style.bg,
                        borderColor: isBeingDeleted ? '#EF4444' : style.border,
                        color: isBeingDeleted ? '#DC2626' : style.text,
                      }}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        isBeingDeleted
                          ? { scale: 0, opacity: 0, y: -30, rotate: -15 }
                          : isSubstituting
                            ? { scale: [1, 1.2, 1], opacity: 1 }
                            : { scale: 1, opacity: 1 }
                      }
                      exit={{ scale: 0, opacity: 0 }}
                      transition={
                        isBeingDeleted
                          ? { duration: 0.45, ease: 'easeIn' }
                          : { ...springSmooth, delay: index * 0.06 }
                      }
                      aria-label={`Sound: /${phoneme}/`}
                    >
                      <span className="text-lg font-bold leading-none">{phoneme}</span>
                      <span className="text-[10px] opacity-60 mt-0.5">/{phoneme}/</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Change instruction pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mt-1">
              <span className="text-xs font-medium text-gray-500">
                {t('games.change') || 'Change:'}
              </span>
              <span className="text-xs font-bold text-gray-700">
                {currentQuestion.changeInstruction}
              </span>
            </div>
          </div>

          {/* Action button */}
          {phase === 'showing' && (
            <motion.button
              type="button"
              onClick={handleStartManipulation}
              className="flex items-center gap-2 px-8 py-3 min-h-[48px] rounded-2xl bg-purple-500 text-white font-bold text-lg shadow-lg shadow-purple-200 hover:bg-purple-600 transition-colors"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              aria-label="See what happens to the word"
            >
              {t('games.seeWhatHappens') || 'See What Happens!'}
            </motion.button>
          )}

          {/* Animating text */}
          {phase === 'animating' && (
            <motion.p
              className="text-center font-bold text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 0.8 }}
            >
              {t('games.watchSoundsChange') || 'Watch the sounds change...'}
            </motion.p>
          )}

          {/* Multiple choice options */}
          {phase === 'choices' && (
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              <p className="text-base font-semibold text-gray-600">
                {t('games.whichWordDoYouGet') || 'Which word do you get?'}
              </p>
              <div className="grid grid-cols-2 gap-3 w-full" role="group" aria-label="Choose the new word">
                {currentQuestion.options.map((option, idx) => {
                  const state: OptionState = optionStates[option] ?? 'idle';
                  const isCorrect = state === 'correct';
                  const isWrong = state === 'wrong';

                  return (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => handleOptionPress(option)}
                      disabled={answered && state === 'idle'}
                      aria-pressed={state !== 'idle'}
                      className={`flex items-center justify-center gap-2 px-4 py-4 min-h-[56px] rounded-2xl border-2 font-bold text-lg transition-colors ${
                        isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                          : isWrong
                            ? 'bg-red-100 border-red-400 text-red-700'
                            : 'bg-white border-gray-200 text-gray-800 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={
                        isCorrect
                          ? { opacity: 1, y: 0, scale: [1, 1.1, 1] }
                          : isWrong
                            ? { opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -4, 4, 0] }
                            : { opacity: 1, y: 0, scale: 1 }
                      }
                      transition={
                        isCorrect || isWrong
                          ? { duration: 0.5 }
                          : { ...springPop, delay: idx * 0.08 }
                      }
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCorrect && <Check size={20} />}
                      {isWrong && <X size={20} />}
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Hint */}
              {currentQuestion.hint && !answered && (
                <motion.p
                  className="text-sm text-gray-400 italic text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {t('games.hint') || 'Hint:'} {currentQuestion.hint}
                </motion.p>
              )}
            </div>
          )}

          {/* Mascot */}
          <div className="flex justify-end w-full mt-1">
            <UnifiedMascot
              state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
              size={48}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

PhonemeManipulationGame.displayName = 'PhonemeManipulationGame';
