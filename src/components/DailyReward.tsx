/**
 * DAILY REWARD COMPONENT
 * Daily login rewards with streak tracking
 */

import React, { useState, useEffect } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import './DailyReward.css';

const DailyReward: React.FC = () => {
    const {
        stats,
        canClaimDaily,
        claimDailyReward,
        getDailyRewardForDay,
        getNextClaimTime
    } = useGamification();

    const [isOpen, setIsOpen] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; badge?: string } | null>(null);
    const [countdown, setCountdown] = useState('');

    // Auto-open when daily reward is available
    useEffect(() => {
        if (canClaimDaily && !claimed) {
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [canClaimDaily, claimed]);

    // Countdown timer
    useEffect(() => {
        if (!canClaimDaily) {
            const updateCountdown = () => {
                const nextClaim = getNextClaimTime();
                if (!nextClaim) return;

                const now = new Date();
                const diff = nextClaim.getTime() - now.getTime();

                if (diff <= 0) {
                    setCountdown('Available now!');
                    return;
                }

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);
            return () => clearInterval(interval);
        }
    }, [canClaimDaily, getNextClaimTime]);

    const handleClaim = async () => {
        if (!canClaimDaily || claiming) return;

        setClaiming(true);
        const reward = await claimDailyReward();

        if (reward) {
            setClaimedReward(reward);
            setClaimed(true);
        }

        setClaiming(false);
    };

    if (!isOpen) {
        return (
            <button
                className={`daily-reward-trigger ${canClaimDaily ? 'available' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <span className="trigger-icon">🎁</span>
                {canClaimDaily && <span className="trigger-badge">!</span>}
            </button>
        );
    }

    const currentDay = (stats.streakDays % 7) || 7;

    return (
        <div className="daily-reward-overlay" onClick={() => setIsOpen(false)}>
            <div className="daily-reward-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>

                <div className="modal-header">
                    <h2>🎁 Daily Rewards</h2>
                    <p>Come back every day for amazing rewards!</p>
                </div>

                <div className="rewards-grid">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const reward = getDailyRewardForDay(day);
                        const isPast = day < currentDay;
                        const isCurrent = day === currentDay;
                        const isFuture = day > currentDay;

                        return (
                            <div
                                key={day}
                                className={`reward-day ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''} ${reward.special ? 'special' : ''}`}
                            >
                                <div className="day-label">Day {day}</div>
                                <div className="reward-icon">
                                    {isPast ? '✅' : reward.special ? '🌟' : '🎁'}
                                </div>
                                <div className="reward-xp">{reward.xp} XP</div>
                                {reward.badge && (
                                    <div className="reward-badge">+🏅</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {claimed && claimedReward ? (
                    <div className="claimed-section">
                        <div className="claimed-animation">
                            <span className="claimed-icon">🎉</span>
                            <h3>Reward Claimed!</h3>
                            <p className="claimed-xp">+{claimedReward.xp} XP</p>
                            {claimedReward.badge && (
                                <p className="claimed-badge">New Badge Unlocked! 🏅</p>
                            )}
                        </div>
                    </div>
                ) : canClaimDaily ? (
                    <button
                        className="claim-btn"
                        onClick={handleClaim}
                        disabled={claiming}
                    >
                        {claiming ? (
                            <span className="claiming">Claiming...</span>
                        ) : (
                            <>
                                <span>Claim Today's Reward</span>
                                <span className="claim-emoji">🎁</span>
                            </>
                        )}
                    </button>
                ) : (
                    <div className="next-reward">
                        <p>Next reward in:</p>
                        <div className="countdown">{countdown}</div>
                    </div>
                )}

                <div className="streak-display">
                    <span className="streak-fire">🔥</span>
                    <span className="streak-text">{stats.streakDays} Day Streak</span>
                </div>
            </div>
        </div>
    );
};

export default DailyReward;
