import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import './SyllableGame.css';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SyllableQuestion {
  id: string;
  word: string;
  wordTr: string;
  syllables: string[];
  syllableCount: number;
  imageWord?: string;
}

export interface SyllableGameProps {
  questions: SyllableQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Phase type ──────────────────────────────────────────────────────────────

type Phase = 'tapping' | 'choices' | 'result-correct' | 'result-wrong';

// ── Choice option state ────────────────────────────────────────────────────

type ChoiceState = 'idle' | 'correct' | 'wrong';

// ── Build multiple-choice options 1-4 ─────────────────────────────────────

function buildChoices(_correct: number): number[] {
  const all = [1, 2, 3, 4];
  return all; // always 1-4 regardless
}

// ── Component ──────────────────────────────────────────────────────────────

export const SyllableGame: React.FC<SyllableGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>('tapping');
  const [tapCount, setTapCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [choiceStates, setChoiceStates] = useState<Record<number, ChoiceState>>({});
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentQuestion = questions[currentIndex];

  const choices = buildChoices(currentQuestion?.syllableCount ?? 1);

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        onComplete(nextScore, questions.length);
        SFX.celebration();
      } else {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setPhase('tapping');
          setTapCount(0);
          setChoiceStates({});
          setAnswered(false);
          setShowFeedback(null);
        }, 900);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  const handleDrumTap = useCallback(() => {
    if (phase !== 'tapping') return;
    SFX.click();
    setTapCount((prev) => prev + 1);
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 280);
  }, [phase]);

  const handleDone = useCallback(() => {
    if (phase !== 'tapping' || tapCount === 0) return;
    setPhase('choices');
  }, [phase, tapCount]);

  const handleReset = useCallback(() => {
    setTapCount(0);
    setPhase('tapping');
  }, []);

  const handleChoice = useCallback(
    (choice: number) => {
      if (answered || !currentQuestion) return;
      setAnswered(true);

      const isCorrect = choice === currentQuestion.syllableCount;
      if (isCorrect) {
        setChoiceStates({ [choice]: 'correct' });
        setShowFeedback('correct');
        setPhase('result-correct');
        SFX.correct();
        advanceQuestion(score + 1);
        setScore((prev) => prev + 1);
      } else {
        setChoiceStates({ [choice]: 'wrong', [currentQuestion.syllableCount]: 'correct' });
        setShowFeedback('wrong');
        setPhase('result-wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setChoiceStates({});
          setShowFeedback(null);
          advanceQuestion(score);
        }, 1400);
      }
    },
    [answered, currentQuestion, score, advanceQuestion, loseHeart, onWrongAnswer],
  );

  const handlePlayAgain = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setPhase('tapping');
    setTapCount(0);
    setIsPulsing(false);
    setChoiceStates({});
    setAnswered(false);
    setCompleted(false);
    setShowFeedback(null);
  }, []);

  // ── Completion screen ─────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="syg">
        <Card variant="elevated" padding="xl" className="syg__completion">
          <motion.div
            className="syg__completion-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <UnifiedMascot state="celebrating" size={120} />

            <span>
              {pct >= 90 ? (
                <Trophy size={48} color="var(--primary, #E8A317)" />
              ) : pct >= 60 ? (
                <Star size={48} fill="var(--primary, #E8A317)" color="var(--primary, #E8A317)" />
              ) : (
                <Check size={48} color="var(--mimi-green, #4caf50)" />
              )}
            </span>

            <h2 className="syg__completion-title">{t('games.greatJob')}</h2>
            <p className="syg__completion-score">
              {score} / {questions.length}
            </p>

            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < stars ? 'var(--primary, #E8A317)' : 'none'}
                  color={i < stars ? 'var(--primary, #E8A317)' : '#ccc'}
                />
              ))}
            </span>

            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 10} XP
            </Badge>

            <div className="syg__completion-actions">
              <button
                type="button"
                className="syg__completion-btn syg__completion-btn--secondary"
                onClick={() => onComplete(score, questions.length)}
              >
                {t('games.backToGames')}
              </button>
              <button
                type="button"
                className="syg__completion-btn syg__completion-btn--primary"
                onClick={handlePlayAgain}
              >
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
  const showChoices = phase === 'choices' || phase === 'result-correct' || phase === 'result-wrong';
  const showSyllables = phase === 'result-correct';

  return (
    <div className="syg" role="application" aria-label="Syllable segmentation game">
      {/* Header */}
      <div className="syg__header">
        <h2 className="syg__title">Syllable Game</h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" style={{ minHeight: '2.5rem', width: '100%' }}>
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`syg__feedback syg__feedback--${showFeedback}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct'
                ? t('games.amazing')
                : `${currentQuestion.syllableCount} ${currentQuestion.syllableCount === 1 ? 'syllable' : 'syllables'}! ${t('games.tryAgainYouGotThis')}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          {/* Word + illustration */}
          <div className="syg__word-display">
            <WordIllustration word={currentQuestion.imageWord ?? currentQuestion.word} size={96} />
            <p className="syg__word">{currentQuestion.word}</p>
            <p className="syg__word-tr">{currentQuestion.wordTr}</p>
          </div>

          {/* Instruction */}
          <p className="syg__instruction" aria-live="polite">
            {phase === 'tapping' && 'Tap the drum once for each syllable you hear!'}
            {phase === 'choices' && 'Now choose — how many syllables?'}
            {phase === 'result-correct' && 'Great! Here are the syllables:'}
            {phase === 'result-wrong' && 'Keep trying!'}
          </p>

          {/* Drum area */}
          {(phase === 'tapping') && (
            <div className="syg__drum-wrap">
              {/* Tap dots */}
              <div className="syg__dots" aria-label={`${tapCount} taps`} aria-live="polite">
                {Array.from({ length: tapCount }, (_, i) => (
                  <span key={i} className="syg__dot" />
                ))}
              </div>

              {/* Drum */}
              <motion.button
                type="button"
                className={['syg__drum', isPulsing ? 'syg__drum--pulse' : ''].filter(Boolean).join(' ')}
                onClick={handleDrumTap}
                aria-label={`Tap drum (${tapCount} taps so far)`}
                whileTap={{ scale: 0.93 }}
              >
                🥁
              </motion.button>

              <p className="syg__drum-label">Tap here — one tap per syllable</p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
                {tapCount > 0 && (
                  <button
                    type="button"
                    className="syg__reset-btn"
                    onClick={handleReset}
                    aria-label="Reset taps"
                  >
                    Reset
                  </button>
                )}
                <motion.button
                  type="button"
                  className="syg__done-btn"
                  onClick={handleDone}
                  disabled={tapCount === 0}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Done tapping"
                >
                  Done!
                </motion.button>
              </div>
            </div>
          )}

          {/* Multiple choice */}
          {showChoices && (
            <div className="syg__choices" role="group" aria-label="Choose syllable count">
              {choices.map((num) => {
                const state: ChoiceState = choiceStates[num] ?? 'idle';
                return (
                  <motion.button
                    key={num}
                    type="button"
                    className={[
                      'syg__choice-btn',
                      state === 'correct' && 'syg__choice-btn--correct',
                      state === 'wrong' && 'syg__choice-btn--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleChoice(num)}
                    disabled={answered && state === 'idle'}
                    aria-pressed={state !== 'idle'}
                    whileTap={{ scale: 0.92 }}
                  >
                    {num}
                    <span>{num === 1 ? 'syllable' : 'syllables'}</span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Syllable tiles after correct */}
          {showSyllables && (
            <motion.div
              className="syg__syllable-tiles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {currentQuestion.syllables.map((syl, i) => (
                <motion.span
                  key={`${syl}-${i}`}
                  className="syg__syllable-tile"
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
                >
                  {syl}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Mascot */}
          <UnifiedMascot
            state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
            size={52}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

SyllableGame.displayName = 'SyllableGame';
