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
  file_url: string
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
  thumbnail_url: string
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
  youtube_url: string
  lyrics: SongLyric[]
  published: boolean
  created_at: string
}

export type SongLyric = {
  en: string
  tr: string
  highlight?: boolean
  time?: number // karaoke timestamp in seconds
}

export type Worksheet = {
  id: string
  title: string
  cover_kind: string
  level: string
  category: string
  description: string
  file_url: string
  page_count: number
  published: boolean
  created_at: string
}

export type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content_html: string
  meta_description: string
  keywords: string[]
  category: string
  cover_url: string | null
  status: string
  error_log: string | null
  reading_time_min: number
  published_at: string | null
  created_at: string
  updated_at: string
}
