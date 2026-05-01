import { useEffect, useRef } from 'react'

declare global {
  interface Window { adsbygoogle: Record<string, unknown>[] }
}

export default function MobileAd() {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense not loaded
    }
  }, [])

  return (
    <div className="mm-mobile-ad">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: 100 }}
        data-ad-client="ca-pub-6644397387275334"
        data-ad-format="horizontal"
        data-tag-for-child-directed-treatment="1"
      />
    </div>
  )
}
