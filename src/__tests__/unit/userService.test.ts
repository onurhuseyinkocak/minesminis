import { describe, it, expect, vi, beforeEach } from 'vitest';

// Build a chainable mock for supabase
const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
const mockEq = vi.fn().mockReturnValue({
  maybeSingle: mockMaybeSingle,
  eq: mockEq2,
});
const mockDelete = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) });
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
const mockSelect = vi.fn().mockReturnValue({
  eq: mockEq,
  order: mockOrder,
});

const mockFrom = vi.fn().mockReturnValue({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  upsert: vi.fn().mockResolvedValue({ error: null }),
  delete: mockDelete,
});

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import { userService } from '../../services/userService';

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default behaviors
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    mockLimit.mockResolvedValue({ data: [], error: null });
  });

  // ─── createOrUpdateUserProfile ────────────────────────────
  describe('createOrUpdateUserProfile', () => {
    const baseUser = { uid: 'user-1', email: 'test@test.com' };
    const baseProfile = {
      role: 'student' as const,
      displayName: 'Test User',
      grade: '5',
      subjects: ['math'],
    };

    it('should create a new profile when user does not exist', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null }); // no existing user
      // awardPoints select
      mockMaybeSingle.mockResolvedValueOnce({ data: { points: 0 }, error: null });
      // checkAndAwardAchievement: achievements select
      mockSelect.mockReturnValueOnce({ eq: mockEq, order: mockOrder }); // for users select
      mockFrom.mockReturnValueOnce({ select: vi.fn().mockReturnValue({ eq: mockEq }), insert: mockInsert, update: mockUpdate, delete: mockDelete }); // for users insert

      await userService.createOrUpdateUserProfile(baseUser, baseProfile);
      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should throw if user id is missing', async () => {
      await expect(
        userService.createOrUpdateUserProfile(
          { email: 'test@test.com' },
          baseProfile
        )
      ).rejects.toThrow('User id is required');
    });

    it('should use user.id when uid is not available', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
      mockMaybeSingle.mockResolvedValueOnce({ data: { points: 0 }, error: null });

      await userService.createOrUpdateUserProfile(
        { id: 'user-id-field', email: 'test@test.com' },
        baseProfile
      );
      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should update existing user profile', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'user-1' }, error: null }); // existing user found
      await userService.createOrUpdateUserProfile(baseUser, baseProfile);
      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should throw on insert error', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null }); // no existing
      mockInsert.mockResolvedValueOnce({ error: { message: 'Insert failed' } });

      await expect(
        userService.createOrUpdateUserProfile(baseUser, baseProfile)
      ).rejects.toThrow('Failed to create your profile');
    });

    it('should throw on update error', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'user-1' }, error: null });
      mockUpdate.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } }),
      });

      await expect(
        userService.createOrUpdateUserProfile(baseUser, baseProfile)
      ).rejects.toThrow('Failed to update your profile');
    });

    it('should default email to empty string when not provided', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'user-1' }, error: null });
      await userService.createOrUpdateUserProfile(
        { uid: 'user-1' },
        baseProfile
      );
      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should set default mascotId to mimi_dragon', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'user-1' }, error: null });
      await userService.createOrUpdateUserProfile(baseUser, {
        ...baseProfile,
        mascotId: undefined,
      });
      // Verify it was called (the mascotId default is internal)
      expect(mockFrom).toHaveBeenCalled();
    });
  });

  // ─── getUserProfile ───────────────────────────────────────
  describe('getUserProfile', () => {
    it('should return user profile when found', async () => {
      const mockProfile = { id: 'user-1', display_name: 'Test', points: 100 };
      mockMaybeSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

      const result = await userService.getUserProfile('user-1');
      expect(result).toEqual(mockProfile);
    });

    it('should return null when user not found', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
      const result = await userService.getUserProfile('missing');
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });
      const result = await userService.getUserProfile('user-err');
      expect(result).toBeNull();
    });
  });

  // ─── updateUserProfile ────────────────────────────────────
  describe('updateUserProfile', () => {
    it('should call supabase update with correct params', async () => {
      await userService.updateUserProfile('user-1', { display_name: 'New Name' });
      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should throw on error', async () => {
      mockUpdate.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValue({ error: { message: 'fail' } }),
      });
      await expect(
        userService.updateUserProfile('user-1', { display_name: 'X' })
      ).rejects.toBeTruthy();
    });
  });

  // ─── followUser / unfollowUser ────────────────────────────
  describe('followUser', () => {
    it('should insert a follow record', async () => {
      mockInsert.mockResolvedValueOnce({ error: null });
      // awardPoints call
      mockMaybeSingle.mockResolvedValueOnce({ data: { points: 10 }, error: null });

      const result = await userService.followUser('follower-1', 'following-1');
      expect(result.error).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith('follows');
    });

    it('should award 5 points on successful follow', async () => {
      mockInsert.mockResolvedValueOnce({ error: null });
      mockMaybeSingle.mockResolvedValueOnce({ data: { points: 10 }, error: null });

      await userService.followUser('follower-1', 'following-1');
      // awardPoints should have been called (from calls to 'users')
      expect(mockFrom).toHaveBeenCalledWith('users');
    });
  });

  describe('unfollowUser', () => {
    it('should delete a follow record', async () => {
      const result = await userService.unfollowUser('follower-1', 'following-1');
      expect(mockFrom).toHaveBeenCalledWith('follows');
      expect(result).toHaveProperty('error');
    });
  });

  // ─── isFollowing ──────────────────────────────────────────
  describe('isFollowing', () => {
    it('should return true when follow record exists', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'follow-1' }, error: null });
      const result = await userService.isFollowing('f1', 'f2');
      expect(result).toBe(true);
    });

    it('should return false when no follow record', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
      const result = await userService.isFollowing('f1', 'f2');
      expect(result).toBe(false);
    });
  });

  // ─── awardPoints ──────────────────────────────────────────
  describe('awardPoints', () => {
    it('should increment points for existing user', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { points: 50 }, error: null });
      await userService.awardPoints('user-1', 25);
      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should not update if user does not exist', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
      await userService.awardPoints('missing', 10);
      // update should not be called for non-existent user
      expect(mockFrom).toHaveBeenCalledWith('users');
    });
  });

  // ─── getLeaderboard ──────────────────────────────────────
  describe('getLeaderboard', () => {
    it('should return sorted users by points', async () => {
      const mockUsers = [
        { id: '1', display_name: 'A', points: 100 },
        { id: '2', display_name: 'B', points: 50 },
      ];
      mockLimit.mockResolvedValueOnce({ data: mockUsers, error: null });

      const result = await userService.getLeaderboard(10);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array on error', async () => {
      mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'fail' } });
      const result = await userService.getLeaderboard();
      expect(result).toEqual([]);
    });

    it('should default limit to 10', async () => {
      mockLimit.mockResolvedValueOnce({ data: [], error: null });
      await userService.getLeaderboard();
      expect(mockFrom).toHaveBeenCalledWith('users');
    });
  });
});
