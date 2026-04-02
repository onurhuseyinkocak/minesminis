/**
 * GlobalMascot — the ONE mascot rendered across the entire app.
 *
 * - Always fixed bottom-right, never overlaps main content
 * - Driven by MascotContext (route changes, game feedback events, manual triggers)
 * - Shows speech bubble with messages
 * - Shows Continue button when an active game feedback payload is present
 * - Mascot character (id) comes from MascotContext — swap via setMascotId()
 * - Full green flash on correct answer (same as the old GameMascot)
 */

import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '../contexts/MascotContext';
import UnifiedMascot from './UnifiedMascot';

// Pages where mascot should be hidden (full-screen experiences)
const HIDDEN_ROUTES = ['/stories/', '/story', '/phonics/', '/placement', '/tracing', '/reading/'];
// Pages where mascot moves to top-right to avoid bottom buttons
const TOP_ROUTES = ['/games', '/worlds/'];

export default function GlobalMascot() {
  const { mascotId, state, message, feedback, triggerMascot } = useMascot();
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  // Hide mascot on full-screen reader/game pages
  const isHidden = HIDDEN_ROUTES.some(r => path.startsWith(r));
  // Move to safe position on pages with bottom action buttons
  const useTopPosition = TOP_ROUTES.some(r => path.startsWith(r));

  if (isHidden) return null;

  const handleContinue = useCallback(() => {
    feedback?.onContinue?.();
    // Context will reset via the next mm:feedback(null) event dispatched by games
  }, [feedback]);

  const handleClick = useCallback(() => {
    if (feedback) return; // don't interrupt active game feedback
    const msgs = ['Harika!', 'Devam et!', 'Süpersin!', 'Bravo!', 'Aferin!'];
    triggerMascot('celebrating', msgs[Math.floor(Math.random() * msgs.length)], 2000);
  }, [feedback, triggerMascot]);

  const isCorrect = feedback?.feedback === 'correct';

  return (
    <>
      {/* Full-screen green flash on correct answer */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            key="gm-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, times: [0, 0.25, 1], ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(16,185,129,0.18)',
              zIndex: 9998,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mascot container */}
      <div
        style={{
          position: 'fixed',
          bottom: 'var(--gm-bottom, 80px)',
          top: 'var(--gm-top, auto)',
          right: 'var(--gm-right, 16px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          {(message || feedback) && (
            <motion.div
              key={message ?? 'feedback'}
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              style={{
                background: 'var(--bg-card, #ffffff)',
                border: `2px solid ${isCorrect ? 'var(--success, #10B981)' : feedback?.feedback === 'wrong' ? 'var(--error, #EF4444)' : 'var(--border-light)'}`,
                borderRadius: 14,
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'Nunito, var(--font-display), sans-serif',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                pointerEvents: feedback ? 'auto' : 'none',
                position: 'relative',
                maxWidth: 240,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Message text */}
              {message && <span>{message}</span>}

              {/* Correct answer hint */}
              {feedback?.feedback === 'wrong' && feedback.correctAnswer && (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {feedback.answerWasLabel ?? 'Doğru cevap:'}{' '}
                  <strong style={{ color: 'var(--success, #10B981)' }}>
                    {feedback.correctAnswer}
                  </strong>
                </span>
              )}

              {/* XP badge on correct */}
              {isCorrect && (feedback?.xpEarned ?? 0) > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.18, type: 'spring', stiffness: 320 }}
                  style={{
                    background: 'var(--warning, #F59E0B)',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 900,
                    alignSelf: 'flex-start',
                  }}
                >
                  +{feedback.xpEarned} XP
                </motion.span>
              )}

              {/* Continue button */}
              {feedback && (
                <button
                  type="button"
                  onClick={handleContinue}
                  autoFocus
                  style={{
                    background: isCorrect ? 'var(--success, #10B981)' : 'var(--primary, #FF6B35)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '7px 14px',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    minHeight: 44,
                    pointerEvents: 'auto',
                  }}
                >
                  {feedback.continueLabel ?? 'Devam'}
                </button>
              )}

              {/* Bubble tail */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: -8,
                  right: 28,
                  width: 0, height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `8px solid ${isCorrect ? 'var(--success, #10B981)' : feedback?.feedback === 'wrong' ? 'var(--error, #EF4444)' : 'var(--border-light)'}`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot character */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          onClick={handleClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{
            cursor: feedback ? 'default' : 'pointer',
            pointerEvents: 'auto',
            width: 'var(--gm-size, 80px)',
            height: 'var(--gm-size, 80px)',
          }}
        >
          <UnifiedMascot
            id={mascotId}
            state={state}
            isHovered={isHovered}
            size={80}
          />
        </motion.div>

        {/* Responsive sizing — position depends on route */}
        <style>{`
          @media (min-width: 768px) {
            :root {
              --gm-bottom: ${useTopPosition ? 'auto' : '24px'};
              --gm-top: ${useTopPosition ? '80px' : 'auto'};
              --gm-right: 24px;
              --gm-size: 80px;
            }
          }
          @media (max-width: 767px) {
            :root {
              --gm-bottom: ${useTopPosition ? 'auto' : 'calc(56px + env(safe-area-inset-bottom, 0px) + 68px)'};
              --gm-top: ${useTopPosition ? '72px' : 'auto'};
              --gm-right: 8px;
              --gm-size: 56px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
