import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface BlendingBoardProps {
  words: WordItem[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

function splitToSounds(word: string): string[] {
  const digraphs = ['sh', 'ch', 'th', 'ng', 'ck', 'qu', 'ai', 'ee', 'oo', 'or', 'ar', 'er', 'ou', 'oi', 'ue', 'ie', 'oa'];
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

interface SoundTile {
  id: number;
  sound: string;
  placed: boolean;
}

export const BlendingBoard: React.FC<BlendingBoardProps> = ({ words, onComplete, onWrongAnswer }) => {
  const { t } = useLanguage();
  const gameWords = useMemo(() => words.slice(0, 5).map(w => typeof w === 'string' ? w : w.english), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tiles, setTiles] = useState<SoundTile[]>([]);
  const [strip, setStrip] = useState<(SoundTile | null)[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'merged' | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentWord = gameWords[currentIndex] || '';
  const sounds = useMemo(() => splitToSounds(currentWord), [currentWord]);

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
    const s = splitToSounds(word);
    const newTiles: SoundTile[] = s.map((sound, i) => ({ id: i, sound, placed: false }));
    setTiles(shuffleArray(newTiles));
    setStrip(Array(s.length).fill(null));
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    initWord(0);
  }, [initWord]);

  const handleTileTap = (tile: SoundTile) => {
    if (tile.placed || feedback) return;

    const nextSlot = strip.findIndex((s) => s === null);
    if (nextSlot === -1) return;

    // Check if this is the correct sound for this slot
    if (tile.sound.toLowerCase() !== sounds[nextSlot].toLowerCase()) {
      setFeedback('wrong');
      onWrongAnswer?.();
      setTimeout(() => setFeedback(null), 600);
      return;
    }

    // Place tile
    const newStrip = [...strip];
    newStrip[nextSlot] = tile;
    setStrip(newStrip);
    setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, placed: true } : t)));

    // Speak the sound
    speak(tile.sound, 0.6);

    // Check if complete
    const allPlaced = newStrip.every((s) => s !== null);
    if (allPlaced) {
      setTimeout(() => {
        setFeedback('merged');
        speak(currentWord, 0.8);
      }, 500);

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
            <span style={{ fontSize: '4rem' }} role="img" aria-label="celebration">🎉</span>
            <h2 style={{ color: '#1A6B5A', margin: '0.5rem 0' }}>{t('games.blendingStar')}</h2>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>
              {t('games.wordsBlended').replace('{score}', String(score)).replace('{total}', String(gameWords.length))}
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
      aria-label="Sound blending game"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ color: '#1A6B5A', margin: 0, fontSize: '1.4rem' }}>{t('games.blendTheSounds')}</h2>
        <Badge variant="info">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Blending strip */}
      <Card variant="elevated" padding="lg">
        <div
          style={{
            display: 'flex',
            gap: feedback === 'merged' ? '0px' : '0.75rem',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '4rem',
            transition: 'gap 0.5s ease',
          }}
        >
          {strip.map((tile, i) => (
            <motion.div
              key={i}
              layout
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: feedback === 'merged' ? '0.25rem' : '0.75rem',
                border: tile ? '3px solid #1A6B5A' : '3px dashed #ccc',
                backgroundColor: tile
                  ? feedback === 'merged'
                    ? '#1A6B5A'
                    : '#E8F5E9'
                  : '#fafafa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: feedback === 'merged' ? '#fff' : '#1A6B5A',
              }}
            >
              {tile?.sound || ''}
            </motion.div>
          ))}
        </div>
        {feedback === 'merged' && (
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#1A6B5A', margin: '0.5rem 0 0' }}
          >
            {currentWord}!
          </motion.p>
        )}
      </Card>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -8, 0] }}
            exit={{ opacity: 0 }}
            style={{
              color: '#d32f2f',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {t('games.tryAnotherSound')} 💪
          </motion.div>
        )}
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#1A6B5A', fontWeight: 700, fontSize: '1.1rem' }}
          >
            {t('games.amazing')} 🌟
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound tiles */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
        }}
        role="group"
        aria-label="Sound tiles"
      >
        {tiles.map((tile) => (
          <motion.button
            key={tile.id}
            onClick={() => handleTileTap(tile)}
            disabled={tile.placed || !!feedback}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: tile.placed ? 0.3 : 1,
              scale: tile.placed ? 0.8 : 1,
            }}
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '1rem',
              border: 'none',
              backgroundColor: tile.placed ? '#e0e0e0' : '#E8A317',
              color: tile.placed ? '#999' : '#fff',
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'Nunito, sans-serif',
              cursor: tile.placed ? 'default' : 'pointer',
              boxShadow: tile.placed ? 'none' : '0 4px 12px rgba(232,163,23,0.3)',
            }}
            aria-label={`Sound: ${tile.sound}`}
          >
            {tile.sound}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

BlendingBoard.displayName = 'BlendingBoard';
