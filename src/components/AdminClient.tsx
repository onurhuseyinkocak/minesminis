'use client'

import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminLayout from '../admin/AdminLayout'

export default function AdminClient() {
  // Mount only after first client render so react-router-dom's BrowserRouter
  // never tries to read window/history during SSR or static export.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>
        Yükleniyor...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AdminLayout />
    </BrowserRouter>
  )
}
