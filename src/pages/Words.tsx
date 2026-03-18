import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { BookOpen, Volume2, Star, Trophy, Sparkles, Search, RefreshCw, Mic } from "lucide-react";
import ContentPageHeader from '../components/ContentPageHeader';
import './Words.css';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { kidsWords as fallbackWords } from '../data/wordsData';
import { getDueWords, updateWordProgress, type WordProgress } from '../data/spacedRepetition';
import { SFX } from '../data/soundLibrary';

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

const LS_LEARNED_KEY = 'mimi_learned_words';

function loadLearnedFromLS(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_LEARNED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLearnedToLS(words: Set<string>) {
  try {
    localStorage.setItem(LS_LEARNED_KEY, JSON.stringify([...words]));
  } catch {
    // storage full - silently ignore
  }
}

const Words: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'words' | 'review'>(
    searchParams.get('tab') === 'review' ? 'review' : 'words'
  );
  const [dueWords, setDueWords] = useState<WordProgress[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewRevealed, setReviewRevealed] = useState(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [turkishTranslation, setTurkishTranslation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [kidsWords, setKidsWords] = useState<KidsWord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [learnedWords, setLearnedWords] = useState<Set<string>>(loadLearnedFromLS);
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [pronunciationWord, setPronunciationWord] = useState<string | null>(null);
  const [pronunciationResult, setPronunciationResult] = useState<Record<string, 'correct' | 'wrong' | 'listening'>>({});

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

  // Load due words when review tab is active
  useEffect(() => {
    if (activeTab === 'review') {
      setDueWords(getDueWords());
      setReviewIndex(0);
      setReviewRevealed(false);
    }
  }, [activeTab]);

  const handleTabSwitch = (tab: 'words' | 'review') => {
    setActiveTab(tab);
    setSearchParams(tab === 'review' ? { tab: 'review' } : {});
  };

  const handleReviewAnswer = (wasCorrect: boolean) => {
    const currentWord = dueWords[reviewIndex];
    if (!currentWord) return;
    updateWordProgress(currentWord.wordId, wasCorrect);
    toast.success(wasCorrect ? 'Nice! Keep it up!' : 'No worries, you\'ll get it next time!');

    if (reviewIndex < dueWords.length - 1) {
      setReviewIndex((i) => i + 1);
      setReviewRevealed(false);
    } else {
      // Reload due words (some may have been rescheduled)
      setDueWords(getDueWords());
      setReviewIndex(0);
      setReviewRevealed(false);
      toast.success('Review session complete!');
    }
  };

  // Load favorites from Supabase when user is available
  useEffect(() => {
    if (!user) {
      setFavoriteWords(new Set());
      return;
    }

    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('item_id')
          .eq('user_id', user.uid)
          .eq('item_type', 'word');

        if (error) throw error;
        setFavoriteWords(new Set(data.map(f => f.item_id)));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading word favorites:', error);
        }
      }
    };

    loadFavorites();
  }, [user]);

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

  const startPronunciation = (wordText: string) => {
    const SRConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRConstructor) {
      toast.error("Your browser doesn't support speech recognition. Try Chrome!");
      return;
    }

    if (pronunciationWord === wordText) {
      // already listening for this word, ignore
      return;
    }

    setPronunciationWord(wordText);
    setPronunciationResult((prev) => ({ ...prev, [wordText]: 'listening' }));

    const recognition = new SRConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim().toLowerCase() || '';
      const target = wordText.trim().toLowerCase();

      if (transcript === target) {
        setPronunciationResult((prev) => ({ ...prev, [wordText]: 'correct' }));
        SFX.correct();
        toast.success(`Perfect pronunciation! "${wordText}"`);
      } else {
        setPronunciationResult((prev) => ({ ...prev, [wordText]: 'wrong' }));
        SFX.wrong();
        toast.error(`You said "${transcript}" - Expected "${wordText}"`);
      }
      setPronunciationWord(null);

      // Clear result after 3 seconds
      setTimeout(() => {
        setPronunciationResult((prev) => {
          const next = { ...prev };
          delete next[wordText];
          return next;
        });
      }, 3000);
    };

    recognition.onerror = () => {
      setPronunciationWord(null);
      setPronunciationResult((prev) => {
        const next = { ...prev };
        delete next[wordText];
        return next;
      });
      toast.error('Could not hear you. Try again!');
    };

    recognition.onend = () => {
      setPronunciationWord(null);
    };

    recognition.start();
  };

  const toggleLearned = (word: string) => {
    const newLearned = new Set(learnedWords);
    if (newLearned.has(word)) {
      newLearned.delete(word);
      toast.success('Removed from learned! 📚');
    } else {
      newLearned.add(word);
      updateWordProgress(word, true);
      toast.success('Awesome! Word learned! 🌟');
    }
    setLearnedWords(newLearned);
    saveLearnedToLS(newLearned);
  };

  const toggleFavorite = async (word: string) => {
    if (!user) {
      toast.error('Please sign in to add favorites!');
      return;
    }

    const isFavorite = favoriteWords.has(word);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.uid)
          .eq('item_id', word)
          .eq('item_type', 'word');

        if (error) throw error;

        setFavoriteWords(prev => {
          const newSet = new Set(prev);
          newSet.delete(word);
          return newSet;
        });
        toast.success('Removed from favorites! ⭐');
      } else {
        const kidsWord = kidsWords.find(w => w.word === word);
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.uid,
            item_type: 'word',
            item_id: word,
            item_name: word,
            item_image: kidsWord?.image_url || null
          });

        if (error) throw error;

        setFavoriteWords(prev => new Set(prev).add(word));
        toast.success('Added to favorites! ❤️');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error toggling word favorite:', error);
      }
      toast.error('Failed to update favorites');
    }
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
        iconColor="var(--accent-amber)"
        filterSlot={
          <div className="modern-tabs">
            <button
              className={`filter-select-modern ${activeTab === 'words' ? 'active-tab' : ''}`}
              onClick={() => handleTabSwitch('words')}
              style={{
                background: activeTab === 'words' ? 'var(--primary)' : undefined,
                color: activeTab === 'words' ? 'var(--text-on-primary, #fff)' : undefined,
                cursor: 'pointer',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
              }}
            >
              All Words
            </button>
            <button
              className={`filter-select-modern ${activeTab === 'review' ? 'active-tab' : ''}`}
              onClick={() => handleTabSwitch('review')}
              style={{
                background: activeTab === 'review' ? 'var(--primary)' : undefined,
                color: activeTab === 'review' ? 'var(--text-on-primary, #fff)' : undefined,
                cursor: 'pointer',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <RefreshCw size={14} /> Review Due
            </button>
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
            <Trophy className="stat-icon" size={20} color="var(--accent-amber)" />
            <div className="stat-info">
              <span className="stat-value">{learnedWords.size}</span>
              <span className="stat-label">Learned</span>
            </div>
          </div>
          <div className="stat-box favorite">
            <Star className="stat-icon" size={20} color="var(--accent-rose)" />
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

        {!loading && !wordData && activeTab === 'review' && (
          <motion.div
            key="review-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="words-grid"
          >
            <h2 className="section-title">
              <RefreshCw className="section-icon" />
              Review Due Words ({dueWords.length})
            </h2>

            {dueWords.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{'\u2728'}</div>
                <h3>All caught up!</h3>
                <p>No words due for review right now. Keep learning new words!</p>
              </div>
            ) : (() => {
              const currentDue = dueWords[reviewIndex];
              const matchedWord = kidsWords.find((w) => w.word === currentDue?.wordId);
              return (
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Card {reviewIndex + 1} of {dueWords.length}
                  </p>
                  <div
                    onClick={() => setReviewRevealed(true)}
                    style={{
                      background: 'var(--bg-card, #fff)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '2px solid var(--border-light, #e5e7eb)',
                    }}
                  >
                    <span style={{ fontSize: '3rem' }}>{matchedWord?.emoji || '\uD83D\uDCDA'}</span>
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>{currentDue?.wordId}</span>

                    {reviewRevealed ? (
                      <span style={{ fontSize: '1.4rem', color: 'var(--accent-emerald, #10b981)', fontWeight: 600 }}>
                        {matchedWord?.turkish || '(no translation)'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary, #999)' }}>
                        Tap to reveal translation
                      </span>
                    )}
                  </div>

                  {reviewRevealed && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                      <button
                        onClick={() => handleReviewAnswer(false)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.75rem',
                          border: '2px solid var(--border-light, #e5e7eb)',
                          background: 'var(--bg-card, #fff)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Need practice {'\uD83D\uDD04'}
                      </button>
                      <button
                        onClick={() => handleReviewAnswer(true)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          background: 'var(--primary, #6366f1)',
                          color: 'var(--text-on-primary, #fff)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Got it {'\u2705'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}

        {!loading && !wordData && activeTab === 'words' && (
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
                        <button
                          className={`mini-audio-btn ${pronunciationResult[word.word] === 'listening' ? 'listening' : ''}`}
                          onClick={(e) => { e.stopPropagation(); startPronunciation(word.word); }}
                          title="Practice pronunciation"
                          style={{
                            background: pronunciationResult[word.word] === 'correct'
                              ? 'var(--accent-emerald, #10b981)'
                              : pronunciationResult[word.word] === 'wrong'
                              ? 'var(--accent-rose, #f43f5e)'
                              : pronunciationResult[word.word] === 'listening'
                              ? 'var(--accent-amber, #f59e0b)'
                              : undefined,
                            color: pronunciationResult[word.word] ? '#fff' : undefined,
                            transition: 'all 0.3s ease',
                          }}
                          disabled={pronunciationWord === word.word}
                        >
                          {pronunciationResult[word.word] === 'correct' ? (
                            <span style={{ fontSize: '12px' }}>&#10003;</span>
                          ) : pronunciationResult[word.word] === 'wrong' ? (
                            <span style={{ fontSize: '12px' }}>&#10007;</span>
                          ) : (
                            <Mic size={14} />
                          )}
                        </button>
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
