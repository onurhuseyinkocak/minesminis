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
      style={{ background: 'linear-gradient(180deg, var(--primary-pale) 0%, var(--bg-page, #fff) 100%)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* max-w-xl on mobile/desktop keeps the single-col layout tight.
          md:max-w-2xl gives tablet (768px+) a bit more breathing room. */}
      <div className="max-w-xl md:max-w-2xl lg:max-w-xl mx-auto px-4 md:px-6 py-6">
      {/* ============================================================
          1. GREETING + STREAK ROW
          ============================================================ */}
      <motion.div className="flex items-center justify-between mb-5" variants={itemVariants}>
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/avatar"
            title={lang === 'tr' ? 'Avatarını düzenle' : 'Edit avatar'}
            className="flex-shrink-0 rounded-full ring-2 ring-primary-500 ring-offset-1"
          >
            <AvatarDisplay
              config={getAvatarConfig(userId)}
              letter={displayName}
              size={56}
              animated={false}
            />
          </Link>
          <div className="min-w-0">
            <p className="font-body text-sm leading-tight" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.hello')}</p>
            <h1 className="font-display font-extrabold text-2xl truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex items-center gap-1 font-bold rounded-full text-sm font-display"
            style={{ background: 'var(--primary-pale)', color: 'var(--primary)', padding: '10px 12px', minHeight: '44px' }}
          >
            <Flame size={16} style={{ color: 'var(--primary)' }} />
            {stats.streakDays} {t('dashboard.dayUnit')}
          </div>
          <StreakProtectionBadge count={memoizedFreezeCount} size="sm" />
          <div
            className="flex items-center gap-1 font-bold rounded-full text-sm font-display"
            style={{ background: 'var(--warning-pale)', color: 'var(--warning)', padding: '10px 12px', minHeight: '44px' }}
          >
            <Star size={16} style={{ color: 'var(--warning)' }} />
            {stats.xp.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
          </div>
          {getActiveBoost() !== null && <XPBoosterBadge />}
        </div>
      </motion.div>

      {/* ── XP Level Progress Bar ── */}
      <motion.div className="mb-1" variants={itemVariants}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-display font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'tr' ? `Seviye ${stats.level}` : `Level ${stats.level}`}
          </span>
          <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
            {getXPProgress()}% · {getXPForNextLevel()} XP {lang === 'tr' ? 'sonraki seviye' : 'to next level'}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-soft, #E8E8E8)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.max(getXPProgress(), 2)}%`,
              background: 'linear-gradient(90deg, var(--warning), var(--warning-light, #FFD700))',
            }}
          />
        </div>
      </motion.div>

      {/* Single-column layout — max-width capped at 480px */}
      <div className="space-y-4">

      {/* Main content */}
      <div className="space-y-4">

      {/* ============================================================
          2. DAILY LESSON HERO CARD
          ============================================================ */}
      <motion.section variants={itemVariants}>
        <Link to="/daily-lesson" className="block">
          <div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              boxShadow: '0 8px 32px var(--primary-glow)',
              borderBottom: '5px solid color-mix(in srgb, var(--primary) 60%, black)',
            }}
          >
            {/* Background decoration circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <div className="absolute top-4 right-16 w-16 h-16 rounded-full" style={{ background: 'rgba(255,255,255,0.14)' }} />

            <div className="relative z-10">
              {!lessonDone && (
                <div
                  className="text-sm font-display font-semibold mb-1"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  {t('dashboard.todaysLesson').toUpperCase()}
                </div>
              )}
              <h2
                className="font-display font-black text-2xl mt-2 leading-tight mb-2"
                style={{ color: 'var(--text-on-primary, #fff)' }}
              >
                {lessonDone ? t('dashboard.completedToday') : t('dashboard.continueLearning')}
              </h2>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.82)' }}>
                {lessonDone
                  ? `${stats.streakDays} ${t('dashboard.dayStreakLabel')}!`
                  : t('dashboard.learnFiveWords')}
              </p>
              {!lessonDone && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {todayPlan.newWords.slice(0, 5).map((w) => (
                    <span
                      key={w.word}
                      className="text-xs font-display font-bold px-3 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.20)', color: 'var(--text-on-primary, #fff)' }}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="inline-flex items-center gap-2 font-display font-extrabold py-3 px-6 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.20)',
                  color: 'var(--text-on-primary, #fff)',
                  boxShadow: '0 2px 12px var(--primary-glow)',
                  minHeight: '44px',
                }}
              >
                {lessonDone ? t('dashboard.review') : t('dashboard.start')}
                <Play size={16} strokeWidth={3} />
              </div>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* ============================================================
          3. WEEKLY STREAK ROW
          ============================================================ */}
      <motion.section style={{ background: 'var(--bg-card)', borderRadius: '1rem' }} className="p-4 shadow-card" variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>{t('dashboard.weeklyProgress')}</span>
          <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{completedDays}/7 {t('dashboard.dayUnit')}</span>
        </div>
        <div className="flex justify-between">
          {weeklyDots.map((done, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayLabels = t('dashboard.daysOfWeek').split(',');
            const dayLabel = dayLabels[d.getDay()];
            const isToday = i === 6;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={
                    done
                      ? { background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', boxShadow: 'var(--shadow-sm)' }
                      : isToday
                        ? { background: 'var(--bg-card)', border: '2px solid var(--warning)' }
                        : { background: 'var(--bg-soft, #F1F5F9)' }
                  }
                >
                  {done
                    ? <div className="w-3 h-3 rounded-full" style={{ background: 'var(--text-on-primary, #fff)' }} />
                    : isToday
                      ? <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--warning)' }} />
                      : null
                  }
                </div>
                <span
                  className="text-[10px] font-display font-semibold"
                  style={{ color: isToday ? 'var(--primary)' : 'var(--text-secondary)' }}
                >
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ============================================================
          3B. STREAK CALENDAR
          ============================================================ */}
      <motion.section style={{ background: 'var(--bg-card)', borderRadius: '1rem' }} className="p-4 shadow-card" variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>{t('dashboard.activity')}</span>
          <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.last35Days')}</span>
        </div>
        <StreakCalendar
          activityDates={activityDates}
          streakDays={stats.streakDays}
          size="compact"
        />
      </motion.section>

      {/* ============================================================
          4. WORDS I KNOW PROGRESS
          ============================================================ */}
      <motion.section style={{ background: 'var(--bg-card)', borderRadius: '1rem' }} className="p-4 shadow-card" variants={itemVariants}>
        <div className="flex justify-between mb-2">
          <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>{t('dashboard.wordsIKnow')}</span>
          <span className="font-display font-bold" style={{ color: 'var(--primary)' }}>{learnedCount}/200</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-soft, #F1F5F9)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max((learnedCount / 200) * 100, 2)}%`, background: 'linear-gradient(90deg, var(--success), var(--success-light))' }}
          />
        </div>
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
      <motion.nav className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3" variants={itemVariants}>
        {[
          {
            to: '/games', icon: Gamepad2, label: t('dashboard.games'),
            bg: 'var(--accent-purple)', lightBg: 'var(--accent-purple-pale)', textColor: 'var(--accent-purple)',
          },
          {
            to: '/words', icon: BookOpen, label: t('dashboard.words'),
            bg: 'var(--success)', lightBg: 'var(--success-pale)', textColor: 'var(--success)',
          },
          {
            to: '/videos', icon: Video, label: t('dashboard.videos'),
            bg: 'var(--info)', lightBg: 'var(--info-pale)', textColor: 'var(--info)',
          },
          {
            to: '/songs', icon: Music, label: t('dashboard.songs'),
            bg: 'var(--warning)', lightBg: 'var(--warning-pale)', textColor: 'var(--warning)',
          },
        ].map(({ to, icon: Icon, label, bg, lightBg, textColor }) => (
          <Link
            key={to}
            to={to}
            style={{
              background: lightBg,
              borderRadius: '1rem',
              borderBottom: `5px solid color-mix(in srgb, var(--border) 80%, black)`,
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
            }}
            className="p-4 flex items-center gap-3 shadow-sm cursor-pointer hover:shadow-md active:scale-95"
            onClick={() => SFX.click()}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: bg }}
            >
              <Icon size={24} style={{ color: 'var(--text-on-primary, #fff)' }} />
            </div>
            <span className="font-display font-bold text-base" style={{ color: textColor }}>{label}</span>
          </Link>
        ))}
      </motion.nav>

      </div>{/* end main content */}

      {/* Secondary content */}
      <div className="space-y-4">

      {/* ============================================================
          DAILY GOAL WIDGET
          ============================================================ */}
      <motion.section style={{ background: 'var(--bg-card)', borderRadius: '1rem' }} className="p-5 shadow-card" variants={itemVariants}>
        <div className="flex items-start gap-4">
          <DailyGoalWidget uid={userId} lang={lang as 'tr' | 'en'} />
          <div className="flex-1 min-w-0 pt-1">
            <p className="font-display font-extrabold text-sm mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
              {todayXP >= dailyGoal
                ? t('dashboard.dailyGoalDone')
                : t('dashboard.dailyGoalKeep')}
            </p>
            <p className="font-body text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              {todayXP} / {dailyGoal} XP {lang === 'tr' ? 'bugün' : 'today'}
            </p>
            {/* XP progress bar — gradient-primary token */}
            <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-soft, #F1F5F9)' }} aria-hidden="true">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(Math.min((todayXP / dailyGoal) * 100, 100), 2)}%`,
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================
          5. WORD OF THE DAY
          ============================================================ */}
      <motion.section
        style={{
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark))',
          borderRadius: '1rem',
        }}
        className="p-5 flex items-center gap-4 shadow-lg"
        variants={itemVariants}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          <KidIcon name="star" size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-display font-bold uppercase tracking-wide mb-1"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {t('profile.wordOfTheDay')}
          </div>
          <div className="font-display font-black text-2xl" style={{ color: 'var(--text-on-primary, #fff)' }}>{wod.word}</div>
          <div className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.75)' }}>{wod.tr}</div>
        </div>
        <button
          type="button"
          onClick={() => speak(wod.word)}
          className="rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          style={{
            width: '44px',
            height: '44px',
            minWidth: '44px',
            background: 'rgba(255,255,255,0.18)',
            color: 'var(--text-on-primary, #fff)',
          }}
          aria-label={`Listen to ${wod.word}`}
        >
          <Volume2 size={18} />
        </button>
      </motion.section>

      {/* ============================================================
          6B. SOUND OF THE DAY
          ============================================================ */}
      <motion.section variants={itemVariants}>
        <SoundOfTheDay />
      </motion.section>

      {/* ============================================================
          7. ACHIEVEMENTS
          ============================================================ */}
      <motion.section variants={itemVariants}>
        {recentBadges.length > 0 ? (
          <div style={{ background: 'var(--bg-card)', borderRadius: '1rem' }} className="p-4 shadow-card">
            <h3 className="font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t('dashboard.achievements')}</h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recentBadges.map((badge) => badge && (
                <div key={badge.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--warning-pale)' }}
                  >
                    {badge.icon
                      ? <KidIcon name={badge.icon as KidIconName} size={28} />
                      : <Award size={28} style={{ color: 'var(--warning)' }} />
                    }
                  </div>
                  <span className="text-xs font-body text-center max-w-[3.5rem] truncate" style={{ color: 'var(--text-secondary)' }}>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: '1rem' }} className="p-5 shadow-card text-center">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'var(--warning-pale)' }}
            >
              <KidIcon name="trophy" size={40} />
            </div>
            <p className="font-display font-bold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>{t('dashboard.earnFirstBadge')}</p>
            <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.completeForBadges')}</p>
          </div>
        )}
      </motion.section>

      </div>{/* end secondary content */}

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
