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
  CheckCircle,
  Award,
  Loader2,
  Volume2,
  Flame,
  Star,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { KidIcon } from '../components/ui';
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
import { getTodayMinutes } from '../services/activityLogger';
import { getTodayLesson, isDailyLessonCompletedToday } from '../services/dailyLessonService';

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
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length];
}

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

  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';

  // Daily lesson state
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
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

  const lessonProgress = Math.round((lesson.currentLesson / lesson.totalLessons) * 100);
  const phaseInfo = useMemo(() => getPhaseInfo(), []);
  const xpProgress = getXPProgress();

  const recentBadges = useMemo(() => {
    return stats.badges
      .slice(-6)
      .reverse()
      .map((id) => allBadges.find((b) => b.id === id) || ALL_BADGES.find((b) => b.id === id))
      .filter(Boolean);
  }, [stats.badges, allBadges]);

  // Suppress unused var warnings
  void dueWords;
  void xpProgress;
  void todayMin;
  void lessonProgress;
  void phaseInfo;

  const wod = getWordOfTheDay();

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-primary-500" size={40} />
        <p className="font-display font-semibold text-ink-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-lg mx-auto px-4 py-6 space-y-4 bg-gradient-to-b from-cream-100 to-white min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ============================================================
          1. GREETING + STREAK ROW
          ============================================================ */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div>
          <p className="text-ink-500 font-body text-sm">Merhaba,</p>
          <h1 className="font-display font-extrabold text-2xl text-ink-900">{displayName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-orange-50 text-primary-500 font-bold px-3 py-1.5 rounded-full text-sm font-display">
            <Flame size={16} className="text-primary-500" />
            {stats.streakDays} gün
          </div>
          <div className="flex items-center gap-1 bg-gold-50 text-gold-600 font-bold px-3 py-1.5 rounded-full text-sm font-display">
            <Star size={16} className="text-gold-600" />
            {stats.xp.toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          2. DAILY LESSON HERO CARD
          ============================================================ */}
      <motion.section variants={itemVariants}>
        <Link to="/daily-lesson" className="block">
          <div className="bg-gradient-to-br from-primary-500 via-primary-500 to-orange-600 rounded-3xl p-6 lg:p-8 text-white shadow-primary-lg relative overflow-hidden">
            {/* Background decoration circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-12 -left-4 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute top-4 right-16 w-16 h-16 bg-white/15 rounded-full" />

            <div className="relative z-10">
              <div className="text-white/80 text-sm font-display font-semibold mb-1">
                {lessonDone ? '' : 'BUGÜNÜN DERSİ'}
              </div>
              <h2 className="font-display font-black text-2xl lg:text-3xl text-white mt-2 leading-tight mb-2">
                {lessonDone ? 'Bugün tamamlandı!' : 'Öğrenmeye devam et'}
              </h2>
              <p className="text-white/80 text-sm mb-4">
                {lessonDone
                  ? `${stats.streakDays} günlük seri!`
                  : '5 yeni İngilizce kelime öğren'}
              </p>
              {!lessonDone && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {todayPlan.newWords.slice(0, 5).map((w) => (
                    <span
                      key={w.word}
                      className="bg-white/20 text-white text-xs font-display font-bold px-3 py-1 rounded-full"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 bg-white text-primary-500 font-display font-extrabold py-3 px-6 rounded-full shadow-md">
                {lessonDone ? 'Tekrar Et' : 'Başla'}
                <Play size={16} strokeWidth={3} />
              </div>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* ============================================================
          3. WEEKLY STREAK ROW
          ============================================================ */}
      <motion.section className="bg-white rounded-2xl p-4 shadow-card" variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-bold text-ink-900">Bu Hafta</span>
          <span className="text-xs text-ink-400 font-body">{completedDays}/7 gün</span>
        </div>
        <div className="flex justify-between">
          {weeklyDots.map((done, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayLabels = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
            const dayLabel = dayLabels[d.getDay()];
            const isToday = i === 6;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm'
                      : isToday
                        ? 'bg-white border-2 border-gold-400 animate-pulse'
                        : 'bg-ink-100 text-ink-300'
                  }`}
                >
                  {done && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
                <span className={`text-[10px] font-display font-semibold ${isToday ? 'text-primary-500' : 'text-ink-400'}`}>
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
      <motion.section className="bg-white rounded-2xl p-4 shadow-card" variants={itemVariants}>
        <div className="flex justify-between mb-2">
          <span className="font-display font-bold text-ink-900">Bildiğim Kelimeler</span>
          <span className="font-display font-bold text-primary-500">{learnedCount}/200</span>
        </div>
        <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max((learnedCount / 200) * 100, 2)}%` }}
          />
        </div>
      </motion.section>

      {/* ============================================================
          5. WORD OF THE DAY
          ============================================================ */}
      <motion.section
        className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
        variants={itemVariants}
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <KidIcon name="star" size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-display font-bold text-white/70 uppercase tracking-wide mb-1">
            Günün Kelimesi
          </div>
          <div className="font-display font-black text-2xl text-white">{wod.word}</div>
          <div className="text-white/70 text-sm font-body">{wod.tr}</div>
        </div>
        <button
          onClick={() => speak(wod.word).catch(() => {})}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label={`Listen to ${wod.word}`}
        >
          <Volume2 size={18} />
        </button>
      </motion.section>

      {/* ============================================================
          6. QUICK ACTIONS GRID
          ============================================================ */}
      <motion.nav className="grid grid-cols-2 gap-3" variants={itemVariants}>
        {[
          { to: '/games', icon: Gamepad2, label: t('dashboard.games'), bg: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
          { to: '/words', icon: BookOpen, label: t('dashboard.words'), bg: 'bg-success-500', lightBg: 'bg-success-50', textColor: 'text-success-600' },
          { to: '/videos', icon: Video, label: t('dashboard.videos'), bg: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
          { to: '/songs', icon: Music, label: t('dashboard.songs'), bg: 'bg-gold-500', lightBg: 'bg-gold-50', textColor: 'text-gold-700' },
        ].map(({ to, icon: Icon, label, bg, lightBg, textColor }) => (
          <Link
            key={to}
            to={to}
            className={`${lightBg} rounded-2xl p-4 flex items-center gap-4 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer shadow-sm`}
            onClick={() => SFX.click()}
          >
            <div className={`${bg} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon size={24} className="text-white" />
            </div>
            <span className={`font-display font-bold text-base ${textColor}`}>{label}</span>
          </Link>
        ))}
      </motion.nav>

      {/* ============================================================
          7. ACHIEVEMENTS
          ============================================================ */}
      <motion.section variants={itemVariants}>
        {recentBadges.length > 0 ? (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="font-display font-bold text-ink-900 mb-3">{t('dashboard.achievements')}</h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recentBadges.map((badge) => badge && (
                <div key={badge.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-14 h-14 bg-gold-50 rounded-xl flex items-center justify-center">
                    <Award size={28} className="text-gold-500" />
                  </div>
                  <span className="text-xs font-body text-ink-500 text-center max-w-[3.5rem] truncate">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-card text-center">
            <div className="w-20 h-20 rounded-2xl bg-gold-50 mx-auto mb-4 flex items-center justify-center">
              <KidIcon name="trophy" size={48} />
            </div>
            <p className="font-display font-bold text-ink-900 mb-1">İlk rozetini kazan!</p>
            <p className="text-sm text-ink-400 font-body">Ders yaparak rozetler kazan</p>
          </div>
        )}
      </motion.section>

      {/* Admin shortcut */}
      {isAdmin && (
        <motion.div className="text-center" variants={itemVariants}>
          <Link
            to="/admin"
            className="inline-block font-display font-bold text-sm text-ink-400 hover:text-primary-500 transition-colors px-4 py-2"
          >
            Admin Panel
          </Link>
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
