/**
 * DASHBOARD — Student Home Screen
 * MinesMinis v4.0
 *
 * Warm, motivating, clear. The student's hub after login.
 * Sections: Greeting → Continue Learning → Stats → Daily Challenge →
 *           Achievements → Quick Actions → Weekly Progress
 */
import { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  BookOpen,
  Flame,
  GraduationCap,
  Globe,
  Pencil,
  Gamepad2,
  BookHeart,
  Award,
  Play,
  Sparkles,
  Gift,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import { useAuth } from '../contexts/AuthContext';
import { useGamification, ALL_BADGES } from '../contexts/GamificationContext';
import UnifiedMascot from '../components/UnifiedMascot';
import './Dashboard.css';

// ============================================================
// HELPERS
// ============================================================

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let period: string;
  if (hour < 12) period = 'Good morning';
  else if (hour < 17) period = 'Good afternoon';
  else period = 'Good evening';
  return `${period}, ${name}!`;
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Fake "current lesson" data — replace with real curriculum context later */
function getCurrentLesson() {
  return {
    worldName: 'Hello World',
    worldIcon: '🌍',
    lessonName: 'Greetings & Introductions',
    currentLesson: 3,
    totalLessons: 10,
    path: '/worlds',
  };
}

/** Generate demo weekly XP data */
function getWeeklyXPData(totalXP: number) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;

  return days.map((day, i) => {
    if (i > todayIdx) return { day, xp: 0 };
    // Distribute XP with some randomness for visual appeal
    const base = Math.max(10, Math.floor(totalXP / 14));
    const variance = Math.floor(base * 0.6 * Math.random());
    return { day, xp: i === todayIdx ? base + variance + 5 : base + variance };
  });
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ============================================================
// DAILY CHALLENGES (static list — rotate by date)
// ============================================================

const DAILY_CHALLENGES = [
  { title: 'Learn 5 new words', desc: 'Expand your vocabulary today!', xp: 30, path: '/words' },
  { title: 'Play 3 games', desc: 'Practice makes perfect!', xp: 25, path: '/games' },
  { title: 'Watch a story video', desc: 'Enjoy a Mimi adventure', xp: 20, path: '/story' },
  { title: 'Complete a worksheet', desc: 'Show what you know!', xp: 35, path: '/practice' },
  { title: 'Practice 10 words', desc: 'Review words you learned', xp: 25, path: '/practice' },
  { title: 'Explore a new world', desc: 'Discover new lessons!', xp: 30, path: '/worlds' },
  { title: 'Earn 50 XP today', desc: 'Any activity counts!', xp: 40, path: '/games' },
];

function getTodaysChallenge() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

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

  // Derived
  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const greeting = useMemo(() => getGreeting(displayName), [displayName]);
  const dateStr = useMemo(() => getFormattedDate(), []);
  const lesson = useMemo(() => getCurrentLesson(), []);
  const lessonProgress = Math.round((lesson.currentLesson / lesson.totalLessons) * 100);
  const todaysChallenge = useMemo(() => getTodaysChallenge(), []);
  const weeklyData = useMemo(() => getWeeklyXPData(stats.weekly_xp || stats.xp), [stats.weekly_xp, stats.xp]);
  const xpProgress = getXPProgress();

  // Recent badges (last 4 earned)
  const recentBadges = useMemo(() => {
    return stats.badges
      .slice(-4)
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
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner">🐲</div>
          <p className="dashboard-loading-text">Mimi is getting things ready...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ================================================================
          A. MIMI GREETING BAR
          ================================================================ */}
      <motion.div className="greeting-bar" variants={itemVariants}>
        <div className="greeting-mimi" title="Mimi">
          <UnifiedMascot
            id={(userProfile?.settings?.mascotId as string) || 'mimi_dragon'}
            state="idle"
            size={64}
          />
        </div>
        <div className="greeting-content">
          <p className="greeting-text">{greeting}</p>
          <p className="greeting-date">{dateStr}</p>
        </div>
        <div className="greeting-streak" title={`${stats.streakDays} day streak`}>
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{stats.streakDays}</span>
          <span className="streak-label">day{stats.streakDays !== 1 ? 's' : ''}</span>
        </div>
      </motion.div>

      {/* ================================================================
          DAILY CLAIM BANNER (if claimable)
          ================================================================ */}
      {canClaimDaily && (
        <motion.div
          className="daily-claim-banner"
          variants={itemVariants}
          onClick={handleClaim}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
        >
          <span className="claim-icon">🎁</span>
          <div className="claim-text">
            <div className="claim-title">Daily Reward Ready!</div>
            <div className="claim-desc">Claim your XP bonus for today</div>
          </div>
          <button className="claim-btn" type="button">
            <Gift size={16} style={{ marginRight: 4 }} />
            Claim
          </button>
        </motion.div>
      )}

      {/* ================================================================
          B. CONTINUE LEARNING (PRIMARY CTA)
          ================================================================ */}
      <motion.div className="continue-card" variants={itemVariants}>
        <div className="continue-world-icon">{lesson.worldIcon}</div>
        <div className="continue-info">
          <div className="continue-world-name">{lesson.worldName}</div>
          <h2 className="continue-lesson-name">{lesson.lessonName}</h2>
          <div className="continue-progress-row">
            <div className="continue-progress-bar">
              <div
                className="continue-progress-fill"
                style={{ width: `${lessonProgress}%` }}
              />
            </div>
            <span className="continue-progress-text">
              Lesson {lesson.currentLesson} of {lesson.totalLessons}
            </span>
          </div>
        </div>
        <Link to={lesson.path} className="continue-btn">
          <Play size={20} />
          Continue
        </Link>
      </motion.div>

      {/* ================================================================
          C. STATS ROW
          ================================================================ */}
      <motion.div className="stats-row" variants={itemVariants}>
        <div className="stat-card">
          <div className="stat-icon xp"><Trophy size={20} color="var(--primary)" /></div>
          <span className="stat-number">{stats.xp.toLocaleString()}</span>
          <span className="stat-label">Total XP</span>
          <span className="stat-sub">Level {stats.level} &middot; {xpProgress}%</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon words"><BookOpen size={20} color="var(--mimi-green)" /></div>
          <span className="stat-number">{stats.wordsLearned}</span>
          <span className="stat-label">Words Learned</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon streak"><Flame size={20} color="var(--warning)" /></div>
          <span className="stat-number">{stats.streakDays}</span>
          <span className="stat-label">Streak Days</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon lessons"><GraduationCap size={20} color="var(--info)" /></div>
          <span className="stat-number">{stats.gamesPlayed + stats.worksheetsCompleted}</span>
          <span className="stat-label">Lessons Done</span>
        </div>
      </motion.div>

      {/* ================================================================
          D. DAILY CHALLENGE
          ================================================================ */}
      <motion.div className="daily-challenge" variants={itemVariants}>
        <div className="daily-challenge-icon">
          <Sparkles size={24} color="var(--warning)" />
        </div>
        <div className="daily-challenge-content">
          <h3 className="daily-challenge-title">{todaysChallenge.title}</h3>
          <p className="daily-challenge-desc">{todaysChallenge.desc}</p>
        </div>
        <span className="daily-challenge-reward">+{todaysChallenge.xp} XP</span>
        <Link to={todaysChallenge.path} className="daily-challenge-btn">
          Let's Go <ChevronRight size={16} />
        </Link>
      </motion.div>

      {/* ================================================================
          E. RECENT ACHIEVEMENTS
          ================================================================ */}
      <motion.div className="achievements-section" variants={itemVariants}>
        <div className="section-header">
          <Award size={20} className="section-header-icon" />
          <h2>Recent Achievements</h2>
        </div>
        {recentBadges.length > 0 ? (
          <div className="achievements-scroll">
            {recentBadges.map((badge) =>
              badge ? (
                <div className="badge-item" key={badge.id}>
                  <div className="badge-icon">{badge.icon}</div>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="no-badges">
            Complete lessons and games to earn badges!
          </p>
        )}
      </motion.div>

      {/* ================================================================
          F. QUICK ACTIONS GRID
          ================================================================ */}
      <motion.div className="quick-actions-grid" variants={itemVariants}>
        <Link to="/worlds" className="quick-action-card worlds">
          <div className="quick-action-icon">
            <Globe size={24} color="var(--mimi-green-dark)" />
          </div>
          <span className="quick-action-label">Explore Worlds</span>
        </Link>

        <Link to="/practice" className="quick-action-card practice">
          <div className="quick-action-icon">
            <Pencil size={24} color="var(--info)" />
          </div>
          <span className="quick-action-label">Practice Words</span>
        </Link>

        <Link to="/games" className="quick-action-card games">
          <div className="quick-action-icon">
            <Gamepad2 size={24} color="var(--warning)" />
          </div>
          <span className="quick-action-label">Play Games</span>
        </Link>

        <Link to="/story" className="quick-action-card story">
          <div className="quick-action-icon">
            <BookHeart size={24} color="var(--accent-pink)" />
          </div>
          <span className="quick-action-label">Mimi's Story</span>
        </Link>
      </motion.div>

      {/* ================================================================
          G. WEEKLY PROGRESS CHART
          ================================================================ */}
      <motion.div className="weekly-chart-section" variants={itemVariants}>
        <div className="section-header">
          <BarChart3 size={20} className="section-header-icon" />
          <h2>This Week</h2>
        </div>
        <div className="weekly-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--slate)', fontSize: 12, fontFamily: 'Inter' }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(232,163,23,0.08)' }}
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderRadius: 12,
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  color: 'var(--text-body)',
                }}
                formatter={(value) => value != null ? [`${value} XP`, 'Earned'] : ['', 'Earned']}
              />
              <Bar dataKey="xp" radius={[6, 6, 0, 0]} maxBarSize={36}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.xp > 0 ? 'var(--primary)' : 'var(--mist)'}
                    fillOpacity={entry.xp > 0 ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Admin shortcut (subtle) */}
      {isAdmin && (
        <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
          <Link
            to="/admin"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--text-muted)',
              textDecoration: 'underline',
            }}
          >
            Admin Panel
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
