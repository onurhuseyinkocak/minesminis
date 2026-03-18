-- ============================================================
-- MinesMinis Supabase Migration
-- Syncs localStorage learning data to Supabase for cross-device access.
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- Activity logs (replaces localStorage mimi_activity_log)
CREATE TABLE IF NOT EXISTS activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'phonics' | 'game' | 'reading' | 'song' | 'review' | 'challenge'
    title text NOT NULL,
    duration integer DEFAULT 0, -- seconds
    accuracy integer, -- 0-100
    xp_earned integer DEFAULT 0,
    sound_id text, -- phonics sound if applicable
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert own logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Phonics mastery (replaces localStorage mimi_phonics_mastery)
CREATE TABLE IF NOT EXISTS phonics_mastery (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sound_id text NOT NULL,
    mastery integer DEFAULT 0, -- 0-100
    attempts integer DEFAULT 0,
    correct_attempts integer DEFAULT 0,
    last_practiced timestamptz DEFAULT now(),
    next_review timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, sound_id)
);
CREATE INDEX idx_phonics_mastery_user ON phonics_mastery(user_id);
ALTER TABLE phonics_mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all phonics_mastery" ON phonics_mastery FOR ALL USING (true) WITH CHECK (true);

-- Classrooms (replaces localStorage mimi_classrooms_*)
CREATE TABLE IF NOT EXISTS classrooms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    grade_level text,
    join_code text UNIQUE NOT NULL,
    phonics_group_assigned integer DEFAULT 1,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_classrooms_code ON classrooms(join_code);
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all classrooms" ON classrooms FOR ALL USING (true) WITH CHECK (true);

-- Classroom students (junction table)
CREATE TABLE IF NOT EXISTS classroom_students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    classroom_id uuid NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at timestamptz DEFAULT now(),
    UNIQUE(classroom_id, student_id)
);
CREATE INDEX idx_cs_classroom ON classroom_students(classroom_id);
CREATE INDEX idx_cs_student ON classroom_students(student_id);
ALTER TABLE classroom_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all classroom_students" ON classroom_students FOR ALL USING (true) WITH CHECK (true);

-- Parent-child links (replaces localStorage mimi_children_*)
CREATE TABLE IF NOT EXISTS parent_children (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship text DEFAULT 'parent',
    created_at timestamptz DEFAULT now(),
    UNIQUE(parent_id, child_id)
);
CREATE INDEX idx_pc_parent ON parent_children(parent_id);
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all parent_children" ON parent_children FOR ALL USING (true) WITH CHECK (true);

-- Garden state (replaces localStorage mimi_garden_state)
CREATE TABLE IF NOT EXISTS garden_plants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sound_id text NOT NULL,
    stage text DEFAULT 'seed',
    mastery integer DEFAULT 0,
    water_drops integer DEFAULT 0,
    last_watered timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, sound_id)
);
CREATE INDEX idx_garden_user ON garden_plants(user_id);
ALTER TABLE garden_plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all garden_plants" ON garden_plants FOR ALL USING (true) WITH CHECK (true);
