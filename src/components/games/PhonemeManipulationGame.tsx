import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowLeft, RotateCcw } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import './PhonemeManipulationGame.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ManipulationType = 'delete' | 'substitute' | 'add' | 'reverse';

export interface PhonemeManipulationQuestion {
  id: string;
  type: ManipulationType;
  prompt: string;
  promptTr: string;
  targetWord: string;
  targetWordPhonemes: string[];
  changeInstruction: string;
  correctAnswer: string;
  options: string[];
  difficulty: 1 | 2 | 3;
  hint?: string;
}

export interface PhonemeManipulationGameProps {
  questions: PhonemeManipulationQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const VOWEL_PHONEMES = new Set([
  'æ', 'ɑ', 'ɒ', 'ə', 'ɛ', 'ɪ', 'ɔ', 'ʌ', 'ʊ', 'uː', 'iː', 'eɪ', 'aɪ',
  'ɔɪ', 'aʊ', 'oʊ', 'a', 'e', 'i', 'o', 'u',
]);

type PhonemeCategory = 'consonant' | 'vowel' | 'blend';

function classifyPhoneme(phoneme: string): PhonemeCategory {
  if (phoneme.length > 1 && !VOWEL_PHONEMES.has(phoneme)) return 'blend';
  if (VOWEL_PHONEMES.has(phoneme)) return 'vowel';
  return 'consonant';
}

type OptionState = 'idle' | 'correct' | 'wrong';

// ── Phases ─────────────────────────────────────────────────────────────────────

type Phase = 'showing' | 'animating' | 'result' | 'choices';

// ── Component ──────────────────────────────────────────────────────────────────

export const PhonemeManipulationGame: React.FC<PhonemeManipulationGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t, lang } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>('showing');
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const [slideDir] = useState<1 | -1>(1);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const resetForNext = useCallback(() => {
    setPhase('showing');
    setOptionStates({});
    setAnswered(false);
    setShowFeedback(null);
    setDeletedIndex(null);
  }, []);

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
          resetForNext();
        }, 650);
      }
    },
    [currentIndex, questions.length, onComplete, resetForNext],
  );

  // Start the manipulation animation, then show choices
  const handleStartManipulation = useCallback(() => {
    if (phase !== 'showing') return;
    setPhase('animating');

    // Highlight which phoneme tile gets removed during 'delete' manipulations.
    // Strategy: find the first phoneme in targetWordPhonemes that does NOT appear
    // in the correctAnswer string — that is the deleted sound.
    if (currentQuestion.type === 'delete') {
      const phonemes = currentQuestion.targetWordPhonemes;
      const answer = currentQuestion.correctAnswer.toLowerCase();
      // Build a "remaining" copy of the answer so we can account for duplicates
      let remaining = answer;
      let foundIdx = 0; // fallback to first if detection fails
      for (let i = 0; i < phonemes.length; i++) {
        const p = phonemes[i].toLowerCase();
        const pos = remaining.indexOf(p);
        if (pos === -1) {
          // This phoneme is absent from the answer → it was deleted
          foundIdx = i;
          break;
        } else {
          // Consume it so duplicates don't re-match
          remaining = remaining.slice(0, pos) + remaining.slice(pos + p.length);
        }
      }
      setDeletedIndex(foundIdx);
    }

    SFX.click();

    setTimeout(() => {
      setPhase('choices');
      setDeletedIndex(null);
    }, 950);
  }, [phase, currentQuestion]);

  const handleOptionPress = useCallback(
    (option: string) => {
      if (answered || !currentQuestion) return;
      setAnswered(true);

      const isCorrect = option === currentQuestion.correctAnswer;

      if (isCorrect) {
        setOptionStates({ [option]: 'correct' });
        setShowFeedback('correct');
        SFX.correct();
        const nextScore = score + 1;
        setScore(nextScore);
        advanceQuestion(nextScore);
      } else {
        setOptionStates({
          [option]: 'wrong',
          [currentQuestion.correctAnswer]: 'correct',
        });
        setShowFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setOptionStates({});
          setShowFeedback(null);
          advanceQuestion(score);
        }, 1300);
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
    setCompleted(false);
    resetForNext();
  }, [resetForNext]);

  // ── Completion screen ────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="pmg">
        {pct >= 90 && <ConfettiRain />}
        <Card variant="elevated" padding="xl" className="pmg__completion">
          <motion.div
            className="pmg__completion-content"
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

            <h2 className="pmg__completion-title">{t('games.greatJob')}</h2>

            <p className="pmg__completion-score">
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

            <div className="pmg__completion-actions">
              <button
                type="button"
                className="pmg__completion-btn pmg__completion-btn--secondary"
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
                className="pmg__completion-btn pmg__completion-btn--primary"
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
  const prompt = lang === 'tr' ? currentQuestion.promptTr : currentQuestion.prompt;

  return (
    <div className="pmg" role="application" aria-label="Phoneme manipulation game">
      {/* Header */}
      <div className="pmg__header">
        <h2 className="pmg__title">{t('games.soundPlay') || 'Sound Play'}</h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" style={{ minHeight: '2.75rem' }}>
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`pmg__feedback pmg__feedback--${showFeedback}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct'
                ? t('games.amazing')
                : `${t('games.correctAnswerWas') || 'The answer was'}: "${currentQuestion.correctAnswer}"`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          initial={{ x: slideDir * 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideDir * -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
        >
          {/* Type badge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className={`pmg__type-badge pmg__type-badge--${currentQuestion.type}`}>
              {currentQuestion.type === 'delete'
                ? (t('games.deleteASound') || 'Delete a Sound')
                : currentQuestion.type === 'substitute'
                  ? (t('games.swapASound') || 'Swap a Sound')
                  : currentQuestion.type === 'add'
                    ? (t('games.addASound') || 'Add a Sound')
                    : (t('games.reverse') || 'Reverse')}
            </span>
          </div>

          {/* Target word */}
          <div className="pmg__target-word">
            <span className="pmg__target-label">{t('games.theWord') || 'The word'}</span>
            <motion.div
              key={`word-${currentIndex}`}
              className="pmg__target-text"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.08 }}
            >
              {currentQuestion.targetWord}
            </motion.div>
          </div>

          {/* Prompt card */}
          <div className="pmg__prompt-card" aria-live="polite">
            <p className="pmg__prompt-text">{prompt}</p>
            {lang !== 'tr' && currentQuestion.promptTr && (
              <p className="pmg__prompt-tr">{currentQuestion.promptTr}</p>
            )}
          </div>

          {/* Phoneme tiles */}
          <div className="pmg__tiles-area">
            <span className="pmg__tiles-label">{t('games.soundsInTheWord') || 'Sounds in the word'}</span>
            <div className="pmg__tiles-row" role="group" aria-label="Phoneme tiles">
              <AnimatePresence>
                {currentQuestion.targetWordPhonemes.map((phoneme, index) => {
                  const category = classifyPhoneme(phoneme);
                  const isBeingDeleted =
                    phase === 'animating' &&
                    currentQuestion.type === 'delete' &&
                    deletedIndex === index;

                  return (
                    <motion.div
                      key={`${currentQuestion.id}-tile-${index}`}
                      className={[
                        'pmg__tile',
                        `pmg__tile--${category}`,
                        isBeingDeleted && 'pmg__tile--deleting',
                        phase === 'animating' &&
                          currentQuestion.type === 'substitute' &&
                          index === 0 &&
                          'pmg__tile--substituting',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        isBeingDeleted
                          ? { scale: 0, opacity: 0, x: -20 }
                          : { scale: 1, opacity: 1, x: 0 }
                      }
                      exit={{ scale: 0, opacity: 0 }}
                      transition={
                        isBeingDeleted
                          ? { duration: 0.45, ease: 'easeIn' }
                          : {
                              type: 'spring',
                              stiffness: 260,
                              damping: 22,
                              delay: index * 0.06,
                            }
                      }
                      aria-label={`Sound: /${phoneme}/`}
                    >
                      <span className="pmg__tile-phoneme">{phoneme}</span>
                      <span className="pmg__tile-slash">/{phoneme}/</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Change instruction pill */}
            <div className="pmg__change-instruction">
              <span className="pmg__change-label">{t('games.change') || 'Change:'}</span>
              <span className="pmg__change-text">{currentQuestion.changeInstruction}</span>
            </div>
          </div>

          {/* Tap to manipulate button — shown before animation starts */}
          {phase === 'showing' && (
            <motion.div
              style={{ display: 'flex', justifyContent: 'center' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                type="button"
                className="pmg__completion-btn pmg__completion-btn--primary"
                style={{ fontSize: '1.2rem', padding: '0.9rem 2.5rem', marginTop: '0.25rem' }}
                onClick={handleStartManipulation}
                whileTap={{ scale: 0.95 }}
                aria-label="See what happens to the word"
              >
                {t('games.seeWhatHappens') || 'See What Happens!'}
              </motion.button>
            </motion.div>
          )}

          {/* Animating phase — visual cue */}
          {phase === 'animating' && (
            <motion.p
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('games.watchSoundsChange') || 'Watch the sounds change...'}
            </motion.p>
          )}

          {/* Result word display — shown briefly after animating */}
          <AnimatePresence>
            {phase === 'result' && (
              <motion.div
                className="pmg__answer-area"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <span className="pmg__answer-label">{t('games.newWord') || 'New word'}</span>
                <span className="pmg__answer-word">{currentQuestion.correctAnswer}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multiple choice options */}
          {phase === 'choices' && (
            <div className="pmg__options-section">
              <p className="pmg__options-label">{t('games.whichWordDoYouGet') || 'Which word do you get?'}</p>
              <div className="pmg__options-grid" role="group" aria-label="Choose the new word">
                {currentQuestion.options.map((option, idx) => {
                  const state: OptionState = optionStates[option] ?? 'idle';
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      className={[
                        'pmg__option',
                        state === 'correct' && 'pmg__option--correct',
                        state === 'wrong' && 'pmg__option--wrong',
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

              {/* Hint */}
              {currentQuestion.hint && !answered && (
                <motion.p
                  className="pmg__hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {t('games.hint') || 'Hint:'} {currentQuestion.hint}
                </motion.p>
              )}
            </div>
          )}

          {/* Bottom row */}
          <div className="pmg__bottom-row">
            <span
              className={`pmg__difficulty-badge pmg__difficulty-badge--${currentQuestion.difficulty}`}
            >
              {currentQuestion.difficulty === 1
                ? (t('games.easy') || 'Easy')
                : currentQuestion.difficulty === 2
                  ? (t('games.medium') || 'Medium')
                  : (t('games.hard') || 'Hard')}
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

PhonemeManipulationGame.displayName = 'PhonemeManipulationGame';
