import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Worksheet } from '../../../src/lib/supabase'
import WorksheetPlayer from '../../../src/components/WorksheetPlayer'
import RelatedContent from '../../../src/components/RelatedContent'
import { hasWorksheetContent } from '../../../src/lib/resourceQuality'

async function fetchWorksheet(id: string): Promise<Worksheet | null> {
  try {
    const { data } = await supabase.from('mm_worksheets').select('*').eq('id', id).eq('published', true).single()
    return (data as Worksheet) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const w = await fetchWorksheet(id)
  if (!w) return { title: 'Çalışma kâğıdı bulunamadı', robots: { index: false } }
  const hasPrintableContent = hasWorksheetContent(w)
  return {
    title: w.title,
    description: w.description || `${w.title} — yazdırılabilir İngilizce çalışma kâğıdı. ${w.page_count} sayfa, ${w.level || 'temel'} seviye.`,
    alternates: { canonical: `https://minesminis.com/worksheets/${w.id}` },
    robots: hasPrintableContent ? undefined : { index: false, follow: true },
  }
}

export default async function WorksheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const w = await fetchWorksheet(id)
  if (!w) notFound()

  const worksheetSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: w.title,
    description: w.description || `${w.title} — yazdırılabilir İngilizce çalışma kâğıdı.`,
    inLanguage: 'en',
    learningResourceType: 'Worksheet',
    educationalLevel: w.level || 'Primary School',
    educationalUse: 'Practice',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    encodingFormat: 'application/pdf',
    numberOfPages: w.page_count || undefined,
    contentUrl: (w as any).file_url || undefined,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    url: `https://minesminis.com/worksheets/${w.id}`,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Çalışma Kâğıtları', item: 'https://minesminis.com/worksheets' },
      { '@type': 'ListItem', position: 3, name: w.title, item: `https://minesminis.com/worksheets/${w.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(worksheetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <WorksheetPlayer worksheet={w} />
      <RelatedContent type="worksheets" currentId={w.id} category={(w as any).category} />
    </>
  )
}
