// ============================================================
// MinesMinis — Complete Phonics Curriculum (Stages 1-5)
// Jolly Phonics SSP + Turkish L1 interference addressed
// Designed by Opus 4.6 | Implemented by Sonnet 4.6
// ============================================================

import type { LearningUnit, LearningPhase, UnitActivity } from './curriculumPhases';

// Helper: shorthand for activity creation
function act(
  type: UnitActivity['type'],
  title: string,
  titleTr: string,
  description: string,
  xp: number,
  duration: number
): UnitActivity {
  return { type, title, titleTr, description, xp, duration };
}

// ============================================================
// STAGE 1: PRE-PHONICS (Ages 4-5 / Pre-K)
// 6 weeks | 12 lessons | Pure oral/aural training
// ============================================================

const stage1Units: LearningUnit[] = [
  // Unit 1.1: Hello English Sounds
  {
    id: 's1-u1',
    phaseId: 'pre-phonics',
    number: 1,
    title: 'Hello English Sounds',
    titleTr: 'İngilizce Seslerine Merhaba',
    phonicsFocus: [],
    vocabularyTheme: 'Language Awareness',
    tprCommands: ['Listen!', 'Clap!', 'Stand up!', 'Sit down!', 'Jump!'],
    targetSentences: ['Hello!', 'Bye!', 'Yes!', 'No!', 'cat', 'dog'],
    decodableText: 'Hello! Bye! Yes, a cat. No, a dog.',
    activities: [
      act('listening', "Mimi's English Ears", "Mimi'nin İngilizce Kulakları", 'Hear English vs Turkish — which is which? Mimi wiggles her ears for English!', 20, 4),
      act('sound-intro', 'Clap the Beats', 'Ritimleri Çırp', 'Clap along with syllables: ba-na-na (3), cat (1), ap-ple (2). Count the beats!', 20, 4),
      act('word-match', 'Rhyme Time with Mimi', "Mimi ile Kafiye Zamanı", 'Match rhyming picture pairs: cat+hat, dog+frog, sun+fun. Rhymes glow gold!', 25, 5),
    ],
  },
  // Unit 1.2: Letter Names & Beginning Sounds
  {
    id: 's1-u2',
    phaseId: 'pre-phonics',
    number: 2,
    title: 'Letter Names & Beginning Sounds',
    titleTr: 'Harf İsimleri ve Başlangıç Sesleri',
    phonicsFocus: [],
    vocabularyTheme: 'Alphabet Awareness',
    tprCommands: ['Point!', 'Touch!', 'Show me!', 'Which letter?', 'Find it!'],
    targetSentences: ['A is for apple.', 'B is for ball.', 'What starts with /k/?'],
    decodableText: 'A apple, B ball, C car, D dog, E egg.',
    activities: [
      act('sound-intro', 'Meet the Alphabet A-M', "Alfabeyle Tanış A-M", 'Letter names A through M with pictures. A-apple, B-ball, C-car... Each letter has a name!', 20, 4),
      act('sound-intro', 'Meet the Alphabet N-Z', "Alfabeyle Tanış N-Z", 'Letter names N through Z. N-nest, O-orange, P-penguin... Complete the alphabet!', 20, 4),
      act('listening', 'Beginning Sound Hunt', 'Başlangıç Sesi Avı', 'What sound does this start with? cat = /k/, sun = /s/. Listen and identify!', 20, 4),
      act('pronunciation', 'Letter Name vs Letter Sound', 'Harf Adı ve Harf Sesi', 'CRITICAL: Letter C says "see" but SOUNDS /k/. B says "bee" but SOUNDS /b/. Practice both!', 25, 5),
    ],
  },
  // Unit 1.3: Phonemic Awareness
  {
    id: 's1-u3',
    phaseId: 'pre-phonics',
    number: 3,
    title: 'Phonemic Awareness',
    titleTr: 'Fonemik Farkındalık',
    phonicsFocus: [],
    vocabularyTheme: 'Sound Manipulation',
    tprCommands: ['Blend it!', 'Say it slowly!', 'What sound?', 'Clap!', 'Snap!'],
    targetSentences: ['/k/-/ae/-/t/ = cat', 'Say each sound', 'Now blend!'],
    decodableText: 'Cat. /k/-/ae/-/t/ = cat! Dog. /d/-/o/-/g/ = dog!',
    activities: [
      act('sound-intro', 'Sound Boxes', 'Ses Kutuları', 'Push a counter into a box for each sound: cat = 3 sounds! Visual phoneme counting.', 20, 4),
      act('blending', 'Blend It!', 'Birleştir!', 'Mimi says sounds slowly: /k/... /ae/... /t/... What word? Oral blending, no letters yet!', 25, 5),
      act('segmenting', 'Say It Slowly', 'Yavaş Söyle', 'Stretch the word: "caaaat" = /k/ /ae/ /t/. Segmenting builds spelling readiness.', 25, 5),
    ],
  },
  // Unit 1.4: Pre-Phonics Review
  {
    id: 's1-u4',
    phaseId: 'pre-phonics',
    number: 4,
    title: 'Pre-Phonics Finale',
    titleTr: 'Ön Fonetik Finali',
    phonicsFocus: [],
    vocabularyTheme: 'Consolidation',
    tprCommands: ['Listen!', 'Repeat!', 'Clap!', 'Blend!', 'Great job!'],
    targetSentences: ['I can hear English!', 'I know letter names!', 'I can clap syllables!'],
    decodableText: 'I can clap! I can blend! I know sounds!',
    activities: [
      act('listening', 'Grand Review — Ears & Sounds', 'Büyük Tekrar — Kulaklar ve Sesler', 'Mix of all Pre-Phonics skills: syllables, rhymes, beginning sounds, letter names. 20 mixed questions!', 30, 6),
      act('pronunciation', 'Ready for Phonics!', 'Fonetime Hazırım!', 'Celebration! Mimi awards the "Ready for Phonics" badge. Recap all skills learned.', 25, 4),
    ],
  },
];

// ============================================================
// STAGE 2: SYNTHETIC PHONICS — INITIAL BLENDING (Ages 5-6)
// 14 weeks | 28 lessons | Jolly Phonics Groups 1-4
// ============================================================

const stage2Units: LearningUnit[] = [
  // Unit 2.1: Group 1 — s, a, t, i, p, n
  {
    id: 's2-u1',
    phaseId: 'initial-blending',
    number: 1,
    title: 'Group 1: Snake, Ant, Tennis, Mouse, Popcorn, Airplane',
    titleTr: 'Grup 1: Yılan, Karınca, Tenis, Fare, Patlamış Mısır, Uçak',
    phonicsFocus: ['g1_s', 'g1_a', 'g1_t', 'g1_i', 'g1_p', 'g1_n'],
    vocabularyTheme: 'First 6 Sounds — s, a, t, i, p, n',
    tprCommands: ['Sit!', 'Tap!', 'Snap!', 'Sip!', 'Pin it!', 'Nap!'],
    targetSentences: ['A sat ant.', 'It sat.', 'Tap it!', 'I sat.', 'Nip it!', 'Pin it!'],
    decodableText: 'Sat! A sat ant. Tap, tap. I nap. Tip: pin it! A tan ant sat.',
    activities: [
      act('sound-intro', 'Ssss — The Snake Sound /s/', 'Ssss — Yılan Sesi /s/', 'Snake slithers: ssssss! Tongue behind top teeth, push air. Turkish /s/ = same. Meet 5 s-words: sat, sip, sit, sap, set.', 25, 5),
      act('sound-intro', 'A-a-a — Ants on Arms /a/', 'A-a-a — Kollardaki Karıncalar /a/', 'Tickly ants: a-a-a! SHORT /æ/ — NOT Turkish long /a/. Jaw drops, mouth open wide: cat, sat, tap, nap, can.', 25, 5),
      act('sound-intro', 'T-t-t — Tennis Watch /t/', 'T-t-t — Tenis Seyret /t/', 'Watch tennis: t-t-t! Tongue touches behind top teeth then pops. Like Turkish /t/ but no aspiration: tip, tap, tan, tin.', 25, 5),
      act('sound-intro', 'I-i-i — Itchy Mouse /i/', 'I-i-i — Kaşınan Fare /i/', 'Itchy mouse: i-i-i! SHORT /ɪ/ — NOT Turkish /i/ (which is longer). Relaxed, jaw slightly down: sit, tin, pin, tip, nip.', 25, 5),
      act('sound-intro', 'P-p-p — Popcorn Pops /p/', 'P-p-p — Patlamış Mısır /p/', 'Popcorn pops: p-p-p! Lips together, puff of air. No voice. Compare: /p/ vs /b/ — /p/ is voiceless: pin, pan, pit, pet, pat.', 25, 5),
      act('sound-intro', 'Nnnn — Airplane Hum /n/', 'Nnnn — Uçak Vızıltısı /n/', 'Airplane humming: nnnnnn! Tongue tip up, voice on. Like Turkish /n/. Can hear vibration on nose: nap, nip, net, nut, nun.', 25, 5),
      act('blending', 'First Blends — sat, sit, tip, nip!', 'İlk Birleştirmeler — sat, sit, tip, nip!', 'With just 6 sounds you can read REAL words! PhonicsBlend: sat, sit, tip, nip, tan, tin, pan, pin, tap, nap. 10 words!', 30, 6),
      act('word-match', 'Match the Picture', 'Resmi Eşle', 'WordMatch: sat → picture of sitting cat. tin → tin can. pin → safety pin. 8 picture-word pairs.', 20, 4),
      act('segmenting', 'Spell It Out!', 'Harf Harf Söyle!', 'SpellingBee: Say the sounds for: sat, pit, nip, tan, sip, tip. Segment then write.', 25, 5),
      act('story', 'Group 1 Story — The Ant', 'Grup 1 Hikayesi — Karınca', 'A tan ant sat. It sat on a tin. Tap! The ant sat on Nat. Nat sat up. "Sit!" The ant sat. Tan ant sat in a pit. THE END. (All decodable with 6 sounds!)', 30, 6),
    ],
  },
  // Unit 2.2: Group 1 Review — Building First Words
  {
    id: 's2-u2',
    phaseId: 'initial-blending',
    number: 2,
    title: 'Group 1 Grand Review — 6 Sounds, Dozens of Words',
    titleTr: 'Grup 1 Büyük Tekrar — 6 Ses, Onlarca Kelime',
    phonicsFocus: ['g1_s', 'g1_a', 'g1_t', 'g1_i', 'g1_p', 'g1_n'],
    vocabularyTheme: 'CVC word mastery — 30+ words from 6 sounds',
    tprCommands: ['Blend!', 'Read it!', 'Spell it!', 'Tap the sounds!', 'What word?'],
    targetSentences: ['I can read "pin"!', 'Tap, tap, tan.', 'Sit, ant, sit!', 'Nat sat on a tan mat.'],
    decodableText: 'Nat sat. A tan ant sat on a tin. Tip it! Pin it! Nap, Nat, nap. Tan sat in a pit. A sip? Nip it, Nat! Sit, sit, sit!',
    activities: [
      act('blending', 'Race to Blend — 20 Words!', '20 Kelimeyi Birleştir — Yarış!', 'PhonicsBlend race mode: Build 20 CVC words in 4 minutes using s,a,t,i,p,n. Timer challenge — beat Mimi!', 35, 7),
      act('pronunciation', 'Read Aloud — Full Paragraph', 'Yüksek Sesle Oku — Tam Paragraf', 'Read the full decodable paragraph aloud. PronunciationGame evaluates fluency. First real reading milestone!', 30, 6),
      act('segmenting', 'Group 1 Badge — Spelling Test', 'Grup 1 Rozeti — Yazım Testi', 'SpellingBee dictation: 10 words from Group 1. Score 80%+ to earn the Group 1 Champion Badge! 35 XP bonus!', 35, 7),
    ],
  },
  // Unit 2.3: Group 2 — c/k, e, h + Turkish c vs k trap
  {
    id: 's2-u3',
    phaseId: 'initial-blending',
    number: 3,
    title: 'Group 2: Cat Clicks, Egg Crack, Happy Dog',
    titleTr: 'Grup 2: Kedi Kastanyet, Yumurta Çatlama, Mutlu Köpek',
    phonicsFocus: ['g2_ck', 'g2_e', 'g2_h'],
    vocabularyTheme: 'c/k, e, h — Critical Turkish /c/ vs English /k/ distinction',
    tprCommands: ['Click!', 'Peck!', 'Pant!', 'Hat on!', 'Get it!'],
    targetSentences: ['A cat sat in a cap.', 'The hen set an egg.', 'He hid in a hut.', 'Can the cat catch a hen?'],
    decodableText: 'A cat sat in a hat. A hen can peck in a pen. He hid in a hut. Can the cat catch the hen? The kid ran. Ha!',
    activities: [
      act('sound-intro', 'Cat Clicks — /k/ (c and k)', 'Kedi Kastanyet — /k/ (c ve k)', 'DIKKAT! Turkish "c" = /dʒ/ (cam). English "c" = /k/ (cat). TWO letters, ONE sound: c and k both say /k/! cat, cap, can, kit, kid, cup.', 25, 5),
      act('listening', 'Short /e/ — Egg Crack', 'Kısa /e/ — Yumurta Çatlama', 'Crack an egg: eh, eh! Compare /æ/ (cat) vs /e/ (get) — jaw position different. ListeningChallenge: /æ/ or /e/? cat/pet, mat/met, sat/set. 10 rounds.', 25, 5),
      act('sound-intro', "Happy Dog Pants — /h/", "Mutlu Köpek Pantlar — /h/", 'Dog panting: h, h, h! Just a breath out — very soft. hat, hid, him, his, hen, hut, hug. No friction, just air.', 25, 5),
      act('blending', 'Build with 9 Sounds!', '9 Sesle İnşa Et!', 'PhonicsBlend — Now using all 9 sounds: s,a,t,i,p,n,c/k,e,h. Build: cat, hen, hid, cap, hat, net, pet, ten, set, hem. 10 words!', 30, 6),
      act('segmenting', 'Spell: cat, hat, hen, pet', 'Yaz: cat, hat, hen, pet', 'SpellingBee: cat, hat, hen, net, pet, set, hid, him, hip. Focus on c vs k choice.', 25, 5),
      act('story', 'Group 2 Story — Cat, Hat, Hen', 'Grup 2 Hikayesi — Kedi, Şapka, Tavuk', 'The cat sat in a hat. A hen can peck in a pen. He hid in a hut. Can the cat catch the hen? The kid hid the hat. Ha! Tap, tap. A hen sat. The hen set an egg in a net. Get it, Nat! THE END.', 30, 6),
    ],
  },
  // Unit 2.4: Group 2 continued — r, m, d + English /r/ approximant drill
  {
    id: 's2-u4',
    phaseId: 'initial-blending',
    number: 4,
    title: 'Group 2: Lion Roar, Yummy Muffin, Beat the Drum',
    titleTr: 'Grup 2: Aslan Kükreme, Lezzetli Muffin, Davul Çal',
    phonicsFocus: ['g2_r', 'g2_m', 'g2_d'],
    vocabularyTheme: 'r, m, d — English /r/ approximant vs Turkish trill',
    tprCommands: ['Run!', 'March!', 'Drum!', 'Mad!', 'Mix it!'],
    targetSentences: ['A rat ran in a rag.', 'Mum met a man with a map.', 'Mum and Dad ran.', 'Dad had a red drum.'],
    decodableText: 'A red hen met a cat in a den. Dad had a drum. Rat-a-tat! Mum ran. The rat ran in a rag. Tap, tap. The kid hid in a dim den.',
    activities: [
      act('pronunciation', "Lion's Gentle Roar — /r/ CRITICAL", "Aslanın Hafif Kükreyişi — /r/ KRİTİK", "ÖNEMLI! English /r/ is NOT Turkish /r/! Turkish: tongue vibrates against ridge. English: tongue curls back, touches NOTHING. Floats! Practice: red, run, rat — tongue must NOT vibrate! PronunciationGame with AI compare.", 30, 7),
      act('sound-intro', 'Yummy Muffin — /m/', 'Lezzetli Muffin — /m/', 'Mmmmm, yummy! Close lips and hum: mmmmm. Same as Turkish /m/. Practice initial AND final /m/: man, map, mat → ram, him, sum. Both positions!', 25, 5),
      act('sound-intro', 'Beat the Drum — /d/', 'Davul Çal — /d/', 'Drum beats: d, d, d! Tongue behind top teeth, release with voice. WATCH OUT: d vs b confusion! "bed" mnemonic — b starts it, d ends it, bed shape!', 25, 5),
      act('blending', 'All 12 Sounds — Race Mode!', '12 Ses — Yarış Modu!', 'PhonicsBlend: Build 20 words in 4 minutes using all 12 sounds (s,a,t,i,p,n,c/k,e,h,r,m,d). Words: dad, red, hen, mat, pin, hid, dam, rug, men, kid, set, dim, ran, mud, rim, den, mad, nod, mid, rid.', 35, 7),
      act('segmenting', '12 Sounds Spelling Test', '12 Ses Yazım Testi', 'SpellingBee dictation: cat, red, hen, mat, pin, nap, hid, dam, rug, men, kid, set. Must score 80%+ for Group 2 Badge!', 35, 7),
      act('story', 'Group 2 Complete Story', 'Grup 2 Tamamlandı Hikayesi', 'A red hen met a cat in a den. The cat hid in a hat. Mum and Dad came. Dad had a drum. Rat-a-tat! The hen ran. The rat ran in a dim den. Can Mum get the cat? The hen can nap. Dad can drum. Rat-a-tat-tat! THE END. (12 Sounds Champion Badge!)', 35, 7),
    ],
  },
  // Unit 2.5: Group 3 — g, o, u — Short Vowel Showdown
  {
    id: 's2-u5',
    phaseId: 'initial-blending',
    number: 5,
    title: 'Group 3: Gulp, Octopus, Umbrella — Short Vowel Showdown',
    titleTr: 'Grup 3: Yutmak, Ahtapot, Şemsiye — Kısa Ünlü Şovdaun',
    phonicsFocus: ['g3_g', 'g3_o', 'g3_u'],
    vocabularyTheme: 'g, o, u — Short /ʌ/ the hardest English vowel for Turks',
    tprCommands: ['Gulp!', 'Gasp!', 'Go!', 'Open wide!', 'Umbrella up!'],
    targetSentences: ['A pig got in the mud.', 'A dog got on a log.', 'A bug is on a rug.', 'cat / cot / cut — 3 different words!'],
    decodableText: 'A big dog got on a bus. Sit! But the dog did not sit. It got up on a rug. A bug sat on a log in the fog. Get off! The bug did a flip and fell in the mud. Splat!',
    activities: [
      act('sound-intro', 'Gulp — /g/', 'Yutmak — /g/', 'Gulping water: g, g, g! Hard /g/ at back of throat. Not Turkish yumuşak /ğ/ — this is always hard. gap, gas, get, got, gum, dig, rig, tag, mug, peg. 10 words!', 25, 5),
      act('pronunciation', 'Surprised Octopus — SHORT /o/', "Şaşırmış Ahtapot — Kısa /o/", 'English short /o/ is DEEPER than Turkish /o/. Drop your jaw MORE. Round lips but chin down: hot, pot, dog, log, top, got, cot. PronunciationGame: record "hot, dog, pot" — compare to model.', 25, 6),
      act('pronunciation', 'Umbrella Up — SHORT /ʌ/ (HARDEST!)', 'Şemsiye Yukarı — Kısa /ʌ/ (EN ZOR!)', "BU SES TÜRKÇE'DE YOK! /ʌ/ in cup, cut, but, bus — NOT Turkish /a/ NOR /u/. Jaw medium open, tongue flat. THREE-WAY comparison: /æ/ wide (cat) vs /ʌ/ medium (cut) vs /o/ round (cot). DRILL: cat-cot-cut 5 times!", 30, 7),
      act('listening', 'Short Vowel Showdown — All 5!', 'Kısa Ünlü Şovdaun — Hepsi!', 'ListeningChallenge: Which vowel? /æ/, /e/, /ɪ/, /o/, /ʌ/? 20 rounds of CVC words — identify the middle vowel. cat/cot/cut, hat/hot/hut, bag/bog/bug. HARDEST exercise so far!', 35, 8),
      act('segmenting', 'Fill in the Vowel', 'Ünlüyü Doldur', 'SpellingBee: c_t + picture of cat = a. c_t + picture of scissors = u. c_t + picture of baby bed = o. Write the missing vowel for 10 words.', 30, 6),
      act('story', 'Group 3 Story — Big Dog on the Bus', 'Grup 3 Hikayesi — Otobüsteki Büyük Köpek', 'A big dog got on a bus. Sit! But the dog did not sit. It got up on a rug. A bug sat on a log in the fog. Get off! The bug did a flip and fell in the mud. Splat! (Vowel Master Badge — all 5 short vowels!)', 35, 7),
    ],
  },
  // Unit 2.6: Group 3 continued — l, f, b + b vs d distinction
  {
    id: 's2-u6',
    phaseId: 'initial-blending',
    number: 6,
    title: 'Group 3: Lollipop, Flat Tire, Ball Bounce',
    titleTr: 'Grup 3: Lolipop, Flat Lastik, Top Zıplaması',
    phonicsFocus: ['g3_l', 'g3_f', 'g3_b'],
    vocabularyTheme: 'l, f, b — b vs d mnemonic; light and dark /l/; 18 sounds complete!',
    tprCommands: ['Lick!', 'Blow!', 'Bounce!', 'Fly!', 'Flap!'],
    targetSentences: ['A lad lit a lamp.', 'A fan fell flat.', 'A big bug sat on a bed.', 'Bob bumped a bin. Bang!'],
    decodableText: 'A big dog got on a bus. Sit! But the dog did not sit. It got up on a rug. A bug sat on a log in the fog. Get off! The bug did a flip and fell in the mud. Splat! (All 18 Group 1-3 sounds!)',
    activities: [
      act('sound-intro', 'Lollipop Lick — /l/', 'Lolipop Yala — /l/', 'Lick the lollipop: llllll! Tongue tip touches ridge behind top teeth. LIGHT /l/ (initial: lip) vs DARK /l/ (final: bell). Turkish only has light /l/ — practice both: lap, lip, lid, lot, leg → pal, bell, doll, fill.', 25, 5),
      act('sound-intro', 'Flat Tire — /f/', 'Flat Lastik — /f/', 'Air from flat tire: fffff! Bite bottom lip gently, push air. Same as Turkish /f/. fan, fat, fig, fin, fit, fun, fog → also fl- blends: flap, flag (preview!).', 25, 5),
      act('sound-intro', 'Ball Bounce — /b/', 'Top Zıplaması — /b/', 'Ball bouncing: b, b, b! Lips pop open WITH voice. /b/ voiced vs /p/ voiceless — feel the difference! BED mnemonic: "bed" — b starts it, d ends it, middle is the mattress. NEVER confuse b and d again!', 25, 5),
      act('blending', 'First 18 Sounds — Grand Finale!', 'İlk 18 Ses — Büyük Final!', 'PhonicsBlend CHAMPIONSHIP: 25 words in 5 minutes using all 18 sounds (Groups 1-3). Build: big, bus, bed, lab, flu, flag, bell, fill, fog, fan, bit, bin, lap, leg, lid — race mode! Read full 8-sentence paragraph aloud!', 40, 8),
      act('segmenting', '"First 18 Sounds" Achievement Test', '"İlk 18 Ses" Başarı Testi', 'SpellingBee FINAL: 15 words from all 18 sounds. All 5 vowels represented: lap, red, tin, hot, sun, bun, fig, let, pig, nod, dam, rim, hex, jut, fob. Must score 75%+ for Achievement!', 40, 8),
      act('story', 'Groups 1-3 Complete — Epic Story!', 'Grup 1-3 Tamamlandı — Epik Hikaye!', 'A big dog got on a bus. Sit! But the dog did not sit. It got up on a rug. A bug sat on a log in the fog. Get off! The bug did a flip and fell in the mud. Splat! "First 18 Sounds Champion" Achievement Badge!', 40, 8),
    ],
  },
  // Unit 2.7: Group 4 — Long Vowels ai, j, oa, ie, ee, or
  {
    id: 's2-u7',
    phaseId: 'initial-blending',
    number: 7,
    title: 'Group 4: Rain, Jelly, Boat, Kite, Bee, Shore',
    titleTr: 'Grup 4: Yağmur, Jöle, Tekne, Uçurtma, Arı, Kıyı',
    phonicsFocus: ['g4_ai', 'g4_j', 'g4_oa', 'g4_ie', 'g4_ee', 'g4_or'],
    vocabularyTheme: 'Long vowels & diphthongs — Turkish has no diphthongs!',
    tprCommands: ['Sail!', 'Wobble!', 'Float!', 'Fly!', 'Buzz!', 'Row!'],
    targetSentences: ['It began to rain.', 'Jan had jam in a jug.', 'The goat got on a boat.', 'I can see three bees in a tree.'],
    decodableText: 'It rained on the goat. He got on a boat and sailed for the corn. Three bees sang a song. A pie sat on a fork. The sun set and the tree got dim.',
    activities: [
      act('listening', 'Rainy Day — /eɪ/ (ai)', 'Yağmurlu Gün — /eɪ/ (ai)', 'ai digraph = LONG vowel with TWO parts: /e/ then /ɪ/ — glide! Not Turkish "ey". ListeningChallenge: short vs long — cat vs rain, hat vs hail, pan vs pail. 10 rounds. PhonicsBlend: rain, tail, mail, sail, paid.', 25, 5),
      act('sound-intro', 'Wobbly Jelly — /dʒ/ (j)', 'Sallanır Jöle — /dʒ/ (j)', 'DIKKAT! English j = Turkish c (cam)! NOT Turkish j (/ʒ/). Jelly wobbles: j, j, j! jam, jet, jig, jog, jug, job, jab. Practice: "Say Turkish cam — that same sound is English j!"', 25, 5),
      act('sound-intro', 'Goat on a Boat — /oʊ/ (oa)', 'Teknedeki Keçi — /oʊ/ (oa)', 'oa digraph: TWO parts, /o/ glides to /ʊ/. Turkish has no diphthongs! Exaggerate the glide: "o... u... oa... boat!" Short vs long: got vs goat, cod vs coat, rod vs road. PhonicsBlend: goat, boat, coat, road, soap.', 25, 5),
      act('listening', 'Kite vs Bee — /aɪ/ (ie) vs /iː/ (ee)', 'Uçurtma vs Arı — /aɪ/ (ie) vs /iː/ (ee)', 'ie says /aɪ/: tie, pie, lie. ee says /iː/: see, bee, tree. CONTRAST: pie vs pea, tie vs tea, lie vs Lee. Diphthong vs pure vowel. ListeningChallenge: ie or ee? 10 rounds. PhonicsBlend 8 words.', 30, 6),
      act('pronunciation', 'Row to Shore — /ɔː/ (or)', 'Kıyıya Kürek — /ɔː/ (or)', 'or: round lips, gentle /r/ follows. corn, fork, born, sort, port. Say /o:/ then add soft /r/: or! SpellingBee: corn, fork, born, sort, port. 5 words.', 25, 5),
      act('blending', 'Group 4 Mastery — 24 Sounds!', 'Grup 4 Ustalığı — 24 Ses!', 'PhonicsBlend: 20 words mixing short AND long vowels. SpellingBee: 10 words — rain, goat, tree, pie, corn, cat, dog, fun, red, lip. Must score 75%+. Mimi paints a mural of ALL words learned!', 40, 8),
      act('story', 'Group 4 Story — Rain, Goat, Bees', 'Grup 4 Hikayesi — Yağmur, Keçi, Arılar', 'It rained on the goat. He got on a boat and sailed for the corn. Three bees sang a song. A pie sat on a fork. The sun set and the tree got dim. The goat rowed to shore. "I made it!" said the goat. Group 4 Badge! 24 Sounds Champion!', 40, 8),
    ],
  },
];

// ============================================================
// STAGE 3: DIGRAPHS, BLENDS & TRICKY SOUNDS (Ages 6-7)
// 12 weeks | 24 lessons | Jolly Phonics Groups 5-7
// ============================================================

const stage3Units: LearningUnit[] = [
  // Unit 3.1: ch, sh, th — The Digraph Revolution
  {
    id: 's3-u1',
    phaseId: 'digraph-blends',
    number: 1,
    title: 'Digraphs: Choo-Choo, Shh, Teeth',
    titleTr: 'Çift Harfler: Çuf-Çuf, Şşş, Dişler',
    phonicsFocus: ['g5_ch', 'g5_sh', 'g5_th_voiced', 'g5_th_unvoiced'],
    vocabularyTheme: 'ch, sh, th — /th/ is #1 Turkish interference target',
    tprCommands: ['Chop!', 'Shh!', 'Think!', 'Touch!', 'Three fingers!'],
    targetSentences: ['The ship has chips.', 'Think thin thoughts.', 'The thick thorn stings.', 'She shops for cheese.'],
    decodableText: 'The ship had chips and cheese. She said "Shh!" The thick thorn was on the path. Think about this: the moth and the teeth are thin. Three ships. THE END.',
    activities: [
      act('sound-intro', 'Choo-Choo Train — /tʃ/ (ch)', 'Çuf-Çuf Tren — /tʃ/ (ch)', 'Train chugging: ch, ch, ch! TWO letters, ONE new sound. Not /k/ + /h/! chin, chip, chop, chat, check, chess, chain, chair, bench, lunch, inch. 12 words!', 25, 5),
      act('sound-intro', "Shh! Baby's Sleeping — /ʃ/ (sh)", "Şşş! Bebek Uyuyor — /ʃ/ (sh)", 'Shh! Finger to lips: sh, sh! TWO letters. ship, shop, shed, shut, shell, wish, fish, dish, rush, bush, push. 11 words. WordMatch with pictures.', 25, 5),
      act('pronunciation', '/θ/ — The Hardest Sound for Turkish Speakers!', '/θ/ — Türk Konuşanlar İçin En Zor Ses!', 'DIKKAT! Turkish has NO /th/ sound! Children say /t/ instead — "tank" for "thank". Tongue TIP between teeth, push air (unvoiced th): thin, thick, think, three, thumb, bath, teeth, moth. MIRROR practice — see the tongue! PronunciationGame mandatory.', 30, 7),
      act('pronunciation', '/ð/ — Voiced TH (the, this, that)', '/ð/ — Sesli TH (the, this, that)', 'Voiced /ð/ = tongue between teeth + voice ON: the, this, that, them, then, there, with, smooth. Compare: /θ/ thin (no voice) vs /ð/ the (voice on). Minimal pairs: think/this, thin/then, teeth/teethe.', 30, 6),
      act('blending', 'Digraph Blending — ch, sh, th Mixed', 'Çift Harf Birleştirme — ch, sh, th Karışık', 'PhonicsBlend: shop, ship, chin, chip, thin, this, that, then, bench, fish, dish, wish, three, thumb, path. 15 words mixing all 3 digraphs.', 35, 7),
      act('story', 'Digraph Story — The Ship, The Shop, The Think', 'Çift Harf Hikayesi — Gemi, Dükkan, Düşünce', 'The ship had chips and cheese. She said "Shh!" The thick thorn was on the path. Think about this: the moth and the teeth are thin. Three ships. THE END. (ch/sh/th mastery!)', 35, 7),
    ],
  },
  // Unit 3.2: w, v, qu, x — The /w/ vs /v/ Battle
  {
    id: 's3-u2',
    phaseId: 'digraph-blends',
    number: 2,
    title: 'Tricky Letters: Wind, Van, Queen, Fox',
    titleTr: 'Zor Harfler: Rüzgar, Van, Kraliçe, Tilki',
    phonicsFocus: ['g5_w', 'g5_v', 'g5_qu', 'g5_x'],
    vocabularyTheme: 'w, v, qu, x — /w/ vs /v/ critical for Turkish speakers',
    tprCommands: ['Wave!', 'Vroom!', 'Quack!', 'X marks it!', 'Wobble!'],
    targetSentences: ['The wind blows west.', 'A van is NOT a wan.', 'The queen is quick.', 'A fox in a box.'],
    decodableText: 'The wind blew west. A van with a vet went to the queen. Quick! Six foxes in a box. The queen waved. THE END.',
    activities: [
      act('pronunciation', 'Wind Blows — /w/ NOT /v/!', 'Rüzgar Eser — /w/ DEĞİL /v/!', 'CRITICAL for Turkish: "west" ≠ "vest"! Turkish /v/ = teeth on lip friction. English /w/ = just lips rounded, NO teeth contact. Practice: west/vest, wet/vet, wail/veil, word/verb. PronunciationGame records and compares. Mandatory drill!', 30, 7),
      act('sound-intro', 'Van Vrooms — /v/', 'Van Vızıldar — /v/', 'Van engine: vvvvv! UPPER TEETH touch LOWER LIP, then vibrate. Same as Turkish /v/. van, vet, vim, vat, vest, visit, invite, vivid. Also: words ending in /v/ — have, live, give (silent e!).', 25, 5),
      act('sound-intro', 'Queen is Quick — /kw/ (qu)', 'Kraliçe Çabuk — /kw/ (qu)', 'qu = /kw/ together. NEVER just /k/! queen, quick, quiz, quit, quite, quack, quest. Mimi wears a crown. Rule: q is ALWAYS followed by u in English.', 20, 4),
      act('sound-intro', 'Fox in a Box — /ks/ (x)', 'Kutudaki Tilki — /ks/ (x)', 'x = /ks/ at end: fox, box, mix, fix, wax, max, six, ax. Sometimes /gz/ in middle: exam, exact. PhonicsBlend with 8 x-words. WordMatch: fox→fox picture.', 20, 4),
      act('blending', 'w, v, qu, x — Mix and Match!', 'w, v, qu, x — Karıştır ve Eşle!', 'PhonicsBlend: wind, vet, queen, fox, west, van, quiz, box, wave, vat, quit, six. 12 words. CRITICAL: identify /w/ words vs /v/ words — 8-round discrimination exercise.', 30, 6),
      act('story', 'Tricky Letters Story', 'Zor Harfler Hikayesi', 'The wind blew west. A van with a vet went to the queen. Quick! Six foxes in a box. The queen waved. "What a visit!" The fox did a quick spin. THE END. (/w/ vs /v/ champion!)', 30, 6),
    ],
  },
  // Unit 3.3: Initial Consonant Blends — st, sp, sn, bl, cl, fl, gl
  {
    id: 's3-u3',
    phaseId: 'digraph-blends',
    number: 3,
    title: 'Initial Blends: Stop, Spill, Snow, Blue, Clap, Flag, Glad',
    titleTr: 'Başlangıç Kümeleri: Dur, Dök, Kar, Mavi, Çırp, Bayrak, Sevinç',
    phonicsFocus: ['blend_st', 'blend_sp', 'blend_sn', 'blend_bl', 'blend_cl', 'blend_fl', 'blend_gl'],
    vocabularyTheme: 'CCVC words — Turkish prefers open syllables, blends are hard',
    tprCommands: ['Stop!', 'Spin!', 'Snap!', 'Blow!', 'Clap!', 'Fly!', 'Glow!'],
    targetSentences: ['Stop! Spin! Snap!', 'A blue flag blows.', 'Snow falls on cliffs.', 'A glad frog in a glass.'],
    decodableText: 'A blue flag blew in the wind. Stop! A frog can spin. It flipped and fell flat. Clap! The snow snapped the branch. A glad frog in a glass. Spot it now! THE END.',
    activities: [
      act('sound-intro', 's-Blends: st, sp, sn', 's Kümeleri: st, sp, sn', 'Turkish reflex: add a vowel before consonant cluster ("estop" for "stop"). FIGHT this! Keep consonants together: STOP (not S-TOP), SPIN, SNAP. stop, step, stem, spin, spot, snap, snip, snag. Segmenting practice: s-t-o-p = 4 sounds!', 25, 5),
      act('sound-intro', 'l-Blends: bl, cl, fl, gl', 'l Kümeleri: bl, cl, fl, gl', 'blue, black, blend, clap, clip, clan, flag, flip, flat, glad, glob, glow. 12 CCVC words! Tongue must form /l/ position immediately after /b/, /k/, /f/, /g/. PhonicsBlend timed race.', 25, 5),
      act('blending', 'CCVC Blending Challenge', 'CCVC Birleştirme Meydan Okuma', 'PhonicsBlend: 20 CCVC words in 4 minutes: stop, spin, snap, blue, clap, flag, glad, step, spot, snag, black, clip, flip, glob, stem, skip, snip, flat, clan, glow. First time children read 4-sound words!', 35, 7),
      act('segmenting', 'Segment CCVC Words', 'CCVC Kelimeleri Parçala', 'SpellingBee: flag = f-l-a-g (4 sounds!), stop = s-t-o-p, spin = s-p-i-n, snap = s-n-a-p, clap = c-l-a-p. Write 10 CCVC words from dictation.', 30, 6),
      act('story', 'Initial Blends Story — The Frog Flag', 'Başlangıç Küme Hikayesi — Kurbağa Bayrağı', 'A blue flag blew in the wind. Stop! A frog can spin. It flipped and fell flat. Clap! The snow snapped the branch. A glad frog in a glass. Spot it now! THE END. (CCVC Master Badge!)', 30, 6),
    ],
  },
  // Unit 3.4: r-Blends — br, cr, dr, fr, gr, pr, tr
  {
    id: 's3-u4',
    phaseId: 'digraph-blends',
    number: 4,
    title: 'r-Blends: Bread, Crab, Drum, Frog, Grass, Prize, Tree',
    titleTr: 'r Kümeleri: Ekmek, Yengeç, Davul, Kurbağa, Çim, Ödül, Ağaç',
    phonicsFocus: ['blend_br', 'blend_cr', 'blend_dr', 'blend_fr', 'blend_gr', 'blend_pr', 'blend_tr'],
    vocabularyTheme: 'r-Blends — /r/ approximant now in cluster position',
    tprCommands: ['Break!', 'Crawl!', 'Drip!', 'Frog jump!', 'Grow!', 'Prize!', 'Trot!'],
    targetSentences: ['A crab in a trap.', 'The frog grabs a drip.', 'A brown tree with green grass.', 'The prince brings a prize.'],
    decodableText: 'A brown frog sat on a green branch. It grabbed a cricket. Drip! Rain dropped. The prince trotted on a trim trail. A crab crept from the creek. "Grab it!" Splat! THE END.',
    activities: [
      act('pronunciation', 'r-Blends — English /r/ in clusters!', 'r Kümeleri — Küme içinde İngilizce /r/!', 'The English /r/ approximant must be maintained even in blends! br-: bread, brick, brag. cr-: crab, cram, crest. dr-: drum, drip, drag. fr-: frog, from, fret. gr-: grass, grip, grin. pr-: press, price, prim. tr-: tree, trim, trip. PronunciationGame all 7!', 35, 7),
      act('blending', 'r-Blend Speed Round', 'r Kümesi Hız Turu', 'PhonicsBlend: 21 words (3 per blend): bread/brick/brag, crab/cram/crest, drum/drip/drag, frog/from/fret, grass/grip/grin, press/price/prim, tree/trim/trip. Fastest reader wins!', 35, 7),
      act('segmenting', 'r-Blend Spelling Test', 'r Kümesi Yazım Testi', 'SpellingBee: frog, crab, drum, tree, grass, press, bread, drip, grip, trim. 10 words — all r-blends. Must segment: f-r-o-g = 4 sounds!', 30, 6),
      act('story', 'r-Blend Story — The Brown Frog', 'r Kümesi Hikayesi — Kahverengi Kurbağa', 'A brown frog sat on a green branch. It grabbed a cricket. Drip! Rain dropped. The prince trotted on a trim trail. A crab crept from the creek. "Grab it!" Splat! r-Blends Master Badge!', 30, 6),
    ],
  },
  // Unit 3.5: Final Blends — -nd, -nt, -st, -lk, -lf, -mp
  {
    id: 's3-u5',
    phaseId: 'digraph-blends',
    number: 5,
    title: 'Final Blends: Hand, Hunt, Best, Milk, Wolf, Jump',
    titleTr: 'Son Kümeleri: El, Av, En İyi, Süt, Kurt, Zıpla',
    phonicsFocus: ['blend_nd', 'blend_nt', 'blend_st', 'blend_lk', 'blend_lf', 'blend_mp'],
    vocabularyTheme: 'CVCC words — Turkish open-syllable reflex fights final consonant clusters',
    tprCommands: ['Hand!', 'Hunt!', 'Best!', 'Hulk!', 'Jump!', 'Stamp!'],
    targetSentences: ['Sand and land.', 'A wolf hunts best.', 'Jump! Stomp! Stamp!', 'The camp is on a hill.'],
    decodableText: 'The wolf hunts best at dusk. It ran on sand and soft land. Jump! The wolf can stamp and stomp. The wolf left the camp at dusk. THE END.',
    activities: [
      act('sound-intro', 'Final Blends Part 1: -nd, -nt, -st', 'Son Küme Bölüm 1: -nd, -nt, -st', '-nd: hand, band, land, sand, bend, find, bond, fund. -nt: ant, hint, hunt, mint, rent, tent, font, punt. -st: best, fast, list, most, rust, nest, mist, gust. Turkish reflex: dropping final consonant! "han" for "hand" — FIGHT IT! Full final cluster!', 25, 5),
      act('sound-intro', 'Final Blends Part 2: -lk, -lf, -mp', 'Son Küme Bölüm 2: -lk, -lf, -mp', '-lk: milk, silk, bulk, hulk, folk, sulk. -lf: wolf, self, golf, shelf, half, elf. -mp: jump, bump, camp, damp, hemp, lamp, limp, pump, ramp, stomp. Silent /l/ in -lk/-lf important!', 25, 5),
      act('blending', 'CVCC Reading Challenge', 'CVCC Okuma Meydan Okuma', 'PhonicsBlend: 20 CVCC words in 4 minutes: hand, hunt, best, milk, wolf, jump, land, rent, fast, silk, self, camp, sand, mint, list, bulk, elf, bump, rust, lamp. Full final clusters!', 35, 7),
      act('segmenting', 'CVCC Spelling — Hear Every Sound!', 'CVCC Yazım — Her Sesi Duy!', 'SpellingBee: jump = j-u-m-p (4 sounds!), hand = h-a-n-d, milk = m-i-l-k, wolf = w-o-l-f, best = b-e-s-t, camp = c-a-m-p, land = l-a-n-d, hunt = h-u-n-t, rent = r-e-n-t, silk = s-i-l-k. 10 CVCC words!', 30, 6),
      act('story', 'Final Blends Story — The Wolf Hunts', 'Son Küme Hikayesi — Kurt Avlanır', 'The wolf hunts best at dusk. It ran on sand and soft land. Jump! The wolf can stamp and stomp. The wolf left the camp at dusk. CVCC Master Badge!', 30, 6),
    ],
  },
  // Unit 3.6: 20 Sight Words — High-Frequency Non-Decodable Words
  {
    id: 's3-u6',
    phaseId: 'digraph-blends',
    number: 6,
    title: '20 Sight Words — Words We Just Know!',
    titleTr: '20 Yüksek Frekanslı Kelime — Sadece Bildiğimiz Kelimeler!',
    phonicsFocus: [],
    vocabularyTheme: 'Dolch sight words — the, is, was, said, have, go, do, come, some, from, were, there, their, what, when, where, who, why, which, how',
    tprCommands: ['Flash!', 'Read!', 'Quick!', 'Again!', 'Remember!'],
    targetSentences: ['The cat is there.', 'What was she said?', 'Come from there.', 'Who is there when we go?'],
    decodableText: 'The cat was there. "Come!" said the dog. "What is that?" "I do not know." Some said yes. Some said no. "Where do we go?" "How do we get there?" THE END.',
    activities: [
      act('word-match', 'Sight Words Batch 1: the, is, was, said, have, go', 'Yüksek Frekans Kelime 1: the, is, was, said, have, go', 'WordMatch: Flash card recognition — the, is, was, said, have, go. These break phonics rules! Just memorize by sight. Mimi shows each word 3 times with sentences.', 25, 5),
      act('word-match', 'Sight Words Batch 2: do, come, some, from, were, there', 'Yüksek Frekans Kelime 2: do, come, some, from, were, there', 'WordMatch: do, come, some, from, were, there. Note: "some" /sʌm/ not /soʊm/! "come" /kʌm/ not /koʊm/! "from" /frɒm/ not /froʊm/! Turkish learner traps in sight words.', 25, 5),
      act('word-match', 'Sight Words Batch 3: their, what, when, where, who, why, which, how', 'Yüksek Frekans Kelime 3: their, what, when, where, who, why, which, how', "Wh-words + their. WordMatch: 8 question words + possessive their/there/they're distinction. QuickQuiz: use in sentences.", 25, 5),
      act('reading', 'Sight Words in Sentences', 'Cümle İçinde Yüksek Frekans Kelimeler', 'Read connected text with ALL 20 sight words embedded. SpellingBee: Write all 20 from dictation. Must score 80%+ for "Sight Word Champion" badge.', 35, 7),
      act('story', 'Sight Words Story — Full Connected Text', 'Yüksek Frekans Kelime Hikayesi — Tam Bağlı Metin', 'The cat was there. "Come!" said the dog. "What is that?" "I do not know." Some said yes. Some said no. "Where do we go?" "How do we get there?" The wolf came from the hill. "Who is there?" Sight Word Champion Badge!', 35, 7),
    ],
  },
];

// ============================================================
// STAGE 4: FLUENCY & VOCABULARY (Ages 7-8)
// 16 weeks | 32 lessons
// ============================================================

const stage4Units: LearningUnit[] = [
  {
    id: 's4-u1',
    phaseId: 'fluency-vocab',
    number: 1,
    title: 'Vowel Teams: igh, ue, aw, ew, oy, ou',
    titleTr: 'Ünlü Takımları: igh, ue, aw, ew, oy, ou',
    phonicsFocus: ['vt_igh', 'vt_ue', 'vt_aw', 'vt_ew', 'vt_oy', 'vt_ou'],
    vocabularyTheme: 'Advanced vowel patterns — 200+ decodable words',
    tprCommands: ['High!', 'Blue!', 'Crawl!', 'New!', 'Joy!', 'Out!'],
    targetSentences: ['Night light shines bright.', 'The new blue glue.', 'The boy saw a crowd.', 'Owl howls loud.'],
    decodableText: 'The night was bright with moonlight. A blue hue spread. The boy saw the owl on the bough. "How!" it hooted. Dew fell on new shoots. Joy! THE END.',
    activities: [
      act('sound-intro', 'igh = /aɪ/: night, light, right, flight, might, sight, bright', 'igh = /aɪ/: gece, ışık, sağ, uçuş, güç, görüş, parlak', 'igh digraph: THREE letters, ONE sound /aɪ/. night, light, right, flight, might, sight, bright, knight, tight, slight. PhonicsBlend 10 words.', 25, 5),
      act('sound-intro', 'ue/ew = /uː/: blue, glue, new, few, dew, stew', 'ue/ew = /uː/: mavi, yapıştırıcı, yeni, az, çiğ, güveç', 'Two spellings for /uː/: ue (blue, glue, true, clue) and ew (new, few, dew, stew, drew, flew). ListeningChallenge: ue or ew? 8 rounds.', 25, 5),
      act('sound-intro', 'aw/ou/oy = /ɔː/, /aʊ/, /ɔɪ/: claw, cloud, boy', 'aw/ou/oy = /ɔː/, /aʊ/, /ɔɪ/: pençe, bulut, oğlan', 'Three new sounds: aw (claw, saw, draw, straw, yawn), ou (cloud, out, house, loud, found, sound), oy (boy, joy, toy, enjoy, royal). PhonicsBlend all three.', 30, 6),
      act('blending', 'Vowel Team Speed Round', 'Ünlü Takımı Hız Turu', 'PhonicsBlend: 24 words — 4 per vowel team. igh/ue/ew/aw/ou/oy. Mixed recognition. Must read 20/24 correctly for Vowel Team badge.', 35, 7),
      act('story', 'Vowel Teams Story — The Night Owl', 'Ünlü Takımı Hikayesi — Gece Baykuşu', 'The night was bright with moonlight. A blue hue spread. The boy saw the owl on the bough. "How!" it hooted. Dew fell on new shoots. Joy! Vowel Teams Champion!', 30, 6),
    ],
  },
  {
    id: 's4-u2',
    phaseId: 'fluency-vocab',
    number: 2,
    title: 'Silent Letters: kn, wr, gn, mb',
    titleTr: 'Sessiz Harfler: kn, wr, gn, mb',
    phonicsFocus: ['sl_kn', 'sl_wr', 'sl_gn', 'sl_mb'],
    vocabularyTheme: 'Silent letter patterns — English spelling history',
    tprCommands: ['Knock!', 'Write!', 'Gnaw!', 'Climb!', 'Shh — silent!'],
    targetSentences: ['Know the knight knocks.', 'Write with the wrong wrist.', 'The lamb can climb.', 'Gnaw the knot!'],
    decodableText: 'The knight knew the gnome wrote a wrong word. "Knock!" said the knave. The lamb climbed the limb. The gnat gnawed the knot. THE END.',
    activities: [
      act('sound-intro', 'kn = /n/: know, knight, knit, knock, kneel, knob', 'kn = /n/: bilmek, şövalye, örmek, vurmak, diz çökmek, topuz', 'The k is SILENT! Historically both were said. know = /noʊ/, knight = /naɪt/, knock = /nɒk/. WordMatch: 8 kn-words.', 20, 4),
      act('sound-intro', 'wr = /r/: write, wrong, wrist, wrap, wreck, wren', 'wr = /r/: yazmak, yanlış, bilek, sarmak, batırmak, çalıkuşu', 'The w is SILENT! write = /raɪt/, wrong = /rɒŋ/, wrist = /rɪst/. Note: wr-words are mostly "r" verbs! PhonicsBlend 6 words.', 20, 4),
      act('sound-intro', 'gn = /n/ and mb = /m/: gnome, lamb, climb', 'gn = /n/ ve mb = /m/: cüce, kuzu, tırmanmak', 'gn: gnome, gnat, gnaw, gnu, sign, align. mb: lamb, climb, comb, crumb, thumb, limb, numb, plumb. Both silent! SpellingBee: 10 silent letter words.', 25, 5),
      act('blending', 'Silent Letters Reading Challenge', 'Sessiz Harfler Okuma Meydan Okuma', 'QuickQuiz: 20 questions — read words with silent letters. know, write, gnome, lamb, knight, wrist, gnat, climb, knock, wrong, kneel, wrap, sign, thumb, knob, wreck, numb, align, comb, gnu.', 30, 6),
      act('story', 'Silent Letters Story — The Knight and the Gnome', 'Sessiz Harfler Hikayesi — Şövalye ve Cüce', 'The knight knew the gnome wrote a wrong word. "Knock!" said the knave. The lamb climbed the limb. The gnat gnawed the knot. Silent Letters Champion!', 25, 5),
    ],
  },
  {
    id: 's4-u3',
    phaseId: 'fluency-vocab',
    number: 3,
    title: 'Prefixes & Suffixes: un-, re-, -ing, -ed, -er',
    titleTr: 'Ön Ekler ve Son Ekler: un-, re-, -ing, -ed, -er',
    phonicsFocus: ['morph_un', 'morph_re', 'morph_ing', 'morph_ed', 'morph_er'],
    vocabularyTheme: 'Morphology — word building expands vocabulary exponentially',
    tprCommands: ['Undo!', 'Redo!', 'Running!', 'Jumped!', 'Faster!'],
    targetSentences: ['Undo the unhappy mess.', 'Replay and restart.', 'She is running and jumping.', 'He jumped and landed.'],
    decodableText: 'She was unhappy and unlucky. She decided to replay the game. She restarted and tried again. She jumped and landed. She is running and smiling. She is happier! THE END.',
    activities: [
      act('sound-intro', 'Prefixes: un- and re-', 'Ön Ekler: un- ve re-', 'un- = NOT: unhappy, unlucky, undo, unpack, unsafe, untie, unwell, unkind. re- = AGAIN: replay, restart, redo, reread, refill, retell, rewind, reuse. Doubles vocabulary instantly!', 25, 5),
      act('sound-intro', 'Suffixes: -ing, -ed, -er', 'Son Ekler: -ing, -ed, -er', '-ing = ongoing: running, jumping, playing, smiling, reading. Doubling rule: run→running! -ed = past: jumped, landed, played, looked, wanted. -er = one who / more: runner, player, taller, faster. Spelling rules matter!', 25, 5),
      act('blending', 'Word Building Workshop', 'Kelime İnşaat Atölyesi', 'SentenceScramble: Build 15 words with prefixes/suffixes from root words. run→runner/running, play→playing/played/player, happy→unhappy/happier, read→reading/reader/reread.', 30, 6),
      act('reading', 'Morphology Reading Text', 'Morfoloji Okuma Metni', 'Read connected text with 20+ words using prefixes/suffixes. Identify roots and affixes while reading. Comprehension questions.', 30, 6),
      act('story', 'Morphology Story — She Retried!', 'Morfoloji Hikayesi — Yeniden Denedi!', 'She was unhappy and unlucky. She decided to replay the game. She restarted and tried again. She jumped and landed. She is running and smiling. She is happier! Morphology Master!', 25, 5),
    ],
  },
  {
    id: 's4-u4',
    phaseId: 'fluency-vocab',
    number: 4,
    title: '200-Word Core Vocabulary — Dolch Word List',
    titleTr: '200 Kelimelik Temel Kelime Hazinesi — Dolch Listesi',
    phonicsFocus: [],
    vocabularyTheme: 'Dolch sight word list — covers 80% of written English',
    tprCommands: ['Flash!', 'Read!', 'Sentence!', 'Quick!', 'Next!'],
    targetSentences: ['I can read any book now.', 'She went to the store.', 'They were very happy.', 'We could have gone there.'],
    decodableText: 'She went to the store. They were very happy to see her. She could have some cake. "Would you like one?" she asked. "Yes!" they all said. THE END.',
    activities: [
      act('word-match', 'Dolch Pre-Primer + Primer (100 words)', 'Dolch Ön-İlk + İlk (100 kelime)', 'WordMatch flash cards: first 100 Dolch words — a, and, away, big, blue, can, come, down, find, for, funny, go, help, here, I, in, is, it, jump, little, look, make, me, my, not, one, play, red, run, said, see, the, three, to, two, up, we, where, who, you...', 35, 8),
      act('word-match', 'Dolch Grade 1-3 (100 words)', 'Dolch 1-3 Sınıf (100 kelime)', 'WordMatch flash cards: after, again, an, any, as, ask, by, could, every, fly, from, give, going, had, has, him, his, how, just, know, let, live, may, old, once, open, over, put, round, some, stop, take, thank, them, then, think, walk, were, when...', 35, 8),
      act('reading', 'Fluency Reading — Connected Text', 'Akıcılık Okuma — Bağlı Metin', 'Read a 100-word paragraph with 80%+ Dolch words. Measure words-per-minute. Target: 40-60 wpm at this stage. PronunciationGame evaluates fluency.', 35, 7),
      act('story', 'Dolch Story — The Big Adventure', 'Dolch Hikayesi — Büyük Macera', 'She went to the store. They were very happy to see her. She could have some cake. "Would you like one?" she asked. "Yes!" they all said. Dolch Master — 200 Words Champion!', 30, 6),
    ],
  },
  {
    id: 's4-u5',
    phaseId: 'fluency-vocab',
    number: 5,
    title: 'Reading Fluency — Speed, Expression, Comprehension',
    titleTr: 'Okuma Akıcılığı — Hız, İfade, Anlayış',
    phonicsFocus: [],
    vocabularyTheme: 'Fluency = automaticity + prosody + comprehension',
    tprCommands: ['Slow down.', 'Speed up!', 'Expression!', 'Pause here...', 'Whisper!'],
    targetSentences: ['Read with feeling!', 'Speed: 60 words per minute.', 'Pause at commas and periods.', 'Make your voice go UP for questions?'],
    decodableText: 'Once upon a time, there was a brave little mouse. She wanted to see the world. "But you are too small!" said the cat. "I am small," she said, "but I am fast!" And she ran off to see the world. THE END.',
    activities: [
      act('reading', 'Fluency Practice — Expression', 'Akıcılık Pratiği — İfade', 'Read aloud with EXPRESSION: make voice go up for questions, pause at commas, whisper for quiet parts, shout for excitement. PronunciationGame measures prosody. 3 practice texts.', 30, 6),
      act('reading', 'Comprehension Questions', 'Anlayış Soruları', 'Read a story, answer 5 comprehension questions. Who? What? Where? When? Why? First reading comprehension assessment!', 30, 6),
      act('story', 'Fluency Showcase — Read to Mimi!', "Akıcılık Gösterisi — Mimi'ye Oku!", 'Read the full story aloud to Mimi. Mimi claps for expression, gives stars for accuracy. Fluency Champion Badge!', 35, 7),
    ],
  },
  {
    id: 's4-u6',
    phaseId: 'fluency-vocab',
    number: 6,
    title: 'Schwa Vowel + Unstressed Syllables',
    titleTr: 'Schwa Ünlüsü + Vurgusuz Heceler',
    phonicsFocus: ['schwa'],
    vocabularyTheme: 'Schwa /ə/ — most common English vowel, invisible in spelling',
    tprCommands: ['Stress it!', 'Relax!', 'Uh...', 'LIGHT!', 'Heavy!'],
    targetSentences: ['a-BOUT (not AH-bout)', 'a-GO (not AH-go)', 'the (always schwa)', 'SOfa, CANcel, leVEL'],
    decodableText: 'About a garden. The animal is a natural wonder. A camel and a parrot. The level of the canal is total. THE END.',
    activities: [
      act('sound-intro', 'The Schwa — /ə/ the Invisible Vowel', 'Schwa — /ə/ Görünmez Ünlü', 'The most common English sound! EVERY unstressed vowel can become /ə/. "about" = /ə-BAƱT/, not /æ-BAƱT/. "the" = /ðə/ before consonants. sofa, camera, banana (last -a). Turkish has no schwa — every vowel is FULL. Practice listening and relaxing unstressed syllables.', 25, 6),
      act('listening', 'Hear the Schwa in Words', "Kelimelerde Schwa'yı Duy", 'ListeningChallenge: Where is the schwa in these words? about, garden, animal, natural, camel, parrot, level, canal, total, cancel. Mark the unstressed syllable.', 25, 5),
      act('pronunciation', 'Schwa in Natural Speech', 'Doğal Konuşmada Schwa', 'PronunciationGame: Say sentences with natural schwas. "about a garden" — unstressed "a" and "a" are schwas. Record and compare to native speaker. Marks improvement over time.', 30, 6),
      act('story', 'Schwa Story — About the Garden', 'Schwa Hikayesi — Bahçe Hakkında', 'About a garden. The animal is a natural wonder. A camel and a parrot. The level of the canal is total. Schwa Master — natural English rhythm achieved!', 25, 5),
    ],
  },
];

// ============================================================
// STAGE 5: GRAMMAR & EXPRESSION (Ages 8+)
// 20 weeks | 20 lessons
// ============================================================

const stage5Units: LearningUnit[] = [
  {
    id: 's5-u1',
    phaseId: 'grammar-expression',
    number: 1,
    title: 'Articles: a, an, the — The Hardest Thing for Turkish Speakers',
    titleTr: 'Artikeller: a, an, the — Türk Konuşanlar İçin En Zor Şey',
    phonicsFocus: [],
    vocabularyTheme: 'Articles — Turkish has NO articles. Must be explicitly taught.',
    tprCommands: ['A cat!', 'An apple!', 'THE cat!', 'Which one?', 'Specific!'],
    targetSentences: ['A cat is in the garden.', 'An elephant eats an apple.', 'THE cat — the one we know!', 'I saw a dog. The dog barked.'],
    decodableText: 'I saw a cat. The cat was orange. A dog chased the cat. An elephant watched. The animals ran. The cat won! THE END.',
    activities: [
      act('sound-intro', 'a vs an — Before Consonant vs Vowel Sound', 'a ve an — Ünsüz ve Ünlü Sesi Öncesi', 'RULE: a + consonant sound (a cat, a big elephant). an + vowel SOUND (an apple, an hour — h is silent!). Turkish has NEITHER — every use is new! QuickQuiz: a or an? 20 items.', 30, 6),
      act('sound-intro', 'the — Specific vs General', 'the — Özel ve Genel', '"a cat" = any cat. "THE cat" = this specific cat, we both know which one. First use: a. Second use: the. Natural conversation pattern. SentenceScramble: arrange articles correctly in 10 sentences.', 30, 6),
      act('blending', 'Article Marathon — 20 Sentences', 'Artikel Maratonu — 20 Cümle', 'SentenceScramble + QuickQuiz: 20 sentences, insert the correct article. Mixed a/an/the/no article contexts. Must score 80%+.', 35, 7),
      act('pronunciation', 'Articles in Natural Speech', 'Doğal Konuşmada Artikeller', '/ə/ for "a", /ðə/ for "the" before consonants, /ðɪ/ for "the" before vowels. PronunciationGame: Read 10 sentences with correct article pronunciation.', 25, 5),
      act('story', 'Article Story — The Orange Cat', 'Artikel Hikayesi — Turuncu Kedi', 'I saw a cat. The cat was orange. A dog chased the cat. An elephant watched. The animals ran. The cat won! Article Master — "the" most important word in English!', 30, 6),
    ],
  },
  {
    id: 's5-u2',
    phaseId: 'grammar-expression',
    number: 2,
    title: 'Word Order: SVO vs SOV — English vs Turkish Brain',
    titleTr: 'Kelime Sırası: SVO vs SOV — İngilizce ve Türkçe Beyin',
    phonicsFocus: [],
    vocabularyTheme: 'English is SVO. Turkish is SOV. Restructure the grammar brain!',
    tprCommands: ['Subject first!', 'Verb second!', 'Object last!', 'FLIP it!', 'English order!'],
    targetSentences: ['The cat eats fish. (S-V-O)', 'She loves apples. (S-V-O)', 'NOT: The cat fish eats.', 'They play football every day.'],
    decodableText: 'The cat eats fish. She loves apples. They play football. The dog chases the ball. I see the bird. The bird sees me. THE END.',
    activities: [
      act('sound-intro', 'SVO — Subject-Verb-Object', 'SVO — Özne-Fiil-Nesne', 'Turkish: Kedi balık yiyor (Cat fish eats = SOV). English: The cat eats fish (SVO — verb in the MIDDLE!). This is the #1 Turkish grammar error in English. SUBJECT does the action. VERB is the action. OBJECT receives action. Diagrams + color coding.', 30, 6),
      act('blending', 'SVO Sentence Builder', 'SVO Cümle Kurucusu', 'SentenceScramble: Arrange words into correct SVO order. 15 scrambled sentences. Turkish interference drills: "Fish the cat eats" → correct to "The cat eats fish".', 35, 7),
      act('segmenting', 'Error Correction — Fix Turkish Word Order', 'Hata Düzeltme — Türkçe Kelime Sırasını Düzelt', 'QuickQuiz: Is this correct English? "She apple loves" (NO), "I the book read" (NO). Identify and correct 12 SOV-order errors.', 30, 6),
      act('story', 'SVO Story — The Cat Chases', 'SVO Hikayesi — Kedi Kovalıyor', 'The cat eats fish. She loves apples. They play football. The dog chases the ball. I see the bird. The bird sees me. SVO Master — English word order locked in!', 25, 5),
    ],
  },
  {
    id: 's5-u3',
    phaseId: 'grammar-expression',
    number: 3,
    title: 'Simple Present + Present Continuous',
    titleTr: 'Geniş Zaman ve Şimdiki Zaman',
    phonicsFocus: [],
    vocabularyTheme: 'Tense system — Turkish verb system works very differently',
    tprCommands: ['I run! (always)', 'I am running! (now)', 'She runs!', 'They are running!', 'Every day vs right now!'],
    targetSentences: ['I play football every day.', 'She is playing football now.', 'He runs to school.', 'They are eating lunch.'],
    decodableText: 'Every day, she runs to school. Right now, she is running. The cat eats fish every day. Look! The cat is eating fish now. THE END.',
    activities: [
      act('sound-intro', 'Simple Present — Habits & Facts', 'Geniş Zaman — Alışkanlıklar ve Gerçekler', 'I play / She plays (add -s for he/she/it!). Use for: every day, always, usually, often, never, sometimes. Turkish "geniş zaman" = closest match. Rule: 3rd person -s! play→plays, run→runs, eat→eats, go→goes, watch→watches.', 30, 6),
      act('sound-intro', 'Present Continuous — Right Now!', 'Şimdiki Zaman — Şu An!', 'am/is/are + verb-ing. I am running, she is playing, they are eating. Use for: now, at this moment, look!, currently. Compare: "She runs" (always) vs "She is running" (right now!). Drop final e before -ing: come→coming!', 30, 6),
      act('blending', 'Tense Discrimination', 'Zaman Ayrımı', 'QuickQuiz: Simple Present or Present Continuous? "She eats an apple every day" vs "She is eating an apple right now." 20 discrimination questions.', 35, 7),
      act('story', 'Tense Story — Every Day vs Right Now', 'Zaman Hikayesi — Her Gün ve Şu An', 'Every day, she runs to school. Right now, she is running. The cat eats fish every day. Look! The cat is eating fish now. Tense Master!', 25, 5),
    ],
  },
  {
    id: 's5-u4',
    phaseId: 'grammar-expression',
    number: 4,
    title: 'Past Tense — Regular & Irregular',
    titleTr: 'Geçmiş Zaman — Düzenli ve Düzensiz',
    phonicsFocus: [],
    vocabularyTheme: 'Past tense — -ed endings and 50 common irregular verbs',
    tprCommands: ['Yesterday!', 'I walked.', 'She ran.', 'They went.', 'We had fun.'],
    targetSentences: ['I walked to school yesterday.', 'She ran to the park.', 'They went to the zoo.', 'We had a great day!'],
    decodableText: 'Yesterday, she walked to the park. She saw a bird. The bird sang a song. She sat on a bench and listened. Then she ran home. She had a great day! THE END.',
    activities: [
      act('sound-intro', 'Regular Past: add -ed', 'Düzenli Geçmiş: -ed ekle', 'walked, jumped, played, listened, watched, smiled, stopped, clapped. THREE pronunciations of -ed: /t/ (walked), /d/ (played), /ɪd/ (wanted). Spelling rules: double consonant before -ed for short vowel words (stop→stopped).', 30, 6),
      act('sound-intro', '50 Common Irregular Verbs', '50 Yaygın Düzensiz Fiil', 'go→went, come→came, see→saw, eat→ate, run→ran, have→had, say→said, get→got, make→made, know→knew, think→thought, take→took, give→gave, find→found, feel→felt... WordMatch flashcards: 50 irregular pairs.', 35, 7),
      act('blending', 'Past Tense Story Building', 'Geçmiş Zaman Hikaye Kurma', 'SentenceScramble + story completion. Build 10 past-tense sentences. Mix regular and irregular. "Yesterday, she __ to school (walk). She __ a bird (see). The bird __ (sing)."', 30, 6),
      act('story', 'Past Tense Story — Great Day', 'Geçmiş Zaman Hikayesi — Harika Gün', 'Yesterday, she walked to the park. She saw a bird. The bird sang a song. She sat on a bench and listened. Then she ran home. She had a great day! Past Tense Master!', 25, 5),
    ],
  },
  {
    id: 's5-u5',
    phaseId: 'grammar-expression',
    number: 5,
    title: 'Questions — Do/Does/Did + Wh- Words',
    titleTr: 'Sorular — Do/Does/Did ve Wh- Kelimeleri',
    phonicsFocus: [],
    vocabularyTheme: 'Question formation — Turkish uses intonation + mi/mı, English inverts',
    tprCommands: ['Do you...?', 'Does she...?', 'Did they...?', 'What?', 'Where? When? Why?'],
    targetSentences: ['Do you like cats?', 'Does she play tennis?', 'Did they go to school?', 'What did you eat? Where did she go?'],
    decodableText: 'Do you like cats? Yes, I do! Does she play tennis? No, she does not. Did they go to school? What did they do? Where did they go? Why? THE END.',
    activities: [
      act('sound-intro', 'Yes/No Questions with Do/Does/Did', 'Evet/Hayır Soruları: Do/Does/Did', "INVERSION! Turkish: \"Kedi sever misin?\" (Cat love do-you?). English: \"Do you like cats?\" Auxiliary verb FIRST. Do (I/you/we/they) / Does (he/she/it) / Did (past all). Negative: don't, doesn't, didn't.", 30, 6),
      act('sound-intro', 'Wh- Questions — What, Where, When, Who, Why, How', 'Wh- Soruları — Ne, Nerede, Ne Zaman, Kim, Neden, Nasıl', 'Wh-word + auxiliary + subject + verb. "Where does she live?" "What did they eat?" "Why do you like cats?" 6 question words with practice sentences. QuickQuiz: match question to answer.', 30, 6),
      act('blending', 'Question Formation Workshop', 'Soru Kurma Atölyesi', 'SentenceScramble: Arrange 15 scrambled questions. Transform statements to questions: "She likes cats" → "Does she like cats?" "They went to school" → "Did they go to school?" 10 transformations.', 35, 7),
      act('story', 'Question Story — The Great Interview', 'Soru Hikayesi — Büyük Röportaj', 'Do you like cats? Yes, I do! Does she play tennis? No, she does not. Did they go to school? What did they do? Where did they go? Why? Question Master!', 25, 5),
    ],
  },
  {
    id: 's5-u6',
    phaseId: 'grammar-expression',
    number: 6,
    title: 'Comparatives & Superlatives — Big, Bigger, Biggest',
    titleTr: 'Karşılaştırma ve Üstünlük — Büyük, Daha Büyük, En Büyük',
    phonicsFocus: [],
    vocabularyTheme: 'Adjective comparison — -er/-est for short, more/most for long adjectives',
    tprCommands: ['Bigger!', 'The biggest!', 'More beautiful!', 'The most!', 'Compare!'],
    targetSentences: ['A cat is small. A dog is smaller. A mouse is the smallest.', 'She is tall, taller, the tallest!', 'The sky is more beautiful than the sea.'],
    decodableText: 'The cat is small. The dog is bigger. The elephant is the biggest of all. The moon is more beautiful at night. But the stars are the most beautiful. THE END.',
    activities: [
      act('sound-intro', 'Short Adjectives: -er and -est', 'Kısa Sıfatlar: -er ve -est', 'big→bigger→biggest, small→smaller→smallest, tall→taller→tallest, fast→faster→fastest, cold→colder→coldest. SPELLING: double final consonant for CVC: big→bigger! Change y to i: happy→happier→happiest. 10 adjectives drilled.', 30, 6),
      act('sound-intro', 'Long Adjectives: more and most', 'Uzun Sıfatlar: more ve most', 'beautiful→more beautiful→most beautiful, interesting→more interesting→most interesting, comfortable→more comfortable→most comfortable. RULE: 2+ syllable adjectives use more/most. EXCEPTIONS: -er/-est for 2-syllable -y adjectives (happy, funny, easy).', 25, 5),
      act('blending', 'Comparison Tournament', 'Karşılaştırma Turnuvası', 'QuickQuiz: 20 comparative/superlative questions. Form the correct version: big→? (bigger/biggest). beautiful→? (more/most). Write 10 comparison sentences. Mimi judges the tournament!', 35, 7),
      act('story', 'Comparison Story — The Biggest Adventure', 'Karşılaştırma Hikayesi — En Büyük Macera', 'The cat is small. The dog is bigger. The elephant is the biggest of all. The moon is more beautiful at night. But the stars are the most beautiful. Comparatives Master!', 25, 5),
    ],
  },
  {
    id: 's5-u7',
    phaseId: 'grammar-expression',
    number: 7,
    title: 'Story Writing & Free Expression — You Are a Writer!',
    titleTr: 'Hikaye Yazımı ve Özgür İfade — Sen Bir Yazarsın!',
    phonicsFocus: [],
    vocabularyTheme: 'Creative writing — integrate all skills learned',
    tprCommands: ['Once upon a time...', 'The end!', 'Your idea!', 'Characters!', 'Problem!'],
    targetSentences: ['Once upon a time...', 'First... then... finally...', 'The character felt... because...', 'They lived happily ever after.'],
    decodableText: 'Once upon a time, there was a brave mouse. She wanted to see the world. First, she crossed the river. Then, she climbed the mountain. Finally, she reached the sea. She felt happy because she was brave. The end.',
    activities: [
      act('story', 'Story Structure — Beginning, Middle, End', 'Hikaye Yapısı — Başlangıç, Orta, Son', 'StoryChoices: analyze a model story. Identify: setting, character, problem, solution. Beginning (who? where?) → Middle (problem!) → End (solution!). Visual story map with Mimi.', 30, 6),
      act('reading', 'Write Your Own Story — 5 Sentences', 'Kendi Hikayeni Yaz — 5 Cümle', 'Story writing template: Once upon a time [character] wanted [goal]. But [problem]. First [action]. Then [action]. Finally [solution]. Write your own using ALL learned grammar: articles, SVO, present/past, comparatives!', 35, 7),
      act('pronunciation', 'Share Your Story with Mimi!', 'Hikayeni Mimi ile Paylaş!', 'PronunciationGame + StoryChoices: Read your story aloud to Mimi. Mimi reacts emotionally to your story! Evaluate expression, fluency, and pronunciation. Earn the "Young Author" badge.', 40, 8),
      act('story', 'Graduation — MinesMinis Complete!', 'Mezuniyet — MinesMinis Tamamlandı!', 'Full curriculum celebration! Mimi hosts a graduation ceremony. Student receives "English Champion" badge. Summary of ALL achievements: phonics sounds mastered, words learned, stories read and written. Confetti, fireworks, Mimi dances! THE END.', 50, 10),
    ],
  },
];

// ============================================================
// PHASE EXPORTS — All 5 Stages as LearningPhase objects
// ============================================================

export const PHONICS_CURRICULUM_PHASES: LearningPhase[] = [
  {
    id: 'pre-phonics' as LearningPhase['id'],
    number: 0 as LearningPhase['number'],
    name: 'Pre-Phonics',
    nameTr: 'Ön Fonetik',
    ageRange: '4-5',
    description: 'Build the ear before the eye. Pure oral/aural training for Turkish children new to English.',
    descriptionTr: 'Gözden önce kulağı geliştirin. Türk çocuklar için saf dinleme ve konuşma eğitimi.',
    icon: '👂',
    color: '#FF9F43',
    phonicsGroups: [],
    montessoriLevel: 'Oral Language Foundation',
    skills: [
      'Distinguish English from Turkish speech',
      'Identify syllables (clapping)',
      'Recognize rhyming words',
      'Identify 26 letter names',
      'Isolate beginning sounds',
      'Blend and segment orally',
    ],
    units: stage1Units,
  },
  {
    id: 'little-ears' as LearningPhase['id'],
    number: 1,
    name: 'Initial Blending — Groups 1-4',
    nameTr: 'İlk Birleştirme — Gruplar 1-4',
    ageRange: '5-6',
    description: 'Jolly Phonics Groups 1-4. From first 6 sounds to long vowels and diphthongs. 100+ decodable words!',
    descriptionTr: "Jolly Phonics Grup 1-4. İlk 6 sesten uzun ünlü ve diftong'a. 100+ okunabilir kelime!",
    icon: '🌱',
    color: '#FF6B35',
    phonicsGroups: [1, 2, 3, 4],
    montessoriLevel: 'Language (Pink Series)',
    skills: [
      'All 24 sounds from Groups 1-4',
      'CVC word decoding (100+ words)',
      'Short and long vowel distinction',
      'Turkish /r/ vs English /r/ approximant',
      'All 5 short vowels with Turkish traps',
      'Diphthongs: ai, oa, ie, ee, or',
    ],
    units: stage2Units,
  },
  {
    id: 'word-builders' as LearningPhase['id'],
    number: 2,
    name: 'Digraphs, Blends & Tricky Sounds',
    nameTr: 'Çift Harfler, Kümeler ve Zor Sesler',
    ageRange: '6-7',
    description: 'Jolly Phonics Groups 5-7. All 42 sounds! Digraphs ch/sh/th, consonant blends, /w/ vs /v/, and 20 sight words.',
    descriptionTr: 'Jolly Phonics Grup 5-7. 42 sesin tamamı! ch/sh/th çift harfleri, ünsüz kümeleri, /w/ ile /v/ farkı ve 20 yüksek frekanslı kelime.',
    icon: '🔤',
    color: '#4ECDC4',
    phonicsGroups: [5, 6, 7],
    montessoriLevel: 'Language (Blue Series)',
    skills: [
      'All 42 Jolly Phonics sounds mastered',
      'ch, sh, th (voiced + unvoiced)',
      '/w/ distinct from /v/ (critical Turkish trap)',
      'CCVC and CVCC word decoding',
      'Consonant blend clusters',
      '20 high-frequency sight words',
    ],
    units: stage3Units,
  },
  {
    id: 'story-makers' as LearningPhase['id'],
    number: 3,
    name: 'Fluency & Vocabulary',
    nameTr: 'Akıcılık ve Kelime Hazinesi',
    ageRange: '7-8',
    description: 'Advanced vowel patterns, silent letters, morphology, 200-word Dolch list, and reading fluency.',
    descriptionTr: 'İleri ünlü kalıpları, sessiz harfler, morfoloji, 200 kelimelik Dolch listesi ve okuma akıcılığı.',
    icon: '📖',
    color: '#45B7D1',
    phonicsGroups: [1, 2, 3, 4, 5, 6, 7],
    montessoriLevel: 'Language (Green Series)',
    skills: [
      'Advanced vowel teams: igh, ue, aw, ew, oy, ou',
      'Silent letters: kn, wr, gn, mb',
      'Prefixes and suffixes',
      '200-word Dolch sight word list',
      '60+ words per minute reading fluency',
      'Schwa vowel and natural English rhythm',
    ],
    units: stage4Units,
  },
  {
    id: 'young-explorers' as LearningPhase['id'],
    number: 4,
    name: 'Grammar & Free Expression',
    nameTr: 'Dilbilgisi ve Özgür İfade',
    ageRange: '8+',
    description: 'Articles, SVO word order, tenses, questions, comparatives, and story writing. You are a Young Author!',
    descriptionTr: 'Artikeller, SVO kelime sırası, zamanlar, sorular, karşılaştırmalar ve hikaye yazımı. Sen genç bir yazarsın!',
    icon: '✍️',
    color: '#9B59B6',
    phonicsGroups: [1, 2, 3, 4, 5, 6, 7],
    montessoriLevel: 'Language (Advanced Reading & Writing)',
    skills: [
      'Articles: a, an, the (absent in Turkish)',
      'SVO word order (Turkish is SOV)',
      'Simple present and present continuous',
      'Regular and irregular past tense',
      'Question formation with do/does/did and Wh-',
      'Comparatives and superlatives',
      'Creative story writing',
    ],
    units: stage5Units,
  },
];

// Convenience export: flat list of all units
export const ALL_CURRICULUM_UNITS: LearningUnit[] = PHONICS_CURRICULUM_PHASES.flatMap(p => p.units);

// Get unit by id
export function getCurriculumUnitById(id: string): LearningUnit | undefined {
  return ALL_CURRICULUM_UNITS.find(u => u.id === id);
}

// Get phase for a unit
export function getPhaseForUnit(unitId: string): LearningPhase | undefined {
  return PHONICS_CURRICULUM_PHASES.find(p => p.units.some(u => u.id === unitId));
}

// Get next unit in sequence
export function getNextUnit(unitId: string): LearningUnit | undefined {
  const idx = ALL_CURRICULUM_UNITS.findIndex(u => u.id === unitId);
  return idx >= 0 && idx < ALL_CURRICULUM_UNITS.length - 1 ? ALL_CURRICULUM_UNITS[idx + 1] : undefined;
}

// Total lesson count across all stages
export const TOTAL_LESSON_COUNT = ALL_CURRICULUM_UNITS.reduce((sum, u) => sum + u.activities.length, 0);
