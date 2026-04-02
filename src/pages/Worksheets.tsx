import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { errorLogger } from '../services/errorLogger';
import { fallbackWorksheets } from '../data/fallbackData';
import { getCachedData, setCachedData } from '../utils/offlineManager';
import toast from 'react-hot-toast';
import LottieCharacter from '../components/LottieCharacter';
import {
  Printer, Heart, BookOpen, PenTool, Languages, Music,
  ExternalLink, FileText, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';

type Worksheet = {
  id: string;
  title: string;
  description: string;
  category: string;
  grade: string;
  thumbnail_url?: string;
  external_url: string;
  source: string;
};

const CATEGORY_CONFIG: Record<string, { icon: typeof FileText; color: string }> = {
  Vocabulary: { icon: BookOpen, color: '#6366f1' },
  Grammar: { icon: Languages, color: '#10b981' },
  Reading: { icon: FileText, color: '#f59e0b' },
  Writing: { icon: PenTool, color: '#ec4899' },
  Phonics: { icon: Music, color: '#8b5cf6' },
};

function Worksheets() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { trackActivity, addXP } = useGamification();
  const { t, lang } = useLanguage();
  usePageTitle('Calisma Kagitlari', 'Worksheets');

  useEffect(() => {
    fetchWorksheets();
    if (user) loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
  }, [user]);

  const fetchWorksheets = async () => {
    const cached = getCachedData<Worksheet[]>('worksheets');
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('worksheets')
        .select('id, title, description, subject, grade, thumbnail_url, file_url, source');
      if (error) throw error;
      let result: Worksheet[];
      if (data && data.length > 0) {
        result = data.map(ws => ({
          id: ws.id, title: ws.title, description: ws.description,
          category: ws.subject, grade: ws.grade, thumbnail_url: ws.thumbnail_url,
          external_url: ws.file_url, source: 'MinesMinis',
        }));
      } else {
        result = fallbackWorksheets;
      }
      setWorksheets(result);
      setCachedData('worksheets', result, 6 * 60 * 60 * 1000);
    } catch (error) {
      errorLogger.log({ severity: 'high', message: 'Error fetching worksheets', component: 'Worksheets', metadata: { error: String(error) } });
      toast.error(lang === 'tr' ? 'Calisma kagitlari yuklenirken sorun olustu.' : 'Failed to load worksheets.');
      if (cached && cached.length > 0) setWorksheets(cached);
      else setWorksheets(fallbackWorksheets);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('favorites').select('item_id')
        .eq('user_id', user.uid).eq('item_type', 'worksheet');
      if (error) throw error;
      setFavorites(new Set(data.map(fav => fav.item_id)));
    } catch (error) {
      errorLogger.log({ severity: 'medium', message: 'Error loading favorites', component: 'Worksheets', metadata: { error: String(error) } });
    }
  };

  const handleToggleFavorite = async (worksheet: Worksheet) => {
    if (!user) {
      toast.error(lang === 'tr' ? 'Favori eklemek icin giris yap!' : 'Please sign in to add favorites!');
      return;
    }
    const isFavorite = favorites.has(worksheet.id);
    try {
      if (isFavorite) {
        const { error } = await supabase.from('favorites').delete()
          .eq('user_id', user.uid).eq('item_id', worksheet.id).eq('item_type', 'worksheet');
        if (error) throw error;
        setFavorites(prev => { const s = new Set(prev); s.delete(worksheet.id); return s; });
        toast.success(lang === 'tr' ? 'Favorilerden kaldirildi!' : 'Removed from favorites!');
      } else {
        const { error } = await supabase.from('favorites').insert({
          user_id: user.uid, item_type: 'worksheet', item_id: worksheet.id,
          item_name: worksheet.title,
          item_image: worksheet.thumbnail_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300',
        });
        if (error) throw error;
        setFavorites(prev => new Set(prev).add(worksheet.id));
        toast.success(lang === 'tr' ? 'Favorilere eklendi!' : 'Added to favorites!');
      }
    } catch (error) {
      errorLogger.log({ severity: 'medium', message: 'Error toggling favorite', component: 'Worksheets', metadata: { error: String(error) } });
      toast.error(lang === 'tr' ? 'Favori guncellenemedi' : 'Failed to update favorites');
    }
  };

  const handleWorksheetAction = async (worksheet: Worksheet) => {
    try {
      if (user) {
        await trackActivity('worksheet_completed', { worksheetId: worksheet.id, title: worksheet.title });
        await addXP(15, 'worksheet_completed');
        toast.success(lang === 'tr' ? 'Pratik yaptigin icin 15 XP kazandin!' : 'You earned 15 XP for practicing!');
      }
    } catch (err) {
      errorLogger.log({ severity: 'low', message: 'Error tracking activity', component: 'Worksheets', metadata: { error: String(err) } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-6 pb-24 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-emerald-100 mb-3">
          <FileText size={28} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {t('worksheets.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('worksheets.description')}</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={40} className="text-emerald-500 animate-spin" />
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        </div>
      )}

      {/* Worksheet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {worksheets.map(worksheet => {
            const cfg = CATEGORY_CONFIG[worksheet.category] || { icon: FileText, color: '#6366f1' };
            const Icon = cfg.icon;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                key={worksheet.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100"
              >
                {/* Color header */}
                <div
                  className="h-20 flex items-center justify-center relative"
                  style={{ backgroundColor: cfg.color + '18' }}
                >
                  <Icon size={32} style={{ color: cfg.color }} />
                  {user && (
                    <button
                      type="button"
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80"
                      onClick={() => handleToggleFavorite(worksheet)}
                      aria-label={favorites.has(worksheet.id) ? 'Remove favorite' : 'Add favorite'}
                    >
                      <Heart
                        size={16}
                        className={favorites.has(worksheet.id) ? 'text-red-500' : 'text-gray-400'}
                        fill={favorites.has(worksheet.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  )}
                  <span
                    className="absolute bottom-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {worksheet.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2">
                    {worksheet.title}
                  </h3>
                  <div className="flex gap-1.5">
                    <a
                      href={worksheet.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleWorksheetAction(worksheet)}
                      className="flex-1 flex items-center justify-center gap-1 min-h-[48px] rounded-2xl text-xs font-bold text-white"
                      style={{ backgroundColor: cfg.color }}
                    >
                      <ExternalLink size={14} />
                      {t('worksheets.open')}
                    </a>
                    <button
                      type="button"
                      className="flex items-center justify-center w-12 min-h-[48px] rounded-2xl bg-gray-100 text-gray-600"
                      onClick={() => {
                        handleWorksheetAction(worksheet);
                        const win = window.open(worksheet.external_url, '_blank');
                        if (win) {
                          win.addEventListener('load', () => {
                            try { win.print(); } catch { /* ignore */ }
                          });
                        }
                      }}
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {!isLoading && worksheets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <LottieCharacter state="thinking" size={64} />
          <h3 className="text-lg font-bold text-gray-700">{t('worksheets.noWorksheetsFound')}</h3>
          <p className="text-sm text-gray-500">{t('worksheets.noWorksheetsDesc')}</p>
        </div>
      )}
    </div>
  );
}

export default Worksheets;
