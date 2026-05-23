'use client'

import { useState } from 'react'
import Cover from './Cover'

export default function DashboardCover({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <Cover kind={fallback} />
  return <img src={src} alt={alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setFailed(true)} />
}
