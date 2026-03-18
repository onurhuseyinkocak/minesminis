import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';

interface SegmentingBoardProps {
  words: string[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

const WORD_EMOJIS: Record<string, string> = {
  cat: '🐱', dog: '🐶', hat: '🎩', sun: '☀️', pig: '🐷',
  hen: '🐔', bug: '🐛', cup: '☕', red: '🔴', map: '🗺️',
  fish: '🐟', ship: '🚢', shop: '🏪', chip: '🍟', ring: '💍',
  tree: '🌳', rain: '🌧️', moon: '🌙', book: '📖', feet: '🦶',
};

function splitToSounds(word: string): string[] {
  const digraphs = ['sh', 'ch', 'th', 'ng', 'ck', 'qu', 'ai', 'ee', 'oo', 'or', 'ar', 'er', 'ou', 'oi'];
  const sounds: string[] = [];
  let i = 0;
  while (i < word.length) {
    const pair = word.slice(i, i + 2).toLowerCase();
    if (i + 1 < word.length && digraphs.includes(pair)) {
      sounds.push(word.slice(i, i + 2));
      i += 2;
    } else {
      sounds.push(word[i]);
      i += 1;
    }
  }
  return sounds;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const SegmentingBoard: React.FC<SegmentingBoardProps> = ({ words, onComplete, onWrongAnswer }) => {
  const gameWords = useMemo(() => words.slice(0, 5), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sounds, setSounds] = useState<string[]>([]);
  const [options, setOptions] = useState<{ id: number; sound: string; used: boolean }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'explode' | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentWord = gameWords[currentIndex] || '';
  const emoji = WORD_EMOJIS[currentWord.toLowerCase()] || '📝';

  const speak = useCallback((text: string, rate = 0.7) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const initWord = useCallback((index: number) => {
    const word = gameWords[index];
    if (!word) return;
    const wordSounds = splitToSounds(word);
    setSounds(wordSounds);

    // Create options: correct sounds + a few decoys
    const decoys = ['p', 'b', 'k', 'z', 'w', 'f', 'l', 'r', 'n', 'm']
      .filter((d) => !wordSounds.includes(d))
      .slice(0, 2);
    const allOptions = [...wordSounds, ...decoys].map((s, i) => ({ id: i, sound: s, used: false }));
    setOptions(shuffleArray(allOptions));
    setSelected([]);
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    initWord(0);
  }, [initWord]);

  const handleOptionTap = (opt: { id: number; sound: string; used: boolean }) => {
    if (opt.used || feedback) return;

    const nextSlotIndex = selected.length;
    const expectedSound = sounds[nextSlotIndex];

    if (opt.sound.toLowerCase() !== expectedSound.toLowerCase()) {
      setFeedback('wrong');
      onWrongAnswer?.();
      setTimeout(() => setFeedback(null), 600);
      return;
    }

    const newSelected = [...selected, opt.sound];
    setSelected(newSelected);
    setOptions((prev) => prev.map((o) => (o.id === opt.id ? { ...o, used: true } : o)));

    speak(opt.sound, 0.6);

    // All sounds placed
    if (newSelected.length === sounds.length) {
      setTimeout(() => {
        setFeedback('explode');
      }, 400);

      setTimeout(() => {
        setScore((prev) => prev + 1);
        setFeedback('correct');
        SFX.correct();
      }, 1500);

      setTimeout(() => {
        if (currentIndex + 1 < gameWords.length) {
          setCurrentIndex((prev) => prev + 1);
          initWord(currentIndex + 1);
        } else {
          setCompleted(true);
          onComplete(score + 1, gameWords.length);
        }
      }, 2500);
    }
  };

  const progress = (currentIndex / gameWords.length) * 100;

  if (completed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
        <Card variant="elevated" padding="xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{ textAlign: 'center' }}
          >
            <span style={{ fontSize: '4rem' }} role="img" aria-label="celebration">🎊</span>
            <h2 style={{ color: '#1A6B5A', margin: '0.5rem 0' }}>Sound Smasher!</h2>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>
              {score} out of {gameWords.length} words segmented!
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.5rem',
        fontFamily: 'Nunito, sans-serif',
      }}
      role="application"
      aria-label="Sound segmenting game"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ color: '#1A6B5A', margin: 0, fontSize: '1.4rem' }}>Break the Word!</h2>
        <Badge variant="info">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Word display */}
      <Card variant="elevated" padding="lg">
        <div style={{ textAlign: 'center' }}>
          <motion.span
            key={currentWord}
            initial={{ scale: 0 }}
            animate={feedback === 'explode' ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { scale: 1 }}
            transition={feedback === 'explode' ? { duration: 0.6 } : { type: 'spring', stiffness: 300 }}
            style={{ fontSize: '3.5rem', display: 'block' }}
          >
            {emoji}
          </motion.span>

          {feedback !== 'explode' && (
            <motion.p
              style={{ fontSize: '2rem', fontWeight: 800, color: '#1A6B5A', margin: '0.5rem 0 0' }}
            >
              {currentWord}
            </motion.p>
          )}

          <Button
            variant="ghost"
            size="md"
            onClick={() => speak(currentWord, 0.8)}
            style={{ marginTop: '0.25rem' }}
          >
            🔊 Listen
          </Button>
        </div>
      </Card>

      {/* Sound hint */}
      <p style={{ color: '#888', fontSize: '1rem', margin: 0, fontWeight: 600 }}>
        This word has {sounds.length} sounds:{' '}
        {sounds.map((_, i) => (
          <span key={i} style={{ margin: '0 0.15rem' }}>
            {selected[i] ? (
              <span style={{ color: '#1A6B5A', fontWeight: 800 }}>{selected[i]}</span>
            ) : (
              '_'
            )}
          </span>
        ))}
      </p>

      {/* Explode animation */}
      <AnimatePresence>
        {feedback === 'explode' && (
          <motion.div
            style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sounds.map((s, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0, y: [0, -20, 0] }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#E8A317',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -8, 0] }}
            exit={{ opacity: 0 }}
            style={{ color: '#d32f2f', fontWeight: 600 }}
          >
            Try another sound! 💪
          </motion.div>
        )}
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#1A6B5A', fontWeight: 700, fontSize: '1.1rem' }}
          >
            You broke it! 🌟
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound options */}
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}
        role="group"
        aria-label="Sound options"
      >
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => handleOptionTap(opt)}
            disabled={opt.used || !!feedback}
            whileTap={{ scale: 0.9 }}
            animate={{
              opacity: opt.used ? 0.3 : 1,
              scale: opt.used ? 0.8 : 1,
            }}
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '1rem',
              border: 'none',
              backgroundColor: opt.used ? '#e0e0e0' : '#E8A317',
              color: opt.used ? '#999' : '#fff',
              fontSize: '1.3rem',
              fontWeight: 800,
              fontFamily: 'Nunito, sans-serif',
              cursor: opt.used ? 'default' : 'pointer',
              boxShadow: opt.used ? 'none' : '0 4px 12px rgba(232,163,23,0.3)',
            }}
            aria-label={`Sound: ${opt.sound}`}
          >
            {opt.sound}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

SegmentingBoard.displayName = 'SegmentingBoard';
