import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

type AdFormat = 'horizontal' | 'rectangle' | 'vertical' | 'auto'

let adCounter = 0

export default function AdBanner({ format = 'auto', className = '' }: { format?: AdFormat; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const idRef = useRef(`ad-${++adCounter}`)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous ad on route change
    container.innerHTML = ''

    const ins = document.createElement('ins')
    ins.className = 'adsbygoogle'
    ins.style.display = 'block'
    ins.dataset.adClient = 'ca-pub-6644397387275334'
    ins.dataset.adSlot = '5178461633' // inline ad unit
    ins.dataset.adFormat = format
    ins.dataset.fullWidthResponsive = 'true'
    ins.dataset.tagForChildDirectedTreatment = '1'
    container.appendChild(ins)

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded
    }

    return () => {
      container.innerHTML = ''
    }
  }, [location.pathname, format])

  return (
    <div
      ref={containerRef}
      className={`mm-ad-banner ${className}`}
      id={idRef.current}
    />
  )
}
