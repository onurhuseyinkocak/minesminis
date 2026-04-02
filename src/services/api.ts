/**
 * MinesMinis Unified API Service Layer
 *
 * SINGLE entry point for ALL data access in the app.
 * Every component reads/writes data through `api.*` — never import supabase directly.
 */

import { supabase } from '../config/supabase';

// ════════════════════════════════════════════════════════════════════════════════
// Types — Content (read-only tables)
// ════════════════════════════════════════════════════════════════════════════════

/** A single phonics sound (e.g. /a/, /sh/, /igh/) */
export interface PhonicsSound {
  id: string;
  sound: string;
  grapheme: string;
  group: number;
  keywords: string[];
  example_words: string[];
  audio_url: string | null;
  image_url: string | null;
  order: number;
  created_at: string;
}

/** A vocabulary word with translation and audio */
export interface Word {
  id: string;
  word: string;
  level: string;
  category: string;
  emoji: string;
  turkish: string;
  example: string | null;
  grade: number | null;
  image_url: string | null;
  word_audio_url: string | null;
  example_audio_url: string | null;
  phonics_group?: number;
  is_sight_word?: boolean;
  is_decodable?: boolean;
  age_group_min?: number;
  created_at: string;
}

/** A curriculum phase (e.g. Phase 2, Phase 3) */
export interface CurriculumPhase {
  id: string;
  name: string;
  order: number;
  description: string;
  sounds: string[];
  created_at: string;
}

/** A unit within a curriculum phase */
export interface CurriculumUnit {
  id: string;
  phase_id: string;
  name: string;
  order: number;
  objectives: string[];
  created_at: string;
}

/** An activity within a curriculum unit */
export interface CurriculumActivity {
  id: string;
  unit_id: string;
  type: string;
  title: string;
  order: number;
  config: Record<string, unknown>;
  created_at: string;
}

/** A themed world (adventure or curriculum) */
export interface World {
  id: string;
  order: number;
  name: string;
  name_en: string;
  emoji: string;
  color: string;
  description: string;
  age_range: string;
  lesson_count: number;
  type?: 'adventure' | 'curriculum';
  created_at: string;
}

/** A lesson within a world */
export interface Lesson {
  id: string;
  world_id: string;
  order: number;
  title: string;
  title_tr: string;
  objective: string;
  vocabulary_words: unknown[];
  activities: unknown[];
  duration: number;
  status: string;
  created_at: string;
}

/** A decodable story for guided reading */
export interface DecodableStory {
  id: string;
  title: string;
  title_tr: string | null;
  summary: string | null;
  summary_tr: string | null;
  moral: string | null;
  moral_tr: string | null;
  cover_scene: string | null;
  target_age: number[];
  vocabulary: unknown[];
  scenes: unknown[];
  phonics_group?: number;
  topic?: string;
  age_group_min?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/** A node in the adventure story graph */
export interface StoryNode {
  id: string;
  story_id: string;
  scene_order: number;
  text: string;
  text_tr: string;
  location: string;
  characters: string[];
  mood: string;
  camera_angle: string;
  sound_effect: string | null;
  animation_cue: string | null;
  vocabulary: unknown[];
  choices: unknown[];
  tags?: string[];
  world_id?: string;
  created_at: string;
}

/** An exercise (blending, segmenting, spelling, etc.) */
export interface Exercise {
  id: string;
  type: string;
  prompt: string;
  answer: string;
  options: string[];
  difficulty: number;
  phonics_group: number;
  image_url: string | null;
  audio_url: string | null;
  age_group_min?: number;
  created_at: string;
}

/** A phonetic trap (common confusion pair) */
export interface PhoneticTrap {
  id: string;
  sound_a: string;
  sound_b: string;
  trap_words: string[];
  difficulty: number;
  created_at: string;
}

/** A phonics song */
export interface Song {
  id: string;
  title: string;
  group: number;
  lyrics: string;
  audio_url: string | null;
  video_url: string | null;
  duration: number;
  created_at: string;
}

/** A curated video */
export interface Video {
  id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: string | null;
  category: string;
  channel_name: string | null;
  grade: string;
  is_popular: boolean;
  added_by: string | null;
  curated_by: string | null;
  tags: string[];
  likes: number;
  views: number;
  created_at: string;
}

/** A downloadable worksheet */
export interface Worksheet {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  uploaded_by: string | null;
  visibility: string;
  tags: string[];
  downloads: number;
  completions: number;
  rating: number;
  thumbnail_url: string;
  source: string;
  created_at: string;
}

/** An external game link */
export interface ExternalGame {
  id: string;
  title: string;
  url: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  thumbnail_url: string | null;
  description: string | null;
  added_by: string | null;
  target_audience: string | null;
  plays: number;
  rating: number;
  created_at: string;
}

/** A mascot character */
export interface Mascot {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  unlock_condition: string;
  image_url: string | null;
  created_at: string;
}

/** An avatar customization item */
export interface AvatarItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  cost: number;
  rarity: string;
  created_at: string;
}

/** A badge definition */
export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  created_at: string;
}

/** A garden plant definition */
export interface GardenPlant {
  id: string;
  name: string;
  sound_id: string;
  stages: string[];
  image_urls: string[];
  created_at: string;
}

/** A letter formation path for tracing */
export interface LetterPath {
  id: string;
  letter: string;
  path_data: string;
  strokes: unknown[];
  created_at: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// Types — User Data (read/write, scoped to current user)
// ════════════════════════════════════════════════════════════════════════════════

/** General progress record for any content type */
export interface UserProgress {
  id: string;
  user_id: string;
  challenge_id: string | null;
  worksheet_id: string | null;
  game_id: string | null;
  video_id: string | null;
  status: string;
  score: number | null;
  completed_at: string | null;
  created_at: string;
}

/** Per-sound phonics mastery */
export interface UserPhonics {
  id: string;
  user_id: string;
  sound_id: string;
  mastery: number;
  attempts: number;
  last_practiced: string | null;
  created_at: string;
}

/** Per-word learning progress */
export interface UserWordProgress {
  id: string;
  user_id: string;
  word_id: string;
  mastery: number;
  times_seen: number;
  times_correct: number;
  last_seen: string | null;
  created_at: string;
}

/** The user's profile */
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_emoji: string | null;
  is_premium: boolean;
  premium_until: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  grade: string | null;
  xp: number;
  level: number;
  streak_days: number;
  badges: string[];
  last_login: string | null;
  words_learned: number;
  games_played: number;
  videos_watched: number;
  worksheets_completed: number;
  last_daily_claim: string | null;
}

/** Gamification state for the current user */
export interface UserGamification {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  streak_days: number;
  coins: number;
  avatar_items: string[];
  equipped_items: Record<string, string>;
  created_at: string;
  updated_at: string;
}

/** A badge earned by the user */
export interface UserBadge {
  id: string;
  user_id: string;
  achievement_id: string;
  created_at: string;
}

/** Adventure story progress */
export interface UserStoryProgress {
  id: string;
  user_id: string;
  character_name: string;
  mascot_id: string;
  current_world: string;
  current_node_id: string;
  traits: Record<string, unknown>;
  inventory: unknown[];
  visited_node_ids: unknown[];
  total_xp: number;
  choice_history: unknown[];
  session_count: number;
  created_at: string;
  updated_at: string;
}

/** A plant in the user's garden */
export interface UserGarden {
  id: string;
  user_id: string;
  sound_id: string;
  stage: string;
  mastery: number;
  water_drops: number;
  last_watered: string | null;
  created_at: string;
}

/** A logged activity */
export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_name: string;
  xp_earned: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** A friend relationship */
export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
  friend_profile?: UserProfile;
}

/** A leaderboard row */
export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_emoji: string | null;
  xp: number;
  level: number;
  rank: number;
}

/** A classroom */
export interface Classroom {
  id: string;
  name: string;
  code: string;
  teacher_id: string;
  grade: string;
  created_at: string;
}

/** A homework assignment */
export interface Homework {
  id: string;
  classroom_id: string;
  title: string;
  description: string;
  due_date: string;
  activity_type: string;
  activity_config: Record<string, unknown>;
  created_at: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════════════════

/** Get the current authenticated user's ID, or null if not signed in */
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Require authentication — throws if not signed in */
async function requireAuth(): Promise<string> {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error('Not authenticated');
  return uid;
}

// ════════════════════════════════════════════════════════════════════════════════
// API — the single export
// ════════════════════════════════════════════════════════════════════════════════

export const api = {

  // ──────────────────────────────────────────────────────────────────────────────
  // Content (read-only)
  // ──────────────────────────────────────────────────────────────────────────────

  phonics: {
    /** Fetch all phonics sounds ordered by group then order */
    async getSounds(): Promise<PhonicsSound[]> {
      try {
        // TODO: populate with real table — using 'phonics_sounds' as placeholder
        const { data, error } = await supabase
          .from('phonics_sounds')
          .select('*')
          .order('group', { ascending: true })
          .order('order', { ascending: true });
        if (error) throw error;
        return (data as PhonicsSound[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch sounds belonging to a specific phonics group */
    async getSoundsByGroup(group: number): Promise<PhonicsSound[]> {
      try {
        const { data, error } = await supabase
          .from('phonics_sounds')
          .select('*')
          .eq('group', group)
          .order('order', { ascending: true });
        if (error) throw error;
        return (data as PhonicsSound[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch a single sound by ID */
    async getSound(id: string): Promise<PhonicsSound | null> {
      try {
        const { data, error } = await supabase
          .from('phonics_sounds')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data as PhonicsSound;
      } catch {
        return null;
      }
    },
  },

  words: {
    /** Fetch all words with optional filters */
    async getAll(filters?: { group?: number; level?: string; category?: string; ageGroup?: number }): Promise<Word[]> {
      try {
        let query = supabase.from('words').select('*');
        if (filters?.level) query = query.eq('level', filters.level);
        if (filters?.category) query = query.eq('category', filters.category);
        if (filters?.group) query = query.eq('phonics_group', filters.group);
        if (filters?.ageGroup) query = query.lte('age_group_min', filters.ageGroup);
        const { data, error } = await query.order('word', { ascending: true });
        if (error) throw error;
        return (data as Word[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch a single word by ID */
    async getById(id: string): Promise<Word | null> {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data as Word;
      } catch {
        return null;
      }
    },

    /** Fetch words associated with a phonics group */
    async getByPhonicsGroup(group: number): Promise<Word[]> {
      try {
        // TODO: populate with real column name for phonics group linkage
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .eq('phonics_group', group)
          .order('word', { ascending: true });
        if (error) throw error;
        return (data as Word[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch high-frequency sight words */
    async getSightWords(): Promise<Word[]> {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .eq('is_sight_word', true)
          .order('word', { ascending: true });
        if (error) throw error;
        return (data as Word[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch decodable words up to a given phonics group */
    async getDecodableWords(maxGroup: number): Promise<Word[]> {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .eq('is_decodable', true)
          .lte('phonics_group', maxGroup)
          .order('phonics_group', { ascending: true });
        if (error) throw error;
        return (data as Word[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Full-text search on words */
    async search(query: string): Promise<Word[]> {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .or(`word.ilike.%${query}%,turkish.ilike.%${query}%`)
          .limit(50);
        if (error) throw error;
        return (data as Word[]) ?? [];
      } catch {
        return [];
      }
    },
  },

  curriculum: {
    /** Fetch all curriculum phases in order */
    async getPhases(): Promise<CurriculumPhase[]> {
      try {
        // TODO: populate with real table name
        const { data, error } = await supabase
          .from('curriculum_phases')
          .select('*')
          .order('order', { ascending: true });
        if (error) throw error;
        return (data as CurriculumPhase[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch units within a curriculum phase */
    async getUnits(phaseId: string): Promise<CurriculumUnit[]> {
      try {
        const { data, error } = await supabase
          .from('curriculum_units')
          .select('*')
          .eq('phase_id', phaseId)
          .order('order', { ascending: true });
        if (error) throw error;
        return (data as CurriculumUnit[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch activities within a curriculum unit */
    async getActivities(unitId: string): Promise<CurriculumActivity[]> {
      try {
        const { data, error } = await supabase
          .from('curriculum_activities')
          .select('*')
          .eq('unit_id', unitId)
          .order('order', { ascending: true });
        if (error) throw error;
        return (data as CurriculumActivity[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch themed worlds, optionally filtered by type */
    async getWorlds(type?: 'adventure' | 'curriculum'): Promise<World[]> {
      try {
        let query = supabase.from('curriculum_worlds').select('*');
        if (type) query = query.eq('type', type);
        const { data, error } = await query.order('order', { ascending: true });
        if (error) throw error;
        return (data as World[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch lessons within a world */
    async getLessons(worldId: string): Promise<Lesson[]> {
      try {
        const { data, error } = await supabase
          .from('curriculum_lessons')
          .select('*')
          .eq('world_id', worldId)
          .order('order', { ascending: true });
        if (error) throw error;
        return (data as Lesson[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch a single lesson by ID */
    async getLesson(lessonId: string): Promise<Lesson | null> {
      try {
        const { data, error } = await supabase
          .from('curriculum_lessons')
          .select('*')
          .eq('id', lessonId)
          .single();
        if (error) throw error;
        return data as Lesson;
      } catch {
        return null;
      }
    },
  },

  stories: {
    /** Fetch decodable stories with optional filters */
    async getDecodable(filters?: { group?: number; topic?: string; ageGroup?: number }): Promise<DecodableStory[]> {
      try {
        let query = supabase.from('stories').select('*');
        if (filters?.group) query = query.eq('phonics_group', filters.group);
        if (filters?.topic) query = query.eq('topic', filters.topic);
        if (filters?.ageGroup) query = query.lte('age_group_min', filters.ageGroup);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return (data as DecodableStory[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch a single decodable story by ID */
    async getDecodableById(id: string): Promise<DecodableStory | null> {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data as DecodableStory;
      } catch {
        return null;
      }
    },

    /** Fetch adventure story nodes for a world */
    async getAdventureNodes(worldId: string): Promise<StoryNode[]> {
      try {
        // TODO: populate with real join — story_scenes via stories.world_id
        const { data, error } = await supabase
          .from('story_scenes')
          .select('*')
          .eq('world_id', worldId)
          .order('scene_order', { ascending: true });
        if (error) throw error;
        return (data as StoryNode[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Find a story node by matching tags */
    async getNodeByTags(tags: string[]): Promise<StoryNode | null> {
      try {
        // TODO: populate with real tag matching — using contains for array overlap
        const { data, error } = await supabase
          .from('story_scenes')
          .select('*')
          .contains('tags', tags)
          .limit(1)
          .single();
        if (error) throw error;
        return data as StoryNode;
      } catch {
        return null;
      }
    },
  },

  exercises: {
    /** Fetch exercises by type with optional group/difficulty/age filters */
    async getByType(type: string, filters?: { group?: number; difficulty?: number; ageGroup?: number }): Promise<Exercise[]> {
      try {
        let query = supabase.from('exercises').select('*').eq('type', type);
        if (filters?.group) query = query.eq('phonics_group', filters.group);
        if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
        if (filters?.ageGroup) query = query.lte('age_group_min', filters.ageGroup);
        const { data, error } = await query.order('difficulty', { ascending: true });
        if (error) throw error;
        return (data as Exercise[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch a single exercise by ID */
    async getById(id: string): Promise<Exercise | null> {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data as Exercise;
      } catch {
        return null;
      }
    },

    /** Fetch phonetic traps (confusable sound pairs) */
    async getPhoneticTraps(): Promise<PhoneticTrap[]> {
      try {
        const { data, error } = await supabase
          .from('phonetic_traps')
          .select('*')
          .order('difficulty', { ascending: true });
        if (error) throw error;
        return (data as PhoneticTrap[]) ?? [];
      } catch {
        return [];
      }
    },
  },

  songs: {
    /** Fetch all phonics songs */
    async getAll(): Promise<Song[]> {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('group', { ascending: true });
        if (error) throw error;
        return (data as Song[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch the song for a specific phonics group */
    async getByGroup(group: number): Promise<Song | null> {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .eq('group', group)
          .single();
        if (error) throw error;
        return data as Song;
      } catch {
        return null;
      }
    },
  },

  media: {
    /** Fetch curated videos with optional filters */
    async getVideos(filters?: { type?: string; grade?: number }): Promise<Video[]> {
      try {
        let query = supabase.from('videos').select('*');
        if (filters?.type) query = query.eq('category', filters.type);
        if (filters?.grade) query = query.eq('grade', String(filters.grade));
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return (data as Video[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch worksheets with optional filters */
    async getWorksheets(filters?: { category?: string; grade?: number }): Promise<Worksheet[]> {
      try {
        let query = supabase.from('worksheets').select('*');
        if (filters?.category) query = query.eq('subject', filters.category);
        if (filters?.grade) query = query.eq('grade', String(filters.grade));
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return (data as Worksheet[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch external educational games with optional filters */
    async getExternalGames(filters?: { grade?: number }): Promise<ExternalGame[]> {
      try {
        let query = supabase.from('games').select('*');
        if (filters?.grade) query = query.eq('target_audience', String(filters.grade));
        const { data, error } = await query.order('rating', { ascending: false });
        if (error) throw error;
        return (data as ExternalGame[]) ?? [];
      } catch {
        return [];
      }
    },
  },

  gamification: {
    /** Fetch all available mascots */
    async getMascots(): Promise<Mascot[]> {
      try {
        // TODO: populate with real table name
        const { data, error } = await supabase
          .from('mascots')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        return (data as Mascot[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch avatar customization items, optionally by category */
    async getAvatarItems(category?: string): Promise<AvatarItem[]> {
      try {
        let query = supabase.from('avatar_items').select('*');
        if (category) query = query.eq('category', category);
        const { data, error } = await query.order('cost', { ascending: true });
        if (error) throw error;
        return (data as AvatarItem[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch all badge definitions */
    async getBadges(): Promise<Badge[]> {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        return (data as Badge[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch all garden plant definitions */
    async getGardenPlants(): Promise<GardenPlant[]> {
      try {
        // TODO: populate with real table name
        const { data, error } = await supabase
          .from('garden_plant_defs')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        return (data as GardenPlant[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Fetch letter tracing paths */
    async getLetterPaths(): Promise<LetterPath[]> {
      try {
        const { data, error } = await supabase
          .from('letter_paths')
          .select('*')
          .order('letter', { ascending: true });
        if (error) throw error;
        return (data as LetterPath[]) ?? [];
      } catch {
        return [];
      }
    },
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // User Data (read/write, scoped to current user)
  // ──────────────────────────────────────────────────────────────────────────────

  userProgress: {
    /** Get all progress records for the current user */
    async get(): Promise<UserProgress[]> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data as UserProgress[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Upsert a progress record for the current user */
    async upsert(record: Partial<UserProgress>): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('user_progress')
          .upsert({ ...record, user_id: uid }, { onConflict: 'user_id,challenge_id' });
        if (error) throw error;
      } catch {
        // silent fail — progress sync is non-critical
      }
    },

    /** Get phonics mastery records for the current user */
    async getPhonics(): Promise<UserPhonics[]> {
      try {
        const uid = await requireAuth();
        // TODO: populate with real table name
        const { data, error } = await supabase
          .from('user_phonics')
          .select('*')
          .eq('user_id', uid)
          .order('sound_id', { ascending: true });
        if (error) throw error;
        return (data as UserPhonics[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Upsert phonics mastery for a specific sound */
    async upsertPhonics(soundId: string, record: Partial<UserPhonics>): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('user_phonics')
          .upsert(
            { ...record, user_id: uid, sound_id: soundId },
            { onConflict: 'user_id,sound_id' }
          );
        if (error) throw error;
      } catch {
        // silent fail
      }
    },

    /** Get word-level progress for the current user */
    async getWords(): Promise<UserWordProgress[]> {
      try {
        const uid = await requireAuth();
        // TODO: populate with real table name
        const { data, error } = await supabase
          .from('user_word_progress')
          .select('*')
          .eq('user_id', uid)
          .order('last_seen', { ascending: false });
        if (error) throw error;
        return (data as UserWordProgress[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Upsert word progress for a specific word */
    async upsertWord(wordId: string, record: Partial<UserWordProgress>): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('user_word_progress')
          .upsert(
            { ...record, user_id: uid, word_id: wordId },
            { onConflict: 'user_id,word_id' }
          );
        if (error) throw error;
      } catch {
        // silent fail
      }
    },
  },

  userProfile: {
    /** Get the current user's profile */
    async get(): Promise<UserProfile | null> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();
        if (error) throw error;
        return data as UserProfile;
      } catch {
        return null;
      }
    },

    /** Update the current user's profile */
    async update(updates: Partial<UserProfile>): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', uid);
        if (error) throw error;
      } catch {
        // silent fail
      }
    },
  },

  userGamification: {
    /** Get the current user's gamification state (xp, level, coins, etc.) */
    async get(): Promise<UserGamification | null> {
      try {
        const uid = await requireAuth();
        // TODO: populate with real table — may be merged into profiles
        const { data, error } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', uid)
          .single();
        if (error) throw error;
        return data as UserGamification;
      } catch {
        return null;
      }
    },

    /** Update gamification state */
    async update(updates: Partial<UserGamification>): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('user_gamification')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('user_id', uid);
        if (error) throw error;
      } catch {
        // silent fail
      }
    },

    /** Add XP to the current user (uses RPC for atomic increment) */
    async addXP(amount: number): Promise<void> {
      try {
        const uid = await requireAuth();
        // TODO: create Supabase RPC function 'add_xp' for atomic increment
        const { error } = await supabase.rpc('add_xp', {
          p_user_id: uid,
          p_amount: amount,
        });
        if (error) throw error;
      } catch {
        // Fallback: read-modify-write (not atomic, but works for MVP)
        try {
          const uid = await requireAuth();
          const { data } = await supabase
            .from('profiles')
            .select('xp')
            .eq('id', uid)
            .single();
          if (data) {
            await supabase
              .from('profiles')
              .update({ xp: (data.xp ?? 0) + amount })
              .eq('id', uid);
          }
        } catch {
          // silent fail
        }
      }
    },

    /** Get all badges earned by the current user */
    async getBadges(): Promise<UserBadge[]> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data as UserBadge[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Award a badge to the current user (idempotent) */
    async awardBadge(badgeId: string): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('user_achievements')
          .upsert(
            { user_id: uid, achievement_id: badgeId },
            { onConflict: 'user_id,achievement_id' }
          );
        if (error) throw error;
      } catch {
        // silent fail
      }
    },
  },

  userStory: {
    /** Get the current user's adventure story progress */
    async get(): Promise<UserStoryProgress | null> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('story_progress')
          .select('*')
          .eq('user_id', uid)
          .single();
        if (error) throw error;
        return data as UserStoryProgress;
      } catch {
        return null;
      }
    },

    /** Save or update adventure story progress */
    async save(updates: Partial<UserStoryProgress>): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('story_progress')
          .upsert(
            { ...updates, user_id: uid, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
        if (error) throw error;
      } catch {
        // silent fail
      }
    },
  },

  userGarden: {
    /** Get all plants in the current user's garden */
    async get(): Promise<UserGarden[]> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('garden_plants')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: true });
        if (error) throw error;
        return (data as UserGarden[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Water a plant — increments water_drops and updates last_watered */
    async water(plantId: string): Promise<void> {
      try {
        const uid = await requireAuth();
        // TODO: create Supabase RPC for atomic water increment
        const { data } = await supabase
          .from('garden_plants')
          .select('water_drops')
          .eq('id', plantId)
          .eq('user_id', uid)
          .single();
        if (data) {
          const { error } = await supabase
            .from('garden_plants')
            .update({
              water_drops: (data.water_drops ?? 0) + 1,
              last_watered: new Date().toISOString(),
            })
            .eq('id', plantId)
            .eq('user_id', uid);
          if (error) throw error;
        }
      } catch {
        // silent fail
      }
    },
  },

  activities: {
    /** Log a completed activity for the current user */
    async log(entry: {
      type: string;
      title: string;
      duration: number;
      accuracy: number;
      xp: number;
      metadata?: Record<string, unknown>;
    }): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('user_activities')
          .insert({
            user_id: uid,
            activity_type: entry.type,
            activity_name: entry.title,
            xp_earned: entry.xp,
            metadata: {
              duration: entry.duration,
              accuracy: entry.accuracy,
              ...entry.metadata,
            },
          });
        if (error) throw error;
      } catch {
        // silent fail — activity logging is non-critical
      }
    },

    /** Get recent activities for the current user */
    async getRecent(limit: number = 20): Promise<UserActivity[]> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(limit);
        if (error) throw error;
        return (data as UserActivity[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Get total minutes spent today by the current user */
    async getTodayMinutes(): Promise<number> {
      try {
        const uid = await requireAuth();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const { data, error } = await supabase
          .from('user_activities')
          .select('metadata')
          .eq('user_id', uid)
          .gte('created_at', todayStart.toISOString());
        if (error) throw error;
        if (!data) return 0;
        return data.reduce((sum, row) => {
          const meta = row.metadata as Record<string, unknown>;
          return sum + (typeof meta?.duration === 'number' ? meta.duration : 0);
        }, 0);
      } catch {
        return 0;
      }
    },
  },

  social: {
    /** Get the current user's friend list (accepted only) */
    async getFriends(): Promise<Friend[]> {
      try {
        const uid = await requireAuth();
        const { data, error } = await supabase
          .from('friends')
          .select('*, friend_profile:profiles!friend_id(*)')
          .eq('user_id', uid)
          .eq('status', 'accepted')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data as Friend[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Send a friend request */
    async sendRequest(toUserId: string): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('friends')
          .insert({ user_id: uid, friend_id: toUserId, status: 'pending' });
        if (error) throw error;
      } catch {
        // silent fail
      }
    },

    /** Accept or decline a friend request */
    async respondRequest(requestId: string, accept: boolean): Promise<void> {
      try {
        const uid = await requireAuth();
        if (accept) {
          const { error } = await supabase
            .from('friends')
            .update({ status: 'accepted' })
            .eq('id', requestId)
            .eq('friend_id', uid);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('friends')
            .delete()
            .eq('id', requestId)
            .eq('friend_id', uid);
          if (error) throw error;
        }
      } catch {
        // silent fail
      }
    },

    /** Get leaderboard (weekly or all-time) */
    async getLeaderboard(type: 'weekly' | 'alltime' = 'weekly'): Promise<LeaderboardEntry[]> {
      try {
        const xpColumn = type === 'weekly' ? 'weekly_xp' : 'xp';
        // TODO: use profiles table; weekly_xp may need to be added
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_emoji, xp, level')
          .order(xpColumn, { ascending: false })
          .limit(50);
        if (error) throw error;
        return (data ?? []).map((row, index) => ({
          user_id: row.id as string,
          display_name: row.display_name as string,
          avatar_emoji: row.avatar_emoji as string | null,
          xp: (row as Record<string, unknown>)[xpColumn] as number ?? row.xp as number,
          level: row.level as number,
          rank: index + 1,
        }));
      } catch {
        return [];
      }
    },
  },

  classroom: {
    /** Get the classroom the current user belongs to */
    async getMyClassroom(): Promise<Classroom | null> {
      try {
        const uid = await requireAuth();
        // TODO: populate with real table/join — classroom_members → classrooms
        const { data, error } = await supabase
          .from('classroom_members')
          .select('classroom:classrooms(*)')
          .eq('user_id', uid)
          .single();
        if (error) throw error;
        return (data as unknown as { classroom: Classroom })?.classroom ?? null;
      } catch {
        return null;
      }
    },

    /** Join a classroom by invite code */
    async joinClassroom(code: string): Promise<void> {
      try {
        const uid = await requireAuth();
        // Look up classroom by code
        const { data: classroom, error: lookupError } = await supabase
          .from('classrooms')
          .select('id')
          .eq('code', code)
          .single();
        if (lookupError || !classroom) throw lookupError ?? new Error('Classroom not found');

        const { error } = await supabase
          .from('classroom_members')
          .insert({ user_id: uid, classroom_id: classroom.id });
        if (error) throw error;
      } catch {
        // silent fail
      }
    },

    /** Get homework assignments for the current user's classroom */
    async getHomework(): Promise<Homework[]> {
      try {
        const uid = await requireAuth();
        // TODO: populate with real join path
        const { data: membership } = await supabase
          .from('classroom_members')
          .select('classroom_id')
          .eq('user_id', uid)
          .single();
        if (!membership) return [];

        const { data, error } = await supabase
          .from('homework')
          .select('*')
          .eq('classroom_id', membership.classroom_id)
          .gte('due_date', new Date().toISOString())
          .order('due_date', { ascending: true });
        if (error) throw error;
        return (data as Homework[]) ?? [];
      } catch {
        return [];
      }
    },

    /** Submit a homework assignment */
    async submitHomework(
      homeworkId: string,
      submission: { score: number; metadata?: Record<string, unknown> }
    ): Promise<void> {
      try {
        const uid = await requireAuth();
        const { error } = await supabase
          .from('homework_submissions')
          .upsert(
            {
              user_id: uid,
              homework_id: homeworkId,
              score: submission.score,
              metadata: submission.metadata ?? {},
              submitted_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,homework_id' }
          );
        if (error) throw error;
      } catch {
        // silent fail
      }
    },
  },

  tts: {
    /** Check if TTS audio is cached for the given text */
    async getCached(text: string, _voiceId?: string): Promise<string | null> {
      try {
        // Hash the text for lookup (using the text directly for now)
        const { data, error } = await supabase
          .from('tts_cache')
          .select('audio_url')
          .eq('text', text)
          .limit(1)
          .single();
        if (error) throw error;
        return data?.audio_url ?? null;
      } catch {
        return null;
      }
    },

    /** Cache a TTS audio URL for the given text */
    async cache(text: string, audioUrl: string, _voiceId?: string): Promise<void> {
      try {
        // TODO: add text_hash generation for faster lookups
        const { error } = await supabase
          .from('tts_cache')
          .upsert(
            { text, audio_url: audioUrl, text_hash: text },
            { onConflict: 'text_hash' }
          );
        if (error) throw error;
      } catch {
        // silent fail — caching is non-critical
      }
    },
  },
};

export default api;
