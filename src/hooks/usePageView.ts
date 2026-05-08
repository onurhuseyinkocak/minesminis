import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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

export function usePageView() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return

    try {
      supabase
        .from('mm_page_views')
        .insert({ path: location.pathname, session_id: getSessionId() })
        .then(() => {})
    } catch {
      // Table may not exist yet — silent fail
    }
  }, [location.pathname])
}
