import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Slide = {
  id: string
  title: string
  cover_kind: string
  slide_count: number
  level: string
  category: string
  slides_data: SlideItem[]
  published: boolean
  created_at: string
}

export type SlideItem = {
  label: string
  translation: string
  cover_kind: string
}

export type Video = {
  id: string
  title: string
  cover_kind: string
  duration: string
  category: string
  youtube_url: string
  lyrics_en: string
  lyrics_tr: string
  published: boolean
  created_at: string
}

export type Song = {
  id: string
  title: string
  cover_kind: string
  duration: string
  category: string
  audio_url: string
  lyrics: SongLyric[]
  published: boolean
  created_at: string
}

export type SongLyric = {
  en: string
  tr: string
  highlight?: boolean
}
