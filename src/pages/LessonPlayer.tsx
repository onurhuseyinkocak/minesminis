/**
 * LESSON PLAYER — Lesson Play Page
 * MinesMinis v4.0
 *
 * Route: /worlds/:worldId/lessons/:lessonId
 * Plays through lesson activities sequentially with progress tracking.
 * Renders REAL interactive game components from curriculum data.
 * Smart-board friendly with large text and large buttons.
 */
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  SkipForward,
  Trophy,
  Star,
  Music,
  Gamepad2,
  BookOpen,
  Layers,
  Mic,
  HelpCircle,
  Home,
  RotateCcw,
  Volume2,
  Eye,
  EyeOff,
  Heart,
  Zap,
} from 'lucide-react';
import { Button, StarBurst, ConfettiRain, PerfectBadge, XPPop } from '../components/ui';
import LottieCharacter from '../components/LottieCharacter';
import { useGamification } from '../contexts/GamificationContext';
import { GameSelector } from '../components/games';
import { getLessonById, getWorldById, getWorldVocabulary } from '../data/curriculum';
import type { Activity, VocabularyWord } from '../data/curriculum';
import { PHONICS_GROUPS } from '../data/phonics';
import { completeLesson } from '../data/progressTracker';
import { updateWordProgress } from '../data/spacedRepetition';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getAgeGroupFromSettings, isActivityAllowedForAge, getAgeGroupConfig } from '../services/ageGroupService';
import { SFX } from '../data/soundLibrary';
import { logActivity } from '../services/activityLogger';
import { syncStudentProgress } from '../services/classroomService';
import { setActiveUser, startSession, recordActivity, getDifficultyMultiplier } from '../services/adaptiveEngine';
import type { LearningUnit, UnitActivity } from '../data/curriculumPhases';
import { getAllPhases } from '../services/curriculumService';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useProgress } from '../contexts/ProgressContext';
import Paywall from '../components/Paywall';
import { analytics } from '../services/analytics';
import './LessonPlayer.css';

// ── Daily lesson counter helpers ──────────────────────────────────────────────

function getDailyLessonDateKey(): string {
  const d = new Date();
  return `mm_daily_lessons_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTodayCompletedLessonCount(): number {
  try {
    const val = localStorage.getItem(getDailyLessonDateKey());
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementTodayCompletedLessonCount(): void {
  try {
    const key = getDailyLessonDateKey();
    const current = getTodayCompletedLessonCount();
    localStorage.setItem(key, String(current + 1));
  } catch {
    // storage unavailable
  }
}

// ============================================================
// CONSTANTS
// ============================================================

const INITIAL_HEARTS = 3;
const HEART_BONUS_XP = 10;

// ============================================================
// ACTIVITY TYPE CONFIG
// ============================================================

const ACTIVITY_ICONS: Record<string, typeof Music> = {
  'word-match': Gamepad2,
  'phonics-builder': Music,
  'sentence-scramble': Layers,
  'listening-challenge': Mic,
  'spelling-bee': BookOpen,
  'quick-quiz': HelpCircle,
  'story-choices': BookOpen,
  // Legacy types (fallback)
  song: Music,
  game: Gamepad2,
  flashcard: Layers,
  story: BookOpen,
  practice: Mic,
  quiz: HelpCircle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  'word-match': 'var(--accent-emerald)',
  'phonics-builder': 'var(--accent-blue)',
  'sentence-scramble': 'var(--warning)',
  'listening-challenge': 'var(--accent-pink)',
  'spelling-bee': 'var(--accent-purple)',
  'quick-quiz': 'var(--error)',
  'story-choices': 'var(--accent-blue)',
  // Legacy types (fallback)
  song: 'var(--accent-blue)',
  game: 'var(--accent-emerald)',
  flashcard: 'var(--warning)',
  story: 'var(--accent-purple)',
  practice: 'var(--accent-pink)',
  quiz: 'var(--error)',
};

function getUnitById(unitId: string): LearningUnit | null {
  for (const phase of getAllPhases()) {
    const unit = phase.units.find((u) => u.id === unitId);
    if (unit) return unit;
  }
  return null;
}

function unitActivityToActivity(ua: UnitActivity, index: number): Activity & { titleTr?: string } {
  return {
    id: `activity-${index}`,
    title: ua.title,
    titleTr: ua.titleTr,
    type: ua.type as Activity['type'],
    instructions: ua.description,
    xpReward: ua.xp,
    duration: ua.duration,
  };
}

/** Build extra props for specialized games from curriculum data */
function buildExtraProps(
  activityType: string,
  unit: LearningUnit | null,
): Record<string, unknown> | undefined {
  if (!unit) return undefined;

  switch (activityType) {
    case 'sound-intro': {
      const soundId = unit.phonicsFocus[0];
      if (!soundId) return undefined;
      for (const group of PHONICS_GROUPS) {
        const found = group.sounds.find((s) => s.id === soundId);
        if (found) {
          return {
            sound: {
              id: found.id,
              grapheme: found.grapheme,
              example: found.keywords[0] || found.sound,
              emoji: found.mnemonicEmoji,
              action: found.action,
              turkishNote: found.turkishNote,
              keywords: found.keywords.slice(0, 3).map((w) => ({ word: w, emoji: '' })),
              group: found.group,
            },
          };
        }
      }
      return undefined;
    }
    case 'tpr': {
      return { commands: unit.tprCommands.length > 0 ? unit.tprCommands : ['Stand up!', 'Sit down!', 'Clap!'] };
    }
    case 'reading': {
      return {
        text: unit.decodableText || 'No text available.',
        highlightSounds: unit.phonicsFocus.map((id) => id.replace(/^g\d+_/, '')),
      };
    }
    default:
      return undefined;
  }
}

/** Save unit progress to localStorage for WorldMap/WorldDetail */
function saveUnitProgress(unitId: string, activitiesCompleted: number): void {
  try {
    const key = `mimi_unit_progress_${unitId}`;
    localStorage.setItem(key, JSON.stringify({ activitiesCompleted, updatedAt: new Date().toISOString() }));
  } catch { /* localStorage might be unavailable */ }
}

// Game types that GameSelector can handle
const SUPPORTED_GAME_TYPES = new Set([
  'word-match',
  'spelling-bee',
  'quick-quiz',
  'sentence-scramble',
  'listening-challenge',
  'listening',
  'phonics-builder',
  'story-choices',
  'blending',
  'segmenting',
  'pronunciation',
  'sound-intro',
  'tpr',
  'reading',
]);

// ============================================================
// MIMI ENCOURAGEMENTS
// ============================================================

const ENCOURAGEMENT_KEYS = [
  'lesson.encouragement1',
  'lesson.encouragement2',
  'lesson.encouragement3',
  'lesson.encouragement4',
  'lesson.encouragement5',
  'lesson.encouragement6',
];

function getEncouragementKey(index: number) {
  return ENCOURAGEMENT_KEYS[index % ENCOURAGEMENT_KEYS.length];
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

const celebrationVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
  },
};

// ============================================================
// FALLBACK ACTIVITY (Flashcard review for unsupported types)
// ============================================================

interface FallbackActivityProps {
  activity: Activity;
  words: { english: string; turkish: string; emoji: string; phonetic?: string; exampleSentence?: string }[];
  onComplete: (score: number, total: number) => void;
  t: (key: string) => string;
}

function FallbackActivity({ activity, words, onComplete, t }: FallbackActivityProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const word = words[currentCard];

  const handleFlip = () => setFlipped((f) => !f);

  const handleNextCard = () => {
    setFlipped(false);
    const newReviewed = reviewedCount + 1;
    setReviewedCount(newReviewed);

    if (currentCard < words.length - 1) {
      setCurrentCard((c) => c + 1);
    } else {
      onComplete(words.length, words.length);
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!word) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <p className="text-center text-base text-[#64748B] font-['Inter',sans-serif]">
          {activity.instructions || t('lesson.noWordsToReview')}
        </p>
        <button
          type="button"
          onClick={() => onComplete(1, 1)}
          className="min-h-[56px] px-8 py-3 bg-[#FF6B35] text-white rounded-xl font-['Nunito',sans-serif] font-bold text-base hover:bg-[#e55a24] active:scale-95 transition-all"
        >
          {t('lesson.doneNext')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm text-[#64748B] font-['Inter',sans-serif] text-center">
        {activity.instructions}
      </p>
      <p className="text-xs text-[#94A3B8] font-['Inter',sans-serif]">
        {t('lesson.card')} {currentCard + 1} {t('lesson.of')} {words.length}
      </p>

      <div
        onClick={handleFlip}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } }}
        role="button"
        tabIndex={0}
        aria-label={flipped ? `${word.english} - ${word.turkish}. ${t('lesson.tapToReveal')}` : `${word.english}. ${t('lesson.tapToReveal')}`}
        className="w-full bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[#FF6B35] hover:shadow-lg transition-all active:scale-[0.98]"
      >
        <div className="w-14 h-14 rounded-full bg-[#FF6B35] flex items-center justify-center">
          <span className="text-white font-['Nunito',sans-serif] font-black text-2xl">
            {word.english.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-3xl font-['Nunito',sans-serif] font-black text-[#1E293B]">{word.english}</span>

        {flipped ? (
          <>
            <span className="text-xl font-['Nunito',sans-serif] font-bold text-[#0D5C4D]">
              {word.turkish}
            </span>
            {word.phonetic && (
              <span className="text-sm font-['Inter',sans-serif] text-[#64748B] italic">
                {word.phonetic}
              </span>
            )}
            {word.exampleSentence && (
              <span className="text-sm font-['Inter',sans-serif] text-[#64748B] text-center">
                &ldquo;{word.exampleSentence}&rdquo;
              </span>
            )}
          </>
        ) : (
          <span className="text-sm font-['Inter',sans-serif] text-[#94A3B8]">
            {t('lesson.tapToReveal')}
          </span>
        )}
      </div>

      <div className="flex gap-3 w-full">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleFlip(); }}
          className="flex-1 min-h-[52px] flex items-center justify-center gap-2 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#475569] font-['Nunito',sans-serif] font-bold text-sm hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all active:scale-95"
        >
          {flipped ? <EyeOff size={18} /> : <Eye size={18} />}
          {flipped ? t('lesson.hide') : t('lesson.reveal')}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); speakWord(); }}
          className="flex-1 min-h-[52px] flex items-center justify-center gap-2 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#475569] font-['Nunito',sans-serif] font-bold text-sm hover:border-[#0D5C4D] hover:text-[#0D5C4D] transition-all active:scale-95"
        >
          <Volume2 size={18} />
          {t('lesson.listen')}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
          className="flex-1 min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-[#FF6B35] text-white font-['Nunito',sans-serif] font-bold text-sm hover:bg-[#e55a24] transition-all active:scale-95"
        >
          {currentCard < words.length - 1 ? t('lesson.next') : t('lesson.done')}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

const LessonPlayer = () => {
  const { worldId = '', lessonId = '' } = useParams<{ worldId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { addXP, trackActivity } = useGamification();
  const { user, userProfile } = useAuth();
  const { t, lang } = useLanguage();
  const { maxLessonsPerDay, isPremium } = useSubscription();
  const { completeUnit } = useProgress();
  usePageTitle('Ders', 'Lesson');
  const userId = user?.uid || 'guest';

  // ---- Lesson completion guard (prevents double XP from handleActivityComplete + handleSkip race) ----
  const lessonCompletedRef = useRef(false);

  // ---- Adaptive Engine ----
  const activityStartTimeRef = useRef<number>(Date.now());
  const [difficultyMultiplier, setDifficultyMultiplier] = useState<number>(1.0);

  useEffect(() => {
    if (user?.uid) {
      setActiveUser(user.uid);
      startSession();
    }
  }, [user?.uid]);

  // Track lesson_started once when the player mounts with a valid lesson
  useEffect(() => {
    if (lessonId && worldId) {
      analytics.lessonStarted(lessonId, worldId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount
  }, []);

  // Cancel any in-progress TTS when the lesson player unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Load real lesson data from curriculum
  const oldLesson = useMemo(() => getLessonById(worldId, lessonId), [worldId, lessonId]);
  const lesson = useMemo(() => {
    if (oldLesson) return oldLesson;
    const unit = getUnitById(worldId);
    if (unit) {
      return {
        id: unit.id,
        title: unit.title,
        titleTr: unit.titleTr,
        number: unit.number,
        type: 'vocabulary' as const,
        xpReward: unit.activities.reduce((sum, a) => sum + a.xp, 0),
        duration: unit.activities.reduce((sum, a) => sum + a.duration, 0),
        targetWords: [] as string[],
        activities: unit.activities.map((ua, i) => unitActivityToActivity(ua, i)),
      };
    }
    return null;
  }, [worldId, lessonId, oldLesson]);
  const world = useMemo(() => getWorldById(worldId), [worldId]);
  const vocabulary = useMemo(() => getWorldVocabulary(worldId), [worldId]);
  const currentUnit = useMemo(() => getUnitById(worldId), [worldId]);

  const activityWords = useMemo(() => {
    if (!lesson) return [];
    const fromVocab = lesson.targetWords
      .map((tw) => vocabulary.find((v) => v.english === tw))
      .filter((w): w is VocabularyWord => Boolean(w))
      .map((w) => ({
        english: w.english,
        turkish: w.turkish,
        emoji: w.emoji,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
      }));
    if (fromVocab.length > 0) return fromVocab;
    const unit = getUnitById(worldId);
    if (unit) {
      const words: { english: string; turkish: string; emoji: string }[] = [];
      for (const soundId of unit.phonicsFocus) {
        const group = PHONICS_GROUPS.find((pg) => pg.sounds.some((ps) => ps.id === soundId));
        if (group?.blendableWords) {
          for (const w of group.blendableWords.slice(0, 4)) {
            if (!words.some(existing => existing.english === w)) {
              words.push({ english: w, turkish: w, emoji: '' });
            }
          }
        }
      }
      return words;
    }
    return [];
  }, [lesson, vocabulary, worldId]);

  const ageGroup = getAgeGroupFromSettings(userProfile?.settings as Record<string, unknown> | null | undefined);
  const ageConfig = getAgeGroupConfig(ageGroup);

  const ageFilteredLesson = useMemo(() => {
    if (!lesson) return null;
    if (!ageGroup) return lesson;
    const filteredActivities = lesson.activities.filter((a) => isActivityAllowedForAge(a.type, ageGroup));
    return {
      ...lesson,
      activities: filteredActivities.length > 0 ? filteredActivities : lesson.activities,
    };
  }, [lesson, ageGroup]);

  const ageFilteredWords = useMemo(
    () => activityWords.slice(0, ageConfig.maxWordsPerGame),
    [activityWords, ageConfig.maxWordsPerGame],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [activityScores, setActivityScores] = useState<{ score: number; total: number }[]>([]);
  const [hearts, setHearts] = useState(INITIAL_HEARTS);
  const [gameOver, setGameOver] = useState(false);
  const [heartLostIndex, setHeartLostIndex] = useState<number | null>(null);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPerfect, setShowPerfect] = useState(false);
  const [xpPopAmount, setXpPopAmount] = useState<number | null>(null);

  const totalActivities = ageFilteredLesson?.activities.length || 0;
  const progressPct = completed
    ? 100
    : totalActivities > 0
      ? Math.round((currentIndex / totalActivities) * 100)
      : 0;
  const currentActivity = ageFilteredLesson?.activities[currentIndex];

  // Lock body scroll while lesson is active
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleActivityComplete = useCallback((score: number, total: number) => {
    setActivityScores((prev) => [...prev, { score, total }]);

    const activityXp = currentActivity?.xpReward || 10;
    const scoreRatio = total > 0 ? score / total : 1;
    const earnedXp = Math.round(activityXp * scoreRatio);
    if (earnedXp > 0) {
      addXP(earnedXp, 'activity_completed', { lessonId, worldId, activityId: currentActivity?.id }).catch(() => {});
    }

    const pct = total > 0 ? Math.round((score / total) * 100) : 100;
    if (pct >= 80) {
      setShowStarBurst(true);
      SFX.correct();
      setTimeout(() => setShowStarBurst(false), 1500);
    }
    if (pct === 100) {
      setShowConfetti(true);
      setShowPerfect(true);
      SFX.celebration();
      setTimeout(() => { setShowConfetti(false); setShowPerfect(false); }, 3200);
      const perfectBonus = Math.round(earnedXp * 0.2);
      if (perfectBonus > 0) {
        addXP(perfectBonus, 'perfect_score', { lessonId, worldId, activityId: currentActivity?.id }).catch(() => {});
      }
    }
    if (earnedXp > 0) {
      setXpPopAmount(earnedXp);
      setTimeout(() => setXpPopAmount(null), 1800);
    }

    const wasCorrect = total > 0 ? score / total >= 0.5 : true;
    for (const w of ageFilteredWords) {
      updateWordProgress(w.english, wasCorrect);
    }

    try {
      const soundId = currentUnit?.phonicsFocus[0] ?? lessonId;
      recordActivity({
        soundId,
        activityType: currentActivity?.type ?? 'unknown',
        correct: wasCorrect,
        responseTimeMs: Date.now() - activityStartTimeRef.current,
        totalQuestions: total,
        correctAnswers: score,
      });
      setDifficultyMultiplier(getDifficultyMultiplier());
    } catch { /* adaptive engine is non-critical */ }
    activityStartTimeRef.current = Date.now();

    setTimeout(() => {
      if (!lesson) return;
      setDirection(1);
      if (currentIndex < totalActivities - 1) {
        setCurrentIndex((prev) => prev + 1);
        if (currentUnit) {
          saveUnitProgress(currentUnit.id, currentIndex + 1);
        }
      } else {
        if (lessonCompletedRef.current) return; // guard: skip/complete already fired
        lessonCompletedRef.current = true;
        setCompleted(true);
        const totalXP = lesson.xpReward || 30;
        const heartBonus = hearts * HEART_BONUS_XP;
        addXP(totalXP + heartBonus, 'lesson_completed', { lessonId, worldId }).catch(() => {});
        trackActivity('lesson_completed_timed').catch(() => {});
        analytics.lessonComplete(lessonId, 0, totalXP);

        try {
          const totalScore = [...activityScores, { score, total }].reduce((a, s) => a + s.score, 0);
          const totalPossible = [...activityScores, { score, total }].reduce((a, s) => a + s.total, 0);
          const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
          completeLesson(userId, lessonId, worldId, totalXP, accuracy);
          if (currentUnit) completeUnit(currentUnit.id);
          incrementTodayCompletedLessonCount();
          if (currentUnit) {
            saveUnitProgress(currentUnit.id, totalActivities);
          }
          logActivity({
            type: 'game',
            title: lesson.title || `Lesson: ${lessonId}`,
            duration: Math.round(totalActivities * 60),
            accuracy,
            xpEarned: totalXP,
          }, user?.uid);
          syncStudentProgress(totalXP);
        } catch {
          // localStorage might be unavailable
        }
      }
    }, 1500);
  }, [currentIndex, totalActivities, ageFilteredLesson, addXP, trackActivity, lessonId, worldId, currentActivity, activityScores, userId, ageFilteredWords, user?.uid, hearts, currentUnit]);

  const handleXpEarned = useCallback((xp: number) => {
    addXP(xp, 'activity_completed', { lessonId, worldId }).catch(() => {});
  }, [addXP, lessonId, worldId]);

  const handleWrongAnswer = useCallback(() => {
    SFX.wrong();
    setHearts((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
      }
      return Math.max(0, next);
    });
    setHeartLostIndex(Date.now());
    setTimeout(() => setHeartLostIndex(null), 600);
  }, []);

  const handleSkip = useCallback(() => {
    if (!lesson) return;
    setDirection(1);
    if (currentIndex < totalActivities - 1) {
      setCurrentIndex((prev) => prev + 1);
      if (currentUnit) {
        saveUnitProgress(currentUnit.id, currentIndex + 1);
      }
    } else {
      if (lessonCompletedRef.current) return; // guard: activity completion already fired
      lessonCompletedRef.current = true;
      setCompleted(true);
      const totalXP = lesson.xpReward || 30;
      const skipHeartBonus = hearts * HEART_BONUS_XP;
      addXP(totalXP + skipHeartBonus, 'lesson_completed', { lessonId, worldId }).catch(() => {});
      trackActivity('lesson_completed_timed').catch(() => {});

      try {
        const totalScore = activityScores.reduce((a, s) => a + s.score, 0);
        const totalPossible = activityScores.reduce((a, s) => a + s.total, 0);
        const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
        completeLesson(userId, lessonId, worldId, totalXP, accuracy);
        if (currentUnit) completeUnit(currentUnit.id);
        incrementTodayCompletedLessonCount();
        if (currentUnit) {
          saveUnitProgress(currentUnit.id, totalActivities);
        }
        logActivity({
          type: 'game',
          title: lesson.title || `Lesson: ${lessonId}`,
          duration: Math.round(totalActivities * 60),
          accuracy,
          xpEarned: totalXP + skipHeartBonus,
        }, user?.uid);
        void syncStudentProgress(totalXP);
      } catch {
        // localStorage might be unavailable
      }
    }
  }, [currentIndex, totalActivities, lesson, addXP, trackActivity, lessonId, worldId, activityScores, userId, user?.uid, currentUnit]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setActivityScores((prev) => prev.slice(0, currentIndex - 1));
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    lessonCompletedRef.current = false;
    setCurrentIndex(0);
    setDirection(-1);
    setCompleted(false);
    setActivityScores([]);
    setHearts(INITIAL_HEARTS);
    setGameOver(false);
    setHeartLostIndex(null);
  }, []);

  // ── Free tier daily lesson limit gate ────────────────────────────────────
  if (!isPremium() && maxLessonsPerDay !== Infinity && getTodayCompletedLessonCount() >= maxLessonsPerDay) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: 'calc(100dvh - 64px)', background: '#FFF8F2' }}
      >
        <Paywall feature={lang === 'tr' ? 'Sınırsız Ders' : 'Unlimited Lessons'} />
        <button
          type="button"
          className="mt-4 px-6 py-2 rounded-full border border-[#E2E8F0] bg-transparent text-[#64748B] text-sm font-['Nunito',sans-serif] font-semibold cursor-pointer hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
          onClick={() => navigate(-1)}
        >
          {lang === 'tr' ? 'Geri Dön' : 'Go Back'}
        </button>
      </div>
    );
  }

  // Not found
  if (!lesson) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 p-6"
        style={{ height: 'calc(100dvh - 64px)', background: '#FFF8F2' }}
      >
        <h2 className="text-xl font-['Nunito',sans-serif] font-black text-[#1E293B]">{t('lesson.notFound')}</h2>
        <p className="text-sm text-[#64748B] font-['Inter',sans-serif] text-center">
          {t('lesson.notFoundDesc')} &quot;{lessonId}&quot; {t('lesson.inWorld')} &quot;{worldId}&quot;.
        </p>
        <Link to={`/worlds/${worldId}`}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>{t('lesson.backToWorld')}</Button>
        </Link>
      </div>
    );
  }

  // ========== GAME OVER (out of hearts) ==========
  if (gameOver) {
    return (
      <div
        className="flex items-center justify-center px-4"
        style={{ height: 'calc(100dvh - 64px)', background: '#FFF8F2' }}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-5"
          variants={celebrationVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex gap-3">
            {Array.from({ length: INITIAL_HEARTS }).map((_, i) => (
              <Heart key={i} size={48} className="text-[#CBD5E1]" />
            ))}
          </div>
          <h1 className="text-2xl font-['Nunito',sans-serif] font-black text-[#1E293B]">{t('lesson.outOfHearts')}</h1>
          <p className="text-base font-['Inter',sans-serif] text-[#64748B] text-center">{t('lesson.dontWorry')}</p>

          <div className="flex items-center gap-3 bg-[#FFF8F2] rounded-2xl p-4 w-full">
            <LottieCharacter state="thinking" size={48} />
            <p className="text-sm font-['Inter',sans-serif] text-[#475569]">{t('lesson.youCanDoIt')}</p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button variant="primary" size="lg" icon={<RotateCcw size={18} />} onClick={handleRestart}>
              {t('lesson.tryAgain')}
            </Button>
            <Button variant="ghost" size="lg" icon={<ArrowLeft size={18} />} onClick={() => navigate(`/worlds/${worldId}`)}>
              {t('lesson.goBack')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== COMPLETION SCREEN ==========
  if (completed) {
    const totalScore = activityScores.reduce((a, s) => a + s.score, 0);
    const totalPossible = activityScores.reduce((a, s) => a + s.total, 0);
    const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
    const heartBonusXp = hearts * HEART_BONUS_XP;
    const starsEarned = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

    return (
      <div
        className="flex items-center justify-center px-4 overflow-hidden"
        style={{ height: 'calc(100dvh - 64px)', background: '#FFF8F2' }}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-5 overflow-y-auto max-h-full"
          variants={celebrationVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trophy */}
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)' }}
          >
            <Trophy size={40} color="white" />
          </motion.div>

          <h1 className="text-3xl font-['Nunito',sans-serif] font-black text-[#1E293B]">{t('lesson.complete')}</h1>
          <p className="text-sm font-['Inter',sans-serif] text-[#64748B] text-center">
            {t('lesson.greatJob')} &quot;{lang === 'tr' ? lesson.titleTr : lesson.title}&quot;
          </p>

          {/* Stars */}
          <div className="flex gap-2" aria-label={`${starsEarned} out of 3 stars`}>
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: s * 0.15, type: 'spring', stiffness: 300 }}
              >
                <Star
                  size={36}
                  fill={s <= starsEarned ? '#F59E0B' : 'none'}
                  color={s <= starsEarned ? '#F59E0B' : '#CBD5E1'}
                  style={s <= starsEarned ? { filter: 'drop-shadow(0 2px 6px rgba(245,158,11,0.4))' } : { opacity: 0.4 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Hearts remaining */}
          <div className="flex items-center gap-3 bg-[#FFF8F2] rounded-2xl px-5 py-3 w-full justify-center">
            <div className="flex gap-1">
              {Array.from({ length: INITIAL_HEARTS }).map((_, i) => (
                <Heart
                  key={i}
                  size={24}
                  fill={i < hearts ? '#EF4444' : 'none'}
                  color={i < hearts ? '#EF4444' : '#CBD5E1'}
                />
              ))}
            </div>
            {hearts > 0 && (
              <span className="text-sm font-['Nunito',sans-serif] font-bold text-[#0D5C4D]">
                +{heartBonusXp} Bonus XP
              </span>
            )}
          </div>

          {/* XP */}
          <div className="flex items-center gap-2 bg-[#FF6B35] text-white rounded-2xl px-6 py-3">
            <Zap size={20} />
            <span className="text-xl font-['Nunito',sans-serif] font-black">
              +{(lesson.xpReward || 0) + heartBonusXp} XP
            </span>
          </div>

          {totalPossible > 0 && (
            <p className="text-sm font-['Inter',sans-serif] text-[#64748B]">
              {t('lesson.accuracy')}: {accuracy}% ({totalScore}/{totalPossible})
            </p>
          )}

          <div className="flex flex-col gap-3 w-full pt-2">
            <Button variant="primary" size="lg" icon={<Home size={18} />} onClick={() => navigate(`/worlds/${worldId}`)}>
              {t('lesson.backTo')} {lang === 'tr' ? (world?.nameTr || 'Dünya') : (world?.name || 'World')}
            </Button>
            <Button variant="ghost" size="lg" icon={<RotateCcw size={18} />} onClick={handleRestart}>
              {t('lesson.playAgain')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== NO ACTIVITIES GUARD ==========
  if (totalActivities === 0 || !currentActivity) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 p-6"
        style={{ height: 'calc(100dvh - 64px)', background: '#FFF8F2' }}
      >
        <h2 className="text-xl font-['Nunito',sans-serif] font-black text-[#1E293B]">
          {t('lesson.noActivities') || 'No activities in this lesson'}
        </h2>
        <p className="text-sm text-[#64748B] font-['Inter',sans-serif] text-center">
          {t('lesson.noActivitiesDesc') || 'This lesson has no activities to play.'}
        </p>
        <Link to={`/worlds/${worldId}`}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>{t('lesson.backToWorld')}</Button>
        </Link>
      </div>
    );
  }

  // ========== ACTIVE LESSON ==========
  const ActivityIcon = ACTIVITY_ICONS[currentActivity.type] || Gamepad2;
  const activityColor = ACTIVITY_COLORS[currentActivity.type] || 'var(--accent-emerald)';
  const encouragementKey = getEncouragementKey(currentIndex);
  const isSupported = SUPPORTED_GAME_TYPES.has(currentActivity.type);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: 'calc(100dvh - 64px)', background: '#FFF8F2' }}
      role="main"
      aria-label="Lesson player"
    >
      {/* Celebration overlays */}
      {showStarBurst && <StarBurst />}
      {showConfetti && <ConfettiRain />}
      {showPerfect && <PerfectBadge />}
      {xpPopAmount !== null && <XPPop amount={xpPopAmount} />}

      {/* ── Top Bar (h-14) ── */}
      <div className="h-14 flex items-center gap-3 px-4 bg-white border-b border-[#F1F5F9] flex-shrink-0">
        {/* Exit button */}
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#475569] hover:bg-[#F1F5F9] transition-colors flex-shrink-0"
          onClick={() => navigate(`/worlds/${worldId}`)}
          aria-label="Exit lesson"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Animated progress bar (center) */}
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#FF6B35]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-['Inter',sans-serif] text-[#94A3B8] text-center">
            {currentIndex + 1} / {totalActivities}
          </span>
        </div>

        {/* Hearts */}
        <div
          className={`flex items-center gap-1 flex-shrink-0 ${heartLostIndex !== null ? 'animate-bounce' : ''}`}
          aria-label={`${hearts} hearts remaining`}
        >
          {Array.from({ length: INITIAL_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              size={18}
              fill={i < hearts ? '#EF4444' : 'none'}
              color={i < hearts ? '#EF4444' : '#CBD5E1'}
            />
          ))}
        </div>

        {/* Skip */}
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569] transition-colors flex-shrink-0"
          onClick={handleSkip}
          aria-label="Skip activity"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* ── Question / Activity Area (flex-1) ── */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 py-4">
        {/* Breadcrumb */}
        {currentIndex === 0 && (
          <div className="text-xs font-['Inter',sans-serif] text-[#94A3B8] mb-3 text-center">
            {world && <span>{lang === 'tr' ? world.nameTr : world.name} &bull; </span>}
            {'objective' in lesson ? (lesson as { objective: string }).objective : (lang === 'tr' ? lesson.titleTr : lesson.title)}
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentActivity.id}
            className="flex-1 flex flex-col"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Activity header card */}
            <div
              className="flex items-center gap-3 bg-white rounded-2xl p-4 mb-4 shadow-sm border border-[#F1F5F9]"
              style={{ borderLeftWidth: 4, borderLeftColor: activityColor }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: activityColor }}
              >
                <ActivityIcon size={24} color="white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-['Nunito',sans-serif] font-black text-[#1E293B] leading-tight truncate">
                  {lang === 'tr' && 'titleTr' in currentActivity && (currentActivity as Activity & { titleTr?: string }).titleTr
                    ? (currentActivity as Activity & { titleTr: string }).titleTr
                    : currentActivity.title}
                </h2>
                <span className="text-xs font-['Inter',sans-serif] text-[#94A3B8] capitalize">
                  {currentActivity.type.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            {/* Game content card */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#F1F5F9] p-4 overflow-y-auto">
              {isSupported ? (
                <GameSelector
                  type={currentActivity.type}
                  words={ageFilteredWords}
                  onComplete={handleActivityComplete}
                  onXpEarned={handleXpEarned}
                  onWrongAnswer={handleWrongAnswer}
                  extra={buildExtraProps(currentActivity.type, currentUnit)}
                  difficultyMultiplier={difficultyMultiplier}
                />
              ) : (
                <FallbackActivity
                  activity={currentActivity}
                  words={ageFilteredWords}
                  onComplete={handleActivityComplete}
                  t={t}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mimi Encouragement */}
        <div className="flex items-center gap-2 mt-3" aria-live="polite">
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <p className="text-xs font-['Inter',sans-serif] text-[#94A3B8]">{t(encouragementKey)}</p>
        </div>
      </div>

      {/* ── Bottom Nav (h-20) ── */}
      <div className="h-20 flex items-center gap-3 px-4 bg-white border-t border-[#F1F5F9] flex-shrink-0">
        {currentIndex > 0 && (
          <Button variant="ghost" size="lg" icon={<ArrowLeft size={16} />} onClick={handleBack}>
            {t('lesson.back')}
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="primary" size="lg" icon={<ChevronRight size={18} />} onClick={handleSkip}>
          {currentIndex < totalActivities - 1 ? t('lesson.next') : t('lesson.finish')}
        </Button>
      </div>
    </div>
  );
};

export default LessonPlayer;
