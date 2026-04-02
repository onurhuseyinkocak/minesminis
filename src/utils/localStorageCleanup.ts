/**
 * localStorage Cleanup Utility
 *
 * Several features write date-keyed entries that grow unboundedly:
 *   - mm_daily_{userId}_{date}    (dailyLessonService)
 *   - mm_daily_lessons_{date}     (LessonPlayer)
 *   - mm_daily_phases_{date}      (DailyLesson)
 *   - mm_weekend_warrior_{year}_{week}  (GamificationContext)
 *   - mimi_unit_progress_{unitId} (LessonPlayer)
 *
 * This module prunes stale entries on app startup.
 */

/** Max age in days for date-keyed localStorage entries. */
const MAX_AGE_DAYS = 14;

/** Prefixes of date-keyed entries that should be pruned. */
const DATE_KEY_PREFIXES = [
  'mm_daily_lessons_',   // key format: mm_daily_lessons_YYYY-MM-DD
  'mm_daily_phases_',    // key format: mm_daily_phases_YYYY-MM-DD
  'mm_daily_',           // key format: mm_daily_{userId}_YYYY-MM-DD  (checked last — broader prefix)
] as const;

/** Prefixes of week-keyed entries. */
const WEEK_KEY_PREFIXES = [
  'mm_weekend_warrior_', // key format: mm_weekend_warrior_{year}_{weekNum}
] as const;

/** Max unit progress entries to retain (most recent by updatedAt). */
const MAX_UNIT_PROGRESS = 50;

/**
 * Extract an ISO date (YYYY-MM-DD) from the end of a key.
 * Returns null if no valid date found.
 */
function extractTrailingDate(key: string): string | null {
  const match = key.match(/(\d{4}-\d{2}-\d{2})$/);
  return match ? match[1] : null;
}

/**
 * Prune date-keyed localStorage entries older than MAX_AGE_DAYS.
 */
function pruneDateKeys(): void {
  const now = Date.now();
  const maxAgeMs = MAX_AGE_DAYS * 86_400_000;
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Check date-keyed prefixes
    const isDateKey = DATE_KEY_PREFIXES.some((p) => key.startsWith(p));
    if (isDateKey) {
      const dateStr = extractTrailingDate(key);
      if (dateStr) {
        const entryTime = new Date(dateStr).getTime();
        if (!Number.isNaN(entryTime) && now - entryTime > maxAgeMs) {
          keysToRemove.push(key);
        }
      }
    }

    // Check week-keyed prefixes (keep last 4 weeks worth ~ 28 days)
    const isWeekKey = WEEK_KEY_PREFIXES.some((p) => key.startsWith(p));
    if (isWeekKey) {
      // Format: mm_weekend_warrior_{year}_{weekNum}
      const parts = key.split('_');
      const yearStr = parts[parts.length - 2];
      const weekStr = parts[parts.length - 1];
      const year = parseInt(yearStr, 10);
      const week = parseInt(weekStr, 10);
      if (!Number.isNaN(year) && !Number.isNaN(week)) {
        // Approximate: current week number
        const currentWeek = Math.floor(now / (7 * 86_400_000));
        const entryWeek = Math.floor(new Date(year, 0, 1).getTime() / (7 * 86_400_000)) + week;
        if (currentWeek - entryWeek > 4) {
          keysToRemove.push(key);
        }
      }
    }
  }

  for (const key of keysToRemove) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

/**
 * Prune unit progress entries if there are too many.
 * Keeps the MAX_UNIT_PROGRESS most recently updated entries.
 */
function pruneUnitProgress(): void {
  const PREFIX = 'mimi_unit_progress_';
  const entries: { key: string; updatedAt: number }[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    try {
      const val = JSON.parse(localStorage.getItem(key) || '{}');
      const updatedAt = val.updatedAt ? new Date(val.updatedAt).getTime() : 0;
      entries.push({ key, updatedAt: Number.isNaN(updatedAt) ? 0 : updatedAt });
    } catch {
      entries.push({ key, updatedAt: 0 });
    }
  }

  if (entries.length <= MAX_UNIT_PROGRESS) return;

  // Sort newest first, remove the oldest
  entries.sort((a, b) => b.updatedAt - a.updatedAt);
  const toRemove = entries.slice(MAX_UNIT_PROGRESS);
  for (const { key } of toRemove) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

/**
 * Run all localStorage cleanup tasks.
 * Call once on app startup (e.g. in App.tsx or main.tsx).
 */
export function cleanupLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    pruneDateKeys();
    pruneUnitProgress();
  } catch {
    // Never let cleanup crash the app
  }
}
