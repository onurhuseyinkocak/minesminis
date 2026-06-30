import type { CSSProperties } from 'react'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { isReliableCoverUrl } from '../lib/coverImages'

type BlogCoverProps = {
  src?: string | null
  alt: string
  priority?: boolean
  sizes?: string
  iconSize?: number
  style?: CSSProperties
}

export default function BlogCover({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 33vw',
  iconSize = 42,
  style,
}: BlogCoverProps) {
  if (isReliableCoverUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes={sizes}
        style={{ objectFit: 'cover', ...style }}
      />
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #7B68EE 0%, #B8A9FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BookOpen size={iconSize} color="white" style={{ opacity: 0.65 }} />
    </div>
  )
}
