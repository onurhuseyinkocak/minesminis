/**
 * GAMIFICATION CONTEXT
 * XP, Levels, Streaks, Daily Rewards, Badges
 * Core gamification system for MinesMinis
 */
/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useGamification + types */
import { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { errorLogger } from '../services/errorLogger';
import { withRetry, debounceAsync } from '../utils/retryUtils';
import { logger } from '../utils/logger';
import { LS_GAMIFICATION_PREFIX } from '../config/storageKeys';
import {
    checkAndAwardStreakFreeze,
    consumeStreakFreeze,
} from '../services/dailyLessonService';
import { usePremium } from './PremiumContext';
import { getActiveBoost, activateBoost } from '../components/XPBooster';
import { getSelectedMascotId } from '../services/mascotService';
import { hasNewMascotUnlocked } from '../services/mascotService';
import { logActivityToday } from '../services/habitTracker';
import { addTodayXP, getTodayXP, getDailyGoal } from '../services/psychGamification';

// ============================================================
// TYPES
// ============================================================

export interface Badge {
    id: string;
    name: string;
    nameTr: string;
    description: string;
    descriptionTr: string;
    icon: string;
    category: 'learning' | 'streak' | 'achievement' | 'special' | 'social';
    requirement: number;
    requirementType: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
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
    storiesRead: number;
    dialoguesCompleted: number;
    perfectPronunciationCount: number;
    dailyRewardsClaimed: number;
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
    { id: 'streak_3', name: '3 Day Streak', nameTr: '3 Günlük Seri', description: 'Login 3 days in a row', descriptionTr: '3 gün üst üste giriş yaptın', icon: 'fire', category: 'streak', requirement: 3, requirementType: 'streak', rarity: 'common' },
    { id: 'streak_7', name: 'Week Warrior', nameTr: 'Hafta Savaşçısı', description: 'Login 7 days in a row', descriptionTr: '7 gün üst üste giriş yaptın', icon: 'fire', category: 'streak', requirement: 7, requirementType: 'streak', rarity: 'rare' },
    { id: 'streak_30', name: 'Monthly Master', nameTr: 'Aylık Usta', description: 'Login 30 days in a row', descriptionTr: '30 gün üst üste giriş yaptın', icon: 'fire', category: 'streak', requirement: 30, requirementType: 'streak', rarity: 'epic' },
    { id: 'streak_100', name: 'Century Champion', nameTr: 'Asır Şampiyonu', description: 'Login 100 days in a row', descriptionTr: '100 gün üst üste giriş yaptın', icon: 'fire', category: 'streak', requirement: 100, requirementType: 'streak', rarity: 'legendary' },

    // Learning Badges - Words
    { id: 'words_10', name: 'Word Explorer', nameTr: 'Kelime Kaşifi', description: 'Learn 10 words', descriptionTr: '10 kelime öğrendin', icon: 'book', category: 'learning', requirement: 10, requirementType: 'words', rarity: 'common' },
    { id: 'words_50', name: 'Word Collector', nameTr: 'Kelime Koleksiyoncusu', description: 'Learn 50 words', descriptionTr: '50 kelime öğrendin', icon: 'book', category: 'learning', requirement: 50, requirementType: 'words', rarity: 'rare' },
    { id: 'words_100', name: 'Word Master', nameTr: 'Kelime Ustası', description: 'Learn 100 words', descriptionTr: '100 kelime öğrendin', icon: 'reading', category: 'learning', requirement: 100, requirementType: 'words', rarity: 'epic' },
    { id: 'words_500', name: 'Word Genius', nameTr: 'Kelime Dahisi', description: 'Learn 500 words', descriptionTr: '500 kelime öğrendin', icon: 'library', category: 'learning', requirement: 500, requirementType: 'words', rarity: 'legendary' },

    // Learning Badges - Games
    { id: 'games_5', name: 'Game Starter', nameTr: 'Oyun Başlangıcı', description: 'Play 5 games', descriptionTr: '5 oyun oynadın', icon: 'games', category: 'learning', requirement: 5, requirementType: 'games', rarity: 'common' },
    { id: 'games_25', name: 'Game Player', nameTr: 'Oyuncu', description: 'Play 25 games', descriptionTr: '25 oyun oynadın', icon: 'games', category: 'learning', requirement: 25, requirementType: 'games', rarity: 'rare' },
    { id: 'games_100', name: 'Game Champion', nameTr: 'Oyun Şampiyonu', description: 'Play 100 games', descriptionTr: '100 oyun oynadın', icon: 'trophy', category: 'learning', requirement: 100, requirementType: 'games', rarity: 'epic' },

    // Learning Badges - Videos
    { id: 'videos_5', name: 'Video Viewer', nameTr: 'Video İzleyici', description: 'Watch 5 videos', descriptionTr: '5 video izledin', icon: 'video', category: 'learning', requirement: 5, requirementType: 'videos', rarity: 'common' },
    { id: 'videos_25', name: 'Video Fan', nameTr: 'Video Hayranı', description: 'Watch 25 videos', descriptionTr: '25 video izledin', icon: 'video', category: 'learning', requirement: 25, requirementType: 'videos', rarity: 'rare' },
    { id: 'videos_100', name: 'Video Expert', nameTr: 'Video Uzmanı', description: 'Watch 100 videos', descriptionTr: '100 video izledin', icon: 'video', category: 'learning', requirement: 100, requirementType: 'videos', rarity: 'epic' },

    // Achievement Badges
    { id: 'level_5', name: 'Rising Star', nameTr: 'Yükselen Yıldız', description: 'Reach level 5', descriptionTr: '5. seviyeye ulaştın', icon: 'star', category: 'achievement', requirement: 5, requirementType: 'level', rarity: 'common' },
    { id: 'level_10', name: 'Shining Star', nameTr: 'Parlayan Yıldız', description: 'Reach level 10', descriptionTr: '10. seviyeye ulaştın', icon: 'star', category: 'achievement', requirement: 10, requirementType: 'level', rarity: 'rare' },
    { id: 'level_25', name: 'Superstar', nameTr: 'Süperyıldız', description: 'Reach level 25', descriptionTr: '25. seviyeye ulaştın', icon: 'star', category: 'achievement', requirement: 25, requirementType: 'level', rarity: 'epic' },
    { id: 'level_50', name: 'Legend', nameTr: 'Efsane', description: 'Reach level 50', descriptionTr: '50. seviyeye ulaştın', icon: 'trophy', category: 'achievement', requirement: 50, requirementType: 'level', rarity: 'legendary' },

    // Special Badges
    { id: 'weekly_starter', name: 'Weekly Starter', nameTr: 'Haftalık Başlangıç', description: 'Claim 5 daily rewards', descriptionTr: '5 günlük ödül aldın', icon: 'star', category: 'special', requirement: 5, requirementType: 'daily', rarity: 'common' },
    { id: 'week_champion', name: 'Week Champion', nameTr: 'Hafta Şampiyonu', description: 'Claim 7 daily rewards in a row', descriptionTr: '7 günlük ödülü üst üste aldın', icon: 'trophy', category: 'special', requirement: 7, requirementType: 'daily', rarity: 'rare' },
    { id: 'first_favorite', name: 'First Favorite', nameTr: 'İlk Favori', description: 'Add your first favorite', descriptionTr: 'İlk favorini ekledin', icon: 'heart', category: 'special', requirement: 1, requirementType: 'favorites', rarity: 'common' },
    { id: 'premium_member', name: 'Premium Member', nameTr: 'Premium Üye', description: 'Become a premium member', descriptionTr: 'Premium üye oldun', icon: 'trophy', category: 'special', requirement: 1, requirementType: 'premium', rarity: 'rare' },

    // New Learning Badges
    { id: 'first_story', name: 'Story Starter', nameTr: 'Hikaye Başlangıcı', description: 'Read your first story', descriptionTr: 'İlk hikayeni okudun', icon: 'stories', category: 'learning', requirement: 1, requirementType: 'stories', rarity: 'common' },
    { id: 'story_master', name: 'Story Master', nameTr: 'Hikaye Ustası', description: 'Read 10 stories', descriptionTr: '10 hikaye okudun', icon: 'stories', category: 'learning', requirement: 10, requirementType: 'stories', rarity: 'rare' },
    { id: 'dialogue_star', name: 'Dialogue Star', nameTr: 'Diyalog Yıldızı', description: 'Complete 5 dialogue exercises', descriptionTr: '5 diyalog alıştırması tamamladın', icon: 'mic', category: 'learning', requirement: 5, requirementType: 'dialogues', rarity: 'rare' },
    { id: 'pronunciation_pro', name: 'Pronunciation Pro', nameTr: 'Telaffuz Ustası', description: 'Score 100% on 3 pronunciation exercises', descriptionTr: '3 telaffuz alıştırmasında tam puan aldın', icon: 'mic', category: 'learning', requirement: 3, requirementType: 'perfect_pronunciation', rarity: 'epic' },
    // word_collector_50 and word_collector_100 removed — duplicate of words_50 and words_100

    // New Social Badges
    { id: 'first_friend', name: 'First Friend', nameTr: 'İlk Arkadaş', description: 'Add your first friend', descriptionTr: 'İlk arkadaşını ekledin', icon: 'heart', category: 'social', requirement: 1, requirementType: 'friends', rarity: 'common' },
    { id: 'top_leaderboard', name: 'Top 10', nameTr: 'İlk 10', description: 'Reach top 10 in weekly leaderboard', descriptionTr: 'Haftalık sıralamada ilk 10\'a girdin', icon: 'trophy', category: 'social', requirement: 10, requirementType: 'leaderboard', rarity: 'epic' },

    // New Special Badges
    { id: 'early_bird', name: 'Early Bird', nameTr: 'Erken Kuş', description: 'Complete a lesson before 9am', descriptionTr: 'Sabah 9\'dan önce bir ders tamamladın', icon: 'star', category: 'special', requirement: 1, requirementType: 'early_lesson', rarity: 'rare' },
    { id: 'night_owl', name: 'Night Owl', nameTr: 'Gece Kuşu', description: 'Complete a lesson after 9pm', descriptionTr: 'Gece 9\'dan sonra bir ders tamamladın', icon: 'star', category: 'special', requirement: 1, requirementType: 'night_lesson', rarity: 'rare' },
    { id: 'weekend_warrior', name: 'Weekend Warrior', nameTr: 'Hafta Sonu Savaşçısı', description: 'Complete lessons on both Saturday and Sunday', descriptionTr: 'Hem Cumartesi hem Pazar ders tamamladın', icon: 'trophy', category: 'special', requirement: 2, requirementType: 'weekend_lesson', rarity: 'epic' },
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

/** Returns 'YYYY-MM-DD' in the user's local timezone — timezone-safe streak comparison */
function localDateStr(d: Date = new Date()): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
    return localDateStr(date1) === localDateStr(date2);
}

function isYesterday(date1: Date, date2: Date): boolean {
    const yesterday = new Date(date2);
    yesterday.setDate(yesterday.getDate() - 1);
    return localDateStr(date1) === localDateStr(yesterday);
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
    storiesRead: 0,
    dialoguesCompleted: 0,
    perfectPronunciationCount: 0,
    dailyRewardsClaimed: 0,
    mascotId: getSelectedMascotId(),
};

export function GamificationProvider({ children }: { children: ReactNode }) {
    const { user, userProfile } = useAuth();
    const { isPremium } = usePremium();
    const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(1);
    const [canClaimDaily, setCanClaimDaily] = useState(false);

    // Stable user ID to prevent re-renders when Firebase user object reference changes
    const userId = user?.uid ?? null;

    // Keep a ref to stats so async callbacks never read stale closures
    const statsRef = useRef(stats);
    statsRef.current = stats;

    // Keep a ref to user so async functions always have latest without causing re-runs
    const userRef = useRef(user);
    userRef.current = user;

    // Keep a ref to userProfile so settings writes always preserve existing DB settings
    // (e.g. setup_completed) and never accidentally wipe them.
    const userProfileRef = useRef(userProfile);
    userProfileRef.current = userProfile;

    // Debounced XP sync — prevents a flood of sequential Supabase writes when XP
    // is earned rapidly (e.g. rapid-fire flashcard answers). Fires at most once per 1.5 s.
    const debouncedSyncXP = useRef(
        debounceAsync(async (uid: string, newXP: number, newWeeklyXP: number, currentSettings: Record<string, unknown>) => {
            const settings = { ...currentSettings, weekly_xp: newWeeklyXP };
            await withRetry(() =>
                supabase.from('users').update({ xp: newXP, points: newXP, settings }).eq('id', uid)
            );
        }, 1500),
    ).current;

    // Debounced activity-counter sync — batches rapid trackActivity calls
    const debouncedSyncActivity = useRef(
        debounceAsync(async (uid: string, newStats: UserStats, currentSettings: Record<string, unknown>) => {
            const settings = {
                ...currentSettings,
                wordsLearned: newStats.wordsLearned,
                gamesPlayed: newStats.gamesPlayed,
                videosWatched: newStats.videosWatched,
                worksheetsCompleted: newStats.worksheetsCompleted,
                dailyChallengesCompleted: newStats.dailyChallengesCompleted,
                storiesRead: newStats.storiesRead,
                dialoguesCompleted: newStats.dialoguesCompleted,
                perfectPronunciationCount: newStats.perfectPronunciationCount,
                dailyRewardsClaimed: newStats.dailyRewardsClaimed,
            };
            await withRetry(() =>
                supabase.from('users').update({ settings }).eq('id', uid)
            );
        }, 1500),
    ).current;

    // Load stats from localStorage (works without database)
    useEffect(() => {
        let cancelled = false;

        if (userId) {
            loadStats(cancelled);
        } else {
            setStats(DEFAULT_STATS);
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user ID changes only
    }, [userId]);

    const loadStats = async (cancelled: boolean) => {
        const user = userRef.current;
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
                    if (!cancelled) {
                        setStats(initialStats);
                        checkDailyClaim(initialStats.lastDailyClaim);
                    }
                } catch (e) {
                    errorLogger.log({
                        severity: 'medium',
                        message: `Error parsing local gamification stats: ${e instanceof Error ? e.message : String(e)}`,
                        component: 'GamificationContext',
                    });
                }
            }

            // 2. Fetch from Supabase for source of truth
            // Run both tables in parallel — users (Firebase auth) + profiles (Supabase auth fallback)
            const [{ data, error }, { data: profileData }] = await Promise.all([
                supabase
                    .from('users')
                    .select('xp, points, streak_days, badges, last_login, settings')
                    .eq('id', user.uid)
                    .maybeSingle(),
                supabase
                    .from('profiles')
                    .select('xp, level, streak_days, badges, last_login, words_learned, games_played, videos_watched, worksheets_completed, last_daily_claim')
                    .eq('id', user.uid)
                    .maybeSingle(),
            ]);

            if (cancelled) return;

            // Use profiles as fallback when users row doesn't exist (Supabase-auth users)
            const effectiveData = data ?? (profileData ? {
                xp: profileData.xp ?? 0,
                points: profileData.xp ?? 0,
                streak_days: profileData.streak_days ?? 0,
                badges: profileData.badges ?? [],
                last_login: profileData.last_login ?? null,
                settings: {
                    wordsLearned: profileData.words_learned ?? 0,
                    gamesPlayed: profileData.games_played ?? 0,
                    videosWatched: profileData.videos_watched ?? 0,
                    worksheetsCompleted: profileData.worksheets_completed ?? 0,
                    last_daily_claim: profileData.last_daily_claim ?? null,
                },
            } : null);

            if (effectiveData && !error) {
                const settingsObj = (effectiveData.settings || {}) as Record<string, unknown>;

                // Capture the merged stats OUTSIDE the setStats callback so we can call
                // side-effect functions (checkDailyClaim, checkWeeklyReset) with the correct
                // data instead of the stale statsRef.current they would otherwise read.
                let resolvedServerStats: UserStats | null = null;

                setStats(prev => {
                    const serverXp = effectiveData.xp || effectiveData.points || 0;
                    // Take the higher XP value — prevents overwriting XP earned during the async fetch
                    const mergedXp = Math.max(prev.xp ?? 0, serverXp);
                    const serverStats: UserStats = {
                        ...prev,
                        xp: mergedXp,
                        weekly_xp: Math.max(
                            prev.weekly_xp ?? 0,
                            (settingsObj.weekly_xp as number) || 0,
                        ),
                        level: calculateLevel(mergedXp),
                        streakDays: Math.max(prev.streakDays ?? 0, effectiveData.streak_days || 0),
                        // Merge badges: union of local + server to prevent badge loss on either side
                        badges: [...new Set([...(prev.badges || []), ...(effectiveData.badges || [])])],
                        lastLoginDate: effectiveData.last_login,
                        lastDailyClaim: (settingsObj.last_daily_claim as string) || prev.lastDailyClaim,
                        lastWeeklyReset: (settingsObj.last_weekly_reset as string) || prev.lastWeeklyReset,
                        mascotId: getSelectedMascotId(),
                        // Restore activity counters: take the higher value (local may be ahead of server)
                        wordsLearned: Math.max((settingsObj.wordsLearned as number) ?? 0, prev.wordsLearned ?? 0),
                        gamesPlayed: Math.max((settingsObj.gamesPlayed as number) ?? 0, prev.gamesPlayed ?? 0),
                        videosWatched: Math.max((settingsObj.videosWatched as number) ?? 0, prev.videosWatched ?? 0),
                        worksheetsCompleted: Math.max((settingsObj.worksheetsCompleted as number) ?? 0, prev.worksheetsCompleted ?? 0),
                        dailyChallengesCompleted: Math.max((settingsObj.dailyChallengesCompleted as number) ?? 0, prev.dailyChallengesCompleted ?? 0),
                        storiesRead: Math.max((settingsObj.storiesRead as number) ?? 0, prev.storiesRead ?? 0),
                        dialoguesCompleted: Math.max((settingsObj.dialoguesCompleted as number) ?? 0, prev.dialoguesCompleted ?? 0),
                        perfectPronunciationCount: Math.max((settingsObj.perfectPronunciationCount as number) ?? 0, prev.perfectPronunciationCount ?? 0),
                        dailyRewardsClaimed: Math.max((settingsObj.dailyRewardsClaimed as number) ?? 0, prev.dailyRewardsClaimed ?? 0),
                    };

                    resolvedServerStats = serverStats;
                    // Save the merged result back to local
                    saveStatsLocally(serverStats);
                    return serverStats;
                });

                // Call side effects AFTER setStats with the resolved data — NOT inside
                // the callback where statsRef.current is still stale.
                if (resolvedServerStats && !cancelled) {
                    checkDailyClaim((resolvedServerStats as UserStats).lastDailyClaim);
                    await checkWeeklyReset(resolvedServerStats as UserStats);
                }
            }
        } catch (error) {
            if (cancelled) return;
            errorLogger.log({
                severity: 'high',
                message: `Error loading gamification stats: ${error instanceof Error ? error.message : String(error)}`,
                component: 'GamificationContext',
            });
        } finally {
            if (!cancelled) setLoading(false);
        }
    };

    const saveStatsLocally = (newStats: UserStats) => {
        if (userRef.current?.uid) {
            try {
                localStorage.setItem(`${LS_GAMIFICATION_PREFIX}${userRef.current.uid}`, JSON.stringify(newStats));
            } catch {
                // QuotaExceededError — ignore
            }
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

    const addXP = async (amount: number, reason: string, _metadata?: Record<string, unknown>) => {
        const currentStats = statsRef.current;
        const streakBonus = getStreakBonus();
        let totalXP = Math.floor(amount * (1 + streakBonus / 100));

        // Apply Character Power Multipliers
        if (currentStats.mascotId === 'mimi_cat' || currentStats.mascotId === 'mimi_dragon') {
            totalXP = Math.floor(totalXP * 1.2); // Mimi: +20% XP on all activities
        }

        // Apply active XP boost multiplier
        const activeBoost = getActiveBoost();
        if (activeBoost) {
            totalXP = Math.round(totalXP * activeBoost.multiplier);
        }

        const oldLevel = currentStats.level;
        // Capture final XP for side effects (level-up detection, Supabase sync)
        let capturedNewXP = 0;
        let capturedNewLevel = oldLevel;
        let capturedNewWeeklyXP = 0;

        // Functional update — safe against concurrent addXP calls.
        // Each updater receives the state committed by the previous one, so
        // simultaneous calls (e.g. earnedXp + perfectBonus) accumulate correctly.
        setStats(prev => {
            const newXP = prev.xp + totalXP;
            const newWeeklyXP = (prev.weekly_xp ?? 0) + totalXP;
            const newLevelValue = calculateLevel(newXP);
            capturedNewXP = newXP;
            capturedNewLevel = newLevelValue;
            capturedNewWeeklyXP = newWeeklyXP;
            const newStats = { ...prev, xp: newXP, weekly_xp: newWeeklyXP, level: newLevelValue };
            saveStatsLocally(newStats);
            return newStats;
        });

        // Update today's XP tracker so Daily Goal widget stays in sync
        if (userRef.current?.uid) {
            const xpBefore = getTodayXP(userRef.current.uid);
            addTodayXP(userRef.current.uid, totalXP);
            const xpAfter = xpBefore + totalXP;
            const dailyGoal = getDailyGoal();
            // Daily goal just crossed this addition: award 10 bonus XP once
            if (xpBefore < dailyGoal && xpAfter >= dailyGoal && reason !== 'daily_goal_bonus') {
                toast.success('Günlük hedef tamamlandı! +10 bonus XP', { icon: undefined, duration: 3000 });
                setTimeout(() => addXP(10, 'daily_goal_bonus'), 300);
            }
        }

        // Level up! Only show when XP actually qualifies (keeps Learning Journey in sync)
        if (capturedNewLevel > oldLevel && capturedNewXP >= getTotalXPForLevel(capturedNewLevel)) {
            setNewLevel(capturedNewLevel);
            setShowLevelUp(true);

            // Mimi: bonus XP on level up (skip if this IS the bonus, to prevent recursion)
            if ((currentStats.mascotId === 'mimi_cat' || currentStats.mascotId === 'mimi_dragon') && reason !== 'mimi_level_bonus') {
                setTimeout(() => addXP(20, 'mimi_level_bonus'), 500);
            }

            // Check if a new mascot just unlocked due to level change
            const newlyUnlocked = hasNewMascotUnlocked(
                oldLevel,
                capturedNewLevel,
                currentStats.streakDays,
                currentStats.streakDays,
                currentStats.wordsLearned,
                currentStats.wordsLearned,
            );
            if (newlyUnlocked) {
                toast.success(`Yeni maskot açıldı: ${newlyUnlocked.nameTr}!`, {
                    icon: undefined,
                    duration: 4000,
                });
            }
        }

        // Track activity
        await trackActivity('xp_earned', { amount: totalXP, reason, streakBonus });

        // Debounced XP sync — avoids a separate settings fetch + update on every XP event.
        // The latest XP value wins because the debounce captures the closure at fire time.
        if (userRef.current?.uid) {
            const currentSettings = userProfileRef.current?.settings ?? {};
            debouncedSyncXP(userRef.current.uid, capturedNewXP, capturedNewWeeklyXP, currentSettings);
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

    // Accepts the stats object to evaluate — never reads statsRef.current (which would be
    // stale when called from inside a setStats callback or immediately after setStats).
    const checkWeeklyReset = async (statsToCheck: UserStats) => {
        const now = new Date();
        const lastReset = statsToCheck.lastWeeklyReset
            ? new Date(statsToCheck.lastWeeklyReset)
            : new Date(statsToCheck.created_at || now);

        // Find the most recent Monday at 00:00 local time
        const mostRecentMonday = new Date(now);
        const day = now.getDay();
        const diff = (day === 0 ? 6 : day - 1); // Sun → 6, Mon → 0, Tue → 1, …
        mostRecentMonday.setDate(now.getDate() - diff);
        mostRecentMonday.setHours(0, 0, 0, 0);

        if (lastReset < mostRecentMonday) {
            // Weekly reset needed — spread the CORRECT stats (passed in, not stale ref)
            const newStats: UserStats = {
                ...statsToCheck,
                weekly_xp: 0,
                lastWeeklyReset: now.toISOString(),
            };
            setStats(newStats);
            saveStatsLocally(newStats);

            // Sync via settings JSONB — merge without extra fetch
            if (userRef.current?.uid) {
                const weeklyResetUserId = userRef.current.uid;
                const currentSettings = userProfileRef.current?.settings ?? {};
                const settings = { ...currentSettings, weekly_xp: 0, last_weekly_reset: now.toISOString() };
                withRetry(() =>
                    supabase.from('users').update({ settings }).eq('id', weeklyResetUserId)
                ).catch((error: unknown) => {
                    errorLogger.log({
                        severity: 'medium',
                        message: `Error syncing weekly reset: ${error instanceof Error ? error.message : String(error)}`,
                        component: 'GamificationContext.checkWeeklyReset',
                    });
                });
            }
        }
    };

    const checkStreak = async () => {
        const currentStats = statsRef.current;
        const now = new Date();
        const lastLogin = currentStats.lastLoginDate ? new Date(currentStats.lastLoginDate) : null;

        let newStreak = currentStats.streakDays;
        let streakBroken = false;

        if (!lastLogin) {
            newStreak = 1;
        } else if (isSameDay(lastLogin, now)) {
            // Same day, no change
        } else if (isYesterday(lastLogin, now)) {
            // Consecutive day
            newStreak = currentStats.streakDays + 1;
        } else {
            // Streak broken — try to consume a freeze
            const protected_ = consumeStreakFreeze(userRef.current?.uid);
            if (protected_) {
                // Freeze absorbed the miss: keep existing streak
                newStreak = currentStats.streakDays;
                toast.success(
                    currentStats.streakDays > 1
                        ? `Seri koruması devreye girdi! ${currentStats.streakDays} günlük seriniz korundu.`
                        : 'Seri koruması devreye girdi!',
                    { icon: undefined, duration: 4000 },
                );
            } else {
                newStreak = 1;
                streakBroken = true;
                if (currentStats.streakDays > 1) {
                    toast.error(
                        `${currentStats.streakDays} günlük seriniz sıfırlandı. Bugün dersinizi yapın!`,
                        { icon: undefined, duration: 5000 },
                    );
                }
            }
        }

        // Functional update — prevents clobbering XP/other fields if loadStats or addXP
        // fires in the same batch on mount.
        let capturedStats: UserStats | null = null;
        setStats(prev => {
            const newStats = { ...prev, streakDays: newStreak, lastLoginDate: now.toISOString() };
            capturedStats = newStats;
            saveStatsLocally(newStats);
            return newStats;
        });

        // Log today's activity in the habit tracker (idempotent)
        if (userRef.current?.uid) {
            logActivityToday(userRef.current.uid);
        }

        // Award freeze if streak milestone reached (only on actual increments)
        if (!streakBroken && newStreak !== currentStats.streakDays) {
            const awarded = checkAndAwardStreakFreeze(newStreak, isPremium);
            if (awarded) {
                toast.success('Yeni seri koruması kazandın!', {
                    icon: undefined,
                    duration: 3000,
                });
            }

            // Award 1.5x XP boost for 1 hour at streak milestones 7, 14, 21, 30
            if ([7, 14, 21, 30].includes(newStreak)) {
                activateBoost(1.5, 60 * 60 * 1000, 'streak_milestone');
                // Special celebration toast for major streak milestones
                const milestoneMsg: Record<number, string> = {
                    7:  'Harika! 7 gunluk seri tamamlandi! 1 saatlik 1.5x XP bonusu aktif!',
                    14: 'Mukemmel! 14 gunluk seri! 1 saatlik 1.5x XP bonusu aktif!',
                    21: 'Inanilmaz! 21 gunluk seri! 1 saatlik 1.5x XP bonusu aktif!',
                    30: 'Efsanevi! 30 gunluk seri! 1 saatlik 1.5x XP bonusu aktif!',
                };
                const msg = milestoneMsg[newStreak];
                if (msg) {
                    toast.success(msg, { icon: undefined, duration: 5000 });
                }
            }
        }

        // Sync with server
        if (userRef.current?.uid) {
            const streakUserId = userRef.current.uid;
            try {
                await supabase
                    .from('users')
                    .update({
                        streak_days: newStreak,
                        last_login: now.toISOString()
                    })
                    .eq('id', streakUserId);
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

    const getStreakBonus = useCallback((): number => {
        const s = statsRef.current;
        if (s.streakDays >= 30) return 50;
        if (s.streakDays >= 14) return 30;
        if (s.streakDays >= 7) return 20;
        if (s.streakDays >= 3) return 10;
        return 0;
    }, []);

    // ==================== DAILY REWARD FUNCTIONS ====================

    const claimDailyReward = async (): Promise<DailyReward | null> => {
        if (!canClaimDaily) return null;

        // Server-side idempotency guard — prevents multi-tab race conditions and
        // stale-client state (e.g. user refreshes before previous Supabase write lands).
        // Checks both tables: users (Firebase auth) and profiles (Supabase auth fallback).
        if (userRef.current?.uid) {
            const [{ data: serverRow }, { data: profileRow }] = await Promise.all([
                supabase.from('users').select('settings').eq('id', userRef.current.uid).maybeSingle(),
                supabase.from('profiles').select('last_daily_claim').eq('id', userRef.current.uid).maybeSingle(),
            ]);
            const serverLastClaim = (serverRow?.settings as Record<string, unknown>)?.last_daily_claim as string | undefined;
            const profileLastClaim = profileRow?.last_daily_claim ?? undefined;
            const effectiveLastClaim = serverLastClaim ?? profileLastClaim;
            if (effectiveLastClaim && isSameDay(new Date(effectiveLastClaim), new Date())) {
                // Already claimed today on the server — sync local state and bail
                setCanClaimDaily(false);
                return null;
            }
        }

        const currentStats = statsRef.current;
        const dayIndex = currentStats.streakDays === 0 ? 0 : ((currentStats.streakDays - 1) % 7);
        const reward = DAILY_REWARDS[dayIndex] ?? DAILY_REWARDS[0];

        const claimTimestamp = new Date().toISOString();

        // Block UI immediately (prevents double-click while awaits run)
        setCanClaimDaily(false);

        // Write claim timestamp to server BEFORE XP operations so any concurrent
        // requests also see the claim is taken.
        // Write to BOTH tables in parallel — one of them will be the authoritative row
        // depending on whether this is a Firebase-auth user (users table) or
        // Supabase-auth user (profiles table). Supabase UPDATE is a no-op for non-existent rows.
        if (userRef.current?.uid) {
            const dailyClaimUserId = userRef.current.uid;
            const currentSettings = userProfileRef.current?.settings ?? {};
            const settings = { ...currentSettings, last_daily_claim: claimTimestamp };
            Promise.all([
                withRetry(() => supabase.from('users').update({ settings }).eq('id', dailyClaimUserId)),
                withRetry(() => supabase.from('profiles').update({ last_daily_claim: claimTimestamp }).eq('id', dailyClaimUserId)),
            ]).catch((error: unknown) => {
                errorLogger.log({
                    severity: 'medium',
                    message: `Error syncing daily claim: ${error instanceof Error ? error.message : String(error)}`,
                    component: 'GamificationContext.claimDailyReward',
                });
            });
        }

        // Add XP — note: addXP reads statsRef.current (may be stale for lastDailyClaim).
        // We re-apply lastDailyClaim below via functional update after all operations.
        await addXP(reward.xp, 'daily_reward');

        // Track daily reward claim count (used by weekly_starter / week_champion badges)
        await trackActivity('daily_reward_claimed');

        // Award badge if included
        if (reward.badge && !currentStats.badges.includes(reward.badge)) {
            await awardBadge(reward.badge);
        }

        // Re-apply lastDailyClaim with a functional update so that the stale-state
        // spread inside addXP/trackActivity cannot overwrite it.
        // This is the authoritative local write for the claim timestamp.
        setStats(prev => {
            const patched = { ...prev, lastDailyClaim: claimTimestamp };
            saveStatsLocally(patched);
            return patched;
        });

        return reward;
    };

    const getNextClaimTime = (): Date | null => {
        const currentStats = statsRef.current;
        if (!currentStats.lastDailyClaim) return null;

        const lastClaim = new Date(currentStats.lastDailyClaim);
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
        return statsRef.current.badges.includes(badgeId);
    };

    const awardBadge = async (badgeId: string) => {
        if (hasBadge(badgeId)) return;

        // Pre-compute newBadges synchronously from the current ref so Supabase sync below
        // can use it before React has flushed the updater.
        const newBadges = [...statsRef.current.badges, badgeId];

        // Functional update — merges badge into whatever is the current committed state,
        // preventing the badge list from reverting if another update is batched concurrently.
        setStats(prev => {
            if (prev.badges.includes(badgeId)) return prev; // double-check inside updater
            const merged = [...prev.badges, badgeId];
            const newStats = { ...prev, badges: merged };
            saveStatsLocally(newStats);
            return newStats;
        });

        // Notify the user — never award a badge silently
        const badgeDef = ALL_BADGES.find(b => b.id === badgeId);
        if (badgeDef) {
            toast.success(
                `${badgeDef.nameTr} rozeti kazanildi!`,
                { duration: 4000 }
            );
        }

        // Sync with server
        if (userRef.current?.uid) {
            const badgeUserId = userRef.current.uid;
            try {
                await supabase
                    .from('users')
                    .update({ badges: newBadges })
                    .eq('id', badgeUserId);
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
        const currentStats = statsRef.current;
        const newBadges: string[] = [];

        for (const badge of ALL_BADGES) {
            if (hasBadge(badge.id)) continue;

            let earned = false;

            switch (badge.requirementType) {
                case 'streak':
                    earned = currentStats.streakDays >= badge.requirement;
                    break;
                case 'words':
                    earned = currentStats.wordsLearned >= badge.requirement;
                    break;
                case 'games':
                    earned = currentStats.gamesPlayed >= badge.requirement;
                    break;
                case 'videos':
                    earned = currentStats.videosWatched >= badge.requirement;
                    break;
                case 'level':
                    earned = currentStats.level >= badge.requirement;
                    break;
                case 'stories':
                    earned = (currentStats.storiesRead ?? 0) >= badge.requirement;
                    break;
                case 'dialogues':
                    earned = (currentStats.dialoguesCompleted ?? 0) >= badge.requirement;
                    break;
                case 'perfect_pronunciation':
                    earned = (currentStats.perfectPronunciationCount ?? 0) >= badge.requirement;
                    break;
                case 'daily':
                    // weekly_starter: 5 claims, week_champion: 7 claims
                    earned = (currentStats.dailyRewardsClaimed ?? 0) >= badge.requirement;
                    break;
                // Time-sensitive and social badges are awarded via direct awardBadge() calls
                // from their respective trigger sites (lesson completion, friend add, etc.)
                // They cannot be evaluated retroactively from stats alone.
                case 'early_lesson':
                case 'night_lesson':
                case 'weekend_lesson':
                case 'friends':
                case 'leaderboard':
                case 'favorites':
                case 'premium':
                    // These are triggered externally — skip automated check
                    earned = false;
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
        logger.debug(`Tracking activity: ${type}`, metadata);

        // lesson_completed_timed: handle async badge checks BEFORE the state update
        // (needs hasBadge at trigger time; cannot run inside a pure updater function)
        if (type === 'lesson_completed_timed') {
            const now = new Date();
            const hour = now.getHours();
            const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat

            if (hour < 9 && !hasBadge('early_bird')) {
                await awardBadge('early_bird');
            }
            if (hour >= 21 && !hasBadge('night_owl')) {
                await awardBadge('night_owl');
            }

            // Weekend warrior: track which weekend days completed this week.
            // Use Monday-anchored week key so Sat and Sun always share the same key.
            const mondayOffset = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - mondayOffset);
            weekStart.setHours(0, 0, 0, 0);
            const weekKey = `mm_weekend_warrior_${weekStart.getFullYear()}_${weekStart.getMonth()}_${weekStart.getDate()}`;
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                const stored = localStorage.getItem(weekKey) || '';
                const daysSet = new Set(stored.split(',').filter(Boolean));
                daysSet.add(String(dayOfWeek));
                try { localStorage.setItem(weekKey, [...daysSet].join(',')); } catch { /* ignore */ }
                if (daysSet.has('0') && daysSet.has('6') && !hasBadge('weekend_warrior')) {
                    await awardBadge('weekend_warrior');
                }
            }
        }

        // Functional update — safe against concurrent calls (e.g. addXP + trackActivity batched
        // in the same React tick). Using prev instead of statsRef.current prevents stale spreads
        // from overwriting XP or other fields set by addXP's updater.
        let capturedNewStats: UserStats | null = null;
        setStats(prev => {
            const newStats = { ...prev };
            switch (type) {
                case 'word_learned':
                    newStats.wordsLearned = (prev.wordsLearned || 0) + 1;
                    break;
                case 'game_played':
                    newStats.gamesPlayed = (prev.gamesPlayed || 0) + 1;
                    break;
                case 'video_watched':
                    newStats.videosWatched = (prev.videosWatched || 0) + 1;
                    break;
                case 'worksheet_completed':
                    newStats.worksheetsCompleted = (prev.worksheetsCompleted || 0) + 1;
                    break;
                case 'daily_challenge':
                    newStats.dailyChallengesCompleted = (prev.dailyChallengesCompleted || 0) + 1;
                    break;
                case 'story_read':
                    newStats.storiesRead = (prev.storiesRead || 0) + 1;
                    break;
                case 'dialogue_completed':
                    newStats.dialoguesCompleted = (prev.dialoguesCompleted || 0) + 1;
                    break;
                case 'perfect_pronunciation':
                    newStats.perfectPronunciationCount = (prev.perfectPronunciationCount || 0) + 1;
                    break;
                case 'daily_reward_claimed':
                    newStats.dailyRewardsClaimed = (prev.dailyRewardsClaimed || 0) + 1;
                    break;
                // All other types (xp_earned, lesson_completed_timed, etc.): no counter change
            }
            capturedNewStats = newStats;
            saveStatsLocally(newStats);
            return newStats;
        });

        // Debounced activity-counter sync — batches rapid writes into a single Supabase call
        if (userRef.current?.uid && capturedNewStats) {
            const currentSettings = userProfileRef.current?.settings ?? {};
            debouncedSyncActivity(userRef.current.uid, capturedNewStats as UserStats, currentSettings);
        }

        // Check for new badges
        await checkAndAwardBadges();
    };

    // ==================== LEVEL UP MODAL ====================

    const dismissLevelUp = () => {
        setShowLevelUp(false);
    };

    // Check streak on mount (use stable userId to avoid re-runs from user object ref changes)
    useEffect(() => {
        let cancelled = false;
        if (userId && !loading) {
            // Wrap in async IIFE with cancellation guard
            (async () => {
                try {
                    await checkStreak();
                } catch {
                    // Error already logged inside checkStreak
                }
                if (cancelled) return;
            })();
        }
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user ID and loading state are ready
    }, [userId, loading]);

    // Award premium_member badge when user becomes premium
    useEffect(() => {
        if (isPremium && userId && !loading && !hasBadge('premium_member')) {
            awardBadge('premium_member').catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-run when premium status or user changes
    }, [isPremium, userId, loading]);

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
