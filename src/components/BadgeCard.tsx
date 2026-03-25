/**
 * BadgeCard — Single badge display with rarity glow and earned/locked states.
 * Icon rendered as a styled letter inside a geometric shape.
 */

import React from 'react';
import { Lock } from 'lucide-react';
import type { Badge } from '../contexts/GamificationContext';
import './BadgeCard.css';

export interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  earned,
  earnedAt,
  size = 'md',
  showDescription = false,
}) => {
  const letter = badge.name.charAt(0).toUpperCase();

  return (
    <div
      className={[
        'badge-card-item',
        `badge-card-item--${size}`,
        `badge-card-item--${badge.rarity}`,
        earned ? 'badge-card-item--earned' : 'badge-card-item--locked',
      ].join(' ')}
      role="article"
      aria-label={`${badge.name} — ${earned ? 'earned' : 'locked'}`}
    >
      {/* Icon shape */}
      <div className={`badge-card-icon badge-card-icon--${badge.rarity} badge-card-icon--${badge.category}`}>
        {earned ? (
          <span className="badge-card-letter">{letter}</span>
        ) : (
          <span className="badge-card-lock">
            <Lock size={size === 'sm' ? 14 : size === 'lg' ? 22 : 16} strokeWidth={2.5} />
          </span>
        )}
      </div>

      {/* Badge info */}
      <div className="badge-card-body">
        <span className="badge-card-name">{badge.nameTr ?? badge.name}</span>

        {showDescription && (
          <p className="badge-card-desc">{badge.descriptionTr ?? badge.description}</p>
        )}

        <span className={`badge-card-rarity badge-card-rarity--${badge.rarity}`}>
          {badge.rarity}
        </span>
      </div>

      {/* Earned date chip */}
      {earned && earnedAt && (
        <span className="badge-card-date">{formatDate(earnedAt)}</span>
      )}

      {/* Earned indicator dot */}
      {earned && (
        <span className="badge-card-earned-dot" aria-hidden="true" />
      )}
    </div>
  );
};

export default BadgeCard;
