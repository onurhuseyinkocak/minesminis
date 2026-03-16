-- =====================================================
-- CRITICAL FIX: users.id UUID -> TEXT for Firebase UIDs
-- Run this BLOCK BY BLOCK in Supabase Dashboard > SQL Editor
-- If a statement fails with "does not exist", skip it
-- =====================================================

-- ========== BLOCK 1: DROP ALL RLS POLICIES ==========
-- (Policies reference column types and block ALTER TYPE)

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ========== BLOCK 2: DROP ALL FOREIGN KEY CONSTRAINTS ==========

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tc.table_name, tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND (ccu.table_name = 'users' OR tc.table_name = 'users')
    ) LOOP
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', r.table_name, r.constraint_name);
    END LOOP;
END $$;

-- Also drop any remaining known FK constraints just in case
ALTER TABLE IF EXISTS follows DROP CONSTRAINT IF EXISTS follows_follower_id_fkey;
ALTER TABLE IF EXISTS follows DROP CONSTRAINT IF EXISTS follows_following_id_fkey;
ALTER TABLE IF EXISTS user_achievements DROP CONSTRAINT IF EXISTS user_achievements_user_id_fkey;
ALTER TABLE IF EXISTS posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE IF EXISTS post_likes DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;
ALTER TABLE IF EXISTS post_likes DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey;
ALTER TABLE IF EXISTS comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE IF EXISTS comments DROP CONSTRAINT IF EXISTS comments_post_id_fkey;
ALTER TABLE IF EXISTS comment_likes DROP CONSTRAINT IF EXISTS comment_likes_user_id_fkey;
ALTER TABLE IF EXISTS comment_likes DROP CONSTRAINT IF EXISTS comment_likes_comment_id_fkey;
ALTER TABLE IF EXISTS reports DROP CONSTRAINT IF EXISTS reports_reporter_id_fkey;
ALTER TABLE IF EXISTS reports DROP CONSTRAINT IF EXISTS reports_reported_user_id_fkey;
ALTER TABLE IF EXISTS worksheets DROP CONSTRAINT IF EXISTS worksheets_uploaded_by_fkey;
ALTER TABLE IF EXISTS games DROP CONSTRAINT IF EXISTS games_added_by_fkey;
ALTER TABLE IF EXISTS videos DROP CONSTRAINT IF EXISTS videos_added_by_fkey;
ALTER TABLE IF EXISTS videos DROP CONSTRAINT IF EXISTS videos_curated_by_fkey;

-- ========== BLOCK 3: ALTER COLUMN TYPES ==========

-- Main users table
ALTER TABLE users ALTER COLUMN id TYPE text;

-- All tables with user reference columns
DO $$
DECLARE
    col_rec RECORD;
BEGIN
    -- follows
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='follows' AND column_name='follower_id') THEN
        ALTER TABLE follows ALTER COLUMN follower_id TYPE text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='follows' AND column_name='following_id') THEN
        ALTER TABLE follows ALTER COLUMN following_id TYPE text;
    END IF;

    -- user_achievements
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_achievements' AND column_name='user_id') THEN
        ALTER TABLE user_achievements ALTER COLUMN user_id TYPE text;
    END IF;

    -- posts
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='author_id') THEN
        ALTER TABLE posts ALTER COLUMN author_id TYPE text;
    END IF;

    -- post_likes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='post_likes' AND column_name='user_id') THEN
        ALTER TABLE post_likes ALTER COLUMN user_id TYPE text;
    END IF;

    -- comments
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='user_id') THEN
        ALTER TABLE comments ALTER COLUMN user_id TYPE text;
    END IF;

    -- comment_likes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comment_likes' AND column_name='user_id') THEN
        ALTER TABLE comment_likes ALTER COLUMN user_id TYPE text;
    END IF;

    -- reports
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='reporter_id') THEN
        ALTER TABLE reports ALTER COLUMN reporter_id TYPE text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='reported_user_id') THEN
        ALTER TABLE reports ALTER COLUMN reported_user_id TYPE text;
    END IF;

    -- worksheets
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='uploaded_by') THEN
        ALTER TABLE worksheets ALTER COLUMN uploaded_by TYPE text;
    END IF;

    -- games
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='games' AND column_name='added_by') THEN
        ALTER TABLE games ALTER COLUMN added_by TYPE text;
    END IF;

    -- videos
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='videos' AND column_name='added_by') THEN
        ALTER TABLE videos ALTER COLUMN added_by TYPE text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='videos' AND column_name='curated_by') THEN
        ALTER TABLE videos ALTER COLUMN curated_by TYPE text;
    END IF;
END $$;

-- ========== BLOCK 4: RE-ADD FOREIGN KEY CONSTRAINTS ==========

ALTER TABLE follows ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE follows ADD CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;

-- ========== BLOCK 5: RE-CREATE RLS POLICIES ==========
-- Simple "allow all" policies for development

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN (
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
        EXECUTE format('CREATE POLICY "Allow all for %s" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;

-- ========== BLOCK 6: CREATE MISSING TABLES ==========

CREATE TABLE IF NOT EXISTS pets (
    id text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL DEFAULT 'Pet',
    type text NOT NULL DEFAULT 'cat',
    emoji text DEFAULT '🐱',
    level integer DEFAULT 1,
    experience integer DEFAULT 0,
    happiness integer DEFAULT 100,
    hunger integer DEFAULT 50,
    energy integer DEFAULT 100,
    last_fed timestamptz DEFAULT now(),
    last_played timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for pets" ON pets FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS learn_audio (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key text UNIQUE NOT NULL,
    audio_base64 text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE learn_audio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for learn_audio" ON learn_audio FOR ALL USING (true) WITH CHECK (true);

-- ========== DONE ==========
-- All user ID columns are now TEXT (compatible with Firebase UIDs)
-- Missing tables created
-- RLS policies set to allow-all for development
