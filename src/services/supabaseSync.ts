/**
 * SUPABASE SYNC SERVICE
 * Writes learning data to BOTH localStorage (offline/speed) AND Supabase (cross-device).
 * localStorage remains the primary source; Supabase is the sync layer.
 *
 * TABLE MAPPING (actual DB):
 *   activity_logs  -> user_activities
 *   phonics_mastery -> users.settings.phonics_mastery (JSONB)
 *   classrooms / classroom_students -> NOT IN DB (no-op)
 *   curriculum_progress -> users.settings (JSONB)
 *   curriculum_current_unit -> users.settings (JSONB)
 */

import { supabase } from '../config/supabase';
import { withRetry } from '../utils/retryUtils';

// ========== HELPERS ==========

/**
 * Deep-merge updates into the users.settings JSONB column, then touch profiles.updated_at.
 * Parallelized: users-settings fetch + profiles-id check run concurrently.
 */
async function updateUserSettings(
  userId: string,
  updates: Record<string, unknown>,
): Promise<void> {
  // Run the initial reads in parallel to avoid waterfall
  const [{ data }, { data: p }] = await Promise.all([
    withRetry(() =>
      supabase.from('users').select('settings').eq('id', userId).maybeSingle()
    ),
    withRetry(() =>
      supabase.from('profiles').select('id').eq('id', userId).maybeSingle()
    ),
  ]);

  const current = (data?.settings as Record<string, unknown>) ?? {};

  // Write updates in parallel too
  const writes: Promise<unknown>[] = [
    withRetry(() =>
      supabase
        .from('users')
        .update({ settings: { ...current, ...updates } })
        .eq('id', userId)
    ),
  ];

  if (p) {
    writes.push(
      withRetry(() =>
        supabase
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', userId)
      ),
    );
  }

  await Promise.all(writes);
}

// ========== ACTIVITY LOGS ==========

export interface SyncActivityInput {
  type: string;
  title: string;
  duration: number;
  accuracy?: number;
  xpEarned: number;
  soundId?: string;
}

/**
 * Sync a single activity log entry to Supabase.
 * Table: user_activities (not activity_logs).
 */
export async function syncActivityLog(
  userId: string,
  activity: SyncActivityInput,
): Promise<void> {
  try {
    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: activity.type,
      activity_name: activity.title,
      xp_earned: activity.xpEarned,
      metadata: {
        duration: activity.duration,
        accuracy: activity.accuracy ?? null,
        sound_id: activity.soundId ?? null,
      },
    });
  } catch {
    // Silent fail — localStorage is primary, Supabase is backup
  }
}

/**
 * Fetch activity logs from Supabase for a given user.
 * Table: user_activities.
 */
export async function fetchActivityLogs(
  userId: string,
  limit = 50,
): Promise<
  {
    id: string;
    type: string;
    title: string;
    duration: number;
    accuracy: number | null;
    xp_earned: number;
    sound_id: string | null;
    created_at: string;
  }[]
> {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('id, activity_type, activity_name, xp_earned, metadata, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data.map((row: Record<string, unknown>) => {
      const meta = (row.metadata as Record<string, unknown>) ?? {};
      return {
        id: row.id as string,
        type: row.activity_type as string,
        title: row.activity_name as string,
        duration: Number(meta.duration ?? 0),
        accuracy: meta.accuracy != null ? Number(meta.accuracy) : null,
        xp_earned: Number(row.xp_earned ?? 0),
        sound_id: (meta.sound_id as string) ?? null,
        created_at: row.created_at as string,
      };
    });
  } catch {
    return [];
  }
}

// ========== PHONICS MASTERY ==========

/**
 * Sync phonics mastery to Supabase via users.settings.phonics_mastery JSON map.
 * No dedicated table exists — stored in JSONB.
 */
export async function syncPhonicsMastery(
  userId: string,
  soundId: string,
  mastery: number,
  attempts: number,
  correct: number,
): Promise<void> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const current = (data?.settings as Record<string, unknown>) ?? {};
    const existing = (current.phonics_mastery as Record<string, unknown>) ?? {};

    const updated: Record<string, unknown> = {
      ...existing,
      [soundId]: {
        mastery,
        attempts,
        correct_attempts: correct,
        last_practiced: new Date().toISOString(),
      },
    };

    await updateUserSettings(userId, { phonics_mastery: updated });
  } catch {
    // Silent fail
  }
}

/**
 * Fetch phonics mastery from Supabase for a given user.
 * Reads from users.settings.phonics_mastery JSONB.
 */
export async function fetchPhonicsMastery(
  userId: string,
): Promise<Record<string, { mastery: number; attempts: number }>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return {};
    }

    const settings = (data.settings as Record<string, unknown>) ?? {};
    const pm = (settings.phonics_mastery as Record<string, Record<string, unknown>>) ?? {};

    const result: Record<string, { mastery: number; attempts: number }> = {};
    for (const [soundId, entry] of Object.entries(pm)) {
      result[soundId] = {
        mastery: Number(entry.mastery ?? 0),
        attempts: Number(entry.attempts ?? 0),
      };
    }
    return result;
  } catch {
    return {};
  }
}

// ========== CLASSROOMS ==========
// Tables classrooms / classroom_students do NOT exist in the DB.
// All functions are silent no-ops.

export async function syncCreateClassroom(
  _teacherId: string,
  _name: string,
  _grade: string,
  _joinCode: string,
  _phonicsGroup: number,
): Promise<void> {
  // No-op: classrooms table does not exist
}

export async function syncJoinClassroom(
  _joinCode: string,
  _studentId: string,
): Promise<{ classroomName: string } | null> {
  // No-op: classrooms table does not exist
  return null;
}

export async function fetchTeacherClassrooms(
  _teacherId: string,
): Promise<
  {
    id: string;
    name: string;
    grade_level: string | null;
    join_code: string;
    phonics_group_assigned: number;
    created_at: string;
    classroom_students: { student_id: string; joined_at: string }[];
  }[]
> {
  // No-op: classrooms table does not exist
  return [];
}

// ========== GAMIFICATION STATS ==========

export interface SyncStatsInput {
  xp: number;
  level: number;
  streakDays: number;
  wordsLearned: number;
  badges: string[];
}

/**
 * Sync user stats to Supabase users table + profiles table.
 */
export async function syncUserStats(
  userId: string,
  stats: SyncStatsInput,
): Promise<void> {
  try {
    const { data: curr } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const currentSettings = (curr?.settings as Record<string, unknown>) ?? {};

    // Update users table
    await supabase.from('users').update({
      xp: stats.xp,
      points: stats.xp,
      level: stats.level,
      streak_days: stats.streakDays,
      badges: stats.badges,
      settings: {
        ...currentSettings,
        level: stats.level,
        words_learned: stats.wordsLearned,
        last_synced: new Date().toISOString(),
      },
    }).eq('id', userId);

    // Also sync key fields to profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      await supabase.from('profiles').update({
        xp: stats.xp,
        level: stats.level,
        streak_days: stats.streakDays,
        badges: stats.badges,
        words_learned: stats.wordsLearned,
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
    }
  } catch {
    // localStorage is primary, Supabase is backup — silent fail
  }
}

/**
 * Load stats from Supabase when localStorage is empty (new device).
 */
export async function loadUserStats(
  userId: string,
): Promise<SyncStatsInput | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('xp, points, streak_days, badges, level, settings')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const xp = data.xp || data.points || 0;
    if (!xp) return null; // No synced stats yet

    const s = (data.settings as Record<string, unknown>) ?? {};

    return {
      xp,
      level: Number(data.level ?? s.level ?? 1),
      streakDays: Number(data.streak_days ?? 0),
      wordsLearned: Number(s.words_learned ?? s.wordsLearned ?? 0),
      badges: (data.badges as string[]) ?? [],
    };
  } catch {
    return null;
  }
}

// ========== SPACED REPETITION SYNC ==========

/**
 * Sync spaced repetition word progress to Supabase.
 * Already uses users.settings pattern — kept as-is.
 */
export async function syncSpacedRepetition(
  userId: string,
  words: Record<string, unknown>,
): Promise<void> {
  try {
    await updateUserSettings(userId, {
      spaced_repetition: words,
      sr_last_synced: new Date().toISOString(),
    });
  } catch {
    // Silent fail
  }
}

/**
 * Load spaced repetition data from Supabase.
 */
export async function loadSpacedRepetition(
  userId: string,
): Promise<Record<string, unknown> | null> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const s = (data?.settings as Record<string, unknown>) ?? {};
    return (s.spaced_repetition as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

// ========== PROGRESS RESTORE ==========

/**
 * Restore gamification progress from Supabase on a new device.
 * Only writes to localStorage if the key is not already set.
 */
export async function restoreProgressFromSupabase(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings, xp, level, streak_days')
      .eq('id', userId)
      .single();

    if (!data) return false;

    const settings = (data.settings as Record<string, unknown>) ?? {};

    // Restore gamification state
    if (data.xp || data.level || data.streak_days) {
      const key = `mm_gamification_${userId}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify({
          xp: data.xp || 0,
          level: data.level || 1,
          streakDays: data.streak_days || 0,
          wordsLearned: Number(settings.words_learned ?? 0),
        }));
      }
    }

    // Restore learned words
    const learnedWords = settings.learnedWords;
    if (Array.isArray(learnedWords) && learnedWords.length) {
      const key = `mm_learned_${userId}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(learnedWords));
      }
    }

    return true;
  } catch { return false; }
}

// ========== PARENT-CHILD ==========

/**
 * Fetch activity logs for a child (used by parent cross-device view).
 */
export async function fetchChildActivity(
  childId: string,
  limit = 20,
): Promise<Awaited<ReturnType<typeof fetchActivityLogs>>> {
  return fetchActivityLogs(childId, limit);
}

/**
 * Fetch phonics mastery for a child (used by parent cross-device view).
 */
export async function fetchChildMastery(
  childId: string,
): Promise<Record<string, { mastery: number; attempts: number }>> {
  return fetchPhonicsMastery(childId);
}

// ========== CURRICULUM PROGRESS ==========

/**
 * Sync curriculum unit progress to users.settings JSONB.
 * No dedicated curriculum_progress table exists.
 *
 * With childId:
 *   settings.child_progress.${childId}.units.${unitId} = { progress, activityIndex, completed }
 * Without childId:
 *   settings.curriculum_progress.${unitId} = { progress, activityIndex, completed }
 */
export async function syncCurriculumProgress(
  userId: string,
  unitId: string,
  progress: number,
  activityIndex: number,
  completed: boolean,
  childId?: string,
): Promise<void> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const current = (data?.settings as Record<string, unknown>) ?? {};
    const entry = { progress, activityIndex, completed };

    let updates: Record<string, unknown>;

    if (childId) {
      const childProgress = (current.child_progress as Record<string, Record<string, unknown>>) ?? {};
      const childData = childProgress[childId] ?? {};
      const units = (childData.units as Record<string, unknown>) ?? {};
      updates = {
        child_progress: {
          ...childProgress,
          [childId]: {
            ...childData,
            units: {
              ...units,
              [unitId]: entry,
            },
          },
        },
      };
    } else {
      const cp = (current.curriculum_progress as Record<string, unknown>) ?? {};
      updates = {
        curriculum_progress: {
          ...cp,
          [unitId]: entry,
        },
      };
    }

    await updateUserSettings(userId, updates);
  } catch {
    // silent fail
  }
}

/**
 * Sync current unit to users.settings JSONB.
 * No dedicated curriculum_current_unit table exists.
 *
 * With childId:
 *   settings.child_progress.${childId}.current_unit = unitId
 * Without childId:
 *   settings.current_unit = unitId
 */
export async function syncCurrentUnit(
  userId: string,
  unitId: string,
  childId?: string,
): Promise<void> {
  try {
    if (childId) {
      const { data } = await supabase
        .from('users')
        .select('settings')
        .eq('id', userId)
        .maybeSingle();

      const current = (data?.settings as Record<string, unknown>) ?? {};
      const childProgress = (current.child_progress as Record<string, Record<string, unknown>>) ?? {};
      const childData = childProgress[childId] ?? {};

      await updateUserSettings(userId, {
        child_progress: {
          ...childProgress,
          [childId]: {
            ...childData,
            current_unit: unitId,
          },
        },
      });
    } else {
      await updateUserSettings(userId, { current_unit: unitId });
    }
  } catch {
    // silent fail
  }
}

/**
 * Restore curriculum progress from users.settings JSONB.
 */
export async function restoreCurriculumProgress(
  userId: string,
  childId?: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (!data) return false;
    const settings = (data.settings as Record<string, unknown>) ?? {};

    if (childId) {
      const childProgress = (settings.child_progress as Record<string, Record<string, unknown>>) ?? {};
      const childData = childProgress[childId];
      if (!childData) return false;

      // Restore current unit
      const currentUnit = childData.current_unit as string | undefined;
      if (currentUnit) {
        const key = `mm_child_${childId}_current_unit`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, currentUnit);
        }
      }

      // Restore unit progress
      const units = (childData.units as Record<string, Record<string, unknown>>) ?? {};
      const unitIds = Object.keys(units);
      if (unitIds.length === 0) return false;

      for (const uid of unitIds) {
        const row = units[uid];
        const prefix = `mm_child_${childId}_`;
        const progKey = `${prefix}unit_${uid}_progress`;
        const actKey = `${prefix}unit_${uid}_activity`;
        const doneKey = `${prefix}unit_${uid}_completed`;
        if (!localStorage.getItem(progKey)) localStorage.setItem(progKey, String(row.progress));
        if (!localStorage.getItem(actKey)) localStorage.setItem(actKey, String(row.activityIndex));
        if (row.completed && !localStorage.getItem(doneKey)) localStorage.setItem(doneKey, '1');
      }
      return true;
    } else {
      // Restore current unit
      const currentUnit = settings.current_unit as string | undefined;
      if (currentUnit) {
        const key = 'mm_current_unit';
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, currentUnit);
        }
      }

      // Restore unit progress
      const cp = (settings.curriculum_progress as Record<string, Record<string, unknown>>) ?? {};
      const unitIds = Object.keys(cp);
      if (unitIds.length === 0) return false;

      for (const uid of unitIds) {
        const row = cp[uid];
        const prefix = 'mm_';
        const progKey = `${prefix}unit_${uid}_progress`;
        const actKey = `${prefix}unit_${uid}_activity`;
        const doneKey = `${prefix}unit_${uid}_completed`;
        if (!localStorage.getItem(progKey)) localStorage.setItem(progKey, String(row.progress));
        if (!localStorage.getItem(actKey)) localStorage.setItem(actKey, String(row.activityIndex));
        if (row.completed && !localStorage.getItem(doneKey)) localStorage.setItem(doneKey, '1');
      }
      return true;
    }
  } catch {
    return false;
  }
}
