/**
 * PARENT DASHBOARD PAGE
 * Premium parent-facing view of child progress.
 * Data-rich, professional, warm — not childish.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Flame,
  Clock,
  Settings,
  Download,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  BarChart3,
  Shield,
  Lightbulb,
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
import { useGamification } from '../../contexts/GamificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import './ParentDashboard.css';

// ============================================================
// DEMO DATA — shown until real child profiles are connected
// ============================================================

const MOCK_CHILDREN = [
  { id: '1', name: 'Demo Child', avatar: '', level: 1, age: 7 },
];

const WEEKLY_ACTIVITY = [
  { day: 'Mon', minutes: 0, xp: 0 },
  { day: 'Tue', minutes: 0, xp: 0 },
  { day: 'Wed', minutes: 0, xp: 0 },
  { day: 'Thu', minutes: 0, xp: 0 },
  { day: 'Fri', minutes: 0, xp: 0 },
  { day: 'Sat', minutes: 0, xp: 0 },
  { day: 'Sun', minutes: 0, xp: 0 },
];

const VOCABULARY_MASTERY = [
  { name: 'Mastered', value: 0, color: 'var(--success)' },
  { name: 'Reviewing', value: 0, color: 'var(--primary)' },
  { name: 'Learning', value: 0, color: 'var(--info)' },
  { name: 'New', value: 0, color: 'var(--cloud)' },
];

const RECENT_ACHIEVEMENTS: { id: string; name: string; icon: string; description: string; date: string }[] = [];

const STRENGTHS = [
  { label: 'Colors & Shapes', type: 'strength' as const },
  { label: 'Animal Names', type: 'strength' as const },
  { label: 'Greetings', type: 'strength' as const },
];

const AREAS_TO_PRACTICE = [
  { label: 'Numbers 11-20', type: 'focus' as const },
  { label: 'Family Members', type: 'focus' as const },
];

const RECOMMENDATIONS = [
  'Encourage Elif to practice numbers this week — she is close to mastering them!',
  'Try the "Family" story together for extra bonding and vocabulary.',
  'A 5-minute daily review session helps long-term retention.',
];

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
  const { stats } = useGamification();
  const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0]);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);

  const parentName = userProfile?.display_name || 'Parent';
  const childName = selectedChild.name;

  // Overview stats cards
  const overviewCards = useMemo(() => [
    {
      label: 'Words Learned',
      value: stats.wordsLearned ?? 85,
      icon: <BookOpen size={22} />,
      color: 'var(--secondary)',
      bg: 'var(--secondary-pale)',
    },
    {
      label: 'Current Level',
      value: stats.level ?? 5,
      icon: <Star size={22} />,
      color: 'var(--primary)',
      bg: 'var(--primary-pale)',
    },
    {
      label: 'Streak Days',
      value: stats.streakDays ?? 12,
      icon: <Flame size={22} />,
      color: 'var(--error)',
      bg: 'var(--error-pale)',
    },
    {
      label: 'Time This Week',
      value: '--',
      icon: <Clock size={22} />,
      color: 'var(--info)',
      bg: 'var(--info-pale)',
    },
  ], [stats]);

  const totalWords = VOCABULARY_MASTERY.reduce((s, v) => s + v.value, 0);

  const handleDownloadReport = () => {
    const report = [
      `MinesMinis Progress Report`,
      `${'='.repeat(50)}`,
      `Child: ${childName}`,
      `Parent: ${parentName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `Overview:`,
      `- Level: ${stats.level}`,
      `- XP: ${stats.xp}`,
      `- Words Learned: ${stats.wordsLearned}`,
      `- Streak: ${stats.streakDays} days`,
      ``,
      `Vocabulary Mastery:`,
      ...VOCABULARY_MASTERY.map(v => `- ${v.name}: ${v.value} words`),
      ``,
      `Strengths: ${STRENGTHS.map(s => s.label).join(', ')}`,
      `Areas to Practice: ${AREAS_TO_PRACTICE.map(a => a.label).join(', ')}`,
      ``,
      `(c) MinesMinis - Learning English with Mimi`,
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minesminis-report-${childName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  return (
    <div className="pd">
      {/* ---- DEMO BANNER ---- */}
      <div style={{
        background: 'var(--primary-pale)',
        border: '1px solid var(--primary)',
        borderRadius: 12,
        padding: '12px 20px',
        marginBottom: 20,
        fontSize: 14,
        color: 'var(--primary-dark)',
        textAlign: 'center',
      }}>
        This is a preview of the Parent Dashboard. Real child data will appear once multi-child profiles are available.
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

          {/* Child selector */}
          {MOCK_CHILDREN.length > 1 && (
            <div className="pd-child-selector">
              <button
                className="pd-child-selector__btn"
                onClick={() => setChildDropdownOpen(!childDropdownOpen)}
              >
                <Avatar size="sm" fallback={childName[0]} />
                <span>{childName}</span>
                <ChevronDown size={16} />
              </button>
              {childDropdownOpen && (
                <div className="pd-child-selector__dropdown">
                  {MOCK_CHILDREN.map(child => (
                    <button
                      key={child.id}
                      className={`pd-child-selector__option ${child.id === selectedChild.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedChild(child);
                        setChildDropdownOpen(false);
                      }}
                    >
                      <Avatar size="sm" fallback={child.name[0]} />
                      <div>
                        <span className="pd-child-name">{child.name}</span>
                        <span className="pd-child-meta">Level {child.level} &middot; Age {child.age}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
                Learning journey in progress
              </p>
            </div>
            <Badge variant="info">In Progress</Badge>
          </div>
          <ProgressBar value={50} variant="default" size="lg" showLabel animated />
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
            <p className="pd-chart-subtitle">Minutes spent learning each day</p>
            <div className="pd-chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={WEEKLY_ACTIVITY} barCategoryGap="20%">
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
                    formatter={(value) => value != null ? [`${value} min`, 'Time'] : ['', 'Time']}
                  />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {WEEKLY_ACTIVITY.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.minutes >= 25 ? 'var(--secondary)' : entry.minutes >= 15 ? 'var(--secondary-light)' : 'var(--cloud)'}
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
            <p className="pd-chart-subtitle">{totalWords} words total</p>
            <div className="pd-donut-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={VOCABULARY_MASTERY}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                  >
                    {VOCABULARY_MASTERY.map((entry, idx) => (
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
                    formatter={(value, name) => value != null ? [`${value} words`, name] : ['', name ?? '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pd-donut-legend">
                {VOCABULARY_MASTERY.map(v => (
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
              {RECENT_ACHIEVEMENTS.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>
                  No achievements yet. Start learning to earn badges!
                </p>
              ) : RECENT_ACHIEVEMENTS.map(a => (
                <div key={a.id} className="pd-achievement">
                  <span className="pd-achievement__icon">{a.icon}</span>
                  <div className="pd-achievement__info">
                    <span className="pd-achievement__name">{a.name}</span>
                    <span className="pd-achievement__desc">{a.description}</span>
                  </div>
                  <span className="pd-achievement__date">{a.date}</span>
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
              {STRENGTHS.map(s => (
                <div key={s.label} className="pd-strength-item pd-strength-item--good">
                  <CheckCircle2 size={18} />
                  <span>{s.label}</span>
                </div>
              ))}
              {AREAS_TO_PRACTICE.map(a => (
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
              {RECOMMENDATIONS.map((r, i) => (
                <div key={i} className="pd-reco-item">
                  <Lightbulb size={16} className="pd-reco-icon" />
                  <p>{r}</p>
                </div>
              ))}
            </div>
            <Link to="/profile" className="pd-settings-link">
              <Settings size={14} /> Manage child account
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;
