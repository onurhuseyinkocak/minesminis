import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, X, Star, Trophy, Sparkles, ArrowLeft, RotateCcw } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { speak } from '../../services/ttsService';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import { getQuestionsCountForAge } from '../../services/ageGroupService';

// ── Types ──────────────────────────────────────────────────────────────────

export type RhymeTaskType = 'detect' | 'produce' | 'sort';

export interface RhymeQuestion {
  id: string;
  type: RhymeTaskType;

  // For 'detect': does this word rhyme with the target?
  targetWord?: string;
  candidateWord?: string;
  doesRhyme?: boolean;

  // For 'produce': pick which word rhymes with target
  targetWord2?: string;
  options?: string[];
  correctOption?: string;

  // For 'sort': sort words into rhyming families
  words?: string[];
  families?: string[][];

  difficulty: 1 | 2 | 3;
  hint?: string;
  hintTr?: string;
}

export interface RhymeGameProps {
  questions: RhymeQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
  ageGroup?: string;
}

// ── Internal types ──────────────────────────────────────────────────────────

type OptionState = 'idle' | 'correct' | 'wrong';
type BucketState = 'idle' | 'active' | 'correct' | 'wrong';

// ── Spring configs ──────────────────────────────────────────────────────────

const springBouncy = { type: 'spring' as const, stiffness: 300, damping: 18 };
const springGentle = { type: 'spring' as const, stiffness: 260, damping: 24 };
const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.5 },
};

// ── Helpers: derive rime (last vowel+consonants) ────────────────────────────

function extractRime(word: string): string {
  const match = word.match(/[aeiou].*/i);
  return match ? match[0].toLowerCase() : word.toLowerCase();
}

function deriveFamilyRime(family: string[]): string {
  if (family.length === 0) return '';
  const rimes = family.map(extractRime);
  const first = rimes[0];
  let rime = '';
  for (let i = 1; i <= first.length; i++) {
    const suffix = first.slice(first.length - i);
    if (rimes.every((r) => r.endsWith(suffix))) {
      rime = suffix;
    }
  }
  return rime || first;
}

// ── Detect Task ─────────────────────────────────────────────────────────────

interface DetectTaskProps {
  question: RhymeQuestion;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function DetectTask({ question, onAnswer, answered }: DetectTaskProps) {
  const { t } = useLanguage();
  const [cardState, setCardState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleAnswer = useCallback(
    (userSaysYes: boolean) => {
      if (answered) return;
      const correct = userSaysYes === question.doesRhyme;
      setCardState(correct ? 'correct' : 'wrong');
      onAnswer(correct);
    },
    [answered, question.doesRhyme, onAnswer],
  );

  const word1 = question.targetWord ?? '';
  const word2 = question.candidateWord ?? '';

  const borderColor =
    cardState === 'correct'
      ? 'border-emerald-400 bg-emerald-50'
      : cardState === 'wrong'
        ? 'border-red-400 bg-red-50'
        : 'border-slate-200 bg-white';

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-lg font-bold text-slate-700 text-center">
        {t('games.doTheseRhyme') || 'Do these words rhyme?'}
      </p>

      {/* Word pair cards */}
      <div className="flex items-center gap-3 sm:gap-4 justify-center flex-wrap">
        <motion.div
          className={`flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border-2 shadow-md min-w-[110px] ${borderColor}`}
          initial={{ x: -40, opacity: 0 }}
          animate={cardState === 'wrong' ? shakeAnimation : { x: 0, opacity: 1 }}
          transition={springGentle}
        >
          <WordIllustration word={word1} size={80} />
          <span className="text-2xl font-extrabold text-slate-800">{word1}</span>
          <button
            type="button"
            onClick={() => speak(word1, { lang: 'en-US', rate: 0.85 })}
            className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
            aria-label={`Listen to ${word1}`}
          >
            <Volume2 size={20} className="text-blue-600" />
          </button>
        </motion.div>

        <span className="text-3xl font-black text-slate-300">&amp;</span>

        <motion.div
          className={`flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border-2 shadow-md min-w-[110px] ${borderColor}`}
          initial={{ x: 40, opacity: 0 }}
          animate={cardState === 'wrong' ? shakeAnimation : { x: 0, opacity: 1 }}
          transition={{ ...springGentle, delay: 0.1 }}
        >
          <WordIllustration word={word2} size={80} />
          <span className="text-2xl font-extrabold text-slate-800">{word2}</span>
          <button
            type="button"
            onClick={() => speak(word2, { lang: 'en-US', rate: 0.85 })}
            className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
            aria-label={`Listen to ${word2}`}
          >
            <Volume2 size={20} className="text-blue-600" />
          </button>
        </motion.div>
      </div>

      {/* Correct indicator */}
      <AnimatePresence>
        {cardState === 'correct' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={springBouncy}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full"
          >
            <Check size={20} className="text-emerald-600" />
            <span className="font-bold text-emerald-700">{t('games.amazing')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yes / No buttons */}
      <div className="flex gap-3 sm:gap-4 w-full max-w-xs mx-auto">
        <motion.button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={answered}
          whileTap={{ scale: 0.92 }}
          className="flex-1 min-h-[56px] px-6 sm:px-8 py-4 rounded-2xl text-lg font-bold text-white
            bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200
            hover:from-emerald-500 hover:to-emerald-700
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 transition-all"
          aria-label="Yes, they rhyme"
        >
          <Check size={22} />
          {t('games.yes') || 'Yes!'}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={answered}
          whileTap={{ scale: 0.92 }}
          className="flex-1 min-h-[56px] px-6 sm:px-8 py-4 rounded-2xl text-lg font-bold text-white
            bg-gradient-to-b from-red-400 to-red-600 shadow-lg shadow-red-200
            hover:from-red-500 hover:to-red-700
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 transition-all"
          aria-label="No, they do not rhyme"
        >
          <X size={22} />
          {t('games.no') || 'No'}
        </motion.button>
      </div>
    </div>
  );
}

// ── Produce Task ─────────────────────────────────────────────────────────────

interface ProduceTaskProps {
  question: RhymeQuestion;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function ProduceTask({ question, onAnswer, answered }: ProduceTaskProps) {
  const { t } = useLanguage();
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});

  const targetWord = question.targetWord2 ?? '';
  const options = question.options ?? [];
  const correctOption = question.correctOption ?? '';

  const handleOption = useCallback(
    (option: string) => {
      if (answered) return;
      const correct = option === correctOption;
      if (correct) {
        setOptionStates({ [option]: 'correct' });
      } else {
        setOptionStates({ [option]: 'wrong', [correctOption]: 'correct' });
      }
      onAnswer(correct);
    },
    [answered, correctOption, onAnswer],
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-lg font-bold text-slate-700 text-center">
        {t('games.whichRhymesWith') || 'Which word rhymes with...'}
      </p>

      {/* Target word card */}
      <motion.div
        className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gradient-to-b from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springGentle}
      >
        <WordIllustration word={targetWord} size={80} />
        <span className="text-3xl font-extrabold text-indigo-700">{targetWord}</span>
        <button
          type="button"
          onClick={() => speak(targetWord, { lang: 'en-US', rate: 0.85 })}
          className="w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center transition-colors"
          aria-label={`Listen to ${targetWord}`}
        >
          <Volume2 size={20} className="text-indigo-600" />
        </button>
      </motion.div>

      {/* Option cards */}
      <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Rhyme options">
        {options.map((option, idx) => {
          const state: OptionState = optionStates[option] ?? 'idle';
          const bgClass =
            state === 'correct'
              ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300'
              : state === 'wrong'
                ? 'bg-red-100 border-red-400 ring-2 ring-red-300'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50';

          return (
            <motion.button
              key={option}
              type="button"
              className={`flex flex-col items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 shadow-sm
                min-w-[80px] sm:min-w-[100px] min-h-[80px] sm:min-h-[100px] font-bold text-base sm:text-lg text-slate-700
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${bgClass}`}
              onClick={() => handleOption(option)}
              disabled={answered && state === 'idle'}
              aria-pressed={state !== 'idle'}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={state === 'wrong' ? shakeAnimation : { opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, ...springGentle }}
            >
              <WordIllustration word={option} size={52} />
              <span>{option}</span>
              {state === 'correct' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springBouncy}
                >
                  <Check size={20} className="text-emerald-600" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Sort Task ────────────────────────────────────────────────────────────────

interface SortTaskProps {
  question: RhymeQuestion;
  onAnswer: (correct: boolean) => void;
  onSortComplete: () => void;
}

function SortTask({ question, onAnswer, onSortComplete }: SortTaskProps) {
  const { t } = useLanguage();
  const allWords = question.words ?? [];
  const families = question.families ?? [];

  const [placedWords, setPlacedWords] = useState<Record<string, number>>({});
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [bucketStates, setBucketStates] = useState<Record<number, BucketState>>({});
  const [wrongChip, setWrongChip] = useState<string | null>(null);

  const rimes = families.map(deriveFamilyRime);
  const unplacedWords = allWords.filter((w) => !(w in placedWords));

  const handleChipTap = useCallback(
    (word: string) => {
      if (word in placedWords) return;
      setSelectedChip((prev) => (prev === word ? null : word));
    },
    [placedWords],
  );

  const handleBucketTap = useCallback(
    (bucketIdx: number) => {
      if (!selectedChip) return;

      const correctBucketIdx = families.findIndex((fam) => fam.includes(selectedChip));
      const correct = correctBucketIdx === bucketIdx;

      if (correct) {
        setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'correct' }));
        setPlacedWords((prev) => ({ ...prev, [selectedChip]: bucketIdx }));
        setSelectedChip(null);
        SFX.correct();
        onAnswer(true);

        setTimeout(() => {
          setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'idle' }));
        }, 600);

        const totalPlaced = Object.keys(placedWords).length + 1;
        if (totalPlaced >= allWords.length) {
          setTimeout(() => {
            SFX.celebration();
            onSortComplete();
          }, 700);
        }
      } else {
        setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'wrong' }));
        setWrongChip(selectedChip);
        SFX.wrong();
        onAnswer(false);

        setTimeout(() => {
          setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'idle' }));
          setWrongChip(null);
          setSelectedChip(null);
        }, 800);
      }
    },
    [selectedChip, families, placedWords, allWords.length, onAnswer, onSortComplete],
  );

  const bucketColors = [
    { bg: 'from-sky-50 to-sky-100', border: 'border-sky-300', label: 'text-sky-700', rime: 'bg-sky-200 text-sky-800' },
    { bg: 'from-amber-50 to-amber-100', border: 'border-amber-300', label: 'text-amber-700', rime: 'bg-amber-200 text-amber-800' },
    { bg: 'from-rose-50 to-rose-100', border: 'border-rose-300', label: 'text-rose-700', rime: 'bg-rose-200 text-rose-800' },
    { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-300', label: 'text-emerald-700', rime: 'bg-emerald-200 text-emerald-800' },
  ];

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-lg font-bold text-slate-700 text-center">
        {t('games.sortIntoFamilies') || 'Sort the words into rhyming families!'}
      </p>

      {/* Word chips to place */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[48px]" aria-label="Words to sort">
        <AnimatePresence>
          {unplacedWords.map((word) => {
            const isSelected = selectedChip === word;
            const isWrong = wrongChip === word;
            return (
              <motion.button
                key={word}
                type="button"
                className={`px-4 py-2 rounded-xl text-base font-bold shadow-sm border-2 transition-colors min-h-[44px]
                  ${isSelected
                    ? 'bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-300 scale-105'
                    : isWrong
                      ? 'bg-red-100 border-red-400 text-red-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                onClick={() => handleChipTap(word)}
                whileTap={{ scale: 0.88 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={isWrong ? shakeAnimation : { scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={springBouncy}
                aria-pressed={isSelected}
                aria-label={`Word: ${word}`}
              >
                {word}
              </motion.button>
            );
          })}
        </AnimatePresence>
        {unplacedWords.length === 0 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-600 font-bold text-sm flex items-center gap-1"
          >
            <Check size={16} /> {t('games.allSorted')}
          </motion.span>
        )}
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 justify-center w-full" aria-label="Rhyme family buckets">
        {families.map((family, idx) => {
          const bucketState = bucketStates[idx] ?? 'idle';
          const wordsInBucket = allWords.filter((w) => placedWords[w] === idx);
          const rime = rimes[idx];
          const isActive = selectedChip !== null;
          const colors = bucketColors[idx % bucketColors.length];

          const stateClasses =
            bucketState === 'correct'
              ? 'ring-4 ring-emerald-300 border-emerald-400'
              : bucketState === 'wrong'
                ? 'ring-4 ring-red-300 border-red-400'
                : isActive
                  ? `${colors.border} ring-2 ring-blue-200 cursor-pointer`
                  : colors.border;

          return (
            <motion.div
              key={idx}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 bg-gradient-to-b shadow-md
                min-h-[100px] sm:min-w-[130px] sm:min-h-[120px] transition-all ${colors.bg} ${stateClasses}`}
              onClick={() => handleBucketTap(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleBucketTap(idx);
              }}
              aria-label={`Rhyme family: -${rime}`}
              whileTap={isActive ? { scale: 0.97 } : undefined}
            >
              <p className={`text-xs font-semibold uppercase tracking-wider ${colors.label}`}>{t('games.familyLabel')}</p>
              <span className={`text-xl font-extrabold px-3 py-1 rounded-lg ${colors.rime}`}>
                -{rime}
              </span>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                <AnimatePresence>
                  {wordsInBucket.map((w) => (
                    <motion.span
                      key={w}
                      className="px-2 py-0.5 bg-white rounded-lg text-sm font-bold text-slate-700 shadow-sm border border-slate-100"
                      initial={{ scale: 0, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={springBouncy}
                    >
                      {w}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {wordsInBucket.length === 0 && family.length > 0 && (
                  <span className="text-xs text-slate-400 font-semibold">
                    {family.length} words
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main RhymeGame Component ─────────────────────────────────────────────────

export const RhymeGame: React.FC<RhymeGameProps> = ({
  questions: rawQuestions,
  onComplete,
  onWrongAnswer,
  ageGroup,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();
  const age = ageGroup || '7-9';
  const questionsCount = getQuestionsCountForAge(age);
  // For age 3-5: only detect tasks (yes/no), skip produce and sort tasks (too complex)
  const filteredQuestions = age === '3-5'
    ? rawQuestions.filter(q => q.type === 'detect')
    : rawQuestions;
  const questions = filteredQuestions.slice(0, questionsCount);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
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
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setAnswered(false);
          setShowFeedback(null);
        }, 900);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (answered) return;
      setAnswered(true);

      if (correct) {
        SFX.correct();
        setShowFeedback('correct');
        const nextScore = score + 1;
        scoreRef.current = nextScore;
        setScore(nextScore);
        advanceQuestion(nextScore);
      } else {
        SFX.wrong();
        setShowFeedback('wrong');
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setShowFeedback(null);
          advanceQuestion(scoreRef.current);
        }, 1400);
      }
    },
    [answered, score, advanceQuestion, loseHeart, onWrongAnswer],
  );

  const handleSortAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        SFX.correct();
        scoreRef.current += 1;
        setScore(scoreRef.current);
      } else {
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
      }
    },
    [loseHeart, onWrongAnswer],
  );

  const handleSortComplete = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setCompleted(true);
      SFX.celebration();
      const finalScore = scoreRef.current;
      autoCompleteTimeoutRef.current = setTimeout(() => onComplete(finalScore, questions.length), 4000);
    } else {
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setAnswered(false);
        setShowFeedback(null);
      }, 600);
    }
  }, [currentIndex, questions.length, onComplete]);

  const handlePlayAgain = useCallback(() => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    scoreRef.current = 0;
    setScore(0);
    setAnswered(false);
    setCompleted(false);
    setShowFeedback(null);
  }, []);

  // ── Completion screen ──────────────────────────────────────────────────────

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
          <p className="text-4xl font-black text-indigo-600">
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
                bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                text-white font-bold text-sm shadow-lg shadow-blue-200 transition-all min-h-[48px]"
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

  return (
    <div className="flex flex-col items-center gap-3 h-full max-h-full overflow-hidden p-4 w-full max-w-xl mx-auto" role="application" aria-label="Rhyme awareness game">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-extrabold text-slate-800">
          {t('games.rhymeTime') || 'Rhyme Time!'}
        </h2>
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
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
                <><X size={16} /> {t('games.tryAgainYouGotThis')}</>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          className="w-full flex flex-col items-center gap-5"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={springGentle}
        >
          {currentQuestion.type === 'detect' && (
            <DetectTask
              question={currentQuestion}
              onAnswer={handleAnswer}
              answered={answered}
            />
          )}

          {currentQuestion.type === 'produce' && (
            <ProduceTask
              question={currentQuestion}
              onAnswer={handleAnswer}
              answered={answered}
            />
          )}

          {currentQuestion.type === 'sort' && (
            <SortTask
              question={currentQuestion}
              onAnswer={handleSortAnswer}
              onSortComplete={handleSortComplete}
            />
          )}

          <UnifiedMascot
            state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
            size={56}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

RhymeGame.displayName = 'RhymeGame';
