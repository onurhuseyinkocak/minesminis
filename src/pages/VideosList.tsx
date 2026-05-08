import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Video } from '../lib/supabase'
import { useMeta } from '../hooks/useMeta'


const chips = ['All', 'Sing-Along', 'Dialogue', 'Action']

function VideoCard({ v }: { v: Video }) {
  const [thumbFailed, setThumbFailed] = useState(false)

  return (
    <Link to={`/videos/${v.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="mm-card-cover">
        {v.thumbnail_url && !thumbFailed ? (
          <img src={v.thumbnail_url} alt={v.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setThumbFailed(true)} />
        ) : (
          <Cover kind={v.cover_kind} />
        )}
        <div className="mm-card-cta"><Play size={18} /></div>
      </div>
      <div className="mm-card-body">
        <h3 className="mm-card-title">{v.title}</h3>
        <div className="mm-card-meta">
          {v.category && <span className="mm-tag green">{v.category}</span>}
        </div>
      </div>
    </Link>
  )
}

export default function VideosList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [activeChip, setActiveChip] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useMeta({
    title: 'Videos - minesminis',
    description: 'Cocuklara Ingilizce ogretmek icin ucretsiz videolar. Sarkilar, diyaloglar ve aksiyon videolari.',
    url: 'https://minesminis.com/videos',
  })

  useEffect(() => {
    supabase.from('mm_videos').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setVideos(data || []); setLoading(false)
      })
  }, [])

  const filtered = activeChip === 'All' ? videos
    : videos.filter(v => v.category === activeChip)

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Videos</h1>
          <p className="mm-page-sub">{videos.length} videos - elementary level</p>
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
          <p style={{ fontSize: 14 }}>New videos coming soon!</p>
        </div>
      ) : (
        <>
          <div className="mm-grid-3">
            {filtered.map(v => (
              <VideoCard key={v.id} v={v} />
            ))}
          </div>
          <AdBanner format="auto" />
        </>
      )}
    </>
  )
}
