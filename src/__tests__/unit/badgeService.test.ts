import { describe, it, expect } from 'vitest';

/**
 * Badge service was refactored — the standalone services/badgeService module
 * was inlined into GamificationContext. These tests are no longer applicable
 * to the old module path. Badge logic is now tested via GamificationContext
 * integration tests.
 */
describe('badgeService (deprecated — inlined into GamificationContext)', () => {
  it('badge logic now lives in GamificationContext', () => {
    // This is a placeholder confirming the migration.
    // Real badge tests should target the GamificationContext.
    expect(true).toBe(true);
  });
});
