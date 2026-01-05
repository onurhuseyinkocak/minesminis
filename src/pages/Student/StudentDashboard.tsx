import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { Trophy, Flame, Star, Target, Map as MapIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import VirtualPetWidget from '../../components/VirtualPetWidget';
import ProgressMap from '../../components/ProgressMap';
import DailyChallenge from '../../components/DailyChallenge';
import BadgeShowcase from '../../components/BadgeShowcase';
import AvatarPicker from '../../components/AvatarPicker';
import Leaderboard from '../../components/Leaderboard';

const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { stats } = useGamification();
  const [activeTab, setActiveTab] = useState<'main' | 'map' | 'badges'>('main');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const menuItems = [
    { title: 'Games', icon: '🎮', path: '/games', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
    { title: 'Words', icon: '📖', path: '/words', gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' },
    { title: 'Videos', icon: '🎬', path: '/videos', gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' },
    { title: 'Worksheets', icon: '📝', path: '/worksheets', gradient: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)' },
  ];

  return (
    <div className="student-dashboard">
      <div className="dashboard-grid">
        <div className="main-content">
          <div className="welcome-section premium-card">
            <div className="welcome-header">
              <div
                className="welcome-avatar-wrapper"
                onClick={() => setShowAvatarPicker(true)}
                title="Click to change avatar!"
              >
                <div className="welcome-avatar">
                  {userProfile?.avatar_url || '👤'}
                </div>
                <div className="avatar-edit-icon">✏️</div>
              </div>
              <div className="welcome-content">
                <h1 className="glow-text">Welcome back, {userProfile?.display_name || 'Friend'}! 🎉</h1>
                <p className="welcome-subtitle">Ready to learn something amazing today?</p>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-badge">
                <Trophy size={24} color="#6366F1" />
                <div>
                  <div className="stat-value">{stats.xp}</div>
                  <div className="stat-label">Total XP</div>
                </div>
              </div>

              <div className="stat-badge">
                <Flame size={24} color="#EF4444" />
                <div>
                  <div className="stat-value">{stats.streakDays}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>

              <div className="stat-badge">
                <Star size={24} color="#F59E0B" />
                <div>
                  <div className="stat-value">{stats.level}</div>
                  <div className="stat-label">Current Level</div>
                </div>
              </div>

              <div className="stat-badge">
                <div style={{ fontSize: '1.5rem' }}>🏅</div>
                <div>
                  <div className="stat-value">{stats.badges.length}</div>
                  <div className="stat-label">Badges</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-tabs">
            <button
              className={`dashboard-tab-btn ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => setActiveTab('main')}
            >
              <Target size={18} /> My Day
            </button>
            <button
              className={`dashboard-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <MapIcon size={18} /> Adventure Map
            </button>
            <button
              className={`dashboard-tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
              onClick={() => setActiveTab('badges')}
            >
              <span style={{ fontSize: '1.1rem' }}>🏅</span> My Badges
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'main' && (
              <>
                <DailyChallenge />
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
              </>
            )}

            {activeTab === 'map' && <ProgressMap />}
            {activeTab === 'badges' && <BadgeShowcase />}
          </div>
        </div>

        <div className="sidebar">
          <VirtualPetWidget />
          <Leaderboard />
        </div>
      </div>

      {showAvatarPicker && <AvatarPicker onClose={() => setShowAvatarPicker(false)} />}

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

        .welcome-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .welcome-avatar-wrapper {
          position: relative;
          cursor: pointer;
        }

        .welcome-avatar {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 4px solid #E0E7FF;
          transition: transform 0.2s;
        }

        [data-theme="dark"] .welcome-avatar {
          background: #334155;
          border-color: #475569;
        }

        .welcome-avatar-wrapper:hover .welcome-avatar {
          transform: scale(1.05);
          border-color: #6366F1;
        }

        .avatar-edit-icon {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #6366F1;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.2s;
        }

        .welcome-avatar-wrapper:hover .avatar-edit-icon {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome-content {
          flex: 1;
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

        .dashboard-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.5);
          padding: 8px;
          border-radius: 16px;
          width: fit-content;
        }

        [data-theme="dark"] .dashboard-tabs {
          background: rgba(30, 41, 59, 0.5);
        }

        .dashboard-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dashboard-tab-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #6366F1;
        }

        .dashboard-tab-btn.active {
          background: white;
          color: #6366F1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        [data-theme="dark"] .dashboard-tab-btn.active {
          background: #1e293b;
          color: #818cf8;
        }

        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
