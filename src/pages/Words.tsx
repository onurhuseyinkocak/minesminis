import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { BookOpen, Volume2, Star, Trophy, Sparkles } from "lucide-react";
import './Words.css';

interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

interface KidsWord {
  word: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  emoji: string;
  turkish: string;
  example?: string;
}

// Çocuklara uygun kelime listesi - seviyelerine göre
const kidsWords: KidsWord[] = [
  // Beginner Level (Ages 5-7)
  { word: "cat", level: "beginner", category: "Animals", emoji: "🐱", turkish: "kedi", example: "I have a cute cat." },
  { word: "dog", level: "beginner", category: "Animals", emoji: "🐶", turkish: "köpek", example: "My dog is very friendly." },
  { word: "apple", level: "beginner", category: "Food", emoji: "🍎", turkish: "elma", example: "I eat an apple every day." },
  { word: "sun", level: "beginner", category: "Nature", emoji: "☀️", turkish: "güneş", example: "The sun is bright today." },
  { word: "moon", level: "beginner", category: "Nature", emoji: "🌙", turkish: "ay", example: "The moon shines at night." },
  { word: "happy", level: "beginner", category: "Feelings", emoji: "😊", turkish: "mutlu", example: "I am happy today!" },
  { word: "book", level: "beginner", category: "School", emoji: "📚", turkish: "kitap", example: "I read a book every night." },
  { word: "red", level: "beginner", category: "Colors", emoji: "🔴", turkish: "kırmızı", example: "My favorite color is red." },
  { word: "blue", level: "beginner", category: "Colors", emoji: "🔵", turkish: "mavi", example: "The sky is blue." },
  { word: "house", level: "beginner", category: "Places", emoji: "🏠", turkish: "ev", example: "I live in a big house." },

  // Intermediate Level (Ages 8-10)
  { word: "elephant", level: "intermediate", category: "Animals", emoji: "🐘", turkish: "fil", example: "Elephants are very smart." },
  { word: "butterfly", level: "intermediate", category: "Animals", emoji: "🦋", turkish: "kelebek", example: "The butterfly has beautiful wings." },
  { word: "delicious", level: "intermediate", category: "Adjectives", emoji: "😋", turkish: "lezzetli", example: "This pizza is delicious!" },
  { word: "brave", level: "intermediate", category: "Adjectives", emoji: "🦸", turkish: "cesur", example: "The brave knight saved the princess." },
  { word: "rainbow", level: "intermediate", category: "Nature", emoji: "🌈", turkish: "gökkuşağı", example: "I saw a rainbow after the rain." },
  { word: "mountain", level: "intermediate", category: "Nature", emoji: "⛰️", turkish: "dağ", example: "We climbed the mountain together." },
  { word: "adventure", level: "intermediate", category: "Activities", emoji: "🗺️", turkish: "macera", example: "We had a great adventure in the forest." },
  { word: "magic", level: "intermediate", category: "Fantasy", emoji: "✨", turkish: "sihir", example: "The wizard used magic to help us." },
  { word: "treasure", level: "intermediate", category: "Objects", emoji: "💎", turkish: "hazine", example: "Pirates search for treasure." },
  { word: "friendship", level: "intermediate", category: "Feelings", emoji: "🤝", turkish: "arkadaşlık", example: "Friendship is very important." },

  // Advanced Level (Ages 11-13)
  { word: "magnificent", level: "advanced", category: "Adjectives", emoji: "🌟", turkish: "muhteşem", example: "The view was magnificent!" },
  { word: "mysterious", level: "advanced", category: "Adjectives", emoji: "🔮", turkish: "gizemli", example: "The mysterious box was locked." },
  { word: "courageous", level: "advanced", category: "Adjectives", emoji: "🛡️", turkish: "yürekli", example: "She was courageous in the face of danger." },
  { word: "imagination", level: "advanced", category: "Concepts", emoji: "💭", turkish: "hayal gücü", example: "Use your imagination to create stories." },
  { word: "perseverance", level: "advanced", category: "Concepts", emoji: "💪", turkish: "azim", example: "Success requires perseverance." },
  { word: "extraordinary", level: "advanced", category: "Adjectives", emoji: "⭐", turkish: "olağanüstü", example: "She has extraordinary talent." },
  { word: "accomplish", level: "advanced", category: "Verbs", emoji: "🎯", turkish: "başarmak", example: "You can accomplish anything you try." },
  { word: "discover", level: "advanced", category: "Verbs", emoji: "🔍", turkish: "keşfetmek", example: "Scientists discover new things every day." },
  { word: "appreciate", level: "advanced", category: "Verbs", emoji: "🙏", turkish: "takdir etmek", example: "I appreciate your help." },
  { word: "confident", level: "advanced", category: "Adjectives", emoji: "😎", turkish: "özgüvenli", example: "She felt confident about the test." },
];

const Words: React.FC = () => {
  const [searchWord, setSearchWord] = useState<string>("");
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [turkishTranslation, setTurkishTranslation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'definition' | 'translation'>('definition');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(kidsWords.map(w => w.category)))];

  // Filter words based on level and category
  const filteredWords = kidsWords.filter(word => {
    const levelMatch = selectedLevel === 'all' || word.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || word.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const fetchWordData = async (word: string) => {
    if (!word.trim()) {
      toast.error('Please enter a word! 📝');
      return;
    }

    setLoading(true);

    try {
      // Check if word is in kids list first
      const kidsWord = kidsWords.find(w => w.word.toLowerCase() === word.toLowerCase());
      if (kidsWord) {
        setTurkishTranslation(kidsWord.turkish);
      }

      // Fetch English definition
      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

      if (!dictResponse.ok) {
        toast.error('Word not found! Try another one. 🔍');
        setLoading(false);
        return;
      }

      const dictData = await dictResponse.json();
      setWordData(dictData[0]);

      // Fetch Turkish translation if not in kids list
      if (!kidsWord) {
        const transResponse = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|tr`
        );
        const transData = await transResponse.json();

        if (transData.responseData.translatedText) {
          setTurkishTranslation(transData.responseData.translatedText);
        }
      }

      toast.success('Word found! Great job! 🎉');
    } catch (error) {
      console.error('Error fetching word:', error);
      toast.error('Oops! Something went wrong. Try again! 😅');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWordData(searchWord);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => toast.error('Audio not available 🔇'));
  };

  const toggleLearned = (word: string) => {
    const newLearned = new Set(learnedWords);
    if (newLearned.has(word)) {
      newLearned.delete(word);
      toast.success('Removed from learned! 📚');
    } else {
      newLearned.add(word);
      toast.success('Awesome! Word learned! 🌟');
    }
    setLearnedWords(newLearned);
  };

  const toggleFavorite = (word: string) => {
    const newFavorites = new Set(favoriteWords);
    if (newFavorites.has(word)) {
      newFavorites.delete(word);
      toast.success('Removed from favorites! ⭐');
    } else {
      newFavorites.add(word);
      toast.success('Added to favorites! ❤️');
    }
    setFavoriteWords(newFavorites);
  };

  const getPartOfSpeechEmoji = (pos: string) => {
    const emojiMap: { [key: string]: string } = {
      'noun': '📦',
      'verb': '⚡',
      'adjective': '🎨',
      'adverb': '🔄',
      'pronoun': '👤',
      'preposition': '🔗',
      'conjunction': '🔀',
      'interjection': '❗'
    };
    return emojiMap[pos.toLowerCase()] || '📖';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'advanced': return 'advanced';
      default: return 'beginner';
    }
  };

  return (
    <div className="words-page">
      {/* Premium Header */}
      <div className="words-header">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="header-content"
        >
          <BookOpen size={48} className="header-icon" />
          <h1 className="words-title">
            <span className="gradient-text">Smart Dictionary</span> 📚
          </h1>
          <p className="words-subtitle">
            Learn English words made just for kids! 🌟
          </p>
        </motion.div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-box">
            <Trophy className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{learnedWords.size}</div>
              <div className="stat-label">Words Learned</div>
            </div>
          </div>
          <div className="stat-box">
            <Star className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{favoriteWords.size}</div>
              <div className="stat-label">Favorites</div>
            </div>
          </div>
          <div className="stat-box">
            <Sparkles className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{kidsWords.length}</div>
              <div className="stat-label">Total Words</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-wrapper">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for any English word... 🔍"
            className="search-input"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="search-button"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : '🔍 Search'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Level:</label>
          <div className="filter-buttons">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as any)}
                className={`filter-btn ${selectedLevel === level ? 'active' : ''} ${level !== 'all' ? getLevelColor(level) : ''}`}
              >
                {level === 'all' ? '🌟 All' :
                  level === 'beginner' ? '🟢 Beginner' :
                    level === 'intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <div className="filter-buttons">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-btn category ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'all' ? '📚 All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Loading State */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-state"
          >
            <div className="spinner-large" />
            <p>Searching the magical dictionary... ✨</p>
          </motion.div>
        )}

        {/* Search Results */}
        {!loading && wordData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="word-result"
          >
            <div className="word-card">
              <div className="word-header">
                <div className="word-title-section">
                  <h2 className="word-text">{wordData.word}</h2>
                  {wordData.phonetic && (
                    <span className="phonetic">{wordData.phonetic}</span>
                  )}
                </div>
                <div className="word-actions">
                  {wordData.phonetics.find(p => p.audio) && (
                    <button
                      className="action-btn audio"
                      onClick={() => playAudio(wordData.phonetics.find(p => p.audio)!.audio!)}
                    >
                      <Volume2 size={20} /> Listen
                    </button>
                  )}
                </div>
              </div>

              {turkishTranslation && (
                <div className="translation-quick">
                  <span className="translation-label">🇹🇷 Turkish:</span>
                  <span className="translation-value">{turkishTranslation}</span>
                </div>
              )}

              <div className="meanings-section">
                {wordData.meanings.map((meaning, idx) => (
                  <div key={idx} className="meaning-block">
                    <div className="pos-badge">
                      <span className="pos-emoji">{getPartOfSpeechEmoji(meaning.partOfSpeech)}</span>
                      <span>{meaning.partOfSpeech}</span>
                    </div>

                    <div className="definitions">
                      {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                        <div key={defIdx} className="definition">
                          <div className="def-number">{defIdx + 1}</div>
                          <div className="def-content">
                            <p className="def-text">{def.definition}</p>
                            {def.example && (
                              <p className="example">
                                <span className="example-label">💡 Example:</span>
                                <span className="example-text">"{def.example}"</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Kids Word Cards */}
        {!loading && !wordData && (
          <motion.div
            key="words-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="words-grid"
          >
            <h2 className="section-title">
              <Sparkles className="section-icon" />
              Learn These Amazing Words!
            </h2>

            <div className="word-cards">
              {filteredWords.map((word, idx) => (
                <motion.div
                  key={word.word}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`word-card-mini ${getLevelColor(word.level)}`}
                  onClick={() => {
                    setSearchWord(word.word);
                    fetchWordData(word.word);
                  }}
                >
                  <div className="card-header">
                    <span className="word-emoji">{word.emoji}</span>
                    <span className={`level-badge ${word.level}`}>
                      {word.level}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="word-mini">{word.word}</h3>
                    <p className="turkish-mini">🇹🇷 {word.turkish}</p>
                    <span className="category-tag">{word.category}</span>
                  </div>

                  <div className="card-actions">
                    <button
                      className={`icon-btn ${learnedWords.has(word.word) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLearned(word.word);
                      }}
                    >
                      ✓
                    </button>
                    <button
                      className={`icon-btn ${favoriteWords.has(word.word) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(word.word);
                      }}
                    >
                      ★
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No words found!</h3>
                <p>Try selecting different filters</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Words;
