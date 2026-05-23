'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

function getSessionId() {
  try {
    let id = sessionStorage.getItem('mm_session_id')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('mm_session_id', id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

export default function PageViewTracker() {
  const pathname = usePathname() || '/'

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    try {
      supabase
        .from('mm_page_views')
        .insert({ path: pathname, session_id: getSessionId() })
        .then(() => {})
    } catch {
      // Silent — table may not exist
    }
  }, [pathname])

  useEffect(() => {
    try {
      const key = crypto.randomUUID()
      const channel = supabase.channel('site-presence', { config: { presence: { key } } })

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          try {
            await channel.track({
              online_at: new Date().toISOString(),
              path: window.location.pathname,
            })
          } catch {}
        }
      })

      return () => {
        channel.unsubscribe()
        supabase.removeChannel(channel)
      }
    } catch {
      // Silent
    }
  }, [])

  return null
}
