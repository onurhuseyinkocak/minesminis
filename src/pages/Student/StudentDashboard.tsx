import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Flame, Star, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import VirtualPetWidget from '../../components/VirtualPetWidget';
import { getUserBadges } from '../../services/badgeService';

const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [showBadges, setShowBadges] = useState(false);

  const dailyQuests = [
    { id: 1, title: 'Complete 1 game', completed: true, points: 50 },
    { id: 2, title: 'Watch 1 video', completed: true, points: 30 },
    { id: 3, title: 'Practice 5 words', completed: false, points: 40 },
  ];

  const menuItems = [
    { title: 'Games', icon: '🎮', path: '/games', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
    { title: 'Words', icon: '📖', path: '/words', gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' },
    { title: 'Videos', icon: '🎬', path: '/videos', gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' },
    { title: 'Worksheets', icon: '📝', path: '/worksheets', gradient: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)' },
  ];

  const completedQuests = dailyQuests.filter(q => q.completed).length;
  const totalQuests = dailyQuests.length;
  const progressPercent = (completedQuests / totalQuests) * 100;

  const badges = getUserBadges();
  const earnedBadges = badges.filter(b => b.earned).length;

  return (
    <div className="student-dashboard">
      <div className="dashboard-grid">
        <div className="main-content">
          <div className="welcome-section premium-card">
            <div className="welcome-content">
              <h1 className="glow-text">Welcome back, {userProfile?.display_name || 'Friend'}! 🎉</h1>
              <p className="welcome-subtitle">Ready to learn something amazing today?</p>
            </div>

            <div className="stats-row">
              <div className="stat-badge">
                <Trophy size={24} color="#F59E0B" />
                <div>
                  <div className="stat-value">{userProfile?.points || 0}</div>
                  <div className="stat-label">Points</div>
                </div>
              </div>

              <div className="stat-badge">
                <Flame size={24} color="#EF4444" />
                <div>
                  <div className="stat-value">{userProfile?.streak_days || 0}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>

              <div className="stat-badge">
                <Star size={24} color="#6366F1" />
                <div>
                  <div className="stat-value">{userProfile?.level || 1}</div>
                  <div className="stat-label">Level</div>
                </div>
              </div>

              <div className="stat-badge" onClick={() => setShowBadges(!showBadges)} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '1.5rem' }}>🏅</div>
                <div>
                  <div className="stat-value">{earnedBadges}</div>
                  <div className="stat-label">Badges</div>
                </div>
              </div>
            </div>
          </div>

          <div className="daily-quest-section premium-card">
            <div className="quest-header">
              <h2><Target size={24} /> Daily Quest ({completedQuests}/{totalQuests})</h2>
              <span className="quest-reward">+120 Points 🎁</span>
            </div>

            <div className="quest-progress-bar">
              <div className="quest-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="quest-list">
              {dailyQuests.map(quest => (
                <div key={quest.id} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
                  <div className="quest-checkbox">
                    {quest.completed ? '✅' : '⬜'}
                  </div>
                  <div className="quest-info">
                    <span className="quest-title">{quest.title}</span>
                    <span className="quest-points">+{quest.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activities-section">
            <h2>🎨 Choose Your Adventure</h2>
            <div className="activities-grid">
              {menuItems.map((item, index) => (
                <Link key={index} to={item.path} className="activity-card premium-card">
                  <div className="activity-icon" style={{ background: item.gradient }}>
                    <span style={{ fontSize: '3rem' }}>{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <VirtualPetWidget />
        </div>
      </div>

      <style>{`
        .student-dashboard {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
        }

        .main-content {
          min-width: 0;
        }

        .sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .welcome-section {
          margin-bottom: 24px;
        }

        .welcome-content {
          margin-bottom: 24px;
        }

        .welcome-subtitle {
          color: #64748B;
          font-size: 1.1rem;
          margin-top: 8px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #F8FAFC;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .stat-badge:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .stat-label {
          color: #64748B;
          font-size: 0.85rem;
        }

        .daily-quest-section {
          margin-bottom: 32px;
        }

        .quest-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .quest-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.25rem;
        }

        .quest-reward {
          background: var(--gradient-secondary);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .quest-progress-bar {
          height: 12px;
          background: #E5E7EB;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .quest-progress-fill {
          height: 100%;
          background: var(--gradient-success);
          transition: width 0.5s ease;
        }

        .quest-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quest-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #F8FAFC;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .quest-item.completed {
          opacity: 0.6;
        }

        .quest-checkbox {
          font-size: 1.5rem;
        }

        .quest-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quest-title {
          font-weight: 500;
        }

        .quest-points {
          color: #10B981;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .activities-section h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .activity-card {
          text-align: center;
          padding: 32px 20px;
          text-decoration: none;
          color: inherit;
        }

        .activity-icon {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .activity-card h3 {
          font-size: 1.25rem;
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 768px) {
          .student-dashboard {
            padding: 20px;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .activities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
