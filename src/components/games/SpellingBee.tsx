import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Lightbulb, Sparkles, Trophy, Star, Check, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speakElevenLabs } from '../../services/ttsService';
import { SpeakButton } from '../SpeakButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import './SpellingBee.css';

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

// Confusable letter pairs — pedagogically harder distractors that look/sound similar.
// Prioritised over random alphabet picks so children learn discrimination.
const CONFUSABLE_PAIRS: Record<string, string[]> = {
  B: ['D', 'P'], D: ['B', 'T'], P: ['B', 'D'], Q: ['G', 'O'],
  M: ['N', 'W'], N: ['M', 'H'], W: ['M', 'V'], V: ['W', 'U'],
  U: ['V', 'O'], O: ['Q', 'C'], C: ['G', 'O'], G: ['C', 'Q'],
  I: ['L', 'J'], L: ['I', 'F'], F: ['E', 'P'], E: ['F', 'B'],
  S: ['C', 'Z'], Z: ['S', 'X'], T: ['F', 'D'], H: ['N', 'M'],
  R: ['P', 'N'], K: ['X', 'R'], X: ['K', 'Z'], Y: ['V', 'W'],
  A: ['E', 'O'],
};

function generateLetterPool(word: string): string[] {
  const letters = word.toUpperCase().split('');
  const uniqueLetters = new Set(letters);
  const decoys: string[] = [];

  // 1. Prefer confusable letters that are NOT already in the word
  for (const letter of uniqueLetters) {
    if (decoys.length >= 3) break;
    const candidates = (CONFUSABLE_PAIRS[letter] || []).filter(
      c => !uniqueLetters.has(c) && !decoys.includes(c)
    );
    if (candidates.length > 0) {
      decoys.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
  }

  // 2. Fill remaining slots with common English letters (not obscure like Q/X/Z)
  const commonLetters = 'RSTLNEASIDMOBCFGHKPUWY';
  let idx = 0;
  while (decoys.length < 3 && idx < commonLetters.length) {
    const l = commonLetters[idx++];
    if (!uniqueLetters.has(l) && !decoys.includes(l)) {
      decoys.push(l);
    }
  }

  const pool = [...letters, ...decoys];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export const SpellingBee: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);
  const gameWords = useMemo(() => words.slice(0, 5), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [letterPool, setLetterPool] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  // scoreRef mirrors score state so async callbacks always read the latest value
  // without depending on stale closures — fixes the onComplete(score + 1, ...) stale read
  const scoreRef = useRef(0);
  const [completed, setCompleted] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = gameWords[currentIndex];

  const initWord = useCallback((index: number) => {
    const word = gameWords[index];
    if (!word) return;
    setLetterPool(generateLetterPool(word.english));
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
    speakElevenLabs(text, 0.9).catch(() => {/* fallback handled inside speakElevenLabs() */});
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

  // Use a ref for submit so the keyboard handler always gets the latest version
  const submitRef = useRef<() => void>(() => {});

  const handleSubmit = useCallback(() => {
    if (feedback) return;
    // Trim and normalize both sides — guards against accidental whitespace in word data
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
          // Use scoreRef to avoid stale closure — score state may not have updated yet
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
  // scoreRef is a ref — not a reactive dep. score state removed to avoid stale read.
  }, [feedback, typed, currentWord, onXpEarned, speakWord, currentIndex, gameWords.length, initWord, onComplete, loseHeart, onWrongAnswer, hearts, wrongAttempts]);

  submitRef.current = handleSubmit;

  // Physical keyboard support — uses stable ref to avoid stale closures
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
        // Find first unused pool letter matching this key
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

  // Progress: show how many questions have been completed, not the current index raw
  // At question 1 (index 0) → 0%, at question 2 → 20%, at finish → 100%
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

  if (words.length < 2) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('games.noWordsToReview')}</div>; }

  if (completed) {
    const pct = gameWords.length > 0 ? Math.round((score / gameWords.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="spelling-bee">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl" className="spelling-bee__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="spelling-bee__results-content"
          >
            <motion.span
              className="spelling-bee__big-emoji"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? <Trophy size={48} color="var(--warning)" /> : pct >= 60 ? <Star size={48} fill="var(--warning)" color="var(--warning)" /> : <Check size={48} color="var(--success)" />}
            </motion.span>
            <h2 className="spelling-bee__results-title">{t('games.spellingStar')}</h2>
            <p className="spelling-bee__results-score">
              {t('games.outOfCorrect').replace('{score}', String(score)).replace('{total}', String(gameWords.length))}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.5 + i * 0.15 }}
                >
                  <Star size={32} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
                </motion.span>
              ))}
            </span>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
            <div className="spelling-bee__results-actions">
              <button type="button" className="spelling-bee__results-btn spelling-bee__results-btn--secondary" onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, gameWords.length); }}>
                <ArrowRight size={16} /> {t('games.backToGames')}
              </button>
              <button type="button" className="spelling-bee__results-btn spelling-bee__results-btn--primary" onClick={handlePlayAgain} autoFocus>
                <RotateCcw size={16} /> {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  const sentence = EXAMPLE_SENTENCES[currentWord.english.toLowerCase()] || `I like ${currentWord.english}.`;

  return (
    <>
    {showNoHearts && (
      <NoHeartsModal onClose={() => setShowNoHearts(false)} />
    )}
    <div className="spelling-bee" role="application" aria-label="Spelling game">
      <div className="spelling-bee__header">
        <h2 className="spelling-bee__title">{t('games.spellIt')}</h2>
        <Badge variant="info">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <Card variant="elevated" padding="lg" className="spelling-bee__prompt">
        <motion.div
          className={`spelling-bee__big-emoji${currentWord.emoji ? '' : ' spelling-bee__big-emoji--fallback'}`}
          key={currentWord.english}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {currentWord.emoji || currentWord.english.charAt(0).toUpperCase()}
        </motion.div>
        <p id="sb-word-prompt" className="spelling-bee__turkish">{currentWord.turkish}</p>
        <SpeakButton
          text={currentWord.english}
          size="lg"
          variant="labeled"
          aria-label="Listen to pronunciation"
        />
      </Card>

      {showHint && (
        <motion.div
          className="spelling-bee__hint"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lightbulb size={18} />
          {t('games.hintStartsWith').replace('{letter}', currentWord.english[0].toUpperCase())}
        </motion.div>
      )}

      <div
        className="spelling-bee__answer"
        aria-label="Spelling input"
        aria-describedby="sb-word-prompt"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentWord.english.split('').map((letter, i) => {
          const isReveal = feedback === 'wrong' && wrongAttempts >= 2;
          return (
            <div
              key={i}
              className={[
                'spelling-bee__slot',
                (typed[i] || isReveal) && 'spelling-bee__slot--filled',
                feedback === 'correct' && 'spelling-bee__slot--correct',
                feedback === 'wrong' && !isReveal && typed[i] && 'spelling-bee__slot--wrong',
                isReveal && 'spelling-bee__slot--reveal',
              ].filter(Boolean).join(' ')}
            >
              {isReveal ? letter.toUpperCase() : (typed[i] || '')}
            </div>
          );
        })}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {feedback === 'correct' && (
          <motion.div
            className="spelling-bee__feedback-banner spelling-bee__feedback-banner--correct"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Icon + color: not color alone — for protanopia/deuteranopia users */}
            <CheckCircle2 size={18} aria-hidden="true" />
            <p className="spelling-bee__sentence">"{sentence}"</p>
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="spelling-bee__feedback-banner spelling-bee__feedback-banner--wrong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -6, 6, -6, 0] }}
          >
            {/* Icon + color: not color alone — for protanopia/deuteranopia users */}
            <XCircle size={18} aria-hidden="true" />
            <p className="spelling-bee__try-again" style={{ margin: 0 }}>
              {wrongAttempts >= 2
                ? `${t('games.theAnswerWas') || 'The answer was'}: ${currentWord.english.toUpperCase()}`
                : t('games.almostTryAgain')}
            </p>
          </motion.div>
        )}
      </div>

      <div className="spelling-bee__tiles" role="group" aria-label="Available letters">
        <AnimatePresence>
          {letterPool.map((letter, i) => (
            <motion.button
              type="button"
              key={`${letter}-${i}`}
              className={[
                'spelling-bee__tile',
                usedIndices.includes(i) && 'spelling-bee__tile--used',
              ].filter(Boolean).join(' ')}
              onClick={() => handleLetterTap(letter, i)}
              disabled={usedIndices.includes(i) || !!feedback}
              aria-label={`Letter ${letter}`}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {letter}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="spelling-bee__actions">
        <Button
          variant="ghost"
          size="lg"
          icon={<Delete size={20} />}
          onClick={handleBackspace}
          disabled={typed.length === 0 || !!feedback}
          aria-label="Remove last letter"
        >
          {t('common.back')}
        </Button>
        <Button
          variant="primary"
          size="xl"
          onClick={handleSubmit}
          disabled={typed.length !== currentWord.english.length || !!feedback}
        >
          {t('games.check')}
        </Button>
      </div>
    </div>
    </>
  );
};

SpellingBee.displayName = 'SpellingBee';
