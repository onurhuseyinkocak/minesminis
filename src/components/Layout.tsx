import { ReactNode } from 'react'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import AdRail from './AdRail'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mm-page">
      <TopNav />
      <div className="mm-shell">
        <AdRail />
        <div className="mm-main">
          {children}
        </div>
        <AdRail />
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
