import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Presentation, Video, Music, FileText, LogOut, LayoutDashboard, Eye, EyeOff, BarChart3, ArrowRight, BookOpen } from 'lucide-react'
import SlidesManager from './SlidesManager'
import VideosManager from './VideosManager'
import SongsManager from './SongsManager'
import WorksheetsManager from './WorksheetsManager'
import BlogsManager from './BlogsManager'
import { supabase } from '../../lib/supabase'
import { usePresenceCount } from '../../hooks/usePresence'

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
  { path: '/admin/worksheets', label: 'Worksheets', icon: FileText },
  { path: '/admin/blog', label: 'Blog', icon: BookOpen },
]

function AdminDashboard() {
  const activeUsers = usePresenceCount()
  const [stats, setStats] = useState({ slides: 0, videos: 0, songs: 0, worksheets: 0 })
  const [dailyStats, setDailyStats] = useState<Array<{ day: string; views: number; unique_visitors: number }>>([])
  const [recentContent, setRecentContent] = useState<Array<{ id: string; title: string; type: string; created_at: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch content counts
        const [slidesRes, videosRes, songsRes, worksheetsRes] = await Promise.all([
          supabase.from('mm_slides').select('id', { count: 'exact', head: true }),
          supabase.from('mm_videos').select('id', { count: 'exact', head: true }),
          supabase.from('mm_songs').select('id', { count: 'exact', head: true }),
          supabase.from('mm_worksheets').select('id', { count: 'exact', head: true }),
        ])
        setStats({
          slides: slidesRes.count || 0,
          videos: videosRes.count || 0,
          songs: songsRes.count || 0,
          worksheets: worksheetsRes.count || 0,
        })

        // Fetch daily stats (last 14 days)
        const { data: statsData } = await supabase.from('mm_daily_stats').select('*').order('day', { ascending: false }).limit(14)
        if (statsData) {
          setDailyStats(statsData.reverse())
        }

        // Fetch recent content (last 5 across all types)
        const [slidesRecent, videosRecent, songsRecent, worksheetsRecent] = await Promise.all([
          supabase.from('mm_slides').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
          supabase.from('mm_videos').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
          supabase.from('mm_songs').select('id, title, created_at').order('created_at', { ascending: false }).limit(1),
          supabase.from('mm_worksheets').select('id, title, created_at').order('created_at', { ascending: false }).limit(1),
        ])

        const recent = [
          ...(slidesRecent.data?.map(item => ({ ...item, type: 'Slide' })) || []),
          ...(videosRecent.data?.map(item => ({ ...item, type: 'Video' })) || []),
          ...(songsRecent.data?.map(item => ({ ...item, type: 'Song' })) || []),
          ...(worksheetsRecent.data?.map(item => ({ ...item, type: 'Worksheet' })) || []),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

        setRecentContent(recent)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 60000) // Refresh every 60s
    return () => clearInterval(interval)
  }, [])

  const maxViews = Math.max(...dailyStats.map(s => s.views), 1)

  if (loading) {
    return <div style={{ padding: 32, color: 'var(--ink-3)' }}>Loading dashboard...</div>
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, margin: '0 0 8px' }}>Dashboard</h1>
          <p style={{ color: 'var(--ink-3)', margin: 0 }}>Content management overview</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--line)' }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--green)', animation: 'live-pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{activeUsers} online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Slides', count: stats.slides, icon: Presentation, color: 'var(--primary)' },
          { label: 'Videos', count: stats.videos, icon: Video, color: 'var(--accent)' },
          { label: 'Songs', count: stats.songs, icon: Music, color: 'var(--green)' },
          { label: 'Worksheets', count: stats.worksheets, icon: FileText, color: '#B59BFF' },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} style={{
              background: 'white', borderRadius: 16, padding: 20, border: '1px solid var(--line)',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + '15', color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{item.count}</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 13, fontFamily: 'var(--font-body)' }}>{item.label}</div>
            </div>
          )
        })}
      </div>

      {/* Daily Visitors Chart */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--line)', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>Visitors (14 days)</h2>
        </div>

        {dailyStats.length === 0 ? (
          <p style={{ color: 'var(--ink-3)', textAlign: 'center', padding: '40px 0' }}>No visitor data yet</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 200 }}>
            {dailyStats.map((stat, i) => {
              const dayLabel = new Date(stat.day).toLocaleDateString('en-US', { weekday: 'short' })
              const percentage = (stat.views / maxViews) * 100
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', height: `${Math.max(percentage, 5)}%`, background: 'var(--primary)', borderRadius: '6px 6px 0 0', position: 'relative', minHeight: 10 }}
                    title={`${stat.views} views, ${stat.unique_visitors} visitors`} />
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center' }}>{dayLabel}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
        {/* Quick Links */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Manage Content</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Slides', icon: Presentation, path: '/admin/slides', color: 'var(--primary)' },
              { label: 'Videos', icon: Video, path: '/admin/videos', color: 'var(--accent)' },
              { label: 'Songs', icon: Music, path: '/admin/songs', color: 'var(--green)' },
              { label: 'Worksheets', icon: FileText, path: '/admin/worksheets', color: '#B59BFF' },
            ].map(item => {
              const Icon = item.icon
              return (
                <Link key={item.path} to={item.path} style={{
                  background: 'white', borderRadius: 12, padding: 16, border: '1px solid var(--line)',
                  textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: item.color + '15', color: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{item.label}</div>
                    <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>Edit & publish</div>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Content */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Recent Content</h2>
          {recentContent.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid var(--line)', textAlign: 'center', color: 'var(--ink-3)' }}>
              No content yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentContent.map(item => (
                <div key={`${item.type}-${item.id}`} style={{
                  background: 'white', borderRadius: 12, padding: 16, border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: 'var(--primary)' + '15', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                  }}>
                    {item.type[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ color: 'var(--ink-3)', fontSize: 12, marginTop: 4 }}>
                      {item.type} • {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
      <div style={{ flex: 1, padding: 32, minWidth: 0, overflowX: 'hidden' }}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="slides" element={<SlidesManager />} />
          <Route path="videos" element={<VideosManager />} />
          <Route path="songs" element={<SongsManager />} />
          <Route path="worksheets" element={<WorksheetsManager />} />
          <Route path="blog" element={<BlogsManager />} />
        </Routes>
      </div>
    </div>
  )
}
