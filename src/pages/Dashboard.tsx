/**
 * DASHBOARD -- Premium Child-Friendly Student Home Screen
 * MinesMinis v6.0
 *
 * Clean, confident, premium feel.
 * ZERO emoji in UI -- only Lucide icons.
 * Uses design-system.css variables throughout.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Flame,
  Star,
  Gamepad2,
  BookOpen,
  Video,
  Music,
  Clock,
  CheckCircle,
  Target,
  School,
  Award,
  Loader2,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useGamification, ALL_BADGES } from '../contexts/GamificationContext';
import { SFX } from '../data/soundLibrary';
import MimiGuide from '../components/MimiGuide';
import { WORLDS, getWorldById, getLessonById } from '../data/curriculum';
import { PHASES } from '../data/curriculumPhases';
import {
  getCurrentLesson as getTrackerCurrentLesson,
  getWorldCompletionCount,
} from '../data/progressTracker';
import { getDueWords } from '../data/spacedRepetition';
import { getNextAction } from '../services/learningPathService';
import { joinClassroom, getStudentClassroom } from '../services/classroomService';
import './Dashboard.css';

// ============================================================
// HELPERS
// ============================================================

function getCurrentLessonData(userId: string) {
  const current = getTrackerCurrentLesson(userId);
  if (!current) {
    const firstWorld = WORLDS[0];
    return {
      worldName: firstWorld?.name || 'Hello World',
      lessonName: 'All caught up!',
      currentLesson: firstWorld?.lessons.length || 10,
      totalLessons: firstWorld?.lessons.length || 10,
      path: '/worlds',
    };
  }
  const world = getWorldById(current.worldId);
  const lesson = getLessonById(current.worldId, current.lessonId);
  const completedCount = getWorldCompletionCount(userId, current.worldId);
  const totalLessons = world?.lessons.length || 10;

  return {
    worldName: world?.name || 'Unknown World',
    lessonName: lesson?.title || 'Next Lesson',
    currentLesson: completedCount + 1,
    totalLessons,
    path: `/worlds/${current.worldId}`,
  };
}

function getPhaseInfo(): { name: string; unitLabel: string } {
  const phase = PHASES[0];
  return {
    name: phase?.name || 'Little Ears',
    unitLabel: `${phase?.name || 'Little Ears'} -- Unit 1`,
  };
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ============================================================
// QUICK ACTION DATA
// ============================================================

const QUICK_ACTIONS = [
  { to: '/games', icon: Gamepad2, label: 'Games', className: 'dash-qa--games' },
  { to: '/words', icon: BookOpen, label: 'Words', className: 'dash-qa--words' },
  { to: '/videos', icon: Video, label: 'Videos', className: 'dash-qa--videos' },
  { to: '/songs', icon: Music, label: 'Songs', className: 'dash-qa--songs' },
] as const;

// ============================================================
// COMPONENT
// ============================================================

export default function Dashboard() {
  const { user, userProfile, isAdmin } = useAuth();
  const {
    stats,
    loading,
    getXPProgress,
    allBadges,
  } = useGamification();

  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';
  const initial = displayName.charAt(0).toUpperCase();

  const [lesson, setLesson] = useState(() => getCurrentLessonData(userId));
  const [dueWords, setDueWords] = useState(() => getDueWords());
  const [nextAction, setNextAction] = useState(() => getNextAction());

  useEffect(() => {
    const onFocus = () => {
      setLesson(getCurrentLessonData(userId));
      setDueWords(getDueWords());
      setNextAction(getNextAction());
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [userId]);

  // Classroom
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinedClassroom, setJoinedClassroom] = useState<string | null>(() => {
    const membership = getStudentClassroom();
    return membership?.classroomName ?? null;
  });

  const handleJoinClassroom = useCallback(() => {
    if (!joinCode.trim()) return;
    const result = joinClassroom(joinCode.trim(), {
      id: userId,
      name: displayName,
      avatar: (userProfile?.settings?.avatar_emoji as string) || 'A',
    });
    if (result.success) {
      setJoinedClassroom(result.classroomName || 'Classroom');
      setJoinCode('');
      setJoinError('');
    } else {
      setJoinError(result.error || 'Could not join classroom.');
    }
  }, [joinCode, userId, displayName, userProfile]);

  const lessonProgress = Math.round((lesson.currentLesson / lesson.totalLessons) * 100);
  const phaseInfo = useMemo(() => getPhaseInfo(), []);
  const xpProgress = getXPProgress();

  // Recent badges (last 6 earned)
  const recentBadges = useMemo(() => {
    return stats.badges
      .slice(-6)
      .reverse()
      .map((id) => allBadges.find((b) => b.id === id) || ALL_BADGES.find((b) => b.id === id))
      .filter(Boolean);
  }, [stats.badges, allBadges]);

  // Suppress unused var warnings -- kept for future use
  void dueWords;
  void xpProgress;

  // ---- Loading ----
  if (loading) {
    return (
      <div className="dash child-mode">
        <div className="dash-loading">
          <Loader2 className="dash-loading-spinner" size={40} />
          <p className="dash-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="dash child-mode"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ============================================================
          TOP BAR
          ============================================================ */}
      <motion.header className="dash-topbar" variants={itemVariants}>
        <div className="dash-topbar__left">
          <div className="dash-topbar__mimi">
            <Flame size={20} />
          </div>
          <span className="dash-topbar__name">{displayName}</span>
        </div>
        <div className="dash-topbar__right">
          <div className="dash-topbar__stat dash-topbar__stat--streak">
            <Flame size={16} />
            <span>{stats.streakDays}</span>
          </div>
          <div className="dash-topbar__stat dash-topbar__stat--xp">
            <Star size={16} />
            <span>{stats.xp.toLocaleString()}</span>
          </div>
          <div className="dash-topbar__avatar">{initial}</div>
        </div>
      </motion.header>

      {/* ============================================================
          HERO -- Continue Learning
          ============================================================ */}
      <motion.section className="dash-hero" variants={itemVariants}>
        <div className="dash-hero__content">
          <span className="dash-hero__badge">{phaseInfo.unitLabel}</span>
          <h1 className="dash-hero__title">{nextAction.title}</h1>
          <p className="dash-hero__subtitle">{nextAction.description}</p>
          <div className="dash-hero__progress">
            <div className="dash-hero__progress-track">
              <div
                className="dash-hero__progress-fill"
                style={{ width: `${lessonProgress}%` }}
              />
            </div>
            <span className="dash-hero__progress-label">
              {lesson.currentLesson}/{lesson.totalLessons}
            </span>
          </div>
        </div>
        <Link to={nextAction.route} className="dash-hero__play" aria-label="Start lesson">
          <Play size={28} strokeWidth={2.5} />
        </Link>
      </motion.section>

      {/* ============================================================
          QUICK ACTIONS
          ============================================================ */}
      <motion.nav className="dash-actions" variants={itemVariants}>
        {QUICK_ACTIONS.map(({ to, icon: Icon, label, className }) => (
          <Link
            key={to}
            to={to}
            className={`dash-action ${className}`}
            onClick={() => SFX.click()}
          >
            <div className="dash-action__icon">
              <Icon size={24} />
            </div>
            <span className="dash-action__label">{label}</span>
          </Link>
        ))}
      </motion.nav>

      {/* ============================================================
          TODAY'S PROGRESS
          ============================================================ */}
      <motion.section className="dash-today" variants={itemVariants}>
        <span className="dash-today__label">Today</span>
        <div className="dash-today__stats">
          <div className="dash-today__stat">
            <Clock size={16} />
            <span>12 min</span>
          </div>
          <div className="dash-today__stat">
            <CheckCircle size={16} />
            <span>{stats.gamesPlayed + stats.worksheetsCompleted}</span>
          </div>
        </div>
        <Link to="/games" className="dash-today__challenge">
          <Target size={14} />
          <span>Daily Challenge</span>
        </Link>
      </motion.section>

      {/* ============================================================
          RECENT ACHIEVEMENTS
          ============================================================ */}
      <motion.section className="dash-achievements" variants={itemVariants}>
        <h2 className="dash-achievements__heading">Achievements</h2>
        {recentBadges.length > 0 ? (
          <div className="dash-achievements__scroll">
            {recentBadges.map((badge) =>
              badge ? (
                <div className="dash-achievements__badge" key={badge.id} title={badge.name}>
                  <Award size={20} />
                  <span className="dash-achievements__badge-name">{badge.name}</span>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="dash-achievements__empty">Complete lessons to earn badges</p>
        )}
      </motion.section>

      {/* ============================================================
          JOIN CLASSROOM
          ============================================================ */}
      {!joinedClassroom ? (
        <motion.section className="dash-classroom" variants={itemVariants}>
          <div className="dash-classroom__icon">
            <School size={20} />
          </div>
          <span className="dash-classroom__label">Join a classroom</span>
          <div className="dash-classroom__form">
            <input
              type="text"
              className="dash-classroom__input"
              placeholder="Class code"
              value={joinCode}
              onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
              maxLength={6}
            />
            <button
              type="button"
              className="dash-classroom__btn"
              onClick={handleJoinClassroom}
              disabled={joinCode.trim().length < 4}
            >
              Join
            </button>
          </div>
          {joinError && <span className="dash-classroom__error">{joinError}</span>}
        </motion.section>
      ) : (
        <motion.section className="dash-classroom dash-classroom--joined" variants={itemVariants}>
          <School size={18} />
          <span className="dash-classroom__name">{joinedClassroom}</span>
          <CheckCircle size={16} className="dash-classroom__check" />
        </motion.section>
      )}

      {/* Admin shortcut */}
      {isAdmin && (
        <motion.div className="dash-admin" variants={itemVariants}>
          <Link to="/admin" className="dash-admin__link">Admin</Link>
        </motion.div>
      )}

      <MimiGuide
        message="Hi! I'm Mimi! Tap the big play button to start learning!"
        messageTr="Merhaba! Ben Mimi! Buyuk oynat butonuna dokun ve ogrenmeye basla!"
        showOnce="mimi_guide_dashboard"
      />
    </motion.div>
  );
}
