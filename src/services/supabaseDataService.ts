/**
 * SUPABASE DATA SERVICE
 * Centralized helper for Supabase-primary data operations.
 * Pattern: Supabase is source of truth, localStorage is cache.
 */

import { supabase } from '../config/supabase';

// ── Hearts ──────────────────────────────────────────────────────────────────

export interface HeartsRow {
  hearts: number;
  max_hearts: number;
  last_heart_lost_at: string | null;
  is_unlimited: boolean;
}

export async function loadHeartsFromSupabase(userId: string): Promise<HeartsRow | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const settings = (data.settings as Record<string, unknown>) ?? {};
    const hearts = settings.hearts_state as Partial<HeartsRow> | undefined;
    if (!hearts) return null;

    return {
      hearts: hearts.hearts ?? 5,
      max_hearts: hearts.max_hearts ?? 5,
      last_heart_lost_at: hearts.last_heart_lost_at ?? null,
      is_unlimited: hearts.is_unlimited ?? false,
    };
  } catch {
    return null;
  }
}

export async function saveHeartsToSupabase(userId: string, row: HeartsRow): Promise<void> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const current = (data?.settings as Record<string, unknown>) ?? {};
    await supabase.from('users').update({
      settings: { ...current, hearts_state: row },
    }).eq('id', userId);
  } catch {
    // Queue for retry — localStorage is still the cache
  }
}

// ── Game Scores ─────────────────────────────────────────────────────────────

export async function loadBestScoreFromSupabase(
  userId: string,
  gameType: string,
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('score')
      .eq('user_id', userId)
      .eq('game_id', gameType)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data.score;
  } catch {
    return null;
  }
}

export async function saveBestScoreToSupabase(
  userId: string,
  gameType: string,
  score: number,
): Promise<void> {
  try {
    // Insert a new score entry (game_scores is append-only for history)
    await supabase.from('game_scores').insert({
      user_id: userId,
      game_id: gameType,
      score,
    });
  } catch {
    // Silent fail — localStorage cache is still valid
  }
}

// ── Story Completion ────────────────────────────────────────────────────────

export async function loadStoryCompletionFromSupabase(
  userId: string,
  storyId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_type', 'story_completed')
      .eq('activity_name', storyId)
      .limit(1)
      .maybeSingle();

    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

export async function saveStoryCompletionToSupabase(
  userId: string,
  storyId: string,
): Promise<void> {
  try {
    // Check if already recorded
    const { data: existing } = await supabase
      .from('user_activities')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_type', 'story_completed')
      .eq('activity_name', storyId)
      .limit(1)
      .maybeSingle();

    if (existing) return; // Already recorded

    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: 'story_completed',
      activity_name: storyId,
      xp_earned: 10,
      metadata: { completed_at: new Date().toISOString() },
    });
  } catch {
    // Silent fail
  }
}

// ── Phonics Mastery (mastered sounds list) ──────────────────────────────────

export async function loadMasteredSoundsFromSupabase(userId: string): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const settings = (data.settings as Record<string, unknown>) ?? {};
    const sounds = settings.mastered_sounds;
    if (Array.isArray(sounds)) return sounds as string[];
    return null;
  } catch {
    return null;
  }
}

export async function saveMasteredSoundsToSupabase(
  userId: string,
  sounds: string[],
): Promise<void> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const current = (data?.settings as Record<string, unknown>) ?? {};
    await supabase.from('users').update({
      settings: { ...current, mastered_sounds: sounds },
    }).eq('id', userId);
  } catch {
    // Silent fail
  }
}

// ── Spaced Repetition ───────────────────────────────────────────────────────

export interface SRWordProgress {
  wordId: string;
  firstSeen: string;
  lastReviewed: string;
  correctCount: number;
  incorrectCount: number;
  confidenceScore: number;
  interval: number;
  nextReview: string;
  easeFactor: number;
}

export async function loadSRFromSupabase(userId: string): Promise<SRWordProgress[] | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const settings = (data?.settings as Record<string, unknown>) ?? {};
    const sr = settings.spaced_repetition;
    if (Array.isArray(sr)) return sr as SRWordProgress[];
    // Handle object format
    if (sr && typeof sr === 'object') {
      return Object.values(sr as Record<string, SRWordProgress>);
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveSRToSupabase(
  userId: string,
  entries: SRWordProgress[],
): Promise<void> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const current = (data?.settings as Record<string, unknown>) ?? {};
    await supabase.from('users').update({
      settings: {
        ...current,
        spaced_repetition: entries,
        sr_last_synced: new Date().toISOString(),
      },
    }).eq('id', userId);
  } catch {
    // Silent fail
  }
}

// ── Avatar ──────────────────────────────────────────────────────────────────

export interface AvatarConfig {
  color: string;
  hat: string | null;
  accessory: string | null;
  background: string | null;
  frame: string | null;
}

export async function loadAvatarFromSupabase(userId: string): Promise<AvatarConfig | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_emoji')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data || !data.avatar_emoji) return null;

    // avatar_emoji stores JSON string of AvatarConfig
    try {
      return JSON.parse(data.avatar_emoji) as AvatarConfig;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export async function saveAvatarToSupabase(
  userId: string,
  config: AvatarConfig,
): Promise<void> {
  try {
    await supabase.from('profiles').update({
      avatar_emoji: JSON.stringify(config),
      updated_at: new Date().toISOString(),
    }).eq('id', userId);
  } catch {
    // Silent fail
  }
}

// ── Learned Words ───────────────────────────────────────────────────────────

export async function loadLearnedWordsFromSupabase(userId: string): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const settings = (data.settings as Record<string, unknown>) ?? {};
    const words = settings.learnedWords;
    if (Array.isArray(words)) return words as string[];
    return null;
  } catch {
    return null;
  }
}

export async function saveLearnedWordsToSupabase(
  userId: string,
  words: string[],
): Promise<void> {
  try {
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const current = (data?.settings as Record<string, unknown>) ?? {};
    await supabase.from('users').update({
      settings: { ...current, learnedWords: words },
    }).eq('id', userId);

    // Also update profiles.words_learned count
    await supabase.from('profiles').update({
      words_learned: words.length,
      updated_at: new Date().toISOString(),
    }).eq('id', userId);
  } catch {
    // Silent fail
  }
}

// ── Daily Lesson Completion ─────────────────────────────────────────────────

export async function saveDailyLessonCompletionToSupabase(
  userId: string,
  date: string,
  score: number,
  newWordsCount: number,
  reviewWordsCount: number,
): Promise<void> {
  try {
    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: 'daily_lesson',
      activity_name: `daily_${date}`,
      xp_earned: Math.round(score / 10),
      metadata: {
        date,
        score,
        new_words_count: newWordsCount,
        review_words_count: reviewWordsCount,
        completed_at: new Date().toISOString(),
      },
    });
  } catch {
    // Silent fail
  }
}

export async function isDailyLessonCompletedInSupabase(
  userId: string,
  date: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('user_activities')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_type', 'daily_lesson')
      .eq('activity_name', `daily_${date}`)
      .limit(1)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}
