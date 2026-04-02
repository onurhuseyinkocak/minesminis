import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Lightbulb, Sparkles, Trophy, Star, Check, ArrowRight, RotateCcw, CheckCircle2, XCircle, Volume2, SkipForward } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speakElevenLabs } from '../../services/ttsService';
import { SpeakButton } from '../SpeakButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import { getQuestionsCountForAge } from '../../services/ageGroupService';

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
  ageGroup?: string;
}

const EXAMPLE_SENTENCES: Record<string, string> = {
  cat: 'The cat is sleeping.',
  dog: 'The dog is happy.',
  bird: 'A bird can fly.',
  fish: 'The fish swims fast.',
  tree: 'The tree is tall.',
  book: 'I read a book.',
  sun: 'The sun is bright.',
  moon: 'The moon is round.',
  star: 'I see a star.',
  apple: 'I eat an apple.',
};

// Confusable letter pairs for pedagogically harder distractors
const CONFUSABLE_PAIRS: Record<string, string[]> = {
  B: ['D', 'P'], D: ['B', 'T'], P: ['B', 'D'], Q: ['G', 'O'],
  M: ['N', 'W'], N: ['M', 'H'], W: ['M', 'V'], V: ['W', 'U'],
  U: ['V', 'O'], O: ['Q', 'C'], C: ['G', 'O'], G: ['C', 'Q'],
  I: ['L', 'J'], L: ['I', 'F'], F: ['E', 'P'], E: ['F', 'B'],
  S: ['C', 'Z'], Z: ['S', 'X'], T: ['F', 'D'], H: ['N', 'M'],
  R: ['P', 'N'], K: ['X', 'R'], X: ['K', 'Z'], Y: ['V', 'W'],
  A: ['E', 'O'],
};

function generateLetterPool(word: string, maxDistractors: number = 3): string[] {
  const letters = word.toUpperCase().split('');
  const uniqueLetters = new Set(letters);
  const decoys: string[] = [];

  for (const letter of uniqueLetters) {
    if (decoys.length >= maxDistractors) break;
    const candidates = (CONFUSABLE_PAIRS[letter] || []).filter(
      c => !uniqueLetters.has(c) && !decoys.includes(c)
    );
    if (candidates.length > 0) {
      decoys.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
  }

  const commonLetters = 'RSTLNEASIDMOBCFGHKPUWY';
  let idx = 0;
  while (decoys.length < maxDistractors && idx < commonLetters.length) {
    const l = commonLetters[idx++];
    if (!uniqueLetters.has(l) && !decoys.includes(l)) {
      decoys.push(l);
    }
  }

  const pool = [...letters, ...decoys];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export const SpellingBee: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer, ageGroup }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);
  const age = ageGroup || '7-9';
  const questionsCount = getQuestionsCountForAge(age);
  // For age 3-5: only 2-3 extra distractor letters; older: more
  const maxDistractors = age === '3-5' ? 2 : age === '5-7' ? 3 : 3;
  const gameWords = useMemo(() => words.slice(0, questionsCount), [words, questionsCount]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [letterPool, setLetterPool] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [completed, setCompleted] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = gameWords[currentIndex];

  const initWord = useCallback((index: number) => {
    const word = gameWords[index];
    if (!word) return;
    setLetterPool(generateLetterPool(word.english, maxDistractors));
    setTyped([]);
    setUsedIndices([]);
    setWrongAttempts(0);
    setShowHint(false);
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    initWord(0);
  }, [initWord]);

  const speakWord = useCallback((text: string) => {
    speakElevenLabs(text, 0.9).catch(() => {/* fallback handled inside */});
  }, []);

  const handleLetterTap = useCallback((letter: string, poolIndex: number) => {
    if (usedIndices.includes(poolIndex)) return;
    setTyped((prev) => [...prev, letter]);
    setUsedIndices((prev) => [...prev, poolIndex]);
  }, [usedIndices]);

  const handleBackspace = useCallback(() => {
    setTyped((prev) => prev.slice(0, -1));
    setUsedIndices((prev) => prev.slice(0, -1));
  }, []);

  const submitRef = useRef<() => void>(() => {});

  const handleSubmit = useCallback(() => {
    if (feedback) return;
    const attempt = typed.join('').trim().toLowerCase();
    const correct = currentWord.english.trim().toLowerCase();

    if (attempt === correct) {
      setFeedback('correct');
      scoreRef.current += 1;
      setScore(scoreRef.current);
      onXpEarned?.(15);
      SFX.correct();
      speakWord(currentWord.english);

      setTimeout(() => {
        if (currentIndex + 1 < gameWords.length) {
          setCurrentIndex((prev) => prev + 1);
          initWord(currentIndex + 1);
        } else {
          setCompleted(true);
          const finalScore = scoreRef.current;
          autoCompleteTimeoutRef.current = setTimeout(() => onComplete(finalScore, gameWords.length), 4000);
        }
      }, 2000);
    } else {
      setFeedback('wrong');
      SFX.wrong();
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) {
        setShowNoHearts(true);
      }
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      if (newAttempts >= 2) setShowHint(true);

      setTimeout(() => {
        setFeedback(null);
        setTyped([]);
        setUsedIndices([]);
      }, 800);
    }
  }, [feedback, typed, currentWord, onXpEarned, speakWord, currentIndex, gameWords.length, initWord, onComplete, loseHeart, onWrongAnswer, hearts, wrongAttempts]);

  submitRef.current = handleSubmit;

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed || feedback) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key === 'Enter' && typed.length === currentWord?.english.length) {
        e.preventDefault();
        submitRef.current();
        return;
      }

      const key = e.key.toUpperCase();
      if (key.length === 1 && /[A-Z]/.test(key)) {
        const poolIndex = letterPool.findIndex(
          (letter, i) => letter === key && !usedIndices.includes(i)
        );
        if (poolIndex !== -1) {
          handleLetterTap(letterPool[poolIndex], poolIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completed, feedback, typed, letterPool, usedIndices, currentWord, handleBackspace, handleLetterTap]);

  const progress = gameWords.length > 0 ? (currentIndex / gameWords.length) * 100 : 0;

  const handlePlayAgain = () => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    scoreRef.current = 0;
    setScore(0);
    setCompleted(false);
    initWord(0);
  };

  if (words.length < 2) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 text-lg font-medium">
        {t('games.noWordsToReview')}
      </div>
    );
  }

  if (completed) {
    const pct = gameWords.length > 0 ? Math.round((score / gameWords.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="flex flex-col items-center justify-center h-full max-h-full overflow-hidden bg-gradient-to-b from-teal-50 to-emerald-50 p-4">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <motion.div
          className="flex flex-col items-center gap-5 bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          >
            {pct >= 90 ? <Trophy size={56} className="text-amber-400" /> : pct >= 60 ? <Star size={56} className="text-amber-400 fill-amber-400" /> : <Check size={56} className="text-emerald-500" />}
          </motion.div>

          <h2 className="text-2xl font-bold text-slate-800">{t('games.spellingStar')}</h2>

          <p className="text-lg text-slate-500 font-medium">
            {t('games.outOfCorrect').replace('{score}', String(score)).replace('{total}', String(gameWords.length))}
          </p>

          {/* Stars */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.5 + i * 0.15 }}
              >
                <Star size={36} className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
              </motion.span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-sm font-bold px-3 py-1.5 rounded-full">
            <Sparkles size={14} /> +{score * 15} XP
          </span>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px]"
              onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, gameWords.length); }}
            >
              <ArrowRight size={16} /> {t('games.backToGames')}
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/25 min-h-[48px]"
              onClick={handlePlayAgain}
              autoFocus
            >
              <RotateCcw size={16} /> {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentWord) return null;

  const sentence = EXAMPLE_SENTENCES[currentWord.english.toLowerCase()] || `I like ${currentWord.english}.`;
  const isComplete = typed.length === currentWord.english.length;

  return (
    <>
      {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}

      <div className="flex flex-col gap-3 h-full max-h-full overflow-hidden p-4 max-w-lg mx-auto w-full" role="application" aria-label="Spelling game">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">{t('games.spellIt')}</h2>
          <span className="bg-teal-50 text-teal-600 text-sm font-semibold px-3 py-1 rounded-full">
            {currentIndex + 1}/{gameWords.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Audio prompt card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3 flex flex-col items-center gap-2 flex-shrink-0"
          key={currentWord.english}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Speaker button */}
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30 cursor-pointer"
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => speakWord(currentWord.english)}
          >
            <Volume2 size={24} className="text-white" />
          </motion.div>

          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('games.tapToListen')}</p>

          {/* Turkish translation hint */}
          <p id="sb-word-prompt" className="text-lg font-semibold text-slate-700">
            {currentWord.turkish}
          </p>

          <SpeakButton
            text={currentWord.english}
            size="sm"
            variant="labeled"
            aria-label="Listen to pronunciation"
          />
        </motion.div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              className="flex items-center gap-2 bg-amber-50 text-amber-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-amber-200"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Lightbulb size={18} className="text-amber-500 shrink-0" />
              {t('games.hintStartsWith').replace('{letter}', (currentWord.english.charAt(0) || '?').toUpperCase())}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer slots */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap"
          aria-label="Spelling input"
          aria-describedby="sb-word-prompt"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentWord.english.split('').map((letter, i) => {
            const isReveal = feedback === 'wrong' && wrongAttempts >= 2;
            const isCorrect = feedback === 'correct';
            const isWrongChar = feedback === 'wrong' && !isReveal && typed[i];

            return (
              <motion.div
                key={i}
                className={[
                  'w-10 h-12 sm:w-12 sm:h-14 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold border-2 transition-colors',
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    : isReveal
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : isWrongChar
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : typed[i]
                    ? 'bg-white border-teal-400 text-slate-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-300',
                ].join(' ')}
                animate={
                  isCorrect
                    ? { scale: [1, 1.1, 1], transition: { delay: i * 0.05 } }
                    : feedback === 'wrong' && !isReveal
                    ? { x: [0, -4, 4, -4, 0] }
                    : {}
                }
                onClick={() => {
                  // Tap a filled slot to remove that letter
                  if (typed[i] && !feedback) {
                    setTyped(prev => prev.filter((_, idx) => idx !== i));
                    setUsedIndices(prev => prev.filter((_, idx) => idx !== i));
                  }
                }}
              >
                {isReveal ? letter.toUpperCase() : (typed[i] || '')}
              </motion.div>
            );
          })}
        </div>

        {/* Feedback banner */}
        <div aria-live="polite" aria-atomic="true">
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-emerald-200"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CheckCircle2 size={18} aria-hidden="true" />
                <p className="text-sm italic text-emerald-600">&#34;{sentence}&#34;</p>
              </motion.div>
            )}

            {feedback === 'wrong' && (
              <motion.div
                className="flex items-center gap-2 bg-red-50 text-red-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-red-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, x: [0, -6, 6, -6, 0] }}
                exit={{ opacity: 0 }}
              >
                <XCircle size={18} aria-hidden="true" />
                <p className="text-sm" style={{ margin: 0 }}>
                  {wrongAttempts >= 2
                    ? `${t('games.theAnswerWas') || 'The answer was'}: ${currentWord.english.toUpperCase()}`
                    : t('games.almostTryAgain')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Letter tiles grid */}
        <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Available letters">
          <AnimatePresence>
            {letterPool.map((letter, i) => (
              <motion.button
                type="button"
                key={`${letter}-${i}`}
                className={[
                  'w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold transition-all',
                  usedIndices.includes(i)
                    ? 'bg-slate-100 text-slate-300 border-2 border-slate-100 cursor-default'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 shadow-sm cursor-pointer active:scale-90',
                ].join(' ')}
                onClick={() => handleLetterTap(letter, i)}
                disabled={usedIndices.includes(i) || !!feedback}
                aria-label={`Letter ${letter}`}
                whileTap={{ scale: 0.85 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
              >
                {letter}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-1">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleBackspace}
            disabled={typed.length === 0 || !!feedback}
            aria-label="Remove last letter"
          >
            <Delete size={18} /> {t('common.back')}
          </button>
          <button
            type="button"
            className={[
              'flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all min-h-[52px]',
              isComplete && !feedback
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed',
            ].join(' ')}
            onClick={handleSubmit}
            disabled={!isComplete || !!feedback}
          >
            <Check size={18} /> {t('games.check')}
          </button>
        </div>

        {/* Skip button after 2+ wrong attempts */}
        {wrongAttempts >= 2 && !feedback && (
          <div className="flex justify-center mt-1">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
              onClick={() => {
                if (currentIndex + 1 < gameWords.length) {
                  setCurrentIndex((prev) => prev + 1);
                  initWord(currentIndex + 1);
                } else {
                  setCompleted(true);
                  const finalScore = scoreRef.current;
                  autoCompleteTimeoutRef.current = setTimeout(() => onComplete(finalScore, gameWords.length), 4000);
                }
              }}
            >
              <SkipForward size={16} /> {t('games.skipThisWord')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

SpellingBee.displayName = 'SpellingBee';
