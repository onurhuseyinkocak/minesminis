import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import { supabase } from '../lib/supabase'

export default function VideoPlayer() {
  const { id } = useParams()
  const [video, setVideo] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      supabase.from('mm_videos').select('*').eq('id', id).single()
        .then(({ data, error: err }) => {
          if (err || !data) { setError(true); return }
          setVideo(data)
        })
    }
  }, [id])

  useEffect(() => { document.title = video ? `${video.title} - minesminis` : 'minesminis' }, [video])

  if (error) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
          <Link to="/videos" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Videos</Link>
        </div>
      </Layout>
    )
  }

  if (!video) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
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
      {video.youtube_url ? (
        <div style={{ borderRadius: 28, overflow: 'hidden', aspectRatio: '16/9' }}>
          <iframe
            src={(() => {
              const url = video.youtube_url
              let videoId = ''
              if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || ''
              } else if (url.includes('watch?v=')) {
                try { videoId = new URL(url).searchParams.get('v') || '' } catch { videoId = '' }
              } else if (url.includes('youtube.com/embed/')) {
                return url
              }
              return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
            })()}
            title={video.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div style={{ background: 'var(--ink)', borderRadius: 28, overflow: 'hidden', position: 'relative' }}>
          <div style={{ aspectRatio: '16/9', position: 'relative' }}>
            <Cover kind={video.cover_kind} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
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
              padding: 12, background: 'rgba(0,0,0,0.6)', borderRadius: 12,
              color: 'white', fontSize: 13, textAlign: 'center',
            }}>
              YouTube link not added yet
            </div>
          </div>
        </div>
      )}

      {/* Lyrics */}
      {(video.lyrics_en || video.lyrics_tr) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, padding: 18, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-2)', letterSpacing: 1.5, marginBottom: 8 }}>ENGLISH</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {video.lyrics_en}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 18, padding: 18, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', letterSpacing: 1.5, marginBottom: 8 }}>TURKISH</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, lineHeight: 1.5, color: 'var(--ink-2)', whiteSpace: 'pre-line' }}>
              {video.lyrics_tr}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
