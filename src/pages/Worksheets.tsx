import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { fallbackWorksheets } from '../data/fallbackData';
import toast from 'react-hot-toast';
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
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import ContentPageHeader from '../components/ContentPageHeader';
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
  const [activeGrade, setActiveGrade] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { trackActivity, addXP } = useGamification();

  useEffect(() => {
    fetchWorksheets();
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
  }, [user]);

  const fetchWorksheets = async () => {
    try {
      const { data, error } = await supabase
        .from('worksheets')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setWorksheets(data.map(ws => ({
          id: ws.id,
          title: ws.title,
          description: ws.description,
          category: ws.subject,
          grade: ws.grade,
          thumbnail_url: ws.thumbnail_url,
          external_url: ws.file_url,
          source: 'MinesMinis'
        })));
      } else {
        setWorksheets(fallbackWorksheets);
      }
    } catch (error) {
      console.error('Error fetching worksheets, using fallback:', error);
      setWorksheets(fallbackWorksheets);
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
      console.error('Error loading favorites:', error);
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
      console.error('Error toggling favorite:', error);
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
        toast.success(`You earned 15 XP for practicing! 🌟`);
      }
    } catch (err) {
      console.error('Error tracking activity:', err);
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
        title="Printable Fun"
        description="Learning beyond the screen - download, print, and play!"
        iconColor="var(--accent-emerald)"
        filterSlot={
          <div className="modern-tabs">
            <button
              onClick={() => setActiveGrade('All')}
              className={`modern-tab ${activeGrade === 'All' ? 'active' : ''}`}
            >
              All Grades
            </button>
            <button
              onClick={() => setActiveGrade('2')}
              className={`modern-tab ${activeGrade === '2' ? 'active' : ''}`}
            >
              2nd Grade
            </button>
            <button
              onClick={() => setActiveGrade('3')}
              className={`modern-tab ${activeGrade === '3' ? 'active' : ''}`}
            >
              3rd Grade
            </button>
            <button
              onClick={() => setActiveGrade('4')}
              className={`modern-tab ${activeGrade === '4' ? 'active' : ''}`}
            >
              4th Grade
            </button>
          </div>
        }
      />

      <div className="controls-section">
        <div className="filters-wrapper">
          {/* Grade filter removed as it's now in ContentPageHeader */}

          <div className="filter-item">
            <label htmlFor="category-filter">Subject:</label>
            <select
              id="category-filter"
              className="filter-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="worksheets-count">
        Showing <strong>{filteredWorksheets.length}</strong> worksheets
      </div>

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
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect fill="%236366f1" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="white" font-size="48">📄</text></svg>';
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
                  <span>Grade {worksheet.grade}</span>
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
                  <span>Open</span>
                </a>
                <button
                  className="action-btn print-btn"
                  onClick={() => {
                    handleWorksheetAction(worksheet);
                    window.open(worksheet.external_url, '_blank');
                  }}
                >
                  <Printer size={18} />
                  <span>Print</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWorksheets.length === 0 && (
        <div className="worksheets-empty">
          <div className="empty-icon">🐉</div>
          <h3>No worksheets found</h3>
          <p>Mimi could not find any worksheets with these filters. Try a different combination!</p>
        </div>
      )}

      <div className="worksheets-resources">
        <h3>🌐 More Free Resources</h3>
        <div className="resources-grid">
          <a href="https://games4esl.com/esl-worksheets/" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon">🎮</span>
            <span>Games4ESL</span>
          </a>
          <a href="https://learnenglishkids.britishcouncil.org/print-make/worksheets" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon">🇬🇧</span>
            <span>British Council</span>
          </a>
          <a href="https://www.englishwsheets.com/" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon">📄</span>
            <span>EnglishWsheets</span>
          </a>
          <a href="https://www.english-4kids.com/worksheet.html" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="resource-icon">👶</span>
            <span>English-4Kids</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Worksheets;
