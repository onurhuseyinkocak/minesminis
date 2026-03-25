/**
 * CELEBRATIONS COMPONENT LIBRARY
 * Reusable celebration animations for children's delight.
 * Pure CSS keyframes — no external animation libraries.
 */

import { useEffect, useState } from 'react';
import './Celebrations.css';

/* ─── StarBurst ─── */

interface StarBurstProps {
  count?: number;
}

export function StarBurst({ count = 12 }: StarBurstProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="celebration-starburst" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="celebration-starburst__star"
          style={{
            '--star-angle': `${(360 / count) * i}deg`,
            '--star-delay': `${Math.random() * 0.2}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

StarBurst.displayName = 'StarBurst';

/* ─── ConfettiRain ─── */

interface ConfettiRainProps {
  duration?: number;
}

const CONFETTI_COLORS = [
  'var(--accent-amber, #f59e0b)',
  'var(--accent-indigo, #6366f1)',
  'var(--accent-green, #22c55e)',
  'var(--accent-orange, #f97316)',
  'var(--accent-pink, #ec4899)',
  'var(--accent-purple, #a855f7)',
  'var(--accent-blue, #3b82f6)',
];

export function ConfettiRain({ duration = 2500 }: ConfettiRainProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="celebration-confetti" aria-hidden="true">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="celebration-confetti__piece"
          style={{
            '--confetti-left': `${Math.random() * 100}%`,
            '--confetti-delay': `${Math.random() * 0.8}s`,
            '--confetti-duration': `${1.2 + Math.random() * 1.5}s`,
            '--confetti-color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            '--confetti-rotation': `${Math.random() * 360}deg`,
            '--confetti-size': `${6 + Math.random() * 6}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

ConfettiRain.displayName = 'ConfettiRain';

/* ─── FloatingEmoji ─── */

interface FloatingEmojiProps {
  emoji: string;
  count?: number;
}

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

/* ─── StreakFlame ─── */

interface StreakFlameProps {
  days: number;
}

export function StreakFlame({ days }: StreakFlameProps) {
  const scale = Math.min(1 + (days - 1) * 0.15, 2);

  return (
    <span
      className="celebration-streak-flame"
      aria-label={`${days} day streak`}
      style={{ '--flame-scale': scale } as React.CSSProperties}
    >
      <span className="celebration-streak-flame__fire" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21C7.5 21 5 17.5 5 14.5C5 11.5 7 9 8 8C8 8 7.5 11 9.5 12C9.5 12 9 8.5 12 5C12 5 11.5 9 14 10.5C14 10.5 13 7.5 15 6C15 6 18 9 18 13C18 17.5 16 21 12 21Z" fill="#FF6B35"/><path d="M12 19C9.5 19 8 17 8 15C8 13 9.5 11.5 10.5 11C10.5 11 10 13 11.5 14C11.5 14 11.5 12 13 11C13 11 15 13 15 15C15 17 13.5 19 12 19Z" fill="#FFD700" opacity="0.7"/></svg></span>
      <span className="celebration-streak-flame__glow" />
    </span>
  );
}

StreakFlame.displayName = 'StreakFlame';

/* ─── XPPop ─── */

interface XPPopProps {
  amount: number;
  x?: number;
  y?: number;
}

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

/* ─── PerfectBadge ─── */

export function PerfectBadge() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="celebration-perfect-badge" aria-label="Perfect score!">
      <span className="celebration-perfect-badge__star" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2.5L14.6 9.3H21.8L16.1 13.6L18.3 20.5L12 16.5L5.7 20.5L7.9 13.6L2.2 9.3H9.4L12 2.5Z" fill="#F59E0B"/></svg></span>
      <span className="celebration-perfect-badge__label">PERFECT!</span>
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--1" />
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--2" />
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--3" />
      <span className="celebration-perfect-badge__sparkle celebration-perfect-badge__sparkle--4" />
    </div>
  );
}

PerfectBadge.displayName = 'PerfectBadge';
