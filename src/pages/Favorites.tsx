import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { supabase } from '../config/supabase';
import { Heart, Lock, HeartCrack } from 'lucide-react';
import toast from 'react-hot-toast';
import LottieCharacter from '../components/LottieCharacter';
import { KidIcon } from '../components/ui';
import { getCardThumbnailUrl } from '../utils/imageTransform';

interface Favorite {
  id: string;
  item_type: 'game' | 'word' | 'worksheet' | 'video';
  item_id: string;
  item_name: string;
  item_image?: string;
  created_at: string;
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

function FavCardSkeleton() {
  return <div className="w-[calc(50%-6px)] aspect-square rounded-3xl bg-gray-100 animate-pulse" />;
}

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  usePageTitle('Favorilerim', 'Favorites');
  const isTr = lang === 'tr';
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadFavorites(); }, [user]);

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
    } catch { toast.error(isTr ? 'Favoriler yuklenemedi.' : 'Failed to load favorites'); }
    finally { setLoading(false); }
  };

  const removeFavorite = async (favoriteId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('favorites').delete().eq('id', favoriteId).eq('user_id', user.uid);
      if (error) throw error;
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success(isTr ? 'Kaldirildi!' : 'Removed!');
    } catch { toast.error(isTr ? 'Favori kaldirilamadi.' : 'Failed to remove'); }
  };

  const handleNavigate = (type: string, itemId?: string) => {
    switch (type) {
      case 'game': navigate('/games'); break;
      case 'word': navigate('/words'); break;
      case 'worksheet': navigate('/worksheets'); break;
      case 'video': navigate(itemId ? `/videos/${itemId}` : '/videos'); break;
      default: navigate('/games');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'game': return <KidIcon name="games" size={18} />;
      case 'word': return <KidIcon name="book" size={18} />;
      case 'worksheet': return <KidIcon name="learn" size={18} />;
      case 'video': return <KidIcon name="video" size={18} />;
      default: return <KidIcon name="star" size={18} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center"><Lock size={28} className="text-pink-400" /></div>
        <h1 className="text-xl font-bold text-gray-800">{isTr ? 'Giris Yap' : 'Sign In'}</h1>
        <p className="text-sm text-gray-500">{isTr ? 'Favorilerini gormek icin giris yap.' : 'Sign in to see your favorites.'}</p>
        <Link to="/login" className="h-12 px-6 rounded-2xl bg-pink-500 text-white font-bold flex items-center active:scale-95 transition-transform">
          {isTr ? 'Giris Yap' : 'Sign In'}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-pink-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
            <Heart size={20} className="text-pink-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 flex-1">{isTr ? 'Hazinelerim' : 'My Favorites'}</h1>
          <span className="text-sm text-gray-400 font-medium">{favorites.length}</span>
        </div>
      </div>

      <div className="pt-4">
        {loading ? (
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map(i => <FavCardSkeleton key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center gap-4">
            <LottieCharacter state="idle" size={80} />
            <h2 className="text-lg font-bold text-gray-800">{isTr ? 'Henuz Hazine Yok!' : 'No Treasures Yet!'}</h2>
            <p className="text-sm text-gray-500 max-w-xs">{isTr ? 'Kalp simgesine dokunarak favorilerine ekle!' : 'Tap the heart icon to add favorites!'}</p>
            <Link to="/games" className="h-12 px-6 rounded-2xl bg-pink-500 text-white font-bold flex items-center active:scale-95 transition-transform">
              {isTr ? 'Kesfet' : 'Explore'}
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {favorites.map((fav, idx) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: Math.min(idx * 0.05, 0.5) }}
                className="relative w-[calc(50%-6px)] rounded-3xl bg-white border-2 border-gray-100 shadow-sm overflow-hidden active:scale-95 transition-transform cursor-pointer"
                onClick={() => handleNavigate(fav.item_type, fav.item_id)}
              >
                {fav.item_image ? (
                  <img
                    src={getCardThumbnailUrl(fav.item_image) ?? fav.item_image ?? ''}
                    alt={fav.item_name}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    {getTypeIcon(fav.item_type)}
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{fav.item_name}</h3>
                </div>
                {/* Type badge */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-xl bg-white/90 flex items-center justify-center shadow-sm">
                  {getTypeIcon(fav.item_type)}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-white/90 flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  aria-label="Remove"
                >
                  <HeartCrack size={14} className="text-pink-400" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
