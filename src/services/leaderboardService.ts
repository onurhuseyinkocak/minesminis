/**
 * LEADERBOARD SERVICE
 * Weekly tournament system: tiers, rankings, reset timers
 * MinesMinis — zero any-types, zero console.log
 */

import { supabase } from '../config/supabase';
import { errorLogger } from './errorLogger';
import { withRetry } from '../utils/retryUtils';

// ============================================================
// TYPES
// ============================================================

export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    avatarInitial: string;
    weeklyXP: number;
    totalXP: number;
    streak: number;
    level: number;
    rank: number;
    isCurrentUser: boolean;
}

export interface LeaderboardTier {
    name: string;
    nameTr: string;
    minXP: number;
    color: string;
    icon: string;
}

// ============================================================
// CONSTANTS
// ============================================================

export const LEADERBOARD_TIERS: LeaderboardTier[] = [
    { name: 'Diamond', nameTr: 'Elmas',  minXP: 500, color: 'var(--info, #3b82f6)',        icon: 'D' },
    { name: 'Gold',    nameTr: 'Altın',  minXP: 200, color: 'var(--warning, #f59e0b)',      icon: 'G' },
    { name: 'Silver',  nameTr: 'Gümüş', minXP: 100, color: 'var(--secondary, #6b7280)',    icon: 'S' },
    { name: 'Bronze',  nameTr: 'Bronz',  minXP: 0,   color: 'var(--accent-muted, #92400e)', icon: 'B' },
];

const NEW_WEEK_KEY = 'mm_leaderboard_last_week_check';

// ============================================================
// SUPABASE ROW TYPE (columns we actually select)
// ============================================================

interface UserRow {
    id: string;
    display_name: string;
    avatar_url: string | null;
    level: number;
    xp: number;
    streak_days: number;
    settings: Record<string, unknown> | null;
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Fetch global leaderboard (top 50 by weekly_xp from settings JSONB).
 * Weekly XP is stored in users.settings.weekly_xp because the DB column
 * weekly_xp is synced lazily — we read from the column first, then fall
 * back to settings JSONB so we always have a number.
 */
export async function getGlobalLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
    try {
        // Fetch top 100 by XP — client re-sorts by weekly_xp from settings JSONB.
        // Keeping under 100 prevents full-table scans while covering all tier groups.
        const { data, error } = await withRetry(() =>
            supabase
                .from('users')
                .select('id, display_name, avatar_url, level, xp, streak_days, settings')
                .order('xp', { ascending: false })
                .limit(100)
        );

        if (error) throw error;
        if (!data) return [];

        const rows = data as UserRow[];

        const entries: LeaderboardEntry[] = rows.map((row, index) => {
            const settingsObj: Record<string, unknown> = row.settings ?? {};
            const weeklyXP =
                typeof settingsObj.weekly_xp === 'number' ? settingsObj.weekly_xp : 0;

            return {
                userId: row.id,
                displayName: row.display_name || 'Anonymous',
                avatarInitial: (row.display_name?.[0] ?? '?').toUpperCase(),
                weeklyXP,
                totalXP: row.xp ?? 0,
                streak: row.streak_days ?? 0,
                level: row.level ?? 1,
                rank: index + 1,
                isCurrentUser: row.id === currentUserId,
            };
        });

        // Re-sort by weeklyXP for the actual tournament ranking
        entries.sort((a, b) => b.weeklyXP - a.weeklyXP);

        // Re-assign rank after weekly-XP sort
        entries.forEach((entry, i) => {
            entry.rank = i + 1;
        });

        return entries;
    } catch (err) {
        errorLogger.log({
            severity: 'high',
            message: `Error fetching leaderboard: ${err instanceof Error ? err.message : String(err)}`,
            component: 'leaderboardService.getGlobalLeaderboard',
        });
        return [];
    }
}

/**
 * Returns the tier the user belongs to based on their weekly XP.
 */
export function getUserTier(weeklyXP: number): LeaderboardTier {
    for (const tier of LEADERBOARD_TIERS) {
        if (weeklyXP >= tier.minXP) return tier;
    }
    return LEADERBOARD_TIERS[LEADERBOARD_TIERS.length - 1];
}

/**
 * Returns the user's 1-based rank within their tier across all entries.
 */
export function getRankInTier(
    entry: LeaderboardEntry,
    allEntries: LeaderboardEntry[],
): number {
    const tier = getUserTier(entry.weeklyXP);
    const tierEntries = allEntries
        .filter((e) => getUserTier(e.weeklyXP).name === tier.name)
        .sort((a, b) => b.weeklyXP - a.weeklyXP);

    const idx = tierEntries.findIndex((e) => e.userId === entry.userId);
    return idx === -1 ? tierEntries.length + 1 : idx + 1;
}

/**
 * Returns true if we've entered a new ISO week since the last time this
 * function was called (i.e., it persists its last-check week number).
 */
export function isNewWeek(): boolean {
    const getISOWeek = (d: Date): string => {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(
            ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
        );
        return `${date.getUTCFullYear()}-W${weekNo}`;
    };

    const currentWeek = getISOWeek(new Date());
    const lastChecked = localStorage.getItem(NEW_WEEK_KEY);

    if (lastChecked !== currentWeek) {
        localStorage.setItem(NEW_WEEK_KEY, currentWeek);
        return lastChecked !== null; // true only if there was a previous week stored
    }

    return false;
}

/**
 * Returns days/hours/minutes until next Monday 00:00 UTC.
 */
export function getTimeUntilReset(): { days: number; hours: number; minutes: number } {
    const now = new Date();
    const nextMonday = new Date();
    const day = now.getDay(); // 0=Sun…6=Sat
    const daysUntilMonday = day === 0 ? 1 : 8 - day;
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);

    const totalSeconds = Math.max(
        0,
        Math.floor((nextMonday.getTime() - now.getTime()) / 1000),
    );
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return { days, hours, minutes };
}

/**
 * Returns the next tier above the given tier, or null if already Diamond.
 */
export function getNextTier(tier: LeaderboardTier): LeaderboardTier | null {
    const idx = LEADERBOARD_TIERS.findIndex((t) => t.name === tier.name);
    if (idx <= 0) return null;
    return LEADERBOARD_TIERS[idx - 1];
}
