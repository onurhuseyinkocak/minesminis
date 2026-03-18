/**
 * LEARNING PATH SERVICE
 * MinesMinis v4.0
 *
 * Determines what the child should do NEXT based on their progress.
 * Drives the auto-play guided learning flow so children don't have
 * to navigate between activities manually.
 */

import { ALL_SOUNDS, PHONICS_GROUPS } from '../data/phonics';
import type { PhonicsSound } from '../data/phonics';
import { getDueWords } from '../data/spacedRepetition';

// ============================================================
// TYPES
// ============================================================

export interface NextAction {
  type:
    | 'phonics-lesson'
    | 'review'
    | 'game'
    | 'daily-challenge'
    | 'placement-test'
    | 'celebration';
  title: string;
  titleTr: string;
  emoji: string;
  route: string;
  description: string;
}

interface SoundMasteryRecord {
  mastery: number;       // 0-100
  lastPracticed: string; // ISO date
}

export interface LearningProgress {
  phase: number;
  group: number;
  sound: string;
  percent: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const LS_PLACEMENT_RESULT = 'mimi_placement_result';
const LS_PHONICS_MASTERY = 'mimi_phonics_mastery';
const LS_CURRENT_SOUND = 'mimi_current_sound';
const LS_DAILY_CHALLENGE_DATE = 'mimi_daily_challenge_date';
const MASTERY_THRESHOLD = 80;

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

function getPlacementResult(): number | null {
  try {
    const val = localStorage.getItem(LS_PLACEMENT_RESULT);
    if (val === null) return null;
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

function getPhonicsmastery(): Record<string, SoundMasteryRecord> {
  try {
    const raw = localStorage.getItem(LS_PHONICS_MASTERY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SoundMasteryRecord>;
  } catch {
    return {};
  }
}

function savePhonicsmastery(data: Record<string, SoundMasteryRecord>): void {
  try {
    localStorage.setItem(LS_PHONICS_MASTERY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function getCurrentSoundId(): string | null {
  try {
    return localStorage.getItem(LS_CURRENT_SOUND);
  } catch {
    return null;
  }
}

function setCurrentSoundId(soundId: string): void {
  try {
    localStorage.setItem(LS_CURRENT_SOUND, soundId);
  } catch {
    // ignore
  }
}

function isDailyChallengeCompletedToday(): boolean {
  try {
    const stored = localStorage.getItem(LS_DAILY_CHALLENGE_DATE);
    if (!stored) return false;
    const today = new Date().toISOString().slice(0, 10);
    return stored === today;
  } catch {
    return false;
  }
}

// ============================================================
// RANDOM GAME ROUTES (fallback variety)
// ============================================================

const GAME_ROUTES = [
  { route: '/games', title: 'Play a Game', titleTr: 'Oyun Oyna', emoji: '\uD83C\uDFAE' },
  { route: '/practice', title: 'Practice Words', titleTr: 'Kelime Pratigi', emoji: '\u270D\uFE0F' },
  { route: '/words', title: 'Explore Words', titleTr: 'Kelimeleri Kesfedin', emoji: '\uD83D\uDCD6' },
];

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Returns the PhonicsSound the child is currently learning.
 * If none is set, defaults to the first sound (or placement-based).
 */
export function getCurrentPhonicsSound(): PhonicsSound | null {
  const currentId = getCurrentSoundId();

  if (currentId) {
    const found = ALL_SOUNDS.find((s) => s.id === currentId);
    if (found) return found;
  }

  // Determine starting sound from placement or default to first
  const placementGroup = getPlacementResult();
  const startGroup = placementGroup ?? 1;

  const group = PHONICS_GROUPS.find((g) => g.group === startGroup);
  if (!group || group.sounds.length === 0) return ALL_SOUNDS[0] || null;

  const firstSound = group.sounds[0];
  setCurrentSoundId(firstSound.id);
  return firstSound;
}

/**
 * Returns overview of how far through the phonics curriculum the child is.
 */
export function getProgress(): LearningProgress {
  const current = getCurrentPhonicsSound();
  if (!current) {
    return { phase: 1, group: 1, sound: 's', percent: 0 };
  }

  const mastery = getPhonicsmastery();
  const totalSounds = ALL_SOUNDS.length;
  const masteredCount = Object.values(mastery).filter(
    (m) => m.mastery >= MASTERY_THRESHOLD
  ).length;

  return {
    phase: current.group,
    group: current.group,
    sound: current.grapheme,
    percent: totalSounds > 0 ? Math.round((masteredCount / totalSounds) * 100) : 0,
  };
}

/**
 * Advances to the next sound in the curriculum.
 * Returns the new sound, or null if all sounds are complete.
 */
export function advanceToNextSound(): PhonicsSound | null {
  const currentId = getCurrentSoundId();
  if (!currentId) {
    const first = ALL_SOUNDS[0];
    if (first) setCurrentSoundId(first.id);
    return first || null;
  }

  // Find current position across all groups
  for (let gi = 0; gi < PHONICS_GROUPS.length; gi++) {
    const group = PHONICS_GROUPS[gi];
    const si = group.sounds.findIndex((s) => s.id === currentId);
    if (si === -1) continue;

    // Next sound in same group?
    if (si + 1 < group.sounds.length) {
      const next = group.sounds[si + 1];
      setCurrentSoundId(next.id);
      return next;
    }

    // First sound of next group?
    if (gi + 1 < PHONICS_GROUPS.length) {
      const nextGroup = PHONICS_GROUPS[gi + 1];
      if (nextGroup.sounds.length > 0) {
        const next = nextGroup.sounds[0];
        setCurrentSoundId(next.id);
        return next;
      }
    }

    // No more sounds — curriculum complete
    return null;
  }

  return null;
}

/**
 * Check if all sounds in the current sound's group are mastered.
 */
function isCurrentGroupComplete(): boolean {
  const currentId = getCurrentSoundId();
  if (!currentId) return false;

  const mastery = getPhonicsmastery();

  for (const group of PHONICS_GROUPS) {
    const inGroup = group.sounds.some((s) => s.id === currentId);
    if (!inGroup) continue;

    return group.sounds.every((s) => {
      const m = mastery[s.id];
      return m && m.mastery >= MASTERY_THRESHOLD;
    });
  }

  return false;
}

/**
 * Check if the current sound is mastered.
 */
function isCurrentSoundMastered(): boolean {
  const currentId = getCurrentSoundId();
  if (!currentId) return false;

  const mastery = getPhonicsmastery();
  const m = mastery[currentId];
  return !!m && m.mastery >= MASTERY_THRESHOLD;
}

/**
 * Records mastery progress for a sound. Called after lesson completion.
 */
export function recordSoundMastery(soundId: string, score: number): void {
  const mastery = getPhonicsmastery();
  const existing = mastery[soundId];
  const now = new Date().toISOString();

  if (existing) {
    // Weighted average: 60% new score, 40% old mastery
    existing.mastery = Math.min(100, Math.round(score * 0.6 + existing.mastery * 0.4));
    existing.lastPracticed = now;
  } else {
    mastery[soundId] = {
      mastery: Math.min(100, score),
      lastPracticed: now,
    };
  }

  savePhonicsmastery(mastery);
}

// ============================================================
// MAIN: getNextAction
// ============================================================

/**
 * Determines the single best next action for the child.
 * Priority:
 *   1. No placement test → placement test
 *   2. Daily challenge not done → daily challenge
 *   3. Words due for review (>5) → review session
 *   4. Current sound not mastered → phonics lesson
 *   5. Current sound mastered → advance to next sound
 *   6. All sounds in group mastered → celebration + next group
 *   7. Fallback → random game for variety
 */
export function getNextAction(): NextAction {
  // 1. Placement test
  const placement = getPlacementResult();
  if (placement === null) {
    return {
      type: 'placement-test',
      title: 'Find Your Level',
      titleTr: 'Seviyeni Bul',
      emoji: '\uD83C\uDFAF',
      route: '/placement',
      description: 'Take a quick test so Mimi knows where to start!',
    };
  }

  // 2. Daily challenge
  if (!isDailyChallengeCompletedToday()) {
    return {
      type: 'daily-challenge',
      title: "Today's Challenge",
      titleTr: 'Gunun Gorevleri',
      emoji: '\u2B50',
      route: '/dashboard',
      description: 'Complete your daily challenge and earn bonus XP!',
    };
  }

  // 3. Words due for review
  const dueWords = getDueWords();
  if (dueWords.length > 5) {
    return {
      type: 'review',
      title: `Review ${dueWords.length} Words`,
      titleTr: `${dueWords.length} Kelimeyi Tekrarla`,
      emoji: '\uD83D\uDD04',
      route: '/words?tab=review',
      description: `You have ${dueWords.length} words ready for review!`,
    };
  }

  // 4. Current sound not mastered → phonics lesson
  if (!isCurrentSoundMastered()) {
    const current = getCurrentPhonicsSound();
    if (current) {
      return {
        type: 'phonics-lesson',
        title: `Learn the "${current.grapheme.toUpperCase()}" sound`,
        titleTr: `"${current.grapheme.toUpperCase()}" sesini ogren`,
        emoji: current.mnemonicEmoji,
        route: `/phonics/${current.id}`,
        description: current.story,
      };
    }
  }

  // 5. Current sound mastered — check if group is complete
  if (isCurrentGroupComplete()) {
    // 6. Group complete → celebration then advance
    const next = advanceToNextSound();
    if (next) {
      return {
        type: 'celebration',
        title: 'Group Complete! New Sounds Unlocked!',
        titleTr: 'Grup Tamamlandi! Yeni Sesler Acildi!',
        emoji: '\uD83C\uDF89',
        route: `/phonics/${next.id}`,
        description: `Amazing! You mastered the whole group. Next up: "${next.grapheme.toUpperCase()}"`,
      };
    }
    // All groups complete
    return {
      type: 'celebration',
      title: 'All Sounds Mastered!',
      titleTr: 'Tum Sesler Ogrenildi!',
      emoji: '\uD83C\uDF1F',
      route: '/dashboard',
      description: 'Incredible! You have mastered every sound!',
    };
  }

  // 5b. Current sound mastered but group not complete → advance
  const nextSound = advanceToNextSound();
  if (nextSound) {
    return {
      type: 'phonics-lesson',
      title: `Learn the "${nextSound.grapheme.toUpperCase()}" sound`,
      titleTr: `"${nextSound.grapheme.toUpperCase()}" sesini ogren`,
      emoji: nextSound.mnemonicEmoji,
      route: `/phonics/${nextSound.id}`,
      description: nextSound.story,
    };
  }

  // 7. Fallback → random game
  const pick = GAME_ROUTES[Math.floor(Math.random() * GAME_ROUTES.length)];
  return {
    type: 'game',
    title: pick.title,
    titleTr: pick.titleTr,
    emoji: pick.emoji,
    route: pick.route,
    description: 'Keep practicing to become a language champion!',
  };
}

/**
 * Get a short summary for the "What's Next?" tooltip.
 */
export function getNextActionSummary(): string {
  const action = getNextAction();
  return `${action.emoji} ${action.title}`;
}
