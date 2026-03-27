/**
 * XP BOOSTER
 * XP Multiplier boost system: localStorage-backed state, hook, plain functions,
 * and a badge component with countdown timer.
 */

import { useState, useEffect, useCallback } from 'react';
import './XPBooster.css';

// ============================================================
// TYPES
// ============================================================

export interface XPBoostState {
  multiplier: number; // 1 | 1.5 | 2 | 3
  expiresAt: string | null; // ISO timestamp
  source: 'streak_milestone' | 'daily_challenge' | 'premium' | null;
}

// ============================================================
// STORAGE KEY
// ============================================================

const BOOST_KEY = 'mm_xp_boost';

// ============================================================
// PLAIN FUNCTIONS (importable outside hooks/components)
// ============================================================

/**
 * Returns the active boost if one exists and has not expired, otherwise null.
 * Safe to call outside of React — reads directly from localStorage.
 */
export function getActiveBoost(): XPBoostState | null {
  try {
    const raw = localStorage.getItem(BOOST_KEY);
    if (!raw) return null;
    const boost = JSON.parse(raw) as XPBoostState;
    if (!boost.expiresAt) return null;
    if (Date.now() >= new Date(boost.expiresAt).getTime()) {
      localStorage.removeItem(BOOST_KEY);
      return null;
    }
    return boost;
  } catch {
    return null;
  }
}

/**
 * Activates a new XP boost and persists it to localStorage.
 * Safe to call outside of React.
 */
export function activateBoost(
  multiplier: number,
  durationMs: number,
  source: XPBoostState['source'],
): void {
  const boost: XPBoostState = {
    multiplier,
    expiresAt: new Date(Date.now() + durationMs).toISOString(),
    source,
  };
  try { localStorage.setItem(BOOST_KEY, JSON.stringify(boost)); } catch { /* ignore */ }
}

/**
 * Returns milliseconds remaining for the active boost, or 0 if none/expired.
 * Safe to call outside of React.
 */
export function getBoostTimeLeftMs(): number {
  const boost = getActiveBoost();
  if (!boost?.expiresAt) return 0;
  return Math.max(0, new Date(boost.expiresAt).getTime() - Date.now());
}

// ============================================================
// HOOK
// ============================================================

export function useXPBoost() {
  const [boost, setBoost] = useState<XPBoostState | null>(() => getActiveBoost());

  // Re-read from localStorage every second so the countdown stays live
  useEffect(() => {
    const tick = () => setBoost(getActiveBoost());
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activate = useCallback(
    (multiplier: number, durationMs: number, source: XPBoostState['source']) => {
      activateBoost(multiplier, durationMs, source);
      setBoost(getActiveBoost());
    },
    [],
  );

  const timeLeftMs = boost ? getBoostTimeLeftMs() : 0;

  return {
    boost,
    activateBoost: activate,
    getActiveBoost,
    getBoostTimeLeftMs,
    timeLeftMs,
  };
}

// ============================================================
// HELPERS
// ============================================================

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

// ============================================================
// COMPONENT
// ============================================================

const LightningBoltIcon = () => (
  <svg
    className="xp-booster-badge__icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
);

/**
 * Renders an animated badge showing the active XP multiplier and countdown.
 * Renders nothing when no boost is active.
 */
export function XPBoosterBadge() {
  const { boost, timeLeftMs } = useXPBoost();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (boost === null && !expired) {
      // Boost just expired — trigger fade-out briefly then unmount
      setExpired(true);
      const timer = window.setTimeout(() => setExpired(false), 450);
      return () => clearTimeout(timer);
    }
    if (boost !== null) {
      setExpired(false);
    }
  }, [boost, expired]);

  if (!boost && !expired) return null;

  const multiplierLabel = `${boost?.multiplier ?? ''}x XP`;

  return (
    <div
      className={`xp-booster-badge${expired ? ' xp-booster-badge--expired' : ''}`}
      role="status"
      aria-label={`XP Boost active: ${multiplierLabel}`}
    >
      <LightningBoltIcon />
      <span className="xp-booster-badge__label">{multiplierLabel}</span>
      {!expired && timeLeftMs > 0 && (
        <span className="xp-booster-badge__timer">{formatCountdown(timeLeftMs)}</span>
      )}
    </div>
  );
}
