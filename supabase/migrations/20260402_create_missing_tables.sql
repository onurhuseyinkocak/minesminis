-- Migration: Create 16 missing tables queried in code but absent from DB
-- Generated: 2026-04-02

-- 1. blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  meta_title text,
  meta_description text,
  cover_image_url text,
  category text,
  read_time_minutes int DEFAULT 3,
  author text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts_public_read" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "blog_posts_service_write" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);

-- 2. curriculum_worlds
CREATE TABLE IF NOT EXISTS public.curriculum_worlds (
  id text PRIMARY KEY,
  "order" int NOT NULL DEFAULT 0,
  name text NOT NULL,
  name_en text,
  emoji text DEFAULT '',
  color text DEFAULT 'var(--accent-indigo)',
  description text DEFAULT '',
  age_range text DEFAULT '',
  lesson_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.curriculum_worlds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "curriculum_worlds_public_read" ON public.curriculum_worlds FOR SELECT USING (true);
CREATE POLICY "curriculum_worlds_service_write" ON public.curriculum_worlds FOR ALL USING (true) WITH CHECK (true);

-- 3. curriculum_lessons
CREATE TABLE IF NOT EXISTS public.curriculum_lessons (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  world_id text REFERENCES public.curriculum_worlds(id) ON DELETE CASCADE,
  "order" int NOT NULL DEFAULT 0,
  title text NOT NULL,
  title_tr text,
  objective text,
  vocabulary_words jsonb DEFAULT '[]',
  activities jsonb DEFAULT '[]',
  duration int DEFAULT 10,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.curriculum_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "curriculum_lessons_public_read" ON public.curriculum_lessons FOR SELECT USING (true);
CREATE POLICY "curriculum_lessons_service_write" ON public.curriculum_lessons FOR ALL USING (true) WITH CHECK (true);

-- 4. friends
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  friend_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friends_own_read" ON public.friends FOR SELECT USING (true);
CREATE POLICY "friends_own_write" ON public.friends FOR ALL USING (true) WITH CHECK (true);

-- 5. classrooms
CREATE TABLE IF NOT EXISTS public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  teacher_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classrooms_read" ON public.classrooms FOR SELECT USING (true);
CREATE POLICY "classrooms_write" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);

-- 6. classroom_members
CREATE TABLE IF NOT EXISTS public.classroom_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE CASCADE,
  role text DEFAULT 'student',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, classroom_id)
);
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classroom_members_read" ON public.classroom_members FOR SELECT USING (true);
CREATE POLICY "classroom_members_write" ON public.classroom_members FOR ALL USING (true) WITH CHECK (true);

-- 7. homework
CREATE TABLE IF NOT EXISTS public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homework_read" ON public.homework FOR SELECT USING (true);
CREATE POLICY "homework_write" ON public.homework FOR ALL USING (true) WITH CHECK (true);

-- 8. homework_submissions
CREATE TABLE IF NOT EXISTS public.homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  homework_id uuid REFERENCES public.homework(id) ON DELETE CASCADE,
  score int,
  metadata jsonb DEFAULT '{}',
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, homework_id)
);
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homework_submissions_read" ON public.homework_submissions FOR SELECT USING (true);
CREATE POLICY "homework_submissions_write" ON public.homework_submissions FOR ALL USING (true) WITH CHECK (true);

-- 9. garden_plant_defs
CREATE TABLE IF NOT EXISTS public.garden_plant_defs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  rarity text DEFAULT 'common',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.garden_plant_defs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "garden_plant_defs_public_read" ON public.garden_plant_defs FOR SELECT USING (true);

-- 10. garden_plants (user's planted garden items)
CREATE TABLE IF NOT EXISTS public.garden_plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  plant_def_id uuid REFERENCES public.garden_plant_defs(id) ON DELETE SET NULL,
  water_drops int DEFAULT 0,
  growth_stage int DEFAULT 0,
  last_watered timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.garden_plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "garden_plants_own_read" ON public.garden_plants FOR SELECT USING (true);
CREATE POLICY "garden_plants_own_write" ON public.garden_plants FOR ALL USING (true) WITH CHECK (true);

-- 11. parent_children
CREATE TABLE IF NOT EXISTS public.parent_children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id text NOT NULL,
  child_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);
ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent_children_read" ON public.parent_children FOR SELECT USING (true);
CREATE POLICY "parent_children_write" ON public.parent_children FOR ALL USING (true) WITH CHECK (true);

-- 12. story_scenes
CREATE TABLE IF NOT EXISTS public.story_scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id text,
  scene_order int DEFAULT 0,
  title text,
  content text,
  image_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.story_scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "story_scenes_public_read" ON public.story_scenes FOR SELECT USING (true);

-- 13. phonetic_traps (code queries 'phonetic_traps', DB has 'turkish_phonetic_traps')
-- Create a VIEW so code works without changes
CREATE OR REPLACE VIEW public.phonetic_traps AS
  SELECT * FROM public.turkish_phonetic_traps;

-- 14. user_gamification
CREATE TABLE IF NOT EXISTS public.user_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  xp int DEFAULT 0,
  level int DEFAULT 1,
  coins int DEFAULT 0,
  streak_days int DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_gamification_own_read" ON public.user_gamification FOR SELECT USING (true);
CREATE POLICY "user_gamification_own_write" ON public.user_gamification FOR ALL USING (true) WITH CHECK (true);

-- 15. user_phonics
CREATE TABLE IF NOT EXISTS public.user_phonics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  sound_id text NOT NULL,
  mastery_level int DEFAULT 0,
  attempts int DEFAULT 0,
  correct int DEFAULT 0,
  last_practiced timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, sound_id)
);
ALTER TABLE public.user_phonics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_phonics_own_read" ON public.user_phonics FOR SELECT USING (true);
CREATE POLICY "user_phonics_own_write" ON public.user_phonics FOR ALL USING (true) WITH CHECK (true);

-- 16. user_word_progress
CREATE TABLE IF NOT EXISTS public.user_word_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  word_id text NOT NULL,
  mastery_level int DEFAULT 0,
  times_seen int DEFAULT 0,
  times_correct int DEFAULT 0,
  last_seen timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word_id)
);
ALTER TABLE public.user_word_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_word_progress_own_read" ON public.user_word_progress FOR SELECT USING (true);
CREATE POLICY "user_word_progress_own_write" ON public.user_word_progress FOR ALL USING (true) WITH CHECK (true);
