import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import type { Song } from '@/src/lib/supabase'
import SongPlayer from '@/src/components/SongPlayer'

async function fetchSong(id: string): Promise<Song | null> {
  try {
    const { data } = await supabase.from('mm_songs').select('*').eq('id', id).eq('published', true).single()
    return (data as Song) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const s = await fetchSong(id)
  if (!s) return { title: 'Şarkı bulunamadı', robots: { index: false } }
  return {
    title: s.title,
    description: `${s.title} — çocuklar için eğitsel İngilizce şarkı. ${s.category || 'genel'} kategorisinde, ${s.duration || ''} süreli, eşlik edebilirsiniz.`,
    alternates: { canonical: `https://minesminis.com/songs/${s.id}` },
  }
}

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = await fetchSong(id)
  if (!s) notFound()
  return <SongPlayer song={s} />
}
