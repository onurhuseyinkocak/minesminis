/**
 * GAMIFICATION CONTEXT
 * XP, Levels, Streaks, Daily Rewards, Badges
 * Core gamification system for MinesMinis
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

// ============================================================
// TYPES
// ============================================================

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'learning' | 'streak' | 'achievement' | 'special';
    requirement: number;
    requirementType: string;
}

export interface DailyReward {
    day: number;
    xp: number;
    badge?: string;
    special?: boolean;
}

export interface UserStats {
    xp: number;
    level: number;
    streakDays: number;
    lastLoginDate: string | null;
    lastDailyClaim: string | null;
    badges: string[];
    wordsLearned: number;
    gamesPlayed: number;
    videosWatched: number;
    worksheetsCompleted: number;
    dailyChallengesCompleted: number;
}

interface GamificationContextType {
    // Stats
    stats: UserStats;
    loading: boolean;

    // XP & Levels
    addXP: (amount: number, reason: string) => Promise<void>;
    getXPForNextLevel: () => number;
    getXPProgress: () => number;

    // Streaks
    checkStreak: () => Promise<void>;
    getStreakBonus: () => number;

    // Daily Rewards
    canClaimDaily: boolean;
    claimDailyReward: () => Promise<DailyReward | null>;
    getNextClaimTime: () => Date | null;
    getDailyRewardForDay: (day: number) => DailyReward;

    // Badges
    allBadges: Badge[];
    hasBadge: (badgeId: string) => boolean;
    checkAndAwardBadges: () => Promise<string[]>;

    // Activity Tracking
    trackActivity: (type: string, metadata?: any) => Promise<void>;

    // Level Up
    showLevelUp: boolean;
    newLevel: number;
    dismissLevelUp: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const XP_PER_LEVEL_BASE = 100;
const XP_LEVEL_MULTIPLIER = 1.5;

const DAILY_REWARDS: DailyReward[] = [
    { day: 1, xp: 10 },
    { day: 2, xp: 20 },
    { day: 3, xp: 30 },
    { day: 4, xp: 40 },
    { day: 5, xp: 50, badge: 'weekly_starter' },
    { day: 6, xp: 60 },
    { day: 7, xp: 100, special: true, badge: 'week_champion' },
];

export const ALL_BADGES: Badge[] = [
    // Streak Badges
    { id: 'streak_3', name: '3 Day Streak', description: 'Login 3 days in a row', icon: '🔥', category: 'streak', requirement: 3, requirementType: 'streak' },
    { id: 'streak_7', name: 'Week Warrior', description: 'Login 7 days in a row', icon: '⚡', category: 'streak', requirement: 7, requirementType: 'streak' },
    { id: 'streak_30', name: 'Monthly Master', description: 'Login 30 days in a row', icon: '🌟', category: 'streak', requirement: 30, requirementType: 'streak' },
    { id: 'streak_100', name: 'Century Champion', description: 'Login 100 days in a row', icon: '👑', category: 'streak', requirement: 100, requirementType: 'streak' },

    // Learning Badges - Words
    { id: 'words_10', name: 'Word Explorer', description: 'Learn 10 words', icon: '📖', category: 'learning', requirement: 10, requirementType: 'words' },
    { id: 'words_50', name: 'Word Collector', description: 'Learn 50 words', icon: '📚', category: 'learning', requirement: 50, requirementType: 'words' },
    { id: 'words_100', name: 'Word Master', description: 'Learn 100 words', icon: '🎓', category: 'learning', requirement: 100, requirementType: 'words' },
    { id: 'words_500', name: 'Word Genius', description: 'Learn 500 words', icon: '🧠', category: 'learning', requirement: 500, requirementType: 'words' },

    // Learning Badges - Games
    { id: 'games_5', name: 'Game Starter', description: 'Play 5 games', icon: '🎮', category: 'learning', requirement: 5, requirementType: 'games' },
    { id: 'games_25', name: 'Game Player', description: 'Play 25 games', icon: '🕹️', category: 'learning', requirement: 25, requirementType: 'games' },
    { id: 'games_100', name: 'Game Champion', description: 'Play 100 games', icon: '🏆', category: 'learning', requirement: 100, requirementType: 'games' },

    // Learning Badges - Videos
    { id: 'videos_5', name: 'Video Viewer', description: 'Watch 5 videos', icon: '🎬', category: 'learning', requirement: 5, requirementType: 'videos' },
    { id: 'videos_25', name: 'Video Fan', description: 'Watch 25 videos', icon: '📺', category: 'learning', requirement: 25, requirementType: 'videos' },
    { id: 'videos_100', name: 'Video Expert', description: 'Watch 100 videos', icon: '🎥', category: 'learning', requirement: 100, requirementType: 'videos' },

    // Achievement Badges
    { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', category: 'achievement', requirement: 5, requirementType: 'level' },
    { id: 'level_10', name: 'Shining Star', description: 'Reach level 10', icon: '🌟', category: 'achievement', requirement: 10, requirementType: 'level' },
    { id: 'level_25', name: 'Superstar', description: 'Reach level 25', icon: '💫', category: 'achievement', requirement: 25, requirementType: 'level' },
    { id: 'level_50', name: 'Legend', description: 'Reach level 50', icon: '🏅', category: 'achievement', requirement: 50, requirementType: 'level' },

    // Special Badges
    { id: 'weekly_starter', name: 'Weekly Starter', description: 'Claim 5 daily rewards', icon: '🎁', category: 'special', requirement: 5, requirementType: 'daily' },
    { id: 'week_champion', name: 'Week Champion', description: 'Claim 7 daily rewards in a row', icon: '🏆', category: 'special', requirement: 7, requirementType: 'daily' },
    { id: 'first_favorite', name: 'First Favorite', description: 'Add your first favorite', icon: '❤️', category: 'special', requirement: 1, requirementType: 'favorites' },
    { id: 'premium_member', name: 'Premium Member', description: 'Become a premium member', icon: '👑', category: 'special', requirement: 1, requirementType: 'premium' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function calculateLevel(xp: number): number {
    let level = 1;
    let xpNeeded = XP_PER_LEVEL_BASE;
    let totalXP = 0;

    while (totalXP + xpNeeded <= xp) {
        totalXP += xpNeeded;
        level++;
        xpNeeded = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, level - 1));
    }

    return level;
}

function getXPForLevel(level: number): number {
    return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, level - 1));
}

function getTotalXPForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += getXPForLevel(i);
    }
    return total;
}

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
}

function isYesterday(date1: Date, date2: Date): boolean {
    const yesterday = new Date(date2);
    yesterday.setDate(yesterday.getDate() - 1);
    return date1.toDateString() === yesterday.toDateString();
}

// ============================================================
// CONTEXT
// ============================================================

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const DEFAULT_STATS: UserStats = {
    xp: 0,
    level: 1,
    streakDays: 0,
    lastLoginDate: null,
    lastDailyClaim: null,
    badges: [],
    wordsLearned: 0,
    gamesPlayed: 0,
    videosWatched: 0,
    worksheetsCompleted: 0,
    dailyChallengesCompleted: 0,
};

export function GamificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(1);
    const [canClaimDaily, setCanClaimDaily] = useState(false);

    // Load stats from localStorage (works without database)
    useEffect(() => {
        if (user) {
            loadStats();
        } else {
            setStats(DEFAULT_STATS);
            setLoading(false);
        }
    }, [user]);

    const loadStats = async () => {
        try {
            setLoading(true);

            // Try to load from localStorage first
            const localStats = localStorage.getItem(`gamification_${user?.id}`);
            if (localStats) {
                const parsed = JSON.parse(localStats);
                setStats(parsed);
                checkDailyClaim(parsed.lastDailyClaim);
            }

            // Try to load from Supabase (if available)
            if (user?.id) {
                const { data, error } = await supabase
                    .from('users')
                    .select('points, streak_days, badges, last_login')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    const serverStats: UserStats = {
                        ...stats,
                        xp: data.points || 0,
                        level: calculateLevel(data.points || 0),
                        streakDays: data.streak_days || 0,
                        badges: data.badges || [],
                        lastLoginDate: data.last_login,
                    };
                    setStats(serverStats);
                    saveStatsLocally(serverStats);
                }
            }
        } catch (error) {
            console.error('Error loading gamification stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveStatsLocally = (newStats: UserStats) => {
        if (user?.id) {
            localStorage.setItem(`gamification_${user.id}`, JSON.stringify(newStats));
        }
    };

    const checkDailyClaim = (lastClaim: string | null) => {
        if (!lastClaim) {
            setCanClaimDaily(true);
            return;
        }

        const lastClaimDate = new Date(lastClaim);
        const now = new Date();
        setCanClaimDaily(!isSameDay(lastClaimDate, now));
    };

    // ==================== XP FUNCTIONS ====================

    const addXP = async (amount: number, reason: string) => {
        const streakBonus = getStreakBonus();
        const totalXP = Math.floor(amount * (1 + streakBonus / 100));
        const newXP = stats.xp + totalXP;
        const oldLevel = stats.level;
        const newLevelValue = calculateLevel(newXP);

        const newStats = {
            ...stats,
            xp: newXP,
            level: newLevelValue,
        };

        setStats(newStats);
        saveStatsLocally(newStats);

        // Level up!
        if (newLevelValue > oldLevel) {
            setNewLevel(newLevelValue);
            setShowLevelUp(true);
        }

        // Track activity
        await trackActivity('xp_earned', { amount: totalXP, reason, streakBonus });

        // Try to sync with server
        if (user?.id) {
            try {
                await supabase
                    .from('users')
                    .update({ points: newXP })
                    .eq('id', user.id);
            } catch (error) {
                console.error('Error syncing XP:', error);
            }
        }
    };

    const getXPForNextLevel = (): number => {
        return getXPForLevel(stats.level);
    };

    const getXPProgress = (): number => {
        const levelStartXP = getTotalXPForLevel(stats.level);
        const levelEndXP = getTotalXPForLevel(stats.level + 1);
        const currentProgress = stats.xp - levelStartXP;
        const levelXP = levelEndXP - levelStartXP;
        return Math.min(100, Math.floor((currentProgress / levelXP) * 100));
    };

    // ==================== STREAK FUNCTIONS ====================

    const checkStreak = async () => {
        const now = new Date();
        const lastLogin = stats.lastLoginDate ? new Date(stats.lastLoginDate) : null;

        let newStreak = stats.streakDays;

        if (!lastLogin) {
            newStreak = 1;
        } else if (isSameDay(lastLogin, now)) {
            // Same day, no change
        } else if (isYesterday(lastLogin, now)) {
            // Consecutive day
            newStreak = stats.streakDays + 1;
        } else {
            // Streak broken
            newStreak = 1;
        }

        const newStats = {
            ...stats,
            streakDays: newStreak,
            lastLoginDate: now.toISOString(),
        };

        setStats(newStats);
        saveStatsLocally(newStats);

        // Sync with server
        if (user?.id) {
            try {
                await supabase
                    .from('users')
                    .update({
                        streak_days: newStreak,
                        last_login: now.toISOString()
                    })
                    .eq('id', user.id);
            } catch (error) {
                console.error('Error syncing streak:', error);
            }
        }

        // Check for streak badges
        await checkAndAwardBadges();
    };

    const getStreakBonus = (): number => {
        if (stats.streakDays >= 30) return 50;
        if (stats.streakDays >= 14) return 30;
        if (stats.streakDays >= 7) return 20;
        if (stats.streakDays >= 3) return 10;
        return 0;
    };

    // ==================== DAILY REWARD FUNCTIONS ====================

    const claimDailyReward = async (): Promise<DailyReward | null> => {
        if (!canClaimDaily) return null;

        const dayIndex = (stats.streakDays - 1) % 7;
        const reward = DAILY_REWARDS[dayIndex] || DAILY_REWARDS[0];

        const now = new Date();
        const newStats = {
            ...stats,
            lastDailyClaim: now.toISOString(),
        };

        setStats(newStats);
        saveStatsLocally(newStats);
        setCanClaimDaily(false);

        // Add XP
        await addXP(reward.xp, 'daily_reward');

        // Award badge if included
        if (reward.badge && !stats.badges.includes(reward.badge)) {
            await awardBadge(reward.badge);
        }

        return reward;
    };

    const getNextClaimTime = (): Date | null => {
        if (!stats.lastDailyClaim) return null;

        const lastClaim = new Date(stats.lastDailyClaim);
        const nextClaim = new Date(lastClaim);
        nextClaim.setDate(nextClaim.getDate() + 1);
        nextClaim.setHours(0, 0, 0, 0);

        return nextClaim;
    };

    const getDailyRewardForDay = (day: number): DailyReward => {
        const index = (day - 1) % 7;
        return DAILY_REWARDS[index] || DAILY_REWARDS[0];
    };

    // ==================== BADGE FUNCTIONS ====================

    const hasBadge = (badgeId: string): boolean => {
        return stats.badges.includes(badgeId);
    };

    const awardBadge = async (badgeId: string) => {
        if (hasBadge(badgeId)) return;

        const newBadges = [...stats.badges, badgeId];
        const newStats = {
            ...stats,
            badges: newBadges,
        };

        setStats(newStats);
        saveStatsLocally(newStats);

        // Sync with server
        if (user?.id) {
            try {
                await supabase
                    .from('users')
                    .update({ badges: newBadges })
                    .eq('id', user.id);
            } catch (error) {
                console.error('Error syncing badges:', error);
            }
        }
    };

    const checkAndAwardBadges = async (): Promise<string[]> => {
        const newBadges: string[] = [];

        for (const badge of ALL_BADGES) {
            if (hasBadge(badge.id)) continue;

            let earned = false;

            switch (badge.requirementType) {
                case 'streak':
                    earned = stats.streakDays >= badge.requirement;
                    break;
                case 'words':
                    earned = stats.wordsLearned >= badge.requirement;
                    break;
                case 'games':
                    earned = stats.gamesPlayed >= badge.requirement;
                    break;
                case 'videos':
                    earned = stats.videosWatched >= badge.requirement;
                    break;
                case 'level':
                    earned = stats.level >= badge.requirement;
                    break;
            }

            if (earned) {
                await awardBadge(badge.id);
                newBadges.push(badge.id);
            }
        }

        return newBadges;
    };

    // ==================== ACTIVITY TRACKING ====================

    const trackActivity = async (type: string, metadata?: any) => {
        const newStats = { ...stats };

        switch (type) {
            case 'word_learned':
                newStats.wordsLearned = (stats.wordsLearned || 0) + 1;
                break;
            case 'game_played':
                newStats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
                break;
            case 'video_watched':
                newStats.videosWatched = (stats.videosWatched || 0) + 1;
                break;
            case 'worksheet_completed':
                newStats.worksheetsCompleted = (stats.worksheetsCompleted || 0) + 1;
                break;
            case 'daily_challenge':
                newStats.dailyChallengesCompleted = (stats.dailyChallengesCompleted || 0) + 1;
                break;
        }

        setStats(newStats);
        saveStatsLocally(newStats);

        // Check for new badges
        await checkAndAwardBadges();
    };

    // ==================== LEVEL UP MODAL ====================

    const dismissLevelUp = () => {
        setShowLevelUp(false);
    };

    // Check streak on mount
    useEffect(() => {
        if (user && !loading) {
            checkStreak();
        }
    }, [user, loading]);

    const value: GamificationContextType = {
        stats,
        loading,
        addXP,
        getXPForNextLevel,
        getXPProgress,
        checkStreak,
        getStreakBonus,
        canClaimDaily,
        claimDailyReward,
        getNextClaimTime,
        getDailyRewardForDay,
        allBadges: ALL_BADGES,
        hasBadge,
        checkAndAwardBadges,
        trackActivity,
        showLevelUp,
        newLevel,
        dismissLevelUp,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
}

export default GamificationContext;
