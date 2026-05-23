'use client'

import dynamic from 'next/dynamic'
import { BrowserRouter } from 'react-router-dom'

// Lazy-load the original AdminLayout (uses react-router-dom internally).
// We mount a BrowserRouter to serve it as a self-contained SPA at /admin/*.
const AdminLayout = dynamic(() => import('../admin/AdminLayout'), { ssr: false })

export default function AdminClient() {
  return (
    <BrowserRouter>
      <AdminLayout />
    </BrowserRouter>
  )
}
