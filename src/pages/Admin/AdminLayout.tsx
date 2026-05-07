import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Presentation, Video, Music, LogOut, LayoutDashboard, Eye, EyeOff } from 'lucide-react'
import SlidesManager from './SlidesManager'
import VideosManager from './VideosManager'
import SongsManager from './SongsManager'
import { supabase } from '../../lib/supabase'

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: 'admin@minesminis.com',
      password: pass,
    })
    setSubmitting(false)
    if (err) {
      setError(true)
    } else {
      onLogin()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 40, borderRadius: 28, boxShadow: 'var(--shadow-2)', width: 360 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 8px', textAlign: 'center' }}>
          Admin Panel
        </h1>
        <p style={{ color: 'var(--ink-3)', textAlign: 'center', marginBottom: 24 }}>minesminis management</p>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            aria-label="Admin password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false) }}
            style={{
              width: '100%', padding: '14px 18px', paddingRight: 48, borderRadius: 14,
              border: `1px solid ${error ? 'var(--primary)' : 'var(--line)'}`,
              fontSize: 16, fontFamily: 'var(--font-body)', boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)',
              padding: 4, display: 'flex', alignItems: 'center',
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p style={{ color: 'var(--primary)', fontSize: 13, margin: '-8px 0 16px' }}>Wrong password</p>}
        <button type="submit" className="mm-btn primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/slides', label: 'Slides', icon: Presentation },
  { path: '/admin/videos', label: 'Videos', icon: Video },
  { path: '/admin/songs', label: 'Songs', icon: Music },
]

function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, margin: '0 0 8px' }}>Dashboard</h1>
      <p style={{ color: 'var(--ink-3)', marginBottom: 32 }}>minesminis content management</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Slides', icon: Presentation, path: '/admin/slides', color: 'var(--primary)' },
          { label: 'Videos', icon: Video, path: '/admin/videos', color: 'var(--accent)' },
          { label: 'Songs', icon: Music, path: '/admin/songs', color: 'var(--green)' },
        ].map(item => (
          <Link key={item.path} to={item.path} style={{
            background: 'white', borderRadius: 18, padding: 24, border: '1px solid var(--line)',
            textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color + '15', color: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon size={24} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{item.label}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 14 }}>Manage content</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session)
      setChecking(false)
    })
  }, [])

  if (checking) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><p style={{ color: 'var(--ink-3)' }}>Loading...</p></div>
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: 'white', borderRight: '1px solid var(--line)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/images/minesminis-logo.webp" alt="minesminis" style={{ height: 44, borderRadius: 10 }} />
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12,
                textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
                color: active ? 'white' : 'var(--ink-2)',
                background: active ? 'var(--ink)' : 'transparent',
              }}>
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button onClick={() => { supabase.auth.signOut(); setAuthed(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12,
            border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-3)',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
          }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 32 }}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="slides" element={<SlidesManager />} />
          <Route path="videos" element={<VideosManager />} />
          <Route path="songs" element={<SongsManager />} />
        </Routes>
      </div>
    </div>
  )
}
