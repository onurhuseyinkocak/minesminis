import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, Headphones } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import './ListeningChallenge.css';

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

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Round {
  correctWord: WordItem;
  options: WordItem[];
}

function generateRounds(words: WordItem[]): Round[] {
  const selected = shuffleArray(words).slice(0, 5);
  return selected.map((word) => {
    const distractors = shuffleArray(words.filter((w) => w.english !== word.english)).slice(0, 3);
    const options = shuffleArray([word, ...distractors]);
    return { correctWord: word, options };
  });
}

export const ListeningChallenge: React.FC<GameProps> = ({ words, onComplete, onXpEarned }) => {
  const rounds = useMemo(() => generateRounds(words), [words]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const round = rounds[currentRound];

  const speak = useCallback((text: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.65;
      utter.pitch = 1.1;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const handlePlay = () => {
    if (!round) return;
    speak(round.correctWord.english);
    setHasPlayed(true);
  };

  const handleSelect = (index: number) => {
    if (feedback !== null || selected !== null) return;
    setSelected(index);

    const isCorrect = round.options[index].english === round.correctWord.english;

    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      onXpEarned?.(12);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentRound + 1 < rounds.length) {
        setCurrentRound((prev) => prev + 1);
        setSelected(null);
        setFeedback(null);
        setHasPlayed(false);
      } else {
        setCompleted(true);
        const finalScore = isCorrect ? score + 1 : score;
        onComplete(finalScore, rounds.length);
      }
    }, 1800);
  };

  const progress = (currentRound / rounds.length) * 100;

  if (completed) {
    return (
      <div className="listening-challenge">
        <Card variant="elevated" padding="xl" className="listening-challenge__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="listening-challenge__results-content"
          >
            <Headphones size={48} className="listening-challenge__results-icon" />
            <h2 className="listening-challenge__results-title">Great Listening!</h2>
            <p className="listening-challenge__results-score">
              {score} out of {rounds.length} correct!
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 12} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!round) return null;

  return (
    <div className="listening-challenge" role="application" aria-label="Listening challenge game">
      <div className="listening-challenge__header">
        <h2 className="listening-challenge__title">Listen & Pick!</h2>
        <Badge variant="info">{currentRound + 1}/{rounds.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <Card variant="elevated" padding="lg" className="listening-challenge__speaker">
        <p className="listening-challenge__instruction">
          Listen to the word, then pick the right picture!
        </p>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="primary"
            size="xl"
            icon={<Volume2 size={28} />}
            onClick={handlePlay}
            className="listening-challenge__play-btn"
            aria-label="Play the word"
          >
            {hasPlayed ? 'Play Again' : 'Listen'}
          </Button>
        </motion.div>
      </Card>

      {feedback === 'correct' && (
        <motion.div
          className="listening-challenge__feedback listening-challenge__feedback--correct"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Yes! It was "{round.correctWord.english}"! 🌟
        </motion.div>
      )}

      {feedback === 'wrong' && (
        <motion.div
          className="listening-challenge__feedback listening-challenge__feedback--wrong"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          It was "{round.correctWord.english}" {round.correctWord.emoji} 💡
        </motion.div>
      )}

      <div className="listening-challenge__options" role="radiogroup" aria-label="Choose the word you heard">
        <AnimatePresence>
          {round.options.map((option, index) => {
            let optionClass = 'listening-challenge__option';
            if (feedback && option.english === round.correctWord.english) {
              optionClass += ' listening-challenge__option--correct';
            } else if (feedback === 'wrong' && index === selected) {
              optionClass += ' listening-challenge__option--wrong';
            }

            return (
              <motion.button
                key={`${currentRound}-${index}`}
                className={optionClass}
                onClick={() => handleSelect(index)}
                disabled={feedback !== null || !hasPlayed}
                aria-label={`Option: ${option.english}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="listening-challenge__option-emoji">{option.emoji}</span>
                <span className="listening-challenge__option-label">{option.english}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {!hasPlayed && (
        <p className="listening-challenge__prompt-listen" aria-live="polite">
          Press the Listen button first!
        </p>
      )}
    </div>
  );
};

ListeningChallenge.displayName = 'ListeningChallenge';
