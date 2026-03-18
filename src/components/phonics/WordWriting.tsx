import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, Badge } from '../ui';
import { LetterTracing } from './LetterTracing';
import { SFX } from '../../data/soundLibrary';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface WordWritingProps {
  word: string;
  onComplete: (accuracy: number) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function speak(text: string, rate = 0.75) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }
}

// Simple word-to-emoji mapping for common early phonics words
const WORD_EMOJIS: Record<string, string> = {
  cat: '\uD83D\uDC31', dog: '\uD83D\uDC36', sun: '\u2600\uFE0F', hat: '\uD83E\uDDE2',
  cup: '\u2615', pen: '\uD83D\uDD8A\uFE0F', pig: '\uD83D\uDC37', bus: '\uD83D\uDE8C',
  red: '\uD83D\uDD34', bat: '\uD83E\uDD87', map: '\uD83D\uDDFA\uFE0F', net: '\uD83E\uDD3F',
  fan: '\uD83C\uDF2C\uFE0F', pin: '\uD83D\uDCCC', log: '\uD83E\uDEB5', bed: '\uD83D\uDECF\uFE0F',
  sit: '\uD83E\uDDD1', tap: '\uD83D\uDEB0', ant: '\uD83D\uDC1C', egg: '\uD83E\uDD5A',
};

// ─── Component ─────────────────────────────────────────────────────────────

export function WordWriting({ word, onComplete }: WordWritingProps) {
  const letters = word.toLowerCase().split('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letterScores, setLetterScores] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  const emoji = WORD_EMOJIS[word.toLowerCase()] ?? '';

  const handleLetterComplete = useCallback(
    (accuracy: number) => {
      // Only advance if accuracy is acceptable (>= 40%)
      if (accuracy < 40) return;

      const newScores = [...letterScores, accuracy];
      setLetterScores(newScores);

      if (currentIndex + 1 < letters.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        // All letters done
        setIsDone(true);
        SFX.celebration();
        speak(word, 0.7);
        const avgAccuracy = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
        onComplete(avgAccuracy);
      }
    },
    [currentIndex, letters.length, letterScores, word, onComplete],
  );

  // ─── Done state ──

  if (isDone) {
    const avgAccuracy = Math.round(letterScores.reduce((a, b) => a + b, 0) / letterScores.length);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.wrapper}
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ fontSize: '4rem', textAlign: 'center', display: 'block' }}
        >
          {emoji || '\uD83C\uDF89'}
        </motion.span>

        <Card variant="elevated" padding="lg">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <h3 style={{ color: '#1A6B5A', margin: 0, fontFamily: 'Nunito, sans-serif' }}>
              You wrote &quot;{word}&quot;!
            </h3>
            <div style={styles.completedWord}>
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: (letterScores[i] ?? 0) >= 70 ? '#22c55e' : '#E8A317',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              {avgAccuracy}% average accuracy
            </Badge>
          </div>
        </Card>
      </motion.div>
    );
  }

  // ─── Active tracing ──

  return (
    <div style={styles.wrapper}>
      {/* Word display with emoji */}
      <div style={styles.wordHeader}>
        {emoji && <span style={{ fontSize: '2rem' }}>{emoji}</span>}
        <div style={styles.wordLetters}>
          {letters.map((l, i) => (
            <span
              key={i}
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'Nunito, sans-serif',
                color:
                  i < currentIndex
                    ? '#22c55e'
                    : i === currentIndex
                      ? '#1A6B5A'
                      : '#d1d5db',
                textDecoration: i === currentIndex ? 'underline' : 'none',
                textUnderlineOffset: '4px',
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div style={styles.progressRow}>
        {letters.map((_, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor:
                i < currentIndex
                  ? '#22c55e'
                  : i === currentIndex
                    ? '#1A6B5A'
                    : '#e0e0e0',
              border: i === currentIndex ? '2px solid #1A6B5A' : 'none',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Letter tracing canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <LetterTracing
            letter={letters[currentIndex]}
            onComplete={handleLetterComplete}
            difficulty="guided"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

WordWriting.displayName = 'WordWriting';

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
  },
  wordHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  wordLetters: {
    display: 'flex',
    gap: '0.25rem',
  },
  progressRow: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  completedWord: {
    display: 'flex',
    gap: '0.15rem',
    justifyContent: 'center',
  },
};
