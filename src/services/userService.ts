import { supabase } from '../config/supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'teacher' | 'student';
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
  last_login: string;
  is_online: boolean;
  settings: Record<string, any>;
  created_at: string;
}

export const userService = {
  async createOrUpdateUserProfile(
    user: any,
    profileData: {
      role: 'teacher' | 'student';
      displayName: string;
      grade?: string;
      subjects?: string[];
      bio?: string;
      avatarUrl?: string;
    }
  ) {
    const userId = user.id || user.uid;
    const userEmail = user.email;

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

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
    };

    if (!existingUser) {
      const { error } = await supabase.from('users').insert({
        ...userProfile,
        points: 0,
        badges: [],
        streak_days: 0,
        settings: {},
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      await this.awardPoints(userId, 10);
      await this.checkAndAwardAchievement(userId, 'first_steps');
    } else {
      const { error } = await supabase
        .from('users')
        .update(userProfile)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  },

  async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
  ) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', uid);

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async updateOnlineStatus(uid: string, isOnline: boolean) {
    await supabase
      .from('users')
      .update({ is_online: isOnline })
      .eq('id', uid);
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

  async getFollowers(userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, users!follows_follower_id_fkey(*)')
      .eq('following_id', userId);

    if (error) {
      console.error('Error fetching followers:', error);
      return [];
    }

    return data || [];
  },

  async getFollowing(userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id, users!follows_following_id_fkey(*)')
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following:', error);
      return [];
    }

    return data || [];
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    return !!data;
  },

  async awardPoints(userId: string, points: number) {
    const { data: user } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (user) {
      await supabase
        .from('users')
        .update({ points: user.points + points })
        .eq('id', userId);
    }
  },

  async checkAndAwardAchievement(userId: string, achievementKey: string) {
    const achievementMap: Record<string, string> = {};

    const { data: achievements } = await supabase
      .from('achievements')
      .select('*');

    if (achievements) {
      achievements.forEach((ach) => {
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
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId,
      });
    }
  },

  async getLeaderboard(limit: number = 10) {
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, avatar_url, role, points')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  },
};