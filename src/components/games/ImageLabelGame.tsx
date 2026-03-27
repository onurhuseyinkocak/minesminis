import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import { SpeakButton } from '../SpeakButton';
import './ImageLabelGame.css';

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

// ── Option button state ───────────────────────────────────────────────────────

type OptionState = 'idle' | 'correct' | 'wrong';

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

  const currentQuestion = questions[currentIndex];

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        onComplete(nextScore, questions.length);
        SFX.celebration();
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
        setOptionStates({ [option]: 'wrong' });
        setShowFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        // Allow retry after shake
        setTimeout(() => {
          setAnswered(false);
          setOptionStates({});
          setShowFeedback(null);
        }, 900);
      }
    },
    [answered, currentQuestion, score, advanceQuestion, loseHeart, onWrongAnswer],
  );

  const handlePlayAgain = useCallback(() => {
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
      <div className="ilg">
        <Card variant="elevated" padding="xl" className="ilg__completion">
          <motion.div
            className="ilg__completion-content"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <UnifiedMascot state="celebrating" size={120} />

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? (
                <Trophy size={48} color="var(--primary, #E8A317)" />
              ) : pct >= 60 ? (
                <Star size={48} fill="var(--primary, #E8A317)" color="var(--primary, #E8A317)" />
              ) : (
                <Check size={48} color="var(--mimi-green, #4caf50)" />
              )}
            </motion.span>

            <h2 className="ilg__completion-title">{t('games.greatJob')}</h2>

            <p className="ilg__completion-score">
              {score} / {questions.length}
            </p>

            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.4 + i * 0.15 }}
                >
                  <Star
                    size={32}
                    fill={i < stars ? 'var(--primary, #E8A317)' : 'none'}
                    color={i < stars ? 'var(--primary, #E8A317)' : '#ccc'}
                  />
                </motion.span>
              ))}
            </span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 10} XP
              </Badge>
            </motion.div>

            <div className="ilg__completion-actions">
              <button
                type="button"
                className="ilg__completion-btn ilg__completion-btn--secondary"
                onClick={() => onComplete(score, questions.length)}
              >
                <ArrowRight size={16} />
                {t('games.backToGames')}
              </button>
              <button
                type="button"
                className="ilg__completion-btn ilg__completion-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} />
                {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  return (
    <div className="ilg" role="application" aria-label="Image label game">
      {/* Header */}
      <div className="ilg__header">
        <h2 className="ilg__title">{t('games.labelThePicture')}</h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" style={{ minHeight: '2.5rem' }}>
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`ilg__feedback ilg__feedback--${showFeedback}`}
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
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          {/* Picture box */}
          <div
            className="ilg-picture-box"
            role="img"
            aria-label={currentQuestion.imageAlt}
          >
            <WordIllustration
              word={currentQuestion.correctLabel}
              size={120}
            />
            <SpeakButton text={currentQuestion.correctLabel} autoPlay size="md" />
            {currentQuestion.phonetic && (
              <span className="ilg-picture-box__phonetic">/{currentQuestion.phonetic}/</span>
            )}
          </div>

          {/* Translation hint — shown after correct answer */}
          <div className="ilg__translation-hint" aria-live="polite">
            {showFeedback === 'correct' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentQuestion.correctLabel} = {currentQuestion.correctLabelTr}
              </motion.span>
            )}
          </div>

          {/* Options */}
          <div className="ilg-options-grid" role="group" aria-label={t('games.labelThePicture')}>
            {currentQuestion.options.map((option, idx) => {
              const state: OptionState = optionStates[option] ?? 'idle';
              return (
                <motion.button
                  key={option}
                  type="button"
                  className={[
                    'ilg-option',
                    state === 'correct' && 'ilg-option--correct',
                    state === 'wrong' && 'ilg-option--wrong',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleOptionPress(option)}
                  disabled={answered && state === 'idle'}
                  aria-pressed={state !== 'idle'}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: idx * 0.07 }}
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
