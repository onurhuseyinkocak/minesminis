// ============================================================
// Progress Tracker — localStorage-based lesson/world progress
// MinesMinis v4.0
// Can migrate to Supabase later
// ============================================================

import { WORLDS } from './curriculum';

export interface LessonProgress {
  lessonId: string;
  worldId: string;
  completedAt: string;
  xpEarned: number;
  score: number; // 0-100
}

export interface UserProgress {
  completedLessons: Record<string, LessonProgress>; // lessonId -> progress
  unlockedWorlds: string[]; // world IDs
  currentWorldId: string;
  currentLessonId: string;
}

const STORAGE_KEY = 'mm_user_progress';

// --- Internal helpers ---

function loadAll(): Record<string, UserProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, UserProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getFirstLessonId(worldId: string): string {
  const world = WORLDS.find((w) => w.id === worldId);
  return world && world.lessons.length > 0 ? world.lessons[0].id : '';
}

function makeDefaultProgress(): UserProgress {
  const firstWorld = WORLDS[0];
  return {
    completedLessons: {},
    unlockedWorlds: [firstWorld?.id || 'w1'],
    currentWorldId: firstWorld?.id || 'w1',
    currentLessonId: getFirstLessonId(firstWorld?.id || 'w1'),
  };
}

// --- Public API ---

export function getProgress(userId: string): UserProgress {
  const all = loadAll();
  if (!all[userId]) {
    all[userId] = makeDefaultProgress();
    saveAll(all);
  }
  return all[userId];
}

export function completeLesson(
  userId: string,
  lessonId: string,
  worldId: string,
  xpEarned: number,
  score: number,
): void {
  const all = loadAll();
  const progress = all[userId] || makeDefaultProgress();

  // Mark lesson complete
  progress.completedLessons[lessonId] = {
    lessonId,
    worldId,
    completedAt: new Date().toISOString(),
    xpEarned,
    score,
  };

  // Check if we should unlock the next world
  const worldIndex = WORLDS.findIndex((w) => w.id === worldId);
  if (worldIndex >= 0 && worldIndex < WORLDS.length - 1) {
    const currentWorld = WORLDS[worldIndex];
    const completedInWorld = currentWorld.lessons.filter(
      (l) => progress.completedLessons[l.id],
    ).length;
    // Unlock next world when 7+ lessons completed
    if (completedInWorld >= 7) {
      const nextWorldId = WORLDS[worldIndex + 1].id;
      if (!progress.unlockedWorlds.includes(nextWorldId)) {
        progress.unlockedWorlds.push(nextWorldId);
      }
    }
  }

  // Advance current lesson pointer
  const world = WORLDS.find((w) => w.id === worldId);
  if (world) {
    const lessonIdx = world.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIdx >= 0 && lessonIdx < world.lessons.length - 1) {
      // Next lesson in same world
      progress.currentWorldId = worldId;
      progress.currentLessonId = world.lessons[lessonIdx + 1].id;
    } else {
      // Finished all lessons in this world — move to next unlocked world
      const nextWorld = WORLDS.find(
        (w) =>
          progress.unlockedWorlds.includes(w.id) &&
          w.lessons.some((l) => !progress.completedLessons[l.id]),
      );
      if (nextWorld) {
        progress.currentWorldId = nextWorld.id;
        const firstIncomplete = nextWorld.lessons.find(
          (l) => !progress.completedLessons[l.id],
        );
        progress.currentLessonId = firstIncomplete
          ? firstIncomplete.id
          : nextWorld.lessons[0].id;
      }
    }
  }

  all[userId] = progress;
  saveAll(all);
}

export function isWorldUnlocked(userId: string, worldId: string): boolean {
  const progress = getProgress(userId);
  // World 1 is always unlocked
  if (worldId === (WORLDS[0]?.id || 'w1')) return true;
  return progress.unlockedWorlds.includes(worldId);
}

export function isLessonAvailable(
  userId: string,
  worldId: string,
  lessonId: string,
): boolean {
  const progress = getProgress(userId);

  // If already completed, it's available (for replay)
  if (progress.completedLessons[lessonId]) return true;

  // World must be unlocked
  if (!isWorldUnlocked(userId, worldId)) return false;

  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return false;

  const lessonIdx = world.lessons.findIndex((l) => l.id === lessonId);
  // First lesson of an unlocked world is always available
  if (lessonIdx === 0) return true;

  // Otherwise, previous lesson must be completed
  if (lessonIdx > 0) {
    const prevLessonId = world.lessons[lessonIdx - 1].id;
    return !!progress.completedLessons[prevLessonId];
  }

  return false;
}

export function getWorldCompletionCount(
  userId: string,
  worldId: string,
): number {
  const progress = getProgress(userId);
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return 0;
  return world.lessons.filter((l) => progress.completedLessons[l.id]).length;
}

export function getCurrentLesson(
  userId: string,
): { worldId: string; lessonId: string } | null {
  const progress = getProgress(userId);
  if (!progress.currentWorldId || !progress.currentLessonId) return null;

  // Verify the lesson still exists and is not completed — find first incomplete
  const world = WORLDS.find((w) => w.id === progress.currentWorldId);
  if (!world) return null;

  const firstIncomplete = world.lessons.find(
    (l) => !progress.completedLessons[l.id],
  );
  if (firstIncomplete) {
    return { worldId: world.id, lessonId: firstIncomplete.id };
  }

  // Current world is fully done — find next unlocked world with incomplete lessons
  const nextWorld = WORLDS.find(
    (w) =>
      progress.unlockedWorlds.includes(w.id) &&
      w.lessons.some((l) => !progress.completedLessons[l.id]),
  );
  if (nextWorld) {
    const lesson = nextWorld.lessons.find(
      (l) => !progress.completedLessons[l.id],
    );
    return lesson ? { worldId: nextWorld.id, lessonId: lesson.id } : null;
  }

  return null; // All done!
}
