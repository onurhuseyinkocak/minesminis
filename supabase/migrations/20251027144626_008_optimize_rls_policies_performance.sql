/*
  # Optimize RLS Policies for Performance

  ## Performance Optimization
  
  This migration optimizes all RLS policies by wrapping auth.uid() calls in SELECT.
  This prevents re-evaluation of auth.uid() for each row, significantly improving
  query performance at scale.
  
  ## Changes
  
  Replace all instances of:
    - `auth.uid()` with `(select auth.uid())`
  
  This optimization applies to all tables with RLS policies:
  - users
  - follows
  - posts
  - post_likes
  - comments
  - worksheets
  - vocabulary
  - games
  - videos
  - user_achievements
  - user_items
  - user_progress
  - notifications
  - reports
  - game_scores
  - daily_streaks
  - favorites
*/

-- Drop and recreate all RLS policies with optimized auth.uid() calls

-- ============================================================================
-- USERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- ============================================================================
-- FOLLOWS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can follow others" ON follows;
CREATE POLICY "Users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (follower_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can unfollow" ON follows;
CREATE POLICY "Users can unfollow"
  ON follows
  FOR DELETE
  TO authenticated
  USING (follower_id = (select auth.uid()));

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Posts are viewable based on visibility" ON posts;
CREATE POLICY "Posts are viewable based on visibility"
  ON posts
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'public' OR
    author_id = (select auth.uid()) OR
    (visibility = 'followers' AND EXISTS (
      SELECT 1 FROM follows WHERE following_id = posts.author_id AND follower_id = (select auth.uid())
    ))
  );

DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (author_id = (select auth.uid()))
  WITH CHECK (author_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (author_id = (select auth.uid()));

-- ============================================================================
-- POST_LIKES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can like posts" ON post_likes;
CREATE POLICY "Users can like posts"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can unlike posts" ON post_likes;
CREATE POLICY "Users can unlike posts"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can create comments" ON comments;
CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (author_id = (select auth.uid()))
  WITH CHECK (author_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (author_id = (select auth.uid()));

-- ============================================================================
-- WORKSHEETS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Teachers can create worksheets" ON worksheets;
CREATE POLICY "Teachers can create worksheets"
  ON worksheets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM users WHERE id = (select auth.uid()) AND role = 'teacher')
  );

DROP POLICY IF EXISTS "Teachers can update own worksheets" ON worksheets;
CREATE POLICY "Teachers can update own worksheets"
  ON worksheets
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = (select auth.uid()))
  WITH CHECK (uploaded_by = (select auth.uid()));

DROP POLICY IF EXISTS "Teachers can delete own worksheets" ON worksheets;
CREATE POLICY "Teachers can delete own worksheets"
  ON worksheets
  FOR DELETE
  TO authenticated
  USING (uploaded_by = (select auth.uid()));

-- ============================================================================
-- VOCABULARY TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own vocabulary" ON vocabulary;
CREATE POLICY "Users can view own vocabulary"
  ON vocabulary
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create vocabulary" ON vocabulary;
CREATE POLICY "Users can create vocabulary"
  ON vocabulary
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own vocabulary" ON vocabulary;
CREATE POLICY "Users can update own vocabulary"
  ON vocabulary
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own vocabulary" ON vocabulary;
CREATE POLICY "Users can delete own vocabulary"
  ON vocabulary
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- GAMES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Teachers can create games" ON games;
CREATE POLICY "Teachers can create games"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (
    added_by = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM users WHERE id = (select auth.uid()) AND role = 'teacher')
  );

DROP POLICY IF EXISTS "Teachers can update own games" ON games;
CREATE POLICY "Teachers can update own games"
  ON games
  FOR UPDATE
  TO authenticated
  USING (added_by = (select auth.uid()))
  WITH CHECK (added_by = (select auth.uid()));

DROP POLICY IF EXISTS "Teachers can delete own games" ON games;
CREATE POLICY "Teachers can delete own games"
  ON games
  FOR DELETE
  TO authenticated
  USING (added_by = (select auth.uid()));

-- ============================================================================
-- VIDEOS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Teachers can create videos" ON videos;
CREATE POLICY "Teachers can create videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    added_by = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM users WHERE id = (select auth.uid()) AND role = 'teacher')
  );

DROP POLICY IF EXISTS "Teachers can update own videos" ON videos;
CREATE POLICY "Teachers can update own videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (added_by = (select auth.uid()))
  WITH CHECK (added_by = (select auth.uid()));

DROP POLICY IF EXISTS "Teachers can delete own videos" ON videos;
CREATE POLICY "Teachers can delete own videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (added_by = (select auth.uid()));

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "System can award achievements" ON user_achievements;
CREATE POLICY "System can award achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- USER_ITEMS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own items" ON user_items;
CREATE POLICY "Users can view own items"
  ON user_items
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own items" ON user_items;
CREATE POLICY "Users can insert own items"
  ON user_items
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own items" ON user_items;
CREATE POLICY "Users can update own items"
  ON user_items
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- USER_PROGRESS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create progress" ON user_progress;
CREATE POLICY "Users can create progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- REPORTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (reporter_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create reports" ON reports;
CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = (select auth.uid()));

DROP POLICY IF EXISTS "Teachers can update reports" ON reports;
CREATE POLICY "Teachers can update reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = (select auth.uid()) AND role = 'teacher'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = (select auth.uid()) AND role = 'teacher'));

-- ============================================================================
-- GAME_SCORES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can insert own game scores" ON game_scores;
CREATE POLICY "Users can insert own game scores"
  ON game_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- DAILY_STREAKS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own streaks" ON daily_streaks;
CREATE POLICY "Users can view own streaks"
  ON daily_streaks
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own streaks" ON daily_streaks;
CREATE POLICY "Users can insert own streaks"
  ON daily_streaks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own streaks" ON daily_streaks;
CREATE POLICY "Users can update own streaks"
  ON daily_streaks
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- FAVORITES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
CREATE POLICY "Users can add favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
