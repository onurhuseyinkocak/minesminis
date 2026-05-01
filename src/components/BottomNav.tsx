import { Link, useLocation } from 'react-router-dom'
import { Home, Presentation, Video, Music } from 'lucide-react'

const tabs = [
  { id: '/', label: 'Home', icon: Home },
  { id: '/slides', label: 'Slides', icon: Presentation },
  { id: '/videos', label: 'Videos', icon: Video },
  { id: '/songs', label: 'Songs', icon: Music },
]

export default function BottomNav() {
  const location = useLocation()
  const active = tabs.find(t =>
    t.id === '/' ? location.pathname === '/' : location.pathname.startsWith(t.id)
  )?.id || '/'

  return (
    <nav className="mm-bottom-nav" role="navigation" aria-label="Mobile navigation">
      {tabs.map(t => (
        <Link
          key={t.id}
          to={t.id}
          className={`mm-bottom-tab${active === t.id ? ' active' : ''}`}
          aria-label={t.label}
        >
          <t.icon size={20} />
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  )
}
