'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { ADSENSE_CLIENT, CHILD_SAFE_AD_ATTRIBUTES, canRenderAds } from '../lib/adSafety'

type AdFormat = 'horizontal' | 'rectangle' | 'vertical' | 'auto'

const formatToStyle: Record<AdFormat, CSSProperties> = {
  horizontal: { display: 'block', minHeight: 90 },
  rectangle: { display: 'block', minHeight: 250 },
  vertical: { display: 'block', minHeight: 280 },
  auto: { display: 'block', minHeight: 90 },
}

const slotByFormat: Partial<Record<AdFormat, string | undefined>> = {
  horizontal: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE,
  vertical: process.env.NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL,
  auto: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
}

export default function AdBanner({ format = 'horizontal', className = '' }: { format?: AdFormat; className?: string }) {
  const pathname = usePathname() || '/'
  const slot = slotByFormat[format]
  const shouldRender = canRenderAds(pathname, slot)

  useEffect(() => {
    if (!shouldRender) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ad blockers and consent tools can prevent AdSense from initializing.
    }
  }, [shouldRender, pathname])

  if (!shouldRender || !slot) return null

  return (
    <aside className={`mm-ad-banner ${className}`.trim()} aria-label="Advertisement">
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      />
      <span className="mm-ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={formatToStyle[format]}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive="true"
        {...CHILD_SAFE_AD_ATTRIBUTES}
      />
    </aside>
  )
}
