import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Presentation, Video, Music, ChevronRight, Star } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'

const PAGE_TITLE = 'minesminis - Cocuklar icin Ingilizce'
import { supabase } from '../lib/supabase'

const features = [
  { id: 'slides', title: 'Slaytlar', icon: Presentation, cover: 'rainbow', tag: 'Egitim', path: '/slides' },
  { id: 'videos', title: 'Videolar', icon: Video, cover: 'duck', tag: 'Izle', path: '/videos' },
  { id: 'songs', title: 'Sarkilar', icon: Music, cover: 'star', tag: 'Soyle', path: '/songs' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({ slides: 0, videos: 0, songs: 0 })
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => { document.title = PAGE_TITLE }, [])

  useEffect(() => {
    // Fetch counts
    Promise.all([
      supabase.from('mm_slides').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_videos').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_songs').select('id', { count: 'exact', head: true }).eq('published', true),
    ]).then(([s, v, so]) => {
      setCounts({ slides: s.count || 0, videos: v.count || 0, songs: so.count || 0 })
    })

    // Fetch recent content (mix of all types)
    Promise.all([
      supabase.from('mm_slides').select('id, title, cover_kind, slide_count').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_videos').select('id, title, cover_kind, duration').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_songs').select('id, title, cover_kind, duration').eq('published', true).order('created_at', { ascending: false }).limit(2),
    ]).then(([s, v, so]) => {
      const items: any[] = []
      ;(s.data || []).forEach(d => items.push({ ...d, type: 'slides', meta: `${d.slide_count} slayt`, tag: 'coral' }))
      ;(v.data || []).forEach(d => items.push({ ...d, type: 'videos', meta: d.duration, tag: 'blue' }))
      ;(so.data || []).forEach(d => items.push({ ...d, type: 'songs', meta: d.duration, tag: 'lilac' }))
      setRecent(items)
    })
  }, [])

  const countLabels = [counts.slides + ' sunu', counts.videos + ' video', counts.songs + ' sarki']

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #FFE3D5 0%, #FFC9B5 100%)',
        borderRadius: 28, padding: 32, marginBottom: 24,
        display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'center',
        overflow: 'hidden',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white',
            padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
            color: 'var(--primary)', marginBottom: 12,
          }}>
            <Star size={14} /> COCUKLAR ICIN INGILIZCE
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800,
            margin: 0, lineHeight: 1.05, letterSpacing: -1.5,
          }}>
            Eglenerek<br/>Ingilizce ogren.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 10, fontWeight: 500, maxWidth: 480 }}>
            Slaytlar, videolar ve sarkilarla ilkokul seviyesinde keyifli bir ogrenme deneyimi.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Link to="/slides" className="mm-btn primary lg"><Play size={16} /> Basla</Link>
          </div>
        </div>
        <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-2)', aspectRatio: '4/3' }}>
          <Cover kind="happy" />
        </div>
      </div>

      {/* Categories */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 14px', letterSpacing: -0.5 }}>
        Kategoriler
      </h2>
      <div className="mm-grid-3" style={{ marginBottom: 28 }}>
        {features.map((f, i) => (
          <Link key={f.id} to={f.path} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="mm-card-cover"><Cover kind={f.cover} /></div>
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

      {/* Recent */}
      {recent.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, letterSpacing: -0.5 }}>
              Son eklenenler
            </h2>
            <Link to="/slides" className="mm-btn">Tumu <ChevronRight size={14} /></Link>
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
