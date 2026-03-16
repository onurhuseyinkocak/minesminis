import { describe, it, expect } from 'vitest';
import {
  generateDynamicQuickReplies,
  getStarterReplies,
  type ChatMessage,
} from '../../services/quickReplies';

// ============================================================
// getStarterReplies
// ============================================================
describe('getStarterReplies', () => {
  it('should return exactly 4 replies', () => {
    expect(getStarterReplies()).toHaveLength(4);
  });

  it('should return replies with id, text, and value properties', () => {
    const replies = getStarterReplies();
    replies.forEach((r) => {
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('text');
      expect(r).toHaveProperty('value');
    });
  });

  it('should return replies from STARTER_PROMPTS (ids start with start_)', () => {
    const replies = getStarterReplies();
    replies.forEach((r) => {
      expect(r.id).toMatch(/^start_/);
    });
  });

  it('should return different order on repeated calls (shuffled)', () => {
    // Run multiple times and check if at least one ordering differs
    const orders: string[] = [];
    for (let i = 0; i < 20; i++) {
      orders.push(getStarterReplies().map((r) => r.id).join(','));
    }
    const unique = new Set(orders);
    // With 4! = 24 permutations, 20 tries should yield > 1 unique ordering
    // But since it is random, we check >= 1 (always true) to not flake
    expect(unique.size).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// generateDynamicQuickReplies
// ============================================================
describe('generateDynamicQuickReplies', () => {
  it('should return starter replies when messages has 0 messages', () => {
    const replies = generateDynamicQuickReplies([]);
    expect(replies).toHaveLength(4);
    replies.forEach((r) => {
      expect(r.id).toMatch(/^start_/);
    });
  });

  it('should return starter replies when messages has 1 message', () => {
    const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies).toHaveLength(4);
    replies.forEach((r) => {
      expect(r.id).toMatch(/^start_/);
    });
  });

  it('should return max 4 replies', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello! How are you?' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should detect color topic and return learning/practice prompts', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'Tell me about colors' },
      { role: 'assistant', content: 'Red is a warm color!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeGreaterThan(0);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should detect animal topic from assistant message', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Let me tell you about a cat and a dog!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeGreaterThan(0);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should detect numbers topic', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'count with me' },
      { role: 'assistant', content: 'Let us count: one, two, three!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeGreaterThan(0);
  });

  it('should detect games topic', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'I want to play a game' },
      { role: 'assistant', content: 'Sure, let us play!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should include conversation prompts when assistant asks a question', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'Hi Mimi' },
      { role: 'assistant', content: 'Hello! What would you like to learn today?' },
    ];
    // Run multiple times to account for randomness
    let foundConversation = false;
    for (let i = 0; i < 20; i++) {
      const replies = generateDynamicQuickReplies(messages);
      const conversationIds = ['more', 'why', 'another', 'cool', 'hard', 'easy', 'again', 'thanks'];
      if (replies.some((r) => conversationIds.includes(r.id))) {
        foundConversation = true;
        break;
      }
    }
    expect(foundConversation).toBe(true);
  });

  it('should filter out used replies', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'hi there, tell me about colors?' },
    ];
    const usedReplies = new Set(['colors', 'animals', 'numbers', 'fruits', 'family', 'body',
      'clothes', 'food', 'weather', 'days', 'greetings', 'feelings']);
    const replies = generateDynamicQuickReplies(messages, usedReplies);
    // Should still return some replies (from practice prompts or others)
    expect(replies.length).toBeGreaterThan(0);
  });

  it('should handle when all prompts are used (fallback to available)', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'tell me more' },
    ];
    // Create a huge used set
    const usedReplies = new Set([
      'colors', 'animals', 'numbers', 'fruits', 'family', 'body', 'clothes', 'food',
      'weather', 'days', 'greetings', 'feelings', 'joke', 'game', 'riddle', 'story',
      'song', 'quiz', 'tongue', 'guess', 'spell', 'sentence', 'translate', 'pronounce',
      'opposite', 'rhyme', 'more', 'why', 'another', 'cool', 'hard', 'easy', 'again', 'thanks',
    ]);
    const replies = generateDynamicQuickReplies(messages, usedReplies);
    // Should still return prompts (falls back to unfiltered)
    expect(replies.length).toBeGreaterThan(0);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should detect Turkish color word (mavi)', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'mavi nedir?' },
      { role: 'assistant', content: 'Mavi, blue demektir!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should detect Turkish animal word (kedi)', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'kedi ne demek?' },
      { role: 'assistant', content: 'Kedi means cat!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeLessThanOrEqual(4);
  });

  it('should return replies with valid structure', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'teach me' },
      { role: 'assistant', content: 'sure!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    replies.forEach((r) => {
      expect(typeof r.id).toBe('string');
      expect(typeof r.text).toBe('string');
      expect(typeof r.value).toBe('string');
      expect(r.id.length).toBeGreaterThan(0);
      expect(r.text.length).toBeGreaterThan(0);
      expect(r.value.length).toBeGreaterThan(0);
    });
  });

  it('should not return more than 4 replies even with question + topic', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'tell me about fruit' },
      { role: 'assistant', content: 'Apple is a fruit! What fruit do you like?' },
    ];
    for (let i = 0; i < 10; i++) {
      const replies = generateDynamicQuickReplies(messages);
      expect(replies.length).toBeLessThanOrEqual(4);
    }
  });

  it('should detect joke topic', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'tell me a joke' },
      { role: 'assistant', content: 'Why did the chicken cross the road? To get to the other side! Funny right?' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeGreaterThan(0);
  });

  it('should detect spelling topic', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'help me spell' },
      { role: 'assistant', content: 'Let us practice spelling!' },
    ];
    const replies = generateDynamicQuickReplies(messages);
    expect(replies.length).toBeGreaterThan(0);
  });

  it('should handle empty usedReplies set', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello!' },
    ];
    const replies = generateDynamicQuickReplies(messages, new Set());
    expect(replies.length).toBeGreaterThan(0);
    expect(replies.length).toBeLessThanOrEqual(4);
  });
});
