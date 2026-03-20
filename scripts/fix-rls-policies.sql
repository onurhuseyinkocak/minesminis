-- =====================================================
-- FIX RLS POLICIES: Replace "allow all" with proper policies
-- Run in Supabase Dashboard > SQL Editor
-- Created: 2026-03-20
-- =====================================================
-- IMPORTANT: This migration replaces dangerous USING(true) WITH CHECK(true)
-- policies with proper row-level security. Review before running.
--
-- user.id columns are TEXT (Firebase UIDs), so we cast auth.uid() to text
-- when comparing: auth.uid()::text = id
-- =====================================================

BEGIN;

-- ========== STEP 1: DROP ALL EXISTING "allow all" POLICIES ==========
-- This removes every policy in the public schema so we start clean.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;


-- ========== STEP 2: ENSURE RLS IS ENABLED ON ALL TABLES ==========

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN (
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    END LOOP;
END $$;


-- ========== STEP 3: CREATE PROPER POLICIES ==========

-- ==========================================================
-- users: Users can only read/update their own profile
-- ==========================================================

-- Users can read their own row
CREATE POLICY "users_select_own"
    ON public.users FOR SELECT
    USING (auth.uid()::text = id);

-- Users can update their own row
CREATE POLICY "users_update_own"
    ON public.users FOR UPDATE
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

-- Authenticated users can insert their own row (registration)
CREATE POLICY "users_insert_own"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid()::text = id);

-- Allow users to read other users' basic profiles (for leaderboard, follows, etc.)
-- This is a common pattern: users can see each other but only edit themselves.
CREATE POLICY "users_select_public_profiles"
    ON public.users FOR SELECT
    USING (auth.role() = 'authenticated');


-- ==========================================================
-- follows: Users manage their own follow relationships
-- ==========================================================

-- Users can see follows they are involved in
CREATE POLICY "follows_select_own"
    ON public.follows FOR SELECT
    USING (
        auth.uid()::text = follower_id
        OR auth.uid()::text = following_id
    );

-- Users can follow others (insert where they are the follower)
CREATE POLICY "follows_insert_own"
    ON public.follows FOR INSERT
    WITH CHECK (auth.uid()::text = follower_id);

-- Users can unfollow (delete where they are the follower)
CREATE POLICY "follows_delete_own"
    ON public.follows FOR DELETE
    USING (auth.uid()::text = follower_id);


-- ==========================================================
-- words: Public content, read-only for authenticated users
-- Admin (service role) manages via server-side calls
-- ==========================================================

CREATE POLICY "words_select_authenticated"
    ON public.words FOR SELECT
    USING (auth.role() = 'authenticated');

-- No INSERT/UPDATE/DELETE policies for anon/authenticated.
-- Only service_role (server-side) can modify.


-- ==========================================================
-- videos: Public content, read-only for authenticated users
-- ==========================================================

CREATE POLICY "videos_select_authenticated"
    ON public.videos FOR SELECT
    USING (auth.role() = 'authenticated');


-- ==========================================================
-- games: Public content, read-only for authenticated users
-- ==========================================================

CREATE POLICY "games_select_authenticated"
    ON public.games FOR SELECT
    USING (auth.role() = 'authenticated');


-- ==========================================================
-- worksheets: Public content, read-only for authenticated users
-- ==========================================================

CREATE POLICY "worksheets_select_authenticated"
    ON public.worksheets FOR SELECT
    USING (auth.role() = 'authenticated');


-- ==========================================================
-- blog_posts: Publicly readable (even unauthenticated for SEO)
-- ==========================================================

CREATE POLICY "blog_posts_select_public"
    ON public.blog_posts FOR SELECT
    USING (true);

-- No INSERT/UPDATE/DELETE for client-side. Only service_role.


-- ==========================================================
-- achievements: Public reference data, read-only
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'achievements') THEN
        EXECUTE 'CREATE POLICY "achievements_select_authenticated" ON public.achievements FOR SELECT USING (auth.role() = ''authenticated'')';
    END IF;
END $$;


-- ==========================================================
-- user_achievements: Users manage their own achievements
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_achievements') THEN
        EXECUTE 'CREATE POLICY "user_achievements_select_own" ON public.user_achievements FOR SELECT USING (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "user_achievements_insert_own" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "user_achievements_update_own" ON public.user_achievements FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "user_achievements_delete_own" ON public.user_achievements FOR DELETE USING (auth.uid()::text = user_id)';
    END IF;
END $$;


-- ==========================================================
-- favorites: Users manage their own favorites
-- ==========================================================

CREATE POLICY "favorites_select_own"
    ON public.favorites FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "favorites_insert_own"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "favorites_delete_own"
    ON public.favorites FOR DELETE
    USING (auth.uid()::text = user_id);


-- ==========================================================
-- pets: Users manage their own pet (id = user id)
-- ==========================================================

CREATE POLICY "pets_select_own"
    ON public.pets FOR SELECT
    USING (auth.uid()::text = id);

CREATE POLICY "pets_insert_own"
    ON public.pets FOR INSERT
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "pets_update_own"
    ON public.pets FOR UPDATE
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);


-- ==========================================================
-- learn_audio: Public content cache, read-only
-- ==========================================================

CREATE POLICY "learn_audio_select_authenticated"
    ON public.learn_audio FOR SELECT
    USING (auth.role() = 'authenticated');


-- ==========================================================
-- activity_logs: Users manage their own activity
-- ==========================================================

CREATE POLICY "activity_logs_select_own"
    ON public.activity_logs FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "activity_logs_insert_own"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- No update/delete: activity logs are append-only


-- ==========================================================
-- phonics_mastery: Users manage their own mastery data
-- ==========================================================

CREATE POLICY "phonics_mastery_select_own"
    ON public.phonics_mastery FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "phonics_mastery_insert_own"
    ON public.phonics_mastery FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "phonics_mastery_update_own"
    ON public.phonics_mastery FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);


-- ==========================================================
-- classrooms: Teachers manage their own classrooms
-- ==========================================================

-- Teachers can see their own classrooms
CREATE POLICY "classrooms_select_teacher"
    ON public.classrooms FOR SELECT
    USING (auth.uid()::text = teacher_id);

-- Students can see classrooms they belong to
CREATE POLICY "classrooms_select_student"
    ON public.classrooms FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_students cs
            WHERE cs.classroom_id = classrooms.id
            AND cs.student_id = auth.uid()::text
        )
    );

-- Teachers can create classrooms
CREATE POLICY "classrooms_insert_teacher"
    ON public.classrooms FOR INSERT
    WITH CHECK (auth.uid()::text = teacher_id);

-- Teachers can update their own classrooms
CREATE POLICY "classrooms_update_teacher"
    ON public.classrooms FOR UPDATE
    USING (auth.uid()::text = teacher_id)
    WITH CHECK (auth.uid()::text = teacher_id);

-- Teachers can delete their own classrooms
CREATE POLICY "classrooms_delete_teacher"
    ON public.classrooms FOR DELETE
    USING (auth.uid()::text = teacher_id);


-- ==========================================================
-- classroom_students: Teachers and students manage membership
-- ==========================================================

-- Teachers can see students in their classrooms
CREATE POLICY "classroom_students_select_teacher"
    ON public.classroom_students FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = classroom_students.classroom_id
            AND c.teacher_id = auth.uid()::text
        )
    );

-- Students can see their own membership
CREATE POLICY "classroom_students_select_student"
    ON public.classroom_students FOR SELECT
    USING (auth.uid()::text = student_id);

-- Students can join classrooms (insert themselves)
CREATE POLICY "classroom_students_insert_student"
    ON public.classroom_students FOR INSERT
    WITH CHECK (auth.uid()::text = student_id);

-- Teachers can remove students from their classrooms
CREATE POLICY "classroom_students_delete_teacher"
    ON public.classroom_students FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = classroom_students.classroom_id
            AND c.teacher_id = auth.uid()::text
        )
    );

-- Students can leave classrooms (delete themselves)
CREATE POLICY "classroom_students_delete_student"
    ON public.classroom_students FOR DELETE
    USING (auth.uid()::text = student_id);


-- ==========================================================
-- parent_children: Parents manage their child links
-- ==========================================================

CREATE POLICY "parent_children_select_own"
    ON public.parent_children FOR SELECT
    USING (
        auth.uid()::text = parent_id
        OR auth.uid()::text = child_id
    );

CREATE POLICY "parent_children_insert_parent"
    ON public.parent_children FOR INSERT
    WITH CHECK (auth.uid()::text = parent_id);

CREATE POLICY "parent_children_delete_parent"
    ON public.parent_children FOR DELETE
    USING (auth.uid()::text = parent_id);


-- ==========================================================
-- garden_plants: Users manage their own garden
-- ==========================================================

CREATE POLICY "garden_plants_select_own"
    ON public.garden_plants FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "garden_plants_insert_own"
    ON public.garden_plants FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "garden_plants_update_own"
    ON public.garden_plants FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "garden_plants_delete_own"
    ON public.garden_plants FOR DELETE
    USING (auth.uid()::text = user_id);


-- ==========================================================
-- posts: Users manage their own posts, everyone can read
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'posts') THEN
        EXECUTE 'CREATE POLICY "posts_select_authenticated" ON public.posts FOR SELECT USING (auth.role() = ''authenticated'')';
        EXECUTE 'CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT WITH CHECK (auth.uid()::text = author_id)';
        EXECUTE 'CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (auth.uid()::text = author_id) WITH CHECK (auth.uid()::text = author_id)';
        EXECUTE 'CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE USING (auth.uid()::text = author_id)';
    END IF;
END $$;


-- ==========================================================
-- post_likes: Users manage their own likes
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'post_likes') THEN
        EXECUTE 'CREATE POLICY "post_likes_select_authenticated" ON public.post_likes FOR SELECT USING (auth.role() = ''authenticated'')';
        EXECUTE 'CREATE POLICY "post_likes_insert_own" ON public.post_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "post_likes_delete_own" ON public.post_likes FOR DELETE USING (auth.uid()::text = user_id)';
    END IF;
END $$;


-- ==========================================================
-- comments: Users manage their own comments, everyone can read
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        EXECUTE 'CREATE POLICY "comments_select_authenticated" ON public.comments FOR SELECT USING (auth.role() = ''authenticated'')';
        EXECUTE 'CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (auth.uid()::text = user_id)';
    END IF;
END $$;


-- ==========================================================
-- comment_likes: Users manage their own likes
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comment_likes') THEN
        EXECUTE 'CREATE POLICY "comment_likes_select_authenticated" ON public.comment_likes FOR SELECT USING (auth.role() = ''authenticated'')';
        EXECUTE 'CREATE POLICY "comment_likes_insert_own" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "comment_likes_delete_own" ON public.comment_likes FOR DELETE USING (auth.uid()::text = user_id)';
    END IF;
END $$;


-- ==========================================================
-- reports: Users can create reports, only service_role reads
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reports') THEN
        -- Users can insert reports (report other users/content)
        EXECUTE 'CREATE POLICY "reports_insert_own" ON public.reports FOR INSERT WITH CHECK (auth.uid()::text = reporter_id)';
        -- No SELECT for regular users - only service_role (admin panel) reads reports
    END IF;
END $$;


-- ==========================================================
-- story_progress: Users manage their own story progress
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'story_progress') THEN
        EXECUTE 'CREATE POLICY "story_progress_select_own" ON public.story_progress FOR SELECT USING (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "story_progress_insert_own" ON public.story_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id)';
        EXECUTE 'CREATE POLICY "story_progress_update_own" ON public.story_progress FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id)';
    END IF;
END $$;


-- ==========================================================
-- curriculum_worlds / curriculum_lessons: Public content
-- ==========================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'curriculum_worlds') THEN
        EXECUTE 'CREATE POLICY "curriculum_worlds_select_authenticated" ON public.curriculum_worlds FOR SELECT USING (auth.role() = ''authenticated'')';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'curriculum_lessons') THEN
        EXECUTE 'CREATE POLICY "curriculum_lessons_select_authenticated" ON public.curriculum_lessons FOR SELECT USING (auth.role() = ''authenticated'')';
    END IF;
END $$;


COMMIT;

-- =====================================================
-- NOTES:
-- 1. Service role (used by server-side API routes) bypasses RLS entirely.
--    Admin operations (managing games, videos, words, worksheets, blog_posts,
--    reading reports) should use the service_role key on the server.
--
-- 2. The users table has TWO select policies:
--    - users_select_own: always allows reading your own row
--    - users_select_public_profiles: authenticated users can see all profiles
--      (needed for leaderboard, follow suggestions, etc.)
--    If you want to restrict profile visibility, remove the second policy
--    and add specific columns to a view instead.
--
-- 3. If auth.uid() returns UUID and your id columns are TEXT,
--    the cast auth.uid()::text handles the comparison.
--
-- 4. Tables wrapped in DO $$ IF EXISTS blocks are optional tables
--    that may not exist in all environments.
-- =====================================================
