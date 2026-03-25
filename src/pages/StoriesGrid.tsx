/**
 * STORIES GRID PAGE
 * Browse AI-generated stories — children see a grid of story cards.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, Clock, Star } from 'lucide-react';
import { KidIcon } from '../components/ui';
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
}

const SKELETON_COUNT = 6;

export default function StoriesGrid() {
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/stories')
      .then(r => r.json())
      .then(d => {
        setStories(d.stories || []);
        setLoading(false);
      })
      .catch(() => {
        setError(lang === 'tr' ? 'Hikayeler yüklenemedi. Tekrar dene.' : 'Could not load stories. Please try again.');
        setLoading(false);
      });
  }, [lang]);

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

      {error ? (
        <div className="stories-empty stories-error">
          <Sparkles size={48} />
          <p>{error}</p>
          <button
            className="stories-retry-btn"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetch('/api/stories')
                .then(r => r.json())
                .then(d => { setStories(d.stories || []); setLoading(false); })
                .catch(() => {
                  setError(lang === 'tr' ? 'Hikayeler yüklenemedi. Tekrar dene.' : 'Could not load stories. Please try again.');
                  setLoading(false);
                });
            }}
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
          <Sparkles size={48} />
          <p>{lang === 'tr' ? 'Mimi henüz yeni hikayeler hazırlıyor!' : 'Mimi is preparing new stories!'}</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {lang === 'tr'
              ? 'Yakında burada olacak.'
              : 'Coming soon.'}
          </p>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map(story => (
            <button
              key={story.id}
              className="story-card"
              onClick={() => navigate(`/stories/${story.id}`)}
              aria-label={lang === 'tr' ? story.title_tr : story.title}
            >
              <div className="story-card__cover">
                <StoryCover scene={story.cover_scene} />
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
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Story Cover SVG ──────────────────────────────────────────────────────────

interface StoryCoverProps {
  scene: string;
}

function StoryCover({ scene }: StoryCoverProps) {
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

  const gradId = `sg-${bg1.replace('#', '')}`;

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
