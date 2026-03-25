/**
 * Mini Games Metadata
 * Metadata for all internal mini-game types in the games hub.
 * Separate from gamesData.ts (which holds external Wordwall games).
 */

export type GameCategory = 'vocabulary' | 'phonics' | 'reading' | 'speaking';

export interface GameMeta {
  /** Unique key matching the GameType in components/games/index.tsx */
  type: string;
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  category: GameCategory;
  difficulty: 1 | 2 | 3;
  /** Minimum user level required to unlock this game */
  minLevel: number;
  /** Accent color for the card stripe and icon */
  color: string;
  /** ISO date string — for "New" badge logic */
  addedAt: string;
}

export const MINI_GAMES: GameMeta[] = [
  {
    type: 'word-match',
    name: 'Word Match',
    nameTr: 'Kelime Eşleştir',
    description: 'Match English words to their pictures!',
    descriptionTr: 'İngilizce kelimeleri resimlerle eşleştir!',
    category: 'vocabulary',
    difficulty: 1,
    minLevel: 1,
    color: 'var(--accent-teal)',
    addedAt: '2025-01-01',
  },
  {
    type: 'quick-quiz',
    name: 'Quick Quiz',
    nameTr: 'Hızlı Quiz',
    description: 'How fast can you answer vocabulary questions?',
    descriptionTr: 'Kelime sorularını ne kadar hızlı cevaplayabilirsin?',
    category: 'vocabulary',
    difficulty: 2,
    minLevel: 1,
    color: 'var(--accent-amber)',
    addedAt: '2025-01-01',
  },
  {
    type: 'spelling-bee',
    name: 'Spelling Bee',
    nameTr: 'Yazım Yarışması',
    description: 'Spell the word correctly — letter by letter!',
    descriptionTr: 'Kelimeyi harf harf doğru yaz!',
    category: 'vocabulary',
    difficulty: 2,
    minLevel: 1,
    color: 'var(--accent-rose, #f43f5e)',
    addedAt: '2025-01-01',
  },
  {
    type: 'sentence-scramble',
    name: 'Sentence Scramble',
    nameTr: 'Cümle Karıştır',
    description: 'Put the words in the correct order to form a sentence.',
    descriptionTr: 'Kelimeleri doğru sıraya koy ve cümleyi oluştur.',
    category: 'vocabulary',
    difficulty: 3,
    minLevel: 3,
    color: 'var(--accent-indigo)',
    addedAt: '2025-01-01',
  },
  {
    type: 'listening-challenge',
    name: 'Listening Challenge',
    nameTr: 'Dinleme Mücadelesi',
    description: 'Listen carefully and choose the right word!',
    descriptionTr: 'Dikkatlice dinle ve doğru kelimeyi seç!',
    category: 'phonics',
    difficulty: 2,
    minLevel: 3,
    color: 'var(--accent-amber)',
    addedAt: '2025-01-01',
  },
  {
    type: 'pronunciation',
    name: 'Say It!',
    nameTr: 'Söyle!',
    description: 'Practice your English pronunciation out loud.',
    descriptionTr: 'İngilizce telaffuzunu sesli olarak pratik yap.',
    category: 'speaking',
    difficulty: 1,
    minLevel: 1,
    color: 'var(--accent-indigo)',
    addedAt: '2025-01-01',
  },
  {
    type: 'story-choices',
    name: 'Story Choices',
    nameTr: 'Hikaye Seçimleri',
    description: "Choose your path and shape the story's ending!",
    descriptionTr: 'Yolunu seç ve hikayenin sonunu şekillendir!',
    category: 'reading',
    difficulty: 2,
    minLevel: 5,
    color: 'var(--success)',
    addedAt: '2025-01-01',
  },
  {
    type: 'dialogue',
    name: 'Dialogue',
    nameTr: 'Diyalog',
    description: 'Practice real conversations with interactive dialogues.',
    descriptionTr: 'İnteraktif diyaloglarla gerçek konuşmaları pratik yap.',
    category: 'speaking',
    difficulty: 2,
    minLevel: 5,
    color: 'var(--secondary-light, #2A9D8F)',
    addedAt: '2025-03-01',
  },
  {
    type: 'image-label',
    name: 'Image Label',
    nameTr: 'Resim Etiketle',
    description: 'Label parts of an image with the correct English words.',
    descriptionTr: 'Resmin parçalarını doğru İngilizce kelimelerle etiketle.',
    category: 'vocabulary',
    difficulty: 1,
    minLevel: 5,
    color: 'var(--primary)',
    addedAt: '2025-03-01',
  },
  {
    type: 'say-it',
    name: 'Say It Loud',
    nameTr: 'Yüksek Sesle Söyle',
    description: 'Read words aloud and earn points for clear pronunciation.',
    descriptionTr: 'Kelimeleri yüksek sesle oku ve net telaffuz için puan kazan.',
    category: 'speaking',
    difficulty: 1,
    minLevel: 1,
    color: 'var(--accent-rose, #f43f5e)',
    addedAt: '2025-03-01',
  },
  {
    type: 'phonics-blend',
    name: 'Phonics Blend',
    nameTr: 'Fonetik Birleştir',
    description: 'Blend letter sounds together to decode whole words.',
    descriptionTr: 'Harf seslerini birleştirerek kelimelerin kodunu çöz.',
    category: 'phonics',
    difficulty: 3,
    minLevel: 3,
    color: 'var(--secondary-light, #2A9D8F)',
    addedAt: '2025-03-01',
  },
];

/** Daily featured game — rotates by date hash so it's consistent for the same calendar day */
export function getDailyFeaturedGame(): GameMeta {
  const today = new Date();
  const dateKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return MINI_GAMES[dateKey % MINI_GAMES.length];
}

/** Returns true if a game was added within the last 7 days */
export function isNewGame(game: GameMeta): boolean {
  const addedMs = new Date(game.addedAt).getTime();
  const nowMs = Date.now();
  return nowMs - addedMs < 7 * 24 * 60 * 60 * 1000;
}

/** Storage key for per-game best scores */
export const LS_GAME_BEST_SCORE_PREFIX = 'mm_game_best_';

/** Storage key for daily practice state */
export const LS_DAILY_PRACTICE_DATE = 'mm_daily_practice_date';
export const LS_DAILY_PRACTICE_STREAK = 'mm_daily_practice_streak';

export function getBestScore(gameType: string): number | undefined {
  const raw = localStorage.getItem(`${LS_GAME_BEST_SCORE_PREFIX}${gameType}`);
  if (raw === null) return undefined;
  const n = parseInt(raw, 10);
  return isNaN(n) ? undefined : n;
}

export function saveBestScore(gameType: string, score: number): void {
  const current = getBestScore(gameType) ?? 0;
  if (score > current) {
    localStorage.setItem(`${LS_GAME_BEST_SCORE_PREFIX}${gameType}`, String(score));
  }
}

export function getDailyPracticeStreak(): number {
  const raw = localStorage.getItem(LS_DAILY_PRACTICE_STREAK);
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  return isNaN(n) ? 0 : n;
}

/** Increments streak if last practice was yesterday; resets if more than 1 day gap */
export function recordDailyPractice(): number {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(LS_DAILY_PRACTICE_DATE);
  const currentStreak = getDailyPracticeStreak();

  if (lastDate === today) {
    return currentStreak; // already recorded today
  }

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = lastDate === yesterday ? currentStreak + 1 : 1;

  localStorage.setItem(LS_DAILY_PRACTICE_DATE, today);
  localStorage.setItem(LS_DAILY_PRACTICE_STREAK, String(newStreak));
  return newStreak;
}

/** Build a randomized 5-game daily practice set (seeded by date so it's the same for the day) */
export function getDailyPracticeSet(): GameMeta[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Simple seeded shuffle via sort comparator
  const shuffled = [...MINI_GAMES].sort((a, b) => {
    const ha = hashString(a.type + seed);
    const hb = hashString(b.type + seed);
    return ha - hb;
  });
  return shuffled.slice(0, 5);
}

function hashString(s: string | number): number {
  const str = String(s);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}
