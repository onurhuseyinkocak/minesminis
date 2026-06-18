import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Search as SearchIcon, BookOpen, GraduationCap, Folder } from 'lucide-react'
import { topics } from '../../src/content/topics'
import { staticBlogs } from '../../src/content/staticBlogs'
import { supabase } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Arama — Konular, Sınıflar, Blog Yazıları',
  description: 'İlkokul İngilizce konularını, sınıfları, yaş gruplarını ve blog yazılarını arayın.',
  alternates: { canonical: 'https://minesminis.com/ara' },
  // Search results are content-less by default (empty without a query). Keep it
  // out of the index (Google guidance + AdSense "no content" policy); still
  // follow internal links.
  robots: { index: false, follow: true },
}

export const revalidate = 300

function norm(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim()
}

type Hit = { type: 'konu' | 'sinif' | 'yas' | 'blog' | 'tema'; title: string; subtitle?: string; url: string }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = (q || '').trim()
  const nq = norm(query)
  const hits: Hit[] = []

  if (nq.length >= 2) {
    // Topics
    for (const t of topics) {
      const hay = norm([t.titleTr, t.titleEn, t.introTr, t.maarifUnit, ...t.seoKeywords].join(' '))
      if (hay.includes(nq)) {
        hits.push({
          type: 'konu',
          title: `${t.titleTr} (${t.titleEn})`,
          subtitle: `${t.gradeLevels.join(', ')}. Sınıf · ${t.vocabulary.length} kelime`,
          url: `/konu/${t.id}`,
        })
      }
    }
    // Grades
    for (const g of [1, 2, 3, 4]) {
      if (`${g}. sınıf`.includes(query.toLowerCase()) || nq.includes(`${g} sinif`) || nq.includes(`sinif ${g}`)) {
        hits.push({ type: 'sinif', title: `${g}. Sınıf İngilizce`, subtitle: 'Maarif modeli uyumlu', url: `/sinif/${g}` })
      }
    }
    // Ages
    for (const age of ['4-5', '6-7', '8-9', '10-12']) {
      if (nq.includes(age) || nq.includes(age.replace('-', ' '))) {
        hits.push({ type: 'yas', title: `${age} Yaş İngilizce`, subtitle: 'Yaş bazlı yol haritası', url: `/yas/${age}` })
      }
    }
    // Themes
    const themes: { id: string; tr: string }[] = [
      { id: 'gunluk-yasam', tr: 'Günlük Yaşam' },
      { id: 'doga', tr: 'Doğa' },
      { id: 'beslenme', tr: 'Beslenme' },
      { id: 'beceriler', tr: 'Beceriler' },
      { id: 'okul', tr: 'Okul ve Sayılar' },
      { id: 'iletisim', tr: 'İletişim ve Duygu' },
    ]
    for (const th of themes) {
      if (norm(th.tr).includes(nq) || nq.includes(th.id.replace('-', ' '))) {
        hits.push({ type: 'tema', title: th.tr, subtitle: 'Tema sayfası', url: `/tema/${th.id}` })
      }
    }
    // Static blogs
    for (const b of staticBlogs) {
      const hay = norm([b.title, b.excerpt || '', (b.keywords || []).join(' ')].join(' '))
      if (hay.includes(nq)) {
        hits.push({ type: 'blog', title: b.title, subtitle: 'Blog yazısı', url: `/blog/${b.slug}` })
      }
    }
    // DB blogs
    try {
      const { data } = await supabase
        .from('mm_blogs')
        .select('title, slug, excerpt, keywords, category')
        .eq('status', 'published')
        .limit(200)
      for (const b of (data || []) as any[]) {
        const hay = norm([b.title, b.excerpt || '', (b.keywords || []).join(' ')].join(' '))
        if (hay.includes(nq) && !hits.some((h) => h.url === `/blog/${b.slug}`)) {
          hits.push({ type: 'blog', title: b.title, subtitle: 'Blog yazısı', url: `/blog/${b.slug}` })
        }
      }
    } catch {
      // ignore
    }
  }

  const iconFor = { konu: BookOpen, sinif: GraduationCap, yas: Folder, blog: BookOpen, tema: Folder } as const

  return (
    <>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>Arama</span>
        </nav>

        <h1 className="mm-page-title">Arama</h1>
        <p className="mm-page-sub" style={{ marginBottom: 22 }}>Konular, sınıflar, yaş grupları, temalar ve blog yazıları içinde arayın.</p>

        <form method="get" action="/ara" style={{ position: 'relative', marginBottom: 26 }}>
          <SearchIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="ör: renkler, 2. sınıf, hayvanlar, çocuğa İngilizce…"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px 14px 42px',
              borderRadius: 12,
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              fontSize: 15,
              fontFamily: 'inherit',
              color: 'var(--ink)',
            }}
          />
        </form>

        {query && (
          <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 14 }}>
            "<strong style={{ color: 'var(--ink)' }}>{query}</strong>" için {hits.length} sonuç bulundu.
          </p>
        )}

        {hits.length === 0 ? (
          query ? (
            <div style={{ textAlign: 'center', padding: 50, color: 'var(--ink-3)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sonuç bulunamadı</p>
              <p style={{ fontSize: 14 }}>Farklı bir kelime deneyin. Popüler aramalar:</p>
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {['renkler', 'sayılar', 'hayvanlar', 'aile', 'yiyecek', '2. sınıf', '4-5 yaş'].map((s) => (
                  <Link key={s} href={`/ara?q=${encodeURIComponent(s)}`} className="mm-tag" style={{ textDecoration: 'none' }}>{s}</Link>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 22, color: 'var(--ink-2)', fontSize: 14 }}>
              <p style={{ margin: '0 0 12px' }}>Aramaya bir terim girin. Örnekler:</p>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Konu adı: <strong>renkler</strong>, <strong>aile</strong>, <strong>sayılar</strong></li>
                <li>Sınıf: <strong>3. sınıf</strong></li>
                <li>Yaş: <strong>6-7 yaş</strong></li>
                <li>Soru: <strong>çocuğa İngilizce</strong>, <strong>phonics nedir</strong></li>
              </ul>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {hits.map((h, i) => {
              const Icon = iconFor[h.type]
              const typeLabel = h.type === 'konu' ? 'Konu' : h.type === 'sinif' ? 'Sınıf' : h.type === 'yas' ? 'Yaş' : h.type === 'tema' ? 'Tema' : 'Blog'
              return (
                <Link key={i} href={h.url} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{typeLabel}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{h.title}</div>
                    {h.subtitle && <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{h.subtitle}</div>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
