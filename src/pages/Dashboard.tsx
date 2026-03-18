/**
 * DASHBOARD — Kid-Friendly Student Home Screen
 * MinesMinis v5.0
 *
 * Designed for ages 3-10. EXTREMELY simple.
 * A 5-year-old should understand what to do WITHOUT reading.
 * Everything is visual: emojis, icons, colors — not text.
 *
 * Layout:
 *   1. Top Bar (slim) — avatar + name + streak + XP
 *   2. Hero Card — "Continue Learning" (60% viewport)
 *   3. Quick Actions — 4 big icon buttons
 *   4. Daily Section — horizontal scroll
 *   5. Achievements Bar — bottom badges + level
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useGamification, ALL_BADGES } from '../contexts/GamificationContext';
import UnifiedMascot from '../components/UnifiedMascot';
import MimiGuide from '../components/MimiGuide';
import { WORLDS, getWorldById, getLessonById } from '../data/curriculum';
import { PHASES } from '../data/curriculumPhases';
import {
  getCurrentLesson as getTrackerCurrentLesson,
  getWorldCompletionCount,
} from '../data/progressTracker';
import { getDueWords } from '../data/spacedRepetition';
import { getNextAction } from '../services/learningPathService';
import { getTotalUnwatchedCount } from '../data/phonicsVideos';
import { getTodayMinutes } from '../services/activityLogger';
import { joinClassroom, getStudentClassroom } from '../services/classroomService';
import './Dashboard.css';

// ============================================================
// HELPERS
// ============================================================

/** Get the user's current lesson from progress tracker */
function getCurrentLessonData(userId: string) {
  const current = getTrackerCurrentLesson(userId);
  if (!current) {
    const firstWorld = WORLDS[0];
    return {
      worldName: firstWorld?.name || 'Hello World',
      worldIcon: firstWorld?.icon || '',
      lessonName: 'All caught up!',
      currentLesson: firstWorld?.lessons.length || 10,
      totalLessons: firstWorld?.lessons.length || 10,
      path: '/worlds',
      hasPlacement: true,
    };
  }
  const world = getWorldById(current.worldId);
  const lesson = getLessonById(current.worldId, current.lessonId);
  const completedCount = getWorldCompletionCount(userId, current.worldId);
  const totalLessons = world?.lessons.length || 10;

  return {
    worldName: world?.name || 'Unknown World',
    worldIcon: world?.icon || '',
    lessonName: lesson?.title || 'Next Lesson',
    currentLesson: completedCount + 1,
    totalLessons,
    path: `/worlds/${current.worldId}`,
    hasPlacement: true,
  };
}

/** Get the current phonics phase info for hero card subtitle */
function getPhaseInfo(): { name: string; icon: string; unitLabel: string } {
  const phase = PHASES[0]; // Default to first phase
  return {
    name: phase?.name || 'Little Ears',
    icon: phase?.icon || '\u{1F442}',
    unitLabel: `${phase?.name || 'Little Ears'} \u2014 Unit 1`,
  };
}

// ============================================================
// DAILY CHALLENGES (rotate by date)
// ============================================================

const DAILY_CHALLENGES = [
  { emoji: '\u{1F4DA}', title: 'Learn 5 words', xp: 30, path: '/words' },
  { emoji: '\u{1F3AE}', title: 'Play 3 games', xp: 25, path: '/games' },
  { emoji: '\u{1F3AC}', title: 'Watch a video', xp: 20, path: '/videos' },
  { emoji: '\u{1F4DD}', title: 'Do a worksheet', xp: 35, path: '/worksheets' },
  { emoji: '\u{1F504}', title: 'Review words', xp: 25, path: '/words?tab=review' },
  { emoji: '\u{1F30D}', title: 'Explore worlds', xp: 30, path: '/worlds' },
  { emoji: '\u2B50', title: 'Earn 50 XP', xp: 40, path: '/games' },
];

function getTodaysChallenge() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ============================================================
// COMPONENT
// ============================================================

export default function Dashboard() {
  const { user, userProfile, isAdmin } = useAuth();
  const {
    stats,
    loading,
    getXPProgress,
    canClaimDaily,
    claimDailyReward,
    allBadges,
  } = useGamification();

  // Daily time limit enforcement
  const dailyLimit = (userProfile?.settings?.dailyTimeLimit as number) || 60; // minutes
  const todayMinutes = useMemo(() => getTodayMinutes(), []);
  const timeLimitExceeded = todayMinutes >= dailyLimit;

  // Derived
  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';
  // Live-update these values when the page regains focus (e.g. after a lesson)
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

  // Classroom join state
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
      avatar: (userProfile?.settings?.avatar_emoji as string) || '\uD83E\uDD8A',
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
  const todaysChallenge = useMemo(() => getTodaysChallenge(), []);
  const phaseInfo = useMemo(() => getPhaseInfo(), []);
  const xpProgress = getXPProgress();
  const unwatchedVideoCount = useMemo(() => getTotalUnwatchedCount(), []);

  // Recent badges (last 6 earned)
  const recentBadges = useMemo(() => {
    return stats.badges
      .slice(-6)
      .reverse()
      .map((id) => allBadges.find((b) => b.id === id) || ALL_BADGES.find((b) => b.id === id))
      .filter(Boolean);
  }, [stats.badges, allBadges]);

  // Claim daily
  const handleClaim = useCallback(async () => {
    await claimDailyReward();
  }, [claimDailyReward]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="kid-dashboard">
        <div className="kid-loading">
          <div className="kid-loading-bounce">{'\u{1F432}'}</div>
          <p className="kid-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // ---- Time's Up overlay ----
  if (timeLimitExceeded) {
    return (
      <div className="kid-dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '32px 24px', gap: 16 }}>
        <div style={{ fontSize: 72 }}>{'\u{1F31F}'}</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Great job today!
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', margin: 0, maxWidth: 360 }}>
          You learned for <strong>{todayMinutes} minutes</strong> today. Come back tomorrow for more fun!
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: 'var(--primary-pale, #eff6ff)', borderRadius: 16, padding: '16px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{todayMinutes} min</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Time Learned</div>
          </div>
          <div style={{ background: 'var(--success-pale, #ecfdf5)', borderRadius: 16, padding: '16px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--secondary, #10b981)' }}>{stats.xp.toLocaleString()} XP</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Total XP</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
          Daily limit: {dailyLimit} minutes
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="kid-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ================================================================
          1. TOP BAR — avatar + name + streak + XP (slim, one line)
          ================================================================ */}
      <motion.div className="kid-topbar" variants={itemVariants}>
        <div className="kid-topbar-left">
          <div className="kid-topbar-avatar">
            <UnifiedMascot
              id={(userProfile?.settings?.mascotId as string) || 'mimi_dragon'}
              state="idle"
              size={44}
            />
          </div>
          <span className="kid-topbar-name">{displayName}</span>
        </div>
        <div className="kid-topbar-right">
          <div className="kid-topbar-streak" title={`${stats.streakDays} day streak`}>
            <span>{'\u{1F525}'}</span>
            <span className="kid-topbar-streak-num">{stats.streakDays}</span>
          </div>
          <div className="kid-topbar-xp" title={`${stats.xp} XP`}>
            <span>{'\u2B50'}</span>
            <span className="kid-topbar-xp-num">{stats.xp.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* ================================================================
          2. HERO CARD — Auto-guided "What's Next?" (THE main CTA)
          ================================================================ */}
      <motion.div className="kid-hero" variants={itemVariants}>
        <div className="kid-hero-emoji">{nextAction.emoji || '\u{1F680}'}</div>
        <div className="kid-hero-content">
          <p className="kid-hero-phase">{phaseInfo.unitLabel}</p>
          <h1 className="kid-hero-title">{nextAction.title}</h1>
          {/* Progress ring */}
          <div className="kid-hero-progress">
            <svg className="kid-hero-ring" viewBox="0 0 80 80">
              <circle
                className="kid-hero-ring-bg"
                cx="40"
                cy="40"
                r="34"
                fill="none"
                strokeWidth="8"
              />
              <circle
                className="kid-hero-ring-fill"
                cx="40"
                cy="40"
                r="34"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - lessonProgress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="kid-hero-ring-label">{lessonProgress}%</span>
          </div>
        </div>
        <Link
          to={nextAction.route}
          className="kid-hero-play"
        >
          <Play size={32} strokeWidth={3} />
          <span>PLAY</span>
        </Link>
      </motion.div>

      {/* ================================================================
          3. QUICK ACTIONS — 4 big icon buttons in a row
          ================================================================ */}
      <motion.div className="kid-quick-actions" variants={itemVariants}>
        <Link to="/games" className="kid-quick-btn kid-quick-games">
          <span className="kid-quick-emoji">{'\u{1F3AE}'}</span>
          <span className="kid-quick-label">Games</span>
        </Link>
        <Link to="/words" className="kid-quick-btn kid-quick-words">
          <span className="kid-quick-emoji">{'\u{1F4D6}'}</span>
          <span className="kid-quick-label">Words</span>
        </Link>
        <Link to="/videos" className="kid-quick-btn kid-quick-videos">
          <span className="kid-quick-emoji">{'\u{1F3AC}'}</span>
          <span className="kid-quick-label">Videos</span>
          {unwatchedVideoCount > 0 && (
            <span className="kid-quick-badge">{unwatchedVideoCount}</span>
          )}
        </Link>
        <Link to="/worksheets" className="kid-quick-btn kid-quick-sheets">
          <span className="kid-quick-emoji">{'\u{1F4DD}'}</span>
          <span className="kid-quick-label">Sheets</span>
        </Link>
        <Link to="/songs" className="kid-quick-btn kid-quick-songs">
          <span className="kid-quick-emoji">{'\u{1F3B5}'}</span>
          <span className="kid-quick-label">Songs</span>
        </Link>
      </motion.div>

      {/* ================================================================
          4. DAILY SECTION — horizontal scroll
          ================================================================ */}
      <motion.div className="kid-daily-scroll" variants={itemVariants}>
        {/* Daily Challenge */}
        <Link to={todaysChallenge.path} className="kid-daily-card kid-daily-challenge">
          <span className="kid-daily-card-emoji">{todaysChallenge.emoji}</span>
          <span className="kid-daily-card-title">{todaysChallenge.title}</span>
          <span className="kid-daily-card-xp">+{todaysChallenge.xp} XP</span>
        </Link>

        {/* Daily Reward */}
        {canClaimDaily && (
          <button
            className="kid-daily-card kid-daily-reward"
            onClick={handleClaim}
            type="button"
          >
            <span className="kid-daily-card-emoji kid-gift-bounce">{'\u{1F381}'}</span>
            <span className="kid-daily-card-title">Claim Gift!</span>
            <span className="kid-daily-card-xp">FREE</span>
          </button>
        )}

        {/* Words to Review */}
        {dueWords.length > 0 && (
          <Link to="/words?tab=review" className="kid-daily-card kid-daily-review">
            <span className="kid-daily-card-emoji">{'\u{1F504}'}</span>
            <span className="kid-daily-card-title">Review</span>
            <span className="kid-daily-card-xp">{dueWords.length} words</span>
          </Link>
        )}
      </motion.div>

      {/* ================================================================
          4b. JOIN CLASSROOM — compact card for students
          ================================================================ */}
      {!joinedClassroom ? (
        <motion.div className="kid-join-classroom" variants={itemVariants} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1rem', background: '#f0f9ff', borderRadius: '1rem',
          border: '2px solid #bae6fd',
        }}>
          <span style={{ fontSize: '1.3rem' }}>{'\u{1F3EB}'}</span>
          <input
            type="text"
            placeholder="Class code"
            value={joinCode}
            onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
            maxLength={6}
            style={{
              flex: 1, padding: '0.4rem 0.6rem', borderRadius: '0.5rem',
              border: '2px solid #e0e0e0', fontFamily: 'monospace', fontSize: '1rem',
              fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              minWidth: 0,
            }}
          />
          <button
            type="button"
            onClick={handleJoinClassroom}
            disabled={joinCode.trim().length < 4}
            style={{
              padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none',
              background: joinCode.trim().length >= 4 ? '#1A6B5A' : '#ccc',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Join
          </button>
          {joinError && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444', whiteSpace: 'nowrap' as const }}>{joinError}</span>
          )}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', background: '#f0fdf4', borderRadius: '0.75rem',
          fontSize: '0.85rem', color: '#1A6B5A', fontWeight: 600,
        }}>
          <span>{'\u{1F3EB}'}</span>
          <span>{joinedClassroom}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10b981' }}>{'\u2705'} Joined</span>
        </motion.div>
      )}

      {/* ================================================================
          5. ACHIEVEMENTS BAR — badges + level progress
          ================================================================ */}
      <motion.div className="kid-achievements" variants={itemVariants}>
        <div className="kid-level-bar">
          <span className="kid-level-label">Level {stats.level}</span>
          <div className="kid-level-track">
            <div
              className="kid-level-fill"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <span className="kid-level-pct">{xpProgress}%</span>
        </div>
        {recentBadges.length > 0 && (
          <div className="kid-badges-scroll">
            {recentBadges.map((badge) =>
              badge ? (
                <div className="kid-badge" key={badge.id} title={badge.name}>
                  <span className="kid-badge-icon">{badge.icon}</span>
                </div>
              ) : null
            )}
          </div>
        )}
        {recentBadges.length === 0 && (
          <p className="kid-no-badges">Play to earn badges! {'\u{1F3C6}'}</p>
        )}
      </motion.div>

      {/* Admin shortcut (subtle, invisible to kids) */}
      {isAdmin && (
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: 8 }}>
          <Link
            to="/admin"
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              textDecoration: 'underline',
              opacity: 0.5,
            }}
          >
            Admin
          </Link>
        </motion.div>
      )}

      <MimiGuide
        message="Hi! I'm Mimi! Tap the big card to start learning! \u{1F389}"
        messageTr="Merhaba! Ben Mimi! Buyuk karta dokun ve ogrenmeye basla!"
        showOnce="mimi_guide_dashboard"
      />
    </motion.div>
  );
}
