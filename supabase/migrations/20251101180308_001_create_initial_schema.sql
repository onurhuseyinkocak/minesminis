/*
  # Create Initial Schema for English Learning Platform

  ## New Tables
  - users: Core user profiles
  - follows: User relationships
  - posts: Social media posts
  - post_likes: Like tracking
  - comments: Post comments
  - worksheets: Educational content
  - games: Learning games
  - videos: Educational videos
  - achievements: Badge definitions
  - user_achievements: Earned badges
  - vocabulary: Personal word lists
  - daily_challenges: Daily tasks
  - user_progress: Learning progress
  - notifications: User notifications
  - favorites: Saved content
  - reports: Content moderation

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('teacher', 'student')),
  display_name text NOT NULL,
  avatar_url text,
  bio text DEFAULT '',
  grade text,
  subjects text[] DEFAULT '{}',
  points integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  streak_days integer DEFAULT 0,
  last_login timestamptz DEFAULT now(),
  is_online boolean DEFAULT false,
  settings jsonb DEFAULT '{}',
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES users(id) ON DELETE CASCADE,
  following_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_url text,
  media_type text,
  post_type text DEFAULT 'text',
  visibility text DEFAULT 'everyone' CHECK (visibility IN ('everyone', 'students', 'teachers', 'followers', 'private')),
  hashtags text[] DEFAULT '{}',
  mentions text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  subject text NOT NULL,
  grade text NOT NULL,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  uploaded_by uuid REFERENCES users(id) ON DELETE CASCADE,
  visibility text DEFAULT 'everyone',
  tags text[] DEFAULT '{}',
  downloads integer DEFAULT 0,
  completions integer DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  thumbnail_url text,
  description text,
  added_by uuid REFERENCES users(id) ON DELETE CASCADE,
  target_audience text,
  plays integer DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail text,
  duration text,
  category text NOT NULL,
  channel_name text,
  added_by uuid REFERENCES users(id) ON DELETE CASCADE,
  curated_by uuid REFERENCES users(id),
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement jsonb NOT NULL,
  points integer DEFAULT 0,
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  word text NOT NULL,
  definition text,
  phonetic text,
  audio_url text,
  examples text[] DEFAULT '{}',
  synonyms text[] DEFAULT '{}',
  antonyms text[] DEFAULT '{}',
  notes text,
  category text,
  mastery_level integer DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL,
  requirement jsonb NOT NULL,
  points integer DEFAULT 0,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES daily_challenges(id) ON DELETE SET NULL,
  worksheet_id uuid REFERENCES worksheets(id) ON DELETE SET NULL,
  game_id uuid REFERENCES games(id) ON DELETE SET NULL,
  video_id uuid REFERENCES videos(id) ON DELETE SET NULL,
  status text DEFAULT 'in_progress' CHECK (status IN ('completed', 'in_progress')),
  score integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  item_name text,
  item_image text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  reviewed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view all follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  TO authenticated
  USING (follower_id = auth.uid());

CREATE POLICY "Posts are viewable based on visibility"
  ON posts FOR SELECT
  TO authenticated
  USING (
    visibility = 'everyone' OR
    author_id = auth.uid()
  );

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can view all post likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can view all worksheets"
  ON worksheets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all games"
  ON games FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all videos"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all user achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can award achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own vocabulary"
  ON vocabulary FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create vocabulary"
  ON vocabulary FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vocabulary"
  ON vocabulary FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own vocabulary"
  ON vocabulary FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view all challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_worksheets_uploaded_by ON worksheets(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_games_added_by ON games(added_by);
CREATE INDEX IF NOT EXISTS idx_videos_added_by ON videos(added_by);
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);