import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Card, Badge, ProgressBar, FloatingEmoji } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';
import './WordMatch.css';

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

interface MatchPair {
  id: number;
  english: string;
  turkish: string;
  emoji: string;
  matched: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const WordMatch: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  if (words.length < 2) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Gözden geçirilecek kelime yok.</div>; }
  const { t } = useLanguage();
  const roundSize = 3;
  const totalRounds = Math.ceil(Math.min(words.length, 6) / roundSize);

  const [round, setRound] = useState(0);
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [leftItems, setLeftItems] = useState<MatchPair[]>([]);
  const [rightItems, setRightItems] = useState<MatchPair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; pairId?: number } | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

  const initRound = useCallback((roundIndex: number) => {
    const start = roundIndex * roundSize;
    const roundWords = words.slice(start, start + roundSize);
    const newPairs: MatchPair[] = roundWords.map((w, i) => ({
      id: i,
      english: w.english,
      turkish: w.turkish,
      emoji: w.emoji,
      matched: false,
    }));
    setPairs(newPairs);
    setLeftItems(shuffleArray(newPairs));
    setRightItems(shuffleArray(newPairs));
    setSelectedLeft(null);
    setSelectedRight(null);
    setFeedback(null);
  }, [words]);

  useEffect(() => {
    initRound(0);
  }, [initRound]);

  const tryMatch = useCallback((leftId: number, rightId: number) => {
    setTotalAttempted((prev) => prev + 1);

    if (leftId === rightId) {
      setScore((prev) => prev + 1);
      setFeedback({ type: 'correct', pairId: leftId });
      onXpEarned?.(10);
      SFX.correct();

      // Floating emoji celebration
      const matchedEmoji = pairs[leftId]?.emoji;
      if (matchedEmoji) {
        setFloatingEmoji(matchedEmoji);
        setTimeout(() => setFloatingEmoji(null), 2200);
      }

      // Speak the word
      if (window.speechSynthesis) {
        const utter = new SpeechSynthesisUtterance(pairs[leftId]?.english || '');
        utter.lang = 'en-US';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
      }

      setPairs((prev) =>
        prev.map((p) => (p.id === leftId ? { ...p, matched: true } : p))
      );

      setTimeout(() => {
        setFeedback(null);
        setSelectedLeft(null);
        setSelectedRight(null);

        const updatedPairs = pairs.map((p) =>
          p.id === leftId ? { ...p, matched: true } : p
        );
        const allMatched = updatedPairs.every((p) => p.matched);

        if (allMatched) {
          if (round + 1 < totalRounds) {
            setRound((prev) => prev + 1);
            initRound(round + 1);
          } else {
            setCompleted(true);
            const finalScore = score + 1;
            const total = totalAttempted + 1;
            onComplete(finalScore, total);
          }
        }
      }, 1200);
    } else {
      setFeedback({ type: 'wrong' });
      onWrongAnswer?.();
      setTimeout(() => {
        setFeedback(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
    }
  }, [pairs, round, totalRounds, score, totalAttempted, onComplete, onXpEarned, onWrongAnswer, initRound]);

  const handleLeftClick = (id: number) => {
    if (pairs[id]?.matched || feedback) return;
    setSelectedLeft(id);
    if (selectedRight !== null) {
      tryMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: number) => {
    if (pairs[id]?.matched || feedback) return;
    setSelectedRight(id);
    if (selectedLeft !== null) {
      tryMatch(selectedLeft, id);
    }
  };

  const progress = ((score) / Math.min(words.length, 6)) * 100;

  const handlePlayAgain = () => {
    setScore(0);
    setTotalAttempted(0);
    setRound(0);
    setCompleted(false);
    initRound(0);
  };

  if (completed) {
    const pct = totalAttempted > 0 ? Math.round((score / Math.min(words.length, 6)) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="word-match">
        <Card variant="elevated" padding="xl" className="word-match__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="word-match__results-content"
          >
            <span className="word-match__results-emoji" role="img" aria-label="celebration">
              {pct >= 90 ? '🏆' : pct >= 60 ? '🎉' : '👏'}
            </span>
            <h2 className="word-match__results-title">{t('games.greatJob')}</h2>
            <p className="word-match__results-score">
              {t('games.youMatched').replace('{score}', String(score)).replace('{total}', String(totalAttempted))}
            </p>
            <div className="word-match__results-stars" aria-label={`${stars} out of 3 stars`}>
              {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
            </div>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 10} XP
            </Badge>
            <div className="word-match__results-actions">
              <button className="word-match__results-btn word-match__results-btn--secondary" onClick={() => onComplete(score, totalAttempted)}>
                {t('games.backToGames')}
              </button>
              <button className="word-match__results-btn word-match__results-btn--primary" onClick={handlePlayAgain}>
                {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <div className="word-match" role="application" aria-label="Word matching game">
      {floatingEmoji && <FloatingEmoji emoji={floatingEmoji} count={5} />}
      <div className="word-match__header">
        <h2 className="word-match__title">{t('games.matchTheWords')}</h2>
        <Badge variant="info">{t('games.round')} {round + 1}/{totalRounds}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {feedback?.type === 'correct' && (
        <motion.div
          className="word-match__feedback word-match__feedback--correct"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle size={24} /> {t('games.amazing')} 🌟
        </motion.div>
      )}

      {feedback?.type === 'wrong' && (
        <motion.div
          className="word-match__feedback word-match__feedback--wrong"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -8, 8, -8, 0] }}
          exit={{ opacity: 0 }}
        >
          {t('games.tryAgainYouGotThis')} 💪
        </motion.div>
      )}

      <div className="word-match__board">
        <div className="word-match__column" aria-label="English words">
          <AnimatePresence>
            {leftItems.map((item) => (
              <motion.button
                key={`left-${item.id}`}
                className={[
                  'word-match__card',
                  'word-match__card--left',
                  selectedLeft === item.id && 'word-match__card--selected',
                  item.matched && 'word-match__card--matched',
                  feedback?.type === 'correct' && feedback.pairId === item.id && 'word-match__card--flash',
                ].filter(Boolean).join(' ')}
                onClick={() => handleLeftClick(item.id)}
                disabled={item.matched || !!feedback}
                aria-label={`English: ${item.english}`}
                aria-pressed={selectedLeft === item.id}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="word-match__card-emoji">{item.emoji}</span>
                <span className="word-match__card-text">{item.english}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="word-match__column" aria-label="Turkish translations">
          <AnimatePresence>
            {rightItems.map((item) => (
              <motion.button
                key={`right-${item.id}`}
                className={[
                  'word-match__card',
                  'word-match__card--right',
                  selectedRight === item.id && 'word-match__card--selected',
                  item.matched && 'word-match__card--matched',
                  feedback?.type === 'correct' && feedback.pairId === item.id && 'word-match__card--flash',
                ].filter(Boolean).join(' ')}
                onClick={() => handleRightClick(item.id)}
                disabled={item.matched || !!feedback}
                aria-label={`Turkish: ${item.turkish}`}
                aria-pressed={selectedRight === item.id}
                layout
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="word-match__card-emoji">{item.emoji}</span>
                <span className="word-match__card-text">{item.turkish}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

WordMatch.displayName = 'WordMatch';
