/**
 * DAILY LESSON SERVICE
 * MinesMinis — structured 15-minute daily learning flow
 *
 * Picks 5 new words (next unlearned in curriculum order) and
 * 5 review words (spaced-repetition due today) for each day.
 */

import { kidsWords, type KidsWord } from '../data/wordsData';
import { getDueWords, updateWordProgress, loadAllProgress } from '../data/spacedRepetition';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DailyLessonPlan {
  date: string;        // YYYY-MM-DD
  newWords: KidsWord[];
  reviewWords: KidsWord[];
  completed: boolean;
  score: number;       // 0-100
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

function dailyKey(userId: string, date: string): string {
  return `mm_daily_${userId}_${date}`;
}

function learnedKey(userId: string): string {
  return `mm_learned_${userId}`;
}

// ─── Learned word tracking ────────────────────────────────────────────────────

export function getLearnedWords(userId: string): string[] {
  try {
    const raw = localStorage.getItem(learnedKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markWordLearned(userId: string, english: string): void {
  const learned = getLearnedWords(userId);
  if (!learned.includes(english)) {
    learned.push(english);
    try {
      localStorage.setItem(learnedKey(userId), JSON.stringify(learned));
    } catch {
      // storage full — ignore
    }
  }
}

// ─── Review word resolver ─────────────────────────────────────────────────────

/**
 * Get words due for review today. Returns KidsWord objects matched
 * from the curriculum by wordId (which is the English word string).
 */
function getDueReviewWords(limit: number): KidsWord[] {
  const due = getDueWords(limit * 3); // over-fetch, filter to known words
  const wordMap = new Map(kidsWords.map((w) => [w.word.toLowerCase(), w]));
  return due
    .map((p) => wordMap.get(p.wordId.toLowerCase()))
    .filter((w): w is KidsWord => w !== undefined)
    .slice(0, limit);
}

// ─── Adaptive difficulty ──────────────────────────────────────────────────────

/**
 * Look at the last 3 days' scores and return the optimal word count for today.
 * - avg >= 90: kid is crushing it → 7 words
 * - avg >= 70: normal pace        → 5 words
 * - avg >= 50: struggling a bit   → 4 words
 * - avg <  50: really struggling  → 3 words
 * - no data:   default            → 5 words
 */
export function getAdaptiveWordCount(userId: string): number {
  const scores: number[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dailyKey(userId, d.toISOString().split('T')[0]);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const data = JSON.parse(saved) as DailyLessonPlan;
        if (data.score !== undefined) scores.push(data.score);
      } catch {
        // ignore parse errors
      }
    }
  }

  if (scores.length === 0) return 5; // default

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avg >= 90) return 7; // kid is crushing it — give more
  if (avg >= 70) return 5; // normal pace
  if (avg >= 50) return 4; // struggling a bit
  return 3;                // really struggling — reduce load
}

// ─── Core plan builder ────────────────────────────────────────────────────────

export function getTodayLesson(userId: string): DailyLessonPlan {
  const today = new Date().toISOString().split('T')[0];

  // Return saved plan if already built today
  try {
    const saved = localStorage.getItem(dailyKey(userId, today));
    if (saved) return JSON.parse(saved) as DailyLessonPlan;
  } catch {
    // ignore parse errors — build fresh
  }

  // Determine word count based on recent performance
  const wordCount = getAdaptiveWordCount(userId);

  // Pick new words not yet learned
  const learned = getLearnedWords(userId);
  const newWords = kidsWords
    .filter((w) => !learned.includes(w.word.toLowerCase()))
    .slice(0, wordCount);

  // Fill with first words if everything is learned (demo users)
  const safeNewWords = newWords.length >= wordCount
    ? newWords
    : kidsWords.slice(0, wordCount);

  // Pick up to 5 review words due today
  const reviewWords = getDueReviewWords(5);

  const plan: DailyLessonPlan = {
    date: today,
    newWords: safeNewWords,
    reviewWords,
    completed: false,
    score: 0,
  };

  // Persist the plan so the same words show all day
  try {
    localStorage.setItem(dailyKey(userId, today), JSON.stringify(plan));
  } catch {
    // ignore
  }

  return plan;
}

export function isDailyLessonCompletedToday(userId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  try {
    const saved = localStorage.getItem(dailyKey(userId, today));
    if (!saved) return false;
    return (JSON.parse(saved) as DailyLessonPlan).completed;
  } catch {
    return false;
  }
}

export function completeDailyLesson(
  userId: string,
  plan: DailyLessonPlan,
  score: number,
): void {
  const updated: DailyLessonPlan = { ...plan, completed: true, score };

  try {
    localStorage.setItem(dailyKey(userId, plan.date), JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Mark new words as learned
  plan.newWords.forEach((w) => markWordLearned(userId, w.word.toLowerCase()));

  // Update spaced-repetition for review words
  const wasGoodScore = score >= 70;
  plan.reviewWords.forEach((w) => updateWordProgress(w.word.toLowerCase(), wasGoodScore));

  // Also register new words in spaced-repetition engine so they appear for future reviews
  plan.newWords.forEach((w) => updateWordProgress(w.word.toLowerCase(), true));
}

/**
 * How many words has this user learned in total?
 * Uses spaced-repetition entries as the authoritative count.
 */
export function getTotalLearnedCount(userId: string): number {
  // Prefer spaced-rep engine count (more accurate)
  const srCount = loadAllProgress().length;
  if (srCount > 0) return srCount;
  return getLearnedWords(userId).length;
}
