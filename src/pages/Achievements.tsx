/**
 * Achievements page — full badge gallery with stats, category tabs, recent earned,
 * and progress hints for unearned badges.
 */

import React, { useState, useMemo } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import type { Badge } from '../contexts/GamificationContext';
import BadgeCard from '../components/BadgeCard';
import { useLanguage } from '../contexts/LanguageContext';
import './Achievements.css';

type Category = 'all' | 'learning' | 'streak' | 'social' | 'special';

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'Tümü',
  learning: 'Öğrenme',
  streak: 'Seri',
  social: 'Sosyal',
  special: 'Özel',
};

/** Returns a human-readable progress string for badges that have trackable progress */
function getProgressHint(badge: Badge, stats: ReturnType<typeof useGamification>['stats']): string | null {
  switch (badge.requirementType) {
    case 'words':
      return `${stats.wordsLearned ?? 0} / ${badge.requirement} kelime`;
    case 'games':
      return `${stats.gamesPlayed ?? 0} / ${badge.requirement} oyun`;
    case 'videos':
      return `${stats.videosWatched ?? 0} / ${badge.requirement} video`;
    case 'streak':
      return `${stats.streakDays ?? 0} / ${badge.requirement} gün`;
    case 'level':
      return `Seviye ${stats.level ?? 1} / ${badge.requirement}`;
    default:
      return null;
  }
}

/** Returns the rarest badge from earned badge IDs  */
function getRarestBadge(earnedIds: string[], allBadges: Badge[]): Badge | null {
  const order: Badge['rarity'][] = ['legendary', 'epic', 'rare', 'common'];
  for (const rarity of order) {
    const match = allBadges.find(b => earnedIds.includes(b.id) && b.rarity === rarity);
    if (match) return match;
  }
  return null;
}

const Achievements: React.FC = () => {
  const { allBadges, hasBadge, stats } = useGamification();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const earnedIds = stats.badges ?? [];
  const earnedCount = earnedIds.length;
  const totalCount = allBadges.length;
  const rarestBadge = getRarestBadge(earnedIds, allBadges);

  // Badges for the active category tab
  const filteredBadges = useMemo(() => {
    if (activeCategory === 'all') return allBadges;
    // 'achievement' category maps to no tab — we merge it into learning
    return allBadges.filter(b => {
      if (activeCategory === 'learning') return b.category === 'learning' || b.category === 'achievement';
      return b.category === activeCategory;
    });
  }, [allBadges, activeCategory]);

  // Last 3 earned badges, newest first
  const recentBadges = useMemo(() => {
    return allBadges
      .filter(b => hasBadge(b.id))
      .slice(-3)
      .reverse();
  }, [allBadges, hasBadge]);

  const categories: Category[] = ['all', 'learning', 'streak', 'social', 'special'];

  return (
    <div className="achievements-page">
      <motion.div
        className="achievements-content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="achievements-header">
          <div className="achievements-title-row">
            <Trophy size={28} color="var(--warning)" />
            <h1>{t ? t('achievements.title') : 'Rozetlerim'}</h1>
          </div>

          {/* Summary stats */}
          <div className="achievements-summary">
            <div className="achievements-summary-card">
              <span className="achievements-summary-value">{earnedCount}</span>
              <span className="achievements-summary-label">Kazanılan</span>
            </div>
            <div className="achievements-summary-divider" aria-hidden="true" />
            <div className="achievements-summary-card">
              <span className="achievements-summary-value">{totalCount}</span>
              <span className="achievements-summary-label">Toplam</span>
            </div>
            <div className="achievements-summary-divider" aria-hidden="true" />
            <div className="achievements-summary-card">
              <span className="achievements-summary-value">
                {totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%
              </span>
              <span className="achievements-summary-label">Tamamlandı</span>
            </div>

            {rarestBadge && (
              <>
                <div className="achievements-summary-divider" aria-hidden="true" />
                <div className="achievements-summary-card achievements-summary-card--rarest">
                  <span className={`achievements-rarity-pill achievements-rarity-pill--${rarestBadge.rarity}`}>
                    {rarestBadge.rarity}
                  </span>
                  <span className="achievements-summary-label">En Nadir</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Recent earned ──────────────────────────────────── */}
        {recentBadges.length > 0 && (
          <section className="achievements-recent">
            <h2 className="achievements-section-title">Son Kazanılanlar</h2>
            <div className="achievements-recent-grid">
              {recentBadges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned
                  size="md"
                  showDescription
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Category tabs ──────────────────────────────────── */}
        <div className="achievements-tabs" role="tablist" aria-label="Badge categories">
          {categories.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`achievements-tab ${activeCategory === cat ? 'achievements-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* ── Badge grid ─────────────────────────────────────── */}
        <section
          className="achievements-grid"
          role="tabpanel"
          aria-label={`${CATEGORY_LABELS[activeCategory]} rozetleri`}
        >
          {filteredBadges.length === 0 ? (
            <div className="achievements-empty">
              <Lock size={36} color="var(--text-muted)" />
              <p>Bu kategoride henüz rozet yok.</p>
            </div>
          ) : (
            filteredBadges.map(badge => {
              const earned = hasBadge(badge.id);
              const progressHint = !earned ? getProgressHint(badge, stats) : null;

              return (
                <div key={badge.id} className="achievements-grid-item">
                  <BadgeCard
                    badge={badge}
                    earned={earned}
                    size="md"
                    showDescription
                  />
                  {progressHint && (
                    <span className="achievements-progress-hint">{progressHint}</span>
                  )}
                </div>
              );
            })
          )}
        </section>
      </motion.div>
    </div>
  );
};

export default Achievements;
