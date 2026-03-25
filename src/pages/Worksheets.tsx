import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { errorLogger } from '../services/errorLogger';
import { fallbackWorksheets } from '../data/fallbackData';
import { getCachedData, setCachedData } from '../utils/offlineManager';
import toast from 'react-hot-toast';
import LottieCharacter from '../components/LottieCharacter';
import {
  Printer,
  Heart,
  GraduationCap,
  Library,
  BookOpen,
  PenTool,
  Languages,
  Music,
  Layout,
  ExternalLink,
  FileText,
  Gamepad2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import ContentPageHeader from '../components/ContentPageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import './Worksheets.css';

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

const categories = ['All', 'Vocabulary', 'Grammar', 'Reading', 'Writing', 'Phonics'];

function Worksheets() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGrade, setActiveGrade] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { trackActivity, addXP } = useGamification();
  const { t } = useLanguage();

  useEffect(() => {
    fetchWorksheets();
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
  }, [user]);

  const fetchWorksheets = async () => {
    // Try localStorage cache for instant load
    const cached = getCachedData<Worksheet[]>('worksheets');
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('worksheets')
        .select('*');

      if (error) throw error;

      let result: Worksheet[];
      if (data && data.length > 0) {
        result = data.map(ws => ({
          id: ws.id,
          title: ws.title,
          description: ws.description,
          category: ws.subject,
          grade: ws.grade,
          thumbnail_url: ws.thumbnail_url,
          external_url: ws.file_url,
          source: 'MinesMinis'
        }));
      } else {
        result = fallbackWorksheets;
      }
      setWorksheets(result);
      // Persist to localStorage (TTL: 6 hours)
      setCachedData('worksheets', result, 6 * 60 * 60 * 1000);
    } catch (error) {
      errorLogger.log({ severity: 'high', message: 'Error fetching worksheets', component: 'Worksheets', metadata: { error: String(error) } });
      toast.error(navigator.language.startsWith('tr') ? 'Calisma kagitlari yuklenirken sorun olustu.' : 'Failed to load worksheets.');
      if (cached && cached.length > 0) {
        setWorksheets(cached);
      } else {
        setWorksheets(fallbackWorksheets);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.uid)
        .eq('item_type', 'worksheet');

      if (error) throw error;

      const favoriteIds = new Set(data.map(fav => fav.item_id));
      setFavorites(favoriteIds);
    } catch (error) {
      errorLogger.log({ severity: 'medium', message: 'Error loading favorites', component: 'Worksheets', metadata: { error: String(error) } });
    }
  };

  const handleToggleFavorite = async (worksheet: Worksheet) => {
    if (!user) {
      toast.error('Please sign in to add favorites!');
      return;
    }

    const isFavorite = favorites.has(worksheet.id);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.uid)
          .eq('item_id', worksheet.id)
          .eq('item_type', 'worksheet');

        if (error) throw error;

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(worksheet.id);
          return newSet;
        });
        toast.success('Removed from favorites!');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.uid,
            item_type: 'worksheet',
            item_id: worksheet.id,
            item_name: worksheet.title,
            item_image: worksheet.thumbnail_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300'
          });

        if (error) throw error;

        setFavorites(prev => new Set(prev).add(worksheet.id));
        toast.success('Added to favorites!');
      }
    } catch (error) {
      errorLogger.log({ severity: 'medium', message: 'Error toggling favorite', component: 'Worksheets', metadata: { error: String(error) } });
      toast.error('Failed to update favorites');
    }
  };

  const filteredWorksheets = worksheets.filter(ws => {
    const gradeMatch = activeGrade === 'All' || ws.grade === activeGrade;
    const categoryMatch = activeCategory === 'All' || ws.category === activeCategory;
    return gradeMatch && categoryMatch;
  });

  const handleWorksheetAction = async (worksheet: Worksheet) => {
    try {
      if (user) {
        await trackActivity('worksheet_completed', { worksheetId: worksheet.id, title: worksheet.title });
        await addXP(15, 'worksheet_completed');
        toast.success('You earned 15 XP for practicing!');
      }
    } catch (err) {
      errorLogger.log({ severity: 'low', message: 'Error tracking activity', component: 'Worksheets', metadata: { error: String(err) } });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Vocabulary': return <BookOpen size={20} />;
      case 'Grammar': return <Languages size={20} />;
      case 'Reading': return <Library size={20} />;
      case 'Writing': return <PenTool size={20} />;
      case 'Phonics': return <Music size={20} />;
      default: return <Layout size={20} />;
    }
  }

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case '2': return <GraduationCap size={20} />;
      case '3': return <GraduationCap size={20} />;
      case '4': return <GraduationCap size={20} />;
      default: return <GraduationCap size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vocabulary': return 'var(--accent-indigo)';
      case 'Grammar': return 'var(--accent-emerald)';
      case 'Reading': return 'var(--warning)';
      case 'Writing': return 'var(--accent-pink)';
      case 'Phonics': return 'var(--accent-purple)';
      default: return 'var(--accent-indigo)';
    }
  };


  return (
    <div className="worksheets-page">
      <ContentPageHeader
        icon={FileText}
        title={t('worksheets.title')}
        description={t('worksheets.description')}
        iconColor="var(--accent-emerald)"
        filterSlot={
          <div className="modern-tabs">
            <button
              onClick={() => setActiveGrade('All')}
              className={`modern-tab ${activeGrade === 'All' ? 'active' : ''}`}
            >
              {t('worksheets.allGrades')}
            </button>
            <button
              onClick={() => setActiveGrade('2')}
              className={`modern-tab ${activeGrade === '2' ? 'active' : ''}`}
            >
              {t('worksheets.grade2')}
            </button>
            <button
              onClick={() => setActiveGrade('3')}
              className={`modern-tab ${activeGrade === '3' ? 'active' : ''}`}
            >
              {t('worksheets.grade3')}
            </button>
            <button
              onClick={() => setActiveGrade('4')}
              className={`modern-tab ${activeGrade === '4' ? 'active' : ''}`}
            >
              {t('worksheets.grade4')}
            </button>
          </div>
        }
      />

      <div className="controls-section">
        <div className="filters-wrapper">
          {/* Grade filter removed as it's now in ContentPageHeader */}

          <div className="filter-item">
            <label htmlFor="category-filter">{t('worksheets.subject')}:</label>
            <select
              id="category-filter"
              className="filter-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="All">{t('worksheets.allSubjects')}</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="worksheets-count">
        {t('worksheets.showing')} <strong>{filteredWorksheets.length}</strong> {t('worksheets.worksheetsLabel')}
      </div>

      {isLoading && (
        <div className="worksheets-loading">
          <Loader2 size={40} className="worksheets-loading__spinner" />
          <p>{t('common.loading')}</p>
        </div>
      )}

      <div className="worksheets-grid">
        <AnimatePresence mode="popLayout">
          {filteredWorksheets.map(worksheet => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={worksheet.id}
              className="worksheet-card"
            >
              <div className="worksheet-thumbnail">
                <img
                  src={worksheet.thumbnail_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300'}
                  alt={worksheet.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect fill="%236366f1" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="white" font-size="16">Worksheet</text></svg>';
                  }}
                />
                <div className="worksheet-overlay">
                  <span
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(worksheet.category) }}
                  >
                    {getCategoryIcon(worksheet.category)}
                    <span>{worksheet.category}</span>
                  </span>
                </div>

                {user && (
                  <button
                    className={`favorite-btn ${favorites.has(worksheet.id) ? 'favorited' : ''}`}
                    onClick={() => handleToggleFavorite(worksheet)}
                    title={favorites.has(worksheet.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={20} fill={favorites.has(worksheet.id) ? "currentColor" : "none"} />
                  </button>
                )}
              </div>

              <div className="worksheet-info">
                <div className="worksheet-grade">
                  {getGradeIcon(worksheet.grade)}
                  <span>{t('worksheets.grade')} {worksheet.grade}</span>
                </div>
                <h3>{worksheet.title}</h3>
                <p>{worksheet.description}</p>
                <div className="worksheet-source">
                  <Library size={12} />
                  <span>{worksheet.source}</span>
                </div>
              </div>

              <div className="worksheet-actions">
                <a
                  href={worksheet.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn open-btn"
                  onClick={() => handleWorksheetAction(worksheet)}
                >
                  <ExternalLink size={18} />
                  <span>{t('worksheets.open')}</span>
                </a>
                <button
                  className="action-btn print-btn"
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
                  <Printer size={18} />
                  <span>{t('worksheets.print')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWorksheets.length === 0 && (
        <div className="worksheets-empty">
          <div className="empty-icon"><LottieCharacter state="thinking" size={64} /></div>
          <h3>{t('worksheets.noWorksheetsFound')}</h3>
          <p>{t('worksheets.noWorksheetsDesc')}</p>
        </div>
      )}

      <div className="worksheets-resources">
        <h3>{t('worksheets.moreResources')}</h3>
        <div className="resources-grid">
          <a href="https://games4esl.com/esl-worksheets/" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon"><Gamepad2 size={20} /></span>
            <span>Games4ESL</span>
          </a>
          <a href="https://learnenglishkids.britishcouncil.org/print-make/worksheets" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon"><BookOpen size={20} /></span>
            <span>British Council</span>
          </a>
          <a href="https://www.englishwsheets.com/" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon"><FileText size={20} /></span>
            <span>EnglishWsheets</span>
          </a>
          <a href="https://www.english-4kids.com/worksheet.html" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon"><GraduationCap size={20} /></span>
            <span>English-4Kids</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Worksheets;
