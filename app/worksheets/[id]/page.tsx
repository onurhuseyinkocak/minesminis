import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Worksheet } from '../../../src/lib/supabase'
import WorksheetPlayer from '../../../src/components/WorksheetPlayer'

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
  return {
    title: w.title,
    description: w.description || `${w.title} — yazdırılabilir İngilizce çalışma kâğıdı. ${w.page_count} sayfa, ${w.level || 'temel'} seviye.`,
    alternates: { canonical: `https://minesminis.com/worksheets/${w.id}` },
  }
}

export default async function WorksheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const w = await fetchWorksheet(id)
  if (!w) notFound()
  return <WorksheetPlayer worksheet={w} />
}
