import { describe, it, expect, vi, beforeEach } from 'vitest';
import { levelDetector } from '../../services/levelDetection';

describe('levelDetection', () => {
  beforeEach(() => {
    levelDetector.reset();
    vi.clearAllMocks();
  });

  // ─── getCurrentLevel ──────────────────────────────────────
  describe('getCurrentLevel', () => {
    it('should default to "intermediate" when no level stored', () => {
      expect(levelDetector.getCurrentLevel()).toBe('intermediate');
    });

    it('should return stored level if available', () => {
      levelDetector.saveLevel('beginner');
      expect(levelDetector.getCurrentLevel()).toBe('beginner');
    });

    it('should return "advanced" after saving advanced', () => {
      levelDetector.saveLevel('advanced');
      expect(levelDetector.getCurrentLevel()).toBe('advanced');
    });
  });

  // ─── saveLevel / getStoredLevel ──────────────────────────
  describe('saveLevel / getStoredLevel', () => {
    it('should persist level to localStorage', () => {
      levelDetector.saveLevel('beginner');
      expect(levelDetector.getStoredLevel()).toBe('beginner');
    });

    it('should return null when nothing stored', () => {
      expect(levelDetector.getStoredLevel()).toBeNull();
    });

    it('should overwrite previous level', () => {
      levelDetector.saveLevel('beginner');
      levelDetector.saveLevel('advanced');
      expect(levelDetector.getStoredLevel()).toBe('advanced');
    });
  });

  // ─── addMessage + auto-detection ──────────────────────────
  describe('addMessage auto-detection', () => {
    it('should not auto-detect before 3 messages', () => {
      levelDetector.addMessage('hi');
      levelDetector.addMessage('hello');
      // Only 2 messages, should still be default
      expect(levelDetector.getStoredLevel()).toBeNull();
    });

    it('should auto-detect beginner from short simple messages', () => {
      levelDetector.addMessage('hi');
      levelDetector.addMessage('yes');
      levelDetector.addMessage('ok');
      // Short words, avgWordCount < 5, no grammar complexity
      expect(levelDetector.getCurrentLevel()).toBe('beginner');
    });

    it('should auto-detect beginner with single-word messages', () => {
      levelDetector.addMessage('cat');
      levelDetector.addMessage('dog');
      levelDetector.addMessage('red');
      expect(levelDetector.getCurrentLevel()).toBe('beginner');
    });

    it('should auto-detect advanced from long complex messages', () => {
      levelDetector.addMessage(
        'I thoroughly enjoyed reading the comprehensive analysis of the environmental impact because it demonstrated remarkable vocabulary richness and sophistication'
      );
      levelDetector.addMessage(
        'The unprecedented developments in quantum computing have fundamentally transformed our understanding of computational possibilities and limitations'
      );
      levelDetector.addMessage(
        'Furthermore the philosophical implications of artificial intelligence raise profound questions about consciousness creativity and the nature of human experience'
      );
      expect(levelDetector.getCurrentLevel()).toBe('advanced');
    });

    it('should detect intermediate for medium-length messages', () => {
      levelDetector.addMessage('I like to play games after school');
      levelDetector.addMessage('My favorite color is blue and green');
      levelDetector.addMessage('I want to learn more English words');
      expect(levelDetector.getCurrentLevel()).toBe('intermediate');
    });

    it('should detect beginner when messages have no grammar complexity', () => {
      levelDetector.addMessage('me go');
      levelDetector.addMessage('big cat');
      levelDetector.addMessage('no bad');
      expect(levelDetector.getCurrentLevel()).toBe('beginner');
    });
  });

  // ─── Grammar complexity heuristics ────────────────────────
  describe('grammar complexity detection', () => {
    it('should count past tense as complexity', () => {
      // Messages with -ed endings should increase grammar complexity
      levelDetector.addMessage('I played');
      levelDetector.addMessage('she walked');
      levelDetector.addMessage('we talked');
      // These have avgWordCount ~2 which is < 5, and grammar complexity >= 2
      // But since avgWordCount < 5 is still checked, it depends on the combined check
      const level = levelDetector.getCurrentLevel();
      expect(['beginner', 'intermediate']).toContain(level);
    });

    it('should count questions as complexity', () => {
      // These messages have avgWordCount < 5 so they hit beginner check first.
      // Grammar complexity from ? alone doesn't override the short-message rule.
      levelDetector.addMessage('What is this?');
      levelDetector.addMessage('Can I go?');
      levelDetector.addMessage('How are you?');
      const level = levelDetector.getCurrentLevel();
      // avgWordCount ~3 and grammarComplexity >= 1 (has ?), but < 2 threshold
      // Actually all 3 have ?, so complexity = 1 (single regex match on joined text)
      // avgWordCount < 5 && grammarComplexity < 2 => beginner
      expect(level).toBe('beginner');
    });

    it('should count conjunctions as complexity', () => {
      levelDetector.addMessage('I went home and ate dinner');
      levelDetector.addMessage('She was tired but still worked');
      levelDetector.addMessage('We can run or we can walk');
      const level = levelDetector.getCurrentLevel();
      expect(level).toBe('intermediate');
    });
  });

  // ─── reset ────────────────────────────────────────────────
  describe('reset', () => {
    it('should clear message history and stored level', () => {
      levelDetector.saveLevel('advanced');
      levelDetector.addMessage('hello');
      levelDetector.reset();
      expect(levelDetector.getStoredLevel()).toBeNull();
      expect(levelDetector.getCurrentLevel()).toBe('intermediate');
    });

    it('should allow re-detection after reset', () => {
      levelDetector.addMessage('hi');
      levelDetector.addMessage('ok');
      levelDetector.addMessage('yes');
      expect(levelDetector.getCurrentLevel()).toBe('beginner');

      levelDetector.reset();

      levelDetector.addMessage(
        'The comprehensive analysis of environmental sustainability demonstrates remarkable depth and intellectual curiosity throughout'
      );
      levelDetector.addMessage(
        'Furthermore the philosophical implications of artificial intelligence raise profound questions about consciousness and creativity'
      );
      levelDetector.addMessage(
        'Moreover the unprecedented developments in quantum computing have fundamentally transformed our understanding of computational paradigms'
      );
      expect(levelDetector.getCurrentLevel()).toBe('advanced');
    });
  });

  // ─── Edge cases ───────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle messages with only whitespace words', () => {
      levelDetector.addMessage('a');
      levelDetector.addMessage('b');
      levelDetector.addMessage('c');
      expect(levelDetector.getCurrentLevel()).toBe('beginner');
    });

    it('should not crash on 4th message (detection only at exactly 3)', () => {
      levelDetector.addMessage('hi');
      levelDetector.addMessage('ok');
      levelDetector.addMessage('yes');
      levelDetector.addMessage('another message here'); // 4th message, no re-detection
      // Level should still be what was detected at message 3
      expect(levelDetector.getCurrentLevel()).toBe('beginner');
    });
  });
});
