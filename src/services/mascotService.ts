/**
 * MASCOT SERVICE
 * Handles selected mascot persistence and new-unlock detection.
 */

import { ALL_MASCOTS, isMascotUnlocked } from '../data/mascotRegistry';
import type { MascotDefinition } from '../data/mascotRegistry';

const LS_KEY = 'mm_selected_mascot';
const DEFAULT_MASCOT_ID = 'mimi_cat';

/** Returns the currently selected mascot id. Defaults to 'mimi_cat'. */
export function getSelectedMascotId(): string {
  try {
    return localStorage.getItem(LS_KEY) ?? DEFAULT_MASCOT_ID;
  } catch {
    return DEFAULT_MASCOT_ID;
  }
}

/** Persists the selected mascot id to localStorage. */
export function setSelectedMascotId(id: string): void {
  try {
    localStorage.setItem(LS_KEY, id);
  } catch {
    // Storage unavailable — fail silently
  }
}

/**
 * Checks whether a new mascot just became unlocked due to a stat change.
 * Returns the first newly-unlocked MascotDefinition, or null.
 */
export function hasNewMascotUnlocked(
  prevLevel: number,
  newLevel: number,
  prevStreak: number,
  newStreak: number,
  prevWords: number,
  newWords: number,
): MascotDefinition | null {
  // We only check non-default mascots (mimi_dragon is always unlocked)
  const candidates = ALL_MASCOTS.filter((m) => m.id !== DEFAULT_MASCOT_ID);

  const prevStats = { level: prevLevel, streakDays: prevStreak, wordsLearned: prevWords, worldsCompleted: 0 };
  const newStats = { level: newLevel, streakDays: newStreak, wordsLearned: newWords, worldsCompleted: 0 };

  for (const mascot of candidates) {
    const wasLocked = !isMascotUnlocked(mascot, prevStats);
    const isNowUnlocked = isMascotUnlocked(mascot, newStats);
    if (wasLocked && isNowUnlocked) {
      return mascot;
    }
  }

  return null;
}
