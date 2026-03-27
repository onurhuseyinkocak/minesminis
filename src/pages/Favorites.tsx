import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { supabase } from '../config/supabase';
import { Heart, Lock, HeartCrack } from 'lucide-react';
import toast from 'react-hot-toast';
import LottieCharacter from '../components/LottieCharacter';
import { KidIcon } from '../components/ui';
import { getCardThumbnailUrl } from '../utils/imageTransform';
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
  const { lang } = useLanguage();
  usePageTitle('Favorilerim', 'Favorites');
  const isTr = lang === 'tr';
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
        .select('id, item_type, item_id, item_name, item_image, created_at')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      setFavorites(data || []);
    } catch {
      toast.error(isTr ? 'Favoriler yüklenemedi.' : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.uid);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success(isTr ? 'Favorilerden kaldırıldı!' : 'Removed from favorites!');
    } catch {
      toast.error(isTr ? 'Favori kaldırılamadı.' : 'Failed to remove favorite');
    }
  };

  if (!user) {
    return (
      <div className="favorites-empty">
        <div className="empty-state-icon"><Lock size={40} /></div>
        <h1>{isTr ? 'Giriş Yapmalısınız' : 'Please Sign In'}</h1>
        <p>{isTr ? 'Favorilerinizi görüntülemek için giriş yapın.' : 'Sign in to view and manage your favorite items.'}</p>
        <Link to="/login" className="favorites-signin-link">
          {isTr ? 'Giriş Yap' : 'Sign In'}
        </Link>
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

  const handleNavigate = (type: string, itemId?: string) => {
    switch (type) {
      case 'game': navigate(itemId ? `/games/${itemId}` : '/games'); break;
      case 'word': navigate('/words'); break;
      case 'worksheet': navigate('/worksheets'); break;
      case 'video': navigate(itemId ? `/videos/${itemId}` : '/videos'); break;
      default: navigate('/games');
    }
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>
          <Heart size={32} className="favorites-header-icon" />
          {isTr ? 'Hazinelerim' : 'My Favorites'}
        </h1>
        <p>{isTr ? 'Favori oyunların, kelimelerin ve daha fazlası!' : 'Your favorite games, words, and more!'}</p>
      </div>

      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          {isTr ? 'Tümü' : 'All'} ({favorites.length})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'game' ? 'active' : ''}`}
          onClick={() => setActiveFilter('game')}
        >
          <KidIcon name="games" size={16} /> {isTr ? 'Oyunlar' : 'Games'} ({favorites.filter(f => f.item_type === 'game').length})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'word' ? 'active' : ''}`}
          onClick={() => setActiveFilter('word')}
        >
          <KidIcon name="book" size={16} /> {isTr ? 'Kelimeler' : 'Words'} ({favorites.filter(f => f.item_type === 'word').length})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'worksheet' ? 'active' : ''}`}
          onClick={() => setActiveFilter('worksheet')}
        >
          <KidIcon name="learn" size={16} /> {isTr ? 'Çalışmalar' : 'Worksheets'} ({favorites.filter(f => f.item_type === 'worksheet').length})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'video' ? 'active' : ''}`}
          onClick={() => setActiveFilter('video')}
        >
          <KidIcon name="video" size={16} /> {isTr ? 'Videolar' : 'Videos'} ({favorites.filter(f => f.item_type === 'video').length})
        </button>
      </div>

      {
        loading ? (
          <div className="favorites-loading">
            <div className="spinner-large"></div>
            <p>{isTr ? 'Favorileriniz yükleniyor...' : 'Loading your favorites...'}</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="favorites-empty">
            <div className="empty-state-icon">
              <LottieCharacter state="idle" size={56} />
            </div>
            <h2>{isTr ? 'Henüz Hazine Yok!' : 'No Treasures Yet!'}</h2>
            <p>{isTr ? 'Favori oyunlarını, kelimelerini, çalışmalarını ve videolarını topla!' : 'Collect your favorite games, words, worksheets, and videos!'}</p>
            <p className="hint">{isTr ? 'Herhangi bir öğenin kalp simgesine dokun ve buraya ekle.' : 'Tap the heart icon on any item to add it here.'}</p>
            <Link to="/games" className="favorites-empty-cta">
              {isTr ? 'Keşfetmeye Başla' : 'Start Exploring'}
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card favorite-card--clickable" onClick={() => handleNavigate(favorite.item_type, favorite.item_id)}>
                <div className="favorite-type-badge">
                  {getTypeIcon(favorite.item_type)}
                </div>
                {favorite.item_image && (
                  <div className="favorite-image">
                    <img src={getCardThumbnailUrl(favorite.item_image) ?? favorite.item_image ?? ''} alt={favorite.item_name} loading="lazy" width={200} height={200} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
                <div className="favorite-content">
                  <h3>{favorite.item_name}</h3>
                  <span className="favorite-type-label">
                    {isTr
                      ? { game: 'Oyun', word: 'Kelime', worksheet: 'Çalışma', video: 'Video' }[favorite.item_type] ?? favorite.item_type
                      : favorite.item_type.charAt(0).toUpperCase() + favorite.item_type.slice(1)}
                  </span>
                </div>
                <button
                  type="button"
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
