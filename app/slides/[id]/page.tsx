import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import type { Slide } from '@/src/lib/supabase'
import SlidePlayer from '@/src/components/SlidePlayer'

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
  return {
    title: slide.title,
    description: `${slide.title} — ilkokul İngilizce sunum materyali. ${slide.slide_count || 0} slayt, ${slide.level || 'temel'} seviye.`,
    alternates: { canonical: `https://minesminis.com/slides/${slide.id}` },
  }
}

export default async function SlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slide = await fetchSlide(id)
  if (!slide) notFound()
  return <SlidePlayer slide={slide} />
}
