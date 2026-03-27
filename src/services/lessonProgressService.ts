// ============================================================
// lessonProgressService.ts
// Tracks user progress through the phonics curriculum units
// Supports multi-child progress isolation + Supabase sync
// ============================================================

import { ALL_CURRICULUM_UNITS, getNextUnit } from '../data/phoneticsCurriculum';
import { syncCurriculumProgress, syncCurrentUnit } from './supabaseSync';

// ── Active child detection ───────────────────────────────────

const ACTIVE_CHILD_KEY = 'mimi_active_child';

function getActiveChildId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CHILD_KEY);
  } catch {
    return null;
  }
}

// ── Key builders (child-aware) ───────────────────────────────

function prefix(): string {
  const childId = getActiveChildId();
  return childId ? `mm_child_${childId}_` : 'mm_';
}

const KEY_CURRENT_UNIT = () => `${prefix()}current_unit`;
const KEY_UNIT_PROGRESS = (id: string) => `${prefix()}unit_${id}_progress`;
const KEY_UNIT_COMPLETED = (id: string) => `${prefix()}unit_${id}_completed`;
const KEY_UNIT_ACTIVITY = (id: string) => `${prefix()}unit_${id}_activity`;

// ── User ID helper (for Supabase sync) ───────────────────────

function getCurrentUserId(): string | null {
  try {
    const keys = Object.keys(localStorage);
    const firebaseKey = keys.find(k => k.startsWith('firebase:authUser:'));
    if (firebaseKey) {
      const data = JSON.parse(localStorage.getItem(firebaseKey) ?? '{}');
      return data?.uid ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Read helpers ───────────────────────────────────────────

export function getCurrentUnitId(): string {
  try {
    return localStorage.getItem(KEY_CURRENT_UNIT()) ?? ALL_CURRICULUM_UNITS[0]?.id ?? 's1-u1';
  } catch {
    return 's1-u1';
  }
}

export function getUnitProgress(unitId: string): number {
  try {
    const raw = localStorage.getItem(KEY_UNIT_PROGRESS(unitId));
    const val = parseInt(raw ?? '0', 10);
    return isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
  } catch {
    return 0;
  }
}

export function isUnitCompleted(unitId: string): boolean {
  try {
    return localStorage.getItem(KEY_UNIT_COMPLETED(unitId)) === '1';
  } catch {
    return false;
  }
}

export function getCurrentActivityIndex(unitId: string): number {
  try {
    const raw = localStorage.getItem(KEY_UNIT_ACTIVITY(unitId));
    const val = parseInt(raw ?? '0', 10);
    return isNaN(val) ? 0 : val;
  } catch {
    return 0;
  }
}

// ── Write helpers ──────────────────────────────────────────

export function saveActivityComplete(unitId: string, activityIndex: number, totalActivities: number): void {
  try {
    const next = activityIndex + 1;
    localStorage.setItem(KEY_UNIT_ACTIVITY(unitId), String(next));
    const progress = Math.round((next / totalActivities) * 100);
    localStorage.setItem(KEY_UNIT_PROGRESS(unitId), String(progress));

    const uid = getCurrentUserId();
    if (uid) {
      const childId = getActiveChildId() ?? undefined;
      syncCurriculumProgress(uid, unitId, progress, next, next >= totalActivities, childId).catch(() => {});
    }

    if (next >= totalActivities) {
      completeUnit(unitId);
    }
  } catch {
    // ignore storage errors
  }
}

export function completeUnit(unitId: string): void {
  try {
    localStorage.setItem(KEY_UNIT_COMPLETED(unitId), '1');
    localStorage.setItem(KEY_UNIT_PROGRESS(unitId), '100');

    // Advance to next unit
    const next = getNextUnit(unitId);
    if (next) {
      localStorage.setItem(KEY_CURRENT_UNIT(), next.id);
    }

    const uid = getCurrentUserId();
    if (uid) {
      const childId = getActiveChildId() ?? undefined;
      syncCurriculumProgress(uid, unitId, 100, 999, true, childId).catch(() => {});
      if (next) syncCurrentUnit(uid, next.id, childId).catch(() => {});
    }
  } catch {
    // ignore
  }
}

export function setCurrentUnit(unitId: string): void {
  try {
    localStorage.setItem(KEY_CURRENT_UNIT(), unitId);

    const uid = getCurrentUserId();
    if (uid) {
      const childId = getActiveChildId() ?? undefined;
      syncCurrentUnit(uid, unitId, childId).catch(() => {});
    }
  } catch {
    // ignore
  }
}

// ── Derived ────────────────────────────────────────────────

/** Is this unit unlocked? A unit is unlocked if it is at or before the current unit. */
export function isUnitUnlocked(unitId: string): boolean {
  const currentId = getCurrentUnitId();
  const allIds = ALL_CURRICULUM_UNITS.map((u) => u.id);
  const currentIdx = allIds.indexOf(currentId);
  const unitIdx = allIds.indexOf(unitId);
  return unitIdx <= currentIdx;
}

/** Overall curriculum progress 0-100 */
export function getTotalCurriculumProgress(): number {
  const total = ALL_CURRICULUM_UNITS.length;
  if (total === 0) return 0;
  const done = ALL_CURRICULUM_UNITS.filter((u) => isUnitCompleted(u.id)).length;
  return Math.round((done / total) * 100);
}

// ── Current Unit (phaseIndex + unitIndex) ─────────────────────

const CURRENT_UNIT_PHASE_KEY = () => `${prefix()}current_unit_phase_idx`;
const CURRENT_UNIT_UNIT_KEY  = () => `${prefix()}current_unit_unit_idx`;

/**
 * Save the currently active unit by phase/unit index (0-based).
 * Called from WorldMap whenever the active unit is identified.
 */
export function saveCurrentUnit(phaseIndex: number, unitIndex: number): void {
  try {
    localStorage.setItem(CURRENT_UNIT_PHASE_KEY(), String(phaseIndex));
    localStorage.setItem(CURRENT_UNIT_UNIT_KEY(),  String(unitIndex));
  } catch {
    // storage full — ignore
  }
}

/**
 * Read the currently active unit (phaseIndex + unitIndex, both 0-based).
 * Falls back to placement result, then to { phaseIndex: 0, unitIndex: 0 }.
 */
export function getCurrentUnit(): { phaseIndex: number; unitIndex: number } {
  try {
    const phaseRaw = localStorage.getItem(CURRENT_UNIT_PHASE_KEY());
    const unitRaw  = localStorage.getItem(CURRENT_UNIT_UNIT_KEY());
    if (phaseRaw !== null && unitRaw !== null) {
      const phaseIndex = parseInt(phaseRaw, 10);
      const unitIndex  = parseInt(unitRaw,  10);
      if (!isNaN(phaseIndex) && !isNaN(unitIndex)) {
        return { phaseIndex, unitIndex };
      }
    }
  } catch { /* ignore */ }

  // Fallback: derive from placement detail
  try {
    const detail = localStorage.getItem('mimi_placement_detail');
    if (detail) {
      const parsed = JSON.parse(detail) as { phase?: number };
      const phaseIndex = Math.max(0, (parsed.phase ?? 1) - 1);
      return { phaseIndex, unitIndex: 0 };
    }
  } catch { /* ignore */ }

  return { phaseIndex: 0, unitIndex: 0 };
}

/** Reset progress (for testing / profile switch) — resets for current child only */
export function resetAllProgress(): void {
  try {
    for (const unit of ALL_CURRICULUM_UNITS) {
      localStorage.removeItem(KEY_UNIT_PROGRESS(unit.id));
      localStorage.removeItem(KEY_UNIT_COMPLETED(unit.id));
      localStorage.removeItem(KEY_UNIT_ACTIVITY(unit.id));
    }
    localStorage.setItem(KEY_CURRENT_UNIT(), ALL_CURRICULUM_UNITS[0]?.id ?? 's1-u1');
    // Also reset the phase/unit index cache used by WorldMap
    localStorage.removeItem(CURRENT_UNIT_PHASE_KEY());
    localStorage.removeItem(CURRENT_UNIT_UNIT_KEY());
  } catch {
    // ignore
  }
}
