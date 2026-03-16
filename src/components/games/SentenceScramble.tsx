import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Lightbulb, Sparkles } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import './SentenceScramble.css';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface GameProps {
  words: WordItem[];
  onComplete: (score: number, totalPossible: number) => void;
  onXpEarned?: (xp: number) => void;
}

interface SentenceData {
  sentence: string;
  words: string[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSentences(wordItems: WordItem[]): SentenceData[] {
  const templates = [
    (w: string) => `The ${w} is big`,
    (w: string) => `I like the ${w}`,
    (w: string) => `This is a ${w}`,
    (w: string) => `I see a ${w}`,
    (w: string) => `The ${w} is here`,
    (w: string) => `Look at the ${w}`,
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

export const SentenceScramble: React.FC<GameProps> = ({ words, onComplete, onXpEarned }) => {
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

  const currentSentence = sentences[currentIndex];

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

  const handleCheck = () => {
    if (feedback) return;
    const attempt = placed.join(' ');
    const correct = currentSentence.sentence;

    if (attempt === correct) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      onXpEarned?.(15);

      if (window.speechSynthesis) {
        const utter = new SpeechSynthesisUtterance(correct);
        utter.lang = 'en-US';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
      }

      setTimeout(() => {
        if (currentIndex + 1 < sentences.length) {
          setCurrentIndex((prev) => prev + 1);
          initSentence(currentIndex + 1);
        } else {
          setCompleted(true);
          onComplete(score + 1, sentences.length);
        }
      }, 2000);
    } else {
      setFeedback('wrong');
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

  const progress = (currentIndex / sentences.length) * 100;

  if (completed) {
    return (
      <div className="sentence-scramble">
        <Card variant="elevated" padding="xl" className="sentence-scramble__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="sentence-scramble__results-content"
          >
            <span className="sentence-scramble__big-emoji" role="img" aria-label="star">⭐</span>
            <h2 className="sentence-scramble__results-title">Sentence Master!</h2>
            <p className="sentence-scramble__results-score">
              {score} out of {sentences.length} sentences!
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentSentence) return null;

  return (
    <div className="sentence-scramble" role="application" aria-label="Sentence scramble game">
      <div className="sentence-scramble__header">
        <h2 className="sentence-scramble__title">Build the Sentence!</h2>
        <Badge variant="info">{currentIndex + 1}/{sentences.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {showHint && (
        <motion.div
          className="sentence-scramble__hint"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lightbulb size={18} />
          Hint: The sentence starts with "{currentSentence.words[0]}"
        </motion.div>
      )}

      <Card variant="outlined" padding="lg" className="sentence-scramble__dropzone">
        <p className="sentence-scramble__dropzone-label">
          {placed.length === 0 ? 'Tap words below to build your sentence' : 'Your sentence:'}
        </p>
        <div className="sentence-scramble__placed" aria-live="polite">
          <AnimatePresence>
            {placed.map((word, index) => (
              <motion.button
                key={`placed-${index}-${word}`}
                className="sentence-scramble__chip sentence-scramble__chip--placed"
                onClick={() => handleRemoveWord(word, index)}
                aria-label={`Remove ${word}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileTap={{ scale: 0.9 }}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {feedback === 'correct' && (
        <motion.div
          className="sentence-scramble__feedback sentence-scramble__feedback--correct"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle size={22} /> Perfect sentence! 🌟
        </motion.div>
      )}

      {feedback === 'wrong' && (
        <motion.div
          className="sentence-scramble__feedback sentence-scramble__feedback--wrong"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -6, 0] }}
        >
          Not quite! Keep trying! 💪
        </motion.div>
      )}

      <div className="sentence-scramble__available" role="group" aria-label="Available words">
        <AnimatePresence>
          {available.map((word, index) => (
            <motion.button
              key={`avail-${index}-${word}`}
              className="sentence-scramble__chip sentence-scramble__chip--available"
              onClick={() => handleWordTap(word, index)}
              disabled={!!feedback}
              aria-label={`Add word: ${word}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.9 }}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="sentence-scramble__actions">
        <Button
          variant="ghost"
          size="lg"
          icon={<RotateCcw size={20} />}
          onClick={handleReset}
          disabled={placed.length === 0 || !!feedback}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="xl"
          onClick={handleCheck}
          disabled={placed.length !== currentSentence.words.length || !!feedback}
        >
          Check!
        </Button>
      </div>
    </div>
  );
};

SentenceScramble.displayName = 'SentenceScramble';
