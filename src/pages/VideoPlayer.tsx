import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Video } from '../lib/supabase'
import { extractYouTubeId } from '../lib/youtube'

export default function VideoPlayer() {
  const { id } = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      supabase.from('mm_videos').select('*').eq('id', id).eq('published', true).single()
        .then(({ data, error: err }) => {
          if (err || !data) { setError(true); return }
          setVideo(data)
        })
    }
  }, [id])

  useEffect(() => { document.title = video ? `${video.title} - minesminis` : 'minesminis' }, [video])

  if (error) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
          <Link to="/videos" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Videos</Link>
        </div>
      </>
    )
  }

  if (!video) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/videos" className="mm-icon-btn" aria-label="Back to Videos"><ArrowLeft size={18} /></Link>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{video.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{video.category} - {video.duration}</div>
          </div>
        </div>
      </div>

      {/* Player */}
      {video.youtube_url && extractYouTubeId(video.youtube_url) ? (
        <div style={{ borderRadius: 28, overflow: 'hidden', aspectRatio: '16/9' }}>
          <iframe
            src={`https://www.youtube.com/embed/${extractYouTubeId(video.youtube_url)}`}
            title={video.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          />
        </div>
      ) : (
        <div style={{ background: 'var(--surface-2)', borderRadius: 28, overflow: 'hidden', position: 'relative' }}>
          <div style={{ aspectRatio: '16/9', position: 'relative' }}>
            <Cover kind={video.cover_kind} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                boxShadow: 'var(--shadow-2)',
              }}>
                <Play size={32} />
              </div>
            </div>
            <div style={{
              position: 'absolute', bottom: 16, left: 20, right: 20,
              padding: 12, background: 'rgba(255,255,255,0.9)', borderRadius: 12,
              color: 'var(--ink-2)', fontSize: 13, textAlign: 'center', fontWeight: 600,
            }}>
              YouTube link not added yet
            </div>
          </div>
        </div>
      )}

      <AdBanner format="auto" />
    </>
  )
}
