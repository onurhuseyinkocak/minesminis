-- MinesMinis Exercise Seed Data
-- Generated: 2026-04-02T08:34:59.740Z
-- Total exercises: 402

BEGIN;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-01', 'rhyme', 1, 'cat', NULL, '{"id":"rhy-det-01","type":"detect","targetWord":"cat","candidateWord":"bat","doesRhyme":true,"difficulty":1,"hint":"Listen for the -at sound at the end.","hintTr":"Sondaki -at sesini dinle."}'::jsonb, '{}', '{"cat"}', NULL, 1)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-02', 'rhyme', 1, 'dog', NULL, '{"id":"rhy-det-02","type":"detect","targetWord":"dog","candidateWord":"log","doesRhyme":true,"difficulty":1,"hint":"Both end with the -og sound.","hintTr":"İkisi de -og sesiyle bitiyor."}'::jsonb, '{}', '{"dog"}', NULL, 2)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-03', 'rhyme', 1, 'sun', NULL, '{"id":"rhy-det-03","type":"detect","targetWord":"sun","candidateWord":"fun","doesRhyme":true,"difficulty":1,"hint":"Listen for the -un sound.","hintTr":"-un sesine dikkat et."}'::jsonb, '{}', '{"sun"}', NULL, 3)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-04', 'rhyme', 2, 'sit', NULL, '{"id":"rhy-det-04","type":"detect","targetWord":"sit","candidateWord":"bit","doesRhyme":true,"difficulty":2,"hint":"Both end with -it.","hintTr":"İkisi de -it ile bitiyor."}'::jsonb, '{}', '{"sit"}', NULL, 4)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-05', 'rhyme', 2, 'hop', NULL, '{"id":"rhy-det-05","type":"detect","targetWord":"hop","candidateWord":"top","doesRhyme":true,"difficulty":2,"hint":"Listen for the -op sound.","hintTr":"-op sesine dikkat et."}'::jsonb, '{}', '{"hop"}', NULL, 5)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-06', 'rhyme', 1, 'cat', NULL, '{"id":"rhy-det-06","type":"detect","targetWord":"cat","candidateWord":"dog","doesRhyme":false,"difficulty":1,"hint":"Cat ends with -at, dog ends with -og.","hintTr":"Cat -at, dog ise -og ile bitiyor."}'::jsonb, '{}', '{"cat"}', NULL, 6)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-07', 'rhyme', 1, 'sun', NULL, '{"id":"rhy-det-07","type":"detect","targetWord":"sun","candidateWord":"sit","doesRhyme":false,"difficulty":1,"hint":"They start with the same letter but end differently.","hintTr":"Aynı harfle başlıyorlar ama farklı seslerle bitiyorlar."}'::jsonb, '{}', '{"sun"}', NULL, 7)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-08', 'rhyme', 2, 'bell', NULL, '{"id":"rhy-det-08","type":"detect","targetWord":"bell","candidateWord":"bat","doesRhyme":false,"difficulty":2,"hint":"Bell ends with -ell, bat ends with -at.","hintTr":"Bell -ell, bat ise -at ile bitiyor."}'::jsonb, '{}', '{"bell"}', NULL, 8)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-09', 'rhyme', 2, 'hop', NULL, '{"id":"rhy-det-09","type":"detect","targetWord":"hop","candidateWord":"hat","doesRhyme":false,"difficulty":2,"hint":"They both start with h but end differently.","hintTr":"İkisi de h ile başlar ama farklı seslerle biter."}'::jsonb, '{}', '{"hop"}', NULL, 9)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-det-10', 'rhyme', 3, 'big', NULL, '{"id":"rhy-det-10","type":"detect","targetWord":"big","candidateWord":"back","doesRhyme":false,"difficulty":3,"hint":"Big ends with -ig, back ends with -ack.","hintTr":"Big -ig, back ise -ack ile bitiyor."}'::jsonb, '{}', '{"big"}', NULL, 10)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-01', 'rhyme', 1, 'cat', NULL, '{"id":"rhy-pro-01","type":"produce","targetWord2":"cat","options":["bat","dog","sun","bell"],"correctOption":"bat","difficulty":1,"hint":"Find the word that ends with -at.","hintTr":"-at ile biten kelimeyi bul."}'::jsonb, '{}', '{"cat"}', NULL, 11)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-02', 'rhyme', 1, 'log', NULL, '{"id":"rhy-pro-02","type":"produce","targetWord2":"log","options":["cat","fog","sun","bit"],"correctOption":"fog","difficulty":1,"hint":"Find the word that ends with -og.","hintTr":"-og ile biten kelimeyi bul."}'::jsonb, '{}', '{"log"}', NULL, 12)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-03', 'rhyme', 1, 'sun', NULL, '{"id":"rhy-pro-03","type":"produce","targetWord2":"sun","options":["cat","dog","fun","bell"],"correctOption":"fun","difficulty":1,"hint":"Find the word that ends with -un.","hintTr":"-un ile biten kelimeyi bul."}'::jsonb, '{}', '{"sun"}', NULL, 13)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-04', 'rhyme', 1, 'sit', NULL, '{"id":"rhy-pro-04","type":"produce","targetWord2":"sit","options":["cat","dog","sun","bit"],"correctOption":"bit","difficulty":1,"hint":"Find the word that ends with -it.","hintTr":"-it ile biten kelimeyi bul."}'::jsonb, '{}', '{"sit"}', NULL, 14)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-05', 'rhyme', 2, 'hop', NULL, '{"id":"rhy-pro-05","type":"produce","targetWord2":"hop","options":["cat","top","sun","big"],"correctOption":"top","difficulty":2,"hint":"Find the word that ends with -op.","hintTr":"-op ile biten kelimeyi bul."}'::jsonb, '{}', '{"hop"}', NULL, 15)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-06', 'rhyme', 2, 'big', NULL, '{"id":"rhy-pro-06","type":"produce","targetWord2":"big","options":["cat","dog","twig","sun"],"correctOption":"twig","difficulty":2,"hint":"Find the word that ends with -ig.","hintTr":"-ig ile biten kelimeyi bul."}'::jsonb, '{}', '{"big"}', NULL, 16)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-07', 'rhyme', 2, 'bell', NULL, '{"id":"rhy-pro-07","type":"produce","targetWord2":"bell","options":["cat","sell","dog","sun"],"correctOption":"sell","difficulty":2,"hint":"Find the word that ends with -ell.","hintTr":"-ell ile biten kelimeyi bul."}'::jsonb, '{}', '{"bell"}', NULL, 17)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-08', 'rhyme', 2, 'back', NULL, '{"id":"rhy-pro-08","type":"produce","targetWord2":"back","options":["sun","dog","stack","kit"],"correctOption":"stack","difficulty":2,"hint":"Find the word that ends with -ack.","hintTr":"-ack ile biten kelimeyi bul."}'::jsonb, '{}', '{"back"}', NULL, 18)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-09', 'rhyme', 2, 'pin', NULL, '{"id":"rhy-pro-09","type":"produce","targetWord2":"pin","options":["cat","win","dog","hop"],"correctOption":"win","difficulty":2,"hint":"Find the word that ends with -in.","hintTr":"-in ile biten kelimeyi bul."}'::jsonb, '{}', '{"pin"}', NULL, 19)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-10', 'rhyme', 2, 'hot', NULL, '{"id":"rhy-pro-10","type":"produce","targetWord2":"hot","options":["cat","big","pot","sun"],"correctOption":"pot","difficulty":2,"hint":"Find the word that ends with -ot.","hintTr":"-ot ile biten kelimeyi bul."}'::jsonb, '{}', '{"hot"}', NULL, 20)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-11', 'rhyme', 3, 'hat', NULL, '{"id":"rhy-pro-11","type":"produce","targetWord2":"hat","options":["flat","dog","bell","pin"],"correctOption":"flat","difficulty":3,"hint":"Find the word that ends with -at.","hintTr":"-at ile biten kelimeyi bul."}'::jsonb, '{}', '{"hat"}', NULL, 21)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-pro-12', 'rhyme', 3, 'well', NULL, '{"id":"rhy-pro-12","type":"produce","targetWord2":"well","options":["back","fell","dog","hop"],"correctOption":"fell","difficulty":3,"hint":"Find the word that ends with -ell.","hintTr":"-ell ile biten kelimeyi bul."}'::jsonb, '{}', '{"well"}', NULL, 22)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-01', 'rhyme', 1, NULL, NULL, '{"id":"rhy-srt-01","type":"sort","words":["cat","bat","dog","fog","hat","log"],"families":[["cat","bat","hat"],["dog","fog","log"]],"difficulty":1,"hint":"Group the -at words and the -og words.","hintTr":"-at kelimelerini ve -og kelimelerini grupla."}'::jsonb, '{}', '{"cat","bat","dog","fog","hat","log"}', NULL, 23)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-02', 'rhyme', 1, NULL, NULL, '{"id":"rhy-srt-02","type":"sort","words":["sun","fun","sit","bit","run","kit"],"families":[["sun","fun","run"],["sit","bit","kit"]],"difficulty":1,"hint":"Group the -un words and the -it words.","hintTr":"-un kelimelerini ve -it kelimelerini grupla."}'::jsonb, '{}', '{"sun","fun","sit","bit","run","kit"}', NULL, 24)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-03', 'rhyme', 1, NULL, NULL, '{"id":"rhy-srt-03","type":"sort","words":["hop","top","big","twig","pop","pig"],"families":[["hop","top","pop"],["big","twig","pig"]],"difficulty":1,"hint":"Group the -op words and the -ig words.","hintTr":"-op kelimelerini ve -ig kelimelerini grupla."}'::jsonb, '{}', '{"hop","top","big","twig","pop","pig"}', NULL, 25)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-04', 'rhyme', 2, NULL, NULL, '{"id":"rhy-srt-04","type":"sort","words":["bell","sell","back","stack","fell","pack"],"families":[["bell","sell","fell"],["back","stack","pack"]],"difficulty":2,"hint":"Group the -ell words and the -ack words.","hintTr":"-ell kelimelerini ve -ack kelimelerini grupla."}'::jsonb, '{}', '{"bell","sell","back","stack","fell","pack"}', NULL, 26)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-05', 'rhyme', 2, NULL, NULL, '{"id":"rhy-srt-05","type":"sort","words":["pin","win","hot","pot","fin","dot"],"families":[["pin","win","fin"],["hot","pot","dot"]],"difficulty":2,"hint":"Group the -in words and the -ot words.","hintTr":"-in kelimelerini ve -ot kelimelerini grupla."}'::jsonb, '{}', '{"pin","win","hot","pot","fin","dot"}', NULL, 27)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-06', 'rhyme', 2, NULL, NULL, '{"id":"rhy-srt-06","type":"sort","words":["cat","sun","sat","bun","mat","fun"],"families":[["cat","sat","mat"],["sun","bun","fun"]],"difficulty":2,"hint":"Group the -at words and the -un words.","hintTr":"-at kelimelerini ve -un kelimelerini grupla."}'::jsonb, '{}', '{"cat","sun","sat","bun","mat","fun"}', NULL, 28)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-07', 'rhyme', 3, NULL, NULL, '{"id":"rhy-srt-07","type":"sort","words":["bell","pin","spell","bin","well","thin"],"families":[["bell","spell","well"],["pin","bin","thin"]],"difficulty":3,"hint":"Group the -ell words and the -in words.","hintTr":"-ell kelimelerini ve -in kelimelerini grupla."}'::jsonb, '{}', '{"bell","pin","spell","bin","well","thin"}', NULL, 29)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('rhyme_rhy-srt-08', 'rhyme', 3, NULL, NULL, '{"id":"rhy-srt-08","type":"sort","words":["hop","dot","shop","knot","crop","slot"],"families":[["hop","shop","crop"],["dot","knot","slot"]],"difficulty":3,"hint":"Group the -op words and the -ot words.","hintTr":"-op kelimelerini ve -ot kelimelerini grupla."}'::jsonb, '{}', '{"hop","dot","shop","knot","crop","slot"}', NULL, 30)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_01', 'phoneme_manipulation', 1, 'Say ''cat'' without the /k/ sound', '''cat'' kelimesini /k/ sesi olmadan söyle', '{"id":"del_01","type":"delete","prompt":"Say ''cat'' without the /k/ sound","promptTr":"''cat'' kelimesini /k/ sesi olmadan söyle","targetWord":"cat","targetWordPhonemes":["k","æ","t"],"changeInstruction":"remove /k/","correctAnswer":"at","options":["at","it","an","up"],"difficulty":1,"hint":"Take away the first sound!"}'::jsonb, '{"k","æ","t"}', '{"cat"}', NULL, 31)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_02', 'phoneme_manipulation', 1, 'Say ''stop'' without the /s/ sound', '''stop'' kelimesini /s/ sesi olmadan söyle', '{"id":"del_02","type":"delete","prompt":"Say ''stop'' without the /s/ sound","promptTr":"''stop'' kelimesini /s/ sesi olmadan söyle","targetWord":"stop","targetWordPhonemes":["s","t","ɒ","p"],"changeInstruction":"remove /s/","correctAnswer":"top","options":["top","tip","tap","pop"],"difficulty":1,"hint":"Say the last three sounds only!"}'::jsonb, '{"s","t","ɒ","p"}', '{"stop"}', NULL, 32)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_03', 'phoneme_manipulation', 1, 'Say ''bat'' without the /b/ sound', '''bat'' kelimesini /b/ sesi olmadan söyle', '{"id":"del_03","type":"delete","prompt":"Say ''bat'' without the /b/ sound","promptTr":"''bat'' kelimesini /b/ sesi olmadan söyle","targetWord":"bat","targetWordPhonemes":["b","æ","t"],"changeInstruction":"remove /b/","correctAnswer":"at","options":["at","an","it","act"],"difficulty":1,"hint":"Drop the first sound!"}'::jsonb, '{"b","æ","t"}', '{"bat"}', NULL, 33)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_04', 'phoneme_manipulation', 1, 'Say ''flat'' without the /l/ sound', '''flat'' kelimesini /l/ sesi olmadan söyle', '{"id":"del_04","type":"delete","prompt":"Say ''flat'' without the /l/ sound","promptTr":"''flat'' kelimesini /l/ sesi olmadan söyle","targetWord":"flat","targetWordPhonemes":["f","l","æ","t"],"changeInstruction":"remove /l/","correctAnswer":"fat","options":["fat","fan","fit","fun"],"difficulty":1,"hint":"Skip the /l/ in the blend!"}'::jsonb, '{"f","l","æ","t"}', '{"flat"}', NULL, 34)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_05', 'phoneme_manipulation', 1, 'Say ''clap'' without the /l/ sound', '''clap'' kelimesini /l/ sesi olmadan söyle', '{"id":"del_05","type":"delete","prompt":"Say ''clap'' without the /l/ sound","promptTr":"''clap'' kelimesini /l/ sesi olmadan söyle","targetWord":"clap","targetWordPhonemes":["k","l","æ","p"],"changeInstruction":"remove /l/","correctAnswer":"cap","options":["cap","cup","cop","lap"],"difficulty":1,"hint":"Remove the /l/ from the blend!"}'::jsonb, '{"k","l","æ","p"}', '{"clap"}', NULL, 35)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_06', 'phoneme_manipulation', 1, 'Say ''snip'' without the /n/ sound', '''snip'' kelimesini /n/ sesi olmadan söyle', '{"id":"del_06","type":"delete","prompt":"Say ''snip'' without the /n/ sound","promptTr":"''snip'' kelimesini /n/ sesi olmadan söyle","targetWord":"snip","targetWordPhonemes":["s","n","ɪ","p"],"changeInstruction":"remove /n/","correctAnswer":"sip","options":["sip","nip","tip","lip"],"difficulty":1,"hint":"Take the /m/ out of the blend!"}'::jsonb, '{"s","n","ɪ","p"}', '{"snip"}', NULL, 36)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_07', 'phoneme_manipulation', 1, 'Say ''frog'' without the /r/ sound', '''frog'' kelimesini /r/ sesi olmadan söyle', '{"id":"del_07","type":"delete","prompt":"Say ''frog'' without the /r/ sound","promptTr":"''frog'' kelimesini /r/ sesi olmadan söyle","targetWord":"frog","targetWordPhonemes":["f","r","ɒ","g"],"changeInstruction":"remove /r/","correctAnswer":"fog","options":["fog","fig","fan","log"],"difficulty":1,"hint":"Drop the /r/ from the blend!"}'::jsonb, '{"f","r","ɒ","g"}', '{"frog"}', NULL, 37)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_08', 'phoneme_manipulation', 1, 'Say ''plan'' without the /l/ sound', '''plan'' kelimesini /l/ sesi olmadan söyle', '{"id":"del_08","type":"delete","prompt":"Say ''plan'' without the /l/ sound","promptTr":"''plan'' kelimesini /l/ sesi olmadan söyle","targetWord":"plan","targetWordPhonemes":["p","l","æ","n"],"changeInstruction":"remove /l/","correctAnswer":"pan","options":["pan","pen","pin","pun"],"difficulty":1,"hint":"Skip the /l/!"}'::jsonb, '{"p","l","æ","n"}', '{"plan"}', NULL, 38)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_09', 'phoneme_manipulation', 1, 'Say ''trip'' without the /r/ sound', '''trip'' kelimesini /r/ sesi olmadan söyle', '{"id":"del_09","type":"delete","prompt":"Say ''trip'' without the /r/ sound","promptTr":"''trip'' kelimesini /r/ sesi olmadan söyle","targetWord":"trip","targetWordPhonemes":["t","r","ɪ","p"],"changeInstruction":"remove /r/","correctAnswer":"tip","options":["tip","tap","top","rip"],"difficulty":1,"hint":"Remove the /r/ from the blend!"}'::jsonb, '{"t","r","ɪ","p"}', '{"trip"}', NULL, 39)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_del_10', 'phoneme_manipulation', 1, 'Say ''skip'' without the /k/ sound', '''skip'' kelimesini /k/ sesi olmadan söyle', '{"id":"del_10","type":"delete","prompt":"Say ''skip'' without the /k/ sound","promptTr":"''skip'' kelimesini /k/ sesi olmadan söyle","targetWord":"skip","targetWordPhonemes":["s","k","ɪ","p"],"changeInstruction":"remove /k/","correctAnswer":"sip","options":["sip","sit","sun","bin"],"difficulty":1,"hint":"Take out the /k/!"}'::jsonb, '{"s","k","ɪ","p"}', '{"skip"}', NULL, 40)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_01', 'phoneme_manipulation', 2, 'Change the /b/ in ''bat'' to /s/', '''bat'' kelimesindeki /b/ sesini /s/ ile değiştir', '{"id":"sub_01","type":"substitute","prompt":"Change the /b/ in ''bat'' to /s/","promptTr":"''bat'' kelimesindeki /b/ sesini /s/ ile değiştir","targetWord":"bat","targetWordPhonemes":["b","æ","t"],"changeInstruction":"/b/ → /s/","correctAnswer":"sat","options":["sat","mat","rat","fat"],"difficulty":2,"hint":"Start with /s/ instead of /b/!"}'::jsonb, '{"b","æ","t"}', '{"bat"}', NULL, 41)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_02', 'phoneme_manipulation', 2, 'Change the /f/ in ''fun'' to /r/', '''fun'' kelimesindeki /f/ sesini /r/ ile değiştir', '{"id":"sub_02","type":"substitute","prompt":"Change the /f/ in ''fun'' to /r/","promptTr":"''fun'' kelimesindeki /f/ sesini /r/ ile değiştir","targetWord":"fun","targetWordPhonemes":["f","ʌ","n"],"changeInstruction":"/f/ → /r/","correctAnswer":"run","options":["run","sun","bun","gum"],"difficulty":2,"hint":"Swap /f/ for /r/ at the start!"}'::jsonb, '{"f","ʌ","n"}', '{"fun"}', NULL, 42)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_03', 'phoneme_manipulation', 2, 'Change the /d/ in ''dog'' to /l/', '''dog'' kelimesindeki /d/ sesini /l/ ile değiştir', '{"id":"sub_03","type":"substitute","prompt":"Change the /d/ in ''dog'' to /l/","promptTr":"''dog'' kelimesindeki /d/ sesini /l/ ile değiştir","targetWord":"dog","targetWordPhonemes":["d","ɒ","g"],"changeInstruction":"/d/ → /l/","correctAnswer":"log","options":["log","fog","hog","jog"],"difficulty":2,"hint":"Replace the first sound with /l/!"}'::jsonb, '{"d","ɒ","g"}', '{"dog"}', NULL, 43)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_04', 'phoneme_manipulation', 2, 'Change the /h/ in ''hot'' to /p/', '''hot'' kelimesindeki /h/ sesini /p/ ile değiştir', '{"id":"sub_04","type":"substitute","prompt":"Change the /h/ in ''hot'' to /p/","promptTr":"''hot'' kelimesindeki /h/ sesini /p/ ile değiştir","targetWord":"hot","targetWordPhonemes":["h","ɒ","t"],"changeInstruction":"/h/ → /p/","correctAnswer":"pot","options":["pot","dot","cot","lot"],"difficulty":2,"hint":"Change the first sound to /p/!"}'::jsonb, '{"h","ɒ","t"}', '{"hot"}', NULL, 44)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_05', 'phoneme_manipulation', 2, 'Change the /æ/ in ''cat'' to /ʌ/', '''cat'' kelimesindeki /a/ sesini /u/ ile değiştir', '{"id":"sub_05","type":"substitute","prompt":"Change the /æ/ in ''cat'' to /ʌ/","promptTr":"''cat'' kelimesindeki /a/ sesini /u/ ile değiştir","targetWord":"cat","targetWordPhonemes":["k","æ","t"],"changeInstruction":"/æ/ → /ʌ/","correctAnswer":"cut","options":["cut","cot","kit","cub"],"difficulty":2,"hint":"Swap the vowel in the middle!"}'::jsonb, '{"k","æ","t"}', '{"cat"}', NULL, 45)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_06', 'phoneme_manipulation', 2, 'Change the /t/ in ''top'' to /h/', '''top'' kelimesindeki /t/ sesini /h/ ile değiştir', '{"id":"sub_06","type":"substitute","prompt":"Change the /t/ in ''top'' to /h/","promptTr":"''top'' kelimesindeki /t/ sesini /h/ ile değiştir","targetWord":"top","targetWordPhonemes":["t","ɒ","p"],"changeInstruction":"/t/ → /h/","correctAnswer":"hop","options":["hop","mop","pop","cop"],"difficulty":2,"hint":"Replace /t/ with /h/ at the start!"}'::jsonb, '{"t","ɒ","p"}', '{"top"}', NULL, 46)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_07', 'phoneme_manipulation', 2, 'Change the /n/ in ''sun'' to /b/', '''sun'' kelimesindeki /n/ sesini /b/ ile değiştir', '{"id":"sub_07","type":"substitute","prompt":"Change the /n/ in ''sun'' to /b/","promptTr":"''sun'' kelimesindeki /n/ sesini /b/ ile değiştir","targetWord":"sun","targetWordPhonemes":["s","ʌ","n"],"changeInstruction":"/n/ → /b/","correctAnswer":"sub","options":["sub","sum","sup","sud"],"difficulty":2,"hint":"Change the last sound to /b/!"}'::jsonb, '{"s","ʌ","n"}', '{"sun"}', NULL, 47)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_08', 'phoneme_manipulation', 2, 'Change the /p/ in ''pin'' to /w/', '''pin'' kelimesindeki /p/ sesini /w/ ile değiştir', '{"id":"sub_08","type":"substitute","prompt":"Change the /p/ in ''pin'' to /w/","promptTr":"''pin'' kelimesindeki /p/ sesini /w/ ile değiştir","targetWord":"pin","targetWordPhonemes":["p","ɪ","n"],"changeInstruction":"/p/ → /w/","correctAnswer":"win","options":["win","bin","tin","fin"],"difficulty":2,"hint":"Start with /w/ instead!"}'::jsonb, '{"p","ɪ","n"}', '{"pin"}', NULL, 48)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_09', 'phoneme_manipulation', 2, 'Change the /m/ in ''map'' to /k/', '''map'' kelimesindeki /m/ sesini /k/ ile değiştir', '{"id":"sub_09","type":"substitute","prompt":"Change the /m/ in ''map'' to /k/","promptTr":"''map'' kelimesindeki /m/ sesini /k/ ile değiştir","targetWord":"map","targetWordPhonemes":["m","æ","p"],"changeInstruction":"/m/ → /k/","correctAnswer":"cap","options":["cap","lap","tap","nap"],"difficulty":2,"hint":"Swap the first sound for /k/!"}'::jsonb, '{"m","æ","p"}', '{"map"}', NULL, 49)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_sub_10', 'phoneme_manipulation', 2, 'Change the /g/ in ''bag'' to /d/', '''bag'' kelimesindeki /g/ sesini /d/ ile değiştir', '{"id":"sub_10","type":"substitute","prompt":"Change the /g/ in ''bag'' to /d/","promptTr":"''bag'' kelimesindeki /g/ sesini /d/ ile değiştir","targetWord":"bag","targetWordPhonemes":["b","æ","g"],"changeInstruction":"/g/ → /d/","correctAnswer":"bad","options":["bad","mad","sad","dad"],"difficulty":2,"hint":"Change the last sound to /d/!"}'::jsonb, '{"b","æ","g"}', '{"bag"}', NULL, 50)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_01', 'phoneme_manipulation', 3, 'Add /s/ to the front of ''top''', '''top'' kelimesinin başına /s/ ekle', '{"id":"add_01","type":"add","prompt":"Add /s/ to the front of ''top''","promptTr":"''top'' kelimesinin başına /s/ ekle","targetWord":"top","targetWordPhonemes":["t","ɒ","p"],"changeInstruction":"add /s/ at start","correctAnswer":"stop","options":["stop","step","snap","strap"],"difficulty":3,"hint":"Put /s/ right before /t/!"}'::jsonb, '{"t","ɒ","p"}', '{"top"}', NULL, 51)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_02', 'phoneme_manipulation', 3, 'Add /l/ after the /p/ in ''pay''', '''pay'' kelimesindeki /p/ sesinden sonra /l/ ekle', '{"id":"add_02","type":"add","prompt":"Add /l/ after the /p/ in ''pay''","promptTr":"''pay'' kelimesindeki /p/ sesinden sonra /l/ ekle","targetWord":"pay","targetWordPhonemes":["p","eɪ"],"changeInstruction":"add /l/ after /p/","correctAnswer":"play","options":["play","clay","stay","pray"],"difficulty":3,"hint":"Blend /p/ and /l/ together at the start!"}'::jsonb, '{"p","eɪ"}', '{"pay"}', NULL, 52)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_03', 'phoneme_manipulation', 3, 'Add /s/ to the end of ''cat''', '''cat'' kelimesinin sonuna /s/ ekle', '{"id":"add_03","type":"add","prompt":"Add /s/ to the end of ''cat''","promptTr":"''cat'' kelimesinin sonuna /s/ ekle","targetWord":"cat","targetWordPhonemes":["k","æ","t"],"changeInstruction":"add /s/ at end","correctAnswer":"cats","options":["cats","cast","cans","cuts"],"difficulty":3,"hint":"Add /s/ at the very end!"}'::jsonb, '{"k","æ","t"}', '{"cat"}', NULL, 53)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_04', 'phoneme_manipulation', 3, 'Add /r/ after the /d/ in ''dip''', '''dip'' kelimesindeki /d/ sesinden sonra /r/ ekle', '{"id":"add_04","type":"add","prompt":"Add /r/ after the /d/ in ''dip''","promptTr":"''dip'' kelimesindeki /d/ sesinden sonra /r/ ekle","targetWord":"dip","targetWordPhonemes":["d","ɪ","p"],"changeInstruction":"add /r/ after /d/","correctAnswer":"drip","options":["drip","drop","trip","grip"],"difficulty":3,"hint":"Blend /t/ and /r/ at the start!"}'::jsonb, '{"d","ɪ","p"}', '{"dip"}', NULL, 54)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_05', 'phoneme_manipulation', 3, 'Add /f/ to the front of ''light''', '''light'' kelimesinin başına /f/ ekle', '{"id":"add_05","type":"add","prompt":"Add /f/ to the front of ''light''","promptTr":"''light'' kelimesinin başına /f/ ekle","targetWord":"light","targetWordPhonemes":["l","aɪ","t"],"changeInstruction":"add /f/ at start","correctAnswer":"flight","options":["flight","fright","slight","blight"],"difficulty":3,"hint":"Put /f/ before /l/!"}'::jsonb, '{"l","aɪ","t"}', '{"light"}', NULL, 55)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_06', 'phoneme_manipulation', 3, 'Add /n/ to the end of ''ca''', '''ca'' sesinin sonuna /n/ ekle', '{"id":"add_06","type":"add","prompt":"Add /n/ to the end of ''ca''","promptTr":"''ca'' sesinin sonuna /n/ ekle","targetWord":"ca","targetWordPhonemes":["k","æ"],"changeInstruction":"add /n/ at end","correctAnswer":"can","options":["can","cap","cab","cat"],"difficulty":3,"hint":"What ends with /n/?"}'::jsonb, '{"k","æ"}', '{"ca"}', NULL, 56)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_07', 'phoneme_manipulation', 3, 'Add /r/ after the /g/ in ''ow''', '''ow'' kelimesinin başına /gr/ ekle', '{"id":"add_07","type":"add","prompt":"Add /r/ after the /g/ in ''ow''","promptTr":"''ow'' kelimesinin başına /gr/ ekle","targetWord":"ow","targetWordPhonemes":["aʊ"],"changeInstruction":"add /gr/ at start","correctAnswer":"grow","options":["grow","glow","crow","flow"],"difficulty":3,"hint":"Put /g/ and /r/ before the vowel!"}'::jsonb, '{"aʊ"}', '{"ow"}', NULL, 57)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_08', 'phoneme_manipulation', 3, 'Add /s/ to the front of ''lim''', '''lim'' kelimesinin başına /s/ ekle', '{"id":"add_08","type":"add","prompt":"Add /s/ to the front of ''lim''","promptTr":"''lim'' kelimesinin başına /s/ ekle","targetWord":"lim","targetWordPhonemes":["l","ɪ","m"],"changeInstruction":"add /s/ at start","correctAnswer":"slim","options":["slim","swim","trim","drum"],"difficulty":3,"hint":"Put /s/ before /l/!"}'::jsonb, '{"l","ɪ","m"}', '{"lim"}', NULL, 58)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_09', 'phoneme_manipulation', 3, 'Add /r/ after the /d/ in ''um''', '''um'' kelimesinin başına /dr/ ekle', '{"id":"add_09","type":"add","prompt":"Add /r/ after the /d/ in ''um''","promptTr":"''um'' kelimesinin başına /dr/ ekle","targetWord":"um","targetWordPhonemes":["ʌ","m"],"changeInstruction":"add /dr/ at start","correctAnswer":"drum","options":["drum","drip","grip","trim"],"difficulty":3,"hint":"Blend /d/ and /r/ before the vowel!"}'::jsonb, '{"ʌ","m"}', '{"um"}', NULL, 59)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('phoneme_add_10', 'phoneme_manipulation', 3, 'Add /l/ to the end of ''fee''', '''fee'' kelimesinin sonuna /l/ ekle', '{"id":"add_10","type":"add","prompt":"Add /l/ to the end of ''fee''","promptTr":"''fee'' kelimesinin sonuna /l/ ekle","targetWord":"fee","targetWordPhonemes":["f","iː"],"changeInstruction":"add /l/ at end","correctAnswer":"feel","options":["feel","heel","peel","reel"],"difficulty":3,"hint":"Put /l/ right at the end!"}'::jsonb, '{"f","iː"}', '{"fee"}', NULL, 60)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-cat', 'syllable', 1, 'cat', 'kedi', '{"id":"syl-cat","word":"cat","wordTr":"kedi","syllables":["cat"],"syllableCount":1,"imageWord":"cat"}'::jsonb, '{}', '{"cat"}', NULL, 61)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-dog', 'syllable', 1, 'dog', 'köpek', '{"id":"syl-dog","word":"dog","wordTr":"köpek","syllables":["dog"],"syllableCount":1,"imageWord":"dog"}'::jsonb, '{}', '{"dog"}', NULL, 62)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-sun', 'syllable', 1, 'sun', 'güneş', '{"id":"syl-sun","word":"sun","wordTr":"güneş","syllables":["sun"],"syllableCount":1,"imageWord":"sun"}'::jsonb, '{}', '{"sun"}', NULL, 63)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-hat', 'syllable', 1, 'hat', 'şapka', '{"id":"syl-hat","word":"hat","wordTr":"şapka","syllables":["hat"],"syllableCount":1,"imageWord":"hat"}'::jsonb, '{}', '{"hat"}', NULL, 64)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-run', 'syllable', 1, 'run', 'koşmak', '{"id":"syl-run","word":"run","wordTr":"koşmak","syllables":["run"],"syllableCount":1}'::jsonb, '{}', '{"run"}', NULL, 65)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-monkey', 'syllable', 2, 'monkey', 'maymun', '{"id":"syl-monkey","word":"monkey","wordTr":"maymun","syllables":["mon","key"],"syllableCount":2}'::jsonb, '{}', '{"monkey"}', NULL, 66)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-apple', 'syllable', 2, 'apple', 'elma', '{"id":"syl-apple","word":"apple","wordTr":"elma","syllables":["ap","ple"],"syllableCount":2,"imageWord":"apple"}'::jsonb, '{}', '{"apple"}', NULL, 67)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-turtle', 'syllable', 2, 'turtle', 'kaplumbağa', '{"id":"syl-turtle","word":"turtle","wordTr":"kaplumbağa","syllables":["tur","tle"],"syllableCount":2}'::jsonb, '{}', '{"turtle"}', NULL, 68)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-happy', 'syllable', 2, 'happy', 'mutlu', '{"id":"syl-happy","word":"happy","wordTr":"mutlu","syllables":["hap","py"],"syllableCount":2}'::jsonb, '{}', '{"happy"}', NULL, 69)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-garden', 'syllable', 2, 'garden', 'bahçe', '{"id":"syl-garden","word":"garden","wordTr":"bahçe","syllables":["gar","den"],"syllableCount":2}'::jsonb, '{}', '{"garden"}', NULL, 70)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-butter', 'syllable', 2, 'butter', 'tereyağı', '{"id":"syl-butter","word":"butter","wordTr":"tereyağı","syllables":["but","ter"],"syllableCount":2}'::jsonb, '{}', '{"butter"}', NULL, 71)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-pencil', 'syllable', 2, 'pencil', 'kalem', '{"id":"syl-pencil","word":"pencil","wordTr":"kalem","syllables":["pen","cil"],"syllableCount":2}'::jsonb, '{}', '{"pencil"}', NULL, 72)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-winter', 'syllable', 2, 'winter', 'kış', '{"id":"syl-winter","word":"winter","wordTr":"kış","syllables":["win","ter"],"syllableCount":2}'::jsonb, '{}', '{"winter"}', NULL, 73)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-elephant', 'syllable', 3, 'elephant', 'fil', '{"id":"syl-elephant","word":"elephant","wordTr":"fil","syllables":["el","e","phant"],"syllableCount":3}'::jsonb, '{}', '{"elephant"}', NULL, 74)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-banana', 'syllable', 3, 'banana', 'muz', '{"id":"syl-banana","word":"banana","wordTr":"muz","syllables":["ba","na","na"],"syllableCount":3,"imageWord":"banana"}'::jsonb, '{}', '{"banana"}', NULL, 75)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-umbrella', 'syllable', 3, 'umbrella', 'şemsiye', '{"id":"syl-umbrella","word":"umbrella","wordTr":"şemsiye","syllables":["um","brel","la"],"syllableCount":3}'::jsonb, '{}', '{"umbrella"}', NULL, 76)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-tomorrow', 'syllable', 3, 'tomorrow', 'yarın', '{"id":"syl-tomorrow","word":"tomorrow","wordTr":"yarın","syllables":["to","mor","row"],"syllableCount":3}'::jsonb, '{}', '{"tomorrow"}', NULL, 77)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-potato', 'syllable', 3, 'potato', 'patates', '{"id":"syl-potato","word":"potato","wordTr":"patates","syllables":["po","ta","to"],"syllableCount":3}'::jsonb, '{}', '{"potato"}', NULL, 78)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-remember', 'syllable', 3, 'remember', 'hatırlamak', '{"id":"syl-remember","word":"remember","wordTr":"hatırlamak","syllables":["re","mem","ber"],"syllableCount":3}'::jsonb, '{}', '{"remember"}', NULL, 79)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-amazing', 'syllable', 3, 'amazing', 'muhteşem', '{"id":"syl-amazing","word":"amazing","wordTr":"muhteşem","syllables":["a","maz","ing"],"syllableCount":3}'::jsonb, '{}', '{"amazing"}', NULL, 80)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-together', 'syllable', 3, 'together', 'beraber', '{"id":"syl-together","word":"together","wordTr":"beraber","syllables":["to","geth","er"],"syllableCount":3}'::jsonb, '{}', '{"together"}', NULL, 81)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-caterpillar', 'syllable', 4, 'caterpillar', 'tırtıl', '{"id":"syl-caterpillar","word":"caterpillar","wordTr":"tırtıl","syllables":["cat","er","pil","lar"],"syllableCount":4}'::jsonb, '{}', '{"caterpillar"}', NULL, 82)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-watermelon', 'syllable', 4, 'watermelon', 'karpuz', '{"id":"syl-watermelon","word":"watermelon","wordTr":"karpuz","syllables":["wa","ter","mel","on"],"syllableCount":4,"imageWord":"watermelon"}'::jsonb, '{}', '{"watermelon"}', NULL, 83)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-alligator', 'syllable', 4, 'alligator', 'timsah', '{"id":"syl-alligator","word":"alligator","wordTr":"timsah","syllables":["al","li","ga","tor"],"syllableCount":4}'::jsonb, '{}', '{"alligator"}', NULL, 84)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('syllable_syl-information', 'syllable', 4, 'information', 'bilgi', '{"id":"syl-information","word":"information","wordTr":"bilgi","syllables":["in","for","ma","tion"],"syllableCount":4}'::jsonb, '{}', '{"information"}', NULL, 85)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cat_1_0', 'blending', 1, 'cat', 'kedi', '{"word":"cat","letters":["c","a","t"],"phonemes":["/k/","/æ/","/t/"],"turkish":"kedi","emoji":"🐱","level":1,"type":"CVC"}'::jsonb, '{"/k/","/æ/","/t/"}', '{"cat"}', 1, 86)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bat_1_1', 'blending', 1, 'bat', 'yarasa', '{"word":"bat","letters":["b","a","t"],"phonemes":["/b/","/æ/","/t/"],"turkish":"yarasa","emoji":"🦇","level":1,"type":"CVC"}'::jsonb, '{"/b/","/æ/","/t/"}', '{"bat"}', 1, 87)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hat_1_2', 'blending', 1, 'hat', 'şapka', '{"word":"hat","letters":["h","a","t"],"phonemes":["/h/","/æ/","/t/"],"turkish":"şapka","emoji":"🎩","level":1,"type":"CVC"}'::jsonb, '{"/h/","/æ/","/t/"}', '{"hat"}', 1, 88)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_mat_1_3', 'blending', 1, 'mat', 'paspas', '{"word":"mat","letters":["m","a","t"],"phonemes":["/m/","/æ/","/t/"],"turkish":"paspas","emoji":"🟫","level":1,"type":"CVC"}'::jsonb, '{"/m/","/æ/","/t/"}', '{"mat"}', 1, 89)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_rat_1_4', 'blending', 1, 'rat', 'sıçan', '{"word":"rat","letters":["r","a","t"],"phonemes":["/r/","/æ/","/t/"],"turkish":"sıçan","emoji":"🐀","level":1,"type":"CVC"}'::jsonb, '{"/r/","/æ/","/t/"}', '{"rat"}', 1, 90)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_sat_1_5', 'blending', 1, 'sat', 'oturdu', '{"word":"sat","letters":["s","a","t"],"phonemes":["/s/","/æ/","/t/"],"turkish":"oturdu","emoji":"💺","level":1,"type":"CVC"}'::jsonb, '{"/s/","/æ/","/t/"}', '{"sat"}', 1, 91)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bag_1_6', 'blending', 1, 'bag', 'çanta', '{"word":"bag","letters":["b","a","g"],"phonemes":["/b/","/æ/","/g/"],"turkish":"çanta","emoji":"👜","level":1,"type":"CVC"}'::jsonb, '{"/b/","/æ/","/g/"}', '{"bag"}', 1, 92)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_dad_1_7', 'blending', 1, 'dad', 'baba', '{"word":"dad","letters":["d","a","d"],"phonemes":["/d/","/æ/","/d/"],"turkish":"baba","emoji":"👨","level":1,"type":"CVC"}'::jsonb, '{"/d/","/æ/","/d/"}', '{"dad"}', 1, 93)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_had_1_8', 'blending', 1, 'had', 'vardı', '{"word":"had","letters":["h","a","d"],"phonemes":["/h/","/æ/","/d/"],"turkish":"vardı","emoji":"✅","level":1,"type":"CVC"}'::jsonb, '{"/h/","/æ/","/d/"}', '{"had"}', 1, 94)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_man_1_9', 'blending', 1, 'man', 'adam', '{"word":"man","letters":["m","a","n"],"phonemes":["/m/","/æ/","/n/"],"turkish":"adam","emoji":"👤","level":1,"type":"CVC"}'::jsonb, '{"/m/","/æ/","/n/"}', '{"man"}', 1, 95)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pan_1_10', 'blending', 1, 'pan', 'tava', '{"word":"pan","letters":["p","a","n"],"phonemes":["/p/","/æ/","/n/"],"turkish":"tava","emoji":"🍳","level":1,"type":"CVC"}'::jsonb, '{"/p/","/æ/","/n/"}', '{"pan"}', 1, 96)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_ran_1_11', 'blending', 1, 'ran', 'koştu', '{"word":"ran","letters":["r","a","n"],"phonemes":["/r/","/æ/","/n/"],"turkish":"koştu","emoji":"🏃","level":1,"type":"CVC"}'::jsonb, '{"/r/","/æ/","/n/"}', '{"ran"}', 1, 97)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_van_1_12', 'blending', 1, 'van', 'minibüs', '{"word":"van","letters":["v","a","n"],"phonemes":["/v/","/æ/","/n/"],"turkish":"minibüs","emoji":"🚐","level":1,"type":"CVC"}'::jsonb, '{"/v/","/æ/","/n/"}', '{"van"}', 1, 98)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_map_1_13', 'blending', 1, 'map', 'harita', '{"word":"map","letters":["m","a","p"],"phonemes":["/m/","/æ/","/p/"],"turkish":"harita","emoji":"🗺️","level":1,"type":"CVC"}'::jsonb, '{"/m/","/æ/","/p/"}', '{"map"}', 1, 99)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_tap_1_14', 'blending', 1, 'tap', 'musluk / dokunmak', '{"word":"tap","letters":["t","a","p"],"phonemes":["/t/","/æ/","/p/"],"turkish":"musluk / dokunmak","emoji":"🚰","level":1,"type":"CVC"}'::jsonb, '{"/t/","/æ/","/p/"}', '{"tap"}', 1, 100)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cap_1_15', 'blending', 1, 'cap', 'kasket', '{"word":"cap","letters":["c","a","p"],"phonemes":["/k/","/æ/","/p/"],"turkish":"kasket","emoji":"🧢","level":1,"type":"CVC"}'::jsonb, '{"/k/","/æ/","/p/"}', '{"cap"}', 1, 101)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_nap_1_16', 'blending', 1, 'nap', 'kısa uyku', '{"word":"nap","letters":["n","a","p"],"phonemes":["/n/","/æ/","/p/"],"turkish":"kısa uyku","emoji":"😴","level":1,"type":"CVC"}'::jsonb, '{"/n/","/æ/","/p/"}', '{"nap"}', 1, 102)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_gap_1_17', 'blending', 1, 'gap', 'boşluk', '{"word":"gap","letters":["g","a","p"],"phonemes":["/g/","/æ/","/p/"],"turkish":"boşluk","emoji":"↔️","level":1,"type":"CVC"}'::jsonb, '{"/g/","/æ/","/p/"}', '{"gap"}', 1, 103)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bed_1_18', 'blending', 1, 'bed', 'yatak', '{"word":"bed","letters":["b","e","d"],"phonemes":["/b/","/ɛ/","/d/"],"turkish":"yatak","emoji":"🛏️","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ɛ/","/d/"}', '{"bed"}', 1, 104)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_red_1_19', 'blending', 1, 'red', 'kırmızı', '{"word":"red","letters":["r","e","d"],"phonemes":["/r/","/ɛ/","/d/"],"turkish":"kırmızı","emoji":"🔴","level":1,"type":"CVC"}'::jsonb, '{"/r/","/ɛ/","/d/"}', '{"red"}', 1, 105)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_leg_1_20', 'blending', 1, 'leg', 'bacak', '{"word":"leg","letters":["l","e","g"],"phonemes":["/l/","/ɛ/","/g/"],"turkish":"bacak","emoji":"🦵","level":1,"type":"CVC"}'::jsonb, '{"/l/","/ɛ/","/g/"}', '{"leg"}', 1, 106)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hen_1_21', 'blending', 1, 'hen', 'tavuk', '{"word":"hen","letters":["h","e","n"],"phonemes":["/h/","/ɛ/","/n/"],"turkish":"tavuk","emoji":"🐔","level":1,"type":"CVC"}'::jsonb, '{"/h/","/ɛ/","/n/"}', '{"hen"}', 1, 107)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pen_1_22', 'blending', 1, 'pen', 'kalem', '{"word":"pen","letters":["p","e","n"],"phonemes":["/p/","/ɛ/","/n/"],"turkish":"kalem","emoji":"✏️","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɛ/","/n/"}', '{"pen"}', 1, 108)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_ten_1_23', 'blending', 1, 'ten', 'on', '{"word":"ten","letters":["t","e","n"],"phonemes":["/t/","/ɛ/","/n/"],"turkish":"on","emoji":"🔟","level":1,"type":"CVC"}'::jsonb, '{"/t/","/ɛ/","/n/"}', '{"ten"}', 1, 109)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_men_1_24', 'blending', 1, 'men', 'erkekler', '{"word":"men","letters":["m","e","n"],"phonemes":["/m/","/ɛ/","/n/"],"turkish":"erkekler","emoji":"👬","level":1,"type":"CVC"}'::jsonb, '{"/m/","/ɛ/","/n/"}', '{"men"}', 1, 110)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pet_1_25', 'blending', 1, 'pet', 'evcil hayvan', '{"word":"pet","letters":["p","e","t"],"phonemes":["/p/","/ɛ/","/t/"],"turkish":"evcil hayvan","emoji":"🐾","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɛ/","/t/"}', '{"pet"}', 1, 111)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_set_1_26', 'blending', 1, 'set', 'set / koymak', '{"word":"set","letters":["s","e","t"],"phonemes":["/s/","/ɛ/","/t/"],"turkish":"set / koymak","emoji":"📦","level":1,"type":"CVC"}'::jsonb, '{"/s/","/ɛ/","/t/"}', '{"set"}', 1, 112)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_wet_1_27', 'blending', 1, 'wet', 'ıslak', '{"word":"wet","letters":["w","e","t"],"phonemes":["/w/","/ɛ/","/t/"],"turkish":"ıslak","emoji":"💦","level":1,"type":"CVC"}'::jsonb, '{"/w/","/ɛ/","/t/"}', '{"wet"}', 1, 113)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_net_1_28', 'blending', 1, 'net', 'ağ', '{"word":"net","letters":["n","e","t"],"phonemes":["/n/","/ɛ/","/t/"],"turkish":"ağ","emoji":"🕸️","level":1,"type":"CVC"}'::jsonb, '{"/n/","/ɛ/","/t/"}', '{"net"}', 1, 114)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_jet_1_29', 'blending', 1, 'jet', 'uçak / jet', '{"word":"jet","letters":["j","e","t"],"phonemes":["/dʒ/","/ɛ/","/t/"],"turkish":"uçak / jet","emoji":"✈️","level":1,"type":"CVC"}'::jsonb, '{"/dʒ/","/ɛ/","/t/"}', '{"jet"}', 1, 115)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_met_1_30', 'blending', 1, 'met', 'tanıştı', '{"word":"met","letters":["m","e","t"],"phonemes":["/m/","/ɛ/","/t/"],"turkish":"tanıştı","emoji":"🤝","level":1,"type":"CVC"}'::jsonb, '{"/m/","/ɛ/","/t/"}', '{"met"}', 1, 116)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_get_1_31', 'blending', 1, 'get', 'almak / gitmek', '{"word":"get","letters":["g","e","t"],"phonemes":["/g/","/ɛ/","/t/"],"turkish":"almak / gitmek","emoji":"👋","level":1,"type":"CVC"}'::jsonb, '{"/g/","/ɛ/","/t/"}', '{"get"}', 1, 117)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_let_1_32', 'blending', 1, 'let', 'izin vermek', '{"word":"let","letters":["l","e","t"],"phonemes":["/l/","/ɛ/","/t/"],"turkish":"izin vermek","emoji":"🟢","level":1,"type":"CVC"}'::jsonb, '{"/l/","/ɛ/","/t/"}', '{"let"}', 1, 118)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_yet_1_33', 'blending', 1, 'yet', 'henüz', '{"word":"yet","letters":["y","e","t"],"phonemes":["/j/","/ɛ/","/t/"],"turkish":"henüz","emoji":"⏳","level":1,"type":"CVC"}'::jsonb, '{"/j/","/ɛ/","/t/"}', '{"yet"}', 1, 119)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_beg_1_34', 'blending', 1, 'beg', 'yalvarmak', '{"word":"beg","letters":["b","e","g"],"phonemes":["/b/","/ɛ/","/g/"],"turkish":"yalvarmak","emoji":"🙏","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ɛ/","/g/"}', '{"beg"}', 1, 120)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_peg_1_35', 'blending', 1, 'peg', 'mantar / kazık', '{"word":"peg","letters":["p","e","g"],"phonemes":["/p/","/ɛ/","/g/"],"turkish":"mantar / kazık","emoji":"📌","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɛ/","/g/"}', '{"peg"}', 1, 121)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_big_1_36', 'blending', 1, 'big', 'büyük', '{"word":"big","letters":["b","i","g"],"phonemes":["/b/","/ɪ/","/g/"],"turkish":"büyük","emoji":"🐘","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ɪ/","/g/"}', '{"big"}', 1, 122)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_dig_1_37', 'blending', 1, 'dig', 'kazmak', '{"word":"dig","letters":["d","i","g"],"phonemes":["/d/","/ɪ/","/g/"],"turkish":"kazmak","emoji":"⛏️","level":1,"type":"CVC"}'::jsonb, '{"/d/","/ɪ/","/g/"}', '{"dig"}', 1, 123)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_fig_1_38', 'blending', 1, 'fig', 'incir', '{"word":"fig","letters":["f","i","g"],"phonemes":["/f/","/ɪ/","/g/"],"turkish":"incir","emoji":"🌿","level":1,"type":"CVC"}'::jsonb, '{"/f/","/ɪ/","/g/"}', '{"fig"}', 1, 124)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pig_1_39', 'blending', 1, 'pig', 'domuz', '{"word":"pig","letters":["p","i","g"],"phonemes":["/p/","/ɪ/","/g/"],"turkish":"domuz","emoji":"🐷","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɪ/","/g/"}', '{"pig"}', 1, 125)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_wig_1_40', 'blending', 1, 'wig', 'peruk', '{"word":"wig","letters":["w","i","g"],"phonemes":["/w/","/ɪ/","/g/"],"turkish":"peruk","emoji":"💇","level":1,"type":"CVC"}'::jsonb, '{"/w/","/ɪ/","/g/"}', '{"wig"}', 1, 126)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bin_1_41', 'blending', 1, 'bin', 'çöp kutusu', '{"word":"bin","letters":["b","i","n"],"phonemes":["/b/","/ɪ/","/n/"],"turkish":"çöp kutusu","emoji":"🗑️","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ɪ/","/n/"}', '{"bin"}', 1, 127)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_fin_1_42', 'blending', 1, 'fin', 'yüzgeç', '{"word":"fin","letters":["f","i","n"],"phonemes":["/f/","/ɪ/","/n/"],"turkish":"yüzgeç","emoji":"🐟","level":1,"type":"CVC"}'::jsonb, '{"/f/","/ɪ/","/n/"}', '{"fin"}', 1, 128)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pin_1_43', 'blending', 1, 'pin', 'iğne', '{"word":"pin","letters":["p","i","n"],"phonemes":["/p/","/ɪ/","/n/"],"turkish":"iğne","emoji":"📍","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɪ/","/n/"}', '{"pin"}', 1, 129)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_tin_1_44', 'blending', 1, 'tin', 'teneke', '{"word":"tin","letters":["t","i","n"],"phonemes":["/t/","/ɪ/","/n/"],"turkish":"teneke","emoji":"🥫","level":1,"type":"CVC"}'::jsonb, '{"/t/","/ɪ/","/n/"}', '{"tin"}', 1, 130)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_win_1_45', 'blending', 1, 'win', 'kazanmak', '{"word":"win","letters":["w","i","n"],"phonemes":["/w/","/ɪ/","/n/"],"turkish":"kazanmak","emoji":"🏆","level":1,"type":"CVC"}'::jsonb, '{"/w/","/ɪ/","/n/"}', '{"win"}', 1, 131)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bit_1_46', 'blending', 1, 'bit', 'parça / ısırmak', '{"word":"bit","letters":["b","i","t"],"phonemes":["/b/","/ɪ/","/t/"],"turkish":"parça / ısırmak","emoji":"🦷","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ɪ/","/t/"}', '{"bit"}', 1, 132)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_fit_1_47', 'blending', 1, 'fit', 'uymak / sağlıklı', '{"word":"fit","letters":["f","i","t"],"phonemes":["/f/","/ɪ/","/t/"],"turkish":"uymak / sağlıklı","emoji":"💪","level":1,"type":"CVC"}'::jsonb, '{"/f/","/ɪ/","/t/"}', '{"fit"}', 1, 133)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hid_1_48', 'blending', 1, 'hid', 'saklandı', '{"word":"hid","letters":["h","i","d"],"phonemes":["/h/","/ɪ/","/d/"],"turkish":"saklandı","emoji":"🙈","level":1,"type":"CVC"}'::jsonb, '{"/h/","/ɪ/","/d/"}', '{"hid"}', 1, 134)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_kit_1_49', 'blending', 1, 'kit', 'takım / kit', '{"word":"kit","letters":["k","i","t"],"phonemes":["/k/","/ɪ/","/t/"],"turkish":"takım / kit","emoji":"🧰","level":1,"type":"CVC"}'::jsonb, '{"/k/","/ɪ/","/t/"}', '{"kit"}', 1, 135)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_sit_1_50', 'blending', 1, 'sit', 'oturmak', '{"word":"sit","letters":["s","i","t"],"phonemes":["/s/","/ɪ/","/t/"],"turkish":"oturmak","emoji":"💺","level":1,"type":"CVC"}'::jsonb, '{"/s/","/ɪ/","/t/"}', '{"sit"}', 1, 136)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_lip_1_51', 'blending', 1, 'lip', 'dudak', '{"word":"lip","letters":["l","i","p"],"phonemes":["/l/","/ɪ/","/p/"],"turkish":"dudak","emoji":"👄","level":1,"type":"CVC"}'::jsonb, '{"/l/","/ɪ/","/p/"}', '{"lip"}', 1, 137)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_rip_1_52', 'blending', 1, 'rip', 'yırtmak', '{"word":"rip","letters":["r","i","p"],"phonemes":["/r/","/ɪ/","/p/"],"turkish":"yırtmak","emoji":"✂️","level":1,"type":"CVC"}'::jsonb, '{"/r/","/ɪ/","/p/"}', '{"rip"}', 1, 138)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_tip_1_53', 'blending', 1, 'tip', 'uç / ipucu', '{"word":"tip","letters":["t","i","p"],"phonemes":["/t/","/ɪ/","/p/"],"turkish":"uç / ipucu","emoji":"💡","level":1,"type":"CVC"}'::jsonb, '{"/t/","/ɪ/","/p/"}', '{"tip"}', 1, 139)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_zip_1_54', 'blending', 1, 'zip', 'fermuar', '{"word":"zip","letters":["z","i","p"],"phonemes":["/z/","/ɪ/","/p/"],"turkish":"fermuar","emoji":"🤐","level":1,"type":"CVC"}'::jsonb, '{"/z/","/ɪ/","/p/"}', '{"zip"}', 1, 140)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_box_1_55', 'blending', 1, 'box', 'kutu', '{"word":"box","letters":["b","o","x"],"phonemes":["/b/","/ɒ/","/ks/"],"turkish":"kutu","emoji":"📦","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ɒ/","/ks/"}', '{"box"}', 1, 141)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_fox_1_56', 'blending', 1, 'fox', 'tilki', '{"word":"fox","letters":["f","o","x"],"phonemes":["/f/","/ɒ/","/ks/"],"turkish":"tilki","emoji":"🦊","level":1,"type":"CVC"}'::jsonb, '{"/f/","/ɒ/","/ks/"}', '{"fox"}', 1, 142)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_dog_1_57', 'blending', 1, 'dog', 'köpek', '{"word":"dog","letters":["d","o","g"],"phonemes":["/d/","/ɒ/","/g/"],"turkish":"köpek","emoji":"🐶","level":1,"type":"CVC"}'::jsonb, '{"/d/","/ɒ/","/g/"}', '{"dog"}', 1, 143)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_fog_1_58', 'blending', 1, 'fog', 'sis', '{"word":"fog","letters":["f","o","g"],"phonemes":["/f/","/ɒ/","/g/"],"turkish":"sis","emoji":"🌫️","level":1,"type":"CVC"}'::jsonb, '{"/f/","/ɒ/","/g/"}', '{"fog"}', 1, 144)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hot_1_59', 'blending', 1, 'hot', 'sıcak', '{"word":"hot","letters":["h","o","t"],"phonemes":["/h/","/ɒ/","/t/"],"turkish":"sıcak","emoji":"🔥","level":1,"type":"CVC"}'::jsonb, '{"/h/","/ɒ/","/t/"}', '{"hot"}', 1, 145)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pot_1_60', 'blending', 1, 'pot', 'tencere', '{"word":"pot","letters":["p","o","t"],"phonemes":["/p/","/ɒ/","/t/"],"turkish":"tencere","emoji":"🫕","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɒ/","/t/"}', '{"pot"}', 1, 146)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_dot_1_61', 'blending', 1, 'dot', 'nokta', '{"word":"dot","letters":["d","o","t"],"phonemes":["/d/","/ɒ/","/t/"],"turkish":"nokta","emoji":"⚫","level":1,"type":"CVC"}'::jsonb, '{"/d/","/ɒ/","/t/"}', '{"dot"}', 1, 147)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_lot_1_62', 'blending', 1, 'lot', 'çok / lot', '{"word":"lot","letters":["l","o","t"],"phonemes":["/l/","/ɒ/","/t/"],"turkish":"çok / lot","emoji":"🔢","level":1,"type":"CVC"}'::jsonb, '{"/l/","/ɒ/","/t/"}', '{"lot"}', 1, 148)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_not_1_63', 'blending', 1, 'not', 'değil', '{"word":"not","letters":["n","o","t"],"phonemes":["/n/","/ɒ/","/t/"],"turkish":"değil","emoji":"❌","level":1,"type":"CVC"}'::jsonb, '{"/n/","/ɒ/","/t/"}', '{"not"}', 1, 149)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_got_1_64', 'blending', 1, 'got', 'aldı / oldu', '{"word":"got","letters":["g","o","t"],"phonemes":["/g/","/ɒ/","/t/"],"turkish":"aldı / oldu","emoji":"✅","level":1,"type":"CVC"}'::jsonb, '{"/g/","/ɒ/","/t/"}', '{"got"}', 1, 150)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_mop_1_65', 'blending', 1, 'mop', 'paspas', '{"word":"mop","letters":["m","o","p"],"phonemes":["/m/","/ɒ/","/p/"],"turkish":"paspas","emoji":"🧹","level":1,"type":"CVC"}'::jsonb, '{"/m/","/ɒ/","/p/"}', '{"mop"}', 1, 151)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_top_1_66', 'blending', 1, 'top', 'üst / top', '{"word":"top","letters":["t","o","p"],"phonemes":["/t/","/ɒ/","/p/"],"turkish":"üst / top","emoji":"🔝","level":1,"type":"CVC"}'::jsonb, '{"/t/","/ɒ/","/p/"}', '{"top"}', 1, 152)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hop_1_67', 'blending', 1, 'hop', 'sıçramak', '{"word":"hop","letters":["h","o","p"],"phonemes":["/h/","/ɒ/","/p/"],"turkish":"sıçramak","emoji":"🐸","level":1,"type":"CVC"}'::jsonb, '{"/h/","/ɒ/","/p/"}', '{"hop"}', 1, 153)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pop_1_68', 'blending', 1, 'pop', 'patlamak', '{"word":"pop","letters":["p","o","p"],"phonemes":["/p/","/ɒ/","/p/"],"turkish":"patlamak","emoji":"🎈","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ɒ/","/p/"}', '{"pop"}', 1, 154)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_log_1_69', 'blending', 1, 'log', 'kütük', '{"word":"log","letters":["l","o","g"],"phonemes":["/l/","/ɒ/","/g/"],"turkish":"kütük","emoji":"🪵","level":1,"type":"CVC"}'::jsonb, '{"/l/","/ɒ/","/g/"}', '{"log"}', 1, 155)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cob_1_70', 'blending', 1, 'cob', 'mısır koçanı', '{"word":"cob","letters":["c","o","b"],"phonemes":["/k/","/ɒ/","/b/"],"turkish":"mısır koçanı","emoji":"🌽","level":1,"type":"CVC"}'::jsonb, '{"/k/","/ɒ/","/b/"}', '{"cob"}', 1, 156)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_job_1_71', 'blending', 1, 'job', 'iş', '{"word":"job","letters":["j","o","b"],"phonemes":["/dʒ/","/ɒ/","/b/"],"turkish":"iş","emoji":"💼","level":1,"type":"CVC"}'::jsonb, '{"/dʒ/","/ɒ/","/b/"}', '{"job"}', 1, 157)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_rod_1_72', 'blending', 1, 'rod', 'olta çubuğu', '{"word":"rod","letters":["r","o","d"],"phonemes":["/r/","/ɒ/","/d/"],"turkish":"olta çubuğu","emoji":"🎣","level":1,"type":"CVC"}'::jsonb, '{"/r/","/ɒ/","/d/"}', '{"rod"}', 1, 158)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bug_1_73', 'blending', 1, 'bug', 'böcek', '{"word":"bug","letters":["b","u","g"],"phonemes":["/b/","/ʌ/","/g/"],"turkish":"böcek","emoji":"🐛","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ʌ/","/g/"}', '{"bug"}', 1, 159)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hug_1_74', 'blending', 1, 'hug', 'sarılmak', '{"word":"hug","letters":["h","u","g"],"phonemes":["/h/","/ʌ/","/g/"],"turkish":"sarılmak","emoji":"🤗","level":1,"type":"CVC"}'::jsonb, '{"/h/","/ʌ/","/g/"}', '{"hug"}', 1, 160)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_jug_1_75', 'blending', 1, 'jug', 'sürahi', '{"word":"jug","letters":["j","u","g"],"phonemes":["/dʒ/","/ʌ/","/g/"],"turkish":"sürahi","emoji":"🫙","level":1,"type":"CVC"}'::jsonb, '{"/dʒ/","/ʌ/","/g/"}', '{"jug"}', 1, 161)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_mug_1_76', 'blending', 1, 'mug', 'kupa', '{"word":"mug","letters":["m","u","g"],"phonemes":["/m/","/ʌ/","/g/"],"turkish":"kupa","emoji":"☕","level":1,"type":"CVC"}'::jsonb, '{"/m/","/ʌ/","/g/"}', '{"mug"}', 1, 162)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_rug_1_77', 'blending', 1, 'rug', 'kilim', '{"word":"rug","letters":["r","u","g"],"phonemes":["/r/","/ʌ/","/g/"],"turkish":"kilim","emoji":"🟫","level":1,"type":"CVC"}'::jsonb, '{"/r/","/ʌ/","/g/"}', '{"rug"}', 1, 163)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_tug_1_78', 'blending', 1, 'tug', 'çekmek', '{"word":"tug","letters":["t","u","g"],"phonemes":["/t/","/ʌ/","/g/"],"turkish":"çekmek","emoji":"🚢","level":1,"type":"CVC"}'::jsonb, '{"/t/","/ʌ/","/g/"}', '{"tug"}', 1, 164)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bun_1_79', 'blending', 1, 'bun', 'topuz / çörek', '{"word":"bun","letters":["b","u","n"],"phonemes":["/b/","/ʌ/","/n/"],"turkish":"topuz / çörek","emoji":"🍞","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ʌ/","/n/"}', '{"bun"}', 1, 165)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_fun_1_80', 'blending', 1, 'fun', 'eğlence', '{"word":"fun","letters":["f","u","n"],"phonemes":["/f/","/ʌ/","/n/"],"turkish":"eğlence","emoji":"🎉","level":1,"type":"CVC"}'::jsonb, '{"/f/","/ʌ/","/n/"}', '{"fun"}', 1, 166)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_gum_1_81', 'blending', 1, 'gum', 'sakız', '{"word":"gum","letters":["g","u","m"],"phonemes":["/g/","/ʌ/","/m/"],"turkish":"sakız","emoji":"🫧","level":1,"type":"CVC"}'::jsonb, '{"/g/","/ʌ/","/m/"}', '{"gum"}', 1, 167)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_run_1_82', 'blending', 1, 'run', 'koşmak', '{"word":"run","letters":["r","u","n"],"phonemes":["/r/","/ʌ/","/n/"],"turkish":"koşmak","emoji":"🏃","level":1,"type":"CVC"}'::jsonb, '{"/r/","/ʌ/","/n/"}', '{"run"}', 1, 168)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_sun_1_83', 'blending', 1, 'sun', 'güneş', '{"word":"sun","letters":["s","u","n"],"phonemes":["/s/","/ʌ/","/n/"],"turkish":"güneş","emoji":"☀️","level":1,"type":"CVC"}'::jsonb, '{"/s/","/ʌ/","/n/"}', '{"sun"}', 1, 169)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bus_1_84', 'blending', 1, 'bus', 'otobüs', '{"word":"bus","letters":["b","u","s"],"phonemes":["/b/","/ʌ/","/s/"],"turkish":"otobüs","emoji":"🚌","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ʌ/","/s/"}', '{"bus"}', 1, 170)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cup_1_85', 'blending', 1, 'cup', 'bardak', '{"word":"cup","letters":["c","u","p"],"phonemes":["/k/","/ʌ/","/p/"],"turkish":"bardak","emoji":"🥤","level":1,"type":"CVC"}'::jsonb, '{"/k/","/ʌ/","/p/"}', '{"cup"}', 1, 171)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cut_1_86', 'blending', 1, 'cut', 'kesmek', '{"word":"cut","letters":["c","u","t"],"phonemes":["/k/","/ʌ/","/t/"],"turkish":"kesmek","emoji":"✂️","level":1,"type":"CVC"}'::jsonb, '{"/k/","/ʌ/","/t/"}', '{"cut"}', 1, 172)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_but_1_87', 'blending', 1, 'but', 'ama / fakat', '{"word":"but","letters":["b","u","t"],"phonemes":["/b/","/ʌ/","/t/"],"turkish":"ama / fakat","emoji":"↔️","level":1,"type":"CVC"}'::jsonb, '{"/b/","/ʌ/","/t/"}', '{"but"}', 1, 173)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_nut_1_88', 'blending', 1, 'nut', 'fındık / somun', '{"word":"nut","letters":["n","u","t"],"phonemes":["/n/","/ʌ/","/t/"],"turkish":"fındık / somun","emoji":"🥜","level":1,"type":"CVC"}'::jsonb, '{"/n/","/ʌ/","/t/"}', '{"nut"}', 1, 174)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pup_1_89', 'blending', 1, 'pup', 'yavru köpek', '{"word":"pup","letters":["p","u","p"],"phonemes":["/p/","/ʌ/","/p/"],"turkish":"yavru köpek","emoji":"🐶","level":1,"type":"CVC"}'::jsonb, '{"/p/","/ʌ/","/p/"}', '{"pup"}', 1, 175)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_mud_1_90', 'blending', 1, 'mud', 'çamur', '{"word":"mud","letters":["m","u","d"],"phonemes":["/m/","/ʌ/","/d/"],"turkish":"çamur","emoji":"🟤","level":1,"type":"CVC"}'::jsonb, '{"/m/","/ʌ/","/d/"}', '{"mud"}', 1, 176)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_ship_2_91', 'blending', 2, 'ship', 'gemi', '{"word":"ship","letters":["sh","i","p"],"phonemes":["/ʃ/","/ɪ/","/p/"],"turkish":"gemi","emoji":"🚢","level":2,"type":"CCVC"}'::jsonb, '{"/ʃ/","/ɪ/","/p/"}', '{"ship"}', 2, 177)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_shop_2_92', 'blending', 2, 'shop', 'dükkan', '{"word":"shop","letters":["sh","o","p"],"phonemes":["/ʃ/","/ɒ/","/p/"],"turkish":"dükkan","emoji":"🛒","level":2,"type":"CCVC"}'::jsonb, '{"/ʃ/","/ɒ/","/p/"}', '{"shop"}', 2, 178)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_chin_2_93', 'blending', 2, 'chin', 'çene', '{"word":"chin","letters":["ch","i","n"],"phonemes":["/tʃ/","/ɪ/","/n/"],"turkish":"çene","emoji":"🫦","level":2,"type":"CCVC"}'::jsonb, '{"/tʃ/","/ɪ/","/n/"}', '{"chin"}', 2, 179)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_chop_2_94', 'blending', 2, 'chop', 'doğramak', '{"word":"chop","letters":["ch","o","p"],"phonemes":["/tʃ/","/ɒ/","/p/"],"turkish":"doğramak","emoji":"🔪","level":2,"type":"CCVC"}'::jsonb, '{"/tʃ/","/ɒ/","/p/"}', '{"chop"}', 2, 180)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_thin_2_95', 'blending', 2, 'thin', 'ince', '{"word":"thin","letters":["th","i","n"],"phonemes":["/θ/","/ɪ/","/n/"],"turkish":"ince","emoji":"🦒","level":2,"type":"CCVC"}'::jsonb, '{"/θ/","/ɪ/","/n/"}', '{"thin"}', 2, 181)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_that_2_96', 'blending', 2, 'that', 'o (şu)', '{"word":"that","letters":["th","a","t"],"phonemes":["/ð/","/æ/","/t/"],"turkish":"o (şu)","emoji":"👉","level":2,"type":"CCVC"}'::jsonb, '{"/ð/","/æ/","/t/"}', '{"that"}', 2, 182)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_this_2_97', 'blending', 2, 'this', 'bu', '{"word":"this","letters":["th","i","s"],"phonemes":["/ð/","/ɪ/","/s/"],"turkish":"bu","emoji":"👈","level":2,"type":"CCVC"}'::jsonb, '{"/ð/","/ɪ/","/s/"}', '{"this"}', 2, 183)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_then_2_98', 'blending', 2, 'then', 'sonra / o zaman', '{"word":"then","letters":["th","e","n"],"phonemes":["/ð/","/ɛ/","/n/"],"turkish":"sonra / o zaman","emoji":"➡️","level":2,"type":"CCVC"}'::jsonb, '{"/ð/","/ɛ/","/n/"}', '{"then"}', 2, 184)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_clap_2_99', 'blending', 2, 'clap', 'alkışlamak', '{"word":"clap","letters":["cl","a","p"],"phonemes":["/k/","/l/","/æ/","/p/"],"turkish":"alkışlamak","emoji":"👏","level":2,"type":"CCVC"}'::jsonb, '{"/k/","/l/","/æ/","/p/"}', '{"clap"}', 2, 185)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_clip_2_100', 'blending', 2, 'clip', 'klip / kıskaç', '{"word":"clip","letters":["cl","i","p"],"phonemes":["/k/","/l/","/ɪ/","/p/"],"turkish":"klip / kıskaç","emoji":"📎","level":2,"type":"CCVC"}'::jsonb, '{"/k/","/l/","/ɪ/","/p/"}', '{"clip"}', 2, 186)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_flag_2_101', 'blending', 2, 'flag', 'bayrak', '{"word":"flag","letters":["fl","a","g"],"phonemes":["/f/","/l/","/æ/","/g/"],"turkish":"bayrak","emoji":"🚩","level":2,"type":"CCVC"}'::jsonb, '{"/f/","/l/","/æ/","/g/"}', '{"flag"}', 2, 187)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_flat_2_102', 'blending', 2, 'flat', 'düz / daire', '{"word":"flat","letters":["fl","a","t"],"phonemes":["/f/","/l/","/æ/","/t/"],"turkish":"düz / daire","emoji":"🏠","level":2,"type":"CCVC"}'::jsonb, '{"/f/","/l/","/æ/","/t/"}', '{"flat"}', 2, 188)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_frog_2_103', 'blending', 2, 'frog', 'kurbağa', '{"word":"frog","letters":["fr","o","g"],"phonemes":["/f/","/r/","/ɒ/","/g/"],"turkish":"kurbağa","emoji":"🐸","level":2,"type":"CCVC"}'::jsonb, '{"/f/","/r/","/ɒ/","/g/"}', '{"frog"}', 2, 189)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_from_2_104', 'blending', 2, 'from', '-den / -dan', '{"word":"from","letters":["fr","o","m"],"phonemes":["/f/","/r/","/ɒ/","/m/"],"turkish":"-den / -dan","emoji":"↩️","level":2,"type":"CCVC"}'::jsonb, '{"/f/","/r/","/ɒ/","/m/"}', '{"from"}', 2, 190)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_stop_2_105', 'blending', 2, 'stop', 'durmak', '{"word":"stop","letters":["st","o","p"],"phonemes":["/s/","/t/","/ɒ/","/p/"],"turkish":"durmak","emoji":"🛑","level":2,"type":"CCVC"}'::jsonb, '{"/s/","/t/","/ɒ/","/p/"}', '{"stop"}', 2, 191)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_step_2_106', 'blending', 2, 'step', 'adım', '{"word":"step","letters":["st","e","p"],"phonemes":["/s/","/t/","/ɛ/","/p/"],"turkish":"adım","emoji":"👟","level":2,"type":"CCVC"}'::jsonb, '{"/s/","/t/","/ɛ/","/p/"}', '{"step"}', 2, 192)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_snap_2_107', 'blending', 2, 'snap', 'çıtlatmak / snap', '{"word":"snap","letters":["sn","a","p"],"phonemes":["/s/","/n/","/æ/","/p/"],"turkish":"çıtlatmak / snap","emoji":"🫰","level":2,"type":"CCVC"}'::jsonb, '{"/s/","/n/","/æ/","/p/"}', '{"snap"}', 2, 193)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_spin_2_108', 'blending', 2, 'spin', 'dönmek', '{"word":"spin","letters":["sp","i","n"],"phonemes":["/s/","/p/","/ɪ/","/n/"],"turkish":"dönmek","emoji":"🌀","level":2,"type":"CCVC"}'::jsonb, '{"/s/","/p/","/ɪ/","/n/"}', '{"spin"}', 2, 194)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_drum_2_109', 'blending', 2, 'drum', 'davul', '{"word":"drum","letters":["dr","u","m"],"phonemes":["/d/","/r/","/ʌ/","/m/"],"turkish":"davul","emoji":"🥁","level":2,"type":"CCVC"}'::jsonb, '{"/d/","/r/","/ʌ/","/m/"}', '{"drum"}', 2, 195)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_drop_2_110', 'blending', 2, 'drop', 'düşürmek', '{"word":"drop","letters":["dr","o","p"],"phonemes":["/d/","/r/","/ɒ/","/p/"],"turkish":"düşürmek","emoji":"💧","level":2,"type":"CCVC"}'::jsonb, '{"/d/","/r/","/ɒ/","/p/"}', '{"drop"}', 2, 196)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_swim_2_111', 'blending', 2, 'swim', 'yüzmek', '{"word":"swim","letters":["sw","i","m"],"phonemes":["/s/","/w/","/ɪ/","/m/"],"turkish":"yüzmek","emoji":"🏊","level":2,"type":"CCVC"}'::jsonb, '{"/s/","/w/","/ɪ/","/m/"}', '{"swim"}', 2, 197)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_twin_2_112', 'blending', 2, 'twin', 'ikiz', '{"word":"twin","letters":["tw","i","n"],"phonemes":["/t/","/w/","/ɪ/","/n/"],"turkish":"ikiz","emoji":"👯","level":2,"type":"CCVC"}'::jsonb, '{"/t/","/w/","/ɪ/","/n/"}', '{"twin"}', 2, 198)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_milk_2_113', 'blending', 2, 'milk', 'süt', '{"word":"milk","letters":["m","i","lk"],"phonemes":["/m/","/ɪ/","/l/","/k/"],"turkish":"süt","emoji":"🥛","level":2,"type":"CVCC"}'::jsonb, '{"/m/","/ɪ/","/l/","/k/"}', '{"milk"}', 2, 199)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_hand_2_114', 'blending', 2, 'hand', 'el', '{"word":"hand","letters":["h","a","nd"],"phonemes":["/h/","/æ/","/n/","/d/"],"turkish":"el","emoji":"✋","level":2,"type":"CVCC"}'::jsonb, '{"/h/","/æ/","/n/","/d/"}', '{"hand"}', 2, 200)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_jump_2_115', 'blending', 2, 'jump', 'zıplamak', '{"word":"jump","letters":["j","u","mp"],"phonemes":["/dʒ/","/ʌ/","/m/","/p/"],"turkish":"zıplamak","emoji":"⬆️","level":2,"type":"CVCC"}'::jsonb, '{"/dʒ/","/ʌ/","/m/","/p/"}', '{"jump"}', 2, 201)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_lamp_2_116', 'blending', 2, 'lamp', 'lamba', '{"word":"lamp","letters":["l","a","mp"],"phonemes":["/l/","/æ/","/m/","/p/"],"turkish":"lamba","emoji":"💡","level":2,"type":"CVCC"}'::jsonb, '{"/l/","/æ/","/m/","/p/"}', '{"lamp"}', 2, 202)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_nest_2_117', 'blending', 2, 'nest', 'yuva / yuvası', '{"word":"nest","letters":["n","e","st"],"phonemes":["/n/","/ɛ/","/s/","/t/"],"turkish":"yuva / yuvası","emoji":"🪺","level":2,"type":"CVCC"}'::jsonb, '{"/n/","/ɛ/","/s/","/t/"}', '{"nest"}', 2, 203)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_pond_2_118', 'blending', 2, 'pond', 'gölet', '{"word":"pond","letters":["p","o","nd"],"phonemes":["/p/","/ɒ/","/n/","/d/"],"turkish":"gölet","emoji":"🫧","level":2,"type":"CVCC"}'::jsonb, '{"/p/","/ɒ/","/n/","/d/"}', '{"pond"}', 2, 204)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_ring_2_119', 'blending', 2, 'ring', 'yüzük / zil', '{"word":"ring","letters":["r","i","ng"],"phonemes":["/r/","/ɪ/","/ŋ/"],"turkish":"yüzük / zil","emoji":"💍","level":2,"type":"CVCC"}'::jsonb, '{"/r/","/ɪ/","/ŋ/"}', '{"ring"}', 2, 205)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_sing_2_120', 'blending', 2, 'sing', 'şarkı söylemek', '{"word":"sing","letters":["s","i","ng"],"phonemes":["/s/","/ɪ/","/ŋ/"],"turkish":"şarkı söylemek","emoji":"🎵","level":2,"type":"CVCC"}'::jsonb, '{"/s/","/ɪ/","/ŋ/"}', '{"sing"}', 2, 206)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cake_3_121', 'blending', 3, 'cake', 'kek', '{"word":"cake","letters":["c","a","k","e"],"phonemes":["/k/","/eɪ/","/k/"],"turkish":"kek","emoji":"🎂","level":3,"type":"CCVC"}'::jsonb, '{"/k/","/eɪ/","/k/"}', '{"cake"}', 3, 207)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_make_3_122', 'blending', 3, 'make', 'yapmak', '{"word":"make","letters":["m","a","k","e"],"phonemes":["/m/","/eɪ/","/k/"],"turkish":"yapmak","emoji":"🔨","level":3,"type":"CCVC"}'::jsonb, '{"/m/","/eɪ/","/k/"}', '{"make"}', 3, 208)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bike_3_123', 'blending', 3, 'bike', 'bisiklet', '{"word":"bike","letters":["b","i","k","e"],"phonemes":["/b/","/aɪ/","/k/"],"turkish":"bisiklet","emoji":"🚲","level":3,"type":"CCVC"}'::jsonb, '{"/b/","/aɪ/","/k/"}', '{"bike"}', 3, 209)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_like_3_124', 'blending', 3, 'like', 'sevmek', '{"word":"like","letters":["l","i","k","e"],"phonemes":["/l/","/aɪ/","/k/"],"turkish":"sevmek","emoji":"❤️","level":3,"type":"CCVC"}'::jsonb, '{"/l/","/aɪ/","/k/"}', '{"like"}', 3, 210)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_home_3_125', 'blending', 3, 'home', 'ev', '{"word":"home","letters":["h","o","m","e"],"phonemes":["/h/","/oʊ/","/m/"],"turkish":"ev","emoji":"🏠","level":3,"type":"CCVC"}'::jsonb, '{"/h/","/oʊ/","/m/"}', '{"home"}', 3, 211)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_bone_3_126', 'blending', 3, 'bone', 'kemik', '{"word":"bone","letters":["b","o","n","e"],"phonemes":["/b/","/oʊ/","/n/"],"turkish":"kemik","emoji":"🦴","level":3,"type":"CCVC"}'::jsonb, '{"/b/","/oʊ/","/n/"}', '{"bone"}', 3, 212)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cute_3_127', 'blending', 3, 'cute', 'sevimli / şirin', '{"word":"cute","letters":["c","u","t","e"],"phonemes":["/k/","/juː/","/t/"],"turkish":"sevimli / şirin","emoji":"🥰","level":3,"type":"CCVC"}'::jsonb, '{"/k/","/juː/","/t/"}', '{"cute"}', 3, 213)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_June_3_128', 'blending', 3, 'June', 'Haziran', '{"word":"June","letters":["J","u","n","e"],"phonemes":["/dʒ/","/uː/","/n/"],"turkish":"Haziran","emoji":"📅","level":3,"type":"CCVC"}'::jsonb, '{"/dʒ/","/uː/","/n/"}', '{"June"}', 3, 214)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_rain_3_129', 'blending', 3, 'rain', 'yağmur', '{"word":"rain","letters":["r","ai","n"],"phonemes":["/r/","/eɪ/","/n/"],"turkish":"yağmur","emoji":"🌧️","level":3,"type":"CCVC"}'::jsonb, '{"/r/","/eɪ/","/n/"}', '{"rain"}', 3, 215)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_train_3_130', 'blending', 3, 'train', 'tren', '{"word":"train","letters":["tr","ai","n"],"phonemes":["/t/","/r/","/eɪ/","/n/"],"turkish":"tren","emoji":"🚂","level":3,"type":"CCVCC"}'::jsonb, '{"/t/","/r/","/eɪ/","/n/"}', '{"train"}', 3, 216)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_boat_3_131', 'blending', 3, 'boat', 'tekne', '{"word":"boat","letters":["b","oa","t"],"phonemes":["/b/","/oʊ/","/t/"],"turkish":"tekne","emoji":"⛵","level":3,"type":"CVC"}'::jsonb, '{"/b/","/oʊ/","/t/"}', '{"boat"}', 3, 217)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_road_3_132', 'blending', 3, 'road', 'yol', '{"word":"road","letters":["r","oa","d"],"phonemes":["/r/","/oʊ/","/d/"],"turkish":"yol","emoji":"🛣️","level":3,"type":"CVC"}'::jsonb, '{"/r/","/oʊ/","/d/"}', '{"road"}', 3, 218)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_night_3_133', 'blending', 3, 'night', 'gece', '{"word":"night","letters":["n","igh","t"],"phonemes":["/n/","/aɪ/","/t/"],"turkish":"gece","emoji":"🌙","level":3,"type":"CVCC"}'::jsonb, '{"/n/","/aɪ/","/t/"}', '{"night"}', 3, 219)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_light_3_134', 'blending', 3, 'light', 'ışık', '{"word":"light","letters":["l","igh","t"],"phonemes":["/l/","/aɪ/","/t/"],"turkish":"ışık","emoji":"💡","level":3,"type":"CVCC"}'::jsonb, '{"/l/","/aɪ/","/t/"}', '{"light"}', 3, 220)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_cloud_3_135', 'blending', 3, 'cloud', 'bulut', '{"word":"cloud","letters":["cl","ou","d"],"phonemes":["/k/","/l/","/aʊ/","/d/"],"turkish":"bulut","emoji":"☁️","level":3,"type":"CCVC"}'::jsonb, '{"/k/","/l/","/aʊ/","/d/"}', '{"cloud"}', 3, 221)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_house_3_136', 'blending', 3, 'house', 'ev', '{"word":"house","letters":["h","ou","s","e"],"phonemes":["/h/","/aʊ/","/s/"],"turkish":"ev","emoji":"🏡","level":3,"type":"CVCC"}'::jsonb, '{"/h/","/aʊ/","/s/"}', '{"house"}', 3, 222)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_three_3_137', 'blending', 3, 'three', 'üç', '{"word":"three","letters":["thr","ee"],"phonemes":["/θ/","/r/","/iː/"],"turkish":"üç","emoji":"3️⃣","level":3,"type":"CCVC"}'::jsonb, '{"/θ/","/r/","/iː/"}', '{"three"}', 3, 223)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_green_3_138', 'blending', 3, 'green', 'yeşil', '{"word":"green","letters":["gr","ee","n"],"phonemes":["/g/","/r/","/iː/","/n/"],"turkish":"yeşil","emoji":"🟢","level":3,"type":"CCVC"}'::jsonb, '{"/g/","/r/","/iː/","/n/"}', '{"green"}', 3, 224)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_sleep_3_139', 'blending', 3, 'sleep', 'uyumak', '{"word":"sleep","letters":["sl","ee","p"],"phonemes":["/s/","/l/","/iː/","/p/"],"turkish":"uyumak","emoji":"😴","level":3,"type":"CCVC"}'::jsonb, '{"/s/","/l/","/iː/","/p/"}', '{"sleep"}', 3, 225)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('blending_teeth_3_140', 'blending', 3, 'teeth', 'dişler', '{"word":"teeth","letters":["t","ee","th"],"phonemes":["/t/","/iː/","/θ/"],"turkish":"dişler","emoji":"🦷","level":3,"type":"CVCC"}'::jsonb, '{"/t/","/iː/","/θ/"}', '{"teeth"}', 3, 226)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_the_0', 'blending', 1, 'the', '-', '{"word":"the","turkish":"-","level":1,"isSightWord":true}'::jsonb, '{}', '{"the"}', NULL, 227)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_is_1', 'blending', 1, 'is', '-dir', '{"word":"is","turkish":"-dir","level":1,"isSightWord":true}'::jsonb, '{}', '{"is"}', NULL, 228)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_a_2', 'blending', 1, 'a', 'bir', '{"word":"a","turkish":"bir","level":1,"isSightWord":true}'::jsonb, '{}', '{"a"}', NULL, 229)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_I_3', 'blending', 1, 'I', 'ben', '{"word":"I","turkish":"ben","level":1,"isSightWord":true}'::jsonb, '{}', '{"I"}', NULL, 230)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_to_4', 'blending', 1, 'to', '-e / -a', '{"word":"to","turkish":"-e / -a","level":1,"isSightWord":true}'::jsonb, '{}', '{"to"}', NULL, 231)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_and_5', 'blending', 1, 'and', 've', '{"word":"and","turkish":"ve","level":1,"isSightWord":true}'::jsonb, '{}', '{"and"}', NULL, 232)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_you_6', 'blending', 1, 'you', 'sen', '{"word":"you","turkish":"sen","level":1,"isSightWord":true}'::jsonb, '{}', '{"you"}', NULL, 233)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_it_7', 'blending', 1, 'it', 'o', '{"word":"it","turkish":"o","level":1,"isSightWord":true}'::jsonb, '{}', '{"it"}', NULL, 234)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_in_8', 'blending', 1, 'in', 'içinde', '{"word":"in","turkish":"içinde","level":1,"isSightWord":true}'::jsonb, '{}', '{"in"}', NULL, 235)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_my_9', 'blending', 1, 'my', 'benim', '{"word":"my","turkish":"benim","level":1,"isSightWord":true}'::jsonb, '{}', '{"my"}', NULL, 236)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_he_10', 'blending', 2, 'he', 'o (erkek)', '{"word":"he","turkish":"o (erkek)","level":2,"isSightWord":true}'::jsonb, '{}', '{"he"}', NULL, 237)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_she_11', 'blending', 2, 'she', 'o (kız)', '{"word":"she","turkish":"o (kız)","level":2,"isSightWord":true}'::jsonb, '{}', '{"she"}', NULL, 238)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_we_12', 'blending', 2, 'we', 'biz', '{"word":"we","turkish":"biz","level":2,"isSightWord":true}'::jsonb, '{}', '{"we"}', NULL, 239)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_they_13', 'blending', 2, 'they', 'onlar', '{"word":"they","turkish":"onlar","level":2,"isSightWord":true}'::jsonb, '{}', '{"they"}', NULL, 240)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_was_14', 'blending', 2, 'was', 'idi', '{"word":"was","turkish":"idi","level":2,"isSightWord":true}'::jsonb, '{}', '{"was"}', NULL, 241)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_are_15', 'blending', 2, 'are', '-dir (çoğul)', '{"word":"are","turkish":"-dir (çoğul)","level":2,"isSightWord":true}'::jsonb, '{}', '{"are"}', NULL, 242)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_for_16', 'blending', 2, 'for', 'için', '{"word":"for","turkish":"için","level":2,"isSightWord":true}'::jsonb, '{}', '{"for"}', NULL, 243)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_have_17', 'blending', 2, 'have', 'sahip olmak', '{"word":"have","turkish":"sahip olmak","level":2,"isSightWord":true}'::jsonb, '{}', '{"have"}', NULL, 244)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_his_18', 'blending', 2, 'his', 'onun', '{"word":"his","turkish":"onun","level":2,"isSightWord":true}'::jsonb, '{}', '{"his"}', NULL, 245)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_her_19', 'blending', 2, 'her', 'onun (kız)', '{"word":"her","turkish":"onun (kız)","level":2,"isSightWord":true}'::jsonb, '{}', '{"her"}', NULL, 246)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_said_20', 'blending', 3, 'said', 'dedi', '{"word":"said","turkish":"dedi","level":3,"isSightWord":true}'::jsonb, '{}', '{"said"}', NULL, 247)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_here_21', 'blending', 3, 'here', 'burada', '{"word":"here","turkish":"burada","level":3,"isSightWord":true}'::jsonb, '{}', '{"here"}', NULL, 248)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_there_22', 'blending', 3, 'there', 'orada', '{"word":"there","turkish":"orada","level":3,"isSightWord":true}'::jsonb, '{}', '{"there"}', NULL, 249)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_where_23', 'blending', 3, 'where', 'nerede', '{"word":"where","turkish":"nerede","level":3,"isSightWord":true}'::jsonb, '{}', '{"where"}', NULL, 250)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_come_24', 'blending', 3, 'come', 'gelmek', '{"word":"come","turkish":"gelmek","level":3,"isSightWord":true}'::jsonb, '{}', '{"come"}', NULL, 251)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_some_25', 'blending', 3, 'some', 'biraz', '{"word":"some","turkish":"biraz","level":3,"isSightWord":true}'::jsonb, '{}', '{"some"}', NULL, 252)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_one_26', 'blending', 3, 'one', 'bir', '{"word":"one","turkish":"bir","level":3,"isSightWord":true}'::jsonb, '{}', '{"one"}', NULL, 253)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_two_27', 'blending', 3, 'two', 'iki', '{"word":"two","turkish":"iki","level":3,"isSightWord":true}'::jsonb, '{}', '{"two"}', NULL, 254)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_of_28', 'blending', 3, 'of', '-in / -nın', '{"word":"of","turkish":"-in / -nın","level":3,"isSightWord":true}'::jsonb, '{}', '{"of"}', NULL, 255)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_do_29', 'blending', 3, 'do', 'yapmak', '{"word":"do","turkish":"yapmak","level":3,"isSightWord":true}'::jsonb, '{}', '{"do"}', NULL, 256)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_what_30', 'blending', 4, 'what', 'ne', '{"word":"what","turkish":"ne","level":4,"isSightWord":true}'::jsonb, '{}', '{"what"}', NULL, 257)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_when_31', 'blending', 4, 'when', 'ne zaman', '{"word":"when","turkish":"ne zaman","level":4,"isSightWord":true}'::jsonb, '{}', '{"when"}', NULL, 258)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_who_32', 'blending', 4, 'who', 'kim', '{"word":"who","turkish":"kim","level":4,"isSightWord":true}'::jsonb, '{}', '{"who"}', NULL, 259)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_which_33', 'blending', 4, 'which', 'hangi', '{"word":"which","turkish":"hangi","level":4,"isSightWord":true}'::jsonb, '{}', '{"which"}', NULL, 260)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_would_34', 'blending', 4, 'would', '-rdı / ister', '{"word":"would","turkish":"-rdı / ister","level":4,"isSightWord":true}'::jsonb, '{}', '{"would"}', NULL, 261)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_could_35', 'blending', 4, 'could', '-bilirdi', '{"word":"could","turkish":"-bilirdi","level":4,"isSightWord":true}'::jsonb, '{}', '{"could"}', NULL, 262)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_should_36', 'blending', 4, 'should', '-malı', '{"word":"should","turkish":"-malı","level":4,"isSightWord":true}'::jsonb, '{}', '{"should"}', NULL, 263)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_their_37', 'blending', 4, 'their', 'onların', '{"word":"their","turkish":"onların","level":4,"isSightWord":true}'::jsonb, '{}', '{"their"}', NULL, 264)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_your_38', 'blending', 4, 'your', 'senin', '{"word":"your","turkish":"senin","level":4,"isSightWord":true}'::jsonb, '{}', '{"your"}', NULL, 265)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_our_39', 'blending', 4, 'our', 'bizim', '{"word":"our","turkish":"bizim","level":4,"isSightWord":true}'::jsonb, '{}', '{"our"}', NULL, 266)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_because_40', 'blending', 5, 'because', 'çünkü', '{"word":"because","turkish":"çünkü","level":5,"isSightWord":true}'::jsonb, '{}', '{"because"}', NULL, 267)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_through_41', 'blending', 5, 'through', 'boyunca', '{"word":"through","turkish":"boyunca","level":5,"isSightWord":true}'::jsonb, '{}', '{"through"}', NULL, 268)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_enough_42', 'blending', 5, 'enough', 'yeterli', '{"word":"enough","turkish":"yeterli","level":5,"isSightWord":true}'::jsonb, '{}', '{"enough"}', NULL, 269)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_thought_43', 'blending', 5, 'thought', 'düşündü', '{"word":"thought","turkish":"düşündü","level":5,"isSightWord":true}'::jsonb, '{}', '{"thought"}', NULL, 270)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_though_44', 'blending', 5, 'though', 'olsa da', '{"word":"though","turkish":"olsa da","level":5,"isSightWord":true}'::jsonb, '{}', '{"though"}', NULL, 271)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_bought_45', 'blending', 5, 'bought', 'satın aldı', '{"word":"bought","turkish":"satın aldı","level":5,"isSightWord":true}'::jsonb, '{}', '{"bought"}', NULL, 272)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_brought_46', 'blending', 5, 'brought', 'getirdi', '{"word":"brought","turkish":"getirdi","level":5,"isSightWord":true}'::jsonb, '{}', '{"brought"}', NULL, 273)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_friend_47', 'blending', 5, 'friend', 'arkadaş', '{"word":"friend","turkish":"arkadaş","level":5,"isSightWord":true}'::jsonb, '{}', '{"friend"}', NULL, 274)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_people_48', 'blending', 5, 'people', 'insanlar', '{"word":"people","turkish":"insanlar","level":5,"isSightWord":true}'::jsonb, '{}', '{"people"}', NULL, 275)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('sight_word_again_49', 'blending', 5, 'again', 'yeniden', '{"word":"again","turkish":"yeniden","level":5,"isSightWord":true}'::jsonb, '{}', '{"again"}', NULL, 276)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_greetings-1', 'dialogue', 1, 'Say Hello!', 'Merhaba De!', '{"id":"greetings-1","title":"Say Hello!","titleTr":"Merhaba De!","topic":"greetings","lines":[{"speaker":"mimi","text":"Hello! How are you?","textTr":"Merhaba! Nasılsın?"},{"speaker":"child","text":"","options":[{"id":"a","text":"I am fine, thank you!","textTr":"İyiyim, teşekkürler!","correct":true,"feedback":"Perfect!"},{"id":"b","text":"I am happy!","textTr":"Mutluyum!","correct":false},{"id":"c","text":"Good morning!","textTr":"Günaydın!","correct":false}]},{"speaker":"mimi","text":"Great! What is your name?","textTr":"Harika! Adın ne?"},{"speaker":"child","text":"","options":[{"id":"d","text":"My name is Alex.","textTr":"Benim adım Alex.","correct":true,"feedback":"Nice to meet you!"},{"id":"e","text":"I am five years old.","textTr":"Ben beş yaşındayım.","correct":false},{"id":"f","text":"I live in the city.","textTr":"Şehirde yaşıyorum.","correct":false}]},{"speaker":"mimi","text":"Nice to meet you, Alex! See you later!","textTr":"Tanıştığıma memnun oldum, Alex! Görüşürüz!"},{"speaker":"child","text":"","options":[{"id":"g","text":"Bye bye! See you!","textTr":"Hoşça kal! Görüşürüz!","correct":true,"feedback":"Great job!"},{"id":"h","text":"Hello! Nice to meet you!","textTr":"Merhaba! Tanıştığıma memnun oldum!","correct":false},{"id":"i","text":"Good morning, Mimi!","textTr":"Günaydın, Mimi!","correct":false}]},{"speaker":"mimi","text":"Bye! You did amazing!","textTr":"Hoşça kal! Harika yaptın!"}]}'::jsonb, '{}', '{}', NULL, 277)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_colors-1', 'dialogue', 1, 'Let''s Talk Colors!', 'Renkleri Konuşalım!', '{"id":"colors-1","title":"Let''s Talk Colors!","titleTr":"Renkleri Konuşalım!","topic":"colors","lines":[{"speaker":"mimi","text":"Hi! I love colors! What color is the sun?","textTr":"Merhaba! Renkleri çok seviyorum! Güneş ne renk?"},{"speaker":"child","text":"","options":[{"id":"a","text":"The sun is yellow!","textTr":"Güneş sarı!","correct":true,"feedback":"Yes! Yellow sun!"},{"id":"b","text":"The sun is green!","textTr":"Güneş yeşil!","correct":false},{"id":"c","text":"The sun is purple!","textTr":"Güneş mor!","correct":false}]},{"speaker":"mimi","text":"That''s right! And what color is the sky?","textTr":"Doğru! Peki gökyüzü ne renk?"},{"speaker":"child","text":"","options":[{"id":"d","text":"The sky is blue!","textTr":"Gökyüzü mavi!","correct":true,"feedback":"Brilliant!"},{"id":"e","text":"The sky is orange!","textTr":"Gökyüzü turuncu!","correct":false},{"id":"f","text":"The sky is pink!","textTr":"Gökyüzü pembe!","correct":false}]},{"speaker":"mimi","text":"Wonderful! What is your favorite color?","textTr":"Harika! En sevdiğin renk hangisi?"},{"speaker":"child","text":"","options":[{"id":"g","text":"My favorite color is red!","textTr":"En sevdiğim renk kırmızı!","correct":true,"feedback":"Red is so cool!"},{"id":"h","text":"My favorite color is yellow!","textTr":"En sevdiğim renk sarı!","correct":false},{"id":"i","text":"My favorite color is blue!","textTr":"En sevdiğim renk mavi!","correct":false}]},{"speaker":"mimi","text":"Red is awesome! You know so many colors!","textTr":"Kırmızı harika! Çok fazla renk biliyorsun!"}]}'::jsonb, '{}', '{}', NULL, 278)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_animals-1', 'dialogue', 1, 'Animal Talk!', 'Hayvanlar Konuşuyor!', '{"id":"animals-1","title":"Animal Talk!","titleTr":"Hayvanlar Konuşuyor!","topic":"animals","lines":[{"speaker":"mimi","text":"I love animals! Do you have a pet?","textTr":"Hayvanları çok seviyorum! Evcil hayvanın var mı?"},{"speaker":"child","text":"","options":[{"id":"a","text":"Yes! I have a dog!","textTr":"Evet! Bir köpeğim var!","correct":true,"feedback":"Dogs are so fun!"},{"id":"b","text":"No, I do not have a pet.","textTr":"Hayır, evcil hayvanım yok.","correct":false},{"id":"c","text":"Yes! I have a cat!","textTr":"Evet! Bir kedim var!","correct":false}]},{"speaker":"mimi","text":"Awesome! What does a dog say?","textTr":"Harika! Köpek ne der?"},{"speaker":"child","text":"","options":[{"id":"d","text":"A dog says \"Woof woof!\"","textTr":"Köpek \"Hav hav!\" der!","correct":true,"feedback":"Woof woof! Correct!"},{"id":"e","text":"A dog says \"Moo!\"","textTr":"Köpek \"Möö!\" der.","correct":false},{"id":"f","text":"A dog says \"Tweet!\"","textTr":"Köpek \"Cik cik!\" der.","correct":false}]},{"speaker":"mimi","text":"Woof woof! Correct! What animal has a long neck?","textTr":"Hav hav! Doğru! Hangi hayvanın uzun boynu var?"},{"speaker":"child","text":"","options":[{"id":"g","text":"A giraffe has a long neck!","textTr":"Zürafa uzun boyunlu!","correct":true,"feedback":"So tall and beautiful!"},{"id":"h","text":"An elephant has a long neck!","textTr":"Filin uzun boynu var!","correct":false},{"id":"i","text":"A rabbit has a long neck!","textTr":"Tavşanın uzun boynu var!","correct":false}]},{"speaker":"mimi","text":"A giraffe! So tall! You are great at animals!","textTr":"Zürafa! Çok uzun! Hayvanlarda gerçekten iyisin!"}]}'::jsonb, '{}', '{}', NULL, 279)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_food-1', 'dialogue', 1, 'What Do You Eat?', 'Ne Yiyorsun?', '{"id":"food-1","title":"What Do You Eat?","titleTr":"Ne Yiyorsun?","topic":"food","lines":[{"speaker":"mimi","text":"I am hungry! What do you like to eat?","textTr":"Açım! Ne yemeyi seversin?"},{"speaker":"child","text":"","options":[{"id":"a","text":"I like pizza and apples!","textTr":"Pizza ve elma severim!","correct":true,"feedback":"Yummy choices!"},{"id":"b","text":"I like bananas and milk!","textTr":"Muz ve süt severim!","correct":false},{"id":"c","text":"I like bread and cheese!","textTr":"Ekmek ve peynir severim!","correct":false}]},{"speaker":"mimi","text":"Great! Do you like bananas?","textTr":"Harika! Muz sever misin?"},{"speaker":"child","text":"","options":[{"id":"d","text":"Yes, I love bananas!","textTr":"Evet, muzları çok severim!","correct":true,"feedback":"Bananas give you energy!"},{"id":"e","text":"No, I prefer apples.","textTr":"Hayır, elmayı tercih ederim.","correct":false},{"id":"f","text":"I do not like fruit.","textTr":"Meyve sevmem.","correct":false}]},{"speaker":"mimi","text":"What do you drink in the morning?","textTr":"Sabahları ne içersin?"},{"speaker":"child","text":"","options":[{"id":"g","text":"I drink milk in the morning!","textTr":"Sabahları süt içerim!","correct":true,"feedback":"Milk makes you strong!"},{"id":"h","text":"I drink orange juice.","textTr":"Portakal suyu içerim.","correct":false},{"id":"i","text":"I drink water only.","textTr":"Sadece su içerim.","correct":false}]},{"speaker":"mimi","text":"Milk is perfect! You eat so healthy!","textTr":"Süt mükemmel! Çok sağlıklı besleniyorsun!"}]}'::jsonb, '{}', '{}', NULL, 280)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_family-1', 'dialogue', 1, 'My Family!', 'Ailem!', '{"id":"family-1","title":"My Family!","titleTr":"Ailem!","topic":"family","lines":[{"speaker":"mimi","text":"Tell me about your family! Do you have a brother or sister?","textTr":"Ailenden bahset! Kardeşin var mı?"},{"speaker":"child","text":"","options":[{"id":"a","text":"I have a little sister!","textTr":"Küçük bir kız kardeşim var!","correct":true,"feedback":"How sweet!"},{"id":"b","text":"I have a big brother!","textTr":"Büyük bir erkek kardeşim var!","correct":false},{"id":"c","text":"I do not have a brother or sister.","textTr":"Erkek ya da kız kardeşim yok.","correct":false}]},{"speaker":"mimi","text":"Sweet! What does your mom do?","textTr":"Sevimli! Annen ne yapıyor?"},{"speaker":"child","text":"","options":[{"id":"d","text":"My mom cooks delicious food!","textTr":"Annem nefis yemekler pişiriyor!","correct":true,"feedback":"She sounds amazing!"},{"id":"e","text":"My mom reads books all day!","textTr":"Annem bütün gün kitap okuyor!","correct":false},{"id":"f","text":"My mom works in an office.","textTr":"Annem bir ofiste çalışıyor.","correct":false}]},{"speaker":"mimi","text":"What do you do with your dad?","textTr":"Babanla ne yaparsın?"},{"speaker":"child","text":"","options":[{"id":"g","text":"I play football with my dad!","textTr":"Babamla futbol oynarım!","correct":true,"feedback":"That is so fun!"},{"id":"h","text":"I watch TV with my dad.","textTr":"Babamla televizyon izlerim.","correct":false},{"id":"i","text":"I read books with my dad.","textTr":"Babamla kitap okurum.","correct":false}]},{"speaker":"mimi","text":"You have a wonderful family!","textTr":"Harika bir ailen var!"}]}'::jsonb, '{}', '{}', NULL, 281)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_school-1', 'dialogue', 1, 'At School!', 'Okulda!', '{"id":"school-1","title":"At School!","titleTr":"Okulda!","topic":"school","lines":[{"speaker":"mimi","text":"Good morning! Are you ready for school?","textTr":"Günaydın! Okula hazır mısın?"},{"speaker":"child","text":"","options":[{"id":"a","text":"Yes! I have my bag and book!","textTr":"Evet! Çantam ve kitabım hazır!","correct":true,"feedback":"Great student!"},{"id":"b","text":"Yes! My pencil and eraser are ready!","textTr":"Evet! Kalemim ve silgim hazır!","correct":false},{"id":"c","text":"Not yet, I am still eating!","textTr":"Henüz değil, hâlâ yiyorum!","correct":false}]},{"speaker":"mimi","text":"What is your favorite subject?","textTr":"En sevdiğin ders hangisi?"},{"speaker":"child","text":"","options":[{"id":"d","text":"I love art and English!","textTr":"Resim ve İngilizceyi seviyorum!","correct":true,"feedback":"Excellent choices!"},{"id":"e","text":"I love maths and science!","textTr":"Matematik ve fen bilgisini seviyorum!","correct":false},{"id":"f","text":"I love music class!","textTr":"Müzik dersini seviyorum!","correct":false}]},{"speaker":"mimi","text":"Who is your best friend at school?","textTr":"Okulda en iyi arkadaşın kim?"},{"speaker":"child","text":"","options":[{"id":"g","text":"My best friend is Sam!","textTr":"En iyi arkadaşım Sam!","correct":true,"feedback":"Sam is lucky to have you!"},{"id":"h","text":"My best friend is Lily!","textTr":"En iyi arkadaşım Lily!","correct":false},{"id":"i","text":"I play with everyone!","textTr":"Herkesle oynarım!","correct":false}]},{"speaker":"mimi","text":"You are a great student! Keep learning!","textTr":"Harika bir öğrencisin! Öğrenmeye devam et!"}]}'::jsonb, '{}', '{}', NULL, 282)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_body-1', 'dialogue', 1, 'My Body!', 'Vücudum!', '{"id":"body-1","title":"My Body!","titleTr":"Vücudum!","topic":"body","lines":[{"speaker":"mimi","text":"Let''s learn body parts! Touch your head!","textTr":"Vücut bölümlerini öğrenelim! Başına dokun!"},{"speaker":"child","text":"","options":[{"id":"a","text":"I am touching my head!","textTr":"Başıma dokunuyorum!","correct":true,"feedback":"Good! Head!"},{"id":"b","text":"I am touching my nose!","textTr":"Burnuma dokunuyorum!","correct":false},{"id":"c","text":"I am clapping my hands!","textTr":"El çırpıyorum!","correct":false}]},{"speaker":"mimi","text":"Great! How many eyes do you have?","textTr":"Harika! Kaç gözün var?"},{"speaker":"child","text":"","options":[{"id":"d","text":"I have two eyes!","textTr":"İki gözüm var!","correct":true,"feedback":"Two beautiful eyes!"},{"id":"e","text":"I have one eye.","textTr":"Bir gözüm var.","correct":false},{"id":"f","text":"I have four eyes.","textTr":"Dört gözüm var.","correct":false}]},{"speaker":"mimi","text":"Now wiggle your fingers!","textTr":"Şimdi parmaklarını oynat!"},{"speaker":"child","text":"","options":[{"id":"g","text":"I am wiggling my fingers!","textTr":"Parmaklarımı oynatıyorum!","correct":true,"feedback":"Amazing! Ten fingers!"},{"id":"h","text":"I am stomping my feet!","textTr":"Ayaklarımı yere vuruyorum!","correct":false},{"id":"i","text":"I am blinking my eyes!","textTr":"Gözlerimi kırpıştırıyorum!","correct":false}]},{"speaker":"mimi","text":"You know your body so well! Wonderful!","textTr":"Vücudunu çok iyi biliyorsun! Harika!"}]}'::jsonb, '{}', '{}', NULL, 283)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('dialogue_weather-1', 'dialogue', 1, 'What''s the Weather?', 'Hava Nasıl?', '{"id":"weather-1","title":"What''s the Weather?","titleTr":"Hava Nasıl?","topic":"weather","lines":[{"speaker":"mimi","text":"Look outside! What is the weather like today?","textTr":"Dışarıya bak! Bugün hava nasıl?"},{"speaker":"child","text":"","options":[{"id":"a","text":"It is sunny today!","textTr":"Bugün güneşli!","correct":true,"feedback":"Lovely sunny day!"},{"id":"b","text":"It is rainy today!","textTr":"Bugün yağmurlu!","correct":false},{"id":"c","text":"It is cloudy today!","textTr":"Bugün bulutlu!","correct":false}]},{"speaker":"mimi","text":"Nice! What do you wear when it rains?","textTr":"Güzel! Yağmur yağdığında ne giyersin?"},{"speaker":"child","text":"","options":[{"id":"d","text":"I wear a raincoat and boots!","textTr":"Yağmurluk ve çizme giyerim!","correct":true,"feedback":"Smart choice!"},{"id":"e","text":"I wear a hat and sunglasses!","textTr":"Şapka ve güneş gözlüğü giyerim!","correct":false},{"id":"f","text":"I wear my pyjamas!","textTr":"Pijamamı giyerim!","correct":false}]},{"speaker":"mimi","text":"Do you like snow?","textTr":"Kar yağmasını sever misin?"},{"speaker":"child","text":"","options":[{"id":"g","text":"Yes! I love playing in the snow!","textTr":"Evet! Karda oynamayı çok seviyorum!","correct":true,"feedback":"Snow is so magical!"},{"id":"h","text":"No, snow is too cold for me!","textTr":"Hayır, kar benim için çok soğuk!","correct":false},{"id":"i","text":"I have never seen snow!","textTr":"Hiç kar görmedim!","correct":false}]},{"speaker":"mimi","text":"You know all about the weather! Amazing!","textTr":"Hava durumu hakkında her şeyi biliyorsun! İnanılmaz!"}]}'::jsonb, '{}', '{}', NULL, 284)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-001', 'listening', 1, 'The cat is black.', 'Kedi siyah.', '{"id":"l1-001","level":1,"theme":"Colors","sentence":"The cat is black.","sentenceTr":"Kedi siyah.","question":"What color is the cat?","questionTr":"Kedi ne renk?","choices":["red","black","white"],"correctIndex":1,"imageHint":"🐱"}'::jsonb, '{}', '{}', NULL, 285)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-002', 'listening', 1, 'I have two dogs.', 'İki köpeğim var.', '{"id":"l1-002","level":1,"theme":"Animals","sentence":"I have two dogs.","sentenceTr":"İki köpeğim var.","question":"How many dogs?","questionTr":"Kaç tane köpek var?","choices":["one","two","three"],"correctIndex":1,"imageHint":"🐶"}'::jsonb, '{}', '{}', NULL, 286)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-003', 'listening', 1, 'Mom is in the kitchen.', 'Anne mutfakta.', '{"id":"l1-003","level":1,"theme":"Family","sentence":"Mom is in the kitchen.","sentenceTr":"Anne mutfakta.","question":"Where is mom?","questionTr":"Anne nerede?","choices":["garden","kitchen","school"],"correctIndex":1,"imageHint":"👩"}'::jsonb, '{}', '{}', NULL, 287)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-004', 'listening', 1, 'I like apples.', 'Elmaları severim.', '{"id":"l1-004","level":1,"theme":"Food","sentence":"I like apples.","sentenceTr":"Elmaları severim.","question":"What do I like?","questionTr":"Ne seviyorum?","choices":["bananas","apples","oranges"],"correctIndex":1,"imageHint":"🍎"}'::jsonb, '{}', '{}', NULL, 288)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-005', 'listening', 1, 'The sky is blue.', 'Gökyüzü mavi.', '{"id":"l1-005","level":1,"theme":"Colors","sentence":"The sky is blue.","sentenceTr":"Gökyüzü mavi.","question":"What color is the sky?","questionTr":"Gökyüzü ne renk?","choices":["green","yellow","blue"],"correctIndex":2,"imageHint":"☁️"}'::jsonb, '{}', '{}', NULL, 289)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-006', 'listening', 1, 'The dog runs fast.', 'Köpek hızlı koşuyor.', '{"id":"l1-006","level":1,"theme":"Animals","sentence":"The dog runs fast.","sentenceTr":"Köpek hızlı koşuyor.","question":"What does the dog do?","questionTr":"Köpek ne yapıyor?","choices":["sleeps","runs","swims"],"correctIndex":1,"imageHint":"🐶"}'::jsonb, '{}', '{}', NULL, 290)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-007', 'listening', 1, 'My dad is tall.', 'Babam uzun boylu.', '{"id":"l1-007","level":1,"theme":"Family","sentence":"My dad is tall.","sentenceTr":"Babam uzun boylu.","question":"How is dad?","questionTr":"Baba nasıl?","choices":["short","tall","small"],"correctIndex":1,"imageHint":"👨"}'::jsonb, '{}', '{}', NULL, 291)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-008', 'listening', 1, 'The cake is sweet.', 'Pasta tatlı.', '{"id":"l1-008","level":1,"theme":"Food","sentence":"The cake is sweet.","sentenceTr":"Pasta tatlı.","question":"How does the cake taste?","questionTr":"Pastanın tadı nasıl?","choices":["sour","spicy","sweet"],"correctIndex":2,"imageHint":"🎂"}'::jsonb, '{}', '{}', NULL, 292)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-009', 'listening', 1, 'A bird sings in the tree.', 'Ağaçta bir kuş şarkı söylüyor.', '{"id":"l1-009","level":1,"theme":"Animals","sentence":"A bird sings in the tree.","sentenceTr":"Ağaçta bir kuş şarkı söylüyor.","question":"Where is the bird?","questionTr":"Kuş nerede?","choices":["in the water","in the tree","in the sky"],"correctIndex":1,"imageHint":"🐦"}'::jsonb, '{}', '{}', NULL, 293)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-010', 'listening', 1, 'The sun is yellow.', 'Güneş sarı.', '{"id":"l1-010","level":1,"theme":"Colors","sentence":"The sun is yellow.","sentenceTr":"Güneş sarı.","question":"What color is the sun?","questionTr":"Güneş ne renk?","choices":["orange","yellow","white"],"correctIndex":1,"imageHint":"☀️"}'::jsonb, '{}', '{}', NULL, 294)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-011', 'listening', 1, 'My sister is happy.', 'Kız kardeşim mutlu.', '{"id":"l1-011","level":1,"theme":"Family","sentence":"My sister is happy.","sentenceTr":"Kız kardeşim mutlu.","question":"How is the sister?","questionTr":"Kız kardeş nasıl?","choices":["sad","angry","happy"],"correctIndex":2,"imageHint":"👧"}'::jsonb, '{}', '{}', NULL, 295)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-012', 'listening', 1, 'The fish swims in water.', 'Balık suda yüzüyor.', '{"id":"l1-012","level":1,"theme":"Animals","sentence":"The fish swims in water.","sentenceTr":"Balık suda yüzüyor.","question":"Where does the fish swim?","questionTr":"Balık nerede yüzüyor?","choices":["in the sky","on the land","in water"],"correctIndex":2,"imageHint":"🐟"}'::jsonb, '{}', '{}', NULL, 296)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-013', 'listening', 1, 'Milk is white.', 'Süt beyaz.', '{"id":"l1-013","level":1,"theme":"Food","sentence":"Milk is white.","sentenceTr":"Süt beyaz.","question":"What color is milk?","questionTr":"Süt ne renk?","choices":["yellow","white","blue"],"correctIndex":1,"imageHint":"🥛"}'::jsonb, '{}', '{}', NULL, 297)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-014', 'listening', 1, 'A frog jumps high.', 'Bir kurbağa yüksek zıplıyor.', '{"id":"l1-014","level":1,"theme":"Animals","sentence":"A frog jumps high.","sentenceTr":"Bir kurbağa yüksek zıplıyor.","question":"What does the frog do?","questionTr":"Kurbağa ne yapıyor?","choices":["swims","flies","jumps"],"correctIndex":2,"imageHint":"🐸"}'::jsonb, '{}', '{}', NULL, 298)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-015', 'listening', 1, 'The flower is pink.', 'Çiçek pembe.', '{"id":"l1-015","level":1,"theme":"Colors","sentence":"The flower is pink.","sentenceTr":"Çiçek pembe.","question":"What color is the flower?","questionTr":"Çiçek ne renk?","choices":["red","purple","pink"],"correctIndex":2,"imageHint":"🌸"}'::jsonb, '{}', '{}', NULL, 299)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-016', 'listening', 1, 'I drink water.', 'Ben su içerim.', '{"id":"l1-016","level":1,"theme":"Food","sentence":"I drink water.","sentenceTr":"Ben su içerim.","question":"What do I drink?","questionTr":"Ne içiyorum?","choices":["juice","milk","water"],"correctIndex":2,"imageHint":"💧"}'::jsonb, '{}', '{}', NULL, 300)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-017', 'listening', 1, 'Grandma bakes bread.', 'Büyükannem ekmek pişirir.', '{"id":"l1-017","level":1,"theme":"Family","sentence":"Grandma bakes bread.","sentenceTr":"Büyükannem ekmek pişirir.","question":"What does grandma bake?","questionTr":"Büyükannem ne pişiriyor?","choices":["cake","bread","soup"],"correctIndex":1,"imageHint":"👵"}'::jsonb, '{}', '{}', NULL, 301)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-018', 'listening', 1, 'The hen lays an egg.', 'Tavuk yumurta yumurtluyor.', '{"id":"l1-018","level":1,"theme":"Animals","sentence":"The hen lays an egg.","sentenceTr":"Tavuk yumurta yumurtluyor.","question":"What does the hen lay?","questionTr":"Tavuk ne bırakıyor?","choices":["a chick","an egg","a seed"],"correctIndex":1,"imageHint":"🐔"}'::jsonb, '{}', '{}', NULL, 302)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-019', 'listening', 1, 'I see with my eyes.', 'Gözlerimle görürüm.', '{"id":"l1-019","level":1,"theme":"Body","sentence":"I see with my eyes.","sentenceTr":"Gözlerimle görürüm.","question":"What do I use to see?","questionTr":"Görmek için ne kullanırım?","choices":["hands","ears","eyes"],"correctIndex":2,"imageHint":"👁️"}'::jsonb, '{}', '{}', NULL, 303)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l1-020', 'listening', 1, 'The duck swims on the lake.', 'Ördek gölde yüzüyor.', '{"id":"l1-020","level":1,"theme":"Animals","sentence":"The duck swims on the lake.","sentenceTr":"Ördek gölde yüzüyor.","question":"Where does the duck swim?","questionTr":"Ördek nerede yüzüyor?","choices":["in the river","on the lake","in the pool"],"correctIndex":1,"imageHint":"🦆"}'::jsonb, '{}', '{}', NULL, 304)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-001', 'listening', 2, 'It is morning. I eat breakfast.', 'Sabah. Ben kahvaltı yiyorum.', '{"id":"l2-001","level":2,"theme":"General","sentence":"It is morning. I eat breakfast.","sentenceTr":"Sabah. Ben kahvaltı yiyorum.","question":"What time of day is it?","questionTr":"Günün hangi vakti?","choices":["morning","evening","night"],"correctIndex":0,"imageHint":"🌅"}'::jsonb, '{}', '{}', NULL, 305)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-002', 'listening', 2, 'The dog is big. The cat is small.', 'Köpek büyük. Kedi küçük.', '{"id":"l2-002","level":2,"theme":"Animals","sentence":"The dog is big. The cat is small.","sentenceTr":"Köpek büyük. Kedi küçük.","question":"Which animal is big?","questionTr":"Hangi hayvan büyük?","choices":["the cat","the dog","the bird"],"correctIndex":1,"imageHint":"🐶"}'::jsonb, '{}', '{}', NULL, 306)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-003', 'listening', 2, 'I am hungry. I want some pizza.', 'Açım. Biraz pizza istiyorum.', '{"id":"l2-003","level":2,"theme":"Food","sentence":"I am hungry. I want some pizza.","sentenceTr":"Açım. Biraz pizza istiyorum.","question":"Why does the person want food?","questionTr":"Neden yemek istiyor?","choices":["bored","hungry","tired"],"correctIndex":1,"imageHint":"🍕"}'::jsonb, '{}', '{}', NULL, 307)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-004', 'listening', 2, 'My bag is red. My shoes are blue.', 'Çantam kırmızı. Ayakkabılarım mavi.', '{"id":"l2-004","level":2,"theme":"Colors","sentence":"My bag is red. My shoes are blue.","sentenceTr":"Çantam kırmızı. Ayakkabılarım mavi.","question":"What color is the bag?","questionTr":"Çanta ne renk?","choices":["blue","green","red"],"correctIndex":2,"imageHint":"🎒"}'::jsonb, '{}', '{}', NULL, 308)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-005', 'listening', 2, 'Dad is reading. Mom is cooking.', 'Baba okuyur. Anne yemek pişirir.', '{"id":"l2-005","level":2,"theme":"Family","sentence":"Dad is reading. Mom is cooking.","sentenceTr":"Baba okuyur. Anne yemek pişirir.","question":"Who is cooking?","questionTr":"Kim yemek yapıyor?","choices":["dad","brother","mom"],"correctIndex":2,"imageHint":"👨‍👩‍👧"}'::jsonb, '{}', '{}', NULL, 309)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-006', 'listening', 2, 'The cat is sleeping. The dog is playing.', 'Kedi uyuyor. Köpek oynuyor.', '{"id":"l2-006","level":2,"theme":"Animals","sentence":"The cat is sleeping. The dog is playing.","sentenceTr":"Kedi uyuyor. Köpek oynuyor.","question":"What is the cat doing?","questionTr":"Kedi ne yapıyor?","choices":["eating","sleeping","running"],"correctIndex":1,"imageHint":"🐱"}'::jsonb, '{}', '{}', NULL, 310)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-007', 'listening', 2, 'It is cold today. I wear my coat.', 'Bugün hava soğuk. Montumu giyiyorum.', '{"id":"l2-007","level":2,"theme":"General","sentence":"It is cold today. I wear my coat.","sentenceTr":"Bugün hava soğuk. Montumu giyiyorum.","question":"Why does the person wear a coat?","questionTr":"Neden mont giyiyor?","choices":["it is cold","it is hot","it is raining"],"correctIndex":0,"imageHint":"🧥"}'::jsonb, '{}', '{}', NULL, 311)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-008', 'listening', 2, 'The soup is hot. I wait a little.', 'Çorba sıcak. Biraz bekliyorum.', '{"id":"l2-008","level":2,"theme":"Food","sentence":"The soup is hot. I wait a little.","sentenceTr":"Çorba sıcak. Biraz bekliyorum.","question":"Why does the person wait?","questionTr":"Neden bekliyor?","choices":["the soup is cold","the soup is hot","the soup is gone"],"correctIndex":1,"imageHint":"🍜"}'::jsonb, '{}', '{}', NULL, 312)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-009', 'listening', 2, 'I am tired. I go to bed.', 'Yorgunum. Yatağa gidiyorum.', '{"id":"l2-009","level":2,"theme":"General","sentence":"I am tired. I go to bed.","sentenceTr":"Yorgunum. Yatağa gidiyorum.","question":"Where does the person go?","questionTr":"Nereye gidiyor?","choices":["to school","to bed","to the park"],"correctIndex":1,"imageHint":"🛏️"}'::jsonb, '{}', '{}', NULL, 313)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-010', 'listening', 2, 'The bird has wings. It can fly.', 'Kuşun kanatları var. Uçabilir.', '{"id":"l2-010","level":2,"theme":"Animals","sentence":"The bird has wings. It can fly.","sentenceTr":"Kuşun kanatları var. Uçabilir.","question":"What can the bird do?","questionTr":"Kuş ne yapabilir?","choices":["swim","fly","run"],"correctIndex":1,"imageHint":"🐦"}'::jsonb, '{}', '{}', NULL, 314)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-011', 'listening', 2, 'The apple is red. The banana is yellow.', 'Elma kırmızı. Muz sarı.', '{"id":"l2-011","level":2,"theme":"Colors","sentence":"The apple is red. The banana is yellow.","sentenceTr":"Elma kırmızı. Muz sarı.","question":"What color is the banana?","questionTr":"Muz ne renk?","choices":["red","green","yellow"],"correctIndex":2,"imageHint":"🍌"}'::jsonb, '{}', '{}', NULL, 315)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-012', 'listening', 2, 'I like rain. I jump in puddles.', 'Yağmuru severim. Su birikintilerinde zıplarım.', '{"id":"l2-012","level":2,"theme":"General","sentence":"I like rain. I jump in puddles.","sentenceTr":"Yağmuru severim. Su birikintilerinde zıplarım.","question":"What does the person jump in?","questionTr":"Nerede zıplar?","choices":["snow","puddles","sand"],"correctIndex":1,"imageHint":"🌧️"}'::jsonb, '{}', '{}', NULL, 316)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-013', 'listening', 2, 'My brother plays football. He is good at it.', 'Erkek kardeşim futbol oynuyor. Bu konuda iyidir.', '{"id":"l2-013","level":2,"theme":"Family","sentence":"My brother plays football. He is good at it.","sentenceTr":"Erkek kardeşim futbol oynuyor. Bu konuda iyidir.","question":"What sport does the brother play?","questionTr":"Erkek kardeş hangi sporu yapıyor?","choices":["basketball","tennis","football"],"correctIndex":2,"imageHint":"⚽"}'::jsonb, '{}', '{}', NULL, 317)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-014', 'listening', 2, 'I have an orange and an apple. I eat the orange.', 'Bir portakalım ve elmalım var. Portakalı yiyorum.', '{"id":"l2-014","level":2,"theme":"Food","sentence":"I have an orange and an apple. I eat the orange.","sentenceTr":"Bir portakalım ve elmalım var. Portakalı yiyorum.","question":"What does the person eat?","questionTr":"Kişi ne yiyor?","choices":["the apple","the orange","both"],"correctIndex":1,"imageHint":"🍊"}'::jsonb, '{}', '{}', NULL, 318)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l2-015', 'listening', 2, 'My book is on the table. My pen is on the book.', 'Kitabım masanın üzerinde. Kalemim kitabın üzerinde.', '{"id":"l2-015","level":2,"theme":"General","sentence":"My book is on the table. My pen is on the book.","sentenceTr":"Kitabım masanın üzerinde. Kalemim kitabın üzerinde.","question":"Where is the pen?","questionTr":"Kalem nerede?","choices":["on the table","in the bag","on the book"],"correctIndex":2,"imageHint":"📖"}'::jsonb, '{}', '{}', NULL, 319)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-001', 'listening', 3, 'Tom says: "I want to play." Lisa says: "Me too! Let''s go to the park."', 'Tom: "Oynamak istiyorum." Lisa: "Ben de! Hadi parka gidelim."', '{"id":"l3-001","level":3,"theme":"General","sentence":"Tom says: \"I want to play.\" Lisa says: \"Me too! Let''s go to the park.\"","sentenceTr":"Tom: \"Oynamak istiyorum.\" Lisa: \"Ben de! Hadi parka gidelim.\"","question":"Where do they decide to go?","questionTr":"Nereye gitmeye karar veriyorlar?","choices":["to the school","to the park","to the beach"],"correctIndex":1,"imageHint":"🌳"}'::jsonb, '{}', '{}', NULL, 320)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-002', 'listening', 3, 'Mom asks: "Are you hungry?" Sam says: "Yes! Can I have some cake?"', 'Anne sorar: "Acıktın mı?" Sam der: "Evet! Biraz pasta alabilir miyim?"', '{"id":"l3-002","level":3,"theme":"Food","sentence":"Mom asks: \"Are you hungry?\" Sam says: \"Yes! Can I have some cake?\"","sentenceTr":"Anne sorar: \"Acıktın mı?\" Sam der: \"Evet! Biraz pasta alabilir miyim?\"","question":"What does Sam want to eat?","questionTr":"Sam ne yemek istiyor?","choices":["bread","cake","soup"],"correctIndex":1,"imageHint":"🎂"}'::jsonb, '{}', '{}', NULL, 321)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-003', 'listening', 3, 'Jane says: "I have a pet." Ben asks: "What is it?" Jane says: "It is a rabbit!"', 'Jane: "Bir evcil hayvanım var." Ben: "Nedir?" Jane: "Bir tavşan!"', '{"id":"l3-003","level":3,"theme":"Animals","sentence":"Jane says: \"I have a pet.\" Ben asks: \"What is it?\" Jane says: \"It is a rabbit!\"","sentenceTr":"Jane: \"Bir evcil hayvanım var.\" Ben: \"Nedir?\" Jane: \"Bir tavşan!\"","question":"What is Jane''s pet?","questionTr":"Jane''in evcil hayvanı ne?","choices":["a cat","a dog","a rabbit"],"correctIndex":2,"imageHint":"🐰"}'::jsonb, '{}', '{}', NULL, 322)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-004', 'listening', 3, 'Teacher says: "Open your books." Tim says: "I forgot my book at home."', 'Öğretmen: "Kitaplarınızı açın." Tim: "Kitabımı evde unuttum."', '{"id":"l3-004","level":3,"theme":"General","sentence":"Teacher says: \"Open your books.\" Tim says: \"I forgot my book at home.\"","sentenceTr":"Öğretmen: \"Kitaplarınızı açın.\" Tim: \"Kitabımı evde unuttum.\"","question":"Where did Tim forget his book?","questionTr":"Tim kitabını nerede unuttu?","choices":["at school","at home","in the park"],"correctIndex":1,"imageHint":"📚"}'::jsonb, '{}', '{}', NULL, 323)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-005', 'listening', 3, 'Anna says: "I want the red balloon." But the shop only has blue ones.', 'Anna: "Kırmızı balonu istiyorum." Ama dükkanda sadece mavi var.', '{"id":"l3-005","level":3,"theme":"Colors","sentence":"Anna says: \"I want the red balloon.\" But the shop only has blue ones.","sentenceTr":"Anna: \"Kırmızı balonu istiyorum.\" Ama dükkanda sadece mavi var.","question":"What color does Anna want?","questionTr":"Anna hangi rengi istiyor?","choices":["blue","red","yellow"],"correctIndex":1,"imageHint":"🎈"}'::jsonb, '{}', '{}', NULL, 324)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-006', 'listening', 3, 'Dad asks: "Who wants ice cream?" Both kids shout: "Me! Me!"', 'Baba sorar: "Kim dondurma istiyor?" İki çocuk da bağırır: "Ben! Ben!"', '{"id":"l3-006","level":3,"theme":"Family","sentence":"Dad asks: \"Who wants ice cream?\" Both kids shout: \"Me! Me!\"","sentenceTr":"Baba sorar: \"Kim dondurma istiyor?\" İki çocuk da bağırır: \"Ben! Ben!\"","question":"How many children want ice cream?","questionTr":"Kaç çocuk dondurma istiyor?","choices":["one","two","three"],"correctIndex":1,"imageHint":"🍦"}'::jsonb, '{}', '{}', NULL, 325)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-007', 'listening', 3, 'Lily asks: "Can a fish climb a tree?" Her friend laughs and says: "No, fish swim', 'Lily: "Balık ağaca çıkabilir mi?" Arkadaşı güler: "Hayır, balıklar yüzer!"', '{"id":"l3-007","level":3,"theme":"Animals","sentence":"Lily asks: \"Can a fish climb a tree?\" Her friend laughs and says: \"No, fish swim!\"","sentenceTr":"Lily: \"Balık ağaca çıkabilir mi?\" Arkadaşı güler: \"Hayır, balıklar yüzer!\"","question":"What can fish do?","questionTr":"Balıklar ne yapabilir?","choices":["climb trees","fly","swim"],"correctIndex":2,"imageHint":"🐟"}'::jsonb, '{}', '{}', NULL, 326)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-008', 'listening', 3, 'Max says: "It is raining." Ava says: "Let''s take an umbrella then."', 'Max: "Yağmur yağıyor." Ava: "O zaman şemsiye alalım."', '{"id":"l3-008","level":3,"theme":"General","sentence":"Max says: \"It is raining.\" Ava says: \"Let''s take an umbrella then.\"","sentenceTr":"Max: \"Yağmur yağıyor.\" Ava: \"O zaman şemsiye alalım.\"","question":"Why do they need an umbrella?","questionTr":"Neden şemsiye lazım?","choices":["it is sunny","it is raining","it is snowing"],"correctIndex":1,"imageHint":"☂️"}'::jsonb, '{}', '{}', NULL, 327)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-009', 'listening', 3, 'Waiter asks: "What would you like?" The boy says: "Pizza, please. And some water', 'Garson: "Ne istersiniz?" Çocuk: "Pizza lütfen. Ve biraz su."', '{"id":"l3-009","level":3,"theme":"Food","sentence":"Waiter asks: \"What would you like?\" The boy says: \"Pizza, please. And some water.\"","sentenceTr":"Garson: \"Ne istersiniz?\" Çocuk: \"Pizza lütfen. Ve biraz su.\"","question":"What does the boy order to drink?","questionTr":"Çocuk ne içecek ısmarladı?","choices":["juice","milk","water"],"correctIndex":2,"imageHint":"🍕"}'::jsonb, '{}', '{}', NULL, 328)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l3-010', 'listening', 3, 'Girl says: "I lost my pencil." Boy says: "Here, you can use mine."', 'Kız: "Kalemimi kaybettim." Erkek: "Al, benimkini kullanabilirsin."', '{"id":"l3-010","level":3,"theme":"General","sentence":"Girl says: \"I lost my pencil.\" Boy says: \"Here, you can use mine.\"","sentenceTr":"Kız: \"Kalemimi kaybettim.\" Erkek: \"Al, benimkini kullanabilirsin.\"","question":"What is the problem?","questionTr":"Problem ne?","choices":["she lost her book","she lost her pencil","she broke her pen"],"correctIndex":1,"imageHint":"✏️"}'::jsonb, '{}', '{}', NULL, 329)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l4-001', 'listening', 4, 'Sara woke up, put on her shoes, and grabbed her schoolbag.', 'Sara uyandı, ayakkabılarını giydi ve okul çantasını aldı.', '{"id":"l4-001","level":4,"theme":"General","sentence":"Sara woke up, put on her shoes, and grabbed her schoolbag.","sentenceTr":"Sara uyandı, ayakkabılarını giydi ve okul çantasını aldı.","question":"Where is Sara probably going?","questionTr":"Sara muhtemelen nereye gidiyor?","choices":["to the park","to school","to bed"],"correctIndex":1,"imageHint":"🎒"}'::jsonb, '{}', '{}', NULL, 330)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l4-002', 'listening', 4, 'The boy blew out the candles and everyone sang a song.', 'Çocuk mumu üfledi ve herkes şarkı söyledi.', '{"id":"l4-002","level":4,"theme":"General","sentence":"The boy blew out the candles and everyone sang a song.","sentenceTr":"Çocuk mumu üfledi ve herkes şarkı söyledi.","question":"What are they probably celebrating?","questionTr":"Muhtemelen ne kutluyorlar?","choices":["a wedding","a birthday","New Year"],"correctIndex":1,"imageHint":"🎂"}'::jsonb, '{}', '{}', NULL, 331)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l4-003', 'listening', 4, 'The animal says "moo" and gives us milk every morning.', 'Hayvan "möö" der ve her sabah bize süt verir.', '{"id":"l4-003","level":4,"theme":"Animals","sentence":"The animal says \"moo\" and gives us milk every morning.","sentenceTr":"Hayvan \"möö\" der ve her sabah bize süt verir.","question":"Which animal is this?","questionTr":"Bu hangi hayvan?","choices":["a horse","a cow","a goat"],"correctIndex":1,"imageHint":"🐄"}'::jsonb, '{}', '{}', NULL, 332)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l4-004', 'listening', 4, 'The man looked up at the sky. It was dark and the stars were out.', 'Adam gökyüzüne baktı. Karanlıktı ve yıldızlar görünüyordu.', '{"id":"l4-004","level":4,"theme":"General","sentence":"The man looked up at the sky. It was dark and the stars were out.","sentenceTr":"Adam gökyüzüne baktı. Karanlıktı ve yıldızlar görünüyordu.","question":"What time of day was it?","questionTr":"Günün hangi vakti?","choices":["morning","afternoon","night"],"correctIndex":2,"imageHint":"🌙"}'::jsonb, '{}', '{}', NULL, 333)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l4-005', 'listening', 4, 'The girl opened her umbrella because the ground was getting wet.', 'Kız şemsiyesini açtı çünkü yer ıslanıyordu.', '{"id":"l4-005","level":4,"theme":"General","sentence":"The girl opened her umbrella because the ground was getting wet.","sentenceTr":"Kız şemsiyesini açtı çünkü yer ıslanıyordu.","question":"What is the weather like?","questionTr":"Hava nasıl?","choices":["sunny","snowing","raining"],"correctIndex":2,"imageHint":"☂️"}'::jsonb, '{}', '{}', NULL, 334)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l5-001', 'listening', 5, 'Once there was a little rabbit. He was hungry, so he went to the garden. He foun', 'Bir zamanlar küçük bir tavşan vardı. Acıkmıştı, bu yüzden bahçeye gitti. Birkaç ', '{"id":"l5-001","level":5,"theme":"Animals","sentence":"Once there was a little rabbit. He was hungry, so he went to the garden. He found some carrots and ate them all. Then he felt full and happy.","sentenceTr":"Bir zamanlar küçük bir tavşan vardı. Acıkmıştı, bu yüzden bahçeye gitti. Birkaç havuç buldu ve hepsini yedi. Sonra tok ve mutlu hissetti.","question":"Why did the rabbit go to the garden?","questionTr":"Tavşan neden bahçeye gitti?","choices":["to play","because he was hungry","to sleep"],"correctIndex":1,"imageHint":"🐰"}'::jsonb, '{}', '{}', NULL, 335)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l5-002', 'listening', 5, 'Mia got up early. She washed her face, ate breakfast, and put on her coat. Outsi', 'Mia erken kalktı. Yüzünü yıkadı, kahvaltı yedi ve montunu giydi. Dışarıda kar ya', '{"id":"l5-002","level":5,"theme":"General","sentence":"Mia got up early. She washed her face, ate breakfast, and put on her coat. Outside, it was snowing! She smiled and ran to school.","sentenceTr":"Mia erken kalktı. Yüzünü yıkadı, kahvaltı yedi ve montunu giydi. Dışarıda kar yağıyordu! Güldü ve okula koştu.","question":"What was the weather like outside?","questionTr":"Dışarıda hava nasıldı?","choices":["sunny","rainy","snowing"],"correctIndex":2,"imageHint":"❄️"}'::jsonb, '{}', '{}', NULL, 336)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l5-003', 'listening', 5, 'Jake wanted to make a cake. He had eggs, milk, and sugar. But he had no flour! S', 'Jake kek yapmak istedi. Yumurtası, sütü ve şekeri vardı. Ama unu yoktu! Bu yüzde', '{"id":"l5-003","level":5,"theme":"Food","sentence":"Jake wanted to make a cake. He had eggs, milk, and sugar. But he had no flour! So he asked his neighbor for some flour. Then he baked the cake.","sentenceTr":"Jake kek yapmak istedi. Yumurtası, sütü ve şekeri vardı. Ama unu yoktu! Bu yüzden komşusundan un istedi. Sonra keki pişirdi.","question":"What was Jake missing to make the cake?","questionTr":"Jake kek yapmak için ne bulamadı?","choices":["eggs","flour","sugar"],"correctIndex":1,"imageHint":"🎂"}'::jsonb, '{}', '{}', NULL, 337)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l5-004', 'listening', 5, 'A little bird fell from its nest. A girl named Lily found it. She made a small w', 'Küçük bir kuş yuvasından düştü. Lily adında bir kız onu buldu. Küçük sıcak bir k', '{"id":"l5-004","level":5,"theme":"Animals","sentence":"A little bird fell from its nest. A girl named Lily found it. She made a small warm box for it. Every day she gave it food and water. After a week, the bird could fly again!","sentenceTr":"Küçük bir kuş yuvasından düştü. Lily adında bir kız onu buldu. Küçük sıcak bir kutu yaptı. Her gün yiyecek ve su verdi. Bir hafta sonra kuş tekrar uçabildi!","question":"What did Lily do to help the bird?","questionTr":"Lily kuşa yardım etmek için ne yaptı?","choices":["took it to a vet","made a warm box for it","put it back in the nest"],"correctIndex":1,"imageHint":"🐦"}'::jsonb, '{}', '{}', NULL, 338)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('listening_l5-005', 'listening', 5, 'Tom and his dad went fishing. They waited for a long time. Tom caught a big fish', 'Tom ve babası balığa gitti. Uzun süre beklediler. Tom büyük bir balık yakaladı! ', '{"id":"l5-005","level":5,"theme":"General","sentence":"Tom and his dad went fishing. They waited for a long time. Tom caught a big fish! Dad took a photo. They put the fish back in the water and went home happy.","sentenceTr":"Tom ve babası balığa gitti. Uzun süre beklediler. Tom büyük bir balık yakaladı! Babası fotoğraf çekti. Balığı suya geri bıraktılar ve mutlu bir şekilde eve döndüler.","question":"What did they do with the fish at the end?","questionTr":"Sonunda balıkla ne yaptılar?","choices":["ate it for dinner","sold it","put it back in the water"],"correctIndex":2,"imageHint":"🎣"}'::jsonb, '{}', '{}', NULL, 339)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g01_articles_a_an', 'grammar', 1, 'A vs An', 'A mı An mı?', '{"id":"g01_articles_a_an","topic":"A vs An","topicTr":"A mı An mı?","level":1,"turkishNote":"Türkçede \"bir\" her zaman aynı. İngilizcede sesli harften önce \"an\" kullanılır!","pattern":"a + consonant sound | an + vowel sound","patternTr":"a + ünsüz ses | an + ünlü ses","examples":[{"en":"I see a cat.","tr":"Bir kedi görüyorum.","highlight":"a cat"},{"en":"I see an apple.","tr":"Bir elma görüyorum.","highlight":"an apple"},{"en":"She has a dog.","tr":"Onun bir köpeği var.","highlight":"a dog"},{"en":"He has an egg.","tr":"Onun bir yumurtası var.","highlight":"an egg"},{"en":"I want a book.","tr":"Bir kitap istiyorum.","highlight":"a book"},{"en":"I want an orange.","tr":"Bir portakal istiyorum.","highlight":"an orange"}],"exercises":[{"type":"multiChoice","question":"I have ___ apple.","questionTr":"Bir elmam var.","options":["a","an","the"],"answer":"an","explanation":"\"apple\" starts with the vowel A — use \"an\"","explanationTr":"\"apple\" ünlü A harfiyle başlar — \"an\" kullanılır"},{"type":"multiChoice","question":"She has ___ cat.","questionTr":"Onun bir kedisi var.","options":["a","an","the"],"answer":"a","explanation":"\"cat\" starts with consonant C — use \"a\"","explanationTr":"\"cat\" ünsüz C harfiyle başlar — \"a\" kullanılır"},{"type":"multiChoice","question":"I see ___ elephant.","questionTr":"Bir fil görüyorum.","options":["a","an"],"answer":"an","explanation":"\"elephant\" starts with vowel E — use \"an\"","explanationTr":"\"elephant\" ünlü E harfiyle başlar — \"an\" kullanılır"},{"type":"multiChoice","question":"He eats ___ banana.","questionTr":"O bir muz yer.","options":["a","an"],"answer":"a","explanation":"\"banana\" starts with consonant B — use \"a\"","explanationTr":"\"banana\" ünsüz B harfiyle başlar — \"a\" kullanılır"}]}'::jsonb, '{}', '{}', NULL, 340)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g02_this_that', 'grammar', 1, 'This vs That', 'This mi That mı?', '{"id":"g02_this_that","topic":"This vs That","topicTr":"This mi That mı?","level":1,"turkishNote":"\"Bu\" yakındaki şeyler için, \"şu/o\" uzaktaki şeyler için","pattern":"this = close to me | that = far from me","patternTr":"this = yakın | that = uzak","examples":[{"en":"This is my book.","tr":"Bu benim kitabım.","highlight":"This"},{"en":"That is a big tree.","tr":"Şu büyük bir ağaç.","highlight":"That"},{"en":"This cat is soft.","tr":"Bu kedi yumuşak.","highlight":"This"},{"en":"That dog is fast.","tr":"Şu köpek hızlı.","highlight":"That"}],"exercises":[{"type":"multiChoice","question":"___ is my pencil. (close to you)","questionTr":"___ benim kalemim. (yakında)","options":["This","That"],"answer":"This","explanation":"Close to you → This","explanationTr":"Yakında → This"},{"type":"multiChoice","question":"___ is a mountain far away.","questionTr":"___ uzaktaki bir dağ.","options":["This","That"],"answer":"That","explanation":"Far from you → That","explanationTr":"Uzakta → That"},{"type":"multiChoice","question":"___ is my hand. (you can see your hand right now)","questionTr":"___ benim elim. (eline bakıyorsun)","options":["This","That"],"answer":"This","explanation":"Your own hand is close → This","explanationTr":"Kendi elin yakında → This"}]}'::jsonb, '{}', '{}', NULL, 341)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g03_is_are', 'grammar', 1, 'Am / Is / Are', 'Am / Is / Are', '{"id":"g03_is_are","topic":"Am / Is / Are","topicTr":"Am / Is / Are","level":1,"turkishNote":"Türkçede fark yok — hepsi \"...dir/...yım\". İngilizcede I=am, o(tekil)=is, onlar/biz=are","pattern":"I + am | he/she/it + is | you/we/they + are","patternTr":"I + am | o (tek) + is | sen/biz/onlar + are","examples":[{"en":"I am happy.","tr":"Ben mutluyum.","highlight":"am"},{"en":"The cat is small.","tr":"Kedi küçük.","highlight":"is"},{"en":"The cats are small.","tr":"Kediler küçük.","highlight":"are"},{"en":"She is my friend.","tr":"O benim arkadaşım.","highlight":"is"},{"en":"They are happy.","tr":"Onlar mutlu.","highlight":"are"},{"en":"We are ready!","tr":"Hazırız!","highlight":"are"}],"exercises":[{"type":"multiChoice","question":"I ___ a student.","questionTr":"Ben bir öğrenciyim.","options":["am","is","are"],"answer":"am","explanation":"I → am (always!)","explanationTr":"I → her zaman am"},{"type":"multiChoice","question":"The dog ___ big.","questionTr":"Köpek büyük.","options":["am","is","are"],"answer":"is","explanation":"One dog (singular, not I) → is","explanationTr":"Bir köpek (tekil, I değil) → is"},{"type":"multiChoice","question":"The dogs ___ big.","questionTr":"Köpekler büyük.","options":["am","is","are"],"answer":"are","explanation":"More than one (plural) → are","explanationTr":"Birden fazla (çoğul) → are"},{"type":"multiChoice","question":"She ___ my friend.","questionTr":"O benim arkadaşım.","options":["am","is","are"],"answer":"is","explanation":"She (singular, not I) → is","explanationTr":"She (tekil, I değil) → is"}]}'::jsonb, '{}', '{}', NULL, 342)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g04_have_has', 'grammar', 2, 'Have vs Has', 'Have mi Has mı?', '{"id":"g04_have_has","topic":"Have vs Has","topicTr":"Have mi Has mı?","level":2,"turkishNote":"\"sahip olmak\" → I/You/They=have, He/She/It=has. Türkçede bu ayrım yok!","pattern":"I/you/we/they + have | he/she/it + has","patternTr":"Ben/Sen/Biz/Onlar + have | O + has","examples":[{"en":"I have a cat.","tr":"Benim bir kedim var.","highlight":"have"},{"en":"She has a cat.","tr":"Onun bir kedisi var.","highlight":"has"},{"en":"We have a big house.","tr":"Bizim büyük bir evimiz var.","highlight":"have"},{"en":"He has a red car.","tr":"Onun kırmızı bir arabası var.","highlight":"has"}],"exercises":[{"type":"multiChoice","question":"She ___ a blue pencil.","questionTr":"Onun mavi bir kalemi var.","options":["have","has"],"answer":"has","explanation":"She → has","explanationTr":"She → has"},{"type":"multiChoice","question":"I ___ two dogs.","questionTr":"Benim iki köpeğim var.","options":["have","has"],"answer":"have","explanation":"I → have","explanationTr":"I → have"}]}'::jsonb, '{}', '{}', NULL, 343)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g05_prepositions', 'grammar', 2, 'In, On, Under', 'In, On, Under (Edat)', '{"id":"g05_prepositions","topic":"In, On, Under","topicTr":"In, On, Under (Edat)","level":2,"turkishNote":"Türkçede \"-de/-da/-in/-ın\" ekleri, İngilizcede ayrı kelimeler!","pattern":"in = içinde | on = üzerinde | under = altında","patternTr":"in = içinde | on = üstünde | under = altında","examples":[{"en":"The cat is in the box.","tr":"Kedi kutunun içinde.","highlight":"in"},{"en":"The book is on the table.","tr":"Kitap masanın üstünde.","highlight":"on"},{"en":"The ball is under the chair.","tr":"Top sandalyenin altında.","highlight":"under"},{"en":"She is in the room.","tr":"O odada.","highlight":"in"},{"en":"The bird is on the tree.","tr":"Kuş ağacın üstünde.","highlight":"on"}],"exercises":[{"type":"multiChoice","question":"The fish is ___ the water.","questionTr":"Balık suyun içinde.","options":["in","on","under"],"answer":"in","explanation":"Fish lives inside water → in","explanationTr":"Balık suyun içinde yaşar → in"},{"type":"multiChoice","question":"The cup is ___ the table.","questionTr":"Fincan masanın üstünde.","options":["in","on","under"],"answer":"on","explanation":"Cup sits on top of table → on","explanationTr":"Fincan masanın üstünde duruyor → on"},{"type":"multiChoice","question":"The dog is ___ the bed.","questionTr":"Köpek yatağın altında.","options":["in","on","under"],"answer":"under","explanation":"Dog is below the bed → under","explanationTr":"Köpek yatağın altında → under"}]}'::jsonb, '{}', '{}', NULL, 344)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g06_possessives', 'grammar', 2, 'My, Your, His, Her', 'Benim, Senin, Onun', '{"id":"g06_possessives","topic":"My, Your, His, Her","topicTr":"Benim, Senin, Onun","level":2,"turkishNote":"Türkçede ek olarak gelir (-im, -in, -i). İngilizcede ayrı kelimeler! Dikkat: \"his\" erkek, \"her\" kız için!","pattern":"my / your / his / her / our / their","patternTr":"benim / senin / onun (erkek) / onun (kız) / bizim / onların","examples":[{"en":"This is my dog.","tr":"Bu benim köpeğim.","highlight":"my"},{"en":"That is your book.","tr":"Şu senin kitabın.","highlight":"your"},{"en":"He loves his cat.","tr":"O (erkek) kedisini seviyor.","highlight":"his"},{"en":"She has her bag.","tr":"O (kız) çantasını taşıyor.","highlight":"her"},{"en":"We love our school.","tr":"Biz okulumuzu seviyoruz.","highlight":"our"},{"en":"They have their lunch.","tr":"Onların öğle yemeği var.","highlight":"their"}],"exercises":[{"type":"multiChoice","question":"Tom has ___ pencil. (Tom''s pencil)","questionTr":"Tom''un kalemi var.","options":["my","his","her"],"answer":"his","explanation":"Tom is a boy → his","explanationTr":"Tom erkek → his"},{"type":"multiChoice","question":"Mia loves ___ cat. (Mia''s cat)","questionTr":"Mia kedisini seviyor.","options":["my","his","her"],"answer":"her","explanation":"Mia is a girl → her","explanationTr":"Mia kız → her"},{"type":"multiChoice","question":"I have ___ book. (the book is mine)","questionTr":"Benim kitabım var.","options":["my","his","your"],"answer":"my","explanation":"The speaker owns the book → my","explanationTr":"Konuşan kişiye ait → my"},{"type":"multiChoice","question":"We love ___ teacher.","questionTr":"Biz öğretmenimizi seviyoruz.","options":["my","our","their"],"answer":"our","explanation":"\"We\" → the teacher belongs to all of us → our","explanationTr":"\"We\" → hepimizin öğretmeni → our"}]}'::jsonb, '{}', '{}', NULL, 345)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g07_simple_present', 'grammar', 2, 'I like / She likes', 'Geniş Zaman (-s)', '{"id":"g07_simple_present","topic":"I like / She likes","topicTr":"Geniş Zaman (-s)","level":2,"turkishNote":"He/She/It ile fiilin sonuna -s/-es eklenir! \"She like\" değil \"She likes\".","pattern":"I/you/we/they + verb | he/she/it + verb+s","patternTr":"I/you/we/they + fiil | he/she/it + fiil+s","examples":[{"en":"I like cats.","tr":"Ben kedileri severim.","highlight":"like"},{"en":"She likes cats.","tr":"O kedileri sever.","highlight":"likes"},{"en":"We play every day.","tr":"Her gün oynarız.","highlight":"play"},{"en":"He plays every day.","tr":"O her gün oynar.","highlight":"plays"},{"en":"They eat apples.","tr":"Onlar elma yer.","highlight":"eat"},{"en":"It eats apples.","tr":"O elma yer.","highlight":"eats"}],"exercises":[{"type":"multiChoice","question":"She ___ fish every day.","questionTr":"O her gün balık yer.","options":["eat","eats","eating"],"answer":"eats","explanation":"She → eat + s = eats","explanationTr":"She → eat + s = eats"},{"type":"multiChoice","question":"I ___ my homework every day.","questionTr":"Her gün ödevimi yaparım.","options":["do","does","doing"],"answer":"do","explanation":"I → do (no -s)","explanationTr":"I → do (-s eklenmez)"}]}'::jsonb, '{}', '{}', NULL, 346)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g08_can_cant', 'grammar', 2, 'Can / Can''t', 'Yapabilmek / Yapamamak', '{"id":"g08_can_cant","topic":"Can / Can''t","topicTr":"Yapabilmek / Yapamamak","level":2,"turkishNote":"\"Yapabilmek\" = can + fiil (düz hali). \"can runs\" değil \"can run\"! Can sonrası -s eklenmez.","pattern":"can + verb (base form) | cannot / can''t + verb","patternTr":"can + fiil (yalın hali) | can''t + fiil","examples":[{"en":"I can swim.","tr":"Ben yüzebilirim.","highlight":"can swim"},{"en":"She can''t fly.","tr":"O uçamaz.","highlight":"can''t fly"},{"en":"Birds can sing.","tr":"Kuşlar şarkı söyleyebilir.","highlight":"can sing"},{"en":"Fish can''t walk.","tr":"Balıklar yürüyemez.","highlight":"can''t walk"}],"exercises":[{"type":"multiChoice","question":"She can ___ fast.","questionTr":"O hızlı koşabilir.","options":["runs","run","running"],"answer":"run","explanation":"After \"can\" → base verb form (no -s)","explanationTr":"\"can\" sonrası → fiilin yalın hali (-s eklenmez)"},{"type":"multiChoice","question":"Birds ___ fly.","questionTr":"Kuşlar uçabilir.","options":["can","can''t","cans"],"answer":"can","explanation":"Birds have wings and fly → can","explanationTr":"Kuşların kanatları var, uçabilirler → can"},{"type":"multiChoice","question":"Fish ___ climb trees.","questionTr":"Balıklar ağaca çıkamaz.","options":["can","can''t","cans"],"answer":"can''t","explanation":"Fish live in water — they cannot climb trees","explanationTr":"Balıklar suda yaşar — ağaca çıkamazlar"},{"type":"multiChoice","question":"I can ___ English!","questionTr":"Ben İngilizce konuşabilirim!","options":["speaks","speak","speaking"],"answer":"speak","explanation":"After \"can\" → base form, no -s or -ing","explanationTr":"\"can\" sonrası → yalın hal, -s veya -ing eklenmez"}]}'::jsonb, '{}', '{}', NULL, 347)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g11_past_tense_ed', 'grammar', 2, 'Past Tense: -ed', 'Geçmiş Zaman: -ed', '{"id":"g11_past_tense_ed","topic":"Past Tense: -ed","topicTr":"Geçmiş Zaman: -ed","level":2,"turkishNote":"Türkçede geçmiş zaman ''aldım, gittim'' gibi ekin sonuna gelir. İngilizce''de fiil + ed: ''walked'', ''played''","pattern":"Subject + verb + ed","patternTr":"Özne + fiil + ed","examples":[{"en":"I walked to school.","tr":"Okula yürüyerek gittim.","highlight":"walked"},{"en":"She played with a cat.","tr":"O bir kediyle oynadı.","highlight":"played"},{"en":"We watched TV.","tr":"Biz TV izledik.","highlight":"watched"}],"exercises":[{"type":"multiChoice","question":"Yesterday I ___ to school.","questionTr":"Dün okula yürüyerek gittim.","options":["walk","walked","walking"],"answer":"walked","explanation":"\"Yesterday\" tells us it is the past → walked","explanationTr":"\"Yesterday\" geçmiş zamanı gösterir → walked"},{"type":"multiChoice","question":"She ___ with her friends last week.","questionTr":"Geçen hafta arkadaşlarıyla oynadı.","options":["plays","played","play"],"answer":"played","explanation":"\"Last week\" is in the past → played","explanationTr":"\"Last week\" geçmişe işaret eder → played"},{"type":"multiChoice","question":"We ___ a movie last night.","questionTr":"Dün gece bir film izledik.","options":["watch","watches","watched"],"answer":"watched","explanation":"\"Last night\" is in the past → watched","explanationTr":"\"Last night\" geçmişe işaret eder → watched"}]}'::jsonb, '{}', '{}', NULL, 348)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g12_negative_dont', 'grammar', 2, 'Negative: don''t / doesn''t', 'Olumsuzluk: don''t / doesn''t', '{"id":"g12_negative_dont","topic":"Negative: don''t / doesn''t","topicTr":"Olumsuzluk: don''t / doesn''t","level":2,"turkishNote":"Türkçede olumsuzluk ''-me/-ma'': ''sevmiyorum''. İngilizce''de ''don''t'' veya ''doesn''t'' kullanılır: ''I don''t like'', ''She doesn''t eat''","pattern":"Subject + don''t/doesn''t + verb","patternTr":"Özne + don''t/doesn''t + fiil","examples":[{"en":"I don''t like spiders.","tr":"Ben örümcekleri sevmiyorum.","highlight":"don''t like"},{"en":"He doesn''t eat meat.","tr":"O et yemiyor.","highlight":"doesn''t eat"},{"en":"They don''t play football.","tr":"Onlar futbol oynamıyor.","highlight":"don''t play"}],"exercises":[{"type":"multiChoice","question":"I ___ like spiders.","questionTr":"Ben örümcekleri sevmiyorum.","options":["don''t","doesn''t","not"],"answer":"don''t","explanation":"I → don''t (first person singular uses don''t)","explanationTr":"I ile → don''t kullanılır"},{"type":"multiChoice","question":"She ___ eat vegetables.","questionTr":"O sebze yemiyor.","options":["don''t","doesn''t","not"],"answer":"doesn''t","explanation":"She → doesn''t (third person singular uses doesn''t)","explanationTr":"She ile → doesn''t kullanılır"},{"type":"multiChoice","question":"They ___ play chess.","questionTr":"Onlar satranç oynamıyor.","options":["don''t","doesn''t","not"],"answer":"don''t","explanation":"They (plural) → don''t","explanationTr":"They (çoğul) → don''t kullanılır"}]}'::jsonb, '{}', '{}', NULL, 349)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g13_questions_do_does', 'grammar', 2, 'Questions: Do / Does?', 'Soru: Do / Does?', '{"id":"g13_questions_do_does","topic":"Questions: Do / Does?","topicTr":"Soru: Do / Does?","level":2,"turkishNote":"Türkçede soru ''mi/mı'' eki: ''seviyor musun?''. İngilizce''de cümlenin başına ''Do/Does'' gelir: ''Do you like?'' / ''Does she have?''","pattern":"Do/Does + subject + verb?","patternTr":"Do/Does + özne + fiil?","examples":[{"en":"Do you like cats?","tr":"Kedileri sever misin?","highlight":"Do"},{"en":"Does she have a bike?","tr":"Onun bisikleti var mı?","highlight":"Does"},{"en":"Do they play chess?","tr":"Onlar satranç oynar mı?","highlight":"Do"}],"exercises":[{"type":"multiChoice","question":"___ you like ice cream?","questionTr":"Dondurma sever misin?","options":["Do","Does","Is"],"answer":"Do","explanation":"With \"you\" → Do (not Does)","explanationTr":"\"you\" ile → Do kullanılır"},{"type":"multiChoice","question":"___ she have a dog?","questionTr":"Onun köpeği var mı?","options":["Do","Does","Is"],"answer":"Does","explanation":"With \"she\" (third person) → Does","explanationTr":"\"she\" (üçüncü tekil şahıs) ile → Does kullanılır"},{"type":"multiChoice","question":"___ they play football?","questionTr":"Onlar futbol oynar mı?","options":["Do","Does","Are"],"answer":"Do","explanation":"With \"they\" (plural) → Do","explanationTr":"\"they\" (çoğul) ile → Do kullanılır"}]}'::jsonb, '{}', '{}', NULL, 350)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g14_there_is_are', 'grammar', 2, 'There is / There are', 'Var: There is / There are', '{"id":"g14_there_is_are","topic":"There is / There are","topicTr":"Var: There is / There are","level":2,"turkishNote":"Türkçede ''var'' tek kelime: ''bir kedi var'', ''üç kedi var''. İngilizce''de tekil için ''there is'', çoğul için ''there are'' kullanılır","pattern":"There is + singular / There are + plural","patternTr":"There is + tekil isim / There are + çoğul isim","examples":[{"en":"There is a cat on the mat.","tr":"Paspasın üzerinde bir kedi var.","highlight":"There is"},{"en":"There are three birds in the tree.","tr":"Ağaçta üç kuş var.","highlight":"There are"},{"en":"There is a book on the desk.","tr":"Masanın üzerinde bir kitap var.","highlight":"There is"}],"exercises":[{"type":"multiChoice","question":"___ a dog in the garden.","questionTr":"Bahçede bir köpek var.","options":["There is","There are","There be"],"answer":"There is","explanation":"One dog (singular) → There is","explanationTr":"Bir köpek (tekil) → There is"},{"type":"multiChoice","question":"___ five apples on the table.","questionTr":"Masada beş elma var.","options":["There is","There are","There be"],"answer":"There are","explanation":"Five apples (plural) → There are","explanationTr":"Beş elma (çoğul) → There are"},{"type":"multiChoice","question":"___ a rainbow in the sky.","questionTr":"Gökyüzünde bir gökkuşağı var.","options":["There is","There are","There be"],"answer":"There is","explanation":"One rainbow (singular) → There is","explanationTr":"Bir gökkuşağı (tekil) → There is"}]}'::jsonb, '{}', '{}', NULL, 351)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g15_adjective_order', 'grammar', 2, 'Adjective Before Noun', 'Sıfat İsimden Önce Gelir', '{"id":"g15_adjective_order","topic":"Adjective Before Noun","topicTr":"Sıfat İsimden Önce Gelir","level":2,"turkishNote":"Türkçede sıfat isimden önce gelir: ''büyük köpek'' = ''big dog''. İngilizce sıralaması aynı: sıfat + isim. Türkçe konuşanlar için kolay!","pattern":"adjective + noun","patternTr":"sıfat + isim","examples":[{"en":"I have a big dog.","tr":"Benim büyük bir köpeğim var.","highlight":"big dog"},{"en":"She wears a red hat.","tr":"O kırmızı bir şapka takıyor.","highlight":"red hat"},{"en":"It is a cute baby.","tr":"O sevimli bir bebek.","highlight":"cute baby"}],"exercises":[{"type":"multiChoice","question":"She has a ___ cat. (yellow)","questionTr":"Onun sarı bir kedisi var.","options":["yellow","yellowy","yellows"],"answer":"yellow","explanation":"Adjective comes before the noun: a yellow cat","explanationTr":"Sıfat isimden önce gelir: a yellow cat"},{"type":"multiChoice","question":"I see ___.","questionTr":"Büyük bir ağaç görüyorum.","options":["tree big","a big tree","a tree big"],"answer":"a big tree","explanation":"Correct order: article + adjective + noun (a big tree)","explanationTr":"Doğru sıra: article + sıfat + isim (a big tree)"},{"type":"multiChoice","question":"He wears a ___ shirt.","questionTr":"O mavi bir gömlek giyiyor.","options":["shirt blue","blue shirt","shirt is blue"],"answer":"blue shirt","explanation":"Adjective before noun: blue shirt","explanationTr":"Sıfat isimden önce: blue shirt"}]}'::jsonb, '{}', '{}', NULL, 352)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g16_comparatives', 'grammar', 3, 'Comparatives: -er / more', 'Karşılaştırma: -er / more', '{"id":"g16_comparatives","topic":"Comparatives: -er / more","topicTr":"Karşılaştırma: -er / more","level":3,"turkishNote":"Türkçede ''-den daha'': ''köpek kediden daha büyük''. İngilizce''de kısa sıfatlar ''er'' alır: ''bigger''. Uzun sıfatlar ''more'' alır: ''more beautiful''","pattern":"adjective + er / more + adjective + than","patternTr":"kısa sıfat + er than / more + uzun sıfat + than","examples":[{"en":"A dog is bigger than a cat.","tr":"Köpek kediden daha büyük.","highlight":"bigger than"},{"en":"This book is more interesting than that one.","tr":"Bu kitap şundan daha ilginç.","highlight":"more interesting than"},{"en":"She runs faster than me.","tr":"O benden daha hızlı koşuyor.","highlight":"faster than"}],"exercises":[{"type":"multiChoice","question":"An elephant is ___ a dog.","questionTr":"Bir fil köpekten daha büyük.","options":["bigger than","more big than","big than"],"answer":"bigger than","explanation":"\"big\" is a short adjective → bigger than","explanationTr":"\"big\" kısa sıfat → bigger than"},{"type":"multiChoice","question":"This film is ___ that one.","questionTr":"Bu film şundan daha ilginç.","options":["interestinger than","more interesting than","interesting than"],"answer":"more interesting than","explanation":"\"interesting\" is a long adjective → more interesting than","explanationTr":"\"interesting\" uzun sıfat → more interesting than"},{"type":"multiChoice","question":"A cheetah is ___ a horse.","questionTr":"Bir çita attan daha hızlı.","options":["faster than","more fast than","fast than"],"answer":"faster than","explanation":"\"fast\" is a short adjective → faster than","explanationTr":"\"fast\" kısa sıfat → faster than"}]}'::jsonb, '{}', '{}', NULL, 353)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g17_superlatives', 'grammar', 3, 'Superlatives: -est / most', 'En üstünlük: -est / most', '{"id":"g17_superlatives","topic":"Superlatives: -est / most","topicTr":"En üstünlük: -est / most","level":3,"turkishNote":"Türkçede ''en'': ''en büyük'', ''en güzel''. İngilizce''de ''the'' + sıfat + ''est'': ''the biggest''. Uzun sıfatlar ''the most'': ''the most beautiful''","pattern":"the + adjective + est / the most + adjective","patternTr":"the + kısa sıfat + est / the most + uzun sıfat","examples":[{"en":"The elephant is the biggest animal.","tr":"Fil en büyük hayvan.","highlight":"the biggest"},{"en":"This is the most beautiful flower.","tr":"Bu en güzel çiçek.","highlight":"the most beautiful"},{"en":"She is the fastest runner.","tr":"O en hızlı koşucu.","highlight":"the fastest"}],"exercises":[{"type":"multiChoice","question":"The blue whale is ___ animal.","questionTr":"Mavi balina en büyük hayvan.","options":["the biggest","the most big","bigger"],"answer":"the biggest","explanation":"\"big\" is a short adjective → the biggest","explanationTr":"\"big\" kısa sıfat → the biggest"},{"type":"multiChoice","question":"This is ___ flower in the garden.","questionTr":"Bu bahçedeki en güzel çiçek.","options":["the most beautiful","the beautifullest","beautifuller"],"answer":"the most beautiful","explanation":"\"beautiful\" is a long adjective → the most beautiful","explanationTr":"\"beautiful\" uzun sıfat → the most beautiful"},{"type":"multiChoice","question":"He is ___ student in class.","questionTr":"O sınıfın en zeki öğrencisi.","options":["the smartest","the most smart","smarter"],"answer":"the smartest","explanation":"\"smart\" is a short adjective → the smartest","explanationTr":"\"smart\" kısa sıfat → the smartest"}]}'::jsonb, '{}', '{}', NULL, 354)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g18_future_going_to', 'grammar', 3, 'Future: going to', 'Gelecek Zaman: going to', '{"id":"g18_future_going_to","topic":"Future: going to","topicTr":"Gelecek Zaman: going to","level":3,"turkishNote":"Türkçede gelecek zaman ''-ecek/-acak'': ''gideceğim''. İngilizce''de ''going to + fiil'': ''I am going to go''. Planlı eylemler için kullanılır","pattern":"Subject + am/is/are + going to + verb","patternTr":"Özne + am/is/are + going to + fiil","examples":[{"en":"I am going to eat lunch.","tr":"Öğle yemeği yiyeceğim.","highlight":"am going to eat"},{"en":"She is going to visit her friend.","tr":"O arkadaşını ziyaret edecek.","highlight":"is going to visit"},{"en":"We are going to play football tomorrow.","tr":"Yarın futbol oynayacağız.","highlight":"are going to play"}],"exercises":[{"type":"multiChoice","question":"I ___ eat pizza tonight.","questionTr":"Bu gece pizza yiyeceğim.","options":["am going to","is going to","are going to"],"answer":"am going to","explanation":"I → am going to","explanationTr":"I ile → am going to kullanılır"},{"type":"multiChoice","question":"She ___ visit her grandmother.","questionTr":"O büyükannesini ziyaret edecek.","options":["am going to","is going to","are going to"],"answer":"is going to","explanation":"She → is going to","explanationTr":"She ile → is going to kullanılır"},{"type":"multiChoice","question":"We ___ play games after school.","questionTr":"Okuldan sonra oyun oynayacağız.","options":["am going to","is going to","are going to"],"answer":"are going to","explanation":"We → are going to","explanationTr":"We ile → are going to kullanılır"}]}'::jsonb, '{}', '{}', NULL, 355)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g19_question_words', 'grammar', 2, 'Question Words: Wh-', 'Soru Kelimeleri: Wh-', '{"id":"g19_question_words","topic":"Question Words: Wh-","topicTr":"Soru Kelimeleri: Wh-","level":2,"turkishNote":"Türkçede soru kelimeleri: ne, nerede, kim, ne zaman, neden, nasıl. İngilizce: what, where, who, when, why, how. Hepsi cümlenin başına gelir","pattern":"Wh- word + do/does/is + subject + verb?","patternTr":"Soru kelimesi + do/does/is + özne + fiil?","examples":[{"en":"What is your name?","tr":"Adın ne?","highlight":"What"},{"en":"Where do you live?","tr":"Nerede yaşıyorsun?","highlight":"Where"},{"en":"Why are you laughing?","tr":"Neden gülüyorsun?","highlight":"Why"}],"exercises":[{"type":"multiChoice","question":"___ is your favourite colour?","questionTr":"En sevdiğin renk ne?","options":["What","Where","Who"],"answer":"What","explanation":"Asking about a thing → What","explanationTr":"Bir şey hakkında sorulduğunda → What"},{"type":"multiChoice","question":"___ do you live?","questionTr":"Nerede yaşıyorsun?","options":["What","Where","When"],"answer":"Where","explanation":"Asking about a place → Where","explanationTr":"Bir yer hakkında sorulduğunda → Where"},{"type":"multiChoice","question":"___ is your best friend?","questionTr":"En iyi arkadaşın kim?","options":["What","Where","Who"],"answer":"Who","explanation":"Asking about a person → Who","explanationTr":"Bir kişi hakkında sorulduğunda → Who"}]}'::jsonb, '{}', '{}', NULL, 356)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('grammar_g20_possessive_s', 'grammar', 1, 'Possessive: ''s', 'İyelik: ''s', '{"id":"g20_possessive_s","topic":"Possessive: ''s","topicTr":"İyelik: ''s","level":1,"turkishNote":"Türkçede iyelik eki ''-in'': ''Mimi''nin kedisi''. İngilizce''de kesme işareti + s: ''Mimi''s cat''. Bu ters bir yapı Türkçe''ye göre!","pattern":"noun + ''s + noun","patternTr":"isim + ''s + isim","examples":[{"en":"This is Mimi''s cat.","tr":"Bu Mimi''nin kedisi.","highlight":"Mimi''s"},{"en":"That is Tom''s book.","tr":"Şu Tom''un kitabı.","highlight":"Tom''s"},{"en":"The dog''s tail is long.","tr":"Köpeğin kuyruğu uzun.","highlight":"dog''s"}],"exercises":[{"type":"multiChoice","question":"This is ___ bag. (the bag belongs to Sara)","questionTr":"Bu Sara''nın çantası.","options":["Sara''s","Saras","of Sara"],"answer":"Sara''s","explanation":"To show possession → name + ''s (Sara''s)","explanationTr":"Sahiplik için → isim + ''s (Sara''s)"},{"type":"multiChoice","question":"I like ___ hat. (the hat belongs to Tom)","questionTr":"Tom''un şapkasını seviyorum.","options":["Tom''s","Toms","of Tom"],"answer":"Tom''s","explanation":"Tom owns the hat → Tom''s hat","explanationTr":"Şapka Tom''a ait → Tom''s hat"},{"type":"multiChoice","question":"___ name is Fluffy. (the cat''s name)","questionTr":"Kedinin adı Fluffy.","options":["The cat''s","The cats","Of the cat"],"answer":"The cat''s","explanation":"The cat owns its name → the cat''s name","explanationTr":"Ad kediye ait → the cat''s name"}]}'::jsonb, '{}', '{}', NULL, 357)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_cat', 'image_label', 1, 'cat', 'kedi', '{"id":"cat","imageEmoji":"🐱","imageAlt":"A cat","correctLabel":"cat","correctLabelTr":"kedi","options":["cat","dog","bird","fish"],"phonetic":"kæt"}'::jsonb, '{"kæt"}', '{"cat"}', NULL, 358)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_dog', 'image_label', 1, 'dog', 'köpek', '{"id":"dog","imageEmoji":"🐶","imageAlt":"A dog","correctLabel":"dog","correctLabelTr":"köpek","options":["dog","cat","frog","duck"],"phonetic":"dɒɡ"}'::jsonb, '{"dɒɡ"}', '{"dog"}', NULL, 359)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_bird', 'image_label', 1, 'bird', 'kuş', '{"id":"bird","imageEmoji":"🐦","imageAlt":"A bird","correctLabel":"bird","correctLabelTr":"kuş","options":["bird","fish","horse","bear"],"phonetic":"bɜːd"}'::jsonb, '{"bɜːd"}', '{"bird"}', NULL, 360)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_rabbit', 'image_label', 1, 'rabbit', 'tavşan', '{"id":"rabbit","imageEmoji":"🐰","imageAlt":"A rabbit","correctLabel":"rabbit","correctLabelTr":"tavşan","options":["rabbit","mouse","sheep","cow"],"phonetic":"ˈræbɪt"}'::jsonb, '{"ˈræbɪt"}', '{"rabbit"}', NULL, 361)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_elephant', 'image_label', 1, 'elephant', 'fil', '{"id":"elephant","imageEmoji":"🐘","imageAlt":"An elephant","correctLabel":"elephant","correctLabelTr":"fil","options":["elephant","giraffe","tiger","lion"],"phonetic":"ˈɛlɪfənt"}'::jsonb, '{"ˈɛlɪfənt"}', '{"elephant"}', NULL, 362)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_chair', 'image_label', 1, 'chair', 'sandalye', '{"id":"chair","imageEmoji":"🪑","imageAlt":"A chair","correctLabel":"chair","correctLabelTr":"sandalye","options":["chair","table","door","bed"],"phonetic":"tʃɛə"}'::jsonb, '{"tʃɛə"}', '{"chair"}', NULL, 363)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_table', 'image_label', 1, 'table', 'masa', '{"id":"table","imageEmoji":"🪵","imageAlt":"A table","correctLabel":"table","correctLabelTr":"masa","options":["table","chair","lamp","clock"],"phonetic":"ˈteɪbəl"}'::jsonb, '{"ˈteɪbəl"}', '{"table"}', NULL, 364)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_lamp', 'image_label', 1, 'lamp', 'lamba', '{"id":"lamp","imageEmoji":"💡","imageAlt":"A lamp","correctLabel":"lamp","correctLabelTr":"lamba","options":["lamp","book","phone","key"],"phonetic":"læmp"}'::jsonb, '{"læmp"}', '{"lamp"}', NULL, 365)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_book', 'image_label', 1, 'book', 'kitap', '{"id":"book","imageEmoji":"📚","imageAlt":"A book","correctLabel":"book","correctLabelTr":"kitap","options":["book","pen","bag","cup"],"phonetic":"bʊk"}'::jsonb, '{"bʊk"}', '{"book"}', NULL, 366)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_clock', 'image_label', 1, 'clock', 'saat', '{"id":"clock","imageEmoji":"🕐","imageAlt":"A clock","correctLabel":"clock","correctLabelTr":"saat","options":["clock","lamp","key","mirror"],"phonetic":"klɒk"}'::jsonb, '{"klɒk"}', '{"clock"}', NULL, 367)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_apple', 'image_label', 1, 'apple', 'elma', '{"id":"apple","imageEmoji":"🍎","imageAlt":"An apple","correctLabel":"apple","correctLabelTr":"elma","options":["apple","banana","orange","grape"],"phonetic":"ˈæpəl"}'::jsonb, '{"ˈæpəl"}', '{"apple"}', NULL, 368)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_banana', 'image_label', 1, 'banana', 'muz', '{"id":"banana","imageEmoji":"🍌","imageAlt":"A banana","correctLabel":"banana","correctLabelTr":"muz","options":["banana","apple","lemon","peach"],"phonetic":"bəˈnɑːnə"}'::jsonb, '{"bəˈnɑːnə"}', '{"banana"}', NULL, 369)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_bread', 'image_label', 1, 'bread', 'ekmek', '{"id":"bread","imageEmoji":"🍞","imageAlt":"Bread","correctLabel":"bread","correctLabelTr":"ekmek","options":["bread","cake","rice","egg"],"phonetic":"brɛd"}'::jsonb, '{"brɛd"}', '{"bread"}', NULL, 370)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_milk', 'image_label', 1, 'milk', 'süt', '{"id":"milk","imageEmoji":"🥛","imageAlt":"A glass of milk","correctLabel":"milk","correctLabelTr":"süt","options":["milk","juice","water","tea"],"phonetic":"mɪlk"}'::jsonb, '{"mɪlk"}', '{"milk"}', NULL, 371)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('image_label_pizza', 'image_label', 1, 'pizza', 'pizza', '{"id":"pizza","imageEmoji":"🍕","imageAlt":"A pizza","correctLabel":"pizza","correctLabelTr":"pizza","options":["pizza","soup","salad","pasta"],"phonetic":"ˈpiːtsə"}'::jsonb, '{"ˈpiːtsə"}', '{"pizza"}', NULL, 372)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-hello', 'say_it', 1, 'hello', 'merhaba', '{"id":"say-hello","word":"hello","wordTr":"merhaba","phonetic":"hɛˈloʊ","hint":"Wave and say this when you meet someone","hintTr":"Birileriyle karşılaştığında söyle"}'::jsonb, '{"hɛˈloʊ"}', '{"hello"}', NULL, 373)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-goodbye', 'say_it', 1, 'goodbye', 'güle güle', '{"id":"say-goodbye","word":"goodbye","wordTr":"güle güle","phonetic":"ɡʊdˈbaɪ","hint":"Say this when you leave","hintTr":"Ayrılırken söyle"}'::jsonb, '{"ɡʊdˈbaɪ"}', '{"goodbye"}', NULL, 374)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-please', 'say_it', 1, 'please', 'lütfen', '{"id":"say-please","word":"please","wordTr":"lütfen","phonetic":"pliːz","hint":"Use this word when asking for something nicely","hintTr":"Kibarca bir şey isterken kullan"}'::jsonb, '{"pliːz"}', '{"please"}', NULL, 375)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-thankyou', 'say_it', 1, 'thank you', 'teşekkür ederim', '{"id":"say-thankyou","word":"thank you","wordTr":"teşekkür ederim","phonetic":"θæŋk juː","hint":"Say this when someone helps you","hintTr":"Biri sana yardım edince söyle"}'::jsonb, '{"θæŋk juː"}', '{"thank you"}', NULL, 376)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-one', 'say_it', 1, 'one', 'bir', '{"id":"say-one","word":"one","wordTr":"bir","phonetic":"wʌn","hint":"Hold up a single finger","hintTr":"Bir parmak kaldır"}'::jsonb, '{"wʌn"}', '{"one"}', NULL, 377)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-two', 'say_it', 1, 'two', 'iki', '{"id":"say-two","word":"two","wordTr":"iki","phonetic":"tuː","hint":"Hold up two fingers","hintTr":"İki parmak kaldır"}'::jsonb, '{"tuː"}', '{"two"}', NULL, 378)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-three', 'say_it', 1, 'three', 'üç', '{"id":"say-three","word":"three","wordTr":"üç","phonetic":"θriː","hint":"Rhymes with \"tree\"","hintTr":"\"tree\" ile kafiyeli"}'::jsonb, '{"θriː"}', '{"three"}', NULL, 379)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-four', 'say_it', 1, 'four', 'dört', '{"id":"say-four","word":"four","wordTr":"dört","phonetic":"fɔːr","hint":"Sounds like the number before five","hintTr":"Beşten bir önceki sayı"}'::jsonb, '{"fɔːr"}', '{"four"}', NULL, 380)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-five', 'say_it', 1, 'five', 'beş', '{"id":"say-five","word":"five","wordTr":"beş","phonetic":"faɪv","hint":"Count all the fingers on one hand","hintTr":"Bir elin tüm parmaklarını say"}'::jsonb, '{"faɪv"}', '{"five"}', NULL, 381)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-red', 'say_it', 1, 'red', 'kırmızı', '{"id":"say-red","word":"red","wordTr":"kırmızı","phonetic":"rɛd","hint":"The color of a fire truck","hintTr":"İtfaiye arabasının rengi"}'::jsonb, '{"rɛd"}', '{"red"}', NULL, 382)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-blue', 'say_it', 1, 'blue', 'mavi', '{"id":"say-blue","word":"blue","wordTr":"mavi","phonetic":"bluː","hint":"The color of the sky","hintTr":"Gökyüzünün rengi"}'::jsonb, '{"bluː"}', '{"blue"}', NULL, 383)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-green', 'say_it', 1, 'green', 'yeşil', '{"id":"say-green","word":"green","wordTr":"yeşil","phonetic":"ɡriːn","hint":"The color of grass","hintTr":"Çimenin rengi"}'::jsonb, '{"ɡriːn"}', '{"green"}', NULL, 384)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-cat', 'say_it', 1, 'cat', 'kedi', '{"id":"say-cat","word":"cat","wordTr":"kedi","phonetic":"kæt","hint":"Rhymes with \"bat\" — says meow","hintTr":"\"bat\" ile kafiyeli — miyav der"}'::jsonb, '{"kæt"}', '{"cat"}', NULL, 385)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-dog', 'say_it', 1, 'dog', 'köpek', '{"id":"say-dog","word":"dog","wordTr":"köpek","phonetic":"dɒɡ","hint":"Man''s best friend — says woof","hintTr":"İnsanın en iyi dostu — hav der"}'::jsonb, '{"dɒɡ"}', '{"dog"}', NULL, 386)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-bird', 'say_it', 1, 'bird', 'kuş', '{"id":"say-bird","word":"bird","wordTr":"kuş","phonetic":"bɜːrd","hint":"It has wings and can fly","hintTr":"Kanatları var ve uçabilir"}'::jsonb, '{"bɜːrd"}', '{"bird"}', NULL, 387)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-fish', 'say_it', 1, 'fish', 'balık', '{"id":"say-fish","word":"fish","wordTr":"balık","phonetic":"fɪʃ","hint":"Swims in water","hintTr":"Suda yüzer"}'::jsonb, '{"fɪʃ"}', '{"fish"}', NULL, 388)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-run', 'say_it', 1, 'run', 'koşmak', '{"id":"say-run","word":"run","wordTr":"koşmak","phonetic":"rʌn","hint":"Move your legs very fast","hintTr":"Bacaklarını çok hızlı hareket ettir"}'::jsonb, '{"rʌn"}', '{"run"}', NULL, 389)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-jump', 'say_it', 1, 'jump', 'zıplamak', '{"id":"say-jump","word":"jump","wordTr":"zıplamak","phonetic":"dʒʌmp","hint":"Push off the ground into the air","hintTr":"Yerden havaya fırla"}'::jsonb, '{"dʒʌmp"}', '{"jump"}', NULL, 390)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-sit', 'say_it', 1, 'sit', 'oturmak', '{"id":"say-sit","word":"sit","wordTr":"oturmak","phonetic":"sɪt","hint":"Put your bottom on a chair","hintTr":"Popo yere ya da sandalyeye koy"}'::jsonb, '{"sɪt"}', '{"sit"}', NULL, 391)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('say_it_say-stand', 'say_it', 1, 'stand', 'ayakta durmak', '{"id":"say-stand","word":"stand","wordTr":"ayakta durmak","phonetic":"stænd","hint":"Rise up on your two feet","hintTr":"İki ayağın üzerinde dur"}'::jsonb, '{"stænd"}', '{"stand"}', NULL, 392)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-at', 'word_family', 1, '-at', '-at ile biten kelimeler', '{"id":"wf-at","rime":"-at","rimeTr":"-at ile biten kelimeler","onsets":["c","b","h","r","s","m","f","p","j"],"validWords":["cat","bat","hat","rat","sat","mat","fat","pat"],"invalidOnsets":["j"],"example":"cat"}'::jsonb, '{}', '{"cat","bat","hat","rat","sat","mat","fat","pat"}', NULL, 393)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-og', 'word_family', 1, '-og', '-og ile biten kelimeler', '{"id":"wf-og","rime":"-og","rimeTr":"-og ile biten kelimeler","onsets":["d","l","f","b","h","j"],"validWords":["dog","log","fog","bog","hog","jog"],"invalidOnsets":[],"example":"dog"}'::jsonb, '{}', '{"dog","log","fog","bog","hog","jog"}', NULL, 394)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-in', 'word_family', 1, '-in', '-in ile biten kelimeler', '{"id":"wf-in","rime":"-in","rimeTr":"-in ile biten kelimeler","onsets":["p","t","w","b","f","s","z"],"validWords":["pin","tin","win","bin","fin"],"invalidOnsets":["z"],"example":"pin"}'::jsonb, '{}', '{"pin","tin","win","bin","fin"}', NULL, 395)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-an', 'word_family', 1, '-an', '-an ile biten kelimeler', '{"id":"wf-an","rime":"-an","rimeTr":"-an ile biten kelimeler","onsets":["c","f","m","p","r","t","v","j"],"validWords":["can","fan","man","pan","ran","tan","van"],"invalidOnsets":["j"],"example":"can"}'::jsonb, '{}', '{"can","fan","man","pan","ran","tan","van"}', NULL, 396)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-ot', 'word_family', 1, '-ot', '-ot ile biten kelimeler', '{"id":"wf-ot","rime":"-ot","rimeTr":"-ot ile biten kelimeler","onsets":["h","p","d","g","l","n","b"],"validWords":["hot","pot","dot","got","lot","not"],"invalidOnsets":["b"],"example":"hot"}'::jsonb, '{}', '{"hot","pot","dot","got","lot","not"}', NULL, 397)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-ig', 'word_family', 1, '-ig', '-ig ile biten kelimeler', '{"id":"wf-ig","rime":"-ig","rimeTr":"-ig ile biten kelimeler","onsets":["b","d","f","j","p","w","k"],"validWords":["big","dig","fig","jig","pig","wig"],"invalidOnsets":["k"],"example":"big"}'::jsonb, '{}', '{"big","dig","fig","jig","pig","wig"}', NULL, 398)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-op', 'word_family', 1, '-op', '-op ile biten kelimeler', '{"id":"wf-op","rime":"-op","rimeTr":"-op ile biten kelimeler","onsets":["h","m","p","t","c","b"],"validWords":["hop","mop","pop","top","cop","bop"],"invalidOnsets":[],"example":"hop"}'::jsonb, '{}', '{"hop","mop","pop","top","cop","bop"}', NULL, 399)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-ug', 'word_family', 1, '-ug', '-ug ile biten kelimeler', '{"id":"wf-ug","rime":"-ug","rimeTr":"-ug ile biten kelimeler","onsets":["b","h","j","m","r","t","f"],"validWords":["bug","hug","jug","mug","rug","tug"],"invalidOnsets":["f"],"example":"bug"}'::jsonb, '{}', '{"bug","hug","jug","mug","rug","tug"}', NULL, 400)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-ell', 'word_family', 1, '-ell', '-ell ile biten kelimeler', '{"id":"wf-ell","rime":"-ell","rimeTr":"-ell ile biten kelimeler","onsets":["b","f","s","t","w","y","j"],"validWords":["bell","fell","sell","tell","well","yell"],"invalidOnsets":["j"],"example":"bell"}'::jsonb, '{}', '{"bell","fell","sell","tell","well","yell"}', NULL, 401)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('word_family_wf-ack', 'word_family', 1, '-ack', '-ack ile biten kelimeler', '{"id":"wf-ack","rime":"-ack","rimeTr":"-ack ile biten kelimeler","onsets":["b","j","l","p","r","s","t","h","f"],"validWords":["back","jack","lack","pack","rack","sack","tack"],"invalidOnsets":["h","f"],"example":"back"}'::jsonb, '{}', '{"back","jack","lack","pack","rack","sack","tack"}', NULL, 402)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;

COMMIT;
