-- ============================================================================
-- MinesMinis — Children's English Learning App
-- Complete Supabase Database Schema
-- Generated: 2026-04-01
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CONTENT TABLES (read-only, admin-managed)
-- ============================================================================

-- 1. phonics_sounds — 42 sounds across 7 groups
CREATE TABLE phonics_sounds (
  id TEXT PRIMARY KEY,
  group_number INT NOT NULL,
  letters TEXT NOT NULL,
  ipa TEXT NOT NULL,
  display_name TEXT NOT NULL,
  display_name_tr TEXT NOT NULL,
  action_text TEXT,
  action_text_tr TEXT,
  story_text TEXT,
  story_text_tr TEXT,
  turkish_note TEXT,
  keywords TEXT[] DEFAULT '{}',
  blendable_words TEXT[] DEFAULT '{}',
  audio_url TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_phonics_sounds_group ON phonics_sounds(group_number);
CREATE INDEX idx_phonics_sounds_sort ON phonics_sounds(sort_order);

-- 2. words — All vocabulary words (500+)
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  english TEXT NOT NULL,
  turkish TEXT NOT NULL,
  emoji TEXT,
  phonics_group INT,
  phonics_sound_id TEXT REFERENCES phonics_sounds(id) ON DELETE SET NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  part_of_speech TEXT,
  phonetic_ipa TEXT,
  example_en TEXT,
  example_tr TEXT,
  image_url TEXT,
  audio_url TEXT,
  example_audio_url TEXT,
  frequency INT CHECK (frequency BETWEEN 1 AND 10),
  is_sight_word BOOLEAN NOT NULL DEFAULT FALSE,
  is_decodable BOOLEAN NOT NULL DEFAULT FALSE,
  turkish_trap TEXT,
  confusing_with TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_words_phonics_group ON words(phonics_group);
CREATE INDEX idx_words_phonics_sound ON words(phonics_sound_id);
CREATE INDEX idx_words_level ON words(level);
CREATE INDEX idx_words_category ON words(category);
CREATE INDEX idx_words_frequency ON words(frequency);
CREATE INDEX idx_words_sight_word ON words(is_sight_word) WHERE is_sight_word = TRUE;

-- 3. curriculum_phases — 4 learning phases
CREATE TABLE curriculum_phases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  age_min FLOAT NOT NULL,
  age_max FLOAT NOT NULL,
  description TEXT,
  description_tr TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_curriculum_phases_sort ON curriculum_phases(sort_order);

-- 4. curriculum_units — Units within phases
CREATE TABLE curriculum_units (
  id TEXT PRIMARY KEY,
  phase_id TEXT NOT NULL REFERENCES curriculum_phases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description TEXT,
  description_tr TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_curriculum_units_phase ON curriculum_units(phase_id);
CREATE INDEX idx_curriculum_units_sort ON curriculum_units(sort_order);

-- 5. curriculum_activities — Activities within units
CREATE TABLE curriculum_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id TEXT NOT NULL REFERENCES curriculum_units(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  target_sounds TEXT[] DEFAULT '{}',
  target_words TEXT[] DEFAULT '{}',
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 3) DEFAULT 1,
  duration_minutes INT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_curriculum_activities_unit ON curriculum_activities(unit_id);
CREATE INDEX idx_curriculum_activities_type ON curriculum_activities(activity_type);
CREATE INDEX idx_curriculum_activities_sort ON curriculum_activities(sort_order);

-- 6. worlds — Adventure + curriculum worlds
CREATE TABLE worlds (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('adventure', 'curriculum')),
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description TEXT,
  description_tr TEXT,
  emoji TEXT,
  color TEXT,
  gradient TEXT,
  icon_url TEXT,
  background_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_worlds_type ON worlds(type);
CREATE INDEX idx_worlds_sort ON worlds(sort_order);
CREATE INDEX idx_worlds_active ON worlds(is_active) WHERE is_active = TRUE;

-- 7. lessons — Lessons within curriculum worlds
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  type TEXT NOT NULL,
  activities JSONB DEFAULT '[]',
  vocabulary_word_ids UUID[] DEFAULT '{}',
  difficulty INT NOT NULL DEFAULT 1,
  xp_reward INT NOT NULL DEFAULT 10,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_world ON lessons(world_id);
CREATE INDEX idx_lessons_type ON lessons(type);
CREATE INDEX idx_lessons_sort ON lessons(sort_order);

-- 8. stories_decodable — 50 phonics stories
CREATE TABLE stories_decodable (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  phonics_group INT NOT NULL,
  topic TEXT,
  mascot_id TEXT,
  scenes JSONB NOT NULL DEFAULT '[]',
  word_count INT NOT NULL DEFAULT 0,
  decodability_score INT CHECK (decodability_score BETWEEN 0 AND 100),
  comprehension_question TEXT,
  comprehension_question_tr TEXT,
  comprehension_answers TEXT[] DEFAULT '{}',
  comprehension_answers_tr TEXT[] DEFAULT '{}',
  correct_answer_index INT,
  cover_image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stories_decodable_group ON stories_decodable(phonics_group);
CREATE INDEX idx_stories_decodable_sort ON stories_decodable(sort_order);

-- 9. story_nodes — Adventure story nodes (100+)
CREATE TABLE story_nodes (
  id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  location TEXT,
  background TEXT,
  text TEXT NOT NULL,
  text_tr TEXT NOT NULL,
  npc_id TEXT,
  music TEXT,
  sfx TEXT[] DEFAULT '{}',
  choices JSONB NOT NULL DEFAULT '[]',
  vocabulary JSONB DEFAULT '[]',
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_story_nodes_world ON story_nodes(world_id);
CREATE INDEX idx_story_nodes_tags ON story_nodes USING GIN(tags);

-- 10. exercises — All exercise content
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 3) DEFAULT 1,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  target_sounds TEXT[] DEFAULT '{}',
  target_words TEXT[] DEFAULT '{}',
  phonics_group INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_phonics_group ON exercises(phonics_group);
CREATE INDEX idx_exercises_sort ON exercises(sort_order);
CREATE INDEX idx_exercises_target_sounds ON exercises USING GIN(target_sounds);

-- 11. songs — Phonics songs
CREATE TABLE songs (
  id TEXT PRIMARY KEY,
  phonics_group INT NOT NULL,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  emoji TEXT,
  tempo TEXT,
  style TEXT,
  lyrics JSONB NOT NULL DEFAULT '[]',
  audio_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_songs_phonics_group ON songs(phonics_group);
CREATE INDEX idx_songs_sort ON songs(sort_order);

-- 12. videos — Educational videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('song', 'lesson', 'story')),
  grade INT,
  thumbnail_url TEXT,
  duration_seconds INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_videos_type ON videos(type);
CREATE INDEX idx_videos_grade ON videos(grade);
CREATE INDEX idx_videos_sort ON videos(sort_order);

-- 13. worksheets — Downloadable worksheets
CREATE TABLE worksheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  category TEXT NOT NULL,
  source TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  grade INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_worksheets_category ON worksheets(category);
CREATE INDEX idx_worksheets_grade ON worksheets(grade);
CREATE INDEX idx_worksheets_sort ON worksheets(sort_order);

-- 14. games_external — Wordwall and other external games
CREATE TABLE games_external (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'wordwall',
  external_id TEXT,
  type TEXT,
  grade INT,
  thumbnail_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_external_platform ON games_external(platform);
CREATE INDEX idx_games_external_grade ON games_external(grade);
CREATE INDEX idx_games_external_sort ON games_external(sort_order);

-- 15. turkish_phonetic_traps — 8 phonetic interference exercises
CREATE TABLE turkish_phonetic_traps (
  id TEXT PRIMARY KEY,
  trap_name TEXT NOT NULL,
  trap_name_tr TEXT NOT NULL,
  target_sound_ipa TEXT NOT NULL,
  error_sound_ipa TEXT NOT NULL,
  description TEXT,
  description_tr TEXT,
  mouth_position TEXT,
  mouth_position_tr TEXT,
  minimal_pairs JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 3) DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_turkish_phonetic_traps_sort ON turkish_phonetic_traps(sort_order);

-- 16. mascots — Available mascots
CREATE TABLE mascots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  emoji TEXT,
  unlock_type TEXT NOT NULL DEFAULT 'free',
  unlock_value INT NOT NULL DEFAULT 0,
  lottie_idle_url TEXT,
  lottie_talk_url TEXT,
  lottie_happy_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mascots_sort ON mascots(sort_order);

-- 17. avatar_items — Avatar customization items
CREATE TABLE avatar_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('hat', 'color', 'accessory', 'background', 'frame')),
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  value TEXT NOT NULL,
  unlock_type TEXT NOT NULL DEFAULT 'free',
  unlock_value INT NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_avatar_items_category ON avatar_items(category);
CREATE INDEX idx_avatar_items_sort ON avatar_items(sort_order);
CREATE INDEX idx_avatar_items_premium ON avatar_items(is_premium) WHERE is_premium = TRUE;

-- 18. garden_plants — Available garden plants
CREATE TABLE garden_plants (
  id TEXT PRIMARY KEY,
  sound_id TEXT REFERENCES phonics_sounds(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  stages JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_garden_plants_sound ON garden_plants(sound_id);
CREATE INDEX idx_garden_plants_sort ON garden_plants(sort_order);

-- 19. badges — Achievement badges
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description TEXT,
  description_tr TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_sort ON badges(sort_order);

-- 20. letter_paths — SVG stroke data for letter tracing
CREATE TABLE letter_paths (
  id TEXT PRIMARY KEY, -- the letter itself
  paths JSONB NOT NULL DEFAULT '[]',
  stroke_order INT[] DEFAULT '{}',
  guidelines JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- USER DATA TABLES
-- ============================================================================

-- 21. user_profiles — Extended user profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  age_group TEXT,
  avatar JSONB DEFAULT '{}',
  mascot_id TEXT REFERENCES mascots(id) ON DELETE SET NULL,
  settings JSONB DEFAULT '{}',
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher')) DEFAULT 'student',
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_premium ON user_profiles(is_premium) WHERE is_premium = TRUE;

-- 22. user_progress — Learning progress per user
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_id TEXT REFERENCES curriculum_phases(id) ON DELETE SET NULL,
  unit_id TEXT REFERENCES curriculum_units(id) ON DELETE SET NULL,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  score INT NOT NULL DEFAULT 0,
  stars INT NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  completed_at TIMESTAMPTZ,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, completed) WHERE completed = TRUE;

-- 23. user_phonics_mastery — Per-sound mastery
CREATE TABLE user_phonics_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sound_id TEXT NOT NULL REFERENCES phonics_sounds(id) ON DELETE CASCADE,
  mastery INT NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  attempts INT NOT NULL DEFAULT 0,
  correct_attempts INT NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, sound_id)
);

CREATE INDEX idx_user_phonics_mastery_user ON user_phonics_mastery(user_id);
CREATE INDEX idx_user_phonics_mastery_sound ON user_phonics_mastery(sound_id);
CREATE INDEX idx_user_phonics_mastery_review ON user_phonics_mastery(user_id, next_review);

-- 24. user_word_progress — Per-word learning state
CREATE TABLE user_word_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  mastery INT NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  times_seen INT NOT NULL DEFAULT 0,
  times_correct INT NOT NULL DEFAULT 0,
  last_seen TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  srs_interval_days INT NOT NULL DEFAULT 1,
  srs_ease_factor FLOAT NOT NULL DEFAULT 2.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE INDEX idx_user_word_progress_user ON user_word_progress(user_id);
CREATE INDEX idx_user_word_progress_word ON user_word_progress(word_id);
CREATE INDEX idx_user_word_progress_review ON user_word_progress(user_id, next_review);
CREATE INDEX idx_user_word_progress_mastery ON user_word_progress(user_id, mastery);

-- 25. user_activities — Activity log
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT,
  duration_seconds INT,
  accuracy FLOAT CHECK (accuracy BETWEEN 0 AND 1),
  xp_earned INT NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(user_id, activity_type);
CREATE INDEX idx_user_activities_created ON user_activities(user_id, created_at DESC);

-- 26. user_story_progress — Adventure story state
CREATE TABLE user_story_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name TEXT,
  mascot_id TEXT REFERENCES mascots(id) ON DELETE SET NULL,
  current_world TEXT REFERENCES worlds(id) ON DELETE SET NULL,
  current_node_id TEXT,
  traits JSONB DEFAULT '{}',
  inventory TEXT[] DEFAULT '{}',
  visited_node_ids TEXT[] DEFAULT '{}',
  total_xp INT NOT NULL DEFAULT 0,
  choice_history JSONB DEFAULT '[]',
  session_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_story_progress_user ON user_story_progress(user_id);

-- 27. user_garden — User's garden state
CREATE TABLE user_garden (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id TEXT NOT NULL REFERENCES garden_plants(id) ON DELETE CASCADE,
  stage INT NOT NULL DEFAULT 0,
  water_drops INT NOT NULL DEFAULT 0,
  last_watered TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, plant_id)
);

CREATE INDEX idx_user_garden_user ON user_garden(user_id);

-- 28. user_badges — Earned badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- 29. user_gamification — XP, streaks, daily rewards
CREATE TABLE user_gamification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  weekly_xp INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  last_login_date DATE,
  last_daily_claim TIMESTAMPTZ,
  last_weekly_reset DATE,
  words_learned INT NOT NULL DEFAULT 0,
  games_played INT NOT NULL DEFAULT 0,
  videos_watched INT NOT NULL DEFAULT 0,
  worksheets_completed INT NOT NULL DEFAULT 0,
  daily_challenges_completed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_gamification_user ON user_gamification(user_id);
CREATE INDEX idx_user_gamification_xp ON user_gamification(xp DESC);
CREATE INDEX idx_user_gamification_level ON user_gamification(level);

-- 30. classrooms — Teacher classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade_level INT,
  join_code TEXT NOT NULL UNIQUE,
  phonics_group_assigned INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_classrooms_join_code ON classrooms(join_code);

-- 31. classroom_students — Student enrollment
CREATE TABLE classroom_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(classroom_id, student_id)
);

CREATE INDEX idx_classroom_students_classroom ON classroom_students(classroom_id);
CREATE INDEX idx_classroom_students_student ON classroom_students(student_id);

-- 32. parent_children — Parent-child links
CREATE TABLE parent_children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'parent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

CREATE INDEX idx_parent_children_parent ON parent_children(parent_id);
CREATE INDEX idx_parent_children_child ON parent_children(child_id);

-- 33. friend_requests — Social
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_friend_requests_from ON friend_requests(from_user_id);
CREATE INDEX idx_friend_requests_to ON friend_requests(to_user_id);
CREATE INDEX idx_friend_requests_status ON friend_requests(status) WHERE status = 'pending';

-- 34. tts_cache — Text-to-speech cache
CREATE TABLE tts_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text_hash TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  voice_id TEXT,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tts_cache_hash ON tts_cache(text_hash);

-- 35. homework — Teacher assignments
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_homework_classroom ON homework(classroom_id);
CREATE INDEX idx_homework_teacher ON homework(teacher_id);
CREATE INDEX idx_homework_due ON homework(due_date);

-- 36. homework_submissions — Student submissions
CREATE TABLE homework_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(homework_id, student_id)
);

CREATE INDEX idx_homework_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX idx_homework_submissions_student ON homework_submissions(student_id);


-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables that have the column
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t
    );
  END LOOP;
END;
$$;


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE phonics_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories_decodable ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_external ENABLE ROW LEVEL SECURITY;
ALTER TABLE turkish_phonetic_traps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mascots ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_phonics_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_garden ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- CONTENT TABLES: Read-only for all authenticated users
-- -------------------------------------------------------

CREATE POLICY "Content readable by all authenticated users"
  ON phonics_sounds FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON words FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON curriculum_phases FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON curriculum_units FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON curriculum_activities FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON worlds FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON lessons FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON stories_decodable FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON story_nodes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON exercises FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON songs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON videos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON worksheets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON games_external FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON turkish_phonetic_traps FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON mascots FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON avatar_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON garden_plants FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON badges FOR SELECT TO authenticated USING (true);

CREATE POLICY "Content readable by all authenticated users"
  ON letter_paths FOR SELECT TO authenticated USING (true);

-- Also allow anon read for content tables (public landing page, etc.)
CREATE POLICY "Content readable by anon"
  ON phonics_sounds FOR SELECT TO anon USING (true);

CREATE POLICY "Content readable by anon"
  ON words FOR SELECT TO anon USING (true);

CREATE POLICY "Content readable by anon"
  ON worlds FOR SELECT TO anon USING (true);

CREATE POLICY "Content readable by anon"
  ON mascots FOR SELECT TO anon USING (true);

CREATE POLICY "Content readable by anon"
  ON videos FOR SELECT TO anon USING (true);

-- -------------------------------------------------------
-- USER TABLES: Users can only access their own data
-- -------------------------------------------------------

-- user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_phonics_mastery
CREATE POLICY "Users can view own phonics mastery"
  ON user_phonics_mastery FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phonics mastery"
  ON user_phonics_mastery FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phonics mastery"
  ON user_phonics_mastery FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_word_progress
CREATE POLICY "Users can view own word progress"
  ON user_word_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own word progress"
  ON user_word_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own word progress"
  ON user_word_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_activities
CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON user_activities FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- user_story_progress
CREATE POLICY "Users can view own story progress"
  ON user_story_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own story progress"
  ON user_story_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own story progress"
  ON user_story_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_garden
CREATE POLICY "Users can view own garden"
  ON user_garden FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garden"
  ON user_garden FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garden"
  ON user_garden FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- user_gamification
CREATE POLICY "Users can view own gamification"
  ON user_gamification FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
  ON user_gamification FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
  ON user_gamification FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- CLASSROOM TABLES: Teacher + enrolled student access
-- -------------------------------------------------------

-- classrooms
CREATE POLICY "Teachers can manage own classrooms"
  ON classrooms FOR ALL TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Students can view enrolled classrooms"
  ON classrooms FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classroom_students
      WHERE classroom_students.classroom_id = classrooms.id
        AND classroom_students.student_id = auth.uid()
    )
  );

-- classroom_students
CREATE POLICY "Teachers can manage classroom students"
  ON classroom_students FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classrooms
      WHERE classrooms.id = classroom_students.classroom_id
        AND classrooms.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own enrollment"
  ON classroom_students FOR SELECT TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can join classrooms"
  ON classroom_students FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- -------------------------------------------------------
-- PARENT-CHILD: Parents can view children's data
-- -------------------------------------------------------

CREATE POLICY "Users can view own parent-child links"
  ON parent_children FOR SELECT TO authenticated
  USING (auth.uid() = parent_id OR auth.uid() = child_id);

CREATE POLICY "Parents can create links"
  ON parent_children FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can delete links"
  ON parent_children FOR DELETE TO authenticated
  USING (auth.uid() = parent_id);

-- Parent access to child progress
CREATE POLICY "Parents can view children progress"
  ON user_progress FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_children.parent_id = auth.uid()
        AND parent_children.child_id = user_progress.user_id
    )
  );

CREATE POLICY "Parents can view children gamification"
  ON user_gamification FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_children.parent_id = auth.uid()
        AND parent_children.child_id = user_gamification.user_id
    )
  );

CREATE POLICY "Parents can view children activities"
  ON user_activities FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_children.parent_id = auth.uid()
        AND parent_children.child_id = user_activities.user_id
    )
  );

-- Teacher access to student progress
CREATE POLICY "Teachers can view student progress"
  ON user_progress FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE c.teacher_id = auth.uid()
        AND cs.student_id = user_progress.user_id
    )
  );

CREATE POLICY "Teachers can view student gamification"
  ON user_gamification FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE c.teacher_id = auth.uid()
        AND cs.student_id = user_gamification.user_id
    )
  );

-- -------------------------------------------------------
-- FRIEND REQUESTS
-- -------------------------------------------------------

CREATE POLICY "Users can view own friend requests"
  ON friend_requests FOR SELECT TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send friend requests"
  ON friend_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update received requests"
  ON friend_requests FOR UPDATE TO authenticated
  USING (auth.uid() = to_user_id)
  WITH CHECK (auth.uid() = to_user_id);

-- -------------------------------------------------------
-- TTS CACHE: Readable by all authenticated, insertable
-- -------------------------------------------------------

CREATE POLICY "TTS cache readable by authenticated"
  ON tts_cache FOR SELECT TO authenticated USING (true);

CREATE POLICY "TTS cache insertable by authenticated"
  ON tts_cache FOR INSERT TO authenticated WITH CHECK (true);

-- -------------------------------------------------------
-- HOMEWORK
-- -------------------------------------------------------

CREATE POLICY "Teachers can manage own homework"
  ON homework FOR ALL TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Students can view homework for enrolled classrooms"
  ON homework FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classroom_students cs
      WHERE cs.classroom_id = homework.classroom_id
        AND cs.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own submissions"
  ON homework_submissions FOR ALL TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for own homework"
  ON homework_submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM homework h
      WHERE h.id = homework_submissions.homework_id
        AND h.teacher_id = auth.uid()
    )
  );


-- ============================================================================
-- HELPER FUNCTION: Auto-create user profile on signup
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Learner'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );

  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_story_progress (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- LEADERBOARD VIEW (for weekly XP rankings)
-- ============================================================================

CREATE OR REPLACE VIEW leaderboard_weekly AS
SELECT
  ug.user_id,
  up.display_name,
  up.avatar,
  ug.weekly_xp,
  ug.level,
  ug.streak_days,
  RANK() OVER (ORDER BY ug.weekly_xp DESC) AS rank
FROM user_gamification ug
JOIN user_profiles up ON up.id = ug.user_id
WHERE ug.weekly_xp > 0
ORDER BY ug.weekly_xp DESC;


-- ============================================================================
-- DONE
-- ============================================================================
