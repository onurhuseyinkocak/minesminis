import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Song } from '../lib/supabase'
import { extractYouTubeId } from '../lib/youtube'

const chips = ['All', 'Classic', 'Action', 'Educational']

function SongCard({ s }: { s: Song }) {
  const ytThumb = s.youtube_url && extractYouTubeId(s.youtube_url)
    ? `https://img.youtube.com/vi/${extractYouTubeId(s.youtube_url)}/hqdefault.jpg` : ''

  return (
    <Link to={`/songs/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="mm-card-cover">
        {ytThumb ? (
          <img src={ytThumb} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Cover kind={s.cover_kind} />
        )}
        {s.duration && (
          <div style={{
            position: 'absolute', bottom: 10, left: 10, background: 'rgba(27,27,42,0.85)',
            color: 'white', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Clock size={11} /> {s.duration}
          </div>
        )}
        <div className="mm-card-cta"><Play size={18} /></div>
      </div>
      <div className="mm-card-body">
        <h3 className="mm-card-title">{s.title}</h3>
        <div className="mm-card-meta">
          {s.category && <span className="mm-tag lilac">{s.category}</span>}
        </div>
      </div>
    </Link>
  )
}

export default function SongsList() {
  const [songs, setSongs] = useState<Song[]>([])
  const [activeChip, setActiveChip] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => { document.title = 'Songs - minesminis' }, [])

  useEffect(() => {
    supabase.from('mm_songs').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setSongs(data || []); setLoading(false)
      })
  }, [])

  const filtered = activeChip === 'All' ? songs
    : songs.filter(s => s.category === activeChip)

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Songs</h1>
          <p className="mm-page-sub">{songs.length} songs - elementary level</p>
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
          <p style={{ fontSize: 14 }}>New songs coming soon!</p>
        </div>
      ) : (
        <>
          <div className="mm-grid-3">
            {filtered.map(s => (
              <SongCard key={s.id} s={s} />
            ))}
          </div>
          <AdBanner format="auto" />
        </>
      )}
    </>
  )
}
