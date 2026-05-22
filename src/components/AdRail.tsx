import { useEffect, useRef, useState } from 'react'

let railCounter = 0

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth > 1024)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return desktop
}

function AdSlot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(`rail-${++railCounter}`)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ins = document.createElement('ins')
    ins.className = 'adsbygoogle'
    ins.style.display = 'block'
    ins.style.width = '160px'
    ins.style.height = '600px'
    ins.dataset.adClient = 'ca-pub-6644397387275334'
    ins.dataset.adSlot = '5178461633' // sidebar ad unit — create a separate ad unit in AdSense and replace this ID
    ins.dataset.adFormat = 'vertical'
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
  }, [])

  return <div ref={containerRef} id={idRef.current} style={{ width: 160, minHeight: 600 }} />
}

export default function AdRail() {
  const isDesktop = useIsDesktop()
  if (!isDesktop) return null

  return (
    <div className="rail">
      <AdSlot />
    </div>
  )
}
