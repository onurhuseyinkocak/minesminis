// ============================================================
// MinesMinis Reading Library
// Decodable books leveled by phonics group
// Children can only read books using sounds they've mastered
// ============================================================

// --- TYPES ---

export interface DecodableBook {
  id: string;
  title: string;
  titleTr: string;
  emoji: string;
  requiredGroup: number;    // minimum phonics group needed to read
  difficulty: 1 | 2 | 3;   // within the group
  pages: BookPage[];
  wordCount: number;
  readingTimeMinutes: number;
  comprehensionQuestions: CompQuestion[];
}

export interface BookPage {
  text: string;             // decodable text (only uses known sounds)
  illustration: string;     // emoji scene
  highlightWords: string[]; // new/target words to highlight
}

export interface CompQuestion {
  question: string;
  questionTr: string;
  options: string[];
  correctIndex: number;
  emoji: string;
}

// --- READING LIBRARY ---

export const READING_LIBRARY: DecodableBook[] = [
  // ════════════════════════════════════════════════════════════
  // GROUP 1 — s, a, t, i, p, n
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g1-1',
    title: 'Pat the Cat',
    titleTr: 'Kedi Pat',
    emoji: '🐱',
    requiredGroup: 1,
    difficulty: 1,
    pages: [
      {
        text: 'Pat is a cat.',
        illustration: '🐱',
        highlightWords: ['Pat', 'cat'],
      },
      {
        text: 'Pat sat on a mat.',
        illustration: '🐱 🪑',
        highlightWords: ['sat', 'mat'],
      },
      {
        text: 'Pat naps in the sun.',
        illustration: '🐱 ☀️',
        highlightWords: ['naps', 'sun'],
      },
      {
        text: 'Pat is a fat cat!',
        illustration: '🐱 😄',
        highlightWords: ['fat', 'cat'],
      },
    ],
    wordCount: 20,
    readingTimeMinutes: 1,
    comprehensionQuestions: [
      {
        question: 'What is Pat?',
        questionTr: 'Pat nedir?',
        options: ['A cat', 'A dog', 'A fish'],
        correctIndex: 0,
        emoji: '🐱',
      },
      {
        question: 'Where did Pat sit?',
        questionTr: 'Pat nereye oturdu?',
        options: ['On a mat', 'On a bed', 'On a hat'],
        correctIndex: 0,
        emoji: '🪑',
      },
      {
        question: 'What does Pat do in the sun?',
        questionTr: 'Pat güneş altında ne yapar?',
        options: ['Naps', 'Runs', 'Swims'],
        correctIndex: 0,
        emoji: '☀️',
      },
    ],
  },
  {
    id: 'book-g1-2',
    title: 'Tip and Tap',
    titleTr: 'Tip ve Tap',
    emoji: '🐕',
    requiredGroup: 1,
    difficulty: 2,
    pages: [
      {
        text: 'Tip is a pup.',
        illustration: '🐕',
        highlightWords: ['Tip', 'pup'],
      },
      {
        text: 'Tap is a pup.',
        illustration: '🐕',
        highlightWords: ['Tap', 'pup'],
      },
      {
        text: 'Tip and Tap sit.',
        illustration: '🐕 🐕',
        highlightWords: ['sit'],
      },
      {
        text: 'Tip nips. Tap taps.',
        illustration: '🐕 🐾 🐕',
        highlightWords: ['nips', 'taps'],
      },
      {
        text: 'Tip and Tap nap.',
        illustration: '🐕💤🐕',
        highlightWords: ['nap'],
      },
    ],
    wordCount: 22,
    readingTimeMinutes: 1,
    comprehensionQuestions: [
      {
        question: 'What are Tip and Tap?',
        questionTr: 'Tip ve Tap nedir?',
        options: ['Pups', 'Cats', 'Fish'],
        correctIndex: 0,
        emoji: '🐕',
      },
      {
        question: 'What does Tap do?',
        questionTr: 'Tap ne yapar?',
        options: ['Taps', 'Sings', 'Flies'],
        correctIndex: 0,
        emoji: '🐾',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP 2 — add c/k, e, h, r, m, d
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g2-1',
    title: 'Red Hen',
    titleTr: 'Kırmızı Tavuk',
    emoji: '🐔',
    requiredGroup: 2,
    difficulty: 1,
    pages: [
      {
        text: 'Red Hen is in a pen.',
        illustration: '🐔 🏠',
        highlightWords: ['Red', 'Hen', 'pen'],
      },
      {
        text: 'Red Hen met a man.',
        illustration: '🐔 🧑',
        highlightWords: ['met', 'man'],
      },
      {
        text: 'The man had a hat.',
        illustration: '🧑 🎩',
        highlightWords: ['had', 'hat'],
      },
      {
        text: 'Red Hen pecked the hat!',
        illustration: '🐔 🎩 😂',
        highlightWords: ['pecked', 'hat'],
      },
      {
        text: 'The man ran and ran!',
        illustration: '🧑 💨',
        highlightWords: ['ran'],
      },
    ],
    wordCount: 28,
    readingTimeMinutes: 1,
    comprehensionQuestions: [
      {
        question: 'What is Red Hen in?',
        questionTr: 'Kırmızı Tavuk nerede?',
        options: ['A pen', 'A car', 'A bed'],
        correctIndex: 0,
        emoji: '🏠',
      },
      {
        question: 'What did the man have?',
        questionTr: 'Adamda ne vardi?',
        options: ['A hat', 'A cat', 'A pen'],
        correctIndex: 0,
        emoji: '🎩',
      },
      {
        question: 'What did the man do?',
        questionTr: 'Adam ne yaptı?',
        options: ['Ran', 'Sat', 'Napped'],
        correctIndex: 0,
        emoji: '💨',
      },
    ],
  },
  {
    id: 'book-g2-2',
    title: 'The Big Map',
    titleTr: 'Buyuk Harita',
    emoji: '🗺️',
    requiredGroup: 2,
    difficulty: 2,
    pages: [
      {
        text: 'Dad had a map.',
        illustration: '🧑 🗺️',
        highlightWords: ['Dad', 'map'],
      },
      {
        text: 'The map is red and dim.',
        illustration: '🗺️ 🔴',
        highlightWords: ['red', 'dim'],
      },
      {
        text: 'Dad hid the map fast.',
        illustration: '🧑 🗺️',
        highlightWords: ['hid', 'map'],
      },
      {
        text: 'He hid the map in a den.',
        illustration: '🕳️ 🗺️',
        highlightWords: ['hid', 'den'],
      },
      {
        text: 'The kid can crack the map!',
        illustration: '🧒 🗺️ ⭐',
        highlightWords: ['kid', 'crack'],
      },
    ],
    wordCount: 32,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Who had a map?',
        questionTr: 'Kimde harita vardi?',
        options: ['Dad', 'Mum', 'A cat'],
        correctIndex: 0,
        emoji: '🧑',
      },
      {
        question: 'Where did he hide the map?',
        questionTr: 'Haritayi nereye sakladı?',
        options: ['In a den', 'In a hat', 'In a pan'],
        correctIndex: 0,
        emoji: '🕳️',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP 3 — add g, o, u, l, f, b
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g3-1',
    title: 'Bug on a Log',
    titleTr: 'Kütük Üstünde Böcek',
    emoji: '🐛',
    requiredGroup: 3,
    difficulty: 1,
    pages: [
      {
        text: 'A bug sat on a log.',
        illustration: '🐛 🪵',
        highlightWords: ['bug', 'log'],
      },
      {
        text: 'A dog ran up to the log.',
        illustration: '🐕 🪵',
        highlightWords: ['dog', 'log'],
      },
      {
        text: 'The bug hid in the fog.',
        illustration: '🐛 🌫️',
        highlightWords: ['hid', 'fog'],
      },
      {
        text: 'The dog dug in the mud.',
        illustration: '🐕 💩',
        highlightWords: ['dug', 'mud'],
      },
      {
        text: 'The bug had fun on the log!',
        illustration: '🐛 🪵 ⭐',
        highlightWords: ['fun', 'log'],
      },
    ],
    wordCount: 35,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Where did the bug sit?',
        questionTr: 'Böcek nereye oturdu?',
        options: ['On a log', 'On a bed', 'On a hat'],
        correctIndex: 0,
        emoji: '🪵',
      },
      {
        question: 'Where did the bug hide?',
        questionTr: 'Böcek nereye saklandi?',
        options: ['In the fog', 'In the sun', 'In the mud'],
        correctIndex: 0,
        emoji: '🌫️',
      },
      {
        question: 'What did the dog do?',
        questionTr: 'Köpek ne yaptı?',
        options: ['Dug in the mud', 'Sat on the log', 'Ate a bun'],
        correctIndex: 0,
        emoji: '🐕',
      },
    ],
  },
  {
    id: 'book-g3-2',
    title: 'Fun in the Sun',
    titleTr: 'Guneste Eglence',
    emoji: '☀️',
    requiredGroup: 3,
    difficulty: 2,
    pages: [
      {
        text: 'Gus got on the bus.',
        illustration: '🧒 🚌',
        highlightWords: ['Gus', 'bus'],
      },
      {
        text: 'The bus is full of fun.',
        illustration: '🚌 🎉',
        highlightWords: ['full', 'fun'],
      },
      {
        text: 'Gus sat and bit a bun.',
        illustration: '🧒 🍞',
        highlightWords: ['bit', 'bun'],
      },
      {
        text: 'The sun is hot and big.',
        illustration: '☀️',
        highlightWords: ['sun', 'hot', 'big'],
      },
      {
        text: 'Gus had lots of fun!',
        illustration: '🧒 ☀️ ⭐',
        highlightWords: ['lots', 'fun'],
      },
    ],
    wordCount: 30,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'How did Gus travel?',
        questionTr: 'Gus nasil seyahat etti?',
        options: ['On a bus', 'On a boat', 'On a bike'],
        correctIndex: 0,
        emoji: '🚌',
      },
      {
        question: 'What did Gus eat?',
        questionTr: 'Gus ne yedi?',
        options: ['A bun', 'A fig', 'A nut'],
        correctIndex: 0,
        emoji: '🍞',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP 4 — add ai, j, oa, ie, ee, or
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g4-1',
    title: 'The Goat on a Boat',
    titleTr: 'Teknedeki Keçi',
    emoji: '🐐',
    requiredGroup: 4,
    difficulty: 1,
    pages: [
      {
        text: 'A goat got on a boat.',
        illustration: '🐐 ⛵',
        highlightWords: ['goat', 'boat'],
      },
      {
        text: 'The goat had a coat.',
        illustration: '🐐 🧥',
        highlightWords: ['coat'],
      },
      {
        text: 'It began to rain.',
        illustration: '🌧️ ⛵',
        highlightWords: ['rain'],
      },
      {
        text: 'The goat had a pail in the rain.',
        illustration: '🐐 🌧️ 🪣',
        highlightWords: ['pail', 'rain'],
      },
      {
        text: 'The goat ran for the road!',
        illustration: '🐐 🛤️ ☀️',
        highlightWords: ['road'],
      },
    ],
    wordCount: 32,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'What did the goat get on?',
        questionTr: 'Keçi neye bindi?',
        options: ['A boat', 'A bus', 'A log'],
        correctIndex: 0,
        emoji: '⛵',
      },
      {
        question: 'What fell from the sky?',
        questionTr: 'Gokten ne yagdi?',
        options: ['Rain', 'Seeds', 'Mud'],
        correctIndex: 0,
        emoji: '🌧️',
      },
      {
        question: 'Where did the goat run?',
        questionTr: 'Keçi nereye koştu?',
        options: ['The road', 'The den', 'The pen'],
        correctIndex: 0,
        emoji: '🛤️',
      },
    ],
  },
  {
    id: 'book-g4-2',
    title: 'The Bee and the Tree',
    titleTr: 'Arı ve Ağaç',
    emoji: '🐝',
    requiredGroup: 4,
    difficulty: 2,
    pages: [
      {
        text: 'A bee sat in a tree.',
        illustration: '🐝 🌳',
        highlightWords: ['bee', 'tree'],
      },
      {
        text: 'The bee can see the green seed.',
        illustration: '🐝 👀 🌱',
        highlightWords: ['see', 'green', 'seed'],
      },
      {
        text: 'A jet set off for the road.',
        illustration: '✈️ 🛤️',
        highlightWords: ['jet', 'road'],
      },
      {
        text: 'The bee tried to tie a knot.',
        illustration: '🐝 🪢',
        highlightWords: ['tried', 'tie'],
      },
      {
        text: 'The bee needs to feed.',
        illustration: '🐝 🍯',
        highlightWords: ['needs', 'feed'],
      },
      {
        text: 'Three cheers for the bee!',
        illustration: '🐝 ⭐ ⭐ ⭐',
        highlightWords: ['Three', 'cheers'],
      },
    ],
    wordCount: 38,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Where did the bee sit?',
        questionTr: 'Arı nereye oturdu?',
        options: ['In a tree', 'On a log', 'In a boat'],
        correctIndex: 0,
        emoji: '🌳',
      },
      {
        question: 'What did the bee see?',
        questionTr: 'Arı ne gördü?',
        options: ['A green seed', 'A red hat', 'A big dog'],
        correctIndex: 0,
        emoji: '🌱',
      },
      {
        question: 'What does the bee need?',
        questionTr: 'Arının neye ihtiyacı var?',
        options: ['To feed', 'To nap', 'To run'],
        correctIndex: 0,
        emoji: '🍯',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP 5 — add z, w, ng, v, oo(short), oo(long)
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g5-1',
    title: 'The King and the Zoo',
    titleTr: 'Kral ve Hayvanat Bahcesi',
    emoji: '👑',
    requiredGroup: 5,
    difficulty: 1,
    pages: [
      {
        text: 'The king went to the zoo.',
        illustration: '👑 🦁',
        highlightWords: ['king', 'zoo'],
      },
      {
        text: 'He took a long look.',
        illustration: '👑 👀',
        highlightWords: ['long', 'look'],
      },
      {
        text: 'A bee went buzz and zing!',
        illustration: '🐝 💫',
        highlightWords: ['buzz', 'zing'],
      },
      {
        text: 'The king sang a song.',
        illustration: '👑 🎵',
        highlightWords: ['sang', 'song'],
      },
      {
        text: 'The moon was cool and good.',
        illustration: '🌙 ✨',
        highlightWords: ['moon', 'cool', 'good'],
      },
    ],
    wordCount: 32,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Where did the king go?',
        questionTr: 'Kral nereye gitti?',
        options: ['The zoo', 'The farm', 'The park'],
        correctIndex: 0,
        emoji: '🦁',
      },
      {
        question: 'What did the king sing?',
        questionTr: 'Kral ne soyledi?',
        options: ['A song', 'A poem', 'A name'],
        correctIndex: 0,
        emoji: '🎵',
      },
      {
        question: 'What went buzz?',
        questionTr: 'Ne vizildadi?',
        options: ['A bee', 'A king', 'A van'],
        correctIndex: 0,
        emoji: '🐝',
      },
    ],
  },
  {
    id: 'book-g5-2',
    title: 'Win the Ring',
    titleTr: 'Yuzugu Kazan',
    emoji: '💍',
    requiredGroup: 5,
    difficulty: 2,
    pages: [
      {
        text: 'Vin had a van.',
        illustration: '🧑 🚐',
        highlightWords: ['Vin', 'van'],
      },
      {
        text: 'Vin got in the van to win a ring.',
        illustration: '🧑 🚐 💍',
        highlightWords: ['win', 'ring'],
      },
      {
        text: 'He took a good book.',
        illustration: '📖',
        highlightWords: ['good', 'book'],
      },
      {
        text: 'The wind was strong and long.',
        illustration: '🌬️',
        highlightWords: ['wind', 'strong', 'long'],
      },
      {
        text: 'Vin sang a song and won the ring!',
        illustration: '🧑 🎵 💍 ⭐',
        highlightWords: ['sang', 'song', 'won', 'ring'],
      },
    ],
    wordCount: 36,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'What did Vin want to win?',
        questionTr: 'Vin ne kazanmak istedi?',
        options: ['A ring', 'A hat', 'A van'],
        correctIndex: 0,
        emoji: '💍',
      },
      {
        question: 'What did Vin take?',
        questionTr: 'Vin ne aldi?',
        options: ['A good book', 'A red pen', 'A fat cat'],
        correctIndex: 0,
        emoji: '📖',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP 6 — add y, x, ch, sh, th(voiced), th(unvoiced)
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g6-1',
    title: 'The Fox in the Shop',
    titleTr: 'Dükkândaki Tilki',
    emoji: '🦊',
    requiredGroup: 6,
    difficulty: 1,
    pages: [
      {
        text: 'A fox got in the shop.',
        illustration: '🦊 🏪',
        highlightWords: ['fox', 'shop'],
      },
      {
        text: 'The fox had six chips.',
        illustration: '🦊 🍟',
        highlightWords: ['six', 'chips'],
      },
      {
        text: 'She shut the box with a thud.',
        illustration: '🦊 📦',
        highlightWords: ['shut', 'box', 'thud'],
      },
      {
        text: 'Then she chomped and chomped!',
        illustration: '🦊 😋',
        highlightWords: ['Then', 'chomped'],
      },
      {
        text: '"Yum!" yelled the fox. "That is the best!"',
        illustration: '🦊 ⭐ 😊',
        highlightWords: ['Yum', 'yelled', 'best'],
      },
    ],
    wordCount: 34,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Where did the fox go?',
        questionTr: 'Tilki nereye gitti?',
        options: ['The shop', 'The zoo', 'The den'],
        correctIndex: 0,
        emoji: '🏪',
      },
      {
        question: 'What did the fox eat?',
        questionTr: 'Tilki ne yedi?',
        options: ['Chips', 'A bun', 'A pie'],
        correctIndex: 0,
        emoji: '🍟',
      },
      {
        question: 'How many chips did she have?',
        questionTr: 'Kac tane cipsi vardi?',
        options: ['Six', 'Three', 'Ten'],
        correctIndex: 0,
        emoji: '6️⃣',
      },
    ],
  },
  {
    id: 'book-g6-2',
    title: 'Chick and the Ship',
    titleTr: 'Civciv ve Gemi',
    emoji: '🐤',
    requiredGroup: 6,
    difficulty: 2,
    pages: [
      {
        text: 'A thick chick got on a ship.',
        illustration: '🐤 🚢',
        highlightWords: ['thick', 'chick', 'ship'],
      },
      {
        text: 'The ship had a shed and a chest.',
        illustration: '🚢 🏚️ 🧰',
        highlightWords: ['shed', 'chest'],
      },
      {
        text: '"Yes!" yelled the chick. "This is fun!"',
        illustration: '🐤 😄',
        highlightWords: ['Yes', 'yelled', 'This'],
      },
      {
        text: 'The chick sat on the chest and sang.',
        illustration: '🐤 🧰 🎵',
        highlightWords: ['chest', 'sang'],
      },
      {
        text: 'Then the ship got to the shore.',
        illustration: '🚢 🏖️',
        highlightWords: ['Then', 'ship', 'shore'],
      },
      {
        text: 'The chick said, "That was the best trip!"',
        illustration: '🐤 ⭐ ⭐',
        highlightWords: ['That', 'best', 'trip'],
      },
    ],
    wordCount: 42,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'What did the chick get on?',
        questionTr: 'Civciv neye bindi?',
        options: ['A ship', 'A bus', 'A boat'],
        correctIndex: 0,
        emoji: '🚢',
      },
      {
        question: 'What was on the ship?',
        questionTr: 'Gemide ne vardi?',
        options: ['A shed and a chest', 'A hat and a mat', 'A dog and a cat'],
        correctIndex: 0,
        emoji: '🧰',
      },
      {
        question: 'Did the chick like the trip?',
        questionTr: 'Civciv geziyi sevdi mi?',
        options: ['Yes, it was the best!', 'No, it was bad.', 'No, it was sad.'],
        correctIndex: 0,
        emoji: '⭐',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP 7 — add qu, ou, oi, ue, er, ar
  // ════════════════════════════════════════════════════════════
  {
    id: 'book-g7-1',
    title: 'The Queen and the Star',
    titleTr: 'Kraliçe ve Yildiz',
    emoji: '👸',
    requiredGroup: 7,
    difficulty: 1,
    pages: [
      {
        text: 'The queen got in her car.',
        illustration: '👸 🚗',
        highlightWords: ['queen', 'her', 'car'],
      },
      {
        text: 'She drove far to the farm.',
        illustration: '🚗 🌾',
        highlightWords: ['far', 'farm'],
      },
      {
        text: 'A loud duck said, "Quack!"',
        illustration: '🦆 📢',
        highlightWords: ['loud', 'Quack'],
      },
      {
        text: 'The queen found a round coin.',
        illustration: '👸 🪙',
        highlightWords: ['found', 'round', 'coin'],
      },
      {
        text: '"A clue!" she said out loud.',
        illustration: '👸 🔎',
        highlightWords: ['clue', 'out', 'loud'],
      },
      {
        text: 'After a long quest, she found a star!',
        illustration: '👸 ⭐ ✨',
        highlightWords: ['After', 'quest', 'star'],
      },
    ],
    wordCount: 42,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Where did the queen drive?',
        questionTr: 'Kraliçe nereye gitti?',
        options: ['To the farm', 'To the zoo', 'To the ship'],
        correctIndex: 0,
        emoji: '🌾',
      },
      {
        question: 'What did the queen find?',
        questionTr: 'Kraliçe ne buldu?',
        options: ['A round coin', 'A red hat', 'A fat cat'],
        correctIndex: 0,
        emoji: '🪙',
      },
      {
        question: 'What was at the end?',
        questionTr: 'Sonda ne vardi?',
        options: ['A star', 'A ring', 'A fox'],
        correctIndex: 0,
        emoji: '⭐',
      },
    ],
  },
  {
    id: 'book-g7-2',
    title: 'The Dark Park',
    titleTr: 'Karanlık Park',
    emoji: '🌙',
    requiredGroup: 7,
    difficulty: 2,
    pages: [
      {
        text: 'It is dark in the park.',
        illustration: '🌙 🌳',
        highlightWords: ['dark', 'park'],
      },
      {
        text: 'Her sister sat under a fern.',
        illustration: '👧 🌿',
        highlightWords: ['Her', 'sister', 'fern'],
      },
      {
        text: 'A loud sound came out.',
        illustration: '📢 😮',
        highlightWords: ['loud', 'out'],
      },
      {
        text: 'Oil and soil on the ground.',
        illustration: '🛢️ 🌍',
        highlightWords: ['Oil', 'soil', 'ground'],
      },
      {
        text: 'Her sister found a blue clue!',
        illustration: '👧 🔵 🔎',
        highlightWords: ['blue', 'clue'],
      },
      {
        text: 'The stars are far but true.',
        illustration: '⭐ ✨ 🌙',
        highlightWords: ['stars', 'far', 'true'],
      },
    ],
    wordCount: 38,
    readingTimeMinutes: 2,
    comprehensionQuestions: [
      {
        question: 'Where is it dark?',
        questionTr: 'Neresi karanlik?',
        options: ['In the park', 'In the shop', 'In the zoo'],
        correctIndex: 0,
        emoji: '🌳',
      },
      {
        question: 'What did her sister find?',
        questionTr: 'Ablasi ne buldu?',
        options: ['A blue clue', 'A red hat', 'A big dog'],
        correctIndex: 0,
        emoji: '🔵',
      },
      {
        question: 'What is on the ground?',
        questionTr: 'Yerde ne var?',
        options: ['Oil and soil', 'Rain and mud', 'A cat and a dog'],
        correctIndex: 0,
        emoji: '🌍',
      },
    ],
  },
];

// --- HELPER FUNCTIONS ---

/**
 * Returns books available for a given mastered group level.
 */
export function getBooksForGroup(maxGroup: number): DecodableBook[] {
  return READING_LIBRARY.filter((book) => book.requiredGroup <= maxGroup);
}

/**
 * Returns books for a specific group only.
 */
export function getBooksInGroup(group: number): DecodableBook[] {
  return READING_LIBRARY.filter((book) => book.requiredGroup === group);
}

/**
 * Returns a specific book by ID.
 */
export function getBookById(id: string): DecodableBook | undefined {
  return READING_LIBRARY.find((book) => book.id === id);
}

/**
 * Calculate stars from comprehension score.
 * 0-1 correct = 1 star, 2 correct = 2 stars, 3 correct = 3 stars
 */
export function calculateStars(correctCount: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  const ratio = correctCount / totalQuestions;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

// --- BOOK COMPLETION TRACKING (localStorage) ---

const BOOK_PROGRESS_KEY = 'minesminis_book_progress';

export interface BookProgress {
  bookId: string;
  completed: boolean;
  stars: number;
  lastPageIndex: number;
  completedAt: string | null;
}

function loadBookProgress(): Record<string, BookProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(BOOK_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBookProgress(progress: Record<string, BookProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BOOK_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // localStorage quota exceeded or access denied
  }
}

/** Mark a book as completed with a star rating */
export function markBookCompleted(bookId: string, stars: number, totalPages: number, userId?: string): void {
  const all = loadBookProgress();
  const existing = all[bookId];
  all[bookId] = {
    bookId,
    completed: true,
    stars: Math.max(stars, existing?.stars ?? 0),
    lastPageIndex: totalPages - 1,
    completedAt: new Date().toISOString(),
  };
  saveBookProgress(all);

  // Async sync to Supabase
  if (userId) {
    import('../config/supabase').then(({ supabase }) => {
      supabase.from('user_activities').insert({
        user_id: userId,
        activity_type: 'book_completed',
        activity_name: bookId,
        xp_earned: stars * 5,
        metadata: { stars, totalPages, completed_at: new Date().toISOString() },
      }).then(() => {}).catch(() => {});
    }).catch(() => {});
  }
}

/** Save partial reading progress (bookmark) */
export function saveReadingBookmark(bookId: string, pageIndex: number, userId?: string): void {
  const all = loadBookProgress();
  const existing = all[bookId];
  all[bookId] = {
    bookId,
    completed: existing?.completed ?? false,
    stars: existing?.stars ?? 0,
    lastPageIndex: pageIndex,
    completedAt: existing?.completedAt ?? null,
  };
  saveBookProgress(all);

  // Async sync bookmark to Supabase (debounced by caller in practice)
  if (userId) {
    import('../config/supabase').then(({ supabase }) => {
      supabase.from('users').select('settings').eq('id', userId).maybeSingle().then(({ data }) => {
        const current = (data?.settings as Record<string, unknown>) ?? {};
        const bookmarks = (current.reading_bookmarks as Record<string, number>) ?? {};
        bookmarks[bookId] = pageIndex;
        supabase.from('users').update({
          settings: { ...current, reading_bookmarks: bookmarks },
        }).eq('id', userId).then(() => {}).catch(() => {});
      }).catch(() => {});
    }).catch(() => {});
  }
}

/** Get progress for a specific book */
export function getBookProgress(bookId: string): BookProgress | null {
  const all = loadBookProgress();
  return all[bookId] ?? null;
}

/** Get all completed book IDs */
export function getCompletedBookIds(): string[] {
  const all = loadBookProgress();
  return Object.values(all).filter(p => p.completed).map(p => p.bookId);
}

/** Get total completed books count */
export function getCompletedBooksCount(): number {
  return getCompletedBookIds().length;
}
