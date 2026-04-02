/**
 * DASHBOARD — Kids Playground Home
 * MinesMinis v9.0
 *
 * Truly child-themed: big Mimi hero, colorful action cards,
 * simple streak/level strip. Feels like Khan Academy Kids.
 * Zero emoji — Lottie + Lucide only.
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2, Globe, BookOpen, Music,
  Play, Flame, Star, Trophy, Sparkles,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import LottieCharacter from '../components/LottieCharacter';
import { isDailyLessonCompletedToday } from '../services/dailyLessonService';
import { usePageTitle } from '../hooks/usePageTitle';

// ─── Types & Helpers ─────────────────────────────────────────────────────────

type Lang = 'tr' | 'en';
const tx = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

// ─── Animation Variants ─────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const pop = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

// ─── Action Card Data ────────────────────────────────────────────────────────

interface ActionItem {
  icon: typeof Gamepad2;
  title: { tr: string; en: string };
  route: string;
  gradient: string;
}

const ACTIONS: ActionItem[] = [
  { icon: Gamepad2, title: { tr: 'Oyunlar', en: 'Games' }, route: '/games', gradient: 'from-orange-400 via-red-400 to-pink-500' },
  { icon: Globe, title: { tr: 'Ogren', en: 'Learn' }, route: '/worlds', gradient: 'from-blue-400 via-indigo-400 to-purple-500' },
  { icon: BookOpen, title: { tr: 'Kitaplar', en: 'Books' }, route: '/reading', gradient: 'from-emerald-400 via-teal-400 to-cyan-500' },
  { icon: Music, title: { tr: 'Sarkilar', en: 'Songs' }, route: '/songs', gradient: 'from-amber-400 via-orange-400 to-red-500' },
];

// ─── Greeting Messages ──────────────────────────────────────────────────────

const GREETINGS_TR = [
  'Bugun ogrenmeye hazir misin?',
  'Seni gormek harika!',
  'Hadi birlikte oynayalim!',
  'Yeni maceralar seni bekliyor!',
];
const GREETINGS_EN = [
  'Ready to learn today?',
  'Great to see you!',
  'Let\'s play together!',
  'New adventures await!',
];

function getDailyGreeting(lang: Lang): string {
  const dayIndex = new Date().getDay();
  const list = lang === 'tr' ? GREETINGS_TR : GREETINGS_EN;
  return list[dayIndex % list.length];
}

// ─── Sparkle Decoration ─────────────────────────────────────────────────────

function SparkleDecor({ className = '' }: { className?: string }) {
  return (
    <Sparkles
      size={16}
      className={`text-white/30 absolute pointer-events-none ${className}`}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const { lang } = useLanguage();
  const l = lang as Lang;
  usePageTitle('Ana Sayfa', 'Dashboard');

  const { stats, loading } = useGamification();

  const displayName = userProfile?.display_name || user?.displayName || 'Adventurer';
  const userId = user?.uid || 'guest';
  const lessonDone = useMemo(() => isDailyLessonCompletedToday(userId), [userId]);
  const greeting = useMemo(() => getDailyGreeting(l), [l]);

  // ─── Loading Skeleton ───────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="kid-bg kid-bubbles min-h-screen py-6">
        <div className="space-y-4">
          <div className="skeleton rounded-[32px] h-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton rounded-[24px] h-[140px]" />
            ))}
          </div>
          <div className="skeleton rounded-[24px] h-16" />
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="kid-bg kid-bubbles min-h-screen py-6 pb-24 relative">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-5 relative z-10"
      >
        {/* ═══ GREETING ═══ */}
        <motion.div variants={pop} className="px-1">
          <p className="font-display font-bold text-lg text-slate-600">
            {tx(l, 'Merhaba', 'Hello')},
          </p>
          <h1 className="font-display font-black text-2xl text-slate-900">
            {displayName}!
          </h1>
        </motion.div>

        {/* ═══ MIMI HERO CARD ═══ */}
        <motion.div variants={pop}>
          <Link
            to={lessonDone ? '/worlds' : '/daily-lesson'}
            className="block"
            aria-label={lessonDone ? tx(l, 'Kesfetmeye Devam', 'Keep Exploring') : tx(l, 'Derse Basla', 'Start Lesson')}
          >
            <div className={`
              relative overflow-hidden rounded-[32px] p-6
              bg-gradient-to-br shadow-lg kid-btn
              ${lessonDone
                ? 'from-emerald-400 via-teal-400 to-cyan-500'
                : 'from-orange-400 via-pink-400 to-purple-500'
              }
            `}>
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute top-4 right-12 w-6 h-6 rounded-full bg-white/15" />

              <div className="relative z-10 flex items-center gap-4">
                {/* Mimi */}
                <div className="flex-shrink-0">
                  <LottieCharacter
                    state={lessonDone ? 'celebrate' : 'idle'}
                    size={140}
                  />
                </div>

                {/* Speech bubble + CTA */}
                <div className="flex-1 min-w-0">
                  {/* Speech bubble */}
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-[20px] px-4 py-3 mb-4 shadow-sm">
                    <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-white/90 border-b-[8px] border-b-transparent" />
                    <p className="font-display font-bold text-slate-800 text-sm leading-snug">
                      {lessonDone
                        ? tx(l, 'Harika is cikardik!', 'We did great today!')
                        : greeting
                      }
                    </p>
                  </div>

                  {/* Big CTA */}
                  <div className={`
                    flex items-center justify-center gap-2
                    bg-white rounded-full px-5 py-3 shadow-md
                    kid-btn kid-pulse
                  `}>
                    {lessonDone
                      ? <Trophy size={22} className="text-emerald-500" />
                      : <Play size={22} className="text-orange-500" fill="currentColor" />
                    }
                    <span className={`font-display font-black text-base ${
                      lessonDone ? 'text-emerald-600' : 'text-orange-600'
                    }`}>
                      {lessonDone
                        ? tx(l, 'Kesfetmeye Devam', 'Keep Exploring')
                        : tx(l, 'Derse Basla', 'Start Lesson')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ═══ 2x2 ACTION GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.route} variants={pop}>
                <Link to={action.route} className="block" aria-label={action.title[l]}>
                  <div className={`
                    relative overflow-hidden rounded-[24px] min-h-[140px]
                    bg-gradient-to-br ${action.gradient}
                    flex flex-col items-center justify-center gap-3
                    shadow-md kid-btn kid-wobble
                  `}>
                    {/* Sparkle decorations */}
                    <SparkleDecor className="top-3 right-3" />
                    <SparkleDecor className="bottom-4 left-4" />
                    <SparkleDecor className="top-6 left-6" />

                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon size={32} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-display font-black text-white text-base tracking-wide">
                      {action.title[l]}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ STREAK & LEVEL STRIP ═══ */}
        <motion.div variants={pop}>
          <div className="flex items-center justify-center gap-6 bg-white rounded-[20px] px-6 py-4 shadow-sm border-2 border-orange-100">
            {/* Streak */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
                <Flame size={20} className="text-white" />
              </div>
              <div>
                <p className="font-display font-black text-orange-600 text-lg leading-none">
                  {stats.streakDays}
                </p>
                <p className="font-display font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  {tx(l, 'Gun Seri', 'Day Streak')}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-orange-100" />

            {/* Level */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-sm">
                <Star size={20} className="text-white" fill="white" />
              </div>
              <div>
                <p className="font-display font-black text-amber-600 text-lg leading-none">
                  {stats.level}
                </p>
                <p className="font-display font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  {tx(l, 'Seviye', 'Level')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
