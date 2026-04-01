import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Check, X, RotateCcw, ArrowRight, CheckCircle2, Trophy, Volume2 } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import { shuffleArray } from '../../utils/arrayUtils';
import { getQuestionsCountForAge } from '../../services/ageGroupService';

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
  ageGroup?: string;
}

interface Question {
  word: WordItem;
  choices: { text: string; correct: boolean }[];
}

function buildQuestions(words: WordItem[], choicesCount: number, questionsCount: number): Question[] {
  const pool = shuffleArray(words).slice(0, questionsCount);
  return pool.map((word) => {
    const distractors = words
      .filter((w) => w.english !== word.english)
      .map((w) => w.turkish);
    const picked = shuffleArray(distractors).slice(0, choicesCount - 1);
    const choices = shuffleArray([
      { text: word.turkish, correct: true },
      ...picked.map((t) => ({ text: t, correct: false })),
    ]);
    return { word, choices };
  });
}

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

export const StoryChoicesGame: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer, ageGroup }) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();
  const [playKey, setPlayKey] = useState(0);
  const age = ageGroup || '7-9';
  // For age 3-5: only 2 choices instead of 3
  const choicesCount = age === '3-5' ? 2 : 3;
  const questionsCount = getQuestionsCountForAge(age);
  const questions = useMemo(() => buildQuestions(words, choicesCount, questionsCount), [words, choicesCount, questionsCount, playKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const scoreRef = useRef(0);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const advance = useCallback((wasCorrect: boolean) => {
    const newScore = scoreRef.current + (wasCorrect ? 1 : 0);
    scoreRef.current = newScore;
    setScore(newScore);

    setCurrentIndex((prev) => {
      if (prev + 1 < questions.length) {
        setFeedback(null);
        setSelectedIdx(null);
        return prev + 1;
      }
      setCompleted(true);
      autoCompleteTimeoutRef.current = setTimeout(() => onComplete(newScore, questions.length), 4000);
      return prev;
    });
  }, [questions.length, onComplete]);

  if (words.length < 3) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400 text-center">
        {t('games.notQuiteKeepGoing')}
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  const handleChoice = (idx: number, correct: boolean) => {
    if (feedback !== null) return;
    setSelectedIdx(idx);

    if (correct) {
      setFeedback('correct');
      SFX.correct();
      onXpEarned?.(10);
      setTimeout(() => advance(true), 1200);
    } else {
      setFeedback('wrong');
      loseHeart();
      onWrongAnswer?.();
      SFX.wrong();
      setTimeout(() => advance(false), 1200);
    }
  };

  const handlePlayAgain = () => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setFeedback(null);
    setSelectedIdx(null);
    setCompleted(false);
    setPlayKey(k => k + 1);
  };

  // Completion screen
  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    const isPerfect = pct === 100;
    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {isPerfect && <ConfettiRain duration={3000} />}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={springBounce}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-5"
        >
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springBounce, delay: 0.3 }}>
            {pct >= 90 ? <Trophy size={48} className="text-amber-500" /> : pct >= 60 ? <Star size={48} className="text-amber-500 fill-amber-500" /> : <Check size={48} className="text-emerald-500" />}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">{t('games.storyComplete')}</h2>
          <p className="text-lg text-gray-500">
            {t('games.xOutOfYCorrect').replace('{score}', String(score)).replace('{total}', String(questions.length))}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBounce, delay: 0.55 + i * 0.12 }}>
                <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <Sparkles size={14} /> +{score * 10} XP
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button type="button" onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, questions.length); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
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

  if (!question) return null;

  return (
    <div className="flex flex-col gap-3 h-full max-h-full overflow-hidden px-4 py-3 max-w-lg mx-auto" role="application" aria-label="Story choices game">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{t('games.chooseTranslation')}</h2>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <motion.div className="h-full bg-emerald-400 rounded-full" animate={{ width: `${progress}%` }} transition={springGentle} />
      </div>

      {/* Hero word card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springGentle}
        className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm"
      >
        <p className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight break-all">
          {question.word.english}
        </p>
        <button
          type="button"
          onClick={() => speak(question.word.english)}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors"
        >
          <Volume2 size={16} /> Listen
        </button>
      </motion.div>

      {/* Choices */}
      <div className="flex flex-col gap-3" role="group" aria-label="Translation choices">
        <AnimatePresence mode="wait">
          {question.choices.map((choice, idx) => {
            const isSelected = selectedIdx === idx;
            const showCorrect = feedback !== null && choice.correct;
            const showWrong = feedback === 'wrong' && isSelected && !choice.correct;

            return (
              <motion.button
                key={`${currentIndex}-${idx}`}
                type="button"
                onClick={() => handleChoice(idx, choice.correct)}
                disabled={feedback !== null}
                className={`
                  flex items-center justify-between px-5 py-4 min-h-[56px] rounded-xl font-semibold text-base transition-all
                  ${showCorrect ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700' : ''}
                  ${showWrong ? 'bg-red-50 border-2 border-red-300 text-red-600' : ''}
                  ${!showCorrect && !showWrong ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm' : ''}
                  disabled:cursor-not-allowed
                `}
                aria-label={`Choice: ${choice.text}`}
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={
                  showCorrect
                    ? { opacity: 1, x: 0, y: 0, scale: [1, 1.05, 1] }
                    : showWrong
                      ? { opacity: 1, x: [0, -4, 4, -4, 0], y: 0 }
                      : { opacity: 1, x: 0, y: 0 }
                }
                transition={{ ...springGentle, delay: idx * 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{choice.text}</span>
                {showCorrect && <CheckCircle2 size={18} strokeWidth={2.5} className="text-emerald-500" />}
                {showWrong && <X size={18} strokeWidth={2.5} className="text-red-500" />}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Feedback text */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center font-semibold text-emerald-700 bg-emerald-50 rounded-xl py-2 px-4"
          >
            {t('games.correctWellDone')}
          </motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center font-semibold text-red-600 bg-red-50 rounded-xl py-2 px-4"
          >
            {t('games.notQuiteKeepGoing')}{' '}
            <strong className="text-emerald-600">
              {question.choices.find(c => c.correct)?.text}
            </strong>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

StoryChoicesGame.displayName = 'StoryChoicesGame';
