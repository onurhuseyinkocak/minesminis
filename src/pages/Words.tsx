import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { BookOpen, Volume2, Star, Trophy, Sparkles, Search } from "lucide-react";
import ContentPageHeader from '../components/ContentPageHeader';
import { supabase } from '../config/supabase';
import { kidsWords as fallbackWords } from '../data/wordsData';

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
  id?: string;
  word: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  emoji: string;
  turkish: string;
  example?: string;
  grade?: number;
  image_url?: string | null;
  word_audio_url?: string | null;
  example_audio_url?: string | null;
}

const Words: React.FC = () => {
  const [searchWord, setSearchWord] = useState<string>("");
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [turkishTranslation, setTurkishTranslation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [kidsWords, setKidsWords] = useState<KidsWord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const speakWord = async (text: string) => {
    if (!text || isLoadingAudio) return;
    setIsLoadingAudio(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('TTS API failed');

      const data = await response.json();
      const audioBase64 = data.audio ?? data.audioContent;
      if (audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audio.play();
      } else {
        throw new Error('No audio content');
      }
    } catch (error) {
      console.warn('Backend TTS failed, using Web Speech API fallback:', error);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } else {
        toast.error('Audio not supported in this browser 🔇');
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    fetchKidsWords();
  }, []);

  const fetchKidsWords = async () => {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('word');

      if (error) throw error;
      setKidsWords((data && data.length > 0) ? data : fallbackWords);
    } catch (error) {
      console.error('Error fetching words:', error);
      setKidsWords(fallbackWords);
      toast('Loaded from local backup. Run supabase_words.sql for cloud sync.', { icon: '📚', duration: 4000 });
    }
  };

  const categories = ['all', ...Array.from(new Set(kidsWords.map(w => w.category)))];

  const filteredWords = kidsWords.filter(word => {
    const gradeMatch = selectedGrade === 'all' || word.grade === selectedGrade;
    const levelMatch = selectedLevel === 'all' || word.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || word.category === selectedCategory;
    const searchMatch = !searchWord.trim() ||
      word.word.toLowerCase().includes(searchWord.trim().toLowerCase()) ||
      (word.turkish && word.turkish.toLowerCase().includes(searchWord.trim().toLowerCase()));
    return gradeMatch && levelMatch && categoryMatch && searchMatch;
  });

  const fetchWordData = async (word: string) => {
    if (!word.trim()) {
      toast.error('Please enter a word! 📝');
      return;
    }

    setLoading(true);

    try {
      const kidsWord = kidsWords.find(w => w.word.toLowerCase() === word.toLowerCase());
      if (kidsWord) {
        setTurkishTranslation(kidsWord.turkish);
      }

      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

      if (!dictResponse.ok) {
        toast.error('Word not found! Try another one. 🔍');
        setLoading(false);
        return;
      }

      const dictData = await dictResponse.json();
      setWordData(dictData[0]);

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

  const playAudio = (text: string) => {
    speakWord(text);
  };

  const playAudioUrl = (url: string, fallbackText?: string) => {
    if (!url || isLoadingAudio) return;
    setIsLoadingAudio(true);
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const audio = new Audio(fullUrl);
    audio.onended = () => setIsLoadingAudio(false);
    audio.onerror = () => {
      setIsLoadingAudio(false);
      if (fallbackText) speakWord(fallbackText);
    };
    audio.play().catch(() => {
      setIsLoadingAudio(false);
      if (fallbackText) speakWord(fallbackText);
    });
  };

  const playWordAudio = (wordObj: KidsWord) => {
    if (wordObj.word_audio_url) {
      playAudioUrl(wordObj.word_audio_url, wordObj.word);
    } else {
      speakWord(wordObj.word);
    }
  };

  const playExampleAudio = (wordObj: KidsWord) => {
    if (wordObj.example_audio_url && wordObj.example) {
      playAudioUrl(wordObj.example_audio_url, wordObj.example);
    } else if (wordObj.example) {
      speakWord(wordObj.example);
    }
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
      <ContentPageHeader
        icon={BookOpen}
        title="Smart Dictionary"
        description="Learn English words made just for kids!"
        iconColor="#fbbf24"
        filterSlot={
          <div className="modern-tabs">
            <select
              id="grade-filter"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="filter-select-modern"
            >
              <option value="all">All Grades</option>
              <option value={1}>Grade 1</option>
              <option value={2}>Grade 2</option>
              <option value={3}>Grade 3</option>
              <option value={4}>Grade 4</option>
            </select>

            <select
              id="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel((e.target as HTMLSelectElement).value as 'all'|'beginner'|'intermediate'|'advanced')}
              className="filter-select-modern"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select-modern"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        }
      >
        <div className="library-search-wrapper">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for any word..."
            className="library-search-input"
            disabled={loading}
          />
          <Search className="library-search-icon" size={20} />
          <button
            onClick={handleSearch}
            className="search-button-premium"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : <span>Search</span>}
          </button>
        </div>

        <div className="library-stats-container">
          <div className="stat-box learned">
            <Trophy className="stat-icon" size={20} color="#fbbf24" />
            <div className="stat-info">
              <span className="stat-value">{learnedWords.size}</span>
              <span className="stat-label">Learned</span>
            </div>
          </div>
          <div className="stat-box favorite">
            <Star className="stat-icon" size={20} color="#f43f5e" />
            <div className="stat-info">
              <span className="stat-value">{favoriteWords.size}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
        </div>
      </ContentPageHeader>

      <AnimatePresence mode="wait">
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
                  <button
                    className={`action-btn audio ${isLoadingAudio ? 'loading' : ''}`}
                    onClick={() => playAudio(wordData.word)}
                    disabled={isLoadingAudio}
                  >
                    <Volume2 size={20} /> Listen
                  </button>
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

        {!loading && !wordData && (
          <motion.div
            key="words-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="words-grid"
          >
            <h2 className="section-title">
              <Sparkles className="section-icon" />
              Learn These Amazing Words! ({filteredWords.length} words)
            </h2>

            <div className="word-cards">
              {filteredWords.map((word, idx) => (
                <motion.div
                  key={`${word.word}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  className={`word-card-mini ${getLevelColor(word.level)}`}
                  onClick={() => {
                    setSearchWord(word.word);
                    fetchWordData(word.word);
                  }}
                >
                  <div className="card-media">
                    {word.image_url ? (
                      <img src={word.image_url} alt={word.turkish} className="word-card-image" loading="lazy" />
                    ) : (
                      <span className="word-emoji">{word.emoji || '📖'}</span>
                    )}
                    {word.grade != null && (
                      <span className="grade-badge">Grade {word.grade}</span>
                    )}
                  </div>

                  <div className="card-body">
                    <h3 className="word-mini">{word.word}</h3>
                    <p className="turkish-mini">🇹🇷 {word.turkish}</p>
                    {word.example && (
                      <p className="word-example-mini">"{word.example}"</p>
                    )}
                    <div className="card-tags">
                      <span className="category-tag">{word.category}</span>
                      <div className="audio-buttons-mini">
                        <button
                          className="mini-audio-btn"
                          onClick={(e) => { e.stopPropagation(); playWordAudio(word); }}
                          title="Listen to word"
                        >
                          <Volume2 size={14} />
                        </button>
                        {word.example && (
                          <button
                            className="mini-audio-btn example"
                            onClick={(e) => { e.stopPropagation(); playExampleAudio(word); }}
                            title="Listen to example"
                          >
                            <Volume2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className={`icon-btn check ${learnedWords.has(word.word) ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleLearned(word.word); }}
                      title="Mark as learned"
                    >
                      ✓
                    </button>
                    <button
                      className={`icon-btn favorite ${favoriteWords.has(word.word) ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(word.word); }}
                      title="Add to favorites"
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
