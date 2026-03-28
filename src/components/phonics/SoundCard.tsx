import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic } from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PhonicsSound } from './types';

interface SoundCardProps {
  sound: PhonicsSound;
  onComplete: () => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound, onComplete }) => {
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
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
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
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
        setRecognized(isTr ? 'Duyamadım. Tekrar dene!' : "Couldn't hear you. Try again!");
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
            style={{ backgroundColor: 'var(--warning, #E8A317)', borderColor: 'var(--warning, #E8A317)' }}
          >
            {isTr ? 'Dinle' : 'Listen'}
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
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'inherit' }}>{sound.grapheme?.toUpperCase() ?? '?'}</span>
              </motion.span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary, #333)', margin: '0.5rem 0' }}>
                {sound.action}
              </p>
              {step === 'action' && (
                <Button variant="secondary" size="md" onClick={() => setStep('practice')}>
                  {isTr ? 'Anladım!' : 'Got it!'}
                </Button>
              )}
            </motion.div>
          )}

          {/* Turkish note — only shown for TR users */}
          {isTr && sound.turkishNote && (
            <p
              style={{
                fontSize: '0.85rem',
                color: '#888',
                fontStyle: 'italic',
                textAlign: 'center',
                margin: 0,
              }}
            >
              <strong>Dikkat:</strong> {sound.turkishNote}
            </p>
          )}

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
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); speak(kw.word, 0.8); } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Say word: ${kw.word}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: 'var(--text-on-primary, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>{kw.word.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {idx >= 0 ? (
                      <>
                        {kw.word.slice(0, idx)}
                        <span style={{ color: 'var(--warning, #E8A317)', fontWeight: 800 }}>
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
                style={{ backgroundColor: 'var(--secondary, #1A6B5A)', borderColor: 'var(--secondary, #1A6B5A)' }}
              >
                {isListening ? (isTr ? 'Dinleniyor...' : 'Listening...') : (isTr ? 'Söyle!' : 'Say it!')}
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
                {recognized
                  ? (isTr ? `Söyledin: "${recognized}"` : `You said: "${recognized}"`)
                  : (isTr ? 'Harika!' : 'Great job!')}
              </Badge>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

SoundCard.displayName = 'SoundCard';
