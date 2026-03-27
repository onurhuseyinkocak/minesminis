import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnifiedMascot, { MascotState } from './UnifiedMascot';
import { useLanguage } from '../contexts/LanguageContext';

const MESSAGES: Record<'en' | 'tr', string[]> = {
  en: ['Keep going!', 'Amazing!', 'Well done!', 'You got this!', 'Fantastic!', 'Brilliant!', 'Nice work!', 'Super!'],
  tr: ['Harika!', 'Devam et!', 'Bravo!', 'Süpersin!', 'Muhteşem!', 'Aferin!', 'Güzel iş!', 'Harikasın!'],
};

const IDLE_STATES: MascotState[] = ['idle', 'waving', 'dancing', 'jumping'];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function FloatingMascot() {
  const { lang } = useLanguage();
  const [state, setState] = useState<MascotState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secondTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setMessage(null), 3500);
  }, []);

  const scheduleNextIdleChange = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const delay = getRandomInt(8000, 15000);
    idleTimerRef.current = setTimeout(() => {
      const nextState = IDLE_STATES[Math.floor(Math.random() * IDLE_STATES.length)];
      setState(nextState);
      if (Math.random() < 0.5) {
        const pool = MESSAGES[lang];
        const msg = pool[Math.floor(Math.random() * pool.length)];
        showMessage(msg);
      }
      secondTimeoutRef.current = setTimeout(() => {
        setState('idle');
        scheduleNextIdleChange();
      }, 2500);
    }, delay);
  }, [showMessage, lang]);

  useEffect(() => {
    scheduleNextIdleChange();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      if (secondTimeoutRef.current) clearTimeout(secondTimeoutRef.current);
    };
  }, [scheduleNextIdleChange]);

  const handleClick = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setState('celebrating');
    const pool = MESSAGES[lang];
    const msg = pool[Math.floor(Math.random() * pool.length)];
    showMessage(msg);
    secondTimeoutRef.current = setTimeout(() => {
      setState('idle');
      scheduleNextIdleChange();
    }, 2000);
  }, [showMessage, scheduleNextIdleChange, lang]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--floating-mascot-bottom, 80px)',
        right: 'var(--floating-mascot-right, 16px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
        pointerEvents: 'none',
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.22 }}
            style={{
              background: 'var(--bg-elevated, #1e293b)',
              border: '1px solid var(--glass-border, #334155)',
              borderRadius: 12,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary, #f1f5f9)',
              fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              position: 'relative',
            }}
          >
            {message}
            {/* Triangle tail */}
            <span
              style={{
                position: 'absolute',
                bottom: -7,
                right: 24,
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '7px solid var(--bg-elevated, #1e293b)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          cursor: 'pointer',
          pointerEvents: 'auto',
          width: 'var(--floating-mascot-size, 80px)',
          height: 'var(--floating-mascot-size, 80px)',
        }}
      >
        <UnifiedMascot
          state={state}
          isHovered={isHovered}
          size={80}
        />
      </motion.div>

      {/* Responsive CSS overrides */}
      <style>{`
        @media (min-width: 768px) {
          :root {
            --floating-mascot-bottom: 24px;
            --floating-mascot-right: 24px;
            --floating-mascot-size: 100px;
          }
        }
      `}</style>
    </div>
  );
}
