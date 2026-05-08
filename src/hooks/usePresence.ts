import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * usePresenceTrack - Tracks user presence on public pages
 * Call once in App.tsx root component
 * No auth required - uses anonymous presence tracking
 */
export function usePresenceTrack() {
  useEffect(() => {
    const channel = supabase.channel('site-presence', {
      config: { presence: { key: crypto.randomUUID() } }
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        })
      }
    })

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])
}

/**
 * usePresenceCount - Reads live active user count
 * Used in admin dashboard or public header
 * Returns count of active presence channels
 */
export function usePresenceCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const channel = supabase.channel('site-presence')

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const activeCount = Object.keys(state).length
      setCount(activeCount)
    })

    channel.on('presence', { event: 'join' }, () => {
      const state = channel.presenceState()
      const activeCount = Object.keys(state).length
      setCount(activeCount)
    })

    channel.on('presence', { event: 'leave' }, () => {
      const state = channel.presenceState()
      const activeCount = Object.keys(state).length
      setCount(activeCount)
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        const state = channel.presenceState()
        setCount(Object.keys(state).length)
      }
    })

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  return count
}
