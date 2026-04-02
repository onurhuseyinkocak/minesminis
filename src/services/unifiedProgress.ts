/**
 * UNIFIED PROGRESS FACADE — MinesMinis v4.0
 * Bridges progressTracker, spacedRepetition, learningPathService, dailyLessonService.
 */

import { getProgress as getTrackerProgress, completeLesson } from '../data/progressTracker';
import { loadAllProgress, setSpacedRepetitionUser, updateWordProgress } from '../data/spacedRepetition';
import { getProgress as getLearningProgress, setLearningPathUser, getNextAction as learningGetNextAction, recordSoundMastery } from './learningPathService';
import type { NextAction } from './learningPathService';
import { isDailyLessonCompletedToday, getLearnedWords, completeDailyLesson, getTodayLesson } from './dailyLessonService';
import { LS_GAMIFICATION_PREFIX } from '../config/storageKeys';

export interface UnifiedProgress {
  phonicsGroup: number;        // 1-7 current Jolly Phonics group
  currentSound: string;        // e.g. "s"
  phaseLabel: string;          // e.g. "Phase 1 – Phonics"
  currentWorldId: string;
  currentLessonId: string;
  completedLessonCount: number;
  unlockedWorlds: string[];
  todayComplete: boolean;
  learnedWords: string[];      // all words ever learned
  masteredSounds: string[];    // all mastered phonemes
  dueWordCount: number;        // words due for review today
  masteryPercent: number;      // % of SRS words with confidenceScore >= 76
  totalXP: number;
  streak: number;
  level: number;
}

export interface LessonCompleteResult {
  leveledUp: boolean;
  worldUnlocked: boolean;
  newStreak: number;
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function loadGamificationStats(userId: string): { xp: number; level: number; streakDays: number } {
  try {
    const raw = localStorage.getItem(`${LS_GAMIFICATION_PREFIX}${userId}`);
    if (!raw) return { xp: 0, level: 1, streakDays: 0 };
    const p = JSON.parse(raw) as { xp?: number; level?: number; streakDays?: number };
    return { xp: p.xp ?? 0, level: p.level ?? 1, streakDays: p.streakDays ?? 0 };
  } catch { return { xp: 0, level: 1, streakDays: 0 }; }
}

function loadMasteredSounds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`mm_mastered_sounds_${userId}`);
    const local = raw ? (JSON.parse(raw) as string[]) : [];

    // Async: try Supabase and update cache if it has more data
    import('./supabaseDataService').then(({ loadMasteredSoundsFromSupabase }) => {
      loadMasteredSoundsFromSupabase(userId).then((sbSounds) => {
        if (sbSounds && sbSounds.length > local.length) {
          try { localStorage.setItem(`mm_mastered_sounds_${userId}`, JSON.stringify(sbSounds)); } catch {}
        }
      });
    }).catch(() => {});

    return local;
  } catch { return []; }
}

function initUserScopes(userId: string): void {
  setLearningPathUser(userId);
  setSpacedRepetitionUser(userId);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getUnifiedProgress(userId: string): UnifiedProgress {
  initUserScopes(userId);
  const tracker = getTrackerProgress(userId);
  const learning = getLearningProgress();
  const gami = loadGamificationStats(userId);
  const allSR = loadAllProgress();
  const now = new Date();

  return {
    phonicsGroup: learning.group,
    currentSound: learning.sound,
    phaseLabel: `Phase ${learning.phase} – Phonics`,
    currentWorldId: tracker.currentWorldId,
    currentLessonId: tracker.currentLessonId,
    completedLessonCount: Object.keys(tracker.completedLessons).length,
    unlockedWorlds: tracker.unlockedWorlds,
    todayComplete: isDailyLessonCompletedToday(userId),
    learnedWords: getLearnedWords(userId),
    masteredSounds: loadMasteredSounds(userId),
    dueWordCount: allSR.filter((p) => new Date(p.nextReview) <= now).length,
    masteryPercent: allSR.length > 0
      ? Math.round((allSR.filter((p) => p.confidenceScore >= 76).length / allSR.length) * 100)
      : 0,
    totalXP: gami.xp,
    streak: gami.streakDays,
    level: gami.level,
  };
}

export function recordLessonComplete(
  userId: string,
  lessonId: string,
  worldId: string,
  score: number,
  xpEarned: number,
  correctWords: string[],
  incorrectWords: string[],
): LessonCompleteResult {
  initUserScopes(userId);
  const worldsBefore = [...getTrackerProgress(userId).unlockedWorlds];
  const levelBefore = loadGamificationStats(userId).level;

  completeLesson(userId, lessonId, worldId, xpEarned, score);
  correctWords.forEach((w) => updateWordProgress(w.toLowerCase(), true));
  incorrectWords.forEach((w) => updateWordProgress(w.toLowerCase(), false));
  recordSoundMastery(lessonId, score, userId);

  if (!isDailyLessonCompletedToday(userId)) {
    completeDailyLesson(userId, getTodayLesson(userId), score);
  }

  const after = getTrackerProgress(userId);
  const gamiAfter = loadGamificationStats(userId);
  return {
    leveledUp: gamiAfter.level > levelBefore,
    worldUnlocked: after.unlockedWorlds.some((w) => !worldsBefore.includes(w)),
    newStreak: gamiAfter.streakDays,
  };
}

/** Delegates to learningPathService, ensuring user scope is set. */
export function getNextAction(userId: string): NextAction {
  initUserScopes(userId);
  return learningGetNextAction();
}
