import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import './Favorites.css';

interface Favorite {
  id: string;
  item_type: 'game' | 'word' | 'worksheet' | 'video';
  item_id: string;
  item_name: string;
  item_image?: string;
  created_at: string;
}

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'game' | 'word' | 'worksheet' | 'video'>('all');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success('Removed from favorites!');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (!user) {
    return (
      <div className="favorites-empty">
        <div className="empty-state-icon">🔒</div>
        <h2>Please Sign In</h2>
        <p>Sign in to view and manage your favorite items</p>
      </div>
    );
  }

  const filteredFavorites = activeFilter === 'all'
    ? favorites
    : favorites.filter(fav => fav.item_type === activeFilter);

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'game': return '🎮';
      case 'word': return '📖';
      case 'worksheet': return '📝';
      case 'video': return '🎥';
      default: return '⭐';
    }
  };

  const handleNavigate = (type: string) => {
    switch (type) {
      case 'game': navigate('/games'); break;
      case 'word': navigate('/words'); break;
      case 'worksheet': navigate('/worksheets'); break;
      case 'video': navigate('/videos'); break;
      default: navigate('/games');
    }
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>
          <Heart size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '12px' }} />
          My Treasures
        </h1>
        <p>Your favorite games, words, and more!</p>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({favorites.length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'game' ? 'active' : ''}`}
          onClick={() => setActiveFilter('game')}
        >
          🎮 Games ({favorites.filter(f => f.item_type === 'game').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'word' ? 'active' : ''}`}
          onClick={() => setActiveFilter('word')}
        >
          📖 Words ({favorites.filter(f => f.item_type === 'word').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'worksheet' ? 'active' : ''}`}
          onClick={() => setActiveFilter('worksheet')}
        >
          📝 Worksheets ({favorites.filter(f => f.item_type === 'worksheet').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'video' ? 'active' : ''}`}
          onClick={() => setActiveFilter('video')}
        >
          🎥 Videos ({favorites.filter(f => f.item_type === 'video').length})
        </button>
      </div>

      {
        loading ? (
          <div className="favorites-loading">
            <div className="spinner-large"></div>
            <p>Loading your favorites...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="favorites-empty">
            <div className="empty-state-icon">💝</div>
            <h2>No Favorites Yet</h2>
            <p>Start adding your favorite games, words, worksheets, and videos!</p>
            <p className="hint">Click the ❤️ icon on any item to add it here</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card" onClick={() => handleNavigate(favorite.item_type)} style={{ cursor: 'pointer' }}>
                <div className="favorite-type-badge">
                  {getTypeEmoji(favorite.item_type)}
                </div>
                {favorite.item_image && (
                  <div className="favorite-image">
                    <img src={favorite.item_image} alt={favorite.item_name} />
                  </div>
                )}
                <div className="favorite-content">
                  <h3>{favorite.item_name}</h3>
                  <span className="favorite-type-label">
                    {favorite.item_type.charAt(0).toUpperCase() + favorite.item_type.slice(1)}
                  </span>
                </div>
                <button
                  className="remove-favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(favorite.id);
                  }}
                  title="Remove from favorites"
                >
                  💔
                </button>
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default Favorites;
