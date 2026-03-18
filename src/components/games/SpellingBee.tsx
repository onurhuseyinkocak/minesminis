import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Lightbulb, Volume2, Sparkles } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
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

function generateLetterPool(word: string): string[] {
  const letters = word.toUpperCase().split('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const decoys: string[] = [];

  while (decoys.length < 3) {
    const l = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!letters.includes(l) && !decoys.includes(l)) {
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

export const SpellingBee: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const gameWords = useMemo(() => words.slice(0, 5), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [letterPool, setLetterPool] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentWord = gameWords[currentIndex];

  const initWord = useCallback((index: number) => {
    const word = gameWords[index];
    if (!word) return;
    setLetterPool(generateLetterPool(word.english));
    setTyped([]);
    setUsedIndices(new Set());
    setWrongAttempts(0);
    setShowHint(false);
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    initWord(0);
  }, [initWord]);

  const speak = useCallback((text: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.7;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const handleLetterTap = (letter: string, poolIndex: number) => {
    if (feedback || usedIndices.has(poolIndex)) return;
    setTyped((prev) => [...prev, letter]);
    setUsedIndices((prev) => new Set(prev).add(poolIndex));
  };

  const handleBackspace = () => {
    if (feedback || typed.length === 0) return;
    const lastUsedIndex = Array.from(usedIndices).pop();
    setTyped((prev) => prev.slice(0, -1));
    setUsedIndices((prev) => {
      const next = new Set(prev);
      if (lastUsedIndex !== undefined) next.delete(lastUsedIndex);
      return next;
    });
  };

  const handleSubmit = () => {
    if (feedback) return;
    const attempt = typed.join('').toLowerCase();
    const correct = currentWord.english.toLowerCase();

    if (attempt === correct) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      onXpEarned?.(15);
      speak(currentWord.english);

      setTimeout(() => {
        if (currentIndex + 1 < gameWords.length) {
          setCurrentIndex((prev) => prev + 1);
          initWord(currentIndex + 1);
        } else {
          setCompleted(true);
          onComplete(score + 1, gameWords.length);
        }
      }, 2000);
    } else {
      setFeedback('wrong');
      onWrongAnswer?.();
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      if (newAttempts >= 2) setShowHint(true);

      setTimeout(() => {
        setFeedback(null);
        setTyped([]);
        setUsedIndices(new Set());
      }, 800);
    }
  };

  const progress = ((currentIndex) / gameWords.length) * 100;

  if (completed) {
    return (
      <div className="spelling-bee">
        <Card variant="elevated" padding="xl" className="spelling-bee__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="spelling-bee__results-content"
          >
            <span className="spelling-bee__big-emoji" role="img" aria-label="trophy">🏆</span>
            <h2 className="spelling-bee__results-title">Spelling Star!</h2>
            <p className="spelling-bee__results-score">
              {score} out of {gameWords.length} correct!
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  const sentence = EXAMPLE_SENTENCES[currentWord.english.toLowerCase()] || `I like ${currentWord.english}.`;

  return (
    <div className="spelling-bee" role="application" aria-label="Spelling game">
      <div className="spelling-bee__header">
        <h2 className="spelling-bee__title">Spell It!</h2>
        <Badge variant="info">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <Card variant="elevated" padding="lg" className="spelling-bee__prompt">
        <motion.span
          className="spelling-bee__big-emoji"
          key={currentWord.emoji}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          role="img"
          aria-label={currentWord.english}
        >
          {currentWord.emoji}
        </motion.span>
        <p className="spelling-bee__turkish">{currentWord.turkish}</p>
        <Button
          variant="ghost"
          size="lg"
          icon={<Volume2 size={24} />}
          onClick={() => speak(currentWord.english)}
          aria-label="Listen to pronunciation"
        >
          Listen
        </Button>
      </Card>

      {showHint && (
        <motion.div
          className="spelling-bee__hint"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lightbulb size={18} />
          Hint: starts with "{currentWord.english[0].toUpperCase()}"
        </motion.div>
      )}

      <div className="spelling-bee__answer" aria-live="polite">
        {currentWord.english.split('').map((_, i) => (
          <div
            key={i}
            className={[
              'spelling-bee__slot',
              typed[i] && 'spelling-bee__slot--filled',
              feedback === 'correct' && 'spelling-bee__slot--correct',
              feedback === 'wrong' && typed[i] && 'spelling-bee__slot--wrong',
            ].filter(Boolean).join(' ')}
          >
            {typed[i] || ''}
          </div>
        ))}
      </div>

      {feedback === 'correct' && (
        <motion.p
          className="spelling-bee__sentence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          "{sentence}" 🌟
        </motion.p>
      )}

      {feedback === 'wrong' && (
        <motion.p
          className="spelling-bee__try-again"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -6, 0] }}
        >
          Almost! Try again! 💪
        </motion.p>
      )}

      <div className="spelling-bee__tiles" role="group" aria-label="Available letters">
        <AnimatePresence>
          {letterPool.map((letter, i) => (
            <motion.button
              key={`${letter}-${i}`}
              className={[
                'spelling-bee__tile',
                usedIndices.has(i) && 'spelling-bee__tile--used',
              ].filter(Boolean).join(' ')}
              onClick={() => handleLetterTap(letter, i)}
              disabled={usedIndices.has(i) || !!feedback}
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
          Back
        </Button>
        <Button
          variant="primary"
          size="xl"
          onClick={handleSubmit}
          disabled={typed.length !== currentWord.english.length || !!feedback}
        >
          Check!
        </Button>
      </div>
    </div>
  );
};

SpellingBee.displayName = 'SpellingBee';
