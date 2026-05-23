'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import Footer from './Footer'

const policyPages = ['/about', '/contact', '/privacy', '/terms', '/faq', '/curriculum']
const contentListPages = ['/', '/slides', '/videos', '/songs', '/worksheets', '/blog']

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/'
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    // Admin has its own chrome
    return <>{children}</>
  }

  const isDetailPage = !!pathname.match(/^\/(slides|videos|songs|worksheets|blog)\/.+/)
  const noSidebar = policyPages.includes(pathname)
    || (!contentListPages.includes(pathname) && !isDetailPage)
  const showSidebar = !noSidebar

  return (
    <div className="mm-page">
      <TopNav />
      <div className={`mm-shell${showSidebar ? ' with-rails' : ''}`}>
        <main className="mm-main" id="main-content">
          {children}
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
