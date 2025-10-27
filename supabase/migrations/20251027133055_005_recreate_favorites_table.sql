/*
  # Recreate Favorites Table with Correct Schema

  1. Changes
    - Drop old favorites table
    - Create new favorites table with correct columns
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `item_type` (text: 'game', 'word', 'worksheet', 'video')
      - `item_id` (text: stores the item's ID as string)
      - `item_name` (text: display name)
      - `item_image` (text: thumbnail URL, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can only manage their own favorites
    - Policies for select, insert, delete
*/

-- Drop old table if exists
DROP TABLE IF EXISTS favorites CASCADE;

-- Create new favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('game', 'word', 'worksheet', 'video')),
  item_id text NOT NULL,
  item_name text NOT NULL,
  item_image text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS favorites_user_item_unique 
  ON favorites(user_id, item_type, item_id);

-- RLS Policies
CREATE POLICY "Users can view own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
