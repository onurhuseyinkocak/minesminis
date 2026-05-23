import type { Metadata } from 'next'
import AdminClient from '../../../src/components/AdminClient'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
}

// Admin is client-side only (react-router-dom inside); never try to SSG.
export const dynamic = 'force-dynamic'

export default function AdminCatchAllPage() {
  return <AdminClient />
}
