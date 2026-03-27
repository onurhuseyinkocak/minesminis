/**
 * MascotContext — single source of truth for the global mascot.
 *
 * Architecture:
 *  - ONE mascot is always visible on screen (GlobalMascot component in App.tsx)
 *  - Pages/games drive behavior via triggerMascot() or by dispatching 'mm:feedback' events
 *  - Route changes auto-set a default idle/greeting state
 *  - mascotId is persisted to localStorage; onboarding calls setMascotId() to change it
 *
 * Future extensibility:
 *  - MascotSelector page calls setMascotId('nova_fox') → whole app updates
 *  - Theme can read mascotId and apply matching color tokens
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { MascotState } from '../components/UnifiedMascot';

// ── Constants ──────────────────────────────────────────────────────────────

const MASCOT_KEY = 'mm_mascot_id';
export const VALID_MASCOT_IDS = [
  'mimi_cat',
  'mimi_dragon',
  'nova_fox',
  'bubbles_octo',
  'sparky_alien',
] as const;
export type MascotId = (typeof VALID_MASCOT_IDS)[number];

// Route prefix → default mascot behavior when navigating to that route
const ROUTE_BEHAVIORS: Record<string, { state: MascotState; message?: string }> = {
  '/home':          { state: 'waving',      message: 'Merhaba! 👋' },
  '/dashboard':     { state: 'waving',      message: 'Hoş geldin! 🌟' },
  '/games':         { state: 'celebrating', message: 'Hadi oynayalım! 🎮' },
  '/worlds':        { state: 'idle' },
  '/lesson':        { state: 'thinking' },
  '/words':         { state: 'thinking',    message: 'Kelimeler öğrenelim! 📚' },
  '/flashcard':     { state: 'thinking' },
  '/stories':       { state: 'idle' },
  '/story':         { state: 'idle' },
  '/profile':       { state: 'idle' },
  '/achievements':  { state: 'celebrating', message: 'Rozetlerin! 🏆' },
  '/garden':        { state: 'idle',        message: 'Bitkiler büyüyor! 🌱' },
  '/phonics':       { state: 'thinking' },
  '/daily':         { state: 'celebrating', message: 'Günlük ders zamanı! ⭐' },
  '/settings':      { state: 'idle' },
};

function getRouteBehavior(pathname: string): { state: MascotState; message?: string } {
  for (const [prefix, behavior] of Object.entries(ROUTE_BEHAVIORS)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return behavior;
    }
  }
  return { state: 'idle' };
}

// ── Game feedback event detail type ────────────────────────────────────────

export interface MascotFeedbackDetail {
  feedback: 'correct' | 'wrong' | 'timeout' | null;
  onContinue?: () => void;
  xpEarned?: number;
  correctAnswer?: string;
  answerWasLabel?: string;
  continueLabel?: string;
}

// ── Context type ───────────────────────────────────────────────────────────

export interface MascotContextValue {
  /** Current mascot character id — persisted to localStorage */
  mascotId: MascotId;
  /** Change mascot (called from MascotSelector / onboarding) */
  setMascotId: (id: MascotId) => void;
  /** Current animation/emotion state */
  state: MascotState;
  /** Speech bubble message (null = no bubble) */
  message: string | null;
  /** Active game feedback payload (drives the Continue button in bubble) */
  feedback: MascotFeedbackDetail | null;
  /**
   * Trigger a mascot reaction externally.
   * @param state  - animation state
   * @param message - speech bubble text (omit to clear bubble)
   * @param duration - ms before returning to idle (0 = permanent until next trigger)
   */
  triggerMascot: (state: MascotState, message?: string, duration?: number) => void;
}

// ── Context + Provider ─────────────────────────────────────────────────────

const MascotContext = createContext<MascotContextValue | null>(null);

const CORRECT_MSGS = [
  'Harika! ⭐', 'Mükemmel!', 'Süpersin! 🎉', 'Bravo!',
  'İşte bu!', 'Aferin sana!', 'Tam isabet!',
];
const WRONG_MSGS = [
  'Neredeyse!', 'Tekrar dene!', 'Sen yapabilirsin!',
  'Az kaldı!', 'Bir daha dene!', 'Devam et!',
];
function pick(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const [mascotId, setMascotIdState] = useState<MascotId>(() => {
    const saved = localStorage.getItem(MASCOT_KEY) as MascotId | null;
    return saved && (VALID_MASCOT_IDS as readonly string[]).includes(saved)
      ? saved
      : 'mimi_cat';
  });

  const [state, setState] = useState<MascotState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<MascotFeedbackDetail | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setMascotId = useCallback((id: MascotId) => {
    if ((VALID_MASCOT_IDS as readonly string[]).includes(id)) {
      try { localStorage.setItem(MASCOT_KEY, id); } catch { /* ignore */ }
      setMascotIdState(id);
    }
  }, []);

  const triggerMascot = useCallback(
    (newState: MascotState, msg?: string, duration = 3500) => {
      clearTimer();
      setState(newState);
      setMessage(msg ?? null);
      setFeedback(null);
      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          setState('idle');
          setMessage(null);
        }, duration);
      }
    },
    [clearTimer]
  );

  // Auto-behavior on route change
  useEffect(() => {
    clearTimer();
    setFeedback(null);
    const behavior = getRouteBehavior(location.pathname);
    setState(behavior.state);
    if (behavior.message) {
      setMessage(behavior.message);
      timerRef.current = setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage(null);
    }
  }, [location.pathname, clearTimer]);

  // Listen for game answer feedback events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<MascotFeedbackDetail>).detail;
      clearTimer();
      if (detail.feedback === 'correct') {
        setState('celebrating');
        setMessage(pick(CORRECT_MSGS));
        setFeedback(detail);
      } else if (detail.feedback === 'wrong') {
        setState('thinking');
        setMessage(pick(WRONG_MSGS));
        setFeedback(detail);
      } else {
        // feedback cleared
        setState('idle');
        setMessage(null);
        setFeedback(null);
      }
    };
    window.addEventListener('mm:feedback', handler);
    return () => window.removeEventListener('mm:feedback', handler);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo<MascotContextValue>(
    () => ({ mascotId, setMascotId, state, message, feedback, triggerMascot }),
    [mascotId, setMascotId, state, message, feedback, triggerMascot],
  );

  return (
    <MascotContext.Provider value={value}>
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot(): MascotContextValue {
  const ctx = useContext(MascotContext);
  if (!ctx) throw new Error('useMascot must be used within MascotProvider');
  return ctx;
}
