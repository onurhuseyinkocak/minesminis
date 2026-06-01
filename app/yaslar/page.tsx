import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Yaş Bazlı İngilizce — 4-5, 6-7, 8-9, 10-12 Yaş',
  description: 'Yaş bazlı ücretsiz İngilizce öğretim yol haritası. 4-5 (anaokulu), 6-7 (1-2. sınıf), 8-9 (3. sınıf), 10-12 (4. sınıf) yaş grupları için Maarif modeli uyumlu rehberler.',
  alternates: { canonical: 'https://minesminis.com/yaslar' },
}

export const revalidate = 86400

const AGES = [
  { slug: '4-5', titleTr: '4-5 Yaş', subtitle: 'Anaokulu', weekly: 'Haftada 3 × 15 dk', desc: 'İngilizceyi sevimli bir oyun olarak tanıma. Renkler, sayılar, hayvanlar.' },
  { slug: '6-7', titleTr: '6-7 Yaş', subtitle: '1-2. Sınıf', weekly: 'Haftada 4 × 20 dk', desc: 'Temel kelime hazinesi + basit cümle kalıpları. "I have / I like" kalıbı.' },
  { slug: '8-9', titleTr: '8-9 Yaş', subtitle: '3. Sınıf', weekly: 'Haftada 5 × 25 dk', desc: 'Akıcı kalıp cümleler + günlük diyalog. "Can you / Do you like".' },
  { slug: '10-12', titleTr: '10-12 Yaş', subtitle: '4. Sınıf+', weekly: 'Haftada 5 × 30-45 dk', desc: 'Bağlamsal kelime + okuma + dinleme. CEFR A1 sonu / A2 başı.' },
]

export default function AgesIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Yaş Bazlı İngilizce Yol Haritaları',
    description: '4-12 yaş arası çocuklara İngilizce öğretim yol haritaları.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/yaslar',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: AGES.length,
      itemListElement: AGES.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.titleTr,
        url: `https://minesminis.com/yas/${a.slug}`,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>Yaş Grupları</span>
        </nav>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          Yaş Grupları
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>
          Çocuğunuzun yaşına uygun, Maarif modeli ile uyumlu ücretsiz İngilizce yol haritası. Her yaş grubu için önerilen konular, haftalık süre ve yöntem.
        </p>
        <div className="mm-grid-2">
          {AGES.map((a) => (
            <Link key={a.slug} href={`/yas/${a.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 22 }}>
              <Heart size={20} color="var(--primary)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginTop: 10 }}>{a.titleTr}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>{a.subtitle} · {a.weekly}</div>
              <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
