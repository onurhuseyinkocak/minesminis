-- ============================================================
-- MinesMinis — Unified Progress Schema
-- Run in Supabase SQL editor
-- ============================================================

-- Fix existing RLS vulnerability
ALTER POLICY IF EXISTS "Users can insert their own progress"
  ON curriculum_progress
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Lesson Completions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_completions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       text NOT NULL,
  child_id      text,
  unit_id       text NOT NULL,
  lesson_id     text,
  completed_at  timestamptz NOT NULL DEFAULT now(),
  duration_sec  integer,
  xp_earned     integer DEFAULT 0,
  accuracy      integer DEFAULT 0 CHECK (accuracy BETWEEN 0 AND 100),
  activity_results jsonb DEFAULT '[]'::jsonb,
  difficulty    float DEFAULT 1.0,
  UNIQUE(user_id, child_id, unit_id, lesson_id)
);

ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_completions_owner" ON lesson_completions
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Phoneme Mastery ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS phoneme_mastery (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             text NOT NULL,
  child_id            text,
  phoneme_id          text NOT NULL,
  mastery_score       integer DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  attempts            integer DEFAULT 0,
  correct_attempts    integer DEFAULT 0,
  avg_response_ms     integer,
  consecutive_correct integer DEFAULT 0,
  blending_score      integer DEFAULT 0,
  segmenting_score    integer DEFAULT 0,
  listening_score     integer DEFAULT 0,
  pronunciation_score integer DEFAULT 0,
  last_practiced      timestamptz,
  next_review_at      timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  UNIQUE(user_id, child_id, phoneme_id)
);

ALTER TABLE phoneme_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "phoneme_mastery_owner" ON phoneme_mastery
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Word Progress (spaced repetition) ──────────────────────
CREATE TABLE IF NOT EXISTS word_progress (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         text NOT NULL,
  child_id        text,
  word_id         text NOT NULL,
  first_seen      timestamptz DEFAULT now(),
  last_reviewed   timestamptz DEFAULT now(),
  correct_count   integer DEFAULT 0,
  incorrect_count integer DEFAULT 0,
  confidence      integer DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
  interval_days   integer DEFAULT 0,
  next_review_at  timestamptz DEFAULT now(),
  ease_factor     float DEFAULT 2.5,
  UNIQUE(user_id, child_id, word_id)
);

ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "word_progress_owner" ON word_progress
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Learning Sessions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS learning_sessions (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         text NOT NULL,
  child_id        text,
  started_at      timestamptz NOT NULL DEFAULT now(),
  ended_at        timestamptz,
  duration_sec    integer,
  activity_count  integer DEFAULT 0,
  correct_count   integer DEFAULT 0,
  incorrect_count integer DEFAULT 0,
  xp_earned       integer DEFAULT 0,
  activities_json jsonb DEFAULT '{}'::jsonb,
  age_group       text,
  unit_id         text
);

ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "learning_sessions_owner" ON learning_sessions
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Adaptive State ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS adaptive_state (
  user_id               text NOT NULL,
  child_id              text NOT NULL DEFAULT '',
  difficulty_multiplier float DEFAULT 1.0,
  learning_speed        text DEFAULT 'normal',
  preferred_activity    text,
  weak_areas            text[] DEFAULT '{}',
  strong_areas          text[] DEFAULT '{}',
  total_sessions        integer DEFAULT 0,
  total_minutes         integer DEFAULT 0,
  last_session_at       timestamptz,
  updated_at            timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, child_id)
);

ALTER TABLE adaptive_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "adaptive_state_owner" ON adaptive_state
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Parent Report Snapshots ─────────────────────────────────
CREATE TABLE IF NOT EXISTS parent_report_snapshots (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               text NOT NULL,
  child_id              text NOT NULL DEFAULT '',
  week_start            date NOT NULL,
  total_minutes         integer DEFAULT 0,
  lessons_completed     integer DEFAULT 0,
  words_learned         integer DEFAULT 0,
  phonemes_mastered     integer DEFAULT 0,
  avg_accuracy          float,
  streak_days           integer DEFAULT 0,
  top_weak_phonemes     text[] DEFAULT '{}',
  top_strong_phonemes   text[] DEFAULT '{}',
  created_at            timestamptz DEFAULT now(),
  UNIQUE(user_id, child_id, week_start)
);

ALTER TABLE parent_report_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parent_reports_owner" ON parent_report_snapshots
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON lesson_completions(user_id, child_id);
CREATE INDEX IF NOT EXISTS idx_phoneme_mastery_user ON phoneme_mastery(user_id, child_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_user ON word_progress(user_id, child_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_review ON word_progress(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user ON learning_sessions(user_id, started_at DESC);

-- ── Curriculum Progress (referenced by progressService) ────
CREATE TABLE IF NOT EXISTS curriculum_progress (
  user_id       text NOT NULL,
  child_id      text NOT NULL DEFAULT '',
  unit_id       text NOT NULL,
  progress      integer DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  activity_index integer DEFAULT 0,
  completed     boolean DEFAULT false,
  completed_at  timestamptz,
  updated_at    timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, child_id, unit_id)
);
ALTER TABLE curriculum_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "curriculum_progress_owner" ON curriculum_progress
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── Curriculum Current Unit ─────────────────────────────────
CREATE TABLE IF NOT EXISTS curriculum_current_unit (
  user_id         text NOT NULL,
  child_id        text NOT NULL DEFAULT '',
  current_unit_id text NOT NULL DEFAULT 's1-u1',
  updated_at      timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, child_id)
);
ALTER TABLE curriculum_current_unit ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "curriculum_current_unit_owner" ON curriculum_current_unit
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
