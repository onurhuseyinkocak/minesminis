/**
 * MimiGuide — Contextual floating Mimi speech bubble
 * Shows helpful tips based on what page the child is on.
 * Appears once per page (stored in localStorage via showOnce key).
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MimiMascot from './MimiMascot';

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
  const [visible, setVisible] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, autoHide]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (showOnce) {
      markAsShown(showOnce);
    }
  }, [showOnce]);

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
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              border: '3px solid var(--bg-card, #1C2236)',
            }}
          >
            <MimiMascot size={32} mood="happy" />
          </motion.div>

          {/* Speech bubble */}
          <div
            style={{
              background: 'var(--bg-card, #1C2236)',
              borderRadius: 16,
              padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              position: 'relative',
              border: '2px solid rgba(167, 139, 250, 0.3)',
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
              {message}
            </p>
            {messageTr && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 12,
                  color: 'var(--text-secondary, #94A3B8)',
                  lineHeight: 1.4,
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {messageTr}
              </p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              style={{
                marginTop: 8,
                padding: '4px 12px',
                borderRadius: 8,
                border: '1.5px solid rgba(167, 139, 250, 0.4)',
                background: 'rgba(124, 58, 237, 0.15)',
                color: '#a78bfa',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              Got it!
            </button>

            {/* Bubble tail */}
            <div
              style={{
                position: 'absolute',
                bottom: -8,
                [isLeft ? 'left' : 'right']: 18,
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid var(--bg-card, #1C2236)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
