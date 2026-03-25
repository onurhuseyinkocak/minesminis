/**
 * Habit Tracker Service
 * Persists daily activity dates per user in localStorage.
 * All functions are pure / idempotent and work offline-first.
 */

const LS_KEY = 'mm_activity_dates';

// ----------------------------------------------------------------
// helpers
// ----------------------------------------------------------------

function storageKey(userId: string): string {
  return `${LS_KEY}_${userId}`;
}

function todayISO(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Parse stored JSON, returning a sorted deduplicated array of ISO date strings. */
function loadDates(userId: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const unique = [...new Set(parsed.filter((d): d is string => typeof d === 'string'))];
    return unique.sort();
  } catch {
    return [];
  }
}

function saveDates(userId: string, dates: string[]): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(dates));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// ----------------------------------------------------------------
// public API
// ----------------------------------------------------------------

/**
 * Log today as an active day for the given user (idempotent).
 */
export function logActivityToday(userId: string): void {
  const dates = loadDates(userId);
  const today = todayISO();
  if (!dates.includes(today)) {
    dates.push(today);
    dates.sort();
    saveDates(userId, dates);
  }
}

/**
 * Return all stored activity dates for the given user as sorted ISO strings.
 */
export function getActivityDates(userId: string): string[] {
  return loadDates(userId);
}

/**
 * Calculate the current streak: consecutive active days ending today or yesterday.
 */
export function calculateStreakFromDates(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort().reverse(); // newest first
  const today = todayISO();
  const todayMs = new Date(today).getTime();
  const oneDayMs = 86_400_000;

  // Streak must start from today or yesterday
  const newestMs = new Date(sorted[0]).getTime();
  const diff = todayMs - newestMs;
  if (diff > oneDayMs) return 0; // last activity was more than yesterday

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevMs = new Date(sorted[i]).getTime();
    const currMs = new Date(sorted[i - 1]).getTime();
    if (currMs - prevMs === oneDayMs) {
      streak++;
    } else if (currMs - prevMs > oneDayMs) {
      break;
    }
    // equal means duplicate — skip handled by dedup at load time
  }

  return streak;
}

/**
 * Return the longest consecutive streak ever from the activity dates array.
 */
export function getLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort();
  const oneDayMs = 86_400_000;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevMs = new Date(sorted[i - 1]).getTime();
    const currMs = new Date(sorted[i]).getTime();
    if (currMs - prevMs === oneDayMs) {
      current++;
      if (current > longest) longest = current;
    } else if (currMs - prevMs > oneDayMs) {
      current = 1;
    }
  }

  return longest;
}

/**
 * Return activity rate (0–100) for the last 30 days.
 */
export function getActivityRate30Days(dates: string[]): number {
  const dateSet = new Set(dates);
  const today = new Date();
  let count = 0;

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (dateSet.has(iso)) count++;
  }

  return Math.round((count / 30) * 100);
}

/**
 * Return activity dates within a date range (inclusive on both ends).
 */
export function getActivityInRange(dates: string[], startDate: string, endDate: string): string[] {
  return dates.filter((d) => d >= startDate && d <= endDate);
}
