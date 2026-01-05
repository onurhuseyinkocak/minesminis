/**
 * BADGE SHOWCASE COMPONENT
 * Display user badges and achievements
 */

import React, { useState } from 'react';
import { useGamification, ALL_BADGES, Badge } from '../contexts/GamificationContext';
import './BadgeShowcase.css';

interface BadgeShowcaseProps {
    compact?: boolean;
    maxDisplay?: number;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ compact = false, maxDisplay }) => {
    const { stats, hasBadge, allBadges } = useGamification();
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

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
                            <span className="badge-icon">{badge.icon}</span>
                        </div>
                    ))}
                    {earnedBadges.length > 5 && (
                        <div className="badge-mini more">
                            +{earnedBadges.length - 5}
                        </div>
                    )}
                </div>
                <span className="badge-count">{earnedBadges.length}/{allBadges.length} badges</span>
            </div>
        );
    }

    return (
        <div className="badge-showcase">
            <div className="showcase-header">
                <h3>🏅 My Badges</h3>
                <div className="badge-stats">
                    <span className="earned-count">{earnedBadges.length}</span>
                    <span className="total-count">/ {allBadges.length}</span>
                </div>
            </div>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-tab ${filter === 'earned' ? 'active' : ''}`}
                    onClick={() => setFilter('earned')}
                >
                    Earned ({earnedBadges.length})
                </button>
                <button
                    className={`filter-tab ${filter === 'locked' ? 'active' : ''}`}
                    onClick={() => setFilter('locked')}
                >
                    Locked ({lockedBadges.length})
                </button>
            </div>

            <div className="badges-grid">
                {limitedBadges.map((badge) => {
                    const isEarned = hasBadge(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
                            onClick={() => setSelectedBadge(badge)}
                        >
                            <div className="badge-icon-large">
                                {isEarned ? badge.icon : '🔒'}
                            </div>
                            <div className="badge-info">
                                <span className="badge-name">{badge.name}</span>
                                <span className="badge-category">{badge.category}</span>
                            </div>
                            {isEarned && <div className="earned-check">✓</div>}
                        </div>
                    );
                })}
            </div>

            {maxDisplay && displayBadges.length > maxDisplay && (
                <button className="view-all-btn">
                    View All Badges ({displayBadges.length})
                </button>
            )}

            {/* Badge Detail Modal */}
            {selectedBadge && (
                <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
                    <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedBadge(null)}>✕</button>

                        <div className={`modal-badge-icon ${hasBadge(selectedBadge.id) ? 'earned' : 'locked'}`}>
                            {hasBadge(selectedBadge.id) ? selectedBadge.icon : '🔒'}
                        </div>

                        <h4 className="modal-badge-name">{selectedBadge.name}</h4>
                        <p className="modal-badge-desc">{selectedBadge.description}</p>

                        <div className="modal-badge-status">
                            {hasBadge(selectedBadge.id) ? (
                                <span className="status-earned">✅ Earned!</span>
                            ) : (
                                <span className="status-locked">🔒 Not yet earned</span>
                            )}
                        </div>

                        <div className="modal-badge-category">
                            Category: <span>{selectedBadge.category}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BadgeShowcase;
