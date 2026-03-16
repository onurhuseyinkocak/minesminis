import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { fallbackGames } from '../data/fallbackData';
import toast from 'react-hot-toast';
import { Gamepad2, Sparkles, BookOpen, Library, GraduationCap, Target, Heart, Play, X } from 'lucide-react';
import ContentPageHeader from '../components/ContentPageHeader';
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

function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('grade2');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchGames();
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
  }, [user]);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*');

      if (error) throw error;
      setGames((data && data.length > 0) ? (data as Game[]) : fallbackGames as Game[]);
    } catch (error) {
      console.error('Error fetching games, using fallback:', error);
      toast.error('Oyunlar yüklenirken sorun oluştu. Varsayılan liste gösteriliyor.');
      setGames(fallbackGames as Game[]);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.uid)
        .eq('item_type', 'game');

      if (error) throw error;

      const favoriteIds = new Set(data.map(fav => fav.item_id));
      setFavorites(favoriteIds);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading favorites:', error);
      }
    }
  };

  const selectedGameData = games.find(game => game.id === selectedGame);

  const getActiveGames = (): Game[] => {
    return games.filter(game => {
      const grade = (game as Game & { target_audience?: string }).target_audience ?? game.category;
      return (activeSection === 'primary' && (grade === 'primary' || grade === '1')) ||
        (activeSection === 'grade2' && grade === '2') ||
        (activeSection === 'grade3' && grade === '3') ||
        (activeSection === 'grade4' && grade === '4') ||
        game.category === activeSection;
    });
  };

  const activeGames = getActiveGames();

  const handleToggleFavorite = async (game: Game) => {
    if (!user) {
      toast.error('Please sign in to add favorites!');
      return;
    }

    const isFavorite = favorites.has(game.id);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.uid)
          .eq('item_id', game.id)
          .eq('item_type', 'game');

        if (error) throw error;

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(game.id);
          return newSet;
        });
        toast.success('Removed from favorites!');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.uid,
            item_type: 'game',
            item_id: game.id,
            item_name: game.title,
            item_image: game.thumbnail_url
          });

        if (error) throw error;

        setFavorites(prev => new Set(prev).add(game.id));
        toast.success('Added to favorites!');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error toggling favorite:', error);
      }
      toast.error('Failed to update favorites');
    }
  };

  const getGameTypeColor = (description: string) => {
    switch (description) {
      case 'Maze Chase': return '#667eea';
      case 'Match Up': return '#4ECDC4';
      case 'Quiz': return '#FF6B6B';
      case 'Whack-a-Mole': return '#FFD93D';
      case 'Open Box': return '#a78bfa';
      default: return '#667eea';
    }
  };

  return (
    <div className="games-page">
      <ContentPageHeader
        icon={Gamepad2}
        title="Arcade Hub"
        description="Epic adventures and fun games await you!"
        iconColor="#6366f1"
        filterSlot={
          <div className="modern-tabs">
            <button
              onClick={() => setActiveSection('primary')}
              className={`modern-tab ${activeSection === 'primary' ? 'active' : ''}`}
            >
              <Sparkles size={18} /> Primary School
            </button>
            <button
              onClick={() => setActiveSection('grade2')}
              className={`modern-tab ${activeSection === 'grade2' ? 'active' : ''}`}
            >
              <BookOpen size={18} /> 2nd Grade
            </button>
            <button
              onClick={() => setActiveSection('grade3')}
              className={`modern-tab ${activeSection === 'grade3' ? 'active' : ''}`}
            >
              <Library size={18} /> 3rd Grade
            </button>
            <button
              onClick={() => setActiveSection('grade4')}
              className={`modern-tab ${activeSection === 'grade4' ? 'active' : ''}`}
            >
              <GraduationCap size={18} /> 4th Grade
            </button>
          </div>
        }
      />

      <div className="games-content">
        {activeGames.length === 0 ? (
          <div className="games-empty">
            <div className="empty-icon"><Target size={48} /></div>
            <h3>Coming Soon!</h3>
            <p>New games for this grade are on the way! Check back soon!</p>
            <p className="empty-suggestion">Try <strong>2nd Grade</strong> games in the meantime!</p>
          </div>
        ) : (
          <div className="games-grid">
            {activeGames.map((game) => (
              <div
                key={game.id}
                className="game-card"
              >
                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(game);
                    }}
                    className={`game-favorite-btn ${favorites.has(game.id) ? 'favorited' : ''}`}
                    title={favorites.has(game.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.has(game.id) ? <Heart size={20} fill="#FF6B6B" color="#FF6B6B" /> : <Heart size={20} color="#ccc" />}
                  </button>
                )}

                <div
                  className="game-thumbnail"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <img
                    src={game.thumbnail_url}
                    alt={game.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%236366f1" width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="white" font-size="48">🎮</text></svg>';
                    }}
                  />
                  <div className="game-overlay">
                    <span className="play-icon"><Play size={32} fill="white" /></span>
                  </div>
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <span
                    className="game-type-badge"
                    style={{ backgroundColor: getGameTypeColor(game.description) }}
                  >
                    {game.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                title={selectedGameData.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Games;
