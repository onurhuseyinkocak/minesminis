import Link from 'next/link'
import { Calendar, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'

function tnorm(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export default async function RelatedBlogs({ topicKeywords, topicLabel }: { topicKeywords: string[]; topicLabel: string }) {
  let blogs: Array<{ title: string; slug: string; excerpt?: string; published_at?: string | null }> = []
  try {
    const { data } = await supabase
      .from('mm_blogs')
      .select('title, slug, excerpt, keywords, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(80)
    const haystack = (data || []) as any[]
    const targets = [topicLabel, ...topicKeywords].map(tnorm)
    blogs = haystack
      .filter((b: any) => {
        const hay = tnorm([b.title, b.excerpt || '', (b.keywords || []).join(' ')].join(' '))
        return targets.some((t) => t && hay.includes(t))
      })
      .slice(0, 4)
      .map((b: any) => ({ title: b.title, slug: b.slug, excerpt: b.excerpt, published_at: b.published_at }))
  } catch {
    return null
  }
  if (blogs.length === 0) return null
  return (
    <section style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>"{topicLabel}" ile İlgili Blog Yazıları</h2>
      <div className="mm-grid-2">
        {blogs.map((b) => (
          <Link key={b.slug} href={`/blog/${b.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <BookOpen size={18} color="var(--primary)" style={{ marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{b.title}</div>
                {b.published_at && (
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={11} />
                    {new Date(b.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
