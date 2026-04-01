-- ============================================================================
-- MinesMinis — Add Content API Tables (migration)
-- Only creates tables that don't already exist
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── phonics_sounds ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS phonics_sounds (
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
CREATE INDEX IF NOT EXISTS idx_phonics_sounds_group ON phonics_sounds(group_number);

-- ── curriculum_phases ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS curriculum_phases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  age_min FLOAT NOT NULL,
  age_max FLOAT NOT NULL,
  description TEXT,
  description_tr TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── curriculum_units ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS curriculum_units (
  id TEXT PRIMARY KEY,
  phase_id TEXT NOT NULL REFERENCES curriculum_phases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description TEXT,
  description_tr TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── curriculum_activities ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS curriculum_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id TEXT NOT NULL REFERENCES curriculum_units(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  target_sounds TEXT[] DEFAULT '{}',
  target_words TEXT[] DEFAULT '{}',
  difficulty INT NOT NULL DEFAULT 1,
  duration_minutes INT DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── worlds ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS worlds (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'curriculum',
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
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ── lessons ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'standard',
  activities JSONB DEFAULT '[]',
  vocabulary_word_ids TEXT[] DEFAULT '{}',
  difficulty INT NOT NULL DEFAULT 1,
  xp_reward INT NOT NULL DEFAULT 10,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── stories_decodable ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stories_decodable (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  phonics_group INT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'adventure',
  mascot_id TEXT DEFAULT 'mimi',
  scenes JSONB NOT NULL DEFAULT '[]',
  word_count INT NOT NULL DEFAULT 0,
  decodability_score INT NOT NULL DEFAULT 90,
  comprehension_question TEXT,
  comprehension_question_tr TEXT,
  comprehension_answers TEXT[] DEFAULT '{}',
  comprehension_answers_tr TEXT[] DEFAULT '{}',
  correct_answer_index INT DEFAULT 0,
  cover_image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stories_decodable_group ON stories_decodable(phonics_group);

-- ── story_nodes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS story_nodes (
  id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  location TEXT,
  background TEXT,
  narrative_text TEXT NOT NULL,
  narrative_text_tr TEXT,
  npc_id TEXT,
  music TEXT,
  sfx TEXT[] DEFAULT '{}',
  choices JSONB NOT NULL DEFAULT '[]',
  vocabulary JSONB DEFAULT '[]',
  conditions JSONB,
  sort_order INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_story_nodes_world ON story_nodes(world_id);
CREATE INDEX IF NOT EXISTS idx_story_nodes_tags ON story_nodes USING GIN(tags);

-- ── exercises ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  difficulty INT NOT NULL DEFAULT 1,
  title TEXT,
  title_tr TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  target_sounds TEXT[] DEFAULT '{}',
  target_words TEXT[] DEFAULT '{}',
  phonics_group INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);
CREATE INDEX IF NOT EXISTS idx_exercises_group ON exercises(phonics_group);

-- ── songs ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  phonics_group INT NOT NULL,
  title TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  emoji TEXT,
  tempo TEXT DEFAULT 'medium',
  style TEXT DEFAULT 'nursery',
  lyrics JSONB NOT NULL DEFAULT '[]',
  audio_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── games_external ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games_external (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_tr TEXT,
  platform TEXT NOT NULL DEFAULT 'wordwall',
  external_id TEXT NOT NULL,
  type TEXT,
  grade INT,
  thumbnail_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── turkish_phonetic_traps ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS turkish_phonetic_traps (
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
  difficulty INT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── mascots ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mascots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  emoji TEXT,
  unlock_type TEXT DEFAULT 'free',
  unlock_value INT DEFAULT 0,
  lottie_idle_url TEXT,
  lottie_talk_url TEXT,
  lottie_happy_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── garden_plants_def ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS garden_plants_def (
  id TEXT PRIMARY KEY,
  sound_id TEXT,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  stages JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0
);

-- ── badges_def ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges_def (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description TEXT,
  description_tr TEXT,
  icon TEXT,
  category TEXT,
  requirement_type TEXT,
  requirement_value INT DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── letter_paths ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS letter_paths (
  id TEXT PRIMARY KEY,
  paths JSONB NOT NULL DEFAULT '[]',
  stroke_order INT[] DEFAULT '{}',
  guidelines JSONB
);

-- ── Add missing columns to existing 'words' table ───────────────────────────
DO $$ BEGIN
  ALTER TABLE words ADD COLUMN IF NOT EXISTS phonics_group INT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS phonics_sound_id TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS level TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS category TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS part_of_speech TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS phonetic_ipa TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS example_en TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS example_tr TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS image_url TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS audio_url TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS example_audio_url TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS frequency INT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS is_sight_word BOOLEAN DEFAULT FALSE;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS is_decodable BOOLEAN DEFAULT FALSE;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS turkish_trap TEXT;
  ALTER TABLE words ADD COLUMN IF NOT EXISTS confusing_with TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── Add missing columns to existing 'videos' table ─────────────────────────
DO $$ BEGIN
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS youtube_id TEXT;
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS type TEXT;
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS grade INT;
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration_seconds INT;
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── Add missing columns to existing 'worksheets' table ─────────────────────
DO $$ BEGIN
  ALTER TABLE worksheets ADD COLUMN IF NOT EXISTS category TEXT;
  ALTER TABLE worksheets ADD COLUMN IF NOT EXISTS source TEXT;
  ALTER TABLE worksheets ADD COLUMN IF NOT EXISTS external_url TEXT;
  ALTER TABLE worksheets ADD COLUMN IF NOT EXISTS grade INT;
  ALTER TABLE worksheets ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── Enable RLS on new tables ────────────────────────────────────────────────
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'phonics_sounds','curriculum_phases','curriculum_units','curriculum_activities',
    'worlds','lessons','stories_decodable','story_nodes','exercises','songs',
    'games_external','turkish_phonetic_traps','mascots','garden_plants_def',
    'badges_def','letter_paths'
  ]) LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    BEGIN
      EXECUTE format('CREATE POLICY "anon_read_%1$s" ON %1$I FOR SELECT USING (true)', t);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;
