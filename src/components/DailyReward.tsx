/**
 * DAILY REWARD COMPONENT
 * Daily login rewards with streak tracking
 */

import React, { useState, useEffect } from 'react';
import './DailyReward.css';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ConfettiRain, FloatingEmoji } from './ui/Celebrations';
import { SFX } from '../data/soundLibrary';
import { Gift, CheckCircle, Star, Sparkles, Flame, X } from 'lucide-react';

const DailyReward: React.FC = () => {
    const {
        stats,
        canClaimDaily,
        claimDailyReward,
        getDailyRewardForDay,
        getNextClaimTime
    } = useGamification();
    const { t } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; badge?: string } | null>(null);
    const [countdown, setCountdown] = useState('');
    const [showCountdown, setShowCountdown] = useState(false);
    const [showClaimCelebration, setShowClaimCelebration] = useState(false);

    // Initial countdown visibility
    useEffect(() => {
        if (!canClaimDaily && claimedReward === null) {
            setShowCountdown(true);
        }
    }, [canClaimDaily, claimedReward]);

    // Delay countdown after claim
    useEffect(() => {
        if (claimed) {
            const timer = setTimeout(() => setShowCountdown(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [claimed]);

    // Auto-open only once per day when daily reward is available
    useEffect(() => {
        if (!canClaimDaily || claimed) return;
        const today = new Date().toDateString();
        const shownKey = `minesminis_daily_shown_${today}`;
        if (sessionStorage.getItem(shownKey)) return;
        const timer = setTimeout(() => {
            sessionStorage.setItem(shownKey, '1');
            setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
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

    const celebrationTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup celebration timer on unmount
    React.useEffect(() => {
        return () => {
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
        };
    }, []);

    const handleClaim = async () => {
        if (!canClaimDaily || claiming) return;

        setClaiming(true);
        const reward = await claimDailyReward();

        if (reward) {
            setClaimedReward(reward);
            setClaimed(true);
            setShowClaimCelebration(true);
            SFX.celebration();
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
            celebrationTimerRef.current = setTimeout(() => setShowClaimCelebration(false), 3000);
        }

        setClaiming(false);
    };

    if (!isOpen) {
        return (
            <button
                className={`daily-reward-trigger ${canClaimDaily ? 'available' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <span className="trigger-icon"><Gift size={20} /></span>
                {canClaimDaily && <span className="trigger-badge">!</span>}
            </button>
        );
    }

    const currentDay = stats.streakDays === 0 ? 1 : (((stats.streakDays - 1) % 7) + 7) % 7 + 1;

    return (
        <div className="daily-reward-overlay" onClick={() => setIsOpen(false)}>
            {showClaimCelebration && <ConfettiRain />}
            {showClaimCelebration && <FloatingEmoji emoji={'\uD83C\uDF81'} count={8} />}
            <div className="daily-reward-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>

                <div className="modal-header">
                    <h2><Gift size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t('dailyReward.title')}</h2>
                    <p>{t('dailyReward.subtitle')}</p>
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
                                    {isPast ? <CheckCircle size={20} /> : reward.special ? <Star size={20} /> : <Gift size={20} />}
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
                            <span className="claimed-icon"><Sparkles size={20} /></span>
                            <h3>{t('dailyReward.rewardClaimed')}</h3>
                            <p className="claimed-xp">+{claimedReward.xp} XP</p>
                            {claimedReward.badge && (
                                <p className="claimed-badge">{t('dailyReward.newBadge')} 🏅</p>
                            )}
                        </div>

                        {showCountdown && (
                            <div className="next-reward-fade-in">
                                <p>{t('dailyReward.nextRewardIn')}</p>
                                <div className="countdown">{countdown}</div>
                            </div>
                        )}
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
                                <span>{t('dailyReward.claimReward')}</span>
                                <span className="claim-emoji"><Gift size={20} /></span>
                            </>
                        )}
                    </button>
                ) : (
                    <div className="next-reward">
                        <p>{t('dailyReward.nextRewardIn')}</p>
                        <div className="countdown">{countdown}</div>
                    </div>
                )}

                <div className="streak-display">
                    <span className="streak-fire"><Flame size={20} /></span>
                    <span className="streak-text">{stats.streakDays} {t('dailyReward.dayStreak')}</span>
                </div>
            </div>

            <style>{`
                .next-reward-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DailyReward;
