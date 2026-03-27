import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowLeft, RotateCcw } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
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
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];

  const choices = buildChoices(currentQuestion?.syllableCount ?? 1);

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
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
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
        {pct >= 90 && <ConfettiRain />}
        <Card variant="elevated" padding="xl" className="syg__completion">
          <motion.div
            className="syg__completion-content"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
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
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 + i * 0.15 }}
                >
                  <Star
                    size={32}
                    fill={i < stars ? '#E8A317' : 'none'}
                    color={i < stars ? '#E8A317' : '#ccc'}
                  />
                </motion.span>
              ))}
            </span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, delay: 0.75 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 10} XP
              </Badge>
            </motion.div>

            <div className="syg__completion-actions">
              <button
                type="button"
                className="syg__completion-btn syg__completion-btn--secondary"
                onClick={() => {
                  if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                  onComplete(score, questions.length);
                }}
              >
                <ArrowLeft size={16} />
                {t('games.backToGames')}
              </button>
              <button
                type="button"
                className="syg__completion-btn syg__completion-btn--primary"
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
  const showChoices = phase === 'choices' || phase === 'result-correct' || phase === 'result-wrong';
  const showSyllables = phase === 'result-correct';

  return (
    <div className="syg" role="application" aria-label="Syllable segmentation game">
      {/* Header */}
      <div className="syg__header">
        <h2 className="syg__title">{t('games.syllableGame')}</h2>
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
                : `${t('games.xSyllables').replace('{count}', String(currentQuestion.syllableCount)).replace('{unit}', currentQuestion.syllableCount === 1 ? t('games.syllable') : t('games.syllablesPlural'))} ${t('games.tryAgainYouGotThis')}`}
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
            {phase === 'tapping' && t('games.tapDrumPerSyllable')}
            {phase === 'choices' && t('games.howManySyllables')}
            {phase === 'result-correct' && t('games.hereAreTheSyllables')}
            {phase === 'result-wrong' && t('games.keepTrying')}
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
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true"><ellipse cx="24" cy="28" rx="18" ry="10" fill="#CC4A1A"/><ellipse cx="24" cy="24" rx="18" ry="10" fill="#E8A317"/><rect x="6" y="24" width="36" height="4" fill="#CC4A1A" opacity="0.4"/><line x1="12" y1="14" x2="12" y2="34" stroke="#8B5E34" strokeWidth="2" strokeLinecap="round"/><line x1="36" y1="14" x2="36" y2="34" stroke="#8B5E34" strokeWidth="2" strokeLinecap="round"/></svg>
              </motion.button>

              <p className="syg__drum-label">{t('games.tapHereOneTapPerSyllable')}</p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
                {tapCount > 0 && (
                  <button
                    type="button"
                    className="syg__reset-btn kbtn kbtn--blue"
                    onClick={handleReset}
                    aria-label="Reset taps"
                  >
                    {t('games.reset')}
                  </button>
                )}
                <motion.button
                  type="button"
                  className="syg__done-btn kbtn kbtn--blue"
                  onClick={handleDone}
                  disabled={tapCount === 0}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Done tapping"
                >
                  {t('games.doneExcl')}
                </motion.button>
              </div>
            </div>
          )}

          {/* Multiple choice */}
          {showChoices && (
            <div className="syg__choices" role="group" aria-label="Choose syllable count">
              {choices.map((num, idx) => {
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
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22, delay: idx * 0.07 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    {num}
                    <span>{num === 1 ? t('games.syllable') : t('games.syllablesPlural')}</span>
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
