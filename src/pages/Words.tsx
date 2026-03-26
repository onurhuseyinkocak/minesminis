import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Volume2, Mic, Check } from "lucide-react";
import './Words.css';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { kidsWords as fallbackWords } from '../data/wordsData';
import { getDueWords, updateWordProgress, type WordProgress } from '../data/spacedRepetition';
import { SFX } from '../data/soundLibrary';
import MimiGuide from '../components/MimiGuide';
import { KidIcon } from '../components/ui';

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

type TabType = 'words' | 'review' | 'mywords';

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
    // storage full
  }
}

const Words: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'words'
  );
  const [kidsWords, setKidsWords] = useState<KidsWord[]>([]);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(loadLearnedFromLS);
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<Record<string, 'correct' | 'wrong' | 'listening'>>({});
  const [pronunciationWord, setPronunciationWord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreWords, setShowMoreWords] = useState(false);

  // Review state
  const [dueWords, setDueWords] = useState<WordProgress[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewRevealed, setReviewRevealed] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const speakWord = async (text: string) => {
    if (!text || isLoadingAudio) return;
    setIsLoadingAudio(true);
    try {
      const { auth: firebaseAuth } = await import('../config/firebase');
      const token = await firebaseAuth.currentUser?.getIdToken().catch(() => null);
      const response = await fetch(`${BACKEND_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
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
    } catch {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    fetchKidsWords();
  }, []);

  useEffect(() => {
    if (activeTab === 'review') {
      setDueWords(getDueWords());
      setReviewIndex(0);
      setReviewRevealed(false);
    }
  }, [activeTab]);

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
      } catch {
        // silently fail
      }
    };
    loadFavorites();
  }, [user]);

  const fetchKidsWords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('word');
      if (error) throw error;
      setKidsWords((data && data.length > 0) ? data : fallbackWords);
    } catch {
      setKidsWords(fallbackWords);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setFlippedCard(null);
    setSearchParams(tab === 'words' ? {} : { tab });
  };

  const playWordAudio = (wordObj: KidsWord) => {
    if (wordObj.word_audio_url) {
      const url = wordObj.word_audio_url.startsWith('http')
        ? wordObj.word_audio_url
        : `${window.location.origin}${wordObj.word_audio_url}`;
      const audio = new Audio(url);
      audio.onerror = () => speakWord(wordObj.word);
      audio.play().catch(() => speakWord(wordObj.word));
    } else {
      speakWord(wordObj.word);
    }
  };

  const startPronunciation = (wordText: string) => {
    const SRConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRConstructor) {
      toast.error("Your browser doesn't support speech recognition. Try Chrome!");
      return;
    }
    if (pronunciationWord === wordText) return;

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
        toast.success(`Perfect! "${wordText}"`);
      } else {
        setPronunciationResult((prev) => ({ ...prev, [wordText]: 'wrong' }));
        SFX.wrong();
        toast.error(`You said "${transcript}" - Try "${wordText}"`);
      }
      setPronunciationWord(null);
      setTimeout(() => {
        setPronunciationResult((prev) => { const n = { ...prev }; delete n[wordText]; return n; });
      }, 3000);
    };

    recognition.onerror = () => {
      setPronunciationWord(null);
      setPronunciationResult((prev) => { const n = { ...prev }; delete n[wordText]; return n; });
      toast.error('Could not hear you. Try again!');
    };

    recognition.onend = () => setPronunciationWord(null);
    recognition.start();
  };

  const toggleLearned = (word: string) => {
    const newLearned = new Set(learnedWords);
    if (newLearned.has(word)) {
      newLearned.delete(word);
    } else {
      newLearned.add(word);
      updateWordProgress(word, true);
      SFX.correct();
      toast.success('Word learned!');
    }
    setLearnedWords(newLearned);
    saveLearnedToLS(newLearned);
  };

  const handleReviewAnswer = (wasCorrect: boolean) => {
    const currentWord = dueWords[reviewIndex];
    if (!currentWord) return;
    updateWordProgress(currentWord.wordId, wasCorrect);

    if (wasCorrect) {
      SFX.correct();
    }

    if (reviewIndex < dueWords.length - 1) {
      setReviewIndex((i) => i + 1);
      setReviewRevealed(false);
    } else {
      setDueWords(getDueWords());
      setReviewIndex(0);
      setReviewRevealed(false);
      toast.success('Review done!');
    }
  };

  // Group words by category for display, show first group by default
  const categories = Array.from(new Set(kidsWords.map(w => w.category)));
  const displayWords = showMoreWords
    ? kidsWords
    : kidsWords.filter(w => w.category === (categories[0] || 'Animals'));

  // When showMoreWords, group words by category for display
  const groupedByCategory: { category: string; words: KidsWord[] }[] = showMoreWords
    ? categories.map(cat => ({ category: cat, words: kidsWords.filter(w => w.category === cat) }))
    : [];

  const myWords = kidsWords.filter(w => learnedWords.has(w.word) || favoriteWords.has(w.word));

  const TABS: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'words', icon: <KidIcon name="book" size={20} />, label: 'All Words' },
    { id: 'review', icon: <KidIcon name="star" size={20} />, label: 'Review' },
    { id: 'mywords', icon: <KidIcon name="heart" size={20} />, label: 'My Words' },
  ];

  return (
    <div className="words-page">
      {/* Hero */}
      <div className="words-hero">
        <span className="words-hero-emoji"><KidIcon name="book" size={48} /></span>
        <h1 className="words-hero-title">My Words</h1>
      </div>

      {/* Flashcard Review entry point */}
      <div className="words-flashcard-cta">
        <button
          className="words-flashcard-cta-btn"
          onClick={() => navigate('/review/flashcards')}
        >
          <KidIcon name="star" size={22} />
          <span>Kelime Kartları</span>
          <span className="words-flashcard-cta-arrow">→</span>
        </button>
      </div>

      {/* Big tab buttons */}
      <div className="words-tab-row">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`words-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabSwitch(tab.id)}
          >
            <span className="words-tab-emoji">{tab.icon}</span>
            <span className="words-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="words-content">
        <AnimatePresence mode="wait">
          {/* ALL WORDS TAB */}
          {activeTab === 'words' && (
            <motion.div
              key="words-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                  <div className="words-loading-spinner" />
                </div>
              ) : showMoreWords ? (
                /* Grouped view when showing all words */
                <div className="kid-words-grouped">
                  {groupedByCategory.map(({ category, words: catWords }) => (
                    <div key={category} className="kid-word-group">
                      <h3 className="kid-word-group-title">{category}</h3>
                      <div className="kid-word-cards">
                        {catWords.map((word, idx) => (
                          <motion.div
                            key={`${word.word}-${idx}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                            className={`kid-word-card ${flippedCard === (word.id ?? word.word + '_' + word.category) ? 'flipped' : ''}`}
                            onClick={() => { const key = word.id ?? word.word + '_' + word.category; setFlippedCard(flippedCard === key ? null : key); }}
                          >
                            <div className="kid-card-inner">
                              <div className="kid-card-front">
                                <div className="kid-card-visual">
                                  {word.image_url ? (
                                    <img src={word.image_url} alt={word.turkish} className="kid-card-image" loading="lazy" />
                                  ) : (
                                    <div className="kid-card-letter-badge">{word.word.charAt(0).toUpperCase()}</div>
                                  )}
                                </div>
                                <h3 className="kid-card-word">{word.word}</h3>
                                <p className="kid-card-turkish">{word.turkish}</p>
                              </div>
                              <div className="kid-card-back" onClick={(e) => e.stopPropagation()}>
                                <h3 className="kid-card-word">{word.word}</h3>
                                <div className="kid-card-actions">
                                  <button type="button" className="kid-action-btn listen" onClick={() => playWordAudio(word)} disabled={isLoadingAudio}>
                                    <Volume2 size={22} /> Listen
                                  </button>
                                  <button
                                    type="button"
                                    className={`kid-action-btn speak ${pronunciationResult[word.word] === 'correct' ? 'correct' : pronunciationResult[word.word] === 'wrong' ? 'wrong' : pronunciationResult[word.word] === 'listening' ? 'listening-active' : ''}`}
                                    onClick={() => startPronunciation(word.word)}
                                    disabled={pronunciationWord === word.word}
                                  >
                                    <Mic size={22} /> Speak
                                  </button>
                                  <button
                                    type="button"
                                    className={`kid-action-btn know ${learnedWords.has(word.word) ? 'known' : ''}`}
                                    onClick={() => toggleLearned(word.word)}
                                  >
                                    {learnedWords.has(word.word) ? <><Check size={14} /> Learned!</> : <><Check size={14} /> I know this!</>}
                                  </button>
                                </div>
                                <button type="button" className="kid-card-close" onClick={(e) => { e.stopPropagation(); setFlippedCard(null); }}>Tap to close</button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Default view — first category only */
                <div className="kid-word-cards">
                  {displayWords.map((word, idx) => (
                    <motion.div
                      key={`${word.word}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.6) }}
                      className={`kid-word-card ${flippedCard === (word.id ?? word.word + '_' + word.category) ? 'flipped' : ''}`}
                      onClick={() => { const key = word.id ?? word.word + '_' + word.category; setFlippedCard(flippedCard === key ? null : key); }}
                    >
                      <div className="kid-card-inner">
                        <div className="kid-card-front">
                          <div className="kid-card-visual">
                            {word.image_url ? (
                              <img src={word.image_url} alt={word.turkish} className="kid-card-image" loading="lazy" />
                            ) : (
                              <div className="kid-card-letter-badge">{word.word.charAt(0).toUpperCase()}</div>
                            )}
                          </div>
                          <h3 className="kid-card-word">{word.word}</h3>
                          <p className="kid-card-turkish">{word.turkish}</p>
                        </div>
                        <div className="kid-card-back" onClick={(e) => e.stopPropagation()}>
                          <h3 className="kid-card-word">{word.word}</h3>
                          <div className="kid-card-actions">
                            <button
                              type="button"
                              className="kid-action-btn listen"
                              onClick={() => playWordAudio(word)}
                              disabled={isLoadingAudio}
                            >
                              <Volume2 size={22} /> Listen
                            </button>
                            <button
                              type="button"
                              className={`kid-action-btn speak ${pronunciationResult[word.word] === 'correct' ? 'correct' : pronunciationResult[word.word] === 'wrong' ? 'wrong' : pronunciationResult[word.word] === 'listening' ? 'listening-active' : ''}`}
                              onClick={() => startPronunciation(word.word)}
                              disabled={pronunciationWord === word.word}
                            >
                              <Mic size={22} /> Speak
                            </button>
                            <button
                              type="button"
                              className={`kid-action-btn know ${learnedWords.has(word.word) ? 'known' : ''}`}
                              onClick={() => toggleLearned(word.word)}
                            >
                              {learnedWords.has(word.word) ? <><Check size={14} /> Learned!</> : <><Check size={14} /> I know this!</>}
                            </button>
                          </div>
                          <button
                            type="button"
                            className="kid-card-close"
                            onClick={(e) => { e.stopPropagation(); setFlippedCard(null); }}
                          >
                            Tap to close
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!showMoreWords && kidsWords.length > displayWords.length && (
                <div className="more-words-row">
                  <button
                    className="more-words-btn"
                    onClick={() => setShowMoreWords(true)}
                  >
                    More Words ↓ ({kidsWords.length - displayWords.length} more)
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* REVIEW TAB */}
          {activeTab === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {dueWords.length === 0 ? (
                <div className="words-empty">
                  <span className="words-empty-emoji"><KidIcon name="star" size={48} /></span>
                  <h3>All caught up!</h3>
                  <p>No words to review right now. Keep learning!</p>
                </div>
              ) : (() => {
                const currentDue = dueWords[reviewIndex];
                const matchedWord = kidsWords.find((w) => w.word === currentDue?.wordId || w.id === currentDue?.wordId);
                return (
                  <div className="review-container">
                    <p className="review-progress">
                      {reviewIndex + 1} of {dueWords.length} words
                    </p>

                    <div
                      className="review-flashcard"
                      onClick={() => setReviewRevealed(true)}
                    >
                      <div className="review-letter-badge">{(dueWords[reviewIndex]?.wordId || '?').charAt(0).toUpperCase()}</div>

                      {reviewRevealed ? (
                        <>
                          <span className="review-word">{currentDue?.wordId}</span>
                          <span className="review-translation">{matchedWord?.turkish || ''}</span>
                        </>
                      ) : (
                        <>
                          <span className="review-question">?</span>
                          <span className="review-hint">Tap to see the word!</span>
                        </>
                      )}
                    </div>

                    {reviewRevealed && (
                      <div className="review-buttons">
                        <button
                          className="review-btn again"
                          onClick={() => handleReviewAnswer(false)}
                        >
                          Show me again
                        </button>
                        <button
                          className="review-btn know"
                          onClick={() => handleReviewAnswer(true)}
                        >
                          I know it!
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* MY WORDS TAB */}
          {activeTab === 'mywords' && (
            <motion.div
              key="mywords"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {myWords.length === 0 ? (
                <div className="words-empty">
                  <span className="words-empty-emoji"><KidIcon name="star" size={48} /></span>
                  <h3>No words yet!</h3>
                  <p>Tap "I know this!" on word cards to add them here.</p>
                </div>
              ) : (
                <div className="kid-word-cards">
                  {myWords.map((word, idx) => (
                    <motion.div
                      key={`my-${word.word}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                      className="kid-word-card"
                      onClick={() => playWordAudio(word)}
                    >
                      <div className="kid-card-front">
                        <div className="kid-card-visual">
                          {word.image_url ? (
                            <img src={word.image_url} alt={word.turkish} className="kid-card-image" loading="lazy" />
                          ) : (
                            <div className="kid-card-letter-badge">{word.word.charAt(0).toUpperCase()}</div>
                          )}
                        </div>
                        <h3 className="kid-card-word">{word.word}</h3>
                        <p className="kid-card-turkish">{word.turkish}</p>
                        {learnedWords.has(word.word) && <span className="learned-badge"><KidIcon name="check" size={16} /></span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MimiGuide
        message="Tap a card to flip it, then listen to the word!"
        messageTr="Kartı çevirmek için dokun, sonra kelimeyi dinle!"
        showOnce="mimi_guide_words"
      />
    </div>
  );
};

export default Words;
