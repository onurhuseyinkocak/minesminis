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
import { useAuth } from './AuthContext';
import { loadHeartsFromSupabase, saveHeartsToSupabase } from '../services/supabaseDataService';

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
  childMode: boolean;
  loseHeart: () => void;
  addHeart: (count?: number) => void;
  refillHearts: () => void;
  getRegenTimeMs: () => number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the user is in "child mode" (age ≤ 7 or age unknown).
 * Child mode: hearts system fully disabled — unlimited lives, no heart loss.
 */
function isChildMode(): boolean {
  try {
    const profile = JSON.parse(localStorage.getItem('mm_user_profile') || '{}') as Record<string, unknown>;
    const settings = profile?.settings as Record<string, unknown> | undefined;
    const age = (profile?.age ?? settings?.age ?? 0) as number;
    return age <= 7 || age === 0; // unknown age → child mode (safe default)
  } catch {
    return true;
  }
}

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
  const { user } = useAuth();

  const [hearts, setHearts] = useState<number>(MAX_HEARTS);
  const [lastHeartLostAt, setLastHeartLostAt] = useState<string | null>(null);

  // On mount: try Supabase first (source of truth), fallback to localStorage cache
  useEffect(() => {
    let cancelled = false;

    async function hydrateHearts() {
      const userId = user?.id;

      // 1. Try Supabase first if logged in
      if (userId) {
        try {
          const sbData = await loadHeartsFromSupabase(userId);
          if (!cancelled && sbData) {
            const sbState: HeartsState = {
              hearts: sbData.hearts,
              maxHearts: sbData.max_hearts,
              lastHeartLostAt: sbData.last_heart_lost_at,
              isUnlimited: sbData.is_unlimited,
            };
            const regenned = applyRegen(sbState);
            setHearts(regenned.hearts);
            setLastHeartLostAt(regenned.lastHeartLostAt);
            writeStorage({ ...regenned, maxHearts: MAX_HEARTS, isUnlimited: isPremium });
            return;
          }
        } catch {
          // Supabase failed — fall through to localStorage
        }
      }

      // 2. Fallback to localStorage cache
      if (!cancelled) {
        const saved = readStorage();
        if (saved) {
          const regenned = applyRegen(saved);
          setHearts(regenned.hearts);
          setLastHeartLostAt(regenned.lastHeartLostAt);
          if (regenned.hearts !== saved.hearts || regenned.lastHeartLostAt !== saved.lastHeartLostAt) {
            writeStorage({ ...regenned, maxHearts: MAX_HEARTS, isUnlimited: isPremium });
          }
        }
      }
    }

    hydrateHearts();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount / user change
  }, [user?.id]);

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
    if (isChildMode()) return; // no heart loss for young children (age ≤ 7)

    setHearts((prev) => {
      const next = Math.max(0, prev - 1); // allow reaching 0 — regen handles recovery
      const now = new Date().toISOString();

      setLastHeartLostAt((prevTs) => {
        // Only update timestamp if this is the first lost heart (was full)
        const ts = prevTs ?? now;
        const state: HeartsState = {
          hearts: next,
          maxHearts: MAX_HEARTS,
          lastHeartLostAt: ts,
          isUnlimited: false,
        };
        writeStorage(state);

        // Async sync to Supabase
        if (user?.id) {
          saveHeartsToSupabase(user.id, {
            hearts: next,
            max_hearts: MAX_HEARTS,
            last_heart_lost_at: ts,
            is_unlimited: false,
          });
        }
        return ts;
      });

      return next;
    });
  }, [isPremium, user?.id]);

  const addHeart = useCallback((count: number = 1) => {
    if (isPremium) return;

    setHearts((prev) => {
      const next = Math.min(MAX_HEARTS, prev + count);

      // Use setLastHeartLostAt callback to read current value without stale closure
      setLastHeartLostAt((prevTs) => {
        const newTs = next >= MAX_HEARTS ? null : prevTs;
        const state: HeartsState = {
          hearts: next,
          maxHearts: MAX_HEARTS,
          lastHeartLostAt: newTs,
          isUnlimited: false,
        };
        writeStorage(state);

        // Async sync to Supabase
        if (user?.id) {
          saveHeartsToSupabase(user.id, {
            hearts: next,
            max_hearts: MAX_HEARTS,
            last_heart_lost_at: newTs,
            is_unlimited: false,
          });
        }
        return newTs;
      });

      return next;
    });
  }, [isPremium, user?.id]);

  const refillHearts = useCallback(() => {
    setHearts(MAX_HEARTS);
    setLastHeartLostAt(null);
    writeStorage({
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      lastHeartLostAt: null,
      isUnlimited: isPremium,
    });

    // Async sync to Supabase
    if (user?.id) {
      saveHeartsToSupabase(user.id, {
        hearts: MAX_HEARTS,
        max_hearts: MAX_HEARTS,
        last_heart_lost_at: null,
        is_unlimited: isPremium,
      });
    }
  }, [isPremium, user?.id]);

  const getRegenTimeMs = useCallback((): number => {
    if (!lastHeartLostAt || hearts >= MAX_HEARTS) return 0;

    const elapsed = Date.now() - new Date(lastHeartLostAt).getTime();
    const remaining = REGEN_INTERVAL_MS - (elapsed % REGEN_INTERVAL_MS);
    return remaining;
  }, [lastHeartLostAt, hearts]);

  const childMode = isChildMode();

  const value = useMemo<HeartsContextType>(
    () => ({
      // In child mode, always report full hearts (unlimited lives)
      hearts: (isPremium || childMode) ? MAX_HEARTS : hearts,
      maxHearts: MAX_HEARTS,
      lastHeartLostAt: childMode ? null : lastHeartLostAt,
      isUnlimited: isPremium || childMode,
      childMode,
      loseHeart,
      addHeart,
      refillHearts,
      getRegenTimeMs,
    }),
    [hearts, lastHeartLostAt, isPremium, childMode, loseHeart, addHeart, refillHearts, getRegenTimeMs],
  );

  return <HeartsContext.Provider value={value}>{children}</HeartsContext.Provider>;
}
