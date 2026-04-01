import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Sparkles, Star, Trophy, Check, X,
  ArrowRight, RotateCcw, Headphones, Lightbulb,
} from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { speak } from '../../services/ttsService';
import { Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import { shuffleArray } from '../../utils/arrayUtils';

// ── Types ──────────────────────────────────────────────────────────────────────

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

interface Round {
  correctWord: WordItem;
  options: WordItem[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function phoneticSimilarity(a: string, b: string): number {
  const wa = a.toLowerCase();
  const wb = b.toLowerCase();
  let score = 0;
  if (wa[0] === wb[0]) score += 2;
  if (Math.abs(wa.length - wb.length) <= 1) score += 2;
  if (wa.slice(-2) === wb.slice(-2)) score += 3;
  if (wa.slice(-1) === wb.slice(-1)) score += 1;
  return score;
}

function generateRounds(words: WordItem[]): Round[] {
  const selected = shuffleArray(words).slice(0, 5);
  return selected.map((word) => {
    const others = words.filter((w) => w.english !== word.english);
    const sorted = [...others].sort((a, b) => {
      const diff = phoneticSimilarity(word.english, b.english) - phoneticSimilarity(word.english, a.english);
      return diff !== 0 ? diff : Math.random() - 0.5;
    });
    const distractors = sorted.slice(0, Math.min(3, sorted.length));
    const options = shuffleArray([word, ...distractors]);
    return { correctWord: word, options };
  });
}

// ── Spring configs ───────────────────────────────────────────────────────────

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springSmooth = { type: 'spring' as const, stiffness: 260, damping: 28 };
const springPop = { type: 'spring' as const, stiffness: 300, damping: 20 };

// ── Waveform bars component ──────────────────────────────────────────────────

function WaveformBars({ playing }: { playing: boolean }) {
  const barCount = 5;
  return (
    <div className="flex items-end gap-1 h-8">
      {Array.from({ length: barCount }, (_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-indigo-400"
          animate={
            playing
              ? {
                  height: ['8px', `${16 + Math.sin(i * 1.2) * 12}px`, '8px'],
                }
              : { height: '8px' }
          }
          transition={
            playing
              ? {
                  repeat: Infinity,
                  duration: 0.6 + i * 0.08,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export const ListeningChallenge: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);
  const rounds = useMemo(() => generateRounds(words), [words]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ttsAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
      if (playingTimeoutRef.current) clearTimeout(playingTimeoutRef.current);
    };
  }, []);

  const round = rounds[currentRound];

  const speakWord = useCallback((text: string) => {
    try {
      speak(text);
      setIsPlaying(true);
      if (playingTimeoutRef.current) clearTimeout(playingTimeoutRef.current);
      playingTimeoutRef.current = setTimeout(() => setIsPlaying(false), 1200);
    } catch {
      /* TTS not available */
    }
  }, []);

  // Auto-play the word when round changes
  useEffect(() => {
    if (!rounds[currentRound] || completed) return;
    const delay = setTimeout(() => {
      speakWord(rounds[currentRound].correctWord.english);
      setHasPlayed(true);
    }, 600);
    return () => clearTimeout(delay);
  }, [currentRound, completed, rounds, speakWord]);

  if (words.length < 4) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400 text-center font-medium">
        {t('games.noWordsToReview') || 'No words to review.'}
      </div>
    );
  }

  const handlePlay = () => {
    if (!round) return;
    speakWord(round.correctWord.english);
    setHasPlayed(true);
  };

  const handleSelect = (index: number) => {
    if (feedback !== null || selected !== null) return;
    setSelected(index);

    const isCorrect = round.options[index].english === round.correctWord.english;

    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      onXpEarned?.(10);
      SFX.correct();
    } else {
      setFeedback('wrong');
      SFX.wrong();
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) {
        setShowNoHearts(true);
      }
    }

    advanceTimeoutRef.current = setTimeout(() => {
      if (currentRound + 1 < rounds.length) {
        setCurrentRound((prev) => prev + 1);
        setSelected(null);
        setFeedback(null);
        setHasPlayed(false);
        setIsPlaying(false);
      } else {
        setCompleted(true);
      }
    }, 1800);
  };

  const progress = (currentRound / rounds.length) * 100;

  const handlePlayAgain = () => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    setCurrentRound(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCompleted(false);
    setHasPlayed(false);
    setIsPlaying(false);
  };

  // ── Completion screen ──────────────────────────────────────────────────

  if (completed) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] p-6 bg-gradient-to-b from-sky-50 to-white rounded-3xl relative overflow-hidden">
        {pct >= 90 && <ConfettiRain duration={3000} />}

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={springBounce}
        >
          <motion.span
            className="flex items-center justify-center w-20 h-20 rounded-full bg-sky-100"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...springPop, delay: 0.2 }}
          >
            {pct >= 90 ? (
              <Trophy size={48} className="text-amber-500" />
            ) : pct >= 60 ? (
              <Headphones size={48} className="text-indigo-500" />
            ) : (
              <Check size={48} className="text-emerald-500" />
            )}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">
            {t('games.greatListening') || 'Great Listening!'}
          </h2>

          <p className="text-4xl font-extrabold text-indigo-600">
            {score} / {rounds.length}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springBounce, delay: 0.5 + i * 0.15 }}
              >
                <Star
                  size={32}
                  fill={i < stars ? '#F59E0B' : 'none'}
                  color={i < stars ? '#F59E0B' : '#D1D5DB'}
                />
              </motion.span>
            ))}
          </div>

          <Badge variant="success" icon={<Sparkles size={14} />}>
            +{score * 10} XP
          </Badge>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => onComplete(score, rounds.length)}
              className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl bg-gray-100 text-gray-700 font-semibold text-base hover:bg-gray-200 transition-colors"
            >
              <ArrowRight size={18} />
              {t('games.backToGames') || 'Back'}
            </button>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl bg-indigo-500 text-white font-semibold text-base hover:bg-indigo-600 transition-colors"
            >
              <RotateCcw size={18} />
              {t('games.playAgain') || 'Play Again'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!round) return null;

  return (
    <>
      {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}

      <div
        className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-5 bg-gradient-to-b from-indigo-50 to-white rounded-3xl min-h-[480px]"
        role="application"
        aria-label="Listening challenge game"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {t('games.listenAndPick') || 'Listen & Pick!'}
          </h2>
          <Badge variant="info">
            {currentRound + 1}/{rounds.length}
          </Badge>
        </div>

        {/* Progress bar */}
        <ProgressBar value={progress} variant="success" size="md" animated />

        {/* Speaker area */}
        <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
          <p className="text-base font-medium text-gray-600 text-center">
            {t('games.listenAndPickInstruction') || 'Listen to the word, then pick the right spelling!'}
          </p>

          {/* Main speaker button */}
          <motion.button
            type="button"
            onClick={handlePlay}
            className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-lg shadow-indigo-200 cursor-pointer"
            whileTap={{ scale: 0.92 }}
            animate={
              isPlaying
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={
              isPlaying
                ? { repeat: Infinity, duration: 0.8 }
                : springSmooth
            }
            aria-label="Play the word"
          >
            <Volume2 size={36} />
            {/* Pulsing ring when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-indigo-300"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </motion.button>

          <p className="text-sm text-gray-400 font-medium">
            {hasPlayed
              ? (t('games.playAgainAudio') || 'Tap to listen again')
              : (t('games.listen') || 'Tap to listen')}
          </p>

          {/* Waveform bars */}
          <WaveformBars playing={isPlaying} />

          {!ttsAvailable && (
            <p className="text-sm text-red-400 text-center" aria-live="polite">
              {t('games.noAudioAvailable') || 'Audio not available on this device.'}
            </p>
          )}
        </div>

        {/* Feedback */}
        <div aria-live="assertive" aria-atomic="true" className="min-h-[40px]">
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                key="correct"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 font-semibold justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={springPop}
              >
                <Check size={20} />
                {t('games.yesItWas') || 'Yes! It was'} &ldquo;{round.correctWord.english}&rdquo;!
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div
                key="wrong"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-100 text-red-700 font-semibold justify-center"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <X size={20} />
                {t('games.itWas') || 'It was'} &ldquo;{round.correctWord.english}&rdquo;
                <Lightbulb size={14} className="text-amber-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Option cards in a column */}
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Choose the word you heard">
          <AnimatePresence>
            {round.options.map((option, index) => {
              const isCorrectOption = feedback && option.english === round.correctWord.english;
              const isWrongSelected = feedback === 'wrong' && index === selected;

              return (
                <motion.button
                  type="button"
                  key={`${currentRound}-${index}`}
                  onClick={() => handleSelect(index)}
                  disabled={feedback !== null || !hasPlayed}
                  aria-label={`Option: ${option.english}`}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 min-h-[56px] rounded-2xl border-2 text-left transition-colors ${
                    isCorrectOption
                      ? 'bg-emerald-100 border-emerald-400'
                      : isWrongSelected
                        ? 'bg-red-100 border-red-400'
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  } ${!hasPlayed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isCorrectOption
                      ? { opacity: 1, x: 0, scale: [1, 1.03, 1] }
                      : isWrongSelected
                        ? { opacity: 1, x: [0, -6, 6, -4, 4, 0], scale: 1 }
                        : { opacity: 1, x: 0, scale: 1 }
                  }
                  transition={
                    isCorrectOption || isWrongSelected
                      ? { duration: 0.5 }
                      : { ...springPop, delay: index * 0.08 }
                  }
                  whileTap={hasPlayed && !feedback ? { scale: 0.97 } : undefined}
                >
                  {/* Speaker icon per option */}
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                      isCorrectOption
                        ? 'bg-emerald-200'
                        : isWrongSelected
                          ? 'bg-red-200'
                          : 'bg-gray-100'
                    }`}
                  >
                    {isCorrectOption ? (
                      <Check size={20} className="text-emerald-700" />
                    ) : isWrongSelected ? (
                      <X size={20} className="text-red-700" />
                    ) : (
                      <Volume2 size={18} className="text-gray-400" />
                    )}
                  </span>

                  <span className={`text-lg font-bold ${
                    isCorrectOption
                      ? 'text-emerald-700'
                      : isWrongSelected
                        ? 'text-red-700'
                        : 'text-gray-800'
                  }`}>
                    {option.english}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Listen prompt */}
        {!hasPlayed && (
          <motion.p
            className="text-sm text-center text-indigo-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-live="polite"
          >
            {t('games.pressListenFirst') || 'Press the Listen button first!'}
          </motion.p>
        )}
      </div>
    </>
  );
};

ListeningChallenge.displayName = 'ListeningChallenge';
