import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, X, Volume2, ArrowLeft, RotateCcw, Merge } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { speak } from '../../services/ttsService';
import { Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';

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

// ── Helpers ──────────────────────────────────────────────────────────────────

const TILE_COLORS = [
  { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  { bg: '#FCE7F3', border: '#EC4899', text: '#9D174D' },
  { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
  { bg: '#EDE9FE', border: '#8B5CF6', text: '#5B21B6' },
  { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
];

function getTileColor(index: number) {
  return TILE_COLORS[index % TILE_COLORS.length];
}

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

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'explore' | 'blending' | 'blended' | 'choices';
type OptionState = 'idle' | 'correct' | 'wrong';

// ── Spring configs ───────────────────────────────────────────────────────────

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springSmooth = { type: 'spring' as const, stiffness: 260, damping: 28 };
const springPop = { type: 'spring' as const, stiffness: 300, damping: 20 };

// ── Component ────────────────────────────────────────────────────────────────

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

  const blendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        autoCompleteTimeoutRef.current = setTimeout(() => onComplete(nextScore, questions.length), 4000);
      } else {
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
      SFX.click();
      try { speak(currentQuestion.sounds[index]); } catch { /* silent */ }
    },
    [phase, currentQuestion],
  );

  const handleBlend = useCallback(() => {
    if (phase !== 'explore') return;
    setPhase('blending');

    blendTimeoutRef.current = setTimeout(() => {
      setPhase('blended');
      SFX.correct();
      try { speak(currentQuestion.word); } catch { /* silent */ }

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
  }, [resetTileState]);

  // ── Completion screen ──────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] p-6 bg-gradient-to-b from-amber-50 to-white rounded-3xl relative overflow-hidden">
        {pct >= 90 && <ConfettiRain />}

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={springBounce}
        >
          <UnifiedMascot state="celebrating" size={120} />

          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
            {pct >= 90 ? (
              <Trophy size={40} className="text-amber-500" />
            ) : pct >= 60 ? (
              <Star size={40} className="text-amber-500 fill-amber-500" />
            ) : (
              <Check size={40} className="text-emerald-500" />
            )}
          </span>

          <h2 className="text-2xl font-bold text-gray-800">
            {t('games.greatJob')}
          </h2>

          <p className="text-4xl font-extrabold text-indigo-600">
            {score} / {questions.length}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springBounce, delay: 0.3 + i * 0.15 }}
              >
                <Star
                  size={32}
                  fill={i < stars ? '#F59E0B' : 'none'}
                  color={i < stars ? '#F59E0B' : '#D1D5DB'}
                />
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springPop, delay: 0.75 }}
          >
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 10} XP
            </Badge>
          </motion.div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                onComplete(score, questions.length);
              }}
              className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl bg-gray-100 text-gray-700 font-semibold text-base hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={18} />
              {t('games.backToGames')}
            </button>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl bg-indigo-500 text-white font-semibold text-base hover:bg-indigo-600 transition-colors"
            >
              <RotateCcw size={18} />
              {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const allTilesTapped = tappedTiles.size >= currentQuestion.sounds.length;
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  return (
    <div
      className="flex flex-col gap-5 p-5 bg-gradient-to-b from-sky-50 to-white rounded-3xl min-h-[480px]"
      role="application"
      aria-label="Phonics blend game"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          {t('games.phonicsBlending') || 'Phonics Blending'}
        </h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" className="min-h-[40px]">
        <AnimatePresence>
          {showFeedback === 'correct' && (
            <motion.div
              key="correct"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 font-semibold text-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={springSmooth}
            >
              <Check size={20} /> {t('games.amazing')}
            </motion.div>
          )}
          {showFeedback === 'wrong' && (
            <motion.div
              key="wrong"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-100 text-red-700 font-semibold text-center justify-center"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <X size={20} /> {t('games.tryAgainYouGotThis')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentIndex}`}
          className="flex flex-col items-center gap-5"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={springSmooth}
        >
          {/* Instruction */}
          <p className="text-base font-medium text-gray-600 text-center" aria-live="polite">
            {phase === 'explore' && (t('games.tapEachSound') || 'Tap each sound to hear it, then press Blend!')}
            {phase === 'blending' && (t('games.blending') || 'Blending...')}
            {phase === 'blended' && `${t('games.theWordIs') || 'The word is:'} ${currentQuestion.word}`}
            {phase === 'choices' && (t('games.whichWordBlend') || 'Which word did you blend?')}
          </p>

          {/* Sound tiles */}
          {(phase === 'explore' || phase === 'blending') && (
            <div
              className="flex items-center justify-center gap-3 flex-wrap"
              role="group"
              aria-label="Sound tiles"
            >
              {currentQuestion.sounds.map((sound, index) => {
                const color = getTileColor(index);
                const isActive = activeTileIndex === index;
                const isTapped = tappedTiles.has(index);

                return (
                  <motion.button
                    key={`${currentQuestion.id}-sound-${index}`}
                    type="button"
                    onClick={() => handleTileTap(index)}
                    disabled={phase === 'blending'}
                    aria-label={`Sound: ${sound}`}
                    className="flex flex-col items-center justify-center min-w-[72px] min-h-[80px] px-4 py-3 rounded-2xl border-2 font-bold text-2xl cursor-pointer select-none transition-shadow"
                    style={{
                      backgroundColor: isTapped ? color.bg : '#F9FAFB',
                      borderColor: isTapped ? color.border : '#E5E7EB',
                      color: color.text,
                      boxShadow: isActive ? `0 0 0 3px ${color.border}40` : 'none',
                    }}
                    animate={
                      phase === 'blending'
                        ? { x: index === 0 ? 0 : -(index * 24), scale: 0.9 }
                        : isActive
                          ? { scale: 1.1 }
                          : { scale: 1 }
                    }
                    whileTap={{ scale: 0.9 }}
                    transition={springBounce}
                    layout
                  >
                    <span className="text-2xl leading-none">{sound}</span>
                    <Volume2
                      size={14}
                      className="mt-1 opacity-50"
                    />
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Blended word display */}
          {phase === 'blended' && (
            <motion.div
              className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springPop}
            >
              <span className="text-4xl font-extrabold text-indigo-700">
                {currentQuestion.word}
              </span>
              <span className="text-sm text-indigo-500 font-medium">
                {currentQuestion.wordTr}
              </span>
            </motion.div>
          )}

          {/* Blend button */}
          {phase === 'explore' && (
            <div className="flex flex-col items-center gap-2">
              <motion.button
                type="button"
                onClick={handleBlend}
                disabled={!allTilesTapped}
                className={`flex items-center gap-2 px-8 py-3 min-h-[48px] rounded-2xl font-bold text-lg transition-all ${
                  allTilesTapped
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                whileTap={allTilesTapped ? { scale: 0.95 } : undefined}
                transition={springSmooth}
                aria-label="Blend sounds together"
              >
                <Merge size={20} />
                {t('games.blend') || 'Blend!'}
              </motion.button>
              {!allTilesTapped && (
                <p className="text-sm text-gray-400 font-medium">
                  {t('games.tapAllSoundsFirst') || `Tap all ${currentQuestion.sounds.length} sounds first`}
                </p>
              )}
            </div>
          )}

          {/* Multiple choice options */}
          {phase === 'choices' && (
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm" role="group" aria-label="Choose the blended word">
              {options.map((option, idx) => {
                const state: OptionState = optionStates[option] ?? 'idle';
                const isCorrect = state === 'correct';
                const isWrong = state === 'wrong';

                return (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleOptionPress(option)}
                    disabled={answered && state === 'idle'}
                    aria-pressed={state !== 'idle'}
                    className={`flex items-center justify-center gap-2 px-4 py-4 min-h-[56px] rounded-2xl border-2 font-bold text-lg transition-colors ${
                      isCorrect
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                        : isWrong
                          ? 'bg-red-100 border-red-400 text-red-700'
                          : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={
                      isCorrect
                        ? { opacity: 1, y: 0, scale: [1, 1.1, 1] }
                        : isWrong
                          ? { opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -4, 4, 0] }
                          : { opacity: 1, y: 0, scale: 1 }
                    }
                    transition={
                      isCorrect || isWrong
                        ? { duration: 0.5 }
                        : { ...springPop, delay: idx * 0.08 }
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCorrect && <Check size={20} />}
                    {isWrong && <X size={20} />}
                    {option}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Difficulty + Mascot */}
          <div className="flex items-center justify-between w-full mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-100 text-emerald-700'
                  : currentQuestion.difficulty === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
              }`}
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
