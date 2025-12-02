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
};

const grade2Games: Game[] = [
  {
    id: 1,
    title: "2nd Grade 1st Revision",
    embedUrl: "https://wordwall.net/tr/embed/a27e67c8682a4be9a3503f499c937fcc?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/a27e67c8682a4be9a3503f499c937fcc_21"
  },
  {
    id: 2,
    title: "2nd grade animals 2",
    embedUrl: "https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27"
  },
  {
    id: 3,
    title: "2nd grade quiz",
    embedUrl: "https://wordwall.net/tr/embed/7069b22dfc384f9ba0e1c7de9f1fb835?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/7069b22dfc384f9ba0e1c7de9f1fb835_44"
  },
  {
    id: 4,
    title: "Simple Past Questions",
    embedUrl: "https://wordwall.net/tr/embed/03dd454cab56495a82a08d631b357b9b?themeId=22&templateId=30&fontStackId=15",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/03dd454cab56495a82a08d631b357b9b_22"
  },
  {
    id: 5,
    title: "2nd grade 1st unit",
    embedUrl: "https://wordwall.net/tr/embed/af480055f010480683a676e66fa9dda4?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/af480055f010480683a676e66fa9dda4_2"
  },
  {
    id: 6,
    title: "Action words",
    embedUrl: "https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/896a359f89894d30906243d8619163e1_43"
  }
];

const primarySchoolGames: Game[] = [
  {
    id: 101,
    title: "ABC Learning Game",
    embedUrl: "https://wordwall.net/tr/embed/c2e36b8d5f1a4e2a9b3d8f4c1e7a2b6d?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 102,
    title: "Colors & Shapes",
    embedUrl: "https://wordwall.net/tr/embed/d3f47c9e6a2b5d8f1e4a7c3b9d6f2e5a?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 103,
    title: "Numbers 1-10",
    embedUrl: "https://wordwall.net/tr/embed/e4a58d7f3b6c9e2a1f5d8b4c7e3a6d9f?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

const grade3Games: Game[] = [
  {
    id: 201,
    title: "3rd Grade Vocabulary",
    embedUrl: "https://wordwall.net/tr/embed/f5b69e8a4c7d1f3e6b9a2d5f8c4e7a3b?themeId=22&templateId=30&fontStackId=15",
    thumbnailUrl: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 202,
    title: "Grammar Practice",
    embedUrl: "https://wordwall.net/tr/embed/a6c7d9f2e5b8a3d6f1e4c7b9a2d5f8e3?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://images.pexels.com/photos/4145356/pexels-photo-4145356.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

const grade4Games: Game[] = [
  {
    id: 301,
    title: "4th Grade Reading",
    embedUrl: "https://wordwall.net/tr/embed/b7d8e9f3a6c1d4e7b2f5a9c8d3e6f1a4?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 302,
    title: "Advanced Grammar",
    embedUrl: "https://wordwall.net/tr/embed/c8e9f1a4b7d2e5c9f3a6d1b4e7c2f5a8?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

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
          Primary School
        </button>
        <button
          onClick={() => setActiveSection('grade2')}
          className={`grade-tab ${activeSection === 'grade2' ? 'active' : ''}`}
        >
          2nd Grade
        </button>
        <button
          onClick={() => setActiveSection('grade3')}
          className={`grade-tab ${activeSection === 'grade3' ? 'active' : ''}`}
        >
          3rd Grade
        </button>
        <button
          onClick={() => setActiveSection('grade4')}
          className={`grade-tab ${activeSection === 'grade4' ? 'active' : ''}`}
        >
          4th Grade
        </button>
      </div>

      <div className="games-content">
        {activeGames.length === 0 ? (
          <div className="games-empty">
            <div className="empty-icon">🎯</div>
            <h3>No games yet in this section</h3>
            <p>New games coming soon!</p>
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
                  />
                  <div className="game-overlay">
                    <span className="play-icon">▶️</span>
                  </div>
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGame && selectedGameData && (
        <div className="game-modal-overlay">
          <div className="game-modal">
            <button
              onClick={() => setSelectedGame(null)}
              className="game-modal-close"
            >
              ✖️
            </button>

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
      )}
    </div>
  );
}

export default Games;
