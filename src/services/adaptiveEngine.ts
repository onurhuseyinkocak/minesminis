/**
 * ADAPTIVE LEARNING ENGINE
 * MinesMinis v4.0
 *
 * Data-driven adaptive learning engine. Uses statistical analysis of learner
 * behavior patterns, spaced repetition (Leitner/SM-2 inspired), interleaved
 * practice (Bjork's desirable difficulties), and confusion pair detection
 * to optimize phonics instruction for Turkish-speaking children.
 *
 * Mastery = 40% accuracy + 20% speed + 20% consistency + 20% retention
 * Stores everything in localStorage key `mimi_learner_profile_{userId}`.
 */

import { ALL_SOUNDS, PHONICS_GROUPS } from '../data/phonics';
import { logger } from '../utils/logger';

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
  // --- NEW: Enhanced tracking ---
  _recentActivityTypes: string[];     // last 5 activity types for rotation
  _sessionTimestamps: string[];       // ISO timestamps of last 20 sessions (for time-of-day analysis)
  _sessionAccuracyByHour: Record<string, { total: number; correct: number; count: number }>;
  _confusionEvents: ConfusionEvent[]; // last 50 confusion events
  _sessionStartTime: string;          // current session start (for pacing)
  _masterySnapshots: MasterySnapshot[]; // last 20 mastery snapshots for plateau detection
}

export interface ActivityResult {
  soundId: string;
  activityType: string;
  correct: boolean;
  responseTimeMs: number;
  totalQuestions: number;
  correctAnswers: number;
  // --- NEW: For confusion pair tracking ---
  selectedAnswer?: string;  // what the child picked (when wrong)
  correctAnswer?: string;   // what the correct answer was
}

export interface OptimalActivity {
  soundId: string;
  activityType: string;
  difficulty: 'easy' | 'normal' | 'hard';
  wordCount: number;
  timeLimit?: number;
  reason: string;
  // --- NEW ---
  interleavedSoundId?: string;  // secondary sound to mix in (interleaving)
  suggestBreak?: boolean;       // child has been going 15+ minutes
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

// --- NEW TYPES ---

export interface ActivityTypeAnalysis {
  activityType: string;
  accuracy: number;          // 0-100
  totalAttempts: number;
  averageResponseTimeMs: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface PlateauAlert {
  soundId: string;
  grapheme: string;
  mastery: number;
  sessionsStuck: number;
  lastImprovement: string;   // ISO date
  suggestedActivityType: string;
  message: string;
  messageTr: string;
}

export interface SmartInsight {
  type: 'pattern' | 'prediction' | 'plateau' | 'strength' | 'suggestion';
  title: string;
  titleTr: string;
  detail: string;
  detailTr: string;
  priority: 'high' | 'medium' | 'low';
  actionRoute?: string;
}

export interface ConfusionPair {
  sound1: string;
  sound2: string;
  confusionRate: number;     // 0-1, how often child picks wrong one
  occurrences: number;
  recommendation: string;
  recommendationTr: string;
}

interface ConfusionEvent {
  timestamp: string;
  targetSound: string;       // what was correct
  selectedSound: string;     // what child picked
  activityType: string;
}

interface MasterySnapshot {
  soundId: string;
  mastery: number;
  timestamp: string;
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

/** Known confusion pairs for Turkish-speaking children learning English phonics */
const KNOWN_CONFUSION_PAIRS: Array<[string, string, string, string]> = [
  // [sound1, sound2, reason_en, reason_tr]
  ['b', 'd', 'Mirror letters — visually similar', 'Ayna harfler — gorsel olarak benzer'],
  ['p', 'b', 'Voicing difference — lips same position', 'Ses farki — dudaklar ayni pozisyonda'],
  ['v', 'w', 'Turkish has no "w" sound', 'Turkcede "w" sesi yok'],
  ['th', 't', 'Turkish has no "th" sound', 'Turkcede "th" sesi yok'],
  ['i', 'e', 'Short vowel confusion', 'Kisa unlu karisikligi'],
  ['u', 'o', 'Short vowel confusion', 'Kisa unlu karisikligi'],
  ['sh', 's', 'Fricative confusion', 'Surtusmeli ses karisikligi'],
  ['ch', 'j', 'Affricate confusion', 'Kapantili ses karisikligi'],
  ['r', 'l', 'Liquid consonant confusion', 'Akici unsuz karisikligi'],
  ['f', 'v', 'Voicing difference', 'Ses farki'],
];

/** Plateau detection: sessions without improvement threshold */
const PLATEAU_SESSION_THRESHOLD = 5;

/** Session pacing: suggest break after this many minutes */
const SESSION_BREAK_THRESHOLD_MINUTES = 15;

/** Max confusion events to store */
const MAX_CONFUSION_EVENTS = 50;

/** Max mastery snapshots to store */
const MAX_MASTERY_SNAPSHOTS = 100;

/** Max session timestamps to store for time-of-day analysis */
const MAX_SESSION_TIMESTAMPS = 50;

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
      const profile = JSON.parse(raw) as LearnerProfile;
      // Migrate older profiles that lack new fields
      if (!profile._recentActivityTypes) profile._recentActivityTypes = [];
      if (!profile._sessionTimestamps) profile._sessionTimestamps = [];
      if (!profile._sessionAccuracyByHour) profile._sessionAccuracyByHour = {};
      if (!profile._confusionEvents) profile._confusionEvents = [];
      if (!profile._sessionStartTime) profile._sessionStartTime = '';
      if (!profile._masterySnapshots) profile._masterySnapshots = [];
      return profile;
    }
  } catch {
    // corrupted data — reset
  }
  return createDefaultProfile(userId);
}

function saveProfile(profile: LearnerProfile): void {
  try {
    localStorage.setItem(getStorageKey(profile.id), JSON.stringify(profile));
  } catch (e) {
    logger.warn('adaptiveEngine: failed to save profile — storage may be full', e);
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
    // New fields
    _recentActivityTypes: [],
    _sessionTimestamps: [],
    _sessionAccuracyByHour: {},
    _confusionEvents: [],
    _sessionStartTime: '',
    _masterySnapshots: [],
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

/** Extract sound char from soundId like "g1_s" -> "s", "g3_th" -> "th" */
function soundIdToChar(soundId: string): string {
  return soundId.replace(/^g\d+_/, '');
}

/**
 * Linear regression slope on a series of values.
 * Positive = improving, negative = declining, near-zero = stable.
 */
function linearSlope(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return 0;
  return (n * sumXY - sumX * sumY) / denominator;
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
 * Multi-factor mastery calculation:
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
 * tracks response time, updates weak/strong areas, tracks confusion events,
 * and stores mastery snapshots for plateau detection.
 */
export function recordActivity(result: ActivityResult): void {
  const profile = loadProfile(_activeUserId);
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const currentHour = new Date().getHours().toString();

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

  // --- NEW: Track confusion events ---
  if (!result.correct && result.selectedAnswer && result.correctAnswer) {
    profile._confusionEvents.push({
      timestamp: now,
      targetSound: result.correctAnswer,
      selectedSound: result.selectedAnswer,
      activityType: result.activityType,
    });
    if (profile._confusionEvents.length > MAX_CONFUSION_EVENTS) {
      profile._confusionEvents = profile._confusionEvents.slice(-MAX_CONFUSION_EVENTS);
    }
  }

  // --- NEW: Store mastery snapshot for plateau detection ---
  profile._masterySnapshots.push({
    soundId: result.soundId,
    mastery: sound.mastery,
    timestamp: now,
  });
  if (profile._masterySnapshots.length > MAX_MASTERY_SNAPSHOTS) {
    profile._masterySnapshots = profile._masterySnapshots.slice(-MAX_MASTERY_SNAPSHOTS);
  }

  // --- NEW: Track session timestamps for time-of-day analysis ---
  profile._sessionTimestamps.push(now);
  if (profile._sessionTimestamps.length > MAX_SESSION_TIMESTAMPS) {
    profile._sessionTimestamps = profile._sessionTimestamps.slice(-MAX_SESSION_TIMESTAMPS);
  }

  // --- NEW: Track accuracy by hour ---
  if (!profile._sessionAccuracyByHour[currentHour]) {
    profile._sessionAccuracyByHour[currentHour] = { total: 0, correct: 0, count: 0 };
  }
  profile._sessionAccuracyByHour[currentHour].total += result.totalQuestions;
  profile._sessionAccuracyByHour[currentHour].correct += result.correctAnswers;
  profile._sessionAccuracyByHour[currentHour].count += 1;

  // --- NEW: Track recent activity types for rotation ---
  profile._recentActivityTypes.push(result.activityType);
  if (profile._recentActivityTypes.length > 5) {
    profile._recentActivityTypes = profile._recentActivityTypes.slice(-5);
  }

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
// SESSION PACING
// ============================================================

/**
 * Mark the start of a learning session for pacing tracking.
 */
export function startSession(): void {
  const profile = loadProfile(_activeUserId);
  profile._sessionStartTime = new Date().toISOString();
  saveProfile(profile);
}

/**
 * Check if the child should take a break (15+ minutes of continuous activity).
 */
function shouldSuggestBreak(profile: LearnerProfile): boolean {
  if (!profile._sessionStartTime) return false;
  const startTime = new Date(profile._sessionStartTime).getTime();
  const now = Date.now();
  const minutesElapsed = (now - startTime) / (1000 * 60);
  return minutesElapsed >= SESSION_BREAK_THRESHOLD_MINUTES;
}

// ============================================================
// GET OPTIMAL ACTIVITY (IMPROVED)
// ============================================================

/**
 * Determines the optimal next activity using evidence-based strategies:
 *
 * 1. Session pacing — suggest break after 15+ minutes
 * 2. Spacing effect — don't repeat sounds aced yesterday; wait 2+ days
 * 3. Interleaving — mix old and new sounds (research: interleaved > blocked)
 * 4. Desirable difficulty — sometimes slightly harder (Bjork's research)
 * 5. Activity type rotation — avoid repeating from last 5 types
 * 6. Confusion pair targeting — if b/d confused, create comparison activities
 * 7. Weak area prioritization with smart scheduling
 * 8. Time-of-day optimization
 */
export function getOptimalActivity(): OptimalActivity {
  const profile = loadProfile(_activeUserId);
  const now = new Date();
  const nowIso = now.toISOString();
  const todayStr = nowIso.slice(0, 10);

  // --- Session pacing: suggest break after 15+ minutes ---
  const needsBreak = shouldSuggestBreak(profile);

  // --- Determine base difficulty ---
  let difficulty: 'easy' | 'normal' | 'hard' = 'normal';
  if (profile.difficultyMultiplier < 0.8) {
    difficulty = 'easy';
  } else if (profile.difficultyMultiplier > 1.4) {
    difficulty = 'hard';
  }

  // Check if accuracy is dropping
  if (profile._recentSessionAccuracies.length >= 3) {
    const lastThree = profile._recentSessionAccuracies.slice(-3);
    const avg = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;
    if (avg < 50) {
      difficulty = 'easy';
    }
  }

  // --- Desirable difficulty (Bjork): occasionally bump up difficulty ---
  // Only when child is in the "sweet spot" (60-85% accuracy range)
  if (profile._recentSessionAccuracies.length >= 3) {
    const recentAvg = profile._recentSessionAccuracies.slice(-3)
      .reduce((a, b) => a + b, 0) / 3;
    if (recentAvg >= 65 && recentAvg <= 85 && Math.random() < 0.25) {
      // 25% chance to bump difficulty one level
      if (difficulty === 'easy') difficulty = 'normal';
      else if (difficulty === 'normal') difficulty = 'hard';
    }
  }

  // --- Activity type rotation: avoid repeating from recent 5 ---
  const recentTypes = profile._recentActivityTypes || [];
  const typeFrequency: Record<string, number> = {};
  for (const t of recentTypes) {
    typeFrequency[t] = (typeFrequency[t] ?? 0) + 1;
  }

  // Score each activity type: prefer least-recently-used
  let activityType: string;
  const scoredTypes = ACTIVITY_TYPES.map((t) => ({
    type: t,
    recentCount: typeFrequency[t] ?? 0,
    // Also consider: pick the weakest activity type for this child
    weaknessBonus: getWeakestActivityTypeBonus(profile, t),
  }));
  scoredTypes.sort((a, b) => {
    // Primary: least recently used. Secondary: weakness bonus (higher = prefer)
    const freqDiff = a.recentCount - b.recentCount;
    if (freqDiff !== 0) return freqDiff;
    return b.weaknessBonus - a.weaknessBonus;
  });
  activityType = scoredTypes[0].type;

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

  // --- If needs break, return a fun/easy activity suggestion ---
  if (needsBreak) {
    const strongSounds = profile.strongAreas;
    const funSoundId = strongSounds.length > 0
      ? strongSounds[Math.floor(Math.random() * strongSounds.length)]
      : ALL_SOUNDS[0]?.id ?? 'g1_s';
    // Pick a "fun" activity type — listening or pronunciation (song-like)
    const funTypes: ActivityType[] = ['listening', 'pronunciation'];
    const funType = funTypes[Math.floor(Math.random() * funTypes.length)];
    return {
      soundId: funSoundId,
      activityType: funType,
      difficulty: 'easy',
      wordCount: 3,
      timeLimit: 15,
      reason: 'Time for a fun break! You have been working hard.',
      suggestBreak: true,
    };
  }

  // --- Confusion pair targeting: if active confusions, create comparison activity ---
  const confusions = getConfusionPairs();
  const activeConfusion = confusions.find((c) => c.confusionRate >= 0.3 && c.occurrences >= 3);
  if (activeConfusion && Math.random() < 0.35) {
    // 35% chance to do a targeted confusion pair drill
    const targetSoundId = findSoundIdByChar(activeConfusion.sound1);
    const interleaveSoundId = findSoundIdByChar(activeConfusion.sound2);
    return {
      soundId: targetSoundId,
      activityType: 'listening', // listening is best for distinguishing sounds
      difficulty: 'normal',
      wordCount: 6,
      timeLimit,
      reason: `Targeted practice: distinguishing '${activeConfusion.sound1}' from '${activeConfusion.sound2}'`,
      interleavedSoundId: interleaveSoundId,
    };
  }

  // --- Spacing effect: collect sounds that should NOT be repeated today ---
  const spacedOutSounds = new Set<string>();
  for (const [id, data] of Object.entries(profile.soundMastery)) {
    if (data.lastPracticed) {
      const daysSince = daysBetween(data.lastPracticed.slice(0, 10), todayStr);
      // If aced (mastery > 80) yesterday, wait 2+ days before repeating
      if (data.mastery >= 80 && daysSince < 2) {
        spacedOutSounds.add(id);
      }
      // If aced (mastery > 60) today, don't repeat same day
      if (data.mastery >= 60 && daysSince === 0) {
        spacedOutSounds.add(id);
      }
    }
  }

  // --- 1. Prioritize weak areas ---
  if (profile.weakAreas.length > 0) {
    // Filter out spaced-out sounds
    const availableWeak = profile.weakAreas.filter((id) => !spacedOutSounds.has(id));
    const weakPool = availableWeak.length > 0 ? availableWeak : profile.weakAreas;

    // Find the weakest sound
    let weakestId = weakPool[0];
    let lowestMastery = Infinity;
    for (const id of weakPool) {
      const m = profile.soundMastery[id];
      if (m && m.mastery < lowestMastery) {
        lowestMastery = m.mastery;
        weakestId = id;
      }
    }

    // Find the weakest activity type for this sound to target it
    const weakSound = profile.soundMastery[weakestId];
    if (weakSound) {
      const weakActivityType = findWeakestActivityForSound(weakSound);
      if (weakActivityType) {
        activityType = weakActivityType;
      }
    }

    // Higher priority for weak areas: 50% chance (up from 30%) or if many weak areas
    const shouldReview = Math.random() < 0.5 || profile.weakAreas.length > 3;

    if (shouldReview) {
      // Interleaving: pick a strong sound to mix in
      const interleavedId = pickInterleavedSound(profile, weakestId);
      return {
        soundId: weakestId,
        activityType,
        difficulty: 'easy',
        wordCount: Math.max(3, wordCount - 1),
        timeLimit,
        reason: 'Reviewing weak area with interleaved practice',
        interleavedSoundId: interleavedId ?? undefined,
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
      reason: 'New sound — group mastered!',
    };
  }

  // --- 3. Find sounds due for spaced repetition review (respect spacing) ---
  const dueForReview: string[] = [];
  for (const [id, data] of Object.entries(profile.soundMastery)) {
    if (data.nextReviewDate && data.nextReviewDate <= nowIso && data.mastery > 0) {
      if (!spacedOutSounds.has(id)) {
        dueForReview.push(id);
      }
    }
  }

  if (dueForReview.length > 0 && Math.random() < 0.4) {
    // 40% chance (up from 30%) to do a review of due items
    const reviewId = dueForReview[Math.floor(Math.random() * dueForReview.length)];
    // Interleave a new or weak sound with the review
    const interleavedId = pickInterleavedSound(profile, reviewId);
    return {
      soundId: reviewId,
      activityType,
      difficulty,
      wordCount,
      timeLimit,
      reason: 'Spaced repetition review',
      interleavedSoundId: interleavedId ?? undefined,
    };
  }

  // --- 4. Find the next unmastered sound in the current group ---
  if (currentGroupAdvance.nextUnmasteredSoundId) {
    const nextId = currentGroupAdvance.nextUnmasteredSoundId;
    // If this sound is spaced out, look for another
    if (spacedOutSounds.has(nextId)) {
      // Try to find any unmastered sound not spaced out
      const alternative = findAlternativeUnmasteredSound(profile, spacedOutSounds);
      if (alternative) {
        return {
          soundId: alternative,
          activityType,
          difficulty,
          wordCount,
          timeLimit,
          reason: 'Continuing practice (spacing applied)',
        };
      }
    }

    return {
      soundId: nextId,
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
 * Find the weakest activity type for a given sound (to target practice).
 */
function findWeakestActivityForSound(sound: SoundMasteryData): ActivityType | null {
  let weakest: ActivityType | null = null;
  let lowestScore = Infinity;

  for (const at of ACTIVITY_TYPES) {
    const key = ACTIVITY_SCORE_KEYS[at] as keyof SoundMasteryData;
    const score = sound[key] as number;
    if (score < lowestScore) {
      lowestScore = score;
      weakest = at;
    }
  }

  return weakest;
}

/**
 * Get a bonus score for activity types the child is weak in (higher = more needed).
 */
function getWeakestActivityTypeBonus(profile: LearnerProfile, activityType: ActivityType): number {
  let totalScore = 0;
  let count = 0;
  for (const data of Object.values(profile.soundMastery)) {
    if (data.attempts > 0) {
      const key = ACTIVITY_SCORE_KEYS[activityType] as keyof SoundMasteryData;
      totalScore += data[key] as number;
      count += 1;
    }
  }
  if (count === 0) return 0;
  const avgScore = totalScore / count;
  // Invert: lower average score = higher bonus (more needed)
  return 100 - avgScore;
}

/**
 * Pick a sound to interleave with the primary sound.
 * Interleaving research shows mixing old + new improves retention.
 */
function pickInterleavedSound(profile: LearnerProfile, primarySoundId: string): string | null {
  // Pick a strong sound that the child has already mastered to interleave
  const candidates = profile.strongAreas.filter((id) => id !== primarySoundId);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Find an unmastered sound that is not in the spaced-out set.
 */
function findAlternativeUnmasteredSound(profile: LearnerProfile, spacedOut: Set<string>): string | null {
  for (const group of PHONICS_GROUPS) {
    for (const sound of group.sounds) {
      const mastery = profile.soundMastery[sound.id]?.mastery ?? 0;
      if (mastery < MASTERY_STRONG_THRESHOLD && !spacedOut.has(sound.id)) {
        return sound.id;
      }
    }
  }
  return null;
}

/**
 * Find a sound ID from a sound character (e.g., "th" -> "g4_th" or similar).
 */
function findSoundIdByChar(soundChar: string): string {
  const match = ALL_SOUNDS.find((s) => soundIdToChar(s.id) === soundChar);
  return match?.id ?? `g1_${soundChar}`;
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
// LEARNER INSIGHTS (original)
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
        titleTr: `${milestone} Oturum Tamamlandı!`,
        description: `You've completed ${milestone} learning sessions. Amazing dedication!`,
        descriptionTr: `${milestone} öğrenme oturumu tamamladın. Muhteşem bir azim!`,
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
      titleTr: `${profile.currentStreak} Günlük Seri!`,
      description: 'Keep going to build your streak even higher!',
      descriptionTr: 'Serini daha da büyütmek için devam et!',
      icon: 'flame',
    });
  }

  // --- Achievement: sounds mastered ---
  const masteredCount = profile.strongAreas.length;
  if (masteredCount > 0) {
    insights.push({
      type: 'achievement',
      title: `${masteredCount} Sounds Mastered`,
      titleTr: `${masteredCount} Ses Öğrenildi`,
      description: `You've mastered ${masteredCount} out of ${ALL_SOUNDS.length} sounds!`,
      descriptionTr: `${ALL_SOUNDS.length} sesten ${masteredCount} tanesini öğrendin!`,
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
      titleTr: `'${grapheme}' Sesini Pratik Yapalım`,
      description: `The '${grapheme}' sound needs more practice. Try the blending activity!`,
      descriptionTr: `'${grapheme}' sesi daha fazla pratik istiyor. Birleştirme aktivitesini dene!`,
      icon: 'target',
    });
  }

  // --- Recommendation: learning speed ---
  if (profile.learningSpeed === 'fast' && profile.difficultyMultiplier < 1.5) {
    insights.push({
      type: 'recommendation',
      title: 'Ready for a Challenge?',
      titleTr: 'Meydan Okumaya Hazır mısın?',
      description: 'You\'re learning fast! Try harder activities to push yourself.',
      descriptionTr: 'Hızlı öğreniyorsun! Kendini zorlamak için daha zor aktiviteleri dene.',
      icon: 'rocket',
    });
  }

  // --- Recommendation: preferred activity ---
  if (profile.totalSessions >= 10) {
    const preferred = profile.preferredActivityType;
    const activityNames: Record<string, { en: string; tr: string }> = {
      blending: { en: 'Blending', tr: 'Birleştirme' },
      segmenting: { en: 'Segmenting', tr: 'Ayırma' },
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

// ============================================================
// STATISTICAL ANALYSIS — NEW
// ============================================================

/**
 * Analyze performance broken down by activity type.
 * Shows accuracy, speed, and trend for each activity type across all sounds.
 */
export function getActivityTypeAnalysis(): ActivityTypeAnalysis[] {
  const profile = loadProfile(_activeUserId);
  const results: ActivityTypeAnalysis[] = [];

  for (const at of ACTIVITY_TYPES) {
    const key = ACTIVITY_SCORE_KEYS[at] as keyof SoundMasteryData;
    const scores: number[] = [];
    let totalAttempts = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    for (const data of Object.values(profile.soundMastery)) {
      if (data.attempts > 0) {
        const score = data[key] as number;
        scores.push(score);
        totalAttempts += data.attempts;
        if (data.averageResponseTimeMs > 0) {
          totalResponseTime += data.averageResponseTimeMs;
          responseTimeCount += 1;
        }
      }
    }

    const accuracy = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const avgResponseTime = responseTimeCount > 0
      ? Math.round(totalResponseTime / responseTimeCount)
      : 0;

    // Determine trend from mastery snapshots
    const relevantSnapshots = profile._masterySnapshots
      .filter((_s) => true) // all snapshots contribute to overall trend
      .map((s) => s.mastery);
    const slope = linearSlope(relevantSnapshots);
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (slope > 1.0) trend = 'improving';
    else if (slope < -1.0) trend = 'declining';

    results.push({
      activityType: at,
      accuracy,
      totalAttempts,
      averageResponseTimeMs: avgResponseTime,
      trend,
    });
  }

  return results;
}

/**
 * Analyze time-of-day performance patterns.
 * Returns the hour with the best and worst accuracy, plus a recommendation.
 */
export function getTimeOfDayAnalysis(): { bestHour: number; worstHour: number; recommendation: string } {
  const profile = loadProfile(_activeUserId);
  const hourData = profile._sessionAccuracyByHour;

  let bestHour = 10; // sensible default
  let bestAccuracy = -1;
  let worstHour = 19;
  let worstAccuracy = 101;

  for (const [hourStr, data] of Object.entries(hourData)) {
    if (data.count < 2) continue; // need at least 2 sessions at this hour to be meaningful
    const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    if (accuracy > bestAccuracy) {
      bestAccuracy = accuracy;
      bestHour = parseInt(hourStr, 10);
    }
    if (accuracy < worstAccuracy) {
      worstAccuracy = accuracy;
      worstHour = parseInt(hourStr, 10);
    }
  }

  const formatHour = (h: number): string => {
    if (h === 0) return '12am';
    if (h < 12) return `${h}am`;
    if (h === 12) return '12pm';
    return `${h - 12}pm`;
  };

  let recommendation: string;
  if (Object.keys(hourData).length < 3) {
    recommendation = 'Not enough data yet. Keep practicing at different times to discover your best learning time!';
  } else if (bestHour < 12) {
    recommendation = `Your child performs best around ${formatHour(bestHour)}. Morning sessions are recommended for new sounds.`;
  } else {
    recommendation = `Your child performs best around ${formatHour(bestHour)}. Try to schedule practice sessions around this time.`;
  }

  return { bestHour, worstHour, recommendation };
}

/**
 * Predict when a specific sound will reach 95% mastery based on current learning rate.
 * Returns an ISO date string, or null if insufficient data or mastery is already at/above 95%.
 */
export function predictMasteryDate(soundId: string): string | null {
  const profile = loadProfile(_activeUserId);
  const sound = profile.soundMastery[soundId];

  if (!sound || sound.attempts < 3) return null; // not enough data
  if (sound.mastery >= 95) return null; // already mastered

  // Calculate learning rate: mastery gained per session from snapshots
  const snapshots = profile._masterySnapshots.filter((s) => s.soundId === soundId);
  if (snapshots.length < 2) return null;

  // Calculate slope: mastery points per snapshot (roughly per session)
  const masteryValues = snapshots.map((s) => s.mastery);
  const slope = linearSlope(masteryValues);

  if (slope <= 0) {
    // Not improving — can't predict
    return null;
  }

  // How many more "sessions" needed to reach 95%
  const remaining = 95 - sound.mastery;
  const sessionsNeeded = Math.ceil(remaining / slope);

  // Estimate: assume ~1 session per day on average (from their streak/frequency)
  const sessionsPerDay = profile.totalSessions > 0 && profile.lastSessionDate
    ? Math.max(0.3, profile.totalSessions / Math.max(1, daysBetween(
        profile._sessionTimestamps[0] ?? profile.lastSessionDate,
        new Date().toISOString()
      )))
    : 0.5; // conservative default

  const daysNeeded = Math.ceil(sessionsNeeded / sessionsPerDay);
  const predictedDate = new Date();
  predictedDate.setDate(predictedDate.getDate() + daysNeeded);

  return predictedDate.toISOString().slice(0, 10);
}

/**
 * Detect learning plateaus: sounds where mastery hasn't improved in 5+ sessions.
 */
export function detectPlateaus(): PlateauAlert[] {
  const profile = loadProfile(_activeUserId);
  const alerts: PlateauAlert[] = [];

  for (const [id, data] of Object.entries(profile.soundMastery)) {
    if (data.attempts < 5 || data.mastery >= 95) continue; // skip new or mastered sounds

    // Get snapshots for this sound
    const snapshots = profile._masterySnapshots.filter((s) => s.soundId === id);
    if (snapshots.length < PLATEAU_SESSION_THRESHOLD) continue;

    // Check last N snapshots for improvement
    const recentSnapshots = snapshots.slice(-PLATEAU_SESSION_THRESHOLD);
    const masteryValues = recentSnapshots.map((s) => s.mastery);
    const firstMastery = masteryValues[0];
    const lastMastery = masteryValues[masteryValues.length - 1];
    const improvement = lastMastery - firstMastery;

    // Plateau: less than 3 points of improvement over threshold sessions
    if (improvement < 3) {
      const sound = ALL_SOUNDS.find((s) => s.id === id);
      const grapheme = sound?.grapheme?.toUpperCase() ?? id;

      // Find the weakest activity type for this sound to suggest
      const weakActivity = findWeakestActivityForSound(data);
      const activityNames: Record<string, string> = {
        blending: 'blending',
        segmenting: 'segmenting',
        listening: 'listening',
        pronunciation: 'pronunciation',
        reading: 'reading',
      };
      const suggestedType = weakActivity ?? 'listening';
      const suggestedName = activityNames[suggestedType] ?? suggestedType;

      alerts.push({
        soundId: id,
        grapheme,
        mastery: data.mastery,
        sessionsStuck: recentSnapshots.length,
        lastImprovement: recentSnapshots[0].timestamp,
        suggestedActivityType: suggestedType,
        message: `The '${grapheme}' sound hasn't improved in ${recentSnapshots.length} sessions. Try a different activity type: ${suggestedName}.`,
        messageTr: `'${grapheme}' sesi ${recentSnapshots.length} oturumdur gelismiyor. Farkli bir aktivite tipi dene: ${suggestedName}.`,
      });
    }
  }

  // Sort by mastery (lowest first — most urgent)
  alerts.sort((a, b) => a.mastery - b.mastery);

  return alerts;
}

// ============================================================
// CONFUSION PAIR DETECTION — NEW
// ============================================================

/**
 * Detect confusion pairs from the child's actual error patterns.
 * Combines observed data with known Turkish-English confusion pairs.
 */
export function getConfusionPairs(): ConfusionPair[] {
  const profile = loadProfile(_activeUserId);
  const events = profile._confusionEvents || [];

  // Tally confusion events: count how often sound1 was confused with sound2
  // confusionCount = number of confusion events for this pair
  // totalAttempts = total activity attempts involving either sound (for rate calculation)
  const confusionCounts: Record<string, { count: number; total: number }> = {};

  for (const event of events) {
    const pair = [event.targetSound, event.selectedSound].sort().join('|');
    if (!confusionCounts[pair]) {
      confusionCounts[pair] = { count: 0, total: 0 };
    }
    confusionCounts[pair].count += 1;
  }

  // Calculate total attempts involving each sound for rate calculation
  // Use the profile's actual attempt counts for the sounds in each pair
  for (const pairKey of Object.keys(confusionCounts)) {
    const [s1, s2] = pairKey.split('|');
    const s1Id = findSoundIdByChar(s1);
    const s2Id = findSoundIdByChar(s2);
    const s1Attempts = profile.soundMastery[s1Id]?.attempts ?? 0;
    const s2Attempts = profile.soundMastery[s2Id]?.attempts ?? 0;
    // Total attempts where either sound was the target
    confusionCounts[pairKey].total = Math.max(1, s1Attempts + s2Attempts);
  }

  const pairs: ConfusionPair[] = [];

  // Build confusion pairs from observed data
  for (const [pairKey, data] of Object.entries(confusionCounts)) {
    const [sound1, sound2] = pairKey.split('|');
    const confusionRate = data.total > 0 ? data.count / data.total : 0;

    // Find known pair info for better recommendations
    const knownPair = KNOWN_CONFUSION_PAIRS.find(
      ([a, b]) => (a === sound1 && b === sound2) || (a === sound2 && b === sound1)
    );

    const recommendation = knownPair
      ? `${knownPair[2]}. Practice side-by-side comparison with listening activities.`
      : `Your child confuses '${sound1}' and '${sound2}'. Try minimal pair activities to distinguish them.`;

    const recommendationTr = knownPair
      ? `${knownPair[3]}. Yan yana karşılaştırma ile dinleme aktiviteleri yap.`
      : `Çocuğunuz '${sound1}' ve '${sound2}' seslerini karıştırıyor. Ayırt etmek için minimal çift aktiviteleri dene.`;

    pairs.push({
      sound1,
      sound2,
      confusionRate,
      occurrences: data.count,
      recommendation,
      recommendationTr,
    });
  }

  // Also flag known Turkish-English confusion pairs that haven't been observed yet
  // but where the child has low scores on both sounds
  for (const [s1, s2, reasonEn, reasonTr] of KNOWN_CONFUSION_PAIRS) {
    const pairKey = [s1, s2].sort().join('|');
    if (confusionCounts[pairKey]) continue; // already observed

    // Check if child has data on both sounds and struggles with either
    const s1Id = findSoundIdByChar(s1);
    const s2Id = findSoundIdByChar(s2);
    const s1Data = profile.soundMastery[s1Id];
    const s2Data = profile.soundMastery[s2Id];

    if (s1Data && s2Data && (s1Data.mastery < 50 || s2Data.mastery < 50)) {
      pairs.push({
        sound1: s1,
        sound2: s2,
        confusionRate: 0, // predicted, not observed
        occurrences: 0,
        recommendation: `${reasonEn}. Watch for this common confusion — practice both sounds together.`,
        recommendationTr: `${reasonTr}. Bu yaygin karisikliga dikkat edin — her iki sesi birlikte pratik yapin.`,
      });
    }
  }

  // Sort: observed confusions first (by rate), then predicted
  pairs.sort((a, b) => {
    if (a.occurrences > 0 && b.occurrences === 0) return -1;
    if (a.occurrences === 0 && b.occurrences > 0) return 1;
    return b.confusionRate - a.confusionRate;
  });

  return pairs;
}

// ============================================================
// SMART INSIGHTS (parent-friendly) — NEW
// ============================================================

/**
 * Generate data-driven, parent-friendly insights that go beyond simple metrics.
 * Combines pattern detection, predictions, plateau alerts, and actionable suggestions.
 */
export function getSmartInsights(): SmartInsight[] {
  const profile = loadProfile(_activeUserId);
  const insights: SmartInsight[] = [];

  // --- Time-of-day pattern ---
  const hourData = profile._sessionAccuracyByHour;
  const hourEntries = Object.entries(hourData).filter(([, d]) => d.count >= 2);
  if (hourEntries.length >= 2) {
    const timeAnalysis = getTimeOfDayAnalysis();
    const formatHour = (h: number): string => {
      if (h === 0) return '12am';
      if (h < 12) return `${h}am`;
      if (h === 12) return '12pm';
      return `${h - 12}pm`;
    };
    insights.push({
      type: 'pattern',
      title: `Best learning time: ${formatHour(timeAnalysis.bestHour)}`,
      titleTr: `En iyi öğrenme zamanı: ${formatHour(timeAnalysis.bestHour)}`,
      detail: timeAnalysis.recommendation,
      detailTr: timeAnalysis.bestHour < 12
        ? `Çocuğunuz sabah ${formatHour(timeAnalysis.bestHour)} civarında en iyi performansı gösteriyor. Yeni sesler için sabah oturumları önerilir.`
        : `Çocuğunuz ${formatHour(timeAnalysis.bestHour)} civarında en iyi performansı gösteriyor. Pratik oturumlarını bu saatlere ayarlayın.`,
      priority: 'medium',
    });
  }

  // --- Activity type analysis: find weakest ---
  const activityAnalysis = getActivityTypeAnalysis();
  const weakestActivity = activityAnalysis
    .filter((a) => a.totalAttempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  const strongestActivity = activityAnalysis
    .filter((a) => a.totalAttempts > 0)
    .sort((a, b) => b.accuracy - a.accuracy)[0];

  if (weakestActivity && strongestActivity && weakestActivity.activityType !== strongestActivity.activityType) {
    const activityNameMap: Record<string, { en: string; tr: string }> = {
      blending: { en: 'Blending', tr: 'Birleştirme' },
      segmenting: { en: 'Segmenting', tr: 'Ayırma' },
      listening: { en: 'Listening', tr: 'Dinleme' },
      pronunciation: { en: 'Pronunciation', tr: 'Telaffuz' },
      reading: { en: 'Reading', tr: 'Okuma' },
    };
    const weakName = activityNameMap[weakestActivity.activityType] ?? { en: weakestActivity.activityType, tr: weakestActivity.activityType };
    const strongName = activityNameMap[strongestActivity.activityType] ?? { en: strongestActivity.activityType, tr: strongestActivity.activityType };

    if (strongestActivity.accuracy - weakestActivity.accuracy > 20) {
      insights.push({
        type: 'suggestion',
        title: `${weakName.en} needs more practice`,
        titleTr: `${weakName.tr} daha fazla pratik istiyor`,
        detail: `${weakName.en}: ${weakestActivity.accuracy}% accuracy vs ${strongName.en}: ${strongestActivity.accuracy}%. More ${weakName.en.toLowerCase()} activities are recommended.`,
        detailTr: `${weakName.tr}: %${weakestActivity.accuracy} doğruluk vs ${strongName.tr}: %${strongestActivity.accuracy}. Daha fazla ${weakName.tr.toLowerCase()} aktivitesi önerilir.`,
        priority: weakestActivity.accuracy < 50 ? 'high' : 'medium',
        actionRoute: `/activities/${weakestActivity.activityType}`,
      });
    }
  }

  // --- Plateau alerts ---
  const plateaus = detectPlateaus();
  for (const plateau of plateaus.slice(0, 3)) { // max 3 plateau alerts
    insights.push({
      type: 'plateau',
      title: `'${plateau.grapheme}' sound stuck at ${plateau.mastery}%`,
      titleTr: `'${plateau.grapheme}' sesi %${plateau.mastery}'de takili`,
      detail: plateau.message,
      detailTr: plateau.messageTr,
      priority: plateau.mastery < 40 ? 'high' : 'medium',
      actionRoute: `/practice/${plateau.soundId}`,
    });
  }

  // --- Mastery predictions for sounds in progress ---
  const soundsInProgress = Object.entries(profile.soundMastery)
    .filter(([, d]) => d.mastery > 20 && d.mastery < 80 && d.attempts >= 3)
    .sort(([, a], [, b]) => b.mastery - a.mastery)
    .slice(0, 3);

  for (const [id, data] of soundsInProgress) {
    const predictedDate = predictMasteryDate(id);
    if (predictedDate) {
      const sound = ALL_SOUNDS.find((s) => s.id === id);
      const grapheme = sound?.grapheme?.toUpperCase() ?? id;
      insights.push({
        type: 'prediction',
        title: `'${grapheme}' could be mastered by ${predictedDate}`,
        titleTr: `'${grapheme}' ${predictedDate} tarihine kadar öğrenilecek`,
        detail: `Currently at ${data.mastery}% mastery. At the current learning rate, full mastery (95%) is predicted by ${predictedDate}.`,
        detailTr: `Şimdi %${data.mastery} ustalık. Mevcut öğrenme hızında, tam ustalık (%95) ${predictedDate} tarihine kadar bekleniyor.`,
        priority: 'low',
      });
    }
  }

  // --- Confusion pair warnings ---
  const confusions = getConfusionPairs();
  const activeConfusions = confusions.filter((c) => c.confusionRate >= 0.3 && c.occurrences >= 3);
  for (const confusion of activeConfusions.slice(0, 2)) {
    insights.push({
      type: 'pattern',
      title: `Confusing '${confusion.sound1}' with '${confusion.sound2}'`,
      titleTr: `'${confusion.sound1}' ile '${confusion.sound2}' karistiriliyor`,
      detail: confusion.recommendation,
      detailTr: confusion.recommendationTr,
      priority: confusion.confusionRate >= 0.5 ? 'high' : 'medium',
      actionRoute: `/practice/compare/${confusion.sound1}/${confusion.sound2}`,
    });
  }

  // --- Strength highlight ---
  if (profile.strongAreas.length >= 3) {
    const recentlyMastered = profile.strongAreas.slice(-3);
    const graphemes = recentlyMastered.map((id) => {
      const sound = ALL_SOUNDS.find((s) => s.id === id);
      return sound?.grapheme?.toUpperCase() ?? id;
    });
    insights.push({
      type: 'strength',
      title: `Strong sounds: ${graphemes.join(', ')}`,
      titleTr: `Güçlü sesler: ${graphemes.join(', ')}`,
      detail: `These sounds are well mastered. They'll be used for interleaved review to strengthen retention.`,
      detailTr: `Bu sesler iyi öğrenildi. Hatırlamayı güçlendirmek için karışık tekrarda kullanılacak.`,
      priority: 'low',
    });
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return insights;
}
