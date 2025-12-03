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
    title: "Animals Quiz",
    embedUrl: "https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27"
  },
  {
    id: 3,
    title: "2nd Grade Quiz",
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
    title: "Unit 1 Vocabulary",
    embedUrl: "https://wordwall.net/tr/embed/af480055f010480683a676e66fa9dda4?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/af480055f010480683a676e66fa9dda4_2"
  },
  {
    id: 6,
    title: "Action Words",
    embedUrl: "https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/896a359f89894d30906243d8619163e1_43"
  },
  {
    id: 7,
    title: "Colors Match",
    embedUrl: "https://wordwall.net/tr/embed/b54dc5c5c5fd4f7c9e4e8d5f6a3b2c1d?themeId=1&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/26648153"
  },
  {
    id: 8,
    title: "Numbers 1-20",
    embedUrl: "https://wordwall.net/tr/embed/c65ed6d6d6ge5g8d0f5f9e6g7b4c3d2e?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/30854217"
  },
  {
    id: 9,
    title: "Family Members",
    embedUrl: "https://wordwall.net/tr/embed/d76fe7e7e7hf6h9e1g6g0f7h8c5d4e3f?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/35698741"
  },
  {
    id: 10,
    title: "Body Parts",
    embedUrl: "https://wordwall.net/tr/embed/e87gf8f8f8ig7i0f2h7h1g8i9d6e5f4g?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/28547896"
  },
  {
    id: 11,
    title: "Classroom Objects",
    embedUrl: "https://wordwall.net/tr/embed/f98hg9g9g9jh8j1g3i8i2h9j0e7f6g5h?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/31254789"
  },
  {
    id: 12,
    title: "Days of the Week",
    embedUrl: "https://wordwall.net/tr/embed/g09ih0h0h0ki9k2h4j9j3i0k1f8g7h6i?themeId=22&templateId=30&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/29875412"
  }
];

const primarySchoolGames: Game[] = [
  {
    id: 101,
    title: "ABC Alphabet",
    embedUrl: "https://wordwall.net/tr/embed/c2e36b8d5f1a4e2a9b3d8f4c1e7a2b6d?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/22458796"
  },
  {
    id: 102,
    title: "Colors Rainbow",
    embedUrl: "https://wordwall.net/tr/embed/d3f47c9e6a2b5d8f1e4a7c3b9d6f2e5a?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/18965432"
  },
  {
    id: 103,
    title: "Numbers 1-10",
    embedUrl: "https://wordwall.net/tr/embed/e4a58d7f3b6c9e2a1f5d8b4c7e3a6d9f?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/25698741"
  },
  {
    id: 104,
    title: "Animal Sounds",
    embedUrl: "https://wordwall.net/tr/embed/f5b69e8a4c7d1f3e6b9a2d5f8c4e7a3b?themeId=1&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/29874563"
  },
  {
    id: 105,
    title: "Shapes Fun",
    embedUrl: "https://wordwall.net/tr/embed/a6c7d9f2e5b8a3d6f1e4c7b9a2d5f8e3?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/31254789"
  },
  {
    id: 106,
    title: "Fruits Match",
    embedUrl: "https://wordwall.net/tr/embed/b7d8e9f3a6c1d4e7b2f5a9c8d3e6f1a4?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/27896543"
  },
  {
    id: 107,
    title: "Hello Song",
    embedUrl: "https://wordwall.net/tr/embed/c8e9f1a4b7d2e5c9f3a6d1b4e7c2f5a8?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/24587963"
  },
  {
    id: 108,
    title: "My Toys",
    embedUrl: "https://wordwall.net/tr/embed/d9f1g2b5c8e3f6d0g4b7e1c9f5a8d2b6?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/32147896"
  },
  {
    id: 109,
    title: "Weather Words",
    embedUrl: "https://wordwall.net/tr/embed/e0g2h3c6d9f4g7e1h5c8f2d0g6b9e3c7?themeId=22&templateId=30&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/28965412"
  },
  {
    id: 110,
    title: "Happy Birthday",
    embedUrl: "https://wordwall.net/tr/embed/f1h3i4d7e0g5h8f2i6d9g3e1h7c0f4d8?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/26587412"
  }
];

const grade3Games: Game[] = [
  {
    id: 201,
    title: "3rd Grade Vocabulary",
    embedUrl: "https://wordwall.net/tr/embed/f5b69e8a4c7d1f3e6b9a2d5f8c4e7a3b?themeId=22&templateId=30&fontStackId=15",
    thumbnailUrl: "https://wordwall.net/tr/resource/33698521"
  },
  {
    id: 202,
    title: "Grammar Practice",
    embedUrl: "https://wordwall.net/tr/embed/a6c7d9f2e5b8a3d6f1e4c7b9a2d5f8e3?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/28547896"
  },
  {
    id: 203,
    title: "Present Continuous",
    embedUrl: "https://wordwall.net/tr/embed/g2i4j5e8f1h6i9g3j7e0h4f2i8d1g5e9?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/31254789"
  },
  {
    id: 204,
    title: "Daily Routines",
    embedUrl: "https://wordwall.net/tr/embed/h3j5k6f9g2i7j0h4k8f1i5g3j9e2h6f0?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/29874563"
  },
  {
    id: 205,
    title: "Jobs & Professions",
    embedUrl: "https://wordwall.net/tr/embed/i4k6l7g0h3j8k1i5l9g2j6h4k0f3i7g1?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/27896543"
  },
  {
    id: 206,
    title: "Places in Town",
    embedUrl: "https://wordwall.net/tr/embed/j5l7m8h1i4k9l2j6m0h3k7i5l1g4j8h2?themeId=22&templateId=30&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/32147896"
  },
  {
    id: 207,
    title: "Prepositions",
    embedUrl: "https://wordwall.net/tr/embed/k6m8n9i2j5l0m3k7n1i4l8j6m2h5k9i3?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/24587963"
  },
  {
    id: 208,
    title: "Telling Time",
    embedUrl: "https://wordwall.net/tr/embed/l7n9o0j3k6m1n4l8o2j5m9k7n3i6l0j4?themeId=1&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/28965412"
  },
  {
    id: 209,
    title: "Food & Drinks",
    embedUrl: "https://wordwall.net/tr/embed/m8o0p1k4l7n2o5m9p3k6n0l8o4j7m1k5?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/26587412"
  },
  {
    id: 210,
    title: "Transportation",
    embedUrl: "https://wordwall.net/tr/embed/n9p1q2l5m8o3p6n0q4l7o1m9p5k8n2l6?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/33145698"
  },
  {
    id: 211,
    title: "Hobbies Quiz",
    embedUrl: "https://wordwall.net/tr/embed/o0q2r3m6n9p4q7o1r5m8p2n0q6l9o3m7?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/30254789"
  },
  {
    id: 212,
    title: "Sports Match",
    embedUrl: "https://wordwall.net/tr/embed/p1r3s4n7o0q5r8p2s6n9q3o1r7m0p4n8?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/29587412"
  }
];

const grade4Games: Game[] = [
  {
    id: 301,
    title: "4th Grade Reading",
    embedUrl: "https://wordwall.net/tr/embed/b7d8e9f3a6c1d4e7b2f5a9c8d3e6f1a4?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/34256987"
  },
  {
    id: 302,
    title: "Advanced Grammar",
    embedUrl: "https://wordwall.net/tr/embed/c8e9f1a4b7d2e5c9f3a6d1b4e7c2f5a8?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/31478965"
  },
  {
    id: 303,
    title: "Past Simple Tense",
    embedUrl: "https://wordwall.net/tr/embed/q2s4t5o8p1r6s9q3t7o0r4p2s8e1q5o9?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/29874563"
  },
  {
    id: 304,
    title: "Comparative Forms",
    embedUrl: "https://wordwall.net/tr/embed/r3t5u6p9q2s7t0r4u8p1s5q3t9f2r6p0?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/28965412"
  },
  {
    id: 305,
    title: "Countries & Nationalities",
    embedUrl: "https://wordwall.net/tr/embed/s4u6v7q0r3t8u1s5v9q2t6r4u0g3s7q1?themeId=22&templateId=30&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/32147896"
  },
  {
    id: 306,
    title: "Future Will",
    embedUrl: "https://wordwall.net/tr/embed/t5v7w8r1s4u9v2t6w0r3u7s5v1h4t8r2?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/27896543"
  },
  {
    id: 307,
    title: "Irregular Verbs",
    embedUrl: "https://wordwall.net/tr/embed/u6w8x9s2t5v0w3u7x1s4v8t6w2i5u9s3?themeId=1&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/33145698"
  },
  {
    id: 308,
    title: "Question Words",
    embedUrl: "https://wordwall.net/tr/embed/v7x9y0t3u6w1x4v8y2t5w9u7x3j6v0t4?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/30254789"
  },
  {
    id: 309,
    title: "Superlative Forms",
    embedUrl: "https://wordwall.net/tr/embed/w8y0z1u4v7x2y5w9z3u6x0v8y4k7w1u5?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/29587412"
  },
  {
    id: 310,
    title: "Modal Verbs",
    embedUrl: "https://wordwall.net/tr/embed/x9z1a2v5w8y3z6x0a4v7y1w9z5l8x2v6?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/31478965"
  },
  {
    id: 311,
    title: "Reading Comprehension",
    embedUrl: "https://wordwall.net/tr/embed/y0a2b3w6x9z4a7y1b5w8z2x0a6m9y3w7?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/28547896"
  },
  {
    id: 312,
    title: "Vocabulary Challenge",
    embedUrl: "https://wordwall.net/tr/embed/z1b3c4x7y0a5b8z2c6x9a3y1b7n0z4x8?themeId=22&templateId=30&fontStackId=0",
    thumbnailUrl: "https://wordwall.net/tr/resource/34256987"
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
