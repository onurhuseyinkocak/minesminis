/**
 * Psychological Gamification Service
 * Daily goal, combo tracking, streak shame, perfect lesson logic.
 * Duolingo-style psychological hooks for engagement + retention.
 */

const KEYS = {
  dailyGoal: 'mm_psych_daily_goal',
  todayXP: (uid: string) => `mm_psych_today_xp_${uid}_${new Date().toDateString()}`,
  lastPromptDate: 'mm_psych_last_shame_prompt',
  perfectCount: (uid: string) => `mm_psych_perfect_${uid}`,
  comboRecord: (uid: string) => `mm_psych_combo_record_${uid}`,
};

// ─── Daily Goal ────────────────────────────────────────────────────────────────

export type DailyGoalLevel = 10 | 20 | 30 | 50;

export const DAILY_GOAL_OPTIONS: { xp: DailyGoalLevel; label: string; labelTr: string; icon: string }[] = [
  { xp: 10, label: 'Casual',   labelTr: 'Hafif',   icon: 'leaf'    },
  { xp: 20, label: 'Normal',   labelTr: 'Normal',  icon: 'zap'     },
  { xp: 30, label: 'Serious',  labelTr: 'Ciddi',   icon: 'flame'   },
  { xp: 50, label: 'Intense',  labelTr: 'Yoğun',   icon: 'diamond' },
];

export function getDailyGoal(): DailyGoalLevel {
  const saved = localStorage.getItem(KEYS.dailyGoal);
  if (saved === '10' || saved === '20' || saved === '30' || saved === '50') {
    return Number(saved) as DailyGoalLevel;
  }
  return 20; // default
}

export function setDailyGoal(goal: DailyGoalLevel): void {
  localStorage.setItem(KEYS.dailyGoal, String(goal));
}

// ─── Today XP ─────────────────────────────────────────────────────────────────

export function getTodayXP(uid: string): number {
  const val = localStorage.getItem(KEYS.todayXP(uid));
  return val ? Number(val) : 0;
}

export function addTodayXP(uid: string, amount: number): number {
  const current = getTodayXP(uid);
  const next = current + amount;
  localStorage.setItem(KEYS.todayXP(uid), String(next));
  return next;
}

export function isDailyGoalMet(uid: string): boolean {
  return getTodayXP(uid) >= getDailyGoal();
}

// ─── Combo Logic ───────────────────────────────────────────────────────────────

export interface ComboTier {
  minCombo: number;
  multiplier: number;
  label: string;
  labelTr: string;
  color: string; // CSS var token
}

export const COMBO_TIERS: ComboTier[] = [
  { minCombo: 10, multiplier: 3.0, label: 'ON FIRE!',   labelTr: 'YANIYORSUN!',    color: 'var(--color-error-500)'   },
  { minCombo: 5,  multiplier: 2.0, label: 'HOT!',       labelTr: 'SÜPER!',         color: 'var(--color-primary-500)' },
  { minCombo: 3,  multiplier: 1.5, label: 'GREAT!',     labelTr: 'HARİKA!',       color: 'var(--color-success-500)' },
];

export function getComboTier(combo: number): ComboTier | null {
  return COMBO_TIERS.find(t => combo >= t.minCombo) ?? null;
}

export function applyComboMultiplier(baseXP: number, combo: number): number {
  const tier = getComboTier(combo);
  if (!tier) return baseXP;
  return Math.round(baseXP * tier.multiplier);
}

export function getComboRecord(uid: string): number {
  return Number(localStorage.getItem(KEYS.comboRecord(uid)) ?? 0);
}

export function updateComboRecord(uid: string, combo: number): void {
  if (combo > getComboRecord(uid)) {
    localStorage.setItem(KEYS.comboRecord(uid), String(combo));
  }
}

// ─── Streak Shame ─────────────────────────────────────────────────────────────

/**
 * Returns true if we should show the "streak at risk" modal.
 * Fires once per day, after 6pm, if the user hasn't practiced today
 * and has a streak >= 2 days.
 */
/** Local YYYY-MM-DD string (avoids toDateString locale drift) */
function localYMD(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function shouldShowStreakShame(streakDays: number, lastActivityDate: string | null): boolean {
  if (streakDays < 2) return false;

  const todayYMD = localYMD();
  // Use locale-independent YYYY-MM-DD for both store and compare
  const lastPrompt = localStorage.getItem(KEYS.lastPromptDate);
  if (lastPrompt === todayYMD) return false; // already shown today

  const now = new Date();
  if (now.getHours() < 16) return false; // only after 4pm

  if (!lastActivityDate) return true;

  // Compare using locale-independent YYYY-MM-DD
  const activityYMD = lastActivityDate.length >= 10 ? lastActivityDate.slice(0, 10) : localYMD(new Date(lastActivityDate));
  return activityYMD !== todayYMD; // hasn't practiced today
}

export function markStreakShameShown(): void {
  // Store as YYYY-MM-DD (locale-independent) — must match the read side above
  localStorage.setItem(KEYS.lastPromptDate, localYMD());
}

/** Hours remaining until midnight (streak reset boundary) */
export function getStreakSafeHours(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 3600000));
}

// ─── Perfect Lesson ───────────────────────────────────────────────────────────

export function getPerfectLessonCount(uid: string): number {
  return Number(localStorage.getItem(KEYS.perfectCount(uid)) ?? 0);
}

export function recordPerfectLesson(uid: string): void {
  const next = getPerfectLessonCount(uid) + 1;
  localStorage.setItem(KEYS.perfectCount(uid), String(next));
}

export interface PerfectLessonReward {
  bonusXP: number;
  label: string;
  labelTr: string;
}

export function getPerfectLessonReward(baseXP: number): PerfectLessonReward {
  return {
    bonusXP: baseXP, // double XP
    label: 'Perfect Lesson! 2× XP',
    labelTr: 'Mükemmel Ders! 2× XP',
  };
}
