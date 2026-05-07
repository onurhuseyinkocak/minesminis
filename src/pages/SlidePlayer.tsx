import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, Maximize, Download, Printer } from 'lucide-react'
import Cover from '../components/Cover'
import AdBanner from '../components/AdBanner'
import { supabase, Slide, SlideItem } from '../lib/supabase'

export default function SlidePlayer() {
  const { id } = useParams()
  const [slide, setSlide] = useState<Slide | null>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      supabase.from('mm_slides').select('*').eq('id', id).eq('published', true).single()
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
  const hasFile = !!slide?.file_url
  const hasFlashcards = items.length > 0
  const isWordDoc = hasFile && !!slide.file_url.match(/\.docx?(\?|$)/i)

  const goPrev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const goNext = useCallback(() => setCurrent(c => Math.min(total - 1, c + 1)), [total])

  // Keyboard arrow navigation for flashcards
  useEffect(() => {
    if (!hasFlashcards || hasFile) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hasFlashcards, hasFile, goPrev, goNext])

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

  const getEmbedUrl = (url: string) => {
    if (url.includes('docs.google.com/presentation')) {
      return url.replace(/\/edit.*$/, '/embed?start=false&loop=false')
    }
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([^/]+)/)
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`
    }
    // PPT/PPTX — Office Online (slide-by-slide horizontal navigation)
    if (url.match(/\.pptx?(\?|$)/i)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    }
    // PDF, Word, Keynote — Google Docs Viewer (vertical scroll)
    if (url.match(/\.(pdf|key|docx?)(\?|$)/i)) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }

  if (error) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>Content not found</p>
          <Link to="/slides" className="mm-btn primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>Back to Slides</Link>
        </div>
      </>
    )
  }

  if (!slide) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Loading...</p>
        </div>
      </>
    )
  }

  const arrowBtnStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: 48, height: 48, borderRadius: '50%',
    background: 'rgba(255,255,255,0.92)', border: '1px solid var(--line)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--ink)', zIndex: 10, transition: 'transform 0.15s, box-shadow 0.15s',
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/slides" className="mm-icon-btn" aria-label="Back to Slides"><ArrowLeft size={18} /></Link>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{slide.title}</div>
            {hasFlashcards && !hasFile && (
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Slide {current + 1} / {total}</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {hasFile && (
            <>
              <a href={slide.file_url} download className="mm-btn" style={{ textDecoration: 'none' }}>
                <Download size={16} /> Download
              </a>
              <a
                href={`https://docs.google.com/gview?url=${encodeURIComponent(slide.file_url)}`}
                target="_blank" rel="noreferrer" className="mm-btn" style={{ textDecoration: 'none' }}
              >
                <Printer size={16} /> Print
              </a>
            </>
          )}
          <button className="mm-btn dark" onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen">
            <Maximize size={16} /> Fullscreen
          </button>
        </div>
      </div>

      {/* File-based: Word docs vertical, PPT/PDF horizontal (viewer handles navigation) */}
      {hasFile ? (
        <div style={{ background: 'white', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'var(--shadow-1)' }}>
          <div style={{ aspectRatio: isWordDoc ? undefined : '16/9', height: isWordDoc ? 700 : undefined, position: 'relative' }}>
            <iframe
              src={getEmbedUrl(slide.file_url)}
              title={slide.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      ) : hasFlashcards ? (
        <>
          <div style={{ background: 'white', borderRadius: 28, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'var(--shadow-1)' }}>
            {/* Slide area with left/right arrows */}
            <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
              <Cover kind={currentItem?.cover_kind || 'rainbow'} />
              {currentItem && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.92)', padding: '20px 32px', borderRadius: 20, textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 2 }}>
                      #{current + 1}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800,
                      color: 'var(--primary)', letterSpacing: -1, lineHeight: 1.1,
                    }}>
                      {currentItem.label}
                    </div>
                    <div style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 6 }}>= {currentItem.translation}</div>
                  </div>
                </div>
              )}

              {/* Left arrow */}
              {current > 0 && (
                <button onClick={goPrev} aria-label="Previous slide"
                  style={{ ...arrowBtnStyle, left: 12 }}>
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Right arrow */}
              {current < total - 1 && (
                <button onClick={goNext} aria-label="Next slide"
                  style={{ ...arrowBtnStyle, right: 12 }}>
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom bar: auto-play + progress */}
            <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--line)' }}>
              <button className="mm-icon-btn primary" style={{ width: 44, height: 44 }} onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Auto-play'}>
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <div style={{ flex: 1 }}>
                <div className="mm-progress">
                  <div className="mm-progress-fill" style={{ width: `${((current + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>{current + 1} / {total}</span>
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {items.map((item: SlideItem, i: number) => (
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
                <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 12, color: 'white', fontWeight: 800, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
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

      <AdBanner format="auto" />
    </>
  )
}
