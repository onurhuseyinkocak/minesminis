/**
 * PARENT DASHBOARD PAGE
 * Premium parent-facing view of child progress.
 * Data-rich, professional, warm — not childish.
 * Uses real data from AuthContext and GamificationContext.
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Flame,
  Clock,
  Settings,
  Download,
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  BarChart3,
  Shield,
  Lightbulb,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { useGamification, ALL_BADGES } from '../../contexts/GamificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import './ParentDashboard.css';

// ============================================================
// HELPERS
// ============================================================

/** Distribute total XP across the 7 weekdays using weekly_xp.
 *  If we had per-day tracking we'd use it; for now we spread
 *  weekly_xp across the days up to today.  */
function buildWeeklyActivity(weeklyXP: number) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  // JS getDay(): 0=Sun … 6=Sat → convert to 0=Mon … 6=Sun
  const todayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const daysElapsed = todayIdx + 1; // Mon=1 … Sun=7
  const dailyAvg = daysElapsed > 0 ? Math.round(weeklyXP / daysElapsed) : 0;

  return dayNames.map((day, idx) => {
    const xp = idx <= todayIdx ? dailyAvg : 0;
    // Rough estimate: ~2 XP per minute of learning
    const minutes = Math.round(xp / 2);
    return { day, minutes, xp };
  });
}

/** Build vocabulary mastery breakdown from words learned. */
function buildVocabularyMastery(wordsLearned: number) {
  // Assume a total curriculum of 500 words
  const TOTAL_CURRICULUM = 500;
  const mastered = Math.round(wordsLearned * 0.6);
  const reviewing = Math.round(wordsLearned * 0.25);
  const learning = wordsLearned - mastered - reviewing;
  const notStarted = Math.max(0, TOTAL_CURRICULUM - wordsLearned);

  return [
    { name: 'Mastered', value: mastered, color: 'var(--success)' },
    { name: 'Reviewing', value: reviewing, color: 'var(--primary)' },
    { name: 'Learning', value: learning, color: 'var(--info)' },
    { name: 'New', value: notStarted, color: 'var(--cloud)' },
  ];
}

/** Derive strengths and areas to practice from stats. */
function deriveStrengthsAndFocus(stats: {
  wordsLearned: number;
  gamesPlayed: number;
  videosWatched: number;
  worksheetsCompleted: number;
  streakDays: number;
}) {
  const strengths: { label: string; type: 'strength' }[] = [];
  const focus: { label: string; type: 'focus' }[] = [];

  // Strengths: areas where user is active
  if (stats.wordsLearned >= 10) strengths.push({ label: `Vocabulary (${stats.wordsLearned} words)`, type: 'strength' });
  if (stats.gamesPlayed >= 5) strengths.push({ label: `Games (${stats.gamesPlayed} played)`, type: 'strength' });
  if (stats.videosWatched >= 5) strengths.push({ label: `Videos (${stats.videosWatched} watched)`, type: 'strength' });
  if (stats.streakDays >= 3) strengths.push({ label: `Consistency (${stats.streakDays}-day streak)`, type: 'strength' });
  if (stats.worksheetsCompleted >= 3) strengths.push({ label: `Worksheets (${stats.worksheetsCompleted} done)`, type: 'strength' });

  // Focus: areas where user needs improvement
  if (stats.wordsLearned < 10) focus.push({ label: 'Learn more vocabulary words', type: 'focus' });
  if (stats.gamesPlayed < 5) focus.push({ label: 'Play more learning games', type: 'focus' });
  if (stats.videosWatched < 5) focus.push({ label: 'Watch more educational videos', type: 'focus' });
  if (stats.streakDays < 3) focus.push({ label: 'Build a daily learning streak', type: 'focus' });
  if (stats.worksheetsCompleted < 3) focus.push({ label: 'Complete more worksheets', type: 'focus' });

  return { strengths, focus };
}

/** Build dynamic recommendations based on stats. */
function buildRecommendations(stats: {
  wordsLearned: number;
  gamesPlayed: number;
  videosWatched: number;
  streakDays: number;
  level: number;
}): string[] {
  const recs: string[] = [];

  if (stats.streakDays === 0) {
    recs.push('Start a daily learning streak — even 5 minutes a day makes a big difference!');
  } else if (stats.streakDays < 7) {
    recs.push(`Great ${stats.streakDays}-day streak! Keep going to unlock streak badges.`);
  } else {
    recs.push(`Amazing ${stats.streakDays}-day streak! Consistency is building strong habits.`);
  }

  if (stats.wordsLearned < 50) {
    recs.push('Try learning 5 new words this week to boost vocabulary.');
  } else {
    recs.push(`${stats.wordsLearned} words learned — vocabulary is growing nicely!`);
  }

  if (stats.gamesPlayed < 5) {
    recs.push('Games make learning fun — try a word matching game today!');
  }

  if (stats.videosWatched < 5) {
    recs.push('Watch educational videos together for extra listening practice.');
  }

  recs.push('A short daily review session helps long-term memory retention.');

  return recs.slice(0, 3);
}

// ============================================================
// COMPONENT
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const ParentDashboard: React.FC = () => {
  const { userProfile, isAdmin } = useAuth();
  const { stats, getXPProgress, loading } = useGamification();

  const parentName = userProfile?.display_name || 'Parent';
  const childName = userProfile?.display_name || 'Learner';

  // Derived data from real stats
  const weeklyActivity = useMemo(() => buildWeeklyActivity(stats.weekly_xp), [stats.weekly_xp]);

  const vocabularyMastery = useMemo(() => buildVocabularyMastery(stats.wordsLearned), [stats.wordsLearned]);

  const totalWords = useMemo(
    () => vocabularyMastery.reduce((s, v) => s + v.value, 0),
    [vocabularyMastery],
  );

  const earnedBadges = useMemo(() => {
    return ALL_BADGES
      .filter(b => stats.badges.includes(b.id))
      .map(b => ({
        id: b.id,
        name: b.name,
        icon: b.icon,
        description: b.description,
        date: '', // No per-badge date tracking yet
      }));
  }, [stats.badges]);

  const { strengths, focus: areasToFocus } = useMemo(
    () => deriveStrengthsAndFocus(stats),
    [stats],
  );

  const recommendations = useMemo(
    () => buildRecommendations(stats),
    [stats],
  );

  const progressPercent = useMemo(() => getXPProgress(), [getXPProgress, stats.xp]);

  // Overview stats cards
  const overviewCards = useMemo(() => [
    {
      label: 'Words Learned',
      value: stats.wordsLearned,
      icon: <BookOpen size={22} />,
      color: 'var(--secondary)',
      bg: 'var(--secondary-pale)',
    },
    {
      label: 'Current Level',
      value: stats.level,
      icon: <Star size={22} />,
      color: 'var(--primary)',
      bg: 'var(--primary-pale)',
    },
    {
      label: 'Streak Days',
      value: stats.streakDays,
      icon: <Flame size={22} />,
      color: 'var(--error)',
      bg: 'var(--error-pale)',
    },
    {
      label: 'Total XP',
      value: stats.xp.toLocaleString(),
      icon: <TrendingUp size={22} />,
      color: 'var(--info)',
      bg: 'var(--info-pale)',
    },
  ], [stats]);

  const handleDownloadReport = () => {
    const report = [
      `MinesMinis Progress Report`,
      `${'='.repeat(50)}`,
      `Learner: ${childName}`,
      `Parent: ${parentName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `Overview:`,
      `- Level: ${stats.level}`,
      `- XP: ${stats.xp}`,
      `- Weekly XP: ${stats.weekly_xp}`,
      `- Words Learned: ${stats.wordsLearned}`,
      `- Games Played: ${stats.gamesPlayed}`,
      `- Videos Watched: ${stats.videosWatched}`,
      `- Worksheets Completed: ${stats.worksheetsCompleted}`,
      `- Streak: ${stats.streakDays} days`,
      ``,
      `Badges Earned: ${earnedBadges.length > 0 ? earnedBadges.map(b => b.name).join(', ') : 'None yet'}`,
      ``,
      `Vocabulary Mastery:`,
      ...vocabularyMastery.map(v => `- ${v.name}: ${v.value} words`),
      ``,
      `Strengths: ${strengths.length > 0 ? strengths.map(s => s.label).join(', ') : 'Keep exploring!'}`,
      `Areas to Practice: ${areasToFocus.length > 0 ? areasToFocus.map(a => a.label).join(', ') : 'Great work across the board!'}`,
      ``,
      `(c) MinesMinis - Learning English with Mimi`,
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minesminis-report-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  if (loading) {
    return (
      <div className="pd" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pd">
      {/* ---- MULTI-CHILD NOTE ---- */}
      <div style={{
        background: 'var(--info-pale, #e8f4fd)',
        border: '1px solid var(--info, #3b82f6)',
        borderRadius: 12,
        padding: '10px 20px',
        marginBottom: 20,
        fontSize: 14,
        color: 'var(--info-dark, #1e40af)',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
        <Users size={16} />
        Multi-child profiles coming soon. Currently showing your learner&apos;s progress.
      </div>

      {/* ---- HEADER ---- */}
      <div className="pd-header">
        <div className="pd-header__left">
          <motion.h1
            className="pd-header__title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Welcome back, {parentName}
          </motion.h1>
          <p className="pd-header__subtitle">
            Here is how <strong>{childName}</strong> is progressing
          </p>
        </div>

        <div className="pd-header__actions">
          {isAdmin && (
            <Link to="/admin" className="pd-header-link">
              <Shield size={16} /> Admin
            </Link>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="sm" icon={<Settings size={16} />}>
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* ---- OVERVIEW CARDS ---- */}
      <div className="pd-overview">
        {overviewCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Card variant="elevated" padding="lg" className="pd-overview__card">
              <div className="pd-overview__icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="pd-overview__info">
                <span className="pd-overview__value">{card.value}</span>
                <span className="pd-overview__label">{card.label}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ---- CURRENT PROGRESS ---- */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
        <Card variant="elevated" padding="lg" className="pd-progress-card">
          <div className="pd-progress-card__header">
            <div>
              <h3 className="pd-section-title">
                <TrendingUp size={20} /> Current Progress
              </h3>
              <p className="pd-progress-card__meta">
                Level {stats.level} &mdash; {stats.xp.toLocaleString()} XP total
              </p>
            </div>
            <Badge variant="info">Level {stats.level}</Badge>
          </div>
          <ProgressBar value={progressPercent} variant="default" size="lg" showLabel animated />
        </Card>
      </motion.div>

      {/* ---- CHARTS ROW ---- */}
      <div className="pd-charts">
        {/* Weekly Activity */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
          <Card variant="elevated" padding="lg" className="pd-chart-card">
            <h3 className="pd-section-title">
              <BarChart3 size={20} /> Weekly Activity
            </h3>
            <p className="pd-chart-subtitle">
              {stats.weekly_xp > 0
                ? `${stats.weekly_xp} XP earned this week`
                : 'No activity this week yet'}
            </p>
            <div className="pd-chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyActivity} barCategoryGap="20%">
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--slate)', fontSize: 13, fontFamily: 'Inter' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--stone)', fontSize: 12, fontFamily: 'Inter' }}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--cloud)',
                      borderRadius: 12,
                      fontFamily: 'Inter',
                      fontSize: 13,
                    }}
                    formatter={(value: number) => [`${value} XP`, 'XP Earned']}
                  />
                  <Bar dataKey="xp" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {weeklyActivity.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.xp >= 50 ? 'var(--secondary)' : entry.xp >= 20 ? 'var(--secondary-light)' : entry.xp > 0 ? 'var(--primary-light, #93c5fd)' : 'var(--cloud)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Vocabulary Mastery Donut */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
          <Card variant="elevated" padding="lg" className="pd-chart-card">
            <h3 className="pd-section-title">
              <BookOpen size={20} /> Vocabulary Mastery
            </h3>
            <p className="pd-chart-subtitle">{totalWords} words in curriculum</p>
            <div className="pd-donut-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={vocabularyMastery}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                  >
                    {vocabularyMastery.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--cloud)',
                      borderRadius: 12,
                      fontFamily: 'Inter',
                      fontSize: 13,
                    }}
                    formatter={(value: number, name: string) => [`${value} words`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pd-donut-legend">
                {vocabularyMastery.map(v => (
                  <div key={v.name} className="pd-donut-legend__item">
                    <span className="pd-donut-legend__dot" style={{ background: v.color }} />
                    <span className="pd-donut-legend__name">{v.name}</span>
                    <span className="pd-donut-legend__value">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ---- BOTTOM ROW ---- */}
      <div className="pd-bottom">
        {/* Recent Achievements */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
          <Card variant="elevated" padding="lg" className="pd-achievements-card">
            <h3 className="pd-section-title">
              <Award size={20} /> Recent Achievements
            </h3>
            <div className="pd-achievements-list">
              {earnedBadges.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>
                  No badges earned yet. Keep learning to unlock achievements!
                </p>
              ) : earnedBadges.map(a => (
                <div key={a.id} className="pd-achievement">
                  <span className="pd-achievement__icon">{a.icon}</span>
                  <div className="pd-achievement__info">
                    <span className="pd-achievement__name">{a.name}</span>
                    <span className="pd-achievement__desc">{a.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Strengths & Focus */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
          <Card variant="elevated" padding="lg" className="pd-strengths-card">
            <h3 className="pd-section-title">
              <TrendingUp size={20} /> Strengths & Areas to Practice
            </h3>
            <div className="pd-strengths-list">
              {strengths.length === 0 && areasToFocus.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '8px 0' }}>
                  Start learning to see strengths and areas to improve!
                </p>
              )}
              {strengths.map(s => (
                <div key={s.label} className="pd-strength-item pd-strength-item--good">
                  <CheckCircle2 size={18} />
                  <span>{s.label}</span>
                </div>
              ))}
              {areasToFocus.map(a => (
                <div key={a.label} className="pd-strength-item pd-strength-item--focus">
                  <AlertCircle size={18} />
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
          <Card variant="elevated" padding="lg" className="pd-reco-card">
            <h3 className="pd-section-title">
              <Lightbulb size={20} /> Recommendations
            </h3>
            <div className="pd-reco-list">
              {recommendations.map((r, i) => (
                <div key={i} className="pd-reco-item">
                  <Lightbulb size={16} className="pd-reco-icon" />
                  <p>{r}</p>
                </div>
              ))}
            </div>
            <Link to="/profile" className="pd-settings-link">
              <Settings size={14} /> Manage account settings
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;
