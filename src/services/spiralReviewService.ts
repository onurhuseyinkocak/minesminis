/**
 * Spiral Review Service
 * Surfaces words from previously completed units in new contexts.
 *
 * Research basis: Spacing Effect (Ebbinghaus) + Interleaving (Bjork)
 * Rule: Every 3rd lesson should include 20-30% words from earlier phases.
 */

import { PHASES } from '../data/curriculumPhases';
import { kidsWords } from '../data/wordsData';
import { getCurrentUnit } from './lessonProgressService';
import type { KidsWord } from '../data/wordsData';

const SPIRAL_KEY = 'mimi_spiral_session_count';
const MASTERED_UNITS_KEY = 'mimi_mastered_units';

function getSessionCount(): number {
  return parseInt(localStorage.getItem(SPIRAL_KEY) ?? '0', 10);
}

export function incrementSessionCount(): void {
  localStorage.setItem(SPIRAL_KEY, String(getSessionCount() + 1));
}

export function markUnitMastered(phaseIndex: number, unitIndex: number): void {
  const key = `${phaseIndex}-${unitIndex}`;
  let existing: string[] = [];
  try { existing = JSON.parse(localStorage.getItem(MASTERED_UNITS_KEY) ?? '[]'); } catch { /* corrupted */ }
  if (!existing.includes(key)) {
    existing.push(key);
    localStorage.setItem(MASTERED_UNITS_KEY, JSON.stringify(existing));
  }
}

export function getMasteredUnits(): Array<{ phaseIndex: number; unitIndex: number }> {
  let raw: string[] = [];
  try { raw = JSON.parse(localStorage.getItem(MASTERED_UNITS_KEY) ?? '[]'); } catch { /* corrupted */ }
  return raw.map(k => {
    const [p, u] = k.split('-').map(Number);
    return { phaseIndex: p, unitIndex: u };
  });
}

/**
 * Should this session include spiral review words?
 * Rule: Every 3rd session triggers spiral review.
 */
export function shouldIncludeSpiralReview(): boolean {
  const count = getSessionCount();
  return count > 0 && count % 3 === 0;
}

/**
 * Get words from previously mastered units for spiral review.
 * Returns up to `count` words from earlier phases.
 */
export function getSpiralReviewWords(count: number = 4): KidsWord[] {
  const currentUnit = getCurrentUnit();
  const mastered = getMasteredUnits();

  // Only review units BEFORE the current position
  const previousUnits = mastered.filter(u =>
    u.phaseIndex < currentUnit.phaseIndex ||
    (u.phaseIndex === currentUnit.phaseIndex && u.unitIndex < currentUnit.unitIndex)
  );

  if (previousUnits.length === 0) return [];

  // Collect vocabulary themes from mastered units
  const reviewThemes: string[] = [];
  for (const { phaseIndex, unitIndex } of previousUnits) {
    const phase = PHASES[phaseIndex];
    const unit = phase?.units?.[unitIndex];
    if (unit?.vocabularyTheme) {
      reviewThemes.push(unit.vocabularyTheme);
    }
  }

  if (reviewThemes.length === 0) return [];

  // Get words matching those themes
  const reviewWords = kidsWords.filter(w =>
    w.category && reviewThemes.includes(w.category)
  );

  // Shuffle and take `count` words
  const shuffled = [...reviewWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Mix current unit words with spiral review words.
 * @param currentWords - words from current unit
 * @param totalCount - desired total
 */
export function getMixedLessonWords(currentWords: KidsWord[], totalCount: number = 8): KidsWord[] {
  if (!shouldIncludeSpiralReview()) return currentWords.slice(0, totalCount);

  const spiralCount = Math.floor(totalCount * 0.25); // 25% spiral review
  const currentCount = totalCount - spiralCount;

  const current = currentWords.slice(0, currentCount);
  const currentWordSet = new Set(current.map((w) => w.word));

  // Deduplicate: exclude any spiral word that's already in current lesson
  const spiralCandidates = getSpiralReviewWords(spiralCount * 2); // request extra to account for deduplication
  const spiral = spiralCandidates
    .filter((w) => !currentWordSet.has(w.word))
    .slice(0, spiralCount);

  if (spiral.length === 0) {
    // No usable spiral words — fall back to current words only
    return currentWords.slice(0, totalCount);
  }

  // Interleave: spread spiral words throughout, don't bunch them at end
  const mixed: KidsWord[] = [];
  const maxLen = Math.max(current.length, spiral.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < current.length) mixed.push(current[i]);
    if (i < spiral.length) mixed.push(spiral[i]);
  }

  return mixed.slice(0, totalCount);
}
