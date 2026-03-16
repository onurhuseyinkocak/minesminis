import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Gamepad2, Video, FileText, Trophy, Flame, Crown, Zap, Rocket, ArrowRight } from 'lucide-react';

const Home = () => {
  const { userProfile, user } = useAuth();

  const quickActions = [
    { title: 'Games', icon: Gamepad2, path: '/games', color: 'purple', desc: 'Play & learn' },
    { title: 'Dictionary', icon: BookOpen, path: '/words', color: 'gold', desc: 'New words' },
    { title: 'Videos', icon: Video, path: '/videos', color: 'coral', desc: 'Watch & learn' },
    { title: 'Worksheets', icon: FileText, path: '/worksheets', color: 'green', desc: 'Practice' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="home-page">
      {/* Welcome Banner */}
      <div className="home-welcome">
        <div className="home-welcome-text">
          <h1>
            {user
              ? `${getGreeting()}, ${userProfile?.display_name || 'Friend'}!`
              : 'Welcome to MinesMinis!'}
          </h1>
          <p>
            {user
              ? 'Ready to learn something amazing today?'
              : 'Start your English learning adventure today!'}
          </p>
        </div>
        <div className="home-welcome-action">
          {user ? (
            <Link to="/games" className="home-cta-btn">
              <Zap size={18} /> Let's Play
            </Link>
          ) : (
            <Link to="/login" className="home-cta-btn">
              <Rocket size={18} /> Join Now
            </Link>
          )}
        </div>
      </div>

      {/* Stats (logged in only) */}
      {user && (
        <div className="home-stats">
          <div className="home-stat">
            <div className="home-stat-icon purple">
              <Trophy size={20} />
            </div>
            <div className="home-stat-info">
              <span className="home-stat-value">{userProfile?.points?.toLocaleString() || 0}</span>
              <span className="home-stat-label">Points</span>
            </div>
          </div>
          <div className="home-stat">
            <div className="home-stat-icon coral">
              <Flame size={20} />
            </div>
            <div className="home-stat-info">
              <span className="home-stat-value">{userProfile?.streak_days || 0}</span>
              <span className="home-stat-label">Streak</span>
            </div>
          </div>
          <div className="home-stat">
            <div className="home-stat-icon gold">
              <Crown size={20} />
            </div>
            <div className="home-stat-info">
              <span className="home-stat-value">Lv.{userProfile?.level || 1}</span>
              <span className="home-stat-label">Level</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="home-actions">
        {quickActions.map((item) => (
          <Link key={item.path} to={item.path} className="home-action-card">
            <div className={`home-action-icon ${item.color}`}>
              <item.icon size={28} strokeWidth={2.5} />
            </div>
            <div className="home-action-text">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
            <ArrowRight size={18} className="home-action-arrow" />
          </Link>
        ))}
      </div>

      {/* Daily Challenge */}
      {user && (
        <div className="home-challenge">
          <div className="home-challenge-header">
            <div className="home-challenge-title">
              <Zap size={20} />
              <h2>Today's Challenge</h2>
            </div>
            <span className="home-challenge-reward">+100 pts</span>
          </div>
          <p className="home-challenge-desc">Complete 3 games and earn bonus points!</p>
          <div className="home-challenge-progress">
            <div className="home-progress-bar">
              <div className="home-progress-fill" style={{ width: '33%' }} />
            </div>
            <span className="home-progress-text">1 / 3</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
