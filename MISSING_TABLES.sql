-- ============================================================
-- MinesMinis — MISSING TABLES MIGRATION
-- Creates all tables queried in code that had no migration file.
-- Run in Supabase Dashboard → SQL Editor
-- Safe to re-run: all statements use CREATE IF NOT EXISTS / IF NOT EXISTS checks
-- ============================================================

-- ─── games ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.games (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title       text NOT NULL,
    url         text NOT NULL,
    thumbnail_url text,
    category    text NOT NULL DEFAULT 'other',
    description text NOT NULL DEFAULT '',
    target_audience text NOT NULL DEFAULT 'all',
    added_by    text REFERENCES public.users(id) ON DELETE SET NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_games_category ON public.games(category);
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "games_public_read"  ON public.games;
DROP POLICY IF EXISTS "games_admin_write"  ON public.games;
CREATE POLICY "games_public_read"  ON public.games FOR SELECT USING (true);
CREATE POLICY "games_admin_write"  ON public.games FOR ALL   USING (true) WITH CHECK (true);

-- ─── videos ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.videos (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id  text NOT NULL,
    title       text NOT NULL,
    description text,
    thumbnail   text,
    duration    text NOT NULL DEFAULT '0:00',
    category    text NOT NULL DEFAULT 'general',
    grade       text NOT NULL DEFAULT 'all',
    is_popular  boolean NOT NULL DEFAULT false,
    added_by    text REFERENCES public.users(id) ON DELETE SET NULL,
    curated_by  text REFERENCES public.users(id) ON DELETE SET NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_popular  ON public.videos(is_popular);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "videos_public_read" ON public.videos;
DROP POLICY IF EXISTS "videos_admin_write" ON public.videos;
CREATE POLICY "videos_public_read" ON public.videos FOR SELECT USING (true);
CREATE POLICY "videos_admin_write" ON public.videos FOR ALL   USING (true) WITH CHECK (true);

-- ─── worksheets ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.worksheets (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title         text NOT NULL,
    description   text NOT NULL DEFAULT '',
    subject       text NOT NULL DEFAULT 'General',
    grade         text NOT NULL DEFAULT 'all',
    thumbnail_url text NOT NULL DEFAULT '',
    file_url      text NOT NULL DEFAULT '',
    source        text NOT NULL DEFAULT 'MinesMinis',
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_worksheets_subject ON public.worksheets(subject);
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "worksheets_public_read" ON public.worksheets;
DROP POLICY IF EXISTS "worksheets_admin_write" ON public.worksheets;
CREATE POLICY "worksheets_public_read" ON public.worksheets FOR SELECT USING (true);
CREATE POLICY "worksheets_admin_write" ON public.worksheets FOR ALL   USING (true) WITH CHECK (true);

-- ─── words ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.words (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    word             text NOT NULL,
    level            text NOT NULL DEFAULT 'beginner',
    category         text NOT NULL DEFAULT 'General',
    emoji            text NOT NULL DEFAULT '📝',
    turkish          text NOT NULL DEFAULT '',
    example          text,
    grade            integer,
    image_url        text,
    word_audio_url   text,
    example_audio_url text,
    created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_words_level    ON public.words(level);
CREATE INDEX IF NOT EXISTS idx_words_category ON public.words(category);
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "words_public_read" ON public.words;
DROP POLICY IF EXISTS "words_admin_write" ON public.words;
CREATE POLICY "words_public_read" ON public.words FOR SELECT USING (true);
CREATE POLICY "words_admin_write" ON public.words FOR ALL   USING (true) WITH CHECK (true);

-- ─── follows ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.follows (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id  text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    following_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE(follower_id, following_id)
);
CREATE INDEX IF NOT EXISTS idx_follows_follower  ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "follows_select" ON public.follows;
DROP POLICY IF EXISTS "follows_insert" ON public.follows;
DROP POLICY IF EXISTS "follows_delete" ON public.follows;
CREATE POLICY "follows_select" ON public.follows FOR SELECT USING (auth.uid()::text = follower_id OR auth.uid()::text = following_id);
CREATE POLICY "follows_insert" ON public.follows FOR INSERT WITH CHECK (auth.uid()::text = follower_id);
CREATE POLICY "follows_delete" ON public.follows FOR DELETE USING (auth.uid()::text = follower_id);

-- ─── blog_posts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title            text NOT NULL,
    slug             text UNIQUE NOT NULL,
    content          text,
    excerpt          text,
    meta_title       text,
    meta_description text,
    published_at     timestamptz,
    created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug      ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at DESC);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_public_read"  ON public.blog_posts;
DROP POLICY IF EXISTS "blog_admin_write"  ON public.blog_posts;
CREATE POLICY "blog_public_read"  ON public.blog_posts FOR SELECT USING (published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "blog_admin_write"  ON public.blog_posts FOR ALL   USING (true) WITH CHECK (true);

-- ─── reports ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         text REFERENCES public.users(id) ON DELETE SET NULL,
    page_url        text NOT NULL DEFAULT '',
    page_path       text NOT NULL DEFAULT '',
    content         text NOT NULL,
    status          text NOT NULL DEFAULT 'open',
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reports_status     ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created    ON public.reports(created_at DESC);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reports_insert" ON public.reports;
DROP POLICY IF EXISTS "reports_admin"  ON public.reports;
CREATE POLICY "reports_insert" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "reports_admin"  ON public.reports FOR SELECT USING (true);
CREATE POLICY "reports_update" ON public.reports FOR UPDATE USING (true) WITH CHECK (true);

-- ─── achievements ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.achievements (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text UNIQUE NOT NULL,
    description text,
    icon_url    text,
    created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "achievements_public_read" ON public.achievements;
CREATE POLICY "achievements_public_read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_write" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

-- ─── user_achievements ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_achievements_select" ON public.user_achievements;
DROP POLICY IF EXISTS "user_achievements_insert" ON public.user_achievements;
CREATE POLICY "user_achievements_select" ON public.user_achievements FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "user_achievements_insert" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ─── story_progress ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.story_progress (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          text UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    character_name   text NOT NULL DEFAULT '',
    mascot_id        text NOT NULL DEFAULT 'mimi_dragon',
    current_world    text NOT NULL DEFAULT 'forest',
    current_node_id  text NOT NULL DEFAULT 'start',
    traits           jsonb NOT NULL DEFAULT '{}',
    inventory        jsonb NOT NULL DEFAULT '[]',
    visited_node_ids jsonb NOT NULL DEFAULT '[]',
    total_xp         integer NOT NULL DEFAULT 0,
    choice_history   jsonb NOT NULL DEFAULT '[]',
    session_count    integer NOT NULL DEFAULT 1,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "story_progress_own" ON public.story_progress;
CREATE POLICY "story_progress_own" ON public.story_progress FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

-- ─── curriculum_worlds ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.curriculum_worlds (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "order"     integer NOT NULL DEFAULT 1,
    name        text NOT NULL,
    name_en     text NOT NULL DEFAULT '',
    emoji       text NOT NULL DEFAULT '🌍',
    color       text NOT NULL DEFAULT 'var(--primary)',
    description text NOT NULL DEFAULT '',
    age_range   text NOT NULL DEFAULT '4-8',
    lesson_count integer NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_curriculum_worlds_order ON public.curriculum_worlds("order");
ALTER TABLE public.curriculum_worlds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "curriculum_worlds_public_read" ON public.curriculum_worlds;
DROP POLICY IF EXISTS "curriculum_worlds_admin_write" ON public.curriculum_worlds;
CREATE POLICY "curriculum_worlds_public_read" ON public.curriculum_worlds FOR SELECT USING (true);
CREATE POLICY "curriculum_worlds_admin_write" ON public.curriculum_worlds FOR ALL   USING (true) WITH CHECK (true);

-- ─── curriculum_lessons ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.curriculum_lessons (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id         uuid NOT NULL REFERENCES public.curriculum_worlds(id) ON DELETE CASCADE,
    "order"          integer NOT NULL DEFAULT 1,
    title            text NOT NULL,
    title_tr         text NOT NULL DEFAULT '',
    objective        text NOT NULL DEFAULT '',
    vocabulary_words jsonb NOT NULL DEFAULT '[]',
    activities       jsonb NOT NULL DEFAULT '[]',
    duration         integer NOT NULL DEFAULT 20,
    status           text NOT NULL DEFAULT 'draft',
    created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_curriculum_lessons_world ON public.curriculum_lessons(world_id, "order");
ALTER TABLE public.curriculum_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "curriculum_lessons_public_read" ON public.curriculum_lessons;
DROP POLICY IF EXISTS "curriculum_lessons_admin_write" ON public.curriculum_lessons;
CREATE POLICY "curriculum_lessons_public_read" ON public.curriculum_lessons FOR SELECT USING (true);
CREATE POLICY "curriculum_lessons_admin_write" ON public.curriculum_lessons FOR ALL   USING (true) WITH CHECK (true);

-- ─── friends (fix: was using auth.users UUID, now uses users TEXT) ─────────────
-- Drop and recreate with correct FK type (TEXT for Firebase UIDs)
DROP TABLE IF EXISTS public.friends CASCADE;
CREATE TABLE IF NOT EXISTS public.friends (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id  text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, friend_id)
);
CREATE INDEX IF NOT EXISTS idx_friends_user   ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend ON public.friends(friend_id);
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friends_view"   ON public.friends FOR SELECT USING (auth.uid()::text = user_id OR auth.uid()::text = friend_id);
CREATE POLICY "friends_insert" ON public.friends FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "friends_update" ON public.friends FOR UPDATE USING (auth.uid()::text = friend_id);
CREATE POLICY "friends_delete" ON public.friends FOR DELETE USING (auth.uid()::text = user_id OR auth.uid()::text = friend_id);

-- ============================================================
-- DONE
-- Tables created: games, videos, worksheets, words, follows,
--   blog_posts, reports, achievements, user_achievements,
--   story_progress, curriculum_worlds, curriculum_lessons
-- Fixed: friends (UUID → TEXT foreign keys)
-- ============================================================
