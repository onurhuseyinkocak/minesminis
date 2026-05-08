import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePresenceTrack() {
  useEffect(() => {
    try {
      const key = crypto.randomUUID()
      const channel = supabase.channel('site-presence', {
        config: { presence: { key } }
      })

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
      // Presence not available — silent fail
    }
  }, [])
}

export function usePresenceCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const channel = supabase.channel('admin-presence-reader')

      channel.on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState()
          setCount(Object.keys(state).length)
        } catch {}
      })

      channel.subscribe()

      return () => {
        channel.unsubscribe()
        supabase.removeChannel(channel)
      }
    } catch {
      // Silent fail
    }
  }, [])

  return count
}
