/**
 * WEEKLY TOURNAMENT BANNER
 * Compact dashboard strip showing tournament countdown, rank, and tier.
 * Navigates to /leaderboard on click. Only shown when user has weekly XP.
 * MinesMinis — zero any-types, zero console.log
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';
import { useAuth } from '../contexts/AuthContext';
import {
    getUserTier,
    getTimeUntilReset,
    getGlobalLeaderboard,
    type LeaderboardEntry,
} from '../services/leaderboardService';
import './WeeklyTournamentBanner.css';

// ============================================================
// HELPERS
// ============================================================

function formatCountdown(): string {
    const { days, hours, minutes } = getTimeUntilReset();
    if (days > 0) return `${days}g ${hours}s`;
    if (hours > 0) return `${hours}s ${minutes}d`;
    return `${minutes}d`;
}

// ============================================================
// INNER COMPONENT (rendered only when weeklyXP > 0)
// ============================================================

interface BannerContentProps {
    weeklyXP: number;
    userId: string | undefined;
}

function BannerContent({ weeklyXP, userId }: BannerContentProps) {
    const navigate = useNavigate();
    const tier = getUserTier(weeklyXP);

    const [countdown, setCountdown] = useState(formatCountdown);
    const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);

    useEffect(() => {
        const tick = () => setCountdown(formatCountdown());
        tick();
        const timer = setInterval(tick, 60_000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;
        getGlobalLeaderboard(userId).then((entries) => {
            if (!cancelled) {
                const found = entries.find((e) => e.isCurrentUser) ?? null;
                setUserEntry(found);
            }
        }).catch(() => {
            // silent — banner is non-critical
        });

        return () => { cancelled = true; };
    }, [userId]);

    const handleClick = () => {
        navigate('/leaderboard');
    };

    return (
        <button
            type="button"
            className="tournament-banner"
            onClick={handleClick}
            aria-label="Haftalık turnuvayı görüntüle"
        >
            {/* Tier badge */}
            <div
                className="tournament-tier"
                style={{ '--tier-color': tier.color } as React.CSSProperties}
            >
                <span className="tournament-tier-icon">{tier.icon}</span>
                <span className="tournament-tier-name">{tier.nameTr}</span>
            </div>

            {/* Rank + label */}
            <div className="tournament-info">
                <span className="tournament-title">Haftalık Turnuva</span>
                {userEntry && (
                    <span className="tournament-rank">#{userEntry.rank} sırada</span>
                )}
            </div>

            {/* Countdown */}
            <div className="tournament-countdown">
                <Clock size={13} />
                <span>Bitiyor: {countdown}</span>
            </div>

            <ChevronRight size={16} className="tournament-chevron" />
        </button>
    );
}

// ============================================================
// OUTER COMPONENT (guard: only render when weeklyXP > 0)
// ============================================================

const WeeklyTournamentBanner: React.FC = () => {
    const { stats } = useGamification();
    const { user } = useAuth();
    const weeklyXP = stats.weekly_xp ?? 0;

    if (weeklyXP === 0) return null;

    return <BannerContent weeklyXP={weeklyXP} userId={user?.uid} />;
};

export default WeeklyTournamentBanner;
