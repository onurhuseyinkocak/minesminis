import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Video } from '../../../src/lib/supabase'
import VideoPlayer from '../../../src/components/VideoPlayer'
import RelatedContent from '../../../src/components/RelatedContent'
import { hasVideoContent } from '../../../src/lib/resourceQuality'

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
  const hasPlayableContent = hasVideoContent(video)
  return {
    title: video.title,
    description: `${video.title} — çocuklar için eğitsel İngilizce video. ${video.category || 'genel'} kategorisinde, ${video.duration || ''} süreli.`,
    alternates: { canonical: `https://minesminis.com/videos/${video.id}` },
    robots: hasPlayableContent ? undefined : { index: false, follow: true },
  }
}

function ytThumb(youtubeUrl?: string | null): string | undefined {
  if (!youtubeUrl) return undefined
  const m = youtubeUrl.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : undefined
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const video = await fetchVideo(id)
  if (!video) notFound()

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: `${video.title} — çocuklar için Maarif modeli uyumlu eğitsel İngilizce video.`,
    thumbnailUrl: ytThumb(video.youtube_url) || 'https://minesminis.com/images/minesminis-logo-512.png',
    uploadDate: (video as any).created_at || new Date().toISOString(),
    duration: video.duration || undefined,
    contentUrl: video.youtube_url || undefined,
    embedUrl: video.youtube_url || undefined,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    inLanguage: 'en',
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    learningResourceType: 'Video',
    educationalLevel: 'Primary School',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Videolar', item: 'https://minesminis.com/videos' },
      { '@type': 'ListItem', position: 3, name: video.title, item: `https://minesminis.com/videos/${video.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <VideoPlayer video={video} />
      <RelatedContent type="videos" currentId={video.id} category={video.category} />
    </>
  )
}
