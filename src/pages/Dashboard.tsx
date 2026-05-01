import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Presentation, Video, Music, ChevronRight, Star } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import MobileAd from '../components/MobileAd'
import { supabase } from '../lib/supabase'

const features = [
  { id: 'slides', title: 'Slides', icon: Presentation, image: '/images/cat-slides.webp', tag: 'Learn', path: '/slides' },
  { id: 'videos', title: 'Videos', icon: Video, image: '/images/cat-videos.webp', tag: 'Watch', path: '/videos' },
  { id: 'songs', title: 'Songs', icon: Music, image: '/images/cat-songs.webp', tag: 'Sing', path: '/songs' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({ slides: 0, videos: 0, songs: 0 })
  const [recent, setRecent] = useState<{ id: string; title: string; cover_kind: string; type: string; meta: string; tag: string }[]>([])

  useEffect(() => { document.title = 'minesminis - English for Kids' }, [])

  useEffect(() => {
    // Fetch counts
    Promise.all([
      supabase.from('mm_slides').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_videos').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_songs').select('id', { count: 'exact', head: true }).eq('published', true),
    ]).then(([s, v, so]) => {
      setCounts({ slides: s.count || 0, videos: v.count || 0, songs: so.count || 0 })
    }).catch(() => {})

    // Fetch recent content (mix of all types)
    Promise.all([
      supabase.from('mm_slides').select('id, title, cover_kind, slide_count').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_videos').select('id, title, cover_kind, duration').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_songs').select('id, title, cover_kind, duration').eq('published', true).order('created_at', { ascending: false }).limit(2),
    ]).then(([s, v, so]) => {
      const items: { id: string; title: string; cover_kind: string; type: string; meta: string; tag: string }[] = []
      ;(s.data || []).forEach(d => items.push({ ...d, type: 'slides', meta: `${d.slide_count} slides`, tag: 'coral' }))
      ;(v.data || []).forEach(d => items.push({ ...d, type: 'videos', meta: d.duration, tag: 'blue' }))
      ;(so.data || []).forEach(d => items.push({ ...d, type: 'songs', meta: d.duration, tag: 'lilac' }))
      setRecent(items)
    }).catch(() => {})
  }, [])

  const countLabels = [counts.slides + ' slides', counts.videos + ' videos', counts.songs + ' songs']

  return (
    <Layout>
      {/* Hero */}
      <div className="mm-hero" style={{
        background: 'linear-gradient(135deg, #7B68EE 0%, #9B87F5 50%, #B8A9FF 100%)',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.9)',
            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            color: '#7B68EE', marginBottom: 8,
          }}>
            <Star size={12} /> ENGLISH FOR KIDS
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
            margin: 0, lineHeight: 1.1, letterSpacing: -1, color: 'white',
          }}>
            Learn English<br/>the fun way.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: 500, maxWidth: 400 }}>
            A joyful learning experience for kids with slides, videos and songs.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <Link to="/slides" className="mm-btn" style={{ background: 'white', color: '#7B68EE', fontWeight: 700 }}><Play size={14} /> Start Learning</Link>
          </div>
        </div>
        <img src="/images/hero-bg.webp" alt="" loading="eager" className="mm-hero-img" style={{
          width: 180, height: 180, objectFit: 'cover', borderRadius: 18, flexShrink: 0,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }} />
      </div>

      {/* Categories */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 14px', letterSpacing: -0.5 }}>
        Categories
      </h2>
      <div className="mm-grid-3" style={{ marginBottom: 28 }}>
        {features.map((f, i) => (
          <Link key={f.id} to={f.path} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="mm-card-cover">
              <img src={f.image} alt={f.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="mm-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="mm-card-title">{f.title}</h3>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                }}>
                  <f.icon size={18} />
                </div>
              </div>
              <div className="mm-card-meta" style={{ marginTop: 4 }}>
                <span>{countLabels[i]}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)' }} />
                <span>{f.tag}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <MobileAd />

      {/* Recent */}
      {recent.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, letterSpacing: -0.5 }}>
              Recently added
            </h2>
            <Link to="/slides" className="mm-btn">View all <ChevronRight size={14} /></Link>
          </div>
          <div className="mm-grid-3">
            {recent.map(p => (
              <Link key={p.type + p.id} to={`/${p.type}/${p.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mm-card-cover">
                  <Cover kind={p.cover_kind} />
                  <div className="mm-card-cta"><Play size={18} /></div>
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-title">{p.title}</h3>
                  <div className="mm-card-meta">
                    <span className={`mm-tag ${p.tag}`}>{p.meta}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
