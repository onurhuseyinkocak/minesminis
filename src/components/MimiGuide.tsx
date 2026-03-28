/**
 * MimiGuide — Contextual floating Mimi speech bubble
 * Shows helpful tips based on what page the child is on.
 * Appears once per page (stored in localStorage via showOnce key).
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieCharacter from './LottieCharacter';
import { useLanguage } from '../contexts/LanguageContext';

export interface MimiGuideProps {
  message: string;
  messageTr?: string;
  position?: 'bottom-left' | 'bottom-right';
  autoHide?: number; // ms, default 8000
  showOnce?: string; // localStorage key to only show once
}

const LS_PREFIX = 'mimi_shown_';

function wasAlreadyShown(key: string): boolean {
  try {
    return localStorage.getItem(LS_PREFIX + key) === '1';
  } catch {
    return false;
  }
}

function markAsShown(key: string): void {
  try {
    localStorage.setItem(LS_PREFIX + key, '1');
  } catch {
    // storage full — silently ignore
  }
}

export default function MimiGuide({
  message,
  messageTr,
  position = 'bottom-right',
  autoHide = 8000,
  showOnce,
}: MimiGuideProps) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (showOnce) {
      markAsShown(showOnce);
    }
  }, [showOnce]);

  useEffect(() => {
    // If showOnce is set and was already shown, don't display
    if (showOnce && wasAlreadyShown(showOnce)) return;

    // Small delay before appearing so the page loads first
    const showTimer = setTimeout(() => setVisible(true), 600);

    return () => clearTimeout(showTimer);
  }, [showOnce]);

  useEffect(() => {
    if (!visible || autoHide <= 0) return;

    const hideTimer = setTimeout(() => {
      dismiss();
    }, autoHide);

    return () => clearTimeout(hideTimer);
  }, [visible, autoHide, dismiss]);

  const isLeft = position === 'bottom-left';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            position: 'fixed',
            bottom: 24,
            [isLeft ? 'left' : 'right']: 16,
            zIndex: 9000,
            display: 'flex',
            flexDirection: isLeft ? 'row' : 'row-reverse',
            alignItems: 'flex-end',
            gap: 8,
            maxWidth: 320,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={dismiss}
          role="status"
          aria-live="polite"
        >
          {/* Mimi face */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple-light), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              border: '3px solid var(--bg-card, #1C2236)',
            }}
          >
            <LottieCharacter state="happy" size={32} />
          </motion.div>

          {/* Speech bubble */}
          <div
            style={{
              background: 'var(--bg-card, #1C2236)',
              borderRadius: 16,
              padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              position: 'relative',
              border: '2px solid var(--accent-purple-pale, rgba(167, 139, 250, 0.3))',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary, #F1F5F9)',
                lineHeight: 1.45,
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              {lang === 'tr' && messageTr ? messageTr : message}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              style={{
                marginTop: 8,
                padding: '4px 12px',
                borderRadius: 8,
                border: '1.5px solid var(--accent-purple-pale, rgba(167, 139, 250, 0.4))',
                background: 'var(--accent-purple-pale, rgba(124, 58, 237, 0.15))',
                color: 'var(--accent-purple-light)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              {lang === 'tr' ? 'Anladım!' : 'Got it!'}
            </button>

            {/* Bubble tail — border triangle behind fill triangle */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: -10,
                [isLeft ? 'left' : 'right']: 16,
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid var(--accent-purple-pale)',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: -8,
                [isLeft ? 'left' : 'right']: 18,
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid var(--bg-card)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
