import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Star, Trophy, Check, Sparkles, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import type { KidsWord } from '../../data/wordsData';
import { ConfettiRain } from '../ui/Celebrations';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';

interface SentenceEntry {
  words: string[];
  bank: string[];
  emoji: string;
  hint: string;
}

const SENTENCES: SentenceEntry[] = [
  { words: ['The', 'cat', 'sits'], bank: ['The', 'cat', 'sits', 'runs', 'big', 'a'], emoji: '', hint: 'cat' },
  { words: ['A', 'dog', 'runs'], bank: ['A', 'dog', 'runs', 'sits', 'the', 'cat'], emoji: '', hint: 'dog' },
  { words: ['The', 'sun', 'is', 'hot'], bank: ['The', 'sun', 'is', 'hot', 'cold', 'big', 'a'], emoji: '', hint: 'sun' },
  { words: ['I', 'see', 'a', 'fish'], bank: ['I', 'see', 'a', 'fish', 'big', 'run', 'the'], emoji: '', hint: 'fish' },
  { words: ['She', 'has', 'a', 'hat'], bank: ['She', 'has', 'a', 'hat', 'he', 'big', 'the'], emoji: '', hint: 'hat' },
  { words: ['The', 'hen', 'can', 'run'], bank: ['The', 'hen', 'can', 'run', 'sit', 'a', 'big'], emoji: '', hint: 'hen' },
];

interface SentenceBuilderProps {
  words?: KidsWord[];
  onComplete: (score: number, total: number) => void;
}

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

export default function SentenceBuilder({ onComplete }: SentenceBuilderProps) {
  const { t } = useLanguage();
  const { hearts, loseHeart } = useHearts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  currentIndexRef.current = currentIndex;
  const sentence = SENTENCES[currentIndex];
  const total = SENTENCES.length;

  const handleBankTap = (word: string, idx: number) => {
    if (usedIndices.includes(idx)) return;
    if (selected.length >= sentence.words.length) return;
    if (feedback) return;
    setSelected((prev) => [...prev, word]);
    setUsedIndices((prev) => [...prev, idx]);
  };

  const handleUndo = () => {
    if (selected.length === 0 || feedback) return;
    setUsedIndices((prev) => prev.slice(0, -1));
    setSelected((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (selected.length !== sentence.words.length) return;
    const isCorrect = selected.every(
      (w, i) => w.toLowerCase() === sentence.words[i].toLowerCase()
    );
    if (isCorrect) {
      setFeedback('correct');
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        feedbackTimerRef.current = setTimeout(() => {
          setFeedback(null);
          setSelected([]);
          setUsedIndices([]);
          if (currentIndexRef.current + 1 >= total) {
            setCompleted(true);
            autoCompleteTimeoutRef.current = setTimeout(
              () => onComplete(newScore, total),
              4000
            );
          } else {
            setCurrentIndex((p) => p + 1);
          }
        }, 1000);
        return newScore;
      });
    } else {
      const gameOver = hearts <= 1;
      loseHeart();
      setFeedback('wrong');
      if (gameOver) {
        setScore((currentScore) => {
          feedbackTimerRef.current = setTimeout(() => {
            setCompleted(true);
            autoCompleteTimeoutRef.current = setTimeout(
              () => onComplete(currentScore, total),
              4000
            );
          }, 1200);
          return currentScore;
        });
      } else {
        feedbackTimerRef.current = setTimeout(() => {
          setFeedback(null);
          setSelected([]);
          setUsedIndices([]);
        }, 800);
      }
    }
  }, [selected, sentence.words, total, onComplete, hearts, loseHeart]);

  // Completion screen
  if (completed) {
    const pct = Math.round((score / total) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const resultLabel =
      pct >= 80
        ? t('games.sentenceBuilderExcellent')
        : pct >= 60
          ? t('games.sentenceBuilderGoodJob')
          : t('games.sentenceBuilderTryAgain');
    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={springBounce}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-5"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springBounce, delay: 0.2 }}
          >
            {pct >= 90 ? <Trophy size={48} className="text-amber-500" /> : pct >= 60 ? <Star size={48} className="text-amber-500 fill-amber-500" /> : <Check size={48} className="text-emerald-500" />}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">{resultLabel}</h2>
          <p className="text-lg text-gray-500">
            {t('games.sentenceBuilderCorrectOf')
              .replace('{score}', String(score))
              .replace('{total}', String(total))}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springBounce, delay: 0.5 + i * 0.15 }}
              >
                <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <Sparkles size={14} />
            +{score * 10} XP
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                onComplete(score, total);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowRight size={16} /> {t('games.backToGames')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                setCompleted(false);
                setCurrentIndex(0);
                setScore(0);
                setSelected([]);
                setUsedIndices([]);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
            >
              <RotateCcw size={16} /> {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = (currentIndex / total) * 100;

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto">
      {/* Header: progress bar + hearts */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={springGentle}
          />
        </div>
        <div className="flex gap-1" aria-label={`Hearts: ${Math.min(hearts, 3)} of 3`}>
          {Array.from({ length: 3 }, (_, i) => (
            <Heart
              key={i}
              size={20}
              className={i < Math.min(hearts, 3) ? 'text-red-400 fill-red-400' : 'text-gray-200'}
            />
          ))}
        </div>
      </div>

      {/* Scene with hint */}
      <div className="flex flex-col items-center gap-2 py-3">
        <p className="text-sm font-medium text-gray-500">{t('games.completeSentence')}</p>
      </div>

      {/* Answer slots */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sentence.words.map((_, i) => {
          const isFilled = !!selected[i];
          const isCorrectFb = feedback === 'correct';
          const isWrongFb = feedback === 'wrong';

          return (
            <motion.div
              key={i}
              className={`
                px-4 py-2.5 min-h-[48px] min-w-[56px] rounded-xl border-2 flex items-center justify-center font-semibold text-base
                ${isFilled ? 'bg-white border-indigo-300 text-gray-800' : 'bg-gray-50 border-dashed border-gray-300 text-transparent'}
                ${isCorrectFb && isFilled ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : ''}
                ${isWrongFb && isFilled ? 'bg-red-50 border-red-300 text-red-600' : ''}
              `}
              animate={
                isCorrectFb && isFilled
                  ? { scale: [1, 1.1, 1], transition: springBounce }
                  : isWrongFb && isFilled
                    ? { x: [0, -4, 4, -4, 0] }
                    : {}
              }
            >
              {selected[i] ?? '\u00A0'}
            </motion.div>
          );
        })}
      </div>

      {/* Undo button */}
      <AnimatePresence>
        {selected.length > 0 && !feedback && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-4 py-2 min-h-[48px] rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition-colors"
            >
              <Undo2 size={18} />
              {t('games.undoWord')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {sentence.bank.map((word, idx) => {
          const isUsed = usedIndices.includes(idx);
          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => handleBankTap(word, idx)}
              disabled={isUsed || !!feedback}
              className={`
                px-4 py-2.5 min-h-[48px] rounded-xl font-semibold text-base border-2 transition-all select-none
                ${isUsed
                  ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-default'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer shadow-sm'
                }
              `}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springGentle, delay: idx * 0.04 }}
              whileTap={isUsed ? {} : { scale: 0.92 }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

SentenceBuilder.displayName = 'SentenceBuilder';
