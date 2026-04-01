/**
 * Games Hub — MinesMinis
 * Kid-friendly, colorful, playful game selection page.
 * Fully Tailwind inline — no CSS file dependency.
 */
import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { useHearts } from '../contexts/HeartsContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  MINI_GAMES,
  getDailyFeaturedGame,
  getDailyPracticeSet,
  getDailyPracticeStreak,
  recordDailyPractice,
  getBestScore,
  saveBestScore,
  isNewGame,
} from '../data/miniGamesData';
import type { GameMeta, GameCategory } from '../data/miniGamesData';
import { getAgeGroupFromSettings, isGameAllowedForAge } from '../services/ageGroupService';
import { kidsWords, getWordsByCategory } from '../data/wordsData';
import { getCurrentPhonicsSound } from '../services/learningPathService';
import { PHONICS_GROUPS } from '../data/phonics';
import { setActiveUser, recordActivity, getOptimalActivity } from '../services/adaptiveEngine';
import { logger } from '../utils/logger';
import { DIALOGUE_EXERCISES } from '../data/dialogueExercises';
import { IMAGE_LABEL_QUESTIONS } from '../data/imageLabelExercises';
import { sayItExercises } from '../data/sayItExercises';
import { phonicsBlendExercises } from '../data/phonicsBlendExercises';
import { phonemeManipulationExercises } from '../data/phonemeManipulationExercises';
import { SYLLABLE_EXERCISES } from '../data/syllableExercises';
import { WORD_FAMILIES } from '../data/wordFamilyExercises';
import { RHYME_EXERCISES } from '../data/rhymeExercises';
import { PHONETIC_TRAPS } from '../data/turkishPhoneticTraps';
import { GameSelector } from '../components/games/index';
import LottieCharacter from '../components/LottieCharacter';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Play,
  Gamepad2,
  Star,
  Flame,
  ChevronRight,
  BookOpen,
  Mic,
  BookMarked,
  Layers,
  Trophy,
  Palette,
  Hash,
  Leaf,
  Users,
  Apple,
  Bird,
  Shuffle,
  Lock,
  Sparkles,
  Link,
  Zap,
  Bug,
  Puzzle,
  Headphones,
  MessageSquare,
  Tag,
  Volume2,
  Music2,
  Grid2x2,
  Triangle,
  AlertTriangle,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type TabCategory = 'all' | GameCategory;

type WordTopic = 'all' | 'Animals' | 'Colors' | 'Food' | 'Family' | 'Body' | 'Numbers' | 'Nature' | 'phonics';

interface DailyPracticeSession {
  games: GameMeta[];
  currentIndex: number;
  scores: number[];
}

// ── Constants ────────────────────────────────────────────────────────────────

const TAB_DEFS: { id: TabCategory; icon: React.ReactNode; label: string; labelTr: string }[] = [
  { id: 'all', icon: <Gamepad2 size={16} />, label: 'All', labelTr: 'Tümü' },
  { id: 'vocabulary', icon: <BookMarked size={16} />, label: 'Vocabulary', labelTr: 'Kelime' },
  { id: 'phonics', icon: <Layers size={16} />, label: 'Phonics', labelTr: 'Fonetik' },
  { id: 'reading', icon: <BookOpen size={16} />, label: 'Reading', labelTr: 'Okuma' },
  { id: 'speaking', icon: <Mic size={16} />, label: 'Speaking', labelTr: 'Konuşma' },
];

const TOPIC_DEFS: { id: WordTopic; icon: React.ReactNode; labelTr: string; label: string }[] = [
  { id: 'all', icon: <Shuffle size={14} />, label: 'Mix', labelTr: 'Karışık' },
  { id: 'phonics', icon: <BookOpen size={14} />, label: 'Phonics', labelTr: 'Fonetik' },
  { id: 'Animals', icon: <Bird size={14} />, label: 'Animals', labelTr: 'Hayvanlar' },
  { id: 'Colors', icon: <Palette size={14} />, label: 'Colors', labelTr: 'Renkler' },
  { id: 'Food', icon: <Apple size={14} />, label: 'Food', labelTr: 'Yiyecekler' },
  { id: 'Family', icon: <Users size={14} />, label: 'Family', labelTr: 'Aile' },
  { id: 'Body', icon: <Hash size={14} />, label: 'Body', labelTr: 'Vücut' },
  { id: 'Numbers', icon: <Hash size={14} />, label: 'Numbers', labelTr: 'Sayılar' },
  { id: 'Nature', icon: <Leaf size={14} />, label: 'Nature', labelTr: 'Doğa' },
];

const GAME_ICONS: Record<string, React.ReactNode> = {
  'word-match': <Link size={28} />,
  'quick-quiz': <Zap size={28} />,
  'sentence-scramble': <Puzzle size={28} />,
  'spelling-bee': <Bug size={28} />,
  'listening-challenge': <Headphones size={28} />,
  'pronunciation': <Mic size={28} />,
  'story-choices': <BookOpen size={28} />,
  'dialogue': <MessageSquare size={28} />,
  'image-label': <Tag size={28} />,
  'say-it': <Volume2 size={28} />,
  'phonics-blend': <Layers size={28} />,
  'phoneme-manipulation': <Music2 size={28} />,
  'syllable': <Grid2x2 size={28} />,
  'word-family': <Users size={28} />,
  'rhyme': <Triangle size={28} />,
  'phonetic-trap': <AlertTriangle size={28} />,
  'sentence-builder': <Puzzle size={28} />,
};

const CATEGORY_COLORS: Record<GameCategory, { bg: string; text: string; border: string }> = {
  vocabulary: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  phonics: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  reading: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  speaking: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

const CATEGORY_LABELS: Record<GameCategory, { en: string; tr: string }> = {
  vocabulary: { en: 'Vocabulary', tr: 'Kelime' },
  phonics: { en: 'Phonics', tr: 'Fonetik' },
  reading: { en: 'Reading', tr: 'Okuma' },
  speaking: { en: 'Speaking', tr: 'Konuşma' },
};

// ── Spring presets ───────────────────────────────────────────────────────────

const springPop = { type: 'spring' as const, stiffness: 400, damping: 25 };
const springBounce = { type: 'spring' as const, stiffness: 300, damping: 20 };

// ── Helpers ──────────────────────────────────────────────────────────────────

function getExtraPropsForGame(gameType: string): Record<string, unknown> | undefined {
  switch (gameType) {
    case 'dialogue': {
      const idx = Math.floor(Math.random() * DIALOGUE_EXERCISES.length);
      return { lines: DIALOGUE_EXERCISES[idx].lines };
    }
    case 'image-label': {
      const shuffled = [...IMAGE_LABEL_QUESTIONS].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 6) };
    }
    case 'say-it': {
      const shuffled = [...sayItExercises].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 6) };
    }
    case 'phonics-blend': {
      const shuffled = [...phonicsBlendExercises].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 6) };
    }
    case 'phoneme-manipulation': {
      const shuffled = [...phonemeManipulationExercises].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 8) };
    }
    case 'syllable': {
      const shuffled = [...SYLLABLE_EXERCISES].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 8) };
    }
    case 'word-family': {
      const shuffled = [...WORD_FAMILIES].sort(() => Math.random() - 0.5);
      return { families: shuffled.slice(0, 5) };
    }
    case 'rhyme': {
      const shuffled = [...RHYME_EXERCISES].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 8) };
    }
    case 'phonetic-trap': {
      const idx = Math.floor(Math.random() * PHONETIC_TRAPS.length);
      return { trap: PHONETIC_TRAPS[idx] };
    }
    default:
      return undefined;
  }
}

function getGameWords(topic: WordTopic = 'all') {
  if (topic === 'phonics' || topic === 'all') {
    const currentSound = getCurrentPhonicsSound();
    if (topic === 'phonics' && currentSound) {
      const group = PHONICS_GROUPS.find((g) => g.group === currentSound.group);
      if (group && group.blendableWords.length >= 4) {
        return group.blendableWords.slice(0, 8).map((w) => {
          const found = kidsWords.find((kw) => kw.word === w);
          return { english: w, turkish: found?.turkish ?? w, emoji: found?.emoji ?? '' };
        });
      }
    }
    if (topic === 'all') {
      const shuffled = [...kidsWords].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 8).map((w) => ({ english: w.word, turkish: w.turkish, emoji: w.emoji }));
    }
  }

  const rawPool = getWordsByCategory(topic);
  const seen = new Set<string>();
  const pool = rawPool.filter((w) => { if (seen.has(w.word)) return false; seen.add(w.word); return true; });
  const sufficient = pool.length >= 4 ? pool : kidsWords;
  const shuffled = [...sufficient].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8).map((w) => ({ english: w.word, turkish: w.turkish, emoji: w.emoji }));
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function GamesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-4 space-y-3">
          <div className="h-12 w-12 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ── Difficulty Stars ─────────────────────────────────────────────────────────

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-0.5" aria-label={`Difficulty: ${level} of 3`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          size={12}
          className={n <= level ? 'text-amber-400' : 'text-gray-200'}
          fill={n <= level ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

// ── Game Card (inline, no CSS file) ──────────────────────────────────────────

function GameCardInline({
  game,
  isLocked,
  bestScore,
  isNew,
  onPlay,
  index,
  isTr,
}: {
  game: GameMeta;
  isLocked: boolean;
  bestScore?: number;
  isNew: boolean;
  onPlay: () => void;
  index: number;
  isTr: boolean;
}) {
  const cat = CATEGORY_COLORS[game.category];
  const catLabel = CATEGORY_LABELS[game.category];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springBounce, delay: index * 0.05 }}
      whileTap={isLocked ? {} : { scale: 0.97 }}
      onClick={isLocked ? undefined : onPlay}
      disabled={isLocked}
      className={`relative w-full text-left rounded-2xl p-4 border transition-shadow
        ${isLocked
          ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md cursor-pointer active:shadow-none'
        }`}
      style={{ minHeight: 130 }}
    >
      {/* New badge */}
      {isNew && !isLocked && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles size={10} />
          {isTr ? 'Yeni' : 'New'}
        </span>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
          isLocked ? 'bg-gray-100 text-gray-300' : 'text-white'
        }`}
        style={!isLocked ? { background: 'linear-gradient(135deg, #FF6B35, #f43f5e)' } : undefined}
      >
        {isLocked ? <Lock size={22} /> : (GAME_ICONS[game.type] ?? <Gamepad2 size={28} />)}
      </div>

      {/* Title */}
      <h3 className={`font-bold text-sm leading-tight mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
        {isTr ? game.nameTr : game.name}
      </h3>

      {/* Category badge */}
      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
        {isTr ? catLabel.tr : catLabel.en}
      </span>

      {/* Stars + Best Score row */}
      <div className="flex items-center justify-between mt-2">
        <DifficultyStars level={game.difficulty} />
        {bestScore !== undefined && !isLocked && (
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
            <Trophy size={10} /> {bestScore}
          </span>
        )}
      </div>

      {/* Locked overlay text */}
      {isLocked && (
        <span className="text-[10px] text-gray-400 font-medium mt-1 flex items-center gap-1">
          <Lock size={10} /> {isTr ? `Seviye ${game.minLevel}` : `Level ${game.minLevel}`}
        </span>
      )}
    </motion.button>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

function Games() {
  usePageTitle('Oyunlar', 'Games');

  const { stats, addXP } = useGamification();
  const { lang } = useLanguage();
  const { user, userProfile } = useAuth();
  const { loseHeart } = useHearts();
  const isTr = lang === 'tr';

  // ── State ────────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [activeTopic, setActiveTopic] = useState<WordTopic>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [playingGame, setPlayingGame] = useState<GameMeta | null>(null);
  const [dailySession, setDailySession] = useState<DailyPracticeSession | null>(null);
  const [gameWords, setGameWords] = useState(() => getGameWords());
  const [gameExtra, setGameExtra] = useState<Record<string, unknown> | undefined>(undefined);
  const [dailyStreak, setDailyStreak] = useState(() => getDailyPracticeStreak());
  const [scoreVersion, setScoreVersion] = useState(0);

  // ── Derived ──────────────────────────────────────────────────────────────

  const ageGroup = getAgeGroupFromSettings(userProfile?.settings as Record<string, unknown> | null | undefined);
  const userLevel = stats?.level ?? 1;
  const featuredGame = getDailyFeaturedGame();

  const isPlayingAny = !!(playingGame ?? (dailySession ? dailySession.games[dailySession.currentIndex] : null));

  // ── Adaptive Engine ──────────────────────────────────────────────────────

  const [_recommendedType, setRecommendedType] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    setActiveUser(user.uid);
    try {
      const optimal = getOptimalActivity();
      setRecommendedType(optimal.activityType);
    } catch { /* no profile yet */ }
  }, [user?.uid]);

  // ── Lock scroll when playing ─────────────────────────────────────────────

  useEffect(() => {
    if (isPlayingAny) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isPlayingAny]);

  // ── Defer skeleton ───────────────────────────────────────────────────────

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoading(false));
    return () => cancelAnimationFrame(id);
  }, []);

  // ── Filtering ────────────────────────────────────────────────────────────

  const isGameLocked = useCallback(
    (game: GameMeta): boolean => userLevel < game.minLevel,
    [userLevel],
  );

  const filteredGames = useMemo<GameMeta[]>(() => {
    const byTab = activeTab === 'all' ? MINI_GAMES : MINI_GAMES.filter((g) => g.category === activeTab);
    return ageGroup !== ''
      ? byTab.filter((g) => isGameAllowedForAge(g.type, ageGroup))
      : byTab;
  }, [activeTab, ageGroup]);

  const unlockedGames = useMemo(() => filteredGames.filter((g) => !isGameLocked(g)), [filteredGames, isGameLocked]);
  const lockedGames = useMemo(() => filteredGames.filter((g) => isGameLocked(g)), [filteredGames, isGameLocked]);

  // ── Play Handlers ────────────────────────────────────────────────────────

  const handlePlaySingle = useCallback((game: GameMeta) => {
    if (!game) return;
    setGameWords(getGameWords(activeTopic));
    setGameExtra(getExtraPropsForGame(game.type));
    setPlayingGame(game);
    setDailySession(null);
  }, [activeTopic]);

  const handleStartDailyPractice = useCallback(() => {
    const set = getDailyPracticeSet();
    setGameWords(getGameWords(activeTopic));
    setGameExtra(getExtraPropsForGame(set[0]?.type ?? ''));
    setDailySession({ games: set, currentIndex: 0, scores: [] });
    setPlayingGame(null);
  }, [activeTopic]);

  const handleGameComplete = useCallback(
    (score: number, total: number) => {
      const reportToAdaptive = (gameMeta: GameMeta) => {
        try {
          recordActivity({
            soundId: (gameMeta as GameMeta & { soundId?: string; topicId?: string }).soundId
              ?? (gameMeta as GameMeta & { soundId?: string; topicId?: string }).topicId
              ?? 'game',
            activityType: gameMeta.type,
            correct: total > 0 ? score / total >= 0.7 : false,
            responseTimeMs: 0,
            totalQuestions: total,
            correctAnswers: score,
          });
        } catch (e) { logger.warn('[Games] Adaptive engine recording failed:', e); }
      };

      if (playingGame) {
        reportToAdaptive(playingGame);
        saveBestScore(playingGame.type, score);
        setScoreVersion((v) => v + 1);
        toast.success(isTr ? `Harika! ${score}/${total}` : `Great job! ${score}/${total}`);
        setPlayingGame(null);
        setGameExtra(undefined);
        return;
      }

      if (dailySession) {
        const currentGame = dailySession.games[dailySession.currentIndex];
        reportToAdaptive(currentGame);
        const newScores = [...dailySession.scores, score];
        const nextIndex = dailySession.currentIndex + 1;

        if (nextIndex >= dailySession.games.length) {
          saveBestScore(currentGame.type, score);
          const streak = recordDailyPractice();
          setDailyStreak(streak);
          setScoreVersion((v) => v + 1);
          const totalScore = newScores.reduce((a, b) => a + b, 0);
          toast.success(isTr ? `Gunluk Pratik tamamlandi! Bugun ${totalScore} puan!` : `Daily Practice done! ${totalScore} points today!`);
          setDailySession(null);
          setGameExtra(undefined);
        } else {
          saveBestScore(currentGame.type, score);
          setScoreVersion((v) => v + 1);
          setGameWords(getGameWords(activeTopic));
          setGameExtra(getExtraPropsForGame(dailySession.games[nextIndex].type));
          setDailySession({
            ...dailySession,
            currentIndex: nextIndex,
            scores: newScores,
          });
        }
      }
    },
    [playingGame, dailySession, isTr, activeTopic],
  );

  const handleExitGame = useCallback(() => {
    setPlayingGame(null);
    setDailySession(null);
    setGameExtra(undefined);
  }, []);

  const handleXpEarned = useCallback((xp: number) => {
    addXP(xp, 'game_xp');
  }, [addXP]);

  const handleWrongAnswer = useCallback(() => {
    loseHeart();
  }, [loseHeart]);

  // ── Render: Active Game (fullscreen) ─────────────────────────────────────

  const activeGameMeta = playingGame ?? (dailySession ? dailySession.games[dailySession.currentIndex] : null);

  if (activeGameMeta) {
    const progressLabel = dailySession
      ? (isTr
        ? `Oyun ${dailySession.currentIndex + 1} / ${dailySession.games.length}`
        : `Game ${dailySession.currentIndex + 1} / ${dailySession.games.length}`)
      : (isTr ? activeGameMeta.nameTr : activeGameMeta.name);

    return (
      <AnimatePresence>
        <motion.div
          key="game-fullscreen"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={springPop}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-sm shrink-0">
            <button
              type="button"
              onClick={handleExitGame}
              className="flex items-center gap-2 text-gray-600 font-semibold text-sm min-h-[48px] min-w-[48px] px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
              {isTr ? 'Geri' : 'Back'}
            </button>

            <span className="font-bold text-sm text-gray-800 truncate max-w-[50%]">{progressLabel}</span>

            {dailySession && (
              <div className="flex gap-1.5">
                {dailySession.games.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < dailySession.currentIndex
                        ? 'bg-emerald-400'
                        : i === dailySession.currentIndex
                          ? 'bg-orange-400 animate-pulse'
                          : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}

            {!dailySession && <div className="w-12" />}
          </div>

          {/* Game canvas */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[720px] mx-auto w-full h-full px-4 py-4">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                }
              >
                <GameSelector
                  type={activeGameMeta.type}
                  words={gameWords}
                  onComplete={handleGameComplete}
                  onXpEarned={handleXpEarned}
                  onWrongAnswer={handleWrongAnswer}
                  extra={
                    activeGameMeta.type === 'phonetic-trap'
                      ? { ...gameExtra, onBack: handleExitGame }
                      : gameExtra
                  }
                />
              </Suspense>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Render: Hub ──────────────────────────────────────────────────────────

  const featuredLocked = isGameLocked(featuredGame);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-rose-50/40 pb-24">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPop}
        className="px-4 pt-6 pb-2 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shadow-sm">
          <Gamepad2 size={20} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-800">
            {isTr ? 'Oyunlar' : 'Games'}
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            {MINI_GAMES.length} {isTr ? 'oyun mevcut' : 'games available'}
          </p>
        </div>
      </motion.div>

      {/* Daily Practice Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springBounce, delay: 0.05 }}
        className="mx-4 mt-3"
      >
        <button
          type="button"
          onClick={handleStartDailyPractice}
          className="w-full rounded-2xl p-4 bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200/50 flex items-center gap-4 min-h-[80px] active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
            <Flame size={28} className="text-white drop-shadow-sm" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-extrabold text-base leading-tight">
              {isTr ? 'Gunluk Pratik' : 'Daily Practice'}
            </p>
            <p className="text-white/80 text-xs font-medium mt-0.5">
              {dailyStreak > 0 ? (
                <span className="flex items-center gap-1">
                  <Trophy size={12} /> {isTr ? `${dailyStreak} gunluk seri!` : `${dailyStreak} day streak!`}
                </span>
              ) : (
                isTr ? 'Bugun serine basla!' : 'Start your streak today!'
              )}
            </p>
            {/* 5 progress dots */}
            <div className="flex gap-1.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < dailyStreak % 5 ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
          <ChevronRight size={20} className="text-white/70 shrink-0" />
        </button>
      </motion.div>

      {/* Featured Game */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springBounce, delay: 0.1 }}
        className="mx-4 mt-4"
      >
        <div
          className="rounded-2xl p-4 border border-gray-100 bg-white shadow-sm overflow-hidden relative"
        >
          {/* Accent stripe */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-2 mt-1">
            <Star size={12} fill="currentColor" />
            {isTr ? 'Gunun Secimi' : "Today's Pick"}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-extrabold text-gray-800 text-base leading-tight">
                {isTr ? featuredGame.nameTr : featuredGame.name}
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
                {isTr ? featuredGame.descriptionTr : featuredGame.description}
              </p>

              {!featuredLocked ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlaySingle(featuredGame)}
                  className="mt-3 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-rose-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm min-h-[48px] active:shadow-none transition-shadow"
                >
                  <Play size={16} fill="white" />
                  {isTr ? 'Oyna' : 'Play Now'}
                </motion.button>
              ) : (
                <span className="mt-3 inline-flex items-center gap-1 text-gray-400 text-xs font-semibold">
                  <Lock size={12} />
                  {isTr ? `Seviye ${featuredGame.minLevel}'de acilir` : `Unlock at Level ${featuredGame.minLevel}`}
                </span>
              )}
            </div>

            {/* Feature icon area */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-orange-400 shrink-0">
              {GAME_ICONS[featuredGame.type] ?? <Gamepad2 size={28} />}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-5 px-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4" role="tablist">
          {TAB_DEFS.filter((tab) => {
            if (tab.id === 'all') return true;
            return MINI_GAMES.some((g) => g.category === tab.id);
          }).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap min-h-[44px] transition-colors shrink-0 ${
                  isActive
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gray-800 rounded-full"
                    transition={springPop}
                    style={{ zIndex: -1 }}
                  />
                )}
                {tab.icon}
                <span>{isTr ? tab.labelTr : tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Topic Pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-3 px-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {TOPIC_DEFS.map((topic) => {
            const isActive = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTopic(topic.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap min-h-[36px] transition-colors shrink-0 ${
                  isActive
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                {topic.icon}
                <span>{isTr ? topic.labelTr : topic.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Games Grid */}
      <div className="mt-4 px-4">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-gray-800 mb-3">
          <Star size={16} className="text-amber-400" />
          {isTr ? 'Oyunlarimiz' : 'Our Games'}
        </h2>

        {isLoading ? (
          <GamesSkeleton />
        ) : filteredGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <LottieCharacter state="idle" size={100} />
            <p className="text-gray-400 text-sm mt-4 font-medium">
              {isTr ? 'Bu kategoride henuz oyun yok.' : 'No games in this category yet.'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Unlocked games */}
            <div className="grid grid-cols-2 gap-3">
              {unlockedGames.map((game, i) => {
                const best = scoreVersion >= 0 ? getBestScore(game.type) : undefined;
                return (
                  <GameCardInline
                    key={game.type}
                    game={game}
                    isLocked={false}
                    bestScore={best}
                    isNew={isNewGame(game)}
                    onPlay={() => handlePlaySingle(game)}
                    index={i}
                    isTr={isTr}
                  />
                );
              })}
            </div>

            {/* Locked games section */}
            {lockedGames.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-gray-300" />
                  <p className="text-xs text-gray-400 font-semibold">
                    {isTr
                      ? 'Seviyeleri gec ve daha fazla oyun ac!'
                      : 'More games unlock as you level up!'}
                  </p>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-2 gap-3">
                    {lockedGames.slice(0, 4).map((game, i) => {
                      const best = scoreVersion >= 0 ? getBestScore(game.type) : undefined;
                      return (
                        <GameCardInline
                          key={game.type}
                          game={game}
                          isLocked={true}
                          bestScore={best}
                          isNew={isNewGame(game)}
                          onPlay={() => handlePlaySingle(game)}
                          index={i + unlockedGames.length}
                          isTr={isTr}
                        />
                      );
                    })}
                  </div>

                  {/* Fade overlay if there are more locked */}
                  {lockedGames.length > 4 && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      <p className="text-center text-xs text-gray-400 font-medium mt-2">
                        {isTr
                          ? `+${lockedGames.length - 4} oyun daha`
                          : `+${lockedGames.length - 4} more games`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Games;
