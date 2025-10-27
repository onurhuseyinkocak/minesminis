/*
  # Seed Initial Data

  ## Overview
  This migration populates the database with initial achievements and daily challenges
  to kickstart the gamification system.

  ## Seeded Data

  ### Achievements
  - First Steps - Complete registration
  - Vocabulary Master - Learn 100 words
  - Social Butterfly - Get 50 followers
  - Helpful Teacher - Upload 20 worksheets
  - Game Champion - Top score in 5 games
  - Streak Master - 30 day login streak
  - Creative Mind - Post 50 times
  - Word Wizard - Use dictionary 100 times

  ### Daily Challenges
  - Sample daily challenges for users to complete
*/

-- Insert achievements
INSERT INTO achievements (name, description, icon, requirement, points, rarity) VALUES
  ('First Steps', 'Welcome to the platform! Complete your profile to get started.', '🎉', '{"type": "profile_complete"}', 10, 'common'),
  ('Vocabulary Master', 'Learn 100 new words in your vocabulary notebook.', '📚', '{"type": "vocabulary_count", "target": 100}', 100, 'rare'),
  ('Social Butterfly', 'Build your community by getting 50 followers.', '🦋', '{"type": "followers_count", "target": 50}', 75, 'rare'),
  ('Helpful Teacher', 'Share knowledge by uploading 20 worksheets.', '👨‍🏫', '{"type": "worksheets_uploaded", "target": 20}', 150, 'epic'),
  ('Game Champion', 'Achieve top scores in 5 different games.', '🏆', '{"type": "game_wins", "target": 5}', 80, 'rare'),
  ('Streak Master', 'Login every day for 30 consecutive days.', '🔥', '{"type": "login_streak", "target": 30}', 200, 'epic'),
  ('Creative Mind', 'Express yourself by creating 50 posts.', '🎨', '{"type": "posts_created", "target": 50}', 90, 'rare'),
  ('Word Wizard', 'Use the dictionary 100 times to expand your vocabulary.', '🧙', '{"type": "dictionary_uses", "target": 100}', 60, 'common'),
  ('Early Bird', 'Login before 7 AM for 7 consecutive days.', '🌅', '{"type": "early_login", "target": 7}', 50, 'common'),
  ('Night Owl', 'Complete activities after 10 PM for 7 days.', '🦉', '{"type": "late_activity", "target": 7}', 50, 'common'),
  ('Perfectionist', 'Complete 10 worksheets with 100% score.', '⭐', '{"type": "perfect_scores", "target": 10}', 120, 'epic'),
  ('Team Player', 'Help 25 classmates by commenting on their posts.', '🤝', '{"type": "helpful_comments", "target": 25}', 70, 'rare'),
  ('Quick Learner', 'Complete 5 worksheets in one day.', '⚡', '{"type": "worksheets_per_day", "target": 5}', 40, 'common'),
  ('Video Enthusiast', 'Watch 50 educational videos.', '🎬', '{"type": "videos_watched", "target": 50}', 65, 'rare'),
  ('Grammar Guru', 'Complete 30 grammar worksheets.', '📝', '{"type": "grammar_worksheets", "target": 30}', 85, 'rare')
ON CONFLICT DO NOTHING;

-- Insert sample daily challenges
INSERT INTO daily_challenges (title, description, challenge_type, requirement, points, date) VALUES
  ('Complete 3 Worksheets', 'Finish any 3 worksheets today to earn bonus points!', 'worksheets', '{"target": 3}', 30, CURRENT_DATE),
  ('Learn 5 New Words', 'Add 5 new words to your vocabulary notebook.', 'vocabulary', '{"target": 5}', 20, CURRENT_DATE),
  ('Watch 2 Videos', 'Watch any 2 educational videos.', 'videos', '{"target": 2}', 15, CURRENT_DATE),
  ('Post About Learning', 'Share what you learned today with a post.', 'posts', '{"target": 1}', 25, CURRENT_DATE),
  ('Help a Classmate', 'Leave a helpful comment on another student''s post.', 'comments', '{"target": 1}', 10, CURRENT_DATE)
ON CONFLICT DO NOTHING;