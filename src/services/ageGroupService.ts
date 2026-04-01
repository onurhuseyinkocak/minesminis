/**
 * Age Group Service
 * Maps user age group to appropriate content settings.
 * Called at render time to filter games, activities, and adjust UX.
 */

export type AgeGroup = '3-5' | '5-7' | '7-9' | '9-10' | '';

export interface AgeGroupConfig {
  /** Max game difficulty (1-5) */
  maxDifficulty: number;
  /** Min game difficulty (1-5) */
  minDifficulty: number;
  /** Activity types allowed for this age */
  allowedActivityTypes: string[];
  /** Activity types that should NOT appear */
  blockedActivityTypes: string[];
  /** Game types that should NOT appear */
  blockedGameTypes: string[];
  /** Max session time in minutes */
  maxSessionMinutes: number;
  /** Max words per game */
  maxWordsPerGame: number;
  /** Show grammar activities */
  showGrammar: boolean;
  /** Show sentence-level activities */
  showSentences: boolean;
  /** Show complex phonics (digraphs, trigraphs) */
  showComplexPhonics: boolean;
  /** Friendly label */
  label: string;
}

const AGE_CONFIGS: Record<string, AgeGroupConfig> = {
  '3-5': {
    maxDifficulty: 2,
    minDifficulty: 1,
    allowedActivityTypes: ['sound-intro', 'listening', 'tpr', 'image-label'],
    blockedActivityTypes: ['spelling', 'reading', 'grammar', 'sentence-scramble', 'blending', 'segmenting'],
    blockedGameTypes: ['spelling-bee', 'sentence-scramble', 'phoneme-manipulation'],
    maxSessionMinutes: 10,
    maxWordsPerGame: 4,
    showGrammar: false,
    showSentences: false,
    showComplexPhonics: false,
    label: '3-5 Yaş',
  },
  '5-7': {
    maxDifficulty: 3,
    minDifficulty: 1,
    allowedActivityTypes: ['sound-intro', 'listening', 'tpr', 'blending', 'image-label', 'word-match'],
    blockedActivityTypes: ['grammar', 'dialogue'],
    blockedGameTypes: ['sentence-scramble'],
    maxSessionMinutes: 15,
    maxWordsPerGame: 6,
    showGrammar: false,
    showSentences: false,
    showComplexPhonics: false,
    label: '5-7 Yaş',
  },
  '7-9': {
    maxDifficulty: 4,
    minDifficulty: 1,
    allowedActivityTypes: ['sound-intro', 'listening', 'tpr', 'blending', 'segmenting', 'reading', 'spelling', 'image-label', 'word-match', 'sentence-scramble', 'rhyme'],
    blockedActivityTypes: [],
    blockedGameTypes: [],
    maxSessionMinutes: 20,
    maxWordsPerGame: 8,
    showGrammar: true,
    showSentences: true,
    showComplexPhonics: true,
    label: '7-9 Yaş',
  },
  '9-10': {
    maxDifficulty: 5,
    minDifficulty: 2,
    allowedActivityTypes: [], // all allowed
    blockedActivityTypes: ['tpr', 'sound-intro'], // too basic
    blockedGameTypes: [],
    maxSessionMinutes: 30,
    maxWordsPerGame: 10,
    showGrammar: true,
    showSentences: true,
    showComplexPhonics: true,
    label: '9-10 Yaş',
  },
};

const DEFAULT_CONFIG: AgeGroupConfig = AGE_CONFIGS['7-9'];

export function getAgeGroupConfig(ageGroup: string | null | undefined): AgeGroupConfig {
  if (!ageGroup) return DEFAULT_CONFIG;
  return AGE_CONFIGS[ageGroup] ?? DEFAULT_CONFIG;
}

export function getAgeGroupFromSettings(settings: Record<string, unknown> | null | undefined): AgeGroup {
  return (settings?.ageGroup as AgeGroup) ?? '';
}

export function isGameAllowedForAge(gameType: string, ageGroup: string | null | undefined): boolean {
  const config = getAgeGroupConfig(ageGroup);
  return !config.blockedGameTypes.includes(gameType);
}

export function isActivityAllowedForAge(activityType: string, ageGroup: string | null | undefined): boolean {
  const config = getAgeGroupConfig(ageGroup);
  if (config.blockedActivityTypes.includes(activityType)) return false;
  if (config.allowedActivityTypes.length > 0 && !config.allowedActivityTypes.includes(activityType)) return false;
  return true;
}

export function getMaxWordsForAge(ageGroup: string | null | undefined): number {
  return getAgeGroupConfig(ageGroup).maxWordsPerGame;
}

// ── Age-based word filtering ─────────────────────────────────────────────────

// Word difficulty levels mapped to age groups
const WORD_DIFFICULTY_BY_AGE: Record<string, { maxLetters: number; maxSyllables: number; groups: number[] }> = {
  '3-5':  { maxLetters: 4, maxSyllables: 1, groups: [1, 2] },
  '5-7':  { maxLetters: 6, maxSyllables: 2, groups: [1, 2, 3, 4] },
  '7-9':  { maxLetters: 8, maxSyllables: 3, groups: [1, 2, 3, 4, 5, 6] },
  '9-10': { maxLetters: 12, maxSyllables: 4, groups: [1, 2, 3, 4, 5, 6, 7] },
};

export function filterWordsForAge<T extends {word: string; group?: number}>(words: T[], ageGroup: string): T[] {
  const config = WORD_DIFFICULTY_BY_AGE[ageGroup] || WORD_DIFFICULTY_BY_AGE['7-9'];
  return words.filter(w => {
    if (w.word.length > config.maxLetters) return false;
    if (w.group && !config.groups.includes(w.group)) return false;
    return true;
  });
}

export function getGameDifficultyForAge(ageGroup: string): number {
  const config = getAgeGroupConfig(ageGroup);
  return config.maxDifficulty ?? 3;
}

export function getTimerDurationForAge(ageGroup: string): number {
  // Younger = more time
  switch(ageGroup) {
    case '3-5': return 30; // 30 seconds
    case '5-7': return 20;
    case '7-9': return 15;
    case '9-10': return 12;
    default: return 15;
  }
}

export function getOptionsCountForAge(ageGroup: string): number {
  // Younger = fewer options
  switch(ageGroup) {
    case '3-5': return 2; // Only 2 choices
    case '5-7': return 3;
    case '7-9': return 4;
    case '9-10': return 4;
    default: return 4;
  }
}

export function getQuestionsCountForAge(ageGroup: string): number {
  // Younger = fewer questions per round
  switch(ageGroup) {
    case '3-5': return 4;
    case '5-7': return 6;
    case '7-9': return 8;
    case '9-10': return 10;
    default: return 8;
  }
}
