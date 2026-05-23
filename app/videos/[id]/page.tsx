import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Video } from '../../../src/lib/supabase'
import VideoPlayer from '../../../src/components/VideoPlayer'

async function fetchVideo(id: string): Promise<Video | null> {
  try {
    const { data } = await supabase.from('mm_videos').select('*').eq('id', id).eq('published', true).single()
    return (data as Video) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const video = await fetchVideo(id)
  if (!video) return { title: 'Video bulunamadı', robots: { index: false } }
  return {
    title: video.title,
    description: `${video.title} — çocuklar için eğitsel İngilizce video. ${video.category || 'genel'} kategorisinde, ${video.duration || ''} süreli.`,
    alternates: { canonical: `https://minesminis.com/videos/${video.id}` },
  }
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const video = await fetchVideo(id)
  if (!video) notFound()
  return <VideoPlayer video={video} />
}
