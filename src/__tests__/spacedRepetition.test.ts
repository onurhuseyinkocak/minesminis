import { describe, it, expect } from 'vitest';
import {
  createInitialProgress,
  calculateNextReview,
  getWordsForReview,
  getConfidenceLevel,
} from '../data/spacedRepetition';
import type { WordProgress, ConfidenceLevel } from '../data/spacedRepetition';

// Helper: build a progress entry with overrides
function makeProgress(overrides: Partial<WordProgress> = {}): WordProgress {
  return {
    wordId: 'test-word',
    firstSeen: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
    correctCount: 0,
    incorrectCount: 0,
    confidenceScore: 50,
    interval: 0,
    nextReview: new Date().toISOString(),
    easeFactor: 2.5,
    ...overrides,
  };
}

describe('Spaced Repetition Engine', () => {
  // --------------------------------------------------
  // createInitialProgress
  // --------------------------------------------------
  describe('createInitialProgress', () => {
    it('creates a valid initial state', () => {
      const progress = createInitialProgress('apple');
      expect(progress.wordId).toBe('apple');
      expect(progress.correctCount).toBe(0);
      expect(progress.incorrectCount).toBe(0);
      expect(progress.confidenceScore).toBe(0);
      expect(progress.interval).toBe(0);
      expect(progress.easeFactor).toBe(2.5);
    });

    it('sets firstSeen and lastReviewed to current time', () => {
      const before = Date.now();
      const progress = createInitialProgress('hello');
      const after = Date.now();

      const firstSeen = new Date(progress.firstSeen).getTime();
      const lastReviewed = new Date(progress.lastReviewed).getTime();

      expect(firstSeen).toBeGreaterThanOrEqual(before);
      expect(firstSeen).toBeLessThanOrEqual(after);
      expect(lastReviewed).toBeGreaterThanOrEqual(before);
      expect(lastReviewed).toBeLessThanOrEqual(after);
    });

    it('sets nextReview to now (immediately reviewable)', () => {
      const before = Date.now();
      const progress = createInitialProgress('cat');
      const nextReview = new Date(progress.nextReview).getTime();
      expect(nextReview).toBeGreaterThanOrEqual(before);
      expect(nextReview).toBeLessThanOrEqual(Date.now());
    });
  });

  // --------------------------------------------------
  // calculateNextReview — correct answers
  // --------------------------------------------------
  describe('calculateNextReview (correct)', () => {
    it('increases interval on correct answer', () => {
      const initial = makeProgress({ interval: 0 });
      const updated = calculateNextReview(initial, true);
      expect(updated.interval).toBeGreaterThan(0);
    });

    it('follows the interval steps: 0 -> 1 -> 3 -> 7 -> 14 -> 30 -> 60', () => {
      let progress = makeProgress({ interval: 0 });

      progress = calculateNextReview(progress, true);
      expect(progress.interval).toBe(1);

      progress = calculateNextReview(progress, true);
      expect(progress.interval).toBe(3);

      progress = calculateNextReview(progress, true);
      expect(progress.interval).toBe(7);

      progress = calculateNextReview(progress, true);
      expect(progress.interval).toBe(14);

      progress = calculateNextReview(progress, true);
      expect(progress.interval).toBe(30);

      progress = calculateNextReview(progress, true);
      expect(progress.interval).toBe(60);
    });

    it('scales by ease factor beyond 60 days', () => {
      const progress = makeProgress({ interval: 60, easeFactor: 2.5 });
      const updated = calculateNextReview(progress, true);
      expect(updated.interval).toBe(150); // 60 * 2.5
    });

    it('increases confidence score by 15 on correct', () => {
      const progress = makeProgress({ confidenceScore: 50 });
      const updated = calculateNextReview(progress, true);
      expect(updated.confidenceScore).toBe(65);
    });

    it('clamps confidence at 100', () => {
      const progress = makeProgress({ confidenceScore: 95 });
      const updated = calculateNextReview(progress, true);
      expect(updated.confidenceScore).toBe(100);
    });

    it('increments correctCount', () => {
      const progress = makeProgress({ correctCount: 3 });
      const updated = calculateNextReview(progress, true);
      expect(updated.correctCount).toBe(4);
    });

    it('does not change incorrectCount on correct', () => {
      const progress = makeProgress({ incorrectCount: 2 });
      const updated = calculateNextReview(progress, true);
      expect(updated.incorrectCount).toBe(2);
    });

    it('preserves ease factor at or above minimum', () => {
      const progress = makeProgress({ easeFactor: 2.5 });
      const updated = calculateNextReview(progress, true);
      expect(updated.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  // --------------------------------------------------
  // calculateNextReview — incorrect answers
  // --------------------------------------------------
  describe('calculateNextReview (incorrect)', () => {
    it('resets interval to 1 on incorrect', () => {
      const progress = makeProgress({ interval: 30 });
      const updated = calculateNextReview(progress, false);
      expect(updated.interval).toBe(1);
    });

    it('decreases confidence score by 20 on incorrect', () => {
      const progress = makeProgress({ confidenceScore: 50 });
      const updated = calculateNextReview(progress, false);
      expect(updated.confidenceScore).toBe(30);
    });

    it('clamps confidence at 0', () => {
      const progress = makeProgress({ confidenceScore: 10 });
      const updated = calculateNextReview(progress, false);
      expect(updated.confidenceScore).toBe(0);
    });

    it('decreases ease factor by 0.2 on incorrect', () => {
      const progress = makeProgress({ easeFactor: 2.5 });
      const updated = calculateNextReview(progress, false);
      expect(updated.easeFactor).toBe(2.3);
    });

    it('clamps ease factor at minimum 1.3', () => {
      const progress = makeProgress({ easeFactor: 1.4 });
      const updated = calculateNextReview(progress, false);
      expect(updated.easeFactor).toBe(1.3);
    });

    it('increments incorrectCount', () => {
      const progress = makeProgress({ incorrectCount: 1 });
      const updated = calculateNextReview(progress, false);
      expect(updated.incorrectCount).toBe(2);
    });

    it('does not change correctCount on incorrect', () => {
      const progress = makeProgress({ correctCount: 5 });
      const updated = calculateNextReview(progress, false);
      expect(updated.correctCount).toBe(5);
    });
  });

  // --------------------------------------------------
  // getWordsForReview
  // --------------------------------------------------
  describe('getWordsForReview', () => {
    it('returns only words that are due (nextReview <= now)', () => {
      const pastDue = makeProgress({
        wordId: 'past',
        nextReview: new Date(Date.now() - 86400000).toISOString(),
      });
      const future = makeProgress({
        wordId: 'future',
        nextReview: new Date(Date.now() + 86400000).toISOString(),
      });

      const due = getWordsForReview([pastDue, future]);
      expect(due).toHaveLength(1);
      expect(due[0].wordId).toBe('past');
    });

    it('includes words whose nextReview is exactly now', () => {
      const now = new Date();
      const word = makeProgress({ wordId: 'now', nextReview: now.toISOString() });
      const due = getWordsForReview([word]);
      expect(due).toHaveLength(1);
    });

    it('sorts by urgency — most overdue first', () => {
      const oldest = makeProgress({
        wordId: 'oldest',
        nextReview: new Date(Date.now() - 3 * 86400000).toISOString(),
      });
      const middle = makeProgress({
        wordId: 'middle',
        nextReview: new Date(Date.now() - 1 * 86400000).toISOString(),
      });
      const recent = makeProgress({
        wordId: 'recent',
        nextReview: new Date(Date.now() - 100).toISOString(),
      });

      const due = getWordsForReview([recent, oldest, middle]);
      expect(due.map((w) => w.wordId)).toEqual(['oldest', 'middle', 'recent']);
    });

    it('respects the limit parameter', () => {
      const words = Array.from({ length: 30 }, (_, i) =>
        makeProgress({
          wordId: `word-${i}`,
          nextReview: new Date(Date.now() - 1000).toISOString(),
        })
      );
      expect(getWordsForReview(words, 5)).toHaveLength(5);
    });

    it('defaults to limit of 20', () => {
      const words = Array.from({ length: 30 }, (_, i) =>
        makeProgress({
          wordId: `word-${i}`,
          nextReview: new Date(Date.now() - 1000).toISOString(),
        })
      );
      expect(getWordsForReview(words)).toHaveLength(20);
    });

    it('returns empty array when no words are due', () => {
      const future = makeProgress({
        wordId: 'future',
        nextReview: new Date(Date.now() + 86400000).toISOString(),
      });
      expect(getWordsForReview([future])).toHaveLength(0);
    });
  });

  // --------------------------------------------------
  // getConfidenceLevel
  // --------------------------------------------------
  describe('getConfidenceLevel', () => {
    const cases: [number, ConfidenceLevel][] = [
      [0, 'new'],
      [10, 'new'],
      [25, 'new'],
      [26, 'learning'],
      [40, 'learning'],
      [50, 'learning'],
      [51, 'reviewing'],
      [75, 'reviewing'],
      [76, 'mastered'],
      [100, 'mastered'],
    ];

    it.each(cases)('score %d → %s', (score, expected) => {
      expect(getConfidenceLevel(score)).toBe(expected);
    });
  });
});
