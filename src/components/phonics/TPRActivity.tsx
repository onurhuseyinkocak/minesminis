import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, Check } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../ui';
import { useLanguage } from '../../contexts/LanguageContext';

interface TPRActivityProps {
  commands: string[];
  onComplete: () => void;
}

interface ParsedCommand {
  text: string;
  actionLabel: string;
}

function parseCommand(cmd: string): ParsedCommand {
  const trimmed = cmd.trim();
  const actionLabel = trimmed.replace(/[!.]/g, '').trim().charAt(0).toUpperCase();
  return { text: cmd, actionLabel };
}

export const TPRActivity: React.FC<TPRActivityProps> = ({ commands, onComplete }) => {
  const { t } = useLanguage();
  const gameCommands = useMemo(() => commands.slice(0, 5).map(parseCommand), [commands]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAction, setShowAction] = useState(false);
  const [timer, setTimer] = useState(5);
  const [completed, setCompleted] = useState(false);

  const current = gameCommands[currentIndex];

  const speak = useCallback((text: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.75;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  // Speak command on display
  useEffect(() => {
    if (current && !completed) {
      speak(current.text);
      setShowAction(true);
      setTimer(5);
    }
  }, [currentIndex, current, completed, speak]);

  // Countdown timer
  useEffect(() => {
    if (!showAction || completed) return;
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showAction, timer, completed]);

  const handleDidIt = () => {
    setShowAction(false);
    if (currentIndex + 1 < gameCommands.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      setTimeout(() => onComplete(), 1500);
    }
  };

  if (!commands || commands.length < 1) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Gözden geçirilecek kelime yok.</div>; }

  const progress = (currentIndex / gameCommands.length) * 100;

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
            <Sparkles size={64} color="var(--warning)" />
            <h2 style={{ color: 'var(--secondary, #1A6B5A)', margin: '0.5rem 0' }}>Great Moves!</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary, #555)' }}>
              You completed all {gameCommands.length} actions!
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              {t('games.amazing')}
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!current) return null;

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
      aria-label="Total Physical Response activity"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ color: 'var(--secondary, #1A6B5A)', margin: 0, fontSize: '1.4rem' }}>Do the Action!</h2>
        <Badge variant="info">{currentIndex + 1}/{gameCommands.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <Card variant="elevated" padding="xl">
        <div style={{ textAlign: 'center' }}>
          {/* Animated action badge */}
          <motion.div
            key={currentIndex}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary, #1A6B5A)',
              color: '#fff',
              fontSize: '2.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            {current.actionLabel}
          </motion.div>

          {/* Command text */}
          <motion.h3
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--text-primary, #333)',
              margin: '1rem 0',
            }}
          >
            {current.text}
          </motion.h3>

          {/* Listen again */}
          <Button
            variant="ghost"
            size="md"
            onClick={() => speak(current.text)}
            style={{ marginBottom: '1rem' }}
          >
            <Volume2 size={16} /> Listen again
          </Button>

          {/* Timer */}
          {timer > 0 && (
            <motion.div
              key={timer}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: timer <= 2 ? 'var(--primary, #E8A317)' : 'var(--secondary, #1A6B5A)',
                marginBottom: '1rem',
              }}
            >
              {timer}
            </motion.div>
          )}

          {/* I did it button */}
          <Button
            variant="primary"
            size="xl"
            onClick={handleDidIt}
            style={{ backgroundColor: 'var(--secondary, #1A6B5A)', borderColor: 'var(--secondary, #1A6B5A)' }}
          >
            I did it! <Check size={14} strokeWidth={3} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

TPRActivity.displayName = 'TPRActivity';
