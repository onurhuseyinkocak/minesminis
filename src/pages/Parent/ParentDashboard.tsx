/**
 * PARENT DASHBOARD PAGE
 * Premium parent-facing view of child progress.
 * Data-rich, professional, warm — not childish.
 * Uses real data from AuthContext and GamificationContext.
 * Supports multiple child profiles (up to 4) via localStorage.
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
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  BarChart3,
  Shield,
  Lightbulb,
  Users,
  Plus,
  X,
  Trash2,
  ChevronDown,
  UserPlus,
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
// "DEFAULT CHILD" — maps logged-in user's own stats to a ChildProfile shape
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
    avatar: '🌟',
    parent_id: parentId,
    created_at: '',
    xp: gamificationStats.xp,
    level: gamificationStats.level,
    words_learned: gamificationStats.wordsLearned,
    games_played: gamificationStats.gamesPlayed,
    streak_days: gamificationStats.streakDays,
  };
}

// ============================================================
// ADD CHILD MODAL (inline component)
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
    if (!trimmed) {
      toast.error('Please enter a name.');
      return;
    }
    if (trimmed.length > 30) {
      toast.error('Name must be 30 characters or fewer.');
      return;
    }
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
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card, #fff)',
              borderRadius: 20,
              padding: 28,
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 4,
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
              {/* Name */}
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mimi"
                  maxLength={30}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--cloud, #e0e0e0)',
                    fontSize: 15,
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </label>

              {/* Age Group */}
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Age Group
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {AGE_GROUPS.map(ag => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => setAgeGroup(ag)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 10,
                        border: ageGroup === ag ? '2px solid var(--primary)' : '1.5px solid var(--cloud, #e0e0e0)',
                        background: ageGroup === ag ? 'var(--primary-pale, #eff6ff)' : 'transparent',
                        color: ageGroup === ag ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </label>

              {/* Avatar Picker */}
              <label style={{ display: 'block', marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Avatar
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        border: avatar === a ? '2.5px solid var(--primary)' : '1.5px solid var(--cloud, #e0e0e0)',
                        background: avatar === a ? 'var(--primary-pale, #eff6ff)' : 'transparent',
                        fontSize: 22,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
// CHILD SELECTOR BAR
// ============================================================

interface ChildSelectorProps {
  children: ChildProfile[];
  activeChildId: string;
  onSelect: (id: string) => void;
  onAddClick: () => void;
  onRemove: (id: string, name: string) => void;
  canAdd: boolean;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
  children: childList,
  activeChildId,
  onSelect,
  onAddClick,
  onRemove,
  canAdd,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}
    >
      {childList.map(child => {
        const isActive = child.id === activeChildId;
        const isDefault = child.id === DEFAULT_CHILD_ID;
        return (
          <div key={child.id} style={{ position: 'relative' }}>
            <button
              onClick={() => onSelect(child.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 12,
                border: isActive ? '2px solid var(--primary)' : '1.5px solid var(--cloud, #e0e0e0)',
                background: isActive ? 'var(--primary-pale, #eff6ff)' : 'var(--bg-card, #fff)',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{child.avatar}</span>
              <span>{child.name}</span>
              {isDefault && (
                <span style={{ fontSize: 11, opacity: 0.7 }}>(You)</span>
              )}
            </button>
            {!isDefault && (
              <button
                onClick={e => { e.stopPropagation(); onRemove(child.id, child.name); }}
                title={`Remove ${child.name}`}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1.5px solid var(--error, #ef4444)',
                  background: 'var(--bg-card, #fff)',
                  color: 'var(--error, #ef4444)',
                  fontSize: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}

      {canAdd && (
        <button
          onClick={onAddClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 12,
            border: '1.5px dashed var(--primary, #3b82f6)',
            background: 'transparent',
            color: 'var(--primary, #3b82f6)',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          <Plus size={16} />
          Add Child
        </button>
      )}
    </div>
  );
};

// ============================================================
// SETUP WIZARD (shown when no children exist yet)
// ============================================================

interface SetupWizardProps {
  parentName: string;
  onAddChild: () => void;
  onSkip: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ parentName, onAddChild, onSkip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'var(--bg-card, #fff)',
        borderRadius: 20,
        padding: 40,
        textAlign: 'center',
        maxWidth: 520,
        margin: '40px auto',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍👩‍👧‍👦</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
        Welcome, {parentName}!
      </h2>
      <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
        Set up child profiles to track each learner&apos;s progress individually.
        Your family plan supports up to {MAX_CHILDREN} children.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" size="md" onClick={onAddChild}>
          <UserPlus size={16} style={{ marginRight: 6 }} />
          Add First Child
        </Button>
        <Button variant="ghost" size="md" onClick={onSkip}>
          Skip for now
        </Button>
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT
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
  const { user, userProfile, isAdmin } = useAuth();
  const { stats, getXPProgress, loading } = useGamification();

  const parentId = user?.uid || '';
  const parentName = userProfile?.display_name || 'Parent';

  // ---- Multi-child state ----
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>(DEFAULT_CHILD_ID);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  // Load children from localStorage on mount and when parentId changes
  useEffect(() => {
    if (!parentId) return;
    const saved = getChildren(parentId);
    setChildProfiles(saved);

    const savedActive = getActiveChildId();
    if (savedActive && (saved.some(c => c.id === savedActive) || savedActive === DEFAULT_CHILD_ID)) {
      setActiveChildId(savedActive);
    } else {
      setActiveChildId(DEFAULT_CHILD_ID);
    }

    // Show setup wizard if no children have been added and user hasn't dismissed it
    const dismissed = localStorage.getItem(`mimi_setup_dismissed_${parentId}`);
    if (saved.length === 0 && !dismissed) {
      setShowSetupWizard(true);
    }
  }, [parentId]);

  // Build the full list: default child (user's own stats) + added children
  const defaultChild = useMemo(
    () => makeDefaultChild(parentId, parentName, stats),
    [parentId, parentName, stats],
  );

  const allChildren = useMemo(
    () => [defaultChild, ...childProfiles],
    [defaultChild, childProfiles],
  );

  const activeChild = useMemo(
    () => allChildren.find(c => c.id === activeChildId) || defaultChild,
    [allChildren, activeChildId, defaultChild],
  );

  // Are we viewing the default (user's own) stats?
  const isDefaultChild = activeChild.id === DEFAULT_CHILD_ID;

  // Stats to display: either from gamification context (default) or from child profile
  const displayStats = useMemo(() => {
    if (isDefaultChild) {
      return {
        xp: stats.xp,
        weekly_xp: stats.weekly_xp,
        level: stats.level,
        wordsLearned: stats.wordsLearned,
        gamesPlayed: stats.gamesPlayed,
        videosWatched: stats.videosWatched,
        worksheetsCompleted: stats.worksheetsCompleted,
        streakDays: stats.streakDays,
        badges: stats.badges,
      };
    }
    // For added children, map from ChildProfile
    return {
      xp: activeChild.xp,
      weekly_xp: 0,
      level: activeChild.level,
      wordsLearned: activeChild.words_learned,
      gamesPlayed: activeChild.games_played,
      videosWatched: 0,
      worksheetsCompleted: 0,
      streakDays: activeChild.streak_days,
      badges: [] as string[],
    };
  }, [isDefaultChild, stats, activeChild]);

  const childName = activeChild.name;

  // ---- Handlers ----
  const handleSelectChild = useCallback((id: string) => {
    setActiveChildId(id);
    switchActiveChild(id);
  }, []);

  const handleAddChild = useCallback((data: { name: string; age_group: string; avatar: string }) => {
    if (!parentId) return;
    try {
      addChild(parentId, data);
      const updated = getChildren(parentId);
      setChildProfiles(updated);
      setShowAddModal(false);
      setShowSetupWizard(false);
      toast.success(`${data.name}'s profile created!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add child.';
      toast.error(msg);
    }
  }, [parentId]);

  const handleRemoveChild = useCallback((childId: string, name: string) => {
    if (!parentId) return;
    const confirmed = window.confirm(`Remove ${name}'s profile? This cannot be undone.`);
    if (!confirmed) return;
    removeChild(parentId, childId);
    const updated = getChildren(parentId);
    setChildProfiles(updated);
    if (activeChildId === childId) {
      setActiveChildId(DEFAULT_CHILD_ID);
      switchActiveChild(DEFAULT_CHILD_ID);
    }
    toast.success(`${name}'s profile removed.`);
  }, [parentId, activeChildId]);

  const handleDismissSetup = useCallback(() => {
    setShowSetupWizard(false);
    if (parentId) {
      localStorage.setItem(`mimi_setup_dismissed_${parentId}`, 'true');
    }
  }, [parentId]);

  // ---- Derived data ----
  const weeklyActivity = useMemo(() => buildWeeklyActivity(displayStats.weekly_xp), [displayStats.weekly_xp]);

  const vocabularyMastery = useMemo(() => buildVocabularyMastery(displayStats.wordsLearned), [displayStats.wordsLearned]);

  const totalWords = useMemo(
    () => vocabularyMastery.reduce((s, v) => s + v.value, 0),
    [vocabularyMastery],
  );

  const earnedBadges = useMemo(() => {
    return ALL_BADGES
      .filter(b => displayStats.badges.includes(b.id))
      .map(b => ({
        id: b.id,
        name: b.name,
        icon: b.icon,
        description: b.description,
        date: '',
      }));
  }, [displayStats.badges]);

  const { strengths, focus: areasToFocus } = useMemo(
    () => deriveStrengthsAndFocus(displayStats),
    [displayStats],
  );

  const recommendations = useMemo(
    () => buildRecommendations(displayStats),
    [displayStats],
  );

  const progressPercent = useMemo(() => {
    if (isDefaultChild) return getXPProgress();
    // Simple progress for child profiles: (xp % 100) as percentage towards next level
    const xpForLevel = activeChild.level * 100;
    return Math.min(100, Math.round((activeChild.xp % xpForLevel) / xpForLevel * 100));
  }, [isDefaultChild, getXPProgress, activeChild, stats.xp]);

  const overviewCards = useMemo(() => [
    {
      label: 'Words Learned',
      value: displayStats.wordsLearned,
      icon: <BookOpen size={22} />,
      color: 'var(--secondary)',
      bg: 'var(--secondary-pale)',
    },
    {
      label: 'Current Level',
      value: displayStats.level,
      icon: <Star size={22} />,
      color: 'var(--primary)',
      bg: 'var(--primary-pale)',
    },
    {
      label: 'Streak Days',
      value: displayStats.streakDays,
      icon: <Flame size={22} />,
      color: 'var(--error)',
      bg: 'var(--error-pale)',
    },
    {
      label: 'Total XP',
      value: displayStats.xp.toLocaleString(),
      icon: <TrendingUp size={22} />,
      color: 'var(--info)',
      bg: 'var(--info-pale)',
    },
  ], [displayStats]);

  const handleDownloadReport = () => {
    const report = [
      `MinesMinis Progress Report`,
      `${'='.repeat(50)}`,
      `Learner: ${childName}`,
      `Parent: ${parentName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `Overview:`,
      `- Level: ${displayStats.level}`,
      `- XP: ${displayStats.xp}`,
      `- Weekly XP: ${displayStats.weekly_xp}`,
      `- Words Learned: ${displayStats.wordsLearned}`,
      `- Games Played: ${displayStats.gamesPlayed}`,
      `- Videos Watched: ${displayStats.videosWatched}`,
      `- Worksheets Completed: ${displayStats.worksheetsCompleted}`,
      `- Streak: ${displayStats.streakDays} days`,
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

  // ---- Setup wizard (first-time experience) ----
  if (showSetupWizard && childProfiles.length === 0) {
    return (
      <div className="pd">
        <SetupWizard
          parentName={parentName}
          onAddChild={() => { setShowSetupWizard(false); setShowAddModal(true); }}
          onSkip={handleDismissSetup}
        />
        <AddChildModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddChild}
        />
      </div>
    );
  }

  return (
    <div className="pd">
      {/* ---- CHILD SELECTOR ---- */}
      <ChildSelector
        childList={allChildren}
        activeChildId={activeChildId}
        onSelect={handleSelectChild}
        onAddClick={() => setShowAddModal(true)}
        onRemove={handleRemoveChild}
        canAdd={childProfiles.length < MAX_CHILDREN}
      />

      {/* ---- ADD CHILD MODAL ---- */}
      <AddChildModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddChild}
      />

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
            {!isDefaultChild && <span style={{ fontSize: 12, marginLeft: 8, color: 'var(--text-muted)' }}>({activeChild.age_group} yrs)</span>}
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
                Level {displayStats.level} &mdash; {displayStats.xp.toLocaleString()} XP total
              </p>
            </div>
            <Badge variant="info">Level {displayStats.level}</Badge>
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
              {displayStats.weekly_xp > 0
                ? `${displayStats.weekly_xp} XP earned this week`
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
