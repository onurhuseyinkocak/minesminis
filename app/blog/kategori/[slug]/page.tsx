import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Clock } from 'lucide-react'
import { staticBlogs } from '../../../../src/content/staticBlogs'
import { supabase } from '../../../../src/lib/supabase'
import BlogCover from '../../../../src/components/BlogCover'

type CatKey = 'cocuklara-ingilizce' | 'ogretmen-kaynaklari'

const CATEGORIES: Record<CatKey, { dbKey: string; titleTr: string; titleEn: string; metaDesc: string }> = {
  'cocuklara-ingilizce': {
    dbKey: 'teaching-english-to-kids',
    titleTr: 'Çocuklara İngilizce',
    titleEn: 'Teaching English to Kids',
    metaDesc: 'Çocuklara İngilizce öğretmek için aile ve öğretmen rehberleri. Maarif modeli uyumlu, yaş bazlı, bilim destekli yöntemler.',
  },
  'ogretmen-kaynaklari': {
    dbKey: 'teacher-resources',
    titleTr: 'Öğretmen Kaynakları',
    titleEn: 'Teacher Resources',
    metaDesc: 'İlkokul İngilizce öğretmenleri için sınıf etkinlikleri, ders planı önerileri, ücretsiz materyal ipuçları.',
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }))
}

export const revalidate = 600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES[slug as CatKey]
  if (!cat) return { title: 'Kategori bulunamadı', robots: { index: false } }
  return {
    title: `${cat.titleTr} — Blog Yazıları`,
    description: cat.metaDesc,
    alternates: { canonical: `https://minesminis.com/blog/kategori/${slug}` },
    openGraph: { type: 'website', title: cat.titleTr, description: cat.metaDesc, url: `https://minesminis.com/blog/kategori/${slug}` },
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORIES[slug as CatKey]
  if (!cat) notFound()

  // Static blogs
  const staticInCat = staticBlogs.filter((b) => b.category === cat.dbKey)

  // DB blogs
  let dbBlogs: any[] = []
  try {
    const { data } = await supabase
      .from('mm_blogs')
      .select('id, title, slug, excerpt, cover_url, published_at, reading_time_min, category')
      .eq('status', 'published')
      .eq('category', cat.dbKey)
      .order('published_at', { ascending: false })
    dbBlogs = data || []
  } catch {
    // ignore
  }

  const seen = new Set<string>()
  const all = [...dbBlogs, ...staticInCat].filter((b: any) => {
    if (seen.has(b.slug)) return false
    seen.add(b.slug)
    return true
  })

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.titleTr,
    description: cat.metaDesc,
    inLanguage: 'tr',
    url: `https://minesminis.com/blog/kategori/${slug}`,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    hasPart: all.slice(0, 20).map((b: any) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      url: `https://minesminis.com/blog/${b.slug}`,
      datePublished: b.published_at || undefined,
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://minesminis.com/blog' },
      { '@type': 'ListItem', position: 3, name: cat.titleTr, item: `https://minesminis.com/blog/kategori/${slug}` },
    ],
  }

  const otherSlug = (Object.keys(CATEGORIES) as CatKey[]).find((k) => k !== slug)!
  const other = CATEGORIES[otherSlug]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href="/blog" style={{ color: 'var(--ink-3)' }}>Blog</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>{cat.titleTr}</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {cat.titleTr}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 700 }}>{cat.metaDesc}</p>

        {all.length === 0 ? (
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 28, textAlign: 'center', color: 'var(--ink-3)' }}>
            Bu kategoride henüz yazı yok. Yakında eklenecek.
          </div>
        ) : (
          <div className="mm-grid-3" style={{ marginBottom: 36 }}>
            {all.map((b: any) => (
              <Link key={b.slug} href={`/blog/${b.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mm-card-cover">
                  <BlogCover src={b.cover_url} alt={b.title} iconSize={36} />
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-title">{b.title}</h3>
                  <div className="mm-card-meta" style={{ marginTop: 4 }}>
                    {b.published_at && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} /> {formatDate(b.published_at)}
                      </span>
                    )}
                    {b.reading_time_min && (
                      <>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)' }} />
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {b.reading_time_min} dk</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 22, textAlign: 'center', fontSize: 14 }}>
          Diğer kategori için: <Link href={`/blog/kategori/${otherSlug}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{other.titleTr}</Link>
        </div>
      </div>
    </>
  )
}
