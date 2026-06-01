'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ADSENSE_CLIENT, CHILD_SAFE_AD_ATTRIBUTES, canRenderAds } from '../lib/adSafety'

export default function AdRail() {
  const pathname = usePathname() || '/'
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL
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
    <aside className="rail" aria-label="Advertisement">
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      />
      <div className="mm-ad-rail">
        <span className="mm-ad-label">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: 600 }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...CHILD_SAFE_AD_ATTRIBUTES}
        />
      </div>
    </aside>
  )
}
