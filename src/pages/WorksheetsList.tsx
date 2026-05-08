import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Worksheet } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const getAiThumb = (id: string) => `${SUPABASE_URL}/storage/v1/object/public/slides/thumbnails/${id}.png`

const chips = ['All', 'Easy', 'Medium']

function WorksheetCard({ w }: { w: Worksheet }) {
  const [thumbFailed, setThumbFailed] = useState(false)

  return (
    <Link to={`/worksheets/${w.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="mm-card-cover">
        {!thumbFailed ? (
          <img
            src={getAiThumb(w.id)}
            alt={w.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setThumbFailed(true)}
          />
        ) : (
          <Cover kind={w.cover_kind} />
        )}
        <div className="mm-card-cta"><Download size={18} /></div>
      </div>
      <div className="mm-card-body">
        <h3 className="mm-card-title">{w.title}</h3>
        <div className="mm-card-meta">
          <span className={`mm-tag ${w.level === 'Easy' ? 'green' : 'yellow'}`}>{w.level}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)' }} />
          <span>{w.page_count} page{w.page_count !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </Link>
  )
}

export default function WorksheetsList() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([])
  const [activeChip, setActiveChip] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => { document.title = 'Worksheets - minesminis' }, [])

  useEffect(() => {
    supabase.from('mm_worksheets').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setWorksheets(data || []); setLoading(false)
      })
  }, [])

  const filtered = activeChip === 'All' ? worksheets
    : worksheets.filter(w => w.level === activeChip || w.category === activeChip)

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Worksheets</h1>
          <p className="mm-page-sub">{worksheets.length} printable worksheets</p>
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
          <p style={{ fontSize: 14 }}>New worksheets coming soon!</p>
        </div>
      ) : (
        <>
          <div className="mm-grid-3">
            {filtered.map(w => (
              <WorksheetCard key={w.id} w={w} />
            ))}
          </div>
          <AdBanner format="auto" />
        </>
      )}
    </>
  )
}
