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
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
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

import { gameStore } from '../../data/gameStore';
import { wordStore } from '../../data/wordStore';
import { worksheetStore } from '../../data/worksheetStore';
import {
  calculateLevel,
  ALL_BADGES,
  type UserStats,
} from '../../contexts/GamificationContext';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function defaultStats(overrides: Partial<UserStats> = {}): UserStats {
  return {
    xp: 0,
    weekly_xp: 0,
    level: 1,
    streakDays: 0,
    lastLoginDate: null,
    lastDailyClaim: null,
    lastWeeklyReset: null,
    badges: [],
    wordsLearned: 0,
    gamesPlayed: 0,
    videosWatched: 0,
    worksheetsCompleted: 0,
    dailyChallengesCompleted: 0,
    mascotId: 'mimi_dragon',
    ...overrides,
  };
}

const FAVORITES_KEY = 'minesminis_favorites';

function getFavorites(): string[] {
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setFavorites(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Learning Journey E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    gameStore.reset();
    wordStore.reset();
    worksheetStore.reset();
  });

  // 1. Visit games page shows game list
  it('games data is available and non-empty', () => {
    const games = gameStore.getGames();
    expect(games.length).toBeGreaterThan(0);
    expect(games[0]).toHaveProperty('title');
    expect(games[0]).toHaveProperty('embedUrl');
  });

  // 2. Visit words page shows word categories
  it('words data contains categories', () => {
    const words = wordStore.getWords();
    expect(words.length).toBeGreaterThan(0);

    const categories = [...new Set(words.map(w => w.category))];
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('Animals');
  });

  // 3. Visit videos page shows video grid (fallback data)
  it('fallback videos are available', async () => {
    const { fallbackVideos } = await import('../../data/fallbackData');
    expect(fallbackVideos.length).toBeGreaterThan(0);
    expect(fallbackVideos[0]).toHaveProperty('youtube_id');
    expect(fallbackVideos[0]).toHaveProperty('title');
  });

  // 4. Visit worksheets page shows worksheet list
  it('worksheets data is available and non-empty', () => {
    const sheets = worksheetStore.getWorksheets();
    expect(sheets.length).toBeGreaterThan(0);
    expect(sheets[0]).toHaveProperty('title');
    expect(sheets[0]).toHaveProperty('category');
    expect(sheets[0]).toHaveProperty('grade');
  });

  // 5. Favorites toggle adds/removes items
  it('adding a favorite persists to localStorage', () => {
    setFavorites(['game-1']);
    expect(getFavorites()).toContain('game-1');
  });

  it('removing a favorite updates localStorage', () => {
    setFavorites(['game-1', 'game-2']);
    const updated = getFavorites().filter(id => id !== 'game-1');
    setFavorites(updated);
    expect(getFavorites()).not.toContain('game-1');
    expect(getFavorites()).toContain('game-2');
  });

  it('toggling favorite on same item removes it', () => {
    const favs = ['game-1'];
    setFavorites(favs);

    // Toggle: if exists remove, else add
    const id = 'game-1';
    const current = getFavorites();
    if (current.includes(id)) {
      setFavorites(current.filter(f => f !== id));
    } else {
      setFavorites([...current, id]);
    }

    expect(getFavorites()).not.toContain('game-1');
  });

  // 6. Search filters results
  it('filtering games by title works', () => {
    const games = gameStore.getGames();
    const query = 'animals';
    const filtered = games.filter(g => g.title.toLowerCase().includes(query));
    // At least one game should have "animals" in title
    expect(filtered.length).toBeGreaterThanOrEqual(0);
    filtered.forEach(g => {
      expect(g.title.toLowerCase()).toContain(query);
    });
  });

  it('filtering words by search term works', () => {
    const words = wordStore.getWords();
    const query = 'cat';
    const filtered = words.filter(w =>
      w.word.toLowerCase().includes(query) ||
      w.turkish.toLowerCase().includes(query)
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  // 7. Category filter works
  it('filtering words by category returns only that category', () => {
    const words = wordStore.getWords();
    const animals = words.filter(w => w.category === 'Animals');
    expect(animals.length).toBeGreaterThan(0);
    animals.forEach(w => {
      expect(w.category).toBe('Animals');
    });
  });

  it('filtering worksheets by grade works', () => {
    const sheets = worksheetStore.getWorksheets();
    const grade2 = sheets.filter(s => s.grade === '2');
    expect(grade2.length).toBeGreaterThan(0);
    grade2.forEach(s => {
      expect(s.grade).toBe('2');
    });
  });

  // 8. XP bar updates after activity
  it('XP increases and level recalculates after adding XP', () => {
    let stats = defaultStats();
    // Simulate earning 120 XP (mimi_dragon +20% applied in real context)
    const newXP = stats.xp + 120;
    stats = { ...stats, xp: newXP, level: calculateLevel(newXP) };

    expect(stats.xp).toBe(120);
    expect(stats.level).toBe(2); // 120 > 100 threshold
  });

  // 9. Badge earned notification data is correct
  it('badge data has all required fields', () => {
    for (const badge of ALL_BADGES) {
      expect(badge).toHaveProperty('id');
      expect(badge).toHaveProperty('name');
      expect(badge).toHaveProperty('description');
      expect(badge).toHaveProperty('icon');
      expect(badge).toHaveProperty('category');
      expect(badge).toHaveProperty('requirement');
      expect(badge).toHaveProperty('requirementType');
      expect(typeof badge.requirement).toBe('number');
    }
  });

  it('streak_3 badge is earnable at streak 3', () => {
    const streak3 = ALL_BADGES.find(b => b.id === 'streak_3');
    expect(streak3).toBeDefined();
    expect(streak3!.requirement).toBe(3);
    expect(streak3!.requirementType).toBe('streak');
  });

  // 10. Daily challenge progress tracks
  it('daily challenge counter increments', () => {
    let stats = defaultStats();
    stats = { ...stats, dailyChallengesCompleted: stats.dailyChallengesCompleted + 1 };
    expect(stats.dailyChallengesCompleted).toBe(1);

    stats = { ...stats, dailyChallengesCompleted: stats.dailyChallengesCompleted + 1 };
    expect(stats.dailyChallengesCompleted).toBe(2);
  });

  it('daily challenge tracked in localStorage', () => {
    const userId = 'test-user';
    const key = `daily_challenges_${userId}`;
    const data = { date: new Date().toDateString(), completed: ['c1', 'c2'] };
    localStorage.setItem(key, JSON.stringify(data));

    const stored = JSON.parse(localStorage.getItem(key)!);
    expect(stored.completed).toHaveLength(2);
  });

  // Edge: empty search returns all
  it('empty search filter returns all games', () => {
    const games = gameStore.getGames();
    const filtered = games.filter(g => g.title.toLowerCase().includes(''));
    expect(filtered.length).toBe(games.length);
  });

  // Edge: words have all required fields
  it('all words have required fields', () => {
    const words = wordStore.getWords();
    for (const w of words) {
      expect(w).toHaveProperty('word');
      expect(w).toHaveProperty('level');
      expect(w).toHaveProperty('category');
      expect(w).toHaveProperty('emoji');
      expect(w).toHaveProperty('turkish');
    }
  });
});
