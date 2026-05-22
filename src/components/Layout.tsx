import { ReactNode } from 'react'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import AdRail from './AdRail'
import Footer from './Footer'

export default function Layout({ children, showSidebar = true }: { children: ReactNode; showSidebar?: boolean }) {
  return (
    <div className="mm-page">
      <TopNav />
      <div className={`mm-shell${showSidebar ? ' with-rails' : ''}`}>
        {showSidebar && <AdRail />}
        <main className="mm-main" id="main-content">
          {children}
        </main>
        {showSidebar && <AdRail />}
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
