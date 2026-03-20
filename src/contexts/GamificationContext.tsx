/**
 * GAMIFICATION CONTEXT
 * XP, Levels, Streaks, Daily Rewards, Badges
 * Core gamification system for MinesMinis
 */
/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useGamification + types */
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { errorLogger } from '../services/errorLogger';
import { LS_GAMIFICATION_PREFIX } from '../config/storageKeys';

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
    weekly_xp: number;
    level: number;
    streakDays: number;
    lastLoginDate: string | null;
    lastDailyClaim: string | null;
    lastWeeklyReset: string | null;
    badges: string[];
    wordsLearned: number;
    gamesPlayed: number;
    videosWatched: number;
    worksheetsCompleted: number;
    dailyChallengesCompleted: number;
    mascotId: string;
    created_at?: string;
}

interface GamificationContextType {
    // Stats
    stats: UserStats;
    loading: boolean;

    // XP & Levels
    addXP: (amount: number, reason: string, metadata?: Record<string, unknown>) => Promise<void>;
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
    trackActivity: (type: string, metadata?: Record<string, unknown>) => Promise<void>;

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

export function calculateLevel(xp: number): number {
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

export function getXPForLevel(level: number): number {
    return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, level - 1));
}

export function getTotalXPForLevel(level: number): number {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
    }, [user]);

    const loadStats = async () => {
        if (!user?.uid) return;

        try {
            setLoading(true);

            // 1. Try to load from localStorage first for immediate UI
            const localStatsStr = localStorage.getItem(`${LS_GAMIFICATION_PREFIX}${user.uid}`);
            let initialStats = DEFAULT_STATS;

            if (localStatsStr) {
                try {
                    initialStats = JSON.parse(localStatsStr);
                    // Level must always be derived from XP so Learning Journey and Level Up stay in sync
                    initialStats.level = calculateLevel(initialStats.xp ?? 0);
                    setStats(initialStats);
                    checkDailyClaim(initialStats.lastDailyClaim);
                } catch (e) {
                    errorLogger.log({
                        severity: 'medium',
                        message: `Error parsing local gamification stats: ${e instanceof Error ? e.message : String(e)}`,
                        component: 'GamificationContext',
                    });
                }
            }

            // 2. Fetch from Supabase for source of truth
            // Only select columns that exist in the DB schema
            const { data, error } = await supabase
                .from('users')
                .select('xp, points, streak_days, badges, last_login, settings')
                .eq('id', user.uid)
                .maybeSingle();

            if (data && !error) {
                const settingsObj = (data.settings || {}) as Record<string, unknown>;
                setStats(prev => {
                    const serverStats: UserStats = {
                        ...prev,
                        xp: data.xp || data.points || 0,
                        weekly_xp: (settingsObj.weekly_xp as number) || prev.weekly_xp || 0,
                        level: calculateLevel(data.xp || data.points || 0),
                        streakDays: data.streak_days || 0,
                        badges: data.badges || [],
                        lastLoginDate: data.last_login,
                        lastDailyClaim: (settingsObj.last_daily_claim as string) || prev.lastDailyClaim,
                        lastWeeklyReset: (settingsObj.last_weekly_reset as string) || prev.lastWeeklyReset,
                        mascotId: (settingsObj.mascotId as string) || 'mimi_dragon',
                        // Restore activity counters from server settings (fallback to local)
                        wordsLearned: (settingsObj.wordsLearned as number) ?? prev.wordsLearned ?? 0,
                        gamesPlayed: (settingsObj.gamesPlayed as number) ?? prev.gamesPlayed ?? 0,
                        videosWatched: (settingsObj.videosWatched as number) ?? prev.videosWatched ?? 0,
                        worksheetsCompleted: (settingsObj.worksheetsCompleted as number) ?? prev.worksheetsCompleted ?? 0,
                        dailyChallengesCompleted: (settingsObj.dailyChallengesCompleted as number) ?? prev.dailyChallengesCompleted ?? 0,
                    };

                    // Save the merged result back to local
                    saveStatsLocally(serverStats);
                    checkDailyClaim(serverStats.lastDailyClaim);
                    checkWeeklyReset(serverStats.lastWeeklyReset);

                    return serverStats;
                });
            }
        } catch (error) {
            errorLogger.log({
                severity: 'high',
                message: `Error loading gamification stats: ${error instanceof Error ? error.message : String(error)}`,
                component: 'GamificationContext',
            });
        } finally {
            setLoading(false);
        }
    };

    const saveStatsLocally = (newStats: UserStats) => {
        if (user?.uid) {
            localStorage.setItem(`${LS_GAMIFICATION_PREFIX}${user.uid}`, JSON.stringify(newStats));
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

    const addXP = async (amount: number, reason: string, metadata?: Record<string, unknown>) => {
        const streakBonus = getStreakBonus();
        let totalXP = Math.floor(amount * (1 + streakBonus / 100));

        // Apply Character Power Multipliers
        if (stats.mascotId === 'mimi_dragon') {
            totalXP = Math.floor(totalXP * 1.2); // Mimi: +20% XP on all activities
        }
        if (stats.mascotId === 'nova_fox' && (reason === 'word_learned' || reason === 'word_game')) {
            totalXP *= 2; // Nova: 2x points in word games
        }
        if (stats.mascotId === 'bubbles_octo' && (reason === 'listening' || reason === 'pronunciation')) {
            totalXP *= 2; // Bubbles: 2x points in listening/speaking
        }
        if (stats.mascotId === 'sparky_alien' && (reason === 'grammar' || metadata?.isFastAnswer)) {
            totalXP = Math.floor(totalXP * 1.5); // Sparky: 1.5x in grammar + fast answers
        }

        const newXP = stats.xp + totalXP;
        const newWeeklyXP = stats.weekly_xp + totalXP;
        const oldLevel = stats.level;
        const newLevelValue = calculateLevel(newXP);

        const newStats = {
            ...stats,
            xp: newXP,
            weekly_xp: newWeeklyXP,
            level: newLevelValue,
        };

        setStats(newStats);
        saveStatsLocally(newStats);

        // Level up! Only show when XP actually qualifies (keeps Learning Journey in sync)
        if (newLevelValue > oldLevel && newXP >= getTotalXPForLevel(newLevelValue)) {
            setNewLevel(newLevelValue);
            setShowLevelUp(true);

            // Mimi: bonus XP on level up
            if (stats.mascotId === 'mimi_dragon') {
                setTimeout(() => addXP(20, 'mimi_level_bonus'), 500);
            }
        }

        // Track activity
        await trackActivity('xp_earned', { amount: totalXP, reason, streakBonus });

        // Try to sync with server (XP + weekly_xp via settings JSONB)
        if (user?.uid) {
            try {
                const { data: curr } = await supabase.from('users').select('settings').eq('id', user.uid).maybeSingle();
                const settings = { ...((curr?.settings || {}) as Record<string, unknown>), weekly_xp: newWeeklyXP };
                await supabase
                    .from('users')
                    .update({
                        xp: newXP,
                        points: newXP,
                        settings,
                    })
                    .eq('id', user.uid);
            } catch (error) {
                errorLogger.log({
                    severity: 'high',
                    message: `Error syncing XP: ${error instanceof Error ? error.message : String(error)}`,
                    component: 'GamificationContext.addXP',
                });
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
        if (levelXP <= 0) return 0;
        return Math.min(100, Math.max(0, Math.floor((currentProgress / levelXP) * 100)));
    };

    // ==================== STREAK FUNCTIONS ====================

    const checkWeeklyReset = async (lastResetStr: string | null) => {
        const now = new Date();
        const lastReset = lastResetStr ? new Date(lastResetStr) : new Date(stats.created_at || now);

        // Find the most recent Monday at 00:00
        const mostRecentMonday = new Date(now);
        const day = now.getDay();
        const diff = (day === 0 ? 6 : day - 1); // 0 (Sun) -> 6, 1 (Mon) -> 0, etc.
        mostRecentMonday.setDate(now.getDate() - diff);
        mostRecentMonday.setHours(0, 0, 0, 0);

        if (lastReset < mostRecentMonday) {
            // Weekly reset needed!
            // Weekly reset triggered

            // 1. If user was #1 (we'd need to check the full leaderboard here, 
            // but for simplicity in this context we'll assume a winner check)
            // In a real app, this logic might live in a Supabase Edge Function

            // 2. Reset weekly XP
            const newStats = {
                ...stats,
                weekly_xp: 0,
                lastWeeklyReset: now.toISOString(),
            };
            setStats(newStats);
            saveStatsLocally(newStats);

            // 3. Sync weekly reset via settings JSONB (no dedicated columns)
            if (user?.uid) {
                try {
                    const { data: curr } = await supabase.from('users').select('settings').eq('id', user.uid).maybeSingle();
                    const settings = { ...((curr?.settings || {}) as Record<string, unknown>), weekly_xp: 0, last_weekly_reset: now.toISOString() };
                    await supabase.from('users').update({ settings }).eq('id', user.uid);
                } catch (error) {
                    errorLogger.log({
                        severity: 'medium',
                        message: `Error syncing weekly reset: ${error instanceof Error ? error.message : String(error)}`,
                        component: 'GamificationContext.checkWeeklyReset',
                    });
                }
            }
        }
    };

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
        if (user?.uid) {
            try {
                await supabase
                    .from('users')
                    .update({
                        streak_days: newStreak,
                        last_login: now.toISOString()
                    })
                    .eq('id', user.uid);
            } catch (error) {
                errorLogger.log({
                    severity: 'medium',
                    message: `Error syncing streak: ${error instanceof Error ? error.message : String(error)}`,
                    component: 'GamificationContext.updateStreak',
                });
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

        const dayIndex = stats.streakDays === 0 ? 0 : ((stats.streakDays - 1) % 7);
        const reward = DAILY_REWARDS[dayIndex] ?? DAILY_REWARDS[0];

        const now = new Date();
        const newStats = {
            ...stats,
            lastDailyClaim: now.toISOString(),
        };

        // Update local state first
        setStats(newStats);
        saveStatsLocally(newStats);
        setCanClaimDaily(false);

        // Sync with server
        if (user?.uid) {
            try {
                const { data: curr } = await supabase.from('users').select('settings').eq('id', user.uid).maybeSingle();
                const settings = { ...((curr?.settings || {}) as Record<string, unknown>), last_daily_claim: now.toISOString() };
                await supabase.from('users').update({ settings }).eq('id', user.uid);
            } catch (error) {
                errorLogger.log({
                    severity: 'medium',
                    message: `Error syncing daily claim: ${error instanceof Error ? error.message : String(error)}`,
                    component: 'GamificationContext.claimDailyReward',
                });
            }
        }

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
        if (user?.uid) {
            try {
                await supabase
                    .from('users')
                    .update({ badges: newBadges })
                    .eq('id', user.uid);
            } catch (error) {
                errorLogger.log({
                    severity: 'medium',
                    message: `Error syncing badges: ${error instanceof Error ? error.message : String(error)}`,
                    component: 'GamificationContext.awardBadge',
                });
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

    const trackActivity = async (type: string, metadata?: Record<string, unknown>) => {
        // Activity tracked: type + metadata logged in dev only
        if (import.meta.env.DEV) console.debug(`Tracking activity: ${type}`, metadata);
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

        // Sync activity counters to server via settings JSONB
        if (user?.uid) {
            try {
                const { data: curr } = await supabase.from('users').select('settings').eq('id', user.uid).maybeSingle();
                const settings = {
                    ...((curr?.settings || {}) as Record<string, unknown>),
                    wordsLearned: newStats.wordsLearned,
                    gamesPlayed: newStats.gamesPlayed,
                    videosWatched: newStats.videosWatched,
                    worksheetsCompleted: newStats.worksheetsCompleted,
                    dailyChallengesCompleted: newStats.dailyChallengesCompleted,
                };
                await supabase.from('users').update({ settings }).eq('id', user.uid);
            } catch (error) {
                errorLogger.log({
                    severity: 'medium',
                    message: `Error syncing activity counters: ${error instanceof Error ? error.message : String(error)}`,
                    component: 'GamificationContext.trackActivity',
                });
            }
        }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user and loading state are ready
    }, [user, loading]);

    const value: GamificationContextType = useMemo(() => ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- functions are stable within render; adding them causes infinite loops
    }), [stats, loading, canClaimDaily, showLevelUp, newLevel]);

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
