// ============================================================
// MinesMinis — Unified Progress Service
// Replaces: progressTracker.ts + lessonProgressService.ts
// Strategy: localStorage-first (instant), Supabase-async (sync)
// ============================================================

import { supabase } from '../config/supabase';
import type { ActivityResult, SyncEvent } from '../types/progress';

// ── Storage Keys (backward compatible) ──────────────────────
const KEYS = {
  ACTIVE_CHILD:     'mimi_active_child',
  CURRENT_UNIT:     (pfx: string) => `${pfx}current_unit`,
  UNIT_PROGRESS:    (pfx: string, uid: string) => `${pfx}unit_${uid}_progress`,
  UNIT_COMPLETED:   (pfx: string, uid: string) => `${pfx}unit_${uid}_completed`,
  UNIT_ACTIVITY:    (pfx: string, uid: string) => `${pfx}unit_${uid}_activity`,
  LEGACY_WORLDS:    'mm_user_progress',
  SYNC_QUEUE:       'mm_sync_queue',
  PROGRESS_CACHE:   (userId: string) => `mm_progress_cache_${userId}`,
} as const;

function getPrefix(childId: string | null): string {
  return childId ? `mm_child_${childId}_` : 'mm_';
}

// ── Sync Queue (offline-first) ───────────────────────────────
function enqueueSyncEvent(event: Omit<SyncEvent, 'id' | 'timestamp' | 'retryCount'>): void {
  try {
    const raw = localStorage.getItem(KEYS.SYNC_QUEUE);
    const queue: SyncEvent[] = raw ? JSON.parse(raw) : [];
    queue.push({ ...event, id: crypto.randomUUID(), timestamp: new Date().toISOString(), retryCount: 0 });
    // Keep last 200 events max
    const trimmed = queue.slice(-200);
    localStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify(trimmed));
  } catch { /* quota exceeded — silent */ }
}

async function flushSyncQueue(userId: string, childId: string | null): Promise<void> {
  if (!supabase || !navigator.onLine) return;
  try {
    const raw = localStorage.getItem(KEYS.SYNC_QUEUE);
    if (!raw) return;
    const queue: SyncEvent[] = JSON.parse(raw);
    if (!queue.length) return;

    const processed: string[] = [];
    for (const event of queue) {
      try {
        if (event.type === 'unit_progress' || event.type === 'unit_complete') {
          await supabase.from('curriculum_progress').upsert({
            user_id: userId,
            child_id: childId,
            unit_id: event.payload.unitId,
            progress: event.payload.progressPercent,
            activity_index: event.payload.currentActivityIndex,
            completed: event.payload.completed,
            completed_at: event.payload.completedAt,
            updated_at: event.timestamp,
          }, { onConflict: 'user_id,child_id,unit_id' });
        }
        if (event.type === 'current_unit') {
          await supabase.from('curriculum_current_unit').upsert({
            user_id: userId,
            child_id: childId,
            current_unit_id: event.payload.unitId,
            updated_at: event.timestamp,
          }, { onConflict: 'user_id,child_id' });
        }
        processed.push(event.id);
      } catch {
        if (event.retryCount >= 3) processed.push(event.id); // give up
        else event.retryCount++;
      }
    }

    const remaining = queue.filter(e => !processed.includes(e.id));
    localStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify(remaining));
  } catch { /* sync error — silent, will retry */ }
}

// ── Core Progress Service ─────────────────────────────────────

class ProgressService {
  private userId: string | null = null;
  private childId: string | null = null;

  setUser(userId: string, childId: string | null = null): void {
    this.userId = userId;
    this.childId = childId;
    // Attempt sync when user is set (may have queued offline events)
    if (navigator.onLine) {
      this.flushQueue();
      this.loadFromSupabase();
    }
    // Listen for reconnection
    window.addEventListener('online', () => this.flushQueue(), { once: false });
  }

  private get prefix(): string {
    return getPrefix(this.childId);
  }

  private flushQueue(): void {
    if (this.userId) flushSyncQueue(this.userId, this.childId);
  }

  // ── READ ─────────────────────────────────────────────────

  getCurrentUnitId(): string {
    // New key first, fallback to old placement
    return localStorage.getItem(KEYS.CURRENT_UNIT(this.prefix))
      || this.getPlacementStartUnit()
      || 's1-u1';
  }

  private getPlacementStartUnit(): string | null {
    try {
      const detail = localStorage.getItem('mimi_placement_detail');
      if (detail) {
        const parsed = JSON.parse(detail);
        if (parsed?.unitId) return parsed.unitId as string;
      }
      const result = localStorage.getItem('mimi_placement_result');
      if (result) return `s${result}-u1`;
    } catch { /* */ }
    return null;
  }

  getUnitProgress(unitId: string): number {
    const raw = localStorage.getItem(KEYS.UNIT_PROGRESS(this.prefix, unitId));
    // Also check legacy key
    if (!raw) {
      const legacy = localStorage.getItem(`mimi_unit_progress_${unitId}`);
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy) as { activitiesCompleted?: number };
          return parsed.activitiesCompleted ?? 0;
        } catch { /* */ }
      }
    }
    return raw ? parseInt(raw, 10) : 0;
  }

  isUnitCompleted(unitId: string): boolean {
    return localStorage.getItem(KEYS.UNIT_COMPLETED(this.prefix, unitId)) === '1';
  }

  getCurrentActivityIndex(unitId: string): number {
    const raw = localStorage.getItem(KEYS.UNIT_ACTIVITY(this.prefix, unitId));
    return raw ? parseInt(raw, 10) : 0;
  }

  isUnitUnlocked(unitId: string): boolean {
    const current = this.getCurrentUnitId();
    // Unit ID format: s{stage}-u{unit}, compare numerically
    return this.compareUnitIds(unitId, current) <= 0 || this.isUnitCompleted(unitId);
  }

  /** Returns -1 if a < b, 0 if equal, 1 if a > b */
  compareUnitIds(a: string, b: string): number {
    const parse = (id: string): [number, number] => {
      const m = id.match(/s(\d+)-u(\d+)/);
      return m ? [parseInt(m[1]), parseInt(m[2])] : [0, 0];
    };
    const [as, au] = parse(a);
    const [bs, bu] = parse(b);
    if (as !== bs) return as < bs ? -1 : 1;
    if (au !== bu) return au < bu ? -1 : 1;
    return 0;
  }

  getTotalProgress(): number {
    // Count completed units / total known units
    let completed = 0;
    let total = 0;
    for (const key in localStorage) {
      if (key.includes('_unit_') && key.includes('_completed')) {
        total++;
        if (localStorage.getItem(key) === '1') completed++;
      }
    }
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // ── WRITE ────────────────────────────────────────────────

  saveActivityComplete(unitId: string, activityIndex: number, totalActivities: number, result?: ActivityResult): void {
    void result; // reserved for future use
    const nextIndex = activityIndex + 1;
    const progressPct = Math.min(100, Math.round((nextIndex / totalActivities) * 100));

    // Write to localStorage immediately
    localStorage.setItem(KEYS.UNIT_ACTIVITY(this.prefix, unitId), String(nextIndex));
    localStorage.setItem(KEYS.UNIT_PROGRESS(this.prefix, unitId), String(progressPct));

    // Enqueue Supabase sync
    enqueueSyncEvent({
      type: 'unit_progress',
      payload: {
        unitId,
        progressPercent: progressPct,
        currentActivityIndex: nextIndex,
        completed: false,
        completedAt: null,
      },
    });

    // Check if unit is complete
    if (nextIndex >= totalActivities) {
      this.completeUnit(unitId);
    }
  }

  completeUnit(unitId: string): void {
    const now = new Date().toISOString();
    localStorage.setItem(KEYS.UNIT_COMPLETED(this.prefix, unitId), '1');
    localStorage.setItem(KEYS.UNIT_PROGRESS(this.prefix, unitId), '100');

    enqueueSyncEvent({
      type: 'unit_complete',
      payload: { unitId, progressPercent: 100, currentActivityIndex: 0, completed: true, completedAt: now },
    });

    // Advance to next unit
    const nextUnitId = this.getNextUnitId(unitId);
    if (nextUnitId) this.setCurrentUnit(nextUnitId);
  }

  setCurrentUnit(unitId: string): void {
    localStorage.setItem(KEYS.CURRENT_UNIT(this.prefix), unitId);
    enqueueSyncEvent({ type: 'current_unit', payload: { unitId } });
  }

  resetAllProgress(): void {
    const keysToDelete: string[] = [];
    for (const key in localStorage) {
      if (
        key.startsWith('mm_') && (
          key.includes('_unit_') ||
          key.includes('_current_unit') ||
          key === KEYS.SYNC_QUEUE
        )
      ) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(k => localStorage.removeItem(k));
    this.setCurrentUnit('s1-u1');
  }

  // ── HELPERS ──────────────────────────────────────────────

  private getNextUnitId(currentUnitId: string): string | null {
    const m = currentUnitId.match(/s(\d+)-u(\d+)/);
    if (!m) return null;
    const stage = parseInt(m[1]);
    const unit = parseInt(m[2]);
    // Simple increment: s1-u1 → s1-u2, etc.
    // CurriculumService will validate if this unit exists
    return `s${stage}-u${unit + 1}`;
  }

  // ── SUPABASE LOAD ─────────────────────────────────────────

  private async loadFromSupabase(): Promise<void> {
    if (!supabase || !this.userId) return;
    try {
      // Load current unit
      const { data: cur } = await supabase
        .from('curriculum_current_unit')
        .select('current_unit_id')
        .eq('user_id', this.userId)
        .eq('child_id', this.childId ?? '')
        .maybeSingle();

      if (cur?.current_unit_id) {
        const local = this.getCurrentUnitId();
        // Take whichever is further ahead
        if (this.compareUnitIds(cur.current_unit_id as string, local) > 0) {
          localStorage.setItem(KEYS.CURRENT_UNIT(this.prefix), cur.current_unit_id as string);
        }
      }

      // Load unit progress
      const { data: progressRows } = await supabase
        .from('curriculum_progress')
        .select('unit_id, progress, activity_index, completed, completed_at')
        .eq('user_id', this.userId)
        .eq('child_id', this.childId ?? '');

      progressRows?.forEach((row: {
        unit_id: string;
        progress: number;
        activity_index: number;
        completed: boolean;
        completed_at: string | null;
      }) => {
        const localPct = this.getUnitProgress(row.unit_id);
        if (row.progress > localPct) {
          localStorage.setItem(KEYS.UNIT_PROGRESS(this.prefix, row.unit_id), String(row.progress));
          localStorage.setItem(KEYS.UNIT_ACTIVITY(this.prefix, row.unit_id), String(row.activity_index));
        }
        if (row.completed) {
          localStorage.setItem(KEYS.UNIT_COMPLETED(this.prefix, row.unit_id), '1');
        }
      });
    } catch { /* silent — will use local data */ }
  }
}

export const progressService = new ProgressService();
export default progressService;
