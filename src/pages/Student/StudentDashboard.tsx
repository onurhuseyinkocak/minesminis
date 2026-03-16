import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { Trophy, Flame, Star, Map, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressMap from '../../components/ProgressMap';
import BadgeShowcase from '../../components/BadgeShowcase';
import AvatarPicker from '../../components/AvatarPicker';
import Leaderboard from '../../components/Leaderboard';
import DailyChallenge from '../../components/DailyChallenge';

const StudentDashboard: React.FC = () => {
  const { userProfile, isAdmin } = useAuth();
  const { stats } = useGamification();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const actionItems = [
    {
      title: 'PLAY GAMES',
      icon: '🎮',
      path: '/games',
      className: 'games',
      color: 'var(--accent-indigo)',
      bg: 'var(--accent-indigo-pale)',
      description: 'Test your skills!'
    },
    {
      title: 'READ WORDS',
      icon: '📖',
      path: '/words',
      className: 'words',
      color: 'var(--accent-emerald)',
      bg: 'var(--success-pale)',
      description: 'Learn new things'
    },
    {
      title: 'WATCH VIDEOS',
      icon: '🎬',
      path: '/videos',
      className: 'videos',
      color: 'var(--primary)',
      bg: 'var(--primary-pale)',
      description: 'Stories & More'
    },
    {
      title: 'FUN SHEETS',
      icon: '📝',
      path: '/worksheets',
      className: 'worksheets',
      color: 'var(--accent-pink)',
      bg: 'var(--accent-pink-pale)',
      description: 'Practice more'
    },
  ];

  return (
    <div className="student-dashboard-arşa">
      {/* HERO SECTION */}
      <section className="dashboard-hero-section">
        <div className="hero-main-card">
          <div className="hero-visual">
            <div
              className="dashboard-avatar-ring"
              onClick={() => setShowAvatarPicker(true)}
            >
              <div className="avatar-display">
                {userProfile?.avatar_url || '👤'}
              </div>
              <div className="edit-hint">EDIT</div>
            </div>
            <div className="experience-circle-bg"></div>
          </div>

          <div className="hero-text-content">
            <h1 className="arşa-title">Welcome back, <span>{userProfile?.display_name || 'Adventurer'}</span>! 🌈</h1>
            <p className="arşa-subtitle">Ready to continue your magnificent learning adventure?</p>

            {isAdmin && (
              <Link to="/admin" className="dashboard-admin-btn" title="Admin Panel">
                <Shield size={20} />
                <span>Admin Panel</span>
              </Link>
            )}
            <div className="hero-pills-row">
              <div className="hero-pill xp-pill" title="Total Experience">
                <Trophy size={18} />
                <div className="pill-data">
                  <span className="pill-val">{stats.xp}</span>
                  <span className="pill-label">XP</span>
                </div>
              </div>
              <div className="hero-pill streak-pill" title="Login Streak">
                <Flame size={18} />
                <div className="pill-data">
                  <span className="pill-val">{stats.streakDays}</span>
                  <span className="pill-label">DAYS</span>
                </div>
              </div>
              <div className="hero-pill level-pill" title="Current Level">
                <Star size={18} />
                <div className="pill-data">
                  <span className="pill-val">{stats.level}</span>
                  <span className="pill-label">LEVEL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions-section">
        <div className="section-header-modern">
          <Star className="icon-star-spin" size={24} />
          <h2>Quick Actions</h2>
        </div>
        <div className="arşa-action-grid">
          {actionItems.map((item, index) => (
            <Link key={index} to={item.path} className={`arşa-card ${item.className}`}>
              <div className="arşa-icon-wrapper" style={{ backgroundColor: item.bg }}>
                <span>{item.icon}</span>
              </div>
              <div className="arşa-card-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="arşa-layout-grid">
        <main className="arşa-content-main">
          {/* DAILY CHALLENGE */}
          <DailyChallenge />

          {/* ADVENTURE MAP */}
          <section className="arşa-section">
            <div className="section-header-modern">
              <Map size={24} />
              <h2>Learning Journey</h2>
            </div>
            <div className="arşa-map-container">
              <ProgressMap />
            </div>
          </section>
        </main>

        <aside className="arşa-content-aside">
          {/* Pet system hidden for now - will be replaced later */}
          <Leaderboard />
        </aside>
      </div>

      {/* FULL WIDTH ACHIEVEMENTS */}
      <section className="arşa-section full-width-section">
        <div className="section-header-modern">
          <Award size={24} />
          <h2>My Achievements</h2>
        </div>
        <BadgeShowcase />
      </section>

      {showAvatarPicker && <AvatarPicker onClose={() => setShowAvatarPicker(false)} />}
    </div>
  );
};

export default StudentDashboard;
