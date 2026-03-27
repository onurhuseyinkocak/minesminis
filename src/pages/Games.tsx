import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { logger } from '../utils/logger';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getAgeGroupFromSettings, isGameAllowedForAge } from '../services/ageGroupService';
import { setActiveUser, recordActivity, getOptimalActivity } from '../services/adaptiveEngine';
import { usePageTitle } from '../hooks/usePageTitle';
import { kidsWords, getWordsByCategory } from '../data/wordsData';
import { getCurrentPhonicsSound } from '../services/learningPathService';
import { PHONICS_GROUPS } from '../data/phonics';
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
import { GameCard } from '../components/GameCard';
import toast from 'react-hot-toast';
import { DIALOGUE_EXERCISES } from '../data/dialogueExercises';
import { IMAGE_LABEL_QUESTIONS } from '../data/imageLabelExercises';
import { sayItExercises } from '../data/sayItExercises';
import { phonicsBlendExercises } from '../data/phonicsBlendExercises';
import { phonemeManipulationExercises } from '../data/phonemeManipulationExercises';
import { SYLLABLE_EXERCISES } from '../data/syllableExercises';
import { WORD_FAMILIES } from '../data/wordFamilyExercises';
import { RHYME_EXERCISES } from '../data/rhymeExercises';
import { PHONETIC_TRAPS } from '../data/turkishPhoneticTraps';
import {
  X,
  Play,
  Gamepad2,
  Star,
  Flame,
  ChevronRight,
  BookOpen,
  Mic,
  Volume2,
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
} from 'lucide-react';
import { GameSelector } from '../components/games/index';
import MimiGuide from '../components/MimiGuide';
import LottieCharacter from '../components/LottieCharacter';
import './Games.css';

type TabCategory = 'all' | GameCategory;

interface DailyPracticeSession {
  games: GameMeta[];
  currentIndex: number;
  scores: number[];
}

const TAB_DEFS: { id: TabCategory; icon: React.ReactNode; label: string; labelTr: string }[] = [
  { id: 'all', icon: <Gamepad2 size={16} />, label: 'All', labelTr: 'Tümü' },
  { id: 'vocabulary', icon: <BookMarked size={16} />, label: 'Vocabulary', labelTr: 'Kelime' },
  { id: 'phonics', icon: <Layers size={16} />, label: 'Phonics', labelTr: 'Fonetik' },
  { id: 'reading', icon: <BookOpen size={16} />, label: 'Reading', labelTr: 'Okuma' },
  { id: 'speaking', icon: <Mic size={16} />, label: 'Speaking', labelTr: 'Konuşma' },
];

type WordTopic = 'all' | 'Animals' | 'Colors' | 'Food' | 'Family' | 'Body' | 'Numbers' | 'Nature' | 'phonics';

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

/** Returns specialized `extra` props for games that need their own data instead of words */
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
      // onBack is injected at render time (needs handleExitGame from component scope)
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
  // Deduplicate by word string (defensive guard against data overlap between phonics groups and thematic arrays)
  const seen = new Set<string>();
  const pool = rawPool.filter((w) => { if (seen.has(w.word)) return false; seen.add(w.word); return true; });
  const sufficient = pool.length >= 4 ? pool : kidsWords;
  const shuffled = [...sufficient].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8).map((w) => ({ english: w.word, turkish: w.turkish, emoji: w.emoji }));
}


// Loading skeleton for games grid
function GamesSkeleton() {
  return (
    <div className="games-skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="games-skeleton-card">
          <div className="skeleton-shimmer" style={{ height: 80, borderRadius: 'var(--radius-lg)', marginBottom: 8 }} />
          <div className="skeleton-shimmer" style={{ height: 16, width: '70%', borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton-shimmer" style={{ height: 12, width: '50%', borderRadius: 'var(--radius-sm)', marginTop: 4 }} />
        </div>
      ))}
    </div>
  );
}

function Games() {
  usePageTitle('Oyunlar', 'Games');
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Active single game being played
  const [playingGame, setPlayingGame] = useState<GameMeta | null>(null);

  // Daily practice session state
  const [dailySession, setDailySession] = useState<DailyPracticeSession | null>(null);

  const [activeTopic, setActiveTopic] = useState<WordTopic>('all');
  const [gameWords, setGameWords] = useState(() => getGameWords());
  const [gameExtra, setGameExtra] = useState<Record<string, unknown> | undefined>(undefined);
  const [dailyStreak, setDailyStreak] = useState(() => getDailyPracticeStreak());

  // Re-render trigger for best-score badges (updated after game completes)
  const [scoreVersion, setScoreVersion] = useState(0);

  // Lock body scroll and jump to top whenever a game is active
  const isPlayingAny = !!(playingGame ?? (dailySession ? dailySession.games[dailySession.currentIndex] : null));
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

  // Defer games grid render by one frame so the skeleton shows on first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoading(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const { stats } = useGamification();
  const { t, lang } = useLanguage();
  const { user, userProfile } = useAuth();
  const isTr = lang === 'tr';

  const ageGroup = getAgeGroupFromSettings(userProfile?.settings as Record<string, unknown> | null | undefined);

  const userLevel = stats?.level ?? 1;

  const featuredGame = getDailyFeaturedGame();

  // ---- Adaptive Engine ----
  const [recommendedType, setRecommendedType] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    setActiveUser(user.uid);
    try {
      const optimal = getOptimalActivity();
      setRecommendedType(optimal.activityType);
    } catch { /* no profile yet, ignore */ }
  }, [user?.uid]);

  // ---- Helpers ----
  const isGameLocked = useCallback(
    (game: GameMeta): boolean => {
      return userLevel < game.minLevel;
    },
    [userLevel],
  );

  const filteredGames = useMemo<GameMeta[]>(() => {
    const byTab = activeTab === 'all' ? MINI_GAMES : MINI_GAMES.filter((g) => g.category === activeTab);
    // Use explicit non-empty check — empty string '' is falsy but means "no age set", not "all ages allowed"
    return ageGroup !== ''
      ? byTab.filter((g) => isGameAllowedForAge(g.type, ageGroup))
      : byTab;
  }, [activeTab, ageGroup]);

  // ---- Play handlers ----
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
      // Helper to report to adaptive engine
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
          // Session complete
          saveBestScore(dailySession.games[dailySession.currentIndex].type, score);
          const streak = recordDailyPractice();
          setDailyStreak(streak);
          setScoreVersion((v) => v + 1);
          const total5 = newScores.reduce((a, b) => a + b, 0);
          toast.success(isTr ? `Günlük Pratik tamamlandı! Bugün ${total5} puan!` : `Daily Practice done! ${total5} points today!`);
          setDailySession(null);
          setGameExtra(undefined);
        } else {
          saveBestScore(dailySession.games[dailySession.currentIndex].type, score);
          setScoreVersion((v) => v + 1);
          setGameWords(getGameWords(activeTopic));
          setGameExtra(getExtraPropsForGame(dailySession.games[nextIndex].type));
          setDailySession({
            ...dailySession,
            currentIndex: nextIndex,
            scores: newScores,
          });
        }
        return;
      }
    },
    [playingGame, dailySession, isTr, activeTopic],
  );

  const handleExitGame = useCallback(() => {
    setPlayingGame(null);
    setDailySession(null);
    setGameExtra(undefined);
  }, []);

  // ---- Render: active game ----
  const activeGameMeta = playingGame ?? (dailySession ? dailySession.games[dailySession.currentIndex] : null);

  if (activeGameMeta) {
    const progressLabel = dailySession
      ? (isTr
          ? `Oyun ${dailySession.currentIndex + 1} / ${dailySession.games.length}`
          : `Game ${dailySession.currentIndex + 1} / ${dailySession.games.length}`)
      : (isTr ? activeGameMeta.nameTr : activeGameMeta.name);

    return (
      <div className="games-page games-page--fullscreen">
        <div className="internal-game-fullscreen">
          <div className="internal-game-topbar">
            <button type="button" className="back-btn-big" onClick={handleExitGame}>
              <X size={20} /> {t('common.back')}
            </button>
            <span className="game-topbar-title">{progressLabel}</span>
            {dailySession && (
              <div className="daily-progress-dots">
                {dailySession.games.map((_, i) => (
                  <span
                    key={i}
                    className={`daily-dot${i < dailySession.currentIndex ? ' done' : ''}${i === dailySession.currentIndex ? ' active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="internal-game-container">
            <div className="game-canvas">
              <Suspense fallback={<div className="game-loading">{t('games.loadingGame')}</div>}>
                <GameSelector
                  type={activeGameMeta.type}
                  words={gameWords}
                  onComplete={handleGameComplete}
                  extra={
                    activeGameMeta.type === 'phonetic-trap'
                      ? { ...gameExtra, onBack: handleExitGame }
                      : gameExtra
                  }
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-page">
      {/* Hero */}
      <div className="games-hero">
        <span className="games-hero-icon">
          <Gamepad2 size={48} />
        </span>
        <h1 className="games-hero-title">{t('games.letsPlay')}</h1>
        <p className="games-hero-sub">{isTr ? 'Bir oyun seç ve öğrenmeye başla!' : 'Pick a game and start learning!'}</p>
      </div>

      {/* Daily Practice pinned banner */}
      <div className="daily-practice-banner">
        <div className="daily-practice-left">
          <Flame size={28} className="daily-flame" />
          <div className="daily-practice-text">
            <span className="daily-practice-title">{isTr ? 'Günlük Pratik' : 'Daily Practice'}</span>
            <span className="daily-practice-streak">
              {dailyStreak > 0 ? (
                <>
                  <Trophy size={12} /> {isTr ? `${dailyStreak} günlük seri!` : `${dailyStreak} day streak!`}
                </>
              ) : (
                isTr ? 'Bugün serine başla!' : 'Start your streak today!'
              )}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="daily-practice-btn"
          onClick={handleStartDailyPractice}
        >
          {isTr ? 'Başla' : 'Start'} <ChevronRight size={16} />
        </button>
      </div>

      {/* Featured game */}
      <div className="games-content">
        <div
          className="featured-hero-card"
          style={{ '--fhc-color': featuredGame.color } as React.CSSProperties}
          role="region"
          aria-label={isTr ? 'Günün öne çıkan oyunu' : 'Featured game of the day'}
        >
          <div className="featured-hero-body">
            <span className="featured-hero-tag">
              <Star size={12} fill="currentColor" /> {isTr ? 'Günün Seçimi' : "Today's Pick"}
            </span>
            <h2 className="featured-hero-name">{isTr ? featuredGame.nameTr : featuredGame.name}</h2>
            <p className="featured-hero-desc">{isTr ? featuredGame.descriptionTr : featuredGame.description}</p>
            {!isGameLocked(featuredGame) ? (
              <button
                type="button"
                className="featured-hero-play-btn"
                onClick={() => handlePlaySingle(featuredGame)}
              >
                <Play size={18} fill="white" /> {isTr ? 'Oyna' : 'Play Now'}
              </button>
            ) : (
              <span className="featured-hero-locked">
                {isTr ? `Seviye ${featuredGame.minLevel}'de açılır` : `Unlock at Level ${featuredGame.minLevel}`}
              </span>
            )}
          </div>
          <div className="featured-hero-icon-area" aria-hidden="true">
            <Volume2 size={72} />
          </div>
        </div>

        {/* Category tabs */}
        <div className="games-tabs" role="tablist" aria-label="Game categories">
          {TAB_DEFS.filter((tab) => {
            if (tab.id === 'all') return true;
            return MINI_GAMES.some((g) => g.category === tab.id);
          }).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`games-tab${activeTab === tab.id ? ' games-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{isTr ? tab.labelTr : tab.label}</span>
            </button>
          ))}
        </div>

        {/* Topic word selector */}
        <div className="topic-selector-row">
          <span className="topic-selector-label">{isTr ? 'Konu:' : 'Topic:'}</span>
          <div className="topic-pills">
            {TOPIC_DEFS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-pill${activeTopic === topic.id ? ' topic-pill--active' : ''}`}
                onClick={() => setActiveTopic(topic.id)}
              >
                {topic.icon}
                <span>{isTr ? topic.labelTr : topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Games grid */}
        <h2 className="games-section-title">
          <Star size={18} /> {t('games.ourGames')}
        </h2>

        {isLoading ? (
          <GamesSkeleton />
        ) : filteredGames.length === 0 ? (
          <div className="games-empty-state">
            <LottieCharacter state="idle" size={100} />
            <p>{isTr ? 'Bu kategoride henüz oyun yok.' : 'No games in this category yet.'}</p>
          </div>
        ) : (
          <div
            className="mini-games-grid"
            role="tabpanel"
            aria-label={`${activeTab} games`}
          >
            {filteredGames.map((game) => {
              const locked = isGameLocked(game);
              const best = scoreVersion >= 0 ? getBestScore(game.type) : undefined;
              return (
                <GameCard
                  key={game.type}
                  game={game}
                  isLocked={locked}
                  userLevel={userLevel}
                  bestScore={best}
                  isNew={isNewGame(game)}
                  activeTopic={activeTopic}
                  isRecommended={!!recommendedType && game.type === recommendedType}
                  onPlay={() => handlePlaySingle(game)}
                />
              );
            })}
          </div>
        )}

      </div>

      <MimiGuide
        message="Pick a game to play! Try Daily Practice for a streak!"
        messageTr="Bir oyun seç! Seriyi artırmak için Günlük Pratik'i dene!"
        showOnce="mimi_guide_gameshub"
        position="bottom-left"
      />
    </div>
  );
}

export default Games;
