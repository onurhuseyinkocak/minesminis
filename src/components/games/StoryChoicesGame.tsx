import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const questions = useMemo(() => buildQuestions(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const scoreRef = useRef(0);

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
      onWrongAnswer?.();
      SFX.wrong();
      setTimeout(() => advance(false), 1200);
    }
  };

  if (completed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
        <Card variant="elevated" padding="xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{ textAlign: 'center' }}
          >
            <span style={{ fontSize: '4rem' }} role="img" aria-label="celebration">
              {score >= questions.length * 0.8 ? '🌟' : '👏'}
            </span>
            <h2 style={{ color: '#1A6B5A', margin: '0.5rem 0' }}>{t('games.storyComplete')}</h2>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>
              {t('games.xOutOfYCorrect').replace('{score}', String(score)).replace('{total}', String(questions.length))}
            </p>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.5rem',
        fontFamily: 'Nunito, sans-serif',
        maxWidth: '480px',
        margin: '0 auto',
      }}
      role="application"
      aria-label="Story choices game"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ color: '#1A6B5A', margin: 0, fontSize: '1.4rem' }}>{t('games.chooseTranslation')}</h2>
        <Badge variant="info">{currentIndex + 1}/{questions.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Prompt card */}
      <Card variant="elevated" padding="lg">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>
            {question.word.emoji}
          </span>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1A6B5A', margin: 0 }}>
            {question.word.english}
          </p>
        </motion.div>
      </Card>

      {/* Choices */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
        }}
        role="group"
        aria-label="Translation choices"
      >
        <AnimatePresence mode="wait">
          {question.choices.map((choice, idx) => {
            const isSelected = selectedIdx === idx;
            const showCorrect = feedback !== null && choice.correct;
            const showWrong = feedback === 'wrong' && isSelected && !choice.correct;

            let bgColor = '#fff';
            let borderColor = '#e0e0e0';
            let textColor = '#333';

            if (showCorrect) {
              bgColor = '#E8F5E9';
              borderColor = '#1A6B5A';
              textColor = '#1A6B5A';
            } else if (showWrong) {
              bgColor = '#FFEBEE';
              borderColor = '#d32f2f';
              textColor = '#d32f2f';
            }

            return (
              <motion.button
                key={`${currentIndex}-${idx}`}
                onClick={() => handleChoice(idx, choice.correct)}
                disabled={feedback !== null}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '1rem',
                  border: `2px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: 'Nunito, sans-serif',
                  cursor: feedback !== null ? 'default' : 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                aria-label={`Choice: ${choice.text}`}
              >
                {choice.text}
                {showCorrect && ' ✓'}
                {showWrong && ' ✗'}
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
            style={{ color: '#1A6B5A', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}
          >
            {t('games.correctWellDone')}
          </motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#d32f2f', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}
          >
            {t('games.notQuiteKeepGoing')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

StoryChoicesGame.displayName = 'StoryChoicesGame';
