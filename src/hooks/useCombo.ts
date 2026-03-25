/**
 * useCombo hook
 * Manages in-game combo state for psychological gamification.
 * Drop into any game component to get streak multipliers.
 *
 * Usage:
 *   const { combo, onCorrect, onWrong, comboXP } = useCombo(uid);
 *   // onCorrect(baseXP) → returns final XP after multiplier
 *   // onWrong() → resets combo
 */
import { useState, useCallback, useRef } from 'react';
import {
  applyComboMultiplier,
  updateComboRecord,
} from '../services/psychGamification';
import { SFX } from '../data/soundLibrary';

export interface UseComboReturn {
  combo: number;
  onCorrect: (baseXP: number) => number;
  onWrong: () => void;
  resetCombo: () => void;
}

export function useCombo(uid?: string): UseComboReturn {
  const [combo, setCombo] = useState(0);
  // Use a ref to always have the latest combo value, avoiding stale closure
  const comboRef = useRef(combo);
  comboRef.current = combo;

  const onCorrect = useCallback((baseXP: number): number => {
    const next = comboRef.current + 1;
    setCombo(next);

    if (uid) updateComboRecord(uid, next);
    // Play a different sound at combo milestones
    if (next === 3) SFX.streak();
    else if (next === 5) SFX.celebration();

    return applyComboMultiplier(baseXP, next);
  }, [uid]);

  const onWrong = useCallback(() => {
    setCombo(0);
  }, []);

  const resetCombo = useCallback(() => {
    setCombo(0);
  }, []);

  return { combo, onCorrect, onWrong, resetCombo };
}
