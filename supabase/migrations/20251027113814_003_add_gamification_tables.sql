/*
  # Add Gamification and Enhanced Features

  1. New Tables
    - `levels` - Level definitions with XP requirements and perks
    - `game_scores` - Individual game play scores and leaderboards
    - `daily_streaks` - Track user daily activity streaks
    - `avatar_items` - Unlockable avatar customization items
    - `user_items` - Items owned by users
    
  2. Changes to Existing Tables
    - Add `level` and `xp` columns to users table
    - Add `featured_badge` to users for profile customization
    
  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access
*/

-- Add level and XP tracking to users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'level'
  ) THEN
    ALTER TABLE users ADD COLUMN level integer DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'xp'
  ) THEN
    ALTER TABLE users ADD COLUMN xp integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'featured_badge'
  ) THEN
    ALTER TABLE users ADD COLUMN featured_badge text;
  END IF;
END $$;

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL,
  xp_required integer NOT NULL,
  title text NOT NULL,
  perks jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view levels"
  ON levels FOR SELECT
  TO authenticated
  USING (true);

-- Game scores table for leaderboards
CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  time_taken integer,
  accuracy integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all game scores"
  ON game_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own game scores"
  ON game_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Daily streaks tracking
CREATE TABLE IF NOT EXISTS daily_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  streak_date date NOT NULL,
  activities_completed integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, streak_date)
);

ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON daily_streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON daily_streaks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON daily_streaks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Avatar items for customization
CREATE TABLE IF NOT EXISTS avatar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text,
  price integer DEFAULT 0,
  unlock_level integer DEFAULT 1,
  rarity text DEFAULT 'common',
  created_at timestamptz DEFAULT now(),
  CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary'))
);

ALTER TABLE avatar_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view avatar items"
  ON avatar_items FOR SELECT
  TO authenticated
  USING (true);

-- User owned items
CREATE TABLE IF NOT EXISTS user_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES avatar_items(id) ON DELETE CASCADE,
  is_equipped boolean DEFAULT false,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items"
  ON user_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON user_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON user_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert level data
INSERT INTO levels (level_number, xp_required, title, perks) VALUES
  (1, 0, 'Beginner', '["Welcome to the platform!"]'::jsonb),
  (5, 500, 'Novice', '["Unlock custom avatar"]'::jsonb),
  (10, 1500, 'Learner', '["Unlock profile themes"]'::jsonb),
  (15, 3000, 'Scholar', '["Unlock stickers"]'::jsonb),
  (20, 5000, 'Expert', '["Special badge frame"]'::jsonb),
  (25, 8000, 'Master', '["Create polls"]'::jsonb),
  (30, 12000, 'Champion', '["Unlock stories"]'::jsonb),
  (50, 25000, 'Legend', '["Platinum badge"]'::jsonb),
  (100, 55000, 'Mythic', '["Diamond badge"]'::jsonb)
ON CONFLICT (level_number) DO NOTHING;