import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Volume2, Check, BookOpen } from "lucide-react";
import { supabase } from '../config/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { kidsWords as fallbackWords } from '../data/wordsData';
import { getCardThumbnailUrl } from '../utils/imageTransform';
import { updateWordProgress } from '../data/spacedRepetition';
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

const LS_LEARNED_KEY = 'mimi_learned_words';

function loadLearnedFromLS(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_LEARNED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveLearnedToLS(words: Set<string>) {
  try { localStorage.setItem(LS_LEARNED_KEY, JSON.stringify([...words])); } catch { /* */ }
}

const CATEGORY_COLORS: Record<string, string> = {
  Animals: '#FF6B6B', Phonics: '#4ECDC4', Colors: '#FFE66D', Food: '#FF8A5C',
  Family: '#A78BFA', Body: '#F472B6', Numbers: '#60A5FA', Nature: '#34D399',
  Sports: '#FB923C', School: '#818CF8', Home: '#F9A8D4', Clothes: '#38BDF8',
  Weather: '#FBBF24',
};

const CATEGORY_TR: Record<string, string> = {
  Phonics: 'Fonetik', Animals: 'Hayvanlar', Colors: 'Renkler', Food: 'Yiyecekler',
  Family: 'Aile', Body: 'Vucut', Numbers: 'Sayilar', Nature: 'Doga',
  Sports: 'Spor', School: 'Okul', Home: 'Ev', Clothes: 'Kiyafet', Weather: 'Hava',
};

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

// Skeleton card for loading state
function WordCardSkeleton() {
  return (
    <div className="aspect-square rounded-3xl bg-gray-100 animate-pulse" />
  );
}

const Words: React.FC = () => {
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
  const navigate = useNavigate();
  usePageTitle('Kelimeler', 'Words');

  const [kidsWords, setKidsWords] = useState<KidsWord[]>([]);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(loadLearnedFromLS);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeWord, setActiveWord] = useState<KidsWord | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  const speakWord = async (text: string) => {
    if (!text || isLoadingAudio) return;
    setIsLoadingAudio(true);
    try {
      const { auth: firebaseAuth } = await import('../config/firebase');
      const token = await firebaseAuth.currentUser?.getIdToken().catch(() => null);
      const response = await fetch(`${BACKEND_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('TTS API failed');
      const data = await response.json();
      const audioBase64 = data.audio ?? data.audioContent;
      if (audioBase64) {
        new Audio(`data:audio/mp3;base64,${audioBase64}`).play();
      } else { throw new Error('No audio content'); }
    } catch {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }
    } finally { setIsLoadingAudio(false); }
  };

  const fetchKidsWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('words')
        .select('id, word, turkish, level, category, emoji, example, word_audio_url, image_url, example_sentence, example_sentence_tr')
        .order('word').limit(500);
      if (error) throw error;
      setKidsWords((data && data.length > 0) ? data : fallbackWords);
    } catch { setKidsWords(fallbackWords); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchKidsWords(); }, [fetchKidsWords]);
  useEffect(() => { return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }; }, []);

  const playWordAudio = (wordObj: KidsWord) => {
    if (wordObj.word_audio_url) {
      const url = wordObj.word_audio_url.startsWith('http')
        ? wordObj.word_audio_url
        : `${window.location.origin}${wordObj.word_audio_url}`;
      const audio = new Audio(url);
      audio.onerror = () => speakWord(wordObj.word);
      audio.play().catch(() => speakWord(wordObj.word));
    } else { speakWord(wordObj.word); }
  };

  const toggleLearned = (word: string) => {
    const newLearned = new Set(learnedWords);
    if (newLearned.has(word)) { newLearned.delete(word); }
    else {
      newLearned.add(word);
      updateWordProgress(word, true);
      SFX.correct();
      toast.success(isTr ? 'Kelime ogrenildi!' : 'Word learned!');
    }
    setLearnedWords(newLearned);
    saveLearnedToLS(newLearned);
  };

  // Deduplicate
  const deduplicatedWords = useMemo(() => {
    const seen = new Set<string>();
    return kidsWords.filter(w => {
      const key = w.word.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }, [kidsWords]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, KidsWord[]>();
    for (const w of deduplicatedWords) {
      const list = map.get(w.category) || [];
      list.push(w);
      map.set(w.category, list);
    }
    return Array.from(map.entries()).map(([category, words]) => ({ category, words }));
  }, [deduplicatedWords]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-amber-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <BookOpen size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">{isTr ? 'Kelimelerim' : 'My Words'}</h1>
            {!isLoading && (
              <p className="text-xs text-gray-500">
                {deduplicatedWords.length} {isTr ? 'kelime' : 'words'} · {learnedWords.size} {isTr ? 'ogrenildi' : 'learned'}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/review/flashcards')}
            className="h-10 px-4 rounded-2xl bg-amber-500 text-white text-sm font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <KidIcon name="star" size={16} />
            {isTr ? 'Kartlar' : 'Cards'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <WordCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ category, words }) => {
              const color = CATEGORY_COLORS[category] || '#94A3B8';
              const label = isTr ? (CATEGORY_TR[category] ?? category) : category;
              return (
                <section key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 px-4 rounded-full flex items-center text-white text-sm font-bold" style={{ background: color }}>
                      {label}
                    </div>
                    <span className="text-xs text-gray-400">{words.length}</span>
                  </div>
                  {/* Word grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {words.map((word, idx) => {
                      const isLearned = learnedWords.has(word.word);
                      return (
                        <motion.button
                          key={word.id ?? `${word.word}-${idx}`}
                          type="button"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ ...spring, delay: Math.min(idx * 0.04, 0.5) }}
                          onClick={() => { playWordAudio(word); setActiveWord(word); }}
                          className={`
                            relative aspect-square rounded-3xl
                            flex flex-col items-center justify-center gap-1 p-3
                            border-2 shadow-sm active:scale-95 transition-transform
                            ${isLearned ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-white'}
                          `}
                        >
                          {word.image_url ? (
                            <img
                              src={getCardThumbnailUrl(word.image_url) ?? word.image_url ?? ''}
                              alt={word.turkish}
                              className="w-16 h-16 object-contain rounded-xl"
                              loading="lazy"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ background: color }}>
                              {word.word.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-base font-bold text-gray-800 leading-tight text-center">{word.word}</span>
                          <span className="text-xs text-gray-400 leading-tight">{word.turkish}</span>
                          {isLearned && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Word detail bottom sheet */}
      <AnimatePresence>
        {activeWord && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center"
            onClick={() => setActiveWord(null)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-t-[2rem] p-6 pb-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 rounded-full bg-gray-200 mx-auto mb-6" />
              <div className="flex flex-col items-center gap-4">
                {activeWord.image_url ? (
                  <img
                    src={getCardThumbnailUrl(activeWord.image_url) ?? activeWord.image_url ?? ''}
                    alt={activeWord.turkish}
                    className="w-24 h-24 object-contain rounded-2xl"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white"
                    style={{ background: CATEGORY_COLORS[activeWord.category] || '#94A3B8' }}
                  >
                    {activeWord.word.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-2xl font-black text-gray-800">{activeWord.word}</h2>
                <p className="text-base text-gray-500">{activeWord.turkish}</p>

                {/* Action buttons */}
                <div className="flex gap-3 w-full mt-2">
                  <button
                    type="button"
                    onClick={() => playWordAudio(activeWord)}
                    disabled={isLoadingAudio}
                    className="flex-1 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Volume2 size={20} />
                    {isTr ? 'Dinle' : 'Listen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLearned(activeWord.word)}
                    className={`flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform ${
                      learnedWords.has(activeWord.word) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Check size={20} />
                    {learnedWords.has(activeWord.word) ? (isTr ? 'Ogrendim!' : 'Learned!') : (isTr ? 'Biliyorum!' : 'I know!')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MimiGuide
        message="Tap a word card to hear it!"
        messageTr="Kelime kartina dokun ve dinle!"
        showOnce="mimi_guide_words"
      />
    </div>
  );
};

export default Words;
