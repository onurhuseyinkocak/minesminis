/**
 * SUPABASE SYNC SERVICE
 * Writes learning data to BOTH localStorage (offline/speed) AND Supabase (cross-device).
 * localStorage remains the primary source; Supabase is the sync layer.
 */

import { supabase } from '../config/supabase';

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
 * Call this AFTER the localStorage write in activityLogger.logActivity().
 */
export async function syncActivityLog(
  userId: string,
  activity: SyncActivityInput,
): Promise<void> {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      type: activity.type,
      title: activity.title,
      duration: activity.duration,
      accuracy: activity.accuracy ?? null,
      xp_earned: activity.xpEarned,
      sound_id: activity.soundId ?? null,
    });
  } catch {
    // Silent fail — localStorage is primary, Supabase is backup
  }
}

/**
 * Fetch activity logs from Supabase for a given user.
 * Used by ParentDashboard when localStorage is empty (cross-device scenario).
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
  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// ========== PHONICS MASTERY ==========

/**
 * Sync phonics mastery to Supabase via upsert.
 * Call this AFTER the localStorage write in learningPathService.recordSoundMastery().
 */
export async function syncPhonicsMastery(
  userId: string,
  soundId: string,
  mastery: number,
  attempts: number,
  correct: number,
): Promise<void> {
  try {
    await supabase.from('phonics_mastery').upsert(
      {
        user_id: userId,
        sound_id: soundId,
        mastery,
        attempts,
        correct_attempts: correct,
        last_practiced: new Date().toISOString(),
      },
      { onConflict: 'user_id,sound_id' },
    );
  } catch {
    // Silent fail
  }
}

/**
 * Fetch phonics mastery from Supabase for a given user.
 * Returns a map of soundId → { mastery, attempts }.
 */
export async function fetchPhonicsMastery(
  userId: string,
): Promise<Record<string, { mastery: number; attempts: number }>> {
  const { data } = await supabase
    .from('phonics_mastery')
    .select('sound_id, mastery, attempts, correct_attempts, last_practiced')
    .eq('user_id', userId);

  const result: Record<string, { mastery: number; attempts: number }> = {};
  (data || []).forEach(
    (row: {
      sound_id: string;
      mastery: number;
      attempts: number;
      correct_attempts: number;
      last_practiced: string;
    }) => {
      result[row.sound_id] = {
        mastery: row.mastery,
        attempts: row.attempts,
      };
    },
  );
  return result;
}

// ========== CLASSROOMS ==========

/**
 * Sync a newly created classroom to Supabase.
 * Call this AFTER the localStorage write in classroomService.createClassroom().
 */
export async function syncCreateClassroom(
  teacherId: string,
  name: string,
  grade: string,
  joinCode: string,
  phonicsGroup: number,
): Promise<void> {
  try {
    await supabase.from('classrooms').insert({
      teacher_id: teacherId,
      name,
      grade_level: grade,
      join_code: joinCode,
      phonics_group_assigned: phonicsGroup,
    });
  } catch {
    // Silent fail
  }
}

/**
 * Sync a student joining a classroom to Supabase.
 * Call this AFTER the localStorage write in classroomService.joinClassroom().
 */
export async function syncJoinClassroom(
  joinCode: string,
  studentId: string,
): Promise<{ classroomName: string } | null> {
  try {
    const { data: classroom } = await supabase
      .from('classrooms')
      .select('id, name')
      .eq('join_code', joinCode.toUpperCase())
      .single();

    if (!classroom) return null;

    await supabase.from('classroom_students').upsert(
      {
        classroom_id: classroom.id,
        student_id: studentId,
      },
      { onConflict: 'classroom_id,student_id' },
    );

    return { classroomName: classroom.name };
  } catch {
    return null;
  }
}

/**
 * Fetch all classrooms for a teacher from Supabase.
 */
export async function fetchTeacherClassrooms(
  teacherId: string,
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
  const { data } = await supabase
    .from('classrooms')
    .select('*, classroom_students(student_id, joined_at)')
    .eq('teacher_id', teacherId);
  return data || [];
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
