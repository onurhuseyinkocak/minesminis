/**
 * STORIES GRID PAGE
 * Browse AI-generated stories — children see a grid of story cards.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Sparkles, Clock, Star, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { KidIcon } from '../components/ui';
import { generateStoryCover } from '../utils/storyCoverGenerator';
import { getStoriesForUser, type DecodableStory, type ScoredStory } from '../services/decodableStoryService';
import DecodableStoryReader from '../components/DecodableStoryReader';
import { useAuth } from '../contexts/AuthContext';
import './StoriesGrid.css';

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

const SKELETON_COUNT = 6;
type Tab = 'all' | 'decodable';

export default function StoriesGrid() {
  usePageTitle('Hikayeler', 'Stories');
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [activeDecodableStory, setActiveDecodableStory] = useState<DecodableStory | null>(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest';
  const scoredStories = useMemo(() => getStoriesForUser(userId), [userId]);

  const fetchStories = useCallback(() => {
    setError(null);
    setIsStale(false);
    setLoading(true);
    fetch('/api/stories')
      .then(r => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
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
            const ageHours = (Date.now() - savedAt) / 3600000;
            setStories(data);
            if (ageHours > 24) setIsStale(true);
            setError(null);
          } catch {
            setError(lang === 'tr' ? 'Hikayeler yüklenemedi. Tekrar dene.' : 'Could not load stories. Please try again.');
          }
        } else {
          setError(lang === 'tr' ? 'Hikayeler yüklenemedi. Tekrar dene.' : 'Could not load stories. Please try again.');
        }
        setLoading(false);
      });
  }, [lang]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Generate covers for stories that don't have one
  useEffect(() => {
    if (stories.length === 0) return;
    const storiesWithoutCover = stories.filter(s => !s.coverUrl && !coverUrls[s.id]);
    if (storiesWithoutCover.length === 0) return;

    storiesWithoutCover.forEach(story => {
      generateStoryCover({
        title: story.title,
        locationId: story.location ?? story.cover_scene ?? 'forest',
        characterIds: story.characters ?? [],
        mood: undefined,
      })
        .then(dataUrl => {
          setCoverUrls(prev => ({ ...prev, [story.id]: dataUrl }));
        })
        .catch(() => {
          // Silently fail — StoryCover SVG will be shown instead
        });
    });
  }, [stories, coverUrls]);

  // Show full-screen decodable reader when a story is active
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
    <div className="stories-grid-page">
      <div className="stories-grid-hero">
        <Sparkles size={20} className="stories-grid-hero__sparkle stories-grid-hero__sparkle--1" />
        <Sparkles size={16} className="stories-grid-hero__sparkle stories-grid-hero__sparkle--2" />
        <Sparkles size={14} className="stories-grid-hero__sparkle stories-grid-hero__sparkle--3" />
        <span className="stories-grid-hero__icon"><KidIcon name="stories" size={40} /></span>
        <h1>{lang === 'tr' ? 'Hikayeler' : 'Stories'}</h1>
        <p>{lang === 'tr' ? "Mimi'nin büyülü hikayeleri" : "Mimi's Magical Stories"}</p>
        <p className="stories-grid-hero__subtitle">
          {lang === 'tr'
            ? 'Bir hikaye seç ve maceraya başla!'
            : 'Choose a story and start your adventure!'}
        </p>
      </div>

      {/* ── Offline stale cache banner ── */}
      {isStale && (
        <div className="stories-stale-banner">
          Çevrimdışı — son kaydedilen içerik gösteriliyor
        </div>
      )}

      {/* ── Tab Filter ── */}
      <div className="stories-tabs">
        <button
          className={`stories-tab${activeTab === 'all' ? ' stories-tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Sparkles size={15} />
          {lang === 'tr' ? 'Tüm Hikayeler' : 'All Stories'}
        </button>
        <button
          className={`stories-tab${activeTab === 'decodable' ? ' stories-tab--active' : ''}`}
          onClick={() => setActiveTab('decodable')}
        >
          <BookOpen size={15} />
          {lang === 'tr' ? 'Fonik Hikayeler' : 'Decodable'}
          <span className="stories-tab__badge">{scoredStories.length}</span>
        </button>
      </div>

      {/* ── Decodable Stories Tab ── */}
      {activeTab === 'decodable' && (
        <div className="stories-decodable">
          <p className="stories-decodable__intro">
            {lang === 'tr'
              ? 'Bu hikayeler yalnızca öğrendiğin sesler kullanılarak yazılmıştır. Her kelimeyi okuyabilirsin!'
              : 'These stories only use sounds you have already learned. You can decode every word!'}
          </p>
          <div className="stories-grid">
            {scoredStories.map(({ story: ds, knownWords, totalWords, level }: ScoredStory) => (
              <button
                key={ds.id}
                type="button"
                className={`story-card story-card--decodable story-card--coverage-${level}`}
                onClick={() => setActiveDecodableStory(ds)}
                aria-label={lang === 'tr' ? ds.titleTr : ds.title}
              >
                <div className="story-card__cover story-card__cover--decodable">
                  <span className="story-card__group-badge">
                    {lang === 'tr' ? `Grup ${ds.phonicsGroup}` : `Group ${ds.phonicsGroup}`}
                  </span>
                  {level === 'ready' && (
                    <span className="story-card__ready-badge">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                      {lang === 'tr' ? 'Hazır!' : 'Ready!'}
                    </span>
                  )}
                  <BookOpen size={40} color="white" strokeWidth={1.5} />
                </div>
                <div className="story-card__info">
                  <h3>{lang === 'tr' ? ds.titleTr : ds.title}</h3>
                  <p className="story-card__decodable-meta">
                    {lang === 'tr'
                      ? `${ds.wordCount} kelime · %${ds.decodabilityScore} çözümlenebilir`
                      : `${ds.wordCount} words · ${ds.decodabilityScore}% decodable`}
                  </p>
                  <div className="story-card__meta">
                    <span>
                      <Star size={14} />
                      {ds.topic}
                    </span>
                    <span className={`story-coverage-tag story-coverage-tag--${level}`}>
                      {totalWords > 0
                        ? (lang === 'tr'
                          ? `${knownWords}/${totalWords} kelime biliniyor`
                          : `Knows ${knownWords}/${totalWords} words`)
                        : (lang === 'tr' ? 'Fonik' : 'Phonics')}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'all' && (error ? (
        <div className="stories-empty stories-error">
          <AlertTriangle size={48} />
          <p>{error}</p>
          <button
            type="button"
            className="stories-retry-btn"
            onClick={fetchStories}
          >
            {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
          </button>
        </div>
      ) : loading ? (
        <div className="stories-loading-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="story-skeleton">
              <div className="story-skeleton__cover" />
              <div className="story-skeleton__content">
                <div className="story-skeleton__line story-skeleton__line--title" />
                <div className="story-skeleton__line" />
                <div className="story-skeleton__line story-skeleton__line--short" />
              </div>
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="stories-empty">
          <BookOpen size={48} />
          <h3 className="stories-empty__title">
            {lang === 'tr' ? 'Henüz hikaye eklenmedi' : 'No stories yet'}
          </h3>
          <p className="stories-empty__hint">
            {lang === 'tr'
              ? 'Fonik Hikayeler sekmesinde seni bekleyen hikayeler var!'
              : 'Check out the Decodable tab for stories waiting for you!'}
          </p>
          <button
            className="stories-retry-btn"
            onClick={() => setActiveTab('decodable')}
          >
            {lang === 'tr' ? 'Fonik Hikayelere Git' : 'Explore Decodable Stories'}
          </button>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map(story => {
            const resolvedCoverUrl = story.coverUrl ?? coverUrls[story.id];
            return (
            <button
              key={story.id}
              type="button"
              className="story-card"
              onClick={() => navigate(`/stories/${story.id}`)}
              aria-label={lang === 'tr' ? story.title_tr : story.title}
            >
              <div className="story-card__cover">
                {resolvedCoverUrl ? (
                  <img
                    src={resolvedCoverUrl}
                    alt={story.title}
                    className="story-grid__card-cover"
                  />
                ) : (
                  <StoryCover scene={story.cover_scene} storyId={story.id} />
                )}
              </div>
              <div className="story-card__info">
                <h3>{lang === 'tr' ? story.title_tr : story.title}</h3>
                <p>{lang === 'tr' ? story.summary_tr : story.summary}</p>
                <div className="story-card__meta">
                  <span>
                    <Clock size={14} />
                    {new Date(story.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                  </span>
                  {story.target_age?.length >= 2 && (
                    <span>
                      <Star size={14} />
                      {story.target_age[0]}-{story.target_age[1]}
                    </span>
                  )}
                </div>
              </div>
            </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Story Cover SVG ──────────────────────────────────────────────────────────

interface StoryCoverProps {
  scene: string;
  storyId: string;
}

function StoryCover({ scene, storyId }: StoryCoverProps) {
  const s = scene?.toLowerCase() ?? '';

  const isForest = s.includes('forest') || s.includes('tree') || s.includes('orman');
  const isOcean = s.includes('ocean') || s.includes('sea') || s.includes('water') || s.includes('deniz');
  const isSpace = s.includes('space') || s.includes('star') || s.includes('uzay') || s.includes('yıldız');
  const isMountain = s.includes('mountain') || s.includes('snow') || s.includes('dağ') || s.includes('kar');
  const isDesert = s.includes('desert') || s.includes('sand') || s.includes('çöl');

  // Tailwind color equivalents (used as SVG fill values)
  // #1a4a2e ≈ emerald-900, #2d6a4f ≈ emerald-700, #0a3d62 ≈ blue-900
  // #0c0c2e/#1a1a4e ≈ indigo-950/indigo-900, #2c3e50/#4a6572 ≈ slate-700/slate-600
  // #7a4a1e/#c8841c ≈ amber-900/amber-600, #1a2332/#2a3f55 ≈ slate-800/slate-700
  const bg1 = isForest ? '#14532d'  /* emerald-900 */
    : isOcean ? '#1e3a5f'           /* blue-900 */
    : isSpace ? '#1e1b4b'           /* indigo-950 */
    : isMountain ? '#334155'        /* slate-700 */
    : isDesert ? '#78350f'          /* amber-900 */
    : '#1e293b';                    /* slate-800 */

  const bg2 = isForest ? '#065f46'  /* emerald-800 */
    : isOcean ? '#1d4ed8'           /* blue-700 */
    : isSpace ? '#312e81'           /* indigo-900 */
    : isMountain ? '#475569'        /* slate-600 */
    : isDesert ? '#d97706'          /* amber-600 */
    : '#334155';                    /* slate-700 */

  // Stable random-looking star positions (seeded by scene string hash)
  const starSeeds = React.useMemo(() => {
    const hash = scene ? [...scene].reduce((acc, c) => acc + c.charCodeAt(0), 0) : 42;
    return Array.from({ length: 20 }, (_, i) => {
      const seed = (hash + i * 137) % 1000;
      return {
        cx: (seed * 3 % 300),
        cy: (seed * 7 % 200),
        r: (seed % 3) * 0.6 + 0.5,
        op: ((seed % 5) * 0.15 + 0.25).toFixed(2),
      };
    });
  }, [scene]);

  const gradId = `sg-${storyId}-${bg1.replace('#', '')}`;

  return (
    <svg viewBox="0 0 300 200" className="story-cover-svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg1} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill={`url(#${gradId})`} />

      {/* Stars — always subtle background */}
      {starSeeds.slice(0, isSpace ? 20 : 8).map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={Number(s.op) * (isSpace ? 1 : 0.3)} />
      ))}

      {isForest && (
        <>
          <ellipse cx="75" cy="148" rx="36" ry="52" fill="#065f46" opacity="0.85" />{/* emerald-800 */}
          <rect x="70" y="148" width="10" height="32" fill="#78350f" />{/* amber-900 trunk */}
          <ellipse cx="225" cy="155" rx="30" ry="42" fill="#059669" opacity="0.75" />{/* emerald-600 */}
          <rect x="220" y="155" width="10" height="26" fill="#78350f" />{/* amber-900 trunk */}
          <ellipse cx="150" cy="160" rx="28" ry="38" fill="#34d399" opacity="0.55" />{/* emerald-400 */}
          <rect x="145" y="160" width="10" height="22" fill="#92400e" />{/* amber-800 trunk */}
          {/* Moon */}
          <circle cx="250" cy="30" r="16" fill="#fcd34d" opacity="0.7" />{/* yellow-300 */}
        </>
      )}

      {isOcean && (
        <>
          <ellipse cx="150" cy="185" rx="210" ry="28" fill="#1d4ed8" opacity="0.7" />{/* blue-700 */}
          <ellipse cx="150" cy="195" rx="220" ry="22" fill="#1e3a5f" opacity="0.6" />{/* blue-900 */}
          <circle cx="90" cy="130" r="9" fill="#67e8f9" opacity="0.45" />{/* cyan-300 */}
          <circle cx="210" cy="140" r="7" fill="#67e8f9" opacity="0.35" />{/* cyan-300 */}
          {/* Sun/moon */}
          <circle cx="240" cy="35" r="22" fill="#fcd34d" opacity="0.75" />{/* yellow-300 */}
        </>
      )}

      {isSpace && (
        <>
          <circle cx="245" cy="42" r="22" fill="#fcd34d" opacity="0.82" />{/* yellow-300 */}
          <circle cx="62" cy="58" r="14" fill="#93c5fd" opacity="0.55" />{/* blue-300 */}
          <ellipse cx="150" cy="175" rx="140" ry="20" fill="#1e1b4b" opacity="0.4" />{/* indigo-950 */}
        </>
      )}

      {isMountain && (
        <>
          <polygon points="40,200 140,55 240,200" fill="#475569" opacity="0.75" />{/* slate-600 */}
          <polygon points="130,200 215,75 300,200" fill="#64748b" opacity="0.65" />{/* slate-500 */}
          <polygon points="118,62 140,55 162,62 152,48" fill="white" opacity="0.88" />
          <circle cx="240" cy="32" r="18" fill="#fcd34d" opacity="0.7" />{/* yellow-300 */}
        </>
      )}

      {isDesert && (
        <>
          <ellipse cx="150" cy="185" rx="220" ry="30" fill="#d97706" opacity="0.45" />{/* amber-600 */}
          <polygon points="40,200 80,140 120,200" fill="#b45309" opacity="0.6" />{/* amber-700 */}
          <polygon points="180,200 230,130 280,200" fill="#92400e" opacity="0.55" />{/* amber-800 */}
          <circle cx="245" cy="35" r="24" fill="#fcd34d" opacity="0.85" />{/* yellow-300 */}
        </>
      )}

      {/* Fallback pattern for generic scenes */}
      {!isForest && !isOcean && !isSpace && !isMountain && !isDesert && (
        <>
          <circle cx="240" cy="35" r="20" fill="#fcd34d" opacity="0.7" />{/* yellow-300 */}
          <ellipse cx="150" cy="185" rx="180" ry="22" fill="rgba(255,255,255,0.06)" />
        </>
      )}

      {/* Book icon overlay — subtle branding */}
      <rect x="134" y="84" width="32" height="32" rx="4" fill="rgba(255,255,255,0.07)" />
      <rect x="140" y="88" width="20" height="24" rx="2" fill="rgba(255,255,255,0.12)" />
      <line x1="150" y1="88" x2="150" y2="112" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
}
