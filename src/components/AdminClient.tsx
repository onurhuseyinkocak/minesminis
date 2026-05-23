'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../admin/AdminLayout'

export default function AdminClient() {
  // AdminLayout uses Supabase auth/getSession which must run on the client.
  // Avoid SSR mismatch by mounting only after first render.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>
        Yükleniyor...
      </div>
    )
  }

  return <AdminLayout />
}
