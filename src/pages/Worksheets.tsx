import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import './Worksheets.css';

type Worksheet = {
  id: string;
  title: string;
  description: string;
  category: string;
  grade: string;
  thumbnailUrl: string;
  externalUrl: string;
  source: string;
};

const worksheetsData: Worksheet[] = [
  // 2nd Grade - Vocabulary
  {
    id: 'ws-2-v1',
    title: 'Animals Vocabulary',
    description: 'Learn animal names with pictures',
    category: 'Vocabulary',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/animals.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-2-v2',
    title: 'Colors & Shapes',
    description: 'Match colors and shapes in English',
    category: 'Vocabulary',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/print-make/worksheets/colours',
    source: 'British Council'
  },
  {
    id: 'ws-2-v3',
    title: 'Food & Drinks',
    description: 'Vocabulary about food items',
    category: 'Vocabulary',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/food-drinks.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-2-v4',
    title: 'Body Parts',
    description: 'Learn body parts vocabulary',
    category: 'Vocabulary',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/body-parts-worksheets/',
    source: 'Games4ESL'
  },
  // 2nd Grade - Grammar
  {
    id: 'ws-2-g1',
    title: 'Simple Sentences',
    description: 'Build basic English sentences',
    category: 'Grammar',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/grammar.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-2-g2',
    title: 'This/That/These/Those',
    description: 'Demonstrative pronouns practice',
    category: 'Grammar',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/this-that-these-those',
    source: 'British Council'
  },
  // 2nd Grade - Reading
  {
    id: 'ws-2-r1',
    title: 'Short Stories',
    description: 'Easy reading comprehension',
    category: 'Reading',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/short-stories',
    source: 'British Council'
  },
  {
    id: 'ws-2-r2',
    title: 'Picture Reading',
    description: 'Read and match pictures',
    category: 'Reading',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/reading-worksheets/',
    source: 'Games4ESL'
  },
  // 2nd Grade - Writing
  {
    id: 'ws-2-w1',
    title: 'Tracing Letters',
    description: 'Practice writing ABC',
    category: 'Writing',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'http://www.eslkidslab.com/worksheets/set1/handwriting/index.html',
    source: 'ESL Kids Lab'
  },
  {
    id: 'ws-2-w2',
    title: 'Word Writing',
    description: 'Write simple words',
    category: 'Writing',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop',
    externalUrl: 'https://www.english-4kids.com/worksheet.html',
    source: 'English-4Kids'
  },
  // 2nd Grade - Phonics
  {
    id: 'ws-2-p1',
    title: 'Alphabet Sounds',
    description: 'Learn letter sounds',
    category: 'Phonics',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&h=200&fit=crop',
    externalUrl: 'https://www.english-4kids.com/phonics.html',
    source: 'English-4Kids'
  },
  {
    id: 'ws-2-p2',
    title: 'CVC Words',
    description: 'Consonant-vowel-consonant words',
    category: 'Phonics',
    grade: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/phonics-worksheets/',
    source: 'Games4ESL'
  },

  // 3rd Grade - Vocabulary
  {
    id: 'ws-3-v1',
    title: 'Action Verbs',
    description: 'Learn action words',
    category: 'Vocabulary',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/action-verbs.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-3-v2',
    title: 'Adjectives',
    description: 'Describing words practice',
    category: 'Vocabulary',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/adjectives',
    source: 'British Council'
  },
  {
    id: 'ws-3-v3',
    title: 'Weather Words',
    description: 'Weather vocabulary',
    category: 'Vocabulary',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/weather.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-3-v4',
    title: 'Jobs & Occupations',
    description: 'Learn about different jobs',
    category: 'Vocabulary',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/jobs-worksheets/',
    source: 'Games4ESL'
  },
  // 3rd Grade - Grammar
  {
    id: 'ws-3-g1',
    title: 'Present Simple',
    description: 'I play, she plays...',
    category: 'Grammar',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/present-simple',
    source: 'British Council'
  },
  {
    id: 'ws-3-g2',
    title: 'Plural Nouns',
    description: 'One cat, two cats...',
    category: 'Grammar',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/plurals.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-3-g3',
    title: 'Prepositions',
    description: 'In, on, under, next to',
    category: 'Grammar',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/prepositions-place',
    source: 'British Council'
  },
  // 3rd Grade - Reading
  {
    id: 'ws-3-r1',
    title: 'Reading Comprehension',
    description: 'Read and answer questions',
    category: 'Reading',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/reading-worksheets/',
    source: 'Games4ESL'
  },
  {
    id: 'ws-3-r2',
    title: 'Story Time',
    description: 'Fun stories for kids',
    category: 'Reading',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/short-stories',
    source: 'British Council'
  },
  // 3rd Grade - Writing
  {
    id: 'ws-3-w1',
    title: 'Sentence Building',
    description: 'Create complete sentences',
    category: 'Writing',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/grammar.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-3-w2',
    title: 'Paragraph Writing',
    description: 'Write short paragraphs',
    category: 'Writing',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'http://www.eslkidslab.com/worksheets/index.html',
    source: 'ESL Kids Lab'
  },
  // 3rd Grade - Phonics
  {
    id: 'ws-3-p1',
    title: 'Word Families',
    description: 'at, cat, bat, hat...',
    category: 'Phonics',
    grade: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/phonics-worksheets/',
    source: 'Games4ESL'
  },

  // 4th Grade - Vocabulary
  {
    id: 'ws-4-v1',
    title: 'Advanced Vocabulary',
    description: 'Expand your word power',
    category: 'Vocabulary',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/vocabulary.html',
    source: 'EnglishWsheets'
  },
  {
    id: 'ws-4-v2',
    title: 'Synonyms & Antonyms',
    description: 'Same and opposite meanings',
    category: 'Vocabulary',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/vocabulary-worksheets/',
    source: 'Games4ESL'
  },
  {
    id: 'ws-4-v3',
    title: 'Idioms for Kids',
    description: 'Fun English expressions',
    category: 'Vocabulary',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-vocabulary',
    source: 'British Council'
  },
  // 4th Grade - Grammar
  {
    id: 'ws-4-g1',
    title: 'Past Simple Tense',
    description: 'I walked, she played...',
    category: 'Grammar',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/past-simple',
    source: 'British Council'
  },
  {
    id: 'ws-4-g2',
    title: 'Future Tense',
    description: 'I will, going to...',
    category: 'Grammar',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/going-to',
    source: 'British Council'
  },
  {
    id: 'ws-4-g3',
    title: 'Comparatives',
    description: 'Bigger, smaller, faster...',
    category: 'Grammar',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/grammar-practice/comparatives',
    source: 'British Council'
  },
  // 4th Grade - Reading
  {
    id: 'ws-4-r1',
    title: 'Advanced Reading',
    description: 'Challenging reading texts',
    category: 'Reading',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/reading-practice',
    source: 'British Council'
  },
  {
    id: 'ws-4-r2',
    title: 'Mystery Stories',
    description: 'Solve reading puzzles',
    category: 'Reading',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/short-stories',
    source: 'British Council'
  },
  // 4th Grade - Writing
  {
    id: 'ws-4-w1',
    title: 'Story Writing',
    description: 'Write your own stories',
    category: 'Writing',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop',
    externalUrl: 'https://learnenglishkids.britishcouncil.org/writing-practice',
    source: 'British Council'
  },
  {
    id: 'ws-4-w2',
    title: 'Letter Writing',
    description: 'Write formal letters',
    category: 'Writing',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    externalUrl: 'https://www.englishwsheets.com/writing.html',
    source: 'EnglishWsheets'
  },
  // 4th Grade - Phonics
  {
    id: 'ws-4-p1',
    title: 'Silent Letters',
    description: 'Knight, write, know...',
    category: 'Phonics',
    grade: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&h=200&fit=crop',
    externalUrl: 'https://games4esl.com/esl-worksheets/phonics-worksheets/',
    source: 'Games4ESL'
  }
];

const categories = ['All', 'Vocabulary', 'Grammar', 'Reading', 'Writing', 'Phonics'];
const grades = ['All', '2', '3', '4'];

function Worksheets() {
  const [activeGrade, setActiveGrade] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
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
          .eq('user_id', user.id)
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
            user_id: user.id,
            item_type: 'worksheet',
            item_id: worksheet.id,
            item_name: worksheet.title,
            item_image: worksheet.thumbnailUrl
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

  const filteredWorksheets = worksheetsData.filter(ws => {
    const gradeMatch = activeGrade === 'All' || ws.grade === activeGrade;
    const categoryMatch = activeCategory === 'All' || ws.category === activeCategory;
    return gradeMatch && categoryMatch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Vocabulary': return '📖';
      case 'Grammar': return '📝';
      case 'Reading': return '📕';
      case 'Writing': return '✍️';
      case 'Phonics': return '🔤';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vocabulary': return '#6366f1';
      case 'Grammar': return '#10b981';
      case 'Reading': return '#f59e0b';
      case 'Writing': return '#ec4899';
      case 'Phonics': return '#8b5cf6';
      default: return '#6366f1';
    }
  };

  const getGradeEmoji = (grade: string) => {
    switch (grade) {
      case '2': return '🌟';
      case '3': return '⭐';
      case '4': return '🏆';
      default: return '📚';
    }
  };

  return (
    <div className="worksheets-page">
      <div className="worksheets-header">
        <h1>📚 Fun Sheets</h1>
        <p>Download and practice with fun worksheets!</p>
      </div>

      <div className="worksheets-filters">
        <div className="filter-group">
          <h3>Grade Level</h3>
          <div className="filter-buttons">
            {grades.map(grade => (
              <button
                key={grade}
                className={`filter-btn ${activeGrade === grade ? 'active' : ''}`}
                onClick={() => setActiveGrade(grade)}
              >
                {grade === 'All' ? '📚 All Grades' : `${getGradeEmoji(grade)} Grade ${grade}`}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Category</h3>
          <div className="filter-buttons category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
                style={{
                  '--category-color': getCategoryColor(category)
                } as React.CSSProperties}
              >
                {getCategoryIcon(category)} {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="worksheets-count">
        Showing <strong>{filteredWorksheets.length}</strong> worksheets
      </div>

      <div className="worksheets-grid">
        {filteredWorksheets.map(worksheet => (
          <div key={worksheet.id} className="worksheet-card">
            {user && (
              <button
                className={`favorite-btn ${favorites.has(worksheet.id) ? 'favorited' : ''}`}
                onClick={() => handleToggleFavorite(worksheet)}
                title={favorites.has(worksheet.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorites.has(worksheet.id) ? '❤️' : '🤍'}
              </button>
            )}

            <div className="worksheet-thumbnail">
              <img 
                src={worksheet.thumbnailUrl} 
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
                  {getCategoryIcon(worksheet.category)} {worksheet.category}
                </span>
              </div>
            </div>

            <div className="worksheet-info">
              <div className="worksheet-grade">
                {getGradeEmoji(worksheet.grade)} Grade {worksheet.grade}
              </div>
              <h3>{worksheet.title}</h3>
              <p>{worksheet.description}</p>
              <div className="worksheet-source">
                Source: {worksheet.source}
              </div>
            </div>

            <div className="worksheet-actions">
              <a
                href={worksheet.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn open-btn"
              >
                🔗 Open
              </a>
              <button
                className="action-btn print-btn"
                onClick={() => window.open(worksheet.externalUrl, '_blank')}
              >
                🖨️ Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWorksheets.length === 0 && (
        <div className="worksheets-empty">
          <div className="empty-icon">📝</div>
          <h3>No worksheets found</h3>
          <p>Try changing the filters to see more worksheets!</p>
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
