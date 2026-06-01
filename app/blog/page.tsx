import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, BookOpen, Search } from 'lucide-react'
import { supabase } from '../../src/lib/supabase'
import { staticBlogs } from '../../src/content/staticBlogs'
import type { Blog } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Blog — İngilizce Öğretim Kaynakları',
  description:
    'Çocuklara İngilizce öğretme teknikleri, Maarif modeli uyumlu ders kaynakları, etkinlikler ve oyunlar. Aileler ve öğretmenler için orijinal makaleler.',
  alternates: { canonical: 'https://minesminis.com/blog' },
  openGraph: {
    type: 'website',
    title: 'minesminis Blog — İngilizce Öğretim Kaynakları',
    description: 'Çocuklara İngilizce öğretme teknikleri ve Maarif modeli uyumlu kaynaklar.',
    url: 'https://minesminis.com/blog',
  },
}

export const revalidate = 300

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const { data, error } = await supabase
      .from('mm_blogs')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (error || !data) return []
    return data as Blog[]
  } catch {
    return []
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function norm(s: string): string {
  return s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

const CATS: { key: string; label: string; cls: string }[] = [
  { key: 'all', label: 'Tümü', cls: '' },
  { key: 'teaching-english-to-kids', label: 'Çocuklara İngilizce', cls: 'green' },
  { key: 'teacher-resources', label: 'Öğretmen Kaynakları', cls: 'blue' },
]

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>
}) {
  const { q, cat } = await searchParams
  const query = (q || '').trim()
  const category = cat && CATS.some((c) => c.key === cat) ? cat : 'all'

  const dbBlogs = await fetchBlogs()
  let merged: Blog[] = [...dbBlogs, ...(staticBlogs as unknown as Blog[])].sort((a, b) => {
    const ta = a.published_at ? new Date(a.published_at).getTime() : 0
    const tb = b.published_at ? new Date(b.published_at).getTime() : 0
    return tb - ta
  })

  if (category !== 'all') {
    merged = merged.filter((b) => b.category === category)
  }
  if (query) {
    const nq = norm(query)
    merged = merged.filter((b) => {
      const hay = norm([b.title, b.excerpt || '', (b.keywords || []).join(' ')].join(' '))
      return hay.includes(nq)
    })
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'minesminis Blog',
    description: 'Çocuklara İngilizce öğretme kaynakları, etkinlikler, oyunlar ve Maarif modeli uyumlu ders planları.',
    url: 'https://minesminis.com/blog',
    inLanguage: 'tr',
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://minesminis.com/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    blogPost: merged.slice(0, 10).map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.excerpt,
      url: `https://minesminis.com/blog/${b.slug}`,
      datePublished: b.published_at,
      image: b.cover_url,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Blog</h1>
          <p className="mm-page-sub">Öğretmenler ve aileler için İngilizce öğretim kaynakları, makaleler ve ipuçları</p>
        </div>
      </div>

      <form method="get" action="/blog" style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Blog yazılarında ara…"
            aria-label="Blog ara"
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: 10,
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              fontSize: 14,
              fontFamily: 'inherit',
              color: 'var(--ink)',
            }}
          />
        </div>
        {category !== 'all' && <input type="hidden" name="cat" value={category} />}
        <button type="submit" className="mm-btn" style={{ fontSize: 13, padding: '8px 16px' }}>Ara</button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {CATS.map((c) => {
          const isActive = category === c.key
          const params = new URLSearchParams()
          if (c.key !== 'all') params.set('cat', c.key)
          if (query) params.set('q', query)
          const href = `/blog${params.toString() ? `?${params.toString()}` : ''}`
          return (
            <Link
              key={c.key}
              href={href}
              className={`mm-tag ${c.cls}`}
              style={{
                textDecoration: 'none',
                background: isActive ? 'var(--primary)' : undefined,
                color: isActive ? '#fff' : undefined,
                fontWeight: isActive ? 700 : undefined,
              }}
            >
              {c.label}
            </Link>
          )
        })}
      </div>

      {query && (
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 14 }}>
          "<strong style={{ color: 'var(--ink)' }}>{query}</strong>" için {merged.length} sonuç bulundu.{' '}
          <Link href={category === 'all' ? '/blog' : `/blog?cat=${category}`} style={{ color: 'var(--primary)' }}>Aramayı temizle</Link>
        </p>
      )}

      {merged.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{query ? 'Sonuç bulunamadı' : 'Henüz yazı yok'}</p>
          <p style={{ fontSize: 14, maxWidth: 420, margin: '8px auto 0', lineHeight: 1.6 }}>{query ? 'Farklı bir arama deneyin veya kategori filtresini değiştirin.' : 'Yakında orijinal eğitim içerikleri burada paylaşılacak.'}</p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {merged.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                {blog.cover_url ? (
                  <Image src={blog.cover_url} alt={blog.title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7B68EE 0%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={48} color="white" style={{ opacity: 0.6 }} />
                  </div>
                )}
              </div>
              <div className="mm-card-body">
                <div style={{ marginBottom: 6 }}>
                  <span className={`mm-tag ${blog.category === 'teacher-resources' ? 'blue' : 'green'}`}>
                    {blog.category === 'teacher-resources' ? 'Öğretmen' : 'İngilizce'}
                  </span>
                </div>
                <h2 className="mm-card-title" style={{ whiteSpace: 'normal', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any }}>
                  {blog.title}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '6px 0 0', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {blog.excerpt}
                </p>
                <div className="mm-card-meta" style={{ marginTop: 8 }}>
                  {blog.published_at && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} /> {formatDate(blog.published_at)}
                    </span>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {blog.reading_time_min} dk
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
