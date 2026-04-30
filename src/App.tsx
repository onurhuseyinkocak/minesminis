import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const SlidesList = lazy(() => import('./pages/SlidesList'))
const SlidePlayer = lazy(() => import('./pages/SlidePlayer'))
const VideosList = lazy(() => import('./pages/VideosList'))
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'))
const SongsList = lazy(() => import('./pages/SongsList'))
const SongPlayer = lazy(() => import('./pages/SongPlayer'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))

function Loading() {
  return (
    <div className="mm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-3)' }}>Loading...</div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/slides" element={<SlidesList />} />
          <Route path="/slides/:id" element={<SlidePlayer />} />
          <Route path="/videos" element={<VideosList />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/songs" element={<SongsList />} />
          <Route path="/songs/:id" element={<SongPlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: 'var(--primary)' }}>404</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-2)' }}>Page not found</div>
              <a href="/" className="mm-btn primary" style={{ marginTop: 8, textDecoration: 'none' }}>Home</a>
            </div>
          } />
        </Routes>
      </Suspense>
    </>
  )
}
