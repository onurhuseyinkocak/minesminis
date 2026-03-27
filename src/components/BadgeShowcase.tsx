/**
 * BADGE SHOWCASE COMPONENT
 * Display user badges and achievements
 */

import React, { useState } from 'react';
import { Lock, Award, Check, X, Medal } from 'lucide-react';
import './BadgeShowcase.css';
import { useGamification, Badge } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { KidIcon } from './ui';

interface BadgeShowcaseProps {
    compact?: boolean;
    maxDisplay?: number;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ compact = false, maxDisplay: initialMaxDisplay }) => {
    const { hasBadge, allBadges } = useGamification();
    const { t, lang } = useLanguage();
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
    const [maxDisplay, setMaxDisplay] = useState(initialMaxDisplay);

    const earnedBadges = allBadges.filter(b => hasBadge(b.id));
    const lockedBadges = allBadges.filter(b => !hasBadge(b.id));

    const displayBadges = filter === 'all'
        ? allBadges
        : filter === 'earned'
            ? earnedBadges
            : lockedBadges;

    const limitedBadges = maxDisplay
        ? displayBadges.slice(0, maxDisplay)
        : displayBadges;

    if (compact) {
        return (
            <div className="badge-showcase-compact">
                <div className="badges-row">
                    {earnedBadges.slice(0, 5).map((badge) => (
                        <div key={badge.id} className="badge-mini" title={badge.name}>
                            <span className="badge-icon"><KidIcon name={badge.icon as import('./ui/KidIcon').KidIconName} size={16} /></span>
                        </div>
                    ))}
                    {earnedBadges.length > 5 && (
                        <div className="badge-mini more">
                            +{earnedBadges.length - 5}
                        </div>
                    )}
                </div>
                <span className="badge-count">{earnedBadges.length}/{allBadges.length} {t('badgeShowcase.badges')}</span>
            </div>
        );
    }

    return (
        <div className="badge-showcase">
            <div className="showcase-header">
                <h3>
              <Award size={18} aria-hidden="true" />
              {t('badgeShowcase.title')}
            </h3>
                <div className="badge-stats">
                    <span className="earned-count">{earnedBadges.length}</span>
                    <span className="total-count">/ {allBadges.length}</span>
                </div>
            </div>

            <div className="filter-tabs">
                <button
                    type="button"
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    {t('badgeShowcase.all')}
                </button>
                <button
                    type="button"
                    className={`filter-tab ${filter === 'earned' ? 'active' : ''}`}
                    onClick={() => setFilter('earned')}
                >
                    {t('badgeShowcase.earned')} ({earnedBadges.length})
                </button>
                <button
                    type="button"
                    className={`filter-tab ${filter === 'locked' ? 'active' : ''}`}
                    onClick={() => setFilter('locked')}
                >
                    {t('badgeShowcase.locked')} ({lockedBadges.length})
                </button>
            </div>

            <div className="badges-grid">
                {limitedBadges.length === 0 && (
                    <div className="badge-empty-state">
                        <Medal size={48} className="badge-empty-state__icon" />
                        <p className="badge-empty-state__title">
                            {filter === 'earned'
                                ? t('badgeShowcase.noEarnedYet') || (lang === 'tr' ? 'Henuz rozet kazanmadin' : 'No badges earned yet')
                                : filter === 'locked'
                                    ? t('badgeShowcase.allUnlocked') || (lang === 'tr' ? 'Tum rozetler acildi!' : 'All badges unlocked!')
                                    : t('badgeShowcase.noBadges') || (lang === 'tr' ? 'Henuz rozet yok' : 'No badges available')}
                        </p>
                        <p className="badge-empty-state__desc">
                            {filter === 'earned'
                                ? (lang === 'tr' ? 'Ders tamamla ve rozet kazan!' : 'Complete lessons to earn badges!')
                                : filter === 'locked'
                                    ? (lang === 'tr' ? 'Harika is cikardim!' : 'Great job!')
                                    : (lang === 'tr' ? 'Yakinda rozetler eklenecek' : 'Badges coming soon')}
                        </p>
                    </div>
                )}
                {limitedBadges.map((badge) => {
                    const isEarned = hasBadge(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
                            onClick={() => setSelectedBadge(badge)}
                        >
                            <div className="badge-icon-large">
                                {isEarned ? <KidIcon name={badge.icon as import('./ui/KidIcon').KidIconName} size={20} /> : <Lock size={16} />}
                            </div>
                            <div className="badge-info">
                                <span className="badge-name">{badge.name}</span>
                                <span className="badge-category">{badge.category}</span>
                            </div>
                            {isEarned && <div className="earned-check"><Check size={12} strokeWidth={3} /></div>}
                        </div>
                    );
                })}
            </div>

            {maxDisplay && displayBadges.length > maxDisplay && (
                <button type="button" className="view-all-btn" onClick={() => setMaxDisplay(undefined)}>
                    {t('badgeShowcase.viewAll')} ({displayBadges.length})
                </button>
            )}

            {/* Badge Detail Modal */}
            {selectedBadge && (
                <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
                    <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-modal" onClick={() => setSelectedBadge(null)}><X size={14} /></button>

                        <div className={`modal-badge-icon ${hasBadge(selectedBadge.id) ? 'earned' : 'locked'}`}>
                            {hasBadge(selectedBadge.id) ? <KidIcon name={selectedBadge.icon as import('./ui/KidIcon').KidIconName} size={24} /> : <Lock size={16} />}
                        </div>

                        <h4 className="modal-badge-name">{selectedBadge.name}</h4>
                        <p className="modal-badge-desc">{selectedBadge.description}</p>

                        <div className="modal-badge-status">
                            {hasBadge(selectedBadge.id) ? (
                                <span className="status-earned"><Check size={14} strokeWidth={3} /> {t('badgeShowcase.earnedLabel')}</span>
                            ) : (
                                <span className="status-locked"><Lock size={14} /> {t('badgeShowcase.notYetEarned')}</span>
                            )}
                        </div>

                        <div className="modal-badge-category">
                            {t('badgeShowcase.category')}: <span>{selectedBadge.category}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BadgeShowcase;
