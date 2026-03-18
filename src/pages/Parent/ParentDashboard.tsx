/**
 * PARENT ANALYTICS DASHBOARD
 * Comprehensive learning analytics platform for parents.
 * Shows phonics mastery, activity timelines, learning insights,
 * activity breakdown, recent activity feed, and report actions.
 */

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Flame,
  Clock,
  Settings,
  Download,
  Mail,
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  BarChart3,
  Shield,
  Lightbulb,
  Plus,
  X,
  UserPlus,
  Target,
  Music,
  Gamepad2,
  Zap,
  Calendar,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PhonicsChart } from '../../components/phonics/PhonicsChart';
import {
  ChildProfile,
  getChildren,
  addChild,
  removeChild,
  switchActiveChild,
  getActiveChildId,
  AVATARS,
  AGE_GROUPS,
  MAX_CHILDREN,
} from '../../services/childProfileService';
import { getProgress } from '../../services/learningPathService';
import {
  getRecentActivities,
  getWeeklyActivityData,
  getActivityBreakdown,
  getTodayMinutes,
  getWeeklySummary,
} from '../../services/activityLogger';
import type { ActivityLog, DayActivity } from '../../services/activityLogger';
import { LS_PHONICS_MASTERY } from '../../config/storageKeys';
import './ParentDashboard.css';

// ============================================================
// CONSTANTS
// ============================================================

const DAILY_TIME_LIMIT = 30; // minutes

const PHASE_LABELS: Record<number, string> = {
  1: 'Little Ears',
  2: 'Sound Explorers',
  3: 'Word Builders',
  4: 'Sentence Stars',
  5: 'Story Readers',
  6: 'Fluent Friends',
  7: 'Master Learners',
};

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  phonics: 'Phonics Lessons',
  game: 'Games',
  reading: 'Reading',
  song: 'Songs',
  review: 'Review',
  challenge: 'Challenges',
};

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  phonics: 'var(--secondary, #10b981)',
  game: 'var(--primary, #3b82f6)',
  reading: 'var(--accent-purple, #8b5cf6)',
  song: 'var(--warning, #f59e0b)',
  review: 'var(--info, #06b6d4)',
  challenge: 'var(--error, #ef4444)',
};

// ============================================================
// HELPERS
// ============================================================

const DEFAULT_CHILD_ID = '__default__';

function makeDefaultChild(
  parentId: string,
  displayName: string,
  gamificationStats: {
    xp: number;
    level: number;
    wordsLearned: number;
    gamesPlayed: number;
    streakDays: number;
  },
): ChildProfile {
  return {
    id: DEFAULT_CHILD_ID,
    name: displayName || 'Learner',
    age_group: '',
    avatar: '\uD83C\uDF1F',
    parent_id: parentId,
    created_at: '',
    xp: gamificationStats.xp,
    level: gamificationStats.level,
    words_learned: gamificationStats.wordsLearned,
    games_played: gamificationStats.gamesPlayed,
    streak_days: gamificationStats.streakDays,
  };
}

/** Read phonics mastery from localStorage for PhonicsChart */
function getPhonicsProgressMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_PHONICS_MASTERY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Record<string, { mastery: number }>;
    const map: Record<string, number> = {};
    for (const [key, val] of Object.entries(data)) {
      map[key] = val.mastery ?? 0;
    }
    return map;
  } catch {
    return {};
  }
}

/** Count mastered sounds from progress map */
function countMastered(progress: Record<string, number>): { mastered: number; total: number } {
  const total = 42; // Jolly Phonics 42 sounds
  const mastered = Object.values(progress).filter((v) => v >= 70).length;
  return { mastered, total };
}

/** Find strongest and weakest sound areas */
function findStrengthsAndWeaknesses(progress: Record<string, number>): {
  strongest: string;
  needsPractice: string;
} {
  const entries = Object.entries(progress);
  if (entries.length === 0) {
    return { strongest: 'none yet', needsPractice: 'start with Group 1' };
  }

  entries.sort((a, b) => b[1] - a[1]);
  const strongest = entries[0]?.[0] || 'none';
  const weakest = entries.filter((e) => e[1] > 0 && e[1] < 70);
  const needsPractice = weakest.length > 0
    ? `'${weakest[weakest.length - 1][0]}' sounds`
    : 'all looking great!';

  return {
    strongest: `'${strongest}' sounds`,
    needsPractice,
  };
}

/** Build learning insights from data */
function buildInsights(
  phonicsProgress: Record<string, number>,
  streakDays: number,
  weeklySummary: { totalMinutes: number; sessionCount: number; previousWeekMinutes: number },
): { icon: string; text: string; type: 'success' | 'warning' | 'tip' | 'achievement' }[] {
  const insights: { icon: string; text: string; type: 'success' | 'warning' | 'tip' | 'achievement' }[] = [];

  // Count newly mastered sounds this week (approximate)
  const masteredCount = Object.values(phonicsProgress).filter((v) => v >= 70).length;
  if (masteredCount > 0) {
    insights.push({
      icon: '\uD83C\uDFAF',
      text: `Mastered ${masteredCount} sound${masteredCount > 1 ? 's' : ''} so far!`,
      type: 'success',
    });
  }

  // Sounds that need practice
  const needsPractice = Object.entries(phonicsProgress).filter(
    ([, v]) => v > 0 && v < 50,
  );
  if (needsPractice.length > 0) {
    const soundNames = needsPractice
      .slice(0, 2)
      .map(([k]) => `'${k}'`)
      .join(', ');
    insights.push({
      icon: '\u26A0\uFE0F',
      text: `${soundNames} sound${needsPractice.length > 1 ? 's' : ''} need${needsPractice.length === 1 ? 's' : ''} more practice`,
      type: 'warning',
    });
  }

  // Recommendation based on progress
  const currentProgress = getProgress();
  if (currentProgress.group <= 2) {
    insights.push({
      icon: '\uD83D\uDCA1',
      text: 'Try the Rhyme Songs for Group 2!',
      type: 'tip',
    });
  } else if (currentProgress.group <= 4) {
    insights.push({
      icon: '\uD83D\uDCA1',
      text: 'Word Match games will help reinforce these sounds!',
      type: 'tip',
    });
  } else {
    insights.push({
      icon: '\uD83D\uDCA1',
      text: 'Try reading the decodable stories for extra practice!',
      type: 'tip',
    });
  }

  // Streak
  if (streakDays >= 5) {
    insights.push({
      icon: '\uD83C\uDFC6',
      text: `${streakDays}-day streak! Keep it up!`,
      type: 'achievement',
    });
  } else if (streakDays >= 2) {
    insights.push({
      icon: '\uD83D\uDD25',
      text: `${streakDays}-day streak building! Great consistency!`,
      type: 'achievement',
    });
  }

  return insights.slice(0, 4);
}

/** Format relative time */
function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/** Get icon for activity type */
function getActivityIcon(type: string): React.ReactNode {
  switch (type) {
    case 'phonics': return <Music size={14} />;
    case 'game': return <Gamepad2 size={14} />;
    case 'reading': return <BookOpen size={14} />;
    case 'song': return <Music size={14} />;
    case 'review': return <Target size={14} />;
    case 'challenge': return <Zap size={14} />;
    default: return <Activity size={14} />;
  }
}

// ============================================================
// ADD CHILD MODAL
// ============================================================

interface AddChildModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; age_group: string; avatar: string }) => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('6-8');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { toast.error('Please enter a name.'); return; }
    if (trimmed.length > 30) { toast.error('Name must be 30 characters or fewer.'); return; }
    onAdd({ name: trimmed, age_group: ageGroup, avatar });
    setName('');
    setAgeGroup('6-8');
    setAvatar(AVATARS[0]);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pd-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card, #fff)', borderRadius: 20, padding: 28,
              width: '100%', maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)', position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: 4,
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              Add Child Profile
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-muted)' }}>
              Create a learner profile to track progress separately.
            </p>

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Name</span>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mimi" maxLength={30} autoFocus
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid var(--cloud, #e0e0e0)', fontSize: 15,
                    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Age Group</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {AGE_GROUPS.map((ag) => (
                    <button
                      key={ag} type="button" onClick={() => setAgeGroup(ag)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 10,
                        border: ageGroup === ag ? '2px solid var(--primary)' : '1.5px solid var(--cloud, #e0e0e0)',
                        background: ageGroup === ag ? 'var(--primary-pale, #eff6ff)' : 'transparent',
                        color: ageGroup === ag ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </label>

              <label style={{ display: 'block', marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Avatar</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AVATARS.map((a) => (
                    <button
                      key={a} type="button" onClick={() => setAvatar(a)}
                      style={{
                        width: 44, height: 44, borderRadius: 12,
                        border: avatar === a ? '2.5px solid var(--primary)' : '1.5px solid var(--cloud, #e0e0e0)',
                        background: avatar === a ? 'var(--primary-pale, #eff6ff)' : 'transparent',
                        fontSize: 22, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </label>

              <Button type="submit" variant="primary" size="md" style={{ width: '100%' }}>
                <UserPlus size={16} style={{ marginRight: 6 }} />
                Add Child
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================
// ANIMATION
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

// ============================================================
// SECTION COMPONENTS
// ============================================================

/** Section 1: Child Overview Card */
const ChildOverviewCard: React.FC<{
  child: ChildProfile;
  streakDays: number;
  todayMinutes: number;
  currentPhase: number;
  currentGroup: number;
  phonicsPercent: number;
}> = ({ child, streakDays, todayMinutes, currentPhase, currentGroup, phonicsPercent }) => {
  const phaseLabel = PHASE_LABELS[currentPhase] || `Phase ${currentPhase}`;

  return (
    <Card variant="elevated" padding="lg" className="pd-overview-hero">
      <div className="pd-hero-left">
        <div className="pd-hero-avatar">{child.avatar}</div>
        <div className="pd-hero-info">
          <h2 className="pd-hero-name">{child.name}</h2>
          {child.age_group && (
            <span className="pd-hero-age">Age {child.age_group}</span>
          )}
          <div className="pd-hero-badges">
            <Badge variant="info">{phaseLabel}</Badge>
            <Badge variant="default">Group {currentGroup}</Badge>
          </div>
        </div>
      </div>

      <div className="pd-hero-right">
        {/* Progress Ring */}
        <div className="pd-hero-ring">
          <svg viewBox="0 0 80 80" width="72" height="72">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--cloud, #e5e7eb)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="var(--secondary, #10b981)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - phonicsPercent / 100)}`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <text x="40" y="38" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text-primary)">{phonicsPercent}%</text>
            <text x="40" y="50" textAnchor="middle" fontSize="8" fill="var(--text-muted)">mastery</text>
          </svg>
        </div>

        {/* Streak */}
        <div className="pd-hero-streak">
          <Flame size={20} style={{ color: streakDays > 0 ? 'var(--error, #ef4444)' : 'var(--cloud)' }} />
          <span className="pd-hero-streak-count">{streakDays}</span>
          <span className="pd-hero-streak-label">day streak</span>
        </div>

        {/* Time today */}
        <div className="pd-hero-time">
          <Clock size={16} style={{ color: 'var(--text-muted)' }} />
          <div className="pd-hero-time-bar">
            <div
              className="pd-hero-time-fill"
              style={{ width: `${Math.min(100, (todayMinutes / DAILY_TIME_LIMIT) * 100)}%` }}
            />
          </div>
          <span className="pd-hero-time-label">
            {todayMinutes} / {DAILY_TIME_LIMIT} min
          </span>
        </div>
      </div>
    </Card>
  );
};

/** Section 3: Weekly Activity Timeline */
const WeeklyTimeline: React.FC<{
  weeklyData: DayActivity[];
  weeklySummary: { totalMinutes: number; sessionCount: number; previousWeekMinutes: number };
}> = ({ weeklyData, weeklySummary }) => {
  const maxMinutes = Math.max(...weeklyData.map((d) => d.totalMinutes), 1);
  const diff = weeklySummary.totalMinutes - weeklySummary.previousWeekMinutes;

  return (
    <Card variant="elevated" padding="lg" className="pd-chart-card">
      <h3 className="pd-section-title">
        <Calendar size={20} /> Weekly Activity Timeline
      </h3>
      <p className="pd-chart-subtitle">
        This week: {weeklySummary.totalMinutes} min across {weeklySummary.sessionCount} sessions
        {diff !== 0 && (
          <span style={{ marginLeft: 8, color: diff > 0 ? 'var(--secondary, #10b981)' : 'var(--error, #ef4444)' }}>
            {diff > 0 ? '\u2191' : '\u2193'} {Math.abs(diff)} min {diff > 0 ? 'more' : 'less'} than last week
          </span>
        )}
      </p>

      <div className="pd-timeline">
        {weeklyData.map((day) => (
          <div key={day.date} className="pd-timeline-day">
            <div className="pd-timeline-bar-container">
              <motion.div
                className="pd-timeline-bar"
                initial={{ height: 0 }}
                animate={{ height: `${maxMinutes > 0 ? (day.totalMinutes / maxMinutes) * 100 : 0}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  background: day.totalMinutes > 0
                    ? 'var(--secondary, #10b981)'
                    : 'var(--cloud, #e5e7eb)',
                  minHeight: 4,
                }}
                title={`${day.totalMinutes} min, ${day.sessionCount} sessions`}
              />
            </div>
            <div className="pd-timeline-icons">
              {day.activities.slice(0, 3).map((act, i) => (
                <span key={i} className="pd-timeline-icon" title={act.title}>
                  {getActivityIcon(act.type)}
                </span>
              ))}
            </div>
            <span className="pd-timeline-label">{day.dayLabel}</span>
            {day.totalMinutes > 0 && (
              <span className="pd-timeline-minutes">{day.totalMinutes}m</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

/** Section 4: Learning Insights */
const InsightsSection: React.FC<{
  insights: { icon: string; text: string; type: 'success' | 'warning' | 'tip' | 'achievement' }[];
}> = ({ insights }) => {
  const typeColors: Record<string, { bg: string; border: string }> = {
    success: { bg: 'var(--success-pale, #ecfdf5)', border: 'var(--success, #10b981)' },
    warning: { bg: 'var(--warning-pale, #fffbeb)', border: 'var(--warning, #f59e0b)' },
    tip: { bg: 'var(--primary-pale, #eff6ff)', border: 'var(--primary, #3b82f6)' },
    achievement: { bg: 'var(--secondary-pale, #ecfdf5)', border: 'var(--secondary, #10b981)' },
  };

  return (
    <Card variant="elevated" padding="lg">
      <h3 className="pd-section-title">
        <Lightbulb size={20} /> Learning Insights
      </h3>
      <div className="pd-insights-grid">
        {insights.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>
            Start learning to see personalized insights!
          </p>
        ) : (
          insights.map((insight, i) => {
            const colors = typeColors[insight.type] || typeColors.tip;
            return (
              <motion.div
                key={i}
                className="pd-insight-card"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: colors.bg,
                  borderLeft: `3px solid ${colors.border}`,
                }}
              >
                <span className="pd-insight-icon">{insight.icon}</span>
                <span className="pd-insight-text">{insight.text}</span>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
};

/** Section 5: Activity Breakdown (CSS conic-gradient pie chart) */
const ActivityBreakdownChart: React.FC<{
  breakdown: Record<string, number>;
}> = ({ breakdown }) => {
  const totalSeconds = Object.values(breakdown).reduce((s, v) => s + v, 0);

  // Build conic-gradient segments
  const segments: { type: string; percent: number; color: string }[] = [];
  let cumulative = 0;

  for (const [type, seconds] of Object.entries(breakdown)) {
    if (seconds <= 0) continue;
    const pct = (seconds / totalSeconds) * 100;
    segments.push({ type, percent: pct, color: ACTIVITY_TYPE_COLORS[type] || 'var(--cloud)' });
    cumulative += pct;
  }

  // Build gradient string
  let gradientParts: string[] = [];
  let currentAngle = 0;
  for (const seg of segments) {
    const endAngle = currentAngle + (seg.percent / 100) * 360;
    gradientParts.push(`${seg.color} ${currentAngle}deg ${endAngle}deg`);
    currentAngle = endAngle;
  }
  if (gradientParts.length === 0) {
    gradientParts = ['var(--cloud, #e5e7eb) 0deg 360deg'];
  }

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <Card variant="elevated" padding="lg">
      <h3 className="pd-section-title">
        <BarChart3 size={20} /> Activity Breakdown
      </h3>
      <div className="pd-breakdown">
        <div
          className="pd-breakdown-pie"
          style={{ background: conicGradient }}
        >
          <div className="pd-breakdown-pie-center">
            <span className="pd-breakdown-total">
              {totalSeconds > 0 ? Math.round(totalSeconds / 60) : 0}
            </span>
            <span className="pd-breakdown-total-label">min total</span>
          </div>
        </div>
        <div className="pd-breakdown-legend">
          {segments.map((seg) => (
            <div key={seg.type} className="pd-breakdown-legend-item">
              <span className="pd-breakdown-dot" style={{ background: seg.color }} />
              <span className="pd-breakdown-type">
                {ACTIVITY_TYPE_LABELS[seg.type] || seg.type}
              </span>
              <span className="pd-breakdown-pct">{Math.round(seg.percent)}%</span>
            </div>
          ))}
          {segments.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No activity data yet</p>
          )}
        </div>
      </div>
    </Card>
  );
};

/** Section 6: Recent Activity Feed */
const RecentActivityFeed: React.FC<{
  activities: ActivityLog[];
}> = ({ activities }) => {
  return (
    <Card variant="elevated" padding="lg">
      <h3 className="pd-section-title">
        <Activity size={20} /> Recent Activity
      </h3>
      <div className="pd-feed">
        {activities.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>
            No activities recorded yet. Start a lesson to begin tracking!
          </p>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="pd-feed-item">
              <div className="pd-feed-icon" style={{ color: ACTIVITY_TYPE_COLORS[act.type] || 'var(--text-muted)' }}>
                {getActivityIcon(act.type)}
              </div>
              <div className="pd-feed-content">
                <span className="pd-feed-title">{act.title}</span>
                <span className="pd-feed-meta">
                  {act.accuracy !== undefined && `${act.accuracy}% accuracy \u2022 `}
                  +{act.xpEarned} XP
                </span>
              </div>
              <span className="pd-feed-time">{timeAgo(act.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ParentDashboard: React.FC = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const { stats, loading } = useGamification();

  const parentId = user?.uid || '';
  const parentName = userProfile?.display_name || 'Parent';

  // ---- Multi-child state ----
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>(DEFAULT_CHILD_ID);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!parentId) return;
    const saved = getChildren(parentId);
    setChildProfiles(saved);

    const savedActive = getActiveChildId();
    if (savedActive && (saved.some((c) => c.id === savedActive) || savedActive === DEFAULT_CHILD_ID)) {
      setActiveChildId(savedActive);
    } else {
      setActiveChildId(DEFAULT_CHILD_ID);
    }
  }, [parentId]);

  const defaultChild = useMemo(
    () => makeDefaultChild(parentId, parentName, stats),
    [parentId, parentName, stats],
  );

  const allChildren = useMemo(
    () => [defaultChild, ...childProfiles],
    [defaultChild, childProfiles],
  );

  const activeChild = useMemo(
    () => allChildren.find((c) => c.id === activeChildId) || defaultChild,
    [allChildren, activeChildId, defaultChild],
  );

  // ---- Handlers ----
  const handleSelectChild = useCallback((id: string) => {
    setActiveChildId(id);
    switchActiveChild(id);
  }, []);

  const handleAddChild = useCallback((data: { name: string; age_group: string; avatar: string }) => {
    if (!parentId) return;
    try {
      addChild(parentId, data);
      setChildProfiles(getChildren(parentId));
      setShowAddModal(false);
      toast.success(`${data.name}'s profile created!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add child.');
    }
  }, [parentId]);

  const handleRemoveChild = useCallback((childId: string, name: string) => {
    if (!parentId) return;
    const confirmed = window.confirm(`Remove ${name}'s profile? This cannot be undone.`);
    if (!confirmed) return;
    removeChild(parentId, childId);
    setChildProfiles(getChildren(parentId));
    if (activeChildId === childId) {
      setActiveChildId(DEFAULT_CHILD_ID);
      switchActiveChild(DEFAULT_CHILD_ID);
    }
    toast.success(`${name}'s profile removed.`);
  }, [parentId, activeChildId]);

  // ---- Derived data ----
  const phonicsProgress = useMemo(() => getPhonicsProgressMap(), []);
  const learningProgress = useMemo(() => getProgress(), []);
  const { mastered, total: totalSounds } = useMemo(() => countMastered(phonicsProgress), [phonicsProgress]);
  const phonicsPercent = useMemo(
    () => totalSounds > 0 ? Math.round((mastered / totalSounds) * 100) : 0,
    [mastered, totalSounds],
  );
  const { strongest, needsPractice } = useMemo(
    () => findStrengthsAndWeaknesses(phonicsProgress),
    [phonicsProgress],
  );

  const weeklyData = useMemo(() => getWeeklyActivityData(), []);
  const weeklySummary = useMemo(() => getWeeklySummary(), []);
  const activityBreakdown = useMemo(() => getActivityBreakdown(), []);
  const recentActivities = useMemo(() => getRecentActivities(10), []);
  const todayMinutes = useMemo(() => getTodayMinutes(), []);

  const insights = useMemo(
    () => buildInsights(phonicsProgress, stats.streakDays, weeklySummary),
    [phonicsProgress, stats.streakDays, weeklySummary],
  );

  // ---- Report generation ----
  const handleDownloadReport = useCallback(() => {
    const report = [
      `MinesMinis Weekly Progress Report`,
      `${'='.repeat(50)}`,
      `Learner: ${activeChild.name}`,
      `Parent: ${parentName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `--- Phonics Mastery ---`,
      `Mastered: ${mastered}/${totalSounds} sounds (${phonicsPercent}%)`,
      `Strongest: ${strongest}`,
      `Needs Practice: ${needsPractice}`,
      `Current Phase: ${PHASE_LABELS[learningProgress.phase] || `Phase ${learningProgress.phase}`}`,
      `Current Group: ${learningProgress.group}`,
      ``,
      `--- Weekly Activity ---`,
      `Total Time: ${weeklySummary.totalMinutes} minutes`,
      `Sessions: ${weeklySummary.sessionCount}`,
      `Compared to Last Week: ${weeklySummary.totalMinutes - weeklySummary.previousWeekMinutes >= 0 ? '+' : ''}${weeklySummary.totalMinutes - weeklySummary.previousWeekMinutes} minutes`,
      ``,
      `--- Stats ---`,
      `Level: ${stats.level}`,
      `Total XP: ${stats.xp}`,
      `Streak: ${stats.streakDays} days`,
      `Words Learned: ${stats.wordsLearned}`,
      `Games Played: ${stats.gamesPlayed}`,
      ``,
      `--- Learning Insights ---`,
      ...insights.map((i) => `${i.icon} ${i.text}`),
      ``,
      `--- Recent Activities ---`,
      ...recentActivities.slice(0, 5).map((a) =>
        `- ${a.title} (${a.accuracy !== undefined ? a.accuracy + '% accuracy, ' : ''}+${a.xpEarned} XP)`
      ),
      ``,
      `Generated by MinesMinis - Learning English with Mimi`,
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minesminis-report-${activeChild.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  }, [activeChild, parentName, mastered, totalSounds, phonicsPercent, strongest, needsPractice, learningProgress, weeklySummary, stats, insights, recentActivities]);

  const handleEmailReport = useCallback(() => {
    toast.success('Email report feature coming soon! Use Download for now.');
  }, []);

  if (loading) {
    return (
      <div className="pd" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pd">
      {/* ---- CHILD SELECTOR TABS ---- */}
      <div className="pd-child-tabs">
        {allChildren.map((child) => {
          const isActive = child.id === activeChildId;
          const isDefault = child.id === DEFAULT_CHILD_ID;
          return (
            <div key={child.id} style={{ position: 'relative' }}>
              <button
                onClick={() => handleSelectChild(child.id)}
                className={`pd-child-tab ${isActive ? 'pd-child-tab--active' : ''}`}
              >
                <span style={{ fontSize: 18 }}>{child.avatar}</span>
                <span>{child.name}</span>
                {isDefault && <span style={{ fontSize: 11, opacity: 0.7 }}>(You)</span>}
              </button>
              {!isDefault && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveChild(child.id, child.name); }}
                  title={`Remove ${child.name}`}
                  className="pd-child-tab-remove"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
        {childProfiles.length < MAX_CHILDREN && (
          <button onClick={() => setShowAddModal(true)} className="pd-child-tab pd-child-tab--add">
            <Plus size={16} />
            Add Child
          </button>
        )}
      </div>

      <AddChildModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddChild} />

      {/* ---- HEADER ---- */}
      <div className="pd-header">
        <div className="pd-header__left">
          <motion.h1
            className="pd-header__title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeChild.name}&apos;s Learning Dashboard
          </motion.h1>
          <p className="pd-header__subtitle">
            Comprehensive analytics for <strong>{parentName}</strong>
          </p>
        </div>
        <div className="pd-header__actions">
          {isAdmin && (
            <Link to="/admin" className="pd-header-link">
              <Shield size={16} /> Admin
            </Link>
          )}
          <Link to="/profile">
            <Button variant="ghost" size="sm" icon={<Settings size={16} />}>
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* ---- SECTION 1: CHILD OVERVIEW ---- */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
        <ChildOverviewCard
          child={activeChild}
          streakDays={stats.streakDays}
          todayMinutes={todayMinutes}
          currentPhase={learningProgress.phase}
          currentGroup={learningProgress.group}
          phonicsPercent={phonicsPercent}
        />
      </motion.div>

      {/* ---- SECTION 2: PHONICS MASTERY CHART ---- */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} style={{ marginTop: 'var(--space-lg)' }}>
        <Card variant="elevated" padding="lg">
          <h3 className="pd-section-title">
            <BookOpen size={20} /> Phonics Mastery
          </h3>
          <PhonicsChart progress={phonicsProgress} />
          <div className="pd-phonics-summary">
            <div className="pd-phonics-stat">
              <strong>Mastered:</strong> {mastered}/{totalSounds} sounds ({phonicsPercent}%)
            </div>
            <div className="pd-phonics-stat">
              <strong>Strongest:</strong> {strongest}
            </div>
            <div className="pd-phonics-stat">
              <strong>Needs practice:</strong> {needsPractice}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ---- SECTION 3: WEEKLY ACTIVITY TIMELINE ---- */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} style={{ marginTop: 'var(--space-lg)' }}>
        <WeeklyTimeline weeklyData={weeklyData} weeklySummary={weeklySummary} />
      </motion.div>

      {/* ---- SECTIONS 4 & 5: INSIGHTS + ACTIVITY BREAKDOWN ---- */}
      <div className="pd-charts" style={{ marginTop: 'var(--space-lg)' }}>
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <InsightsSection insights={insights} />
        </motion.div>
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <ActivityBreakdownChart breakdown={activityBreakdown} />
        </motion.div>
      </div>

      {/* ---- SECTION 6: RECENT ACTIVITY FEED ---- */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} style={{ marginTop: 'var(--space-lg)' }}>
        <RecentActivityFeed activities={recentActivities} />
      </motion.div>

      {/* ---- SECTION 7: REPORT ACTIONS ---- */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp} style={{ marginTop: 'var(--space-lg)' }}>
        <Card variant="elevated" padding="lg">
          <h3 className="pd-section-title">
            <Award size={20} /> Reports & Settings
          </h3>
          <div className="pd-report-actions">
            <Button
              variant="primary"
              size="md"
              icon={<Download size={16} />}
              onClick={handleDownloadReport}
            >
              Download Weekly Report
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Mail size={16} />}
              onClick={handleEmailReport}
            >
              Email Report
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="md" icon={<Settings size={16} />}>
                Settings
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParentDashboard;
