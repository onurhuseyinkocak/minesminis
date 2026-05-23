import type { Metadata } from 'next'
import Link from 'next/link'
import { Play, Presentation, Video, Music, FileText, ChevronRight, Star, BookOpen } from 'lucide-react'
import Cover from '../src/components/Cover'
import { supabase } from '../src/lib/supabase'
import DashboardCover from '../src/components/DashboardCover'
import { staticBlogs } from '../src/content/staticBlogs'

export const metadata: Metadata = {
  title: 'Çocuklar İçin Ücretsiz İngilizce Öğrenme Platformu',
  description:
    'Çocuklarınız için Maarif modeli uyumlu, ücretsiz İngilizce kaynaklar: sunumlar, videolar, şarkılar ve çalışma kâğıtları. Hemen başlayın.',
  alternates: { canonical: 'https://minesminis.com/' },
}

export const revalidate = 300

const features = [
  { id: 'slides', title: 'Sunumlar', icon: Presentation, image: '/images/cat-slides.webp', tag: 'Öğren', path: '/slides', coverFallback: 'school' },
  { id: 'videos', title: 'Videolar', icon: Video, image: '/images/cat-videos.webp', tag: 'İzle', path: '/videos', coverFallback: 'star' },
  { id: 'songs', title: 'Şarkılar', icon: Music, image: '/images/cat-songs.webp', tag: 'Söyle', path: '/songs', coverFallback: 'dance' },
  { id: 'worksheets', title: 'Çalışma Kâğıtları', icon: FileText, image: '/images/cat-worksheets.webp', tag: 'Yazdır', path: '/worksheets', coverFallback: 'abc' },
]

async function getCounts() {
  try {
    const [s, v, so, w] = await Promise.all([
      supabase.from('mm_slides').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_videos').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_songs').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_worksheets').select('id', { count: 'exact', head: true }).eq('published', true),
    ])
    return { slides: s.count || 0, videos: v.count || 0, songs: so.count || 0, worksheets: w.count || 0 }
  } catch {
    return { slides: 0, videos: 0, songs: 0, worksheets: 0 }
  }
}

async function getRecent() {
  try {
    const [s, v, so, w] = await Promise.all([
      supabase.from('mm_slides').select('id, title, cover_kind, slide_count').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_videos').select('id, title, cover_kind, duration').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_songs').select('id, title, cover_kind, duration').eq('published', true).order('created_at', { ascending: false }).limit(2),
      supabase.from('mm_worksheets').select('id, title, cover_kind, page_count').eq('published', true).order('created_at', { ascending: false }).limit(2),
    ])
    const items: { id: string; title: string; cover_kind: string; type: string; meta: string; tag: string }[] = []
    ;(s.data || []).forEach((d: any) => items.push({ ...d, type: 'slides', meta: `${d.slide_count} slide`, tag: 'coral' }))
    ;(v.data || []).forEach((d: any) => items.push({ ...d, type: 'videos', meta: d.duration, tag: 'blue' }))
    ;(so.data || []).forEach((d: any) => items.push({ ...d, type: 'songs', meta: d.duration, tag: 'lilac' }))
    ;(w.data || []).forEach((d: any) => items.push({ ...d, type: 'worksheets', meta: `${d.page_count} sayfa`, tag: 'green' }))
    return items
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [counts, recent] = await Promise.all([getCounts(), getRecent()])

  // Blog posts: prefer DB, fall back to static
  let dbBlogs: any[] = []
  try {
    const { data } = await supabase
      .from('mm_blogs')
      .select('id, title, slug, excerpt, cover_url, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
    dbBlogs = data || []
  } catch {
    // ignore
  }
  const blogPosts = dbBlogs.length > 0 ? dbBlogs : staticBlogs.slice(0, 3)

  const countLabels = [
    counts.slides + ' sunum',
    counts.videos + ' video',
    counts.songs + ' şarkı',
    counts.worksheets + ' kâğıt',
  ]

  return (
    <>
      <div
        className="mm-hero"
        style={{ background: 'linear-gradient(135deg, #7B68EE 0%, #9B87F5 50%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', gap: 24 }}
      >
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#7B68EE', marginBottom: 8 }}>
            <Star size={12} /> ÇOCUKLAR İÇİN İNGİLİZCE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: -1, color: 'white' }}>
            Eğlenerek<br />İngilizce öğren.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: 500, maxWidth: 400 }}>
            Sunumlar, videolar, şarkılar ve çalışma kâğıtlarıyla çocuğunuza özel keyifli bir öğrenme deneyimi.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <Link href="/slides" className="mm-btn" style={{ background: 'white', color: '#7B68EE', fontWeight: 700 }}>
              <Play size={14} /> Öğrenmeye Başla
            </Link>
          </div>
        </div>
        <img
          src="/images/hero-bg.webp"
          alt=""
          loading="eager"
          className="mm-hero-img"
          style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 18, flexShrink: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        />
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 14px', letterSpacing: -0.5 }}>Kategoriler</h2>
      <div className="mm-grid-3" style={{ marginBottom: 28 }}>
        {features.map((f, i) => (
          <Link key={f.id} href={f.path} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="mm-card-cover">
              <DashboardCover src={f.image} alt={f.title} fallback={f.coverFallback} />
            </div>
            <div className="mm-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h3 className="mm-card-title" style={{ flex: 1, minWidth: 0 }}>{f.title}</h3>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <f.icon size={18} />
                </div>
              </div>
              <div className="mm-card-meta" style={{ marginTop: 4 }}>
                <span>{countLabels[i]}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)' }} />
                <span>{f.tag}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, letterSpacing: -0.5 }}>Son Eklenenler</h2>
            <Link href="/slides" className="mm-btn">Tümünü Gör <ChevronRight size={14} /></Link>
          </div>
          <div className="mm-grid-3">
            {recent.map((p) => (
              <Link key={p.type + p.id} href={`/${p.type}/${p.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mm-card-cover">
                  <Cover kind={p.cover_kind} />
                  <div className="mm-card-cta"><Play size={18} /></div>
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-title">{p.title}</h3>
                  <div className="mm-card-meta">
                    <span className={`mm-tag ${p.tag}`}>{p.meta}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {blogPosts.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, letterSpacing: -0.5 }}>Blog</h2>
            <Link href="/blog" className="mm-btn">Tümü <ChevronRight size={14} /></Link>
          </div>
          <div className="mm-grid-3">
            {blogPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mm-card-cover">
                  {post.cover_url ? (
                    <img src={post.cover_url} alt={post.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7B68EE 0%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={36} color="white" style={{ opacity: 0.6 }} />
                    </div>
                  )}
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-title" style={{ whiteSpace: 'normal', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '4px 0 0', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}
