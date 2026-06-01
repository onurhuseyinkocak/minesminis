'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import Footer from './Footer'

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/'
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    // Admin has its own chrome
    return <>{children}</>
  }

  // AdRail/sidebar columns are disabled while ads are off (AdSense approval
  // phase). All pages use the same centered 1080px shell. When ads come
  // back, re-introduce the `with-rails` toggle here AND render <AdRail />
  // siblings around the <main>.
  return (
    <div className="mm-page">
      <a href="#main-content" className="mm-skip-link">Ana içeriğe geç</a>
      <TopNav />
      <div className="mm-shell">
        <main className="mm-main" id="main-content">
          {children}
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
