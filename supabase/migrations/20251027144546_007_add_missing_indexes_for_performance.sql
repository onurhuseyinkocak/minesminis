/*
  # Add Missing Indexes for Foreign Keys

  ## Performance Optimization
  
  This migration adds indexes for all foreign key columns that were missing them.
  These indexes significantly improve query performance for:
  - JOIN operations
  - Foreign key constraint checks
  - Queries filtering by foreign key columns
  
  ## Indexes Added
  
  1. Comments table:
     - `comments_author_id_idx` - For author lookups
     - `comments_parent_id_idx` - For nested comment queries
  
  2. Game scores table:
     - `game_scores_game_id_idx` - For game score lookups
     - `game_scores_user_id_idx` - For user score history
  
  3. Reports table:
     - `reports_reporter_id_idx` - For finding user's reports
     - `reports_reviewed_by_idx` - For admin review queries
  
  4. User achievements table:
     - `user_achievements_achievement_id_idx` - For achievement stats
  
  5. User items table:
     - `user_items_item_id_idx` - For item inventory queries
  
  6. User progress table:
     - `user_progress_challenge_id_idx` - For challenge tracking
     - `user_progress_game_id_idx` - For game progress
     - `user_progress_video_id_idx` - For video progress
     - `user_progress_worksheet_id_idx` - For worksheet progress
  
  7. Videos table:
     - `videos_curated_by_idx` - For curator queries
*/

-- Comments table indexes
CREATE INDEX IF NOT EXISTS comments_author_id_idx ON comments(author_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

-- Game scores table indexes  
CREATE INDEX IF NOT EXISTS game_scores_game_id_idx ON game_scores(game_id);
CREATE INDEX IF NOT EXISTS game_scores_user_id_idx ON game_scores(user_id);

-- Reports table indexes
CREATE INDEX IF NOT EXISTS reports_reporter_id_idx ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS reports_reviewed_by_idx ON reports(reviewed_by);

-- User achievements table index
CREATE INDEX IF NOT EXISTS user_achievements_achievement_id_idx ON user_achievements(achievement_id);

-- User items table index
CREATE INDEX IF NOT EXISTS user_items_item_id_idx ON user_items(item_id);

-- User progress table indexes
CREATE INDEX IF NOT EXISTS user_progress_challenge_id_idx ON user_progress(challenge_id);
CREATE INDEX IF NOT EXISTS user_progress_game_id_idx ON user_progress(game_id);
CREATE INDEX IF NOT EXISTS user_progress_video_id_idx ON user_progress(video_id);
CREATE INDEX IF NOT EXISTS user_progress_worksheet_id_idx ON user_progress(worksheet_id);

-- Videos table index
CREATE INDEX IF NOT EXISTS videos_curated_by_idx ON videos(curated_by);
