// ============================================================
// MinesMinis — Unified Progress Types
// Single source of truth for all progress data
// ============================================================

export type AgeGroup =
  | 'little-seeds'    // 2.5-3.5 yaş
  | 'little-ears'     // 3-5 yaş
  | 'word-builders'   // 5-7 yaş
  | 'story-makers'    // 7-9 yaş
  | 'young-explorers'; // 9-12 yaş

export type ActivityType =
  | 'sound-intro' | 'listening' | 'blending' | 'segmenting'
  | 'word-match' | 'image-label' | 'spelling-bee' | 'quick-quiz'
  | 'sentence-builder' | 'sentence-scramble' | 'story-choices'
  | 'pronunciation' | 'say-it' | 'dialogue' | 'phonics-builder'
  | 'phoneme-manipulation' | 'phonetic-trap' | 'rhyme'
  | 'syllable' | 'word-family' | 'tpr' | 'reading' | 'song';

export type UnitStatus = 'locked' | 'unlocked' | 'current' | 'completed';

// Activity result from a game
export interface ActivityResult {
  activityType: ActivityType;
  soundId?: string;
  targetWords?: string[];
  correct: boolean;
  score: number;          // 0-100
  responseTimeMs: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: string;
}

// Per-lesson progress
export interface LessonProgress {
  lessonId: string;
  unitId: string;
  worldId: string;
  completedAt: string | null;
  currentActivityIndex: number;
  totalActivities: number;
  accuracyScore: number;    // 0-100
  xpEarned: number;
  durationSeconds: number;
  activityResults: ActivityResult[];
}

// Per-unit progress
export interface UnitProgress {
  unitId: string;
  worldId: string;
  completedAt: string | null;
  progressPercent: number;          // 0-100
  currentActivityIndex: number;     // global within unit
  lessonsCompleted: string[];
  lastAccessedAt: string | null;
}

// Full user progress state
export interface UserProgressState {
  userId: string;
  childId: string | null;
  currentUnitId: string;
  currentLessonId: string | null;
  units: Record<string, UnitProgress>;   // unitId → progress
  lessons: Record<string, LessonProgress>; // lessonId → progress
  updatedAt: string;
  syncedAt: string | null;               // last Supabase sync
}

// Sync event for offline queue
export interface SyncEvent {
  id: string;
  type: 'unit_progress' | 'lesson_complete' | 'unit_complete' | 'current_unit';
  payload: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
}
