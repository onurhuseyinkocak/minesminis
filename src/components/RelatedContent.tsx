import Link from 'next/link'
import { Presentation, Video as VideoIcon, Music, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'

type ContentType = 'slides' | 'videos' | 'songs' | 'worksheets'

const tableMap: Record<ContentType, string> = {
  slides: 'mm_slides',
  videos: 'mm_videos',
  songs: 'mm_songs',
  worksheets: 'mm_worksheets',
}

const labelMap: Record<ContentType, string> = {
  slides: 'Benzer Sunumlar',
  videos: 'Benzer Videolar',
  songs: 'Benzer Şarkılar',
  worksheets: 'Benzer Çalışma Kâğıtları',
}

const iconMap: Record<ContentType, typeof Presentation> = {
  slides: Presentation,
  videos: VideoIcon,
  songs: Music,
  worksheets: FileText,
}

interface Props {
  type: ContentType
  currentId: string
  category?: string | null
  limit?: number
}

export default async function RelatedContent({ type, currentId, category, limit = 6 }: Props) {
  const table = tableMap[type]
  const Icon = iconMap[type]
  let items: { id: string; title: string }[] = []
  try {
    let q = supabase.from(table).select('id, title, category').eq('published', true).neq('id', currentId).limit(limit)
    if (category) q = q.eq('category', category)
    const { data } = await q
    items = (data || []) as { id: string; title: string }[]
    if (items.length < 3) {
      const { data: extra } = await supabase
        .from(table)
        .select('id, title')
        .eq('published', true)
        .neq('id', currentId)
        .order('created_at', { ascending: false })
        .limit(limit)
      const seen = new Set(items.map((i) => i.id))
      for (const x of (extra || []) as { id: string; title: string }[]) {
        if (!seen.has(x.id)) items.push(x)
        if (items.length >= limit) break
      }
    }
  } catch {
    return null
  }
  if (items.length === 0) return null

  return (
    <section style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{labelMap[type]}</h2>
      <div className="mm-grid-3">
        {items.map((it) => (
          <Link key={it.id} href={`/${type}/${it.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{it.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
