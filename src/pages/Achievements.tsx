/**
 * Achievements page — full badge gallery with stats, category tabs, recent earned,
 * and progress hints for unearned badges.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Lock, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import type { Badge } from '../contexts/GamificationContext';
import BadgeCard from '../components/BadgeCard';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import toast from 'react-hot-toast';
import './Achievements.css';

type Category = 'all' | 'learning' | 'streak' | 'social' | 'special';

const CATEGORY_LABELS_TR: Record<Category, string> = {
  all: 'Tümü',
  learning: 'Öğrenme',
  streak: 'Seri',
  social: 'Sosyal',
  special: 'Özel',
};

const CATEGORY_LABELS_EN: Record<Category, string> = {
  all: 'All',
  learning: 'Learning',
  streak: 'Streak',
  social: 'Social',
  special: 'Special',
};

/** Returns a human-readable progress string for badges that have trackable progress */
function getProgressHint(badge: Badge, stats: ReturnType<typeof useGamification>['stats'], isTr: boolean): string | null {
  switch (badge.requirementType) {
    case 'words':
      return `${stats.wordsLearned ?? 0} / ${badge.requirement} ${isTr ? 'kelime' : 'words'}`;
    case 'games':
      return `${stats.gamesPlayed ?? 0} / ${badge.requirement} ${isTr ? 'oyun' : 'games'}`;
    case 'videos':
      return `${stats.videosWatched ?? 0} / ${badge.requirement} ${isTr ? 'video' : 'videos'}`;
    case 'streak':
      return `${stats.streakDays ?? 0} / ${badge.requirement} ${isTr ? 'gün' : 'days'}`;
    case 'level':
      return `${isTr ? 'Seviye' : 'Level'} ${stats.level ?? 1} / ${badge.requirement}`;
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
  const navigate = useNavigate();
  const { allBadges, hasBadge, stats } = useGamification();
  const { t, lang } = useLanguage();
  usePageTitle('Başarılarım', 'Achievements');
  const isTr = lang === 'tr';
  const CATEGORY_LABELS = isTr ? CATEGORY_LABELS_TR : CATEGORY_LABELS_EN;
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const handleShareAchievements = useCallback(async () => {
    const count = (stats.badges ?? []).length;
    const text = isTr
      ? `MinesMinis'te ${count} rozet kazandım! Sen de öğrenmeye başla: https://minesminis.com`
      : `I've earned ${count} badges on MinesMinis! Start learning: https://minesminis.com`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'MinesMinis', text, url: 'https://minesminis.com' });
        return;
      } catch {
        // cancelled or failed — fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(isTr ? 'Kopyalandı!' : 'Copied!');
    } catch {
      toast.error(isTr ? 'Paylaşılamadı' : 'Could not share');
    }
  }, [isTr, stats.badges]);

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

  // Last 3 earned badges, newest first (most recently earned = last in earnedIds array)
  const recentBadges = useMemo(() => {
    const earnedIdsList = stats.badges ?? [];
    // Most recently earned are last in the array — reverse and take 3
    const recentIds = [...earnedIdsList].reverse().slice(0, 3);
    return recentIds
      .map(id => allBadges.find(b => b.id === id))
      .filter(Boolean) as Badge[];
  }, [stats.badges, allBadges]);

  const categories: Category[] = ['all', 'learning', 'streak', 'social', 'special'];

  return (
    <div className="achievements-page">
      <motion.div
        className="achievements-content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="achievements-header">
          <div className="achievements-title-row">
            <button
              type="button"
              className="achievements-back-btn"
              onClick={() => navigate(-1)}
              aria-label={isTr ? 'Geri' : 'Back'}
            >
              <ArrowLeft size={20} />
            </button>
            <Trophy size={28} color="var(--warning)" />
            <h1>{t ? t('achievements.title') : 'Rozetlerim'}</h1>
            {earnedCount > 0 && (
              <button
                type="button"
                className="achievements-share-btn"
                onClick={() => void handleShareAchievements()}
                aria-label={isTr ? 'Rozetlerini paylaş' : 'Share your badges'}
              >
                <Share2 size={16} />
                <span>{isTr ? 'Paylaş' : 'Share'}</span>
              </button>
            )}
          </div>

          {/* Summary stats */}
          <div className="achievements-summary">
            <div className="achievements-summary-card">
              <span className="achievements-summary-value">{earnedCount}</span>
              <span className="achievements-summary-label">{isTr ? 'Kazanılan' : 'Earned'}</span>
            </div>
            <div className="achievements-summary-divider" aria-hidden="true" />
            <div className="achievements-summary-card">
              <span className="achievements-summary-value">{totalCount}</span>
              <span className="achievements-summary-label">{isTr ? 'Toplam' : 'Total'}</span>
            </div>
            <div className="achievements-summary-divider" aria-hidden="true" />
            <div className="achievements-summary-card">
              <span className="achievements-summary-value">
                {totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%
              </span>
              <span className="achievements-summary-label">{isTr ? 'Tamamlandı' : 'Completed'}</span>
            </div>

            {rarestBadge && (
              <>
                <div className="achievements-summary-divider" aria-hidden="true" />
                <div className="achievements-summary-card achievements-summary-card--rarest">
                  <span className={`achievements-rarity-pill achievements-rarity-pill--${rarestBadge.rarity}`}>
                    {rarestBadge.rarity}
                  </span>
                  <span className="achievements-summary-label">{isTr ? 'En Nadir' : 'Rarest'}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Recent earned ──────────────────────────────────── */}
        {recentBadges.length > 0 && (
          <section className="achievements-recent">
            <h2 className="achievements-section-title">{isTr ? 'Son Kazanılanlar' : 'Recently Earned'}</h2>
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
              type="button"
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
          aria-label={isTr ? `${CATEGORY_LABELS[activeCategory]} rozetleri` : `${CATEGORY_LABELS[activeCategory]} badges`}
        >
          {filteredBadges.length === 0 ? (
            <div className="achievements-empty">
              <Lock size={36} color="var(--text-muted)" />
              <p>{isTr ? 'Bu kategoride henüz rozet yok.' : 'No badges in this category yet.'}</p>
            </div>
          ) : (
            filteredBadges.map(badge => {
              const earned = hasBadge(badge.id);
              const progressHint = !earned ? getProgressHint(badge, stats, isTr) : null;

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
