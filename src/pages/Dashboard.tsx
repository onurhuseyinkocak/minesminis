/**
 * DASHBOARD -- Duolingo-style Learning Home Screen
 * MinesMinis v7.0
 *
 * ONE primary action: Today's Lesson hero card.
 * Everything else is secondary.
 * Full Tailwind -- zero custom CSS.
 */
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Gamepad2,
  BookOpen,
  Video,
  Music,
  Award,
  Volume2,
  Flame,
  Star,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import AvatarDisplay from '../components/AvatarDisplay';
import { getAvatarConfig } from '../services/avatarService';
import { KidIcon } from '../components/ui';
import type { KidIconName } from '../components/ui';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification, ALL_BADGES } from '../contexts/GamificationContext';
import { SFX } from '../data/soundLibrary';
import { speak } from '../services/ttsService';
import MimiGuide from '../components/MimiGuide';

import { getTodayLesson, isDailyLessonCompletedToday, getStreakFreezeCount } from '../services/dailyLessonService';
import StreakProtectionBadge from '../components/StreakProtectionBadge';
import { XPBoosterBadge, getActiveBoost } from '../components/XPBooster';
import WeeklyTournamentBanner from '../components/WeeklyTournamentBanner';
import StreakCalendar from '../components/StreakCalendar';
import { getActivityDates } from '../services/habitTracker';
import SoundOfTheDay from '../components/SoundOfTheDay';
import { usePageTitle } from '../hooks/usePageTitle';
import DailyGoalWidget from '../components/DailyGoalWidget';
import StreakShameModal from '../components/StreakShameModal';
import {
  shouldShowStreakShame,
  markStreakShameShown,
  getTodayXP,
  getDailyGoal,
} from '../services/psychGamification';

// ============================================================
// HELPERS
// ============================================================

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
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ============================================================
// WORD OF THE DAY DATA
// ============================================================

interface WodEntry { word: string; tr: string }

const WORDS_OF_THE_DAY: WodEntry[] = [
  { word: 'happy',       tr: 'mutlu'           },
  { word: 'sun',         tr: 'güneş'          },
  { word: 'rainbow',     tr: 'gökkuşağı'      },
  { word: 'friend',      tr: 'arkadaş'        },
  { word: 'butterfly',   tr: 'kelebek'         },
  { word: 'star',        tr: 'yıldız'         },
  { word: 'ocean',       tr: 'okyanus'         },
  { word: 'dragon',      tr: 'ejderha'         },
  { word: 'dream',       tr: 'rüya'           },
  { word: 'jungle',      tr: 'orman'           },
  { word: 'rocket',      tr: 'roket'           },
  { word: 'treasure',    tr: 'hazine'          },
  { word: 'dinosaur',    tr: 'dinozor'         },
  { word: 'castle',      tr: 'kale'            },
  { word: 'adventure',   tr: 'macera'          },
  { word: 'wizard',      tr: 'büyücü'         },
  { word: 'dolphin',     tr: 'yunus'           },
  { word: 'mountain',    tr: 'dağ'            },
  { word: 'penguin',     tr: 'penguen'         },
  { word: 'chocolate',   tr: 'çikolata'       },
  { word: 'pirate',      tr: 'korsan'          },
  { word: 'robot',       tr: 'robot'           },
  { word: 'magic',       tr: 'sihir'           },
  { word: 'planet',      tr: 'gezegen'         },
  { word: 'superhero',   tr: 'süper kahraman' },
  { word: 'garden',      tr: 'bahçe'          },
  { word: 'brave',       tr: 'cesur'           },
  { word: 'island',      tr: 'ada'             },
  { word: 'curious',     tr: 'meraklı'        },
  { word: 'galaxy',      tr: 'galaksi'         },
];

function getWordOfTheDay(): WodEntry {
  // Jan 1 of the current year (month=0, day=1) — avoids the off-by-one where
  // new Date(year, 0, 0) returns Dec 31 of the previous year.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86_400_000
  );
  return WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length];
}

// ============================================================
// COMPONENT
// ============================================================

export default function Dashboard() {
  const { user, userProfile, isAdmin } = useAuth();
  const { t, lang } = useLanguage();
  usePageTitle('Ana Sayfa', 'Dashboard');
  const {
    stats,
    loading,
    allBadges,
    getXPProgress,
    getXPForNextLevel,
  } = useGamification();

  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';

  // Daily lesson state
  const [lessonDone, setLessonDone] = useState<boolean>(() =>
    isDailyLessonCompletedToday(userId)
  );

  const todayPlan = useMemo(() => getTodayLesson(userId), [userId]);

  // Weekly progress
  const weeklyDots = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const saved = localStorage.getItem(`mm_daily_${userId}_${key}`);
      if (!saved) return false;
      try { return JSON.parse(saved).completed === true; } catch { return false; }
    });
  }, [userId]);

  const completedDays = weeklyDots.filter(Boolean).length;
  const learnedCount = stats.wordsLearned ?? 0;

  const [showStreakShame, setShowStreakShame] = useState(false);

  // Streak shame: show after 4pm if user hasn't practiced and has streak
  useEffect(() => {
    const check = () => {
      if (shouldShowStreakShame(stats.streakDays, stats.lastLoginDate)) {
        setShowStreakShame(true);
      }
    };
    const timer = setTimeout(check, 3000); // 3s delay after mount
    return () => clearTimeout(timer);
  }, [stats.streakDays, stats.lastLoginDate]);

  // Refresh counter — incremented on tab focus so memos re-run on return
  const [focusTick, setFocusTick] = useState(0);

  useEffect(() => {
    const onFocus = () => {
      setLessonDone(isDailyLessonCompletedToday(userId));
      setFocusTick((t) => t + 1);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- isDailyLessonCompletedToday is a stable module-level function, not a hook dep
  }, [userId]);

  const recentBadges = useMemo(() => {
    return stats.badges
      .slice(-6)
      .reverse()
      .map((id) => allBadges.find((b) => b.id === id) || ALL_BADGES.find((b) => b.id === id))
      .filter(Boolean);
  }, [stats.badges, allBadges]);

  const wod = useMemo(() => getWordOfTheDay(), []);

  // Memoize localStorage reads — re-run on tab focus (focusTick) so values stay fresh
  const activityDates = useMemo(() => getActivityDates(userId), [userId, focusTick]);
  const memoizedFreezeCount = useMemo(() => getStreakFreezeCount(userId), [userId, focusTick]);
  const todayXP = useMemo(() => getTodayXP(userId), [userId, focusTick]);
  const dailyGoal = useMemo(() => getDailyGoal(), []);

  // ---- Loading skeleton ----
  if (loading) {
    return (
      <div className="max-w-xl md:max-w-2xl lg:max-w-xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Greeting row skeleton */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full skeleton" />
            <div className="space-y-2">
              <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 20, width: 128, borderRadius: 6 }} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="skeleton" style={{ height: 40, width: 80, borderRadius: 20 }} />
            <div className="skeleton" style={{ height: 40, width: 64, borderRadius: 20 }} />
          </div>
        </div>
        {/* XP bar skeleton */}
        <div className="skeleton" style={{ height: 8, width: '100%', borderRadius: 8 }} />
        {/* Hero card skeleton */}
        <div className="skeleton" style={{ height: 192, borderRadius: 24 }} />
        {/* Weekly progress skeleton */}
        <div className="skeleton" style={{ height: 96, borderRadius: 16 }} />
        {/* Quick actions skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    {showStreakShame && (
      <StreakShameModal
        streakDays={stats.streakDays}
        lang={lang as 'tr' | 'en'}
        onDismiss={() => {
          markStreakShameShown(); // prevent re-showing on same day
          setShowStreakShame(false);
        }}
        mascotId={(userProfile?.settings as Record<string, string>)?.mascotId ?? 'mimi_dragon'}
      />
    )}
    <motion.div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, var(--primary-pale) 0%, var(--bg-page) 100%)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* ============================================================
          1. GREETING + STREAK ROW
          ============================================================ */}
      <motion.div className="flex items-center justify-between mb-5" variants={itemVariants}>
        {/* ── Left: Avatar + Greeting ── */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/avatar"
            title={lang === 'tr' ? 'Avatarını düzenle' : 'Edit avatar'}
            className="flex-shrink-0 rounded-full"
            style={{
              boxShadow: '0 0 0 3px var(--primary), 0 0 0 5px color-mix(in srgb, var(--primary) 20%, transparent), 0 4px 12px color-mix(in srgb, var(--primary) 30%, transparent)',
              borderRadius: '50%',
              transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
          >
            <AvatarDisplay
              config={getAvatarConfig(userId)}
              letter={displayName}
              size={60}
              animated={false}
            />
          </Link>
          <div className="min-w-0">
            <p
              className="font-display font-bold text-xs uppercase tracking-widest leading-tight"
              style={{ color: 'var(--primary)', letterSpacing: '0.08em' }}
            >
              {lang === 'tr' ? 'Merhaba!' : 'Hello!'}
            </p>
            <h1
              className="font-display font-extrabold text-2xl truncate leading-tight"
              style={{ color: 'var(--text-primary)', maxWidth: '170px', letterSpacing: '-0.02em' }}
            >
              {displayName}
            </h1>
          </div>
        </div>

        {/* ── Right: Achievement Badges ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Streak pill — primary gradient */}
          <div
            className="flex items-center gap-1.5 font-bold rounded-full font-display"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, var(--accent-purple)) 100%)',
              color: 'var(--text-on-primary)',
              padding: '10px 14px',
              minHeight: '44px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 8px color-mix(in srgb, var(--primary) 40%, transparent)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px color-mix(in srgb, var(--primary) 50%, transparent)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px color-mix(in srgb, var(--primary) 40%, transparent)'; }}
          >
            <Flame size={17} style={{ color: 'var(--text-on-primary)', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }} />
            <span>{stats.streakDays} {t('dashboard.dayUnit')}</span>
          </div>

          <StreakProtectionBadge count={memoizedFreezeCount} size="sm" />

          {/* XP pill — gold gradient */}
          <div
            className="flex items-center gap-1.5 font-bold rounded-full font-display"
            style={{
              background: 'linear-gradient(135deg, var(--warning) 0%, color-mix(in srgb, var(--warning) 70%, var(--accent-orange)) 100%)',
              color: 'var(--text-on-primary)',
              padding: '10px 14px',
              minHeight: '44px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 8px color-mix(in srgb, var(--warning) 40%, transparent)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px color-mix(in srgb, var(--warning) 55%, transparent)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px color-mix(in srgb, var(--warning) 40%, transparent)'; }}
          >
            <Star size={17} style={{ color: 'var(--text-on-primary)', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }} />
            <span>{stats.xp.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</span>
          </div>

          {getActiveBoost() !== null && <XPBoosterBadge />}
        </div>
      </motion.div>

      {/* ── XP Level Progress Bar ── */}
      <motion.div className="mb-3" variants={itemVariants}>
        <div
          className="rounded-2xl p-3 shadow-sm"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path
                  d="M7 1L8.545 4.855L12.5 5.297L9.75 7.847L10.545 11.75L7 9.75L3.455 11.75L4.25 7.847L1.5 5.297L5.455 4.855L7 1Z"
                  fill="var(--warning)"
                  stroke="var(--warning)"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'tr' ? 'Seviye' : 'Level'}
              </span>
              <span
                className="text-xs font-display font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--text-on-primary)',
                  lineHeight: '1.4',
                }}
              >
                {stats.level}
              </span>
            </div>
            <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
              {getXPProgress()}% · {getXPForNextLevel()} XP {lang === 'tr' ? 'sonraki seviye' : 'to next level'}
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-soft)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${getXPProgress()}%`,
                background: 'linear-gradient(90deg, var(--warning), color-mix(in srgb, var(--warning) 70%, white))',
                boxShadow: '0 0 8px 0 color-mix(in srgb, var(--warning) 55%, transparent), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Desktop: 2-column grid. Mobile: single column */}
      <div className="lg:grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] lg:gap-6 lg:items-start">

      {/* ── LEFT / MAIN COLUMN ── */}
      <div className="space-y-4">

      {/* ============================================================
          2. DAILY LESSON HERO CARD
          ============================================================ */}
      <motion.section variants={itemVariants}>
        <Link to="/daily-lesson" className="block cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-3xl p-7 relative overflow-hidden"
            style={{
              background: lessonDone
                ? 'linear-gradient(135deg, var(--success), color-mix(in srgb, var(--success) 70%, black))'
                : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              boxShadow: lessonDone
                ? '0 12px 40px color-mix(in srgb, var(--success) 45%, transparent)'
                : '0 12px 40px var(--primary-glow)',
              borderBottom: lessonDone
                ? '5px solid color-mix(in srgb, var(--success) 60%, black)'
                : '5px solid color-mix(in srgb, var(--primary) 60%, black)',
            }}
          >
            {/* Background decoration circles — layered for depth */}
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full" style={{ background: 'rgba(255,255,255,0.09)' }} />
            <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute top-3 right-14 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.13)' }} />
            <div className="absolute top-1/2 -right-4 w-28 h-28 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', transform: 'translateY(-50%)' }} />
            <div className="absolute -bottom-4 right-20 w-14 h-14 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            {/* Polka-dot texture overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none',
              }}
            />

            <div className="relative z-10">
              {lessonDone ? (
                /* ── LESSON DONE STATE ── */
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                  >
                    <Star size={28} strokeWidth={2.5} style={{ color: 'var(--text-on-primary)' }} fill="var(--text-on-primary)" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-display font-bold mb-1 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.80)' }}>
                      {t('dashboard.todaysLesson').toUpperCase()}
                    </div>
                    <h2
                      className="font-display font-black leading-tight mb-1"
                      style={{ color: 'var(--text-on-primary)', fontSize: 'clamp(1.45rem, 4vw, 1.875rem)', lineHeight: 1.15 }}
                    >
                      {t('dashboard.completedToday')}
                    </h2>
                    <p className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      {stats.streakDays} {t('dashboard.dayStreakLabel')}!
                    </p>
                  </div>
                </div>
              ) : (
                /* ── LESSON PENDING STATE ── */
                <>
                  <div
                    className="text-xs font-display font-bold mb-3 tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
                  >
                    {t('dashboard.todaysLesson').toUpperCase()}
                  </div>
                  <h2
                    className="font-display font-black leading-tight mb-2"
                    style={{ color: 'var(--text-on-primary)', fontSize: 'clamp(1.55rem, 4.5vw, 1.875rem)', lineHeight: 1.15 }}
                  >
                    {t('dashboard.continueLearning')}
                  </h2>
                  <p className="text-sm mb-4 font-body" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {t('dashboard.learnFiveWords')}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {todayPlan.newWords.slice(0, 5).map((w) => (
                      <span
                        key={w.word}
                        className="text-sm font-display font-bold px-4 py-1.5 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.22)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          color: 'var(--text-on-primary)',
                          border: '1px solid rgba(255,255,255,0.30)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        }}
                      >
                        {w.word}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* CTA Button — solid white pill */}
              <div
                className="inline-flex items-center gap-2 font-display font-extrabold py-3 px-7 rounded-full mt-4"
                style={{
                  background: 'var(--bg-card)',
                  color: lessonDone ? 'var(--success)' : 'var(--primary)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                  minHeight: '48px',
                  letterSpacing: '-0.01em',
                  fontSize: '0.975rem',
                }}
              >
                {lessonDone ? t('dashboard.review') : t('dashboard.start')}
                <Play size={15} strokeWidth={3} style={{ fill: lessonDone ? 'var(--success)' : 'var(--primary)' }} />
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.section>

      {/* ============================================================
          3. WEEKLY STREAK ROW
          ============================================================ */}
      <motion.section
        style={{
          background: 'linear-gradient(135deg, var(--primary-pale) 0%, var(--bg-card) 100%)',
          borderRadius: '1rem',
          borderLeft: '4px solid var(--primary)',
        }}
        className="p-4 shadow-card"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              {t('dashboard.weeklyProgress')}
            </span>
            {completedDays > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))' }}
              >
                <Flame size={12} style={{ color: 'var(--text-on-primary)' }} />
                <span className="text-[11px] font-display font-bold" style={{ color: 'var(--text-on-primary)' }}>
                  {completedDays} {lang === 'tr' ? 'günlük seri!' : 'day streak!'}
                </span>
              </div>
            )}
          </div>
          <div
            className="px-3 py-1 rounded-full"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))' }}
          >
            <span className="text-xs font-display font-bold" style={{ color: 'var(--text-on-primary)' }}>
              {completedDays}/7 {t('dashboard.dayUnit')}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          {weeklyDots.map((done, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayLabels = t('dashboard.daysOfWeek').split(',');
            const dayLabel = dayLabels[d.getDay()];
            const isToday = i === 6;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="relative flex items-center justify-center">
                  {isToday && !done && (
                    <div
                      className="absolute w-11 h-11 rounded-full animate-ping"
                      style={{
                        background: 'transparent',
                        border: '2px solid var(--warning)',
                        opacity: 0.4,
                      }}
                    />
                  )}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                    style={
                      done
                        ? {
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                            boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 40%, transparent)',
                          }
                        : isToday
                          ? {
                              background: 'var(--bg-card)',
                              border: '2.5px dashed var(--warning)',
                            }
                          : { background: 'var(--bg-soft)' }
                    }
                  >
                    {done ? (
                      <Flame size={18} style={{ color: 'var(--text-on-primary)' }} />
                    ) : isToday ? (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: 'var(--warning)' }}
                      />
                    ) : null}
                  </div>
                </div>
                <span
                  className={`font-display font-semibold ${isToday ? 'text-[11px]' : 'text-[10px]'}`}
                  style={{
                    color: isToday ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: isToday ? 700 : 600,
                  }}
                >
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ============================================================
          4. WORDS I KNOW PROGRESS
          ============================================================ */}
      <motion.section
        style={{
          background: 'linear-gradient(135deg, var(--success-pale) 0%, var(--bg-card) 100%)',
          borderRadius: '1rem',
          borderLeft: '4px solid var(--success)',
        }}
        className="p-4 shadow-card"
        variants={itemVariants}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} style={{ color: 'var(--success)' }} strokeWidth={2.2} />
            <span className="font-display font-bold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              {t('dashboard.wordsIKnow')}
            </span>
            {learnedCount > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'var(--success)', fontSize: '0.7rem', color: 'var(--text-on-primary)', fontWeight: 700, letterSpacing: '0.02em' }}
              >
                <Star size={10} fill="var(--text-on-primary)" strokeWidth={0} />
                Harika!
              </div>
            )}
          </div>
          <span
            className="font-display font-bold"
            style={{ color: 'var(--success)', fontSize: '1.15rem', lineHeight: 1 }}
          >
            {learnedCount}
            <span style={{ fontSize: '0.8rem', opacity: 0.65, fontWeight: 600 }}>/200</span>
          </span>
        </div>

        {/* Progress track with milestone markers */}
        <div className="relative">
          {/* Track */}
          <div
            className="h-4 rounded-full overflow-hidden"
            style={{ background: 'color-mix(in srgb, var(--success) 12%, transparent)' }}
          >
            {/* Fill */}
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((learnedCount / 200) * 100, 100)}%`,
                background: 'linear-gradient(90deg, var(--success), var(--success-light))',
                boxShadow: learnedCount > 0 ? '0 0 8px 2px color-mix(in srgb, var(--success) 40%, transparent)' : 'none',
              }}
            />
          </div>

          {/* Milestone tick marks at 25%, 50%, 75% */}
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              style={{
                position: 'absolute',
                top: 0,
                left: `${pct}%`,
                transform: 'translateX(-50%)',
                width: '2px',
                height: '100%',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '1px',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>

        {/* Milestone encouragement text */}
        {(() => {
          const milestones = [50, 100, 150, 200];
          const next = milestones.find((m) => learnedCount < m);
          const remaining = next !== undefined ? next - learnedCount : 0;
          return next !== undefined ? (
            <p
              className="mt-2"
              style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600, opacity: 0.8 }}
            >
              {remaining} kelime daha öğren, {next}. milestone&apos;a ulaş!
            </p>
          ) : (
            <p
              className="mt-2"
              style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700 }}
            >
              Tebrikler! Tüm kelimeleri tamamladın!
            </p>
          );
        })()}
      </motion.section>

      {/* ============================================================
          5B. WEEKLY TOURNAMENT BANNER
          ============================================================ */}
      <motion.div variants={itemVariants}>
        <WeeklyTournamentBanner />
      </motion.div>

      {/* ============================================================
          6. QUICK ACTIONS GRID
          ============================================================ */}
      <motion.nav className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4" variants={itemVariants}>
        {[
          {
            to: '/games', icon: Gamepad2, label: t('dashboard.games'),
            bg: 'var(--accent-purple)', lightBg: 'var(--accent-purple-pale)', textColor: 'var(--accent-purple)',
            badge: lang === 'tr' ? '16 oyun' : '16 games',
          },
          {
            to: '/words', icon: BookOpen, label: t('dashboard.words'),
            bg: 'var(--success)', lightBg: 'var(--success-pale)', textColor: 'var(--success)',
            badge: learnedCount > 0 ? (lang === 'tr' ? `${learnedCount} kelime` : `${learnedCount} words`) : null,
          },
          {
            to: '/videos', icon: Video, label: t('dashboard.videos'),
            bg: 'var(--info)', lightBg: 'var(--info-pale)', textColor: 'var(--info)',
            badge: null,
          },
          {
            to: '/songs', icon: Music, label: t('dashboard.songs'),
            bg: 'var(--warning)', lightBg: 'var(--warning-pale)', textColor: 'var(--warning)',
            badge: null,
          },
        ].map(({ to, icon: Icon, label, bg, lightBg, textColor, badge }) => (
          <Link
            key={to}
            to={to}
            style={{
              background: `linear-gradient(135deg, ${lightBg} 0%, var(--bg-card) 100%)`,
              borderRadius: '1.125rem',
              border: `1px solid color-mix(in srgb, ${lightBg} 85%, transparent)`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
            }}
            className="p-4 flex items-center gap-3 cursor-pointer active:scale-95 group"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
            onClick={() => SFX.click()}
          >
            {/* Icon container */}
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0"
              style={{
                background: bg,
                boxShadow: `0 4px 12px color-mix(in srgb, ${bg} 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)`,
              }}
            >
              <Icon size={26} style={{ color: 'var(--text-on-primary)' }} />
            </div>

            {/* Label + badge */}
            <div className="flex-1 min-w-0">
              <span className="font-display font-bold text-lg leading-tight block" style={{ color: textColor }}>
                {label}
              </span>
              {badge && (
                <span
                  className="text-xs font-body font-semibold mt-0.5 inline-block"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Arrow */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: textColor, opacity: 0.5, flexShrink: 0 }}
              className="group-hover:opacity-80 transition-opacity"
            >
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </motion.nav>

      </div>{/* end main column */}

      {/* ── RIGHT / SIDEBAR COLUMN ── */}
      <div className="space-y-4 mt-4 lg:mt-0 lg:sticky lg:top-20">

        {/* Stats Summary Card */}
        <motion.div
          style={{ background: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)' }}
          className="p-5 shadow-card"
          variants={itemVariants}
        >
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-pale)' }}>
              <Award size={14} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              {lang === 'tr' ? 'İstatistikler' : 'Your Stats'}
            </h3>
          </div>

          {/* 2x2 stat grid */}
          <div className="grid grid-cols-2 gap-3">

            {/* Level */}
            <div
              className="rounded-2xl p-3 text-center flex flex-col items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, var(--warning-pale) 0%, color-mix(in srgb, var(--warning) 15%, var(--bg-card)) 100%)',
                border: '1px solid color-mix(in srgb, var(--warning) 30%, transparent)',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--warning)' }}>
                <Star size={14} fill="white" color="white" />
              </div>
              <div className="font-display font-black text-2xl leading-none" style={{ color: 'var(--warning)' }}>{stats.level}</div>
              <div className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{lang === 'tr' ? 'Seviye' : 'Level'}</div>
            </div>

            {/* Total XP */}
            <div
              className="rounded-2xl p-3 text-center flex flex-col items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, var(--info-pale) 0%, color-mix(in srgb, var(--primary) 12%, var(--bg-card)) 100%)',
                border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                {/* Zap / bolt inline SVG */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="font-display font-black text-2xl leading-none" style={{ color: 'var(--primary)' }}>{stats.xp.toLocaleString()}</div>
              <div className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{lang === 'tr' ? 'Toplam XP' : 'Total XP'}</div>
            </div>

            {/* Words */}
            <div
              className="rounded-2xl p-3 text-center flex flex-col items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, var(--success-pale) 0%, color-mix(in srgb, var(--success) 12%, var(--bg-card)) 100%)',
                border: '1px solid color-mix(in srgb, var(--success) 25%, transparent)',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--success)' }}>
                <BookOpen size={14} color="white" />
              </div>
              <div className="font-display font-black text-2xl leading-none" style={{ color: 'var(--success)' }}>{learnedCount}</div>
              <div className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{lang === 'tr' ? 'Kelime' : 'Words'}</div>
            </div>

            {/* Streak */}
            <div
              className="rounded-2xl p-3 text-center flex flex-col items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, var(--warning-pale) 0%, color-mix(in srgb, var(--accent-orange) 10%, var(--bg-card)) 100%)',
                border: '1px solid color-mix(in srgb, var(--accent-orange) 25%, transparent)',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-orange)' }}>
                <Flame size={14} fill="white" color="white" />
              </div>
              <div className="font-display font-black text-2xl leading-none" style={{ color: 'var(--accent-orange)' }}>{stats.streakDays}</div>
              <div className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{lang === 'tr' ? 'Seri' : 'Streak'}</div>
            </div>

          </div>
        </motion.div>

        {/* Daily Goal */}
        <motion.section
          style={{
            background: 'linear-gradient(135deg, var(--warning-pale) 0%, var(--bg-card) 100%)',
            borderRadius: '1rem',
            border: '1px solid color-mix(in srgb, var(--warning) 30%, transparent)',
            borderLeft: '4px solid var(--warning)',
          }}
          className="p-4 shadow-card"
          variants={itemVariants}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--warning)', opacity: 0.85 }}>
              {lang === 'tr' ? 'Günlük Hedef' : 'Daily Goal'}
            </span>
            {todayXP >= dailyGoal && (
              <Star size={18} fill="var(--warning)" color="var(--warning)" style={{ filter: 'drop-shadow(0 0 4px color-mix(in srgb, var(--warning) 50%, transparent))' }} />
            )}
          </div>
          {/* Ring centered */}
          <div className="flex justify-center mb-3">
            <DailyGoalWidget uid={userId} lang={lang as 'tr' | 'en'} />
          </div>
          {/* Motivational text */}
          <p className="text-center font-display font-semibold text-sm leading-snug mb-4" style={{ color: 'var(--text-secondary)' }}>
            {todayXP >= dailyGoal ? t('dashboard.dailyGoalDone') : t('dashboard.dailyGoalKeep')}
          </p>
          {/* Progress bar */}
          <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--warning) 25%, transparent)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((todayXP / dailyGoal) * 100, 100)}%`,
                background: 'linear-gradient(90deg, var(--warning), var(--accent-orange))',
                boxShadow: '0 0 8px color-mix(in srgb, var(--accent-orange) 50%, transparent)',
              }}
            />
          </div>
        </motion.section>

        {/* Word of the Day */}
        <motion.section
          style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark))', borderRadius: '1rem' }}
          className="p-5 shadow-lg"
          variants={itemVariants}
        >
          {/* Pill badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="inline-flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
            >
              <KidIcon name="star" size={12} />
              {t('profile.wordOfTheDay')}
            </span>
            <button
              type="button"
              onClick={() => speak(wod.word)}
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{ width: '48px', height: '48px', background: 'var(--bg-card)', color: 'var(--accent-purple)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
              aria-label={`Listen to ${wod.word}`}
            >
              <Volume2 size={20} />
            </button>
          </div>
          {/* Word */}
          <div
            className="font-display font-black text-3xl leading-tight"
            style={{ color: 'var(--text-on-primary)', textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
          >
            {wod.word}
          </div>
          {/* Translation */}
          <div
            className="font-body text-base mt-1.5"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {wod.tr}
          </div>
        </motion.section>

        {/* Sound of the Day */}
        <motion.section variants={itemVariants}>
          <SoundOfTheDay />
        </motion.section>

        {/* Streak Calendar */}
        <motion.section
          style={{
            background: 'linear-gradient(135deg, var(--primary-pale) 0%, var(--bg-card) 100%)',
            borderRadius: '1rem',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--primary)',
          }}
          className="p-4 shadow-card"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame size={15} style={{ color: 'var(--primary)' }} />
              <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('dashboard.activity')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.last35Days')}</span>
              {stats.streakDays > 0 && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-display font-bold"
                  style={{ background: 'var(--accent-orange)', color: 'var(--text-on-primary)' }}
                >
                  <Flame size={11} fill="white" color="white" />
                  {stats.streakDays}{lang === 'tr' ? ' gün' : 'd'}
                </span>
              )}
            </div>
          </div>

          {/* Calendar */}
          <StreakCalendar activityDates={activityDates} streakDays={stats.streakDays} size="compact" />

          {/* Motivational footer */}
          <div className="mt-3">
            {stats.streakDays === 0 ? (
              <div
                className="rounded-full px-3 py-1.5 text-center text-xs font-body"
                style={{ background: 'var(--primary-pale)', color: 'var(--text-secondary)' }}
              >
                {lang === 'tr' ? 'Seriyi başlat!' : 'Start your streak!'}
              </div>
            ) : (
              <div
                className="rounded-full px-3 py-1.5 text-center text-xs font-display font-bold"
                style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}
              >
                {lang === 'tr' ? 'Devam et! Seriyi koru!' : 'Keep it up! Maintain your streak!'}
              </div>
            )}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section variants={itemVariants}>
          {recentBadges.length > 0 ? (
            <div
              style={{
                background: 'linear-gradient(135deg, var(--warning-pale) 0%, white 100%)',
                borderRadius: '1rem',
                border: '1px solid var(--border)',
                borderLeft: '4px solid var(--warning)',
              }}
              className="p-4 shadow-card"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award size={16} style={{ color: 'var(--warning)' }} />
                  <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t('dashboard.achievements')}
                  </h3>
                </div>
                <span
                  className="font-display font-bold text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--warning)', color: 'white', fontSize: '11px' }}
                >
                  {recentBadges.filter(Boolean).length}
                </span>
              </div>

              {/* Badge grid */}
              <div className="flex flex-wrap gap-2">
                {recentBadges.map((badge) => badge && (
                  <div key={badge.id} className="flex flex-col items-center gap-1">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--warning-pale) 0%, color-mix(in srgb, var(--warning) 10%, var(--bg-card)) 100%)',
                        boxShadow: '0 2px 8px color-mix(in srgb, var(--warning) 18%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--warning) 20%, transparent)',
                      }}
                    >
                      {badge.icon ? (
                        <KidIcon name={badge.icon as KidIconName} size={28} />
                      ) : (
                        <Award size={28} style={{ color: 'var(--warning)' }} />
                      )}
                    </div>
                    <span
                      className="text-xs font-body text-center"
                      style={{ color: 'var(--text-secondary)', maxWidth: '3.5rem' }}
                    >
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* See all link */}
              <div className="flex justify-end mt-3">
                <Link
                  to="/profile"
                  className="font-display font-bold text-xs transition-colors"
                  style={{ color: 'var(--warning)' }}
                >
                  {lang === 'tr' ? 'Tümünü gör →' : 'See all →'}
                </Link>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'linear-gradient(135deg, var(--warning-pale) 0%, var(--bg-card) 100%)',
                borderRadius: '1rem',
                border: '1px solid var(--border)',
                borderLeft: '4px solid var(--warning)',
              }}
              className="p-4 shadow-card text-center"
            >
              {/* Large trophy icon */}
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--warning-pale) 0%, color-mix(in srgb, var(--warning) 10%, var(--bg-card)) 100%)',
                  boxShadow: '0 4px 12px color-mix(in srgb, var(--warning) 20%, transparent)',
                }}
              >
                <KidIcon name="trophy" size={36} />
              </div>

              <p className="font-display font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {t('dashboard.earnFirstBadge')}
              </p>
              <p className="text-xs font-body mb-4" style={{ color: 'var(--text-secondary)' }}>
                {t('dashboard.completeForBadges')}
              </p>

              {/* Ghost placeholder slots */}
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'var(--bg-muted)',
                      border: '2px dashed var(--border)',
                    }}
                  >
                    <Award size={22} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/daily-lesson"
                className="inline-flex items-center justify-center font-display font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  minHeight: '36px',
                  boxShadow: '0 2px 8px color-mix(in srgb, var(--primary) 25%, transparent)',
                }}
              >
                {lang === 'tr' ? 'Derse başla →' : 'Start lesson →'}
              </Link>
            </div>
          )}
        </motion.section>

      </div>{/* end sidebar */}

      </div>{/* end layout */}

      {/* Admin shortcut */}
      {isAdmin && (
        <motion.div className="text-center mt-4" variants={itemVariants}>
          <Link
            to="/admin"
            className="inline-block font-display font-bold text-sm transition-colors px-4 py-2"
            style={{ color: 'var(--text-secondary)', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
          >
            Admin Panel
          </Link>
        </motion.div>
      )}

      </div>{/* end max-w-6xl container */}

      <MimiGuide
        message="Hi! Tap the big play button to start learning!"
        messageTr="Merhaba! Büyük oynat butonuna dokun ve öğrenmeye başla!"
        showOnce="mimi_guide_dashboard"
      />
    </motion.div>
    </>
  );
}
