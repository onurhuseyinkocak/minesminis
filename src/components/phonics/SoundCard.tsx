import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic } from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import type { PhonicsSound } from './types';

interface SoundCardProps {
  sound: PhonicsSound;
  onComplete: () => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound, onComplete }) => {
  const [step, setStep] = useState<'listen' | 'action' | 'practice' | 'done'>('listen');
  const [isListening, setIsListening] = useState(false);
  const [recognized, setRecognized] = useState('');

  const speak = useCallback((text: string, rate = 0.7) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const speakSound = () => {
    speak(sound.grapheme.length === 1 ? sound.grapheme : sound.example, 0.7);
  };

  const handleSayIt = () => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new (SpeechRecognitionAPI as new () => SpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setRecognized(transcript);
        setIsListening(false);
        setStep('done');
        setTimeout(() => onComplete(), 1500);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setRecognized("Couldn't hear you. Try again!");
        setStep('practice');
      };

      recognition.start();
    } else {
      setStep('done');
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <Card variant="elevated" padding="xl">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Large grapheme */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              fontSize: '5rem',
              fontWeight: 800,
              color: '#1A6B5A',
              lineHeight: 1,
            }}
          >
            {sound.grapheme}
          </motion.div>

          {/* Listen button */}
          <Button
            variant="primary"
            size="lg"
            icon={<Volume2 size={24} />}
            onClick={() => {
              speakSound();
              if (step === 'listen') setStep('action');
            }}
            style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
          >
            Listen
          </Button>

          {/* TPR action */}
          {(step === 'action' || step === 'practice' || step === 'done') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(232,163,23,0.12)',
                borderRadius: '1rem',
                width: '100%',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: '3rem', display: 'block' }}
              >
                {sound.emoji}
              </motion.span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', margin: '0.5rem 0' }}>
                {sound.action}
              </p>
              {step === 'action' && (
                <Button variant="secondary" size="md" onClick={() => setStep('practice')}>
                  Got it!
                </Button>
              )}
            </motion.div>
          )}

          {/* Turkish note */}
          <p
            style={{
              fontSize: '0.85rem',
              color: '#888',
              fontStyle: 'italic',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {sound.turkishNote}
          </p>

          {/* Keywords grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              width: '100%',
            }}
          >
            {sound.keywords.map((kw) => {
              const idx = kw.word.toLowerCase().indexOf(sound.grapheme.toLowerCase());
              return (
                <motion.div
                  key={kw.word}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(kw.word, 0.8)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{kw.emoji}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {idx >= 0 ? (
                      <>
                        {kw.word.slice(0, idx)}
                        <span style={{ color: '#E8A317', fontWeight: 800 }}>
                          {kw.word.slice(idx, idx + sound.grapheme.length)}
                        </span>
                        {kw.word.slice(idx + sound.grapheme.length)}
                      </>
                    ) : (
                      kw.word
                    )}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Say it / practice */}
          {step === 'practice' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <Button
                variant="primary"
                size="xl"
                icon={<Mic size={24} />}
                onClick={handleSayIt}
                disabled={isListening}
                style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
              >
                {isListening ? 'Listening...' : 'Say it!'}
              </Button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <Badge variant="success">
                {recognized ? `You said: "${recognized}"` : 'Great job!'}
              </Badge>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

SoundCard.displayName = 'SoundCard';
