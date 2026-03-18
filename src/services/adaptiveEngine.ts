/**
 * ADAPTIVE AI LEARNING ENGINE
 * MinesMinis v4.0
 *
 * The brain of the platform — tracks everything and adapts in real-time.
 * Inspired by Duolingo's spaced repetition + Khan Academy's mastery learning.
 *
 * Mastery = 40% accuracy + 20% speed + 20% consistency + 20% retention
 * Stores everything in localStorage key `mimi_learner_profile_{userId}`.
 */

import { ALL_SOUNDS, PHONICS_GROUPS } from '../data/phonics';

// ============================================================
// TYPES
// ============================================================

export interface SoundMasteryData {
  soundId: string;
  mastery: number;               // 0-100
  attempts: number;
  correctAttempts: number;
  averageResponseTimeMs: number;
  lastPracticed: string;         // ISO date
  nextReviewDate: string;        // ISO date
  consecutiveCorrect: number;
  consecutiveWrong: number;
  // Granular per-activity tracking
  blendingScore: number;
  segmentingScore: number;
  listeningScore: number;
  pronunciationScore: number;
  readingScore: number;
  // Internal tracking for mastery calculation
  _recentScores: number[];       // last 10 scores for consistency calc
  _responseTimesMs: number[];    // last 10 response times
}

export interface LearnerProfile {
  id: string;
  // Phonics mastery per sound (42 sounds)
  soundMastery: Record<string, SoundMasteryData>;
  // Overall metrics
  totalSessions: number;
  totalTimeMinutes: number;
  averageAccuracy: number;
  strongAreas: string[];         // sound IDs where mastery > 80%
  weakAreas: string[];           // sound IDs where mastery < 40%
  learningSpeed: 'slow' | 'normal' | 'fast';
  preferredActivityType: string; // which activity type they perform best in
  // Session tracking
  sessionsThisWeek: number;
  lastSessionDate: string;
  currentStreak: number;
  longestStreak: number;
  // Difficulty level
  difficultyMultiplier: number;  // 0.5 (easier) to 2.0 (harder)
  // Internal tracking
  _lastActivityType: string;
  _recentSessionAccuracies: number[]; // last 5 session accuracies
  _weekStartDate: string;
}

export interface ActivityResult {
  soundId: string;
  activityType: string;
  correct: boolean;
  responseTimeMs: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface OptimalActivity {
  soundId: string;
  activityType: string;
  difficulty: 'easy' | 'normal' | 'hard';
  wordCount: number;
  timeLimit?: number;
  reason: string;
}

export interface AdaptiveWord {
  word: string;
  difficulty: number;  // 1-5
  phonemes: string[];
  isReview: boolean;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  sessionsCompleted: number;
  minutesLearned: number;
  soundsIntroduced: string[];
  soundsMastered: string[];
  overallAccuracy: number;
  streakDays: number;
  strongestSound: string;
  weakestSound: string;
  recommendation: string;
  xpEarned: number;
  levelProgress: number;
}

export interface LearnerInsight {
  type: 'achievement' | 'struggle' | 'recommendation' | 'milestone';
  title: string;
  titleTr: string;
  description: string;
  descriptionTr: string;
  icon: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const ACTIVITY_TYPES = [
  'blending',
  'segmenting',
  'listening',
  'pronunciation',
  'reading',
] as const;

type ActivityType = typeof ACTIVITY_TYPES[number];

const ACTIVITY_SCORE_KEYS: Record<string, keyof SoundMasteryData> = {
  blending: 'blendingScore',
  segmenting: 'segmentingScore',
  listening: 'listeningScore',
  pronunciation: 'pronunciationScore',
  reading: 'readingScore',
};

/** Age-appropriate benchmark response time in ms (6-8 year olds) */
const BENCHMARK_RESPONSE_TIME_MS = 5000;

/** Spaced repetition intervals in days */
const SR_INTERVALS = [1, 2, 4, 7, 14, 30, 60];

/** Max recent scores/times to keep for consistency calculation */
const MAX_RECENT_ENTRIES = 10;

const MASTERY_STRONG_THRESHOLD = 80;
const MASTERY_WEAK_THRESHOLD = 40;

// ============================================================
// CVC / CCVC / COMPLEX WORD BANKS PER SOUND
// ============================================================

interface WordBank {
  easy: Array<{ word: string; phonemes: string[] }>;    // CVC
  normal: Array<{ word: string; phonemes: string[] }>;   // CVC + CCVC
  hard: Array<{ word: string; phonemes: string[] }>;     // complex, longer
}

/**
 * Returns a word bank for a given sound ID.
 * Falls back to generic words if the sound is not mapped.
 */
function getWordBankForSound(soundId: string): WordBank {
  const soundChar = soundId.replace(/^g\d+_/, '');

  const banks: Record<string, WordBank> = {
    s: {
      easy: [
        { word: 'sat', phonemes: ['s', 'a', 't'] },
        { word: 'sip', phonemes: ['s', 'i', 'p'] },
        { word: 'sun', phonemes: ['s', 'u', 'n'] },
        { word: 'sit', phonemes: ['s', 'i', 't'] },
        { word: 'set', phonemes: ['s', 'e', 't'] },
        { word: 'sob', phonemes: ['s', 'o', 'b'] },
      ],
      normal: [
        { word: 'snap', phonemes: ['s', 'n', 'a', 'p'] },
        { word: 'stop', phonemes: ['s', 't', 'o', 'p'] },
        { word: 'spin', phonemes: ['s', 'p', 'i', 'n'] },
        { word: 'slim', phonemes: ['s', 'l', 'i', 'm'] },
        { word: 'skip', phonemes: ['s', 'k', 'i', 'p'] },
        { word: 'step', phonemes: ['s', 't', 'e', 'p'] },
      ],
      hard: [
        { word: 'splash', phonemes: ['s', 'p', 'l', 'a', 'sh'] },
        { word: 'string', phonemes: ['s', 't', 'r', 'i', 'ng'] },
        { word: 'squish', phonemes: ['s', 'qu', 'i', 'sh'] },
        { word: 'sunset', phonemes: ['s', 'u', 'n', 's', 'e', 't'] },
        { word: 'sister', phonemes: ['s', 'i', 's', 't', 'er'] },
        { word: 'stream', phonemes: ['s', 't', 'r', 'ea', 'm'] },
      ],
    },
    a: {
      easy: [
        { word: 'ant', phonemes: ['a', 'n', 't'] },
        { word: 'add', phonemes: ['a', 'd', 'd'] },
        { word: 'app', phonemes: ['a', 'p', 'p'] },
        { word: 'cap', phonemes: ['c', 'a', 'p'] },
        { word: 'tap', phonemes: ['t', 'a', 'p'] },
        { word: 'map', phonemes: ['m', 'a', 'p'] },
      ],
      normal: [
        { word: 'clap', phonemes: ['c', 'l', 'a', 'p'] },
        { word: 'snap', phonemes: ['s', 'n', 'a', 'p'] },
        { word: 'plan', phonemes: ['p', 'l', 'a', 'n'] },
        { word: 'crab', phonemes: ['c', 'r', 'a', 'b'] },
        { word: 'flag', phonemes: ['f', 'l', 'a', 'g'] },
        { word: 'trap', phonemes: ['t', 'r', 'a', 'p'] },
      ],
      hard: [
        { word: 'apple', phonemes: ['a', 'p', 'p', 'l', 'e'] },
        { word: 'animal', phonemes: ['a', 'n', 'i', 'm', 'a', 'l'] },
        { word: 'action', phonemes: ['a', 'c', 'ti', 'on'] },
        { word: 'basket', phonemes: ['b', 'a', 's', 'k', 'e', 't'] },
        { word: 'camping', phonemes: ['c', 'a', 'm', 'p', 'i', 'ng'] },
        { word: 'rabbit', phonemes: ['r', 'a', 'b', 'b', 'i', 't'] },
      ],
    },
    t: {
      easy: [
        { word: 'tap', phonemes: ['t', 'a', 'p'] },
        { word: 'tin', phonemes: ['t', 'i', 'n'] },
        { word: 'ten', phonemes: ['t', 'e', 'n'] },
        { word: 'top', phonemes: ['t', 'o', 'p'] },
        { word: 'tip', phonemes: ['t', 'i', 'p'] },
        { word: 'tub', phonemes: ['t', 'u', 'b'] },
      ],
      normal: [
        { word: 'trip', phonemes: ['t', 'r', 'i', 'p'] },
        { word: 'trim', phonemes: ['t', 'r', 'i', 'm'] },
        { word: 'trot', phonemes: ['t', 'r', 'o', 't'] },
        { word: 'stop', phonemes: ['s', 't', 'o', 'p'] },
        { word: 'step', phonemes: ['s', 't', 'e', 'p'] },
        { word: 'twin', phonemes: ['t', 'w', 'i', 'n'] },
      ],
      hard: [
        { word: 'turtle', phonemes: ['t', 'ur', 't', 'l', 'e'] },
        { word: 'ticket', phonemes: ['t', 'i', 'ck', 'e', 't'] },
        { word: 'tomato', phonemes: ['t', 'o', 'm', 'a', 't', 'o'] },
        { word: 'toaster', phonemes: ['t', 'oa', 's', 't', 'er'] },
        { word: 'together', phonemes: ['t', 'o', 'g', 'e', 'th', 'er'] },
        { word: 'trumpet', phonemes: ['t', 'r', 'u', 'm', 'p', 'e', 't'] },
      ],
    },
  };

  // Default fallback bank for unmapped sounds
  const fallback: WordBank = {
    easy: [
      { word: 'cat', phonemes: ['c', 'a', 't'] },
      { word: 'dog', phonemes: ['d', 'o', 'g'] },
      { word: 'pig', phonemes: ['p', 'i', 'g'] },
      { word: 'hen', phonemes: ['h', 'e', 'n'] },
      { word: 'bug', phonemes: ['b', 'u', 'g'] },
      { word: 'net', phonemes: ['n', 'e', 't'] },
    ],
    normal: [
      { word: 'frog', phonemes: ['f', 'r', 'o', 'g'] },
      { word: 'drum', phonemes: ['d', 'r', 'u', 'm'] },
      { word: 'clap', phonemes: ['c', 'l', 'a', 'p'] },
      { word: 'grin', phonemes: ['g', 'r', 'i', 'n'] },
      { word: 'swim', phonemes: ['s', 'w', 'i', 'm'] },
      { word: 'plum', phonemes: ['p', 'l', 'u', 'm'] },
    ],
    hard: [
      { word: 'blanket', phonemes: ['b', 'l', 'a', 'n', 'k', 'e', 't'] },
      { word: 'kitchen', phonemes: ['k', 'i', 'tch', 'e', 'n'] },
      { word: 'chicken', phonemes: ['ch', 'i', 'ck', 'e', 'n'] },
      { word: 'monster', phonemes: ['m', 'o', 'n', 's', 't', 'er'] },
      { word: 'pumpkin', phonemes: ['p', 'u', 'm', 'p', 'k', 'i', 'n'] },
      { word: 'problem', phonemes: ['p', 'r', 'o', 'b', 'l', 'e', 'm'] },
    ],
  };

  return banks[soundChar] || fallback;
}

// ============================================================
// STORAGE
// ============================================================

function getStorageKey(userId: string): string {
  return `mimi_learner_profile_${userId}`;
}

function loadProfile(userId: string): LearnerProfile {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return JSON.parse(raw) as LearnerProfile;
    }
  } catch {
    // corrupted data — reset
  }
  return createDefaultProfile(userId);
}

function saveProfile(profile: LearnerProfile): void {
  try {
    localStorage.setItem(getStorageKey(profile.id), JSON.stringify(profile));
  } catch {
    // storage full or unavailable
  }
}

function createDefaultProfile(userId: string): LearnerProfile {
  return {
    id: userId,
    soundMastery: {},
    totalSessions: 0,
    totalTimeMinutes: 0,
    averageAccuracy: 0,
    strongAreas: [],
    weakAreas: [],
    learningSpeed: 'normal',
    preferredActivityType: 'listening',
    sessionsThisWeek: 0,
    lastSessionDate: '',
    currentStreak: 0,
    longestStreak: 0,
    difficultyMultiplier: 1.0,
    _lastActivityType: '',
    _recentSessionAccuracies: [],
    _weekStartDate: getWeekStart(new Date()),
  };
}

function createDefaultSoundMastery(soundId: string): SoundMasteryData {
  return {
    soundId,
    mastery: 0,
    attempts: 0,
    correctAttempts: 0,
    averageResponseTimeMs: 0,
    lastPracticed: '',
    nextReviewDate: new Date().toISOString(),
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    blendingScore: 0,
    segmentingScore: 0,
    listeningScore: 0,
    pronunciationScore: 0,
    readingScore: 0,
    _recentScores: [],
    _responseTimesMs: [],
  };
}

// ============================================================
// UTILITY HELPERS
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function daysBetween(dateA: string, dateB: string): number {
  if (!dateA || !dateB) return Infinity;
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.abs(Math.floor((b - a) / (1000 * 60 * 60 * 24)));
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((v) => (v - mean) ** 2);
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}

function isEvening(): boolean {
  const hour = new Date().getHours();
  return hour >= 18;
}

// ============================================================
// ACTIVE USER STATE (module-level for current session)
// ============================================================

let _activeUserId = 'default';

/**
 * Set the active user ID. All adaptive functions will use this user.
 */
export function setActiveUser(userId: string): void {
  _activeUserId = userId;
}

/**
 * Get the current learner profile (read-only snapshot).
 */
export function getLearnerProfile(): LearnerProfile {
  return loadProfile(_activeUserId);
}

// ============================================================
// MASTERY CALCULATION
// ============================================================

/**
 * Sophisticated mastery calculation:
 * 40% accuracy + 20% speed + 20% consistency + 20% retention
 */
function calculateMastery(sound: SoundMasteryData): number {
  if (sound.attempts === 0) return 0;

  // --- Accuracy (40%) ---
  const accuracyRaw = (sound.correctAttempts / sound.attempts) * 100;
  const accuracyScore = clamp(accuracyRaw, 0, 100);

  // --- Speed (20%) ---
  // Compare to age-appropriate benchmark (5000ms)
  // Faster = higher score, but cap at 100
  let speedScore = 0;
  if (sound.averageResponseTimeMs > 0) {
    const speedRatio = BENCHMARK_RESPONSE_TIME_MS / sound.averageResponseTimeMs;
    speedScore = clamp(speedRatio * 80, 0, 100); // 80% of benchmark = 100 score
  }

  // --- Consistency (20%) ---
  // Low standard deviation in recent scores = high consistency
  let consistencyScore = 50; // default for insufficient data
  if (sound._recentScores.length >= 3) {
    const sd = standardDeviation(sound._recentScores);
    // SD of 0 = perfect consistency (100), SD of 40+ = poor (0)
    consistencyScore = clamp(100 - sd * 2.5, 0, 100);
  }

  // --- Retention (20%) ---
  // Does the child remember after 3+ days?
  let retentionScore = 0;
  if (sound.lastPracticed) {
    const daysSince = daysBetween(sound.lastPracticed, new Date().toISOString());
    if (daysSince >= 3 && accuracyRaw >= 70) {
      // Remembered after 3+ days with good accuracy
      retentionScore = 100;
    } else if (daysSince >= 3 && accuracyRaw >= 50) {
      retentionScore = 60;
    } else if (daysSince >= 1 && accuracyRaw >= 70) {
      retentionScore = 40;
    } else if (accuracyRaw >= 50) {
      retentionScore = 20;
    }
  }

  const mastery = Math.round(
    accuracyScore * 0.4 +
    speedScore * 0.2 +
    consistencyScore * 0.2 +
    retentionScore * 0.2
  );

  return clamp(mastery, 0, 100);
}

/**
 * Calculate the next spaced repetition review date based on mastery.
 */
function calculateNextReviewDate(mastery: number, consecutiveCorrect: number): string {
  let intervalIndex = clamp(consecutiveCorrect, 0, SR_INTERVALS.length - 1);

  // If mastery is low, review sooner
  if (mastery < 40) {
    intervalIndex = Math.max(0, intervalIndex - 2);
  } else if (mastery < 60) {
    intervalIndex = Math.max(0, intervalIndex - 1);
  }

  const intervalDays = SR_INTERVALS[intervalIndex];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate.toISOString();
}

// ============================================================
// RECORD ACTIVITY
// ============================================================

/**
 * Record an activity result. Updates mastery scores, adjusts difficulty,
 * tracks response time, updates weak/strong areas, and calculates
 * if the sound should be marked mastered.
 */
export function recordActivity(result: ActivityResult): void {
  const profile = loadProfile(_activeUserId);
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  // Ensure sound mastery data exists
  if (!profile.soundMastery[result.soundId]) {
    profile.soundMastery[result.soundId] = createDefaultSoundMastery(result.soundId);
  }

  const sound = profile.soundMastery[result.soundId];

  // --- Update attempts ---
  sound.attempts += result.totalQuestions;
  sound.correctAttempts += result.correctAnswers;

  // --- Update consecutive counters ---
  if (result.correct) {
    sound.consecutiveCorrect += 1;
    sound.consecutiveWrong = 0;
  } else {
    sound.consecutiveWrong += 1;
    sound.consecutiveCorrect = 0;
  }

  // --- Update response time (rolling average) ---
  sound._responseTimesMs.push(result.responseTimeMs);
  if (sound._responseTimesMs.length > MAX_RECENT_ENTRIES) {
    sound._responseTimesMs.shift();
  }
  sound.averageResponseTimeMs = Math.round(
    sound._responseTimesMs.reduce((a, b) => a + b, 0) / sound._responseTimesMs.length
  );

  // --- Update per-activity scores ---
  const sessionAccuracy = result.totalQuestions > 0
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0;

  sound._recentScores.push(sessionAccuracy);
  if (sound._recentScores.length > MAX_RECENT_ENTRIES) {
    sound._recentScores.shift();
  }

  const activityKey = ACTIVITY_SCORE_KEYS[result.activityType];
  if (activityKey) {
    const currentScore = sound[activityKey] as number;
    // Weighted update: 60% new, 40% old
    (sound[activityKey] as number) = Math.round(sessionAccuracy * 0.6 + currentScore * 0.4);
  }

  // --- Update timestamps ---
  sound.lastPracticed = now;

  // --- Recalculate mastery ---
  sound.mastery = calculateMastery(sound);

  // --- Spaced repetition: next review date ---
  sound.nextReviewDate = calculateNextReviewDate(sound.mastery, sound.consecutiveCorrect);

  // --- Update profile-level metrics ---
  profile.totalSessions += 1;
  profile._lastActivityType = result.activityType;

  // Track session accuracies for difficulty adjustment
  profile._recentSessionAccuracies.push(sessionAccuracy);
  if (profile._recentSessionAccuracies.length > 5) {
    profile._recentSessionAccuracies.shift();
  }

  // Recalculate overall average accuracy
  const allAccuracies = Object.values(profile.soundMastery)
    .filter((s) => s.attempts > 0)
    .map((s) => (s.correctAttempts / s.attempts) * 100);
  profile.averageAccuracy = allAccuracies.length > 0
    ? Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length)
    : 0;

  // --- Adjust difficulty multiplier ---
  if (profile._recentSessionAccuracies.length >= 3) {
    const recentAvg = profile._recentSessionAccuracies.reduce((a, b) => a + b, 0)
      / profile._recentSessionAccuracies.length;

    if (recentAvg > 90) {
      // Child is excelling — increase difficulty
      profile.difficultyMultiplier = clamp(profile.difficultyMultiplier + 0.1, 0.5, 2.0);
    } else if (recentAvg < 50) {
      // Child is struggling — decrease difficulty
      profile.difficultyMultiplier = clamp(profile.difficultyMultiplier - 0.15, 0.5, 2.0);
    }
  }

  // --- Update strong/weak areas ---
  profile.strongAreas = [];
  profile.weakAreas = [];
  for (const [id, data] of Object.entries(profile.soundMastery)) {
    if (data.mastery >= MASTERY_STRONG_THRESHOLD) {
      profile.strongAreas.push(id);
    } else if (data.mastery < MASTERY_WEAK_THRESHOLD && data.attempts > 0) {
      profile.weakAreas.push(id);
    }
  }

  // --- Determine learning speed ---
  if (profile.totalSessions >= 5) {
    const avgTime = profile.soundMastery[result.soundId]?.averageResponseTimeMs ?? BENCHMARK_RESPONSE_TIME_MS;
    if (avgTime < BENCHMARK_RESPONSE_TIME_MS * 0.6 && profile.averageAccuracy > 80) {
      profile.learningSpeed = 'fast';
    } else if (avgTime > BENCHMARK_RESPONSE_TIME_MS * 1.5 || profile.averageAccuracy < 50) {
      profile.learningSpeed = 'slow';
    } else {
      profile.learningSpeed = 'normal';
    }
  }

  // --- Determine preferred activity type ---
  const activityScores: Record<string, number> = {};
  for (const data of Object.values(profile.soundMastery)) {
    for (const at of ACTIVITY_TYPES) {
      const key = ACTIVITY_SCORE_KEYS[at] as keyof SoundMasteryData;
      const score = data[key] as number;
      activityScores[at] = (activityScores[at] ?? 0) + score;
    }
  }
  let bestActivity = 'listening';
  let bestScore = -1;
  for (const [at, score] of Object.entries(activityScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestActivity = at;
    }
  }
  profile.preferredActivityType = bestActivity;

  // --- Streak tracking ---
  if (profile.lastSessionDate) {
    const lastDate = profile.lastSessionDate.slice(0, 10);
    if (lastDate === today) {
      // Same day — no streak change
    } else {
      const daysDiff = daysBetween(lastDate, today);
      if (daysDiff === 1) {
        profile.currentStreak += 1;
      } else {
        profile.currentStreak = 1; // Reset streak
      }
    }
  } else {
    profile.currentStreak = 1;
  }
  profile.longestStreak = Math.max(profile.longestStreak, profile.currentStreak);
  profile.lastSessionDate = now;

  // --- Weekly session count ---
  const currentWeekStart = getWeekStart(new Date());
  if (profile._weekStartDate !== currentWeekStart) {
    profile._weekStartDate = currentWeekStart;
    profile.sessionsThisWeek = 0;
  }
  profile.sessionsThisWeek += 1;

  saveProfile(profile);
}

// ============================================================
// GET OPTIMAL ACTIVITY
// ============================================================

/**
 * Determines the optimal next activity using adaptive logic:
 * 1. If weak areas exist -> prioritize weakest sound
 * 2. If all current group sounds > 80% -> advance to next group
 * 3. Mix 70% new content + 30% review of weak areas
 * 4. Vary activity types (don't repeat same type twice)
 * 5. If accuracy dropping -> reduce difficulty
 * 6. If accuracy > 90% for 3 sessions -> increase difficulty
 * 7. Time-of-day optimization: shorter activities in evening
 */
export function getOptimalActivity(): OptimalActivity {
  const profile = loadProfile(_activeUserId);

  // --- Determine difficulty ---
  let difficulty: 'easy' | 'normal' | 'hard' = 'normal';
  if (profile.difficultyMultiplier < 0.8) {
    difficulty = 'easy';
  } else if (profile.difficultyMultiplier > 1.4) {
    difficulty = 'hard';
  }

  // --- Check if accuracy is dropping ---
  if (profile._recentSessionAccuracies.length >= 3) {
    const recent = profile._recentSessionAccuracies;
    const lastThree = recent.slice(-3);
    const avg = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;
    if (avg < 50) {
      difficulty = 'easy';
    }
  }

  // --- Pick activity type (vary from last) ---
  let activityType: string;
  const availableTypes = ACTIVITY_TYPES.filter((t) => t !== profile._lastActivityType);
  activityType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

  // --- Word count based on difficulty and time of day ---
  let wordCount: number;
  switch (difficulty) {
    case 'easy':
      wordCount = 4;
      break;
    case 'hard':
      wordCount = 8;
      break;
    default:
      wordCount = 6;
  }
  if (isEvening()) {
    wordCount = Math.max(3, wordCount - 2);
  }

  // --- Time limit based on learner speed ---
  let timeLimit: number | undefined;
  switch (profile.learningSpeed) {
    case 'slow':
      timeLimit = 45;
      break;
    case 'fast':
      timeLimit = 20;
      break;
    default:
      timeLimit = 30;
  }

  // --- 1. Prioritize weak areas (30% chance even if new content available) ---
  if (profile.weakAreas.length > 0) {
    // Find the weakest sound
    let weakestId = profile.weakAreas[0];
    let lowestMastery = Infinity;
    for (const id of profile.weakAreas) {
      const m = profile.soundMastery[id];
      if (m && m.mastery < lowestMastery) {
        lowestMastery = m.mastery;
        weakestId = id;
      }
    }

    // Determine if we should review (30%) or only if no new content
    const shouldReview = Math.random() < 0.3 || profile.weakAreas.length > 3;

    if (shouldReview) {
      return {
        soundId: weakestId,
        activityType,
        difficulty: 'easy', // Weak area gets easier difficulty
        wordCount: Math.max(3, wordCount - 1),
        timeLimit,
        reason: 'Reviewing weak area',
      };
    }
  }

  // --- 2. Check if current group is all > 80% -> advance ---
  const currentGroupAdvance = findCurrentGroup(profile);
  if (currentGroupAdvance.allMastered && currentGroupAdvance.nextGroupSoundId) {
    return {
      soundId: currentGroupAdvance.nextGroupSoundId,
      activityType,
      difficulty: 'normal',
      wordCount,
      timeLimit,
      reason: 'New sound',
    };
  }

  // --- 3. Find sounds due for spaced repetition review ---
  const now = new Date().toISOString();
  const dueForReview: string[] = [];
  for (const [id, data] of Object.entries(profile.soundMastery)) {
    if (data.nextReviewDate && data.nextReviewDate <= now && data.mastery > 0) {
      dueForReview.push(id);
    }
  }

  if (dueForReview.length > 0 && Math.random() < 0.3) {
    // 30% chance to do a review of due items
    const reviewId = dueForReview[Math.floor(Math.random() * dueForReview.length)];
    return {
      soundId: reviewId,
      activityType,
      difficulty,
      wordCount,
      timeLimit,
      reason: 'Mastery check',
    };
  }

  // --- 4. Find the next unmastered sound in the current group ---
  if (currentGroupAdvance.nextUnmasteredSoundId) {
    return {
      soundId: currentGroupAdvance.nextUnmasteredSoundId,
      activityType,
      difficulty,
      wordCount,
      timeLimit,
      reason: 'New sound',
    };
  }

  // --- 5. Fallback: first sound in the curriculum ---
  const firstSound = ALL_SOUNDS[0];
  return {
    soundId: firstSound?.id ?? 'g1_s',
    activityType,
    difficulty,
    wordCount,
    timeLimit,
    reason: 'New sound',
  };
}

/**
 * Helper: find the current group progress and next sound to learn.
 */
function findCurrentGroup(profile: LearnerProfile): {
  allMastered: boolean;
  nextGroupSoundId: string | null;
  nextUnmasteredSoundId: string | null;
} {
  for (const group of PHONICS_GROUPS) {
    let allMastered = true;
    let firstUnmastered: string | null = null;

    for (const sound of group.sounds) {
      const mastery = profile.soundMastery[sound.id]?.mastery ?? 0;
      if (mastery < MASTERY_STRONG_THRESHOLD) {
        allMastered = false;
        if (!firstUnmastered) {
          firstUnmastered = sound.id;
        }
      }
    }

    if (!allMastered) {
      return {
        allMastered: false,
        nextGroupSoundId: null,
        nextUnmasteredSoundId: firstUnmastered,
      };
    }
  }

  // All groups mastered — find next group
  for (let gi = 0; gi < PHONICS_GROUPS.length; gi++) {
    const group = PHONICS_GROUPS[gi];
    const groupMastered = group.sounds.every(
      (s) => (profile.soundMastery[s.id]?.mastery ?? 0) >= MASTERY_STRONG_THRESHOLD
    );
    if (!groupMastered) {
      const nextUnmastered = group.sounds.find(
        (s) => (profile.soundMastery[s.id]?.mastery ?? 0) < MASTERY_STRONG_THRESHOLD
      );
      return {
        allMastered: false,
        nextGroupSoundId: null,
        nextUnmasteredSoundId: nextUnmastered?.id ?? null,
      };
    }
    // This group is mastered; check if there's a next group
    if (gi + 1 < PHONICS_GROUPS.length) {
      const nextGroup = PHONICS_GROUPS[gi + 1];
      const nextGroupAllMastered = nextGroup.sounds.every(
        (s) => (profile.soundMastery[s.id]?.mastery ?? 0) >= MASTERY_STRONG_THRESHOLD
      );
      if (!nextGroupAllMastered) {
        const nextSound = nextGroup.sounds.find(
          (s) => (profile.soundMastery[s.id]?.mastery ?? 0) < MASTERY_STRONG_THRESHOLD
        );
        return {
          allMastered: true,
          nextGroupSoundId: nextSound?.id ?? nextGroup.sounds[0]?.id ?? null,
          nextUnmasteredSoundId: null,
        };
      }
    }
  }

  // Everything mastered
  return {
    allMastered: true,
    nextGroupSoundId: null,
    nextUnmasteredSoundId: null,
  };
}

// ============================================================
// GET ADAPTIVE WORDS
// ============================================================

/**
 * Get difficulty-adjusted word list for a given sound.
 * - 'easy': only CVC words, familiar vocabulary
 * - 'normal': mix of CVC and CCVC
 * - 'hard': complex words, less common vocabulary, longer words
 */
export function getAdaptiveWords(soundId: string, count: number): AdaptiveWord[] {
  const profile = loadProfile(_activeUserId);
  const difficulty = profile.difficultyMultiplier;

  const bank = getWordBankForSound(soundId);

  let pool: Array<{ word: string; phonemes: string[]; diff: number }>;

  if (difficulty < 0.8) {
    // Easy: all from easy pool
    pool = bank.easy.map((w) => ({ ...w, diff: 1 }));
  } else if (difficulty > 1.4) {
    // Hard: mostly hard, some normal
    pool = [
      ...bank.hard.map((w) => ({ ...w, diff: 4 })),
      ...bank.normal.map((w) => ({ ...w, diff: 3 })),
    ];
  } else {
    // Normal: mix all pools
    pool = [
      ...bank.easy.map((w) => ({ ...w, diff: 1 })),
      ...bank.normal.map((w) => ({ ...w, diff: 3 })),
      ...bank.hard.map((w) => ({ ...w, diff: 5 })).slice(0, 2),
    ];
  }

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Pick requested count, marking review words
  const seenWordsKey = `mimi_seen_words_${_activeUserId}`;
  let seenWords: string[] = [];
  try {
    const raw = localStorage.getItem(seenWordsKey);
    if (raw) seenWords = JSON.parse(raw) as string[];
  } catch {
    // ignore
  }

  const selected = pool.slice(0, count).map((w): AdaptiveWord => {
    const isReview = seenWords.includes(w.word);
    return {
      word: w.word,
      difficulty: w.diff,
      phonemes: w.phonemes,
      isReview,
    };
  });

  // Track seen words
  const newSeen = new Set([...seenWords, ...selected.map((w) => w.word)]);
  try {
    localStorage.setItem(seenWordsKey, JSON.stringify([...newSeen]));
  } catch {
    // ignore
  }

  return selected;
}

// ============================================================
// WEEKLY REPORT
// ============================================================

/**
 * Generate a comprehensive weekly learning report.
 */
export function generateWeeklyReport(): WeeklyReport {
  const profile = loadProfile(_activeUserId);
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const weekEnd = weekEndDate.toISOString().slice(0, 10);

  // Sounds introduced & mastered this week
  const soundsIntroduced: string[] = [];
  const soundsMastered: string[] = [];
  let strongestSound = '';
  let strongestMastery = -1;
  let weakestSound = '';
  let weakestMastery = Infinity;

  for (const [id, data] of Object.entries(profile.soundMastery)) {
    if (data.lastPracticed && data.lastPracticed.slice(0, 10) >= weekStart) {
      // Was first practiced this week?
      if (data.attempts <= 10) {
        soundsIntroduced.push(id);
      }
      if (data.mastery >= MASTERY_STRONG_THRESHOLD) {
        soundsMastered.push(id);
      }
    }

    if (data.attempts > 0) {
      if (data.mastery > strongestMastery) {
        strongestMastery = data.mastery;
        strongestSound = id;
      }
      if (data.mastery < weakestMastery) {
        weakestMastery = data.mastery;
        weakestSound = id;
      }
    }
  }

  // Generate recommendation
  let recommendation: string;
  if (profile.weakAreas.length > 0) {
    const weakId = profile.weakAreas[0];
    const sound = ALL_SOUNDS.find((s) => s.id === weakId);
    const grapheme = sound?.grapheme?.toUpperCase() ?? weakId;
    recommendation = `Focus on the '${grapheme}' sound this week — practice blending and listening activities.`;
  } else if (profile.sessionsThisWeek < 3) {
    recommendation = 'Try to practice at least 3 times this week to keep your streak going!';
  } else if (profile.averageAccuracy > 85) {
    recommendation = 'Great accuracy! Try the harder activities to challenge yourself.';
  } else {
    recommendation = 'Keep up the great work! Consistency is the key to mastery.';
  }

  // XP calculation (simplified)
  const xpEarned = profile.sessionsThisWeek * 25 + soundsMastered.length * 50;

  // Level progress (percentage to next level)
  const totalMastered = profile.strongAreas.length;
  const totalSounds = ALL_SOUNDS.length;
  const levelProgress = totalSounds > 0
    ? Math.round((totalMastered / totalSounds) * 100)
    : 0;

  return {
    weekStart,
    weekEnd,
    sessionsCompleted: profile.sessionsThisWeek,
    minutesLearned: profile.totalTimeMinutes,
    soundsIntroduced,
    soundsMastered,
    overallAccuracy: profile.averageAccuracy,
    streakDays: profile.currentStreak,
    strongestSound,
    weakestSound,
    recommendation,
    xpEarned,
    levelProgress,
  };
}

// ============================================================
// LEARNER INSIGHTS
// ============================================================

/**
 * Generate personalized insights about the learner's progress.
 */
export function getLearnerInsights(): LearnerInsight[] {
  const profile = loadProfile(_activeUserId);
  const insights: LearnerInsight[] = [];

  // --- Milestone: total sessions ---
  const sessionMilestones = [10, 25, 50, 100, 250, 500];
  for (const milestone of sessionMilestones) {
    if (profile.totalSessions >= milestone && profile.totalSessions < milestone + 5) {
      insights.push({
        type: 'milestone',
        title: `${milestone} Sessions Completed!`,
        titleTr: `${milestone} Oturum Tamamlandi!`,
        description: `You've completed ${milestone} learning sessions. Amazing dedication!`,
        descriptionTr: `${milestone} ogrenme oturumu tamamladin. Muhtesem bir azim!`,
        icon: 'trophy',
      });
    }
  }

  // --- Achievement: streak ---
  if (profile.currentStreak >= 7) {
    insights.push({
      type: 'achievement',
      title: `${profile.currentStreak}-Day Streak!`,
      titleTr: `${profile.currentStreak} Gunluk Seri!`,
      description: `You've practiced every day for ${profile.currentStreak} days straight!`,
      descriptionTr: `${profile.currentStreak} gun ust uste her gun calistin!`,
      icon: 'flame',
    });
  } else if (profile.currentStreak >= 3) {
    insights.push({
      type: 'achievement',
      title: `${profile.currentStreak}-Day Streak!`,
      titleTr: `${profile.currentStreak} Gunluk Seri!`,
      description: 'Keep going to build your streak even higher!',
      descriptionTr: 'Serini daha da buyutmek icin devam et!',
      icon: 'flame',
    });
  }

  // --- Achievement: sounds mastered ---
  const masteredCount = profile.strongAreas.length;
  if (masteredCount > 0) {
    insights.push({
      type: 'achievement',
      title: `${masteredCount} Sounds Mastered`,
      titleTr: `${masteredCount} Ses Ogrenildi`,
      description: `You've mastered ${masteredCount} out of ${ALL_SOUNDS.length} sounds!`,
      descriptionTr: `${ALL_SOUNDS.length} sesten ${masteredCount} tanesini ogrendin!`,
      icon: 'star',
    });
  }

  // --- Struggle: weak areas ---
  if (profile.weakAreas.length > 0) {
    const weakSound = ALL_SOUNDS.find((s) => s.id === profile.weakAreas[0]);
    const grapheme = weakSound?.grapheme?.toUpperCase() ?? profile.weakAreas[0];
    insights.push({
      type: 'struggle',
      title: `Let's Practice '${grapheme}'`,
      titleTr: `'${grapheme}' Sesini Pratik Yapalim`,
      description: `The '${grapheme}' sound needs more practice. Try the blending activity!`,
      descriptionTr: `'${grapheme}' sesi daha fazla pratik istiyor. Birlestirme aktivitesini dene!`,
      icon: 'target',
    });
  }

  // --- Recommendation: learning speed ---
  if (profile.learningSpeed === 'fast' && profile.difficultyMultiplier < 1.5) {
    insights.push({
      type: 'recommendation',
      title: 'Ready for a Challenge?',
      titleTr: 'Meydan Okumaya Hazir misin?',
      description: 'You\'re learning fast! Try harder activities to push yourself.',
      descriptionTr: 'Hizli ogreniyorsun! Kendini zorlamak icin daha zor aktiviteleri dene.',
      icon: 'rocket',
    });
  }

  // --- Recommendation: preferred activity ---
  if (profile.totalSessions >= 10) {
    const preferred = profile.preferredActivityType;
    const activityNames: Record<string, { en: string; tr: string }> = {
      blending: { en: 'Blending', tr: 'Birlestirme' },
      segmenting: { en: 'Segmenting', tr: 'Ayirma' },
      listening: { en: 'Listening', tr: 'Dinleme' },
      pronunciation: { en: 'Pronunciation', tr: 'Telaffuz' },
      reading: { en: 'Reading', tr: 'Okuma' },
    };
    const name = activityNames[preferred] ?? { en: preferred, tr: preferred };
    insights.push({
      type: 'recommendation',
      title: `${name.en} is Your Superpower!`,
      titleTr: `${name.tr} Senin Super Gucun!`,
      description: `You perform best in ${name.en.toLowerCase()} activities. Keep it up!`,
      descriptionTr: `${name.tr.toLowerCase()} aktivitelerinde en iyisin. Boyle devam et!`,
      icon: 'sparkles',
    });
  }

  // --- Milestone: high accuracy ---
  if (profile.averageAccuracy >= 90 && profile.totalSessions >= 5) {
    insights.push({
      type: 'milestone',
      title: 'Accuracy Star!',
      titleTr: 'Dogruluk Yildizi!',
      description: `Your average accuracy is ${profile.averageAccuracy}%. Incredible!`,
      descriptionTr: `Ortalama dogruluk oranin %${profile.averageAccuracy}. Inanilmaz!`,
      icon: 'medal',
    });
  }

  return insights;
}
