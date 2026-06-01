import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Song } from '../../../src/lib/supabase'
import SongPlayer from '../../../src/components/SongPlayer'
import RelatedContent from '../../../src/components/RelatedContent'
import { hasSongContent } from '../../../src/lib/resourceQuality'

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
  const hasPlayableContent = hasSongContent(s)
  return {
    title: s.title,
    description: `${s.title} — çocuklar için eğitsel İngilizce şarkı. ${s.category || 'genel'} kategorisinde, ${s.duration || ''} süreli, eşlik edebilirsiniz.`,
    alternates: { canonical: `https://minesminis.com/songs/${s.id}` },
    robots: hasPlayableContent ? undefined : { index: false, follow: true },
  }
}

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = await fetchSong(id)
  if (!s) notFound()

  const songSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: s.title,
    description: `${s.title} — çocuklar için eğitsel İngilizce şarkı.`,
    inLanguage: 'en',
    learningResourceType: 'Song',
    educationalLevel: 'Primary School',
    educationalUse: 'Vocabulary Building',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    timeRequired: s.duration || undefined,
    contentUrl: s.audio_url || s.youtube_url || undefined,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    url: `https://minesminis.com/songs/${s.id}`,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Şarkılar', item: 'https://minesminis.com/songs' },
      { '@type': 'ListItem', position: 3, name: s.title, item: `https://minesminis.com/songs/${s.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(songSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SongPlayer song={s} />
      <RelatedContent type="songs" currentId={s.id} category={s.category} />
    </>
  )
}
