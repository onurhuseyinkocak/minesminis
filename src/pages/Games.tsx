import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import './Games.css';

type Game = {
  id: number;
  title: string;
  embedUrl: string;
  thumbnailUrl: string;
  type: string;
};

const grade2Games: Game[] = [
  {
    id: 1,
    title: "2nd Grade Revision",
    embedUrl: "https://wordwall.net/tr/embed/a27e67c8682a4be9a3503f499c937fcc?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/a27e67c8682a4be9a3503f499c937fcc_21",
    type: "Maze Chase"
  },
  {
    id: 2,
    title: "Animals Quiz",
    embedUrl: "https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27",
    type: "Match Up"
  },
  {
    id: 3,
    title: "2nd Grade Quiz",
    embedUrl: "https://wordwall.net/tr/embed/7069b22dfc384f9ba0e1c7de9f1fb835?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/7069b22dfc384f9ba0e1c7de9f1fb835_44",
    type: "Quiz"
  },
  {
    id: 4,
    title: "Simple Past Questions",
    embedUrl: "https://wordwall.net/tr/embed/03dd454cab56495a82a08d631b357b9b?themeId=22&templateId=30&fontStackId=15",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/03dd454cab56495a82a08d631b357b9b_22",
    type: "Open Box"
  },
  {
    id: 5,
    title: "Unit 1 Vocabulary",
    embedUrl: "https://wordwall.net/tr/embed/af480055f010480683a676e66fa9dda4?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/af480055f010480683a676e66fa9dda4_2",
    type: "Quiz"
  },
  {
    id: 6,
    title: "Action Words",
    embedUrl: "https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/896a359f89894d30906243d8619163e1_43",
    type: "Whack-a-Mole"
  }
];

const primarySchoolGames: Game[] = [];

const grade3Games: Game[] = [];

const grade4Games: Game[] = [];

function Games() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('grade2');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'game');

      if (error) throw error;

      const favoriteIds = new Set(data.map(fav => parseInt(fav.item_id)));
      setFavorites(favoriteIds);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading favorites:', error);
      }
    }
  };

  const selectedGameData = [...primarySchoolGames, ...grade2Games, ...grade3Games, ...grade4Games]
    .find(game => game.id === selectedGame);

  const getActiveGames = (): Game[] => {
    switch (activeSection) {
      case 'primary': return primarySchoolGames;
      case 'grade2': return grade2Games;
      case 'grade3': return grade3Games;
      case 'grade4': return grade4Games;
      default: return grade2Games;
    }
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
          .eq('user_id', user.id)
          .eq('item_id', game.id.toString())
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
            user_id: user.id,
            item_type: 'game',
            item_id: game.id.toString(),
            item_name: game.title,
            item_image: game.thumbnailUrl
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

  const getGameTypeColor = (type: string) => {
    switch (type) {
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
      <div className="games-header">
        <h1>🎮 Games</h1>
        <p>Fun and educational games for every grade</p>
      </div>

      <div className="grade-tabs">
        <button
          onClick={() => setActiveSection('primary')}
          className={`grade-tab ${activeSection === 'primary' ? 'active' : ''}`}
        >
          🌟 Primary School
        </button>
        <button
          onClick={() => setActiveSection('grade2')}
          className={`grade-tab ${activeSection === 'grade2' ? 'active' : ''}`}
        >
          📚 2nd Grade
        </button>
        <button
          onClick={() => setActiveSection('grade3')}
          className={`grade-tab ${activeSection === 'grade3' ? 'active' : ''}`}
        >
          📖 3rd Grade
        </button>
        <button
          onClick={() => setActiveSection('grade4')}
          className={`grade-tab ${activeSection === 'grade4' ? 'active' : ''}`}
        >
          🎓 4th Grade
        </button>
      </div>

      <div className="games-content">
        {activeGames.length === 0 ? (
          <div className="games-empty">
            <div className="empty-icon">🎯</div>
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
                    {favorites.has(game.id) ? '❤️' : '🤍'}
                  </button>
                )}

                <div
                  className="game-thumbnail"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <img
                    src={game.thumbnailUrl}
                    alt={game.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%236366f1" width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="white" font-size="48">🎮</text></svg>';
                    }}
                  />
                  <div className="game-overlay">
                    <span className="play-icon">▶️</span>
                  </div>
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <span 
                    className="game-type-badge"
                    style={{ backgroundColor: getGameTypeColor(game.type) }}
                  >
                    {game.type}
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
                ✖️
              </button>
            </div>

            <div className="game-iframe-container">
              <iframe
                src={selectedGameData.embedUrl}
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
