/**
 * DAILY LESSON SERVICE
 * MinesMinis — structured 15-minute daily learning flow
 *
 * Picks 5 new words (next unlearned in curriculum order) and
 * 5 review words (spaced-repetition due today) for each day.
 */

import { kidsWords, type KidsWord } from '../data/wordsData';
import { getDueWords, updateWordProgress, loadAllProgress } from '../data/spacedRepetition';
import { ALL_SOUNDS } from '../data/phonics';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { KidsWord };

export interface CVCWord {
  word: string;
  letters: string[];
  emoji: string;
  turkish: string;
}

export interface GrammarPattern {
  pattern: string;        // e.g. "I + verb"
  patternTr: string;      // Turkish description
  examples: Array<{
    sentence: string;
    sentenceTr: string;
  }>;
  blankTemplate: string;  // e.g. "I ___ a cat."
  blankAnswer: string;    // correct fill-in
  blankChoices: string[]; // all options including the answer
}

export interface DailyLessonPlan {
  date: string;            // YYYY-MM-DD
  newWords: KidsWord[];
  reviewWords: KidsWord[];
  completed: boolean;
  score: number;           // 0-100
  themeName?: string;      // display name of today's theme
  phrasePair?: { english: string; turkish: string };
  grammarPattern?: GrammarPattern;
}

// ─── Themed Word Groups ───────────────────────────────────────────────────────

export interface ThemedWordGroup {
  name: string;
  nameTr: string;
  emoji: string;
  words: KidsWord[];
}

export const THEMED_WORD_GROUPS: ThemedWordGroup[] = [
  {
    name: 'Animals',
    nameTr: 'Hayvanlar',
    emoji: '🐾',
    words: kidsWords.filter((w) => w.category === 'Animals').slice(0, 10),
  },
  {
    name: 'Colors',
    nameTr: 'Renkler',
    emoji: '🎨',
    words: kidsWords.filter((w) => w.category === 'Colors').slice(0, 10),
  },
  {
    name: 'Body',
    nameTr: 'Vücut',
    emoji: '🧍',
    words: kidsWords.filter((w) => w.category === 'Body').slice(0, 10),
  },
  {
    name: 'Nature',
    nameTr: 'Doğa',
    emoji: '🌿',
    words: kidsWords.filter((w) => w.category === 'Nature').slice(0, 10),
  },
  {
    name: 'Phonics',
    nameTr: 'Fonetik',
    emoji: '🔤',
    words: kidsWords.filter((w) => w.category === 'Phonics').slice(0, 10),
  },
];

// ─── CVC Words pool ──────────────────────────────────────────────────────────

const CVC_POOL: CVCWord[] = [
  { word: 'cat', letters: ['c', 'a', 't'], emoji: '🐱', turkish: 'kedi' },
  { word: 'dog', letters: ['d', 'o', 'g'], emoji: '🐶', turkish: 'köpek' },
  { word: 'cup', letters: ['c', 'u', 'p'], emoji: '☕', turkish: 'fincan' },
  { word: 'hat', letters: ['h', 'a', 't'], emoji: '🎩', turkish: 'şapka' },
  { word: 'sun', letters: ['s', 'u', 'n'], emoji: '☀️', turkish: 'güneş' },
  { word: 'bed', letters: ['b', 'e', 'd'], emoji: '🛏️', turkish: 'yatak' },
  { word: 'pen', letters: ['p', 'e', 'n'], emoji: '✏️', turkish: 'kalem' },
  { word: 'big', letters: ['b', 'i', 'g'], emoji: '🔶', turkish: 'büyük' },
];

// ─── Grammar patterns pool ───────────────────────────────────────────────────

const GRAMMAR_PATTERNS: GrammarPattern[] = [
  {
    pattern: 'I + verb',
    patternTr: 'Ben + fiil',
    examples: [
      { sentence: 'I run fast.', sentenceTr: 'Hızlı koşarım.' },
      { sentence: 'I eat an apple.', sentenceTr: 'Bir elma yerim.' },
    ],
    blankTemplate: 'I ___ fast.',
    blankAnswer: 'run',
    blankChoices: ['run', 'runs', 'running'],
  },
  {
    pattern: 'I have a ___',
    patternTr: 'Benim bir ___ var',
    examples: [
      { sentence: 'I have a cat.', sentenceTr: 'Benim bir kedim var.' },
      { sentence: 'I have a bag.', sentenceTr: 'Benim bir çantam var.' },
    ],
    blankTemplate: 'I have a ___.',
    blankAnswer: 'cat',
    blankChoices: ['cat', 'cats', 'the cat'],
  },
  {
    pattern: 'It is + adjective',
    patternTr: 'Bu + sıfat',
    examples: [
      { sentence: 'It is big.', sentenceTr: 'Bu büyük.' },
      { sentence: 'It is red.', sentenceTr: 'Bu kırmızı.' },
    ],
    blankTemplate: 'It is ___.',
    blankAnswer: 'big',
    blankChoices: ['big', 'bigger', 'bigs'],
  },
  {
    pattern: 'I can ___',
    patternTr: 'Ben ___ yapabilirim',
    examples: [
      { sentence: 'I can jump.', sentenceTr: 'Ben zıplayabilirim.' },
      { sentence: 'I can swim.', sentenceTr: 'Ben yüzebilirim.' },
    ],
    blankTemplate: 'I can ___.',
    blankAnswer: 'jump',
    blankChoices: ['jump', 'jumped', 'jumping'],
  },
  {
    pattern: 'I like ___',
    patternTr: 'Ben ___ seviyorum',
    examples: [
      { sentence: 'I like dogs.', sentenceTr: 'Köpekleri seviyorum.' },
      { sentence: 'I like cake.', sentenceTr: 'Pastayı seviyorum.' },
    ],
    blankTemplate: 'I like ___.',
    blankAnswer: 'dogs',
    blankChoices: ['dogs', 'dog', 'a dogs'],
  },
];

// ─── Phrase pairs pool ───────────────────────────────────────────────────────

const PHRASE_PAIRS: Array<{ english: string; turkish: string }> = [
  { english: 'The cat is on the mat.', turkish: 'Kedi paspasın üzerinde.' },
  { english: 'I see a big dog.', turkish: 'Büyük bir köpek görüyorum.' },
  { english: 'She has a red hat.', turkish: 'Onun kırmızı bir şapkası var.' },
  { english: 'The sun is bright today.', turkish: 'Bugün güneş parlak.' },
  { english: 'I like to run and jump.', turkish: 'Koşmayı ve zıplamayı seviyorum.' },
  { english: 'He can swim very fast.', turkish: 'Çok hızlı yüzebilir.' },
  { english: 'The bird sits on the tree.', turkish: 'Kuş ağaçta oturuyor.' },
  { english: 'We play in the park.', turkish: 'Parkta oynuyoruz.' },
];

// ─── Storage keys ─────────────────────────────────────────────────────────────

function dailyKey(userId: string, date: string): string {
  return `mm_daily_${userId}_${date}`;
}

function learnedKey(userId: string): string {
  return `mm_learned_${userId}`;
}

// ─── Learned word tracking ────────────────────────────────────────────────────

export function getLearnedWords(userId: string): string[] {
  try {
    const raw = localStorage.getItem(learnedKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markWordLearned(userId: string, english: string): void {
  const learned = getLearnedWords(userId);
  if (!learned.includes(english)) {
    learned.push(english);
    try {
      localStorage.setItem(learnedKey(userId), JSON.stringify(learned));
    } catch {
      // storage full — ignore
    }
  }
}

// ─── Review word resolver ─────────────────────────────────────────────────────

/**
 * Get words due for review today. Returns KidsWord objects matched
 * from the curriculum by wordId (which is the English word string).
 */
function getDueReviewWords(limit: number): KidsWord[] {
  const due = getDueWords(limit * 3); // over-fetch, filter to known words
  const wordMap = new Map(kidsWords.map((w) => [w.word.toLowerCase(), w]));
  return due
    .map((p) => wordMap.get(p.wordId.toLowerCase()))
    .filter((w): w is KidsWord => w !== undefined)
    .slice(0, limit);
}

// ─── Adaptive difficulty ──────────────────────────────────────────────────────

/**
 * Look at the last 3 days' scores and return the optimal word count for today.
 * - avg >= 90: kid is crushing it → 7 words
 * - avg >= 70: normal pace        → 5 words
 * - avg >= 50: struggling a bit   → 4 words
 * - avg <  50: really struggling  → 3 words
 * - no data:   default            → 5 words
 */
export function getAdaptiveWordCount(userId: string): number {
  const scores: number[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dailyKey(userId, d.toISOString().split('T')[0]);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const data = JSON.parse(saved) as DailyLessonPlan;
        if (data.score !== undefined) scores.push(data.score);
      } catch {
        // ignore parse errors
      }
    }
  }

  if (scores.length === 0) return 5; // default

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avg >= 90) return 7; // kid is crushing it — give more
  if (avg >= 70) return 5; // normal pace
  if (avg >= 50) return 4; // struggling a bit
  return 3;                // really struggling — reduce load
}

// ─── Core plan builder ────────────────────────────────────────────────────────

export function getTodayLesson(userId: string): DailyLessonPlan {
  const today = new Date().toISOString().split('T')[0];

  // Return saved plan if already built today
  try {
    const saved = localStorage.getItem(dailyKey(userId, today));
    if (saved) return JSON.parse(saved) as DailyLessonPlan;
  } catch {
    // ignore parse errors — build fresh
  }

  // Determine word count based on recent performance
  const wordCount = getAdaptiveWordCount(userId);

  // Pick new words not yet learned
  const learned = getLearnedWords(userId);
  const newWords = kidsWords
    .filter((w) => !learned.includes(w.word.toLowerCase()))
    .slice(0, wordCount);

  // Fill with first words if everything is learned (demo users)
  const safeNewWords = newWords.length >= wordCount
    ? newWords
    : kidsWords.slice(0, wordCount);

  // Pick up to 5 review words due today
  const reviewWords = getDueReviewWords(5);

  // Pick today's theme
  const themeGroup = THEMED_WORD_GROUPS[Math.floor(Math.random() * THEMED_WORD_GROUPS.length)];

  // Pick a random phrase pair for Phase 4
  const phrasePair = PHRASE_PAIRS[Math.floor(Math.random() * PHRASE_PAIRS.length)];

  // Pick a grammar pattern for Phase 7
  const grammarPattern = GRAMMAR_PATTERNS[Math.floor(Math.random() * GRAMMAR_PATTERNS.length)];

  const plan: DailyLessonPlan = {
    date: today,
    newWords: safeNewWords,
    reviewWords,
    completed: false,
    score: 0,
    themeName: themeGroup.name,
    phrasePair,
    grammarPattern,
  };

  // Persist the plan so the same words show all day
  try {
    localStorage.setItem(dailyKey(userId, today), JSON.stringify(plan));
  } catch {
    // ignore
  }

  return plan;
}

export function isDailyLessonCompletedToday(userId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  try {
    const saved = localStorage.getItem(dailyKey(userId, today));
    if (!saved) return false;
    return (JSON.parse(saved) as DailyLessonPlan).completed;
  } catch {
    return false;
  }
}

export function completeDailyLesson(
  userId: string,
  plan: DailyLessonPlan,
  score: number,
): void {
  const updated: DailyLessonPlan = { ...plan, completed: true, score };

  try {
    localStorage.setItem(dailyKey(userId, plan.date), JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Mark new words as learned
  plan.newWords.forEach((w) => markWordLearned(userId, w.word.toLowerCase()));

  // Update spaced-repetition for review words
  const wasGoodScore = score >= 70;
  plan.reviewWords.forEach((w) => updateWordProgress(w.word.toLowerCase(), wasGoodScore));

  // Also register new words in spaced-repetition engine so they appear for future reviews
  plan.newWords.forEach((w) => updateWordProgress(w.word.toLowerCase(), true));
}

// ─── Phonics: next unmastered sound ──────────────────────────────────────────

/**
 * Returns the next phonics sound the user has not yet mastered.
 * Mastered sounds are stored in localStorage as an array of grapheme strings.
 * Returns null if all 42 sounds are mastered.
 */
export function getTodayPhonicsSound(
  userId: string,
): { grapheme: string; phoneme: string; keyword: string; emoji: string; exampleWords: string[] } | null {
  let mastered: string[] = [];
  try {
    mastered = JSON.parse(
      localStorage.getItem(`mm_mastered_sounds_${userId}`) || '[]',
    ) as string[];
  } catch {
    mastered = [];
  }
  const next = ALL_SOUNDS.find((s) => !mastered.includes(s.grapheme));
  if (!next) return null;
  return {
    grapheme: next.grapheme,
    phoneme: next.ipa,
    keyword: next.keywords?.[0] ?? '',
    emoji: next.mnemonicEmoji ?? '',
    exampleWords: (next.keywords ?? []).slice(0, 4),
  };
}

// ─── Yesterday's words ────────────────────────────────────────────────────────

/**
 * Returns the new words from yesterday's lesson plan for warm-up review.
 */
export function getYesterdayWords(userId: string): KidsWord[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const key = `mm_daily_${userId}_${yesterday.toISOString().split('T')[0]}`;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const plan = JSON.parse(saved) as DailyLessonPlan;
    return plan.newWords.slice(0, 3);
  } catch {
    return [];
  }
}

// ─── CVC Words for blending (Phase 6) ────────────────────────────────────────

export function getTodayCVCWords(): CVCWord[] {
  // Rotate through pool based on day of year for variety
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const offset = (dayOfYear * 3) % CVC_POOL.length;
  const result: CVCWord[] = [];
  for (let i = 0; i < 3; i++) {
    result.push(CVC_POOL[(offset + i) % CVC_POOL.length]);
  }
  return result;
}

// ─── Streak freeze ────────────────────────────────────────────────────────────

/**
 * Returns true if the user is eligible to use a streak freeze.
 * One free miss allowed per 7-day rolling window.
 */
export function shouldFreezeStreak(userId: string): boolean {
  const freezeKey = `mm_streak_freeze_${userId}`;
  const lastFreeze = localStorage.getItem(freezeKey);
  if (lastFreeze) {
    const freezeDate = new Date(lastFreeze);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - freezeDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff < 7) return false; // already used this week
  }
  return true; // can freeze
}

/**
 * Records that the user has consumed their streak freeze for this week.
 * Call this when a missed day is forgiven instead of resetting the streak.
 */
export function useStreakFreeze(userId: string): void {
  try {
    localStorage.setItem(
      `mm_streak_freeze_${userId}`,
      new Date().toISOString(),
    );
  } catch {
    // storage full — ignore
  }
}

// ─── Total learned count ──────────────────────────────────────────────────────

/**
 * How many words has this user learned in total?
 * Uses spaced-repetition entries as the authoritative count.
 */
export function getTotalLearnedCount(userId: string): number {
  // Prefer spaced-rep engine count (more accurate)
  const srCount = loadAllProgress().length;
  if (srCount > 0) return srCount;
  return getLearnedWords(userId).length;
}
