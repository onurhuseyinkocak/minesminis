import type { Metadata } from 'next'
import AdminClient from '../../../src/components/AdminClient'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
}

// Admin requires runtime Supabase session check; skip SSG.
export const dynamic = 'force-dynamic'

export default function AdminCatchAllPage() {
  return <AdminClient />
}
