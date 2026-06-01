'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Presentation, Video, Music, FileText, BookOpen, GraduationCap } from 'lucide-react'

const tabs = [
  { id: '/', label: 'Home', icon: Home },
  { id: '/sinif/1', label: 'Sınıflar', icon: GraduationCap, matchPrefix: '/sinif' },
  { id: '/slides', label: 'Slides', icon: Presentation },
  { id: '/videos', label: 'Videos', icon: Video },
  { id: '/songs', label: 'Songs', icon: Music },
  { id: '/worksheets', label: 'Worksheets', icon: FileText },
  { id: '/blog', label: 'Blog', icon: BookOpen },
]

export default function TopNav() {
  const pathname = usePathname() || '/'
  const active =
    tabs.find((t) => {
      if (t.id === '/') return pathname === '/'
      const prefix = (t as any).matchPrefix || t.id
      return pathname.startsWith(prefix)
    })?.id || '/'

  return (
    <nav className="mm-nav" role="navigation" aria-label="Main navigation">
      <Link href="/" className="mm-logo" aria-label="minesminis home">
        <Image
          src="/images/minesminis-logo.webp"
          alt="minesminis logo"
          width={140}
          height={54}
          priority
          style={{ height: 54, width: 'auto', borderRadius: 12, position: 'relative', zIndex: 2 }}
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
