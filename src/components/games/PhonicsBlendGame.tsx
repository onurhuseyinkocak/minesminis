import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, Volume2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import './PhonicsBlendGame.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BlendQuestion {
  id: string;
  sounds: string[];
  word: string;
  wordTr: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PhonicsBlendGameProps {
  questions: BlendQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Phoneme synthesis helper ───────────────────────────────────────────────────

function playPhoneme(_sound: string): void {
  // Visual + tap feedback via SFX; the letter is shown on screen
  SFX.click();
}

// ── Distractors helper ────────────────────────────────────────────────────────

const WORD_POOL: string[] = [
  'cat', 'dog', 'sun', 'hat', 'pig', 'cup', 'bed', 'map', 'top', 'net',
  'clap', 'frog', 'step', 'grab', 'spin', 'flat', 'drip', 'slim', 'plop', 'brim',
  'black', 'cleft', 'shrimp', 'blend', 'trust', 'craft', 'stomp', 'swift', 'crimp', 'clamp',
  'bat', 'fan', 'hop', 'rug', 'tip', 'wax', 'zip', 'fog', 'hug', 'jet',
];

function buildOptions(correct: string): string[] {
  const distractors = WORD_POOL.filter((w) => w !== correct);
  const shuffled = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...shuffled.slice(0, 3)];
  return options.sort(() => Math.random() - 0.5);
}

// ── Phase type ────────────────────────────────────────────────────────────────

type Phase = 'explore' | 'blending' | 'blended' | 'choices';

// ── Option state ──────────────────────────────────────────────────────────────

type OptionState = 'idle' | 'correct' | 'wrong';

// ── Component ─────────────────────────────────────────────────────────────────

export const PhonicsBlendGame: React.FC<PhonicsBlendGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>('explore');
  const [activeTileIndex, setActiveTileIndex] = useState<number | null>(null);
  const [tappedTiles, setTappedTiles] = useState<Set<number>>(new Set());
  const [options, setOptions] = useState<string[]>([]);
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);

  const blendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blendTimeoutRef.current) clearTimeout(blendTimeoutRef.current);
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const resetTileState = useCallback(() => {
    setActiveTileIndex(null);
    setTappedTiles(new Set());
  }, []);

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        SFX.celebration();
        // Delay auto-complete so the results screen has time to show
        autoCompleteTimeoutRef.current = setTimeout(() => onComplete(nextScore, questions.length), 4000);
      } else {
        setSlideDir(1);
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setPhase('explore');
          resetTileState();
          setOptions([]);
          setOptionStates({});
          setAnswered(false);
          setShowFeedback(null);
        }, 650);
      }
    },
    [currentIndex, questions.length, onComplete, resetTileState],
  );

  const handleTileTap = useCallback(
    (index: number) => {
      if (phase !== 'explore') return;

      setActiveTileIndex(index);
      setTappedTiles((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });

      playPhoneme(currentQuestion.sounds[index]);
    },
    [phase, currentQuestion],
  );

  const handleBlend = useCallback(() => {
    if (phase !== 'explore') return;
    setPhase('blending');

    // After animation, switch to blended → choices
    blendTimeoutRef.current = setTimeout(() => {
      setPhase('blended');
      SFX.correct();

      blendTimeoutRef.current = setTimeout(() => {
        const opts = buildOptions(currentQuestion.word);
        setOptions(opts);
        setPhase('choices');
      }, 700);
    }, 900);
  }, [phase, currentQuestion]);

  const handleOptionPress = useCallback(
    (option: string) => {
      if (answered || !currentQuestion) return;
      setAnswered(true);

      const isCorrect = option === currentQuestion.word;

      if (isCorrect) {
        setOptionStates({ [option]: 'correct' });
        setShowFeedback('correct');
        SFX.correct();
        advanceQuestion(score + 1);
        setScore((prev) => prev + 1);
      } else {
        setOptionStates({ [option]: 'wrong', [currentQuestion.word]: 'correct' });
        setShowFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setOptionStates({});
          setShowFeedback(null);
          advanceQuestion(score);
        }, 1200);
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
    setPhase('explore');
    resetTileState();
    setOptions([]);
    setOptionStates({});
    setAnswered(false);
    setCompleted(false);
    setShowFeedback(null);
    setSlideDir(1);
  }, [resetTileState]);

  // ── Completion screen ────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="pbg">
        {pct >= 90 && <ConfettiRain />}
        <Card variant="elevated" padding="xl" className="pbg__completion">
          <motion.div
            className="pbg__completion-content"
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

            <h2 className="pbg__completion-title">{t('games.greatJob')}</h2>

            <p className="pbg__completion-score">
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

            <div className="pbg__completion-actions">
              <button
                type="button"
                className="pbg__completion-btn pbg__completion-btn--secondary"
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
                className="pbg__completion-btn pbg__completion-btn--primary"
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

  const allTilesTapped = tappedTiles.size >= currentQuestion.sounds.length;
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  return (
    <div className="pbg" role="application" aria-label="Phonics blend game">
      {/* Header */}
      <div className="pbg__header">
        <h2 className="pbg__title">{t('games.phonicsBlending') || 'Phonics Blending'}</h2>
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
              className={`pbg__feedback pbg__feedback--${showFeedback}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct' ? t('games.amazing') : t('games.tryAgainYouGotThis')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentIndex}`}
          initial={{ x: slideDir * 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideDir * -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          {/* Instruction */}
          <p className="pbg__instruction" aria-live="polite">
            {phase === 'explore' && (t('games.tapEachSound') || 'Tap each sound tile to hear it, then press Blend!')}
            {phase === 'blending' && (t('games.blending') || 'Blending...')}
            {phase === 'blended' && `${t('games.theWordIs') || 'The word is:'} ${currentQuestion.word}`}
            {phase === 'choices' && (t('games.whichWordBlend') || 'Which word did you blend?')}
          </p>

          {/* Sound tiles area */}
          {(phase === 'explore' || phase === 'blending') && (
            <div
              className={[
                'pbg__tiles-row',
                phase === 'blending' && 'pbg__tiles-row--blending',
              ]
                .filter(Boolean)
                .join(' ')}
              role="group"
              aria-label="Sound tiles"
            >
              {currentQuestion.sounds.map((sound, index) => {
                const isActive = activeTileIndex === index;
                const isTapped = tappedTiles.has(index);
                return (
                  <motion.button
                    key={`${currentQuestion.id}-sound-${index}`}
                    type="button"
                    className={[
                      'pbg__tile',
                      isActive && 'pbg__tile--active',
                      isTapped && 'pbg__tile--tapped',
                      phase === 'blending' && 'pbg__tile--merging',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleTileTap(index)}
                    disabled={phase === 'blending'}
                    aria-label={`Sound: ${sound}`}
                    whileTap={{ scale: 0.92 }}
                    layout
                  >
                    <span className="pbg__tile-letter">{sound}</span>
                    <span className="pbg__tile-icon" aria-hidden="true">
                      <Volume2 size={14} />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Blended word display */}
          {phase === 'blended' && (
            <motion.div
              className="pbg__blended-word"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="pbg__blended-letter">{currentQuestion.word}</span>
              <span className="pbg__blended-tr">{currentQuestion.wordTr}</span>
            </motion.div>
          )}

          {/* Blend button */}
          {phase === 'explore' && (
            <div className="pbg__blend-btn-wrap">
              <motion.button
                type="button"
                className={[
                  'pbg__blend-btn kbtn kbtn--blue',
                  !allTilesTapped && 'pbg__blend-btn--disabled',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={handleBlend}
                disabled={!allTilesTapped}
                whileTap={{ scale: 0.95 }}
                aria-label="Blend sounds together"
              >
                {t('games.blend') || 'Blend!'}
              </motion.button>
              {!allTilesTapped && (
                <p className="pbg__blend-hint">
                  {t('games.tapAllSoundsFirst') || `Tap all ${currentQuestion.sounds.length} sounds first`}
                </p>
              )}
            </div>
          )}

          {/* Multiple choice options */}
          {phase === 'choices' && (
            <div className="pbg__options-grid" role="group" aria-label="Choose the blended word">
              {options.map((option, idx) => {
                const state: OptionState = optionStates[option] ?? 'idle';
                return (
                  <motion.button
                    key={option}
                    type="button"
                    className={[
                      'pbg__option',
                      state === 'correct' && 'pbg__option--correct',
                      state === 'wrong' && 'pbg__option--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleOptionPress(option)}
                    disabled={answered && state === 'idle'}
                    aria-pressed={state !== 'idle'}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22, delay: idx * 0.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Difficulty badge */}
          <div className="pbg__difficulty-row">
            <span
              className={`pbg__difficulty-badge pbg__difficulty-badge--${currentQuestion.difficulty}`}
            >
              {currentQuestion.difficulty}
            </span>
            <UnifiedMascot
              state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
              size={48}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

PhonicsBlendGame.displayName = 'PhonicsBlendGame';
