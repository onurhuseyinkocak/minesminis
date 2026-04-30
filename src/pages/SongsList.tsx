import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import Layout from '../components/Layout'
import Cover from '../components/Cover'
import { supabase } from '../lib/supabase'

const chips = ['Tumu', 'Klasik', 'Hareketli', 'Egitici']

export default function SongsList() {
  const [songs, setSongs] = useState<any[]>([])
  const [activeChip, setActiveChip] = useState('Tumu')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => { document.title = 'Sarkilar - minesminis' }, [])

  useEffect(() => {
    supabase.from('mm_songs').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setSongs(data || []); setLoading(false)
      })
  }, [])

  const filtered = activeChip === 'Tumu' ? songs
    : songs.filter(s => s.category === activeChip)

  return (
    <Layout>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Sarkilar</h1>
          <p className="mm-page-sub">{songs.length} sarki - ilkokul seviyesi</p>
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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Baglanti hatasi</p>
          <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Lutfen daha sonra tekrar deneyin.</p>
          <button className="mm-btn primary" onClick={() => window.location.reload()} style={{ marginTop: 12 }}>Tekrar dene</button>
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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Henuz icerik eklenmedi</p>
          <p style={{ fontSize: 14 }}>Yakinda yeni sarkilar eklenecek!</p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {filtered.map(s => (
            <Link key={s.id} to={`/songs/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                <Cover kind={s.cover_kind} />
                <div style={{
                  position: 'absolute', bottom: 10, left: 10, background: 'rgba(27,27,42,0.85)',
                  color: 'white', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <Clock size={11} /> {s.duration}
                </div>
                <div className="mm-card-cta"><Play size={18} /></div>
              </div>
              <div className="mm-card-body">
                <h3 className="mm-card-title">{s.title}</h3>
                <div className="mm-card-meta">
                  <span className="mm-tag lilac">{s.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
