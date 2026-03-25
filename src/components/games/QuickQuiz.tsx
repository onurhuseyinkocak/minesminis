import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Trophy, Sparkles, Star, Lightbulb } from 'lucide-react';
import { Card, Badge, ProgressBar, StreakFlame } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { SpeakButton } from '../SpeakButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import LessonCompleteScreen, { useLessonComplete } from '../LessonCompleteScreen';
import NoHeartsModal from '../NoHeartsModal';
import { announceToScreenReader } from '../../utils/accessibility';
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
  onWrongAnswer?: () => void;
  mascotId?: string;
  streakDays?: number;
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

export const QuickQuiz: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer, mascotId, streakDays }) => {
  if (words.length < 4) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Gözden geçirilecek kelime yok.</div>; }
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const questions = useMemo(() => generateQuestions(words), [words]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [completed, setCompleted] = useState(false);
  const [showNoHearts, setShowNoHearts] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { show: showComplete, trigger: triggerComplete, dismiss: dismissComplete } = useLessonComplete();

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
      const newScore = score + 1;
      setScore(newScore);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        if (newStreak >= 3) SFX.streak();
        return newStreak;
      });
      setFeedback('correct');
      SFX.correct();
      announceToScreenReader('Correct!', 'polite');
      onXpEarned?.(10 + streakBonus);
      setTimeout(() => advanceQuestion(newScore), 1500);
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
      setTimeout(() => advanceQuestion(score), 1500);
    }
  };

  const progress = (currentQ / questions.length) * 100;

  const handlePlayAgain = () => {
    clearTimer();
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(TIMER_DURATION);
    setCompleted(false);
  };

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <>
        {/* LessonCompleteScreen overlay (shown via useLessonComplete trigger) */}
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
        {/* Fallback inline results (visible if overlay was dismissed) */}
        {!showComplete && (
          <div className="quick-quiz">
            <Card variant="elevated" padding="xl" className="quick-quiz__results">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="quick-quiz__results-content"
              >
                <Trophy size={56} className="quick-quiz__trophy" />
                <h2 className="quick-quiz__results-title">{t('games.quizComplete')}</h2>
                <p className="quick-quiz__results-score">
                  {score} / {questions.length} {t('games.xCorrect')}
                </p>
                <span className="game-stars">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Star key={i} size={18} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
                  ))}
                </span>
                {bestStreak >= 2 && (
                  <Badge variant="warning" icon={<Zap size={14} />}>
                    {t('games.bestStreak')} {bestStreak}x
                  </Badge>
                )}
                <Badge variant="success" icon={<Sparkles size={14} />}>
                  +{score * 10} XP
                </Badge>
                <div className="quick-quiz__results-actions">
                  <button type="button" className="quick-quiz__results-btn quick-quiz__results-btn--secondary" onClick={() => onComplete(score, questions.length)}>
                    {t('games.backToGames')}
                  </button>
                  <button type="button" className="quick-quiz__results-btn quick-quiz__results-btn--primary" onClick={handlePlayAgain}>
                    {t('games.playAgain')}
                  </button>
                </div>
              </motion.div>
            </Card>
          </div>
        )}
      </>
    );
  }

  if (!question) return null;

  return (
    <>
    {showNoHearts && (
      <NoHeartsModal onClose={() => setShowNoHearts(false)} />
    )}
    <div className="quick-quiz" role="application" aria-label="Quick quiz game">
      <div className="quick-quiz__header">
        <h2 className="quick-quiz__title">{t('games.quickQuiz')}</h2>
        <div className="quick-quiz__meta">
          {streak >= 2 && (
            <Badge variant="warning" icon={<Zap size={14} />}>
              {streak}x {t('games.streak')}
            </Badge>
          )}
          {streak >= 3 && <StreakFlame days={streak} />}
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
              backgroundColor: timeLeft <= 3 ? 'var(--error)' : 'var(--qq-primary)',
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
          <div className="quick-quiz__emoji" style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900 }}>{question.word.english.charAt(0).toUpperCase()}</div>
          {question.mode === 'en-to-tr' && (
            <SpeakButton text={question.word.english} autoPlay size="md" />
          )}
          <p id="qq-question-text" className="quick-quiz__prompt-text">
            {question.mode === 'en-to-tr'
              ? t('games.whatIsInTurkish').replace('{word}', question.word.english)
              : t('games.whatIsInEnglish')}
          </p>
        </motion.div>
      </Card>

      <div
        className="quick-quiz__options"
        role="radiogroup"
        aria-label="Answer choices"
        aria-describedby="qq-question-text"
      >
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
                role="radio"
                aria-checked={selected === index}
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

      <div aria-live="polite" aria-atomic="true">
        {feedback === 'correct' && (
          <motion.div
            className="quick-quiz__feedback quick-quiz__feedback--correct"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {t('games.correct')} {streak >= 2 && `${streak}x ${t('games.streak').toLowerCase()}`}
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="quick-quiz__feedback quick-quiz__feedback--wrong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('games.theAnswerWas')} {question.options[question.correctIndex]} <Lightbulb size={14} color="#E8A317" />
          </motion.div>
        )}

        {feedback === 'timeout' && (
          <motion.div
            className="quick-quiz__feedback quick-quiz__feedback--timeout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('games.timesUp')} {t('games.theAnswerWas')} {question.options[question.correctIndex]}
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};

QuickQuiz.displayName = 'QuickQuiz';
