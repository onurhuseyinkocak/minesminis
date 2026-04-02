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
    description: 'Choose the correct Turkish translation for each English word!',
    descriptionTr: 'Her İngilizce kelime için doğru Türkçe çeviriyi seç!',
    category: 'vocabulary',
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
  {
    type: 'phoneme-manipulation',
    name: 'Sound Play',
    nameTr: 'Ses Oyunu',
    description: 'Add, remove, and swap sounds to make new words!',
    descriptionTr: 'Ses ekle, çıkar ve değiştirerek yeni kelimeler oluştur!',
    category: 'phonics',
    difficulty: 3,
    minLevel: 4,
    color: 'var(--accent-indigo)',
    addedAt: '2025-04-01',
  },
  {
    type: 'syllable',
    name: 'Syllable Game',
    nameTr: 'Hece Oyunu',
    description: 'Tap out the syllables and count them all!',
    descriptionTr: 'Heceleri say ve doğru sayıyı bul!',
    category: 'phonics',
    difficulty: 2,
    minLevel: 2,
    color: 'var(--accent-teal)',
    addedAt: '2025-04-01',
  },
  {
    type: 'word-family',
    name: 'Word Families',
    nameTr: 'Kelime Aileleri',
    description: 'Build words by mixing letter onsets with rhyming endings.',
    descriptionTr: 'Harf başlangıçlarını kafiyeli sonlarla birleştirerek kelimeler yap.',
    category: 'phonics',
    difficulty: 2,
    minLevel: 3,
    color: 'var(--secondary-light, #2A9D8F)',
    addedAt: '2025-04-01',
  },
  {
    type: 'rhyme',
    name: 'Rhyme Time',
    nameTr: 'Kafiye Zamanı',
    description: 'Detect, sort and produce rhyming words!',
    descriptionTr: 'Kafiyeli kelimeleri tanı, sırala ve bul!',
    category: 'phonics',
    difficulty: 2,
    minLevel: 2,
    color: 'var(--accent-rose, #f43f5e)',
    addedAt: '2025-04-01',
  },
  {
    type: 'phonetic-trap',
    name: 'Phonetic Trap',
    nameTr: 'Fonetik Tuzak',
    description: 'Spot the tricky words that look similar but sound different!',
    descriptionTr: 'Benzer görünen ama farklı seslendirilen kelimeleri yakala!',
    category: 'phonics',
    difficulty: 3,
    minLevel: 5,
    color: 'var(--accent-amber)',
    addedAt: '2025-04-01',
  },
  {
    type: 'sentence-builder',
    name: 'Sentence Builder',
    nameTr: 'Cümle Kur',
    description: 'Tap the words in the right order to build a sentence!',
    descriptionTr: 'Kelimelere doğru sırayla dokun, cümleyi kur!',
    category: 'reading',
    difficulty: 2,
    minLevel: 2,
    color: 'var(--primary, #FF6B35)',
    addedAt: '2026-03-27',
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
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(`${LS_GAME_BEST_SCORE_PREFIX}${gameType}`);
    if (raw === null) return undefined;
    const n = parseInt(raw, 10);
    return isNaN(n) ? undefined : n;
  } catch {
    return undefined;
  }
}

/**
 * Load best score with Supabase as source of truth.
 * Returns cached localStorage value immediately, then checks Supabase async.
 */
export async function getBestScoreAsync(
  gameType: string,
  userId?: string,
): Promise<number | undefined> {
  // Fast: check localStorage cache first
  const cached = getBestScore(gameType);

  if (!userId) return cached;

  // Try Supabase (source of truth)
  try {
    const { loadBestScoreFromSupabase } = await import('../services/supabaseDataService');
    const sbScore = await loadBestScoreFromSupabase(userId, gameType);
    if (sbScore !== null) {
      // Update localStorage cache if Supabase has a higher score
      const current = cached ?? 0;
      if (sbScore > current) {
        try { localStorage.setItem(`${LS_GAME_BEST_SCORE_PREFIX}${gameType}`, String(sbScore)); } catch {}
      }
      return Math.max(sbScore, current);
    }
  } catch {
    // Supabase failed — use cached value
  }

  return cached;
}

export function saveBestScore(gameType: string, score: number, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getBestScore(gameType) ?? 0;
    if (score > current) {
      localStorage.setItem(`${LS_GAME_BEST_SCORE_PREFIX}${gameType}`, String(score));
    }
  } catch {
    // localStorage quota exceeded or access denied — silently ignore
  }

  // Async sync to Supabase
  if (userId) {
    import('../services/supabaseDataService').then(({ saveBestScoreToSupabase }) => {
      saveBestScoreToSupabase(userId, gameType, score);
    }).catch(() => {});
  }
}

export function getDailyPracticeStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(LS_DAILY_PRACTICE_STREAK);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

/** Increments streak if last practice was yesterday; resets if more than 1 day gap */
export function recordDailyPractice(userId?: string): number {
  if (typeof window === 'undefined') return 0;
  try {
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

    // Async sync to Supabase
    if (userId) {
      import('../services/supabaseDataService').then(async () => {
        const { supabase } = await import('../config/supabase');
        try {
          await supabase.from('user_activities').insert({
            user_id: userId,
            activity_type: 'daily_practice',
            activity_name: `daily_practice_${today}`,
            xp_earned: 0,
            metadata: { streak: newStreak, date: today },
          });
        } catch { /* silent */ }
      }).catch(() => {});
    }

    return newStreak;
  } catch {
    return 0;
  }
}

/** Build a balanced 5-game daily practice set (seeded by date so it's the same for the day).
 *  Distribution cap: max 2 phonics games per set to ensure category variety.
 */
export function getDailyPracticeSet(): GameMeta[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Simple seeded shuffle via sort comparator
  const shuffled = [...MINI_GAMES].sort((a, b) => {
    const ha = hashString(a.type + seed);
    const hb = hashString(b.type + seed);
    return ha - hb;
  });

  // Cap any single category at 2 to ensure a varied daily set
  const result: GameMeta[] = [];
  const categoryCounts: Partial<Record<GameCategory, number>> = {};
  for (const game of shuffled) {
    if (result.length >= 5) break;
    const count = categoryCounts[game.category] ?? 0;
    if (count >= 2) continue;
    result.push(game);
    categoryCounts[game.category] = count + 1;
  }
  // Fallback: if we somehow have fewer than 5, pad from the shuffled list
  if (result.length < 5) {
    for (const game of shuffled) {
      if (result.length >= 5) break;
      if (!result.includes(game)) result.push(game);
    }
  }
  return result;
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
