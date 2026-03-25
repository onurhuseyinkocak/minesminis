/**
 * PHONICS BLEND EXERCISES
 *
 * 30 BlendQuestion items across 3 difficulty levels:
 *   Easy (10)  — CVC words
 *   Medium (10)— CCVC / CVCC words
 *   Hard (10)  — CCVCC words
 */

import type { BlendQuestion } from '../components/games/PhonicsBlendGame';

// ── Easy: CVC ─────────────────────────────────────────────────────────────────

const easyQuestions: BlendQuestion[] = [
  {
    id: 'easy_01',
    sounds: ['c', 'a', 't'],
    word: 'cat',
    wordTr: 'kedi',
    difficulty: 'easy',
  },
  {
    id: 'easy_02',
    sounds: ['d', 'o', 'g'],
    word: 'dog',
    wordTr: 'köpek',
    difficulty: 'easy',
  },
  {
    id: 'easy_03',
    sounds: ['s', 'u', 'n'],
    word: 'sun',
    wordTr: 'güneş',
    difficulty: 'easy',
  },
  {
    id: 'easy_04',
    sounds: ['h', 'a', 't'],
    word: 'hat',
    wordTr: 'şapka',
    difficulty: 'easy',
  },
  {
    id: 'easy_05',
    sounds: ['p', 'i', 'g'],
    word: 'pig',
    wordTr: 'domuz',
    difficulty: 'easy',
  },
  {
    id: 'easy_06',
    sounds: ['c', 'u', 'p'],
    word: 'cup',
    wordTr: 'fincan',
    difficulty: 'easy',
  },
  {
    id: 'easy_07',
    sounds: ['b', 'e', 'd'],
    word: 'bed',
    wordTr: 'yatak',
    difficulty: 'easy',
  },
  {
    id: 'easy_08',
    sounds: ['m', 'a', 'p'],
    word: 'map',
    wordTr: 'harita',
    difficulty: 'easy',
  },
  {
    id: 'easy_09',
    sounds: ['t', 'o', 'p'],
    word: 'top',
    wordTr: 'tepe / zirve',
    difficulty: 'easy',
  },
  {
    id: 'easy_10',
    sounds: ['n', 'e', 't'],
    word: 'net',
    wordTr: 'ağ',
    difficulty: 'easy',
  },
];

// ── Medium: CCVC / CVCC ───────────────────────────────────────────────────────

const mediumQuestions: BlendQuestion[] = [
  {
    id: 'med_01',
    sounds: ['cl', 'a', 'p'],
    word: 'clap',
    wordTr: 'alkış',
    difficulty: 'medium',
  },
  {
    id: 'med_02',
    sounds: ['fr', 'o', 'g'],
    word: 'frog',
    wordTr: 'kurbağa',
    difficulty: 'medium',
  },
  {
    id: 'med_03',
    sounds: ['st', 'e', 'p'],
    word: 'step',
    wordTr: 'adım',
    difficulty: 'medium',
  },
  {
    id: 'med_04',
    sounds: ['gr', 'a', 'b'],
    word: 'grab',
    wordTr: 'kavramak',
    difficulty: 'medium',
  },
  {
    id: 'med_05',
    sounds: ['sp', 'i', 'n'],
    word: 'spin',
    wordTr: 'dönmek',
    difficulty: 'medium',
  },
  {
    id: 'med_06',
    sounds: ['fl', 'a', 't'],
    word: 'flat',
    wordTr: 'düz / daire',
    difficulty: 'medium',
  },
  {
    id: 'med_07',
    sounds: ['dr', 'i', 'p'],
    word: 'drip',
    wordTr: 'damlamak',
    difficulty: 'medium',
  },
  {
    id: 'med_08',
    sounds: ['sl', 'i', 'm'],
    word: 'slim',
    wordTr: 'ince / zayıf',
    difficulty: 'medium',
  },
  {
    id: 'med_09',
    sounds: ['pl', 'o', 'p'],
    word: 'plop',
    wordTr: 'çöp / düşme sesi',
    difficulty: 'medium',
  },
  {
    id: 'med_10',
    sounds: ['br', 'i', 'm'],
    word: 'brim',
    wordTr: 'kenar / ağız',
    difficulty: 'medium',
  },
];

// ── Hard: CCVCC ───────────────────────────────────────────────────────────────

const hardQuestions: BlendQuestion[] = [
  {
    id: 'hard_01',
    sounds: ['bl', 'a', 'ck'],
    word: 'black',
    wordTr: 'siyah',
    difficulty: 'hard',
  },
  {
    id: 'hard_02',
    sounds: ['cl', 'e', 'ft'],
    word: 'cleft',
    wordTr: 'yarık / çatlak',
    difficulty: 'hard',
  },
  {
    id: 'hard_03',
    sounds: ['shr', 'i', 'mp'],
    word: 'shrimp',
    wordTr: 'karides',
    difficulty: 'hard',
  },
  {
    id: 'hard_04',
    sounds: ['bl', 'e', 'nd'],
    word: 'blend',
    wordTr: 'karışım / harmanlama',
    difficulty: 'hard',
  },
  {
    id: 'hard_05',
    sounds: ['tr', 'u', 'st'],
    word: 'trust',
    wordTr: 'güven',
    difficulty: 'hard',
  },
  {
    id: 'hard_06',
    sounds: ['cr', 'a', 'ft'],
    word: 'craft',
    wordTr: 'el işi / zanaat',
    difficulty: 'hard',
  },
  {
    id: 'hard_07',
    sounds: ['st', 'o', 'mp'],
    word: 'stomp',
    wordTr: 'gümbürdetmek',
    difficulty: 'hard',
  },
  {
    id: 'hard_08',
    sounds: ['sw', 'i', 'ft'],
    word: 'swift',
    wordTr: 'hızlı / çabuk',
    difficulty: 'hard',
  },
  {
    id: 'hard_09',
    sounds: ['cr', 'i', 'mp'],
    word: 'crimp',
    wordTr: 'kıvırmak / bükmek',
    difficulty: 'hard',
  },
  {
    id: 'hard_10',
    sounds: ['cl', 'a', 'mp'],
    word: 'clamp',
    wordTr: 'mengene / kıskaç',
    difficulty: 'hard',
  },
];

// ── Combined export ───────────────────────────────────────────────────────────

export const phonicsBlendExercises: BlendQuestion[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions,
];

export { easyQuestions, mediumQuestions, hardQuestions };
