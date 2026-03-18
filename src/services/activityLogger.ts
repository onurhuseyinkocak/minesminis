/**
 * ACTIVITY LOGGER SERVICE
 * Tracks all child learning activities in localStorage.
 * Used by the Parent Dashboard to show detailed analytics.
 */

// ============================================================
// TYPES
// ============================================================

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'phonics' | 'game' | 'reading' | 'song' | 'review' | 'challenge';
  title: string;
  duration: number; // seconds
  accuracy?: number; // 0-100
  xpEarned: number;
  soundId?: string;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  totalMinutes: number;
  sessionCount: number;
  activities: ActivityLog[];
}

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'mimi_activity_log';
const MAX_LOG_ENTRIES = 500; // Keep logs trimmed

// ============================================================
// HELPERS
// ============================================================

function generateId(): string {
  return `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
}

function loadLogs(userId?: string): ActivityLog[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as ActivityLog[];
  } catch {
    return [];
  }
}

function saveLogs(logs: ActivityLog[], userId?: string): void {
  try {
    // Keep only the most recent entries
    const trimmed = logs.slice(-MAX_LOG_ENTRIES);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trimmed));
  } catch {
    // localStorage might be full or unavailable
  }
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Log a new activity. Called after lessons, games, challenges complete.
 */
export function logActivity(
  activity: Omit<ActivityLog, 'id' | 'timestamp'>,
): void {
  const logs = loadLogs();
  const entry: ActivityLog = {
    ...activity,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  logs.push(entry);
  saveLogs(logs);
}

/**
 * Get the most recent activities, newest first.
 * If userId is provided, reads from per-user scoped storage.
 */
export function getRecentActivities(limit = 10, userId?: string): ActivityLog[] {
  const logs = loadLogs(userId);
  return logs.slice(-limit).reverse();
}

/**
 * Get activity data for the last 7 days (for weekly timeline chart).
 * If userId is provided, reads from per-user scoped storage.
 */
export function getWeeklyActivityData(userId?: string): DayActivity[] {
  const logs = loadLogs(userId);
  const now = new Date();
  const days: DayActivity[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = toDateKey(d);
    const dayLabel = getDayLabel(d.toISOString());

    const dayLogs = logs.filter(
      (l) => l.timestamp.slice(0, 10) === dateKey,
    );

    const totalSeconds = dayLogs.reduce((sum, l) => sum + l.duration, 0);

    days.push({
      date: dateKey,
      dayLabel,
      totalMinutes: Math.round(totalSeconds / 60),
      sessionCount: dayLogs.length,
      activities: dayLogs,
    });
  }

  return days;
}

/**
 * Get time breakdown by activity type (for pie chart).
 * Returns seconds spent in each category.
 * If userId is provided, reads from per-user scoped storage.
 */
export function getActivityBreakdown(userId?: string): Record<string, number> {
  const logs = loadLogs(userId);
  const breakdown: Record<string, number> = {
    phonics: 0,
    game: 0,
    reading: 0,
    song: 0,
    review: 0,
    challenge: 0,
  };

  for (const log of logs) {
    if (log.type in breakdown) {
      breakdown[log.type] += log.duration;
    }
  }

  return breakdown;
}

/**
 * Get total minutes spent today.
 * If userId is provided, reads from per-user scoped storage.
 */
export function getTodayMinutes(userId?: string): number {
  const logs = loadLogs(userId);
  const today = toDateKey(new Date());
  const todayLogs = logs.filter((l) => l.timestamp.slice(0, 10) === today);
  const totalSeconds = todayLogs.reduce((sum, l) => sum + l.duration, 0);
  return Math.round(totalSeconds / 60);
}

/**
 * Get total minutes and sessions for the current week.
 * If userId is provided, reads from per-user scoped storage.
 */
export function getWeeklySummary(userId?: string): {
  totalMinutes: number;
  sessionCount: number;
  previousWeekMinutes: number;
} {
  const logs = loadLogs(userId);
  const now = new Date();

  // Current week (last 7 days)
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Previous week (7-14 days ago)
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  let currentWeekSeconds = 0;
  let currentWeekSessions = 0;
  let prevWeekSeconds = 0;

  for (const log of logs) {
    const logDate = new Date(log.timestamp);
    if (logDate >= weekAgo) {
      currentWeekSeconds += log.duration;
      currentWeekSessions++;
    } else if (logDate >= twoWeeksAgo) {
      prevWeekSeconds += log.duration;
    }
  }

  return {
    totalMinutes: Math.round(currentWeekSeconds / 60),
    sessionCount: currentWeekSessions,
    previousWeekMinutes: Math.round(prevWeekSeconds / 60),
  };
}
