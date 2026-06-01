import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react'
import { supabase } from '../../../src/lib/supabase'
import { findStaticBlogBySlug, staticBlogs } from '../../../src/content/staticBlogs'
import type { Blog } from '../../../src/lib/supabase'
import SanitizedHtml from '../../../src/components/SanitizedHtml'

// Pre-render static slugs at build time; DB blogs fall back to runtime SSR
export async function generateStaticParams() {
  return staticBlogs.map((b) => ({ slug: b.slug }))
}

export const revalidate = 300 // 5 min

async function fetchBlog(slug: string): Promise<Blog | null> {
  // 1. Static bundled blogs (no network roundtrip)
  const fromStatic = findStaticBlogBySlug(slug)
  if (fromStatic) return fromStatic as unknown as Blog

  // 2. DB
  try {
    const { data, error } = await supabase
      .from('mm_blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error || !data) return null
    return data as Blog
  } catch {
    return null
  }
}

async function fetchRelated(category: string, currentId: string): Promise<Blog[]> {
  let dbRelated: Blog[] = []
  try {
    const { data } = await supabase
      .from('mm_blogs')
      .select('id, title, slug, excerpt, cover_url, category, published_at, reading_time_min')
      .eq('status', 'published')
      .eq('category', category)
      .neq('id', currentId)
      .order('published_at', { ascending: false })
      .limit(3)
    dbRelated = (data || []) as Blog[]
  } catch {
    // ignore
  }
  const staticRelated = staticBlogs
    .filter((b) => b.category === category && b.id !== currentId)
    .slice(0, Math.max(0, 3 - dbRelated.length)) as unknown as Blog[]
  return [...dbRelated, ...staticRelated]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await fetchBlog(slug)
  if (!blog) {
    return {
      title: 'Yazı bulunamadı',
      robots: { index: false, follow: true },
    }
  }
  return {
    title: blog.title,
    description: blog.meta_description || blog.excerpt,
    alternates: { canonical: `https://minesminis.com/blog/${blog.slug}` },
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.meta_description || blog.excerpt,
      url: `https://minesminis.com/blog/${blog.slug}`,
      images: blog.cover_url ? [blog.cover_url] : ['/images/minesminis-logo-512.png'],
      publishedTime: blog.published_at || undefined,
      modifiedTime: blog.updated_at,
    },
    keywords: blog.keywords,
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await fetchBlog(slug)
  if (!blog) notFound()
  const related = await fetchRelated(blog.category, blog.id)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.meta_description || blog.excerpt,
    image: blog.cover_url,
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    author: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com', logo: { '@type': 'ImageObject', url: 'https://minesminis.com/images/minesminis-logo-512.png' } },
    url: `https://minesminis.com/blog/${blog.slug}`,
    keywords: blog.keywords?.join(', '),
    inLanguage: 'tr',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://minesminis.com/blog/${blog.slug}` },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://minesminis.com/blog' },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `https://minesminis.com/blog/${blog.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', textDecoration: 'none', fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          <ArrowLeft size={16} /> Blog'a Dön
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span className={`mm-tag ${blog.category === 'teacher-resources' ? 'blue' : 'green'}`}>
            {blog.category === 'teacher-resources' ? 'Öğretmen Kaynakları' : 'Çocuklara İngilizce'}
          </span>
          {blog.published_at && (
            <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} /> {formatDate(blog.published_at)}
            </span>
          )}
          <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> {blog.reading_time_min} dk okuma
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.8, margin: '0 0 20px' }}>
          {blog.title}
        </h1>

        {blog.cover_url && (
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, aspectRatio: '16/9', position: 'relative' }}>
            <Image src={blog.cover_url} alt={blog.title} fill priority sizes="(max-width: 768px) 100vw, 760px" style={{ objectFit: 'cover' }} />
          </div>
        )}

        <SanitizedHtml html={blog.content_html} className="mm-blog-content" />

        {blog.keywords && blog.keywords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            {blog.keywords.map((kw, i) => (
              <span key={i} className="mm-tag">{kw}</span>
            ))}
          </div>
        )}

        <div style={{ background: 'var(--surface-2)', borderRadius: 16, padding: 24, marginTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Ücretsiz İngilizce Kaynakları</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.5 }}>
            minesminis'te çocuklara İngilizce öğretmek için hazır materyalleri keşfet:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <Link href="/slides" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Sunumlar</Link>
            <Link href="/videos" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Videolar</Link>
            <Link href="/songs" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Şarkılar</Link>
            <Link href="/worksheets" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Çalışma Kâğıtları</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>İlgili Yazılar</h2>
          <div className="mm-grid-3">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mm-card-cover">
                  {r.cover_url ? (
                    <Image src={r.cover_url} alt={r.title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7B68EE 0%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={36} color="white" style={{ opacity: 0.6 }} />
                    </div>
                  )}
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-title" style={{ whiteSpace: 'normal', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any }}>{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
