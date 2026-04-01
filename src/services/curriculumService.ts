// ============================================================
// MinesMinis — Curriculum Service
// Unified accessor for all curriculum data
// Merges: curriculum.ts (WORLDS) + curriculumPhases.ts (PHASES)
//         + phoneticsCurriculum.ts (PHONICS stages)
// ============================================================

import { ALL_PHASES, PHASES, type LearningPhase, type LearningUnit } from '../data/curriculumPhases';
import { WORLDS, type World, type Lesson } from '../data/curriculum';
import type { AgeGroup } from '../types/progress';

// ── Age Group Config ─────────────────────────────────────────
export const AGE_GROUP_CONFIG: Record<AgeGroup, {
  label: string;
  labelTr: string;
  ageRange: string;
  startPhaseId: string;
  maxPhaseId: string;
  trRatio: number;        // 0-1, percentage of Turkish in UI
  sessionMaxMinutes: number;
  activitiesPerSession: number;
  mimiTone: 'nurturing' | 'playful' | 'adventurous' | 'cool' | 'mentor';
}> = {
  'little-seeds': {
    label: 'Little Seeds', labelTr: 'Meraklı Tohumlar',
    ageRange: '2.5-3.5',
    startPhaseId: 'little-ears', maxPhaseId: 'little-ears',
    trRatio: 0.9, sessionMaxMinutes: 8, activitiesPerSession: 2,
    mimiTone: 'nurturing',
  },
  'little-ears': {
    label: 'Little Ears', labelTr: 'Küçük Kulaklar',
    ageRange: '3-5',
    startPhaseId: 'little-ears', maxPhaseId: 'word-builders',
    trRatio: 0.7, sessionMaxMinutes: 10, activitiesPerSession: 3,
    mimiTone: 'nurturing',
  },
  'word-builders': {
    label: 'Word Builders', labelTr: 'Kelime Ustaları',
    ageRange: '5-7',
    startPhaseId: 'word-builders', maxPhaseId: 'story-makers',
    trRatio: 0.5, sessionMaxMinutes: 15, activitiesPerSession: 4,
    mimiTone: 'playful',
  },
  'story-makers': {
    label: 'Story Makers', labelTr: 'Hikaye Yazarları',
    ageRange: '7-9',
    startPhaseId: 'story-makers', maxPhaseId: 'young-explorers',
    trRatio: 0.3, sessionMaxMinutes: 20, activitiesPerSession: 5,
    mimiTone: 'adventurous',
  },
  'young-explorers': {
    label: 'Young Explorers', labelTr: 'Genç Kaşifler',
    ageRange: '9-12',
    startPhaseId: 'young-explorers', maxPhaseId: 'young-explorers',
    trRatio: 0.1, sessionMaxMinutes: 25, activitiesPerSession: 6,
    mimiTone: 'mentor',
  },
};

// ── Phase/Unit Accessors ──────────────────────────────────────

/** All phases (phonics + general curriculum) in order */
export function getAllPhases(): LearningPhase[] {
  return ALL_PHASES;
}

/** Display phases — the 4 original Montessori phases for UI (WorldMap, etc.) */
export function getDisplayPhases(): LearningPhase[] {
  return PHASES;
}

/** Flat list of all units across all phases */
export function getAllUnits(): LearningUnit[] {
  return ALL_PHASES.flatMap(p => p.units);
}

/** Get a unit by its ID (e.g. 's1-u1', 's2-u3') */
export function getUnitById(unitId: string): LearningUnit | null {
  for (const phase of ALL_PHASES) {
    const unit = phase.units.find(u => u.id === unitId);
    if (unit) return unit;
  }
  return null;
}

/** Get the phase that contains a unit */
export function getPhaseForUnit(unitId: string): LearningPhase | null {
  return ALL_PHASES.find(p => p.units.some(u => u.id === unitId)) ?? null;
}

/** Get phase by ID */
export function getPhaseById(phaseId: string): LearningPhase | null {
  return ALL_PHASES.find(p => p.id === phaseId) ?? null;
}

/** Get next unit after given unitId, null if last */
export function getNextUnit(unitId: string): LearningUnit | null {
  const allUnits = getAllUnits();
  const idx = allUnits.findIndex(u => u.id === unitId);
  return idx >= 0 && idx < allUnits.length - 1 ? allUnits[idx + 1] : null;
}

/** Get prev unit, null if first */
export function getPrevUnit(unitId: string): LearningUnit | null {
  const allUnits = getAllUnits();
  const idx = allUnits.findIndex(u => u.id === unitId);
  return idx > 0 ? allUnits[idx - 1] : null;
}

/** Units for a specific age group */
export function getUnitsForAgeGroup(ageGroup: AgeGroup): LearningUnit[] {
  const config = AGE_GROUP_CONFIG[ageGroup];
  const startIdx = ALL_PHASES.findIndex(ph => ph.id === config.startPhaseId);
  const maxIdx   = ALL_PHASES.findIndex(ph => ph.id === config.maxPhaseId);

  return ALL_PHASES
    .filter((_p, idx) => idx >= startIdx && idx <= maxIdx)
    .flatMap(p => p.units);
}

/** Starting unit ID for age group (from placement or default) */
export function getStartUnitForAgeGroup(ageGroup: AgeGroup): string {
  const config = AGE_GROUP_CONFIG[ageGroup];
  const phase = getPhaseById(config.startPhaseId);
  return phase?.units[0]?.id ?? 's1-u1';
}

// ── WORLDS System Accessors (legacy, backward compat) ─────────

export function getAllWorlds(): World[] {
  return WORLDS;
}

export function getWorldById(worldId: string): World | null {
  return WORLDS.find(w => w.id === worldId) ?? null;
}

export function getLessonById(worldId: string, lessonId: string): Lesson | null {
  const world = getWorldById(worldId);
  return world?.lessons.find(l => l.id === lessonId) ?? null;
}

// ── Placement ─────────────────────────────────────────────────

/**
 * Given a placement score (1-7, Jolly Phonics group) + ageGroup,
 * returns the best starting unit ID
 */
export function getPlacementStartUnit(phonicsGroup: number, ageGroup: AgeGroup): string {
  const config = AGE_GROUP_CONFIG[ageGroup];
  const startPhase = getPhaseById(config.startPhaseId);
  if (!startPhase) return 's1-u1';

  // phonicsGroup 1 → very beginning, 7 → advanced
  // Map phonicsGroup to a unit within the start phase
  const unitIndex = Math.max(0, Math.min(phonicsGroup - 1, startPhase.units.length - 1));
  return startPhase.units[unitIndex]?.id ?? 's1-u1';
}
