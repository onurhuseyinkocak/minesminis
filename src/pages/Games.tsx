import { useState, useEffect, Suspense, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../config/supabase';
import { fallbackGames } from '../data/fallbackData';
import { getCachedData, setCachedData } from '../utils/offlineManager';
import { kidsWords } from '../data/wordsData';
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
import {
  X,
  Play,
  Gamepad2,
  Star,
  Sparkles,
  Flame,
  ChevronRight,
  BookOpen,
  Mic,
  Volume2,
  BookMarked,
  Layers,
  Trophy,
} from 'lucide-react';
import { GameSelector } from '../components/games/index';
import MimiGuide from '../components/MimiGuide';
import './Games.css';

type ExternalGame = {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  category: string;
  description: string;
  target_audience?: string;
};

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

function getGameWords() {
  const currentSound = getCurrentPhonicsSound();
  if (currentSound) {
    const group = PHONICS_GROUPS.find((g) => g.group === currentSound.group);
    if (group && group.blendableWords.length >= 4) {
      return group.blendableWords.slice(0, 8).map((w) => {
        const found = kidsWords.find((kw) => kw.word === w);
        return { english: w, turkish: found?.turkish ?? w, emoji: found?.emoji ?? '' };
      });
    }
  }
  const shuffled = [...kidsWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8).map((w) => ({ english: w.word, turkish: w.turkish, emoji: w.emoji }));
}

function Games() {
  const [externalGames, setExternalGames] = useState<ExternalGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [selectedExternal, setSelectedExternal] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabCategory>('all');

  // Active single game being played
  const [playingGame, setPlayingGame] = useState<GameMeta | null>(null);

  // Daily practice session state
  const [dailySession, setDailySession] = useState<DailyPracticeSession | null>(null);

  const [gameWords, setGameWords] = useState(() => getGameWords());
  const [dailyStreak, setDailyStreak] = useState(() => getDailyPracticeStreak());

  // Re-render trigger for best-score badges (updated after game completes)
  const [scoreVersion, setScoreVersion] = useState(0);

  const { user } = useAuth();
  const { stats } = useGamification();
  const { t, lang } = useLanguage();
  const isTr = lang === 'tr';

  const userLevel = stats?.level ?? 1;

  const featuredGame = getDailyFeaturedGame();

  // ---- External games fetch ----
  useEffect(() => {
    let cancelled = false;
    const fetchGames = async () => {
      setGamesLoading(true);
      const cached = getCachedData<ExternalGame[]>('games');
      try {
        const { data, error } = await supabase.from('games').select('*');
        if (error) throw error;
        const validDb = (data || []).filter((g: ExternalGame) => g.url?.startsWith('http'));
        const result = validDb.length > 0 ? (validDb as ExternalGame[]) : (fallbackGames as ExternalGame[]);
        if (!cancelled) {
          setExternalGames(result);
          setCachedData('games', result, 6 * 60 * 60 * 1000);
        }
      } catch {
        if (!cancelled) {
          if (cached && cached.length > 0) {
            setExternalGames(cached);
          } else {
            toast.error(isTr ? 'Oyunlar yüklenirken sorun oluştu.' : 'Failed to load games.');
            setExternalGames(fallbackGames as ExternalGame[]);
          }
        }
      } finally {
        if (!cancelled) setGamesLoading(false);
      }
    };
    fetchGames();
    return () => { cancelled = true; };
  }, [user, isTr]);

  // ---- Helpers ----
  const isGameLocked = useCallback(
    (game: GameMeta): boolean => {
      return userLevel < game.minLevel;
    },
    [userLevel],
  );

  const filteredGames: GameMeta[] =
    activeTab === 'all'
      ? MINI_GAMES
      : MINI_GAMES.filter((g) => g.category === activeTab);

  // ---- Play handlers ----
  const handlePlaySingle = useCallback((game: GameMeta) => {
    if (!game) return;
    setGameWords(getGameWords());
    setPlayingGame(game);
    setDailySession(null);
  }, []);

  const handleStartDailyPractice = useCallback(() => {
    const set = getDailyPracticeSet();
    setGameWords(getGameWords());
    setDailySession({ games: set, currentIndex: 0, scores: [] });
    setPlayingGame(null);
  }, []);

  const handleGameComplete = useCallback(
    (score: number, total: number) => {
      if (playingGame) {
        saveBestScore(playingGame.type, score);
        setScoreVersion((v) => v + 1);
        toast.success(isTr ? `Harika! ${score}/${total}` : `Great job! ${score}/${total}`);
        setPlayingGame(null);
        return;
      }

      if (dailySession) {
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
        } else {
          saveBestScore(dailySession.games[dailySession.currentIndex].type, score);
          setScoreVersion((v) => v + 1);
          setGameWords(getGameWords());
          setDailySession({
            ...dailySession,
            currentIndex: nextIndex,
            scores: newScores,
          });
        }
        return;
      }
    },
    [playingGame, dailySession, isTr],
  );

  const handleExitGame = useCallback(() => {
    setPlayingGame(null);
    setDailySession(null);
  }, []);

  // ---- Render: active game ----
  const activeGameMeta = playingGame ?? (dailySession ? dailySession.games[dailySession.currentIndex] : null);

  if (activeGameMeta) {
    const progressLabel = dailySession
      ? (isTr
          ? `Oyun ${dailySession.currentIndex + 1} / ${dailySession.games.length}`
          : `Game ${dailySession.currentIndex + 1} / ${dailySession.games.length}`)
      : activeGameMeta.name;

    return (
      <div className="games-page">
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
            <Suspense fallback={<div className="game-loading">{t('games.loadingGame')}</div>}>
              <GameSelector
                type={activeGameMeta.type}
                words={gameWords}
                onComplete={handleGameComplete}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  const selectedExternalData = externalGames.find((g) => g.id === selectedExternal);

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
          aria-label="Featured game of the day"
        >
          <div className="featured-hero-body">
            <span className="featured-hero-tag">
              <Star size={12} fill="currentColor" /> {isTr ? 'Günün Seçimi' : "Today's Pick"}
            </span>
            <h2 className="featured-hero-name">{featuredGame.name}</h2>
            <p className="featured-hero-desc">{featuredGame.description}</p>
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
          {TAB_DEFS.map((tab) => (
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

        {/* Games grid */}
        <h2 className="games-section-title">
          <Star size={18} /> {t('games.ourGames')}
        </h2>

        {filteredGames.length === 0 ? (
          <div className="games-empty-state">
            <Gamepad2 size={48} />
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
                  onPlay={() => handlePlaySingle(game)}
                />
              );
            })}
          </div>
        )}

        {/* External Wordwall games */}
        {gamesLoading && (
          <div className="games-loading-indicator">
            <div className="page-loader__spinner" />
            <p>{isTr ? 'Daha fazla oyun yükleniyor...' : 'Loading more games...'}</p>
          </div>
        )}

        {!gamesLoading && externalGames.length > 0 && (
          <>
            <h2 className="games-section-title">
              <Sparkles size={18} /> {t('games.moreGames')}
            </h2>
            <div className="external-games-grid">
              {externalGames.map((game) => (
                <div
                  key={game.id}
                  className="external-game-card"
                  onClick={() => setSelectedExternal(game.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${game.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedExternal(game.id);
                    }
                  }}
                >
                  <div className="external-game-thumb">
                    <img
                      src={game.thumbnail_url}
                      alt={game.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%231a2332" width="400" height="300"/><rect x="160" y="110" width="80" height="80" rx="12" fill="%23FF6B35" opacity="0.5"/></svg>';
                      }}
                    />
                    <div className="external-play-overlay">
                      <span className="play-icon-circle">
                        <Play size={28} fill="white" />
                      </span>
                    </div>
                  </div>
                  <div className="external-game-info">
                    <h3>{game.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* External game modal */}
      {selectedExternal && selectedExternalData && (
        <div
          className="game-modal-overlay"
          onClick={() => setSelectedExternal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedExternalData.title}
        >
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <div className="game-modal-header">
              <h2>{selectedExternalData.title}</h2>
              <button
                type="button"
                onClick={() => setSelectedExternal(null)}
                className="game-modal-close"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="game-iframe-container">
              <iframe
                src={selectedExternalData.url}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups"
                title={selectedExternalData.title}
              />
            </div>
          </div>
        </div>
      )}

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
