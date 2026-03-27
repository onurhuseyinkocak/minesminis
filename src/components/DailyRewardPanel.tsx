/**
 * DailyRewardPanel — Inline daily reward UI for the navbar slide-up panel.
 * Compact version: rewards grid + claim button, max 120px celebration animation.
 * Uses design-system tokens exclusively — zero hardcoded Tailwind color classes.
 */

import React, { useState, useRef } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ConfettiRain } from './ui/Celebrations';
import { SFX } from '../data/soundLibrary';
import { Sparkles, Flame } from 'lucide-react';
import { KidIcon } from './ui';
import './DailyRewardPanel.css';

interface DailyRewardPanelProps {
  onClose: () => void;
}

const DailyRewardPanel: React.FC<DailyRewardPanelProps> = ({ onClose }) => {
  const {
    stats,
    canClaimDaily,
    claimDailyReward,
    getDailyRewardForDay,
    getNextClaimTime,
  } = useGamification();
  const { lang, t } = useLanguage();

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{ xp: number; badge?: string } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (celebrationRef.current) clearTimeout(celebrationRef.current);
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
        setShowCelebration(true);
        SFX.celebration();
        if (celebrationRef.current) clearTimeout(celebrationRef.current);
        celebrationRef.current = setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch {
      // Silently handle
    } finally {
      setClaiming(false);
    }
  };

  const currentDay = stats.streakDays === 0 ? 1 : (((stats.streakDays - 1) % 7) + 7) % 7 + 1;

  // Format countdown
  const formatCountdown = (): string => {
    const nextClaim = getNextClaimTime();
    if (!nextClaim) return '';
    const diff = nextClaim.getTime() - Date.now();
    if (diff <= 0) return t('dailyReward.claimReward');
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
  };

  return (
    <div className="daily-reward-panel">
      {showCelebration && (
        <div className="daily-reward-panel__confetti">
          <ConfettiRain />
        </div>
      )}

      {/* Streak display */}
      <div className="daily-reward-panel__streak">
        <Flame size={18} className="daily-reward-panel__streak-icon" />
        <span className="daily-reward-panel__streak-text">
          {stats.streakDays} {t('dailyReward.dayStreak')}
        </span>
      </div>

      {/* 7-day reward grid */}
      <div className="daily-reward-panel__grid">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const reward = getDailyRewardForDay(day);
          const isPast = day < currentDay;
          const isCurrent = day === currentDay;

          return (
            <div
              key={day}
              className={`daily-reward-panel__day${isPast ? ' is-past' : ''}${isCurrent ? ' is-current' : ''}${!isPast && !isCurrent ? ' is-future' : ''}`}
            >
              <span className="daily-reward-panel__day-label">
                {lang === 'tr' ? `${day}.` : `D${day}`}{/* Day label stays locale-conditional: tr uses ordinals */}
              </span>
              <span className="daily-reward-panel__day-icon">
                {isPast
                  ? <KidIcon name="check" size={16} />
                  : reward.special
                    ? <KidIcon name="star" size={16} />
                    : <KidIcon name="trophy" size={16} />
                }
              </span>
              <span className="daily-reward-panel__day-xp">
                {reward.xp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Claim / Claimed / Countdown */}
      {claimed && claimedReward ? (
        <div className="daily-reward-panel__claimed">
          <div className="daily-reward-panel__claimed-anim">
            <Sparkles size={24} className="daily-reward-panel__sparkle-icon" />
            <span className="daily-reward-panel__xp-value">
              +{claimedReward.xp} XP
            </span>
          </div>
          <p className="daily-reward-panel__claimed-label">
            {t('dailyReward.rewardClaimed')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="daily-reward-panel__close-link"
          >
            {t('common.close')}
          </button>
        </div>
      ) : canClaimDaily ? (
        <button
          type="button"
          onClick={handleClaim}
          disabled={claiming}
          className="daily-reward-panel__claim-btn"
        >
          {claiming
            ? t('common.processing')
            : t('dailyReward.claimReward')}
        </button>
      ) : (
        <div className="daily-reward-panel__countdown">
          <p className="daily-reward-panel__countdown-label">
            {t('dailyReward.nextRewardIn')}
          </p>
          <span className="daily-reward-panel__countdown-value">
            {formatCountdown()}
          </span>
        </div>
      )}

    </div>
  );
};

export default DailyRewardPanel;
