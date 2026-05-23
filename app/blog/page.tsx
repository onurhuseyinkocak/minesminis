import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import { supabase } from '../../src/lib/supabase'
import { staticBlogs } from '../../src/content/staticBlogs'
import type { Blog } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Blog — İngilizce Öğretim Kaynakları',
  description:
    'Çocuklara İngilizce öğretme teknikleri, Maarif modeli uyumlu ders kaynakları, etkinlikler ve oyunlar. Aileler ve öğretmenler için orijinal makaleler.',
  alternates: { canonical: 'https://minesminis.com/blog' },
}

// ISR — refresh blog list every 5 minutes
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

export default async function BlogListPage() {
  const dbBlogs = await fetchBlogs()
  const merged: Blog[] = [...dbBlogs, ...(staticBlogs as unknown as Blog[])].sort((a, b) => {
    const ta = a.published_at ? new Date(a.published_at).getTime() : 0
    const tb = b.published_at ? new Date(b.published_at).getTime() : 0
    return tb - ta
  })

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'minesminis Blog',
    description: 'Çocuklara İngilizce öğretme kaynakları, etkinlikler, oyunlar ve Maarif modeli uyumlu ders planları.',
    url: 'https://minesminis.com/blog',
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

      {merged.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Henüz yazı yok</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>Yakında orijinal eğitim içerikleri burada paylaşılacak.</p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {merged.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                {blog.cover_url ? (
                  <img src={blog.cover_url} alt={blog.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
