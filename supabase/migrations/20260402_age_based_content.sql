-- ============================================================================
-- MinesMinis — Age-Based Content System
-- Migration: Add age_group_min to words, exercises, stories_decodable
-- Based on Turkish MEB + private English schools curriculum
-- Created: 2026-04-02
-- ============================================================================

-- ============================================================================
-- STEP 1: Add age_group_min column to words table
-- ============================================================================
ALTER TABLE words ADD COLUMN IF NOT EXISTS age_group_min INT DEFAULT 3;

-- Create index for efficient age-based filtering
CREATE INDEX IF NOT EXISTS idx_words_age_group ON words(age_group_min);

-- ============================================================================
-- STEP 2: Update words with age_group_min based on category + content mapping
-- ============================================================================

-- Age 3 (Minikler): Basic colors, numbers 1-5, basic animals, greetings, basic body, family core
-- Colors: red, blue, green, yellow → age 3
UPDATE words SET age_group_min = 3 WHERE word IN ('red', 'blue', 'green', 'yellow');
-- Rest of colors → age 4
UPDATE words SET age_group_min = 4 WHERE word IN ('orange', 'pink', 'purple', 'black', 'white', 'brown', 'gold', 'gray');

-- Numbers 1-5 → age 3
UPDATE words SET age_group_min = 3 WHERE word IN ('one', 'two', 'three', 'four', 'five');
-- Numbers 6-10 → age 4
UPDATE words SET age_group_min = 4 WHERE word IN ('six', 'seven', 'eight', 'nine', 'ten', 'zero');

-- Basic animals → age 3
UPDATE words SET age_group_min = 3 WHERE word IN ('cat', 'dog', 'fish', 'bird');
-- More animals → age 4
UPDATE words SET age_group_min = 4 WHERE word IN ('duck', 'frog', 'bear', 'rabbit', 'cow', 'pig', 'hen', 'bee', 'ant', 'butterfly');
-- Complex animals → age 5
UPDATE words SET age_group_min = 5 WHERE word IN ('elephant', 'lion', 'tiger', 'penguin', 'shark', 'owl', 'fox', 'snail', 'horse', 'goat', 'lamb', 'bull', 'ram');
-- bat, rat, bug → phonics animals, age 5
UPDATE words SET age_group_min = 5 WHERE word IN ('bat', 'rat', 'bug') AND category = 'Animals';
-- tail → age 6
UPDATE words SET age_group_min = 6 WHERE word = 'tail' AND category = 'Animals';

-- Basic body → age 3
UPDATE words SET age_group_min = 3 WHERE word IN ('head', 'hand', 'foot') AND category = 'Body';
-- More body → age 4
UPDATE words SET age_group_min = 4 WHERE word IN ('eye', 'ear', 'nose', 'mouth', 'hair', 'tummy', 'arm', 'leg') AND category = 'Body';
-- Advanced body → age 5
UPDATE words SET age_group_min = 5 WHERE word IN ('finger', 'teeth', 'lip', 'chin', 'back') AND category = 'Body';

-- Family core → age 3
UPDATE words SET age_group_min = 3 WHERE word IN ('mom', 'dad', 'baby') AND category = 'Family';
-- More family → age 4
UPDATE words SET age_group_min = 4 WHERE word IN ('brother', 'sister', 'grandma', 'grandpa', 'family') AND category = 'Family';
-- Extended family → age 6
UPDATE words SET age_group_min = 6 WHERE word IN ('aunt', 'uncle', 'cousin') AND category = 'Family';

-- Food: Fruits → age 4
UPDATE words SET age_group_min = 4 WHERE word IN ('apple', 'banana', 'strawberry', 'fruit') AND category = 'Food';
-- Basic food → age 5
UPDATE words SET age_group_min = 5 WHERE word IN ('bread', 'egg', 'milk', 'water', 'juice', 'cake', 'cookie', 'rice', 'cheese', 'pizza', 'soup', 'tea', 'pie', 'corn', 'carrot', 'potato', 'meat', 'jam', 'fig', 'yam', 'bun') AND category = 'Food';

-- Nature: basic → age 5
UPDATE words SET age_group_min = 5 WHERE word IN ('sun', 'moon', 'star', 'rain', 'snow', 'cloud', 'tree', 'flower', 'grass', 'sky') AND category = 'Nature';
-- Nature: advanced → age 6
UPDATE words SET age_group_min = 6 WHERE word IN ('river', 'ocean', 'hill', 'rock', 'leaf', 'wind', 'fog', 'soil', 'fern', 'vine') AND category = 'Nature';

-- ============================================================================
-- Phonics category words: age_group_min based on phonics_group
-- Group 1 (s,a,t,i,p,n) → age 5
-- Group 2 (c,k,e,h,r,m,d) → age 5
-- Group 3 (g,o,u,l,f,b) → age 6
-- Group 4 (ai,j,oa,ie,ee,or) → age 6
-- Group 5 (z,w,ng,v,oo) → age 7
-- Group 6 (y,x,ch,sh,th) → age 7
-- Group 7 (qu,ou,oi,ue,er,ar) → age 8
-- ============================================================================
UPDATE words SET age_group_min = 5 WHERE category = 'Phonics' AND phonics_group = 1;
UPDATE words SET age_group_min = 5 WHERE category = 'Phonics' AND phonics_group = 2;
UPDATE words SET age_group_min = 6 WHERE category = 'Phonics' AND phonics_group = 3;
UPDATE words SET age_group_min = 6 WHERE category = 'Phonics' AND phonics_group = 4;
UPDATE words SET age_group_min = 7 WHERE category = 'Phonics' AND phonics_group = 5;
UPDATE words SET age_group_min = 7 WHERE category = 'Phonics' AND phonics_group = 6;
UPDATE words SET age_group_min = 8 WHERE category = 'Phonics' AND phonics_group = 7;

-- ============================================================================
-- NULL-category words (sight words, decodable words, etc.)
-- These are phonics-based, map by phonics_group
-- ============================================================================
UPDATE words SET age_group_min = 5 WHERE category IS NULL AND phonics_group IN (1, 2);
UPDATE words SET age_group_min = 6 WHERE category IS NULL AND phonics_group IN (3, 4);
UPDATE words SET age_group_min = 7 WHERE category IS NULL AND phonics_group IN (5, 6);
UPDATE words SET age_group_min = 8 WHERE category IS NULL AND phonics_group = 7;

-- Remaining categories
UPDATE words SET age_group_min = 7 WHERE category = 'adjectives';
UPDATE words SET age_group_min = 4 WHERE category = 'emotions';
UPDATE words SET age_group_min = 6 WHERE category = 'people';

-- ============================================================================
-- STEP 3: Add age_group_min column to exercises table
-- ============================================================================
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS age_group_min INT DEFAULT 3;

CREATE INDEX IF NOT EXISTS idx_exercises_age_group ON exercises(age_group_min);

-- ============================================================================
-- STEP 4: Update exercises with age_group_min based on type + difficulty
-- ============================================================================

-- Listening exercises → age 3 (sound awareness, basic listening)
UPDATE exercises SET age_group_min = 3 WHERE type = 'listening' AND difficulty = 1;
UPDATE exercises SET age_group_min = 4 WHERE type = 'listening' AND difficulty = 2;
UPDATE exercises SET age_group_min = 5 WHERE type = 'listening' AND difficulty = 3;

-- Image label (matching pictures) → age 3-4
UPDATE exercises SET age_group_min = 3 WHERE type = 'image_label' AND difficulty = 1;
UPDATE exercises SET age_group_min = 4 WHERE type = 'image_label' AND difficulty = 2;
UPDATE exercises SET age_group_min = 5 WHERE type = 'image_label' AND difficulty = 3;

-- Rhyme exercises → age 3-4 (sound awareness)
UPDATE exercises SET age_group_min = 3 WHERE type = 'rhyme' AND difficulty = 1;
UPDATE exercises SET age_group_min = 4 WHERE type = 'rhyme' AND difficulty = 2;
UPDATE exercises SET age_group_min = 5 WHERE type = 'rhyme' AND difficulty = 3;

-- Say it (TPR, pronunciation) → age 3-4
UPDATE exercises SET age_group_min = 3 WHERE type = 'say_it' AND difficulty = 1;
UPDATE exercises SET age_group_min = 4 WHERE type = 'say_it' AND difficulty = 2;
UPDATE exercises SET age_group_min = 5 WHERE type = 'say_it' AND difficulty = 3;

-- Syllable exercises → age 4-5
UPDATE exercises SET age_group_min = 4 WHERE type = 'syllable' AND difficulty = 1;
UPDATE exercises SET age_group_min = 5 WHERE type = 'syllable' AND difficulty = 2;
UPDATE exercises SET age_group_min = 6 WHERE type = 'syllable' AND difficulty = 3;

-- Blending exercises → age 5+ (phonics starts)
-- Also respect phonics_group for more granularity
UPDATE exercises SET age_group_min = 5 WHERE type = 'blending' AND (phonics_group IS NULL OR phonics_group IN (1, 2));
UPDATE exercises SET age_group_min = 6 WHERE type = 'blending' AND phonics_group IN (3, 4);
UPDATE exercises SET age_group_min = 7 WHERE type = 'blending' AND phonics_group IN (5, 6);
UPDATE exercises SET age_group_min = 8 WHERE type = 'blending' AND phonics_group = 7;

-- Word family → age 5-6
UPDATE exercises SET age_group_min = 5 WHERE type = 'word_family' AND difficulty = 1;
UPDATE exercises SET age_group_min = 6 WHERE type = 'word_family' AND difficulty = 2;
UPDATE exercises SET age_group_min = 7 WHERE type = 'word_family' AND difficulty = 3;

-- Phoneme manipulation → age 6+
UPDATE exercises SET age_group_min = 6 WHERE type = 'phoneme_manipulation' AND difficulty = 1;
UPDATE exercises SET age_group_min = 7 WHERE type = 'phoneme_manipulation' AND difficulty = 2;
UPDATE exercises SET age_group_min = 8 WHERE type = 'phoneme_manipulation' AND difficulty = 3;

-- Grammar → age 7+
UPDATE exercises SET age_group_min = 7 WHERE type = 'grammar' AND difficulty = 1;
UPDATE exercises SET age_group_min = 7 WHERE type = 'grammar' AND difficulty = 2;
UPDATE exercises SET age_group_min = 8 WHERE type = 'grammar' AND difficulty = 3;

-- Dialogue → age 7+
UPDATE exercises SET age_group_min = 7 WHERE type = 'dialogue' AND difficulty = 1;
UPDATE exercises SET age_group_min = 7 WHERE type = 'dialogue' AND difficulty = 2;
UPDATE exercises SET age_group_min = 8 WHERE type = 'dialogue' AND difficulty = 3;

-- ============================================================================
-- STEP 5: Add age_group_min column to stories_decodable table
-- ============================================================================
ALTER TABLE stories_decodable ADD COLUMN IF NOT EXISTS age_group_min INT DEFAULT 5;

CREATE INDEX IF NOT EXISTS idx_stories_age_group ON stories_decodable(age_group_min);

-- ============================================================================
-- STEP 6: Update stories_decodable based on phonics_group
-- ============================================================================

-- Group 1-2 stories → age 5 (Hazırlık)
UPDATE stories_decodable SET age_group_min = 5 WHERE phonics_group IN (1, 2);

-- Group 3-4 stories → age 6 (1. Sınıf)
UPDATE stories_decodable SET age_group_min = 6 WHERE phonics_group IN (3, 4);

-- Group 5+ stories → age 7 (2. Sınıf)
UPDATE stories_decodable SET age_group_min = 7 WHERE phonics_group >= 5;

-- ============================================================================
-- STEP 7: Create age_groups reference table
-- ============================================================================
CREATE TABLE IF NOT EXISTS age_groups (
  id INT PRIMARY KEY,
  label TEXT NOT NULL,
  label_tr TEXT NOT NULL,
  age_min INT NOT NULL,
  age_max INT NOT NULL,
  grade_tr TEXT NOT NULL,
  description TEXT NOT NULL,
  description_tr TEXT NOT NULL,
  max_words INT NOT NULL,
  phonics_groups INT[] DEFAULT '{}',
  unlocked_exercise_types TEXT[] DEFAULT '{}',
  unlocked_game_types TEXT[] DEFAULT '{}',
  unlocked_story_types TEXT[] DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0
);

-- Insert age group definitions
INSERT INTO age_groups (id, label, label_tr, age_min, age_max, grade_tr, description, description_tr, max_words, phonics_groups, unlocked_exercise_types, unlocked_game_types, unlocked_story_types, sort_order)
VALUES
  (3, 'Toddlers', 'Minikler', 3, 4, 'Anaokulu (3-4 yaş)',
   'Sound awareness, basic vocabulary (~30 words), picture matching, TPR',
   'Ses farkındalığı, temel kelime hazinesi (~30 kelime), resim eşleştirme, TPR',
   30, '{}',
   '{"listening","image_label","rhyme","say_it"}',
   '{"image_match","color_sort"}',
   '{"picture_only"}',
   1),
  (4, 'Little Ones', 'Küçükler', 4, 5, 'Anaokulu (4-5 yaş)',
   'Sound awareness, letter names, expanded vocabulary (~60 words), simple songs',
   'Ses farkındalığı, harf isimleri, genişletilmiş kelime hazinesi (~60 kelime), basit şarkılar',
   60, '{}',
   '{"listening","image_label","rhyme","say_it","syllable"}',
   '{"image_match","color_sort","word_match","picture_quiz"}',
   '{"picture_with_words"}',
   2),
  (5, 'Pre-school', 'Hazırlık', 5, 6, 'Hazırlık (5-6 yaş)',
   'Phonics groups 1-2, blending intro, letter tracing, ~100 words, simple CVC stories',
   'Fonik grupları 1-2, birleştirme girişi, harf çizimi, ~100 kelime, basit CVC hikayeleri',
   100, '{1,2}',
   '{"listening","image_label","rhyme","say_it","syllable","blending","word_family"}',
   '{"image_match","color_sort","word_match","picture_quiz","spelling_bee_3"}',
   '{"picture_with_words","cvc_stories"}',
   3),
  (6, 'Grade 1', '1. Sınıf', 6, 7, '1. Sınıf (6-7 yaş)',
   'Phonics groups 1-4, blending & segmenting, reading/writing CVC, ~180 words, decodable stories',
   'Fonik grupları 1-4, birleştirme ve ayırma, CVC okuma/yazma, ~180 kelime, çözümlenebilir hikayeler',
   180, '{1,2,3,4}',
   '{"listening","image_label","rhyme","say_it","syllable","blending","word_family","phoneme_manipulation"}',
   '{"image_match","color_sort","word_match","picture_quiz","spelling_bee_3","quick_quiz","spelling_bee_4"}',
   '{"picture_with_words","cvc_stories","decodable_stories"}',
   4),
  (7, 'Grade 2', '2. Sınıf', 7, 8, '2. Sınıf (7-8 yaş)',
   'Phonics groups 1-6, reading fluency, grammar basics, dialogue, ~300 words',
   'Fonik grupları 1-6, okuma akıcılığı, gramer temelleri, diyalog, ~300 kelime',
   300, '{1,2,3,4,5,6}',
   '{"listening","image_label","rhyme","say_it","syllable","blending","word_family","phoneme_manipulation","grammar","dialogue"}',
   '{"image_match","color_sort","word_match","picture_quiz","spelling_bee_3","quick_quiz","spelling_bee_4","sentence_building","grammar_games"}',
   '{"picture_with_words","cvc_stories","decodable_stories","comprehension_stories"}',
   5),
  (8, 'Grades 3-4', '3-4. Sınıf', 8, 10, '3-4. Sınıf (8-10 yaş)',
   'All 7 phonics groups, full curriculum, all 462 words, adventure mode',
   'Tüm 7 fonik grubu, tam müfredat, tüm 462 kelime, macera modu',
   462, '{1,2,3,4,5,6,7}',
   '{"listening","image_label","rhyme","say_it","syllable","blending","word_family","phoneme_manipulation","grammar","dialogue"}',
   '{"image_match","color_sort","word_match","picture_quiz","spelling_bee_3","quick_quiz","spelling_bee_4","sentence_building","grammar_games","full_difficulty"}',
   '{"picture_with_words","cvc_stories","decodable_stories","comprehension_stories","adventure_stories"}',
   6)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  label_tr = EXCLUDED.label_tr,
  age_min = EXCLUDED.age_min,
  age_max = EXCLUDED.age_max,
  grade_tr = EXCLUDED.grade_tr,
  description = EXCLUDED.description,
  description_tr = EXCLUDED.description_tr,
  max_words = EXCLUDED.max_words,
  phonics_groups = EXCLUDED.phonics_groups,
  unlocked_exercise_types = EXCLUDED.unlocked_exercise_types,
  unlocked_game_types = EXCLUDED.unlocked_game_types,
  unlocked_story_types = EXCLUDED.unlocked_story_types,
  sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- VERIFICATION QUERIES (informational)
-- ============================================================================
-- Run these after migration to verify:
-- SELECT age_group_min, count(*) FROM words GROUP BY age_group_min ORDER BY age_group_min;
-- SELECT age_group_min, count(*) FROM exercises GROUP BY age_group_min ORDER BY age_group_min;
-- SELECT age_group_min, count(*) FROM stories_decodable GROUP BY age_group_min ORDER BY age_group_min;
-- SELECT * FROM age_groups ORDER BY sort_order;
