import { supabase } from '../config/supabase';
import { errorLogger } from './errorLogger';
import { withRetry } from '../utils/retryUtils';

// Columns needed for a full UserProfile — avoids select('*') bandwidth waste
const USER_PROFILE_COLUMNS =
  'id, email, role, display_name, avatar_url, bio, grade, subjects, points, badges, streak_days, level, xp, last_login, is_online, settings, created_at, featured_badge';

export interface UserProfile {
  id: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  display_name: string;
  avatar_url: string | null;
  bio: string;
  grade: string | null;
  subjects: string[];
  points: number;
  badges: string[];
  streak_days: number;
  level: number;
  xp: number;
  featured_badge?: string | null;
  last_login: string;
  is_online: boolean;
  settings: Record<string, unknown>;
  created_at: string;
}

export const userService = {
  async createOrUpdateUserProfile(
    user: { uid?: string; id?: string; email?: string | null },
    profileData: {
      role: 'teacher' | 'student' | 'parent';
      displayName: string;
      grade?: string;
      subjects?: string[];
      bio?: string;
      avatarUrl?: string;
      avatar_emoji?: string;
      mascotId?: string;
    }
  ): Promise<void> {
    const userId = user.uid ?? user.id;
    if (!userId) throw new Error('User id is required');
    const userEmail = user.email ?? '';

    const { data: existingUser } = await withRetry(() =>
      supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle()
    );

    const userProfile = {
      id: userId,
      email: userEmail,
      role: profileData.role,
      display_name: profileData.displayName,
      avatar_url: profileData.avatarUrl || null,
      bio: profileData.bio || '',
      grade: profileData.grade || null,
      subjects: profileData.subjects || [],
      last_login: new Date().toISOString(),
      is_online: true,
      settings: {
        setup_completed: true,
        setup_date: new Date().toISOString(),
        avatar_emoji: profileData.avatar_emoji || null,
        mascotId: profileData.mascotId || 'mimi_cat',
      }
    };

    if (!existingUser) {
      const { error } = await supabase.from('users').insert({
        ...userProfile,
        points: 0,
        xp: 0,
        badges: [],
        streak_days: 0,
        level: 1,
        created_at: new Date().toISOString(),
      });

      if (error) {
        errorLogger.log({
          severity: 'critical',
          message: `Error creating user profile in Supabase: ${error.message || 'Unknown database error'}`,
          component: 'userService.createOrUpdateUserProfile',
          metadata: { userId, error },
        });
        throw new Error(`Failed to create your profile. Details: ${error.message || 'Unknown database error'}`);
      }

      try {
        await this.awardPoints(userId, 10);
        await this.checkAndAwardAchievement(userId, 'first_steps');
      } catch (achievementError) {
        errorLogger.log({
          severity: 'medium',
          message: `Error awarding initial achievements: ${achievementError instanceof Error ? achievementError.message : String(achievementError)}`,
          component: 'userService.createOrUpdateUserProfile',
        });
      }
    } else {
      const { error } = await supabase
        .from('users')
        .update(userProfile)
        .eq('id', userId);

      if (error) {
        errorLogger.log({
          severity: 'critical',
          message: `Error updating user profile in Supabase: ${error.message || 'Unknown database error'}`,
          component: 'userService.createOrUpdateUserProfile',
          metadata: { userId, error },
        });
        throw new Error(`Failed to update your profile. Details: ${error.message || 'Unknown database error'}`);
      }
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const { data, error } = await withRetry(() =>
      supabase
        .from('users')
        .select(USER_PROFILE_COLUMNS)
        .eq('id', uid)
        .maybeSingle()
    );

    if (error) {
      errorLogger.log({
        severity: 'high',
        message: `Failed to fetch profile for user ${uid}: ${error.message}`,
        component: 'userService.getUserProfile',
        metadata: { uid, error },
      });
      return null;
    }

    return data;
  },

  async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
  ): Promise<void> {
    if (updates.display_name !== undefined) {
      const trimmed = updates.display_name.trim();
      if (trimmed.length === 0) throw new Error('Display name cannot be empty');
      if (trimmed.length > 30) throw new Error('Display name must be 30 characters or fewer');
      updates = { ...updates, display_name: trimmed };
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', uid);

    if (error) {
      errorLogger.log({
        severity: 'high',
        message: `Error updating user profile: ${error.message}`,
        component: 'userService.updateUserProfile',
        metadata: { uid, error },
      });
      throw error;
    }
  },

  async updateOnlineStatus(uid: string, isOnline: boolean): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_online: isOnline })
      .eq('id', uid);

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `Error updating online status: ${error.message}`,
        component: 'userService.updateOnlineStatus',
        metadata: { uid, isOnline, error },
      });
    }
  },

  async followUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId });

    if (!error) {
      await this.awardPoints(followerId, 5);
    }

    return { error };
  },

  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    return { error };
  },

  async getFollowers(userId: string): Promise<Record<string, unknown>[]> {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, users!follows_follower_id_fkey(*)')
      .eq('following_id', userId);

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `Error fetching followers: ${error.message}`,
        component: 'userService.getFollowers',
      });
      return [];
    }

    return data || [];
  },

  async getFollowing(userId: string): Promise<Record<string, unknown>[]> {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id, users!follows_following_id_fkey(*)')
      .eq('follower_id', userId);

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `Error fetching following: ${error.message}`,
        component: 'userService.getFollowing',
      });
      return [];
    }

    return data || [];
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `Error checking follow status: ${error.message}`,
        component: 'userService.isFollowing',
        metadata: { followerId, followingId, error },
      });
      return false;
    }

    return !!data;
  },

  async awardPoints(userId: string, points: number): Promise<void> {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      errorLogger.log({
        severity: 'medium',
        message: `Error fetching user points: ${fetchError.message}`,
        component: 'userService.awardPoints',
        metadata: { userId, fetchError },
      });
      return;
    }

    if (!user) return;

    const newTotal = (user.points || 0) + points;
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newTotal, xp: newTotal })
      .eq('id', userId);

    if (updateError) {
      errorLogger.log({
        severity: 'medium',
        message: `Error awarding points: ${updateError.message}`,
        component: 'userService.awardPoints',
        metadata: { userId, points, updateError },
      });
    }
  },

  async checkAndAwardAchievement(userId: string, achievementKey: string): Promise<void> {
    const achievementMap: Record<string, string> = {};

    const { data: achievements, error: fetchError } = await supabase
      .from('achievements')
      .select('id, name');

    if (fetchError) {
      errorLogger.log({
        severity: 'medium',
        message: `Error fetching achievements: ${fetchError.message}`,
        component: 'userService.checkAndAwardAchievement',
        metadata: { userId, achievementKey, fetchError },
      });
      return;
    }

    if (achievements) {
      achievements.forEach((ach: { id: string; name: string }) => {
        achievementMap[ach.name.toLowerCase().replace(/\s+/g, '_')] = ach.id;
      });
    }

    const achievementId = achievementMap[achievementKey];
    if (!achievementId) return;

    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .maybeSingle();

    if (!existing) {
      const { error: insertError } = await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId,
      });

      if (insertError) {
        errorLogger.log({
          severity: 'medium',
          message: `Error awarding achievement: ${insertError.message}`,
          component: 'userService.checkAndAwardAchievement',
          metadata: { userId, achievementKey, achievementId, insertError },
        });
      }
    }
  },

  async getLeaderboard(limit: number = 10): Promise<Record<string, unknown>[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, avatar_url, role, points')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `Error fetching leaderboard: ${error.message}`,
        component: 'userService.getLeaderboard',
      });
      return [];
    }

    return data || [];
  },
};