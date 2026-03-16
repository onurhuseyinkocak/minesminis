import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  const stats = [
    { icon: Users, label: 'Active Students', value: '24', color: 'var(--accent-indigo)' },
    { icon: TrendingUp, label: 'Engagement Rate', value: '85%', color: 'var(--accent-emerald)' },
    { icon: BookOpen, label: 'Active Lessons', value: '12', color: 'var(--warning)' },
    { icon: Award, label: 'Completed Tasks', value: '156', color: 'var(--accent-pink)' },
  ];

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="glow-text">Welcome back, {userProfile?.display_name || 'Teacher'}! 👨‍🏫</h1>
          <p className="dashboard-subtitle">Here's what's happening in your classroom today</p>
        </div>
        <button className="premium-btn premium-btn-primary">
          🎯 Start Smart Board Mode
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card premium-card">
            <div className="stat-icon" style={{ background: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section premium-card">
          <h2>📊 Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn premium-btn premium-btn-primary">
              📝 Create Lesson
            </button>
            <button className="action-btn premium-btn premium-btn-secondary">
              📋 Assign Homework
            </button>
            <button className="action-btn premium-btn premium-btn-primary">
              📊 Start Poll
            </button>
            <button className="action-btn premium-btn premium-btn-secondary">
              🎲 Random Picker
            </button>
          </div>
        </div>

        <div className="dashboard-section premium-card">
          <h2>👥 Live Student Activity</h2>
          <div className="student-activity">
            <p className="placeholder-text">Students will appear here when they're online</p>
          </div>
        </div>

        <div className="dashboard-section premium-card">
          <h2>📚 Recent Lessons</h2>
          <div className="recent-lessons">
            <p className="placeholder-text">Your recent lessons will appear here</p>
          </div>
        </div>

        <div className="dashboard-section premium-card">
          <h2>⏰ Today's Schedule</h2>
          <div className="schedule">
            <p className="placeholder-text">Your schedule for today</p>
          </div>
        </div>
      </div>

      <style>{`
        .teacher-dashboard {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .dashboard-subtitle {
          color: var(--slate);
          font-size: 1.1rem;
          margin-top: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .stat-label {
          color: var(--slate);
          font-size: 0.9rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .dashboard-section h2 {
          font-size: 1.25rem;
          margin-bottom: 20px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          justify-content: center;
        }

        .placeholder-text {
          color: var(--stone);
          text-align: center;
          padding: 40px 20px;
        }

        @media (max-width: 768px) {
          .teacher-dashboard {
            padding: 20px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
