import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, Headphones, Lightbulb, Star, Trophy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
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
  onWrongAnswer?: () => void;
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

  const round = rounds[currentRound];

  const speakWord = useCallback((text: string) => {
    try {
      speak(text);
    } catch {
      /* TTS not available — fail silently */
    }
  }, []);

  if (words.length < 2) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('games.noWordsToReview') || 'No words to review.'}</div>; }

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
      onXpEarned?.(12);
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

  const handlePlayAgain = () => {
    setCurrentRound(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCompleted(false);
    setHasPlayed(false);
  };

  if (completed) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="listening-challenge">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl" className="listening-challenge__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="listening-challenge__results-content"
          >
            <motion.span
              className="listening-challenge__results-icon"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? <Trophy size={48} color="#E8A317" /> : pct >= 60 ? <Headphones size={48} color="var(--primary)" /> : <Check size={48} color="#22C55E" />}
            </motion.span>
            <h2 className="listening-challenge__results-title">{t('games.greatListening') || 'Great Listening!'}</h2>
            <p className="listening-challenge__results-score">
              {score} / {rounds.length}
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
              +{score * 12} XP
            </Badge>
            <div className="listening-challenge__results-actions">
              <button type="button" className="listening-challenge__results-btn listening-challenge__results-btn--secondary" onClick={() => onComplete(score, rounds.length)}>
                <ArrowRight size={16} /> {t('games.backToGames') || 'Back'}
              </button>
              <button type="button" className="listening-challenge__results-btn listening-challenge__results-btn--primary" onClick={handlePlayAgain}>
                <RotateCcw size={16} /> {t('games.playAgain') || 'Play Again'}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!round) return null;

  return (
    <>
    {showNoHearts && (
      <NoHeartsModal onClose={() => setShowNoHearts(false)} />
    )}
    <div className="listening-challenge" role="application" aria-label="Listening challenge game">
      <div className="listening-challenge__header">
        <h2 className="listening-challenge__title">{t('games.listenAndPick') || 'Listen & Pick!'}</h2>
        <Badge variant="info">{currentRound + 1}/{rounds.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <Card variant="elevated" padding="lg" className="listening-challenge__speaker">
        <p className="listening-challenge__instruction">
          {t('games.listenAndPickInstruction') || 'Listen to the word, then pick the right picture!'}
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
            {hasPlayed ? (t('games.playAgainAudio') || 'Play Again') : (t('games.listen') || 'Listen')}
          </Button>
        </motion.div>
      </Card>

      <div aria-live="assertive" aria-atomic="true">
        {feedback === 'correct' && (
          <motion.div
            className="listening-challenge__feedback listening-challenge__feedback--correct"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {t('games.yesItWas') || 'Yes! It was'} &ldquo;{round.correctWord.english}&rdquo;!
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="listening-challenge__feedback listening-challenge__feedback--wrong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('games.itWas') || 'It was'} &ldquo;{round.correctWord.english}&rdquo; <Lightbulb size={14} color="#E8A317" />
          </motion.div>
        )}
      </div>

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
                type="button"
                key={`${currentRound}-${index}`}
                className={optionClass}
                onClick={() => handleSelect(index)}
                disabled={feedback !== null || !hasPlayed}
                aria-label={`Option: ${option.english}`}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`listening-challenge__option-emoji${option.emoji ? '' : ' listening-challenge__option-emoji--fallback'}`}
                >{option.emoji || option.english[0].toUpperCase()}</span>
                <span className="listening-challenge__option-label">{option.english}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {!hasPlayed && (
        <p className="listening-challenge__prompt-listen" aria-live="polite">
          {t('games.pressListenFirst') || 'Press the Listen button first!'}
        </p>
      )}
    </div>
    </>
  );
};

ListeningChallenge.displayName = 'ListeningChallenge';
