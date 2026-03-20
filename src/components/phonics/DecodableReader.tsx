import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../ui';

interface DecodableReaderProps {
  text: string;
  highlightSounds: string[];
  onComplete: () => void;
}

function highlightWord(word: string, sounds: string[]): React.ReactNode {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '');
  const parts: React.ReactNode[] = [];
  let i = 0;
  let keyIdx = 0;

  while (i < lower.length) {
    let matched = false;
    // Try longer sounds first
    const sortedSounds = [...sounds].sort((a, b) => b.length - a.length);
    for (const sound of sortedSounds) {
      if (lower.slice(i).startsWith(sound.toLowerCase())) {
        parts.push(
          <span key={keyIdx++} style={{ color: '#E8A317', fontWeight: 800 }}>
            {word.slice(i, i + sound.length)}
          </span>
        );
        i += sound.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push(<span key={keyIdx++}>{word[i]}</span>);
      i += 1;
    }
  }

  // Append any trailing punctuation from original word
  const trailing = word.slice(lower.length);
  if (trailing) {
    parts.push(<span key={keyIdx++}>{trailing}</span>);
  }

  return <>{parts}</>;
}

export const DecodableReader: React.FC<DecodableReaderProps> = ({ text, highlightSounds, onComplete }) => {
  const words = text.split(/\s+/);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isReading, setIsReading] = useState(false);
  const [readWords, setReadWords] = useState<Set<number>>(new Set());
  const [allRead, setAllRead] = useState(false);

  const speak = useCallback((t: string, rate = 0.7) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(t);
      utter.lang = 'en-US';
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const handleWordClick = (index: number) => {
    const word = words[index].replace(/[^a-zA-Z']/g, '');
    speak(word, 0.75);
    setCurrentWordIndex(index);
    const newRead = new Set(readWords);
    newRead.add(index);
    setReadWords(newRead);

    if (newRead.size === words.length) {
      setAllRead(true);
    }
  };

  const handleReadAloud = () => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new (SpeechRecognitionAPI as new () => SpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = true;
      setIsReading(true);

      recognition.onresult = () => {
        // Mark progress
        const newRead = new Set<number>();
        words.forEach((_, i) => newRead.add(i));
        setReadWords(newRead);
        setAllRead(true);
        setIsReading(false);
      };

      recognition.onerror = () => {
        setIsReading(false);
      };

      recognition.onend = () => {
        setIsReading(false);
      };

      recognition.start();
      // Auto-stop after 30 seconds (longer timeout for young readers)
      setTimeout(() => {
        try { recognition.stop(); } catch { /* ignore */ }
      }, 30000);
    } else {
      // Fallback: mark as done
      const newRead = new Set<number>();
      words.forEach((_, i) => newRead.add(i));
      setReadWords(newRead);
      setAllRead(true);
    }
  };

  const progress = (readWords.size / words.length) * 100;

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
      aria-label="Decodable reader"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ color: '#1A6B5A', margin: 0, fontSize: '1.4rem' }}>Read Along!</h2>
        <Badge variant="info">{readWords.size}/{words.length} words</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Reading area */}
      <Card variant="elevated" padding="xl">
        <div
          style={{
            lineHeight: 2.2,
            fontSize: '1.5rem',
            textAlign: 'center',
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              onClick={() => handleWordClick(i)}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-block',
                padding: '0.15rem 0.35rem',
                margin: '0.1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor:
                  currentWordIndex === i
                    ? '#FFF3E0'
                    : readWords.has(i)
                    ? '#E8F5E9'
                    : 'transparent',
                border:
                  currentWordIndex === i ? '2px solid #E8A317' : '2px solid transparent',
                fontWeight: 600,
                color: '#333',
                transition: 'all 0.2s ease',
              }}
              aria-label={`Word: ${word}`}
            >
              {highlightWord(word, highlightSounds)}
            </motion.span>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => speak(text, 0.7)}
        >
          🔊 Listen All
        </Button>

        <Button
          variant="primary"
          size="lg"
          icon={<Mic size={20} />}
          onClick={handleReadAloud}
          disabled={isReading}
          style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
        >
          {isReading ? 'Listening...' : 'Read Aloud'}
        </Button>
      </div>

      {allRead && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A6B5A' }}>
            Great reading! 🌟
          </p>
          <Button
            variant="primary"
            size="xl"
            onClick={onComplete}
            style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
          >
            Continue
          </Button>
        </motion.div>
      )}
    </div>
  );
};

DecodableReader.displayName = 'DecodableReader';
