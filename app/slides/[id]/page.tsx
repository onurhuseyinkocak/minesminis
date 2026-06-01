import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Slide } from '../../../src/lib/supabase'
import SlidePlayer from '../../../src/components/SlidePlayer'
import RelatedContent from '../../../src/components/RelatedContent'
import { hasSlideContent } from '../../../src/lib/resourceQuality'

async function fetchSlide(id: string): Promise<Slide | null> {
  try {
    const { data } = await supabase.from('mm_slides').select('*').eq('id', id).eq('published', true).single()
    return (data as Slide) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const slide = await fetchSlide(id)
  if (!slide) return { title: 'Sunum bulunamadı', robots: { index: false } }
  const hasLearningContent = hasSlideContent(slide)
  return {
    title: slide.title,
    description: `${slide.title} — ilkokul İngilizce sunum materyali. ${slide.slide_count || 0} slayt, ${slide.level || 'temel'} seviye.`,
    alternates: { canonical: `https://minesminis.com/slides/${slide.id}` },
    robots: hasLearningContent ? undefined : { index: false, follow: true },
  }
}

export default async function SlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slide = await fetchSlide(id)
  if (!slide) notFound()

  const slideSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: slide.title,
    description: `${slide.title} — ilkokul İngilizce ${slide.slide_count || 0} slaytlık sunum.`,
    inLanguage: 'en',
    learningResourceType: 'Presentation',
    educationalLevel: slide.level || 'Primary School',
    educationalUse: 'Classroom Activity',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    numberOfPages: slide.slide_count || undefined,
    contentUrl: (slide as any).file_url || undefined,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    url: `https://minesminis.com/slides/${slide.id}`,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Sunumlar', item: 'https://minesminis.com/slides' },
      { '@type': 'ListItem', position: 3, name: slide.title, item: `https://minesminis.com/slides/${slide.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(slideSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SlidePlayer slide={slide} />
      <RelatedContent type="slides" currentId={slide.id} category={(slide as any).category} />
    </>
  )
}
