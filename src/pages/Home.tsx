import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
      description: 'Play fun learning games'
    },
    {
      title: 'Worksheets',
      icon: FileText,
      path: '/worksheets',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
      description: 'Practice with worksheets'
    },
    {
      title: 'Dictionary',
      icon: BookOpen,
      path: '/words',
      gradient: 'linear-gradient(135deg, #84CC16 0%, #14B8A6 100%)',
      description: 'Learn new words'
    },
    {
      title: 'Videos',
      icon: Video,
      path: '/videos',
      gradient: 'linear-gradient(135deg, #FB923C 0%, #EF4444 100%)',
      description: 'Watch educational videos'
    },
    {
      title: 'My Progress',
      icon: Trophy,
      path: '/profile',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      description: 'Track your achievements'
    },
  ];

  return (
    <div className="home-page">
      <motion.div
        className="welcome-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-content">
          <motion.div
            className="mascot-bounce"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="mascot-icon" size={64} />
          </motion.div>
          <h1 className="welcome-title glow-text">
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
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FCD34D, #FB923C)' }}>
                <Trophy size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{userProfile?.points || 0}</div>
                <div className="stat-label">Points</div>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #FB923C)' }}>
                <Flame size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{userProfile?.streak_days || 0}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>
                <Star size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{userProfile?.level || 1}</div>
                <div className="stat-label">Level</div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={item.path} className="menu-card premium-card">
              <motion.div
                className="menu-card-inner"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="menu-icon-wrapper"
                  style={{ background: item.gradient }}
                >
                  <item.icon size={48} strokeWidth={2.5} />
                </div>
                <h3 className="menu-title">{item.title}</h3>
                <p className="menu-description">{item.description}</p>
                <div className="menu-arrow">→</div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {user && (
        <motion.div
          className="daily-challenge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
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
        </motion.div>
      )}
    </div>
  );
};

export default Home;
