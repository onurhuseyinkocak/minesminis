/**
 * TEACHER DASHBOARD PAGE
 * Teacher-focused dashboard with classroom overview, quick actions,
 * and getting-started guidance for new teachers.
 */

import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { WORLDS } from '../../data/curriculum';
import {
  getClassrooms,
  createClassroom,
  type Classroom,
} from '../../services/classroomService';
import ClassroomManager from './ClassroomManager';
import {
  BookOpen,
  Award,
  Users,
  Gamepad2,
  Video,
  FileText,
  Settings,
  Plus,
  GraduationCap,
  Lightbulb,
  Copy,
  Check,
  BarChart3,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherDashboard: React.FC = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const { stats, loading } = useGamification();
  const teacherId = user?.uid || '';

  const [activeTab, setActiveTab] = useState<'overview' | 'classrooms'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load classrooms
  const classrooms = useMemo(() => getClassrooms(teacherId), [teacherId]);

  // Quick stats
  const totalStudents = useMemo(
    () => classrooms.reduce((sum, c) => sum + c.students.length, 0),
    [classrooms],
  );
  const activeToday = useMemo(() => {
    const today = new Date().toDateString();
    return classrooms.reduce(
      (sum, c) =>
        sum +
        c.students.filter(
          (s) => new Date(s.lastActive).toDateString() === today,
        ).length,
      0,
    );
  }, [classrooms]);

  // Copy join code
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast.success('Join code copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }, []);

  // Quick-create classroom
  const handleQuickCreate = useCallback(() => {
    setActiveTab('classrooms');
  }, []);

  if (loading) {
    return (
      <div className="teacher-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#94A3B8', fontSize: 16 }}>Loading dashboard...</p>
      </div>
    );
  }

  const hasClassrooms = classrooms.length > 0;

  return (
    <div className="teacher-dashboard">
      {/* ─── HEADER ─── */}
      <div className="td-header">
        <div>
          <h1 className="td-welcome">
            Welcome back, {userProfile?.display_name || 'Teacher'}!
          </h1>
          <p className="td-subtitle">
            Level {stats.level} &middot; {stats.xp.toLocaleString()} XP &middot;{' '}
            {stats.streakDays}-day streak
          </p>
        </div>
        <div className="td-header-actions">
          {isAdmin && (
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <button className="td-btn td-btn--secondary">
                <Settings size={16} />
                Admin Panel
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ─── TAB SWITCHER ─── */}
      <div className="td-tabs">
        <button
          className={`td-tab ${activeTab === 'overview' ? 'td-tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Overview
        </button>
        <button
          className={`td-tab ${activeTab === 'classrooms' ? 'td-tab--active' : ''}`}
          onClick={() => setActiveTab('classrooms')}
        >
          <GraduationCap size={16} />
          Classrooms
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* ─── QUICK STATS ─── */}
          <div className="td-stats-grid">
            <div className="td-stat-card">
              <div className="td-stat-icon" style={{ background: '#6366F1' }}>
                <GraduationCap size={22} color="white" />
              </div>
              <div className="td-stat-info">
                <div className="td-stat-value">{classrooms.length}</div>
                <div className="td-stat-label">Classrooms</div>
              </div>
            </div>
            <div className="td-stat-card">
              <div className="td-stat-icon" style={{ background: '#10B981' }}>
                <Users size={22} color="white" />
              </div>
              <div className="td-stat-info">
                <div className="td-stat-value">{totalStudents}</div>
                <div className="td-stat-label">Total Students</div>
              </div>
            </div>
            <div className="td-stat-card">
              <div className="td-stat-icon" style={{ background: '#F59E0B' }}>
                <Award size={22} color="white" />
              </div>
              <div className="td-stat-info">
                <div className="td-stat-value">{activeToday}</div>
                <div className="td-stat-label">Active Today</div>
              </div>
            </div>
            <div className="td-stat-card">
              <div className="td-stat-icon" style={{ background: '#EC4899' }}>
                <BookOpen size={22} color="white" />
              </div>
              <div className="td-stat-info">
                <div className="td-stat-value">{WORLDS.length}</div>
                <div className="td-stat-label">Worlds Available</div>
              </div>
            </div>
          </div>

          {/* ─── SHARE YOUR CODE (if classrooms exist) ─── */}
          {hasClassrooms && (
            <div className="td-share-section">
              <h2>
                <Copy size={18} />
                Share Your Classroom Code
              </h2>
              <div className="td-share-codes">
                {classrooms.map((c) => (
                  <div key={c.id} className="td-share-card">
                    <div className="td-share-name">{c.name}</div>
                    <div className="td-share-grade">{c.gradeLevel}</div>
                    <div className="td-share-code-row">
                      <span className="td-share-code">{c.joinCode}</span>
                      <button
                        className={`td-share-copy ${copiedCode === c.joinCode ? 'td-share-copy--done' : ''}`}
                        onClick={() => handleCopyCode(c.joinCode)}
                      >
                        {copiedCode === c.joinCode ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="td-share-students">
                      <Users size={12} /> {c.students.length} students
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── QUICK ACTIONS ─── */}
          <div className="td-section">
            <h2>
              <Layers size={18} />
              Quick Actions
            </h2>
            <div className="td-actions-grid">
              <button className="td-action-card" onClick={handleQuickCreate}>
                <div className="td-action-icon" style={{ background: '#EEF2FF' }}>
                  <Plus size={22} color="#6366F1" />
                </div>
                <span className="td-action-label">Create Classroom</span>
              </button>
              <button
                className="td-action-card"
                onClick={() => setActiveTab('classrooms')}
              >
                <div className="td-action-icon" style={{ background: '#F0FDF4' }}>
                  <BarChart3 size={22} color="#10B981" />
                </div>
                <span className="td-action-label">View Reports</span>
              </button>
              <Link to="/words" className="td-action-card" style={{ textDecoration: 'none' }}>
                <div className="td-action-icon" style={{ background: '#FFF7ED' }}>
                  <BookOpen size={22} color="#F59E0B" />
                </div>
                <span className="td-action-label">Browse Content</span>
              </Link>
              <Link to="/games" className="td-action-card" style={{ textDecoration: 'none' }}>
                <div className="td-action-icon" style={{ background: '#FDF2F8' }}>
                  <Gamepad2 size={22} color="#EC4899" />
                </div>
                <span className="td-action-label">Games Library</span>
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin/words" className="td-action-card" style={{ textDecoration: 'none' }}>
                    <div className="td-action-icon" style={{ background: '#F5F3FF' }}>
                      <FileText size={22} color="#8B5CF6" />
                    </div>
                    <span className="td-action-label">Manage Words</span>
                  </Link>
                  <Link to="/admin/videos" className="td-action-card" style={{ textDecoration: 'none' }}>
                    <div className="td-action-icon" style={{ background: '#ECFDF5' }}>
                      <Video size={22} color="#059669" />
                    </div>
                    <span className="td-action-label">Manage Videos</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ─── GETTING STARTED (no classrooms) ─── */}
          {!hasClassrooms && (
            <div className="td-getting-started">
              <div className="td-gs-icon">
                <Lightbulb size={36} color="#F59E0B" />
              </div>
              <h2>Getting Started</h2>
              <p>Welcome to MinesMinis! Here's how to set up your classroom:</p>
              <div className="td-gs-steps">
                <div className="td-gs-step">
                  <span className="td-gs-num">1</span>
                  <div>
                    <strong>Create a Classroom</strong>
                    <p>Click "Create Classroom" and enter a name and grade level.</p>
                  </div>
                </div>
                <div className="td-gs-step">
                  <span className="td-gs-num">2</span>
                  <div>
                    <strong>Share the Join Code</strong>
                    <p>Give students the 6-character code so they can join your class.</p>
                  </div>
                </div>
                <div className="td-gs-step">
                  <span className="td-gs-num">3</span>
                  <div>
                    <strong>Assign a Phonics Group</strong>
                    <p>Select which world/unit your class should focus on.</p>
                  </div>
                </div>
                <div className="td-gs-step">
                  <span className="td-gs-num">4</span>
                  <div>
                    <strong>Track Progress</strong>
                    <p>View student progress, leaderboards, and activity right here.</p>
                  </div>
                </div>
              </div>
              <button className="td-gs-cta" onClick={handleQuickCreate}>
                <Plus size={18} />
                Create Your First Classroom
              </button>
            </div>
          )}

          {/* ─── MY CLASSROOMS PREVIEW (if any) ─── */}
          {hasClassrooms && (
            <div className="td-section">
              <div className="td-section-header">
                <h2>
                  <GraduationCap size={18} />
                  My Classrooms
                </h2>
                <button
                  className="td-btn td-btn--link"
                  onClick={() => setActiveTab('classrooms')}
                >
                  View All
                </button>
              </div>
              <div className="td-classroom-preview">
                {classrooms.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="td-preview-card"
                    onClick={() => setActiveTab('classrooms')}
                  >
                    <div className="td-preview-name">{c.name}</div>
                    <div className="td-preview-meta">
                      <span>{c.gradeLevel}</span>
                      <span>
                        <Users size={12} /> {c.students.length}
                      </span>
                    </div>
                    <div className="td-preview-world">
                      {WORLDS[c.phonicsGroupAssigned - 1]?.icon}{' '}
                      {WORLDS[c.phonicsGroupAssigned - 1]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ─── CLASSROOMS TAB ─── */
        <ClassroomManager />
      )}

      <style>{`
        .teacher-dashboard {
          padding: 32px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .td-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .td-welcome {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-heading, #1e293b);
        }
        .td-subtitle {
          color: var(--text-muted, #64748B);
          font-size: 1rem;
          margin-top: 4px;
        }
        .td-header-actions {
          display: flex;
          gap: 10px;
        }
        .td-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .td-btn--secondary {
          background: var(--bg-card, #fff);
          color: var(--text-body, #334155);
          border: 1px solid var(--border-light, #e2e8f0);
        }
        .td-btn--secondary:hover {
          background: var(--bg-hover, #f1f5f9);
        }
        .td-btn--link {
          background: none;
          color: var(--primary, #6366F1);
          padding: 4px 8px;
          font-size: 0.85rem;
        }
        .td-btn--link:hover {
          text-decoration: underline;
        }

        /* Tabs */
        .td-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 28px;
          background: var(--bg-hover, #f1f5f9);
          border-radius: 12px;
          padding: 4px;
          width: fit-content;
        }
        .td-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: var(--text-muted, #64748B);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .td-tab--active {
          background: var(--bg-card, #fff);
          color: var(--primary, #6366F1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        /* Stats Grid */
        .td-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .td-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: var(--bg-card, #fff);
          border-radius: 14px;
          border: 1px solid var(--border-light, #e2e8f0);
        }
        .td-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .td-stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-heading, #1e293b);
          font-family: var(--font-heading);
        }
        .td-stat-label {
          color: var(--text-muted, #64748B);
          font-size: 0.85rem;
        }

        /* Share Section */
        .td-share-section {
          margin-bottom: 28px;
        }
        .td-share-section h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          margin-bottom: 14px;
          color: var(--text-heading, #1e293b);
        }
        .td-share-codes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .td-share-card {
          padding: 16px 20px;
          background: linear-gradient(135deg, #EEF2FF, #F0F9FF);
          border-radius: 14px;
          border: 1px solid #C7D2FE;
        }
        .td-share-name {
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 2px;
          color: var(--text-heading, #1e293b);
        }
        .td-share-grade {
          font-size: 0.8rem;
          color: var(--text-muted, #64748B);
          margin-bottom: 10px;
        }
        .td-share-code-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .td-share-code {
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary, #6366F1);
          letter-spacing: 3px;
        }
        .td-share-copy {
          border: none;
          background: white;
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          color: var(--primary, #6366F1);
          transition: all 0.15s;
        }
        .td-share-copy:hover {
          background: var(--primary, #6366F1);
          color: white;
        }
        .td-share-copy--done {
          background: #10B981;
          color: white;
        }
        .td-share-students {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--text-muted, #64748B);
        }

        /* Section */
        .td-section {
          margin-bottom: 28px;
        }
        .td-section h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          margin-bottom: 14px;
          color: var(--text-heading, #1e293b);
        }
        .td-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .td-section-header h2 {
          margin-bottom: 0;
        }

        /* Quick Actions */
        .td-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }
        .td-action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 12px;
          background: var(--bg-card, #fff);
          border-radius: 14px;
          border: 1px solid var(--border-light, #e2e8f0);
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-heading, #1e293b);
        }
        .td-action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border-color: var(--primary, #6366F1);
        }
        .td-action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .td-action-label {
          font-weight: 600;
          font-size: 0.85rem;
          text-align: center;
        }

        /* Getting Started */
        .td-getting-started {
          background: var(--bg-card, #fff);
          border-radius: 16px;
          border: 1px solid var(--border-light, #e2e8f0);
          padding: 36px;
          margin-bottom: 28px;
          text-align: center;
        }
        .td-gs-icon {
          margin-bottom: 12px;
        }
        .td-getting-started h2 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: var(--text-heading, #1e293b);
        }
        .td-getting-started > p {
          color: var(--text-muted, #64748B);
          margin-bottom: 24px;
        }
        .td-gs-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          text-align: left;
          margin-bottom: 28px;
        }
        .td-gs-step {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: var(--bg-hover, #f8fafc);
          border-radius: 12px;
        }
        .td-gs-num {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          background: var(--primary, #6366F1);
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .td-gs-step strong {
          display: block;
          margin-bottom: 4px;
          font-size: 0.9rem;
          color: var(--text-heading, #1e293b);
        }
        .td-gs-step p {
          color: var(--text-muted, #64748B);
          font-size: 0.82rem;
          margin: 0;
        }
        .td-gs-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border: none;
          border-radius: 12px;
          background: var(--primary, #6366F1);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .td-gs-cta:hover {
          background: var(--primary-dark, #4F46E5);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
        }

        /* Classroom Preview */
        .td-classroom-preview {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .td-preview-card {
          padding: 16px 20px;
          background: var(--bg-card, #fff);
          border-radius: 14px;
          border: 1px solid var(--border-light, #e2e8f0);
          cursor: pointer;
          transition: all 0.2s;
        }
        .td-preview-card:hover {
          border-color: var(--primary, #6366F1);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .td-preview-name {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 6px;
          color: var(--text-heading, #1e293b);
        }
        .td-preview-meta {
          display: flex;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--text-muted, #64748B);
          margin-bottom: 6px;
        }
        .td-preview-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .td-preview-world {
          font-size: 0.82rem;
          color: var(--text-body, #334155);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .teacher-dashboard {
            padding: 20px 16px;
          }
          .td-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .td-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .td-gs-steps {
            grid-template-columns: 1fr;
          }
          .td-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
