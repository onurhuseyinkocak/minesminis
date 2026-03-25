/**
 * tracingService — Persists per-user letter tracing progress to localStorage.
 * Data shape: { [userId]: { [letter]: correctTraceCount } }
 */

const LS_KEY = 'mm_tracing';

type ProgressMap = Record<string, number>; // letter → correct trace count
type AllProgress = Record<string, ProgressMap>; // userId → ProgressMap

const MASTERY_THRESHOLD = 3;

function loadAll(): AllProgress {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as AllProgress;
    }
    return {};
  } catch {
    return {};
  }
}

function saveAll(data: AllProgress): void {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

/**
 * Returns the tracing progress for a given user.
 * Keys are lowercase letters; values are the number of correct traces.
 */
export function getTracingProgress(userId: string): ProgressMap {
  const all = loadAll();
  return all[userId] ?? {};
}

/**
 * Records a single trace attempt. Increments the correct count when correct.
 */
export function recordTrace(userId: string, letter: string, correct: boolean): void {
  const all = loadAll();
  if (!all[userId]) all[userId] = {};
  const key = letter.toLowerCase();
  if (correct) {
    all[userId][key] = (all[userId][key] ?? 0) + 1;
  } else {
    // Ensure the key exists so we know it's been attempted
    if (all[userId][key] === undefined) {
      all[userId][key] = 0;
    }
  }
  saveAll(all);
}

/**
 * Returns the list of lowercase letters the user has mastered.
 * A letter is mastered when it has been traced correctly >= MASTERY_THRESHOLD times.
 */
export function getMasteredLetters(userId: string): string[] {
  const progress = getTracingProgress(userId);
  return Object.entries(progress)
    .filter(([, count]) => count >= MASTERY_THRESHOLD)
    .map(([letter]) => letter);
}
