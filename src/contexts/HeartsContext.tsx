/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useHearts */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { usePremium } from './PremiumContext';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_HEARTS = 5;
const REGEN_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const LS_KEY = 'mm_hearts_state';

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeartsState {
  hearts: number;
  maxHearts: number;
  lastHeartLostAt: string | null;
  isUnlimited: boolean;
}

interface HeartsContextType {
  hearts: number;
  maxHearts: number;
  lastHeartLostAt: string | null;
  isUnlimited: boolean;
  loseHeart: () => void;
  addHeart: (count?: number) => void;
  refillHearts: () => void;
  getRegenTimeMs: () => number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readStorage(): HeartsState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HeartsState;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(state: HeartsState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — ignore
  }
}

function applyRegen(state: HeartsState): HeartsState {
  if (state.hearts >= MAX_HEARTS) return state;
  if (!state.lastHeartLostAt) return state;

  const now = Date.now();
  const elapsed = now - new Date(state.lastHeartLostAt).getTime();
  const heartsToRegen = Math.floor(elapsed / REGEN_INTERVAL_MS);

  if (heartsToRegen <= 0) return state;

  const newHearts = Math.min(MAX_HEARTS, state.hearts + heartsToRegen);

  // If fully refilled, clear the timestamp; otherwise advance it
  let newTimestamp: string | null;
  if (newHearts >= MAX_HEARTS) {
    newTimestamp = null;
  } else {
    const usedMs = heartsToRegen * REGEN_INTERVAL_MS;
    newTimestamp = new Date(new Date(state.lastHeartLostAt).getTime() + usedMs).toISOString();
  }

  return {
    ...state,
    hearts: newHearts,
    lastHeartLostAt: newTimestamp,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

const HeartsContext = createContext<HeartsContextType | null>(null);

export function useHearts(): HeartsContextType {
  const ctx = useContext(HeartsContext);
  if (!ctx) {
    throw new Error('useHearts must be used within a HeartsProvider');
  }
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function HeartsProvider({ children }: { children: ReactNode }) {
  const { isPremium } = usePremium();

  const [hearts, setHearts] = useState<number>(MAX_HEARTS);
  const [lastHeartLostAt, setLastHeartLostAt] = useState<string | null>(null);

  // On mount: hydrate from storage and apply any accumulated regen
  useEffect(() => {
    const saved = readStorage();
    if (saved) {
      const regenned = applyRegen(saved);
      setHearts(regenned.hearts);
      setLastHeartLostAt(regenned.lastHeartLostAt);
      if (regenned.hearts !== saved.hearts || regenned.lastHeartLostAt !== saved.lastHeartLostAt) {
        writeStorage({ ...regenned, maxHearts: MAX_HEARTS, isUnlimited: isPremium });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
  }, []);

  // Periodic regen check (every 60 seconds)
  useEffect(() => {
    if (isPremium) return;

    const id = setInterval(() => {
      setLastHeartLostAt((prevTimestamp) => {
        if (!prevTimestamp) return prevTimestamp;

        setHearts((prevHearts) => {
          if (prevHearts >= MAX_HEARTS) return prevHearts;

          const now = Date.now();
          const elapsed = now - new Date(prevTimestamp).getTime();
          const heartsToRegen = Math.floor(elapsed / REGEN_INTERVAL_MS);

          if (heartsToRegen <= 0) return prevHearts;

          const newHearts = Math.min(MAX_HEARTS, prevHearts + heartsToRegen);
          let newTimestamp: string | null;

          if (newHearts >= MAX_HEARTS) {
            newTimestamp = null;
          } else {
            const usedMs = heartsToRegen * REGEN_INTERVAL_MS;
            newTimestamp = new Date(new Date(prevTimestamp).getTime() + usedMs).toISOString();
          }

          // Persist — we derive newTimestamp inside setHearts callback, need outer setter
          // Schedule the timestamp update after state settles
          setTimeout(() => {
            setLastHeartLostAt(newTimestamp);
            writeStorage({
              hearts: newHearts,
              maxHearts: MAX_HEARTS,
              lastHeartLostAt: newTimestamp,
              isUnlimited: false,
            });
          }, 0);

          return newHearts;
        });

        return prevTimestamp;
      });
    }, 60_000);

    return () => clearInterval(id);
  }, [isPremium]);

  const loseHeart = useCallback(() => {
    if (isPremium) return;

    setHearts((prev) => {
      const next = Math.max(0, prev - 1);
      const now = new Date().toISOString();

      setLastHeartLostAt((prevTs) => {
        // Only update timestamp if this is the first lost heart (was full)
        const ts = prevTs ?? now;
        writeStorage({
          hearts: next,
          maxHearts: MAX_HEARTS,
          lastHeartLostAt: ts,
          isUnlimited: false,
        });
        return ts;
      });

      return next;
    });
  }, [isPremium]);

  const addHeart = useCallback((count: number = 1) => {
    if (isPremium) return;

    setHearts((prev) => {
      const next = Math.min(MAX_HEARTS, prev + count);
      const newTs = next >= MAX_HEARTS ? null : lastHeartLostAt;

      writeStorage({
        hearts: next,
        maxHearts: MAX_HEARTS,
        lastHeartLostAt: newTs,
        isUnlimited: false,
      });

      if (next >= MAX_HEARTS) {
        setLastHeartLostAt(null);
      }

      return next;
    });
  }, [isPremium, lastHeartLostAt]);

  const refillHearts = useCallback(() => {
    setHearts(MAX_HEARTS);
    setLastHeartLostAt(null);
    writeStorage({
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      lastHeartLostAt: null,
      isUnlimited: isPremium,
    });
  }, [isPremium]);

  const getRegenTimeMs = useCallback((): number => {
    if (!lastHeartLostAt || hearts >= MAX_HEARTS) return 0;

    const elapsed = Date.now() - new Date(lastHeartLostAt).getTime();
    const remaining = REGEN_INTERVAL_MS - (elapsed % REGEN_INTERVAL_MS);
    return remaining;
  }, [lastHeartLostAt, hearts]);

  const value = useMemo<HeartsContextType>(
    () => ({
      hearts: isPremium ? MAX_HEARTS : hearts,
      maxHearts: MAX_HEARTS,
      lastHeartLostAt,
      isUnlimited: isPremium,
      loseHeart,
      addHeart,
      refillHearts,
      getRegenTimeMs,
    }),
    [hearts, lastHeartLostAt, isPremium, loseHeart, addHeart, refillHearts, getRegenTimeMs],
  );

  return <HeartsContext.Provider value={value}>{children}</HeartsContext.Provider>;
}
