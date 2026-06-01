import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'minesminis — Çocuklar İçin Ücretsiz İngilizce',
    description: 'Maarif modeli uyumlu, 4-12 yaş arası çocuklar için ücretsiz İngilizce öğrenme platformu.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/',
    isPartOf: { '@type': 'WebSite', name: 'minesminis', url: 'https://minesminis.com' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Sunumlar', url: 'https://minesminis.com/slides' },
        { '@type': 'ListItem', position: 2, name: 'Videolar', url: 'https://minesminis.com/videos' },
        { '@type': 'ListItem', position: 3, name: 'Şarkılar', url: 'https://minesminis.com/songs' },
        { '@type': 'ListItem', position: 4, name: 'Çalışma Kâğıtları', url: 'https://minesminis.com/worksheets' },
        { '@type': 'ListItem', position: 5, name: '1. Sınıf', url: 'https://minesminis.com/sinif/1' },
        { '@type': 'ListItem', position: 6, name: '2. Sınıf', url: 'https://minesminis.com/sinif/2' },
        { '@type': 'ListItem', position: 7, name: '3. Sınıf', url: 'https://minesminis.com/sinif/3' },
        { '@type': 'ListItem', position: 8, name: '4. Sınıf', url: 'https://minesminis.com/sinif/4' },
        { '@type': 'ListItem', position: 9, name: 'Müfredat', url: 'https://minesminis.com/curriculum' },
        { '@type': 'ListItem', position: 10, name: 'Konu İndeksi', url: 'https://minesminis.com/konular' },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <div
        className="mm-hero"
        style={{ background: 'linear-gradient(135deg, #7B68EE 0%, #9B87F5 50%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', gap: 24 }}
      >
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#7B68EE', marginBottom: 8 }}>
            <Star size={12} /> ÇOCUKLAR İÇİN İNGİLİZCE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: -1, color: 'white' }}>
            Çocuklara Ücretsiz<br />İngilizce Öğretim Platformu
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.92)', marginTop: 8, fontWeight: 500, maxWidth: 420 }}>
            4-12 yaş Maarif modeli uyumlu: 57 konu, 30 sınıf etkinliği, sunumlar, videolar, şarkılar ve yazdırılabilir çalışma kâğıtları. CEFR A1 hedefli.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <Link href="/sinif/1" className="mm-btn" style={{ background: 'white', color: '#7B68EE', fontWeight: 700 }}>
              <Play size={14} /> Sınıfa Göre Başla
            </Link>
            <Link href="/konular" className="mm-btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)' }}>
              Tüm Konular
            </Link>
          </div>
        </div>
        <Image
          src="/images/hero-bg.webp"
          alt=""
          width={180}
          height={180}
          priority
          fetchPriority="high"
          className="mm-hero-img"
          style={{ objectFit: 'cover', borderRadius: 18, flexShrink: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
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

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 14px', letterSpacing: -0.5 }}>Sınıfa Göre</h2>
      <div className="mm-grid-4" style={{ marginBottom: 28 }}>
        {[1, 2, 3, 4].map((g) => (
          <Link key={g} href={`/sinif/${g}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 18, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{g}. Sınıf</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Maarif modeli uyumlu</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 14px', letterSpacing: -0.5 }}>Popüler Konular</h2>
      <div className="mm-grid-3" style={{ marginBottom: 28 }}>
        {['greetings', 'family', 'colors', 'numbers-1-10', 'animals', 'food', 'body-parts', 'weather', 'clothes'].map((slug) => {
          const labels: Record<string, { tr: string; en: string }> = {
            greetings: { tr: 'Selamlaşmalar', en: 'Greetings' },
            family: { tr: 'Aile', en: 'Family' },
            colors: { tr: 'Renkler', en: 'Colors' },
            'numbers-1-10': { tr: 'Sayılar 1-10', en: 'Numbers' },
            animals: { tr: 'Hayvanlar', en: 'Animals' },
            food: { tr: 'Yiyecekler', en: 'Food' },
            'body-parts': { tr: 'Vücut Bölümleri', en: 'Body Parts' },
            weather: { tr: 'Hava Durumu', en: 'Weather' },
            clothes: { tr: 'Kıyafetler', en: 'Clothes' },
          }
          const l = labels[slug]
          return (
            <Link key={slug} href={`/konu/${slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{l.tr}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{l.en}</div>
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, letterSpacing: -0.5 }}>Sınıf Etkinlikleri</h2>
        <Link href="/etkinlikler" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Tümü →</Link>
      </div>
      <div className="mm-grid-3" style={{ marginBottom: 28 }}>
        {[
          { slug: 'simon-says-actions', tr: 'Simon Diyor ki', en: 'Action Commands', type: 'TPR', time: 15 },
          { slug: 'color-hunt', tr: 'Renk Avı', en: 'Color Hunt', type: 'Oyun', time: 10 },
          { slug: 'animal-charades', tr: 'Hayvan Pantomim', en: 'Animal Charades', type: 'Oyun', time: 15 },
          { slug: 'body-parts-song', tr: 'Vücut Şarkısı', en: 'Body Parts Song', type: 'Şarkı', time: 10 },
          { slug: 'family-photo-introduction', tr: 'Aile Fotoğrafı', en: 'Family Photo', type: 'Rol-Play', time: 20 },
          { slug: 'i-spy-with-my-eye', tr: 'I Spy Oyunu', en: 'I Spy', type: 'Oyun', time: 10 },
        ].map((a) => (
          <Link key={a.slug} href={`/etkinlik/${a.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="mm-tag blue" style={{ fontSize: 11 }}>{a.type}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.time} dk</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{a.tr}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{a.en}</div>
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
                <div className="mm-card-cover" style={{ position: 'relative' }}>
                  {post.cover_url ? (
                    <Image src={post.cover_url} alt={post.title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
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
