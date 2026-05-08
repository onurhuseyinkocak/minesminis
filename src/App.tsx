import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import { usePageView } from './hooks/usePageView'
import { usePresenceTrack } from './hooks/usePresence'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const SlidesList = lazy(() => import('./pages/SlidesList'))
const SlidePlayer = lazy(() => import('./pages/SlidePlayer'))
const VideosList = lazy(() => import('./pages/VideosList'))
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'))
const SongsList = lazy(() => import('./pages/SongsList'))
const SongPlayer = lazy(() => import('./pages/SongPlayer'))
const WorksheetsList = lazy(() => import('./pages/WorksheetsList'))
const WorksheetPlayer = lazy(() => import('./pages/WorksheetPlayer'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))

function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-3)' }}>Loading...</div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  usePageView()
  usePresenceTrack()

  if (isAdmin) {
    return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/slides" element={<SlidesList />} />
          <Route path="/slides/:id" element={<SlidePlayer />} />
          <Route path="/videos" element={<VideosList />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/songs" element={<SongsList />} />
          <Route path="/songs/:id" element={<SongPlayer />} />
          <Route path="/worksheets" element={<WorksheetsList />} />
          <Route path="/worksheets/:id" element={<WorksheetPlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: 'var(--primary)' }}>404</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-2)' }}>Page not found</div>
              <a href="/" className="mm-btn primary" style={{ marginTop: 8, textDecoration: 'none' }}>Home</a>
            </div>
          } />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </>
  )
}
