import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, GamepadIcon, Video, FileText, Trophy, Flame, Star, ArrowRight, Sparkles } from 'lucide-react';
import './Home.css';

import ataturkFormal from '@assets/ataturk_images/ataturk-formal.png';
import ataturkSignature from '@assets/ataturk_images/ataturk-signature.png';

const Home: React.FC = () => {
  const { userProfile, user } = useAuth();

  const menuItems = [
    {
      title: 'Games',
      icon: GamepadIcon,
      path: '/games',
      colorClass: 'purple',
      description: 'Play fun learning games'
    },
    {
      title: 'Worksheets',
      icon: FileText,
      path: '/worksheets',
      colorClass: 'teal',
      description: 'Practice with worksheets'
    },
    {
      title: 'Dictionary',
      icon: BookOpen,
      path: '/words',
      colorClass: 'yellow',
      description: 'Learn new words'
    },
    {
      title: 'Videos',
      icon: Video,
      path: '/videos',
      colorClass: 'coral',
      description: 'Watch educational videos'
    },
    {
      title: 'My Progress',
      icon: Trophy,
      path: '/profile',
      colorClass: 'pink',
      description: 'Track your achievements'
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Grid - Welcome + Atatürk Side by Side */}
      <div className="hero-grid">
        {/* Welcome Section - Smaller */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="mascot-star">
              <Star size={48} strokeWidth={2} />
            </div>
            <h1 className="welcome-title">
              {user ? (
                <>Welcome back, {userProfile?.display_name || 'Friend'}!</>
              ) : (
                <>Welcome to MinesMinis!</>
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
                  <Trophy size={20} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{userProfile?.points || 0}</div>
                  <div className="stat-label">Points</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon mint">
                  <Flame size={20} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{userProfile?.streak_days || 0}</div>
                  <div className="stat-label">Streak</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon navy">
                  <Star size={20} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{userProfile?.level || 1}</div>
                  <div className="stat-label">Level</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Atatürk Corner - Larger, More Prominent */}
        <Link to="/ataturk" className="ataturk-corner">
          <div className="ataturk-pattern"></div>
          <img src={ataturkFormal} alt="Atatürk" className="ataturk-hero-image" />
          <div className="ataturk-content">
            <div className="ataturk-flag-section">
              <div className="turkish-flag">
                <div className="flag-bg"></div>
                <div className="flag-crescent"></div>
                <div className="flag-star"></div>
              </div>
            </div>
            <div className="ataturk-text">
              <div className="ataturk-badge">
                <Sparkles size={14} />
                <span>Sevgili Liderimiz</span>
              </div>
              <h2 className="ataturk-title">Mustafa Kemal Atatürk</h2>
              <p className="ataturk-subtitle">Vatanımızı dönüştüren vizyoner liderimizi tanıyın</p>
              <img src={ataturkSignature} alt="İmza" className="ataturk-signature" />
            </div>
            <div className="ataturk-arrow">
              <ArrowRight size={24} />
            </div>
          </div>
          <div className="ataturk-quote">
            <span>"Yurtta sulh, cihanda sulh" - Peace at home, peace in the world</span>
          </div>
        </Link>
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="menu-card">
            <div className={`menu-icon-wrapper ${item.colorClass}`}>
              <item.icon size={40} strokeWidth={2} color="white" />
            </div>
            <div className="menu-content">
              <h3 className="menu-title">{item.title}</h3>
              <p className="menu-description">{item.description}</p>
            </div>
            <div className="menu-arrow">→</div>
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
