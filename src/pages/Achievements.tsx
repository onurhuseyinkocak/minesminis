import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import type { Badge } from '../contexts/GamificationContext';
import BadgeCard from '../components/BadgeCard';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

// Golden glow animation for recently earned badges
const badgeShineStyle = `
@keyframes badge-shine {
  0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0), border-color: #FDE68A; }
  50% { box-shadow: 0 0 16px 4px rgba(234, 179, 8, 0.35); border-color: #F59E0B; }
}
.badge-earned-glow {
  animation: badge-shine 2s ease-in-out 3;
  border-color: #FDE68A;
}
`;

function BadgeSkeleton() {
  return <div className="aspect-square rounded-3xl bg-gray-100 animate-pulse" />;
}

function getProgressHint(badge: Badge, stats: ReturnType<typeof useGamification>['stats'], _isTr: boolean): string | null {
  switch (badge.requirementType) {
    case 'words': return `${stats.wordsLearned ?? 0}/${badge.requirement}`;
    case 'games': return `${stats.gamesPlayed ?? 0}/${badge.requirement}`;
    case 'videos': return `${stats.videosWatched ?? 0}/${badge.requirement}`;
    case 'streak': return `${stats.streakDays ?? 0}/${badge.requirement}`;
    case 'level': return `Lv${stats.level ?? 1}/${badge.requirement}`;
    default: return null;
  }
}

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { allBadges, hasBadge, stats, loading } = useGamification();
  const { lang } = useLanguage();
  usePageTitle('Basarilarim', 'Achievements');
  const isTr = lang === 'tr';

  const earnedIds = stats.badges ?? [];
  const earnedCount = earnedIds.length;

  // Track which badges were already earned when the page first loaded
  const initialEarnedRef = useRef<Set<string> | null>(null);
  const [newlyEarnedIds, setNewlyEarnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialEarnedRef.current === null) {
      initialEarnedRef.current = new Set(earnedIds);
    } else {
      const fresh = earnedIds.filter((id) => !initialEarnedRef.current!.has(id));
      if (fresh.length > 0) {
        setNewlyEarnedIds(new Set(fresh));
      }
    }
  }, [earnedIds]);

  // Sort: earned first, then unearned
  const sortedBadges = useMemo(() => {
    const earned = allBadges.filter(b => earnedIds.includes(b.id));
    const unearned = allBadges.filter(b => !earnedIds.includes(b.id));
    return [...earned, ...unearned];
  }, [allBadges, earnedIds]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pb-24">
      <style>{badgeShineStyle}</style>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-yellow-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
            aria-label={isTr ? 'Geri' : 'Back'}
          >
            <ArrowLeft size={18} />
          </button>
          <Trophy size={22} className="text-yellow-500" />
          <h1 className="text-lg font-bold text-gray-800 flex-1">{isTr ? 'Rozetlerim' : 'My Badges'}</h1>
          <span className="text-sm font-bold text-yellow-600 bg-yellow-100 h-7 px-3 rounded-full flex items-center">
            {earnedCount}/{allBadges.length}
          </span>
        </div>
      </div>

      <div className="pt-4 px-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: allBadges.length > 0 ? `${(earnedCount / allBadges.length) * 100}%` : '0%' }}
              transition={{ ...spring, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center">
            {allBadges.length > 0 ? Math.round((earnedCount / allBadges.length) * 100) : 0}% {isTr ? 'tamamlandi' : 'complete'}
          </p>
        </div>

        {/* Badge grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <BadgeSkeleton key={i} />)}
          </div>
        ) : sortedBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center gap-3">
            <Lock size={40} className="text-gray-300" />
            <p className="text-sm text-gray-500">{isTr ? 'Henuz rozet yok.' : 'No badges yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedBadges.map((badge, idx) => {
              const earned = hasBadge(badge.id);
              const hint = !earned ? getProgressHint(badge, stats, isTr) : null;
              const isNewlyEarned = newlyEarnedIds.has(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...spring, delay: Math.min(idx * 0.04, 0.6) }}
                  className={`rounded-3xl p-3 flex flex-col items-center gap-1 border-2 ${
                    earned
                      ? `bg-white shadow-sm ${isNewlyEarned ? 'badge-earned-glow border-yellow-300' : 'border-yellow-200'}`
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}
                >
                  <BadgeCard badge={badge} earned={earned} size="md" />
                  {hint && (
                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">{hint}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
