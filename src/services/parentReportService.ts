// ============================================================
// MinesMinis — Parent Report Service
// Generates + caches weekly snapshots in Supabase
// ============================================================

import { supabase } from '../config/supabase';

export interface WeeklySnapshot {
  userId: string;
  childId: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  totalMinutes: number;
  lessonsCompleted: number;
  wordsLearned: number;
  phonemesMastered: number;
  avgAccuracy: number;
  streakDays: number;
  topWeakPhonemes: string[];
  topStrongPhonemes: string[];
}

function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1) - day; // Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

/** Build snapshot from localStorage + Supabase data */
async function buildCurrentSnapshot(userId: string, childId: string): Promise<WeeklySnapshot> {
  const weekStart = getWeekStart();

  // Get learning sessions from Supabase for this week
  let totalMinutes = 0;
  let lessonsCompleted = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  if (supabase && navigator.onLine) {
    try {
      const { data: sessions } = await supabase
        .from('learning_sessions')
        .select('duration_sec, activity_count, correct_count, incorrect_count, xp_earned')
        .eq('user_id', userId)
        .gte('started_at', weekStart + 'T00:00:00Z');

      sessions?.forEach((s: { duration_sec: number; activity_count: number; correct_count: number; incorrect_count: number }) => {
        totalMinutes += Math.round((s.duration_sec || 0) / 60);
        totalCorrect += s.correct_count || 0;
        totalQuestions += (s.correct_count || 0) + (s.incorrect_count || 0);
      });

      const { data: completions } = await supabase
        .from('lesson_completions')
        .select('id')
        .eq('user_id', userId)
        .gte('completed_at', weekStart + 'T00:00:00Z');
      lessonsCompleted = completions?.length ?? 0;
    } catch (e) { console.warn('[parentReportService] buildCurrentSnapshot DB query failed:', e); }
  }

  // Phoneme data from adaptiveEngine localStorage
  const weakPhonemes: string[] = [];
  const strongPhonemes: string[] = [];
  try {
    const profileRaw = localStorage.getItem(`mimi_learner_profile_${userId}`);
    if (profileRaw) {
      const profile = JSON.parse(profileRaw) as { soundMastery?: Record<string, { mastery: number }> };
      const sounds: Array<{ soundId: string; mastery: number }> = Object.entries(profile.soundMastery || {})
        .map(([soundId, data]) => ({ soundId, mastery: (data as { mastery: number }).mastery }));
      sounds.sort((a, b) => a.mastery - b.mastery);
      sounds.slice(0, 3).forEach(s => weakPhonemes.push(s.soundId));
      sounds.slice(-3).reverse().forEach(s => strongPhonemes.push(s.soundId));
    }
  } catch { /* */ }

  // Word count from localStorage
  let wordsLearned = 0;
  try {
    const learned = localStorage.getItem(`mm_learned_${userId}`);
    if (learned) wordsLearned = (JSON.parse(learned) as unknown[]).length;
  } catch { /* */ }

  // Streak from gamification
  let streakDays = 0;
  try {
    const gam = localStorage.getItem(`gamification_${userId}`);
    if (gam) streakDays = (JSON.parse(gam) as { streakDays?: number }).streakDays ?? 0;
  } catch { /* */ }

  const avgAccuracy = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  return {
    userId, childId, weekStart,
    totalMinutes, lessonsCompleted, wordsLearned,
    phonemesMastered: strongPhonemes.length,
    avgAccuracy, streakDays,
    topWeakPhonemes: weakPhonemes,
    topStrongPhonemes: strongPhonemes,
  };
}

/** Save snapshot to Supabase */
async function saveSnapshot(snapshot: WeeklySnapshot): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('parent_report_snapshots').upsert({
      user_id: snapshot.userId,
      child_id: snapshot.childId,
      week_start: snapshot.weekStart,
      total_minutes: snapshot.totalMinutes,
      lessons_completed: snapshot.lessonsCompleted,
      words_learned: snapshot.wordsLearned,
      phonemes_mastered: snapshot.phonemesMastered,
      avg_accuracy: snapshot.avgAccuracy,
      streak_days: snapshot.streakDays,
      top_weak_phonemes: snapshot.topWeakPhonemes,
      top_strong_phonemes: snapshot.topStrongPhonemes,
    }, { onConflict: 'user_id,child_id,week_start' });
  } catch (e) { console.warn('[parentReportService] saveSnapshot failed:', e); }
}

/** Get latest snapshot (Supabase first, build if missing) */
export async function getWeeklyReport(userId: string, childId = ''): Promise<WeeklySnapshot> {
  const weekStart = getWeekStart();

  // Try Supabase cache first
  if (supabase && navigator.onLine) {
    try {
      const { data } = await supabase
        .from('parent_report_snapshots')
        .select('*')
        .eq('user_id', userId)
        .eq('child_id', childId)
        .eq('week_start', weekStart)
        .maybeSingle();
      if (data) {
        return {
          userId: data.user_id as string,
          childId: data.child_id as string,
          weekStart: data.week_start as string,
          totalMinutes: data.total_minutes as number,
          lessonsCompleted: data.lessons_completed as number,
          wordsLearned: data.words_learned as number,
          phonemesMastered: data.phonemes_mastered as number,
          avgAccuracy: (data.avg_accuracy as number) ?? 0,
          streakDays: data.streak_days as number,
          topWeakPhonemes: (data.top_weak_phonemes as string[]) ?? [],
          topStrongPhonemes: (data.top_strong_phonemes as string[]) ?? [],
        };
      }
    } catch { /* */ }
  }

  // Build fresh and cache
  const snapshot = await buildCurrentSnapshot(userId, childId);
  void saveSnapshot(snapshot); // fire-and-forget
  return snapshot;
}

/** Call this at end of each learning session to refresh report */
export async function refreshWeeklyReport(userId: string, childId = ''): Promise<void> {
  const snapshot = await buildCurrentSnapshot(userId, childId);
  await saveSnapshot(snapshot);
}
