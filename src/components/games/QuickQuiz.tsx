import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Sparkles, Star, Lightbulb, Check, ArrowRight, RotateCcw, CheckCircle2, XCircle, Clock, Flame } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { SpeakButton } from '../SpeakButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import LessonCompleteScreen, { useLessonComplete } from '../LessonCompleteScreen';
import NoHeartsModal from '../NoHeartsModal';
import { announceToScreenReader } from '../../utils/accessibility';
import { shuffleArray } from '../../utils/arrayUtils';
import { getTimerDurationForAge, getOptionsCountForAge, getQuestionsCountForAge } from '../../services/ageGroupService';

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
  mascotId?: string;
  streakDays?: number;
  ageGroup?: string;
}

interface Question {
  word: WordItem;
  options: string[];
  correctIndex: number;
  mode: 'en-to-tr' | 'tr-to-en' | 'emoji-to-en';
}


function generateQuestions(words: WordItem[], optionsCount: number, questionsCount: number): Question[] {
  const questions: Question[] = [];
  const pool = shuffleArray(words).slice(0, questionsCount);

  for (const word of pool) {
    const roll = Math.random();
    const mode: Question['mode'] = roll < 0.4 ? 'en-to-tr' : roll < 0.7 ? 'tr-to-en' : 'emoji-to-en';
    const correctAnswer =
      mode === 'en-to-tr' ? word.turkish :
      mode === 'tr-to-en' ? word.english :
      word.english;

    const distractors = words
      .filter((w) => w.english !== word.english)
      .map((w) => (mode === 'en-to-tr' ? w.turkish : w.english));

    const shuffledDistractors = shuffleArray(distractors).slice(0, optionsCount - 1);
    const allOptions = [...shuffledDistractors, correctAnswer];
    const shuffledOptions = shuffleArray(allOptions);

    questions.push({
      word,
      options: shuffledOptions,
      correctIndex: shuffledOptions.indexOf(correctAnswer),
      mode,
    });
  }

  return questions;
}

// TIMER_DURATION is now computed per-game from ageGroup

// Circular timer component
function CircularTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / total) * circumference;
  const isUrgent = timeLeft <= 3;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <motion.circle
          cx="28" cy="28" r={radius}
          fill="none"
          stroke={isUrgent ? '#ef4444' : '#3b82f6'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <span className={`text-sm font-bold ${isUrgent ? 'text-red-500' : 'text-slate-700'}`}>
        {timeLeft}
      </span>
    </div>
  );
}

export const QuickQuiz: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer, mascotId, streakDays, ageGroup }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const age = ageGroup || '7-9';
  const TIMER_DURATION = getTimerDurationForAge(age);
  const optionsCount = getOptionsCountForAge(age);
  const questionsCount = getQuestionsCountForAge(age);
  const questions = useMemo(() => words.length >= Math.min(optionsCount, 4) ? generateQuestions(words, optionsCount, questionsCount) : [], [words, optionsCount, questionsCount]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [completed, setCompleted] = useState(false);
  const [showNoHearts, setShowNoHearts] = useState(false);
  const [floatingXp, setFloatingXp] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { show: showComplete, trigger: triggerComplete, dismiss: dismissComplete } = useLessonComplete();

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const question = questions[currentQ];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceQuestion = useCallback((latestScore?: number) => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setFeedback(null);
      setTimeLeft(TIMER_DURATION);
      setFloatingXp(false);
    } else {
      const finalScore = latestScore ?? score;
      setCompleted(true);
      const xpEarned = finalScore * 10;
      triggerComplete({
        xpEarned,
        wordsLearned: questions.map((q) => q.word.english),
        streakDays,
        mascotId,
        onContinue: () => {
          dismissComplete();
          onComplete(finalScore, questions.length);
        },
      });
    }
  }, [currentQ, questions, score, onComplete, triggerComplete, dismissComplete, mascotId, streakDays]);

  useEffect(() => {
    if (completed || feedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setFeedback('timeout');
          setStreak(0);
          loseHeart();
          onWrongAnswer?.();
          advanceTimeoutRef.current = setTimeout(advanceQuestion, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [currentQ, completed, feedback, clearTimer, advanceQuestion]);

  const handleSelect = useCallback((index: number) => {
    if (feedback !== null || selected !== null) return;
    clearTimer();
    setSelected(index);

    if (index === question.correctIndex) {
      const streakBonus = streak >= 2 ? 5 : 0;
      const newScore = score + 1;
      setScore(newScore);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        if (newStreak >= 3) SFX.streak();
        return newStreak;
      });
      setFeedback('correct');
      setFloatingXp(true);
      SFX.correct();
      announceToScreenReader('Correct!', 'polite');
      onXpEarned?.(10 + streakBonus);
      advanceTimeoutRef.current = setTimeout(() => advanceQuestion(newScore), 1500);
    } else {
      setStreak(0);
      setFeedback('wrong');
      SFX.wrong();
      announceToScreenReader('Try again', 'assertive');
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) {
        setShowNoHearts(true);
      }
      advanceTimeoutRef.current = setTimeout(() => advanceQuestion(score), 1500);
    }
  }, [feedback, selected, question, score, streak, bestStreak, clearTimer, advanceQuestion, onXpEarned, loseHeart, onWrongAnswer, hearts]);

  // Keyboard shortcut: 1-4 selects answer option
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed || feedback !== null) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= optionsCount) {
        const idx = num - 1;
        if (idx < (questions[currentQ]?.options.length ?? 0)) {
          handleSelect(idx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completed, feedback, currentQ, questions, handleSelect]);

  const progress = (currentQ / questions.length) * 100;

  const handlePlayAgain = () => {
    clearTimer();
    if (advanceTimeoutRef.current) { clearTimeout(advanceTimeoutRef.current); advanceTimeoutRef.current = null; }
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(TIMER_DURATION);
    setCompleted(false);
    setFloatingXp(false);
  };

  if (words.length < Math.min(optionsCount, 4)) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 text-lg font-medium">
        {t('games.noWordsToReview')}
      </div>
    );
  }

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <>
        {showComplete && (
          <LessonCompleteScreen
            xpEarned={score * 10}
            wordsLearned={questions.map((q) => q.word.english)}
            streakDays={streakDays}
            mascotId={mascotId}
            onContinue={() => {
              dismissComplete();
              onComplete(score, questions.length);
            }}
          />
        )}
        {!showComplete && (
          <div className="flex flex-col items-center justify-center h-full max-h-full overflow-hidden bg-gradient-to-b from-violet-50 to-blue-50 p-4">
            {pct >= 90 && <ConfettiRain duration={3000} />}
            <motion.div
              className="flex flex-col items-center gap-5 bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              >
                {pct >= 90 ? <Trophy size={56} className="text-amber-400" /> : pct >= 60 ? <Star size={56} className="text-amber-400 fill-amber-400" /> : <Check size={56} className="text-emerald-500" />}
              </motion.div>

              <h2 className="text-2xl font-bold text-slate-800">{t('games.quizComplete')}</h2>

              <p className="text-lg text-slate-500 font-medium">
                {score} / {questions.length} {t('games.xCorrect')}
              </p>

              {/* Stars */}
              <div className="flex gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.5 + i * 0.15 }}
                  >
                    <Star size={36} className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                  </motion.span>
                ))}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {bestStreak >= 2 && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-sm font-semibold px-3 py-1.5 rounded-full">
                    <Zap size={14} /> {t('games.bestStreak')} {bestStreak}x
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-sm font-bold px-3 py-1.5 rounded-full">
                  <Sparkles size={14} /> +{score * 10} XP
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px]"
                  onClick={() => onComplete(score, questions.length)}
                >
                  <ArrowRight size={16} /> {t('games.backToGames')}
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-violet-500 text-white font-semibold text-sm hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25 min-h-[48px]"
                  onClick={handlePlayAgain}
                  autoFocus
                >
                  <RotateCcw size={16} /> {t('games.playAgain')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  if (!question) return null;

  return (
    <>
      {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}

      <div className="flex flex-col h-full max-h-full overflow-hidden p-4 max-w-lg mx-auto w-full" role="application" aria-label="Quick quiz game">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full mx-0 mt-1 mb-2 flex-shrink-0">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 to-blue-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 mb-2">
          <h2 className="text-base font-bold text-slate-800">{t('games.quickQuiz')}</h2>
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <motion.span
                className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2 py-0.5 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Flame size={12} className="text-orange-500" /> {streak}x
              </motion.span>
            )}
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {currentQ + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Question card with timer */}
        <motion.div
          key={currentQ}
          className="relative bg-white rounded-2xl shadow-lg border border-slate-100 p-3 sm:p-4 flex flex-col items-center gap-2 flex-shrink-0"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Timer - top right */}
          <div className="absolute top-3 right-3">
            <CircularTimer timeLeft={timeLeft} total={TIMER_DURATION} />
          </div>

          {/* Word display */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center text-xl font-bold text-violet-600">
            {question.word.english.charAt(0).toUpperCase()}
          </div>

          <SpeakButton text={question.word.english} autoPlay={question.mode === 'en-to-tr'} size="md" />

          <p id="qq-question-text" className="text-base font-semibold text-slate-700 text-center">
            {question.mode === 'en-to-tr'
              ? t('games.whatIsInTurkish').replace('{word}', question.word.english)
              : question.mode === 'tr-to-en'
              ? t('games.whatIsInEnglishWord').replace('{word}', question.word.turkish)
              : t('games.whatIsInEnglish')}
          </p>
        </motion.div>

        {/* Answer grid — 2x2 for 4 options, single column for 2-3 */}
        <div
          className={`grid ${optionsCount >= 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 flex-shrink-0`}
          role="radiogroup"
          aria-label="Answer choices"
          aria-describedby="qq-question-text"
        >
          <AnimatePresence mode="wait">
            {question.options.map((option, index) => {
              const isCorrectOption = feedback && index === question.correctIndex;
              const isWrongOption = feedback === 'wrong' && index === selected;
              const isSelectedNeutral = selected === index && !feedback;

              const bgClass = isCorrectOption
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                : isWrongOption
                ? 'bg-red-50 border-red-400 text-red-700'
                : isSelectedNeutral
                ? 'bg-blue-50 border-blue-400 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md';

              return (
                <motion.button
                  type="button"
                  key={`${currentQ}-${index}`}
                  className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm border-2 transition-colors min-h-[44px] ${bgClass}`}
                  onClick={() => handleSelect(index)}
                  disabled={feedback !== null}
                  role="radio"
                  aria-checked={selected === index}
                  aria-label={option}
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={
                    isCorrectOption
                      ? { opacity: 1, y: 0, scale: [1, 1.06, 1] }
                      : isWrongOption
                      ? { opacity: 1, y: 0, x: [0, -5, 5, -5, 0] }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.06 }}
                  whileTap={feedback === null ? { scale: 0.96 } : undefined}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCorrectOption ? 'bg-emerald-100 text-emerald-600' :
                    isWrongOption ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {isCorrectOption
                      ? <CheckCircle2 size={18} aria-hidden="true" />
                      : isWrongOption
                      ? <XCircle size={18} aria-hidden="true" />
                      : String.fromCharCode(65 + index)}
                  </span>
                  <span className="truncate">{option}</span>

                  {/* Floating +10 XP */}
                  {isCorrectOption && floatingXp && (
                    <motion.span
                      className="absolute -top-3 right-2 text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: [0, 1, 1, 0], y: -20 }}
                      transition={{ duration: 1.2 }}
                    >
                      +10 XP
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Feedback banner */}
        <div aria-live="polite" aria-atomic="true">
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-emerald-200"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CheckCircle2 size={18} aria-hidden="true" />
                {t('games.correct')} {streak >= 2 && `${streak}x ${t('games.streak').toLowerCase()}`}
              </motion.div>
            )}

            {feedback === 'wrong' && (
              <motion.div
                className="flex items-center gap-2 bg-red-50 text-red-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-red-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <XCircle size={18} aria-hidden="true" />
                {t('games.theAnswerWas')} {question.options[question.correctIndex]}
                <Lightbulb size={14} className="text-amber-400 ml-auto" aria-hidden="true" />
              </motion.div>
            )}

            {feedback === 'timeout' && (
              <motion.div
                className="flex items-center gap-2 bg-amber-50 text-amber-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-amber-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Clock size={18} aria-hidden="true" />
                {t('games.timesUp')} {t('games.theAnswerWas')} {question.options[question.correctIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

QuickQuiz.displayName = 'QuickQuiz';
