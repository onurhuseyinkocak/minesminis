/**
 * MimiTooltip — Inline Mimi tooltip for first-time interactions.
 * A small speech bubble that points to an element with messages like
 * "Tap here!", "Try this!", "Great job!". Auto-fades after 3 seconds.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MimiTooltipProps {
  message: string;
  /** Direction the arrow points toward the target element */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Auto-dismiss delay in ms, default 3000 */
  autoDismiss?: number;
  /** If set, only show once (localStorage key) */
  showOnce?: string;
  /** Additional inline styles for positioning */
  style?: React.CSSProperties;
  /** Children to wrap — tooltip appears relative to them */
  children?: React.ReactNode;
}

const LS_PREFIX = 'mimi_tip_';

function wasShown(key: string): boolean {
  try {
    return localStorage.getItem(LS_PREFIX + key) === '1';
  } catch {
    return false;
  }
}

function markShown(key: string): void {
  try {
    localStorage.setItem(LS_PREFIX + key, '1');
  } catch {
    // silently ignore
  }
}

export default function MimiTooltip({
  message,
  direction = 'up',
  autoDismiss = 3000,
  showOnce,
  style,
  children,
}: MimiTooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showOnce && wasShown(showOnce)) return;

    const showTimer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(showTimer);
  }, [showOnce]);

  useEffect(() => {
    if (!visible || autoDismiss <= 0) return;

    const hideTimer = setTimeout(() => {
      setVisible(false);
      if (showOnce) markShown(showOnce);
    }, autoDismiss);

    return () => clearTimeout(hideTimer);
  }, [visible, autoDismiss, showOnce]);

  const arrowStyles: Record<string, React.CSSProperties> = {
    up: {
      bottom: -6,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #7c3aed',
    },
    down: {
      top: -6,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: '6px solid #7c3aed',
    },
    left: {
      right: -6,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderLeft: '6px solid #7c3aed',
    },
    right: {
      left: -6,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid #7c3aed',
    },
  };

  const tooltipPosition: Record<string, React.CSSProperties> = {
    up: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    down: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              ...tooltipPosition[direction],
              zIndex: 9001,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                background: '#7c3aed',
                color: '#fff',
                borderRadius: 10,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Nunito, sans-serif',
                boxShadow: '0 3px 12px rgba(124, 58, 237, 0.3)',
                position: 'relative',
              }}
            >
              <span style={{ marginRight: 4 }}>{'\u{1F432}'}</span>
              {message}

              {/* Arrow */}
              <div
                style={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  ...arrowStyles[direction],
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
