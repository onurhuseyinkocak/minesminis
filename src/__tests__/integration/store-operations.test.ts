import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Supabase mock (videoStore uses supabase directly)
// ---------------------------------------------------------------------------

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } } }),
    },
  },
}));

// We must import stores AFTER mocks are set up
import { gameStore } from '../../data/gameStore';
import { wordStore } from '../../data/wordStore';
import { worksheetStore } from '../../data/worksheetStore';
import type { Game } from '../../data/gamesData';
import type { KidsWord } from '../../data/wordsData';
import type { Worksheet } from '../../data/worksheetsData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sampleGame(id: number = 999): Game {
  return {
    id,
    title: `Test Game ${id}`,
    embedUrl: 'https://example.com/game',
    thumbnailUrl: 'https://example.com/thumb.png',
    type: 'Quiz',
    grade: '2',
  };
}

function sampleWord(word: string = 'testword'): KidsWord {
  return {
    word,
    level: 'beginner',
    category: 'Animals',
    emoji: '🐱',
    turkish: 'test',
    example: 'This is a test.',
  };
}

function sampleWorksheet(id: string = 'ws-test-1'): Worksheet {
  return {
    id,
    title: 'Test Worksheet',
    description: 'A test worksheet',
    category: 'Vocabulary',
    grade: '2',
    thumbnailUrl: 'https://example.com/thumb.png',
    externalUrl: 'https://example.com/ws',
    source: 'Test',
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Store Operations Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset stores to defaults so tests are isolated
    gameStore.reset();
    wordStore.reset();
    worksheetStore.reset();
  });

  // 1. Initial data loads from fallback
  it('gameStore loads initial games from fallback data', () => {
    const games = gameStore.getGames();
    expect(games.length).toBeGreaterThan(0);
    expect(games[0]).toHaveProperty('title');
    expect(games[0]).toHaveProperty('embedUrl');
  });

  it('wordStore loads initial words from fallback data', () => {
    const words = wordStore.getWords();
    expect(words.length).toBeGreaterThan(0);
    expect(words[0]).toHaveProperty('word');
    expect(words[0]).toHaveProperty('turkish');
  });

  it('worksheetStore loads initial worksheets from fallback data', () => {
    const sheets = worksheetStore.getWorksheets();
    expect(sheets.length).toBeGreaterThan(0);
    expect(sheets[0]).toHaveProperty('title');
    expect(sheets[0]).toHaveProperty('category');
  });

  // 2. Add item persists to localStorage
  it('gameStore.addGame persists to localStorage', () => {
    const game = sampleGame(9001);
    gameStore.addGame(game);

    const stored = JSON.parse(localStorage.getItem('minesminis_games')!);
    expect(stored.find((g: Game) => g.id === 9001)).toBeDefined();
  });

  it('wordStore.addWord persists to localStorage', () => {
    const word = sampleWord('elephant');
    wordStore.addWord(word);

    const stored = JSON.parse(localStorage.getItem('minesminis_words')!);
    expect(stored.find((w: KidsWord) => w.word === 'elephant')).toBeDefined();
  });

  it('worksheetStore.addWorksheet persists to localStorage', () => {
    const ws = sampleWorksheet('ws-added');
    worksheetStore.addWorksheet(ws);

    const stored = JSON.parse(localStorage.getItem('minesminis_worksheets')!);
    expect(stored.find((w: Worksheet) => w.id === 'ws-added')).toBeDefined();
  });

  // 3. Update item modifies existing
  it('gameStore.updateGame modifies existing game', () => {
    const games = gameStore.getGames();
    const firstId = games[0].id;

    gameStore.updateGame(firstId, { title: 'Updated Title' });

    const updated = gameStore.getGames().find(g => g.id === firstId);
    expect(updated?.title).toBe('Updated Title');
  });

  it('wordStore.updateWord modifies existing word', () => {
    const words = wordStore.getWords();
    const firstWord = words[0].word;

    wordStore.updateWord(firstWord, { turkish: 'guncel' });

    const updated = wordStore.getWords().find(w => w.word === firstWord);
    expect(updated?.turkish).toBe('guncel');
  });

  it('worksheetStore.updateWorksheet modifies existing worksheet', () => {
    const sheets = worksheetStore.getWorksheets();
    const firstId = sheets[0].id;

    worksheetStore.updateWorksheet(firstId, { title: 'Updated Sheet' });

    const updated = worksheetStore.getWorksheets().find(w => w.id === firstId);
    expect(updated?.title).toBe('Updated Sheet');
  });

  // 4. Delete item removes from list
  it('gameStore.deleteGame removes game', () => {
    const games = gameStore.getGames();
    const firstId = games[0].id;
    const originalLength = games.length;

    gameStore.deleteGame(firstId);

    expect(gameStore.getGames().length).toBe(originalLength - 1);
    expect(gameStore.getGames().find(g => g.id === firstId)).toBeUndefined();
  });

  it('wordStore.deleteWord removes word', () => {
    const words = wordStore.getWords();
    const firstWord = words[0].word;
    const originalLength = words.length;

    wordStore.deleteWord(firstWord);

    expect(wordStore.getWords().length).toBe(originalLength - 1);
    expect(wordStore.getWords().find(w => w.word === firstWord)).toBeUndefined();
  });

  it('worksheetStore.deleteWorksheet removes worksheet', () => {
    const sheets = worksheetStore.getWorksheets();
    const firstId = sheets[0].id;
    const originalLength = sheets.length;

    worksheetStore.deleteWorksheet(firstId);

    expect(worksheetStore.getWorksheets().length).toBe(originalLength - 1);
    expect(worksheetStore.getWorksheets().find(w => w.id === firstId)).toBeUndefined();
  });

  // 5. Reset restores defaults
  it('gameStore.reset restores default games', () => {
    gameStore.addGame(sampleGame(7777));
    gameStore.reset();

    const games = gameStore.getGames();
    expect(games.find(g => g.id === 7777)).toBeUndefined();
    expect(games.length).toBeGreaterThan(0);
  });

  it('wordStore.reset restores default words', () => {
    wordStore.addWord(sampleWord('zzz_unique'));
    wordStore.reset();

    const words = wordStore.getWords();
    expect(words.find(w => w.word === 'zzz_unique')).toBeUndefined();
    expect(words.length).toBeGreaterThan(0);
  });

  it('worksheetStore.reset restores default worksheets', () => {
    worksheetStore.addWorksheet(sampleWorksheet('ws-unique'));
    worksheetStore.reset();

    const sheets = worksheetStore.getWorksheets();
    expect(sheets.find(w => w.id === 'ws-unique')).toBeUndefined();
    expect(sheets.length).toBeGreaterThan(0);
  });

  // 6. Subscribe callback fires on changes
  it('gameStore.subscribe fires callback on addGame', () => {
    const callback = vi.fn();
    const unsub = gameStore.subscribe(callback);

    gameStore.addGame(sampleGame(8888));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: 8888 }),
    ]));

    unsub();
  });

  it('wordStore.subscribe fires callback on addWord', () => {
    const callback = vi.fn();
    const unsub = wordStore.subscribe(callback);

    wordStore.addWord(sampleWord('subscribe_test'));
    expect(callback).toHaveBeenCalledTimes(1);

    unsub();
  });

  it('worksheetStore.subscribe fires callback on addWorksheet', () => {
    const callback = vi.fn();
    const unsub = worksheetStore.subscribe(callback);

    worksheetStore.addWorksheet(sampleWorksheet('ws-sub'));
    expect(callback).toHaveBeenCalledTimes(1);

    unsub();
  });

  // 7. Multiple stores don't interfere
  it('operations on gameStore do not affect wordStore', () => {
    const wordsCountBefore = wordStore.getWords().length;
    gameStore.addGame(sampleGame(1111));
    const wordsCountAfter = wordStore.getWords().length;

    expect(wordsCountAfter).toBe(wordsCountBefore);
  });

  it('operations on wordStore do not affect worksheetStore', () => {
    const sheetsCountBefore = worksheetStore.getWorksheets().length;
    wordStore.addWord(sampleWord('nointerference'));
    const sheetsCountAfter = worksheetStore.getWorksheets().length;

    expect(sheetsCountAfter).toBe(sheetsCountBefore);
  });

  // 8. Store data survives clear/reload pattern
  it('store data survives simulated reload via localStorage', () => {
    gameStore.addGame(sampleGame(5555));

    // Simulate "reload": read directly from localStorage
    const rawData = localStorage.getItem('minesminis_games');
    expect(rawData).toBeTruthy();

    const parsed = JSON.parse(rawData!);
    expect(parsed.find((g: Game) => g.id === 5555)).toBeDefined();
  });

  it('wordStore data survives simulated reload', () => {
    wordStore.addWord(sampleWord('persist_word'));

    const rawData = localStorage.getItem('minesminis_words');
    expect(rawData).toBeTruthy();

    const parsed = JSON.parse(rawData!);
    expect(parsed.find((w: KidsWord) => w.word === 'persist_word')).toBeDefined();
  });

  // Edge: unsubscribe stops callbacks
  it('unsubscribe stops further callbacks', () => {
    const callback = vi.fn();
    const unsub = gameStore.subscribe(callback);

    gameStore.addGame(sampleGame(1234));
    expect(callback).toHaveBeenCalledTimes(1);

    unsub();
    gameStore.addGame(sampleGame(5678));
    expect(callback).toHaveBeenCalledTimes(1); // no additional call
  });
});
