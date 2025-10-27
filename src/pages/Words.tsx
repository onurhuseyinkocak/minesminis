import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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

const Words: React.FC = () => {
  const [searchWord, setSearchWord] = useState<string>("");
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [turkishTranslation, setTurkishTranslation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'definition' | 'translation'>('definition');

  const fetchWordData = async (word: string) => {
    if (!word.trim()) {
      toast.error('Please enter a word');
      return;
    }

    setLoading(true);

    try {
      // Fetch English definition
      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

      if (!dictResponse.ok) {
        toast.error('Word not found');
        setLoading(false);
        return;
      }

      const dictData = await dictResponse.json();
      setWordData(dictData[0]);

      // Fetch Turkish translation using MyMemory API
      const transResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|tr`
      );
      const transData = await transResponse.json();

      if (transData.responseData.translatedText) {
        setTurkishTranslation(transData.responseData.translatedText);
      }

      toast.success('Word found!');
    } catch (error) {
      console.error('Error fetching word:', error);
      toast.error('Failed to fetch word data');
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
    audio.play();
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

  return (
    <div className="words-page-container">
      <div className="words-hero">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="words-title"
        >
          📚 English-Turkish Dictionary
        </motion.h1>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="words-subtitle"
        >
          Learn English words with definitions and Turkish translations
        </motion.p>
      </div>

      <div className="words-search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type an English word..."
            className="words-search-input"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="words-search-btn"
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="words-loading"
          >
            <div className="spinner-large"></div>
            <p>Searching dictionary...</p>
          </motion.div>
        )}

        {!loading && wordData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="words-results"
          >
            <div className="word-header">
              <div className="word-title-section">
                <h2 className="word-title">{wordData.word}</h2>
                {wordData.phonetic && (
                  <span className="word-phonetic">{wordData.phonetic}</span>
                )}
              </div>
              {wordData.phonetics.find(p => p.audio) && (
                <button
                  className="audio-btn"
                  onClick={() => playAudio(wordData.phonetics.find(p => p.audio)!.audio!)}
                >
                  🔊
                </button>
              )}
            </div>

            <div className="tabs-container">
              <button
                className={`tab-btn ${activeTab === 'definition' ? 'active' : ''}`}
                onClick={() => setActiveTab('definition')}
              >
                📖 Definition
              </button>
              <button
                className={`tab-btn ${activeTab === 'translation' ? 'active' : ''}`}
                onClick={() => setActiveTab('translation')}
              >
                🇹🇷 Turkish Translation
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'definition' && (
                <motion.div
                  key="definition"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="meanings-container"
                >
                  {wordData.meanings.map((meaning, idx) => (
                    <div key={idx} className="meaning-card">
                      <div className="part-of-speech">
                        <span className="pos-emoji">{getPartOfSpeechEmoji(meaning.partOfSpeech)}</span>
                        <span className="pos-text">{meaning.partOfSpeech}</span>
                      </div>

                      <div className="definitions-list">
                        {meaning.definitions.slice(0, 3).map((def, defIdx) => (
                          <div key={defIdx} className="definition-item">
                            <div className="definition-number">{defIdx + 1}</div>
                            <div className="definition-content">
                              <p className="definition-text">{def.definition}</p>
                              {def.example && (
                                <p className="example-text">
                                  <span className="example-label">Example:</span> "{def.example}"
                                </p>
                              )}
                              {def.synonyms && def.synonyms.length > 0 && (
                                <div className="synonyms">
                                  <span className="syn-label">Synonyms:</span>
                                  {def.synonyms.slice(0, 5).map((syn, synIdx) => (
                                    <span key={synIdx} className="syn-tag">{syn}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'translation' && (
                <motion.div
                  key="translation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="translation-container"
                >
                  <div className="translation-card">
                    <div className="translation-header">
                      <span className="flag">🇬🇧</span>
                      <span className="arrow">→</span>
                      <span className="flag">🇹🇷</span>
                    </div>
                    <div className="translation-content">
                      <div className="source-word">
                        <label>English</label>
                        <p>{wordData.word}</p>
                      </div>
                      <div className="translated-word">
                        <label>Turkish</label>
                        <p>{turkishTranslation || 'Translation not available'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && !wordData && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="words-empty"
          >
            <div className="empty-icon">📖</div>
            <h3>Start Learning!</h3>
            <p>Search for any English word to see its definition and Turkish translation</p>
            <div className="popular-words">
              <p className="popular-label">Try these popular words:</p>
              <div className="word-chips">
                {['hello', 'beautiful', 'learn', 'happy', 'friend', 'school'].map((word) => (
                  <button
                    key={word}
                    className="word-chip"
                    onClick={() => {
                      setSearchWord(word);
                      fetchWordData(word);
                    }}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Words;
