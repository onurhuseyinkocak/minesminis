import { describe, it, expect, beforeEach } from 'vitest';
import { contextDetector } from '../../services/contextDetection';

describe('contextDetection', () => {
  beforeEach(() => {
    contextDetector.setContext('home');
  });

  // ─── detectContext ────────────────────────────────────────
  describe('detectContext', () => {
    it('should detect /games as "games"', () => {
      expect(contextDetector.detectContext('/games')).toBe('games');
    });

    it('should detect /games/memory as "games"', () => {
      expect(contextDetector.detectContext('/games/memory')).toBe('games');
    });

    it('should detect /words as "words"', () => {
      expect(contextDetector.detectContext('/words')).toBe('words');
    });

    it('should detect /words/list as "words"', () => {
      expect(contextDetector.detectContext('/words/list')).toBe('words');
    });

    it('should detect /videos as "videos"', () => {
      expect(contextDetector.detectContext('/videos')).toBe('videos');
    });

    it('should detect /videos/watch/123 as "videos"', () => {
      expect(contextDetector.detectContext('/videos/watch/123')).toBe('videos');
    });

    it('should detect /worksheets as "worksheets"', () => {
      expect(contextDetector.detectContext('/worksheets')).toBe('worksheets');
    });

    it('should detect /worksheets/math as "worksheets"', () => {
      expect(contextDetector.detectContext('/worksheets/math')).toBe('worksheets');
    });

    it('should detect / as "home"', () => {
      expect(contextDetector.detectContext('/')).toBe('home');
    });

    it('should detect /home as "home"', () => {
      expect(contextDetector.detectContext('/home')).toBe('home');
    });

    it('should detect /profile as "other"', () => {
      expect(contextDetector.detectContext('/profile')).toBe('other');
    });

    it('should detect /admin/anything as "other"', () => {
      expect(contextDetector.detectContext('/admin/anything')).toBe('other');
    });

    it('should detect /settings as "other"', () => {
      expect(contextDetector.detectContext('/settings')).toBe('other');
    });

    it('should detect /about as "other"', () => {
      expect(contextDetector.detectContext('/about')).toBe('other');
    });

    it('should detect empty string as "other"', () => {
      expect(contextDetector.detectContext('')).toBe('other');
    });
  });

  // ─── setContext / getContext ──────────────────────────────
  describe('setContext / getContext', () => {
    it('should default to "home"', () => {
      expect(contextDetector.getContext()).toBe('home');
    });

    it('should update context when set', () => {
      contextDetector.setContext('games');
      expect(contextDetector.getContext()).toBe('games');
    });

    it('should allow setting to "other"', () => {
      contextDetector.setContext('other');
      expect(contextDetector.getContext()).toBe('other');
    });
  });

  // ─── getContextVocabulary ─────────────────────────────────
  describe('getContextVocabulary', () => {
    it('should return game words for games context', () => {
      contextDetector.setContext('games');
      const vocab = contextDetector.getContextVocabulary();
      expect(vocab).toContain('play');
      expect(vocab).toContain('win');
      expect(vocab).toContain('score');
    });

    it('should return word-learning words for words context', () => {
      contextDetector.setContext('words');
      const vocab = contextDetector.getContextVocabulary();
      expect(vocab).toContain('learn');
      expect(vocab).toContain('spell');
    });

    it('should return video words for videos context', () => {
      contextDetector.setContext('videos');
      const vocab = contextDetector.getContextVocabulary();
      expect(vocab).toContain('watch');
      expect(vocab).toContain('listen');
    });

    it('should return worksheet words for worksheets context', () => {
      contextDetector.setContext('worksheets');
      const vocab = contextDetector.getContextVocabulary();
      expect(vocab).toContain('write');
      expect(vocab).toContain('draw');
    });

    it('should return empty array for "home" context', () => {
      contextDetector.setContext('home');
      expect(contextDetector.getContextVocabulary()).toEqual([]);
    });

    it('should return empty array for "other" context', () => {
      contextDetector.setContext('other');
      expect(contextDetector.getContextVocabulary()).toEqual([]);
    });
  });

  // ─── getTeachingPrompts ───────────────────────────────────
  describe('getTeachingPrompts', () => {
    it('should return prompts for games context', () => {
      contextDetector.setContext('games');
      const prompts = contextDetector.getTeachingPrompts();
      expect(prompts.length).toBeGreaterThan(0);
      expect(prompts[0]).toContain('Games');
    });

    it('should return prompts for words context', () => {
      contextDetector.setContext('words');
      const prompts = contextDetector.getTeachingPrompts();
      expect(prompts.length).toBeGreaterThan(0);
    });

    it('should return prompts for videos context', () => {
      contextDetector.setContext('videos');
      const prompts = contextDetector.getTeachingPrompts();
      expect(prompts.length).toBeGreaterThan(0);
    });

    it('should return prompts for worksheets context', () => {
      contextDetector.setContext('worksheets');
      const prompts = contextDetector.getTeachingPrompts();
      expect(prompts.length).toBeGreaterThan(0);
    });

    it('should return empty array for home context', () => {
      contextDetector.setContext('home');
      expect(contextDetector.getTeachingPrompts()).toEqual([]);
    });

    it('should return empty array for other context', () => {
      contextDetector.setContext('other');
      expect(contextDetector.getTeachingPrompts()).toEqual([]);
    });
  });

  // ─── getRandomPrompt ─────────────────────────────────────
  describe('getRandomPrompt', () => {
    it('should return a string for games context', () => {
      contextDetector.setContext('games');
      const prompt = contextDetector.getRandomPrompt();
      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
    });

    it('should return null for home context', () => {
      contextDetector.setContext('home');
      expect(contextDetector.getRandomPrompt()).toBeNull();
    });
  });

  // ─── getContextSystemAddition ─────────────────────────────
  describe('getContextSystemAddition', () => {
    it('should return non-empty string for games context', () => {
      contextDetector.setContext('games');
      const addition = contextDetector.getContextSystemAddition();
      expect(addition).toContain('GAMES');
    });

    it('should return empty string for home context', () => {
      contextDetector.setContext('home');
      expect(contextDetector.getContextSystemAddition()).toBe('');
    });

    it('should return empty string for other context', () => {
      contextDetector.setContext('other');
      expect(contextDetector.getContextSystemAddition()).toBe('');
    });
  });
});
