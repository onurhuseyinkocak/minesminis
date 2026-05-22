import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Song } from '../lib/supabase'
import { extractYouTubeId } from '../lib/youtube'
import { useMeta } from '../hooks/useMeta'

const chips = ['All', 'Classic', 'Action', 'Educational']

function SongCard({ s }: { s: Song }) {
  const [thumbFailed, setThumbFailed] = useState(false)
  const ytThumb = s.youtube_url && extractYouTubeId(s.youtube_url)
    ? `https://img.youtube.com/vi/${extractYouTubeId(s.youtube_url)}/hqdefault.jpg` : ''

  return (
    <Link to={`/songs/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="mm-card-cover">
        {ytThumb && !thumbFailed ? (
          <img src={ytThumb} alt={s.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setThumbFailed(true)} />
        ) : (
          <Cover kind={s.cover_kind} />
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

  useMeta({
    title: 'Songs - minesminis',
    description: 'Cocuklara Ingilizce ogretmek icin ucretsiz sarkilar. Klasik, aksiyon ve egitici sarkilar.',
    url: 'https://minesminis.com/songs',
  })

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
      </div>

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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>No matching songs found</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
            Try a different category or explore our slides, videos and worksheets for more English learning resources.
          </p>
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
