import { useEffect, useRef } from 'react'

declare global {
  interface Window { adsbygoogle: any[] }
}

function AdSlot({ width, height }: { width: number; height: number }) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense not loaded yet
    }
  }, [])

  return (
    <div style={{ width, minHeight: height }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width, height }}
        data-ad-client="ca-pub-6644397387275334"
        data-ad-format="vertical"
        data-tag-for-child-directed-treatment="1"
      />
    </div>
  )
}

export default function AdRail() {
  return (
    <div className="rail">
      <AdSlot width={160} height={600} />
    </div>
  )
}
