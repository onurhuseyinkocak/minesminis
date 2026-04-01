/**
 * STORIES GRID PAGE
 * Browse AI-generated stories — children see a grid of story cards.
 */

import { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Sparkles, Clock, Star, BookOpen, AlertTriangle, CheckCircle2, Crown, Loader2 } from 'lucide-react';
import { generateStoryCover } from '../utils/storyCoverGenerator';
import { getStoriesForUser, type DecodableStory, type ScoredStory } from '../services/decodableStoryService';
import DecodableStoryReader from '../components/DecodableStoryReader';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import Paywall from '../components/Paywall';
import { motion, AnimatePresence } from 'framer-motion';

function isChildModeActive(settings: Record<string, unknown> | undefined): boolean {
  if (typeof settings?.ageGroup === 'string' && settings.ageGroup === '3-5') return true;
  try { return localStorage.getItem('mm_child_mode') === 'true'; } catch { return false; }
}

const CHILD_MODE_MAX_AGE = 8;

interface StoryCard {
  id: string;
  title: string;
  title_tr: string;
  summary: string;
  summary_tr: string;
  cover_scene: string;
  target_age: number[];
  created_at: string;
  coverUrl?: string;
  characters?: string[];
  location?: string;
}

type Tab = 'all' | 'decodable';

function isStoryCompleted(storyId: string): boolean {
  try { return localStorage.getItem(`mm_story_completed_${storyId}`) === '1'; } catch { return false; }
}

const GRADIENT_SETS = [
  'from-violet-400 to-purple-600',
  'from-sky-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-pink-400 to-rose-600',
  'from-indigo-400 to-blue-700',
];

export default function StoriesGrid() {
  usePageTitle('Hikayeler', 'Stories');
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [isTabTransitioning, startTabTransition] = useTransition();
  const [activeDecodableStory, setActiveDecodableStory] = useState<DecodableStory | null>(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { isPremium } = usePremium();
  const userId = user?.uid ?? 'guest';
  const childMode = isChildModeActive(userProfile?.settings);
  const scoredStories = useMemo(() => getStoriesForUser(userId), [userId]);

  const fetchStories = useCallback(() => {
    setError(null);
    setIsStale(false);
    setLoading(true);
    fetch('/api/stories')
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then((d: { stories?: StoryCard[] }) => {
        const fetched = d.stories ?? [];
        setStories(fetched);
        localStorage.setItem('mm_stories_cache', JSON.stringify({ data: fetched, savedAt: Date.now() }));
        setLoading(false);
      })
      .catch(() => {
        const cached = localStorage.getItem('mm_stories_cache');
        if (cached) {
          try {
            const { data, savedAt } = JSON.parse(cached) as { data: StoryCard[]; savedAt: number };
            setStories(data);
            if ((Date.now() - savedAt) / 3600000 > 24) setIsStale(true);
            setError(null);
          } catch {
            setError(lang === 'tr' ? 'Hikayeler yuklenemedi. Tekrar dene.' : 'Could not load stories. Please try again.');
          }
        } else {
          setError(lang === 'tr' ? 'Hikayeler yuklenemedi. Tekrar dene.' : 'Could not load stories. Please try again.');
        }
        setLoading(false);
      });
  }, [lang]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  useEffect(() => {
    if (stories.length === 0) return;
    const without = stories.filter(s => !s.coverUrl && !coverUrls[s.id]);
    if (without.length === 0) return;
    without.forEach(story => {
      generateStoryCover({
        title: story.title,
        locationId: story.location ?? story.cover_scene ?? 'forest',
        characterIds: story.characters ?? [],
        mood: undefined,
      }).then(dataUrl => {
        setCoverUrls(prev => ({ ...prev, [story.id]: dataUrl }));
      }).catch(() => {});
    });
  }, [stories, coverUrls]);

  if (activeDecodableStory) {
    return (
      <DecodableStoryReader
        story={activeDecodableStory}
        onComplete={() => setActiveDecodableStory(null)}
        highlightMode
        lang={lang as 'en' | 'tr'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-50 px-4 py-6 pb-24">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-violet-100 mb-3">
          <Sparkles size={28} className="text-violet-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {lang === 'tr' ? 'Hikayeler' : 'Stories'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {lang === 'tr' ? 'Bir hikaye sec ve maceraya basla!' : 'Choose a story and start your adventure!'}
        </p>
      </div>

      {/* Stale banner */}
      {isStale && (
        <div className="bg-amber-100 text-amber-700 text-xs font-medium text-center py-2 px-4 rounded-2xl mb-4 max-w-lg mx-auto">
          {lang === 'tr' ? 'Cevrimdisi -- son kaydedilen icerik gosteriliyor' : 'Offline -- showing cached content'}
        </div>
      )}

      {/* Tab toggle */}
      <div className="flex bg-white rounded-3xl p-1 max-w-xs mx-auto mb-6 shadow-sm">
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 min-h-[48px] rounded-3xl text-sm font-bold transition-all ${
            activeTab === 'all' ? 'bg-violet-500 text-white shadow' : 'text-gray-500'
          }`}
          onClick={() => startTabTransition(() => setActiveTab('all'))}
          disabled={isTabTransitioning}
        >
          <Sparkles size={15} />
          {lang === 'tr' ? 'Hikayeler' : 'Stories'}
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 min-h-[48px] rounded-3xl text-sm font-bold transition-all ${
            activeTab === 'decodable' ? 'bg-violet-500 text-white shadow' : 'text-gray-500'
          }`}
          onClick={() => startTabTransition(() => setActiveTab('decodable'))}
          disabled={isTabTransitioning}
        >
          <BookOpen size={15} />
          {lang === 'tr' ? 'Fonik' : 'Phonics'}
          <span className="bg-violet-200 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {scoredStories.length}
          </span>
        </button>
      </div>

      {/* Decodable tab */}
      {activeTab === 'decodable' && (
        <div className="max-w-lg mx-auto">
          {scoredStories.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <BookOpen size={48} className="text-gray-300" />
              <p className="text-sm text-gray-500 text-center">
                {lang === 'tr'
                  ? 'Birkac ders tamamlayinca sana ozel hikayeler burada belirecek!'
                  : 'Complete a few lessons and personalised stories will appear here!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {scoredStories.map(({ story: ds, knownWords, totalWords, level }: ScoredStory, i) => (
                <motion.button
                  key={ds.id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300, delay: i * 0.05 }}
                  className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 text-left ${
                    level === 'ready' ? 'ring-2 ring-emerald-400' : ''
                  }`}
                  onClick={() => setActiveDecodableStory(ds)}
                  aria-label={lang === 'tr' ? ds.titleTr : ds.title}
                >
                  <div className={`h-24 bg-gradient-to-br ${GRADIENT_SETS[i % GRADIENT_SETS.length]} flex items-center justify-center relative`}>
                    <BookOpen size={32} className="text-white/80" />
                    {level === 'ready' && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} /> {lang === 'tr' ? 'Hazir' : 'Ready'}
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/30 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {lang === 'tr' ? `Grup ${ds.phonicsGroup}` : `Group ${ds.phonicsGroup}`}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-1">
                      {lang === 'tr' ? ds.titleTr : ds.title}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {ds.wordCount} {lang === 'tr' ? 'kelime' : 'words'}
                      {totalWords > 0 && ` · ${knownWords}/${totalWords}`}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All stories tab - paywall */}
      {activeTab === 'all' && !isPremium && (
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-3 opacity-50 blur-[2px] pointer-events-none mb-4">
            {['forest', 'ocean', 'space'].map((scene, i) => (
              <div key={scene} className={`bg-gradient-to-br ${GRADIENT_SETS[i]} h-36 rounded-3xl flex items-center justify-center`}>
                <Crown size={32} className="text-white/60" />
              </div>
            ))}
          </div>
          <Paywall feature={lang === 'tr' ? 'AI Hikayeler' : 'AI Stories'} />
        </div>
      )}

      {/* All stories tab - content */}
      {activeTab === 'all' && isPremium && (
        <div className="max-w-lg mx-auto">
          {error ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <AlertTriangle size={48} className="text-amber-400" />
              <p className="text-sm text-gray-600">{error}</p>
              <button
                type="button"
                className="min-h-[48px] px-6 bg-violet-500 text-white text-sm font-bold rounded-3xl"
                onClick={fetchStories}
              >
                {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <Loader2 size={40} className="text-violet-500 animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <BookOpen size={48} className="text-gray-300" />
              <p className="text-sm text-gray-500">
                {lang === 'tr' ? 'Henuz hikaye eklenmedi' : 'No stories yet'}
              </p>
              <button
                className="min-h-[48px] px-6 bg-violet-500 text-white text-sm font-bold rounded-3xl"
                onClick={() => setActiveTab('decodable')}
              >
                {lang === 'tr' ? 'Fonik Hikayelere Git' : 'Explore Phonics Stories'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {stories
                  .filter(story => !childMode || !story.target_age?.length || story.target_age[0] <= CHILD_MODE_MAX_AGE)
                  .map((story, i) => {
                    const resolvedCoverUrl = story.coverUrl ?? coverUrls[story.id];
                    const isNew = (Date.now() - new Date(story.created_at).getTime()) < 7 * 24 * 3600 * 1000;
                    const completed = isStoryCompleted(story.id);
                    return (
                      <motion.button
                        key={story.id}
                        type="button"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300, delay: i * 0.04 }}
                        className={`bg-white rounded-3xl overflow-hidden shadow-sm border text-left ${
                          completed ? 'border-emerald-200' : 'border-gray-100'
                        }`}
                        onClick={() => navigate(`/stories/${story.id}`)}
                        aria-label={lang === 'tr' ? story.title_tr : story.title}
                      >
                        <div className={`h-28 bg-gradient-to-br ${GRADIENT_SETS[i % GRADIENT_SETS.length]} relative overflow-hidden`}>
                          {resolvedCoverUrl && (
                            <img src={resolvedCoverUrl} alt="" className="w-full h-full object-cover" />
                          )}
                          {completed && (
                            <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={10} /> {lang === 'tr' ? 'Bitti' : 'Done'}
                            </span>
                          )}
                          {!completed && isNew && (
                            <span className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {lang === 'tr' ? 'Yeni' : 'New'}
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-1">
                            {lang === 'tr' ? story.title_tr : story.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <Clock size={11} />
                            {new Date(story.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                            {story.target_age?.length >= 2 && (
                              <span className="flex items-center gap-0.5">
                                <Star size={11} /> {story.target_age[0]}-{story.target_age[1]}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
