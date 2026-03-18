// ============================================================
// MinesMinis Curriculum Phases
// 4 Montessori-inspired learning phases for Turkish children
// learning English through phonics
// ============================================================

// --- TYPES ---

export interface UnitActivity {
  type: 'sound-intro' | 'blending' | 'segmenting' | 'word-match' | 'listening' | 'pronunciation' | 'tpr' | 'reading' | 'spelling' | 'story';
  title: string;
  titleTr: string;
  description: string;
  xp: number;
  duration: number;
}

export interface LearningUnit {
  id: string;
  phaseId: string;
  number: number;
  title: string;
  titleTr: string;
  phonicsFocus: string[];
  vocabularyTheme: string;
  tprCommands: string[];
  targetSentences: string[];
  decodableText: string;
  activities: UnitActivity[];
}

export interface LearningPhase {
  id: 'little-ears' | 'word-builders' | 'story-makers' | 'young-explorers';
  number: 1 | 2 | 3 | 4;
  name: string;
  nameTr: string;
  ageRange: string;
  description: string;
  descriptionTr: string;
  icon: string;
  color: string;
  phonicsGroups: number[];
  montessoriLevel: string;
  skills: string[];
  units: LearningUnit[];
}

// --- PHASE 1: LITTLE EARS (Groups 1-3) ---

const phase1Units: LearningUnit[] = [
  // Unit 1: s, a, t
  {
    id: 'p1-u1',
    phaseId: 'little-ears',
    number: 1,
    title: 'Snake, Ant & Tennis',
    titleTr: 'Yilan, Karinca ve Tenis',
    phonicsFocus: ['g1_s', 'g1_a', 'g1_t'],
    vocabularyTheme: 'Animals & Actions',
    tprCommands: ['Sit!', 'Tap!', 'Stand!', 'Snap!', 'Clap!'],
    targetSentences: ['I sat.', 'Tap it!', 'A sat ant.'],
    decodableText: 'Sat! A sat ant. Tap, tap, tap!',
    activities: [
      { type: 'sound-intro', title: 'Meet the Snake', titleTr: 'Yilanla Tanis', description: 'Learn the /s/ sound with the slithering snake action.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Ants on Arms', titleTr: 'Kollardaki Karincalar', description: 'Learn the /a/ sound with the tickly ants action.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Tennis Time', titleTr: 'Tenis Zamani', description: 'Learn the /t/ sound by watching tennis.', xp: 10, duration: 3 },
      { type: 'listening', title: 'Which Sound?', titleTr: 'Hangi Ses?', description: 'Listen and pick the right sound: s, a, or t.', xp: 15, duration: 4 },
      { type: 'tpr', title: 'Move & Sound', titleTr: 'Hareket Et ve Seslen', description: 'Do the action and say the sound together.', xp: 15, duration: 4 },
      { type: 'blending', title: 'First Blends', titleTr: 'Ilk Karistirmalar', description: 'Blend s-a-t to make "sat". Your first word!', xp: 20, duration: 5 },
      { type: 'word-match', title: 'Match the Picture', titleTr: 'Resmi Esle', description: 'Match pictures to words: sat, at, a.', xp: 15, duration: 3 },
    ],
  },
  // Unit 2: i, p, n
  {
    id: 'p1-u2',
    phaseId: 'little-ears',
    number: 2,
    title: 'Mouse, Candles & Airplane',
    titleTr: 'Fare, Mumlar ve Ucak',
    phonicsFocus: ['g1_i', 'g1_p', 'g1_n'],
    vocabularyTheme: 'Things Around Us',
    tprCommands: ['Nap!', 'Spin!', 'Pin it!', 'Nip!', 'Sip!'],
    targetSentences: ['I can nap.', 'Pin it!', 'Sip it!', 'Tip tap!'],
    decodableText: 'Nat can nap. A pin is in a pan. Nip, nip! Sip a sip. Tip tap, tip tap!',
    activities: [
      { type: 'sound-intro', title: 'Mouse Squeaks', titleTr: 'Fare Ciyakliyor', description: 'Learn the /i/ sound like a little mouse.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Birthday Puffs', titleTr: 'Dogum Gunu Uflemeleri', description: 'Learn the /p/ sound by blowing candles.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Airplane Flies', titleTr: 'Ucak Ucuyor', description: 'Learn the /n/ sound like an airplane.', xp: 10, duration: 3 },
      { type: 'listening', title: 'Sound Safari', titleTr: 'Ses Safarisi', description: 'Identify all 6 Group 1 sounds in a listening game.', xp: 20, duration: 5 },
      { type: 'blending', title: 'Blend It Up', titleTr: 'Karistir', description: 'Blend new words: pin, nap, tin, nip, sip, pan.', xp: 20, duration: 5 },
      { type: 'segmenting', title: 'Break It Apart', titleTr: 'Parcalara Ayir', description: 'Hear a word and break it into sounds: p-i-n.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Read & Tap', titleTr: 'Oku ve Tiklat', description: 'Read simple words by tapping each sound.', xp: 25, duration: 5 },
      { type: 'tpr', title: 'Act It Out', titleTr: 'Canlandir', description: 'Follow commands using Group 1 words: Sit! Nap! Sip!', xp: 15, duration: 4 },
    ],
  },
  // Unit 3: c/k, e, h
  {
    id: 'p1-u3',
    phaseId: 'little-ears',
    number: 3,
    title: 'Cat, Egg & Dog',
    titleTr: 'Kedi, Yumurta ve Kopek',
    phonicsFocus: ['g2_ck', 'g2_e', 'g2_h'],
    vocabularyTheme: 'Pets & Food',
    tprCommands: ['Hug!', 'Kick!', 'Hop!', 'Catch!', 'Hide!'],
    targetSentences: ['The cat sat.', 'A hen can peck.', 'He hit it.'],
    decodableText: 'A cat sat in a hat. The hen can peck. He hid in a hut. Can the cat catch the hen?',
    activities: [
      { type: 'sound-intro', title: 'Click Like a Cat', titleTr: 'Kedi Gibi Tikla', description: 'Learn the /k/ sound with castanets.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Egg Crack', titleTr: 'Yumurta Kirma', description: 'Learn the /e/ sound by cracking eggs.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Happy Dog Pants', titleTr: 'Mutlu Kopek Soluyur', description: 'Learn the /h/ sound by panting.', xp: 10, duration: 3 },
      { type: 'pronunciation', title: 'k vs c', titleTr: 'k ve c Farki', description: 'Both c and k make the same sound in English. Practice!', xp: 15, duration: 4 },
      { type: 'blending', title: 'Pet Words', titleTr: 'Evcil Hayvan Kelimeleri', description: 'Blend: cat, hat, hen, pet, kit, hut.', xp: 20, duration: 5 },
      { type: 'word-match', title: 'Food Match', titleTr: 'Yiyecek Eslestirme', description: 'Match food pictures to words.', xp: 15, duration: 3 },
      { type: 'reading', title: 'Sentence Time', titleTr: 'Cumle Zamani', description: 'Read your first short sentences!', xp: 25, duration: 5 },
    ],
  },
  // Unit 4: r, m, d
  {
    id: 'p1-u4',
    phaseId: 'little-ears',
    number: 4,
    title: 'Lion, Muffin & Drum',
    titleTr: 'Aslan, Muffin ve Davul',
    phonicsFocus: ['g2_r', 'g2_m', 'g2_d'],
    vocabularyTheme: 'Family & Home',
    tprCommands: ['Run!', 'March!', 'Drum!', 'Dance!', 'Dig!'],
    targetSentences: ['Mum and Dad ran.', 'The red drum.', 'Run, run, run!'],
    decodableText: 'Mum ran and Dad ran. The kid hid in a den. "Come here!" said Mum. Dad had a red drum. Rat-a-tat! He met a man in a dim hut.',
    activities: [
      { type: 'sound-intro', title: 'Lion Roars', titleTr: 'Aslan Kukreyor', description: 'Learn the /r/ sound. Remember: English r is different from Turkish!', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Yummy Muffin', titleTr: 'Lezzetli Muffin', description: 'Learn the /m/ sound while rubbing your tummy.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Beat the Drum', titleTr: 'Davulu Cal', description: 'Learn the /d/ sound by drumming.', xp: 10, duration: 3 },
      { type: 'pronunciation', title: 'English R Practice', titleTr: 'Ingilizce R Calismasi', description: 'Special lesson on the English r sound for Turkish speakers.', xp: 20, duration: 5 },
      { type: 'blending', title: 'Family Words', titleTr: 'Aile Kelimeleri', description: 'Blend: mum, dad, man, met, ran, red, mud, dim.', xp: 20, duration: 5 },
      { type: 'segmenting', title: 'Sound Count', titleTr: 'Ses Sayma', description: 'How many sounds in each word? Tap them out!', xp: 15, duration: 4 },
      { type: 'story', title: 'Mum and Dad Story', titleTr: 'Anne Baba Hikayesi', description: 'Read a simple story about a family.', xp: 25, duration: 5 },
      { type: 'tpr', title: 'Family Actions', titleTr: 'Aile Hareketleri', description: 'Act out family actions: run, drum, march, dance!', xp: 15, duration: 4 },
    ],
  },
  // Unit 5: g, o, u
  {
    id: 'p1-u5',
    phaseId: 'little-ears',
    number: 5,
    title: 'Gulp, Octopus & Umbrella',
    titleTr: 'Yudumla, Ahtapot ve Semsiye',
    phonicsFocus: ['g3_g', 'g3_o', 'g3_u'],
    vocabularyTheme: 'Weather & Nature',
    tprCommands: ['Jump!', 'Grab!', 'Duck!', 'Gulp!', 'Go!'],
    targetSentences: ['The dog got up.', 'It is hot.', 'The bug is on the rug.'],
    decodableText: 'A big dog got on a bus. It is hot! The sun is up. A bug sat on a rug. "Get off!" said the pup. Gust! Gust! The mud got on us.',
    activities: [
      { type: 'sound-intro', title: 'Gulp It Down', titleTr: 'Yudumla', description: 'Learn the /g/ sound by gulping.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Surprised O', titleTr: 'Sasirmis O', description: 'Learn the /o/ sound with a surprised face.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Umbrella Up', titleTr: 'Semsiye Ac', description: 'Learn the /u/ sound. Different from Turkish u!', xp: 10, duration: 3 },
      { type: 'pronunciation', title: 'Turkish Traps', titleTr: 'Turkce Tuzaklari', description: 'English o and u are different from Turkish. Practice the difference.', xp: 20, duration: 5 },
      { type: 'blending', title: 'Nature Words', titleTr: 'Doga Kelimeleri', description: 'Blend: dog, hot, sun, bug, mud, gust, fog, hug.', xp: 20, duration: 5 },
      { type: 'listening', title: 'o or u?', titleTr: 'o mu u mu?', description: 'Tricky listening: which words have o? Which have u?', xp: 20, duration: 5 },
      { type: 'spelling', title: 'Spell It Out', titleTr: 'Harfle', description: 'Hear the word, pick the letters: g-o-t, b-u-s, h-o-t.', xp: 20, duration: 5 },
    ],
  },
  // Unit 6: l, f, b + Group 1-3 Review
  {
    id: 'p1-u6',
    phaseId: 'little-ears',
    number: 6,
    title: 'Lollipop, Flat Tire & Ball',
    titleTr: 'Lolipop, Patlak Lastik ve Top',
    phonicsFocus: ['g3_l', 'g3_f', 'g3_b'],
    vocabularyTheme: 'Toys & Play',
    tprCommands: ['Flap!', 'Bounce!', 'Lift!', 'Fall!', 'Bend!', 'Blob!'],
    targetSentences: ['The ball is big.', 'I fell in the mud.', 'Flip the lid.'],
    decodableText: 'A big ball fell off the bed. Flop! A flat bug sat on a log. The frog did a flip and fell in the mud. Splat! Bob let the balloon go. Up, up, up it floated. "Fun!" said Bob.',
    activities: [
      { type: 'sound-intro', title: 'Lollipop Lick', titleTr: 'Lolipop Yala', description: 'Learn the /l/ sound with a lollipop.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Flat Tire', titleTr: 'Patlak Lastik', description: 'Learn the /f/ sound like a deflating tire.', xp: 10, duration: 3 },
      { type: 'sound-intro', title: 'Ball Bounce', titleTr: 'Top Zipla', description: 'Learn the /b/ sound by bouncing.', xp: 10, duration: 3 },
      { type: 'blending', title: 'Toy Box Words', titleTr: 'Oyuncak Kutusu Kelimeleri', description: 'Blend: ball, bell, doll, block, flag, flip, blob.', xp: 20, duration: 5 },
      { type: 'segmenting', title: 'Sound Stretch', titleTr: 'Ses Uzatma', description: 'Stretch words into sounds: f-l-a-g, b-l-o-b.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Read the Story', titleTr: 'Hikayeyi Oku', description: 'Read a decodable passage using all Group 1-3 sounds.', xp: 30, duration: 6 },
      { type: 'story', title: 'Bob and the Ball', titleTr: 'Bob ve Top', description: 'Interactive story using all sounds learned so far.', xp: 25, duration: 5 },
      { type: 'spelling', title: 'Big Spell Review', titleTr: 'Buyuk Heceleme Tekrari', description: 'Spell 10 words using all 18 sounds from Groups 1-3.', xp: 25, duration: 5 },
    ],
  },
];

// --- PHASE 2: WORD BUILDERS (Groups 3-5) ---

const phase2Units: LearningUnit[] = [
  // Unit 1: ai, j, oa
  {
    id: 'p2-u1',
    phaseId: 'word-builders',
    number: 1,
    title: 'Rain, Jelly & Boats',
    titleTr: 'Yagmur, Jole ve Tekneler',
    phonicsFocus: ['g4_ai', 'g4_j', 'g4_oa'],
    vocabularyTheme: 'Weather & Travel',
    tprCommands: ['Sail!', 'Jog!', 'Jump in!', 'Splash!', 'Float!'],
    targetSentences: ['It will rain.', 'The goat is on a boat.', 'I jog in the rain.'],
    decodableText: 'Rain, rain! The goat ran to the boat. "I must sail!" said the goat. He had jam in a jar. The boat floated on the road. A snail joined him. "Let us jog!" said the snail.',
    activities: [
      { type: 'sound-intro', title: 'Rainy Day', titleTr: 'Yagmurlu Gun', description: 'Learn the /ai/ sound like rain on your hand.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Wobbly Jelly', titleTr: 'Titresen Jole', description: 'Learn the /j/ sound like wobbling jelly.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Sail the Boat', titleTr: 'Tekneyle Yol Al', description: 'Learn the /oa/ sound on a boat ride.', xp: 15, duration: 4 },
      { type: 'blending', title: 'Long Vowel Blends', titleTr: 'Uzun Sesli Karistirma', description: 'Blend words with ai and oa: rain, tail, boat, coat, road.', xp: 20, duration: 5 },
      { type: 'pronunciation', title: 'Long vs Short', titleTr: 'Uzun vs Kisa', description: 'Hear the difference: cat vs coat, hat vs hate, pan vs pain.', xp: 20, duration: 5 },
      { type: 'word-match', title: 'Weather Words', titleTr: 'Hava Durumu Kelimeleri', description: 'Match weather pictures to words.', xp: 15, duration: 3 },
      { type: 'tpr', title: 'Weather Dance', titleTr: 'Hava Durumu Dansi', description: 'Act out weather: rain, sail, jog, splash!', xp: 15, duration: 4 },
    ],
  },
  // Unit 2: ie, ee, or
  {
    id: 'p2-u2',
    phaseId: 'word-builders',
    number: 2,
    title: 'Kite, Bee & Corn',
    titleTr: 'Ucurtma, Ari ve Misir',
    phonicsFocus: ['g4_ie', 'g4_ee', 'g4_or'],
    vocabularyTheme: 'Garden & Bugs',
    tprCommands: ['Fly!', 'Buzz!', 'Peek!', 'Creep!', 'Reach!'],
    targetSentences: ['I see a bee.', 'The kite can fly.', 'The corn is tall.'],
    decodableText: 'I can see three bees in the tree. A kite tied to a string floated free. The bee landed on corn. "Eeee!" said the bee. She tried to reach the seed. The fern is green and the forest is deep.',
    activities: [
      { type: 'sound-intro', title: 'Fly the Kite', titleTr: 'Ucurtma Ucur', description: 'Learn the /ie/ sound like a kite in the sky.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Buzzy Bee', titleTr: 'Vizildayan Ari', description: 'Learn the /ee/ sound like a happy bee.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Row to Shore', titleTr: 'Kiyiya Kurek Cek', description: 'Learn the /or/ sound while rowing.', xp: 15, duration: 4 },
      { type: 'blending', title: 'Garden Words', titleTr: 'Bahce Kelimeleri', description: 'Blend: tree, bee, seed, tie, pie, corn, fork.', xp: 20, duration: 5 },
      { type: 'listening', title: 'ee vs ie', titleTr: 'ee mi ie mi?', description: 'Can you hear the difference? see vs sigh, bee vs by.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Garden Story', titleTr: 'Bahce Hikayesi', description: 'Read about bees and trees in a garden.', xp: 25, duration: 5 },
      { type: 'spelling', title: 'Long Vowel Spelling', titleTr: 'Uzun Sesli Heceleme', description: 'Spell words with ai, oa, ie, ee, or.', xp: 20, duration: 5 },
    ],
  },
  // Unit 3: z, w, ng
  {
    id: 'p2-u3',
    phaseId: 'word-builders',
    number: 3,
    title: 'Buzz, Wind & Ring',
    titleTr: 'Vizilti, Ruzgar ve Yuzuk',
    phonicsFocus: ['g5_z', 'g5_w', 'g5_ng'],
    vocabularyTheme: 'Music & Sound',
    tprCommands: ['Zig-zag!', 'Sing!', 'Wave!', 'Ring!', 'Swing!'],
    targetSentences: ['The bell will ring.', 'The wind is strong.', 'I can sing a song.'],
    decodableText: 'Zing! The king sang a song. Ding dong went the bell. The wind went whoosh and the wing went flap. A bee went buzz. The king did a zig-zag and fell. "Oops!" he sang. Ring, ring!',
    activities: [
      { type: 'sound-intro', title: 'Buzzy Z', titleTr: 'Vizildayan Z', description: 'Learn the /z/ sound like a buzzing bee.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Windy W', titleTr: 'Ruzgarli W', description: 'Learn the /w/ sound. New for Turkish speakers!', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Strong Ring', titleTr: 'Guclu Zilsesi', description: 'Learn the /ng/ sound like ringing a bell.', xp: 15, duration: 4 },
      { type: 'pronunciation', title: 'W is Not V!', titleTr: 'W, V Degil!', description: 'Special practice: English w is different from v. Round your lips!', xp: 20, duration: 5 },
      { type: 'blending', title: 'Music Words', titleTr: 'Muzik Kelimeleri', description: 'Blend: ring, sing, song, wing, zing, buzz, win, wag.', xp: 20, duration: 5 },
      { type: 'segmenting', title: 'ng Ending', titleTr: 'ng Sonu', description: 'Identify the ng sound at the end of words.', xp: 20, duration: 5 },
      { type: 'tpr', title: 'Music Moves', titleTr: 'Muzik Hareketleri', description: 'Sing, ring, wave, and zig-zag!', xp: 15, duration: 4 },
      { type: 'story', title: 'The Singing King', titleTr: 'Sarki Soyleyen Kral', description: 'Read about a king who loves to sing.', xp: 25, duration: 5 },
    ],
  },
  // Unit 4: v, oo(short), oo(long)
  {
    id: 'p2-u4',
    phaseId: 'word-builders',
    number: 4,
    title: 'Van, Book & Moon',
    titleTr: 'Minibus, Kitap ve Ay',
    phonicsFocus: ['g5_v', 'g5_oo_short', 'g5_oo_long'],
    vocabularyTheme: 'Night & Day',
    tprCommands: ['Zoom!', 'Look!', 'Cook!', 'Vroom!', 'Snooze!'],
    targetSentences: ['Look at the moon.', 'The van is cool.', 'A good book.'],
    decodableText: 'Look at the moon! It is cool and bright. The van went vroom past a wood. A good cook took a book to the pool. "Mmm, food!" said the cook. The moon shone on the pool. "Ooo!" said the cook.',
    activities: [
      { type: 'sound-intro', title: 'Vroom Van', titleTr: 'Viin Minibus', description: 'Learn the /v/ sound driving a van.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Good Book', titleTr: 'Iyi Kitap', description: 'Learn the short /oo/ sound as in book.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Moon Wolf', titleTr: 'Ay Kurdu', description: 'Learn the long /oo/ sound howling at the moon.', xp: 15, duration: 4 },
      { type: 'listening', title: 'oo or oo?', titleTr: 'Kisa oo mu Uzun oo mu?', description: 'Tricky! Is it short oo (book) or long oo (moon)?', xp: 20, duration: 5 },
      { type: 'blending', title: 'Night Words', titleTr: 'Gece Kelimeleri', description: 'Blend: moon, cool, pool, book, cook, good, van, vest.', xp: 20, duration: 5 },
      { type: 'word-match', title: 'Day vs Night', titleTr: 'Gunduz vs Gece', description: 'Sort words into day and night categories.', xp: 15, duration: 4 },
      { type: 'reading', title: 'Moonlit Story', titleTr: 'Ayisigi Hikayesi', description: 'Read about adventures under the moon.', xp: 25, duration: 5 },
    ],
  },
  // Unit 5: Group 3-5 Blending Mastery
  {
    id: 'p2-u5',
    phaseId: 'word-builders',
    number: 5,
    title: 'Word Builder Workshop',
    titleTr: 'Kelime Insaati Atolyesi',
    phonicsFocus: ['g3_g', 'g3_o', 'g3_u', 'g3_l', 'g3_f', 'g3_b', 'g4_ai', 'g4_oa', 'g4_ee'],
    vocabularyTheme: 'Building & Making',
    tprCommands: ['Build!', 'Stack!', 'Stick!', 'Lift!', 'Push!', 'Pull!'],
    targetSentences: ['I can build.', 'Stack the blocks.', 'Glue it on!'],
    decodableText: 'Bob the builder got his tools. He needed a bolt, a nail, and glue. He built a big boat from green wood. Rain fell on the boat. "Good!" said Bob. "It floats!" The goat got on the boat. Off it sailed to the moon.',
    activities: [
      { type: 'blending', title: 'Blend Challenge', titleTr: 'Karistirma Yarismasi', description: 'Blend complex words: green, float, street, train, blood.', xp: 25, duration: 5 },
      { type: 'segmenting', title: 'Sound Machines', titleTr: 'Ses Makineleri', description: 'Break words into sounds fast, like a machine.', xp: 25, duration: 5 },
      { type: 'spelling', title: 'Build the Word', titleTr: 'Kelimeyi Insaa Et', description: 'Use letter tiles to build words from sounds.', xp: 25, duration: 5 },
      { type: 'word-match', title: 'Rhyme Time', titleTr: 'Kafiye Zamani', description: 'Match words that rhyme: boat-goat, rain-train.', xp: 20, duration: 4 },
      { type: 'reading', title: 'Builder Bob', titleTr: 'Insaatci Bob', description: 'Read the Builder Bob decodable story.', xp: 30, duration: 6 },
      { type: 'pronunciation', title: 'Sound Review', titleTr: 'Ses Tekrari', description: 'Review all 30 sounds learned so far.', xp: 20, duration: 5 },
    ],
  },
  // Unit 6: Group 3-5 Review & Assessment
  {
    id: 'p2-u6',
    phaseId: 'word-builders',
    number: 6,
    title: 'Word Builder Challenge',
    titleTr: 'Kelime Insaati Yarismasi',
    phonicsFocus: ['g5_z', 'g5_w', 'g5_ng', 'g5_v', 'g5_oo_short', 'g5_oo_long'],
    vocabularyTheme: 'Adventure & Games',
    tprCommands: ['Win!', 'Zoom!', 'Swing!', 'Catch!', 'Throw!', 'Score!'],
    targetSentences: ['We can win!', 'Swing and zoom!', 'I got the ring!'],
    decodableText: 'The king had a quest! He took his van and zoomed to the zoo. A good wolf sang a long song to the moon. Buzz! A bee zapped past. The king grabbed the golden ring. "I win!" he sang. Cool!',
    activities: [
      { type: 'listening', title: 'Sound Detective', titleTr: 'Ses Dedektifi', description: 'Find hidden sounds in words. Can you hear them all?', xp: 25, duration: 5 },
      { type: 'blending', title: 'Speed Blend', titleTr: 'Hizli Karistirma', description: 'Blend words as fast as you can! Beat the clock!', xp: 25, duration: 5 },
      { type: 'segmenting', title: 'Sound Splitter', titleTr: 'Ses Parcalayici', description: 'Break long words apart quickly.', xp: 25, duration: 5 },
      { type: 'reading', title: 'Quest Story', titleTr: 'Macera Hikayesi', description: 'Read the king\'s quest adventure story.', xp: 30, duration: 6 },
      { type: 'spelling', title: 'Spell Quest', titleTr: 'Heceleme Gorevi', description: 'Spell 15 challenge words from Groups 3-5.', xp: 30, duration: 6 },
      { type: 'story', title: 'Create a Story', titleTr: 'Hikaye Olustur', description: 'Choose words to make your own mini story!', xp: 30, duration: 5 },
    ],
  },
];

// --- PHASE 3: STORY MAKERS (Groups 5-7) ---

const phase3Units: LearningUnit[] = [
  // Unit 1: y, x, ch, sh
  {
    id: 'p3-u1',
    phaseId: 'story-makers',
    number: 1,
    title: 'Yogurt, Fox & Train',
    titleTr: 'Yogurt, Tilki ve Tren',
    phonicsFocus: ['g6_y', 'g6_x', 'g6_ch', 'g6_sh'],
    vocabularyTheme: 'Adventures & Vehicles',
    tprCommands: ['Chop!', 'Shh!', 'Yell!', 'Mix!', 'Rush!', 'Push!'],
    targetSentences: ['Shh, the baby sleeps.', 'The fox is in a box.', 'Chop the chips.'],
    decodableText: 'Shh! A fox hid in a box on a ship. "Yes!" yelled the fox. He chopped six chips and mixed them up. The ship went choo-choo past a shed. "I wish for fish and chips!" said the fox. He shut the chest and rushed to the shop.',
    activities: [
      { type: 'sound-intro', title: 'Yummy Y', titleTr: 'Lezzetli Y', description: 'Learn /y/ sound. Same as Turkish y!', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'X Marks the Spot', titleTr: 'X Yeri Isaretle', description: 'Learn /ks/ sound by crossing arms.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Choo-Choo Train', titleTr: 'Cuf-Cuf Tren', description: 'Learn /ch/ sound. Same as Turkish c!', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Quiet Baby', titleTr: 'Sessiz Bebek', description: 'Learn /sh/ sound. Same as Turkish s!', xp: 15, duration: 4 },
      { type: 'blending', title: 'Adventure Words', titleTr: 'Macera Kelimeleri', description: 'Blend: ship, shop, chip, chop, fox, box, mix, six, yes, yell.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Fox on a Ship', titleTr: 'Gemideki Tilki', description: 'Read the decodable fox adventure.', xp: 25, duration: 5 },
      { type: 'spelling', title: 'sh and ch Words', titleTr: 'sh ve ch Kelimeleri', description: 'Practice spelling words with sh and ch.', xp: 20, duration: 5 },
    ],
  },
  // Unit 2: th(voiced), th(unvoiced)
  {
    id: 'p3-u2',
    phaseId: 'story-makers',
    number: 2,
    title: 'The Thinking Tongue',
    titleTr: 'Dusunen Dil',
    phonicsFocus: ['g6_th_voiced', 'g6_th_unvoiced'],
    vocabularyTheme: 'Thinking & Feelings',
    tprCommands: ['Think!', 'Thank!', 'Touch this!', 'Point to that!', 'Breathe!'],
    targetSentences: ['I think this is fun.', 'That is thick.', 'Thank them.'],
    decodableText: 'Think of this and that. The thin man thanked the thick king. "With three wishes, I think I can help them!" he said. Those things on the path are smooth. This moth is thin. That cloth is thick.',
    activities: [
      { type: 'sound-intro', title: 'Buzzy Tongue', titleTr: 'Viziltili Dil', description: 'Learn voiced /th/. Tongue between teeth, voice ON!', xp: 20, duration: 5 },
      { type: 'sound-intro', title: 'Quiet Tongue', titleTr: 'Sessiz Dil', description: 'Learn unvoiced /th/. Tongue between teeth, voice OFF!', xp: 20, duration: 5 },
      { type: 'pronunciation', title: 'th Practice Zone', titleTr: 'th Pratik Alani', description: 'Special practice for Turkish speakers. This sound does not exist in Turkish!', xp: 25, duration: 6 },
      { type: 'listening', title: 'th or t? th or d?', titleTr: 'th mi t mi? th mi d mi?', description: 'Listen carefully: thin vs tin, this vs dis.', xp: 20, duration: 5 },
      { type: 'blending', title: 'Thinking Words', titleTr: 'Dusunce Kelimeleri', description: 'Blend: the, this, that, them, thin, thick, think, math.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Think About It', titleTr: 'Bir Dusun', description: 'Read sentences with th words.', xp: 25, duration: 5 },
    ],
  },
  // Unit 3: qu, ou, oi
  {
    id: 'p3-u3',
    phaseId: 'story-makers',
    number: 3,
    title: 'Queen, Cloud & Coin',
    titleTr: 'Kralice, Bulut ve Bozuk Para',
    phonicsFocus: ['g7_qu', 'g7_ou', 'g7_oi'],
    vocabularyTheme: 'Treasure & Discovery',
    tprCommands: ['Quack!', 'Shout!', 'Point!', 'Dig!', 'Search!', 'Join!'],
    targetSentences: ['The queen found a coin.', 'Shout out loud!', 'Join the quest!'],
    decodableText: 'The queen set out on a quest. Dark clouds loomed. She found a round coin in the soil. "Ouch!" she said as she dug it out. A loud quack came from the pond. A duck joined her quest. "Quick! Oil the lock!" said the queen. She found the treasure!',
    activities: [
      { type: 'sound-intro', title: 'Quacking Duck', titleTr: 'Vaklayan Ordek', description: 'Learn /qu/ sound like a duck quacking.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Ouch Cloud', titleTr: 'Ayyy Bulutu', description: 'Learn /ou/ sound like saying ouch.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Pirate Coin', titleTr: 'Korsan Parasi', description: 'Learn /oi/ sound like a pirate finding coins.', xp: 15, duration: 4 },
      { type: 'blending', title: 'Treasure Words', titleTr: 'Hazine Kelimeleri', description: 'Blend: queen, quick, quiz, out, loud, cloud, oil, coin, join.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Queen\'s Quest', titleTr: 'Kralicenin Gorevi', description: 'Read the queen\'s treasure quest story.', xp: 30, duration: 6 },
      { type: 'story', title: 'Write the Ending', titleTr: 'Sonu Yaz', description: 'Choose how the queen\'s quest ends!', xp: 25, duration: 5 },
      { type: 'spelling', title: 'Quest Spelling', titleTr: 'Gorev Hecelemesi', description: 'Spell qu, ou, and oi words correctly.', xp: 20, duration: 5 },
    ],
  },
  // Unit 4: ue, er, ar
  {
    id: 'p3-u4',
    phaseId: 'story-makers',
    number: 4,
    title: 'Blue Star Journey',
    titleTr: 'Mavi Yildiz Yolculugu',
    phonicsFocus: ['g7_ue', 'g7_er', 'g7_ar'],
    vocabularyTheme: 'Space & Stars',
    tprCommands: ['Stir!', 'Drive!', 'Fly far!', 'Glue!', 'Reach!', 'March!'],
    targetSentences: ['The star is far.', 'Her car is blue.', 'After dark, look up.'],
    decodableText: 'After dark, her car drove far to the park. Blue stars shone in the sky. "A clue!" she said. A fern glowed near the farm. She mixed glue and stuck the star to her jar. "True!" she said. The farmer looked up. "That is the best star ever!" he said.',
    activities: [
      { type: 'sound-intro', title: 'Blue View', titleTr: 'Mavi Manzara', description: 'Learn /ue/ sound by admiring a blue view.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Mixer Stir', titleTr: 'Mikser Karistirma', description: 'Learn /er/ sound like a mixer stirring.', xp: 15, duration: 4 },
      { type: 'sound-intro', title: 'Starlight', titleTr: 'Yildiz Isigi', description: 'Learn /ar/ sound looking at stars.', xp: 15, duration: 4 },
      { type: 'pronunciation', title: 'er Sound Practice', titleTr: 'er Ses Pratigi', description: 'The /er/ sound is very common and tricky for Turkish speakers.', xp: 20, duration: 5 },
      { type: 'blending', title: 'Space Words', titleTr: 'Uzay Kelimeleri', description: 'Blend: blue, clue, true, star, far, car, her, after, farmer.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Star Journey', titleTr: 'Yildiz Yolculugu', description: 'Read the complete star journey story.', xp: 30, duration: 6 },
      { type: 'spelling', title: 'Final Sounds Spelling', titleTr: 'Son Sesler Hecelemesi', description: 'Spell all 42 sounds reviewed! The big challenge.', xp: 30, duration: 6 },
      { type: 'story', title: 'My Star Story', titleTr: 'Benim Yildiz Hikayem', description: 'Create your own space adventure story!', xp: 30, duration: 5 },
    ],
  },
];

// --- PHASE 4: YOUNG EXPLORERS (Advanced) ---

const phase4Units: LearningUnit[] = [
  // Unit 1: Fluency & Expression
  {
    id: 'p4-u1',
    phaseId: 'young-explorers',
    number: 1,
    title: 'Reading with Expression',
    titleTr: 'Ifadeyle Okuma',
    phonicsFocus: ['g4_ai', 'g4_oa', 'g4_ie', 'g4_ee', 'g6_sh', 'g6_ch', 'g6_th_voiced', 'g6_th_unvoiced'],
    vocabularyTheme: 'Emotions & Drama',
    tprCommands: ['Act happy!', 'Look sad!', 'Be surprised!', 'Whisper!', 'Shout!', 'Laugh!'],
    targetSentences: ['She feels happy.', 'He is sad.', 'They are surprised!', 'We can shout and whisper.'],
    decodableText: '"I feel so happy!" cheered the sheep. The thin cat looked sad. "What is the matter?" asked the sheep. "I lost my cheese," said the cat. "Think! Where did you leave it?" The cat thought and thought. "In the shed!" They rushed to the shed and found the cheese. "Hooray!" they both cheered.',
    activities: [
      { type: 'reading', title: 'Read with Feeling', titleTr: 'Duygulu Oku', description: 'Read sentences with different emotions: happy, sad, excited.', xp: 25, duration: 5 },
      { type: 'pronunciation', title: 'Expression Practice', titleTr: 'Ifade Pratigi', description: 'Say the same sentence in different ways: question, exclamation, whisper.', xp: 20, duration: 5 },
      { type: 'listening', title: 'How Do They Feel?', titleTr: 'Nasil Hissediyorlar?', description: 'Listen and identify the emotion from the voice.', xp: 20, duration: 5 },
      { type: 'tpr', title: 'Emotion Actions', titleTr: 'Duygu Hareketleri', description: 'Act out emotions with your whole body!', xp: 15, duration: 4 },
      { type: 'story', title: 'Drama Story', titleTr: 'Drama Hikayesi', description: 'Read a story and act it out with different voices.', xp: 30, duration: 6 },
      { type: 'blending', title: 'Emotion Words', titleTr: 'Duygu Kelimeleri', description: 'Blend and read feeling words: happy, sad, cross, kind, proud.', xp: 20, duration: 5 },
    ],
  },
  // Unit 2: Comprehension & Vocabulary
  {
    id: 'p4-u2',
    phaseId: 'young-explorers',
    number: 2,
    title: 'Understanding Stories',
    titleTr: 'Hikayeleri Anlama',
    phonicsFocus: ['g7_qu', 'g7_ou', 'g7_oi', 'g7_ue', 'g7_er', 'g7_ar'],
    vocabularyTheme: 'Stories & Characters',
    tprCommands: ['Question!', 'Answer!', 'Retell!', 'Predict!', 'Imagine!'],
    targetSentences: ['Who is the character?', 'What happened next?', 'I think he will...', 'The story is about...'],
    decodableText: 'Once upon a time, a clever farmer found a blue star in his dark garden. "A clue!" he shouted out loud. He joined a quest with the queen. After a long march, they discovered a golden coin under an old oak. "True treasure is friendship," said the queen. The farmer agreed. They drove the car back to the farm, happy ever after.',
    activities: [
      { type: 'reading', title: 'Read & Understand', titleTr: 'Oku ve Anla', description: 'Read a story and answer who, what, where questions.', xp: 25, duration: 5 },
      { type: 'listening', title: 'Story Questions', titleTr: 'Hikaye Sorulari', description: 'Listen to a story and answer comprehension questions.', xp: 20, duration: 5 },
      { type: 'word-match', title: 'Character Match', titleTr: 'Karakter Eslestirme', description: 'Match characters to their actions in the story.', xp: 15, duration: 4 },
      { type: 'story', title: 'Predict & Create', titleTr: 'Tahmin Et ve Olustur', description: 'What happens next? Create your own ending.', xp: 30, duration: 6 },
      { type: 'spelling', title: 'Story Words', titleTr: 'Hikaye Kelimeleri', description: 'Spell key words from the stories you have read.', xp: 20, duration: 5 },
      { type: 'pronunciation', title: 'Character Voices', titleTr: 'Karakter Sesleri', description: 'Read dialogue using different character voices.', xp: 20, duration: 5 },
    ],
  },
  // Unit 3: Writing & Composition
  {
    id: 'p4-u3',
    phaseId: 'young-explorers',
    number: 3,
    title: 'My First Stories',
    titleTr: 'Ilk Hikayelerim',
    phonicsFocus: ['g1_s', 'g1_a', 'g2_ck', 'g3_g', 'g4_ai', 'g5_oo_long', 'g6_sh', 'g7_ar'],
    vocabularyTheme: 'Creative Writing',
    tprCommands: ['Write!', 'Draw!', 'Tell!', 'Share!', 'Imagine!'],
    targetSentences: ['Once upon a time...', 'One day, I saw...', 'My story is about...', 'In the end...'],
    decodableText: 'I can write a story! Once upon a time, a small cat and a big dog became friends. They sailed on a boat to the moon. "Look at the stars!" said the cat. The dog barked at a shooting star. They shared a good book under the moonlight. In the end, they drove the car back home. The end!',
    activities: [
      { type: 'spelling', title: 'Story Starters', titleTr: 'Hikaye Baslangiclar', description: 'Learn and spell common story starter phrases.', xp: 20, duration: 5 },
      { type: 'reading', title: 'Read Model Stories', titleTr: 'Ornek Hikayeleri Oku', description: 'Read short stories as models for your own writing.', xp: 25, duration: 5 },
      { type: 'word-match', title: 'Story Sequencing', titleTr: 'Hikaye Siralama', description: 'Put story events in the correct order.', xp: 20, duration: 5 },
      { type: 'story', title: 'Build Your Story', titleTr: 'Hikayeni Kur', description: 'Choose characters, setting, and events to build a story.', xp: 35, duration: 7 },
      { type: 'pronunciation', title: 'Read Your Story', titleTr: 'Hikayeni Oku', description: 'Practice reading your story aloud with expression.', xp: 20, duration: 5 },
      { type: 'listening', title: 'Story Sharing', titleTr: 'Hikaye Paylasimi', description: 'Listen to other stories and give feedback.', xp: 15, duration: 4 },
    ],
  },
  // Unit 4: All Sounds Mastery & Graduation
  {
    id: 'p4-u4',
    phaseId: 'young-explorers',
    number: 4,
    title: 'Phonics Champion',
    titleTr: 'Fonetik Sampiyonu',
    phonicsFocus: ['g1_s', 'g2_ck', 'g3_g', 'g4_ai', 'g5_ng', 'g6_th_voiced', 'g7_qu', 'g7_er'],
    vocabularyTheme: 'Achievement & Celebration',
    tprCommands: ['Celebrate!', 'Cheer!', 'High five!', 'Dance!', 'Bow!', 'Wave!'],
    targetSentences: ['I can read!', 'I know all 42 sounds!', 'I am a phonics champion!', 'English is fun!'],
    decodableText: 'You did it! You learned all 42 sounds. You can read about queens and kings, ships and trains, stars and moons. You can blend, segment, and spell. Think of all the stories you can read now! From the snake ssss to the quacking duck, you are a true phonics champion. Well done, young explorer!',
    activities: [
      { type: 'listening', title: 'Sound Master Quiz', titleTr: 'Ses Ustasi Sinavi', description: 'Identify all 42 sounds in a grand quiz!', xp: 40, duration: 8 },
      { type: 'blending', title: 'Champion Blend', titleTr: 'Sampiyon Karistirmasi', description: 'Blend the trickiest words from all 7 groups.', xp: 30, duration: 6 },
      { type: 'spelling', title: 'Champion Spelling', titleTr: 'Sampiyon Hecelemesi', description: 'Spell 20 challenge words from across all groups.', xp: 35, duration: 7 },
      { type: 'reading', title: 'Champion Reading', titleTr: 'Sampiyon Okumasi', description: 'Read a long passage fluently with expression.', xp: 35, duration: 7 },
      { type: 'story', title: 'My Best Story', titleTr: 'En Iyi Hikayem', description: 'Create and read your best story using all sounds.', xp: 40, duration: 8 },
      { type: 'tpr', title: 'Celebration Dance', titleTr: 'Kutlama Dansi', description: 'Celebrate your achievement with a final TPR session!', xp: 20, duration: 4 },
    ],
  },
];

// --- PHASES DEFINITION ---

export const PHASES: LearningPhase[] = [
  {
    id: 'little-ears',
    number: 1,
    name: 'Little Ears',
    nameTr: 'Kucuk Kulaklar',
    ageRange: '3-5',
    description: 'Discover the first 18 English sounds through play, actions, and stories. Build your first words by blending sounds together.',
    descriptionTr: 'Oyun, hareketler ve hikayeler araciligiyla ilk 18 Ingilizce sesi kesfet. Sesleri birlestirerek ilk kelimelerini olustur.',
    icon: '\u{1F442}',
    color: '#FF6B6B',
    phonicsGroups: [1, 2, 3],
    montessoriLevel: 'Sensorial & Language (Pink Series)',
    skills: [
      'Sound recognition',
      'Letter-sound correspondence',
      'Basic blending (CVC words)',
      'Segmenting simple words',
      'TPR vocabulary (action words)',
      'First decodable reading',
    ],
    units: phase1Units,
  },
  {
    id: 'word-builders',
    number: 2,
    name: 'Word Builders',
    nameTr: 'Kelime Insaatcilari',
    ageRange: '4-6',
    description: 'Master long vowels, digraphs, and tricky sounds. Build longer words and read simple stories independently.',
    descriptionTr: 'Uzun seslileri, cifte harfleri ve zor sesleri usta. Daha uzun kelimeler olustur ve basit hikayeleri bagimsiz oku.',
    icon: '\u{1F3D7}\u{FE0F}',
    color: '#4ECDC4',
    phonicsGroups: [3, 4, 5],
    montessoriLevel: 'Language (Blue Series)',
    skills: [
      'Long vowel recognition',
      'Digraph blending (ai, oa, ee, etc.)',
      'Complex blending (CCVC, CVCC)',
      'Reading short passages',
      'Rhyming and word families',
      'Expanded TPR vocabulary',
    ],
    units: phase2Units,
  },
  {
    id: 'story-makers',
    number: 3,
    name: 'Story Makers',
    nameTr: 'Hikaye Yapicilar',
    ageRange: '5-7',
    description: 'Learn all 42 sounds including the trickiest ones for Turkish speakers. Read and create your own stories!',
    descriptionTr: 'Turkce konusanlar icin en zor sesler dahil 42 sesin tamamini ogren. Kendi hikayelerini oku ve olustur!',
    icon: '\u{1F4DA}',
    color: '#45B7D1',
    phonicsGroups: [5, 6, 7],
    montessoriLevel: 'Language (Green Series)',
    skills: [
      'All 42 sound mastery',
      'th sounds (unique to English)',
      'Reading fluency',
      'Story comprehension',
      'Creative story building',
      'Advanced spelling patterns',
    ],
    units: phase3Units,
  },
  {
    id: 'young-explorers',
    number: 4,
    name: 'Young Explorers',
    nameTr: 'Genc Kasiifler',
    ageRange: '6-8',
    description: 'Read with expression, understand stories deeply, and write your own tales. You are a phonics champion!',
    descriptionTr: 'Ifadeyle oku, hikayeleri derinlemesine anla ve kendi hikayelerini yaz. Sen bir fonetik sampiyonusun!',
    icon: '\u{1F30D}',
    color: '#96CEB4',
    phonicsGroups: [1, 2, 3, 4, 5, 6, 7],
    montessoriLevel: 'Language (Advanced Reading & Writing)',
    skills: [
      'Reading with expression',
      'Story comprehension',
      'Creative writing',
      'Vocabulary expansion',
      'Independent reading',
      'All sounds fluency review',
    ],
    units: phase4Units,
  },
];
