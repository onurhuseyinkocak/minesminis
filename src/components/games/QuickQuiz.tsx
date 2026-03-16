import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Trophy, Sparkles } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import './QuickQuiz.css';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface GameProps {
  words: WordItem[];
  onComplete: (score: number, totalPossible: number) => void;
  onXpEarned?: (xp: number) => void;
}

interface Question {
  word: WordItem;
  options: string[];
  correctIndex: number;
  mode: 'en-to-tr' | 'emoji-to-en';
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestions(words: WordItem[]): Question[] {
  const questions: Question[] = [];
  const pool = shuffleArray(words).slice(0, 5);

  for (const word of pool) {
    const mode: Question['mode'] = Math.random() > 0.5 ? 'en-to-tr' : 'emoji-to-en';
    const correctAnswer = mode === 'en-to-tr' ? word.turkish : word.english;

    const distractors = words
      .filter((w) => w.english !== word.english)
      .map((w) => (mode === 'en-to-tr' ? w.turkish : w.english));

    const shuffledDistractors = shuffleArray(distractors).slice(0, 3);
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

const TIMER_DURATION = 10;

export const QuickQuiz: React.FC<GameProps> = ({ words, onComplete, onXpEarned }) => {
  const questions = useMemo(() => generateQuestions(words), [words]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = questions[currentQ];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceQuestion = useCallback(() => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setFeedback(null);
      setTimeLeft(TIMER_DURATION);
    } else {
      setCompleted(true);
      onComplete(score, questions.length);
    }
  }, [currentQ, questions.length, score, onComplete]);

  useEffect(() => {
    if (completed || feedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setFeedback('timeout');
          setStreak(0);
          setTimeout(advanceQuestion, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [currentQ, completed, feedback, clearTimer, advanceQuestion]);

  const handleSelect = (index: number) => {
    if (feedback !== null || selected !== null) return;
    clearTimer();
    setSelected(index);

    if (index === question.correctIndex) {
      const streakBonus = streak >= 2 ? 5 : 0;
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      setFeedback('correct');
      onXpEarned?.(10 + streakBonus);
    } else {
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(advanceQuestion, 1500);
  };

  const progress = (currentQ / questions.length) * 100;

  if (completed) {
    return (
      <div className="quick-quiz">
        <Card variant="elevated" padding="xl" className="quick-quiz__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="quick-quiz__results-content"
          >
            <Trophy size={48} className="quick-quiz__trophy" />
            <h2 className="quick-quiz__results-title">Quiz Complete!</h2>
            <p className="quick-quiz__results-score">
              {score} / {questions.length} correct
            </p>
            {bestStreak >= 2 && (
              <Badge variant="warning" icon={<Zap size={14} />}>
                Best Streak: {bestStreak}x
              </Badge>
            )}
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 10} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="quick-quiz" role="application" aria-label="Quick quiz game">
      <div className="quick-quiz__header">
        <h2 className="quick-quiz__title">Quick Quiz!</h2>
        <div className="quick-quiz__meta">
          {streak >= 2 && (
            <Badge variant="warning" icon={<Zap size={14} />}>
              {streak}x Streak!
            </Badge>
          )}
          <Badge variant="info">{currentQ + 1}/{questions.length}</Badge>
        </div>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <div className="quick-quiz__timer">
        <Timer size={18} />
        <div className="quick-quiz__timer-bar">
          <motion.div
            className="quick-quiz__timer-fill"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: timeLeft <= 3 ? '#e74c3c' : 'var(--qq-primary)',
            }}
          />
        </div>
        <span className="quick-quiz__timer-text">{timeLeft}s</span>
      </div>

      <Card variant="elevated" padding="lg" className="quick-quiz__question">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="quick-quiz__question-content"
        >
          <span className="quick-quiz__emoji" role="img" aria-label={question.word.english}>
            {question.word.emoji}
          </span>
          <p className="quick-quiz__prompt-text">
            {question.mode === 'en-to-tr'
              ? `What is "${question.word.english}" in Turkish?`
              : `What is this in English?`}
          </p>
        </motion.div>
      </Card>

      <div className="quick-quiz__options" role="radiogroup" aria-label="Answer options">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => {
            let optionClass = 'quick-quiz__option';
            if (feedback && index === question.correctIndex) {
              optionClass += ' quick-quiz__option--correct';
            } else if (feedback === 'wrong' && index === selected) {
              optionClass += ' quick-quiz__option--wrong';
            } else if (selected === index) {
              optionClass += ' quick-quiz__option--selected';
            }

            return (
              <motion.button
                key={`${currentQ}-${index}`}
                className={optionClass}
                onClick={() => handleSelect(index)}
                disabled={feedback !== null}
                aria-label={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="quick-quiz__option-label">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="quick-quiz__option-text">{option}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {feedback === 'correct' && (
        <motion.div
          className="quick-quiz__feedback quick-quiz__feedback--correct"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Correct! 🌟 {streak >= 2 && `${streak}x streak!`}
        </motion.div>
      )}

      {feedback === 'wrong' && (
        <motion.div
          className="quick-quiz__feedback quick-quiz__feedback--wrong"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          The answer was: {question.options[question.correctIndex]} 💡
        </motion.div>
      )}

      {feedback === 'timeout' && (
        <motion.div
          className="quick-quiz__feedback quick-quiz__feedback--timeout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Time's up! The answer was: {question.options[question.correctIndex]} ⏰
        </motion.div>
      )}
    </div>
  );
};

QuickQuiz.displayName = 'QuickQuiz';
