'use client'

import { Volume2 } from 'lucide-react'
import { useCallback } from 'react'

export default function SpeakWord({ word, lang = 'en-US' }: { word: string; lang?: string }) {
  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(word)
      u.lang = lang
      u.rate = 0.85
      u.pitch = 1
      window.speechSynthesis.speak(u)
    } catch {
      // ignore
    }
  }, [word, lang])

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`${word} kelimesini sesli dinle`}
      title="Sesli dinle"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--primary)',
        padding: 4,
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <Volume2 size={16} />
    </button>
  )
}
