import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Slide } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const getThumbnailUrl = (id: string) => `${SUPABASE_URL}/storage/v1/object/public/slides/thumbnails/${id}.png`

const chips = ['All', 'Easy', 'Medium']

function SlideCard({ s }: { s: Slide }) {
  const [thumbFailed, setThumbFailed] = useState(false)

  return (
    <Link to={`/slides/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="mm-card-cover">
        {!thumbFailed ? (
          <img
            src={getThumbnailUrl(s.id)}
            alt={s.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setThumbFailed(true)}
          />
        ) : (
          <Cover kind={s.cover_kind} />
        )}
        <div className="mm-card-cta"><Play size={18} /></div>
      </div>
      <div className="mm-card-body">
        <h3 className="mm-card-title">{s.title}</h3>
        <div className="mm-card-meta">
          <span className={`mm-tag ${s.level === 'Easy' ? 'green' : 'yellow'}`}>{s.level}</span>
        </div>
      </div>
    </Link>
  )
}

export default function SlidesList() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [activeChip, setActiveChip] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => { document.title = 'Slides - minesminis' }, [])

  useEffect(() => {
    supabase.from('mm_slides').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setSlides(data || []); setLoading(false)
      })
  }, [])

  const filtered = activeChip === 'All' ? slides
    : slides.filter(s => s.level === activeChip || s.category === activeChip)

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Slides</h1>
          <p className="mm-page-sub">{slides.length} presentations - elementary level</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
{/* grid toggle reserved */}
        </div>
      </div>

      <AdBanner format="horizontal" />

      <div className="mm-chips">
        {chips.map(c => (
          <button key={c} className={`mm-chip${activeChip === c ? ' active' : ''}`} onClick={() => setActiveChip(c)} aria-label={`Filter by ${c}`} aria-pressed={activeChip === c}>
            {c}
          </button>
        ))}
      </div>

      {error ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--primary)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Connection error</p>
          <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Please try again later.</p>
          <button className="mm-btn primary" onClick={() => window.location.reload()} style={{ marginTop: 12 }}>Retry</button>
        </div>
      ) : loading ? (
        <div className="mm-grid-3">
          {[1,2,3].map(i => (
            <div key={i} className="mm-card mm-skeleton">
              <div className="mm-card-cover" style={{ background: 'var(--surface-2)' }} />
              <div className="mm-card-body">
                <div style={{ height: 18, background: 'var(--surface-2)', borderRadius: 8, width: '70%' }} />
                <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 8, width: '40%', marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>No content yet</p>
          <p style={{ fontSize: 14 }}>New slides coming soon!</p>
        </div>
      ) : (
        <>
          <div className="mm-grid-3">
            {filtered.map(s => <SlideCard key={s.id} s={s} />)}
          </div>
          <AdBanner format="auto" />
        </>
      )}
    </>
  )
}
