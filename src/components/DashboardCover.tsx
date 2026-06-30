'use client'

import { useState } from 'react'
import Image from 'next/image'
import Cover from './Cover'

export default function DashboardCover({ src, alt, fallback }: { src?: string | null; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) return <Cover kind={fallback} />
  return (
    <Image
      src={src}
      alt={alt}
      fill
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 33vw"
      style={{ objectFit: 'cover' }}
      onError={() => setFailed(true)}
    />
  )
}
