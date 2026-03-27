import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Trophy, Sparkles, Star, Lightbulb, Check, ArrowRight, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, Badge, ProgressBar, StreakFlame } from '../ui';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { SpeakButton } from '../SpeakButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import LessonCompleteScreen, { useLessonComplete } from '../LessonCompleteScreen';
import NoHeartsModal from '../NoHeartsModal';
import { announceToScreenReader } from '../../utils/accessibility';
import { shuffleArray } from '../../utils/arrayUtils';
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
  mode: 'en-to-tr' | 'tr-to-en' | 'emoji-to-en';
}


function generateQuestions(words: WordItem[]): Question[] {
  const questions: Question[] = [];
  const pool = shuffleArray(words).slice(0, 5);

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

const TIMER_DURATION = 15;

export const QuickQuiz: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer, mascotId, streakDays }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const questions = useMemo(() => words.length >= 4 ? generateQuestions(words) : [], [words]);
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
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { show: showComplete, trigger: triggerComplete, dismiss: dismissComplete } = useLessonComplete();

  // Cleanup on unmount
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

  // Keyboard shortcut: 1–4 selects answer option
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed || feedback !== null) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 4) {
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
  };

  if (words.length < 4) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('games.noWordsToReview')}</div>; }

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
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
            {pct >= 90 && <ConfettiRain duration={3000} />}
            <Card variant="elevated" padding="xl" className="quick-quiz__results">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="quick-quiz__results-content"
              >
                <motion.span
                  className="quick-quiz__results-emoji"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                >
                  {pct >= 90 ? <Trophy size={48} color="var(--warning)" /> : pct >= 60 ? <Star size={48} fill="var(--warning)" color="var(--warning)" /> : <Check size={48} color="var(--success)" />}
                </motion.span>
                <h2 className="quick-quiz__results-title">{t('games.quizComplete')}</h2>
                <p className="quick-quiz__results-score">
                  {score} / {questions.length} {t('games.xCorrect')}
                </p>
                <span className="game-stars">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.5 + i * 0.15 }}
                    >
                      <Star size={32} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
                    </motion.span>
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
                    <ArrowRight size={16} /> {t('games.backToGames')}
                  </button>
                  <button type="button" className="quick-quiz__results-btn quick-quiz__results-btn--primary" onClick={handlePlayAgain} autoFocus>
                    <RotateCcw size={16} /> {t('games.playAgain')}
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
          <div className={`quick-quiz__emoji${question.word.emoji ? '' : ' quick-quiz__emoji--fallback'}`}>{question.word.emoji || question.word.english.charAt(0).toUpperCase()}</div>
          {/* Always show speak button — hearing the word is part of every question type */}
          <SpeakButton text={question.word.english} autoPlay={question.mode === 'en-to-tr'} size="md" />
          <p id="qq-question-text" className="quick-quiz__prompt-text">
            {question.mode === 'en-to-tr'
              ? t('games.whatIsInTurkish').replace('{word}', question.word.english)
              : question.mode === 'tr-to-en'
              ? t('games.whatIsInEnglishWord').replace('{word}', question.word.turkish)
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
            let optionClass = 'quick-quiz__option kbtn kbtn--option';
            if (feedback && index === question.correctIndex) {
              optionClass += ' quick-quiz__option--correct correct';
            } else if (feedback === 'wrong' && index === selected) {
              optionClass += ' quick-quiz__option--wrong wrong';
            } else if (selected === index) {
              optionClass += ' quick-quiz__option--selected';
            }

            // Show icons for color-blind users — not color alone
            const isCorrectOption = feedback && index === question.correctIndex;
            const isWrongOption = feedback === 'wrong' && index === selected;

            return (
              <motion.button
                type="button"
                key={`${currentQ}-${index}`}
                className={optionClass}
                onClick={() => handleSelect(index)}
                disabled={feedback !== null}
                role="radio"
                aria-checked={selected === index}
                aria-label={option}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="quick-quiz__option-label">
                  {isCorrectOption
                    ? <CheckCircle2 size={20} aria-hidden="true" />
                    : isWrongOption
                    ? <XCircle size={20} aria-hidden="true" />
                    : String.fromCharCode(65 + index)}
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
            {/* Icon + color for color-blind users (not color alone) */}
            <CheckCircle2 size={18} aria-hidden="true" />
            {t('games.correct')} {streak >= 2 && `${streak}x ${t('games.streak').toLowerCase()}`}
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="quick-quiz__feedback quick-quiz__feedback--wrong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Icon + color for color-blind users (not color alone) */}
            <XCircle size={18} aria-hidden="true" />
            {t('games.theAnswerWas')} {question.options[question.correctIndex]} <Lightbulb size={14} color="var(--warning)" aria-hidden="true" />
          </motion.div>
        )}

        {feedback === 'timeout' && (
          <motion.div
            className="quick-quiz__feedback quick-quiz__feedback--timeout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Icon + color for color-blind users (not color alone) */}
            <Clock size={18} aria-hidden="true" />
            {t('games.timesUp')} {t('games.theAnswerWas')} {question.options[question.correctIndex]}
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};

QuickQuiz.displayName = 'QuickQuiz';
