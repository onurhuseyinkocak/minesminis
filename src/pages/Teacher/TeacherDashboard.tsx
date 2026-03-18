/**
 * TEACHER DASHBOARD PAGE
 * Shows real platform data from GamificationContext and curriculum.
 * Links to admin tools. No hardcoded placeholder numbers.
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { WORLDS } from '../../data/curriculum';
import { BookOpen, Award, TrendingUp, Gamepad2, Video, FileText, Globe, Layers, Settings, BarChart3 } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { userProfile, isAdmin } = useAuth();
  const { stats, loading } = useGamification();

  // Derive real curriculum stats
  const curriculumStats = useMemo(() => {
    const totalLessons = WORLDS.reduce((sum, w) => sum + w.lessons.length, 0);
    const totalVocabulary = WORLDS.reduce((sum, w) => sum + w.vocabulary.length, 0);
    const totalActivities = WORLDS.reduce(
      (sum, w) => sum + w.lessons.reduce((ls, l) => ls + l.activities.length, 0),
      0,
    );
    return { totalWorlds: WORLDS.length, totalLessons, totalVocabulary, totalActivities };
  }, []);

  // Stats cards from real data
  const statCards = useMemo(() => [
    { icon: BookOpen, label: 'Words Learned', value: String(stats.wordsLearned), color: '#6366F1' },
    { icon: Gamepad2, label: 'Games Played', value: String(stats.gamesPlayed), color: '#10B981' },
    { icon: Video, label: 'Videos Watched', value: String(stats.videosWatched), color: '#F59E0B' },
    { icon: FileText, label: 'Worksheets Done', value: String(stats.worksheetsCompleted), color: '#EC4899' },
  ], [stats.wordsLearned, stats.gamesPlayed, stats.videosWatched, stats.worksheetsCompleted]);

  if (loading) {
    return (
      <div className="teacher-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#94A3B8', fontSize: 16 }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="glow-text">Welcome back, {userProfile?.display_name || 'Teacher'}!</h1>
          <p className="dashboard-subtitle">
            Level {stats.level} &mdash; {stats.xp.toLocaleString()} XP &mdash; {stats.streakDays}-day streak
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <button className="premium-btn premium-btn-primary">
              <Settings size={16} style={{ marginRight: 6 }} />
              Admin Panel
            </button>
          </Link>
        )}
      </div>

      {/* ---- STATS CARDS (real data) ---- */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
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
        {/* ---- QUICK ACTIONS ---- */}
        <div className="dashboard-section premium-card">
          <h2><BarChart3 size={20} style={{ marginRight: 8 }} />Quick Actions</h2>
          <div className="quick-actions">
            {isAdmin && (
              <>
                <Link to="/admin/words" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-primary">
                    <BookOpen size={16} style={{ marginRight: 6 }} />
                    Manage Words
                  </button>
                </Link>
                <Link to="/admin/games" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-secondary">
                    <Gamepad2 size={16} style={{ marginRight: 6 }} />
                    Manage Games
                  </button>
                </Link>
                <Link to="/admin/videos" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-primary">
                    <Video size={16} style={{ marginRight: 6 }} />
                    Manage Videos
                  </button>
                </Link>
                <Link to="/admin/worksheets" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-secondary">
                    <FileText size={16} style={{ marginRight: 6 }} />
                    Manage Worksheets
                  </button>
                </Link>
              </>
            )}
            {!isAdmin && (
              <>
                <Link to="/words" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-primary">
                    <BookOpen size={16} style={{ marginRight: 6 }} />
                    Browse Words
                  </button>
                </Link>
                <Link to="/games" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-secondary">
                    <Gamepad2 size={16} style={{ marginRight: 6 }} />
                    Play Games
                  </button>
                </Link>
                <Link to="/videos" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-primary">
                    <Video size={16} style={{ marginRight: 6 }} />
                    Watch Videos
                  </button>
                </Link>
                <Link to="/classroom" style={{ textDecoration: 'none' }}>
                  <button className="action-btn premium-btn premium-btn-secondary">
                    <Layers size={16} style={{ marginRight: 6 }} />
                    Classroom Mode
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ---- STUDENT ACTIVITY ---- */}
        <div className="dashboard-section premium-card">
          <h2><TrendingUp size={20} style={{ marginRight: 8 }} />Student Activity</h2>
          <div className="student-activity" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: 12 }}>
              Student activity tracking coming soon.
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Real-time monitoring of student progress and online status will be available in a future update.
            </p>
          </div>
        </div>

        {/* ---- CURRICULUM OVERVIEW (real data from curriculum.ts) ---- */}
        <div className="dashboard-section premium-card">
          <h2><Globe size={20} style={{ marginRight: 8 }} />Curriculum Overview</h2>
          <div className="curriculum-overview">
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Worlds</span>
              <span className="curriculum-stat-value">{curriculumStats.totalWorlds}</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Lessons</span>
              <span className="curriculum-stat-value">{curriculumStats.totalLessons}</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Vocabulary Words</span>
              <span className="curriculum-stat-value">{curriculumStats.totalVocabulary}</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Activities</span>
              <span className="curriculum-stat-value">{curriculumStats.totalActivities}</span>
            </div>

            <div style={{ marginTop: 16 }}>
              <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Worlds:
              </p>
              <div className="world-chips">
                {WORLDS.map(w => (
                  <span key={w.id} className="world-chip" style={{ background: w.color + '22', color: w.color, border: `1px solid ${w.color}44` }}>
                    {w.icon} {w.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- CONTENT STATS ---- */}
        <div className="dashboard-section premium-card">
          <h2><Award size={20} style={{ marginRight: 8 }} />Platform Stats</h2>
          <div className="curriculum-overview">
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Your Level</span>
              <span className="curriculum-stat-value">{stats.level}</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Total XP</span>
              <span className="curriculum-stat-value">{stats.xp.toLocaleString()}</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Weekly XP</span>
              <span className="curriculum-stat-value">{stats.weekly_xp.toLocaleString()}</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Streak</span>
              <span className="curriculum-stat-value">{stats.streakDays} days</span>
            </div>
            <div className="curriculum-stat-row">
              <span className="curriculum-stat-label">Badges Earned</span>
              <span className="curriculum-stat-value">{stats.badges.length}</span>
            </div>
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
          color: #64748B;
          font-size: 1.1rem;
          margin-top: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .stat-label {
          color: #64748B;
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
          display: flex;
          align-items: center;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .quick-actions a {
          display: block;
        }

        .action-btn {
          width: 100%;
          justify-content: center;
          display: flex;
          align-items: center;
        }

        .curriculum-overview {
          padding: 4px 0;
        }

        .curriculum-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .curriculum-stat-row:last-child {
          border-bottom: none;
        }

        .curriculum-stat-label {
          color: #64748B;
          font-size: 0.9rem;
        }

        .curriculum-stat-value {
          font-weight: 700;
          font-size: 1rem;
          color: #1e293b;
        }

        .world-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .world-chip {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
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

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
