import React, { useState, useEffect } from 'react';
import { getUserBadges, Badge } from '../services/badgeService';

const BadgeCollection: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  useEffect(() => {
    const userBadges = getUserBadges();
    setBadges(userBadges);
  }, []);

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;

  return (
    <div className="badge-collection">
      <div className="badge-header">
        <h2>🏅 Badge Collection</h2>
        <p className="badge-progress">
          {earnedCount} / {totalCount} Badges Earned
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="badge-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button
          className={filter === 'earned' ? 'active' : ''}
          onClick={() => setFilter('earned')}
        >
          Earned ({earnedCount})
        </button>
        <button
          className={filter === 'locked' ? 'active' : ''}
          onClick={() => setFilter('locked')}
        >
          Locked ({totalCount - earnedCount})
        </button>
      </div>

      <div className="badges-grid">
        {filteredBadges.map(badge => (
          <div
            key={badge.id}
            className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
          >
            <div className="badge-icon">{badge.icon}</div>
            <h3>{badge.name}</h3>
            <p>{badge.description}</p>
            {badge.earned && badge.earnedDate && (
              <span className="earned-date">
                Earned: {new Date(badge.earnedDate).toLocaleDateString()}
              </span>
            )}
            {!badge.earned && (
              <span className="locked-text">🔒 Locked</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .badge-collection {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .badge-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .badge-header h2 {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .badge-progress {
          font-size: 1.1rem;
          color: #64748B;
          margin-bottom: 16px;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #E5E7EB;
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          transition: width 0.5s ease;
        }

        .badge-filters {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .badge-filters button {
          padding: 10px 20px;
          border: 2px solid #E5E7EB;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .badge-filters button.active {
          background: var(--gradient-primary);
          color: white;
          border-color: transparent;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .badge-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          box-shadow: var(--shadow-md);
          transition: all 0.3s;
        }

        .badge-card.earned {
          border: 2px solid var(--primary);
        }

        .badge-card.locked {
          opacity: 0.5;
          filter: grayscale(100%);
        }

        .badge-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .badge-icon {
          font-size: 4rem;
          margin-bottom: 12px;
        }

        .badge-card h3 {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .badge-card p {
          color: #64748B;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .earned-date {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
        }

        .locked-text {
          font-size: 0.85rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .badge-celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s;
        }

        .badge-celebration {
          background: white;
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          max-width: 400px;
          animation: bounceIn 0.5s;
        }

        .badge-icon-large {
          font-size: 6rem;
          margin-bottom: 24px;
          animation: spin 1s;
        }

        .badge-celebration h2 {
          font-size: 2rem;
          margin-bottom: 16px;
        }

        .badge-celebration h3 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .celebration-close {
          margin-top: 24px;
          padding: 12px 32px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1.1rem;
        }

        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .badges-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default BadgeCollection;
