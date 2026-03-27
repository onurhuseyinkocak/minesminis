import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowLeft, RotateCcw } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import './RhymeGame.css';

// ── Types ──────────────────────────────────────────────────────────────────

export type RhymeTaskType = 'detect' | 'produce' | 'sort';

export interface RhymeQuestion {
  id: string;
  type: RhymeTaskType;

  // For 'detect': does this word rhyme with the target?
  targetWord?: string;
  candidateWord?: string;
  doesRhyme?: boolean;

  // For 'produce': pick which word rhymes with target
  targetWord2?: string;
  options?: string[];
  correctOption?: string;

  // For 'sort': sort words into rhyming families
  words?: string[];
  families?: string[][];

  difficulty: 1 | 2 | 3;
  hint?: string;
  hintTr?: string;
}

export interface RhymeGameProps {
  questions: RhymeQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Internal types ──────────────────────────────────────────────────────────

type OptionState = 'idle' | 'correct' | 'wrong';
type BucketState = 'idle' | 'active' | 'correct' | 'wrong';

// ── Helpers: derive rime (last vowel+consonants) ────────────────────────────

function extractRime(word: string): string {
  // Find the first vowel and take from there to the end
  const match = word.match(/[aeiou].*/i);
  return match ? match[0].toLowerCase() : word.toLowerCase();
}

function deriveFamilyRime(family: string[]): string {
  if (family.length === 0) return '';
  const rimes = family.map(extractRime);
  // Return the longest common suffix
  const first = rimes[0];
  let rime = '';
  for (let i = 1; i <= first.length; i++) {
    const suffix = first.slice(first.length - i);
    if (rimes.every((r) => r.endsWith(suffix))) {
      rime = suffix;
    }
  }
  return rime || first;
}

// ── Detect Task ─────────────────────────────────────────────────────────────

interface DetectTaskProps {
  question: RhymeQuestion;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function DetectTask({ question, onAnswer, answered }: DetectTaskProps) {
  const { t } = useLanguage();
  const [showArc, setShowArc] = useState(false);
  const [cardState, setCardState] = useState<'idle' | 'correct' | 'wrong'>('idle');


  const handleAnswer = useCallback(
    (userSaysYes: boolean) => {
      if (answered) return;
      const correct = userSaysYes === question.doesRhyme;
      if (correct && userSaysYes) {
        setShowArc(true);
        setCardState('correct');
      } else if (!correct) {
        setCardState('wrong');
      } else {
        setCardState('correct');
      }
      onAnswer(correct);
    },
    [answered, question.doesRhyme, onAnswer],
  );

  const word1 = question.targetWord ?? '';
  const word2 = question.candidateWord ?? '';

  return (
    <div className="rg__detect">
      <p className="rg__detect-prompt">
        {t('games.doTheseRhyme') || 'Do these words rhyme?'}
      </p>

      <div className="rg__detect-cards">
        {/* Word 1 */}
        <motion.div
          className={[
            'rg__detect-card',
            cardState === 'correct' && 'rg__detect-card--correct',
            cardState === 'wrong' && 'rg__detect-card--wrong',
          ]
            .filter(Boolean)
            .join(' ')}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        >
          <WordIllustration word={word1} size={80} />
          <span className="rg__detect-word">{word1}</span>
        </motion.div>

        {/* SVG arc connecting the two cards (shown on correct rhyme answer) */}
        <svg
          className="rg__arc-svg"
          viewBox="0 0 300 120"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            className={['rg__arc-path', showArc && 'rg__arc-path--animate']
              .filter(Boolean)
              .join(' ')}
            d="M 75,60 Q 150,10 225,60"
          />
        </svg>

        {/* Word 2 */}
        <motion.div
          className={[
            'rg__detect-card',
            cardState === 'correct' && 'rg__detect-card--correct',
            cardState === 'wrong' && 'rg__detect-card--wrong',
          ]
            .filter(Boolean)
            .join(' ')}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
        >
          <WordIllustration word={word2} size={80} />
          <span className="rg__detect-word">{word2}</span>
        </motion.div>
      </div>

      <div className="rg__detect-btns">
        <motion.button
          type="button"
          className="rg__detect-btn rg__detect-btn--yes kbtn kbtn--blue"
          onClick={() => handleAnswer(true)}
          disabled={answered}
          whileTap={{ scale: 0.94 }}
          aria-label="Yes, they rhyme"
        >
          {t('games.yes') || 'Yes!'}
        </motion.button>
        <motion.button
          type="button"
          className="rg__detect-btn rg__detect-btn--no kbtn kbtn--blue"
          onClick={() => handleAnswer(false)}
          disabled={answered}
          whileTap={{ scale: 0.94 }}
          aria-label="No, they do not rhyme"
        >
          {t('games.no') || 'No'}
        </motion.button>
      </div>
    </div>
  );
}

// ── Produce Task ─────────────────────────────────────────────────────────────

interface ProduceTaskProps {
  question: RhymeQuestion;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function ProduceTask({ question, onAnswer, answered }: ProduceTaskProps) {
  const { t } = useLanguage();
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});

  const targetWord = question.targetWord2 ?? '';
  const options = question.options ?? [];
  const correctOption = question.correctOption ?? '';

  const handleOption = useCallback(
    (option: string) => {
      if (answered) return;
      const correct = option === correctOption;
      if (correct) {
        setOptionStates({ [option]: 'correct' });
      } else {
        setOptionStates({ [option]: 'wrong', [correctOption]: 'correct' });
      }
      onAnswer(correct);
    },
    [answered, correctOption, onAnswer],
  );

  return (
    <div className="rg__produce">
      <p className="rg__produce-prompt">
        {t('games.whichRhymesWith') || 'Which word rhymes with...'}
      </p>

      <motion.div
        className="rg__produce-target"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <WordIllustration word={targetWord} size={80} />
        <span className="rg__produce-target-word">{targetWord}</span>
      </motion.div>

      <div className="rg__options" role="group" aria-label="Rhyme options">
        {options.map((option, idx) => {
          const state: OptionState = optionStates[option] ?? 'idle';
          return (
            <motion.button
              key={option}
              type="button"
              className={[
                'rg__option-card kbtn kbtn--option',
                state === 'correct' && 'rg__option-card--correct correct',
                state === 'wrong' && 'rg__option-card--wrong wrong',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleOption(option)}
              disabled={answered && state === 'idle'}
              aria-pressed={state !== 'idle'}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
            >
              <WordIllustration word={option} size={52} />
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Sort Task ────────────────────────────────────────────────────────────────

interface SortTaskProps {
  question: RhymeQuestion;
  onAnswer: (correct: boolean) => void;
  onSortComplete: () => void;
}

function SortTask({ question, onAnswer, onSortComplete }: SortTaskProps) {
  const { t } = useLanguage();
  const allWords = question.words ?? [];
  const families = question.families ?? [];

  // Track which words have been placed into which bucket index
  const [placedWords, setPlacedWords] = useState<Record<string, number>>({});
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [bucketStates, setBucketStates] = useState<Record<number, BucketState>>({});
  const [wrongChip, setWrongChip] = useState<string | null>(null);

  const rimes = families.map(deriveFamilyRime);

  const unplacedWords = allWords.filter((w) => !(w in placedWords));

  const handleChipTap = useCallback(
    (word: string) => {
      if (word in placedWords) return;
      setSelectedChip((prev) => (prev === word ? null : word));
    },
    [placedWords],
  );

  const handleBucketTap = useCallback(
    (bucketIdx: number) => {
      if (!selectedChip) return;

      const correctBucketIdx = families.findIndex((fam) => fam.includes(selectedChip));
      const correct = correctBucketIdx === bucketIdx;

      if (correct) {
        setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'correct' }));
        setPlacedWords((prev) => ({ ...prev, [selectedChip]: bucketIdx }));
        setSelectedChip(null);
        SFX.correct();
        onAnswer(true);

        setTimeout(() => {
          setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'idle' }));
        }, 600);

        // Check if all words placed — signal complete after short delay
        const totalPlaced = Object.keys(placedWords).length + 1;
        if (totalPlaced >= allWords.length) {
          setTimeout(() => {
            SFX.celebration();
            onSortComplete();
          }, 700);
        }
      } else {
        setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'wrong' }));
        setWrongChip(selectedChip);
        SFX.wrong();
        onAnswer(false);

        setTimeout(() => {
          setBucketStates((prev) => ({ ...prev, [bucketIdx]: 'idle' }));
          setWrongChip(null);
          setSelectedChip(null);
        }, 800);
      }
    },
    [selectedChip, families, placedWords, allWords.length, onAnswer, onSortComplete],
  );

  return (
    <div className="rg__sort">
      <p className="rg__sort-prompt">
        {t('games.sortIntoFamilies') || 'Sort the words into rhyming families!'}
      </p>

      {/* Word chips to place */}
      <div className="rg__chips-pool" aria-label="Words to sort">
        <AnimatePresence>
          {unplacedWords.map((word) => {
            const isSelected = selectedChip === word;
            const isWrong = wrongChip === word;
            return (
              <motion.button
                key={word}
                type="button"
                className={[
                  'rg__chip',
                  isSelected && 'rg__chip--selected',
                  isWrong && 'rg__chip--wrong',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleChipTap(word)}
                whileTap={{ scale: 0.88 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-pressed={isSelected}
                aria-label={`Word: ${word}`}
              >
                {word}
              </motion.button>
            );
          })}
        </AnimatePresence>
        {unplacedWords.length === 0 && (
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700 }}>
            All sorted!
          </span>
        )}
      </div>

      {/* Buckets */}
      <div className="rg__buckets" aria-label="Rhyme family buckets">
        {families.map((family, idx) => {
          const bucketState = bucketStates[idx] ?? 'idle';
          const wordsInBucket = allWords.filter((w) => placedWords[w] === idx);
          const rime = rimes[idx];
          const isActive = selectedChip !== null;

          return (
            <motion.div
              key={idx}
              className={[
                'rg__bucket',
                isActive && bucketState === 'idle' && 'rg__bucket--active',
                bucketState === 'correct' && 'rg__bucket--correct',
                bucketState === 'wrong' && 'rg__bucket--wrong',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleBucketTap(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleBucketTap(idx);
              }}
              aria-label={`Rhyme family: -${rime}`}
              whileTap={isActive ? { scale: 0.97 } : undefined}
            >
              <p className="rg__bucket-label">Family</p>
              <span className="rg__bucket-rime">-{rime}</span>
              <div className="rg__bucket-words">
                <AnimatePresence>
                  {wordsInBucket.map((w) => (
                    <motion.span
                      key={w}
                      className="rg__bucket-word"
                      initial={{ scale: 0, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {w}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {wordsInBucket.length === 0 && family.length > 0 && (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {family.length} words
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main RhymeGame Component ─────────────────────────────────────────────────

export const RhymeGame: React.FC<RhymeGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];

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
          setAnswered(false);
          setShowFeedback(null);
        }, 900);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (answered) return;
      setAnswered(true);

      if (correct) {
        SFX.correct();
        setShowFeedback('correct');
        const nextScore = score + 1;
        setScore(nextScore);
        advanceQuestion(nextScore);
      } else {
        SFX.wrong();
        setShowFeedback('wrong');
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          setAnswered(false);
          setShowFeedback(null);
          advanceQuestion(score);
        }, 1400);
      }
    },
    [answered, score, advanceQuestion, loseHeart, onWrongAnswer],
  );

  // Sort task has multiple sub-answers; each chip placement is an answer event
  const handleSortAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        SFX.correct();
        setScore((prev) => prev + 1);
      } else {
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
      }
    },
    [loseHeart, onWrongAnswer],
  );

  const handleSortComplete = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setCompleted(true);
      SFX.celebration();
      autoCompleteTimeoutRef.current = setTimeout(() => onComplete(score, questions.length), 4000);
    } else {
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setAnswered(false);
        setShowFeedback(null);
      }, 600);
    }
  }, [currentIndex, questions.length, onComplete, score]);

  const handlePlayAgain = useCallback(() => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setCompleted(false);
    setShowFeedback(null);
  }, []);

  // ── Completion screen ──────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="rg">
        {pct >= 90 && <ConfettiRain />}
        <Card variant="elevated" padding="xl" className="rg__completion">
          <motion.div
            className="rg__completion-content"
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

            <h2 className="rg__completion-title">{t('games.greatJob')}</h2>
            <p className="rg__completion-score">
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

            <div className="rg__completion-actions">
              <button
                type="button"
                className="rg__completion-btn rg__completion-btn--secondary"
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
                className="rg__completion-btn rg__completion-btn--primary"
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
    <div className="rg" role="application" aria-label="Rhyme awareness game">
      {/* Header */}
      <div className="rg__header">
        <h2 className="rg__title">{t('games.rhymeTime') || 'Rhyme Time!'}</h2>
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
              className={`rg__feedback rg__feedback--${showFeedback}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct'
                ? t('games.amazing')
                : t('games.tryAgainYouGotThis')}
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
          {currentQuestion.type === 'detect' && (
            <DetectTask
              question={currentQuestion}
              onAnswer={handleAnswer}
              answered={answered}
            />
          )}

          {currentQuestion.type === 'produce' && (
            <ProduceTask
              question={currentQuestion}
              onAnswer={handleAnswer}
              answered={answered}
            />
          )}

          {currentQuestion.type === 'sort' && (
            <SortTask
              question={currentQuestion}
              onAnswer={handleSortAnswer}
              onSortComplete={handleSortComplete}
            />
          )}

          <UnifiedMascot
            state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
            size={52}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

RhymeGame.displayName = 'RhymeGame';
