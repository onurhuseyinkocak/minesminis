'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Presentation, Video, Music, FileText, BookOpen } from 'lucide-react'

const tabs = [
  { id: '/', label: 'Home', icon: Home },
  { id: '/slides', label: 'Slides', icon: Presentation },
  { id: '/videos', label: 'Videos', icon: Video },
  { id: '/songs', label: 'Songs', icon: Music },
  { id: '/worksheets', label: 'Sheets', icon: FileText },
  { id: '/blog', label: 'Blog', icon: BookOpen },
]

export default function BottomNav() {
  const pathname = usePathname() || '/'
  const active =
    tabs.find((t) => (t.id === '/' ? pathname === '/' : pathname.startsWith(t.id)))?.id || '/'

  return (
    <nav className="mm-bottom-nav" role="navigation" aria-label="Mobile navigation">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.id}
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
