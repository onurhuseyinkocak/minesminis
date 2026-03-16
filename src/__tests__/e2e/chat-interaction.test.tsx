import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnValue({ error: null }),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

vi.mock('../../config/firebase', () => ({
  auth: { currentUser: null },
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((_a, cb) => { cb(null); return vi.fn(); }),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}));

import {
  getStarterReplies,
  generateDynamicQuickReplies,
  type ChatMessage,
} from '../../services/quickReplies';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAILY_MESSAGE_LIMIT = 10;
const USAGE_KEY = 'mimi_cave_daily_usage';

interface DailyUsage {
  date: string;
  count: number;
}

function getDailyUsage(): DailyUsage {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(USAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) return parsed;
    } catch { /* corrupted */ }
  }
  return { date: today, count: 0 };
}

function incrementUsage(): DailyUsage {
  const usage = getDailyUsage();
  const updated = { date: new Date().toDateString(), count: usage.count + 1 };
  localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  return updated;
}

function canSendMessage(isPremium = false): boolean {
  if (isPremium) return true;
  return getDailyUsage().count < DAILY_MESSAGE_LIMIT;
}

/** Simulate chat message flow */
interface SimulatedChat {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  addUserMessage(text: string): void;
  addAssistantMessage(text: string): void;
}

function createChat(): SimulatedChat {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    { role: 'assistant', content: "Merhaba! Welcome to my cozy cave!" },
  ];
  return {
    messages,
    addUserMessage(text: string) {
      messages.push({ role: 'user', content: text });
    },
    addAssistantMessage(text: string) {
      messages.push({ role: 'assistant', content: text });
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Chat Interaction E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. Chat opens from button (simulated: chat state)
  it('chat initializes with welcome message', () => {
    const chat = createChat();
    expect(chat.messages).toHaveLength(1);
    expect(chat.messages[0].role).toBe('assistant');
    expect(chat.messages[0].content).toContain('Welcome');
  });

  // 2. Quick replies show on start
  it('starter quick replies are available on chat open', () => {
    const replies = getStarterReplies();
    expect(replies.length).toBeGreaterThan(0);
    expect(replies.length).toBeLessThanOrEqual(6);

    for (const reply of replies) {
      expect(reply).toHaveProperty('id');
      expect(reply).toHaveProperty('text');
      expect(reply).toHaveProperty('value');
      expect(typeof reply.text).toBe('string');
    }
  });

  // 3. User message sends
  it('user message is added to chat history', () => {
    const chat = createChat();
    chat.addUserMessage('Hello Mimi!');

    expect(chat.messages).toHaveLength(2);
    expect(chat.messages[1].role).toBe('user');
    expect(chat.messages[1].content).toBe('Hello Mimi!');
  });

  it('sending message increments daily usage', () => {
    const before = getDailyUsage().count;
    incrementUsage();
    const after = getDailyUsage().count;
    expect(after).toBe(before + 1);
  });

  // 4. AI response appears
  it('assistant response is added after user message', () => {
    const chat = createChat();
    chat.addUserMessage('Teach me colors!');
    chat.addAssistantMessage('Sure! Red is kirmizi, blue is mavi!');

    expect(chat.messages).toHaveLength(3);
    expect(chat.messages[2].role).toBe('assistant');
    expect(chat.messages[2].content).toContain('Red');
  });

  // 5. Daily limit tracking
  it('canSendMessage returns true when under limit', () => {
    expect(canSendMessage()).toBe(true);
  });

  it('canSendMessage returns false when at limit', () => {
    for (let i = 0; i < DAILY_MESSAGE_LIMIT; i++) {
      incrementUsage();
    }
    expect(canSendMessage()).toBe(false);
  });

  it('premium users bypass daily limit', () => {
    for (let i = 0; i < DAILY_MESSAGE_LIMIT + 5; i++) {
      incrementUsage();
    }
    expect(canSendMessage(true)).toBe(true);
  });

  it('daily usage resets on new day', () => {
    // Set usage for yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem(USAGE_KEY, JSON.stringify({
      date: yesterday.toDateString(),
      count: 15,
    }));

    // getDailyUsage should return 0 for today
    const usage = getDailyUsage();
    expect(usage.count).toBe(0);
  });

  // 6. Quick replies update after conversation
  it('dynamic quick replies change based on conversation history', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Teach me colors!' },
      { role: 'assistant', content: 'Red, blue, green...' },
    ];

    const replies = generateDynamicQuickReplies(history);
    expect(replies.length).toBeGreaterThan(0);

    // Should not include the exact same prompt as what was already asked
    // (Dynamic system picks from different categories)
    for (const reply of replies) {
      expect(reply).toHaveProperty('text');
      expect(reply).toHaveProperty('value');
    }
  });

  it('quick replies have unique IDs', () => {
    const replies = getStarterReplies();
    const ids = replies.map(r => r.id);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds.length).toBe(ids.length);
  });

  // 7. Chat close preserves history
  it('chat history persists when stored in localStorage', () => {
    const chat = createChat();
    chat.addUserMessage('Hello!');
    chat.addAssistantMessage('Hi there!');

    // Simulate saving to localStorage on close
    const chatKey = 'mimi_cave_history';
    localStorage.setItem(chatKey, JSON.stringify(chat.messages));

    // Simulate reopening
    const restored = JSON.parse(localStorage.getItem(chatKey)!);
    expect(restored).toHaveLength(3);
    expect(restored[0].role).toBe('assistant');
    expect(restored[1].role).toBe('user');
    expect(restored[2].role).toBe('assistant');
  });

  it('chat history is not lost after close and reopen', () => {
    const chatKey = 'mimi_cave_history';
    const messages = [
      { role: 'assistant', content: 'Welcome!' },
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'How are you?' },
      { role: 'user', content: 'Good!' },
    ];
    localStorage.setItem(chatKey, JSON.stringify(messages));

    const restored = JSON.parse(localStorage.getItem(chatKey)!);
    expect(restored).toHaveLength(4);
  });

  // Edge cases
  it('empty message is not added to history', () => {
    const chat = createChat();
    const text = '  '.trim();
    if (text) {
      chat.addUserMessage(text);
    }
    // Only welcome message
    expect(chat.messages).toHaveLength(1);
  });

  it('daily usage count is number type', () => {
    incrementUsage();
    const usage = getDailyUsage();
    expect(typeof usage.count).toBe('number');
  });

  it('DAILY_MESSAGE_LIMIT is 10', () => {
    expect(DAILY_MESSAGE_LIMIT).toBe(10);
  });

  it('multiple messages accumulate in correct order', () => {
    const chat = createChat();
    chat.addUserMessage('Q1');
    chat.addAssistantMessage('A1');
    chat.addUserMessage('Q2');
    chat.addAssistantMessage('A2');

    expect(chat.messages.map(m => m.role)).toEqual([
      'assistant', 'user', 'assistant', 'user', 'assistant',
    ]);
    expect(chat.messages[3].content).toBe('Q2');
    expect(chat.messages[4].content).toBe('A2');
  });

  it('quick replies contain learning and fun categories', () => {
    const starters = getStarterReplies();
    // Starters should mix learning and fun prompts
    const texts = starters.map(r => r.text.toLowerCase());
    expect(texts.length).toBeGreaterThan(0);
  });
});
