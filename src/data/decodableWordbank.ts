// ============================================================
// MinesMinis Decodable Word Bank
// Words organized by Jolly Phonics group (1-7)
// Each word lists the sound IDs it requires (from phonics.ts)
// ============================================================

export interface DecodableWord {
  word: string;
  wordTr: string;
  phonics: string[];      // sound IDs this word uses: ['g1_s', 'g1_a', 'g1_t']
  maxGroup: number;       // highest phonics group needed (1-7)
  isSightWord: boolean;   // sight words bypass phonics constraint
  syllableCount: number;
  frequency: number;      // 1-10 (how common in children's text)
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection';
}

// ─── GROUP 1 WORDS: s, a, t, i, p, n ─────────────────────────────────────────
// Sound IDs: g1_s, g1_a, g1_t, g1_i, g1_p, g1_n

const group1Words: DecodableWord[] = [
  { word: 'sat', wordTr: 'oturdu', phonics: ['g1_s', 'g1_a', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'sit', wordTr: 'otur', phonics: ['g1_s', 'g1_i', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'sip', wordTr: 'yudum', phonics: ['g1_s', 'g1_i', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'tap', wordTr: 'dokun', phonics: ['g1_t', 'g1_a', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'tip', wordTr: 'uç', phonics: ['g1_t', 'g1_i', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'tin', wordTr: 'teneke', phonics: ['g1_t', 'g1_i', 'g1_n'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'pin', wordTr: 'iğne', phonics: ['g1_p', 'g1_i', 'g1_n'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'pan', wordTr: 'tava', phonics: ['g1_p', 'g1_a', 'g1_n'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'nap', wordTr: 'şekerleme', phonics: ['g1_n', 'g1_a', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'nut', wordTr: 'fındık', phonics: ['g1_n', 'g1_i', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 2, partOfSpeech: 'noun' },
  { word: 'pit', wordTr: 'çukur', phonics: ['g1_p', 'g1_i', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'pat', wordTr: 'hafifçe vur', phonics: ['g1_p', 'g1_a', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'tan', wordTr: 'ten rengi', phonics: ['g1_t', 'g1_a', 'g1_n'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'adjective' },
  { word: 'snap', wordTr: 'çıtla', phonics: ['g1_s', 'g1_n', 'g1_a', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'spin', wordTr: 'dön', phonics: ['g1_s', 'g1_p', 'g1_i', 'g1_n'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'pant', wordTr: 'solumak', phonics: ['g1_p', 'g1_a', 'g1_n', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 3, partOfSpeech: 'verb' },
  { word: 'ant', wordTr: 'karınca', phonics: ['g1_a', 'g1_n', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'nip', wordTr: 'çimdik', phonics: ['g1_n', 'g1_i', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 3, partOfSpeech: 'verb' },
  { word: 'pans', wordTr: 'tavalar', phonics: ['g1_p', 'g1_a', 'g1_n', 'g1_s'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 3, partOfSpeech: 'noun' },
  { word: 'naps', wordTr: 'şekerlemeler', phonics: ['g1_n', 'g1_a', 'g1_p', 'g1_s'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 2, partOfSpeech: 'noun' },
  { word: 'mint', wordTr: 'nane', phonics: ['g2_m', 'g1_i', 'g1_n', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 3, partOfSpeech: 'noun' },
  { word: 'past', wordTr: 'geçmiş', phonics: ['g1_p', 'g1_a', 'g1_s', 'g1_t'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'snip', wordTr: 'kırp', phonics: ['g1_s', 'g1_n', 'g1_i', 'g1_p'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 3, partOfSpeech: 'verb' },
  { word: 'pita', wordTr: 'pita ekmek', phonics: ['g1_p', 'g1_i', 'g1_t', 'g1_a'], maxGroup: 1, isSightWord: false, syllableCount: 2, frequency: 3, partOfSpeech: 'noun' },
  { word: 'taps', wordTr: 'musluklar', phonics: ['g1_t', 'g1_a', 'g1_p', 'g1_s'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'tips', wordTr: 'uçlar', phonics: ['g1_t', 'g1_i', 'g1_p', 'g1_s'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'pins', wordTr: 'iğneler', phonics: ['g1_p', 'g1_i', 'g1_n', 'g1_s'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 3, partOfSpeech: 'noun' },
  { word: 'ants', wordTr: 'karıncalar', phonics: ['g1_a', 'g1_n', 'g1_t', 'g1_s'], maxGroup: 1, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
];

// ─── GROUP 2 WORDS: c/k, e, h, r, m, d ───────────────────────────────────────
// Adds sound IDs: g2_ck, g2_e, g2_h, g2_r, g2_m, g2_d

const group2Words: DecodableWord[] = [
  { word: 'cat', wordTr: 'kedi', phonics: ['g2_ck', 'g1_a', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'noun' },
  { word: 'hat', wordTr: 'şapka', phonics: ['g2_h', 'g1_a', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'mat', wordTr: 'paspas', phonics: ['g2_m', 'g1_a', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'red', wordTr: 'kırmızı', phonics: ['g2_r', 'g2_e', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adjective' },
  { word: 'hen', wordTr: 'tavuk', phonics: ['g2_h', 'g2_e', 'g1_n'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'men', wordTr: 'erkekler', phonics: ['g2_m', 'g2_e', 'g1_n'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'den', wordTr: 'in', phonics: ['g2_d', 'g2_e', 'g1_n'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'ran', wordTr: 'koştu', phonics: ['g2_r', 'g1_a', 'g1_n'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'mad', wordTr: 'kızgın', phonics: ['g2_m', 'g1_a', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'dad', wordTr: 'baba', phonics: ['g2_d', 'g1_a', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'dim', wordTr: 'loş', phonics: ['g2_d', 'g1_i', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'adjective' },
  { word: 'him', wordTr: 'onu', phonics: ['g2_h', 'g1_i', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'kid', wordTr: 'çocuk', phonics: ['g2_ck', 'g1_i', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'hid', wordTr: 'saklandı', phonics: ['g2_h', 'g1_i', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'met', wordTr: 'tanıştı', phonics: ['g2_m', 'g2_e', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'set', wordTr: 'koy', phonics: ['g1_s', 'g2_e', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'pet', wordTr: 'evcil hayvan', phonics: ['g1_p', 'g2_e', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'pen', wordTr: 'kalem', phonics: ['g1_p', 'g2_e', 'g1_n'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'map', wordTr: 'harita', phonics: ['g2_m', 'g1_a', 'g1_p'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'cap', wordTr: 'kasket', phonics: ['g2_ck', 'g1_a', 'g1_p'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'ram', wordTr: 'koç', phonics: ['g2_r', 'g1_a', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'dip', wordTr: 'daldır', phonics: ['g2_d', 'g1_i', 'g1_p'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'rip', wordTr: 'yırt', phonics: ['g2_r', 'g1_i', 'g1_p'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'hid', wordTr: 'saklandı', phonics: ['g2_h', 'g1_i', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'kit', wordTr: 'takım', phonics: ['g2_ck', 'g1_i', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'kit', wordTr: 'takım/set', phonics: ['g2_ck', 'g1_i', 'g1_t'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'hum', wordTr: 'mırılda', phonics: ['g2_h', 'g3_u', 'g2_m'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'drum', wordTr: 'davul', phonics: ['g2_d', 'g2_r', 'g3_u', 'g2_m'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'team', wordTr: 'takım', phonics: ['g1_t', 'g2_e', 'g1_a', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'rim', wordTr: 'kenar', phonics: ['g2_r', 'g1_i', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'mid', wordTr: 'orta', phonics: ['g2_m', 'g1_i', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'adjective' },
  { word: 'ham', wordTr: 'jambon', phonics: ['g2_h', 'g1_a', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'hem', wordTr: 'kenar', phonics: ['g2_h', 'g2_e', 'g2_m'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'had', wordTr: 'vardı', phonics: ['g2_h', 'g1_a', 'g2_d'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'can', wordTr: 'kutu', phonics: ['g2_ck', 'g1_a', 'g1_n'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'jam', wordTr: 'reçel', phonics: ['g4_j', 'g1_a', 'g2_m'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'hut', wordTr: 'kulübe', phonics: ['g2_h', 'g3_u', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'drip', wordTr: 'damlat', phonics: ['g2_d', 'g2_r', 'g1_i', 'g1_p'], maxGroup: 2, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
];

// ─── GROUP 3 WORDS: g, o, u, l, f, b ─────────────────────────────────────────
// Adds sound IDs: g3_g, g3_o, g3_u, g3_l, g3_f, g3_b

const group3Words: DecodableWord[] = [
  { word: 'dog', wordTr: 'köpek', phonics: ['g2_d', 'g3_o', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'noun' },
  { word: 'log', wordTr: 'kütük', phonics: ['g3_l', 'g3_o', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'fog', wordTr: 'sis', phonics: ['g3_f', 'g3_o', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'big', wordTr: 'büyük', phonics: ['g3_b', 'g1_i', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'adjective' },
  { word: 'bug', wordTr: 'böcek', phonics: ['g3_b', 'g3_u', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'rug', wordTr: 'halı', phonics: ['g2_r', 'g3_u', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'fun', wordTr: 'eğlence', phonics: ['g3_f', 'g3_u', 'g1_n'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'sun', wordTr: 'güneş', phonics: ['g1_s', 'g3_u', 'g1_n'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'bus', wordTr: 'otobüs', phonics: ['g3_b', 'g3_u', 'g1_s'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'but', wordTr: 'ama', phonics: ['g3_b', 'g3_u', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'conjunction' },
  { word: 'bun', wordTr: 'topuz', phonics: ['g3_b', 'g3_u', 'g1_n'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'gum', wordTr: 'sakız', phonics: ['g3_g', 'g3_u', 'g2_m'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'lot', wordTr: 'çok', phonics: ['g3_l', 'g3_o', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },

  { word: 'got', wordTr: 'aldı', phonics: ['g3_g', 'g3_o', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'hot', wordTr: 'sıcak', phonics: ['g2_h', 'g3_o', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'not', wordTr: 'değil', phonics: ['g1_n', 'g3_o', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'adverb' },
  { word: 'cut', wordTr: 'kes', phonics: ['g2_ck', 'g3_u', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'lip', wordTr: 'dudak', phonics: ['g3_l', 'g1_i', 'g1_p'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'leg', wordTr: 'bacak', phonics: ['g3_l', 'g2_e', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'let', wordTr: 'bırak', phonics: ['g3_l', 'g2_e', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'fit', wordTr: 'uygun', phonics: ['g3_f', 'g1_i', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'adjective' },
  { word: 'fig', wordTr: 'incir', phonics: ['g3_f', 'g1_i', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'dug', wordTr: 'kazdı', phonics: ['g2_d', 'g3_u', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'gum', wordTr: 'sakız', phonics: ['g3_g', 'g3_u', 'g2_m'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'flap', wordTr: 'çırp', phonics: ['g3_f', 'g3_l', 'g1_a', 'g1_p'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'flag', wordTr: 'bayrak', phonics: ['g3_f', 'g3_l', 'g1_a', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'plug', wordTr: 'fiş', phonics: ['g1_p', 'g3_l', 'g3_u', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'slug', wordTr: 'sümüklü böcek', phonics: ['g1_s', 'g3_l', 'g3_u', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'glad', wordTr: 'mutlu', phonics: ['g3_g', 'g3_l', 'g1_a', 'g2_d'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'blot', wordTr: 'leke', phonics: ['g3_b', 'g3_l', 'g3_o', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'blob', wordTr: 'damla', phonics: ['g3_b', 'g3_l', 'g3_o', 'g3_b'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'frog', wordTr: 'kurbağa', phonics: ['g3_f', 'g2_r', 'g3_o', 'g3_g'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'grip', wordTr: 'tut', phonics: ['g3_g', 'g2_r', 'g1_i', 'g1_p'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'drum', wordTr: 'davul', phonics: ['g2_d', 'g2_r', 'g3_u', 'g2_m'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'drop', wordTr: 'damla', phonics: ['g2_d', 'g2_r', 'g3_o', 'g1_p'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'from', wordTr: 'dan', phonics: ['g3_f', 'g2_r', 'g3_o', 'g2_m'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'preposition' },
  { word: 'flat', wordTr: 'düz', phonics: ['g3_f', 'g3_l', 'g1_a', 'g1_t'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'fled', wordTr: 'kaçtı', phonics: ['g3_f', 'g3_l', 'g2_e', 'g2_d'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'grab', wordTr: 'yakala', phonics: ['g3_g', 'g2_r', 'g1_a', 'g3_b'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'mud', wordTr: 'çamur', phonics: ['g2_m', 'g3_u', 'g2_d'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'bud', wordTr: 'tomurcuk', phonics: ['g3_b', 'g3_u', 'g2_d'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'off', wordTr: 'kapalı', phonics: ['g3_o', 'g3_f'], maxGroup: 3, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adverb' },
];

// ─── GROUP 4 WORDS: ai, j, oa, ie, ee, or ────────────────────────────────────
// Adds sound IDs: g4_ai, g4_j, g4_oa, g4_ie, g4_ee, g4_or

const group4Words: DecodableWord[] = [
  { word: 'rain', wordTr: 'yağmur', phonics: ['g2_r', 'g4_ai', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'tail', wordTr: 'kuyruk', phonics: ['g1_t', 'g4_ai', 'g3_l'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'mail', wordTr: 'posta', phonics: ['g2_m', 'g4_ai', 'g3_l'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'sail', wordTr: 'yelken', phonics: ['g1_s', 'g4_ai', 'g3_l'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'paid', wordTr: 'ödedi', phonics: ['g1_p', 'g4_ai', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'main', wordTr: 'ana', phonics: ['g2_m', 'g4_ai', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'boat', wordTr: 'tekne', phonics: ['g3_b', 'g4_oa', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'goat', wordTr: 'keçi', phonics: ['g3_g', 'g4_oa', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'coat', wordTr: 'palto', phonics: ['g2_ck', 'g4_oa', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'road', wordTr: 'yol', phonics: ['g2_r', 'g4_oa', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'load', wordTr: 'yük', phonics: ['g3_l', 'g4_oa', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'soap', wordTr: 'sabun', phonics: ['g1_s', 'g4_oa', 'g1_p'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'oak', wordTr: 'meşe', phonics: ['g4_oa', 'g2_ck'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'tree', wordTr: 'ağaç', phonics: ['g1_t', 'g2_r', 'g4_ee'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'bee', wordTr: 'arı', phonics: ['g3_b', 'g4_ee'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'see', wordTr: 'gör', phonics: ['g1_s', 'g4_ee'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'verb' },
  { word: 'need', wordTr: 'ihtiyaç', phonics: ['g1_n', 'g4_ee', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'seed', wordTr: 'tohum', phonics: ['g1_s', 'g4_ee', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'feed', wordTr: 'besle', phonics: ['g3_f', 'g4_ee', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'feet', wordTr: 'ayaklar', phonics: ['g3_f', 'g4_ee', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'meet', wordTr: 'buluş', phonics: ['g2_m', 'g4_ee', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'feel', wordTr: 'hisset', phonics: ['g3_f', 'g4_ee', 'g3_l'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'deep', wordTr: 'derin', phonics: ['g2_d', 'g4_ee', 'g1_p'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'keep', wordTr: 'tut', phonics: ['g2_ck', 'g4_ee', 'g1_p'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'reef', wordTr: 'resif', phonics: ['g2_r', 'g4_ee', 'g3_f'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'tie', wordTr: 'kravat', phonics: ['g1_t', 'g4_ie'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'pie', wordTr: 'turta', phonics: ['g1_p', 'g4_ie'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'lie', wordTr: 'yalan', phonics: ['g3_l', 'g4_ie'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'tie', wordTr: 'kravat', phonics: ['g1_t', 'g4_ie'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'for', wordTr: 'için', phonics: ['g3_f', 'g4_or'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'preposition' },
  { word: 'corn', wordTr: 'mısır', phonics: ['g2_ck', 'g4_or', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'born', wordTr: 'doğdu', phonics: ['g3_b', 'g4_or', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'sort', wordTr: 'tür', phonics: ['g1_s', 'g4_or', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'port', wordTr: 'liman', phonics: ['g1_p', 'g4_or', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'torn', wordTr: 'yırtık', phonics: ['g1_t', 'g4_or', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'adjective' },
  { word: 'jam', wordTr: 'reçel', phonics: ['g4_j', 'g1_a', 'g2_m'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'jet', wordTr: 'uçak', phonics: ['g4_j', 'g2_e', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'jog', wordTr: 'koşu', phonics: ['g4_j', 'g3_o', 'g3_g'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'jug', wordTr: 'sürahi', phonics: ['g4_j', 'g3_u', 'g3_g'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'job', wordTr: 'iş', phonics: ['g4_j', 'g3_o', 'g3_b'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'free', wordTr: 'özgür', phonics: ['g3_f', 'g2_r', 'g4_ee'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'green', wordTr: 'yeşil', phonics: ['g3_g', 'g2_r', 'g4_ee', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'sleep', wordTr: 'uyu', phonics: ['g1_s', 'g3_l', 'g4_ee', 'g1_p'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'greet', wordTr: 'selamla', phonics: ['g3_g', 'g2_r', 'g4_ee', 'g1_t'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'grain', wordTr: 'tahıl', phonics: ['g3_g', 'g2_r', 'g4_ai', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'train', wordTr: 'tren', phonics: ['g1_t', 'g2_r', 'g4_ai', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'foam', wordTr: 'köpük', phonics: ['g3_f', 'g4_oa', 'g2_m'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'moan', wordTr: 'inle', phonics: ['g2_m', 'g4_oa', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'toad', wordTr: 'kara kurbağası', phonics: ['g1_t', 'g4_oa', 'g2_d'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'groan', wordTr: 'inle', phonics: ['g3_g', 'g2_r', 'g4_oa', 'g1_n'], maxGroup: 4, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
];

// ─── GROUP 5 WORDS: z, w, ng, v, oo(short), oo(long) ─────────────────────────
// Adds sound IDs: g5_z, g5_w, g5_ng, g5_v, g5_oo_short, g5_oo_long

const group5Words: DecodableWord[] = [
  { word: 'zoo', wordTr: 'hayvanat bahçesi', phonics: ['g5_z', 'g5_oo_long'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'zip', wordTr: 'fermuar', phonics: ['g5_z', 'g1_i', 'g1_p'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'buzz', wordTr: 'vızılda', phonics: ['g3_b', 'g3_u', 'g5_z'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'fizz', wordTr: 'köpür', phonics: ['g3_f', 'g1_i', 'g5_z'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'ring', wordTr: 'zil', phonics: ['g2_r', 'g1_i', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'sing', wordTr: 'şarkı söyle', phonics: ['g1_s', 'g1_i', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'king', wordTr: 'kral', phonics: ['g2_ck', 'g1_i', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'song', wordTr: 'şarkı', phonics: ['g1_s', 'g3_o', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'long', wordTr: 'uzun', phonics: ['g3_l', 'g3_o', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adjective' },
  { word: 'wing', wordTr: 'kanat', phonics: ['g5_w', 'g1_i', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'win', wordTr: 'kazan', phonics: ['g5_w', 'g1_i', 'g1_n'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'van', wordTr: 'minibüs', phonics: ['g5_v', 'g1_a', 'g1_n'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'vest', wordTr: 'yelek', phonics: ['g5_v', 'g2_e', 'g1_s', 'g1_t'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'book', wordTr: 'kitap', phonics: ['g3_b', 'g5_oo_short', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'noun' },
  { word: 'look', wordTr: 'bak', phonics: ['g3_l', 'g5_oo_short', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'verb' },
  { word: 'cook', wordTr: 'pişir', phonics: ['g2_ck', 'g5_oo_short', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'good', wordTr: 'iyi', phonics: ['g3_g', 'g5_oo_short', 'g2_d'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'adjective' },
  { word: 'foot', wordTr: 'ayak', phonics: ['g3_f', 'g5_oo_short', 'g1_t'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'hook', wordTr: 'kanca', phonics: ['g2_h', 'g5_oo_short', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'wood', wordTr: 'ahşap', phonics: ['g5_w', 'g5_oo_short', 'g2_d'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'took', wordTr: 'aldı', phonics: ['g1_t', 'g5_oo_short', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'moon', wordTr: 'ay', phonics: ['g2_m', 'g5_oo_long', 'g1_n'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'food', wordTr: 'yemek', phonics: ['g3_f', 'g5_oo_long', 'g2_d'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'cool', wordTr: 'havalı', phonics: ['g2_ck', 'g5_oo_long', 'g3_l'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'pool', wordTr: 'havuz', phonics: ['g1_p', 'g5_oo_long', 'g3_l'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'room', wordTr: 'oda', phonics: ['g2_r', 'g5_oo_long', 'g2_m'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'boot', wordTr: 'çizme', phonics: ['g3_b', 'g5_oo_long', 'g1_t'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'tool', wordTr: 'araç', phonics: ['g1_t', 'g5_oo_long', 'g3_l'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'zoom', wordTr: 'yaklaş', phonics: ['g5_z', 'g5_oo_long', 'g2_m'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'zap', wordTr: 'vur', phonics: ['g5_z', 'g1_a', 'g1_p'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'web', wordTr: 'ağ', phonics: ['g5_w', 'g2_e', 'g3_b'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'wag', wordTr: 'salla', phonics: ['g5_w', 'g1_a', 'g3_g'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'wet', wordTr: 'ıslak', phonics: ['g5_w', 'g2_e', 'g1_t'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'vat', wordTr: 'büyük fıçı', phonics: ['g5_v', 'g1_a', 'g1_t'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'vet', wordTr: 'veteriner', phonics: ['g5_v', 'g2_e', 'g1_t'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'weed', wordTr: 'yabani ot', phonics: ['g5_w', 'g4_ee', 'g2_d'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'week', wordTr: 'hafta', phonics: ['g5_w', 'g4_ee', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'wool', wordTr: 'yün', phonics: ['g5_w', 'g5_oo_short', 'g3_l'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'soon', wordTr: 'yakında', phonics: ['g1_s', 'g5_oo_long', 'g1_n'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adverb' },
  { word: 'noon', wordTr: 'öğle', phonics: ['g1_n', 'g5_oo_long', 'g1_n'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'weak', wordTr: 'zayıf', phonics: ['g5_w', 'g4_ee', 'g2_ck'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'long', wordTr: 'uzun', phonics: ['g3_l', 'g3_o', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adjective' },
  { word: 'bang', wordTr: 'patlama', phonics: ['g3_b', 'g1_a', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'gang', wordTr: 'çete', phonics: ['g3_g', 'g1_a', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'hung', wordTr: 'asıldı', phonics: ['g2_h', 'g3_u', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'verb' },
  { word: 'sang', wordTr: 'söyledi', phonics: ['g1_s', 'g1_a', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'zing', wordTr: 'zınla', phonics: ['g5_z', 'g1_i', 'g5_ng'], maxGroup: 5, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'verb' },
];

// ─── GROUP 6 WORDS: y, x, ch, sh, th(voiced), th(unvoiced) ───────────────────
// Adds sound IDs: g6_y, g6_x, g6_ch, g6_sh, g6_th_voiced, g6_th_unvoiced

const group6Words: DecodableWord[] = [
  { word: 'yes', wordTr: 'evet', phonics: ['g6_y', 'g2_e', 'g1_s'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adverb' },
  { word: 'yam', wordTr: 'tatlı patates', phonics: ['g6_y', 'g1_a', 'g2_m'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'fox', wordTr: 'tilki', phonics: ['g3_f', 'g3_o', 'g6_x'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'box', wordTr: 'kutu', phonics: ['g3_b', 'g3_o', 'g6_x'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'mix', wordTr: 'karıştır', phonics: ['g2_m', 'g1_i', 'g6_x'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'six', wordTr: 'altı', phonics: ['g1_s', 'g1_i', 'g6_x'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'fix', wordTr: 'düzelt', phonics: ['g3_f', 'g1_i', 'g6_x'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'chip', wordTr: 'cips', phonics: ['g6_ch', 'g1_i', 'g1_p'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'chop', wordTr: 'doğra', phonics: ['g6_ch', 'g3_o', 'g1_p'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'chin', wordTr: 'çene', phonics: ['g6_ch', 'g1_i', 'g1_n'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'chat', wordTr: 'sohbet et', phonics: ['g6_ch', 'g1_a', 'g1_t'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'much', wordTr: 'çok', phonics: ['g2_m', 'g3_u', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adverb' },
  { word: 'such', wordTr: 'böyle', phonics: ['g1_s', 'g3_u', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adverb' },
  { word: 'rich', wordTr: 'zengin', phonics: ['g2_r', 'g1_i', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'ship', wordTr: 'gemi', phonics: ['g6_sh', 'g1_i', 'g1_p'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'shop', wordTr: 'dükkan', phonics: ['g6_sh', 'g3_o', 'g1_p'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'shed', wordTr: 'ahır', phonics: ['g6_sh', 'g2_e', 'g2_d'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'shut', wordTr: 'kapat', phonics: ['g6_sh', 'g3_u', 'g1_t'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'fish', wordTr: 'balık', phonics: ['g3_f', 'g1_i', 'g6_sh'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'wish', wordTr: 'dilek', phonics: ['g5_w', 'g1_i', 'g6_sh'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'push', wordTr: 'it', phonics: ['g1_p', 'g5_oo_short', 'g6_sh'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'this', wordTr: 'bu', phonics: ['g6_th_voiced', 'g1_i', 'g1_s'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'noun' },
  { word: 'that', wordTr: 'şu', phonics: ['g6_th_voiced', 'g1_a', 'g1_t'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'noun' },
  { word: 'them', wordTr: 'onlar', phonics: ['g6_th_voiced', 'g2_e', 'g2_m'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'then', wordTr: 'sonra', phonics: ['g6_th_voiced', 'g2_e', 'g1_n'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adverb' },
  { word: 'with', wordTr: 'ile', phonics: ['g5_w', 'g1_i', 'g6_th_voiced'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'preposition' },
  { word: 'thin', wordTr: 'ince', phonics: ['g6_th_unvoiced', 'g1_i', 'g1_n'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'thick', wordTr: 'kalın', phonics: ['g6_th_unvoiced', 'g1_i', 'g2_ck'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'think', wordTr: 'düşün', phonics: ['g6_th_unvoiced', 'g1_i', 'g5_ng', 'g2_ck'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'verb' },
  { word: 'three', wordTr: 'üç', phonics: ['g6_th_unvoiced', 'g2_r', 'g4_ee'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'thing', wordTr: 'şey', phonics: ['g6_th_unvoiced', 'g1_i', 'g5_ng'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'check', wordTr: 'kontrol et', phonics: ['g6_ch', 'g2_e', 'g2_ck'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'chess', wordTr: 'satranç', phonics: ['g6_ch', 'g2_e', 'g1_s'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'chest', wordTr: 'göğüs', phonics: ['g6_ch', 'g2_e', 'g1_s', 'g1_t'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'shelf', wordTr: 'raf', phonics: ['g6_sh', 'g2_e', 'g3_l', 'g3_f'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'shell', wordTr: 'kabuk', phonics: ['g6_sh', 'g2_e', 'g3_l'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'fresh', wordTr: 'taze', phonics: ['g3_f', 'g2_r', 'g2_e', 'g6_sh'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'flash', wordTr: 'flaş', phonics: ['g3_f', 'g3_l', 'g1_a', 'g6_sh'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'clash', wordTr: 'çarpışma', phonics: ['g2_ck', 'g3_l', 'g1_a', 'g6_sh'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'teach', wordTr: 'öğret', phonics: ['g1_t', 'g4_ee', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'beach', wordTr: 'plaj', phonics: ['g3_b', 'g4_ee', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'reach', wordTr: 'uzat', phonics: ['g2_r', 'g4_ee', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'each', wordTr: 'her', phonics: ['g4_ee', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adverb' },
  { word: 'peach', wordTr: 'şeftali', phonics: ['g1_p', 'g4_ee', 'g6_ch'], maxGroup: 6, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
];

// ─── GROUP 7 WORDS: qu, ou, oi, ue, er, ar ────────────────────────────────────
// Adds sound IDs: g7_qu, g7_ou, g7_oi, g7_ue, g7_er, g7_ar

const group7Words: DecodableWord[] = [
  { word: 'queen', wordTr: 'kraliçe', phonics: ['g7_qu', 'g4_ee', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'quick', wordTr: 'hızlı', phonics: ['g7_qu', 'g1_i', 'g2_ck'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'quiz', wordTr: 'sınav', phonics: ['g7_qu', 'g1_i', 'g5_z'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'out', wordTr: 'dışarı', phonics: ['g7_ou', 'g1_t'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 10, partOfSpeech: 'adverb' },
  { word: 'loud', wordTr: 'gürültülü', phonics: ['g3_l', 'g7_ou', 'g2_d'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'round', wordTr: 'yuvarlak', phonics: ['g2_r', 'g7_ou', 'g1_n', 'g2_d'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'adjective' },
  { word: 'found', wordTr: 'buldu', phonics: ['g3_f', 'g7_ou', 'g1_n', 'g2_d'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'verb' },
  { word: 'cloud', wordTr: 'bulut', phonics: ['g2_ck', 'g3_l', 'g7_ou', 'g2_d'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'mouse', wordTr: 'fare', phonics: ['g2_m', 'g7_ou', 'g1_s'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'house', wordTr: 'ev', phonics: ['g2_h', 'g7_ou', 'g1_s'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'shout', wordTr: 'bağır', phonics: ['g6_sh', 'g7_ou', 'g1_t'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'mouth', wordTr: 'ağız', phonics: ['g2_m', 'g7_ou', 'g6_th_unvoiced'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'south', wordTr: 'güney', phonics: ['g1_s', 'g7_ou', 'g6_th_unvoiced'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'oil', wordTr: 'yağ', phonics: ['g7_oi', 'g3_l'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'coin', wordTr: 'madeni para', phonics: ['g2_ck', 'g7_oi', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'join', wordTr: 'katıl', phonics: ['g4_j', 'g7_oi', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'boil', wordTr: 'kaynat', phonics: ['g3_b', 'g7_oi', 'g3_l'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'verb' },
  { word: 'foil', wordTr: 'folyo', phonics: ['g3_f', 'g7_oi', 'g3_l'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'soil', wordTr: 'toprak', phonics: ['g1_s', 'g7_oi', 'g3_l'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'blue', wordTr: 'mavi', phonics: ['g3_b', 'g3_l', 'g7_ue'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'adjective' },
  { word: 'clue', wordTr: 'ipucu', phonics: ['g2_ck', 'g3_l', 'g7_ue'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'glue', wordTr: 'yapıştırıcı', phonics: ['g3_g', 'g3_l', 'g7_ue'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'true', wordTr: 'gerçek', phonics: ['g1_t', 'g2_r', 'g7_ue'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'her', wordTr: 'onun', phonics: ['g2_h', 'g7_er'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'after', wordTr: 'sonra', phonics: ['g1_a', 'g3_f', 'g1_t', 'g7_er'], maxGroup: 7, isSightWord: false, syllableCount: 2, frequency: 9, partOfSpeech: 'preposition' },
  { word: 'better', wordTr: 'daha iyi', phonics: ['g3_b', 'g2_e', 'g1_t', 'g7_er'], maxGroup: 7, isSightWord: false, syllableCount: 2, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'sister', wordTr: 'kız kardeş', phonics: ['g1_s', 'g1_i', 'g1_s', 'g1_t', 'g7_er'], maxGroup: 7, isSightWord: false, syllableCount: 2, frequency: 7, partOfSpeech: 'noun' },
  { word: 'car', wordTr: 'araba', phonics: ['g2_ck', 'g7_ar'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 9, partOfSpeech: 'noun' },
  { word: 'far', wordTr: 'uzak', phonics: ['g3_f', 'g7_ar'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'star', wordTr: 'yıldız', phonics: ['g1_s', 'g1_t', 'g7_ar'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'jar', wordTr: 'kavanos', phonics: ['g4_j', 'g7_ar'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'farm', wordTr: 'çiftlik', phonics: ['g3_f', 'g7_ar', 'g2_m'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'park', wordTr: 'park', phonics: ['g1_p', 'g7_ar', 'g2_ck'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'noun' },
  { word: 'dark', wordTr: 'karanlık', phonics: ['g2_d', 'g7_ar', 'g2_ck'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'shark', wordTr: 'köpekbalığı', phonics: ['g6_sh', 'g7_ar', 'g2_ck'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'chart', wordTr: 'grafik', phonics: ['g6_ch', 'g7_ar', 'g1_t'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'spark', wordTr: 'kıvılcım', phonics: ['g1_s', 'g1_p', 'g7_ar', 'g2_ck'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'quill', wordTr: 'tüy kalem', phonics: ['g7_qu', 'g1_i', 'g3_l'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 4, partOfSpeech: 'noun' },
  { word: 'quest', wordTr: 'görev', phonics: ['g7_qu', 'g2_e', 'g1_s', 'g1_t'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'fern', wordTr: 'eğreltiotu', phonics: ['g3_f', 'g7_er', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'term', wordTr: 'dönem', phonics: ['g1_t', 'g7_er', 'g2_m'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 6, partOfSpeech: 'noun' },
  { word: 'verb', wordTr: 'fiil', phonics: ['g5_v', 'g7_er', 'g3_b'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'herd', wordTr: 'sürü', phonics: ['g2_h', 'g7_er', 'g2_d'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 5, partOfSpeech: 'noun' },
  { word: 'point', wordTr: 'nokta', phonics: ['g1_p', 'g7_oi', 'g1_n', 'g1_t'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'voice', wordTr: 'ses', phonics: ['g5_v', 'g7_oi', 'g1_s'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'count', wordTr: 'say', phonics: ['g2_ck', 'g7_ou', 'g1_n', 'g1_t'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'verb' },
  { word: 'town', wordTr: 'kasaba', phonics: ['g1_t', 'g7_ou', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'brown', wordTr: 'kahverengi', phonics: ['g3_b', 'g2_r', 'g7_ou', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 8, partOfSpeech: 'adjective' },
  { word: 'crown', wordTr: 'taç', phonics: ['g2_ck', 'g2_r', 'g7_ou', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
  { word: 'clown', wordTr: 'palyaço', phonics: ['g2_ck', 'g3_l', 'g7_ou', 'g1_n'], maxGroup: 7, isSightWord: false, syllableCount: 1, frequency: 7, partOfSpeech: 'noun' },
];

// ─── SIGHT WORDS ──────────────────────────────────────────────────────────────

export const SIGHT_WORDS: string[] = [
  'the', 'a', 'and', 'is', 'it', 'in', 'not', 'can', 'I', 'you', 'he', 'she',
  'we', 'go', 'do', 'my', 'are', 'was', 'his', 'her', 'they', 'all', 'said',
  'have', 'from', 'one', 'two', 'for', 'of', 'to', 'up', 'at', 'me', 'by',
  'no', 'so', 'be', 'as', 'on', 'if', 'or', 'an', 'see', 'has', 'had', 'him',
  'did', 'get', 'got', 'put', 'too', 'our', 'out', 'who', 'what', 'when',
  'where', 'there', 'here', 'look', 'now', 'then', 'like', 'come', 'some',
  'into', 'come', 'want', 'with', 'will', 'new', 'little', 'big', 'old',
];

// Sight words as DecodableWord entries
const sightWordEntries: DecodableWord[] = SIGHT_WORDS.map(word => ({
  word,
  wordTr: word,
  phonics: [],
  maxGroup: 1,
  isSightWord: true,
  syllableCount: word.length > 4 ? 2 : 1,
  frequency: 10,
  partOfSpeech: 'noun' as const,
}));

// ─── FULL WORD BANK ───────────────────────────────────────────────────────────

export const DECODABLE_WORDS: DecodableWord[] = [
  ...sightWordEntries,
  ...group1Words,
  ...group2Words,
  ...group3Words,
  ...group4Words,
  ...group5Words,
  ...group6Words,
  ...group7Words,
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────

/**
 * Get all words accessible at phonics group N (groups 1 through N + sight words).
 */
export function getWordsForGroup(maxGroup: number): DecodableWord[] {
  return DECODABLE_WORDS.filter(w => w.isSightWord || w.maxGroup <= maxGroup);
}

/**
 * Get decodable words of a specific part of speech at group level N.
 */
export function getWordsByPos(
  maxGroup: number,
  pos: DecodableWord['partOfSpeech'],
): DecodableWord[] {
  return getWordsForGroup(maxGroup).filter(w => w.partOfSpeech === pos);
}

/**
 * Find a word entry by exact word string (case-insensitive).
 */
export function findWord(word: string): DecodableWord | undefined {
  return DECODABLE_WORDS.find(w => w.word.toLowerCase() === word.toLowerCase());
}
