import type { Metadata } from 'next'
import AdminClient from '@/src/components/AdminClient'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
}

export default function AdminCatchAllPage() {
  return <AdminClient />
}
