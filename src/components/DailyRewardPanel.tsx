/**
 * DailyRewardPanel — Inline daily reward UI for the navbar slide-up panel.
 * Compact version: rewards grid + claim button, max 120px celebration animation.
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
  const { lang } = useLanguage();

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
    if (diff <= 0) return lang === 'tr' ? 'Şimdi mevcut!' : 'Available now!';
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
      <div className="flex items-center justify-center gap-2 mb-4">
        <Flame size={18} className="text-primary-500" />
        <span className="font-display font-bold text-sm text-ink-900">
          {stats.streakDays} {lang === 'tr' ? 'Gün Seri' : 'Day Streak'}
        </span>
      </div>

      {/* 7-day reward grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const reward = getDailyRewardForDay(day);
          const isPast = day < currentDay;
          const isCurrent = day === currentDay;

          return (
            <div
              key={day}
              className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-center transition-all duration-200 ${
                isPast
                  ? 'bg-success-50 border border-success-200 opacity-70'
                  : isCurrent
                    ? 'bg-primary-50 border-2 border-primary-400 shadow-sm scale-105'
                    : 'bg-ink-50 border border-ink-100 opacity-50 border-dashed'
              }`}
            >
              <span className="text-[9px] font-display font-bold text-ink-500 uppercase">
                {lang === 'tr' ? `${day}.` : `D${day}`}
              </span>
              <span className="text-xs">
                {isPast
                  ? <KidIcon name="check" size={16} />
                  : reward.special
                    ? <KidIcon name="star" size={16} />
                    : <KidIcon name="trophy" size={16} />
                }
              </span>
              <span className="text-[10px] font-display font-bold text-primary-500">
                {reward.xp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Claim / Claimed / Countdown */}
      {claimed && claimedReward ? (
        <div className="text-center py-3">
          <div className="inline-flex items-center gap-2 mb-2 daily-reward-panel__claimed-anim">
            <Sparkles size={24} className="text-gold-500" />
            <span className="font-display font-black text-2xl text-primary-500">
              +{claimedReward.xp} XP
            </span>
          </div>
          <p className="font-display font-bold text-sm text-success-600 mb-2">
            {lang === 'tr' ? 'Ödül alındı!' : 'Reward claimed!'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-display font-semibold text-ink-400 hover:text-ink-600 transition-colors"
          >
            {lang === 'tr' ? 'Kapat' : 'Close'}
          </button>
        </div>
      ) : canClaimDaily ? (
        <button
          type="button"
          onClick={handleClaim}
          disabled={claiming}
          className="w-full py-3 px-4 rounded-2xl font-display font-bold text-base text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 daily-reward-panel__claim-btn"
        >
          {claiming
            ? (lang === 'tr' ? 'Alınıyor...' : 'Claiming...')
            : (lang === 'tr' ? 'Ödülünü Al!' : 'Claim Reward!')}
        </button>
      ) : (
        <div className="text-center py-2">
          <p className="text-xs text-ink-400 font-body mb-1">
            {lang === 'tr' ? 'Sonraki ödül:' : 'Next reward in:'}
          </p>
          <span className="font-display font-bold text-sm text-ink-700 bg-ink-50 px-3 py-1.5 rounded-lg inline-block">
            {formatCountdown()}
          </span>
        </div>
      )}

    </div>
  );
};

export default DailyRewardPanel;
