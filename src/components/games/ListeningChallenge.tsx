import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, Headphones, Lightbulb, Star, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
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
  const { loseHeart } = useHearts();
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
        <Card variant="elevated" padding="xl" className="listening-challenge__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="listening-challenge__results-content"
          >
            <Headphones size={48} className="listening-challenge__results-icon" />
            <h2 className="listening-challenge__results-title">{t('games.greatListening') || 'Great Listening!'}</h2>
            <p className="listening-challenge__results-score">
              {score} / {rounds.length}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <Star key={i} size={18} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
              ))}
            </span>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 12} XP
            </Badge>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
              <button type="button" className="listening-challenge__results-btn" onClick={() => onComplete(score, rounds.length)} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.75rem', border: '2px solid var(--border, #e2e8f0)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <ArrowLeft size={16} /> {t('games.backToGames') || 'Back'}
              </button>
              <button type="button" className="listening-challenge__results-btn" onClick={handlePlayAgain} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.75rem', border: 'none', background: 'var(--primary, #FF6B35)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="listening-challenge__option-emoji"
                  style={{ background: option.emoji ? 'transparent' : 'var(--primary)', color: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: option.emoji ? '1.4rem' : '1rem', flexShrink: 0 }}
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
  );
};

ListeningChallenge.displayName = 'ListeningChallenge';
