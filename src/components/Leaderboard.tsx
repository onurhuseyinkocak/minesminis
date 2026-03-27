/**
 * LEADERBOARD
 * Weekly tournament view: tier badge, countdown, podium, ranked list,
 * current-user sticky highlight, promotion hint.
 * MinesMinis — zero any-types, zero console.log
 */
import React, { useState, useEffect, useCallback } from 'react';
import './Leaderboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Trophy, Crown, Star, Clock } from 'lucide-react';
import { errorLogger } from '../services/errorLogger';
import {
    getGlobalLeaderboard,
    getUserTier,
    getNextTier,
    getTimeUntilReset,
    type LeaderboardEntry,
} from '../services/leaderboardService';

// ============================================================
// HELPERS
// ============================================================

function formatReset(lang: string): string {
    const { days, hours, minutes } = getTimeUntilReset();
    if (lang === 'tr') {
        if (days > 0) return `${days}g ${hours}s`;
        if (hours > 0) return `${hours}s ${minutes}d`;
        return `${minutes}d`;
    }
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// ============================================================
// PODIUM
// ============================================================

interface PodiumProps {
    entries: LeaderboardEntry[];
    currentUserId: string | undefined;
}

function Podium({ entries, currentUserId }: PodiumProps) {
    const [first, second, third] = entries;
    if (!first) return null;

    const renderSpot = (entry: LeaderboardEntry | undefined, position: 1 | 2 | 3) => {
        if (!entry) {
            return (
                <div className={`podium-spot podium-pos-${position}`}>
                    <div className="podium-avatar podium-avatar--empty">?</div>
                    <div className="podium-bar" />
                </div>
            );
        }
        const isMe = entry.userId === currentUserId;
        return (
            <div className={`podium-spot podium-pos-${position}${isMe ? ' podium-is-me' : ''}`}>
                {position === 1 && <Crown className="podium-crown" size={18} />}
                <div className="podium-avatar">
                    {entry.avatarInitial}
                </div>
                <div className="podium-name">{entry.displayName}</div>
                <div className="podium-xp">{entry.weeklyXP} XP</div>
                <div className="podium-bar">
                    <span className="podium-rank">#{position}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="podium-container">
            {renderSpot(second, 2)}
            {renderSpot(first, 1)}
            {renderSpot(third, 3)}
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

const Leaderboard: React.FC = () => {
    const { user } = useAuth();
    const { stats } = useGamification();
    const { lang } = useLanguage();

    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(() => formatReset(lang));

    const currentUserId = user?.uid;
    const weeklyXP = stats.weekly_xp ?? 0;
    const tier = getUserTier(weeklyXP);
    const nextTier = getNextTier(tier);

    const xpToNextTier = nextTier ? nextTier.minXP - weeklyXP : 0;

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getGlobalLeaderboard(currentUserId);
            setEntries(data);
        } catch (err) {
            errorLogger.log({
                severity: 'high',
                message: `Leaderboard fetch error: ${err instanceof Error ? err.message : String(err)}`,
                component: 'Leaderboard',
            });
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    useEffect(() => {
        const tick = () => setTimeLeft(formatReset(lang));
        tick();
        const timer = setInterval(tick, 60_000);
        return () => clearInterval(timer);
    }, [lang]);

    const podiumEntries = entries.slice(0, 3);
    const listEntries = entries.slice(3);
    const currentUserEntry = entries.find((e) => e.isCurrentUser);
    const currentUserInList = listEntries.some((e) => e.isCurrentUser);

    return (
        <div className="leaderboard-premium">

            {/* ---- Header ---- */}
            <div className="leader-header">
                <div className="header-title">
                    <Trophy className="trophy-gold" size={24} />
                    <h3>{lang === 'tr' ? 'Haftalık ' : 'Weekly '}<span>{lang === 'tr' ? 'Meydan Okuma' : 'Challenge'}</span></h3>
                </div>
                <div className="prize-pill">
                    <Crown size={14} />
                    <span>{lang === 'tr' ? 'PREMIUM KAZAN' : 'WIN PREMIUM'}</span>
                </div>
            </div>

            {/* ---- Tier Badge ---- */}
            <div className="tier-badge-row">
                <div
                    className="tier-badge"
                    style={{ '--tier-color': tier.color } as React.CSSProperties}
                >
                    <span className="tier-icon">{tier.icon}</span>
                    <span className="tier-name">{lang === 'tr' ? tier.nameTr : tier.name}</span>
                </div>
                <div className="reset-timer">
                    <Clock size={13} />
                    <span>{lang === 'tr' ? `Yeni hafta: ${timeLeft}` : `Resets in: ${timeLeft}`}</span>
                </div>
            </div>

            {/* ---- Promotion hint ---- */}
            {nextTier && weeklyXP > 0 && (
                <div className="promotion-hint">
                    <Star size={13} />
                    {lang === 'tr' ? (
                        <span>
                            Bu hafta{' '}
                            <strong>{xpToNextTier} XP</strong> daha kazan ve{' '}
                            <strong>{nextTier.nameTr}</strong>&apos;a yüksel!
                        </span>
                    ) : (
                        <span>
                            Earn <strong>{xpToNextTier} XP</strong> more this week to reach{' '}
                            <strong>{nextTier.name}</strong>!
                        </span>
                    )}
                </div>
            )}

            {/* ---- Content ---- */}
            {loading ? (
                <div className="loading-state">{lang === 'tr' ? 'Yıldızlar aranıyor...' : 'Finding the stars...'}</div>
            ) : entries.length === 0 ? (
                <div className="empty-state">
                    <Star className="star-bounce" size={32} />
                    <p>{lang === 'tr' ? 'Bu hafta henüz şampiyon yok. İlk sen ol!' : 'No champions yet this week. Be the first!'}</p>
                </div>
            ) : (
                <>
                    {/* ---- Podium (top 3) ---- */}
                    <Podium entries={podiumEntries} currentUserId={currentUserId} />

                    {/* ---- Ranked list (4-50) ---- */}
                    {listEntries.length > 0 && (
                        <div className="leader-list">
                            {listEntries.map((entry) => (
                                <div
                                    key={entry.userId}
                                    className={`leader-row${entry.isCurrentUser ? ' is-me' : ''}`}
                                >
                                    <div className="rank-badge">{entry.rank}</div>
                                    <div className="avatar-mini">
                                        <div className="avatar-placeholder">{entry.avatarInitial}</div>
                                    </div>
                                    <div className="leader-name-group">
                                        <span className="leader-name">{entry.displayName}</span>
                                        <span className="leader-lvl">{lang === 'tr' ? 'Seviye' : 'Level'} {entry.level}</span>
                                    </div>
                                    <div className="leader-xp">
                                        <strong>{entry.weeklyXP}</strong>
                                        <span>XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ---- Current user sticky row (when not in list) ---- */}
                    {currentUserEntry && !currentUserInList && (
                        <div className="current-user-sticky">
                            <div className="leader-row is-me">
                                <div className="rank-badge">{currentUserEntry.rank}</div>
                                <div className="avatar-mini">
                                    <div className="avatar-placeholder">{currentUserEntry.avatarInitial}</div>
                                </div>
                                <div className="leader-name-group">
                                    <span className="leader-name">{currentUserEntry.displayName}</span>
                                    <span className="leader-lvl">{lang === 'tr' ? 'Seviye' : 'Level'} {currentUserEntry.level}</span>
                                </div>
                                <div className="leader-xp">
                                    <strong>{currentUserEntry.weeklyXP}</strong>
                                    <span>XP</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Leaderboard;
