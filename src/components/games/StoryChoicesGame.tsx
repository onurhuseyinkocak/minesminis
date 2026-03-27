import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Check, X, RotateCcw, ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import './StoryChoicesGame.css';

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
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Question {
  word: WordItem;
  choices: { text: string; correct: boolean }[];
}

function buildQuestions(words: WordItem[]): Question[] {
  const pool = shuffleArray(words).slice(0, 6);
  return pool.map((word) => {
    const distractors = words
      .filter((w) => w.english !== word.english)
      .map((w) => w.turkish);
    const picked = shuffleArray(distractors).slice(0, 2);
    const choices = shuffleArray([
      { text: word.turkish, correct: true },
      ...picked.map((t) => ({ text: t, correct: false })),
    ]);
    return { word, choices };
  });
}

export const StoryChoicesGame: React.FC<GameProps> = ({ words, onComplete, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();
  const questions = useMemo(() => buildQuestions(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const scoreRef = useRef(0);

  if (words.length < 3) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        {t('games.notQuiteKeepGoing')}
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  const advance = useCallback((wasCorrect: boolean) => {
    const newScore = scoreRef.current + (wasCorrect ? 1 : 0);
    scoreRef.current = newScore;
    setScore(newScore);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback(null);
      setSelectedIdx(null);
    } else {
      setCompleted(true);
      onComplete(newScore, questions.length);
    }
  }, [currentIndex, questions.length, onComplete]);

  const handleChoice = (idx: number, correct: boolean) => {
    if (feedback !== null) return;
    setSelectedIdx(idx);

    if (correct) {
      setFeedback('correct');
      SFX.correct();
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
    setCurrentIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setFeedback(null);
    setSelectedIdx(null);
    setCompleted(false);
  };

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const isPerfect = pct >= 90;
    return (
      <div className="story-choices-game__complete">
        {isPerfect && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="story-choices-game__complete-content"
          >
            <motion.span
              className="story-choices-game__complete-emoji"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
            >
              {pct >= 90
                ? <Trophy size={48} color="#E8A317" />
                : pct >= 60
                  ? <Star size={48} fill="#E8A317" color="#E8A317" />
                  : <Check size={48} color="#22C55E" />}
            </motion.span>
            <h2 className="story-choices-game__complete-title">{t('games.storyComplete')}</h2>
            <p className="story-choices-game__complete-score">
              {t('games.xOutOfYCorrect').replace('{score}', String(score)).replace('{total}', String(questions.length))}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.55 + i * 0.12 }}
                >
                  <Star size={32} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
                </motion.span>
              ))}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 10} XP
              </Badge>
            </motion.div>
            <div className="story-choices-game__complete-actions">
              <button
                type="button"
                className="story-choices-game__complete-btn story-choices-game__complete-btn--secondary"
                onClick={() => onComplete(score, questions.length)}
              >
                <ArrowRight size={16} /> {t('games.backToGames') || 'Back'}
              </button>
              <button
                type="button"
                className="story-choices-game__complete-btn story-choices-game__complete-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} /> {t('games.playAgain') || 'Play Again'}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div
      className="story-choices-game"
      role="application"
      aria-label="Story choices game"
    >
      <div className="story-choices-game__header">
        <h2 className="story-choices-game__title">{t('games.chooseTranslation')}</h2>
        <Badge variant="info">{currentIndex + 1}/{questions.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Prompt card */}
      <Card variant="elevated" padding="lg">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="story-choices-game__prompt"
        >
          <div className={`story-choices-game__prompt-emoji${question.word.emoji ? '' : ' story-choices-game__prompt-emoji--fallback'}`}>{question.word.emoji || question.word.english.charAt(0).toUpperCase()}</div>
          <p className="story-choices-game__prompt-word">
            {question.word.english}
          </p>
        </motion.div>
      </Card>

      {/* Choices */}
      <div
        className="story-choices-game__choices"
        role="group"
        aria-label="Translation choices"
      >
        <AnimatePresence mode="wait">
          {question.choices.map((choice, idx) => {
            const isSelected = selectedIdx === idx;
            const showCorrect = feedback !== null && choice.correct;
            const showWrong = feedback === 'wrong' && isSelected && !choice.correct;

            const choiceClass = [
              'story-choices-game__choice',
              isSelected && !feedback && 'story-choices-game__choice--selected',
              showCorrect && 'story-choices-game__choice--correct',
              showWrong && 'story-choices-game__choice--wrong',
            ].filter(Boolean).join(' ');

            return (
              <motion.button
                key={`${currentIndex}-${idx}`}
                type="button"
                onClick={() => handleChoice(idx, choice.correct)}
                disabled={feedback !== null}
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97, y: 1 }}
                className={choiceClass}
                aria-label={`Choice: ${choice.text}`}
              >
                <span className="story-choices-game__choice-text">{choice.text}</span>
                {showCorrect && <CheckCircle2 size={18} strokeWidth={2.5} />}
                {showWrong && <X size={18} strokeWidth={2.5} />}
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
            className="story-choices-game__feedback--correct"
          >
            {t('games.correctWellDone')}
          </motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="story-choices-game__feedback--wrong"
          >
            {t('games.notQuiteKeepGoing')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

StoryChoicesGame.displayName = 'StoryChoicesGame';
