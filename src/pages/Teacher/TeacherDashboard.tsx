/**
 * TEACHER CLASSROOM DASHBOARD
 * Full classroom management for teachers:
 * — My Classrooms panel with join codes
 * — Create Classroom (inline form)
 * — Student Roster with phonics mastery dots
 * — Class Progress Summary (streak avg, at-risk, top performers)
 * — Homework Assignment Panel
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getClassrooms,
  createClassroom,
  getClassroom,
  Classroom,
  ClassroomStudent,
} from '../../services/classroomService';
import { ALL_SOUNDS } from '../../data/phonics';
import { generateAssessment } from '../../services/assessmentService';
import type { PhonicsAssessment } from '../../services/assessmentService';
import AssessmentReport from '../../components/AssessmentReport';
import './TeacherDashboard.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const PHONICS_CURRICULUM: { id: string; label: string }[] = ALL_SOUNDS.map((s) => ({
  id: s.id,
  label: `/${s.sound}/ — "${s.grapheme}"`,
}));

const VOCAB_SETS: { id: string; label: string }[] = [
  { id: 'vocab_animals', label: 'Animals (Set 1)' },
  { id: 'vocab_colors', label: 'Colors & Shapes' },
  { id: 'vocab_numbers', label: 'Numbers 1–20' },
  { id: 'vocab_food', label: 'Food & Drinks' },
  { id: 'vocab_body', label: 'Body Parts' },
  { id: 'vocab_family', label: 'Family Members' },
  { id: 'vocab_school', label: 'School Objects' },
  { id: 'vocab_weather', label: 'Weather & Seasons' },
];

const HOMEWORK_OPTIONS = [
  ...PHONICS_CURRICULUM.map((p) => ({ id: p.id, label: `Phonics: ${p.label}`, type: 'phonics' as const })),
  ...VOCAB_SETS.map((v) => ({ id: v.id, label: `Vocab: ${v.label}`, type: 'vocab' as const })),
];

type SortKey = 'name' | 'streak' | 'xp';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(isoDate: string): number {
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatLastActive(isoDate: string, lang: string): string {
  const days = daysSince(isoDate);
  if (days === 0) return lang === 'tr' ? 'Bugün' : 'Today';
  if (days === 1) return lang === 'tr' ? 'Dün' : 'Yesterday';
  return lang === 'tr' ? `${days}g önce` : `${days}d ago`;
}

function getMasteryClass(mastery: number | undefined): string {
  if (!mastery || mastery === 0) return 'mastery-none';
  if (mastery < 30) return 'mastery-low';
  if (mastery < 60) return 'mastery-mid';
  if (mastery < 90) return 'mastery-high';
  return 'mastery-full';
}

/** Compute per-student streak from lastActive — honest: 1 if active today, 0 otherwise */
function estimateStreak(student: ClassroomStudent): number {
  return daysSince(student.lastActive) === 0 ? 1 : 0;
}

/** Get student's level from XP */
function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface CopyToastProps {
  visible: boolean;
  lang: string;
}

function CopyToast({ visible, lang }: CopyToastProps) {
  if (!visible) return null;
  return <div className="td-copy-toast">{lang === 'tr' ? 'Katılım kodu kopyalandı!' : 'Join code copied!'}</div>;
}

interface ClassCardProps {
  classroom: Classroom;
  isActive: boolean;
  onSelect: (id: string) => void;
  onCopy: (code: string) => void;
  lang: string;
}

function ClassCard({ classroom, isActive, onSelect, onCopy, lang }: ClassCardProps) {
  return (
    <div
      className={`td-class-card${isActive ? ' active' : ''}`}
      onClick={() => onSelect(classroom.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(classroom.id)}
    >
      <div className="td-class-card-top">
        <div>
          <p className="td-class-name">{classroom.name}</p>
          <p className="td-class-meta">
            {lang === 'tr' ? `${classroom.gradeLevel}. Sınıf` : `Grade ${classroom.gradeLevel}`}
            &middot; {classroom.students.length}{' '}
            {lang === 'tr'
              ? 'öğrenci'
              : `student${classroom.students.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <button
        className="td-join-code"
        title={lang === 'tr' ? 'Kopyalamak için tıkla' : 'Click to copy'}
        onClick={(e) => {
          e.stopPropagation();
          onCopy(classroom.joinCode);
        }}
      >
        <span className="td-join-code-text">{classroom.joinCode}</span>
        <span className="td-join-code-hint">{lang === 'tr' ? 'kopyala' : 'copy'}</span>
      </button>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { user, userProfile } = useAuth();

  // ── Auth guard ──
  if (!user) return <Navigate to="/login" replace />;
  if (userProfile && userProfile.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return <TeacherDashboardInner userId={user.uid} displayName={userProfile?.display_name ?? ''} />;
}

// Split to avoid conditional hook ordering issues
function TeacherDashboardInner({
  userId,
  displayName,
}: {
  userId: string;
  displayName: string;
}) {
  const { lang } = useLanguage();

  // ── Classrooms state ──
  const [classrooms, setClassrooms] = useState<Classroom[]>(() =>
    getClassrooms(userId),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Create form state ──
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');

  // ── Roster state ──
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // ── Homework state ──
  const [hwAssignment, setHwAssignment] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwAssigned, setHwAssigned] = useState<string | null>(null);

  // ── Copy toast ──
  const [showCopyToast, setShowCopyToast] = useState(false);

  // ── Assessment report ──
  const [activeReport, setActiveReport] = useState<{
    assessment: PhonicsAssessment;
    student: ClassroomStudent;
  } | null>(null);

  const handleGenerateStudentReport = useCallback(
    (student: ClassroomStudent) => {
      const assessment = generateAssessment(student.id, '30days');
      setActiveReport({ assessment, student });
    },
    [],
  );

  const handlePrintReport = useCallback(() => {
    window.print();
  }, []);

  // ── Refresh classrooms when one is created ──
  const refreshClassrooms = useCallback(() => {
    setClassrooms(getClassrooms(userId));
  }, [userId]);

  // ── Load fresh classroom data when selection changes ──
  const selectedClassroom = useMemo<Classroom | null>(() => {
    if (!selectedId) return null;
    return getClassroom(selectedId) ?? null;
  }, [selectedId, classrooms]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sort & filter students ──
  const filteredStudents = useMemo<ClassroomStudent[]>(() => {
    if (!selectedClassroom) return [];
    const q = searchQuery.toLowerCase().trim();
    let list = q
      ? selectedClassroom.students.filter((s) =>
          s.name.toLowerCase().includes(q),
        )
      : [...selectedClassroom.students];

    list.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'xp') return b.xp - a.xp;
      // streak
      return estimateStreak(b) - estimateStreak(a);
    });

    return list;
  }, [selectedClassroom, sortKey, searchQuery]);

  // ── Progress summary ──
  const progressStats = useMemo(() => {
    if (!selectedClassroom || selectedClassroom.students.length === 0) return null;
    const students = selectedClassroom.students;

    const avgStreak =
      students.reduce((sum, s) => sum + estimateStreak(s), 0) / students.length;

    const atRisk = students.filter((s) => daysSince(s.lastActive) >= 3);

    const sorted = [...students].sort((a, b) => b.xp - a.xp);
    const topThree = sorted.slice(0, 3);

    return { avgStreak: Math.round(avgStreak), atRisk, topThree };
  }, [selectedClassroom]);

  // ── Handlers ──
  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  }, []);

  const handleCreateSubmit = useCallback(() => {
    if (!newName.trim()) {
      setCreateError(lang === 'tr' ? 'Lütfen bir sınıf adı girin.' : 'Please enter a classroom name.');
      return;
    }
    if (!newGrade.trim()) {
      setCreateError(lang === 'tr' ? 'Lütfen bir sınıf seviyesi girin.' : 'Please enter a grade level.');
      return;
    }
    setCreateError('');
    const classroom = createClassroom(userId, newName.trim(), newGrade.trim());
    setCreatedCode(classroom.joinCode);
    setNewName('');
    setNewGrade('');
    refreshClassrooms();
    setSelectedId(classroom.id);
  }, [userId, newName, newGrade, refreshClassrooms]);

  const handleAssignHomework = useCallback(() => {
    if (!hwAssignment || !hwDueDate) return;
    const option = HOMEWORK_OPTIONS.find((o) => o.id === hwAssignment);
    if (!option) return;
    // Store assignment in localStorage as a simple record (no server endpoint exists)
    const key = `mimi_hw_${selectedId}`;
    const record = {
      classroomId: selectedId,
      assignmentId: option.id,
      assignmentLabel: option.label,
      dueDate: hwDueDate,
      assignedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(record));
    setHwAssigned(option.label);
    setTimeout(() => setHwAssigned(null), 4000);
  }, [hwAssignment, hwDueDate, selectedId]);

  // ── Reset homework form when classroom changes ──
  useEffect(() => {
    setHwAssignment('');
    setHwDueDate('');
    setHwAssigned(null);
  }, [selectedId]);

  // ── Medals for top performers ──
  const medals = ['gold', 'silver', 'bronze'];
  const medalEmojis: Record<string, string> = {
    gold: '\u{1F947}',
    silver: '\u{1F948}',
    bronze: '\u{1F949}',
  };

  // ── Grade options ──
  const gradeOptions = ['K', '1', '2', '3', '4', '5'];

  return (
    <div className="td-page">
      {/* ── Header ── */}
      <div className="td-header">
        <div className="td-header-title">
          <div className="td-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1>{lang === 'tr' ? 'Sınıf Paneli' : 'Classroom Dashboard'}</h1>
            <p className="td-header-sub">
              {displayName
                ? (lang === 'tr' ? `Hoş geldin, ${displayName}` : `Welcome, ${displayName}`)
                : (lang === 'tr' ? 'Sınıflarını yönet ve öğrenci ilerlemesini takip et' : 'Manage your classrooms and track student progress')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Body: 2-col grid ── */}
      <div className="td-body">

        {/* ══ LEFT PANEL: Classrooms ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* My Classrooms */}
          <div className="td-section">
            <div className="td-section-header">
              <h2 className="td-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {lang === 'tr' ? 'Sınıflarım' : 'My Classrooms'}
              </h2>
              <button
                className="td-btn td-btn-primary td-btn-sm"
                onClick={() => {
                  setShowCreateForm((v) => !v);
                  setCreatedCode(null);
                  setCreateError('');
                }}
              >
                {showCreateForm ? (lang === 'tr' ? 'İptal' : 'Cancel') : '+ ' + (lang === 'tr' ? 'Yeni' : 'New')}
              </button>
            </div>

            <div className="td-section-body">
              {/* Create form */}
              {showCreateForm && (
                <div className="td-create-form">
                  <h3>{lang === 'tr' ? 'Yeni Sınıf Oluştur' : 'Create New Classroom'}</h3>

                  <div className="td-form-row" style={{ marginBottom: 'var(--space-3)' }}>
                    <div className="td-form-field" style={{ flex: 2 }}>
                      <label className="td-label" htmlFor="td-class-name-input">
                        {lang === 'tr' ? 'Sınıf Adı' : 'Class Name'}
                      </label>
                      <input
                        id="td-class-name-input"
                        className="td-input"
                        type="text"
                        placeholder={lang === 'tr' ? 'örn. Ayçiçeği Sınıfı' : 'e.g. Sunflower Class'}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateSubmit()}
                      />
                    </div>
                    <div className="td-form-field">
                      <label className="td-label" htmlFor="td-grade-select">
                        {lang === 'tr' ? 'Sınıf Seviyesi' : 'Grade'}
                      </label>
                      <select
                        id="td-grade-select"
                        className="td-input td-sort-select"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                      >
                        <option value="">{lang === 'tr' ? 'Seçin…' : 'Select…'}</option>
                        {gradeOptions.map((g) => (
                          <option key={g} value={g}>
                            {g === 'K'
                              ? (lang === 'tr' ? 'Anaokulu' : 'Kindergarten')
                              : (lang === 'tr' ? `${g}. Sınıf` : `Grade ${g}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {createError && (
                    <p style={{ margin: '0 0 var(--space-3)', fontSize: 13, color: 'var(--error)', fontFamily: 'Inter, sans-serif' }}>
                      {createError}
                    </p>
                  )}

                  <button className="td-btn td-btn-primary" onClick={handleCreateSubmit}>
                    {lang === 'tr' ? 'Sınıf Oluştur' : 'Create Classroom'}
                  </button>

                  {createdCode && (
                    <div className="td-code-banner">
                      <div className="td-code-banner-label">
                        {lang === 'tr' ? 'Sınıf oluşturuldu! Katılım kodu:' : 'Classroom created! Join code:'}
                      </div>
                      <div
                        className="td-code-banner-code"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleCopy(createdCode)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCopy(createdCode)}
                        style={{ cursor: 'pointer' }}
                        title={lang === 'tr' ? 'Kopyalamak için tıkla' : 'Click to copy'}
                      >
                        {createdCode}
                      </div>
                      <div className="td-code-banner-hint">
                        {lang === 'tr'
                          ? 'Bu kodu öğrencilerle paylaş — uygulamada girebilirler.'
                          : 'Share this code with students — they can enter it in their app.'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Classroom list */}
              {classrooms.length === 0 ? (
                <div className="td-empty">
                  <div className="td-empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                  </div>
                  <p className="td-empty-title">{lang === 'tr' ? 'Henüz sınıf yok' : 'No classrooms yet'}</p>
                  <p className="td-empty-sub">
                    {lang === 'tr'
                      ? '"+ Yeni" butonuna tıklayarak ilk sınıfını oluştur ve öğrenciler için katılım kodu al.'
                      : 'Click "+ New" to create your first classroom and get a join code for students.'}
                  </p>
                </div>
              ) : (
                classrooms.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    classroom={cls}
                    isActive={selectedId === cls.id}
                    onSelect={setSelectedId}
                    onCopy={handleCopy}
                    lang={lang}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL: Detail ══ */}
        <div className="td-detail-panel">
          {!selectedId ? (
            <div className="td-section">
              <div className="td-select-prompt">
                <div className="td-select-prompt-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <p>{lang === 'tr' ? 'Öğrenci listesini ve ilerlemeyi görmek için soldan bir sınıf seçin.' : 'Select a classroom on the left to view its roster and progress.'}</p>
              </div>
            </div>
          ) : (
            <>
              {/* ── Progress Summary ── */}
              <div className="td-section">
                <div className="td-section-header">
                  <h2 className="td-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    {lang === 'tr' ? 'Sınıf İlerlemesi' : 'Class Progress'}
                  </h2>
                </div>

                {progressStats ? (
                  <>
                    <div className="td-summary-grid">
                      <div className="td-stat-card">
                        <div className="td-stat-value">{selectedClassroom?.students.length ?? 0}</div>
                        <div className="td-stat-label">{lang === 'tr' ? 'Öğrenci' : 'Students'}</div>
                      </div>
                      <div className="td-stat-card">
                        <div className="td-stat-value">{progressStats.avgStreak}</div>
                        <div className="td-stat-label">{lang === 'tr' ? 'Ort. Seri' : 'Avg Streak'}</div>
                      </div>
                      <div className="td-stat-card">
                        <div className="td-stat-value" style={{ color: progressStats.atRisk.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                          {progressStats.atRisk.length}
                        </div>
                        <div className="td-stat-label">{lang === 'tr' ? 'Risk Altında' : 'At Risk'}</div>
                      </div>
                      <div className="td-stat-card">
                        <div className="td-stat-value" style={{ color: 'var(--accent-amber)', fontSize: 22 }}>
                          {selectedClassroom?.students.reduce((sum, s) => sum + s.xp, 0).toLocaleString() ?? 0}
                        </div>
                        <div className="td-stat-label">{lang === 'tr' ? 'Toplam XP' : 'Total XP'}</div>
                      </div>
                    </div>

                    {/* At-risk students */}
                    {progressStats.atRisk.length > 0 && (
                      <>
                        <div style={{ padding: '0 var(--space-5)', paddingTop: 'var(--space-2)' }}>
                          <div className="td-section-title" style={{ fontSize: 12, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {lang === 'tr' ? '3+ Gündür Aktif Değil' : 'Inactive 3+ days'}
                          </div>
                        </div>
                        <div className="td-atrisk-list">
                          {progressStats.atRisk.map((s) => (
                            <div key={s.id} className="td-atrisk-item">
                              <div className="td-avatar-circle">{s.name.charAt(0).toUpperCase()}</div>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                              <span className="td-at-risk-badge">{lang === 'tr' ? 'pasif' : 'inactive'}</span>
                              <span className="td-atrisk-days">
                                {lang === 'tr' ? `${daysSince(s.lastActive)}g önce` : `${daysSince(s.lastActive)}d ago`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Top performers */}
                    {progressStats.topThree.length > 0 && (
                      <>
                        <div style={{ padding: '0 var(--space-5)', paddingTop: 'var(--space-3)' }}>
                          <div className="td-section-title" style={{ fontSize: 12, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {lang === 'tr' ? 'En İyi Öğrenciler' : 'Top Performers'}
                          </div>
                        </div>
                        <div className="td-performers-list" style={{ paddingBottom: 'var(--space-4)' }}>
                          {progressStats.topThree.map((s, idx) => (
                            <div key={s.id} className="td-performer-item">
                              <span className="td-performer-medal">{medalEmojis[medals[idx]]}</span>
                              <div className="td-avatar-circle" style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}>
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="td-performer-name">{s.name}</span>
                              <span className="td-performer-xp">{s.xp.toLocaleString()} XP</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="td-empty">
                    <p className="td-empty-title">{lang === 'tr' ? 'Henüz öğrenci yok' : 'No students yet'}</p>
                    <p className="td-empty-sub">
                      {lang === 'tr'
                        ? 'Katılım kodunu paylaş ve öğrenciler katıldığında burada görünecekler.'
                        : 'Share the join code and students will appear here once they join.'}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Student Roster ── */}
              <div className="td-section">
                <div className="td-section-header">
                  <h2 className="td-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    {lang === 'tr' ? 'Öğrenci Listesi' : 'Student Roster'}
                    {selectedClassroom && (
                      <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>
                        ({selectedClassroom.students.length})
                      </span>
                    )}
                  </h2>
                </div>

                {/* Controls */}
                <div className="td-roster-controls">
                  <div className="td-search">
                    <input
                      className="td-input"
                      type="text"
                      placeholder={lang === 'tr' ? 'Öğrenci ara…' : 'Search students…'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <select
                    className="td-sort-select"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    aria-label="Sort students"
                  >
                    <option value="name">{lang === 'tr' ? 'Sırala: Ad' : 'Sort: Name'}</option>
                    <option value="xp">{lang === 'tr' ? 'Sırala: XP' : 'Sort: XP'}</option>
                    <option value="streak">{lang === 'tr' ? 'Sırala: Seri' : 'Sort: Streak'}</option>
                  </select>
                </div>

                {/* Table */}
                {filteredStudents.length === 0 ? (
                  <div className="td-empty">
                    <p className="td-empty-title">
                      {searchQuery
                        ? (lang === 'tr' ? 'Sonuç yok' : 'No results')
                        : (lang === 'tr' ? 'Bu sınıfta öğrenci yok' : 'No students in this class')}
                    </p>
                    <p className="td-empty-sub">
                      {searchQuery
                        ? (lang === 'tr' ? 'Farklı bir arama terimi deneyin.' : 'Try a different search term.')
                        : (lang === 'tr' ? 'Öğrencilerin katılması için katılım kodunu paylaşın.' : 'Share the join code so students can join this classroom.')}
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="td-roster-table">
                      <thead>
                        <tr>
                          <th>{lang === 'tr' ? 'Öğrenci' : 'Student'}</th>
                          <th>{lang === 'tr' ? 'Son Aktif' : 'Last Active'}</th>
                          <th>{lang === 'tr' ? 'Seri' : 'Streak'}</th>
                          <th>XP</th>
                          <th>{lang === 'tr' ? 'Seviye' : 'Level'}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => {
                          const isAtRisk = daysSince(student.lastActive) >= 3;
                          const isExpanded = expandedStudentId === student.id;
                          const streak = estimateStreak(student);
                          const level = xpToLevel(student.xp);

                          return (
                            <>
                              <tr
                                key={student.id}
                                className={`td-roster-row${isAtRisk ? ' at-risk' : ''}${isExpanded ? ' expanded' : ''}`}
                                onClick={() =>
                                  setExpandedStudentId(isExpanded ? null : student.id)
                                }
                              >
                                <td>
                                  <div className="td-student-name">
                                    <div className="td-avatar-circle">
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    {student.name}
                                    {isAtRisk && (
                                      <span className="td-at-risk-badge">{lang === 'tr' ? 'pasif' : 'inactive'}</span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ color: isAtRisk ? 'var(--warning)' : 'var(--text-muted)' }}>
                                  {formatLastActive(student.lastActive, lang)}
                                </td>
                                <td>
                                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: streak > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                                    {streak > 0 ? `${streak}` : '—'}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--accent-amber)' }}>
                                    {student.xp.toLocaleString()}
                                  </span>
                                </td>
                                <td>
                                  <span className="td-level-badge">Lv {level}</span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                                    <button
                                      className="td-report-btn"
                                      title="Generate Phonics Assessment Report"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleGenerateStudentReport(student);
                                      }}
                                    >
                                      Rapor
                                    </button>
                                    <svg
                                      className={`td-chevron${isExpanded ? ' open' : ''}`}
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    >
                                      <polyline points="4 6 8 10 12 6" />
                                    </svg>
                                  </div>
                                </td>
                              </tr>

                              {/* Phonics mastery expand row */}
                              {isExpanded && (
                                <tr key={`${student.id}-expand`} className="td-phonics-expand">
                                  <td colSpan={6}>
                                    <div className="td-phonics-expand-inner">
                                      <div className="td-phonics-title">{lang === 'tr' ? 'Fonik Ustalığı' : 'Phonics Mastery'}</div>
                                      {Object.keys(student.phonicsProgress).length === 0 ? (
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                                          {lang === 'tr' ? 'Henüz fonik ilerleme kaydedilmedi.' : 'No phonics progress recorded yet.'}
                                        </p>
                                      ) : (
                                        <div className="td-phonics-dots">
                                          {ALL_SOUNDS.map((sound) => {
                                            const mastery = student.phonicsProgress[sound.id];
                                            if (mastery === undefined) return null;
                                            return (
                                              <div
                                                key={sound.id}
                                                className="td-phonics-dot-item"
                                                title={`/${sound.sound}/ — ${mastery}% mastery`}
                                              >
                                                <div
                                                  className={`td-phonics-dot ${getMasteryClass(mastery)}`}
                                                />
                                                <div className="td-phonics-dot-label">
                                                  {sound.grapheme}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}

                                      {/* Legend */}
                                      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-1)' }}>
                                        {[
                                          { cls: 'mastery-none', label: lang === 'tr' ? 'Başlanmadı' : 'Not started' },
                                          { cls: 'mastery-low', label: '1–29%' },
                                          { cls: 'mastery-mid', label: '30–59%' },
                                          { cls: 'mastery-high', label: '60–89%' },
                                          { cls: 'mastery-full', label: '90–100%' },
                                        ].map((item) => (
                                          <div
                                            key={item.cls}
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
                                          >
                                            <div className={`td-phonics-dot ${item.cls}`} style={{ width: 12, height: 12 }} />
                                            {item.label}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ── Homework Assignment ── */}
              <div className="td-section">
                <div className="td-section-header">
                  <h2 className="td-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    {lang === 'tr' ? 'Ödev Ata' : 'Assign Homework'}
                  </h2>
                </div>

                <div className="td-hw-form">
                  <div className="td-hw-row">
                    <div className="td-form-field">
                      <label className="td-label" htmlFor="td-hw-assignment">
                        {lang === 'tr' ? 'Etkinlik' : 'Activity'}
                      </label>
                      <select
                        id="td-hw-assignment"
                        className="td-input td-sort-select"
                        value={hwAssignment}
                        onChange={(e) => setHwAssignment(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="">{lang === 'tr' ? 'Fonik veya kelime seçin…' : 'Select phonics or vocab…'}</option>
                        <optgroup label={lang === 'tr' ? 'Fonik Sesler' : 'Phonics Sounds'}>
                          {PHONICS_CURRICULUM.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label={lang === 'tr' ? 'Kelime Setleri' : 'Vocabulary Sets'}>
                          {VOCAB_SETS.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div className="td-form-field">
                      <label className="td-label" htmlFor="td-hw-due">
                        {lang === 'tr' ? 'Son Tarih' : 'Due Date'}
                      </label>
                      <input
                        id="td-hw-due"
                        className="td-input"
                        type="date"
                        value={hwDueDate}
                        onChange={(e) => setHwDueDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                      />
                    </div>
                  </div>

                  {hwAssigned ? (
                    <div className="td-hw-assigned-banner">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {lang === 'tr' ? 'Atandı:' : 'Assigned:'} {hwAssigned}
                    </div>
                  ) : (
                    <button
                      className="td-btn td-btn-primary"
                      onClick={handleAssignHomework}
                      disabled={!hwAssignment || !hwDueDate}
                      style={{ opacity: !hwAssignment || !hwDueDate ? 0.5 : 1, cursor: !hwAssignment || !hwDueDate ? 'not-allowed' : 'pointer' }}
                    >
                      {lang === 'tr' ? 'Sınıfa Ata' : 'Assign to Class'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CopyToast visible={showCopyToast} lang={lang} />

      {/* Assessment report overlay */}
      {activeReport && (
        <AssessmentReport
          assessment={activeReport.assessment}
          studentName={activeReport.student.name}
          userId={activeReport.student.id}
          onPrint={handlePrintReport}
          onClose={() => setActiveReport(null)}
        />
      )}
    </div>
  );
}
