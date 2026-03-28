/**
 * DAILY REWARD COMPONENT — Navbar-embedded popover version
 * Renders a compact popover panel (not a full-screen modal).
 * Controlled externally: parent passes isOpen + onClose.
 */

import React, { useState, useEffect } from 'react';
import './DailyReward.css';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ConfettiRain } from './ui/Celebrations';
import { SFX } from '../data/soundLibrary';
import { Flame, X, Gift, Sparkles } from 'lucide-react';
import { KidIcon } from './ui';

interface DailyRewardPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    /** Anchor ref so the popover can position itself correctly */
    anchorRef?: React.RefObject<HTMLElement | null>;
}

const DailyRewardPopover: React.FC<DailyRewardPopoverProps> = ({ isOpen, onClose }) => {
    const {
        stats,
        canClaimDaily,
        claimDailyReward,
        getDailyRewardForDay,
        getNextClaimTime
    } = useGamification();
    const { t, lang } = useLanguage();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; badge?: string } | null>(null);
    const [countdown, setCountdown] = useState('');
    const [showCountdown, setShowCountdown] = useState(false);
    const [showClaimCelebration, setShowClaimCelebration] = useState(false);

    // Reset state when popover closes
    useEffect(() => {
        if (!isOpen) {
            setClaimed(false);
            setClaimedReward(null);
            setShowCountdown(false);
            setShowClaimCelebration(false);
        }
    }, [isOpen]);

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

    // Countdown timer
    useEffect(() => {
        if (!canClaimDaily) {
            const updateCountdown = () => {
                const nextClaim = getNextClaimTime();
                if (!nextClaim) return;

                const now = new Date();
                const diff = nextClaim.getTime() - now.getTime();

                if (diff <= 0) {
                    setCountdown(lang === 'tr' ? 'Şimdi mevcut!' : 'Available now!');
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
    }, [canClaimDaily, getNextClaimTime, lang]);

    const celebrationTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        return () => {
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
        };
    }, []);

    const handleClaim = async () => {
        if (!canClaimDaily || claiming) return;

        setClaiming(true);
        try {
            const reward = await claimDailyReward();

            if (reward) {
                setClaimedReward(reward);
                setClaimed(true);
                setShowClaimCelebration(true);
                SFX.celebration();
                if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
                celebrationTimerRef.current = setTimeout(() => setShowClaimCelebration(false), 3000);
            }
        } catch {
            // Claim failed silently
        } finally {
            setClaiming(false);
        }
    };

    if (!isOpen) return null;

    const currentDay = stats.streakDays === 0 ? 1 : (((stats.streakDays - 1) % 7) + 7) % 7 + 1;

    return (
        <>
            {showClaimCelebration && <ConfettiRain />}
            {/* Backdrop — click outside closes */}
            <div
                className="dr-popover-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="dr-popover"
                role="dialog"
                aria-modal="true"
                aria-label={lang === 'tr' ? 'Günlük Ödül' : 'Daily Reward'}
            >
                {/* Header row */}
                <div className="dr-popover__header">
                    <div className="dr-popover__title">
                        <Gift size={15} />
                        <span>{lang === 'tr' ? 'Günlük Ödül' : 'Daily Reward'}</span>
                        <span className="dr-popover__streak">
                            <Flame size={13} />
                            {stats.streakDays} {lang === 'tr' ? 'gün' : 'day'}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="dr-popover__close"
                        onClick={onClose}
                        aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* 7-day mini strip */}
                <div className="dr-popover__days">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const reward = getDailyRewardForDay(day);
                        const isPast = day < currentDay;
                        const isCurrent = day === currentDay;
                        const isFuture = day > currentDay;

                        return (
                            <div
                                key={day}
                                className={`dr-day ${isPast ? 'dr-day--past' : ''} ${isCurrent ? 'dr-day--current' : ''} ${isFuture ? 'dr-day--future' : ''} ${reward.special ? 'dr-day--special' : ''}`}
                            >
                                <span className="dr-day__label">{day}</span>
                                <span className="dr-day__icon">
                                    {isPast
                                        ? <KidIcon name="check" size={14} />
                                        : reward.special
                                            ? <KidIcon name="star" size={14} />
                                            : <KidIcon name="trophy" size={14} />
                                    }
                                </span>
                                <span className="dr-day__xp">{reward.xp}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Action area */}
                <div className="dr-popover__action">
                    {claimed && claimedReward ? (
                        <div className="dr-claimed">
                            <span className="dr-claimed__icon"><Sparkles size={16} /></span>
                            <span className="dr-claimed__xp">+{claimedReward.xp} XP</span>
                            <span className="dr-claimed__label">{t('dailyReward.rewardClaimed')}</span>
                            {showCountdown && (
                                <span className="dr-countdown">{countdown}</span>
                            )}
                        </div>
                    ) : canClaimDaily ? (
                        <button
                            type="button"
                            className="dr-claim-btn"
                            onClick={handleClaim}
                            disabled={claiming}
                        >
                            {claiming
                                ? (lang === 'tr' ? 'Alınıyor...' : 'Claiming...')
                                : (lang === 'tr' ? 'Ödülü Al' : 'Claim Reward')
                            }
                        </button>
                    ) : (
                        <div className="dr-waiting">
                            <span className="dr-waiting__label">{t('dailyReward.nextRewardIn')}</span>
                            <span className="dr-countdown">{countdown}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DailyRewardPopover;
