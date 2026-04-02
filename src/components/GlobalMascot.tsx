/**
 * GlobalMascot — the ONE mascot rendered across the entire app.
 *
 * - Always fixed bottom-right, never overlaps main content
 * - Driven by MascotContext (route changes, game feedback events, manual triggers)
 * - Shows speech bubble with messages
 * - Shows Continue button when an active game feedback payload is present
 * - Mascot character (id) comes from MascotContext — swap via setMascotId()
 * - Full green flash on correct answer (same as the old GameMascot)
 *
 * ALIVE features:
 * - Idle breathing, blinking, tail wag animations (pure CSS)
 * - Reacts to mm:correct, mm:wrong, mm:levelup, mm:streak events
 * - Rich, varied speech bubbles with personality
 * - Click interaction with fun animations
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '../contexts/MascotContext';
import UnifiedMascot from './UnifiedMascot';

// ── Route config ──────────────────────────────────────────────────────────

const HIDDEN_ROUTES = ['/stories/', '/story', '/phonics/', '/placement', '/tracing', '/reading/'];
const TOP_ROUTES = ['/games', '/worlds/'];

// ── Speech bubble messages with personality ───────────────────────────────

const STREAK_MESSAGES: Record<number, string> = {
  3: '3 ust uste! Ates gibisin!',
  5: '5 dogru! Inanilmaz!',
  7: '7 dogru! Muhteeem!',
  10: '10 dogru! Rekor kiriyorsun!',
  15: '15 dogru! Durdurulamazsin!',
};

const IDLE_MESSAGES = [
  'Hadi bir oyun oynayalim!', 'Bugun ne ogrenecegiz?',
  'Seninle ogrenmek cok eglenceli!', 'Merak etme, ben burdayim!',
  'Hazir misin?', 'Birlikte basaracagiz!',
];

const CLICK_MESSAGES = [
  'Hahaha, gildiklandi!', 'Daha fazla ogren, daha cok kazan!',
  'Sen harika bir ogrencisin!', 'Birlikte her seyi basaririz!',
  'Bugun harika bir gun!', 'Seninle takim olmak cok guzel!',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Animation state type ──────────────────────────────────────────────────

type LiveAnimation = 'idle' | 'celebrating' | 'sad' | 'spin' | 'wiggle' | 'bounce-excited';

export default function GlobalMascot() {
  const { mascotId, state, message, feedback, triggerMascot } = useMascot();
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  // Live animation state (CSS-driven, separate from MascotContext state)
  const [liveAnim, setLiveAnim] = useState<LiveAnimation>('idle');
  const [blinkVisible, setBlinkVisible] = useState(true);
  const [tailWag, setTailWag] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streakRef = useRef(0);

  // Hide mascot on full-screen reader/game pages
  const isHidden = HIDDEN_ROUTES.some(r => path.startsWith(r));
  const useTopPosition = TOP_ROUTES.some(r => path.startsWith(r));

  // ── Idle blink (every 4-6s) ───────────────────────────────────────────
  useEffect(() => {
    if (isHidden) return;
    let mounted = true;
    const doBlink = () => {
      if (!mounted) return;
      const delay = 4000 + Math.random() * 2000;
      setTimeout(() => {
        if (!mounted) return;
        setBlinkVisible(false);
        setTimeout(() => {
          if (mounted) setBlinkVisible(true);
        }, 150);
        doBlink();
      }, delay);
    };
    doBlink();
    return () => { mounted = false; };
  }, [isHidden]);

  // ── Idle tail wag (every 8-10s) ──────────────────────────────────────
  useEffect(() => {
    if (isHidden) return;
    let mounted = true;
    const doWag = () => {
      if (!mounted) return;
      const delay = 8000 + Math.random() * 2000;
      setTimeout(() => {
        if (!mounted) return;
        setTailWag(true);
        setTimeout(() => {
          if (mounted) setTailWag(false);
        }, 600);
        doWag();
      }, delay);
    };
    doWag();
    return () => { mounted = false; };
  }, [isHidden]);

  // ── Idle random messages (every 30-60s) ──────────────────────────────
  useEffect(() => {
    if (isHidden) return;
    let mounted = true;
    const scheduleIdleMsg = () => {
      const delay = 30000 + Math.random() * 30000;
      idleMsgTimerRef.current = setTimeout(() => {
        if (!mounted) return;
        // Only show if no active feedback/message
        if (!feedback) {
          triggerMascot('waving', pick(IDLE_MESSAGES), 4000);
        }
        scheduleIdleMsg();
      }, delay);
    };
    scheduleIdleMsg();
    return () => {
      mounted = false;
      if (idleMsgTimerRef.current) clearTimeout(idleMsgTimerRef.current);
    };
  }, [isHidden, feedback, triggerMascot]);

  // ── Helper: set temporary live animation ─────────────────────────────
  const playAnim = useCallback((anim: LiveAnimation, durationMs: number) => {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    setLiveAnim(anim);
    animTimeoutRef.current = setTimeout(() => setLiveAnim('idle'), durationMs);
  }, []);

  // ── Listen for game events ──────────────────────────────────────────
  useEffect(() => {
    const onCorrect = () => {
      playAnim('celebrating', 800);
      streakRef.current += 1;
    };
    const onWrong = () => {
      playAnim('sad', 800);
      streakRef.current = 0;
    };
    const onLevelUp = () => {
      playAnim('spin', 1200);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1200);
    };
    const onStreak = (e: Event) => {
      const count = (e as CustomEvent<{ count: number }>).detail?.count ?? streakRef.current;
      // Find the closest streak message
      const streakKeys = Object.keys(STREAK_MESSAGES).map(Number).sort((a, b) => a - b);
      const matchKey = streakKeys.reverse().find(k => count >= k);
      if (matchKey) {
        triggerMascot('celebrating', STREAK_MESSAGES[matchKey], 3000);
      }
      playAnim('bounce-excited', 1000);
    };

    window.addEventListener('mm:correct', onCorrect);
    window.addEventListener('mm:wrong', onWrong);
    window.addEventListener('mm:levelup', onLevelUp);
    window.addEventListener('mm:streak', onStreak);
    return () => {
      window.removeEventListener('mm:correct', onCorrect);
      window.removeEventListener('mm:wrong', onWrong);
      window.removeEventListener('mm:levelup', onLevelUp);
      window.removeEventListener('mm:streak', onStreak);
    };
  }, [playAnim, triggerMascot]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  if (isHidden) return null;

  const handleContinue = () => {
    feedback?.onContinue?.();
  };

  const handleClick = () => {
    if (feedback) return; // don't interrupt active game feedback
    // Fun click animation — rotate between wiggle, spin, bounce
    const anims: LiveAnimation[] = ['wiggle', 'spin', 'celebrating'];
    playAnim(pick(anims), 800);
    triggerMascot('celebrating', pick(CLICK_MESSAGES), 2500);
  };

  const isCorrect = feedback?.feedback === 'correct';
  const isWrong = feedback?.feedback === 'wrong';

  // Build the CSS animation class name for the mascot wrapper
  const getAnimationStyle = (): React.CSSProperties => {
    switch (liveAnim) {
      case 'celebrating':
        return { animation: 'mascot-bounce 0.4s ease-in-out 2' };
      case 'sad':
        return { animation: 'mascot-sad-tilt 0.5s ease-in-out' };
      case 'spin':
        return { animation: 'mascot-spin 0.8s ease-in-out' };
      case 'wiggle':
        return { animation: 'mascot-wiggle 0.5s ease-in-out 2' };
      case 'bounce-excited':
        return { animation: 'mascot-bounce-excited 0.3s ease-in-out 3' };
      default:
        return { animation: 'mascot-breathe 3s ease-in-out infinite' };
    }
  };

  return (
    <>
      {/* ── CSS Animations ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes mascot-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.08); }
        }

        @keyframes mascot-bounce-excited {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-12px) scale(1.12); }
          60% { transform: translateY(-6px) scale(1.05); }
        }

        @keyframes mascot-sad-tilt {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-5deg) translateY(3px); }
          70% { transform: rotate(2deg); }
        }

        @keyframes mascot-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes mascot-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        @keyframes mascot-tail-wag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-6deg); }
          75% { transform: rotate(6deg); }
        }

        @keyframes sparkle-burst {
          0% { opacity: 1; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
          100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
        }

        @keyframes mascot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .mascot-alive-wrapper {
          transition: filter 0.2s ease;
        }
        .mascot-alive-wrapper:hover {
          filter: brightness(1.1) drop-shadow(0 2px 8px rgba(255, 107, 53, 0.3));
        }
        .mascot-alive-wrapper:active {
          transform: scale(0.92) !important;
        }
      `}</style>

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
                border: `2px solid ${isCorrect ? 'var(--success, #10B981)' : isWrong ? 'var(--error, #EF4444)' : 'var(--border-light)'}`,
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
              {isWrong && feedback?.correctAnswer && (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {feedback.answerWasLabel ?? 'Dogru cevap:'}{' '}
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
                  borderTop: `8px solid ${isCorrect ? 'var(--success, #10B981)' : isWrong ? 'var(--error, #EF4444)' : 'var(--border-light)'}`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot character — alive with CSS animations */}
        <div
          className="mascot-alive-wrapper"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            cursor: feedback ? 'default' : 'pointer',
            pointerEvents: 'auto',
            width: 'var(--gm-size, 80px)',
            height: 'var(--gm-size, 80px)',
            position: 'relative',
            ...getAnimationStyle(),
            // Blink effect via opacity
            opacity: blinkVisible ? 1 : 0.7,
            transition: 'opacity 0.1s ease',
          }}
          role="button"
          tabIndex={0}
          aria-label="Mascot - tikla!"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        >
          {/* Tail wag indicator — subtle rotation on the wrapper */}
          <div
            style={{
              width: '100%',
              height: '100%',
              animation: tailWag ? 'mascot-tail-wag 0.3s ease-in-out 2' : 'none',
            }}
          >
            <UnifiedMascot
              id={mascotId}
              state={state}
              isHovered={isHovered}
              size={80}
            />
          </div>

          {/* Sparkle particles on level up */}
          {showSparkle && (
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: ['#FFD700', '#FF6B35', '#10B981', '#8B5CF6', '#EC4899', '#3B82F6'][i],
                    top: `${15 + Math.sin((i / 6) * Math.PI * 2) * 35}%`,
                    left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 45}%`,
                    animation: `sparkle-burst 0.8s ease-out ${i * 0.1}s forwards`,
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </>
          )}
        </div>

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
