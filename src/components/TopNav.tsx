import { Link, useLocation } from 'react-router-dom'
import { Home, Presentation, Video, Music } from 'lucide-react'

const tabs = [
  { id: '/', label: 'Anasayfa', icon: Home },
  { id: '/slides', label: 'Slaytlar', icon: Presentation },
  { id: '/videos', label: 'Videolar', icon: Video },
  { id: '/songs', label: 'Sarkilar', icon: Music },
]

export default function TopNav() {
  const location = useLocation()
  const active = tabs.find(t =>
    t.id === '/' ? location.pathname === '/' : location.pathname.startsWith(t.id)
  )?.id || '/'

  return (
    <nav className="mm-nav" role="navigation" aria-label="Main navigation">
      <Link to="/" className="mm-logo" aria-label="minesminis anasayfa">
        <img src="/images/minesminis-logo.svg" alt="minesminis logo" style={{ height: 40, borderRadius: 10 }} />
      </Link>

      <div className="mm-nav-tabs">
        {tabs.map(t => (
          <Link
            key={t.id}
            to={t.id}
            className={`mm-nav-tab${active === t.id ? ' active' : ''}`}
          >
            <t.icon size={17} />
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mm-nav-actions">
        <Link to="/about" className="mm-btn" style={{ fontSize: 13, padding: '8px 14px' }}>Hakkimizda</Link>
      </div>
    </nav>
  )
}
