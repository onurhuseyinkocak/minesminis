/**
 * DASHBOARD -- Learning-Focused Student Home Screen
 * MinesMinis v6.1
 *
 * ONE primary action: Today's Lesson hero card.
 * Everything else is secondary.
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
  CheckCircle,
  School,
  Award,
  Loader2,
  Gift,
  BookMarked,
  Volume2,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification, ALL_BADGES } from '../contexts/GamificationContext';
import { SFX } from '../data/soundLibrary';
import { speak } from '../services/ttsService';
import MimiGuide from '../components/MimiGuide';
import { WORLDS, getWorldById, getLessonById } from '../data/curriculum';
import { PHASES } from '../data/curriculumPhases';
import {
  getCurrentLesson as getTrackerCurrentLesson,
  getWorldCompletionCount,
} from '../data/progressTracker';
import { getDueWords } from '../data/spacedRepetition';
import { getNextAction, getCurrentPhonicsSound } from '../services/learningPathService';
import { getTodayMinutes, getRecentActivities } from '../services/activityLogger';
import { joinClassroom, getStudentClassroom } from '../services/classroomService';
import { getTodayLesson, isDailyLessonCompletedToday } from '../services/dailyLessonService';
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
  const currentSound = getCurrentPhonicsSound();
  if (!currentSound) {
    const phase = PHASES[0];
    return {
      name: phase?.name || 'Little Ears',
      unitLabel: `${phase?.name || 'Little Ears'} -- Unit 1`,
    };
  }
  const phaseIdx = currentSound.group <= 3 ? 0 : currentSound.group <= 5 ? 1 : currentSound.group <= 6 ? 2 : 3;
  const phase = PHASES[phaseIdx] || PHASES[0];
  return {
    name: phase?.name || 'Little Ears',
    unitLabel: `${phase?.name || 'Little Ears'} -- Group ${currentSound.group}`,
  };
}

// ============================================================
// PROGRESS RING COMPONENT
// ============================================================

function ProgressRing({
  value,
  max,
  label,
  colorClass,
}: {
  value: number;
  max: number;
  label: string;
  colorClass: string;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="dash-today__stat">
      <div className="dash-today__stat-ring">
        <svg viewBox="0 0 44 44">
          <circle className="dash-today__stat-ring-bg" cx="22" cy="22" r={radius} />
          <circle
            className={`dash-today__stat-ring-fill ${colorClass}`}
            cx="22"
            cy="22"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="dash-today__stat-value">{value}</span>
      </div>
      <span className="dash-today__stat-label">{label}</span>
    </div>
  );
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
// WORD OF THE DAY DATA
// ============================================================

interface WodEntry { word: string; tr: string }

const WORDS_OF_THE_DAY: WodEntry[] = [
  { word: 'wonderful',   tr: 'harika'          },
  { word: 'adventure',   tr: 'macera'          },
  { word: 'curious',     tr: 'meraklı'         },
  { word: 'brilliant',   tr: 'parlak / zeki'   },
  { word: 'generous',    tr: 'cömert'          },
  { word: 'enormous',    tr: 'devasa'          },
  { word: 'mysterious',  tr: 'gizemli'         },
  { word: 'courageous',  tr: 'cesur'           },
  { word: 'imagine',     tr: 'hayal etmek'     },
  { word: 'discover',    tr: 'keşfetmek'       },
  { word: 'treasure',    tr: 'hazine'          },
  { word: 'champion',    tr: 'şampiyon'        },
  { word: 'spectacular', tr: 'muhteşem'        },
  { word: 'enormous',    tr: 'devasa'          },
  { word: 'galaxy',      tr: 'galaksi'         },
  { word: 'volcano',     tr: 'yanardağ'        },
  { word: 'enchanted',   tr: 'büyülenmiş'      },
  { word: 'dazzling',    tr: 'göz alıcı'       },
  { word: 'fearless',    tr: 'korkusuz'        },
  { word: 'horizon',     tr: 'ufuk'            },
  { word: 'expedition',  tr: 'keşif gezisi'    },
  { word: 'harmony',     tr: 'uyum'            },
  { word: 'celebrate',   tr: 'kutlamak'        },
  { word: 'legendary',   tr: 'efsanevi'        },
  { word: 'radiant',     tr: 'parlak / ışıltılı'},
  { word: 'whimsical',   tr: 'tuhaf ve eğlenceli'},
  { word: 'persevere',   tr: 'ısrar etmek'     },
  { word: 'tranquil',    tr: 'sakin'           },
  { word: 'vibrant',     tr: 'canlı / renkli'  },
  { word: 'innovative',  tr: 'yenilikçi'       },
];

function getWordOfTheDay(): WodEntry {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length];
}

function WordOfTheDay() {
  const wod = getWordOfTheDay();
  return (
    <div className="dash-word-of-day">
      <span className="dash-wod__emoji">🌟</span>
      <div className="dash-wod__body">
        <span className="dash-wod__label">Word of the Day</span>
        <strong className="dash-wod__word">{wod.word}</strong>
        <span className="dash-wod__tr">— {wod.tr}</span>
      </div>
      <button
        className="dash-wod__listen"
        onClick={() => speak(wod.word).catch(() => {})}
        aria-label={`Listen to ${wod.word}`}
        title="Listen"
      >
        <Volume2 size={16} />
      </button>
    </div>
  );
}

// ============================================================
// QUICK ACTION DATA
// ============================================================

// QUICK_ACTIONS moved inside component to use t()

// ============================================================
// COMPONENT
// ============================================================

export default function Dashboard() {
  const { user, userProfile, isAdmin } = useAuth();
  const { t } = useLanguage();
  const {
    stats,
    loading,
    getXPProgress,
    allBadges,
  } = useGamification();

  const QUICK_ACTIONS = [
    { to: '/games', icon: Gamepad2, label: t('dashboard.games'), className: 'dash-qa--games' },
    { to: '/words', icon: BookOpen, label: t('dashboard.words'), className: 'dash-qa--words' },
    { to: '/videos', icon: Video, label: t('dashboard.videos'), className: 'dash-qa--videos' },
    { to: '/songs', icon: Music, label: t('dashboard.songs'), className: 'dash-qa--songs' },
  ];

  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';
  const initial = displayName.charAt(0).toUpperCase();

  // Daily lesson state
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [lessonDone, setLessonDone] = useState<boolean>(() =>
    isDailyLessonCompletedToday(userId)
  );

  // Get today's lesson plan for word preview
  const todayPlan = useMemo(() => getTodayLesson(userId), [userId]);

  // Weekly progress: which of last 7 days has a completed lesson
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

  // Words learned count from gamification stats
  const learnedCount = stats.wordsLearned ?? 0;

  const [lesson, setLesson] = useState(() => getCurrentLessonData(userId));
  const [dueWords, setDueWords] = useState(() => getDueWords());
  const [_nextAction, _setNextAction] = useState(() => getNextAction());
  const [todayMin, setTodayMin] = useState(() => getTodayMinutes(user?.uid));

  useEffect(() => {
    const onFocus = () => {
      setLesson(getCurrentLessonData(userId));
      setDueWords(getDueWords());
      _setNextAction(getNextAction());
      setTodayMin(getTodayMinutes(userId));
      setLessonDone(isDailyLessonCompletedToday(userId));
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [userId, today]);

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

  // Today's completions -- count activities logged today, not lifetime stats
  const todayCompletions = useMemo(() => {
    const todayPrefix = new Date().toISOString().slice(0, 10);
    return getRecentActivities(50).filter(a =>
      a.timestamp.startsWith(todayPrefix)
    ).length;
  }, []);

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
  void todayMin;
  void lessonProgress;
  void phaseInfo;

  // ---- Loading ----
  if (loading) {
    return (
      <div className="dash child-mode">
        <div className="dash-loading">
          <Loader2 className="dash-loading-spinner" size={40} />
          <p className="dash-loading-text">{t('common.loading')}</p>
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
          DAILY LESSON HERO -- PRIMARY ACTION
          ============================================================ */}
      <motion.section
        className={`dash-daily-lesson${lessonDone ? ' dash-daily-lesson--done' : ''}`}
        variants={itemVariants}
      >
        {!lessonDone ? (
          <>
            <div className="dash-daily-lesson__icon-wrap">
              <BookMarked size={36} strokeWidth={2} />
            </div>
            <div className="dash-daily-lesson__body">
              <h2 className="dash-daily-lesson__title">{t('dashboard.todaysLesson')}</h2>
              <p className="dash-daily-lesson__desc">{t('dashboard.learnFiveWords')}</p>
              <div className="dash-daily-lesson__preview">
                {todayPlan.newWords.slice(0, 5).map((w) => (
                  <span key={w.word}>{w.word}</span>
                ))}
              </div>
            </div>
            <Link to="/daily-lesson" className="dash-daily-lesson__btn">
              {t('dashboard.startLearning')}
              <Play size={18} strokeWidth={2.5} />
            </Link>
          </>
        ) : (
          <>
            <div className="dash-daily-lesson__icon-wrap dash-daily-lesson__icon-wrap--done">
              <CheckCircle size={36} strokeWidth={2} />
            </div>
            <div className="dash-daily-lesson__body">
              <h2 className="dash-daily-lesson__title">{t('dashboard.greatJobToday')}</h2>
              <p className="dash-daily-lesson__desc">{t('dashboard.learnedFiveWords')}</p>
            </div>
            <div className="dash-daily-lesson__streak">
              <Flame size={20} />
              <span>{stats.streakDays} {t('dashboard.dayStreakLabel')}</span>
            </div>
          </>
        )}
      </motion.section>

      {/* ============================================================
          WORD OF THE DAY
          ============================================================ */}
      <motion.div variants={itemVariants}>
        <WordOfTheDay />
      </motion.div>

      {/* ============================================================
          WORDS I KNOW PROGRESS
          ============================================================ */}
      <motion.section className="dash-words-progress" variants={itemVariants}>
        <div className="dash-words-progress__header">
          <h3 className="dash-words-progress__title">{t('dashboard.wordsIKnow')}</h3>
          <span className="dash-words-progress__count">{learnedCount} / 200</span>
        </div>
        <div className="dash-words-progress__track">
          <div
            className="dash-words-progress__fill"
            style={{ width: `${Math.min((learnedCount / 200) * 100, 100)}%` }}
          />
        </div>
      </motion.section>

      {/* ============================================================
          WEEKLY PROGRESS DOTS
          ============================================================ */}
      <motion.section className="dash-weekly" variants={itemVariants}>
        <span className="dash-weekly__label">{t('dashboard.weeklyProgress')}</span>
        <div className="dash-weekly__dots">
          {weeklyDots.map((done, i) => (
            <div
              key={i}
              className={`dash-weekly__dot${done ? ' dash-weekly__dot--done' : ''}`}
              aria-label={done ? 'Completed' : 'Not completed'}
            />
          ))}
        </div>
      </motion.section>

      {/* ============================================================
          QUICK ACTIONS (secondary)
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
              <Icon size={28} />
            </div>
            <span className="dash-action__label">{label}</span>
          </Link>
        ))}
      </motion.nav>

      {/* ============================================================
          TODAY'S PROGRESS -- visual progress rings (secondary)
          ============================================================ */}
      <motion.section className="dash-today" variants={itemVariants}>
        <span className="dash-today__label">{t('dashboard.today')}</span>
        <div className="dash-today__stats">
          <ProgressRing
            value={todayCompletions}
            max={Math.max(todayCompletions, 5)}
            label="done"
            colorClass="dash-today__stat-ring-fill--done"
          />
        </div>
        <Link to="/words" className="dash-today__challenge">
          <BookOpen size={16} />
          <span>{t('dashboard.wordsIKnow')}</span>
        </Link>
      </motion.section>

      {/* ============================================================
          RECENT ACHIEVEMENTS
          ============================================================ */}
      <motion.section className="dash-achievements" variants={itemVariants}>
        <h2 className="dash-achievements__heading">{t('dashboard.achievements')}</h2>
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
          <div className="dash-achievements__empty">
            <div className="dash-achievements__empty-icon">
              <Gift size={28} />
            </div>
            <p className="dash-achievements__empty-text">
              {t('dashboard.playLessonsToUnlock')}
            </p>
          </div>
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
          <span className="dash-classroom__label">{t('dashboard.joinClassroom')}</span>
          <div className="dash-classroom__form">
            <input
              type="text"
              className="dash-classroom__input"
              placeholder="Code"
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
              {t('common.join')}
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
        messageTr="Merhaba! Ben Mimi! Büyük oynat butonuna dokun ve öğrenmeye başla!"
        showOnce="mimi_guide_dashboard"
      />
    </motion.div>
  );
}
