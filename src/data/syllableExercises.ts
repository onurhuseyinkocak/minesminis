// Syllable segmentation exercises — 25 words, 1-4 syllables
// Used by SyllableGame

export interface SyllableQuestion {
  id: string;
  word: string;
  wordTr: string;
  syllables: string[];
  syllableCount: number;
  imageWord?: string;
}

export const SYLLABLE_EXERCISES: SyllableQuestion[] = [
  // 1 syllable
  {
    id: 'syl-cat',
    word: 'cat',
    wordTr: 'kedi',
    syllables: ['cat'],
    syllableCount: 1,
    imageWord: 'cat',
  },
  {
    id: 'syl-dog',
    word: 'dog',
    wordTr: 'köpek',
    syllables: ['dog'],
    syllableCount: 1,
    imageWord: 'dog',
  },
  {
    id: 'syl-sun',
    word: 'sun',
    wordTr: 'güneş',
    syllables: ['sun'],
    syllableCount: 1,
    imageWord: 'sun',
  },
  {
    id: 'syl-hat',
    word: 'hat',
    wordTr: 'şapka',
    syllables: ['hat'],
    syllableCount: 1,
    imageWord: 'hat',
  },
  {
    id: 'syl-run',
    word: 'run',
    wordTr: 'koşmak',
    syllables: ['run'],
    syllableCount: 1,
  },

  // 2 syllables
  {
    id: 'syl-monkey',
    word: 'monkey',
    wordTr: 'maymun',
    syllables: ['mon', 'key'],
    syllableCount: 2,
  },
  {
    id: 'syl-apple',
    word: 'apple',
    wordTr: 'elma',
    syllables: ['ap', 'ple'],
    syllableCount: 2,
    imageWord: 'apple',
  },
  {
    id: 'syl-turtle',
    word: 'turtle',
    wordTr: 'kaplumbağa',
    syllables: ['tur', 'tle'],
    syllableCount: 2,
  },
  {
    id: 'syl-happy',
    word: 'happy',
    wordTr: 'mutlu',
    syllables: ['hap', 'py'],
    syllableCount: 2,
  },
  {
    id: 'syl-garden',
    word: 'garden',
    wordTr: 'bahçe',
    syllables: ['gar', 'den'],
    syllableCount: 2,
  },
  {
    id: 'syl-butter',
    word: 'butter',
    wordTr: 'tereyağı',
    syllables: ['but', 'ter'],
    syllableCount: 2,
  },
  {
    id: 'syl-pencil',
    word: 'pencil',
    wordTr: 'kalem',
    syllables: ['pen', 'cil'],
    syllableCount: 2,
  },
  {
    id: 'syl-winter',
    word: 'winter',
    wordTr: 'kış',
    syllables: ['win', 'ter'],
    syllableCount: 2,
  },

  // 3 syllables
  {
    id: 'syl-elephant',
    word: 'elephant',
    wordTr: 'fil',
    syllables: ['el', 'e', 'phant'],
    syllableCount: 3,
  },
  {
    id: 'syl-banana',
    word: 'banana',
    wordTr: 'muz',
    syllables: ['ba', 'na', 'na'],
    syllableCount: 3,
    imageWord: 'banana',
  },
  {
    id: 'syl-umbrella',
    word: 'umbrella',
    wordTr: 'şemsiye',
    syllables: ['um', 'brel', 'la'],
    syllableCount: 3,
  },
  {
    id: 'syl-tomorrow',
    word: 'tomorrow',
    wordTr: 'yarın',
    syllables: ['to', 'mor', 'row'],
    syllableCount: 3,
  },
  {
    id: 'syl-potato',
    word: 'potato',
    wordTr: 'patates',
    syllables: ['po', 'ta', 'to'],
    syllableCount: 3,
  },
  {
    id: 'syl-remember',
    word: 'remember',
    wordTr: 'hatırlamak',
    syllables: ['re', 'mem', 'ber'],
    syllableCount: 3,
  },
  {
    id: 'syl-amazing',
    word: 'amazing',
    wordTr: 'muhteşem',
    syllables: ['a', 'maz', 'ing'],
    syllableCount: 3,
  },
  {
    id: 'syl-together',
    word: 'together',
    wordTr: 'beraber',
    syllables: ['to', 'geth', 'er'],
    syllableCount: 3,
  },

  // 4 syllables
  {
    id: 'syl-caterpillar',
    word: 'caterpillar',
    wordTr: 'tırtıl',
    syllables: ['cat', 'er', 'pil', 'lar'],
    syllableCount: 4,
  },
  {
    id: 'syl-hippopotamus',
    word: 'hippopotamus',
    wordTr: 'su aygırı',
    syllables: ['hip', 'po', 'pot', 'a', 'mus'],
    syllableCount: 5,
  },
  {
    id: 'syl-vocabulary',
    word: 'vocabulary',
    wordTr: 'kelime dağarcığı',
    syllables: ['vo', 'cab', 'u', 'lar', 'y'],
    syllableCount: 5,
  },
  {
    id: 'syl-information',
    word: 'information',
    wordTr: 'bilgi',
    syllables: ['in', 'for', 'ma', 'tion'],
    syllableCount: 4,
  },
];
