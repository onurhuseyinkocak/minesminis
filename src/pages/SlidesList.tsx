import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import { supabase } from '../lib/supabase'

const chips = ['All', 'Easy', 'Medium']

export default function SlidesList() {
  const [slides, setSlides] = useState<any[]>([])
  const [activeChip, setActiveChip] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => { document.title = 'Slides - minesminis' }, [])

  useEffect(() => {
    supabase.from('mm_slides').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setSlides(data || []); setLoading(false)
      })
  }, [])

  const filtered = activeChip === 'All' ? slides
    : slides.filter(s => s.level === activeChip || s.category === activeChip)

  return (
    <Layout>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Slides</h1>
          <p className="mm-page-sub">{slides.length} presentations - elementary level</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
{/* grid toggle reserved */}
        </div>
      </div>

      <div className="mm-chips">
        {chips.map(c => (
          <button key={c} className={`mm-chip${activeChip === c ? ' active' : ''}`} onClick={() => setActiveChip(c)}>
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
            <div key={i} className="mm-card" style={{ opacity: 0.5 }}>
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
          <p style={{ fontSize: 14 }}>New slides coming soon!</p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {filtered.map(s => (
            <Link key={s.id} to={`/slides/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                <Cover kind={s.cover_kind} />
                <div className="mm-card-cta"><Play size={18} /></div>
              </div>
              <div className="mm-card-body">
                <h3 className="mm-card-title">{s.title}</h3>
                <div className="mm-card-meta">
                  <span className={`mm-tag ${s.level === 'Easy' ? 'green' : 'yellow'}`}>{s.level}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)' }} />
                  <span>{s.slide_count} slides</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
