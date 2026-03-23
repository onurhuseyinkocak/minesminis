/**
 * BLENDING EXERCISES — Phase 6 of the Daily Lesson
 *
 * Comprehensive word lists for phonics blending and reading practice.
 * Structured across three levels:
 *   Level 1 — CVC words (consonant-vowel-consonant), organised by vowel family
 *   Level 2 — CCVC / CVCC words (consonant blends and digraphs)
 *   Level 3 — Magic-E / common digraphs (long vowels and multi-letter patterns)
 *
 * Also exports SIGHT_WORDS — high-frequency "tricky words" that must be
 * memorised rather than decoded phonetically.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlendingWord {
  word: string;
  letters: string[];       // individual graphemes: ['c', 'a', 't']
  phonemes: string[];      // IPA transcription: ['/k/', '/æ/', '/t/']
  turkish: string;
  emoji: string;
  level: 1 | 2 | 3;
  type: 'CVC' | 'CCVC' | 'CVCC' | 'CCVCC';
}

export interface SightWord {
  word: string;
  turkish: string;
  level: 1 | 2 | 3 | 4 | 5;
}

// ─── Level 1: CVC Words (60 words, 12 per short-vowel family) ────────────────

// Short-A family
const shortA: BlendingWord[] = [
  { word: 'cat', letters: ['c', 'a', 't'], phonemes: ['/k/', '/æ/', '/t/'], turkish: 'kedi', emoji: '🐱', level: 1, type: 'CVC' },
  { word: 'bat', letters: ['b', 'a', 't'], phonemes: ['/b/', '/æ/', '/t/'], turkish: 'yarasa', emoji: '🦇', level: 1, type: 'CVC' },
  { word: 'hat', letters: ['h', 'a', 't'], phonemes: ['/h/', '/æ/', '/t/'], turkish: 'şapka', emoji: '🎩', level: 1, type: 'CVC' },
  { word: 'mat', letters: ['m', 'a', 't'], phonemes: ['/m/', '/æ/', '/t/'], turkish: 'paspas', emoji: '🟫', level: 1, type: 'CVC' },
  { word: 'rat', letters: ['r', 'a', 't'], phonemes: ['/r/', '/æ/', '/t/'], turkish: 'sıçan', emoji: '🐀', level: 1, type: 'CVC' },
  { word: 'sat', letters: ['s', 'a', 't'], phonemes: ['/s/', '/æ/', '/t/'], turkish: 'oturdu', emoji: '💺', level: 1, type: 'CVC' },
  { word: 'bag', letters: ['b', 'a', 'g'], phonemes: ['/b/', '/æ/', '/g/'], turkish: 'çanta', emoji: '👜', level: 1, type: 'CVC' },
  { word: 'dad', letters: ['d', 'a', 'd'], phonemes: ['/d/', '/æ/', '/d/'], turkish: 'baba', emoji: '👨', level: 1, type: 'CVC' },
  { word: 'had', letters: ['h', 'a', 'd'], phonemes: ['/h/', '/æ/', '/d/'], turkish: 'vardı', emoji: '✅', level: 1, type: 'CVC' },
  { word: 'man', letters: ['m', 'a', 'n'], phonemes: ['/m/', '/æ/', '/n/'], turkish: 'adam', emoji: '👤', level: 1, type: 'CVC' },
  { word: 'pan', letters: ['p', 'a', 'n'], phonemes: ['/p/', '/æ/', '/n/'], turkish: 'tava', emoji: '🍳', level: 1, type: 'CVC' },
  { word: 'ran', letters: ['r', 'a', 'n'], phonemes: ['/r/', '/æ/', '/n/'], turkish: 'koştu', emoji: '🏃', level: 1, type: 'CVC' },
  { word: 'van', letters: ['v', 'a', 'n'], phonemes: ['/v/', '/æ/', '/n/'], turkish: 'minibüs', emoji: '🚐', level: 1, type: 'CVC' },
  { word: 'map', letters: ['m', 'a', 'p'], phonemes: ['/m/', '/æ/', '/p/'], turkish: 'harita', emoji: '🗺️', level: 1, type: 'CVC' },
  { word: 'tap', letters: ['t', 'a', 'p'], phonemes: ['/t/', '/æ/', '/p/'], turkish: 'musluk / dokunmak', emoji: '🚰', level: 1, type: 'CVC' },
  { word: 'cap', letters: ['c', 'a', 'p'], phonemes: ['/k/', '/æ/', '/p/'], turkish: 'kasket', emoji: '🧢', level: 1, type: 'CVC' },
  { word: 'nap', letters: ['n', 'a', 'p'], phonemes: ['/n/', '/æ/', '/p/'], turkish: 'kısa uyku', emoji: '😴', level: 1, type: 'CVC' },
  { word: 'gap', letters: ['g', 'a', 'p'], phonemes: ['/g/', '/æ/', '/p/'], turkish: 'boşluk', emoji: '↔️', level: 1, type: 'CVC' },
];

// Short-E family
const shortE: BlendingWord[] = [
  { word: 'bed', letters: ['b', 'e', 'd'], phonemes: ['/b/', '/ɛ/', '/d/'], turkish: 'yatak', emoji: '🛏️', level: 1, type: 'CVC' },
  { word: 'red', letters: ['r', 'e', 'd'], phonemes: ['/r/', '/ɛ/', '/d/'], turkish: 'kırmızı', emoji: '🔴', level: 1, type: 'CVC' },
  { word: 'leg', letters: ['l', 'e', 'g'], phonemes: ['/l/', '/ɛ/', '/g/'], turkish: 'bacak', emoji: '🦵', level: 1, type: 'CVC' },
  { word: 'hen', letters: ['h', 'e', 'n'], phonemes: ['/h/', '/ɛ/', '/n/'], turkish: 'tavuk', emoji: '🐔', level: 1, type: 'CVC' },
  { word: 'pen', letters: ['p', 'e', 'n'], phonemes: ['/p/', '/ɛ/', '/n/'], turkish: 'kalem', emoji: '✏️', level: 1, type: 'CVC' },
  { word: 'ten', letters: ['t', 'e', 'n'], phonemes: ['/t/', '/ɛ/', '/n/'], turkish: 'on', emoji: '🔟', level: 1, type: 'CVC' },
  { word: 'men', letters: ['m', 'e', 'n'], phonemes: ['/m/', '/ɛ/', '/n/'], turkish: 'erkekler', emoji: '👬', level: 1, type: 'CVC' },
  { word: 'pet', letters: ['p', 'e', 't'], phonemes: ['/p/', '/ɛ/', '/t/'], turkish: 'evcil hayvan', emoji: '🐾', level: 1, type: 'CVC' },
  { word: 'set', letters: ['s', 'e', 't'], phonemes: ['/s/', '/ɛ/', '/t/'], turkish: 'set / koymak', emoji: '📦', level: 1, type: 'CVC' },
  { word: 'wet', letters: ['w', 'e', 't'], phonemes: ['/w/', '/ɛ/', '/t/'], turkish: 'ıslak', emoji: '💦', level: 1, type: 'CVC' },
  { word: 'net', letters: ['n', 'e', 't'], phonemes: ['/n/', '/ɛ/', '/t/'], turkish: 'ağ', emoji: '🕸️', level: 1, type: 'CVC' },
  { word: 'jet', letters: ['j', 'e', 't'], phonemes: ['/dʒ/', '/ɛ/', '/t/'], turkish: 'uçak / jet', emoji: '✈️', level: 1, type: 'CVC' },
  { word: 'met', letters: ['m', 'e', 't'], phonemes: ['/m/', '/ɛ/', '/t/'], turkish: 'tanıştı', emoji: '🤝', level: 1, type: 'CVC' },
  { word: 'get', letters: ['g', 'e', 't'], phonemes: ['/g/', '/ɛ/', '/t/'], turkish: 'almak / gitmek', emoji: '👋', level: 1, type: 'CVC' },
  { word: 'let', letters: ['l', 'e', 't'], phonemes: ['/l/', '/ɛ/', '/t/'], turkish: 'izin vermek', emoji: '🟢', level: 1, type: 'CVC' },
  { word: 'yet', letters: ['y', 'e', 't'], phonemes: ['/j/', '/ɛ/', '/t/'], turkish: 'henüz', emoji: '⏳', level: 1, type: 'CVC' },
  { word: 'beg', letters: ['b', 'e', 'g'], phonemes: ['/b/', '/ɛ/', '/g/'], turkish: 'yalvarmak', emoji: '🙏', level: 1, type: 'CVC' },
  { word: 'peg', letters: ['p', 'e', 'g'], phonemes: ['/p/', '/ɛ/', '/g/'], turkish: 'mantar / kazık', emoji: '📌', level: 1, type: 'CVC' },
];

// Short-I family
const shortI: BlendingWord[] = [
  { word: 'big', letters: ['b', 'i', 'g'], phonemes: ['/b/', '/ɪ/', '/g/'], turkish: 'büyük', emoji: '🐘', level: 1, type: 'CVC' },
  { word: 'dig', letters: ['d', 'i', 'g'], phonemes: ['/d/', '/ɪ/', '/g/'], turkish: 'kazmak', emoji: '⛏️', level: 1, type: 'CVC' },
  { word: 'fig', letters: ['f', 'i', 'g'], phonemes: ['/f/', '/ɪ/', '/g/'], turkish: 'incir', emoji: '🌿', level: 1, type: 'CVC' },
  { word: 'pig', letters: ['p', 'i', 'g'], phonemes: ['/p/', '/ɪ/', '/g/'], turkish: 'domuz', emoji: '🐷', level: 1, type: 'CVC' },
  { word: 'wig', letters: ['w', 'i', 'g'], phonemes: ['/w/', '/ɪ/', '/g/'], turkish: 'peruk', emoji: '💇', level: 1, type: 'CVC' },
  { word: 'bin', letters: ['b', 'i', 'n'], phonemes: ['/b/', '/ɪ/', '/n/'], turkish: 'çöp kutusu', emoji: '🗑️', level: 1, type: 'CVC' },
  { word: 'fin', letters: ['f', 'i', 'n'], phonemes: ['/f/', '/ɪ/', '/n/'], turkish: 'yüzgeç', emoji: '🐟', level: 1, type: 'CVC' },
  { word: 'pin', letters: ['p', 'i', 'n'], phonemes: ['/p/', '/ɪ/', '/n/'], turkish: 'iğne', emoji: '📍', level: 1, type: 'CVC' },
  { word: 'tin', letters: ['t', 'i', 'n'], phonemes: ['/t/', '/ɪ/', '/n/'], turkish: 'teneke', emoji: '🥫', level: 1, type: 'CVC' },
  { word: 'win', letters: ['w', 'i', 'n'], phonemes: ['/w/', '/ɪ/', '/n/'], turkish: 'kazanmak', emoji: '🏆', level: 1, type: 'CVC' },
  { word: 'bit', letters: ['b', 'i', 't'], phonemes: ['/b/', '/ɪ/', '/t/'], turkish: 'parça / ısırmak', emoji: '🦷', level: 1, type: 'CVC' },
  { word: 'fit', letters: ['f', 'i', 't'], phonemes: ['/f/', '/ɪ/', '/t/'], turkish: 'uymak / sağlıklı', emoji: '💪', level: 1, type: 'CVC' },
  { word: 'hit', letters: ['h', 'i', 't'], phonemes: ['/h/', '/ɪ/', '/t/'], turkish: 'vurmak', emoji: '🥊', level: 1, type: 'CVC' },
  { word: 'kit', letters: ['k', 'i', 't'], phonemes: ['/k/', '/ɪ/', '/t/'], turkish: 'takım / kit', emoji: '🧰', level: 1, type: 'CVC' },
  { word: 'sit', letters: ['s', 'i', 't'], phonemes: ['/s/', '/ɪ/', '/t/'], turkish: 'oturmak', emoji: '💺', level: 1, type: 'CVC' },
  { word: 'lip', letters: ['l', 'i', 'p'], phonemes: ['/l/', '/ɪ/', '/p/'], turkish: 'dudak', emoji: '👄', level: 1, type: 'CVC' },
  { word: 'rip', letters: ['r', 'i', 'p'], phonemes: ['/r/', '/ɪ/', '/p/'], turkish: 'yırtmak', emoji: '✂️', level: 1, type: 'CVC' },
  { word: 'tip', letters: ['t', 'i', 'p'], phonemes: ['/t/', '/ɪ/', '/p/'], turkish: 'uç / ipucu', emoji: '💡', level: 1, type: 'CVC' },
  { word: 'zip', letters: ['z', 'i', 'p'], phonemes: ['/z/', '/ɪ/', '/p/'], turkish: 'fermuar', emoji: '🤐', level: 1, type: 'CVC' },
];

// Short-O family
const shortO: BlendingWord[] = [
  { word: 'box', letters: ['b', 'o', 'x'], phonemes: ['/b/', '/ɒ/', '/ks/'], turkish: 'kutu', emoji: '📦', level: 1, type: 'CVC' },
  { word: 'fox', letters: ['f', 'o', 'x'], phonemes: ['/f/', '/ɒ/', '/ks/'], turkish: 'tilki', emoji: '🦊', level: 1, type: 'CVC' },
  { word: 'dog', letters: ['d', 'o', 'g'], phonemes: ['/d/', '/ɒ/', '/g/'], turkish: 'köpek', emoji: '🐶', level: 1, type: 'CVC' },
  { word: 'fog', letters: ['f', 'o', 'g'], phonemes: ['/f/', '/ɒ/', '/g/'], turkish: 'sis', emoji: '🌫️', level: 1, type: 'CVC' },
  { word: 'hot', letters: ['h', 'o', 't'], phonemes: ['/h/', '/ɒ/', '/t/'], turkish: 'sıcak', emoji: '🔥', level: 1, type: 'CVC' },
  { word: 'pot', letters: ['p', 'o', 't'], phonemes: ['/p/', '/ɒ/', '/t/'], turkish: 'tencere', emoji: '🫕', level: 1, type: 'CVC' },
  { word: 'dot', letters: ['d', 'o', 't'], phonemes: ['/d/', '/ɒ/', '/t/'], turkish: 'nokta', emoji: '⚫', level: 1, type: 'CVC' },
  { word: 'lot', letters: ['l', 'o', 't'], phonemes: ['/l/', '/ɒ/', '/t/'], turkish: 'çok / lot', emoji: '🔢', level: 1, type: 'CVC' },
  { word: 'not', letters: ['n', 'o', 't'], phonemes: ['/n/', '/ɒ/', '/t/'], turkish: 'değil', emoji: '❌', level: 1, type: 'CVC' },
  { word: 'got', letters: ['g', 'o', 't'], phonemes: ['/g/', '/ɒ/', '/t/'], turkish: 'aldı / oldu', emoji: '✅', level: 1, type: 'CVC' },
  { word: 'mop', letters: ['m', 'o', 'p'], phonemes: ['/m/', '/ɒ/', '/p/'], turkish: 'paspas', emoji: '🧹', level: 1, type: 'CVC' },
  { word: 'top', letters: ['t', 'o', 'p'], phonemes: ['/t/', '/ɒ/', '/p/'], turkish: 'üst / top', emoji: '🔝', level: 1, type: 'CVC' },
  { word: 'hop', letters: ['h', 'o', 'p'], phonemes: ['/h/', '/ɒ/', '/p/'], turkish: 'sıçramak', emoji: '🐸', level: 1, type: 'CVC' },
  { word: 'pop', letters: ['p', 'o', 'p'], phonemes: ['/p/', '/ɒ/', '/p/'], turkish: 'patlamak', emoji: '🎈', level: 1, type: 'CVC' },
  { word: 'log', letters: ['l', 'o', 'g'], phonemes: ['/l/', '/ɒ/', '/g/'], turkish: 'kütük', emoji: '🪵', level: 1, type: 'CVC' },
  { word: 'cob', letters: ['c', 'o', 'b'], phonemes: ['/k/', '/ɒ/', '/b/'], turkish: 'mısır koçanı', emoji: '🌽', level: 1, type: 'CVC' },
  { word: 'job', letters: ['j', 'o', 'b'], phonemes: ['/dʒ/', '/ɒ/', '/b/'], turkish: 'iş', emoji: '💼', level: 1, type: 'CVC' },
  { word: 'rob', letters: ['r', 'o', 'b'], phonemes: ['/r/', '/ɒ/', '/b/'], turkish: 'soymak', emoji: '🦹', level: 1, type: 'CVC' },
];

// Short-U family
const shortU: BlendingWord[] = [
  { word: 'bug', letters: ['b', 'u', 'g'], phonemes: ['/b/', '/ʌ/', '/g/'], turkish: 'böcek', emoji: '🐛', level: 1, type: 'CVC' },
  { word: 'hug', letters: ['h', 'u', 'g'], phonemes: ['/h/', '/ʌ/', '/g/'], turkish: 'sarılmak', emoji: '🤗', level: 1, type: 'CVC' },
  { word: 'jug', letters: ['j', 'u', 'g'], phonemes: ['/dʒ/', '/ʌ/', '/g/'], turkish: 'sürahi', emoji: '🫙', level: 1, type: 'CVC' },
  { word: 'mug', letters: ['m', 'u', 'g'], phonemes: ['/m/', '/ʌ/', '/g/'], turkish: 'kupa', emoji: '☕', level: 1, type: 'CVC' },
  { word: 'rug', letters: ['r', 'u', 'g'], phonemes: ['/r/', '/ʌ/', '/g/'], turkish: 'kilim', emoji: '🟫', level: 1, type: 'CVC' },
  { word: 'tug', letters: ['t', 'u', 'g'], phonemes: ['/t/', '/ʌ/', '/g/'], turkish: 'çekmek', emoji: '🚢', level: 1, type: 'CVC' },
  { word: 'bun', letters: ['b', 'u', 'n'], phonemes: ['/b/', '/ʌ/', '/n/'], turkish: 'topuz / çörek', emoji: '🍞', level: 1, type: 'CVC' },
  { word: 'fun', letters: ['f', 'u', 'n'], phonemes: ['/f/', '/ʌ/', '/n/'], turkish: 'eğlence', emoji: '🎉', level: 1, type: 'CVC' },
  { word: 'gun', letters: ['g', 'u', 'n'], phonemes: ['/g/', '/ʌ/', '/n/'], turkish: 'silah', emoji: '🔫', level: 1, type: 'CVC' },
  { word: 'run', letters: ['r', 'u', 'n'], phonemes: ['/r/', '/ʌ/', '/n/'], turkish: 'koşmak', emoji: '🏃', level: 1, type: 'CVC' },
  { word: 'sun', letters: ['s', 'u', 'n'], phonemes: ['/s/', '/ʌ/', '/n/'], turkish: 'güneş', emoji: '☀️', level: 1, type: 'CVC' },
  { word: 'bus', letters: ['b', 'u', 's'], phonemes: ['/b/', '/ʌ/', '/s/'], turkish: 'otobüs', emoji: '🚌', level: 1, type: 'CVC' },
  { word: 'cup', letters: ['c', 'u', 'p'], phonemes: ['/k/', '/ʌ/', '/p/'], turkish: 'bardak', emoji: '🥤', level: 1, type: 'CVC' },
  { word: 'cut', letters: ['c', 'u', 't'], phonemes: ['/k/', '/ʌ/', '/t/'], turkish: 'kesmek', emoji: '✂️', level: 1, type: 'CVC' },
  { word: 'but', letters: ['b', 'u', 't'], phonemes: ['/b/', '/ʌ/', '/t/'], turkish: 'ama / fakat', emoji: '↔️', level: 1, type: 'CVC' },
  { word: 'nut', letters: ['n', 'u', 't'], phonemes: ['/n/', '/ʌ/', '/t/'], turkish: 'fındık / somun', emoji: '🥜', level: 1, type: 'CVC' },
  { word: 'pup', letters: ['p', 'u', 'p'], phonemes: ['/p/', '/ʌ/', '/p/'], turkish: 'yavru köpek', emoji: '🐶', level: 1, type: 'CVC' },
  { word: 'mud', letters: ['m', 'u', 'd'], phonemes: ['/m/', '/ʌ/', '/d/'], turkish: 'çamur', emoji: '🟤', level: 1, type: 'CVC' },
];

// ─── Level 2: CCVC / CVCC — Consonant Blends & Digraphs (30 words) ───────────

const level2Words: BlendingWord[] = [
  // Digraphs: sh, ch, th
  { word: 'ship', letters: ['sh', 'i', 'p'], phonemes: ['/ʃ/', '/ɪ/', '/p/'], turkish: 'gemi', emoji: '🚢', level: 2, type: 'CCVC' },
  { word: 'shop', letters: ['sh', 'o', 'p'], phonemes: ['/ʃ/', '/ɒ/', '/p/'], turkish: 'dükkan', emoji: '🛒', level: 2, type: 'CCVC' },
  { word: 'chin', letters: ['ch', 'i', 'n'], phonemes: ['/tʃ/', '/ɪ/', '/n/'], turkish: 'çene', emoji: '🫦', level: 2, type: 'CCVC' },
  { word: 'chop', letters: ['ch', 'o', 'p'], phonemes: ['/tʃ/', '/ɒ/', '/p/'], turkish: 'doğramak', emoji: '🔪', level: 2, type: 'CCVC' },
  { word: 'thin', letters: ['th', 'i', 'n'], phonemes: ['/θ/', '/ɪ/', '/n/'], turkish: 'ince', emoji: '🦒', level: 2, type: 'CCVC' },
  { word: 'that', letters: ['th', 'a', 't'], phonemes: ['/ð/', '/æ/', '/t/'], turkish: 'o (şu)', emoji: '👉', level: 2, type: 'CCVC' },
  { word: 'this', letters: ['th', 'i', 's'], phonemes: ['/ð/', '/ɪ/', '/s/'], turkish: 'bu', emoji: '👈', level: 2, type: 'CCVC' },
  { word: 'then', letters: ['th', 'e', 'n'], phonemes: ['/ð/', '/ɛ/', '/n/'], turkish: 'sonra / o zaman', emoji: '➡️', level: 2, type: 'CCVC' },
  // Initial blends: cl, fl, fr, st, sn, sp, dr, sw, tw
  { word: 'clap', letters: ['cl', 'a', 'p'], phonemes: ['/k/', '/l/', '/æ/', '/p/'], turkish: 'alkışlamak', emoji: '👏', level: 2, type: 'CCVC' },
  { word: 'clip', letters: ['cl', 'i', 'p'], phonemes: ['/k/', '/l/', '/ɪ/', '/p/'], turkish: 'klip / kıskaç', emoji: '📎', level: 2, type: 'CCVC' },
  { word: 'flag', letters: ['fl', 'a', 'g'], phonemes: ['/f/', '/l/', '/æ/', '/g/'], turkish: 'bayrak', emoji: '🚩', level: 2, type: 'CCVC' },
  { word: 'flat', letters: ['fl', 'a', 't'], phonemes: ['/f/', '/l/', '/æ/', '/t/'], turkish: 'düz / daire', emoji: '🏠', level: 2, type: 'CCVC' },
  { word: 'frog', letters: ['fr', 'o', 'g'], phonemes: ['/f/', '/r/', '/ɒ/', '/g/'], turkish: 'kurbağa', emoji: '🐸', level: 2, type: 'CCVC' },
  { word: 'from', letters: ['fr', 'o', 'm'], phonemes: ['/f/', '/r/', '/ɒ/', '/m/'], turkish: '-den / -dan', emoji: '↩️', level: 2, type: 'CCVC' },
  { word: 'stop', letters: ['st', 'o', 'p'], phonemes: ['/s/', '/t/', '/ɒ/', '/p/'], turkish: 'durmak', emoji: '🛑', level: 2, type: 'CCVC' },
  { word: 'step', letters: ['st', 'e', 'p'], phonemes: ['/s/', '/t/', '/ɛ/', '/p/'], turkish: 'adım', emoji: '👟', level: 2, type: 'CCVC' },
  { word: 'snap', letters: ['sn', 'a', 'p'], phonemes: ['/s/', '/n/', '/æ/', '/p/'], turkish: 'çıtlatmak / snap', emoji: '🫰', level: 2, type: 'CCVC' },
  { word: 'spin', letters: ['sp', 'i', 'n'], phonemes: ['/s/', '/p/', '/ɪ/', '/n/'], turkish: 'dönmek', emoji: '🌀', level: 2, type: 'CCVC' },
  { word: 'drum', letters: ['dr', 'u', 'm'], phonemes: ['/d/', '/r/', '/ʌ/', '/m/'], turkish: 'davul', emoji: '🥁', level: 2, type: 'CCVC' },
  { word: 'drop', letters: ['dr', 'o', 'p'], phonemes: ['/d/', '/r/', '/ɒ/', '/p/'], turkish: 'düşürmek', emoji: '💧', level: 2, type: 'CCVC' },
  { word: 'swim', letters: ['sw', 'i', 'm'], phonemes: ['/s/', '/w/', '/ɪ/', '/m/'], turkish: 'yüzmek', emoji: '🏊', level: 2, type: 'CCVC' },
  { word: 'twin', letters: ['tw', 'i', 'n'], phonemes: ['/t/', '/w/', '/ɪ/', '/n/'], turkish: 'ikiz', emoji: '👯', level: 2, type: 'CCVC' },
  // Final blends: CVCC
  { word: 'milk', letters: ['m', 'i', 'lk'], phonemes: ['/m/', '/ɪ/', '/l/', '/k/'], turkish: 'süt', emoji: '🥛', level: 2, type: 'CVCC' },
  { word: 'hand', letters: ['h', 'a', 'nd'], phonemes: ['/h/', '/æ/', '/n/', '/d/'], turkish: 'el', emoji: '✋', level: 2, type: 'CVCC' },
  { word: 'jump', letters: ['j', 'u', 'mp'], phonemes: ['/dʒ/', '/ʌ/', '/m/', '/p/'], turkish: 'zıplamak', emoji: '⬆️', level: 2, type: 'CVCC' },
  { word: 'lamp', letters: ['l', 'a', 'mp'], phonemes: ['/l/', '/æ/', '/m/', '/p/'], turkish: 'lamba', emoji: '💡', level: 2, type: 'CVCC' },
  { word: 'nest', letters: ['n', 'e', 'st'], phonemes: ['/n/', '/ɛ/', '/s/', '/t/'], turkish: 'yuva / yuvası', emoji: '🪺', level: 2, type: 'CVCC' },
  { word: 'pond', letters: ['p', 'o', 'nd'], phonemes: ['/p/', '/ɒ/', '/n/', '/d/'], turkish: 'gölet', emoji: '🫧', level: 2, type: 'CVCC' },
  { word: 'ring', letters: ['r', 'i', 'ng'], phonemes: ['/r/', '/ɪ/', '/ŋ/'], turkish: 'yüzük / zil', emoji: '💍', level: 2, type: 'CVCC' },
  { word: 'sing', letters: ['s', 'i', 'ng'], phonemes: ['/s/', '/ɪ/', '/ŋ/'], turkish: 'şarkı söylemek', emoji: '🎵', level: 2, type: 'CVCC' },
];

// ─── Level 3: Magic-E / Common Digraphs (20 words) ───────────────────────────

const level3Words: BlendingWord[] = [
  // Magic-E (CVCe) — long vowels
  { word: 'cake', letters: ['c', 'a', 'k', 'e'], phonemes: ['/k/', '/eɪ/', '/k/'], turkish: 'kek', emoji: '🎂', level: 3, type: 'CCVC' },
  { word: 'make', letters: ['m', 'a', 'k', 'e'], phonemes: ['/m/', '/eɪ/', '/k/'], turkish: 'yapmak', emoji: '🔨', level: 3, type: 'CCVC' },
  { word: 'bike', letters: ['b', 'i', 'k', 'e'], phonemes: ['/b/', '/aɪ/', '/k/'], turkish: 'bisiklet', emoji: '🚲', level: 3, type: 'CCVC' },
  { word: 'like', letters: ['l', 'i', 'k', 'e'], phonemes: ['/l/', '/aɪ/', '/k/'], turkish: 'sevmek', emoji: '❤️', level: 3, type: 'CCVC' },
  { word: 'home', letters: ['h', 'o', 'm', 'e'], phonemes: ['/h/', '/oʊ/', '/m/'], turkish: 'ev', emoji: '🏠', level: 3, type: 'CCVC' },
  { word: 'bone', letters: ['b', 'o', 'n', 'e'], phonemes: ['/b/', '/oʊ/', '/n/'], turkish: 'kemik', emoji: '🦴', level: 3, type: 'CCVC' },
  { word: 'cute', letters: ['c', 'u', 't', 'e'], phonemes: ['/k/', '/juː/', '/t/'], turkish: 'sevimli / şirin', emoji: '🥰', level: 3, type: 'CCVC' },
  { word: 'June', letters: ['J', 'u', 'n', 'e'], phonemes: ['/dʒ/', '/uː/', '/n/'], turkish: 'Haziran', emoji: '📅', level: 3, type: 'CCVC' },
  // Vowel digraphs — long vowel pairs
  { word: 'rain', letters: ['r', 'ai', 'n'], phonemes: ['/r/', '/eɪ/', '/n/'], turkish: 'yağmur', emoji: '🌧️', level: 3, type: 'CCVC' },
  { word: 'train', letters: ['tr', 'ai', 'n'], phonemes: ['/t/', '/r/', '/eɪ/', '/n/'], turkish: 'tren', emoji: '🚂', level: 3, type: 'CCVCC' },
  { word: 'boat', letters: ['b', 'oa', 't'], phonemes: ['/b/', '/oʊ/', '/t/'], turkish: 'tekne', emoji: '⛵', level: 3, type: 'CVC' },
  { word: 'road', letters: ['r', 'oa', 'd'], phonemes: ['/r/', '/oʊ/', '/d/'], turkish: 'yol', emoji: '🛣️', level: 3, type: 'CVC' },
  // gh digraph
  { word: 'night', letters: ['n', 'igh', 't'], phonemes: ['/n/', '/aɪ/', '/t/'], turkish: 'gece', emoji: '🌙', level: 3, type: 'CVCC' },
  { word: 'light', letters: ['l', 'igh', 't'], phonemes: ['/l/', '/aɪ/', '/t/'], turkish: 'ışık', emoji: '💡', level: 3, type: 'CVCC' },
  // ou / ow diphthongs
  { word: 'cloud', letters: ['cl', 'ou', 'd'], phonemes: ['/k/', '/l/', '/aʊ/', '/d/'], turkish: 'bulut', emoji: '☁️', level: 3, type: 'CCVC' },
  { word: 'house', letters: ['h', 'ou', 's', 'e'], phonemes: ['/h/', '/aʊ/', '/s/'], turkish: 'ev', emoji: '🏡', level: 3, type: 'CVCC' },
  // ee digraph
  { word: 'three', letters: ['thr', 'ee'], phonemes: ['/θ/', '/r/', '/iː/'], turkish: 'üç', emoji: '3️⃣', level: 3, type: 'CCVC' },
  { word: 'green', letters: ['gr', 'ee', 'n'], phonemes: ['/g/', '/r/', '/iː/', '/n/'], turkish: 'yeşil', emoji: '🟢', level: 3, type: 'CCVC' },
  { word: 'sleep', letters: ['sl', 'ee', 'p'], phonemes: ['/s/', '/l/', '/iː/', '/p/'], turkish: 'uyumak', emoji: '😴', level: 3, type: 'CCVC' },
  { word: 'teeth', letters: ['t', 'ee', 'th'], phonemes: ['/t/', '/iː/', '/θ/'], turkish: 'dişler', emoji: '🦷', level: 3, type: 'CVCC' },
];

// ─── Master export ────────────────────────────────────────────────────────────

export const BLENDING_WORDS: BlendingWord[] = [
  ...shortA,
  ...shortE,
  ...shortI,
  ...shortO,
  ...shortU,
  ...level2Words,
  ...level3Words,
];

// Convenience getters

export function getBlendingWordsByLevel(level: 1 | 2 | 3): BlendingWord[] {
  return BLENDING_WORDS.filter((w) => w.level === level);
}

export function getBlendingWordsByType(type: BlendingWord['type']): BlendingWord[] {
  return BLENDING_WORDS.filter((w) => w.type === type);
}

export function getBlendingWordsByVowelFamily(
  vowel: 'short-a' | 'short-e' | 'short-i' | 'short-o' | 'short-u',
): BlendingWord[] {
  const familyMap: Record<string, BlendingWord[]> = {
    'short-a': shortA,
    'short-e': shortE,
    'short-i': shortI,
    'short-o': shortO,
    'short-u': shortU,
  };
  return familyMap[vowel] ?? [];
}

// ─── Sight Words (Tricky Words) ───────────────────────────────────────────────
//
// These words violate standard phonics rules and must be recognised by sight.
// They are organised across 5 levels, with Level 1 being the most frequently
// encountered in early reading texts.

export const SIGHT_WORDS: SightWord[] = [
  // ── Level 1 — absolute high frequency ─────────────────────────────────────
  { word: 'the',   turkish: '-',           level: 1 },
  { word: 'is',    turkish: '-dir',        level: 1 },
  { word: 'a',     turkish: 'bir',         level: 1 },
  { word: 'I',     turkish: 'ben',         level: 1 },
  { word: 'to',    turkish: '-e / -a',     level: 1 },
  { word: 'and',   turkish: 've',          level: 1 },
  { word: 'you',   turkish: 'sen',         level: 1 },
  { word: 'it',    turkish: 'o',           level: 1 },
  { word: 'in',    turkish: 'içinde',      level: 1 },
  { word: 'my',    turkish: 'benim',       level: 1 },

  // ── Level 2 — common function words ───────────────────────────────────────
  { word: 'he',    turkish: 'o (erkek)',   level: 2 },
  { word: 'she',   turkish: 'o (kız)',     level: 2 },
  { word: 'we',    turkish: 'biz',         level: 2 },
  { word: 'they',  turkish: 'onlar',       level: 2 },
  { word: 'was',   turkish: 'idi',         level: 2 },
  { word: 'are',   turkish: '-dir (çoğul)', level: 2 },
  { word: 'for',   turkish: 'için',        level: 2 },
  { word: 'have',  turkish: 'sahip olmak', level: 2 },
  { word: 'his',   turkish: 'onun',        level: 2 },
  { word: 'her',   turkish: 'onun (kız)',  level: 2 },

  // ── Level 3 — extended high-frequency ─────────────────────────────────────
  { word: 'said',  turkish: 'dedi',        level: 3 },
  { word: 'here',  turkish: 'burada',      level: 3 },
  { word: 'there', turkish: 'orada',       level: 3 },
  { word: 'where', turkish: 'nerede',      level: 3 },
  { word: 'come',  turkish: 'gelmek',      level: 3 },
  { word: 'some',  turkish: 'biraz',       level: 3 },
  { word: 'one',   turkish: 'bir',         level: 3 },
  { word: 'two',   turkish: 'iki',         level: 3 },
  { word: 'of',    turkish: '-in / -nın',  level: 3 },
  { word: 'do',    turkish: 'yapmak',      level: 3 },

  // ── Level 4 — academic & connector words ──────────────────────────────────
  { word: 'what',   turkish: 'ne',          level: 4 },
  { word: 'when',   turkish: 'ne zaman',    level: 4 },
  { word: 'who',    turkish: 'kim',         level: 4 },
  { word: 'which',  turkish: 'hangi',       level: 4 },
  { word: 'would',  turkish: '-rdı / ister', level: 4 },
  { word: 'could',  turkish: '-bilirdi',    level: 4 },
  { word: 'should', turkish: '-malı',       level: 4 },
  { word: 'their',  turkish: 'onların',     level: 4 },
  { word: 'your',   turkish: 'senin',       level: 4 },
  { word: 'our',    turkish: 'bizim',       level: 4 },

  // ── Level 5 — advanced sight words ────────────────────────────────────────
  { word: 'because', turkish: 'çünkü',       level: 5 },
  { word: 'through', turkish: 'boyunca',     level: 5 },
  { word: 'enough',  turkish: 'yeterli',     level: 5 },
  { word: 'thought', turkish: 'düşündü',     level: 5 },
  { word: 'though',  turkish: 'olsa da',     level: 5 },
  { word: 'bought',  turkish: 'satın aldı',  level: 5 },
  { word: 'brought', turkish: 'getirdi',     level: 5 },
  { word: 'friend',  turkish: 'arkadaş',     level: 5 },
  { word: 'people',  turkish: 'insanlar',    level: 5 },
  { word: 'again',   turkish: 'yeniden',     level: 5 },
];

export function getSightWordsByLevel(level: 1 | 2 | 3 | 4 | 5): SightWord[] {
  return SIGHT_WORDS.filter((w) => w.level === level);
}
