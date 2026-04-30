import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, Maximize } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import { supabase } from '../lib/supabase'

export default function SlidePlayer() {
  const { id } = useParams()
  const [slide, setSlide] = useState<any>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      supabase.from('mm_slides').select('*').eq('id', id).single()
        .then(({ data, error: err }) => {
          if (err || !data) { setError(true); return }
          setSlide(data)
        })
    }
  }, [id])

  useEffect(() => { document.title = slide ? `${slide.title} - minesminis` : 'minesminis' }, [slide])

  const items = slide?.slides_data || []
  const total = items.length || slide?.slide_count || 0
  const currentItem = items[current]

  useEffect(() => {
    if (!playing || total === 0) return
    const timer = setInterval(() => {
      setCurrent(c => {
        if (c < total - 1) return c + 1
        setPlaying(false)
        return c
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [playing, total])

  if (error) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
          <Link to="/slides" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Slides</Link>
        </div>
      </Layout>
    )
  }

  if (!slide) {
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
          <Link to="/slides" className="mm-icon-btn" aria-label="Back to Slides"><ArrowLeft size={18} /></Link>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{slide.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Slide {current + 1} / {total}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mm-btn dark" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen">
            <Maximize size={16} /> Fullscreen
          </button>
        </div>
      </div>

      {/* Slide stage */}
      {items.length > 0 ? (
        <>
          <div style={{ background: 'white', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'var(--shadow-1)' }}>
            <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
              <Cover kind={currentItem?.cover_kind || 'rainbow'} />
              {currentItem && (
                <div style={{
                  position: 'absolute', left: 32, bottom: 32, background: 'rgba(255,255,255,0.92)',
                  padding: '14px 22px', borderRadius: 18,
                }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 2 }}>
                    #{current + 1}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800,
                    color: 'var(--primary)', letterSpacing: -1, lineHeight: 1,
                  }}>
                    {currentItem.label}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>= {currentItem.translation}</div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid var(--line)' }}>
              <button className="mm-icon-btn" onClick={() => setCurrent(c => Math.max(0, c - 1))} aria-label="Previous slide"><SkipBack size={18} /></button>
              <button className="mm-icon-btn primary" style={{ width: 52, height: 52 }} onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Auto-play'}>
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="mm-icon-btn" onClick={() => setCurrent(c => Math.min(total - 1, c + 1))} aria-label="Next slide"><SkipForward size={18} /></button>
              <div style={{ flex: 1 }}>
                <div className="mm-progress">
                  <div className="mm-progress-fill" style={{ width: `${((current + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{current + 1} / {total}</span>
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {items.map((item: any, i: number) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  minWidth: 96, height: 64, borderRadius: 10, overflow: 'hidden',
                  border: i === current ? '2px solid var(--primary)' : '1px solid var(--line)',
                  cursor: 'pointer', position: 'relative', flexShrink: 0,
                }}
              >
                <Cover kind={item.cover_kind} />
                <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 10, color: 'white', fontWeight: 800, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)', background: 'white', borderRadius: 28, border: '1px solid var(--line)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Slide content not added yet</p>
        </div>
      )}
    </Layout>
  )
}
