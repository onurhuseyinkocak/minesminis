import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function getSessionId() {
  let id = sessionStorage.getItem('mm_session_id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('mm_session_id', id)
  }
  return id
}

export function usePageView() {
  const location = useLocation()

  useEffect(() => {
    // Skip admin pages
    if (location.pathname.startsWith('/admin')) return

    const sessionId = getSessionId()

    // Fire-and-forget insert
    supabase
      .from('mm_page_views')
      .insert({ path: location.pathname, session_id: sessionId })
      .then(() => {}) // silent fail
  }, [location.pathname])
}
