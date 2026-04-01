/**
 * Games Hub — MinesMinis
 * Ultra-simplified for young children (3+).
 * Big colorful cards, no tabs/pills/badges — just games!
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
  getDailyPracticeSet,
  getDailyPracticeStreak,
  recordDailyPractice,
  saveBestScore,
} from '../data/miniGamesData';
import type { GameMeta } from '../data/miniGamesData';
import { getAgeGroupFromSettings, isGameAllowedForAge, getMaxWordsForAge, filterWordsForAge } from '../services/ageGroupService';
import { kidsWords } from '../data/wordsData';
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
  Flame,
  Layers,
  Mic,
  BookOpen,
  MessageSquare,
  Tag,
  Volume2,
  Music2,
  Grid2x2,
  Users,
  Triangle,
  AlertTriangle,
  Link,
  Zap,
  Bug,
  Puzzle,
  Headphones,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface DailyPracticeSession {
  games: GameMeta[];
  currentIndex: number;
  scores: number[];
}

// ── Constants ────────────────────────────────────────────────────────────────

const GAME_ICONS: Record<string, React.ReactNode> = {
  'word-match': <Link size={32} />,
  'quick-quiz': <Zap size={32} />,
  'sentence-scramble': <Puzzle size={32} />,
  'spelling-bee': <Bug size={32} />,
  'listening-challenge': <Headphones size={32} />,
  'pronunciation': <Mic size={32} />,
  'story-choices': <BookOpen size={32} />,
  'dialogue': <MessageSquare size={32} />,
  'image-label': <Tag size={32} />,
  'say-it': <Volume2 size={32} />,
  'phonics-blend': <Layers size={32} />,
  'phoneme-manipulation': <Music2 size={32} />,
  'syllable': <Grid2x2 size={32} />,
  'word-family': <Users size={32} />,
  'rhyme': <Triangle size={32} />,
  'phonetic-trap': <AlertTriangle size={32} />,
  'sentence-builder': <Puzzle size={32} />,
};

const CARD_GRADIENTS: string[] = [
  'linear-gradient(145deg, #FF6B35 0%, #F04B10 100%)',
  'linear-gradient(145deg, #3B82F6 0%, #2563EB 100%)',
  'linear-gradient(145deg, #8B5CF6 0%, #7C3AED 100%)',
  'linear-gradient(145deg, #10B981 0%, #059669 100%)',
  'linear-gradient(145deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(145deg, #EC4899 0%, #DB2777 100%)',
  'linear-gradient(145deg, #06B6D4 0%, #0891B2 100%)',
  'linear-gradient(145deg, #EF4444 0%, #DC2626 100%)',
];

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

function getGameWords(currentAgeGroup?: string) {
  const currentSound = getCurrentPhonicsSound();
  if (currentSound) {
    const group = PHONICS_GROUPS.find((g) => g.group === currentSound.group);
    if (group && group.blendableWords.length >= 4) {
      const rawWords = group.blendableWords.map((w) => {
        const found = kidsWords.find((kw) => kw.word === w);
        return { english: w, turkish: found?.turkish ?? w, emoji: found?.emoji ?? '', word: w, group: currentSound.group };
      });
      const filtered = currentAgeGroup
        ? filterWordsForAge(rawWords, currentAgeGroup)
        : rawWords;
      const maxWords = currentAgeGroup ? getMaxWordsForAge(currentAgeGroup) : 8;
      return filtered.slice(0, maxWords).map((w) => ({ english: w.english, turkish: w.turkish, emoji: w.emoji }));
    }
  }
  const shuffled = [...kidsWords].sort(() => Math.random() - 0.5);
  const rawWords = shuffled.map((w) => ({ english: w.word, turkish: w.turkish, emoji: w.emoji, word: w.word }));
  const filtered = currentAgeGroup
    ? filterWordsForAge(rawWords, currentAgeGroup)
    : rawWords;
  const maxWords = currentAgeGroup ? getMaxWordsForAge(currentAgeGroup) : 8;
  return filtered.slice(0, maxWords).map((w) => ({ english: w.english, turkish: w.turkish, emoji: w.emoji }));
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function GamesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-3xl bg-gray-100 animate-pulse" style={{ minHeight: 120 }} />
      ))}
    </div>
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

  const [isLoading, setIsLoading] = useState(true);
  const [playingGame, setPlayingGame] = useState<GameMeta | null>(null);
  const [dailySession, setDailySession] = useState<DailyPracticeSession | null>(null);
  const [gameWords, setGameWords] = useState(() => getGameWords(undefined));
  const [gameExtra, setGameExtra] = useState<Record<string, unknown> | undefined>(undefined);
  const [dailyStreak, setDailyStreak] = useState(() => getDailyPracticeStreak());
  const [scoreVersion, setScoreVersion] = useState(0);

  // ── Derived ──────────────────────────────────────────────────────────────

  const ageGroup = getAgeGroupFromSettings(userProfile?.settings as Record<string, unknown> | null | undefined);
  const userLevel = stats?.level ?? 1;

  const isPlayingAny = !!(playingGame ?? (dailySession ? dailySession.games[dailySession.currentIndex] : null));

  // ── Adaptive Engine ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!user?.uid) return;
    setActiveUser(user.uid);
    try {
      getOptimalActivity();
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

  // ── Filtering — show only unlocked games ─────────────────────────────────

  const isGameLocked = useCallback(
    (game: GameMeta): boolean => userLevel < game.minLevel,
    [userLevel],
  );

  const availableGames = useMemo<GameMeta[]>(() => {
    const ageFiltered = ageGroup !== ''
      ? MINI_GAMES.filter((g) => isGameAllowedForAge(g.type, ageGroup))
      : MINI_GAMES;
    return ageFiltered.filter((g) => !isGameLocked(g));
  }, [ageGroup, isGameLocked]);

  // ── Play Handlers ────────────────────────────────────────────────────────

  const handlePlaySingle = useCallback((game: GameMeta) => {
    if (!game) return;
    setGameWords(getGameWords(ageGroup));
    setGameExtra(getExtraPropsForGame(game.type));
    setPlayingGame(game);
    setDailySession(null);
  }, [ageGroup]);

  const handleStartDailyPractice = useCallback(() => {
    const set = getDailyPracticeSet();
    setGameWords(getGameWords(ageGroup));
    setGameExtra(getExtraPropsForGame(set[0]?.type ?? ''));
    setDailySession({ games: set, currentIndex: 0, scores: [] });
    setPlayingGame(null);
  }, [ageGroup]);

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
          setGameWords(getGameWords(ageGroup));
          setGameExtra(getExtraPropsForGame(dailySession.games[nextIndex].type));
          setDailySession({
            ...dailySession,
            currentIndex: nextIndex,
            scores: newScores,
          });
        }
      }
    },
    [playingGame, dailySession, isTr],
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
          className="fixed inset-0 top-[64px] z-50 bg-white flex flex-col"
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

          {/* Game canvas: fills remaining space, no scroll */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full max-w-[720px] mx-auto w-full flex items-center justify-center p-4">
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
                  ageGroup={ageGroup}
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

  // ── Render: Hub (ultra-simple for toddlers) ───────────────────────────────

  // Suppress unused variable warning — scoreVersion is used to force re-render on score changes
  void scoreVersion;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-rose-50/40 pb-24">

      {/* Header — simple icon + title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPop}
        className="px-4 pt-6 pb-2 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shadow-sm">
          <Gamepad2 size={20} />
        </div>
        <h1 className="text-xl font-extrabold text-gray-800">
          {isTr ? 'Oyunlar' : 'Games'}
        </h1>
      </motion.div>

      {/* Daily Practice — Big colorful Mimi + Play button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springBounce, delay: 0.05 }}
        className="mx-4 mt-3"
      >
        <button
          type="button"
          onClick={handleStartDailyPractice}
          className="w-full rounded-3xl p-5 bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200/50 flex items-center gap-4 min-h-[100px] active:scale-[0.97] transition-transform"
        >
          <div className="shrink-0">
            <LottieCharacter state="wave" size={64} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-extrabold text-lg leading-tight">
              {isTr ? 'Oyna!' : 'Play!'}
            </p>
            {dailyStreak > 0 && (
              <p className="text-white/80 text-xs font-medium mt-1 flex items-center gap-1">
                <Flame size={14} />
                {isTr ? `${dailyStreak} gun!` : `${dailyStreak} days!`}
              </p>
            )}
          </div>
          <Play size={32} fill="white" className="text-white shrink-0 opacity-90" />
        </button>
      </motion.div>

      {/* Games Grid — 2 columns, big colorful cards */}
      <div className="mt-5 px-4">
        {isLoading ? (
          <GamesSkeleton />
        ) : availableGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <LottieCharacter state="idle" size={100} />
            <p className="text-gray-400 text-sm mt-4 font-medium">
              {isTr ? 'Henuz oyun yok.' : 'No games yet.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {availableGames.map((game, i) => (
              <motion.button
                key={game.type}
                type="button"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...springBounce, delay: i * 0.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlaySingle(game)}
                className="rounded-3xl flex flex-col items-center justify-center text-white shadow-md active:shadow-sm cursor-pointer"
                style={{
                  minHeight: 120,
                  background: CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                  padding: 16,
                }}
              >
                <div className="mb-2 opacity-95">
                  {GAME_ICONS[game.type] ?? <Gamepad2 size={32} />}
                </div>
                <span className="font-bold text-sm text-center leading-tight">
                  {isTr ? game.nameTr : game.name}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Games;
