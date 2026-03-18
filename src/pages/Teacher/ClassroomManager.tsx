/**
 * CLASSROOM MANAGER
 * Full classroom management page for teachers.
 * Create classrooms, view students, assign phonics groups, leaderboards.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { WORLDS } from '../../data/curriculum';
import {
  createClassroom,
  getClassrooms,
  assignPhonicsGroup,
  removeStudent,
  getClassLeaderboard,
  deleteClassroom,
  type Classroom,
} from '../../services/classroomService';
import {
  Plus,
  Users,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Trophy,
  Trash2,
  BookOpen,
  X,
  GraduationCap,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Grade Levels ─────────────────────────────────────────────────────────────

const GRADE_LEVELS = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
];

// ─── Component ────────────────────────────────────────────────────────────────

const ClassroomManager: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.uid || '';

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState(GRADE_LEVELS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load classrooms
  const refresh = useCallback(() => {
    if (teacherId) {
      setClassrooms(getClassrooms(teacherId));
    }
  }, [teacherId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Create classroom
  const handleCreate = useCallback(() => {
    if (!newName.trim()) {
      toast.error('Please enter a classroom name');
      return;
    }
    const created = createClassroom(teacherId, newName.trim(), newGrade);
    toast.success(`Classroom "${created.name}" created!`);
    setShowCreateModal(false);
    setNewName('');
    setNewGrade(GRADE_LEVELS[0]);
    refresh();
    setExpandedId(created.id);
  }, [teacherId, newName, newGrade, refresh]);

  // Copy join code
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast.success('Join code copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }, []);

  // Assign phonics group
  const handleAssignGroup = useCallback(
    (classroomId: string, group: number) => {
      assignPhonicsGroup(classroomId, group);
      toast.success(`Phonics group updated to World ${group}`);
      refresh();
    },
    [refresh],
  );

  // Remove student
  const handleRemoveStudent = useCallback(
    (classroomId: string, studentId: string, studentName: string) => {
      if (window.confirm(`Remove ${studentName} from this classroom?`)) {
        removeStudent(classroomId, studentId);
        toast.success(`${studentName} removed`);
        refresh();
      }
    },
    [refresh],
  );

  // Delete classroom
  const handleDeleteClassroom = useCallback(
    (classroomId: string, classroomName: string) => {
      if (window.confirm(`Delete "${classroomName}"? This cannot be undone.`)) {
        deleteClassroom(teacherId, classroomId);
        toast.success(`"${classroomName}" deleted`);
        if (expandedId === classroomId) setExpandedId(null);
        refresh();
      }
    },
    [teacherId, expandedId, refresh],
  );

  // World names for phonics group dropdown
  const worldOptions = useMemo(
    () =>
      WORLDS.map((w, i) => ({
        value: i + 1,
        label: `${w.icon} World ${i + 1}: ${w.name}`,
      })),
    [],
  );

  return (
    <div className="classroom-manager">
      {/* Header */}
      <div className="cm-header">
        <div>
          <h1 className="cm-title">
            <GraduationCap size={28} style={{ marginRight: 10 }} />
            My Classrooms
          </h1>
          <p className="cm-subtitle">
            {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''} &middot;{' '}
            {classrooms.reduce((s, c) => s + c.students.length, 0)} total students
          </p>
        </div>
        <button className="cm-create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create Classroom
        </button>
      </div>

      {/* Classroom Cards */}
      {classrooms.length === 0 ? (
        <div className="cm-empty">
          <GraduationCap size={48} color="#94A3B8" />
          <h3>No classrooms yet</h3>
          <p>Create your first classroom to get started!</p>
          <button className="cm-create-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            Create Classroom
          </button>
        </div>
      ) : (
        <div className="cm-cards">
          {classrooms.map((classroom) => {
            const isExpanded = expandedId === classroom.id;
            const leaderboard = isExpanded ? getClassLeaderboard(classroom.id) : [];
            const world = WORLDS[classroom.phonicsGroupAssigned - 1];

            return (
              <div key={classroom.id} className={`cm-card ${isExpanded ? 'cm-card--expanded' : ''}`}>
                {/* Card Header */}
                <div
                  className="cm-card-header"
                  onClick={() => setExpandedId(isExpanded ? null : classroom.id)}
                >
                  <div className="cm-card-info">
                    <h3 className="cm-card-name">{classroom.name}</h3>
                    <div className="cm-card-meta">
                      <span className="cm-badge cm-badge--grade">{classroom.gradeLevel}</span>
                      <span className="cm-badge cm-badge--students">
                        <Users size={12} /> {classroom.students.length}
                      </span>
                      {world && (
                        <span className="cm-badge cm-badge--world">
                          {world.icon} {world.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cm-card-actions">
                    <button
                      className={`cm-code-btn ${copiedCode === classroom.joinCode ? 'cm-code-btn--copied' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(classroom.joinCode);
                      }}
                      title="Copy join code"
                    >
                      {copiedCode === classroom.joinCode ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                      {classroom.joinCode}
                    </button>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="cm-card-body">
                    {/* Share Code Section */}
                    <div className="cm-share-section">
                      <Share2 size={18} />
                      <div className="cm-share-info">
                        <p className="cm-share-label">Share this code with your students:</p>
                        <div className="cm-share-code">{classroom.joinCode}</div>
                      </div>
                      <button
                        className="cm-share-copy"
                        onClick={() => handleCopyCode(classroom.joinCode)}
                      >
                        <Copy size={16} />
                        Copy Code
                      </button>
                    </div>

                    {/* Phonics Group Assignment */}
                    <div className="cm-section">
                      <h4>
                        <BookOpen size={16} /> Assigned Phonics Group
                      </h4>
                      <select
                        className="cm-select"
                        value={classroom.phonicsGroupAssigned}
                        onChange={(e) =>
                          handleAssignGroup(classroom.id, Number(e.target.value))
                        }
                      >
                        {worldOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Student List */}
                    <div className="cm-section">
                      <h4>
                        <Users size={16} /> Students ({classroom.students.length})
                      </h4>
                      {classroom.students.length === 0 ? (
                        <p className="cm-no-students">
                          No students yet. Share the join code to get started!
                        </p>
                      ) : (
                        <div className="cm-student-list">
                          {classroom.students.map((student) => {
                            const progressEntries = Object.values(student.phonicsProgress);
                            const avgProgress =
                              progressEntries.length > 0
                                ? Math.round(
                                    progressEntries.reduce((a, b) => a + b, 0) /
                                      progressEntries.length,
                                  )
                                : 0;

                            return (
                              <div key={student.id} className="cm-student-row">
                                <div className="cm-student-avatar">{student.avatar || '🧒'}</div>
                                <div className="cm-student-info">
                                  <span className="cm-student-name">{student.name}</span>
                                  <div className="cm-student-progress">
                                    <div className="cm-progress-bar">
                                      <div
                                        className="cm-progress-fill"
                                        style={{ width: `${avgProgress}%` }}
                                      />
                                    </div>
                                    <span className="cm-progress-text">{avgProgress}%</span>
                                  </div>
                                </div>
                                <span className="cm-student-xp">
                                  <Trophy size={12} /> {student.xp} XP
                                </span>
                                <button
                                  className="cm-student-remove"
                                  onClick={() =>
                                    handleRemoveStudent(classroom.id, student.id, student.name)
                                  }
                                  title="Remove student"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Leaderboard */}
                    {leaderboard.length > 0 && (
                      <div className="cm-section">
                        <h4>
                          <Trophy size={16} /> Class Leaderboard
                        </h4>
                        <div className="cm-leaderboard">
                          {leaderboard.map((student, index) => (
                            <div key={student.id} className="cm-lb-row">
                              <span className="cm-lb-rank">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </span>
                              <span className="cm-lb-avatar">{student.avatar || '🧒'}</span>
                              <span className="cm-lb-name">{student.name}</span>
                              <span className="cm-lb-xp">{student.xp} XP</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delete Classroom */}
                    <div className="cm-danger-zone">
                      <button
                        className="cm-delete-btn"
                        onClick={() => handleDeleteClassroom(classroom.id, classroom.name)}
                      >
                        <Trash2 size={14} />
                        Delete Classroom
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="cm-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-header">
              <h2>Create New Classroom</h2>
              <button className="cm-modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="cm-modal-body">
              <label className="cm-label">
                Classroom Name
                <input
                  type="text"
                  className="cm-input"
                  placeholder="e.g. Mrs. Smith's Class"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </label>
              <label className="cm-label">
                Grade Level
                <select
                  className="cm-select"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="cm-modal-footer">
              <button className="cm-btn-cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="cm-btn-create" onClick={handleCreate}>
                <Plus size={16} />
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .classroom-manager {
          padding: 32px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header */
        .cm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .cm-title {
          font-size: 1.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          color: var(--text-heading, #1e293b);
        }
        .cm-subtitle {
          color: var(--text-muted, #64748B);
          font-size: 0.95rem;
          margin-top: 4px;
        }
        .cm-create-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border: none;
          border-radius: 12px;
          background: var(--primary, #6366F1);
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cm-create-btn:hover {
          background: var(--primary-dark, #4F46E5);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        /* Empty State */
        .cm-empty {
          text-align: center;
          padding: 60px 20px;
          background: var(--bg-card, #fff);
          border-radius: 16px;
          border: 2px dashed var(--border-light, #e2e8f0);
        }
        .cm-empty h3 {
          margin: 16px 0 8px;
          font-size: 1.25rem;
          color: var(--text-heading, #1e293b);
        }
        .cm-empty p {
          color: var(--text-muted, #64748B);
          margin-bottom: 20px;
        }

        /* Cards */
        .cm-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cm-card {
          background: var(--bg-card, #fff);
          border-radius: 16px;
          border: 1px solid var(--border-light, #e2e8f0);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .cm-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .cm-card--expanded {
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border-color: var(--primary, #6366F1);
        }

        /* Card Header */
        .cm-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          cursor: pointer;
          gap: 12px;
        }
        .cm-card-header:hover {
          background: var(--bg-hover, #f8fafc);
        }
        .cm-card-name {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 6px;
          color: var(--text-heading, #1e293b);
        }
        .cm-card-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .cm-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
        }
        .cm-badge--grade {
          background: #EEF2FF;
          color: #4338CA;
        }
        .cm-badge--students {
          background: #F0FDF4;
          color: #166534;
        }
        .cm-badge--world {
          background: #FFF7ED;
          color: #9A3412;
        }
        .cm-card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Join Code Button */
        .cm-code-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid var(--border-light, #e2e8f0);
          border-radius: 8px;
          background: var(--bg-card, #fff);
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-heading, #1e293b);
          cursor: pointer;
          letter-spacing: 2px;
          transition: all 0.15s;
        }
        .cm-code-btn:hover {
          background: #EEF2FF;
          border-color: var(--primary, #6366F1);
        }
        .cm-code-btn--copied {
          background: #F0FDF4;
          border-color: #22C55E;
          color: #166534;
        }

        /* Card Body */
        .cm-card-body {
          padding: 0 24px 24px;
          border-top: 1px solid var(--border-light, #e2e8f0);
        }

        /* Share Section */
        .cm-share-section {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          margin: 20px 0;
          background: linear-gradient(135deg, #EEF2FF, #F0F9FF);
          border-radius: 12px;
          border: 1px solid #C7D2FE;
        }
        .cm-share-label {
          color: var(--text-muted, #64748B);
          font-size: 0.85rem;
          margin: 0 0 4px;
        }
        .cm-share-code {
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--primary, #6366F1);
          letter-spacing: 4px;
        }
        .cm-share-copy {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #C7D2FE;
          border-radius: 8px;
          background: white;
          color: var(--primary, #6366F1);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          margin-left: auto;
          flex-shrink: 0;
        }
        .cm-share-copy:hover {
          background: var(--primary, #6366F1);
          color: white;
        }

        /* Sections */
        .cm-section {
          margin-top: 20px;
        }
        .cm-section h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-heading, #1e293b);
        }

        /* Select & Input */
        .cm-select, .cm-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--border-light, #e2e8f0);
          border-radius: 10px;
          font-size: 0.9rem;
          background: var(--bg-card, #fff);
          color: var(--text-body, #334155);
          outline: none;
          transition: border-color 0.2s;
        }
        .cm-select:focus, .cm-input:focus {
          border-color: var(--primary, #6366F1);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        /* Student List */
        .cm-no-students {
          color: var(--text-muted, #94A3B8);
          font-size: 0.9rem;
          padding: 12px 0;
        }
        .cm-student-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cm-student-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--bg-hover, #f8fafc);
        }
        .cm-student-avatar {
          font-size: 1.4rem;
          flex-shrink: 0;
        }
        .cm-student-info {
          flex: 1;
          min-width: 0;
        }
        .cm-student-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-heading, #1e293b);
          display: block;
          margin-bottom: 4px;
        }
        .cm-student-progress {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cm-progress-bar {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }
        .cm-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1, #8B5CF6);
          border-radius: 3px;
          transition: width 0.3s;
        }
        .cm-progress-text {
          font-size: 0.75rem;
          color: var(--text-muted, #64748B);
          font-weight: 600;
          min-width: 32px;
        }
        .cm-student-xp {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: #F59E0B;
          font-weight: 600;
          flex-shrink: 0;
        }
        .cm-student-remove {
          border: none;
          background: none;
          color: #EF4444;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .cm-student-remove:hover {
          opacity: 1;
          background: #FEE2E2;
        }

        /* Leaderboard */
        .cm-leaderboard {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cm-lb-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 10px;
          background: var(--bg-hover, #f8fafc);
        }
        .cm-lb-rank {
          font-size: 1.1rem;
          min-width: 28px;
          text-align: center;
        }
        .cm-lb-avatar {
          font-size: 1.2rem;
        }
        .cm-lb-name {
          flex: 1;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-heading, #1e293b);
        }
        .cm-lb-xp {
          font-weight: 700;
          font-size: 0.85rem;
          color: #F59E0B;
        }

        /* Danger Zone */
        .cm-danger-zone {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light, #e2e8f0);
          text-align: right;
        }
        .cm-delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #FCA5A5;
          border-radius: 8px;
          background: #FEF2F2;
          color: #DC2626;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cm-delete-btn:hover {
          background: #DC2626;
          color: white;
        }

        /* Modal */
        .cm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .cm-modal {
          background: var(--bg-card, #fff);
          border-radius: 20px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: cmSlideUp 0.25s ease;
        }
        @keyframes cmSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cm-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-light, #e2e8f0);
        }
        .cm-modal-header h2 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
        }
        .cm-modal-close {
          border: none;
          background: none;
          color: var(--text-muted, #94A3B8);
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }
        .cm-modal-close:hover {
          background: var(--bg-hover, #f1f5f9);
        }
        .cm-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cm-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-heading, #1e293b);
        }
        .cm-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--border-light, #e2e8f0);
        }
        .cm-btn-cancel {
          padding: 10px 20px;
          border: 1px solid var(--border-light, #e2e8f0);
          border-radius: 10px;
          background: var(--bg-card, #fff);
          color: var(--text-body, #334155);
          font-weight: 500;
          cursor: pointer;
        }
        .cm-btn-cancel:hover {
          background: var(--bg-hover, #f1f5f9);
        }
        .cm-btn-create {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          border: none;
          border-radius: 10px;
          background: var(--primary, #6366F1);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
        .cm-btn-create:hover {
          background: var(--primary-dark, #4F46E5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .classroom-manager {
            padding: 20px 16px;
          }
          .cm-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .cm-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .cm-card-actions {
            width: 100%;
            justify-content: space-between;
          }
          .cm-share-section {
            flex-direction: column;
            text-align: center;
          }
          .cm-share-copy {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ClassroomManager;
