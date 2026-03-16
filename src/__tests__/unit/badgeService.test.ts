import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to re-import the module fresh for each test because awardBadge
// mutates the shared AVAILABLE_BADGES array in-place.
// Use dynamic import + vi.resetModules to get clean state.

let checkBadgeProgress: typeof import('../../services/badgeService').checkBadgeProgress;
let getUserBadges: typeof import('../../services/badgeService').getUserBadges;
let awardBadge: typeof import('../../services/badgeService').awardBadge;
let AVAILABLE_BADGES: typeof import('../../services/badgeService').AVAILABLE_BADGES;
type Badge = import('../../services/badgeService').Badge;

describe('badgeService', () => {
  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetModules();
    const mod = await import('../../services/badgeService');
    checkBadgeProgress = mod.checkBadgeProgress;
    getUserBadges = mod.getUserBadges;
    awardBadge = mod.awardBadge;
    AVAILABLE_BADGES = mod.AVAILABLE_BADGES;
  });

  // ─── AVAILABLE_BADGES ─────────────────────────────────────
  describe('AVAILABLE_BADGES', () => {
    it('should contain badges', () => {
      expect(AVAILABLE_BADGES.length).toBeGreaterThan(0);
    });

    it('should have unique IDs', () => {
      const ids = AVAILABLE_BADGES.map(b => b.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have all required fields', () => {
      for (const badge of AVAILABLE_BADGES) {
        expect(badge.id).toBeTruthy();
        expect(badge.name).toBeTruthy();
        expect(badge.description).toBeTruthy();
        expect(badge.icon).toBeTruthy();
        expect(badge.requirement).toBeGreaterThanOrEqual(1);
        expect(['learning', 'streak', 'social', 'special']).toContain(badge.category);
        expect(badge.earned).toBe(false);
      }
    });

    it('should include learning badges', () => {
      const learning = AVAILABLE_BADGES.filter(b => b.category === 'learning');
      expect(learning.length).toBeGreaterThan(0);
    });

    it('should include streak badges', () => {
      const streak = AVAILABLE_BADGES.filter(b => b.category === 'streak');
      expect(streak.length).toBeGreaterThan(0);
    });

    it('should include special badges', () => {
      const special = AVAILABLE_BADGES.filter(b => b.category === 'special');
      expect(special.length).toBeGreaterThan(0);
    });
  });

  // ─── checkBadgeProgress ───────────────────────────────────
  describe('checkBadgeProgress', () => {
    it('should return true when progress meets requirement', () => {
      expect(checkBadgeProgress('first_word', 1)).toBe(true);
    });

    it('should return true when progress exceeds requirement', () => {
      expect(checkBadgeProgress('first_word', 5)).toBe(true);
    });

    it('should return false when progress is below requirement', () => {
      expect(checkBadgeProgress('word_master_10', 5)).toBe(false);
    });

    it('should return false for non-existent badge', () => {
      expect(checkBadgeProgress('nonexistent_badge', 100)).toBe(false);
    });

    it('should return true for streak_3 with exactly 3', () => {
      expect(checkBadgeProgress('streak_3', 3)).toBe(true);
    });

    it('should return false for streak_7 with 5 days', () => {
      expect(checkBadgeProgress('streak_7', 5)).toBe(false);
    });

    it('should return true for streak_30 with 30 days', () => {
      expect(checkBadgeProgress('streak_30', 30)).toBe(true);
    });

    it('should return true for points_100 with 100 points', () => {
      expect(checkBadgeProgress('points_100', 100)).toBe(true);
    });

    it('should return false for points_1000 with 999', () => {
      expect(checkBadgeProgress('points_1000', 999)).toBe(false);
    });

    it('should handle zero progress', () => {
      expect(checkBadgeProgress('first_word', 0)).toBe(false);
    });
  });

  // ─── getUserBadges ────────────────────────────────────────
  describe('getUserBadges', () => {
    it('should return AVAILABLE_BADGES when nothing stored', () => {
      const badges = getUserBadges();
      expect(badges).toEqual(AVAILABLE_BADGES);
    });

    it('should return stored badges from localStorage', () => {
      const customBadges: Badge[] = [
        { ...AVAILABLE_BADGES[0], earned: true, earnedDate: new Date() },
      ];
      localStorage.setItem('user_badges', JSON.stringify(customBadges));
      const badges = getUserBadges();
      expect(badges).toHaveLength(1);
      expect(badges[0].earned).toBe(true);
    });

    it('should parse stored badges correctly', () => {
      const stored = AVAILABLE_BADGES.map(b => ({ ...b }));
      stored[0].earned = true;
      localStorage.setItem('user_badges', JSON.stringify(stored));
      const badges = getUserBadges();
      expect(badges[0].earned).toBe(true);
      expect(badges[1].earned).toBe(false);
    });
  });

  // ─── awardBadge ───────────────────────────────────────────
  describe('awardBadge', () => {
    it('should award an unearned badge', () => {
      const result = awardBadge('first_word');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('first_word');
      expect(result!.earned).toBe(true);
    });

    it('should set earnedDate when awarding', () => {
      const result = awardBadge('first_word');
      expect(result!.earnedDate).toBeTruthy();
    });

    it('should persist awarded badge to localStorage', () => {
      awardBadge('first_word');
      const stored = JSON.parse(localStorage.getItem('user_badges')!);
      const badge = stored.find((b: Badge) => b.id === 'first_word');
      expect(badge.earned).toBe(true);
    });

    it('should return null for already earned badge', () => {
      awardBadge('first_word'); // first time
      const result = awardBadge('first_word'); // second time
      expect(result).toBeNull();
    });

    it('should return null for non-existent badge', () => {
      const result = awardBadge('totally_fake_badge');
      expect(result).toBeNull();
    });

    it('should not affect other badges when awarding one', () => {
      awardBadge('first_word');
      const badges = getUserBadges();
      const other = badges.find(b => b.id === 'word_master_10');
      expect(other!.earned).toBe(false);
    });

    it('should allow awarding multiple different badges', () => {
      const b1 = awardBadge('first_word');
      const b2 = awardBadge('early_bird');
      expect(b1).not.toBeNull();
      expect(b2).not.toBeNull();
      const badges = getUserBadges();
      expect(badges.filter(b => b.earned).length).toBe(2);
    });
  });
});
