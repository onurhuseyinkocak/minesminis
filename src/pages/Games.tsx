import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { fallbackGames } from '../data/fallbackData';
import { getCachedData, setCachedData } from '../utils/offlineManager';
import { kidsWords } from '../data/wordsData';
import { getCurrentPhonicsSound } from '../services/learningPathService';
import { PHONICS_GROUPS } from '../data/phonics';
import toast from 'react-hot-toast';
import { X, Play, Dice5, Type, Puzzle, Headphones, PenTool, BookOpen } from 'lucide-react';
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
  { id: 'all', icon: <Dice5 size={20} />, label: 'All', color: 'var(--accent-indigo)' },
  { id: 'letters', icon: <Type size={20} />, label: 'Letters', color: 'var(--accent-teal)' },
  { id: 'puzzles', icon: <Puzzle size={20} />, label: 'Puzzles', color: 'var(--accent-purple-light, #a78bfa)' },
  { id: 'listening', icon: <Headphones size={20} />, label: 'Listening', color: 'var(--accent-amber)' },
  { id: 'spelling', icon: <PenTool size={20} />, label: 'Spelling', color: 'var(--accent-rose, #f43f5e)' },
  { id: 'reading', icon: <BookOpen size={20} />, label: 'Reading', color: 'var(--success)' },
];

const INTERNAL_GAMES: InternalGame[] = [
  { id: 'word-match', type: 'word-match', emoji: '\uD83D\uDD17', title: 'Word Match', subtitle: 'Match words to pictures!', color: 'var(--accent-teal)', difficulty: 1 },
  { id: 'quick-quiz', type: 'quick-quiz', emoji: '\u26A1', title: 'Quick Quiz', subtitle: 'How fast can you answer?', color: 'var(--accent-amber)', difficulty: 2 },
  { id: 'spelling-bee', type: 'spelling-bee', emoji: '\uD83D\uDC1D', title: 'Spelling Bee', subtitle: 'Spell the word!', color: 'var(--accent-rose, #f43f5e)', difficulty: 2 },
  { id: 'pronunciation', type: 'pronunciation', emoji: '\uD83C\uDFA4', title: 'Say It!', subtitle: 'Practice speaking!', color: 'var(--accent-indigo)', difficulty: 1 },
  { id: 'blending', type: 'blending', emoji: '\uD83E\uDDF1', title: 'Word Builder', subtitle: 'Build words from sounds!', color: 'var(--success)', difficulty: 2 },
  { id: 'segmenting', type: 'segmenting', emoji: '\u2702\uFE0F', title: 'Sound Splitter', subtitle: 'Break words into sounds!', color: 'var(--accent-purple-light, #a78bfa)', difficulty: 3 },
];

function getGameWords() {
  const currentSound = getCurrentPhonicsSound();
  if (currentSound) {
    // Get blendable words from current phonics group
    const group = PHONICS_GROUPS.find(g => g.group === currentSound.group);
    if (group && group.blendableWords.length >= 4) {
      // Map blendable words to game format
      return group.blendableWords.slice(0, 8).map(w => ({
        english: w,
        turkish: '',
        emoji: '',
      }));
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
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [playingInternal, setPlayingInternal] = useState<InternalGame | null>(null);
  const [gameWords, setGameWords] = useState(() => getGameWords());
  const { user } = useAuth();

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchGames = async () => {
    const cached = getCachedData<Game[]>('games');

    try {
      const { data, error } = await supabase
        .from('games')
        .select('*');

      if (error) throw error;
      const result = (data && data.length > 0) ? (data as Game[]) : fallbackGames as Game[];
      setGames(result);
      setCachedData('games', result, 6 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error fetching games:', error);
      if (cached && cached.length > 0) {
        setGames(cached);
      } else {
        toast.error('Oyunlar yuklenirken sorun olustu.');
        setGames(fallbackGames as Game[]);
      }
    }
  };

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
              <X size={24} /> Back
            </button>
            <span className="game-topbar-title">
              {playingInternal.emoji} {playingInternal.title}
            </span>
          </div>
          <div className="internal-game-container">
            <Suspense fallback={<div className="game-loading">Loading game...</div>}>
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
        <span className="games-hero-emoji">{'\uD83C\uDFAE'}</span>
        <h1 className="games-hero-title">Let's Play!</h1>
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
            <span className="category-circle-emoji">{cat.emoji}</span>
            <span className="category-circle-label">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="games-content">
        {/* Featured Internal Games */}
        <h2 className="games-section-title">{'\u2B50'} Our Games</h2>
        <div className="featured-games-grid">
          {filteredInternal.map(game => (
            <button
              key={game.id}
              className="featured-game-card"
              onClick={() => handlePlayInternal(game)}
              style={{ '--card-color': game.color } as React.CSSProperties}
            >
              <span className="featured-emoji">{game.emoji}</span>
              <h3 className="featured-title">{game.title}</h3>
              <p className="featured-subtitle">{game.subtitle}</p>
              <div className="difficulty-stars">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`star ${i < game.difficulty ? 'filled' : ''}`}>{'\u2B50'}</span>
                ))}
              </div>
              <div className="play-now-btn">
                <Play size={18} fill="white" /> Play!
              </div>
            </button>
          ))}
        </div>

        {/* External Wordwall games */}
        {games.length > 0 && (
          <>
            <h2 className="games-section-title">{'\uD83C\uDF1F'} More Games</h2>
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
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%236366f1" width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="white" font-size="48">\uD83C\uDFAE</text></svg>';
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
        messageTr="Oynamak icin bir oyuna dokun!"
        showOnce="mimi_guide_worldmap"
        position="bottom-left"
      />
    </div>
  );
}

export default Games;
