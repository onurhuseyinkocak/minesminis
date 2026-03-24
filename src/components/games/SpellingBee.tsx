import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Lightbulb, Volume2, Sparkles, Trophy, Star, Check } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
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
  if (words.length < 1) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Gözden geçirilecek kelime yok.</div>; }
  const { t } = useLanguage();
  const gameWords = useMemo(() => words.slice(0, 5), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [letterPool, setLetterPool] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
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
    setUsedIndices([]);
    setWrongAttempts(0);
    setShowHint(false);
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    initWord(0);
  }, [initWord]);

  const speakWord = useCallback((text: string) => {
    speak(text, 0.9).catch(() => {/* fallback handled inside speak() */});
  }, []);

  const handleLetterTap = (letter: string, poolIndex: number) => {
    if (feedback || usedIndices.includes(poolIndex)) return;
    setTyped((prev) => [...prev, letter]);
    setUsedIndices((prev) => [...prev, poolIndex]);
  };

  const handleBackspace = () => {
    if (feedback || typed.length === 0) return;
    setTyped((prev) => prev.slice(0, -1));
    setUsedIndices((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (feedback) return;
    const attempt = typed.join('').toLowerCase();
    const correct = currentWord.english.toLowerCase();

    if (attempt === correct) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      onXpEarned?.(15);
      SFX.correct();
      speakWord(currentWord.english);

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
      SFX.wrong();
      onWrongAnswer?.();
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      if (newAttempts >= 2) setShowHint(true);

      setTimeout(() => {
        setFeedback(null);
        setTyped([]);
        setUsedIndices([]);
      }, 800);
    }
  };

  const progress = gameWords.length > 0 ? ((currentIndex) / gameWords.length) * 100 : 0;

  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    initWord(0);
  };

  if (completed) {
    const pct = gameWords.length > 0 ? Math.round((score / gameWords.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="spelling-bee">
        <Card variant="elevated" padding="xl" className="spelling-bee__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="spelling-bee__results-content"
          >
            <span className="spelling-bee__big-emoji">
              {pct >= 90 ? <Trophy size={48} color="#E8A317" /> : pct >= 60 ? <Star size={48} fill="#E8A317" color="#E8A317" /> : <Check size={48} color="#22C55E" />}
            </span>
            <h2 className="spelling-bee__results-title">{t('games.spellingStar')}</h2>
            <p className="spelling-bee__results-score">
              {t('games.outOfCorrect').replace('{score}', String(score)).replace('{total}', String(gameWords.length))}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <Star key={i} size={18} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
              ))}
            </span>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
            <div className="spelling-bee__results-actions">
              <button className="spelling-bee__results-btn spelling-bee__results-btn--secondary" onClick={() => onComplete(score, gameWords.length)}>
                {t('games.backToGames')}
              </button>
              <button className="spelling-bee__results-btn spelling-bee__results-btn--primary" onClick={handlePlayAgain}>
                {t('games.playAgain')}
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
    <div className="spelling-bee" role="application" aria-label="Spelling game">
      <div className="spelling-bee__header">
        <h2 className="spelling-bee__title">{t('games.spellIt')}</h2>
        <Badge variant="info">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <Card variant="elevated" padding="lg" className="spelling-bee__prompt">
        <motion.div
          className="spelling-bee__big-emoji"
          key={currentWord.english}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900 }}
        >
          {currentWord.english.charAt(0).toUpperCase()}
        </motion.div>
        <p className="spelling-bee__turkish">{currentWord.turkish}</p>
        <Button
          variant="ghost"
          size="lg"
          icon={<Volume2 size={24} />}
          onClick={() => speakWord(currentWord.english)}
          aria-label="Listen to pronunciation"
        >
          {t('games.listen')}
        </Button>
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
          "{sentence}"
        </motion.p>
      )}

      {feedback === 'wrong' && (
        <motion.p
          className="spelling-bee__try-again"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -6, 0] }}
        >
          {t('games.almostTryAgain')}
        </motion.p>
      )}

      <div className="spelling-bee__tiles" role="group" aria-label="Available letters">
        <AnimatePresence>
          {letterPool.map((letter, i) => (
            <motion.button
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
  );
};

SpellingBee.displayName = 'SpellingBee';
