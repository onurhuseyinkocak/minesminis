import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, GamepadIcon, Video, FileText, Trophy, Flame, Star } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const { userProfile, user } = useAuth();

  const menuItems = [
    {
      title: 'Games',
      icon: GamepadIcon,
      path: '/games',
      color: '#4A5B8C',
      bgColor: '#E8ECF4',
      description: 'Play fun learning games'
    },
    {
      title: 'Worksheets',
      icon: FileText,
      path: '/worksheets',
      color: '#6BA494',
      bgColor: '#E8F4F0',
      description: 'Practice with worksheets'
    },
    {
      title: 'Dictionary',
      icon: BookOpen,
      path: '/words',
      color: '#8474A4',
      bgColor: '#F0ECF4',
      description: 'Learn new words'
    },
    {
      title: 'Videos',
      icon: Video,
      path: '/videos',
      color: '#C47474',
      bgColor: '#F4ECEC',
      description: 'Watch educational videos'
    },
    {
      title: 'My Progress',
      icon: Trophy,
      path: '/profile',
      color: '#7494A4',
      bgColor: '#ECF0F4',
      description: 'Track your achievements'
    },
  ];

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="mascot-star">
            <Star size={56} strokeWidth={2} />
          </div>
          <h1 className="welcome-title">
            {user ? (
              <>Welcome back, {userProfile?.display_name || 'Friend'}! 🎉</>
            ) : (
              <>Welcome to MinesMinis! 🚀</>
            )}
          </h1>
          <p className="welcome-subtitle">
            {user ? 'Ready to learn something amazing today?' : 'Start your English learning adventure today!'}
          </p>
        </div>

        {user && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon coral">
                <Trophy size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{userProfile?.points || 0}</div>
                <div className="stat-label">Points</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon mint">
                <Flame size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{userProfile?.streak_days || 0}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon navy">
                <Star size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{userProfile?.level || 1}</div>
                <div className="stat-label">Level</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="menu-card">
            <div
              className="menu-icon-wrapper"
              style={{ backgroundColor: item.bgColor, color: item.color }}
            >
              <item.icon size={40} strokeWidth={2} />
            </div>
            <div className="menu-content">
              <h3 className="menu-title">{item.title}</h3>
              <p className="menu-description">{item.description}</p>
            </div>
            <div className="menu-arrow" style={{ color: item.color }}>→</div>
          </Link>
        ))}
      </div>

      {user && (
        <div className="daily-challenge">
          <div className="challenge-header">
            <h2>Today's Challenge</h2>
            <span className="challenge-badge">+100 Points</span>
          </div>
          <p className="challenge-text">Complete 3 games and earn bonus points!</p>
          <div className="challenge-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '33%' }}></div>
            </div>
            <span className="progress-text">1 / 3 completed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
