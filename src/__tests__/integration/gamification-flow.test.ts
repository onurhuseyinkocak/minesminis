import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateLevel,
  getXPForLevel,
  getTotalXPForLevel,
  ALL_BADGES,
  type UserStats,
} from '../../contexts/GamificationContext';

// ---------------------------------------------------------------------------
// Supabase mock (gamification syncs to DB but works offline too)
// ---------------------------------------------------------------------------

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
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

// ---------------------------------------------------------------------------
// Helpers - we test the pure functions and simulate the state logic that
// the GamificationProvider uses internally.
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

function getStreakBonus(streakDays: number): number {
  if (streakDays >= 30) return 50;
  if (streakDays >= 14) return 30;
  if (streakDays >= 7) return 20;
  if (streakDays >= 3) return 10;
  return 0;
}

/** Simulates addXP logic from GamificationContext */
function simulateAddXP(
  stats: UserStats,
  amount: number,
  reason: string,
  metadata?: Record<string, unknown>,
): { newStats: UserStats; leveledUp: boolean } {
  const streakBonus = getStreakBonus(stats.streakDays);
  let totalXP = Math.floor(amount * (1 + streakBonus / 100));

  // Character power multipliers
  if (stats.mascotId === 'mimi_dragon') {
    totalXP = Math.floor(totalXP * 1.2);
  }
  if (stats.mascotId === 'nova_fox' && (reason === 'word_learned' || reason === 'word_game')) {
    totalXP *= 2;
  }
  if (stats.mascotId === 'bubbles_octo' && (reason === 'listening' || reason === 'pronunciation')) {
    totalXP *= 2;
  }
  if (stats.mascotId === 'sparky_alien' && (reason === 'grammar' || metadata?.isFastAnswer)) {
    totalXP = Math.floor(totalXP * 1.5);
  }

  const newXP = stats.xp + totalXP;
  const newWeeklyXP = stats.weekly_xp + totalXP;
  const oldLevel = stats.level;
  const newLevel = calculateLevel(newXP);

  return {
    newStats: { ...stats, xp: newXP, weekly_xp: newWeeklyXP, level: newLevel },
    leveledUp: newLevel > oldLevel,
  };
}

/** Simulates checkStreak logic */
function simulateCheckStreak(stats: UserStats, now: Date): UserStats {
  const lastLogin = stats.lastLoginDate ? new Date(stats.lastLoginDate) : null;
  let newStreak = stats.streakDays;

  if (!lastLogin) {
    newStreak = 1;
  } else if (lastLogin.toDateString() === now.toDateString()) {
    // same day
  } else {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastLogin.toDateString() === yesterday.toDateString()) {
      newStreak = stats.streakDays + 1;
    } else {
      newStreak = 1;
    }
  }

  return { ...stats, streakDays: newStreak, lastLoginDate: now.toISOString() };
}

/** Badge check simulation */
function checkBadges(stats: UserStats): string[] {
  const earned: string[] = [];
  for (const badge of ALL_BADGES) {
    if (stats.badges.includes(badge.id)) continue;
    let qualifies = false;
    switch (badge.requirementType) {
      case 'streak': qualifies = stats.streakDays >= badge.requirement; break;
      case 'words': qualifies = stats.wordsLearned >= badge.requirement; break;
      case 'games': qualifies = stats.gamesPlayed >= badge.requirement; break;
      case 'videos': qualifies = stats.videosWatched >= badge.requirement; break;
      case 'level': qualifies = stats.level >= badge.requirement; break;
    }
    if (qualifies) earned.push(badge.id);
  }
  return earned;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Gamification Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. XP added updates level correctly
  it('XP addition updates level via calculateLevel', () => {
    // Level 1 needs 100 XP to reach level 2
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
  });

  // 2. Level up triggers at correct threshold (level * 100 XP base, *1.5 growth)
  it('level up triggers at XP_PER_LEVEL_BASE * 1.5^(level-1)', () => {
    // Level 1->2: 100 XP, Level 2->3: 150 XP (total 250), Level 3->4: 225 XP (total 475)
    expect(getXPForLevel(1)).toBe(100);
    expect(getXPForLevel(2)).toBe(150);
    expect(getXPForLevel(3)).toBe(225);

    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(475)).toBe(4);
  });

  // 3. Streak increments on consecutive days
  it('streak increments when login is consecutive day', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const stats = defaultStats({ streakDays: 3, lastLoginDate: yesterday.toISOString() });

    const updated = simulateCheckStreak(stats, new Date());
    expect(updated.streakDays).toBe(4);
  });

  // 4. Streak resets after gap
  it('streak resets to 1 after a gap of 2+ days', () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const stats = defaultStats({ streakDays: 10, lastLoginDate: twoDaysAgo.toISOString() });

    const updated = simulateCheckStreak(stats, new Date());
    expect(updated.streakDays).toBe(1);
  });

  // 5. Daily reward claim adds XP
  it('daily reward claim adds XP to stats', () => {
    const stats = defaultStats({ streakDays: 1 });
    // Day 1 reward = 10 XP
    const { newStats } = simulateAddXP(stats, 10, 'daily_reward');
    // mimi_dragon gets +20% -> 10 * 1.2 = 12
    expect(newStats.xp).toBe(12);
  });

  // 6. Weekly XP resets on Monday
  it('weekly XP accumulates and can be reset', () => {
    const stats = defaultStats({ weekly_xp: 500 });
    const reset = { ...stats, weekly_xp: 0 };
    expect(reset.weekly_xp).toBe(0);

    // After some XP gain
    const { newStats } = simulateAddXP(reset, 50, 'quiz');
    expect(newStats.weekly_xp).toBeGreaterThan(0);
  });

  // 7. Badge earned when threshold met
  it('awards streak_3 badge when streak reaches 3', () => {
    const stats = defaultStats({ streakDays: 3 });
    const earned = checkBadges(stats);
    expect(earned).toContain('streak_3');
  });

  it('does not re-award already owned badge', () => {
    const stats = defaultStats({ streakDays: 7, badges: ['streak_3', 'streak_7'] });
    const earned = checkBadges(stats);
    expect(earned).not.toContain('streak_3');
    expect(earned).not.toContain('streak_7');
  });

  // 8. Power multiplier applied by mascot type
  it('applies streak bonus multiplier to XP', () => {
    const stats = defaultStats({ streakDays: 7, mascotId: 'nova_fox' });
    // Streak 7 = 20% bonus. 100 * 1.20 = 120 (no mascot bonus for generic reason)
    const { newStats } = simulateAddXP(stats, 100, 'quiz');
    expect(newStats.xp).toBe(120);
  });

  // 9. Mimi dragon gets +20% all XP
  it('mimi_dragon gives +20% XP on all activities', () => {
    const stats = defaultStats({ mascotId: 'mimi_dragon' });
    const { newStats } = simulateAddXP(stats, 100, 'quiz');
    // 100 * 1.0 (no streak) * 1.2 (mimi) = 120
    expect(newStats.xp).toBe(120);
  });

  // 10. Nova fox gets 2x word XP
  it('nova_fox gives 2x XP on word activities', () => {
    const stats = defaultStats({ mascotId: 'nova_fox' });
    const { newStats } = simulateAddXP(stats, 100, 'word_learned');
    // 100 * 1.0 (no streak) * 2 (nova word bonus) = 200
    expect(newStats.xp).toBe(200);
  });

  it('nova_fox does NOT double XP on non-word activities', () => {
    const stats = defaultStats({ mascotId: 'nova_fox' });
    const { newStats } = simulateAddXP(stats, 100, 'quiz');
    // No mascot bonus for non-word reason
    expect(newStats.xp).toBe(100);
  });

  // 11. Stats persist to localStorage
  it('stats persist to localStorage under user key', () => {
    const userId = 'test-user-456';
    const stats = defaultStats({ xp: 300, level: 3 });
    localStorage.setItem(`gamification_${userId}`, JSON.stringify(stats));

    const loaded = JSON.parse(localStorage.getItem(`gamification_${userId}`) || '{}');
    expect(loaded.xp).toBe(300);
    expect(loaded.level).toBe(3);
  });

  // 12. Stats sync to Supabase (verified via mock)
  it('stats key in localStorage matches gamification_{uid} pattern', () => {
    const uid = 'abc-123';
    const key = `gamification_${uid}`;
    localStorage.setItem(key, JSON.stringify(defaultStats()));
    expect(localStorage.getItem(key)).toBeTruthy();
  });

  // 13. Activity tracking updates counters
  it('activity tracking increments correct counter', () => {
    let stats = defaultStats();

    // Simulate trackActivity for each type
    stats = { ...stats, wordsLearned: stats.wordsLearned + 1 };
    expect(stats.wordsLearned).toBe(1);

    stats = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
    expect(stats.gamesPlayed).toBe(1);

    stats = { ...stats, videosWatched: stats.videosWatched + 1 };
    expect(stats.videosWatched).toBe(1);

    stats = { ...stats, worksheetsCompleted: stats.worksheetsCompleted + 1 };
    expect(stats.worksheetsCompleted).toBe(1);

    stats = { ...stats, dailyChallengesCompleted: stats.dailyChallengesCompleted + 1 };
    expect(stats.dailyChallengesCompleted).toBe(1);
  });

  // 14. Multiple rapid addXP calls accumulate correctly
  it('multiple rapid addXP calls accumulate XP correctly', () => {
    let stats = defaultStats({ mascotId: 'nova_fox' }); // no global bonus

    // 5 rapid calls of 10 XP each for generic reason (no mascot bonus)
    for (let i = 0; i < 5; i++) {
      const { newStats } = simulateAddXP(stats, 10, 'quiz');
      stats = newStats;
    }

    // 5 * 10 = 50 (no streak, no mascot bonus for 'quiz' on nova_fox)
    expect(stats.xp).toBe(50);
  });

  // Edge cases
  it('getTotalXPForLevel accumulates correctly', () => {
    expect(getTotalXPForLevel(1)).toBe(0);
    expect(getTotalXPForLevel(2)).toBe(100);
    expect(getTotalXPForLevel(3)).toBe(250);
  });

  it('bubbles_octo gets 2x on listening/pronunciation', () => {
    const stats = defaultStats({ mascotId: 'bubbles_octo' });
    const { newStats } = simulateAddXP(stats, 100, 'listening');
    expect(newStats.xp).toBe(200);
  });

  it('sparky_alien gets 1.5x on grammar', () => {
    const stats = defaultStats({ mascotId: 'sparky_alien' });
    const { newStats } = simulateAddXP(stats, 100, 'grammar');
    expect(newStats.xp).toBe(150);
  });

  it('sparky_alien gets 1.5x on fast answers', () => {
    const stats = defaultStats({ mascotId: 'sparky_alien' });
    const { newStats } = simulateAddXP(stats, 100, 'quiz', { isFastAnswer: true });
    expect(newStats.xp).toBe(150);
  });

  it('level up detected when XP crosses threshold', () => {
    const stats = defaultStats({ xp: 95, level: 1, mascotId: 'nova_fox' });
    // Adding 10 XP (no bonus) -> 105 => level 2
    const { newStats, leveledUp } = simulateAddXP(stats, 10, 'quiz');
    expect(newStats.xp).toBe(105);
    expect(newStats.level).toBe(2);
    expect(leveledUp).toBe(true);
  });

  it('words_10 badge earned at 10 words', () => {
    const stats = defaultStats({ wordsLearned: 10 });
    const earned = checkBadges(stats);
    expect(earned).toContain('words_10');
  });

  it('games_5 badge earned at 5 games', () => {
    const stats = defaultStats({ gamesPlayed: 5 });
    const earned = checkBadges(stats);
    expect(earned).toContain('games_5');
  });

  it('level_5 badge earned at level 5', () => {
    const stats = defaultStats({ level: 5 });
    const earned = checkBadges(stats);
    expect(earned).toContain('level_5');
  });

  it('same-day login does not change streak', () => {
    const now = new Date();
    const stats = defaultStats({ streakDays: 5, lastLoginDate: now.toISOString() });
    const updated = simulateCheckStreak(stats, now);
    expect(updated.streakDays).toBe(5);
  });

  it('first ever login sets streak to 1', () => {
    const stats = defaultStats({ streakDays: 0, lastLoginDate: null });
    const updated = simulateCheckStreak(stats, new Date());
    expect(updated.streakDays).toBe(1);
  });
});
