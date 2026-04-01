/**
 * DASHBOARD — Kids Learning Home (Bento Grid)
 * MinesMinis v8.0
 *
 * Fully child-themed bento grid layout with animated cards,
 * circular progress, streak flames, and playful interactions.
 * All data wired to real DB/contexts. Zero emoji — Lottie + Lucide only.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Gamepad2, BookOpen, Video, Music, Award, Volume2,
  Flame, Star, Trophy, Heart, Zap, ChevronRight,
  Map, Target, Crown, Gift, BookOpenCheck,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification, ALL_BADGES } from '../contexts/GamificationContext';
import { useHearts } from '../contexts/HeartsContext';
import AvatarDisplay from '../components/AvatarDisplay';
import { getAvatarConfig } from '../services/avatarService';
import LottieCharacter from '../components/LottieCharacter';
import { KidIcon } from '../components/ui';
import { speak } from '../services/ttsService';
import MimiGuide from '../components/MimiGuide';
import StreakCalendar from '../components/StreakCalendar';
import StreakShameModal from '../components/StreakShameModal';
import StreakProtectionBadge from '../components/StreakProtectionBadge';
import WeeklyTournamentBanner from '../components/WeeklyTournamentBanner';
import SoundOfTheDay from '../components/SoundOfTheDay';

import { getTodayLesson, isDailyLessonCompletedToday, getStreakFreezeCount } from '../services/dailyLessonService';
import { getActivityDates } from '../services/habitTracker';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  shouldShowStreakShame, markStreakShameShown,
  getTodayXP, getDailyGoal,
} from '../services/psychGamification';
import { getNextAction } from '../services/learningPathService';
import { getTodayMinutes } from '../services/activityLogger';

// ─── Animation Variants ─────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const pop = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const float = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ─── Word of the Day ────────────────────────────────────────────────────────

interface WodEntry { word: string; tr: string }

const WORDS_OF_THE_DAY: WodEntry[] = [
  { word: 'happy', tr: 'mutlu' }, { word: 'sun', tr: 'güneş' },
  { word: 'rainbow', tr: 'gökkuşağı' }, { word: 'friend', tr: 'arkadaş' },
  { word: 'butterfly', tr: 'kelebek' }, { word: 'star', tr: 'yıldız' },
  { word: 'ocean', tr: 'okyanus' }, { word: 'dragon', tr: 'ejderha' },
  { word: 'dream', tr: 'rüya' }, { word: 'jungle', tr: 'orman' },
  { word: 'rocket', tr: 'roket' }, { word: 'treasure', tr: 'hazine' },
  { word: 'dinosaur', tr: 'dinozor' }, { word: 'castle', tr: 'kale' },
  { word: 'adventure', tr: 'macera' }, { word: 'wizard', tr: 'büyücü' },
  { word: 'dolphin', tr: 'yunus' }, { word: 'mountain', tr: 'dağ' },
  { word: 'penguin', tr: 'penguen' }, { word: 'chocolate', tr: 'çikolata' },
  { word: 'pirate', tr: 'korsan' }, { word: 'robot', tr: 'robot' },
  { word: 'magic', tr: 'sihir' }, { word: 'planet', tr: 'gezegen' },
  { word: 'superhero', tr: 'süper kahraman' }, { word: 'garden', tr: 'bahçe' },
  { word: 'brave', tr: 'cesur' }, { word: 'island', tr: 'ada' },
  { word: 'curious', tr: 'meraklı' }, { word: 'galaxy', tr: 'galaksi' },
];

function getWordOfTheDay(): WodEntry {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86_400_000
  );
  return WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type Lang = 'tr' | 'en';
const tx = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

const DAY_LABELS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Circular Progress Ring ─────────────────────────────────────────────────

function ProgressRing({
  progress, size = 80, stroke = 8, color = 'var(--primary)',
  children,
}: {
  progress: number; size?: number; stroke?: number; color?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--border, #e5e7eb)"
          strokeWidth={stroke} strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ─── Animated Number ────────────────────────────────────────────────────────

function AnimNum({ value, className = '' }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = display;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className={className}>{display}</span>;
}

// ─── Bento Card Wrapper ─────────────────────────────────────────────────────

function BentoCard({
  children, className = '', span = 1, onClick, to,
}: {
  children: React.ReactNode; className?: string; span?: 1 | 2;
  onClick?: () => void; to?: string;
}) {
  const base = `
    relative overflow-hidden rounded-3xl border-2 border-ink-100
    bg-white p-5 transition-all duration-200
    hover:border-primary-200 hover:shadow-card-hover hover:-translate-y-0.5
    active:scale-[0.98]
  `;
  const spanClass = span === 2 ? 'col-span-2' : '';

  const inner = (
    <motion.div variants={pop} className={`${base} ${spanClass} ${className}`}>
      {children}
    </motion.div>
  );

  if (to) return <Link to={to} className="block">{inner}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className="block w-full text-left">{inner}</button>;
  return inner;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, userProfile, isAdmin } = useAuth();
  const { lang } = useLanguage();
  const l = lang as Lang;
  usePageTitle('Ana Sayfa', 'Dashboard');

  const {
    stats, loading, allBadges,
    getXPProgress, getXPForNextLevel,
    canClaimDaily, claimDailyReward,
  } = useGamification();
  const { hearts, isUnlimited } = useHearts();

  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';
  const avatarConfig = useMemo(() => getAvatarConfig(userId), [userId]);

  // Daily lesson state
  const [lessonDone, setLessonDone] = useState(() => isDailyLessonCompletedToday(userId));
  const todayPlan = useMemo(() => getTodayLesson(userId), [userId]);
  const nextAction = useMemo(() => getNextAction(), []);

  // Tab focus refresh
  const [focusTick, setFocusTick] = useState(0);
  useEffect(() => {
    const onFocus = () => {
      setLessonDone(isDailyLessonCompletedToday(userId));
      setFocusTick(t => t + 1);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [userId]);

  // Memoized data
  const todayXP = useMemo(() => getTodayXP(userId), [userId, focusTick]);
  const dailyGoal = useMemo(() => getDailyGoal(), []);
  const todayMinutes = useMemo(() => getTodayMinutes(userId), [userId, focusTick]);
  const activityDates = useMemo(() => getActivityDates(userId), [userId, focusTick]);
  const freezeCount = useMemo(() => getStreakFreezeCount(userId), [userId, focusTick]);
  const wod = useMemo(() => getWordOfTheDay(), []);
  const xpProgress = getXPProgress();
  const xpNeeded = getXPForNextLevel();
  const dailyProgress = dailyGoal > 0 ? Math.min(Math.round((todayXP / dailyGoal) * 100), 100) : 0;
  const learnedCount = stats.wordsLearned ?? 0;

  const recentBadges = useMemo(() => {
    return stats.badges
      .slice(-6).reverse()
      .map(id => allBadges.find(b => b.id === id) || ALL_BADGES.find(b => b.id === id))
      .filter(Boolean);
  }, [stats.badges, allBadges]);

  // Weekly dots
  const weeklyDots = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const saved = localStorage.getItem(`mm_daily_${userId}_${key}`);
      if (!saved) return false;
      try { return JSON.parse(saved).completed === true; } catch { return false; }
    });
  }, [userId, focusTick]);

  const completedDays = weeklyDots.filter(Boolean).length;

  // Streak shame modal
  const [showStreakShame, setShowStreakShame] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShowStreakShame(stats.streakDays, stats.lastLoginDate)) {
        setShowStreakShame(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [stats.streakDays, stats.lastLoginDate]);

  // Daily reward claim
  const handleClaimDaily = useCallback(async () => {
    await claimDailyReward();
  }, [claimDailyReward]);

  // ─── Loading Skeleton ───────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`skeleton rounded-3xl ${i <= 2 ? 'col-span-2 h-36' : 'h-32'}`} />
          ))}
        </div>
      </div>
    );
  }

  // ─── Quick Action Items ──────────────────────────────────────────────

  const quickActions = [
    {
      icon: <Gamepad2 size={24} />,
      label: tx(l, 'Oyunlar', 'Games'),
      bg: 'from-purple-400 to-violet-500',
      route: '/games',
    },
    {
      icon: <BookOpen size={24} />,
      label: tx(l, 'Kelimeler', 'Words'),
      bg: 'from-blue-400 to-cyan-500',
      route: '/words',
    },
    {
      icon: <Video size={24} />,
      label: tx(l, 'Videolar', 'Videos'),
      bg: 'from-pink-400 to-rose-500',
      route: '/videos',
    },
    {
      icon: <Music size={24} />,
      label: tx(l, 'Şarkılar', 'Songs'),
      bg: 'from-amber-400 to-orange-500',
      route: '/songs',
    },
    {
      icon: <BookOpenCheck size={24} />,
      label: tx(l, 'Hikayeler', 'Stories'),
      bg: 'from-emerald-400 to-green-500',
      route: '/stories',
    },
    {
      icon: <Map size={24} />,
      label: tx(l, 'Dünyalar', 'Worlds'),
      bg: 'from-indigo-400 to-blue-500',
      route: '/worlds',
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <>
      {showStreakShame && (
        <StreakShameModal
          streakDays={stats.streakDays}
          lang={l}
          onDismiss={() => { setShowStreakShame(false); markStreakShameShown(); }}
        />
      )}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 py-5 pb-24"
      >
        {/* ═══ GREETING ROW ═══ */}
        <motion.div variants={pop} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/profile" className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-3 border-primary-300 flex items-center justify-center overflow-hidden shadow-md">
                <AvatarDisplay config={avatarConfig} size={48} />
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm">
                {stats.level}
              </div>
            </Link>
            <div>
              <p className="font-display font-semibold text-ink-400 text-xs">
                {tx(l, 'Merhaba', 'Hello')} 👋
              </p>
              <h1 className="font-display font-black text-ink-900 text-xl leading-tight">
                {displayName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak pill */}
            <div className="flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200 rounded-full px-3 py-1.5">
              <Flame size={16} className="text-orange-500" />
              <span className="font-display font-black text-orange-600 text-sm">{stats.streakDays}</span>
            </div>
            {/* Hearts pill */}
            {!isUnlimited && (
              <div className="flex items-center gap-1.5 bg-red-50 border-2 border-red-200 rounded-full px-3 py-1.5">
                <Heart size={16} className="text-red-500" fill="currentColor" />
                <span className="font-display font-black text-red-600 text-sm">{hearts}</span>
              </div>
            )}
            <StreakProtectionBadge count={freezeCount} />
          </div>
        </motion.div>

        {/* ═══ XP LEVEL BAR ═══ */}
        <motion.div variants={pop} className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Star size={14} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-ink-700 text-sm">
                {tx(l, 'Seviye', 'Level')} {stats.level}
              </span>
            </div>
            <span className="font-display font-bold text-ink-400 text-xs">
              <AnimNum value={stats.xp} className="text-primary-500" /> / {xpNeeded} XP
            </span>
          </div>
          <div className="w-full h-3 bg-ink-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* ═══ BENTO GRID ═══ */}
        <div className="grid grid-cols-2 gap-4">

          {/* ─── TODAY'S LESSON (span 2) ─── */}
          <BentoCard span={2} className={`${
            lessonDone
              ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200'
              : 'bg-gradient-to-br from-primary-50 via-orange-50 to-amber-50 border-primary-200'
          }`} to={lessonDone ? undefined : '/daily-lesson'}>
            <div className="flex items-center gap-4">
              <motion.div {...float} className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  lessonDone
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                    : 'bg-gradient-to-br from-primary-400 to-orange-500'
                }`}>
                  {lessonDone
                    ? <Trophy size={28} className="text-white" />
                    : <Play size={28} className="text-white" fill="white" />}
                </div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className={`font-display font-bold text-xs uppercase tracking-widest mb-1 ${
                  lessonDone ? 'text-emerald-500' : 'text-primary-500'
                }`}>
                  {lessonDone
                    ? tx(l, 'Tamamlandı', 'Completed')
                    : tx(l, 'Günün Dersi', "Today's Lesson")}
                </p>
                <h2 className="font-display font-black text-ink-900 text-lg leading-tight mb-1">
                  {lessonDone
                    ? tx(l, 'Harika iş!', 'Great job!')
                    : tx(l, 'Bugünkü macerana başla', 'Start your adventure')}
                </h2>
                {todayPlan && !lessonDone && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {todayPlan.newWords?.slice(0, 3).map((w) => (
                      <span key={w.word} className="inline-flex items-center bg-white/80 border border-primary-200 text-primary-700 font-display font-bold text-xs px-2.5 py-1 rounded-full">
                        {w.word}
                      </span>
                    ))}
                  </div>
                )}
                {lessonDone && (
                  <p className="font-body text-emerald-600 text-sm">
                    {tx(l, 'Yarın yeni kelimelerin seni bekliyor', 'New words await you tomorrow')}
                  </p>
                )}
              </div>
              {!lessonDone && (
                <ChevronRight size={24} className="text-primary-400 flex-shrink-0" />
              )}
            </div>
          </BentoCard>

          {/* ─── DAILY GOAL ─── */}
          <BentoCard className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <ProgressRing progress={dailyProgress} size={72} stroke={7} color="var(--primary)">
              <div className="text-center">
                <span className="font-display font-black text-primary-600 text-lg leading-none">
                  <AnimNum value={todayXP} />
                </span>
              </div>
            </ProgressRing>
            <p className="font-display font-bold text-ink-500 text-xs mt-2">
              {tx(l, 'Günlük Hedef', 'Daily Goal')}
            </p>
            <p className="font-display font-semibold text-ink-400 text-[10px]">
              {todayXP}/{dailyGoal} XP
            </p>
          </BentoCard>

          {/* ─── TIME SPENT ─── */}
          <BentoCard className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-md mb-2">
              <Zap size={24} className="text-white" />
            </div>
            <p className="font-display font-black text-ink-800 text-xl leading-none">
              <AnimNum value={todayMinutes} /> <span className="text-sm text-ink-400">{tx(l, 'dk', 'min')}</span>
            </p>
            <p className="font-display font-bold text-ink-500 text-xs mt-1">
              {tx(l, 'Bugün Öğrenme', 'Today')}
            </p>
          </BentoCard>

          {/* ─── WEEKLY STREAK (span 2) ─── */}
          <BentoCard span={2} className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-500" />
                <span className="font-display font-bold text-ink-700 text-sm">
                  {tx(l, 'Haftalık Seri', 'Weekly Streak')}
                </span>
              </div>
              <span className="font-display font-black text-orange-500 text-sm">
                {completedDays}/7
              </span>
            </div>
            <div className="flex justify-between gap-1">
              {weeklyDots.map((done, i) => {
                const dayLabels = l === 'tr' ? DAY_LABELS_TR : DAY_LABELS_EN;
                const isToday = i === 6;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 400 }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                        done
                          ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-md'
                          : isToday
                            ? 'bg-orange-100 border-2 border-orange-300 border-dashed'
                            : 'bg-ink-100'
                      }`}
                    >
                      {done ? (
                        <Flame size={16} className="text-white" />
                      ) : isToday ? (
                        <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      ) : null}
                    </motion.div>
                    <span className={`font-display text-[10px] font-bold ${
                      isToday ? 'text-orange-500' : 'text-ink-400'
                    }`}>
                      {dayLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </BentoCard>

          {/* ─── WHAT'S NEXT ─── */}
          <BentoCard
            span={2}
            className="bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200"
            to={nextAction.route}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                <Target size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-cyan-600 text-xs uppercase tracking-widest mb-0.5">
                  {tx(l, 'Sıradaki Adım', 'Next Step')}
                </p>
                <p className="font-display font-extrabold text-ink-800 text-base leading-tight">
                  {l === 'tr' ? nextAction.titleTr : nextAction.title}
                </p>
              </div>
              <ChevronRight size={20} className="text-cyan-400 flex-shrink-0" />
            </div>
          </BentoCard>

          {/* ─── QUICK ACTIONS (6 items) ─── */}
          {quickActions.map((action) => (
            <motion.div key={action.route} variants={pop}>
              <Link to={action.route} className="block">
                <div className="relative overflow-hidden rounded-3xl border-2 border-ink-100 bg-white p-4 transition-all duration-200 hover:border-primary-200 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]">
                  <div className={`w-11 h-11 bg-gradient-to-br ${action.bg} rounded-xl flex items-center justify-center shadow-md mb-2.5`}>
                    <span className="text-white">{action.icon}</span>
                  </div>
                  <p className="font-display font-bold text-ink-800 text-sm">
                    {action.label}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* ─── STATS OVERVIEW (span 2) ─── */}
          <BentoCard span={2} className="bg-white">
            <p className="font-display font-bold text-ink-500 text-xs uppercase tracking-widest mb-4">
              {tx(l, 'İstatistikler', 'Stats')}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <Star size={18} />, value: stats.xp, label: 'XP', color: 'from-amber-400 to-orange-500' },
                { icon: <BookOpen size={18} />, value: learnedCount, label: tx(l, 'Kelime', 'Words'), color: 'from-blue-400 to-cyan-500' },
                { icon: <Gamepad2 size={18} />, value: stats.gamesPlayed, label: tx(l, 'Oyun', 'Games'), color: 'from-purple-400 to-violet-500' },
                { icon: <Flame size={18} />, value: stats.streakDays, label: tx(l, 'Seri', 'Streak'), color: 'from-orange-400 to-red-500' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shadow-sm mb-2`}>
                    <span className="text-white">{s.icon}</span>
                  </div>
                  <span className="font-display font-black text-ink-800 text-lg leading-none">
                    <AnimNum value={s.value} />
                  </span>
                  <span className="font-display font-semibold text-ink-400 text-[10px] mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* ─── WORD OF THE DAY ─── */}
          <BentoCard className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 border-purple-200">
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => speak(wod.word)}
                aria-label={`Listen: ${wod.word}`}
                className="w-12 h-12 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full flex items-center justify-center shadow-md mb-2 hover:scale-110 transition-transform active:scale-95"
              >
                <Volume2 size={20} className="text-white" />
              </button>
              <p className="font-display font-black text-purple-700 text-lg">{wod.word}</p>
              <p className="font-body text-purple-500 text-xs">{wod.tr}</p>
              <p className="font-display font-bold text-ink-400 text-[10px] mt-1.5 uppercase tracking-widest">
                {tx(l, 'Günün Kelimesi', 'Word of the Day')}
              </p>
            </div>
          </BentoCard>

          {/* ─── DAILY REWARD ─── */}
          <BentoCard
            className={`flex flex-col items-center justify-center text-center ${
              canClaimDaily
                ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
                : 'bg-ink-50 border-ink-200'
            }`}
            onClick={canClaimDaily ? handleClaimDaily : undefined}
          >
            <motion.div
              animate={canClaimDaily ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: canClaimDaily ? Infinity : 0, repeatDelay: 2 }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md mb-2 ${
                canClaimDaily
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                  : 'bg-ink-200'
              }`}>
                <Gift size={22} className={canClaimDaily ? 'text-white' : 'text-ink-400'} />
              </div>
            </motion.div>
            <p className={`font-display font-bold text-xs ${
              canClaimDaily ? 'text-amber-600' : 'text-ink-400'
            }`}>
              {canClaimDaily
                ? tx(l, 'Ödülünü Al!', 'Claim Reward!')
                : tx(l, 'Ödül Alındı', 'Claimed')}
            </p>
          </BentoCard>

          {/* ─── WORDS PROGRESS (span 2) ─── */}
          <BentoCard span={2} className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-500" />
                <span className="font-display font-bold text-ink-700 text-sm">
                  {tx(l, 'Öğrendiğim Kelimeler', 'Words I Know')}
                </span>
              </div>
              <span className="font-display font-black text-emerald-600 text-sm">
                <AnimNum value={learnedCount} /> / 220
              </span>
            </div>
            <div className="w-full h-4 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((learnedCount / 220) * 100, 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {[50, 100, 150, 200].map(milestone => (
                <span key={milestone} className={`font-display font-bold text-[10px] ${
                  learnedCount >= milestone ? 'text-emerald-500' : 'text-ink-300'
                }`}>
                  {milestone}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* ─── TOURNAMENT ─── */}
          <motion.div variants={pop} className="col-span-2">
            <WeeklyTournamentBanner />
          </motion.div>

          {/* ─── SOUND OF THE DAY ─── */}
          <motion.div variants={pop} className="col-span-2">
            <SoundOfTheDay />
          </motion.div>

          {/* ─── MIMI MASCOT CARD ─── */}
          <BentoCard className="bg-gradient-to-br from-primary-50 to-orange-50 border-primary-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 mb-2">
              <LottieCharacter state="wave" size={64} />
            </div>
            <p className="font-display font-black text-ink-800 text-sm">Mimi</p>
            <p className="font-body text-ink-400 text-[10px]">
              {tx(l, 'Asistanın', 'Your buddy')}
            </p>
          </BentoCard>

          {/* ─── ACHIEVEMENTS ─── */}
          <BentoCard className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200" to="/achievements">
            <div className="flex items-center gap-2 mb-3">
              <Award size={16} className="text-amber-500" />
              <span className="font-display font-bold text-ink-700 text-xs">
                {tx(l, 'Rozetler', 'Badges')}
              </span>
            </div>
            {recentBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {recentBadges.slice(0, 3).map((badge) => badge && (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <KidIcon name={badge.icon as 'star'} size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 bg-amber-100/50 rounded-lg border-2 border-dashed border-amber-200" />
                  ))}
                </div>
              </div>
            )}
          </BentoCard>

          {/* ─── STREAK CALENDAR (span 2) ─── */}
          <motion.div variants={pop} className="col-span-2">
            <div className="rounded-3xl border-2 border-ink-100 bg-white p-5">
              <StreakCalendar activityDates={activityDates} streakDays={stats.streakDays} />
            </div>
          </motion.div>
        </div>

        {/* ─── ADMIN SHORTCUT ─── */}
        {isAdmin && (
          <motion.div variants={pop} className="mt-6">
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 bg-ink-100 hover:bg-ink-200 text-ink-600 font-display font-bold text-sm px-4 py-3 rounded-2xl transition-colors"
            >
              <Crown size={16} />
              {tx(l, 'Admin Paneli', 'Admin Panel')}
            </Link>
          </motion.div>
        )}

        {/* ─── MIMI GUIDE OVERLAY ─── */}
        <MimiGuide message="Keep learning new words every day!" messageTr="Her gün yeni kelimeler öğrenmeye devam et!" showOnce="dashboard-welcome" />
      </motion.div>
    </>
  );
}
