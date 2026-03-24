import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Heart, Lock, HeartCrack } from 'lucide-react';
import toast from 'react-hot-toast';
import MimiMascot from '../components/MimiMascot';
import { KidIcon } from '../components/ui';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch {
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
    } catch {
      toast.error('Failed to remove favorite');
    }
  };

  if (!user) {
    return (
      <div className="favorites-empty">
        <div className="empty-state-icon"><Lock size={48} /></div>
        <h2>Please Sign In</h2>
        <p>Sign in to view and manage your favorite items</p>
      </div>
    );
  }

  const filteredFavorites = activeFilter === 'all'
    ? favorites
    : favorites.filter(fav => fav.item_type === activeFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'game': return <KidIcon name="games" size={20} />;
      case 'word': return <KidIcon name="book" size={20} />;
      case 'worksheet': return <KidIcon name="learn" size={20} />;
      case 'video': return <KidIcon name="video" size={20} />;
      default: return <KidIcon name="star" size={20} />;
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
          <Heart size={32} className="favorites-header-icon" />
          Hazinelerim
        </h1>
        <p>Favori oyunların, kelimelerin ve daha fazlası!</p>
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
          <KidIcon name="games" size={16} /> Games ({favorites.filter(f => f.item_type === 'game').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'word' ? 'active' : ''}`}
          onClick={() => setActiveFilter('word')}
        >
          <KidIcon name="book" size={16} /> Words ({favorites.filter(f => f.item_type === 'word').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'worksheet' ? 'active' : ''}`}
          onClick={() => setActiveFilter('worksheet')}
        >
          <KidIcon name="learn" size={16} /> Worksheets ({favorites.filter(f => f.item_type === 'worksheet').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'video' ? 'active' : ''}`}
          onClick={() => setActiveFilter('video')}
        >
          <KidIcon name="video" size={16} /> Videos ({favorites.filter(f => f.item_type === 'video').length})
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
            <div className="empty-state-icon"><MimiMascot size={64} mood="waving" /></div>
            <h2>No Treasures Yet!</h2>
            <p>Mimi is waiting to help you collect your favorite games, words, worksheets, and videos!</p>
            <p className="hint">Tap the heart icon on any item to add it here</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card favorite-card--clickable" onClick={() => handleNavigate(favorite.item_type)}>
                <div className="favorite-type-badge">
                  {getTypeIcon(favorite.item_type)}
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
                  <HeartCrack size={16} />
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
