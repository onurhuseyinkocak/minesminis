import { describe, it, expect } from 'vitest';
import { WORLDS, getWorldById, getLessonById, getAllVocabulary } from '../data/curriculum';
import type { Activity } from '../data/curriculum';

// Valid activity types defined in the curriculum module
const VALID_ACTIVITY_TYPES: Activity['type'][] = [
  'word-match',
  'phonics-builder',
  'sentence-scramble',
  'listening-challenge',
  'spelling-bee',
  'quick-quiz',
  'story-choices',
];

describe('Curriculum Data', () => {
  // --------------------------------------------------
  // World-level checks
  // --------------------------------------------------
  it('contains exactly 12 worlds', () => {
    expect(WORLDS).toHaveLength(12);
  });

  it('each world has a unique id', () => {
    const ids = WORLDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each world has exactly 10 lessons', () => {
    for (const world of WORLDS) {
      expect(world.lessons).toHaveLength(10);
    }
  });

  it('each world has at least 20 vocabulary words', () => {
    for (const world of WORLDS) {
      expect(world.vocabulary.length).toBeGreaterThanOrEqual(20);
    }
  });

  it('each world has required fields', () => {
    for (const world of WORLDS) {
      expect(world.id).toBeTruthy();
      expect(world.name).toBeTruthy();
      expect(world.nameTr).toBeTruthy();
      expect(world.description).toBeTruthy();
      expect(world.icon).toBeTruthy();
      expect(world.color).toBeTruthy();
      expect(typeof world.number).toBe('number');
      expect(typeof world.totalXp).toBe('number');
    }
  });

  // --------------------------------------------------
  // Lesson-level checks
  // --------------------------------------------------
  it('each lesson has at least one activity', () => {
    for (const world of WORLDS) {
      for (const lesson of world.lessons) {
        expect(lesson.activities.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('no duplicate lesson IDs across all worlds', () => {
    const ids: string[] = [];
    for (const world of WORLDS) {
      for (const lesson of world.lessons) {
        ids.push(lesson.id);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all activity types are valid', () => {
    for (const world of WORLDS) {
      for (const lesson of world.lessons) {
        for (const activity of lesson.activities) {
          expect(VALID_ACTIVITY_TYPES).toContain(activity.type);
        }
      }
    }
  });

  it('each lesson has a valid type', () => {
    const validTypes = ['vocabulary', 'phonics', 'grammar', 'story', 'review'];
    for (const world of WORLDS) {
      for (const lesson of world.lessons) {
        expect(validTypes).toContain(lesson.type);
      }
    }
  });

  // --------------------------------------------------
  // Vocabulary checks
  // --------------------------------------------------
  it('vocabulary words have required fields', () => {
    for (const world of WORLDS) {
      for (const word of world.vocabulary) {
        expect(word.english).toBeTruthy();
        expect(word.turkish).toBeTruthy();
        expect(word.emoji).toBeTruthy();
        expect(word.category).toBeTruthy();
        expect(word.phonetic).toBeTruthy();
        expect(word.exampleSentence).toBeTruthy();
      }
    }
  });

  // --------------------------------------------------
  // Helper functions
  // --------------------------------------------------
  describe('getWorldById', () => {
    it('returns the correct world for a valid ID', () => {
      const world = getWorldById('world-1');
      expect(world).toBeDefined();
      expect(world!.name).toBe('Hello World');
    });

    it('returns undefined for an unknown ID', () => {
      expect(getWorldById('world-99')).toBeUndefined();
    });

    it('returns each world correctly', () => {
      for (const w of WORLDS) {
        const found = getWorldById(w.id);
        expect(found).toBeDefined();
        expect(found!.id).toBe(w.id);
      }
    });
  });

  describe('getLessonById', () => {
    it('returns the correct lesson', () => {
      const lesson = getLessonById('world-1', 'w1-l1');
      expect(lesson).toBeDefined();
      expect(lesson!.id).toBe('w1-l1');
      expect(lesson!.worldId).toBe('world-1');
    });

    it('returns undefined for an unknown lesson ID', () => {
      expect(getLessonById('world-1', 'w1-l99')).toBeUndefined();
    });

    it('returns undefined for an unknown world ID', () => {
      expect(getLessonById('world-99', 'w1-l1')).toBeUndefined();
    });
  });

  describe('getAllVocabulary', () => {
    it('returns all vocabulary words from every world', () => {
      const allWords = getAllVocabulary();
      const expectedCount = WORLDS.reduce((sum, w) => sum + w.vocabulary.length, 0);
      expect(allWords).toHaveLength(expectedCount);
    });

    it('returns at least 240 words (12 worlds x 20 min)', () => {
      expect(getAllVocabulary().length).toBeGreaterThanOrEqual(240);
    });

    it('each word in the result has english and turkish fields', () => {
      for (const word of getAllVocabulary()) {
        expect(word.english).toBeTruthy();
        expect(word.turkish).toBeTruthy();
      }
    });
  });
});
