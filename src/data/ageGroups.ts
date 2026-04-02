// ============================================================
// MinesMinis — Age-Based Content System
// Turkish MEB + Private English Schools Curriculum Mapping
// ============================================================

export interface AgeGroupConfig {
  id: number;
  label: string;
  labelTr: string;
  ageMin: number;
  ageMax: number;
  gradeTr: string;
  description: string;
  descriptionTr: string;
  maxWords: number;
  phonicsGroups: number[];
  unlockedExerciseTypes: string[];
  unlockedGameTypes: string[];
  unlockedStoryTypes: string[];
}

/**
 * Age group definitions based on Turkish MEB curriculum.
 * The `id` matches the `age_group_min` column in Supabase tables.
 */
export const AGE_GROUPS: AgeGroupConfig[] = [
  {
    id: 3,
    label: 'Toddlers',
    labelTr: 'Minikler',
    ageMin: 3,
    ageMax: 4,
    gradeTr: 'Anaokulu (3-4 yas)',
    description: 'Sound awareness, basic vocabulary (~30 words), picture matching, TPR',
    descriptionTr: 'Ses farkindaligi, temel kelime hazinesi (~30 kelime), resim eslestirme, TPR',
    maxWords: 30,
    phonicsGroups: [],
    unlockedExerciseTypes: ['listening', 'image_label', 'rhyme', 'say_it'],
    unlockedGameTypes: ['image_match', 'color_sort'],
    unlockedStoryTypes: ['picture_only'],
  },
  {
    id: 4,
    label: 'Little Ones',
    labelTr: 'Kucukler',
    ageMin: 4,
    ageMax: 5,
    gradeTr: 'Anaokulu (4-5 yas)',
    description: 'Sound awareness, letter names, expanded vocabulary (~60 words), simple songs',
    descriptionTr: 'Ses farkindaligi, harf isimleri, genisletilmis kelime hazinesi (~60 kelime), basit sarkilar',
    maxWords: 60,
    phonicsGroups: [],
    unlockedExerciseTypes: ['listening', 'image_label', 'rhyme', 'say_it', 'syllable'],
    unlockedGameTypes: ['image_match', 'color_sort', 'word_match', 'picture_quiz'],
    unlockedStoryTypes: ['picture_with_words'],
  },
  {
    id: 5,
    label: 'Pre-school',
    labelTr: 'Hazirlik',
    ageMin: 5,
    ageMax: 6,
    gradeTr: 'Hazirlik (5-6 yas)',
    description: 'Phonics groups 1-2, blending intro, letter tracing, ~100 words, simple CVC stories',
    descriptionTr: 'Fonik gruplari 1-2, birlestirme girisi, harf cizimi, ~100 kelime, basit CVC hikayeleri',
    maxWords: 100,
    phonicsGroups: [1, 2],
    unlockedExerciseTypes: ['listening', 'image_label', 'rhyme', 'say_it', 'syllable', 'blending', 'word_family'],
    unlockedGameTypes: ['image_match', 'color_sort', 'word_match', 'picture_quiz', 'spelling_bee_3'],
    unlockedStoryTypes: ['picture_with_words', 'cvc_stories'],
  },
  {
    id: 6,
    label: 'Grade 1',
    labelTr: '1. Sinif',
    ageMin: 6,
    ageMax: 7,
    gradeTr: '1. Sinif (6-7 yas)',
    description: 'Phonics groups 1-4, blending & segmenting, reading/writing CVC, ~180 words, decodable stories',
    descriptionTr: 'Fonik gruplari 1-4, birlestirme ve ayirma, CVC okuma/yazma, ~180 kelime, cozumlenebilir hikayeler',
    maxWords: 180,
    phonicsGroups: [1, 2, 3, 4],
    unlockedExerciseTypes: ['listening', 'image_label', 'rhyme', 'say_it', 'syllable', 'blending', 'word_family', 'phoneme_manipulation'],
    unlockedGameTypes: ['image_match', 'color_sort', 'word_match', 'picture_quiz', 'spelling_bee_3', 'quick_quiz', 'spelling_bee_4'],
    unlockedStoryTypes: ['picture_with_words', 'cvc_stories', 'decodable_stories'],
  },
  {
    id: 7,
    label: 'Grade 2',
    labelTr: '2. Sinif',
    ageMin: 7,
    ageMax: 8,
    gradeTr: '2. Sinif (7-8 yas)',
    description: 'Phonics groups 1-6, reading fluency, grammar basics, dialogue, ~300 words',
    descriptionTr: 'Fonik gruplari 1-6, okuma akiciligi, gramer temelleri, diyalog, ~300 kelime',
    maxWords: 300,
    phonicsGroups: [1, 2, 3, 4, 5, 6],
    unlockedExerciseTypes: ['listening', 'image_label', 'rhyme', 'say_it', 'syllable', 'blending', 'word_family', 'phoneme_manipulation', 'grammar', 'dialogue'],
    unlockedGameTypes: ['image_match', 'color_sort', 'word_match', 'picture_quiz', 'spelling_bee_3', 'quick_quiz', 'spelling_bee_4', 'sentence_building', 'grammar_games'],
    unlockedStoryTypes: ['picture_with_words', 'cvc_stories', 'decodable_stories', 'comprehension_stories'],
  },
  {
    id: 8,
    label: 'Grades 3-4',
    labelTr: '3-4. Sinif',
    ageMin: 8,
    ageMax: 10,
    gradeTr: '3-4. Sinif (8-10 yas)',
    description: 'All 7 phonics groups, full curriculum, all 462 words, adventure mode',
    descriptionTr: 'Tum 7 fonik grubu, tam mufredat, tum 462 kelime, macera modu',
    maxWords: 462,
    phonicsGroups: [1, 2, 3, 4, 5, 6, 7],
    unlockedExerciseTypes: ['listening', 'image_label', 'rhyme', 'say_it', 'syllable', 'blending', 'word_family', 'phoneme_manipulation', 'grammar', 'dialogue'],
    unlockedGameTypes: ['image_match', 'color_sort', 'word_match', 'picture_quiz', 'spelling_bee_3', 'quick_quiz', 'spelling_bee_4', 'sentence_building', 'grammar_games', 'full_difficulty'],
    unlockedStoryTypes: ['picture_with_words', 'cvc_stories', 'decodable_stories', 'comprehension_stories', 'adventure_stories'],
  },
];

/**
 * Get the age group config for a given child age.
 */
export function getAgeGroupForAge(age: number): AgeGroupConfig {
  // Find the best matching group
  const sorted = [...AGE_GROUPS].sort((a, b) => b.ageMin - a.ageMin);
  for (const group of sorted) {
    if (age >= group.ageMin) {
      return group;
    }
  }
  // Default to youngest group
  return AGE_GROUPS[0];
}

/**
 * Get the age group config by its ID (matches age_group_min in DB).
 */
export function getAgeGroupById(id: number): AgeGroupConfig | undefined {
  return AGE_GROUPS.find((g) => g.id === id);
}

/**
 * Check if a content item (with age_group_min) is appropriate for a given child age.
 */
export function isContentAppropriate(contentAgeGroupMin: number, childAge: number): boolean {
  const childGroup = getAgeGroupForAge(childAge);
  return contentAgeGroupMin <= childGroup.id;
}

/**
 * Filter an array of items by age appropriateness.
 * Items must have an `age_group_min` or `ageGroupMin` property.
 */
export function filterByAge<T extends { age_group_min?: number; ageGroupMin?: number }>(
  items: T[],
  childAge: number
): T[] {
  const childGroup = getAgeGroupForAge(childAge);
  return items.filter((item) => {
    const minAge = item.age_group_min ?? item.ageGroupMin ?? 3;
    return minAge <= childGroup.id;
  });
}

/**
 * Map between old AgeGroup type names and new MEB-based IDs.
 */
export const AGE_GROUP_LEGACY_MAP: Record<string, number> = {
  'little-seeds': 3,
  'little-ears': 4,
  'word-builders': 5,
  'story-makers': 7,
  'young-explorers': 8,
};

/**
 * Word category to age group mapping (for reference/validation).
 * This mirrors what's in the database.
 */
export const CATEGORY_AGE_MAP: Record<string, Record<string, number>> = {
  Colors: {
    default: 4,
    // red, blue, green, yellow = 3
    red: 3, blue: 3, green: 3, yellow: 3,
  },
  Numbers: {
    default: 4,
    // 1-5 = 3
    one: 3, two: 3, three: 3, four: 3, five: 3,
  },
  Animals: {
    default: 5,
    // cat, dog, fish, bird = 3
    cat: 3, dog: 3, fish: 3, bird: 3,
    // duck, frog, bear, rabbit, cow, pig, hen, bee, ant, butterfly = 4
    duck: 4, frog: 4, bear: 4, rabbit: 4, cow: 4, pig: 4, hen: 4, bee: 4, ant: 4, butterfly: 4,
  },
  Body: {
    default: 5,
    head: 3, hand: 3, foot: 3,
    eye: 4, ear: 4, nose: 4, mouth: 4, hair: 4, tummy: 4, arm: 4, leg: 4,
  },
  Family: {
    default: 6,
    mom: 3, dad: 3, baby: 3,
    brother: 4, sister: 4, grandma: 4, grandpa: 4, family: 4,
  },
  Food: {
    default: 5,
    apple: 4, banana: 4, strawberry: 4, fruit: 4,
  },
  Nature: {
    default: 6,
    sun: 5, moon: 5, star: 5, rain: 5, snow: 5, cloud: 5, tree: 5, flower: 5, grass: 5, sky: 5,
  },
  emotions: {
    default: 4,
  },
  adjectives: {
    default: 7,
  },
  people: {
    default: 6,
  },
};
