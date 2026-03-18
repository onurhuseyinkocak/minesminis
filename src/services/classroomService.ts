/**
 * CLASSROOM SERVICE
 * LocalStorage-based classroom management for teachers.
 * Also syncs to Supabase for cross-device access.
 */

import { syncCreateClassroom, syncJoinClassroom } from './supabaseSync';
import { supabase } from '../config/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClassroomStudent {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
  phonicsProgress: Record<string, number>; // soundId → mastery %
  xp: number;
  lastActive: string;
}

export interface Classroom {
  id: string;
  teacherId: string;
  name: string;
  gradeLevel: string;
  joinCode: string;        // 6-char alphanumeric
  phonicsGroupAssigned: number;
  students: ClassroomStudent[];
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'mimi_classrooms_';
const STUDENT_CLASSROOM_KEY = 'mimi_my_classroom';

/** Characters that avoid ambiguity (no 0/O, 1/I/L) */
const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function getStorageKey(teacherId: string): string {
  return `${STORAGE_PREFIX}${teacherId}`;
}

function loadClassrooms(teacherId: string): Classroom[] {
  try {
    const raw = localStorage.getItem(getStorageKey(teacherId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveClassrooms(teacherId: string, classrooms: Classroom[]): void {
  localStorage.setItem(getStorageKey(teacherId), JSON.stringify(classrooms));
}

/** Load ALL classrooms across all teachers (for join-code lookup) */
function loadAllClassrooms(): Classroom[] {
  const all: Classroom[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '[]');
        all.push(...parsed);
      } catch {
        // skip corrupted entries
      }
    }
  }
  return all;
}

function generateId(): string {
  return `cls_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Generate a unique 6-char join code (uppercase, no ambiguous chars) */
export function generateJoinCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  // Verify uniqueness against existing codes
  const existing = loadAllClassrooms().map((c) => c.joinCode);
  if (existing.includes(code)) return generateJoinCode(); // retry (very rare)
  return code;
}

/** Create a new classroom */
export function createClassroom(
  teacherId: string,
  name: string,
  gradeLevel: string,
): Classroom {
  const classrooms = loadClassrooms(teacherId);
  const newClassroom: Classroom = {
    id: generateId(),
    teacherId,
    name,
    gradeLevel,
    joinCode: generateJoinCode(),
    phonicsGroupAssigned: 1,
    students: [],
    createdAt: new Date().toISOString(),
  };
  classrooms.push(newClassroom);
  saveClassrooms(teacherId, classrooms);

  // Sync to Supabase (fire-and-forget)
  syncCreateClassroom(
    teacherId,
    name,
    gradeLevel,
    newClassroom.joinCode,
    newClassroom.phonicsGroupAssigned,
  );

  return newClassroom;
}

/** Get all classrooms for a teacher */
export function getClassrooms(teacherId: string): Classroom[] {
  return loadClassrooms(teacherId);
}

/** Get a single classroom by ID */
export function getClassroom(classroomId: string): Classroom | undefined {
  const all = loadAllClassrooms();
  return all.find((c) => c.id === classroomId);
}

/** Look up a classroom by join code */
export function getClassroomByCode(joinCode: string): Classroom | undefined {
  const normalized = joinCode.toUpperCase().trim();
  const all = loadAllClassrooms();
  return all.find((c) => c.joinCode === normalized);
}

/** Add a student to a classroom via join code */
export function joinClassroom(
  joinCode: string,
  student: { id: string; name: string; avatar: string },
): { success: boolean; classroomName?: string; error?: string } {
  const classroom = getClassroomByCode(joinCode);
  if (!classroom) {
    return { success: false, error: 'Classroom not found. Check your code!' };
  }

  // Check if student already joined
  if (classroom.students.some((s) => s.id === student.id)) {
    return { success: false, error: 'You already joined this classroom!' };
  }

  const newStudent: ClassroomStudent = {
    id: student.id,
    name: student.name,
    avatar: student.avatar,
    joinedAt: new Date().toISOString(),
    phonicsProgress: {},
    xp: 0,
    lastActive: new Date().toISOString(),
  };

  classroom.students.push(newStudent);

  // Save back to the teacher's storage
  const teacherClassrooms = loadClassrooms(classroom.teacherId);
  const idx = teacherClassrooms.findIndex((c) => c.id === classroom.id);
  if (idx !== -1) {
    teacherClassrooms[idx] = classroom;
    saveClassrooms(classroom.teacherId, teacherClassrooms);
  }

  // Store membership on the student side
  localStorage.setItem(
    STUDENT_CLASSROOM_KEY,
    JSON.stringify({
      classroomId: classroom.id,
      classroomName: classroom.name,
      joinCode: classroom.joinCode,
      teacherId: classroom.teacherId,
      studentId: student.id,
      joinedAt: new Date().toISOString(),
    }),
  );

  // Sync to Supabase (fire-and-forget)
  syncJoinClassroom(classroom.joinCode, student.id);

  return { success: true, classroomName: classroom.name };
}

/** Remove a student from a classroom */
export function removeStudent(classroomId: string, studentId: string): boolean {
  const all = loadAllClassrooms();
  const classroom = all.find((c) => c.id === classroomId);
  if (!classroom) return false;

  classroom.students = classroom.students.filter((s) => s.id !== studentId);

  const teacherClassrooms = loadClassrooms(classroom.teacherId);
  const idx = teacherClassrooms.findIndex((c) => c.id === classroomId);
  if (idx !== -1) {
    teacherClassrooms[idx] = classroom;
    saveClassrooms(classroom.teacherId, teacherClassrooms);
  }

  // Sync to Supabase (fire-and-forget)
  try { supabase.from('classroom_students').delete().eq('classroom_join_code', classroom.joinCode).eq('student_id', studentId).then(() => {}); } catch {}

  return true;
}

/** Assign a phonics group to a classroom */
export function assignPhonicsGroup(classroomId: string, group: number): boolean {
  const all = loadAllClassrooms();
  const classroom = all.find((c) => c.id === classroomId);
  if (!classroom) return false;

  classroom.phonicsGroupAssigned = group;

  const teacherClassrooms = loadClassrooms(classroom.teacherId);
  const idx = teacherClassrooms.findIndex((c) => c.id === classroomId);
  if (idx !== -1) {
    teacherClassrooms[idx] = classroom;
    saveClassrooms(classroom.teacherId, teacherClassrooms);
  }

  // Sync to Supabase (fire-and-forget)
  try { supabase.from('classrooms').update({ phonics_group_assigned: group }).eq('join_code', classroom.joinCode).then(() => {}); } catch {}

  return true;
}

/** Update a student's phonics mastery for a specific sound */
export function updateStudentProgress(
  classroomId: string,
  studentId: string,
  soundId: string,
  mastery: number,
): boolean {
  const all = loadAllClassrooms();
  const classroom = all.find((c) => c.id === classroomId);
  if (!classroom) return false;

  const student = classroom.students.find((s) => s.id === studentId);
  if (!student) return false;

  student.phonicsProgress[soundId] = Math.min(100, Math.max(0, mastery));
  student.lastActive = new Date().toISOString();

  const teacherClassrooms = loadClassrooms(classroom.teacherId);
  const idx = teacherClassrooms.findIndex((c) => c.id === classroomId);
  if (idx !== -1) {
    teacherClassrooms[idx] = classroom;
    saveClassrooms(classroom.teacherId, teacherClassrooms);
  }
  return true;
}

/** Get class leaderboard sorted by XP (descending) */
export function getClassLeaderboard(classroomId: string): ClassroomStudent[] {
  const classroom = getClassroom(classroomId);
  if (!classroom) return [];
  return [...classroom.students].sort((a, b) => b.xp - a.xp);
}

/** Get the student's current classroom membership */
export function getStudentClassroom(): {
  classroomId: string;
  classroomName: string;
  joinCode: string;
  teacherId: string;
  studentId: string;
  joinedAt: string;
} | null {
  try {
    const raw = localStorage.getItem(STUDENT_CLASSROOM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Delete a classroom */
export function deleteClassroom(teacherId: string, classroomId: string): boolean {
  const classrooms = loadClassrooms(teacherId);
  const classroom = classrooms.find((c) => c.id === classroomId);
  const filtered = classrooms.filter((c) => c.id !== classroomId);
  if (filtered.length === classrooms.length) return false;
  saveClassrooms(teacherId, filtered);

  // Sync to Supabase (fire-and-forget)
  if (classroom) {
    try { supabase.from('classrooms').delete().eq('join_code', classroom.joinCode).then(() => {}); } catch {}
  }

  return true;
}

/** Sync student progress to the classroom entry (for local demo mode).
 *  Call this after a student completes an activity so the teacher dashboard updates.
 *  @param earnedXP - XP earned in this activity (added to existing total) */
export function syncStudentProgress(earnedXP: number): void {
  const membership = getStudentClassroom();
  if (!membership || !membership.studentId) return;

  // Update the student's XP and lastActive in the classroom
  const all = loadAllClassrooms();
  const classroom = all.find((c) => c.id === membership.classroomId);
  if (!classroom) return;

  const student = classroom.students.find((s) => s.id === membership.studentId);
  if (!student) return;

  student.xp = (student.xp || 0) + earnedXP;
  student.lastActive = new Date().toISOString();

  // Save back
  const teacherClassrooms = loadClassrooms(classroom.teacherId);
  const idx = teacherClassrooms.findIndex((c) => c.id === classroom.id);
  if (idx !== -1) {
    teacherClassrooms[idx] = classroom;
    saveClassrooms(classroom.teacherId, teacherClassrooms);
  }
}
