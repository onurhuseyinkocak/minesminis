/**
 * SPACED REPETITION ENGINE — Leitner Box System
 * MinesMinis v1.0
 *
 * 3-box Leitner system:
 *   Box 1 → review daily        (new / failed words)
 *   Box 2 → review every 3 days (getting better)
 *   Box 3 → review every 7 days (almost mastered)
 *
 * Words move UP on correct, DOWN to Box 1 on wrong.
 * Storage: localStorage with key `mm_srs_${userId}`.
 */

export interface WordReview {
  word: string;
  box: 1 | 2 | 3;
  lastReviewed: number; // timestamp ms
  nextReview: number;   // timestamp ms when due
  correct: number;      // total correct answers
  incorrect: number;    // total incorrect answers
  streak: number;       // current correct streak
}

export interface SRSState {
  words: Record<string, WordReview>;
  userId: string;
  lastUpdated: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BOX_INTERVALS: Record<1 | 2 | 3, number> = {
  1: 1,  // days
  2: 3,
  3: 7,
};

const MS_PER_DAY = 86_400_000;

function storageKey(userId: string): string {
  return `mm_srs_${userId}`;
}

function daysFromNow(days: number): number {
  return Date.now() + days * MS_PER_DAY;
}

// ─── State I/O ────────────────────────────────────────────────────────────────

export function getSRSState(userId: string): SRSState {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) {
      try {
        return JSON.parse(raw) as SRSState;
      } catch {
        // corrupted storage — return blank
      }
    }
  } catch {
    // localStorage unavailable
  }
  return { words: {}, userId, lastUpdated: Date.now() };
}

export function saveSRSState(userId: string, state: SRSState): void {
  try {
    const updated: SRSState = { ...state, lastUpdated: Date.now() };
    localStorage.setItem(storageKey(userId), JSON.stringify(updated));

    // Fire-and-forget: sync to Supabase for cross-device restore
    import('../services/supabaseSync').then(({ syncSpacedRepetition }) => {
      void syncSpacedRepetition(userId, updated.words);
    }).catch(() => {
      // Silent fail — localStorage is primary
    });
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// ─── Word Management ──────────────────────────────────────────────────────────

/**
 * Add a word to Box 1 if not already tracked.
 */
export function addWord(userId: string, word: string): void {
  const state = getSRSState(userId);
  if (state.words[word]) return; // already tracked — don't reset progress

  const now = Date.now();
  const review: WordReview = {
    word,
    box: 1,
    lastReviewed: now,
    nextReview: now, // due immediately (new word)
    correct: 0,
    incorrect: 0,
    streak: 0,
  };

  saveSRSState(userId, { ...state, words: { ...state.words, [word]: review } });
}

/**
 * Record a correct or incorrect answer and move the word between boxes.
 */
export function recordAnswer(userId: string, word: string, correct: boolean): void {
  let state = getSRSState(userId);
  let existing = state.words[word];

  const now = Date.now();

  if (!existing) {
    // Auto-add the word inline instead of recursing
    const newReview: WordReview = {
      word,
      box: 1,
      lastReviewed: now,
      nextReview: now,
      correct: 0,
      incorrect: 0,
      streak: 0,
    };
    state = { ...state, words: { ...state.words, [word]: newReview } };
    existing = newReview;
  }

  let newBox: 1 | 2 | 3;
  let newStreak: number;

  if (correct) {
    // Move up one box (max 3)
    newBox = existing.box < 3 ? ((existing.box + 1) as 2 | 3) : 3;
    newStreak = existing.streak + 1;
  } else {
    // Drop back to Box 1
    newBox = 1;
    newStreak = 0;
  }

  const updated: WordReview = {
    ...existing,
    box: newBox,
    lastReviewed: now,
    nextReview: daysFromNow(BOX_INTERVALS[newBox]),
    correct: correct ? existing.correct + 1 : existing.correct,
    incorrect: correct ? existing.incorrect : existing.incorrect + 1,
    streak: newStreak,
  };

  saveSRSState(userId, {
    ...state,
    words: { ...state.words, [word]: updated },
  });
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Returns words that are due for review right now, sorted by box (lowest first).
 */
export function getDueWords(userId: string, limit?: number): string[] {
  const state = getSRSState(userId);
  const now = Date.now();

  const due = Object.values(state.words)
    .filter((r) => r.nextReview <= now)
    .sort((a, b) => a.box - b.box || a.nextReview - b.nextReview)
    .map((r) => r.word);

  return limit !== undefined ? due.slice(0, limit) : due;
}

/**
 * Returns the WordReview record for a single word, or null if not tracked.
 */
export function getWordStats(userId: string, word: string): WordReview | null {
  const state = getSRSState(userId);
  return state.words[word] ?? null;
}

/**
 * Returns what percentage of tracked words are in Box 3 (mastered),
 * relative to `totalWords` (e.g. the total word count in the lesson set).
 */
export function getMasteryPercent(userId: string, totalWords: number): number {
  if (totalWords <= 0) return 0;
  const state = getSRSState(userId);
  const masteredCount = Object.values(state.words).filter((r) => r.box === 3).length;
  return Math.round((masteredCount / totalWords) * 100);
}
