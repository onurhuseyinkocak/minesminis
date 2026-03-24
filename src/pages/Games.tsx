import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../config/supabase';
import { fallbackGames } from '../data/fallbackData';
import { getCachedData, setCachedData } from '../utils/offlineManager';
import { kidsWords } from '../data/wordsData';
import { getCurrentPhonicsSound } from '../services/learningPathService';
import { PHONICS_GROUPS } from '../data/phonics';
import toast from 'react-hot-toast';
import { X, Play, Dice5, Type, Puzzle, Headphones, PenTool, BookOpen, Link, Zap, Bug, Mic, Blocks, Scissors, Gamepad2, Star, Sparkles } from 'lucide-react';
import { GameSelector } from '../components/games/index';
import MimiGuide from '../components/MimiGuide';
import './Games.css';

type Game = {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  category: string;
  description: string;
  target_audience?: string;
};

type GameCategory = 'all' | 'letters' | 'puzzles' | 'listening' | 'spelling' | 'reading';

interface InternalGame {
  id: string;
  type: string;
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  subtitle: string;
  color: string;
  difficulty: number; // 1-3 stars
}

const CATEGORIES: { id: GameCategory; icon: React.ReactNode; emoji?: string; label: string; color: string }[] = [
  { id: 'all', icon: <Dice5 size={20} />, label: 'Tümü', color: 'var(--primary)' },
  { id: 'letters', icon: <Type size={20} />, label: 'Harfler', color: 'var(--accent-teal)' },
  { id: 'puzzles', icon: <Puzzle size={20} />, label: 'Bulmacalar', color: 'var(--secondary-light, #2A9D8F)' },
  { id: 'listening', icon: <Headphones size={20} />, label: 'Dinleme', color: 'var(--accent-amber)' },
  { id: 'spelling', icon: <PenTool size={20} />, label: 'Heceleme', color: 'var(--accent-rose, #f43f5e)' },
  { id: 'reading', icon: <BookOpen size={20} />, label: 'Okuma', color: 'var(--success)' },
];

const INTERNAL_GAMES: InternalGame[] = [
  { id: 'word-match', type: 'word-match', icon: <Link size={28} />, title: 'Word Match', subtitle: 'Match words to pictures!', color: 'var(--accent-teal)', difficulty: 1 },
  { id: 'quick-quiz', type: 'quick-quiz', icon: <Zap size={28} />, title: 'Quick Quiz', subtitle: 'How fast can you answer?', color: 'var(--accent-amber)', difficulty: 2 },
  { id: 'spelling-bee', type: 'spelling-bee', icon: <Bug size={28} />, title: 'Spelling Bee', subtitle: 'Spell the word!', color: 'var(--accent-rose, #f43f5e)', difficulty: 2 },
  { id: 'pronunciation', type: 'pronunciation', icon: <Mic size={28} />, title: 'Say It!', subtitle: 'Practice speaking!', color: 'var(--accent-indigo)', difficulty: 1 },
  { id: 'blending', type: 'blending', icon: <Blocks size={28} />, title: 'Word Builder', subtitle: 'Build words from sounds!', color: 'var(--success)', difficulty: 2 },
  { id: 'segmenting', type: 'segmenting', icon: <Scissors size={28} />, title: 'Sound Splitter', subtitle: 'Break words into sounds!', color: 'var(--secondary-light, #2A9D8F)', difficulty: 3 },
  { id: 'listening-challenge', type: 'listening-challenge', icon: <Headphones size={28} />, title: 'Listening Challenge', subtitle: 'Listen and choose the right word!', color: 'var(--accent-amber)', difficulty: 2 },
  { id: 'sentence-scramble', type: 'sentence-scramble', icon: <Puzzle size={28} />, title: 'Sentence Scramble', subtitle: 'Put the words in order!', color: 'var(--accent-indigo)', difficulty: 3 },
  { id: 'story-choices', type: 'story-choices', icon: <BookOpen size={28} />, title: 'Story Choices', subtitle: 'Choose your own adventure!', color: 'var(--success)', difficulty: 2 },
];

function getGameWords() {
  const currentSound = getCurrentPhonicsSound();
  if (currentSound) {
    // Get blendable words from current phonics group
    const group = PHONICS_GROUPS.find(g => g.group === currentSound.group);
    if (group && group.blendableWords.length >= 4) {
      // Map blendable words to game format, looking up emoji/turkish from kidsWords
      const mapped = group.blendableWords.slice(0, 8).map(w => {
        const found = kidsWords.find(kw => kw.word === w);
        return {
          english: w,
          turkish: found?.turkish || w,
          emoji: found?.emoji || '',
        };
      });
      return mapped;
    }
  }
  // Fallback to random if no phonics context
  const shuffled = [...kidsWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8).map(w => ({
    english: w.word,
    turkish: w.turkish,
    emoji: w.emoji,
  }));
}

function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [playingInternal, setPlayingInternal] = useState<InternalGame | null>(null);
  const [gameWords, setGameWords] = useState(() => getGameWords());
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const fetchGames = async () => {
      setGamesLoading(true);
      const cached = getCachedData<Game[]>('games');

      try {
        const { data, error } = await supabase
          .from('games')
          .select('*');

        if (error) throw error;
        const validDb = (data || []).filter((g: Game) => g.url?.startsWith('http'));
        const result = validDb.length > 0 ? (validDb as Game[]) : fallbackGames as Game[];
        if (!cancelled) {
          setGames(result);
          setCachedData('games', result, 6 * 60 * 60 * 1000);
        }
      } catch {
        if (!cancelled) {
          if (cached && cached.length > 0) {
            setGames(cached);
          } else {
            toast.error('Oyunlar yüklenirken sorun oluştu.');
            setGames(fallbackGames as Game[]);
          }
        }
      } finally {
        if (!cancelled) setGamesLoading(false);
      }
    };

    fetchGames();
    return () => { cancelled = true; };
  }, [user]);

  const selectedGameData = games.find(game => game.id === selectedGame);

  const getCategoryGames = (): InternalGame[] => {
    if (activeCategory === 'all') return INTERNAL_GAMES;
    const map: Record<GameCategory, string[]> = {
      all: [],
      letters: ['spelling-bee', 'pronunciation', 'blending'],
      puzzles: ['word-match', 'segmenting', 'blending'],
      listening: ['pronunciation', 'blending'],
      spelling: ['spelling-bee', 'word-writing'],
      reading: ['word-match', 'quick-quiz', 'segmenting'],
    };
    return INTERNAL_GAMES.filter(g => map[activeCategory].includes(g.id));
  };

  const handlePlayInternal = (game: InternalGame) => {
    setGameWords(getGameWords());
    setPlayingInternal(game);
  };

  const handleGameComplete = (score: number, total: number) => {
    toast.success(`Great job! You got ${score} out of ${total}!`);
    setPlayingInternal(null);
  };

  const filteredInternal = getCategoryGames();

  // If playing an internal game, show it full screen
  if (playingInternal) {
    return (
      <div className="games-page">
        <div className="internal-game-fullscreen">
          <div className="internal-game-topbar">
            <button className="back-btn-big" onClick={() => setPlayingInternal(null)}>
              <X size={24} /> {t('common.back')}
            </button>
            <span className="game-topbar-title">
              {playingInternal.icon} {playingInternal.title}
            </span>
          </div>
          <div className="internal-game-container">
            <Suspense fallback={<div className="game-loading">{t('games.loadingGame')}</div>}>
              <GameSelector
                type={playingInternal.type}
                words={gameWords}
                onComplete={handleGameComplete}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-page">
      {/* Big fun header */}
      <div className="games-hero">
        <span className="games-hero-emoji"><Gamepad2 size={48} /></span>
        <h1 className="games-hero-title">{t('games.letsPlay')}</h1>
      </div>

      {/* Category circles */}
      <div className="category-circles">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-circle ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{ '--cat-color': cat.color } as React.CSSProperties}
          >
            <span className="category-circle-emoji">{cat.icon}</span>
            <span className="category-circle-label">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="games-content">
        {/* Featured Internal Games */}
        <h2 className="games-section-title"><Star size={20} /> {t('games.ourGames')}</h2>
        <div className="featured-games-grid">
          {filteredInternal.map(game => (
            <button
              key={game.id}
              className="featured-game-card"
              onClick={() => handlePlayInternal(game)}
              style={{ '--card-color': game.color } as React.CSSProperties}
            >
              <span className="featured-emoji">{game.icon}</span>
              <h3 className="featured-title">{game.title}</h3>
              <p className="featured-subtitle">{game.subtitle}</p>
              <div className="difficulty-stars">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`star ${i < game.difficulty ? 'filled' : ''}`}><Star size={14} /></span>
                ))}
              </div>
              <div className="play-now-btn">
                <Play size={18} fill="white" /> Oyna!
              </div>
            </button>
          ))}
        </div>

        {/* Loading indicator for external games */}
        {gamesLoading && (
          <div className="games-loading-indicator" style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="page-loader__spinner" />
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Loading more games...</p>
          </div>
        )}

        {/* External Wordwall games */}
        {!gamesLoading && games.length > 0 && (
          <>
            <h2 className="games-section-title"><Sparkles size={20} /> {t('games.moreGames')}</h2>
            <div className="external-games-grid">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="external-game-card"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <div className="external-game-thumb">
                    <img
                      src={game.thumbnail_url}
                      alt={game.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%231a2332" width="400" height="300"/><rect x="160" y="110" width="80" height="80" rx="12" fill="%23FF6B35" opacity="0.5"/></svg>';
                      }}
                    />
                    <div className="external-play-overlay">
                      <span className="play-icon-circle"><Play size={28} fill="white" /></span>
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
      {selectedGame && selectedGameData && (
        <div className="game-modal-overlay" onClick={() => setSelectedGame(null)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <div className="game-modal-header">
              <h2>{selectedGameData.title}</h2>
              <button
                onClick={() => setSelectedGame(null)}
                className="game-modal-close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="game-iframe-container">
              <iframe
                src={selectedGameData.url}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups"
                title={selectedGameData.title}
              />
            </div>
          </div>
        </div>
      )}

      <MimiGuide
        message="Tap a game to play! The golden \u2B50 one is next!"
        messageTr="Oynamak için bir oyuna dokun!"
        showOnce="mimi_guide_worldmap"
        position="bottom-left"
      />
    </div>
  );
}

export default Games;
