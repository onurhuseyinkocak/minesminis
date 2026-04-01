-- MinesMinis Words Seed Data
-- Auto-generated from wordsData.ts + decodableWordbank.ts
-- Total unique words: 459
-- Generated: 2026-04-01T15:00:48.156Z

-- Uses INSERT ... WHERE NOT EXISTS pattern to avoid duplicates
-- If a word already exists, it will be updated with the new data

BEGIN;

-- sat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sat', 'oturdu', '🪑', 1, 'beginner', 'Phonics', 'verb', NULL, 'The cat sat on a mat.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sat');

UPDATE words SET
  turkish = 'oturdu',
  emoji = '🪑',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'The cat sat on a mat.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sat';

-- sit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sit', 'oturmak', '🪑', 1, 'beginner', 'Phonics', 'verb', NULL, 'Please sit down.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sit');

UPDATE words SET
  turkish = 'oturmak',
  emoji = '🪑',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'Please sit down.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sit';

-- sip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sip', 'yudum', '🥤', 1, 'beginner', 'Phonics', 'verb', NULL, 'Take a sip of water.', 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sip');

UPDATE words SET
  turkish = 'yudum',
  emoji = '🥤',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'Take a sip of water.',
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sip';

-- tip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tip', 'uç', '☝️', 1, 'beginner', 'Phonics', 'noun', NULL, 'Touch the tip of your finger.', 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tip');

UPDATE words SET
  turkish = 'uç',
  emoji = '☝️',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Touch the tip of your finger.',
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tip';

-- tap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tap', 'musluk', '🚰', 1, 'beginner', 'Phonics', 'verb', NULL, 'Tap the drum.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tap');

UPDATE words SET
  turkish = 'musluk',
  emoji = '🚰',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'Tap the drum.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tap';

-- tin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tin', 'teneke', '🥫', 1, 'beginner', 'Phonics', 'noun', NULL, 'The tin can is on the shelf.', 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tin');

UPDATE words SET
  turkish = 'teneke',
  emoji = '🥫',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The tin can is on the shelf.',
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tin';

-- pin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pin', 'iğne', '📌', 1, 'beginner', 'Phonics', 'noun', NULL, 'Pin the paper on the board.', 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pin');

UPDATE words SET
  turkish = 'iğne',
  emoji = '📌',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Pin the paper on the board.',
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pin';

-- pan
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pan', 'tava', '🍳', 1, 'beginner', 'Phonics', 'noun', NULL, 'Put the egg in the pan.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pan');

UPDATE words SET
  turkish = 'tava',
  emoji = '🍳',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Put the egg in the pan.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pan';

-- nap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'nap', 'şekerleme', '😴', 1, 'beginner', 'Phonics', 'noun', NULL, 'The baby takes a nap.', 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'nap');

UPDATE words SET
  turkish = 'şekerleme',
  emoji = '😴',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The baby takes a nap.',
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'nap';

-- nut
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'nut', 'fındık', '🥜', 1, 'beginner', 'Phonics', 'noun', NULL, NULL, 2, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'nut');

UPDATE words SET
  turkish = 'fındık',
  emoji = '🥜',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 2,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'nut';

-- pit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pit', 'çukur', '🕳️', 1, 'beginner', 'Phonics', 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pit');

UPDATE words SET
  turkish = 'çukur',
  emoji = '🕳️',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pit';

-- pat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pat', 'hafifçe vurmak', '🤚', 1, 'beginner', 'Phonics', 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pat');

UPDATE words SET
  turkish = 'hafifçe vurmak',
  emoji = '🤚',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pat';

-- tan
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tan', 'bronzluk', '🌅', 1, 'beginner', 'Phonics', 'adjective', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tan');

UPDATE words SET
  turkish = 'bronzluk',
  emoji = '🌅',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tan';

-- ant
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ant', 'karınca', '🐜', 1, 'beginner', 'Animals', 'noun', NULL, 'An ant is very small.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ant');

UPDATE words SET
  turkish = 'karınca',
  emoji = '🐜',
  phonics_group = 1,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'An ant is very small.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ant';

-- snap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'snap', 'şıklatmak', '🫰', 1, 'beginner', 'Phonics', 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'snap');

UPDATE words SET
  turkish = 'şıklatmak',
  emoji = '🫰',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'snap';

-- spin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'spin', 'dönmek', '🌀', 1, 'beginner', 'Phonics', 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'spin');

UPDATE words SET
  turkish = 'dönmek',
  emoji = '🌀',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'spin';

-- pant
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pant', 'solumak', '😮‍💨', 1, 'beginner', 'Phonics', 'verb', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pant');

UPDATE words SET
  turkish = 'solumak',
  emoji = '😮‍💨',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pant';

-- satin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'satin', 'saten', '🧵', 1, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'satin');

UPDATE words SET
  turkish = 'saten',
  emoji = '🧵',
  phonics_group = 1,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'satin';

-- paint
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'paint', 'boya', '🎨', 1, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'paint');

UPDATE words SET
  turkish = 'boya',
  emoji = '🎨',
  phonics_group = 1,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'paint';

-- saint
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'saint', 'aziz', '😇', 1, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'saint');

UPDATE words SET
  turkish = 'aziz',
  emoji = '😇',
  phonics_group = 1,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'saint';

-- pants
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pants', 'pantolon', '👖', 1, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pants');

UPDATE words SET
  turkish = 'pantolon',
  emoji = '👖',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'pants';

-- stamp
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'stamp', 'pul', '📮', 1, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'stamp');

UPDATE words SET
  turkish = 'pul',
  emoji = '📮',
  phonics_group = 1,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'stamp';

-- sting
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sting', 'sokmak', '🐝', 1, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sting');

UPDATE words SET
  turkish = 'sokmak',
  emoji = '🐝',
  phonics_group = 1,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'sting';

-- snip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'snip', 'kesmek', '✂️', 1, 'beginner', 'Phonics', 'verb', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'snip');

UPDATE words SET
  turkish = 'kesmek',
  emoji = '✂️',
  phonics_group = 1,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'snip';

-- cat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cat', 'kedi', '🐱', 2, 'beginner', 'Animals', 'noun', NULL, 'My cat is soft.', 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cat');

UPDATE words SET
  turkish = 'kedi',
  emoji = '🐱',
  phonics_group = 2,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'My cat is soft.',
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'cat';

-- cap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cap', 'şapka', '🧢', 2, 'beginner', 'Phonics', 'noun', NULL, 'I wear a red cap.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cap');

UPDATE words SET
  turkish = 'şapka',
  emoji = '🧢',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I wear a red cap.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'cap';

-- car
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'car', 'araba', '🚗', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'car');

UPDATE words SET
  turkish = 'araba',
  emoji = '🚗',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'car';

-- can
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'can', 'kutu', '🫙', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'can');

UPDATE words SET
  turkish = 'kutu',
  emoji = '🫙',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'can';

-- cup
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cup', 'fincan', '☕', 2, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cup');

UPDATE words SET
  turkish = 'fincan',
  emoji = '☕',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'cup';

-- cut
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cut', 'kesmek', '✂️', 2, 'beginner', 'Phonics', 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cut');

UPDATE words SET
  turkish = 'kesmek',
  emoji = '✂️',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'cut';

-- hen
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hen', 'tavuk', '🐔', 2, 'beginner', 'Animals', 'noun', NULL, 'The hen lays eggs.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hen');

UPDATE words SET
  turkish = 'tavuk',
  emoji = '🐔',
  phonics_group = 2,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The hen lays eggs.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hen';

-- hat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hat', 'şapka', '🎩', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hat');

UPDATE words SET
  turkish = 'şapka',
  emoji = '🎩',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hat';

-- hid
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hid', 'saklandı', '🙈', 2, 'beginner', 'Phonics', 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hid');

UPDATE words SET
  turkish = 'saklandı',
  emoji = '🙈',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hid';

-- hot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hot', 'sıcak', '🔥', 2, 'beginner', 'Phonics', 'adjective', NULL, 'The soup is hot.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hot');

UPDATE words SET
  turkish = 'sıcak',
  emoji = '🔥',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = 'The soup is hot.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hot';

-- hut
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hut', 'kulübe', '🛖', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hut');

UPDATE words SET
  turkish = 'kulübe',
  emoji = '🛖',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hut';

-- red
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'red', 'kırmızı', '🔴', 2, 'beginner', 'Colors', 'adjective', NULL, 'The apple is red.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'red');

UPDATE words SET
  turkish = 'kırmızı',
  emoji = '🔴',
  phonics_group = 2,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = 'The apple is red.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'red';

-- run
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'run', 'koşmak', '🏃', 2, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'run');

UPDATE words SET
  turkish = 'koşmak',
  emoji = '🏃',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'run';

-- ram
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ram', 'koç', '🐏', 2, 'beginner', 'Animals', 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ram');

UPDATE words SET
  turkish = 'koç',
  emoji = '🐏',
  phonics_group = 2,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ram';

-- rat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rat', 'sıçan', '🐀', 2, 'beginner', 'Animals', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rat');

UPDATE words SET
  turkish = 'sıçan',
  emoji = '🐀',
  phonics_group = 2,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'rat';

-- rug
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rug', 'halı', '🏠', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rug');

UPDATE words SET
  turkish = 'halı',
  emoji = '🏠',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'rug';

-- man
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'man', 'adam', '👨', 2, 'beginner', 'Phonics', NULL, NULL, 'The man is tall.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'man');

UPDATE words SET
  turkish = 'adam',
  emoji = '👨',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The man is tall.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'man';

-- map
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'map', 'harita', '🗺️', 2, 'beginner', 'Phonics', 'noun', NULL, 'I have a treasure map.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'map');

UPDATE words SET
  turkish = 'harita',
  emoji = '🗺️',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I have a treasure map.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'map';

-- mat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mat', 'paspas', '🟫', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mat');

UPDATE words SET
  turkish = 'paspas',
  emoji = '🟫',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mat';

-- mud
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mud', 'çamur', '🟤', 2, 'beginner', 'Phonics', 'noun', NULL, 'My boots are full of mud.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mud');

UPDATE words SET
  turkish = 'çamur',
  emoji = '🟤',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'My boots are full of mud.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mud';

-- mix
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mix', 'karıştırmak', '🥣', 2, 'beginner', 'Phonics', 'verb', NULL, 'Mix the flour and eggs.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mix');

UPDATE words SET
  turkish = 'karıştırmak',
  emoji = '🥣',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'Mix the flour and eggs.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mix';

-- den
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'den', 'in', '🏚️', 2, 'beginner', 'Phonics', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'den');

UPDATE words SET
  turkish = 'in',
  emoji = '🏚️',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'den';

-- dim
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dim', 'loş', '🔅', 2, 'beginner', 'Phonics', 'adjective', NULL, 'The room is dim.', 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dim');

UPDATE words SET
  turkish = 'loş',
  emoji = '🔅',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = 'The room is dim.',
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'dim';

-- dip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dip', 'batırmak', '🫕', 2, 'beginner', 'Phonics', 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dip');

UPDATE words SET
  turkish = 'batırmak',
  emoji = '🫕',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'dip';

-- dot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dot', 'nokta', '⚫', 2, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dot');

UPDATE words SET
  turkish = 'nokta',
  emoji = '⚫',
  phonics_group = 2,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'dot';

-- got
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'got', 'aldı', '🤲', 3, 'beginner', 'Phonics', 'verb', NULL, 'I got a gift.', 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'got');

UPDATE words SET
  turkish = 'aldı',
  emoji = '🤲',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'I got a gift.',
  frequency = 9,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'got';

-- gum
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'gum', 'sakız', '🫧', 3, 'beginner', 'Phonics', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'gum');

UPDATE words SET
  turkish = 'sakız',
  emoji = '🫧',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'gum';

-- gap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'gap', 'boşluk', '🕳️', 3, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'gap');

UPDATE words SET
  turkish = 'boşluk',
  emoji = '🕳️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'gap';

-- gas
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'gas', 'gaz', '⛽', 3, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'gas');

UPDATE words SET
  turkish = 'gaz',
  emoji = '⛽',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'gas';

-- log
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'log', 'kütük', '🪵', 3, 'beginner', 'Phonics', 'noun', NULL, 'Sit on the log.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'log');

UPDATE words SET
  turkish = 'kütük',
  emoji = '🪵',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Sit on the log.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'log';

-- lot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'lot', 'çok', '🔢', 3, 'beginner', 'Phonics', 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'lot');

UPDATE words SET
  turkish = 'çok',
  emoji = '🔢',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'lot';

-- lip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'lip', 'dudak', '👄', 3, 'beginner', 'Body', 'noun', NULL, 'I lick my lip.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'lip');

UPDATE words SET
  turkish = 'dudak',
  emoji = '👄',
  phonics_group = 3,
  level = 'beginner',
  category = 'Body',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I lick my lip.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'lip';

-- leg
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'leg', 'bacak', '🦵', 3, 'beginner', 'Body', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'leg');

UPDATE words SET
  turkish = 'bacak',
  emoji = '🦵',
  phonics_group = 3,
  level = 'beginner',
  category = 'Body',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'leg';

-- lid
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'lid', 'kapak', '🫙', 3, 'beginner', 'Phonics', NULL, NULL, 'Put the lid on the jar.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'lid');

UPDATE words SET
  turkish = 'kapak',
  emoji = '🫙',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Put the lid on the jar.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'lid';

-- fog
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fog', 'sis', '🌫️', 3, 'beginner', 'Nature', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fog');

UPDATE words SET
  turkish = 'sis',
  emoji = '🌫️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fog';

-- fun
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fun', 'eğlence', '🎉', 3, 'beginner', 'Phonics', 'noun', NULL, 'This game is fun!', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fun');

UPDATE words SET
  turkish = 'eğlence',
  emoji = '🎉',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'This game is fun!',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fun';

-- fit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fit', 'uygun', '💪', 3, 'beginner', 'Phonics', 'adjective', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fit');

UPDATE words SET
  turkish = 'uygun',
  emoji = '💪',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fit';

-- fig
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fig', 'incir', '🟣', 3, 'beginner', 'Food', 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fig');

UPDATE words SET
  turkish = 'incir',
  emoji = '🟣',
  phonics_group = 3,
  level = 'beginner',
  category = 'Food',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fig';

-- fan
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fan', 'vantilatör', '🪭', 3, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fan');

UPDATE words SET
  turkish = 'vantilatör',
  emoji = '🪭',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'fan';

-- big
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'big', 'büyük', '🐘', 3, 'beginner', 'Phonics', 'adjective', NULL, 'The tree is big.', 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'big');

UPDATE words SET
  turkish = 'büyük',
  emoji = '🐘',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = 'The tree is big.',
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'big';

-- bed
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bed', 'yatak', '🛏️', 3, 'beginner', 'Phonics', NULL, NULL, 'My bed is soft.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bed');

UPDATE words SET
  turkish = 'yatak',
  emoji = '🛏️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'My bed is soft.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bed';

-- bat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bat', 'yarasa', '🦇', 3, 'beginner', 'Animals', NULL, NULL, 'A bat flies at night.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bat');

UPDATE words SET
  turkish = 'yarasa',
  emoji = '🦇',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'A bat flies at night.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bat';

-- box
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'box', 'kutu', '📦', 3, 'beginner', 'Phonics', 'noun', NULL, 'The box is full.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'box');

UPDATE words SET
  turkish = 'kutu',
  emoji = '📦',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The box is full.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'box';

-- bit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bit', 'parça', '🔹', 3, 'beginner', 'Phonics', NULL, '/bɪt/', NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bit');

UPDATE words SET
  turkish = 'parça',
  emoji = '🔹',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = '/bɪt/',
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bit';

-- bus
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bus', 'otobüs', '🚌', 3, 'beginner', 'Phonics', 'noun', NULL, 'I ride the yellow bus.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bus');

UPDATE words SET
  turkish = 'otobüs',
  emoji = '🚌',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I ride the yellow bus.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'bus';

-- bug
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bug', 'böcek', '🐛', 3, 'beginner', 'Animals', 'noun', NULL, 'A bug is on the leaf.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bug');

UPDATE words SET
  turkish = 'böcek',
  emoji = '🐛',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'A bug is on the leaf.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'bug';

-- bun
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bun', 'çörek', '🍞', 3, 'beginner', 'Food', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bun');

UPDATE words SET
  turkish = 'çörek',
  emoji = '🍞',
  phonics_group = 3,
  level = 'beginner',
  category = 'Food',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'bun';

-- but
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'but', 'ama', '↔️', 3, 'beginner', 'Phonics', 'conjunction', NULL, NULL, 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'but');

UPDATE words SET
  turkish = 'ama',
  emoji = '↔️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'conjunction',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'but';

-- bull
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bull', 'boğa', '🐂', 3, 'beginner', 'Animals', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bull');

UPDATE words SET
  turkish = 'boğa',
  emoji = '🐂',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bull';

-- rain
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rain', 'yağmur', '🌧️', 4, 'beginner', 'Nature', 'noun', NULL, 'I hear the rain.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rain');

UPDATE words SET
  turkish = 'yağmur',
  emoji = '🌧️',
  phonics_group = 4,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I hear the rain.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'rain';

-- tail
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tail', 'kuyruk', '🐕', 4, 'beginner', 'Animals', 'noun', NULL, 'The cat wags its tail.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tail');

UPDATE words SET
  turkish = 'kuyruk',
  emoji = '🐕',
  phonics_group = 4,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The cat wags its tail.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tail';

-- mail
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mail', 'posta', '📬', 4, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mail');

UPDATE words SET
  turkish = 'posta',
  emoji = '📬',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mail';

-- paid
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'paid', 'ödendi', '💰', 4, 'intermediate', 'Phonics', 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'paid');

UPDATE words SET
  turkish = 'ödendi',
  emoji = '💰',
  phonics_group = 4,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'paid';

-- train
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'train', 'tren', '🚂', 4, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'train');

UPDATE words SET
  turkish = 'tren',
  emoji = '🚂',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'train';

-- jet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'jet', 'jet', '✈️', 4, 'beginner', 'Phonics', 'noun', NULL, 'The jet flies fast.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'jet');

UPDATE words SET
  turkish = 'jet',
  emoji = '✈️',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The jet flies fast.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'jet';

-- jam
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'jam', 'reçel', '🍯', 4, 'beginner', 'Food', 'noun', NULL, 'I like strawberry jam.', 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'jam');

UPDATE words SET
  turkish = 'reçel',
  emoji = '🍯',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I like strawberry jam.',
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'jam';

-- jug
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'jug', 'sürahi', '🫗', 4, 'beginner', 'Phonics', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'jug');

UPDATE words SET
  turkish = 'sürahi',
  emoji = '🫗',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'jug';

-- jump
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'jump', 'zıplamak', '🤸', 4, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'jump');

UPDATE words SET
  turkish = 'zıplamak',
  emoji = '🤸',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'jump';

-- joy
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'joy', 'sevinç', '😄', 4, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'joy');

UPDATE words SET
  turkish = 'sevinç',
  emoji = '😄',
  phonics_group = 4,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'joy';

-- boat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'boat', 'tekne', '⛵', 4, 'beginner', 'Phonics', 'noun', NULL, 'The boat is on the lake.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'boat');

UPDATE words SET
  turkish = 'tekne',
  emoji = '⛵',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The boat is on the lake.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'boat';

-- coat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'coat', 'palto', '🧥', 4, 'beginner', 'Phonics', 'noun', NULL, 'Wear your coat.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'coat');

UPDATE words SET
  turkish = 'palto',
  emoji = '🧥',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Wear your coat.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'coat';

-- goat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'goat', 'keçi', '🐐', 4, 'beginner', 'Animals', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'goat');

UPDATE words SET
  turkish = 'keçi',
  emoji = '🐐',
  phonics_group = 4,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'goat';

-- road
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'road', 'yol', '🛤️', 4, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'road');

UPDATE words SET
  turkish = 'yol',
  emoji = '🛤️',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'road';

-- soap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'soap', 'sabun', '🧼', 4, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'soap');

UPDATE words SET
  turkish = 'sabun',
  emoji = '🧼',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'soap';

-- pie
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pie', 'turta', '🥧', 4, 'beginner', 'Food', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pie');

UPDATE words SET
  turkish = 'turta',
  emoji = '🥧',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pie';

-- tie
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tie', 'kravat', '👔', 4, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tie');

UPDATE words SET
  turkish = 'kravat',
  emoji = '👔',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tie';

-- lie
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'lie', 'yalan', '🤥', 4, 'intermediate', 'Phonics', 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'lie');

UPDATE words SET
  turkish = 'yalan',
  emoji = '🤥',
  phonics_group = 4,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'lie';

-- bee
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bee', 'arı', '🐝', 4, 'beginner', 'Animals', 'noun', NULL, 'The bee makes honey.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bee');

UPDATE words SET
  turkish = 'arı',
  emoji = '🐝',
  phonics_group = 4,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The bee makes honey.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'bee';

-- see
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'see', 'görmek', '👀', 4, 'beginner', 'Phonics', 'verb', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'see');

UPDATE words SET
  turkish = 'görmek',
  emoji = '👀',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'see';

-- tree
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tree', 'ağaç', '🌳', 4, 'beginner', 'Nature', 'noun', NULL, 'The tree is very tall.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tree');

UPDATE words SET
  turkish = 'ağaç',
  emoji = '🌳',
  phonics_group = 4,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The tree is very tall.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tree';

-- free
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'free', 'özgür', '🕊️', 4, 'intermediate', 'Phonics', 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'free');

UPDATE words SET
  turkish = 'özgür',
  emoji = '🕊️',
  phonics_group = 4,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'free';

-- corn
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'corn', 'mısır', '🌽', 4, 'beginner', 'Food', 'noun', NULL, 'I eat sweet corn.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'corn');

UPDATE words SET
  turkish = 'mısır',
  emoji = '🌽',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I eat sweet corn.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'corn';

-- fork
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fork', 'çatal', '🍴', 4, 'beginner', 'Phonics', NULL, NULL, 'Use a fork to eat.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fork');

UPDATE words SET
  turkish = 'çatal',
  emoji = '🍴',
  phonics_group = 4,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Use a fork to eat.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'fork';

-- zoo
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zoo', 'hayvanat bahçesi', '🦁', 5, 'beginner', 'Phonics', 'noun', NULL, 'We go to the zoo.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zoo');

UPDATE words SET
  turkish = 'hayvanat bahçesi',
  emoji = '🦁',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'We go to the zoo.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'zoo';

-- zip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zip', 'fermuar', '🤐', 5, 'beginner', 'Phonics', 'verb', NULL, 'Zip up your jacket.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zip');

UPDATE words SET
  turkish = 'fermuar',
  emoji = '🤐',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = 'Zip up your jacket.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'zip';

-- zig
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zig', 'zikzak', '↗️', 5, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zig');

UPDATE words SET
  turkish = 'zikzak',
  emoji = '↗️',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'zig';

-- zag
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zag', 'zikzak', '↘️', 5, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zag');

UPDATE words SET
  turkish = 'zikzak',
  emoji = '↘️',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'zag';

-- win
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'win', 'kazanmak', '🏆', 5, 'beginner', 'Phonics', 'verb', '/wɪn/', NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'win');

UPDATE words SET
  turkish = 'kazanmak',
  emoji = '🏆',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = '/wɪn/',
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'win';

-- wet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wet', 'ıslak', '💧', 5, 'beginner', 'Phonics', 'adjective', '/wɛt/', 'My hair is wet.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wet');

UPDATE words SET
  turkish = 'ıslak',
  emoji = '💧',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = '/wɛt/',
  example_en = 'My hair is wet.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'wet';

-- wig
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wig', 'peruk', '💇', 5, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wig');

UPDATE words SET
  turkish = 'peruk',
  emoji = '💇',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'wig';

-- web
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'web', 'ağ', '🕸️', 5, 'beginner', 'Phonics', 'noun', NULL, 'A spider makes a web.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'web');

UPDATE words SET
  turkish = 'ağ',
  emoji = '🕸️',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'A spider makes a web.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'web';

-- ring
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ring', 'yüzük', '💍', 5, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ring');

UPDATE words SET
  turkish = 'yüzük',
  emoji = '💍',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ring';

-- sing
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sing', 'şarkı söylemek', '🎤', 5, 'beginner', 'Phonics', 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sing');

UPDATE words SET
  turkish = 'şarkı söylemek',
  emoji = '🎤',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sing';

-- king
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'king', 'kral', '👑', 5, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'king');

UPDATE words SET
  turkish = 'kral',
  emoji = '👑',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'king';

-- song
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'song', 'şarkı', '🎵', 5, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'song');

UPDATE words SET
  turkish = 'şarkı',
  emoji = '🎵',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'song';

-- long
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'long', 'uzun', '📏', 5, 'beginner', 'Phonics', 'adjective', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'long');

UPDATE words SET
  turkish = 'uzun',
  emoji = '📏',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'long';

-- van
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'van', 'minibüs', '🚐', 5, 'beginner', 'Phonics', 'noun', '/væn/', 'The van is big.', 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'van');

UPDATE words SET
  turkish = 'minibüs',
  emoji = '🚐',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = '/væn/',
  example_en = 'The van is big.',
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'van';

-- vet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'vet', 'veteriner', '👨‍⚕️', 5, 'beginner', 'Phonics', 'noun', NULL, 'The vet helps sick animals.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'vet');

UPDATE words SET
  turkish = 'veteriner',
  emoji = '👨‍⚕️',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The vet helps sick animals.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'vet';

-- vine
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'vine', 'asma', '🌿', 5, 'intermediate', 'Nature', NULL, '/vaɪn/', NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'vine');

UPDATE words SET
  turkish = 'asma',
  emoji = '🌿',
  phonics_group = 5,
  level = 'intermediate',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = '/vaɪn/',
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'vine';

-- book
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'book', 'kitap', '📖', 5, 'beginner', 'Phonics', 'noun', NULL, NULL, 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'book');

UPDATE words SET
  turkish = 'kitap',
  emoji = '📖',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'book';

-- look
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'look', 'bakmak', '👁️', 5, 'beginner', 'Phonics', 'verb', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'look');

UPDATE words SET
  turkish = 'bakmak',
  emoji = '👁️',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'look';

-- cook
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cook', 'pişirmek', '👨‍🍳', 5, 'beginner', 'Phonics', 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cook');

UPDATE words SET
  turkish = 'pişirmek',
  emoji = '👨‍🍳',
  phonics_group = 5,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'cook';

-- moon
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'moon', 'ay', '🌙', 5, 'beginner', 'Nature', 'noun', NULL, 'The moon is round.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'moon');

UPDATE words SET
  turkish = 'ay',
  emoji = '🌙',
  phonics_group = 5,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The moon is round.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'moon';

-- yes
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'yes', 'evet', '✅', 6, 'beginner', 'Phonics', 'adverb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'yes');

UPDATE words SET
  turkish = 'evet',
  emoji = '✅',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'yes';

-- yam
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'yam', 'tatlı patates', '🍠', 6, 'beginner', 'Food', 'noun', NULL, 'I eat yam for dinner.', 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'yam');

UPDATE words SET
  turkish = 'tatlı patates',
  emoji = '🍠',
  phonics_group = 6,
  level = 'beginner',
  category = 'Food',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I eat yam for dinner.',
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'yam';

-- yell
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'yell', 'bağırmak', '🗣️', 6, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'yell');

UPDATE words SET
  turkish = 'bağırmak',
  emoji = '🗣️',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'yell';

-- fox
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fox', 'tilki', '🦊', 6, 'beginner', 'Animals', 'noun', NULL, 'The fox is clever.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fox');

UPDATE words SET
  turkish = 'tilki',
  emoji = '🦊',
  phonics_group = 6,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The fox is clever.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fox';

-- six
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'six', 'altı', '6️⃣', 6, 'beginner', 'Numbers', 'noun', NULL, 'I have six apples.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'six');

UPDATE words SET
  turkish = 'altı',
  emoji = '6️⃣',
  phonics_group = 6,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I have six apples.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'six';

-- chip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chip', 'cips', '🍟', 6, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chip');

UPDATE words SET
  turkish = 'cips',
  emoji = '🍟',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chip';

-- chat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chat', 'sohbet', '💬', 6, 'beginner', 'Phonics', 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chat');

UPDATE words SET
  turkish = 'sohbet',
  emoji = '💬',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chat';

-- chin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chin', 'çene', '🤔', 6, 'beginner', 'Body', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chin');

UPDATE words SET
  turkish = 'çene',
  emoji = '🤔',
  phonics_group = 6,
  level = 'beginner',
  category = 'Body',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chin';

-- chop
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chop', 'doğramak', '🪓', 6, 'beginner', 'Phonics', 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chop');

UPDATE words SET
  turkish = 'doğramak',
  emoji = '🪓',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chop';

-- ship
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ship', 'gemi', '🚢', 6, 'beginner', 'Phonics', 'noun', '/ʃɪp/', NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ship');

UPDATE words SET
  turkish = 'gemi',
  emoji = '🚢',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = '/ʃɪp/',
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ship';

-- shop
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shop', 'dükkan', '🏪', 6, 'beginner', 'Phonics', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shop');

UPDATE words SET
  turkish = 'dükkan',
  emoji = '🏪',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shop';

-- shut
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shut', 'kapatmak', '🚪', 6, 'beginner', 'Phonics', 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shut');

UPDATE words SET
  turkish = 'kapatmak',
  emoji = '🚪',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shut';

-- shed
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shed', 'kulübe', '🏚️', 6, 'beginner', 'Phonics', 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shed');

UPDATE words SET
  turkish = 'kulübe',
  emoji = '🏚️',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shed';

-- thin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'thin', 'ince', '🧍', 6, 'beginner', 'Phonics', 'adjective', '/θɪn/', NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'thin');

UPDATE words SET
  turkish = 'ince',
  emoji = '🧍',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = '/θɪn/',
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'thin';

-- thick
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'thick', 'kalın', '🟫', 6, 'beginner', 'Phonics', 'adjective', '/θɪk/', NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'thick');

UPDATE words SET
  turkish = 'kalın',
  emoji = '🟫',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = '/θɪk/',
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'thick';

-- this
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'this', 'bu', '👉', 6, 'beginner', 'Phonics', 'noun', '/ðɪs/', NULL, 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'this');

UPDATE words SET
  turkish = 'bu',
  emoji = '👉',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = '/ðɪs/',
  example_en = NULL,
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'this';

-- that
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'that', 'şu', '👈', 6, 'beginner', 'Phonics', 'noun', '/ðæt/', NULL, 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'that');

UPDATE words SET
  turkish = 'şu',
  emoji = '👈',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = '/ðæt/',
  example_en = NULL,
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'that';

-- bath
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bath', 'banyo', '🛁', 6, 'beginner', 'Phonics', NULL, '/bɑːθ/', NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bath');

UPDATE words SET
  turkish = 'banyo',
  emoji = '🛁',
  phonics_group = 6,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = '/bɑːθ/',
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bath';

-- queen
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'queen', 'kraliçe', '👸', 7, 'intermediate', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'queen');

UPDATE words SET
  turkish = 'kraliçe',
  emoji = '👸',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'queen';

-- quit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'quit', 'bırakmak', '🚪', 7, 'intermediate', 'Phonics', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'quit');

UPDATE words SET
  turkish = 'bırakmak',
  emoji = '🚪',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'quit';

-- quiz
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'quiz', 'sınav', '❓', 7, 'intermediate', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'quiz');

UPDATE words SET
  turkish = 'sınav',
  emoji = '❓',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'quiz';

-- quick
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'quick', 'hızlı', '⚡', 7, 'intermediate', 'Phonics', 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'quick');

UPDATE words SET
  turkish = 'hızlı',
  emoji = '⚡',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'quick';

-- out
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'out', 'dışarı', '🚶', 7, 'beginner', 'Phonics', 'adverb', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'out');

UPDATE words SET
  turkish = 'dışarı',
  emoji = '🚶',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'out';

-- our
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'our', 'bizim', '👥', 7, 'beginner', 'Phonics', NULL, NULL, NULL, NULL, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'our');

UPDATE words SET
  turkish = 'bizim',
  emoji = '👥',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'our';

-- loud
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'loud', 'gürültülü', '🔊', 7, 'beginner', 'Phonics', 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'loud');

UPDATE words SET
  turkish = 'gürültülü',
  emoji = '🔊',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'loud';

-- cloud
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cloud', 'bulut', '☁️', 7, 'beginner', 'Nature', 'noun', NULL, 'A cloud is in the sky.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cloud');

UPDATE words SET
  turkish = 'bulut',
  emoji = '☁️',
  phonics_group = 7,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'A cloud is in the sky.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'cloud';

-- oil
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'oil', 'yağ', '🛢️', 7, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'oil');

UPDATE words SET
  turkish = 'yağ',
  emoji = '🛢️',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'oil';

-- coin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'coin', 'madeni para', '🪙', 7, 'beginner', 'Phonics', 'noun', NULL, 'I found a coin.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'coin');

UPDATE words SET
  turkish = 'madeni para',
  emoji = '🪙',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'I found a coin.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'coin';

-- soil
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'soil', 'toprak', '🌱', 7, 'intermediate', 'Nature', 'noun', NULL, 'Plants grow in soil.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'soil');

UPDATE words SET
  turkish = 'toprak',
  emoji = '🌱',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Plants grow in soil.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'soil';

-- join
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'join', 'katılmak', '🤝', 7, 'intermediate', 'Phonics', 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'join');

UPDATE words SET
  turkish = 'katılmak',
  emoji = '🤝',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'join';

-- blue
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'blue', 'mavi', '🔵', 7, 'beginner', 'Colors', 'adjective', NULL, 'The sky is blue.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'blue');

UPDATE words SET
  turkish = 'mavi',
  emoji = '🔵',
  phonics_group = 7,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = 'The sky is blue.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'blue';

-- true
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'true', 'doğru', '✅', 7, 'intermediate', 'Phonics', 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'true');

UPDATE words SET
  turkish = 'doğru',
  emoji = '✅',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'true';

-- clue
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'clue', 'ipucu', '🔎', 7, 'intermediate', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'clue');

UPDATE words SET
  turkish = 'ipucu',
  emoji = '🔎',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'clue';

-- glue
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'glue', 'yapıştırıcı', '🧴', 7, 'beginner', 'Phonics', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'glue');

UPDATE words SET
  turkish = 'yapıştırıcı',
  emoji = '🧴',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'glue';

-- her
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'her', 'onun', '👩', 7, 'beginner', 'Phonics', 'noun', NULL, NULL, 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'her');

UPDATE words SET
  turkish = 'onun',
  emoji = '👩',
  phonics_group = 7,
  level = 'beginner',
  category = 'Phonics',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'her';

-- fern
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fern', 'eğreltiotu', '🌿', 7, 'intermediate', 'Nature', 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fern');

UPDATE words SET
  turkish = 'eğreltiotu',
  emoji = '🌿',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fern';

-- star
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'star', 'yıldız', '⭐', 7, 'beginner', 'Nature', 'noun', NULL, 'The star shines at night.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'star');

UPDATE words SET
  turkish = 'yıldız',
  emoji = '⭐',
  phonics_group = 7,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The star shines at night.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'star';

-- dog
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dog', 'köpek', '🐶', 3, 'beginner', 'Animals', 'noun', NULL, 'The DOG runs in the yard.', 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dog');

UPDATE words SET
  turkish = 'köpek',
  emoji = '🐶',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The DOG runs in the yard.',
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'dog';

-- bird
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bird', 'kuş', '🐦', 7, 'beginner', 'Animals', NULL, NULL, 'The BIRD sings a song.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bird');

UPDATE words SET
  turkish = 'kuş',
  emoji = '🐦',
  phonics_group = 7,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The BIRD sings a song.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bird';

-- fish
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fish', 'balık', '🐟', 6, 'beginner', 'Animals', 'noun', NULL, 'The FISH swims fast.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fish');

UPDATE words SET
  turkish = 'balık',
  emoji = '🐟',
  phonics_group = 6,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The FISH swims fast.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fish';

-- frog
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'frog', 'kurbağa', '🐸', 3, 'beginner', 'Animals', 'noun', NULL, 'The FROG jumps high.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'frog');

UPDATE words SET
  turkish = 'kurbağa',
  emoji = '🐸',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The FROG jumps high.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'frog';

-- pig
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pig', 'domuz', '🐷', 3, 'beginner', 'Animals', NULL, NULL, 'The PIG likes mud.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pig');

UPDATE words SET
  turkish = 'domuz',
  emoji = '🐷',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The PIG likes mud.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'pig';

-- cow
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cow', 'inek', '🐄', 5, 'beginner', 'Animals', NULL, NULL, 'The COW is on the farm.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cow');

UPDATE words SET
  turkish = 'inek',
  emoji = '🐄',
  phonics_group = 5,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The COW is on the farm.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'cow';

-- duck
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'duck', 'ördek', '🦆', 2, 'beginner', 'Animals', NULL, NULL, 'The DUCK swims on the lake.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'duck');

UPDATE words SET
  turkish = 'ördek',
  emoji = '🦆',
  phonics_group = 2,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The DUCK swims on the lake.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'duck';

-- lamb
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'lamb', 'kuzu', '🐑', 3, 'beginner', 'Animals', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'lamb');

UPDATE words SET
  turkish = 'kuzu',
  emoji = '🐑',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'lamb';

-- owl
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'owl', 'baykuş', '🦉', 5, 'intermediate', 'Animals', NULL, NULL, 'The owl sleeps during the day.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'owl');

UPDATE words SET
  turkish = 'baykuş',
  emoji = '🦉',
  phonics_group = 5,
  level = 'intermediate',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The owl sleeps during the day.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'owl';

-- snail
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'snail', 'salyangoz', '🐌', 4, 'beginner', 'Animals', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'snail');

UPDATE words SET
  turkish = 'salyangoz',
  emoji = '🐌',
  phonics_group = 4,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'snail';

-- shark
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shark', 'köpekbalığı', '🦈', 7, 'intermediate', 'Animals', 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shark');

UPDATE words SET
  turkish = 'köpekbalığı',
  emoji = '🦈',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Animals',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shark';

-- lion
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'lion', 'aslan', '🦁', 4, 'beginner', 'Animals', NULL, NULL, 'The lion is the king.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'lion');

UPDATE words SET
  turkish = 'aslan',
  emoji = '🦁',
  phonics_group = 4,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The lion is the king.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'lion';

-- tiger
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tiger', 'kaplan', '🐯', 3, 'beginner', 'Animals', NULL, NULL, 'The tiger is fast.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tiger');

UPDATE words SET
  turkish = 'kaplan',
  emoji = '🐯',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The tiger is fast.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'tiger';

-- bear
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bear', 'ayı', '🐻', 7, 'beginner', 'Animals', NULL, NULL, 'The bear is big.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bear');

UPDATE words SET
  turkish = 'ayı',
  emoji = '🐻',
  phonics_group = 7,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The bear is big.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bear';

-- rabbit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rabbit', 'tavşan', '🐰', 3, 'beginner', 'Animals', NULL, NULL, 'The rabbit is white.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rabbit');

UPDATE words SET
  turkish = 'tavşan',
  emoji = '🐰',
  phonics_group = 3,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The rabbit is white.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'rabbit';

-- horse
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'horse', 'at', '🐴', 7, 'beginner', 'Animals', NULL, NULL, 'I ride a horse.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'horse');

UPDATE words SET
  turkish = 'at',
  emoji = '🐴',
  phonics_group = 7,
  level = 'beginner',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I ride a horse.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'horse';

-- elephant
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'elephant', 'fil', '🐘', 4, 'intermediate', 'Animals', NULL, NULL, 'The elephant is huge.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'elephant');

UPDATE words SET
  turkish = 'fil',
  emoji = '🐘',
  phonics_group = 4,
  level = 'intermediate',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The elephant is huge.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'elephant';

-- penguin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'penguin', 'penguen', '🐧', 3, 'intermediate', 'Animals', NULL, NULL, 'Penguins live in ice.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'penguin');

UPDATE words SET
  turkish = 'penguen',
  emoji = '🐧',
  phonics_group = 3,
  level = 'intermediate',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Penguins live in ice.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'penguin';

-- butterfly
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'butterfly', 'kelebek', '🦋', 3, 'intermediate', 'Animals', NULL, NULL, 'The butterfly is colorful.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'butterfly');

UPDATE words SET
  turkish = 'kelebek',
  emoji = '🦋',
  phonics_group = 3,
  level = 'intermediate',
  category = 'Animals',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The butterfly is colorful.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'butterfly';

-- green
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'green', 'yeşil', '🟢', 4, 'beginner', 'Colors', 'adjective', NULL, 'The leaf is green.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'green');

UPDATE words SET
  turkish = 'yeşil',
  emoji = '🟢',
  phonics_group = 4,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = 'The leaf is green.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'green';

-- pink
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pink', 'pembe', '🩷', 3, 'beginner', 'Colors', NULL, NULL, 'The flower is pink.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pink');

UPDATE words SET
  turkish = 'pembe',
  emoji = '🩷',
  phonics_group = 3,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The flower is pink.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'pink';

-- black
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'black', 'siyah', '⚫', 2, 'beginner', 'Colors', NULL, NULL, 'The hat is black.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'black');

UPDATE words SET
  turkish = 'siyah',
  emoji = '⚫',
  phonics_group = 2,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The hat is black.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'black';

-- white
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'white', 'beyaz', '⚪', 6, 'beginner', 'Colors', NULL, NULL, 'The cat is white.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'white');

UPDATE words SET
  turkish = 'beyaz',
  emoji = '⚪',
  phonics_group = 6,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The cat is white.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'white';

-- brown
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'brown', 'kahverengi', '🟤', 7, 'beginner', 'Colors', 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'brown');

UPDATE words SET
  turkish = 'kahverengi',
  emoji = '🟤',
  phonics_group = 7,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'brown';

-- gold
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'gold', 'altın', '🥇', 3, 'intermediate', 'Colors', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'gold');

UPDATE words SET
  turkish = 'altın',
  emoji = '🥇',
  phonics_group = 3,
  level = 'intermediate',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'gold';

-- gray
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'gray', 'gri', '🩶', 4, 'beginner', 'Colors', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'gray');

UPDATE words SET
  turkish = 'gri',
  emoji = '🩶',
  phonics_group = 4,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'gray';

-- orange
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'orange', 'turuncu', '🟠', 7, 'beginner', 'Colors', NULL, NULL, 'The ball is orange.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'orange');

UPDATE words SET
  turkish = 'turuncu',
  emoji = '🟠',
  phonics_group = 7,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The ball is orange.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'orange';

-- yellow
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'yellow', 'sarı', '🟡', 2, 'beginner', 'Colors', NULL, NULL, 'The sun is yellow.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'yellow');

UPDATE words SET
  turkish = 'sarı',
  emoji = '🟡',
  phonics_group = 2,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The sun is yellow.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'yellow';

-- purple
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'purple', 'mor', '🟣', 7, 'beginner', 'Colors', NULL, NULL, 'The flower is purple.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'purple');

UPDATE words SET
  turkish = 'mor',
  emoji = '🟣',
  phonics_group = 7,
  level = 'beginner',
  category = 'Colors',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The flower is purple.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'purple';

-- mom
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mom', 'anne', '👩', 2, 'beginner', 'Family', NULL, NULL, 'My mom is kind.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mom');

UPDATE words SET
  turkish = 'anne',
  emoji = '👩',
  phonics_group = 2,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'My mom is kind.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'mom';

-- dad
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dad', 'baba', '👨', 2, 'beginner', 'Family', 'noun', NULL, 'My dad is tall.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dad');

UPDATE words SET
  turkish = 'baba',
  emoji = '👨',
  phonics_group = 2,
  level = 'beginner',
  category = 'Family',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'My dad is tall.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'dad';

-- baby
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'baby', 'bebek', '👶', 4, 'beginner', 'Family', NULL, NULL, 'The baby is sleeping.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'baby');

UPDATE words SET
  turkish = 'bebek',
  emoji = '👶',
  phonics_group = 4,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The baby is sleeping.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'baby';

-- sister
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sister', 'kız kardeş', '👧', 7, 'beginner', 'Family', 'noun', NULL, 'My sister likes cats.', 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sister');

UPDATE words SET
  turkish = 'kız kardeş',
  emoji = '👧',
  phonics_group = 7,
  level = 'beginner',
  category = 'Family',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'My sister likes cats.',
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sister';

-- brother
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'brother', 'erkek kardeş', '👦', 7, 'beginner', 'Family', NULL, NULL, 'My brother plays ball.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'brother');

UPDATE words SET
  turkish = 'erkek kardeş',
  emoji = '👦',
  phonics_group = 7,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'My brother plays ball.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'brother';

-- grandma
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'grandma', 'büyükanne', '👵', 4, 'beginner', 'Family', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'grandma');

UPDATE words SET
  turkish = 'büyükanne',
  emoji = '👵',
  phonics_group = 4,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'grandma';

-- grandpa
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'grandpa', 'büyükbaba', '👴', 4, 'beginner', 'Family', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'grandpa');

UPDATE words SET
  turkish = 'büyükbaba',
  emoji = '👴',
  phonics_group = 4,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'grandpa';

-- family
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'family', 'aile', '👨‍👩‍👧‍👦', 4, 'beginner', 'Family', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'family');

UPDATE words SET
  turkish = 'aile',
  emoji = '👨‍👩‍👧‍👦',
  phonics_group = 4,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'family';

-- aunt
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'aunt', 'teyze/hala', '👩', 7, 'beginner', 'Family', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'aunt');

UPDATE words SET
  turkish = 'teyze/hala',
  emoji = '👩',
  phonics_group = 7,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'aunt';

-- uncle
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'uncle', 'amca/dayı', '👨', 3, 'beginner', 'Family', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'uncle');

UPDATE words SET
  turkish = 'amca/dayı',
  emoji = '👨',
  phonics_group = 3,
  level = 'beginner',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'uncle';

-- cousin
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cousin', 'kuzen', '🧒', 3, 'intermediate', 'Family', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cousin');

UPDATE words SET
  turkish = 'kuzen',
  emoji = '🧒',
  phonics_group = 3,
  level = 'intermediate',
  category = 'Family',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'cousin';

-- apple
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'apple', 'elma', '🍎', 3, 'beginner', 'Food', NULL, NULL, 'I love red APPLES.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'apple');

UPDATE words SET
  turkish = 'elma',
  emoji = '🍎',
  phonics_group = 3,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I love red APPLES.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'apple';

-- bread
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bread', 'ekmek', '🍞', 4, 'beginner', 'Food', NULL, NULL, 'We have BREAD for breakfast.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bread');

UPDATE words SET
  turkish = 'ekmek',
  emoji = '🍞',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'We have BREAD for breakfast.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'bread';

-- milk
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'milk', 'süt', '🥛', 3, 'beginner', 'Food', NULL, NULL, 'She drinks MILK every day.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'milk');

UPDATE words SET
  turkish = 'süt',
  emoji = '🥛',
  phonics_group = 3,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'She drinks MILK every day.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'milk';

-- egg
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'egg', 'yumurta', '🥚', 2, 'beginner', 'Food', NULL, NULL, 'I have an EGG for breakfast.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'egg');

UPDATE words SET
  turkish = 'yumurta',
  emoji = '🥚',
  phonics_group = 2,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I have an EGG for breakfast.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'egg';

-- cake
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cake', 'pasta', '🎂', 4, 'beginner', 'Food', NULL, NULL, 'The CAKE is sweet.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cake');

UPDATE words SET
  turkish = 'pasta',
  emoji = '🎂',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The CAKE is sweet.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'cake';

-- rice
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rice', 'pirinç', '🍚', 4, 'beginner', 'Food', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rice');

UPDATE words SET
  turkish = 'pirinç',
  emoji = '🍚',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'rice';

-- meat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'meat', 'et', '🥩', 4, 'beginner', 'Food', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'meat');

UPDATE words SET
  turkish = 'et',
  emoji = '🥩',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'meat';

-- soup
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'soup', 'çorba', '🍲', 5, 'beginner', 'Food', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'soup');

UPDATE words SET
  turkish = 'çorba',
  emoji = '🍲',
  phonics_group = 5,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'soup';

-- juice
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'juice', 'meyve suyu', '🧃', 5, 'beginner', 'Food', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'juice');

UPDATE words SET
  turkish = 'meyve suyu',
  emoji = '🧃',
  phonics_group = 5,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'juice';

-- water
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'water', 'su', '💧', 7, 'beginner', 'Food', NULL, NULL, 'Please give me some WATER.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'water');

UPDATE words SET
  turkish = 'su',
  emoji = '💧',
  phonics_group = 7,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Please give me some WATER.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'water';

-- tea
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tea', 'çay', '🍵', 4, 'beginner', 'Food', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tea');

UPDATE words SET
  turkish = 'çay',
  emoji = '🍵',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'tea';

-- fruit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fruit', 'meyve', '🍇', 5, 'beginner', 'Food', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fruit');

UPDATE words SET
  turkish = 'meyve',
  emoji = '🍇',
  phonics_group = 5,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'fruit';

-- banana
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'banana', 'muz', '🍌', 4, 'beginner', 'Food', NULL, NULL, 'I love bananas.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'banana');

UPDATE words SET
  turkish = 'muz',
  emoji = '🍌',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I love bananas.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'banana';

-- cookie
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cookie', 'kurabiye', '🍪', 5, 'beginner', 'Food', NULL, NULL, 'The cookie is sweet.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cookie');

UPDATE words SET
  turkish = 'kurabiye',
  emoji = '🍪',
  phonics_group = 5,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The cookie is sweet.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'cookie';

-- pizza
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pizza', 'pizza', '🍕', 3, 'beginner', 'Food', NULL, NULL, 'I like cheese pizza.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pizza');

UPDATE words SET
  turkish = 'pizza',
  emoji = '🍕',
  phonics_group = 3,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I like cheese pizza.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'pizza';

-- cheese
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cheese', 'peynir', '🧀', 4, 'beginner', 'Food', NULL, NULL, 'I love cheese.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cheese');

UPDATE words SET
  turkish = 'peynir',
  emoji = '🧀',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I love cheese.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'cheese';

-- carrot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'carrot', 'havuç', '🥕', 7, 'beginner', 'Food', NULL, NULL, 'Rabbits eat carrots.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'carrot');

UPDATE words SET
  turkish = 'havuç',
  emoji = '🥕',
  phonics_group = 7,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Rabbits eat carrots.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'carrot';

-- potato
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'potato', 'patates', '🥔', 4, 'beginner', 'Food', NULL, NULL, 'I eat baked potato.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'potato');

UPDATE words SET
  turkish = 'patates',
  emoji = '🥔',
  phonics_group = 4,
  level = 'beginner',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I eat baked potato.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'potato';

-- strawberry
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'strawberry', 'çilek', '🍓', 7, 'intermediate', 'Food', NULL, NULL, 'Strawberries are red.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'strawberry');

UPDATE words SET
  turkish = 'çilek',
  emoji = '🍓',
  phonics_group = 7,
  level = 'intermediate',
  category = 'Food',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Strawberries are red.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'strawberry';

-- hand
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hand', 'el', '✋', 3, 'beginner', 'Body', NULL, NULL, 'I wave my hand.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hand');

UPDATE words SET
  turkish = 'el',
  emoji = '✋',
  phonics_group = 3,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I wave my hand.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'hand';

-- arm
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'arm', 'kol', '💪', 7, 'beginner', 'Body', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'arm');

UPDATE words SET
  turkish = 'kol',
  emoji = '💪',
  phonics_group = 7,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'arm';

-- eye
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'eye', 'göz', '👁️', 4, 'beginner', 'Body', NULL, NULL, 'I have big eyes.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'eye');

UPDATE words SET
  turkish = 'göz',
  emoji = '👁️',
  phonics_group = 4,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I have big eyes.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'eye';

-- ear
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ear', 'kulak', '👂', 7, 'beginner', 'Body', NULL, NULL, 'Rabbits have big ears.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ear');

UPDATE words SET
  turkish = 'kulak',
  emoji = '👂',
  phonics_group = 7,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Rabbits have big ears.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'ear';

-- nose
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'nose', 'burun', '👃', 4, 'beginner', 'Body', NULL, NULL, 'The dog has a wet nose.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'nose');

UPDATE words SET
  turkish = 'burun',
  emoji = '👃',
  phonics_group = 4,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The dog has a wet nose.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'nose';

-- head
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'head', 'baş', '🗣️', 4, 'beginner', 'Body', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'head');

UPDATE words SET
  turkish = 'baş',
  emoji = '🗣️',
  phonics_group = 4,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'head';

-- foot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'foot', 'ayak', '🦶', 5, 'beginner', 'Body', 'noun', NULL, 'My foot is small.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'foot');

UPDATE words SET
  turkish = 'ayak',
  emoji = '🦶',
  phonics_group = 5,
  level = 'beginner',
  category = 'Body',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'My foot is small.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'foot';

-- back
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'back', 'sırt', '🧍', 2, 'beginner', 'Body', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'back');

UPDATE words SET
  turkish = 'sırt',
  emoji = '🧍',
  phonics_group = 2,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'back';

-- mouth
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mouth', 'ağız', '👄', 5, 'beginner', 'Body', 'noun', NULL, 'Open your mouth.', 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mouth');

UPDATE words SET
  turkish = 'ağız',
  emoji = '👄',
  phonics_group = 5,
  level = 'beginner',
  category = 'Body',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'Open your mouth.',
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mouth';

-- hair
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hair', 'saç', '💇', 7, 'beginner', 'Body', NULL, NULL, 'My hair is long.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hair');

UPDATE words SET
  turkish = 'saç',
  emoji = '💇',
  phonics_group = 7,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'My hair is long.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'hair';

-- teeth
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'teeth', 'dişler', '🦷', 4, 'beginner', 'Body', NULL, NULL, 'Brush your teeth.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'teeth');

UPDATE words SET
  turkish = 'dişler',
  emoji = '🦷',
  phonics_group = 4,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Brush your teeth.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'teeth';

-- finger
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'finger', 'parmak', '☝️', 3, 'beginner', 'Body', NULL, NULL, 'I have ten fingers.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'finger');

UPDATE words SET
  turkish = 'parmak',
  emoji = '☝️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I have ten fingers.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'finger';

-- tummy
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tummy', 'karın', '🫃', 3, 'beginner', 'Body', NULL, NULL, 'My tummy is full.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tummy');

UPDATE words SET
  turkish = 'karın',
  emoji = '🫃',
  phonics_group = 3,
  level = 'beginner',
  category = 'Body',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'My tummy is full.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'tummy';

-- one
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'one', 'bir', '1️⃣', 4, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'one');

UPDATE words SET
  turkish = 'bir',
  emoji = '1️⃣',
  phonics_group = 4,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'one';

-- two
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'two', 'iki', '2️⃣', 5, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'two');

UPDATE words SET
  turkish = 'iki',
  emoji = '2️⃣',
  phonics_group = 5,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'two';

-- three
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'three', 'üç', '3️⃣', 4, 'beginner', 'Numbers', 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'three');

UPDATE words SET
  turkish = 'üç',
  emoji = '3️⃣',
  phonics_group = 4,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'three';

-- four
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'four', 'dört', '4️⃣', 7, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'four');

UPDATE words SET
  turkish = 'dört',
  emoji = '4️⃣',
  phonics_group = 7,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'four';

-- five
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'five', 'beş', '5️⃣', 4, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'five');

UPDATE words SET
  turkish = 'beş',
  emoji = '5️⃣',
  phonics_group = 4,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'five';

-- zero
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zero', 'sıfır', '0️⃣', 7, 'beginner', 'Numbers', NULL, NULL, 'Zero means nothing.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zero');

UPDATE words SET
  turkish = 'sıfır',
  emoji = '0️⃣',
  phonics_group = 7,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Zero means nothing.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'zero';

-- seven
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'seven', 'yedi', '7️⃣', 2, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'seven');

UPDATE words SET
  turkish = 'yedi',
  emoji = '7️⃣',
  phonics_group = 2,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'seven';

-- eight
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'eight', 'sekiz', '8️⃣', 4, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'eight');

UPDATE words SET
  turkish = 'sekiz',
  emoji = '8️⃣',
  phonics_group = 4,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'eight';

-- nine
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'nine', 'dokuz', '9️⃣', 4, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'nine');

UPDATE words SET
  turkish = 'dokuz',
  emoji = '9️⃣',
  phonics_group = 4,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'nine';

-- ten
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ten', 'on', '🔟', 2, 'beginner', 'Numbers', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ten');

UPDATE words SET
  turkish = 'on',
  emoji = '🔟',
  phonics_group = 2,
  level = 'beginner',
  category = 'Numbers',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'ten';

-- sun
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sun', 'güneş', '☀️', 3, 'beginner', 'Nature', 'noun', NULL, 'The sun is very bright.', 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sun');

UPDATE words SET
  turkish = 'güneş',
  emoji = '☀️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = 'The sun is very bright.',
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sun';

-- leaf
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'leaf', 'yaprak', '🍃', 4, 'beginner', 'Nature', NULL, NULL, 'The leaf is green.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'leaf');

UPDATE words SET
  turkish = 'yaprak',
  emoji = '🍃',
  phonics_group = 4,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The leaf is green.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'leaf';

-- snow
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'snow', 'kar', '❄️', 5, 'beginner', 'Nature', NULL, NULL, 'The snow is white.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'snow');

UPDATE words SET
  turkish = 'kar',
  emoji = '❄️',
  phonics_group = 5,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The snow is white.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'snow';

-- wind
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wind', 'rüzgar', '💨', 3, 'beginner', 'Nature', NULL, NULL, 'The wind blows the leaves.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wind');

UPDATE words SET
  turkish = 'rüzgar',
  emoji = '💨',
  phonics_group = 3,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The wind blows the leaves.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'wind';

-- hill
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hill', 'tepe', '⛰️', 3, 'beginner', 'Nature', NULL, NULL, NULL, NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hill');

UPDATE words SET
  turkish = 'tepe',
  emoji = '⛰️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'hill';

-- rock
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rock', 'kaya', '🪨', 2, 'beginner', 'Nature', NULL, NULL, 'I sit on a rock.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rock');

UPDATE words SET
  turkish = 'kaya',
  emoji = '🪨',
  phonics_group = 2,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'I sit on a rock.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'rock';

-- flower
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'flower', 'çiçek', '🌸', 5, 'beginner', 'Nature', NULL, NULL, 'The flower smells nice.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'flower');

UPDATE words SET
  turkish = 'çiçek',
  emoji = '🌸',
  phonics_group = 5,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The flower smells nice.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'flower';

-- sky
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sky', 'gökyüzü', '🌤️', 3, 'beginner', 'Nature', NULL, NULL, 'The sky is blue.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sky');

UPDATE words SET
  turkish = 'gökyüzü',
  emoji = '🌤️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The sky is blue.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'sky';

-- ocean
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ocean', 'okyanus', '🌊', 4, 'intermediate', 'Nature', NULL, NULL, 'The ocean is deep.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ocean');

UPDATE words SET
  turkish = 'okyanus',
  emoji = '🌊',
  phonics_group = 4,
  level = 'intermediate',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The ocean is deep.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'ocean';

-- river
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'river', 'nehir', '🏞️', 3, 'beginner', 'Nature', NULL, NULL, 'Fish live in the river.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'river');

UPDATE words SET
  turkish = 'nehir',
  emoji = '🏞️',
  phonics_group = 3,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'Fish live in the river.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'river';

-- grass
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'grass', 'çimen', '🌱', 4, 'beginner', 'Nature', NULL, NULL, 'The grass is green.', NULL, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'grass');

UPDATE words SET
  turkish = 'çimen',
  emoji = '🌱',
  phonics_group = 4,
  level = 'beginner',
  category = 'Nature',
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = 'The grass is green.',
  frequency = NULL,
  is_sight_word = FALSE,
  is_decodable = FALSE
WHERE word = 'grass';

-- nip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'nip', 'çimdik', NULL, 1, NULL, NULL, 'verb', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'nip');

UPDATE words SET
  turkish = 'çimdik',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'nip';

-- pans
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pans', 'tavalar', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pans');

UPDATE words SET
  turkish = 'tavalar',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pans';

-- naps
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'naps', 'şekerlemeler', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 2, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'naps');

UPDATE words SET
  turkish = 'şekerlemeler',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 2,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'naps';

-- mint
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mint', 'nane', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mint');

UPDATE words SET
  turkish = 'nane',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mint';

-- past
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'past', 'geçmiş', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'past');

UPDATE words SET
  turkish = 'geçmiş',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'past';

-- pita
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pita', 'pita ekmek', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pita');

UPDATE words SET
  turkish = 'pita ekmek',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pita';

-- taps
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'taps', 'musluklar', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'taps');

UPDATE words SET
  turkish = 'musluklar',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'taps';

-- tips
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tips', 'uçlar', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tips');

UPDATE words SET
  turkish = 'uçlar',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tips';

-- pins
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pins', 'iğneler', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 3, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pins');

UPDATE words SET
  turkish = 'iğneler',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 3,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pins';

-- ants
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ants', 'karıncalar', NULL, 1, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ants');

UPDATE words SET
  turkish = 'karıncalar',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ants';

-- men
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'men', 'erkekler', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'men');

UPDATE words SET
  turkish = 'erkekler',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'men';

-- ran
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ran', 'koştu', NULL, 2, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ran');

UPDATE words SET
  turkish = 'koştu',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ran';

-- mad
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mad', 'kızgın', NULL, 2, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mad');

UPDATE words SET
  turkish = 'kızgın',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mad';

-- him
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'him', 'onu', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'him');

UPDATE words SET
  turkish = 'onu',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'him';

-- kid
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'kid', 'çocuk', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'kid');

UPDATE words SET
  turkish = 'çocuk',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'kid';

-- met
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'met', 'tanıştı', NULL, 2, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'met');

UPDATE words SET
  turkish = 'tanıştı',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'met';

-- set
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'set', 'koy', NULL, 2, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'set');

UPDATE words SET
  turkish = 'koy',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'set';

-- pet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pet', 'evcil hayvan', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pet');

UPDATE words SET
  turkish = 'evcil hayvan',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pet';

-- pen
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pen', 'kalem', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pen');

UPDATE words SET
  turkish = 'kalem',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pen';

-- rip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rip', 'yırt', NULL, 2, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rip');

UPDATE words SET
  turkish = 'yırt',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'rip';

-- kit
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'kit', 'takım', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'kit');

UPDATE words SET
  turkish = 'takım',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'kit';

-- hum
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hum', 'mırılda', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hum');

UPDATE words SET
  turkish = 'mırılda',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hum';

-- drum
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'drum', 'davul', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'drum');

UPDATE words SET
  turkish = 'davul',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'drum';

-- team
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'team', 'takım', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'team');

UPDATE words SET
  turkish = 'takım',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'team';

-- rim
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rim', 'kenar', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rim');

UPDATE words SET
  turkish = 'kenar',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'rim';

-- mid
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mid', 'orta', NULL, 2, NULL, NULL, 'adjective', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mid');

UPDATE words SET
  turkish = 'orta',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mid';

-- ham
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'ham', 'jambon', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'ham');

UPDATE words SET
  turkish = 'jambon',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'ham';

-- hem
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hem', 'kenar', NULL, 2, NULL, NULL, 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hem');

UPDATE words SET
  turkish = 'kenar',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hem';

-- had
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'had', 'vardı', NULL, 2, NULL, NULL, 'verb', NULL, NULL, 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'had');

UPDATE words SET
  turkish = 'vardı',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'had';

-- drip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'drip', 'damlat', NULL, 2, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'drip');

UPDATE words SET
  turkish = 'damlat',
  emoji = NULL,
  phonics_group = 2,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'drip';

-- not
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'not', 'değil', NULL, 3, NULL, NULL, 'adverb', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'not');

UPDATE words SET
  turkish = 'değil',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'not';

-- let
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'let', 'bırak', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'let');

UPDATE words SET
  turkish = 'bırak',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'let';

-- dug
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dug', 'kazdı', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dug');

UPDATE words SET
  turkish = 'kazdı',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'dug';

-- flap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'flap', 'çırp', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'flap');

UPDATE words SET
  turkish = 'çırp',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'flap';

-- flag
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'flag', 'bayrak', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'flag');

UPDATE words SET
  turkish = 'bayrak',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'flag';

-- plug
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'plug', 'fiş', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'plug');

UPDATE words SET
  turkish = 'fiş',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'plug';

-- slug
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'slug', 'sümüklü böcek', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'slug');

UPDATE words SET
  turkish = 'sümüklü böcek',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'slug';

-- glad
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'glad', 'mutlu', NULL, 3, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'glad');

UPDATE words SET
  turkish = 'mutlu',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'glad';

-- blot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'blot', 'leke', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'blot');

UPDATE words SET
  turkish = 'leke',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'blot';

-- blob
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'blob', 'damla', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'blob');

UPDATE words SET
  turkish = 'damla',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'blob';

-- grip
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'grip', 'tut', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'grip');

UPDATE words SET
  turkish = 'tut',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'grip';

-- drop
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'drop', 'damla', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'drop');

UPDATE words SET
  turkish = 'damla',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'drop';

-- from
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'from', 'dan', NULL, 3, NULL, NULL, 'preposition', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'from');

UPDATE words SET
  turkish = 'dan',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'preposition',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'from';

-- flat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'flat', 'düz', NULL, 3, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'flat');

UPDATE words SET
  turkish = 'düz',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'flat';

-- fled
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fled', 'kaçtı', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fled');

UPDATE words SET
  turkish = 'kaçtı',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fled';

-- grab
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'grab', 'yakala', NULL, 3, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'grab');

UPDATE words SET
  turkish = 'yakala',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'grab';

-- bud
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bud', 'tomurcuk', NULL, 3, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bud');

UPDATE words SET
  turkish = 'tomurcuk',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'bud';

-- off
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'off', 'kapalı', NULL, 3, NULL, NULL, 'adverb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'off');

UPDATE words SET
  turkish = 'kapalı',
  emoji = NULL,
  phonics_group = 3,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'off';

-- sail
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sail', 'yelken', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sail');

UPDATE words SET
  turkish = 'yelken',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sail';

-- main
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'main', 'ana', NULL, 4, NULL, NULL, 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'main');

UPDATE words SET
  turkish = 'ana',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'main';

-- load
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'load', 'yük', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'load');

UPDATE words SET
  turkish = 'yük',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'load';

-- oak
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'oak', 'meşe', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'oak');

UPDATE words SET
  turkish = 'meşe',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'oak';

-- need
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'need', 'ihtiyaç', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'need');

UPDATE words SET
  turkish = 'ihtiyaç',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'need';

-- seed
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'seed', 'tohum', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'seed');

UPDATE words SET
  turkish = 'tohum',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'seed';

-- feed
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'feed', 'besle', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'feed');

UPDATE words SET
  turkish = 'besle',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'feed';

-- feet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'feet', 'ayaklar', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'feet');

UPDATE words SET
  turkish = 'ayaklar',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'feet';

-- meet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'meet', 'buluş', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'meet');

UPDATE words SET
  turkish = 'buluş',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'meet';

-- feel
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'feel', 'hisset', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'feel');

UPDATE words SET
  turkish = 'hisset',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'feel';

-- deep
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'deep', 'derin', NULL, 4, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'deep');

UPDATE words SET
  turkish = 'derin',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'deep';

-- keep
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'keep', 'tut', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'keep');

UPDATE words SET
  turkish = 'tut',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'keep';

-- reef
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'reef', 'resif', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'reef');

UPDATE words SET
  turkish = 'resif',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'reef';

-- for
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'for', 'için', NULL, 4, NULL, NULL, 'preposition', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'for');

UPDATE words SET
  turkish = 'için',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'preposition',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'for';

-- born
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'born', 'doğdu', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'born');

UPDATE words SET
  turkish = 'doğdu',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'born';

-- sort
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sort', 'tür', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sort');

UPDATE words SET
  turkish = 'tür',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sort';

-- port
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'port', 'liman', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'port');

UPDATE words SET
  turkish = 'liman',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'port';

-- torn
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'torn', 'yırtık', NULL, 4, NULL, NULL, 'adjective', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'torn');

UPDATE words SET
  turkish = 'yırtık',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'torn';

-- jog
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'jog', 'koşu', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'jog');

UPDATE words SET
  turkish = 'koşu',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'jog';

-- job
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'job', 'iş', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'job');

UPDATE words SET
  turkish = 'iş',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'job';

-- sleep
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sleep', 'uyu', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sleep');

UPDATE words SET
  turkish = 'uyu',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sleep';

-- greet
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'greet', 'selamla', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'greet');

UPDATE words SET
  turkish = 'selamla',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'greet';

-- grain
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'grain', 'tahıl', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'grain');

UPDATE words SET
  turkish = 'tahıl',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'grain';

-- foam
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'foam', 'köpük', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'foam');

UPDATE words SET
  turkish = 'köpük',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'foam';

-- moan
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'moan', 'inle', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'moan');

UPDATE words SET
  turkish = 'inle',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'moan';

-- toad
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'toad', 'kara kurbağası', NULL, 4, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'toad');

UPDATE words SET
  turkish = 'kara kurbağası',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'toad';

-- groan
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'groan', 'inle', NULL, 4, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'groan');

UPDATE words SET
  turkish = 'inle',
  emoji = NULL,
  phonics_group = 4,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'groan';

-- buzz
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'buzz', 'vızılda', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'buzz');

UPDATE words SET
  turkish = 'vızılda',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'buzz';

-- fizz
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fizz', 'köpür', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fizz');

UPDATE words SET
  turkish = 'köpür',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fizz';

-- wing
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wing', 'kanat', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wing');

UPDATE words SET
  turkish = 'kanat',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'wing';

-- vest
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'vest', 'yelek', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'vest');

UPDATE words SET
  turkish = 'yelek',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'vest';

-- good
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'good', 'iyi', NULL, 5, NULL, NULL, 'adjective', NULL, NULL, 10, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'good');

UPDATE words SET
  turkish = 'iyi',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'good';

-- hook
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hook', 'kanca', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hook');

UPDATE words SET
  turkish = 'kanca',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hook';

-- wood
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wood', 'ahşap', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wood');

UPDATE words SET
  turkish = 'ahşap',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'wood';

-- took
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'took', 'aldı', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'took');

UPDATE words SET
  turkish = 'aldı',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'took';

-- food
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'food', 'yemek', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'food');

UPDATE words SET
  turkish = 'yemek',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'food';

-- cool
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'cool', 'havalı', NULL, 5, NULL, NULL, 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'cool');

UPDATE words SET
  turkish = 'havalı',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'cool';

-- pool
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'pool', 'havuz', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'pool');

UPDATE words SET
  turkish = 'havuz',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'pool';

-- room
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'room', 'oda', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'room');

UPDATE words SET
  turkish = 'oda',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'room';

-- boot
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'boot', 'çizme', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'boot');

UPDATE words SET
  turkish = 'çizme',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'boot';

-- tool
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'tool', 'araç', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'tool');

UPDATE words SET
  turkish = 'araç',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'tool';

-- zoom
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zoom', 'yaklaş', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zoom');

UPDATE words SET
  turkish = 'yaklaş',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'zoom';

-- zap
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zap', 'vur', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zap');

UPDATE words SET
  turkish = 'vur',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'zap';

-- wag
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wag', 'salla', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wag');

UPDATE words SET
  turkish = 'salla',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'wag';

-- vat
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'vat', 'büyük fıçı', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'vat');

UPDATE words SET
  turkish = 'büyük fıçı',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'vat';

-- weed
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'weed', 'yabani ot', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'weed');

UPDATE words SET
  turkish = 'yabani ot',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'weed';

-- week
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'week', 'hafta', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'week');

UPDATE words SET
  turkish = 'hafta',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'week';

-- wool
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wool', 'yün', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wool');

UPDATE words SET
  turkish = 'yün',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'wool';

-- soon
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'soon', 'yakında', NULL, 5, NULL, NULL, 'adverb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'soon');

UPDATE words SET
  turkish = 'yakında',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'soon';

-- noon
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'noon', 'öğle', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'noon');

UPDATE words SET
  turkish = 'öğle',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'noon';

-- weak
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'weak', 'zayıf', NULL, 5, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'weak');

UPDATE words SET
  turkish = 'zayıf',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'weak';

-- bang
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'bang', 'patlama', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'bang');

UPDATE words SET
  turkish = 'patlama',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'bang';

-- gang
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'gang', 'çete', NULL, 5, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'gang');

UPDATE words SET
  turkish = 'çete',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'gang';

-- hung
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'hung', 'asıldı', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'hung');

UPDATE words SET
  turkish = 'asıldı',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'hung';

-- sang
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'sang', 'söyledi', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'sang');

UPDATE words SET
  turkish = 'söyledi',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'sang';

-- zing
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'zing', 'zınla', NULL, 5, NULL, NULL, 'verb', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'zing');

UPDATE words SET
  turkish = 'zınla',
  emoji = NULL,
  phonics_group = 5,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'zing';

-- fix
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fix', 'düzelt', NULL, 6, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fix');

UPDATE words SET
  turkish = 'düzelt',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fix';

-- much
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'much', 'çok', NULL, 6, NULL, NULL, 'adverb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'much');

UPDATE words SET
  turkish = 'çok',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'much';

-- such
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'such', 'böyle', NULL, 6, NULL, NULL, 'adverb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'such');

UPDATE words SET
  turkish = 'böyle',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'such';

-- rich
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'rich', 'zengin', NULL, 6, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'rich');

UPDATE words SET
  turkish = 'zengin',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'rich';

-- wish
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'wish', 'dilek', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'wish');

UPDATE words SET
  turkish = 'dilek',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'wish';

-- push
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'push', 'it', NULL, 6, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'push');

UPDATE words SET
  turkish = 'it',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'push';

-- them
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'them', 'onlar', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'them');

UPDATE words SET
  turkish = 'onlar',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'them';

-- then
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'then', 'sonra', NULL, 6, NULL, NULL, 'adverb', NULL, NULL, 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'then');

UPDATE words SET
  turkish = 'sonra',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'then';

-- with
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'with', 'ile', NULL, 6, NULL, NULL, 'preposition', NULL, NULL, 10, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'with');

UPDATE words SET
  turkish = 'ile',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'preposition',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = TRUE
WHERE word = 'with';

-- think
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'think', 'düşün', NULL, 6, NULL, NULL, 'verb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'think');

UPDATE words SET
  turkish = 'düşün',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'think';

-- thing
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'thing', 'şey', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'thing');

UPDATE words SET
  turkish = 'şey',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'thing';

-- check
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'check', 'kontrol et', NULL, 6, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'check');

UPDATE words SET
  turkish = 'kontrol et',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'check';

-- chess
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chess', 'satranç', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chess');

UPDATE words SET
  turkish = 'satranç',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chess';

-- chest
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chest', 'göğüs', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chest');

UPDATE words SET
  turkish = 'göğüs',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chest';

-- shelf
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shelf', 'raf', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shelf');

UPDATE words SET
  turkish = 'raf',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shelf';

-- shell
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shell', 'kabuk', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shell');

UPDATE words SET
  turkish = 'kabuk',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shell';

-- fresh
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'fresh', 'taze', NULL, 6, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'fresh');

UPDATE words SET
  turkish = 'taze',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'fresh';

-- flash
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'flash', 'flaş', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'flash');

UPDATE words SET
  turkish = 'flaş',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'flash';

-- clash
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'clash', 'çarpışma', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'clash');

UPDATE words SET
  turkish = 'çarpışma',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'clash';

-- teach
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'teach', 'öğret', NULL, 6, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'teach');

UPDATE words SET
  turkish = 'öğret',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'teach';

-- beach
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'beach', 'plaj', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'beach');

UPDATE words SET
  turkish = 'plaj',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'beach';

-- reach
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'reach', 'uzat', NULL, 6, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'reach');

UPDATE words SET
  turkish = 'uzat',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'reach';

-- each
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'each', 'her', NULL, 6, NULL, NULL, 'adverb', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'each');

UPDATE words SET
  turkish = 'her',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'adverb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'each';

-- peach
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'peach', 'şeftali', NULL, 6, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'peach');

UPDATE words SET
  turkish = 'şeftali',
  emoji = NULL,
  phonics_group = 6,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'peach';

-- round
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'round', 'yuvarlak', NULL, 7, NULL, NULL, 'adjective', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'round');

UPDATE words SET
  turkish = 'yuvarlak',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'round';

-- found
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'found', 'buldu', NULL, 7, NULL, NULL, 'verb', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'found');

UPDATE words SET
  turkish = 'buldu',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'found';

-- mouse
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'mouse', 'fare', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'mouse');

UPDATE words SET
  turkish = 'fare',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'mouse';

-- house
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'house', 'ev', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'house');

UPDATE words SET
  turkish = 'ev',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'house';

-- shout
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'shout', 'bağır', NULL, 7, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'shout');

UPDATE words SET
  turkish = 'bağır',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'shout';

-- south
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'south', 'güney', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'south');

UPDATE words SET
  turkish = 'güney',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'south';

-- boil
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'boil', 'kaynat', NULL, 7, NULL, NULL, 'verb', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'boil');

UPDATE words SET
  turkish = 'kaynat',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'boil';

-- foil
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'foil', 'folyo', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'foil');

UPDATE words SET
  turkish = 'folyo',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'foil';

-- after
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'after', 'sonra', NULL, 7, NULL, NULL, 'preposition', NULL, NULL, 9, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'after');

UPDATE words SET
  turkish = 'sonra',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'preposition',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 9,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'after';

-- better
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'better', 'daha iyi', NULL, 7, NULL, NULL, 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'better');

UPDATE words SET
  turkish = 'daha iyi',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'better';

-- far
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'far', 'uzak', NULL, 7, NULL, NULL, 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'far');

UPDATE words SET
  turkish = 'uzak',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'far';

-- jar
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'jar', 'kavanos', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'jar');

UPDATE words SET
  turkish = 'kavanos',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'jar';

-- farm
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'farm', 'çiftlik', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'farm');

UPDATE words SET
  turkish = 'çiftlik',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'farm';

-- park
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'park', 'park', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'park');

UPDATE words SET
  turkish = 'park',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'park';

-- dark
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'dark', 'karanlık', NULL, 7, NULL, NULL, 'adjective', NULL, NULL, 8, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'dark');

UPDATE words SET
  turkish = 'karanlık',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'adjective',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 8,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'dark';

-- chart
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'chart', 'grafik', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'chart');

UPDATE words SET
  turkish = 'grafik',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'chart';

-- spark
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'spark', 'kıvılcım', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'spark');

UPDATE words SET
  turkish = 'kıvılcım',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'spark';

-- quill
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'quill', 'tüy kalem', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 4, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'quill');

UPDATE words SET
  turkish = 'tüy kalem',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 4,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'quill';

-- quest
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'quest', 'görev', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'quest');

UPDATE words SET
  turkish = 'görev',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'quest';

-- term
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'term', 'dönem', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 6, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'term');

UPDATE words SET
  turkish = 'dönem',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 6,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'term';

-- verb
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'verb', 'fiil', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'verb');

UPDATE words SET
  turkish = 'fiil',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'verb';

-- herd
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'herd', 'sürü', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 5, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'herd');

UPDATE words SET
  turkish = 'sürü',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 5,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'herd';

-- point
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'point', 'nokta', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'point');

UPDATE words SET
  turkish = 'nokta',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'point';

-- voice
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'voice', 'ses', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'voice');

UPDATE words SET
  turkish = 'ses',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'voice';

-- count
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'count', 'say', NULL, 7, NULL, NULL, 'verb', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'count');

UPDATE words SET
  turkish = 'say',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'verb',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'count';

-- town
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'town', 'kasaba', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'town');

UPDATE words SET
  turkish = 'kasaba',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'town';

-- crown
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'crown', 'taç', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'crown');

UPDATE words SET
  turkish = 'taç',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'crown';

-- clown
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'clown', 'palyaço', NULL, 7, NULL, NULL, 'noun', NULL, NULL, 7, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'clown');

UPDATE words SET
  turkish = 'palyaço',
  emoji = NULL,
  phonics_group = 7,
  level = NULL,
  category = NULL,
  part_of_speech = 'noun',
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 7,
  is_sight_word = FALSE,
  is_decodable = TRUE
WHERE word = 'clown';

-- the
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'the', 'the', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'the');

UPDATE words SET
  turkish = 'the',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'the';

-- a
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'a', 'a', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'a');

UPDATE words SET
  turkish = 'a',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'a';

-- and
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'and', 'and', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'and');

UPDATE words SET
  turkish = 'and',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'and';

-- is
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'is', 'is', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'is');

UPDATE words SET
  turkish = 'is',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'is';

-- it
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'it', 'it', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'it');

UPDATE words SET
  turkish = 'it',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'it';

-- in
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'in', 'in', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'in');

UPDATE words SET
  turkish = 'in',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'in';

-- I
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'I', 'I', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'I');

UPDATE words SET
  turkish = 'I',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'I';

-- you
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'you', 'you', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'you');

UPDATE words SET
  turkish = 'you',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'you';

-- he
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'he', 'he', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'he');

UPDATE words SET
  turkish = 'he',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'he';

-- she
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'she', 'she', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'she');

UPDATE words SET
  turkish = 'she',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'she';

-- we
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'we', 'we', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'we');

UPDATE words SET
  turkish = 'we',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'we';

-- go
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'go', 'go', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'go');

UPDATE words SET
  turkish = 'go',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'go';

-- do
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'do', 'do', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'do');

UPDATE words SET
  turkish = 'do',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'do';

-- my
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'my', 'my', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'my');

UPDATE words SET
  turkish = 'my',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'my';

-- are
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'are', 'are', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'are');

UPDATE words SET
  turkish = 'are',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'are';

-- was
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'was', 'was', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'was');

UPDATE words SET
  turkish = 'was',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'was';

-- his
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'his', 'his', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'his');

UPDATE words SET
  turkish = 'his',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'his';

-- they
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'they', 'they', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'they');

UPDATE words SET
  turkish = 'they',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'they';

-- all
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'all', 'all', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'all');

UPDATE words SET
  turkish = 'all',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'all';

-- said
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'said', 'said', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'said');

UPDATE words SET
  turkish = 'said',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'said';

-- have
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'have', 'have', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'have');

UPDATE words SET
  turkish = 'have',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'have';

-- of
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'of', 'of', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'of');

UPDATE words SET
  turkish = 'of',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'of';

-- to
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'to', 'to', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'to');

UPDATE words SET
  turkish = 'to',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'to';

-- up
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'up', 'up', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'up');

UPDATE words SET
  turkish = 'up',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'up';

-- at
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'at', 'at', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'at');

UPDATE words SET
  turkish = 'at',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'at';

-- me
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'me', 'me', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'me');

UPDATE words SET
  turkish = 'me',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'me';

-- by
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'by', 'by', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'by');

UPDATE words SET
  turkish = 'by',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'by';

-- no
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'no', 'no', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'no');

UPDATE words SET
  turkish = 'no',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'no';

-- so
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'so', 'so', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'so');

UPDATE words SET
  turkish = 'so',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'so';

-- be
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'be', 'be', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'be');

UPDATE words SET
  turkish = 'be',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'be';

-- as
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'as', 'as', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'as');

UPDATE words SET
  turkish = 'as',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'as';

-- on
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'on', 'on', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'on');

UPDATE words SET
  turkish = 'on',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'on';

-- if
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'if', 'if', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'if');

UPDATE words SET
  turkish = 'if',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'if';

-- or
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'or', 'or', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'or');

UPDATE words SET
  turkish = 'or',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'or';

-- an
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'an', 'an', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'an');

UPDATE words SET
  turkish = 'an',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'an';

-- has
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'has', 'has', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'has');

UPDATE words SET
  turkish = 'has',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'has';

-- did
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'did', 'did', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'did');

UPDATE words SET
  turkish = 'did',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'did';

-- get
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'get', 'get', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'get');

UPDATE words SET
  turkish = 'get',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'get';

-- put
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'put', 'put', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'put');

UPDATE words SET
  turkish = 'put',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'put';

-- too
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'too', 'too', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'too');

UPDATE words SET
  turkish = 'too',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'too';

-- who
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'who', 'who', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'who');

UPDATE words SET
  turkish = 'who',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'who';

-- what
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'what', 'what', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'what');

UPDATE words SET
  turkish = 'what',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'what';

-- when
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'when', 'when', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'when');

UPDATE words SET
  turkish = 'when',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'when';

-- where
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'where', 'where', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'where');

UPDATE words SET
  turkish = 'where',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'where';

-- there
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'there', 'there', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'there');

UPDATE words SET
  turkish = 'there',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'there';

-- here
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'here', 'here', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'here');

UPDATE words SET
  turkish = 'here',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'here';

-- now
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'now', 'now', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'now');

UPDATE words SET
  turkish = 'now',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'now';

-- like
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'like', 'like', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'like');

UPDATE words SET
  turkish = 'like',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'like';

-- come
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'come', 'come', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'come');

UPDATE words SET
  turkish = 'come',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'come';

-- some
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'some', 'some', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'some');

UPDATE words SET
  turkish = 'some',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'some';

-- into
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'into', 'into', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'into');

UPDATE words SET
  turkish = 'into',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'into';

-- want
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'want', 'want', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'want');

UPDATE words SET
  turkish = 'want',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'want';

-- will
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'will', 'will', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'will');

UPDATE words SET
  turkish = 'will',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'will';

-- new
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'new', 'new', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'new');

UPDATE words SET
  turkish = 'new',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'new';

-- little
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'little', 'little', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'little');

UPDATE words SET
  turkish = 'little',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'little';

-- old
INSERT INTO words (word, turkish, emoji, phonics_group, level, category, part_of_speech, phonetic_ipa, example_en, frequency, is_sight_word, is_decodable)
SELECT 'old', 'old', NULL, 1, NULL, NULL, NULL, NULL, NULL, 10, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM words WHERE word = 'old');

UPDATE words SET
  turkish = 'old',
  emoji = NULL,
  phonics_group = 1,
  level = NULL,
  category = NULL,
  part_of_speech = NULL,
  phonetic_ipa = NULL,
  example_en = NULL,
  frequency = 10,
  is_sight_word = TRUE,
  is_decodable = FALSE
WHERE word = 'old';

COMMIT;