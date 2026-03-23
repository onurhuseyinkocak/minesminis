/**
 * SPACED REPETITION ENGINE
 * MinesMinis v4.0
 *
 * Modified SM-2 algorithm for vocabulary learning.
 * Tracks per-word progress, schedules reviews, and assigns confidence levels.
 */

// ============================================================
// TYPES
// ============================================================

export interface WordProgress {
  wordId: string;
  firstSeen: string;        // ISO date
  lastReviewed: string;      // ISO date
  correctCount: number;
  incorrectCount: number;
  confidenceScore: number;   // 0-100
  interval: number;          // days until next review
  nextReview: string;        // ISO date
  easeFactor: number;        // SM-2 ease factor (min 1.3)
}

export type ConfidenceLevel = 'new' | 'learning' | 'reviewing' | 'mastered';

// ============================================================
// CONSTANTS
// ============================================================

const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const EASE_DECREASE = 0.2;

/** Graduated interval steps (in days) for consecutive correct answers */
const INTERVAL_STEPS = [1, 3, 7, 14, 30, 60];

const CONFIDENCE_INCREASE = 15;
const CONFIDENCE_DECREASE = 20;

// ============================================================
// HELPERS
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toISODate(date: Date): string {
  return date.toISOString();
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Determine which interval step to use based on the current interval.
 * Finds the next step that is greater than the current interval,
 * or scales by ease factor if beyond the predefined steps.
 */
function getNextInterval(currentInterval: number, easeFactor: number): number {
  for (const step of INTERVAL_STEPS) {
    if (step > currentInterval) {
      return step;
    }
  }
  // Beyond predefined steps — multiply the current interval by ease factor
  // Cap at 365 days to prevent Infinity from corrupted easeFactor
  const result = Math.round(currentInterval * easeFactor);
  return isFinite(result) && result > 0 ? Math.min(result, 365) : 30;
}

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Create initial progress entry for a newly encountered word.
 */
export function createInitialProgress(wordId: string): WordProgress {
  const now = new Date();
  return {
    wordId,
    firstSeen: toISODate(now),
    lastReviewed: toISODate(now),
    correctCount: 0,
    incorrectCount: 0,
    confidenceScore: 0,
    interval: 0,
    nextReview: toISODate(now), // immediately reviewable
    easeFactor: INITIAL_EASE_FACTOR,
  };
}

/**
 * Calculate the next review schedule after an answer attempt.
 *
 * On correct:
 *   - Advance to next interval step (1 → 3 → 7 → 14 → 30 → 60 days)
 *   - Increase confidence by 15 (clamped to 100)
 *   - Ease factor stays or rises naturally (clamped min 1.3)
 *
 * On incorrect:
 *   - Reset interval to 1 day
 *   - Decrease confidence by 20 (clamped to 0)
 *   - Decrease ease factor by 0.2 (clamped min 1.3)
 */
export function calculateNextReview(
  progress: WordProgress,
  wasCorrect: boolean
): WordProgress {
  const now = new Date();
  let { interval, confidenceScore, easeFactor, correctCount, incorrectCount } = progress;

  if (wasCorrect) {
    correctCount += 1;
    interval = getNextInterval(interval, easeFactor);
    confidenceScore = clamp(confidenceScore + CONFIDENCE_INCREASE, 0, 100);
    // Ease factor stays; only clamped at min
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor);
  } else {
    incorrectCount += 1;
    interval = 1;
    confidenceScore = clamp(confidenceScore - CONFIDENCE_DECREASE, 0, 100);
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - EASE_DECREASE);
  }

  const nextReviewDate = addDays(now, interval);

  return {
    ...progress,
    lastReviewed: toISODate(now),
    correctCount,
    incorrectCount,
    confidenceScore,
    interval,
    nextReview: toISODate(nextReviewDate),
    easeFactor,
  };
}

/**
 * Get words that are due for review, sorted by urgency (most overdue first).
 * Words with nextReview <= now are considered due.
 *
 * @param allProgress - All tracked word progress entries
 * @param limit - Maximum number of words to return (default: 20)
 */
export function getWordsForReview(
  allProgress: WordProgress[],
  limit: number = 20
): WordProgress[] {
  const now = new Date();

  return allProgress
    .filter((p) => new Date(p.nextReview) <= now)
    .sort((a, b) => {
      // Most overdue first (earliest nextReview = most urgent)
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    })
    .slice(0, limit);
}

/**
 * Map a numeric confidence score to a human-readable level.
 *
 *   0-25  → new
 *  26-50  → learning
 *  51-75  → reviewing
 *  76-100 → mastered
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score <= 25) return 'new';
  if (score <= 50) return 'learning';
  if (score <= 75) return 'reviewing';
  return 'mastered';
}

// ============================================================
// PERSISTENCE (localStorage) — user-scoped
// ============================================================

const LS_SR_KEY = 'mimi_spaced_repetition';

let _srActiveUserId: string | null = null;

/**
 * Set the active user ID so spaced repetition data is scoped per user.
 * Call this from AuthContext when a user logs in.
 */
export function setSpacedRepetitionUser(userId: string): void {
  _srActiveUserId = userId;
}

function getScopedSRKey(): string {
  return _srActiveUserId ? `${LS_SR_KEY}_${_srActiveUserId}` : LS_SR_KEY;
}

/** Load all word progress entries from localStorage */
export function loadAllProgress(): WordProgress[] {
  try {
    const raw = localStorage.getItem(getScopedSRKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save all word progress entries to localStorage */
function saveAllProgress(entries: WordProgress[]): void {
  try {
    localStorage.setItem(getScopedSRKey(), JSON.stringify(entries));
  } catch {
    // storage full — silently ignore
  }
}

/**
 * Update progress for a single word and persist.
 * Creates initial progress if the word hasn't been seen before.
 */
export function updateWordProgress(wordId: string, wasCorrect: boolean): WordProgress {
  const all = loadAllProgress();
  const existing = all.find((p) => p.wordId === wordId);
  const current = existing || createInitialProgress(wordId);
  const updated = calculateNextReview(current, wasCorrect);

  if (existing) {
    const idx = all.indexOf(existing);
    all[idx] = updated;
  } else {
    all.push(updated);
  }

  saveAllProgress(all);
  return updated;
}

/**
 * Get words currently due for review (convenience wrapper that loads from storage).
 */
export function getDueWords(limit: number = 20): WordProgress[] {
  return getWordsForReview(loadAllProgress(), limit);
}
