'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Presentation, Video, Music, FileText, BookOpen } from 'lucide-react'

const tabs = [
  { id: '/', label: 'Home', icon: Home },
  { id: '/slides', label: 'Slides', icon: Presentation },
  { id: '/videos', label: 'Videos', icon: Video },
  { id: '/songs', label: 'Songs', icon: Music },
  { id: '/worksheets', label: 'Worksheets', icon: FileText },
  { id: '/blog', label: 'Blog', icon: BookOpen },
]

export default function TopNav() {
  const pathname = usePathname() || '/'
  const active =
    tabs.find((t) => (t.id === '/' ? pathname === '/' : pathname.startsWith(t.id)))?.id || '/'

  return (
    <nav className="mm-nav" role="navigation" aria-label="Main navigation">
      <Link href="/" className="mm-logo" aria-label="minesminis home">
        <img
          src="/images/minesminis-logo.webp"
          alt="minesminis logo"
          style={{ height: 54, borderRadius: 12, position: 'relative', zIndex: 2 }}
        />
      </Link>

      <div className="mm-nav-tabs">
        {tabs.map((t) => (
          <Link key={t.id} href={t.id} className={`mm-nav-tab${active === t.id ? ' active' : ''}`}>
            <t.icon size={17} />
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mm-nav-actions">
        <Link href="/curriculum" className="mm-btn" style={{ fontSize: 13, padding: '8px 14px' }}>
          Müfredat
        </Link>
        <Link href="/about" className="mm-btn" style={{ fontSize: 13, padding: '8px 14px' }}>
          Hakkımızda
        </Link>
      </div>
    </nav>
  )
}
