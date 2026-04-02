/**
 * CELEBRATIONS COMPONENT LIBRARY
 * Comprehensive celebration animations for children's delight.
 * Uses framer-motion for spring physics, CSS keyframes for simpler effects.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Celebrations.css';

/* ════════════════════════════════════════════════════════════════════
   STAR BURST — shows on correct answer
   8-12 colorful stars burst outward from center with spring physics
   ════════════════════════════════════════════════════════════════════ */

interface StarBurstProps {
  show?: boolean;
  count?: number;
}

const STAR_COLORS = ['#FF6B35', '#FFD700', '#EC4899', '#A855F7', '#22C55E', '#3B82F6', '#F97316', '#6366F1'];

export function StarBurst({ show = true, count = 10 }: StarBurstProps) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      angle: (360 / count) * i,
      color: STAR_COLORS[i % STAR_COLORS.length],
      distance: 60 + Math.random() * 50,
      size: 8 + Math.random() * 8,
      delay: Math.random() * 0.15,
    }));
  }, [count]);

  return (
    <AnimatePresence>
      {show && (
        <div className="celebration-starburst" aria-hidden="true">
          {stars.map((star) => {
            const rad = (star.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * star.distance;
            const ty = Math.sin(rad) * star.distance;
            return (
              <motion.span
                key={star.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.3, rotate: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: tx,
                  y: ty,
                  scale: [0.3, 1.3, 0.8],
                  rotate: star.angle + 180,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                  delay: star.delay,
                  opacity: { duration: 1, times: [0, 0.6, 1] },
                }}
                style={{
                  position: 'absolute',
                  width: star.size,
                  height: star.size,
                  background: star.color,
                  clipPath:
                    'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

StarBurst.displayName = 'StarBurst';

/* ════════════════════════════════════════════════════════════════════
   CONFETTI RAIN — shows on game completion / level up
   Colorful confetti falling from top with various shapes
   ════════════════════════════════════════════════════════════════════ */

interface ConfettiRainProps {
  show?: boolean;
  duration?: number;
}

const CONFETTI_COLORS = [
  '#FF6B35', '#FFD700', '#EC4899', '#A855F7', '#22C55E', '#3B82F6', '#F97316', '#6366F1',
];

const CONFETTI_SHAPES = ['circle', 'square', 'triangle'] as const;

function getClipPath(shape: typeof CONFETTI_SHAPES[number]): string | undefined {
  if (shape === 'triangle') return 'polygon(50% 0%, 0% 100%, 100% 100%)';
  return undefined;
}

function getBorderRadius(shape: typeof CONFETTI_SHAPES[number]): string {
  if (shape === 'circle') return '50%';
  return '2px';
}

export function ConfettiRain({ show = true, duration = 3000 }: ConfettiRainProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration]);

  const pieces = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      fallDuration: 1.5 + Math.random() * 2,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
      shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
      wobble: (Math.random() - 0.5) * 100,
    }));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="celebration-confetti" aria-hidden="true">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 20,
                x: p.wobble,
                opacity: [1, 1, 1, 0],
                rotate: p.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.fallDuration,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: p.fallDuration, times: [0, 0.5, 0.85, 1] },
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: getBorderRadius(p.shape),
                clipPath: getClipPath(p.shape),
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

ConfettiRain.displayName = 'ConfettiRain';

/* ════════════════════════════════════════════════════════════════════
   STREAK FLAME — shows during answer streaks
   Small flame that grows with streak count, pulses at 3+
   ════════════════════════════════════════════════════════════════════ */

interface StreakFlameProps {
  streak: number;
  /** @deprecated Use `streak` instead */
  days?: number;
}

export function StreakFlame({ streak, days }: StreakFlameProps) {
  const effectiveStreak = streak || days || 0;
  if (effectiveStreak <= 0) return null;

  const scale = Math.min(1 + (effectiveStreak - 1) * 0.15, 2.5);
  const isHot = effectiveStreak >= 3;
  const isOnFire = effectiveStreak >= 5;

  return (
    <motion.div
      className="celebration-streak-container"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <motion.span
        className="celebration-streak-flame"
        aria-label={`${effectiveStreak} streak`}
        animate={
          isHot
            ? {
                scale: [scale, scale * 1.15, scale],
                filter: isOnFire
                  ? ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                  : ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
              }
            : { scale }
        }
        transition={
          isHot
            ? { duration: 0.6, repeat: Infinity, repeatType: 'loop' as const }
            : { type: 'spring', stiffness: 300 }
        }
      >
        <span className="celebration-streak-flame__fire" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C7.5 21 5 17.5 5 14.5C5 11.5 7 9 8 8C8 8 7.5 11 9.5 12C9.5 12 9 8.5 12 5C12 5 11.5 9 14 10.5C14 10.5 13 7.5 15 6C15 6 18 9 18 13C18 17.5 16 21 12 21Z"
              fill={isOnFire ? '#FF4500' : '#FF6B35'}
            />
            <path
              d="M12 19C9.5 19 8 17 8 15C8 13 9.5 11.5 10.5 11C10.5 11 10 13 11.5 14C11.5 14 11.5 12 13 11C13 11 15 13 15 15C15 17 13.5 19 12 19Z"
              fill="#FFD700"
              opacity="0.8"
            />
          </svg>
        </span>
        {isHot && <span className="celebration-streak-flame__glow" />}
      </motion.span>
      <motion.span
        className="celebration-streak-number"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
      >
        {effectiveStreak}
      </motion.span>
    </motion.div>
  );
}

StreakFlame.displayName = 'StreakFlame';

/* ════════════════════════════════════════════════════════════════════
   XP POPUP — animates XP gain floating upward
   ════════════════════════════════════════════════════════════════════ */

interface XPPopupProps {
  amount: number;
  show: boolean;
}

export function XPPopup({ amount, show }: XPPopupProps) {
  return (
    <AnimatePresence>
      {show && amount > 0 && (
        <motion.div
          className="celebration-xp-popup"
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.5, 1.3, 1.1, 1] }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.4,
            opacity: { times: [0, 0.15, 0.7, 1] },
            scale: { type: 'spring', stiffness: 300, damping: 15 },
          }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
            <path
              d="M12 2.5L14.6 9.3H21.8L16.1 13.6L18.3 20.5L12 16.5L5.7 20.5L7.9 13.6L2.2 9.3H9.4L12 2.5Z"
              fill="#FFD700"
            />
          </svg>
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}

XPPopup.displayName = 'XPPopup';

/* ════════════════════════════════════════════════════════════════════
   ANSWER FEEDBACK — correct/wrong overlay
   Correct: green flash + checkmark + encouraging Turkish text
   Wrong: gentle red pulse + encouraging retry message
   ════════════════════════════════════════════════════════════════════ */

interface AnswerFeedbackProps {
  type: 'correct' | 'wrong';
  show: boolean;
}

const CORRECT_MESSAGES = ['Harika!', 'Super!', 'Bravo!', 'Muhtesem!', 'Aferin!'];
const WRONG_MESSAGES = ['Tekrar dene!', 'Bir daha dene!', 'Yaklasin!'];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function AnswerFeedback({ type, show }: AnswerFeedbackProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      setMessage(pickRandom(type === 'correct' ? CORRECT_MESSAGES : WRONG_MESSAGES));
    }
  }, [show, type]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`celebration-answer-feedback celebration-answer-feedback--${type}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <motion.div
            className="celebration-answer-feedback__icon"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
          >
            {type === 'correct' ? (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#22C55E" />
                <motion.path
                  d="M14 24L21 31L34 18"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#F97316" opacity="0.9" />
                <path
                  d="M24 14V28M24 34V33"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.div>
          <motion.span
            className="celebration-answer-feedback__text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            {message}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

AnswerFeedback.displayName = 'AnswerFeedback';

/* ════════════════════════════════════════════════════════════════════
   COMBO COUNTER — shows 2x, 3x, 4x with increasing size/glow
   Fire effect at 5x+
   ════════════════════════════════════════════════════════════════════ */

interface ComboCounterProps {
  count: number;
}

export function ComboCounter({ count }: ComboCounterProps) {
  if (count < 2) return null;

  const scale = Math.min(1 + (count - 2) * 0.12, 1.8);
  const isOnFire = count >= 5;

  return (
    <AnimatePresence>
      <motion.div
        key={count}
        className={`celebration-combo ${isOnFire ? 'celebration-combo--fire' : ''}`}
        initial={{ scale: 0, opacity: 0, rotate: -15 }}
        animate={{
          scale,
          opacity: 1,
          rotate: 0,
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        <span className="celebration-combo__number">{count}x</span>
        {isOnFire && (
          <motion.span
            className="celebration-combo__fire"
            animate={{ y: [0, -3, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21C7.5 21 5 17.5 5 14.5C5 11.5 7 9 8 8C8 8 7.5 11 9.5 12C9.5 12 9 8.5 12 5C12 5 11.5 9 14 10.5C14 10.5 13 7.5 15 6C15 6 18 9 18 13C18 17.5 16 21 12 21Z"
                fill="#FF4500"
              />
            </svg>
          </motion.span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

ComboCounter.displayName = 'ComboCounter';

/* ════════════════════════════════════════════════════════════════════
   LEGACY COMPONENTS — backward compatibility
   These maintain the old API for existing usage across the codebase
   ════════════════════════════════════════════════════════════════════ */

/** @deprecated Use XPPopup instead */
interface XPPopProps {
  amount: number;
  x?: number;
  y?: number;
}

/** @deprecated Use XPPopup with show prop instead */
export function XPPop({ amount, x, y }: XPPopProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const style: React.CSSProperties = {};
  if (x !== undefined) style.left = `${x}px`;
  if (y !== undefined) style.top = `${y}px`;

  return (
    <span className="celebration-xp-pop" style={style} aria-hidden="true">
      +{amount} XP
    </span>
  );
}

XPPop.displayName = 'XPPop';

/** @deprecated Use AnswerFeedback for correct feedback */
interface FloatingEmojiProps {
  emoji: string;
  count?: number;
}

/** @deprecated Use celebration overlay components instead */
export function FloatingEmoji({ emoji, count = 6 }: FloatingEmojiProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="celebration-floating-emoji" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="celebration-floating-emoji__item"
          style={{
            '--emoji-left': `${20 + Math.random() * 60}%`,
            '--emoji-delay': `${i * 0.15}s`,
            '--emoji-drift': `${-20 + Math.random() * 40}px`,
          } as React.CSSProperties}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

FloatingEmoji.displayName = 'FloatingEmoji';

/** @deprecated Use ConfettiRain + StarBurst combo instead */
export function PerfectBadge() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="celebration-perfect-badge" aria-label="Perfect score!">
      <span className="celebration-perfect-badge__star" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5L14.6 9.3H21.8L16.1 13.6L18.3 20.5L12 16.5L5.7 20.5L7.9 13.6L2.2 9.3H9.4L12 2.5Z"
            fill="#F59E0B"
          />
        </svg>
      </span>
      <span className="celebration-perfect-badge__label">PERFECT!</span>
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--1" />
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--2" />
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--3" />
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--4" />
    </div>
  );
}

PerfectBadge.displayName = 'PerfectBadge';

/* ════════════════════════════════════════════════════════════════════
   CELEBRATION CONTROLLER — manages celebration state for games
   ════════════════════════════════════════════════════════════════════ */

interface CelebrationState {
  showStarBurst: boolean;
  showConfetti: boolean;
  showXP: boolean;
  xpAmount: number;
  feedbackType: 'correct' | 'wrong' | null;
  showFeedback: boolean;
  streak: number;
  combo: number;
}

const INITIAL_STATE: CelebrationState = {
  showStarBurst: false,
  showConfetti: false,
  showXP: false,
  xpAmount: 0,
  feedbackType: null,
  showFeedback: false,
  streak: 0,
  combo: 0,
};

export function useCelebrations() {
  const [state, setState] = useState<CelebrationState>(INITIAL_STATE);

  const triggerCorrect = useCallback((xp: number = 10) => {
    setState((prev) => ({
      ...prev,
      showStarBurst: true,
      showXP: true,
      xpAmount: xp,
      feedbackType: 'correct' as const,
      showFeedback: true,
      streak: prev.streak + 1,
      combo: prev.combo + 1,
    }));

    // Auto-hide after animation
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        showStarBurst: false,
        showXP: false,
        showFeedback: false,
      }));
    }, 1200);
  }, []);

  const triggerWrong = useCallback(() => {
    setState((prev) => ({
      ...prev,
      feedbackType: 'wrong' as const,
      showFeedback: true,
      streak: 0,
      combo: 0,
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        showFeedback: false,
      }));
    }, 1200);
  }, []);

  const triggerComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showConfetti: true,
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        showConfetti: false,
      }));
    }, 3500);
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    triggerCorrect,
    triggerWrong,
    triggerComplete,
    reset,
  };
}
