/**
 * LESSON PLAYER — Lesson Play Page
 * Mobile-first, light mode only, all Tailwind inline. All business logic preserved.
 */
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, SkipForward, Trophy, Star, Music, Gamepad2, BookOpen, Layers, Mic, HelpCircle, Home, RotateCcw, Volume2, Eye, EyeOff, Heart } from 'lucide-react';
import { Button, ProgressBar, Card, StarBurst, ConfettiRain, PerfectBadge, XPPop } from '../components/ui';
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

// ── Daily lesson counter helpers ──────────────────────────────────────────────

function getDailyLessonDateKey(): string {
  const d = new Date();
  return `mm_daily_lessons_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTodayCompletedLessonCount(): number {
  try { return parseInt(localStorage.getItem(getDailyLessonDateKey()) || '0', 10); } catch { return 0; }
}

export function incrementTodayCompletedLessonCount(): void {
  try { localStorage.setItem(getDailyLessonDateKey(), String(getTodayCompletedLessonCount() + 1)); } catch { /* */ }
}

const INITIAL_HEARTS = 3;
const HEART_BONUS_XP = 10;

const ACTIVITY_ICONS: Record<string, typeof Music> = {
  'word-match': Gamepad2, 'phonics-builder': Music, 'sentence-scramble': Layers, 'listening-challenge': Mic,
  'spelling-bee': BookOpen, 'quick-quiz': HelpCircle, 'story-choices': BookOpen,
  song: Music, game: Gamepad2, flashcard: Layers, story: BookOpen, practice: Mic, quiz: HelpCircle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  'word-match': '#10B981', 'phonics-builder': '#3B82F6', 'sentence-scramble': '#F59E0B', 'listening-challenge': '#EC4899',
  'spelling-bee': '#7C3AED', 'quick-quiz': '#EF4444', 'story-choices': '#3B82F6',
  song: '#3B82F6', game: '#10B981', flashcard: '#F59E0B', story: '#7C3AED', practice: '#EC4899', quiz: '#EF4444',
};

function getUnitById(unitId: string): LearningUnit | null {
  for (const phase of getAllPhases()) { const unit = phase.units.find((u) => u.id === unitId); if (unit) return unit; }
  return null;
}

function unitActivityToActivity(ua: UnitActivity, index: number): Activity & { titleTr?: string } {
  return { id: `activity-${index}`, title: ua.title, titleTr: ua.titleTr, type: ua.type as Activity['type'], instructions: ua.description, xpReward: ua.xp, duration: ua.duration };
}

function buildExtraProps(activityType: string, unit: LearningUnit | null): Record<string, unknown> | undefined {
  if (!unit) return undefined;
  switch (activityType) {
    case 'sound-intro': {
      const soundId = unit.phonicsFocus[0]; if (!soundId) return undefined;
      for (const group of PHONICS_GROUPS) { const found = group.sounds.find((s) => s.id === soundId); if (found) return { sound: { id: found.id, grapheme: found.grapheme, example: found.keywords[0] || found.sound, emoji: found.mnemonicEmoji, action: found.action, turkishNote: found.turkishNote, keywords: found.keywords.slice(0, 3).map((w) => ({ word: w, emoji: '' })), group: found.group } }; }
      return undefined;
    }
    case 'tpr': return { commands: unit.tprCommands.length > 0 ? unit.tprCommands : ['Stand up!', 'Sit down!', 'Clap!'] };
    case 'reading': return { text: unit.decodableText || 'No text available.', highlightSounds: unit.phonicsFocus.map((id) => id.replace(/^g\d+_/, '')) };
    default: return undefined;
  }
}

function saveUnitProgress(unitId: string, activitiesCompleted: number): void {
  try { localStorage.setItem(`mimi_unit_progress_${unitId}`, JSON.stringify({ activitiesCompleted, updatedAt: new Date().toISOString() })); } catch { /* */ }
}

const SUPPORTED_GAME_TYPES = new Set(['word-match', 'spelling-bee', 'quick-quiz', 'sentence-scramble', 'listening-challenge', 'listening', 'phonics-builder', 'story-choices', 'blending', 'segmenting', 'pronunciation', 'sound-intro', 'tpr', 'reading']);

const ENCOURAGEMENT_KEYS = ['lesson.encouragement1', 'lesson.encouragement2', 'lesson.encouragement3', 'lesson.encouragement4', 'lesson.encouragement5', 'lesson.encouragement6'];

// ── Fallback Activity ─────────────────────────────────────────────────────────

function FallbackActivity({ activity, words, onComplete, t }: { activity: Activity; words: { english: string; turkish: string; emoji: string; phonetic?: string; exampleSentence?: string }[]; onComplete: (score: number, total: number) => void; t: (key: string) => string }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const word = words[currentCard];

  const speakWord = () => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(word.english); u.lang = 'en-US'; u.rate = 0.8; speechSynthesis.speak(u); } };

  if (!word) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-sm text-gray-600">{activity.instructions || t('lesson.noWordsToReview')}</p>
        <button type="button" onClick={() => onComplete(1, 1)} className="min-h-[48px] px-6 rounded-3xl bg-orange-500 text-white font-bold">{t('lesson.doneNext')}</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-gray-500">{activity.instructions}</p>
      <p className="text-xs text-gray-400">{t('lesson.card')} {currentCard + 1} {t('lesson.of')} {words.length}</p>
      <div onClick={() => setFlipped((f) => !f)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }} role="button" tabIndex={0}
        className="w-full rounded-3xl bg-white shadow-lg p-8 flex flex-col items-center gap-2 cursor-pointer min-h-[180px]">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">{word.english.charAt(0).toUpperCase()}</div>
        <span className="text-2xl font-extrabold text-gray-900">{word.english}</span>
        {flipped ? (
          <>
            <span className="text-base text-emerald-600 font-bold">{word.turkish}</span>
            {word.phonetic && <span className="text-xs text-gray-400">{word.phonetic}</span>}
            {word.exampleSentence && <span className="text-xs text-gray-500 italic">&ldquo;{word.exampleSentence}&rdquo;</span>}
          </>
        ) : (<span className="text-xs text-gray-400">{t('lesson.tapToReveal')}</span>)}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={(e) => { e.stopPropagation(); setFlipped((f) => !f); }} className="min-h-[48px] px-4 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-1">
          {flipped ? <EyeOff size={16} /> : <Eye size={16} />}{flipped ? t('lesson.hide') : t('lesson.reveal')}
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); speakWord(); }} className="min-h-[48px] px-4 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-1"><Volume2 size={16} />{t('lesson.listen')}</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); setFlipped(false); const nr = reviewedCount + 1; setReviewedCount(nr); if (currentCard < words.length - 1) setCurrentCard((c) => c + 1); else onComplete(words.length, words.length); }}
          className="min-h-[48px] px-4 rounded-3xl bg-orange-500 text-white font-bold text-sm flex items-center gap-1">
          {currentCard < words.length - 1 ? t('lesson.next') : t('lesson.done')}<ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

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

  const activityStartTimeRef = useRef<number>(Date.now());
  const [difficultyMultiplier, setDifficultyMultiplier] = useState<number>(1.0);

  useEffect(() => { if (user?.uid) { setActiveUser(user.uid); startSession(); } }, [user?.uid]);
  useEffect(() => { if (lessonId && worldId) analytics.lessonStarted(lessonId, worldId); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { return () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }; }, []);

  const oldLesson = useMemo(() => getLessonById(worldId, lessonId), [worldId, lessonId]);
  const lesson = useMemo(() => {
    if (oldLesson) return oldLesson;
    const unit = getUnitById(worldId);
    if (unit) return { id: unit.id, title: unit.title, titleTr: unit.titleTr, number: unit.number, type: 'vocabulary' as const, xpReward: unit.activities.reduce((sum, a) => sum + a.xp, 0), duration: unit.activities.reduce((sum, a) => sum + a.duration, 0), targetWords: [] as string[], activities: unit.activities.map((ua, i) => unitActivityToActivity(ua, i)) };
    return null;
  }, [worldId, lessonId, oldLesson]);
  const world = useMemo(() => getWorldById(worldId), [worldId]);
  const vocabulary = useMemo(() => getWorldVocabulary(worldId), [worldId]);
  const currentUnit = useMemo(() => getUnitById(worldId), [worldId]);

  const activityWords = useMemo(() => {
    if (!lesson) return [];
    const fromVocab = lesson.targetWords.map((tw) => vocabulary.find((v) => v.english === tw)).filter((w): w is VocabularyWord => Boolean(w)).map((w) => ({ english: w.english, turkish: w.turkish, emoji: w.emoji, phonetic: w.phonetic, exampleSentence: w.exampleSentence }));
    if (fromVocab.length > 0) return fromVocab;
    const unit = getUnitById(worldId);
    if (unit) { const words: { english: string; turkish: string; emoji: string }[] = []; for (const soundId of unit.phonicsFocus) { const group = PHONICS_GROUPS.find((pg) => pg.sounds.some((ps) => ps.id === soundId)); if (group?.blendableWords) for (const w of group.blendableWords.slice(0, 4)) if (!words.some(e => e.english === w)) words.push({ english: w, turkish: w, emoji: '' }); } return words; }
    return [];
  }, [lesson, vocabulary, worldId]);

  const ageGroup = getAgeGroupFromSettings(userProfile?.settings as Record<string, unknown> | null | undefined);
  const ageConfig = getAgeGroupConfig(ageGroup);
  const ageFilteredLesson = useMemo(() => { if (!lesson) return null; if (!ageGroup) return lesson; const fa = lesson.activities.filter((a) => isActivityAllowedForAge(a.type, ageGroup)); return { ...lesson, activities: fa.length > 0 ? fa : lesson.activities }; }, [lesson, ageGroup]);
  const ageFilteredWords = useMemo(() => activityWords.slice(0, ageConfig.maxWordsPerGame), [activityWords, ageConfig.maxWordsPerGame]);

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
  const progressPct = completed ? 100 : totalActivities > 0 ? Math.round((currentIndex / totalActivities) * 100) : 0;
  const currentActivity = ageFilteredLesson?.activities[currentIndex];

  useEffect(() => { const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = prev; }; }, []);

  const handleActivityComplete = useCallback((score: number, total: number) => {
    setActivityScores((prev) => [...prev, { score, total }]);
    const activityXp = currentActivity?.xpReward || 10;
    const scoreRatio = total > 0 ? score / total : 1;
    const earnedXp = Math.round(activityXp * scoreRatio);
    if (earnedXp > 0) addXP(earnedXp, 'activity_completed', { lessonId, worldId, activityId: currentActivity?.id }).catch(() => {});
    const pct = total > 0 ? Math.round((score / total) * 100) : 100;
    if (pct >= 80) { setShowStarBurst(true); SFX.correct(); setTimeout(() => setShowStarBurst(false), 1500); }
    if (pct === 100) { setShowConfetti(true); setShowPerfect(true); SFX.celebration(); setTimeout(() => { setShowConfetti(false); setShowPerfect(false); }, 3200); const pb = Math.round(earnedXp * 0.2); if (pb > 0) addXP(pb, 'perfect_score', { lessonId, worldId, activityId: currentActivity?.id }).catch(() => {}); }
    if (earnedXp > 0) { setXpPopAmount(earnedXp); setTimeout(() => setXpPopAmount(null), 1800); }
    const wasCorrect = total > 0 ? score / total >= 0.5 : true;
    for (const w of ageFilteredWords) updateWordProgress(w.english, wasCorrect);
    try { recordActivity({ soundId: currentUnit?.phonicsFocus[0] ?? lessonId, activityType: currentActivity?.type ?? 'unknown', correct: wasCorrect, responseTimeMs: Date.now() - activityStartTimeRef.current, totalQuestions: total, correctAnswers: score }); setDifficultyMultiplier(getDifficultyMultiplier()); } catch { /* */ }
    activityStartTimeRef.current = Date.now();
    setTimeout(() => {
      if (!lesson) return; setDirection(1);
      if (currentIndex < totalActivities - 1) { setCurrentIndex((prev) => prev + 1); if (currentUnit) saveUnitProgress(currentUnit.id, currentIndex + 1); }
      else {
        setCompleted(true);
        const totalXP = lesson.xpReward || 30; const hb = hearts * HEART_BONUS_XP;
        addXP(totalXP + hb, 'lesson_completed', { lessonId, worldId }).catch(() => {}); trackActivity('lesson_completed_timed').catch(() => {}); analytics.lessonComplete(lessonId, 0, totalXP);
        try { const ts = [...activityScores, { score, total }].reduce((a, s) => a + s.score, 0); const tp = [...activityScores, { score, total }].reduce((a, s) => a + s.total, 0); const acc = tp > 0 ? Math.round((ts / tp) * 100) : 100; completeLesson(userId, lessonId, worldId, totalXP, acc); if (currentUnit) completeUnit(currentUnit.id); incrementTodayCompletedLessonCount(); if (currentUnit) saveUnitProgress(currentUnit.id, totalActivities); logActivity({ type: 'game', title: lesson.title || `Lesson: ${lessonId}`, duration: Math.round(totalActivities * 60), accuracy: acc, xpEarned: totalXP }, user?.uid); syncStudentProgress(totalXP); } catch { /* */ }
      }
    }, 1500);
  }, [currentIndex, totalActivities, ageFilteredLesson, addXP, trackActivity, lessonId, worldId, currentActivity, activityScores, userId, ageFilteredWords, user?.uid, hearts, currentUnit]);

  const handleXpEarned = useCallback((xp: number) => { addXP(xp, 'activity_completed', { lessonId, worldId }).catch(() => {}); }, [addXP, lessonId, worldId]);
  const handleWrongAnswer = useCallback(() => { SFX.wrong(); setHearts((prev) => { const next = prev - 1; if (next <= 0) setGameOver(true); return Math.max(0, next); }); setHeartLostIndex(Date.now()); setTimeout(() => setHeartLostIndex(null), 600); }, []);

  const handleSkip = useCallback(() => {
    if (!lesson) return; setDirection(1);
    if (currentIndex < totalActivities - 1) { setCurrentIndex((prev) => prev + 1); if (currentUnit) saveUnitProgress(currentUnit.id, currentIndex + 1); }
    else {
      setCompleted(true);
      const totalXP = lesson.xpReward || 30; const hb = hearts * HEART_BONUS_XP;
      addXP(totalXP + hb, 'lesson_completed', { lessonId, worldId }).catch(() => {}); trackActivity('lesson_completed_timed').catch(() => {});
      try { const ts = activityScores.reduce((a, s) => a + s.score, 0); const tp = activityScores.reduce((a, s) => a + s.total, 0); const acc = tp > 0 ? Math.round((ts / tp) * 100) : 100; completeLesson(userId, lessonId, worldId, totalXP, acc); if (currentUnit) completeUnit(currentUnit.id); incrementTodayCompletedLessonCount(); if (currentUnit) saveUnitProgress(currentUnit.id, totalActivities); logActivity({ type: 'game', title: lesson.title || `Lesson: ${lessonId}`, duration: Math.round(totalActivities * 60), accuracy: acc, xpEarned: totalXP + hb }, user?.uid); void syncStudentProgress(totalXP); } catch { /* */ }
    }
  }, [currentIndex, totalActivities, lesson, addXP, trackActivity, lessonId, worldId, activityScores, userId, user?.uid, currentUnit]);

  const handleBack = useCallback(() => { if (currentIndex > 0) { setDirection(-1); setActivityScores((prev) => prev.slice(0, currentIndex - 1)); setCurrentIndex((prev) => prev - 1); } }, [currentIndex]);
  const handleRestart = useCallback(() => { setCurrentIndex(0); setDirection(-1); setCompleted(false); setActivityScores([]); setHearts(INITIAL_HEARTS); setGameOver(false); setHeartLostIndex(null); }, []);

  // Free tier gate
  if (!isPremium() && maxLessonsPerDay !== Infinity && getTodayCompletedLessonCount() >= maxLessonsPerDay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Paywall feature={lang === 'tr' ? 'Sinirsiz Ders' : 'Unlimited Lessons'} />
        <button type="button" onClick={() => navigate(-1)} className="mt-4 min-h-[48px] px-6 rounded-3xl border border-gray-200 text-gray-500 text-sm font-bold">{lang === 'tr' ? 'Geri Don' : 'Go Back'}</button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900">{t('lesson.notFound')}</h2>
        <p className="text-sm text-gray-500">{t('lesson.notFoundDesc')} &quot;{lessonId}&quot; {t('lesson.inWorld')} &quot;{worldId}&quot;.</p>
        <Link to={`/worlds/${worldId}`}><Button variant="secondary" icon={<ArrowLeft size={16} />}>{t('lesson.backToWorld')}</Button></Link>
      </div>
    );
  }

  // Game Over
  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4 max-w-xs">
          <Heart size={48} className="text-gray-300" />
          <h1 className="text-2xl font-extrabold text-gray-900">{t('lesson.outOfHearts')}</h1>
          <p className="text-sm text-gray-500 text-center">{t('lesson.dontWorry')}</p>
          <LottieCharacter state="thinking" size={48} />
          <button type="button" onClick={handleRestart} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95"><RotateCcw size={18} />{t('lesson.tryAgain')}</button>
          <button type="button" onClick={() => navigate(`/worlds/${worldId}`)} className="min-h-[48px] px-6 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-2"><ArrowLeft size={16} />{t('lesson.goBack')}</button>
        </motion.div>
      </div>
    );
  }

  // Completed
  if (completed) {
    const totalScore = activityScores.reduce((a, s) => a + s.score, 0);
    const totalPossible = activityScores.reduce((a, s) => a + s.total, 0);
    const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
    const hb = hearts * HEART_BONUS_XP;
    const starCount = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="flex flex-col items-center gap-4 max-w-xs">
          <Trophy size={64} className="text-amber-500" />
          <h1 className="text-2xl font-extrabold text-gray-900">{t('lesson.complete')}</h1>
          <p className="text-sm text-gray-500 text-center">{t('lesson.greatJob')} &quot;{lang === 'tr' ? lesson.titleTr : lesson.title}&quot;</p>
          <div className="flex gap-1">{Array.from({ length: INITIAL_HEARTS }, (_, i) => <Heart key={i} size={24} fill={i < hearts ? '#EF4444' : 'none'} color={i < hearts ? '#EF4444' : '#D1D5DB'} />)}{hearts > 0 && <span className="text-xs text-emerald-600 font-bold ml-1">+{hb} XP</span>}</div>
          <div className="flex gap-1">{[1, 2, 3].map((s) => <Star key={s} size={28} fill={s <= starCount ? '#F59E0B' : 'none'} color={s <= starCount ? '#F59E0B' : '#D1D5DB'} />)}</div>
          {totalPossible > 0 && <p className="text-sm text-gray-500">{t('lesson.accuracy')}: {accuracy}%</p>}
          <span className="text-lg font-extrabold text-amber-600 flex items-center gap-1"><Star size={20} />+{(lesson.xpReward || 0) + hb} XP</span>
          <button type="button" onClick={() => navigate(`/worlds/${worldId}`)} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95 w-full justify-center"><Home size={18} />{t('lesson.backTo')} {lang === 'tr' ? (world?.nameTr || 'Dunya') : (world?.name || 'World')}</button>
          <button type="button" onClick={handleRestart} className="min-h-[48px] px-6 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-2"><RotateCcw size={16} />{t('lesson.playAgain')}</button>
        </motion.div>
      </div>
    );
  }

  if (totalActivities === 0 || !currentActivity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900">{t('lesson.noActivities') || 'No activities'}</h2>
        <Link to={`/worlds/${worldId}`}><Button variant="secondary" icon={<ArrowLeft size={16} />}>{t('lesson.backToWorld')}</Button></Link>
      </div>
    );
  }

  const ActivityIcon = ACTIVITY_ICONS[currentActivity.type] || Gamepad2;
  const activityColor = ACTIVITY_COLORS[currentActivity.type] || '#10B981';
  const isSupported = SUPPORTED_GAME_TYPES.has(currentActivity.type);

  return (
    <div className="min-h-screen bg-white flex flex-col" role="main">
      {showStarBurst && <StarBurst />}
      {showConfetti && <ConfettiRain />}
      {showPerfect && <PerfectBadge />}
      {xpPopAmount !== null && <XPPop amount={xpPopAmount} />}

      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button type="button" onClick={() => navigate(`/worlds/${worldId}`)} aria-label="Exit" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ArrowLeft size={18} className="text-gray-500" /></button>
        <div className="flex-1">
          <span className="text-xs font-bold text-gray-600 block truncate">{lang === 'tr' ? lesson.titleTr : lesson.title}</span>
          <ProgressBar value={progressPct} size="sm" animated />
          <span className="text-[10px] text-gray-400">{currentIndex + 1}/{totalActivities}</span>
        </div>
        <div className={`flex gap-0.5 ${heartLostIndex !== null ? 'animate-[shake_0.3s]' : ''}`}>
          {Array.from({ length: INITIAL_HEARTS }, (_, i) => <Heart key={i} size={18} fill={i < hearts ? '#EF4444' : 'none'} color={i < hearts ? '#EF4444' : '#D1D5DB'} />)}
        </div>
        <button type="button" onClick={handleSkip} aria-label="Skip" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><SkipForward size={14} className="text-gray-400" /></button>
      </div>

      {/* Main Activity */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={currentActivity.id} custom={direction} initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 26 } }} exit={{ x: direction > 0 ? -200 : 200, opacity: 0, transition: { duration: 0.2 } }}>
            {/* Activity Header */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-3xl" style={{ backgroundColor: `${activityColor}10`, borderLeft: `4px solid ${activityColor}` }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: activityColor }}><ActivityIcon size={22} color="#fff" /></div>
              <div>
                <h2 className="text-sm font-extrabold text-gray-900">{lang === 'tr' && 'titleTr' in currentActivity && (currentActivity as Activity & { titleTr?: string }).titleTr ? (currentActivity as Activity & { titleTr: string }).titleTr : currentActivity.title}</h2>
              </div>
            </div>

            {/* Game Content */}
            <Card variant="outlined" padding="xl" className="lesson-activity__content">
              {isSupported ? (
                <GameSelector type={currentActivity.type} words={ageFilteredWords} onComplete={handleActivityComplete} onXpEarned={handleXpEarned} onWrongAnswer={handleWrongAnswer} extra={buildExtraProps(currentActivity.type, currentUnit)} difficultyMultiplier={difficultyMultiplier} />
              ) : (
                <FallbackActivity activity={currentActivity} words={ageFilteredWords} onComplete={handleActivityComplete} t={t} />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Encouragement */}
        <div className="flex items-center gap-2 mt-4 justify-center">
          <Star size={16} className="text-amber-500" fill="#F59E0B" />
          <span className="text-xs text-gray-500">{t(ENCOURAGEMENT_KEYS[currentIndex % ENCOURAGEMENT_KEYS.length])}</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
        {currentIndex > 0 && <button type="button" onClick={handleBack} className="min-h-[48px] px-4 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-1"><ArrowLeft size={16} />{t('lesson.back')}</button>}
        <div className="flex-1" />
        <button type="button" onClick={handleSkip} className="min-h-[48px] px-6 rounded-3xl bg-orange-500 text-white font-bold text-sm flex items-center gap-1 shadow-md active:scale-95">
          {currentIndex < totalActivities - 1 ? t('lesson.next') : t('lesson.finish')}<ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LessonPlayer;
