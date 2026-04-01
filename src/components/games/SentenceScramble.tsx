import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Lightbulb, Sparkles, Star, Trophy, Check, ArrowRight } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';

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

interface SentenceData {
  sentence: string;
  words: string[];
}

function shuffleArray<T>(arr: T[]): T[] {
  if (arr.length <= 1) return [...arr];
  let shuffled: T[];
  let attempts = 0;
  do {
    shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
  } while (
    attempts < 10 &&
    arr.length > 1 &&
    shuffled.every((v, i) => v === arr[i])
  );
  return shuffled;
}

function articleFor(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

function generateSentences(wordItems: WordItem[]): SentenceData[] {
  const templates = [
    (w: string) => `I like the ${w}`,
    (w: string) => `This is ${articleFor(w)} ${w}`,
    (w: string) => `I see ${articleFor(w)} ${w}`,
    (w: string) => `Look at the ${w}`,
    (w: string) => `I have ${articleFor(w)} ${w}`,
    (w: string) => `We can see the ${w}`,
  ];

  return wordItems.slice(0, 5).map((item, i) => {
    const template = templates[i % templates.length];
    const sentence = template(item.english.toLowerCase());
    return {
      sentence,
      words: sentence.split(' '),
    };
  });
}

// Grammar color hints for word types
function getWordColor(word: string, _index: number, _total: number): string {
  const lower = word.toLowerCase();
  const pronouns = ['i', 'we', 'you', 'he', 'she', 'it', 'they'];
  const articles = ['a', 'an', 'the'];
  const verbs = ['like', 'is', 'see', 'look', 'have', 'can'];
  const prepositions = ['at'];

  if (pronouns.includes(lower)) return '#6366f1'; // indigo for pronouns
  if (articles.includes(lower)) return '#f59e0b'; // amber for articles
  if (verbs.includes(lower)) return '#10b981'; // green for verbs
  if (prepositions.includes(lower)) return '#8b5cf6'; // purple for prepositions
  return '#3b82f6'; // blue for nouns (default)
}

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

export const SentenceScramble: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);
  const sentences = useMemo(() => generateSentences(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(() =>
    shuffleArray(sentences[0]?.words || [])
  );
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSentence = sentences[currentIndex];

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initSentence = useCallback((index: number) => {
    const s = sentences[index];
    if (!s) return;
    setPlaced([]);
    setAvailable(shuffleArray(s.words));
    setFeedback(null);
    setShowHint(false);
    setFailedAttempts(0);
  }, [sentences]);

  const handleWordTap = (word: string, fromIndex: number) => {
    if (feedback) return;
    setPlaced((prev) => [...prev, word]);
    setAvailable((prev) => prev.filter((_, i) => i !== fromIndex));
  };

  const handleRemoveWord = (word: string, fromIndex: number) => {
    if (feedback) return;
    setAvailable((prev) => [...prev, word]);
    setPlaced((prev) => prev.filter((_, i) => i !== fromIndex));
  };

  const handlePlacedKeyDown = (e: React.KeyboardEvent, word: string, index: number) => {
    if (feedback) return;
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      setPlaced((prev) => {
        const next = [...prev];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        return next;
      });
    } else if (e.key === 'ArrowRight' && index < placed.length - 1) {
      e.preventDefault();
      setPlaced((prev) => {
        const next = [...prev];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        return next;
      });
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      handleRemoveWord(word, index);
    }
  };

  const normalizeForCheck = (s: string) =>
    s.trim().toLowerCase().replace(/[.,!?;:'"]+$/g, '');

  const handleCheck = () => {
    if (feedback) return;
    const attempt = normalizeForCheck(placed.join(' '));
    const correct = normalizeForCheck(currentSentence.sentence);

    if (attempt === correct) {
      setFeedback('correct');
      setScore((prev) => {
        const newScore = prev + 1;

        if (window.speechSynthesis) {
          const utter = new SpeechSynthesisUtterance(currentSentence.sentence);
          utter.lang = 'en-US';
          utter.rate = 0.8;
          window.speechSynthesis.speak(utter);
        }

        setTimeout(() => {
          if (currentIndex + 1 < sentences.length) {
            setCurrentIndex((ci) => ci + 1);
            initSentence(currentIndex + 1);
          } else {
            setCompleted(true);
            autoCompleteTimeoutRef.current = setTimeout(
              () => onComplete(newScore, sentences.length),
              4000
            );
          }
        }, 2000);

        return newScore;
      });
      onXpEarned?.(15);
      SFX.correct();
    } else {
      setFeedback('wrong');
      SFX.wrong();
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) {
        setShowNoHearts(true);
      }
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 1) setShowHint(true);

      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const handleReset = () => {
    if (feedback) return;
    setAvailable(shuffleArray(currentSentence.words));
    setPlaced([]);
  };

  const progress = sentences.length > 0 ? (currentIndex / sentences.length) * 100 : 0;

  if (words.length < 1 || sentences.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400 text-center">
        {t('games.noWordsToReview')}
      </div>
    );
  }

  if (completed) {
    const pct = sentences.length > 0 ? Math.round((score / sentences.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={springBounce}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-5"
        >
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...springBounce, delay: 0.2 }}
          >
            {pct >= 90 ? <Trophy size={48} className="text-amber-500" /> : pct >= 60 ? <Star size={48} className="text-amber-500 fill-amber-500" /> : <Check size={48} className="text-emerald-500" />}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">{t('games.sentenceMaster')}</h2>
          <p className="text-lg text-gray-500">
            {t('games.outOfSentences').replace('{score}', String(score)).replace('{total}', String(sentences.length))}
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
            +{score * 15} XP
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, sentences.length); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowRight size={16} /> {t('games.backToGames')}
            </button>
            <button
              type="button"
              onClick={() => { if (autoCompleteTimeoutRef.current) { clearTimeout(autoCompleteTimeoutRef.current); autoCompleteTimeoutRef.current = null; } setCurrentIndex(0); setScore(0); setCompleted(false); initSentence(0); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
            >
              <RotateCcw size={16} /> {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentSentence) return null;

  return (
    <>
      {showNoHearts && (
        <NoHeartsModal onClose={() => setShowNoHearts(false)} />
      )}
      <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto" role="application" aria-label="Sentence scramble game">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{t('games.buildTheSentence')}</h2>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {currentIndex + 1}/{sentences.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={springGentle}
          />
        </div>

        {/* Hint */}
        {showHint && (
          <motion.div
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springGentle}
          >
            <Lightbulb size={18} className="text-amber-500 shrink-0" />
            {t('games.hintSentenceStartsWith').replace('{word}', currentSentence.words[0])}
          </motion.div>
        )}

        {/* Sentence drop zone */}
        <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-4 min-h-[80px]">
          <p className="text-xs font-medium text-gray-400 mb-2">
            {placed.length === 0 ? t('games.tapWordsBelow') : t('games.yourSentence')}
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Build your sentence"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence>
              {placed.map((word, index) => (
                <motion.button
                  type="button"
                  key={`placed-${index}-${word}`}
                  role="listitem"
                  className="px-4 py-2.5 min-h-[48px] rounded-xl font-semibold text-white shadow-sm cursor-pointer select-none"
                  style={{ backgroundColor: getWordColor(word, index, placed.length) }}
                  onClick={() => handleRemoveWord(word, index)}
                  onKeyDown={(e) => handlePlacedKeyDown(e, word, index)}
                  aria-label={`${word}, position ${index + 1} of ${placed.length}. Press Backspace to remove, Arrow keys to reorder.`}
                  aria-pressed={true}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springBounce}
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Feedback */}
        <div aria-live="polite" aria-atomic="true" className="min-h-[40px]">
          {feedback === 'correct' && (
            <motion.div
              className="flex items-center gap-2 justify-center py-2 px-4 bg-emerald-50 text-emerald-700 rounded-xl font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springBounce}
            >
              <CheckCircle size={22} /> {t('games.perfectSentence')}
            </motion.div>
          )}

          {feedback === 'wrong' && (
            <motion.div
              className="flex items-center justify-center py-2 px-4 bg-red-50 text-red-600 rounded-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -6, 6, -6, 0] }}
              transition={{ duration: 0.4 }}
            >
              {t('games.notQuiteKeepTrying')}
            </motion.div>
          )}
        </div>

        {/* Available words bank */}
        <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Available words">
          <AnimatePresence>
            {available.map((word, index) => (
              <motion.button
                type="button"
                key={`avail-${index}-${word}`}
                role="listitem"
                className="px-4 py-2.5 min-h-[48px] rounded-xl bg-gray-100 text-gray-700 font-semibold border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer select-none disabled:opacity-40"
                onClick={() => handleWordTap(word, index)}
                disabled={!!feedback}
                aria-label={`Add word: ${word}`}
                aria-pressed={false}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ ...springGentle, delay: index * 0.05 }}
                whileTap={{ scale: 0.9 }}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={placed.length === 0 || !!feedback}
            className="flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-30"
          >
            <RotateCcw size={20} />
            {t('games.reset')}
          </button>
          <button
            type="button"
            onClick={handleCheck}
            disabled={placed.length !== currentSentence.words.length || !!feedback}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          >
            {t('games.checkExcl')}
          </button>
        </div>
      </div>
    </>
  );
};

SentenceScramble.displayName = 'SentenceScramble';
