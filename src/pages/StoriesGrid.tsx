/**
 * STORIES GRID PAGE
 * Beautiful grid of phonics stories with themed illustrations.
 * Uses topic-based cover images and a clean, child-friendly design.
 */

import { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { BookOpen, CheckCircle2, Sparkles, Star, Volume2 } from 'lucide-react';
import { getStoriesForUser, type DecodableStory, type ScoredStory } from '../services/decodableStoryService';
import DecodableStoryReader from '../components/DecodableStoryReader';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// ─── Topic-based cover image URLs (children's illustration style) ────────────
// Using picsum.photos with seed for deterministic, beautiful images per story topic
const TOPIC_COVERS: Record<string, string> = {
  friends: 'https://illustrations.popsy.co/amber/friends.svg',
  adventure: 'https://illustrations.popsy.co/amber/backpacking.svg',
  animals: 'https://illustrations.popsy.co/amber/cute-cat.svg',
  nature: 'https://illustrations.popsy.co/amber/plant-growing.svg',
  food: 'https://illustrations.popsy.co/amber/coffee-break.svg',
  school: 'https://illustrations.popsy.co/amber/studying.svg',
  family: 'https://illustrations.popsy.co/amber/home-office.svg',
  play: 'https://illustrations.popsy.co/amber/playing-cards.svg',
  music: 'https://illustrations.popsy.co/amber/musician.svg',
  sport: 'https://illustrations.popsy.co/amber/cycling.svg',
};

const FALLBACK_COVER = 'https://illustrations.popsy.co/amber/reading-book.svg';

// ─── Color themes per phonics group ──────────────────────────────────────────
const GROUP_THEMES = [
  { bg: 'from-orange-100 to-amber-50', accent: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200', ring: 'ring-orange-300' },
  { bg: 'from-sky-100 to-blue-50', accent: 'bg-sky-500', badge: 'bg-sky-100 text-sky-700', border: 'border-sky-200', ring: 'ring-sky-300' },
  { bg: 'from-emerald-100 to-green-50', accent: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-300' },
  { bg: 'from-violet-100 to-purple-50', accent: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200', ring: 'ring-violet-300' },
  { bg: 'from-pink-100 to-rose-50', accent: 'bg-pink-500', badge: 'bg-pink-100 text-pink-700', border: 'border-pink-200', ring: 'ring-pink-300' },
  { bg: 'from-teal-100 to-cyan-50', accent: 'bg-teal-500', badge: 'bg-teal-100 text-teal-700', border: 'border-teal-200', ring: 'ring-teal-300' },
];

function getTheme(group: number) {
  return GROUP_THEMES[(group - 1) % GROUP_THEMES.length];
}

function getCover(topic: string) {
  return TOPIC_COVERS[topic] || FALLBACK_COVER;
}

function isStoryCompleted(storyId: string): boolean {
  try { return localStorage.getItem(`mm_story_completed_${storyId}`) === '1'; } catch { return false; }
}

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const GROUP_FILTERS = [
  { value: 0, labelTr: 'Hepsi', labelEn: 'All' },
  { value: 1, labelTr: 'Grup 1', labelEn: 'Group 1' },
  { value: 2, labelTr: 'Grup 2', labelEn: 'Group 2' },
  { value: 3, labelTr: 'Grup 3', labelEn: 'Group 3' },
  { value: 4, labelTr: 'Grup 4', labelEn: 'Group 4' },
  { value: 5, labelTr: 'Grup 5', labelEn: 'Group 5' },
  { value: 6, labelTr: 'Grup 6', labelEn: 'Group 6' },
];

export default function StoriesGrid() {
  usePageTitle('Hikayeler', 'Stories');
  const [activeDecodableStory, setActiveDecodableStory] = useState<DecodableStory | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const { lang } = useLanguage();
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest';
  const scoredStories = useMemo(() => getStoriesForUser(userId), [userId]);

  const filtered = useMemo(() => {
    if (selectedGroup === 0) return scoredStories;
    return scoredStories.filter(s => s.story.phonicsGroup === selectedGroup);
  }, [scoredStories, selectedGroup]);

  // Full-screen reader
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
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pb-24">
      {/* ── Header ── */}
      <div className="pt-6 pb-4 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-gradient-to-br from-primary-400 to-primary-500 shadow-lg mb-3"
        >
          <BookOpen size={32} className="text-white" />
        </motion.div>
        <h1 className="font-display font-black text-2xl text-ink-900">
          {lang === 'tr' ? 'Hikaye Kitapligi' : 'Story Library'}
        </h1>
        <p className="font-body text-sm text-ink-500 mt-1">
          {lang === 'tr'
            ? `${scoredStories.length} hikaye seni bekliyor!`
            : `${scoredStories.length} stories waiting for you!`}
        </p>
      </div>

      {/* ── Group Filter Pills ── */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-3xl mx-auto justify-center flex-wrap">
          {GROUP_FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSelectedGroup(f.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-display font-bold transition-all duration-200 ${
                selectedGroup === f.value
                  ? 'bg-primary-500 text-white shadow-md scale-105'
                  : 'bg-white text-ink-500 border border-ink-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {lang === 'tr' ? f.labelTr : f.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stories Grid ── */}
      <div className="max-w-4xl mx-auto px-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-ink-100 flex items-center justify-center">
              <BookOpen size={36} className="text-ink-300" />
            </div>
            <p className="font-body text-ink-500 text-center">
              {lang === 'tr'
                ? 'Bu grupta henuz hikaye yok.'
                : 'No stories in this group yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(({ story: ds, knownWords, totalWords, level }: ScoredStory, i) => {
              const theme = getTheme(ds.phonicsGroup);
              const cover = getCover(ds.topic);
              const completed = isStoryCompleted(ds.id);
              const title = lang === 'tr' ? ds.titleTr : ds.title;

              return (
                <motion.button
                  key={ds.id}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 280, delay: i * 0.03 }}
                  className={`group relative bg-white rounded-2xl overflow-hidden border-2 ${theme.border} text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-300 ${
                    completed ? `ring-2 ${theme.ring}` : ''
                  }`}
                  onClick={() => setActiveDecodableStory(ds)}
                  aria-label={title}
                >
                  {/* Cover Image Area */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${theme.bg} overflow-hidden`}>
                    {/* Illustration */}
                    <img
                      src={cover}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-4 opacity-80 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Completed badge */}
                    {completed && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    )}

                    {/* Ready badge */}
                    {!completed && level === 'ready' && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-display font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles size={10} />
                        {lang === 'tr' ? 'Hazir' : 'Ready'}
                      </div>
                    )}

                    {/* Group badge */}
                    <div className={`absolute bottom-2 left-2 ${theme.badge} text-[10px] font-display font-bold px-2.5 py-1 rounded-full`}>
                      {lang === 'tr' ? `Grup ${ds.phonicsGroup}` : `G${ds.phonicsGroup}`}
                    </div>

                    {/* Listen icon */}
                    <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                      <Volume2 size={12} className="text-ink-600" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-3">
                    <h3 className="font-display font-bold text-sm text-ink-900 leading-tight line-clamp-2 mb-1.5 group-hover:text-primary-600 transition-colors">
                      {title}
                    </h3>

                    {/* Stats row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {ds.wordCount > 0 && (
                        <span className="text-[11px] font-body text-ink-400">
                          {ds.wordCount} {lang === 'tr' ? 'kelime' : 'words'}
                        </span>
                      )}
                      {totalWords > 0 && (
                        <span className="text-[11px] font-body text-ink-400 flex items-center gap-0.5">
                          <Star size={10} className="text-amber-400" />
                          {knownWords}/{totalWords}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {totalWords > 0 && (
                      <div className="mt-2 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            knownWords >= totalWords ? 'bg-emerald-400' : 'bg-primary-400'
                          }`}
                          style={{ width: `${Math.min(100, (knownWords / totalWords) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
