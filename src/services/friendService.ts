import { supabase } from '../config/supabase';
import { errorLogger } from './errorLogger';

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendDisplayName: string;
  friendAvatarUrl?: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

export interface FriendWeeklyStats {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  weeklyXP: number;
  streak: number;
  level: number;
}

type FriendRow = {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  friend_profile?: {
    display_name: string;
    avatar_url: string | null;
  } | null;
  user_profile?: {
    display_name: string;
    avatar_url: string | null;
  } | null;
};

type UserProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  weekly_xp: number | null;
  streak_days: number;
  level: number;
};

/**
 * Derives the friend code from a user ID (first 8 chars, lowercase).
 */
export function getFriendCode(userId: string): string {
  return userId.slice(0, 8).toLowerCase();
}

/**
 * Sends a friend request to the user whose ID starts with the given 8-char friend code.
 */
export async function sendFriendRequest(
  myUserId: string,
  friendCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const normalized = friendCode.trim().toLowerCase();

    if (normalized.length !== 8) {
      return { success: false, error: 'Friend code must be exactly 8 characters.' };
    }

    if (myUserId.toLowerCase().startsWith(normalized)) {
      return { success: false, error: 'You cannot add yourself as a friend.' };
    }

    // Look up a user whose id starts with the friend code
    const { data: users, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .ilike('id', `${normalized}%`)
      .limit(1);

    if (lookupError) {
      errorLogger.log({
        severity: 'medium',
        message: `Friend lookup error: ${lookupError.message}`,
        component: 'friendService.sendFriendRequest',
      });
      return { success: false, error: 'Failed to find that friend code.' };
    }

    if (!users || users.length === 0) {
      return { success: false, error: 'No user found with that friend code.' };
    }

    const targetId = (users[0] as { id: string }).id;

    // Check for existing relation in either direction
    const { data: existing } = await supabase
      .from('friends')
      .select('id, status')
      .or(`and(user_id.eq.${myUserId},friend_id.eq.${targetId}),and(user_id.eq.${targetId},friend_id.eq.${myUserId})`)
      .maybeSingle();

    if (existing) {
      const row = existing as { id: string; status: string };
      if (row.status === 'accepted') {
        return { success: false, error: 'You are already friends with this user.' };
      }
      return { success: false, error: 'A friend request already exists.' };
    }

    const { error: insertError } = await supabase
      .from('friends')
      .insert({ user_id: myUserId, friend_id: targetId, status: 'pending' });

    if (insertError) {
      errorLogger.log({
        severity: 'medium',
        message: `Friend request insert error: ${insertError.message}`,
        component: 'friendService.sendFriendRequest',
      });
      return { success: false, error: 'Failed to send friend request.' };
    }

    return { success: true };
  } catch (err) {
    errorLogger.log({
      severity: 'medium',
      message: `sendFriendRequest unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      component: 'friendService.sendFriendRequest',
    });
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Accepts an incoming pending friend request by its row ID.
 */
export async function acceptFriendRequest(requestId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `acceptFriendRequest error: ${error.message}`,
        component: 'friendService.acceptFriendRequest',
      });
    }
  } catch (err) {
    errorLogger.log({
      severity: 'medium',
      message: `acceptFriendRequest unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      component: 'friendService.acceptFriendRequest',
    });
  }
}

/**
 * Returns all accepted friends for a given user.
 */
export async function getFriends(userId: string): Promise<Friend[]> {
  try {
    // Rows where user is the requester
    const { data: sentRows, error: sentError } = await supabase
      .from('friends')
      .select('id, user_id, friend_id, status, created_at')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    // Rows where user is the recipient
    const { data: receivedRows, error: receivedError } = await supabase
      .from('friends')
      .select('id, user_id, friend_id, status, created_at')
      .eq('friend_id', userId)
      .eq('status', 'accepted');

    if (sentError || receivedError) {
      const msg = sentError?.message ?? receivedError?.message ?? 'unknown';
      errorLogger.log({
        severity: 'low',
        message: `getFriends query error: ${msg}`,
        component: 'friendService.getFriends',
      });
      return [];
    }

    const allRows = [...(sentRows ?? []), ...(receivedRows ?? [])] as FriendRow[];
    if (allRows.length === 0) return [];

    // Collect unique friend IDs
    const friendIds = allRows.map((row) =>
      row.user_id === userId ? row.friend_id : row.user_id
    );

    const { data: profiles } = await supabase
      .from('users')
      .select('id, display_name, avatar_url')
      .in('id', friendIds);

    const profileMap = new Map<string, { display_name: string; avatar_url: string | null }>();
    (profiles ?? []).forEach((p) => {
      const profile = p as { id: string; display_name: string; avatar_url: string | null };
      profileMap.set(profile.id, profile);
    });

    return allRows.map((row): Friend => {
      const fid = row.user_id === userId ? row.friend_id : row.user_id;
      const profile = profileMap.get(fid);
      return {
        id: row.id,
        userId: row.user_id,
        friendId: fid,
        friendDisplayName: profile?.display_name ?? 'Unknown',
        friendAvatarUrl: profile?.avatar_url ?? undefined,
        status: 'accepted',
        createdAt: row.created_at,
      };
    });
  } catch (err) {
    errorLogger.log({
      severity: 'low',
      message: `getFriends unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      component: 'friendService.getFriends',
    });
    return [];
  }
}

/**
 * Returns all pending incoming friend requests for a given user.
 */
export async function getPendingRequests(userId: string): Promise<Friend[]> {
  try {
    const { data: rows, error } = await supabase
      .from('friends')
      .select('id, user_id, friend_id, status, created_at')
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) {
      errorLogger.log({
        severity: 'low',
        message: `getPendingRequests error: ${error.message}`,
        component: 'friendService.getPendingRequests',
      });
      return [];
    }

    const pendingRows = (rows ?? []) as FriendRow[];
    if (pendingRows.length === 0) return [];

    const requesterIds = pendingRows.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from('users')
      .select('id, display_name, avatar_url')
      .in('id', requesterIds);

    const profileMap = new Map<string, { display_name: string; avatar_url: string | null }>();
    (profiles ?? []).forEach((p) => {
      const profile = p as { id: string; display_name: string; avatar_url: string | null };
      profileMap.set(profile.id, profile);
    });

    return pendingRows.map((row): Friend => {
      const profile = profileMap.get(row.user_id);
      return {
        id: row.id,
        userId: row.user_id,
        friendId: row.friend_id,
        friendDisplayName: profile?.display_name ?? 'Unknown',
        friendAvatarUrl: profile?.avatar_url ?? undefined,
        status: 'pending',
        createdAt: row.created_at,
      };
    });
  } catch (err) {
    errorLogger.log({
      severity: 'low',
      message: `getPendingRequests unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      component: 'friendService.getPendingRequests',
    });
    return [];
  }
}

/**
 * Removes a friend relation by the row ID (works for either direction).
 */
export async function removeFriend(friendRowId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendRowId);

    if (error) {
      errorLogger.log({
        severity: 'medium',
        message: `removeFriend error: ${error.message}`,
        component: 'friendService.removeFriend',
      });
    }
  } catch (err) {
    errorLogger.log({
      severity: 'medium',
      message: `removeFriend unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      component: 'friendService.removeFriend',
    });
  }
}

/**
 * Returns weekly XP leaderboard for the user and all their accepted friends.
 */
export async function getFriendLeaderboard(userId: string): Promise<FriendWeeklyStats[]> {
  try {
    const friends = await getFriends(userId);
    const friendIds = friends.map((f) => f.friendId);
    const allIds = [userId, ...friendIds];

    const { data: profiles, error } = await supabase
      .from('users')
      .select('id, display_name, avatar_url, weekly_xp, streak_days, level')
      .in('id', allIds);

    if (error) {
      errorLogger.log({
        severity: 'low',
        message: `getFriendLeaderboard error: ${error.message}`,
        component: 'friendService.getFriendLeaderboard',
      });
      return [];
    }

    const rows = (profiles ?? []) as UserProfileRow[];

    return rows
      .map((p): FriendWeeklyStats => ({
        userId: p.id,
        displayName: p.display_name,
        avatarUrl: p.avatar_url ?? undefined,
        weeklyXP: p.weekly_xp ?? 0,
        streak: p.streak_days,
        level: p.level,
      }))
      .sort((a, b) => b.weeklyXP - a.weeklyXP);
  } catch (err) {
    errorLogger.log({
      severity: 'low',
      message: `getFriendLeaderboard unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      component: 'friendService.getFriendLeaderboard',
    });
    return [];
  }
}
