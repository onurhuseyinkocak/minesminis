// ============================================================
// MinesMinis — Unified Placement Service
// Single source of truth for placement test logic
// Used by: Onboarding.tsx, PlacementTest.tsx
// ============================================================

import { getPlacementStartUnit } from './curriculumService';
import { progressService } from './progressService';
import type { AgeGroup } from '../types/progress';

export type PlacementLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PlacementQuestion {
  id: string;
  level: PlacementLevel;         // 1=pre-phonics, 7=advanced
  ageGroups: AgeGroup[];         // which groups see this
  type: 'listening' | 'image-select' | 'blending' | 'sight-word' | 'comprehension';
  // The actual content comes from the question bank
  questionKey: string;           // key into PLACEMENT_QUESTIONS_BANK
}

export interface PlacementResult {
  phonicsGroup: PlacementLevel;  // 1-7
  ageGroup: AgeGroup;
  startUnitId: string;
  phaseId: string;
  accuracy: number;              // 0-100
  questionsAnswered: number;
  determinedAt: string;
}

// Storage keys
const LS_PLACEMENT_RESULT = 'mimi_placement_result';
const LS_PLACEMENT_DETAIL = 'mimi_placement_detail';
const LS_PLACEMENT_SHOWN  = 'mimi_placement_shown';

export function savePlacementResult(result: PlacementResult): void {
  localStorage.setItem(LS_PLACEMENT_RESULT, String(result.phonicsGroup));
  localStorage.setItem(LS_PLACEMENT_DETAIL, JSON.stringify(result));
  progressService.setCurrentUnit(result.startUnitId);
}

export function getPlacementResult(): PlacementResult | null {
  const raw = localStorage.getItem(LS_PLACEMENT_DETAIL);
  if (raw) {
    try { return JSON.parse(raw) as PlacementResult; } catch { /* */ }
  }
  // Legacy: just a number
  const num = localStorage.getItem(LS_PLACEMENT_RESULT);
  if (num) {
    const level = parseInt(num) as PlacementLevel;
    return {
      phonicsGroup: level,
      ageGroup: 'word-builders',
      startUnitId: `s${level}-u1`,
      phaseId: 'word-builders',
      accuracy: 0,
      questionsAnswered: 0,
      determinedAt: new Date().toISOString(),
    };
  }
  return null;
}

export function hasCompletedPlacement(): boolean {
  return !!localStorage.getItem(LS_PLACEMENT_RESULT);
}

export function markPlacementShown(): void {
  localStorage.setItem(LS_PLACEMENT_SHOWN, '1');
}

export function wasPlacementShown(): boolean {
  return localStorage.getItem(LS_PLACEMENT_SHOWN) === '1';
}

export function clearPlacement(): void {
  localStorage.removeItem(LS_PLACEMENT_RESULT);
  localStorage.removeItem(LS_PLACEMENT_DETAIL);
  localStorage.removeItem(LS_PLACEMENT_SHOWN);
}

/**
 * Compute placement result from raw scores.
 * Called at end of placement test.
 */
export function computePlacementResult(
  answeredQuestions: Array<{ level: PlacementLevel; correct: boolean }>,
  ageGroup: AgeGroup,
): PlacementResult {
  if (!answeredQuestions.length) {
    // No questions → put at age group default
    const startUnitId = getPlacementStartUnit(1, ageGroup);
    return {
      phonicsGroup: 1,
      ageGroup,
      startUnitId,
      phaseId: 'little-ears',
      accuracy: 0,
      questionsAnswered: 0,
      determinedAt: new Date().toISOString(),
    };
  }

  const correct = answeredQuestions.filter(q => q.correct).length;
  const accuracy = Math.round((correct / answeredQuestions.length) * 100);

  // Find highest level answered correctly at least once with >= 60% accuracy
  const levelCounts: Partial<Record<PlacementLevel, { correct: number; total: number }>> = {};
  for (const q of answeredQuestions) {
    if (!levelCounts[q.level]) levelCounts[q.level] = { correct: 0, total: 0 };
    levelCounts[q.level]!.total++;
    if (q.correct) levelCounts[q.level]!.correct++;
  }

  let phonicsGroup: PlacementLevel = 1;
  for (let lvl = 7; lvl >= 1; lvl--) {
    const data = levelCounts[lvl as PlacementLevel];
    if (data && data.correct >= 1 && data.correct / data.total >= 0.6) {
      phonicsGroup = lvl as PlacementLevel;
      break;
    }
  }

  // Age cap: 3-5 yaş max group 2, 5-7 max group 4
  const ageCaps: Partial<Record<AgeGroup, PlacementLevel>> = {
    'little-seeds': 1,
    'little-ears': 2,
    'word-builders': 4,
    'story-makers': 6,
    'young-explorers': 7,
  };
  const cap = ageCaps[ageGroup];
  if (cap && phonicsGroup > cap) phonicsGroup = cap;

  const startUnitId = getPlacementStartUnit(phonicsGroup, ageGroup);

  return {
    phonicsGroup,
    ageGroup,
    startUnitId,
    phaseId: '',   // curriculumService fills this
    accuracy,
    questionsAnswered: answeredQuestions.length,
    determinedAt: new Date().toISOString(),
  };
}
