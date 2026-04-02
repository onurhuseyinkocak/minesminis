/**
 * Games Hub — MinesMinis
 * Kid-themed design inspired by Khan Academy Kids / PBS Kids.
 * Big colorful cards, Mimi mascot with speech bubble, chunky buttons.
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
  'word-match': <Link size={36} />,
  'quick-quiz': <Zap size={36} />,
  'sentence-scramble': <Puzzle size={36} />,
  'spelling-bee': <Bug size={36} />,
  'listening-challenge': <Headphones size={36} />,
  'pronunciation': <Mic size={36} />,
  'story-choices': <BookOpen size={36} />,
  'dialogue': <MessageSquare size={36} />,
  'image-label': <Tag size={36} />,
  'say-it': <Volume2 size={36} />,
  'phonics-blend': <Layers size={36} />,
  'phoneme-manipulation': <Music2 size={36} />,
  'syllable': <Grid2x2 size={36} />,
  'word-family': <Users size={36} />,
  'rhyme': <Triangle size={36} />,
  'phonetic-trap': <AlertTriangle size={36} />,
  'sentence-builder': <Puzzle size={36} />,
};

const CARD_GRADIENTS = [
  'from-red-500 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-yellow-500',
  'from-indigo-500 to-violet-500',
  'from-rose-500 to-red-500',
  'from-cyan-500 to-blue-500',
];

// ── Spring presets ───────────────────────────────────────────────────────────

const springPop = { type: 'spring' as const, stiffness: 400, damping: 25 };
const springBounce = { type: 'spring' as const, stiffness: 300, damping: 20 };

// ── Helpers ──────────────────────────────────────────────────────────────────

function getExtraPropsForGame(gameType: string): Record<string, unknown> | undefined {
  switch (gameType) {
    case 'dialogue': {
      if (DIALOGUE_EXERCISES.length === 0) return undefined;
      const idx = Math.floor(Math.random() * DIALOGUE_EXERCISES.length);
      return { lines: DIALOGUE_EXERCISES[idx].lines };
    }
    case 'image-label': {
      if (IMAGE_LABEL_QUESTIONS.length === 0) return undefined;
      const shuffled = [...IMAGE_LABEL_QUESTIONS].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 6) };
    }
    case 'say-it': {
      if (sayItExercises.length === 0) return undefined;
      const shuffled = [...sayItExercises].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 6) };
    }
    case 'phonics-blend': {
      if (phonicsBlendExercises.length === 0) return undefined;
      const shuffled = [...phonicsBlendExercises].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 6) };
    }
    case 'phoneme-manipulation': {
      if (phonemeManipulationExercises.length === 0) return undefined;
      const shuffled = [...phonemeManipulationExercises].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 8) };
    }
    case 'syllable': {
      if (SYLLABLE_EXERCISES.length === 0) return undefined;
      const shuffled = [...SYLLABLE_EXERCISES].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 8) };
    }
    case 'word-family': {
      if (WORD_FAMILIES.length === 0) return undefined;
      const shuffled = [...WORD_FAMILIES].sort(() => Math.random() - 0.5);
      return { families: shuffled.slice(0, 5) };
    }
    case 'rhyme': {
      if (RHYME_EXERCISES.length === 0) return undefined;
      const shuffled = [...RHYME_EXERCISES].sort(() => Math.random() - 0.5);
      return { questions: shuffled.slice(0, 8) };
    }
    case 'phonetic-trap': {
      if (PHONETIC_TRAPS.length === 0) return undefined;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[28px] bg-orange-100/60 animate-pulse" style={{ minHeight: 140 }} />
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

function Games() {
  usePageTitle('Oyunlar', 'Games');

  const { stats, addXP, trackActivity } = useGamification();
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
        saveBestScore(playingGame.type, score, user?.uid);
        trackActivity('game_played').catch(() => {});
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
          saveBestScore(currentGame.type, score, user?.uid);
          trackActivity('game_played').catch(() => {});
          const streak = recordDailyPractice();
          setDailyStreak(streak);
          setScoreVersion((v) => v + 1);
          const totalScore = newScores.reduce((a, b) => a + b, 0);
          toast.success(isTr ? `Gunluk Pratik tamamlandi! Bugun ${totalScore} puan!` : `Daily Practice done! ${totalScore} points today!`);
          setDailySession(null);
          setGameExtra(undefined);
        } else {
          saveBestScore(currentGame.type, score, user?.uid);
          trackActivity('game_played').catch(() => {});
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
    [playingGame, dailySession, isTr, trackActivity],
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
          className="fixed inset-0 top-[64px] z-50 kid-bg flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-orange-100 bg-white/90 backdrop-blur-sm shrink-0">
            <button
              type="button"
              onClick={handleExitGame}
              className="flex items-center gap-2 text-orange-600 font-bold text-sm w-12 h-12 rounded-2xl hover:bg-orange-50 active:bg-orange-100 transition-colors justify-center"
            >
              <ArrowLeft size={24} />
            </button>

            <span className="font-extrabold text-base text-gray-800 truncate max-w-[50%]">{progressLabel}</span>

            {dailySession && (
              <div className="flex gap-1.5">
                {dailySession.games.map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
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
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
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

  // ── Render: Hub (kid-themed, PBS Kids style) ──────────────────────────────

  // Suppress unused variable warning — scoreVersion is used to force re-render on score changes
  void scoreVersion;

  return (
    <div className="kid-bg kid-bubbles pb-24" style={{ minHeight: 'calc(100dvh - 64px)' }}>
      {/* Content sits above the bubble overlay */}
      <div className="relative z-10">

        {/* Mimi mascot + speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPop}
          className="px-4 pt-6 pb-2 flex items-end gap-3"
        >
          <div className="shrink-0">
            <LottieCharacter state="wave" size={80} />
          </div>
          <div className="kid-speech-bubble flex-1 mb-2">
            {isTr ? 'Oynamaya hazir misin?' : 'Ready to play?'}
          </div>
        </motion.div>

        {/* BIG daily play button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springBounce, delay: 0.1 }}
          className="px-4 mt-4"
        >
          <button
            type="button"
            onClick={handleStartDailyPractice}
            className="kid-pulse pulse-btn w-full rounded-[28px] py-5 px-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white font-black text-2xl tracking-wide flex items-center justify-center gap-4 active:scale-[0.96] transition-transform border-4 border-white/30"
          >
            <Play size={36} fill="white" className="text-white shrink-0" />
            <span>{isTr ? 'OYNA!' : 'PLAY!'}</span>
            {dailyStreak > 0 && (
              <span className="flex items-center gap-1 text-base font-bold bg-white/20 rounded-full px-3 py-1 ml-1">
                <Flame size={18} />
                {dailyStreak}
              </span>
            )}
          </button>
        </motion.div>

        {/* Games Grid — 2 columns, big chunky colorful cards */}
        <div className="mt-6 px-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableGames.map((game, i) => (
                <motion.button
                  key={game.type}
                  type="button"
                  initial={{ opacity: 0, y: 24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...springBounce, delay: 0.15 + i * 0.04 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePlaySingle(game)}
                  aria-label={isTr ? game.nameTr : game.name}
                  className={`rounded-[28px] flex flex-col items-center justify-center text-white shadow-lg cursor-pointer bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} border-4 border-white/20 game-card`}
                  style={{ minHeight: 140, padding: 16 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                    {GAME_ICONS[game.type] ?? <Gamepad2 size={36} />}
                  </div>
                  <span className="font-extrabold text-base text-center leading-tight drop-shadow-sm">
                    {isTr ? game.nameTr : game.name}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Games;
