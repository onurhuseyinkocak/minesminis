import { createClient } from '@supabase/supabase-js'

// Public URLs are baked into the bundle; safe to hardcode as a build-time
// fallback so SSG doesn't fail when env vars aren't set during build.
const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kcbblalwwfjevneegmcv.supabase.co').trim()
const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYmJsYWx3d2ZqZXZuZWVnbWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDY3ODQsImV4cCI6MjA5MzI4Mjc4NH0.Pg66b8AWN-8GZlr8PfNxafMU7wYRnWldgdcz88jnkDg').trim()

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
