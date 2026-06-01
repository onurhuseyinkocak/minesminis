import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Folder } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tema Bazlı İngilizce Konuları — minesminis',
  description: 'İngilizce konuları tema bazlı keşfedin: günlük yaşam, doğa, beslenme, beceriler, okul ve iletişim. Her tema için ilgili konular gruplanmış.',
  alternates: { canonical: 'https://minesminis.com/temalar' },
}

export const revalidate = 86400

const THEMES = [
  { slug: 'gunluk-yasam', titleTr: 'Günlük Yaşam', titleEn: 'Daily Life', count: 7, desc: 'Aile, ev, kıyafetler, rutinler, ulaşım, mutfak, okul eşyaları.' },
  { slug: 'doga', titleTr: 'Doğa', titleEn: 'Nature', count: 4, desc: 'Hayvanlar, hava durumu, mevsimler, vücut bölümleri.' },
  { slug: 'beslenme', titleTr: 'Beslenme', titleEn: 'Food and Drinks', count: 3, desc: 'Yiyecekler, meyveler, sebzeler.' },
  { slug: 'beceriler', titleTr: 'Beceriler', titleEn: 'Skills', count: 3, desc: 'Hobiler, sporlar, meslekler.' },
  { slug: 'okul', titleTr: 'Okul ve Sayılar', titleEn: 'School and Numbers', count: 7, desc: 'Okul eşyaları, sayılar, sıra sayıları, gün/ay, saat, renkler.' },
  { slug: 'iletisim', titleTr: 'İletişim', titleEn: 'Communication', count: 6, desc: 'Selamlaşma, duygular, sınıf komutları, bayramlar, tatil, oyuncaklar.' },
]

export default function ThemesIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tema Bazlı İngilizce Konuları',
    description: 'İngilizce konularını tema bazlı keşfetme indeksi.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/temalar',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: THEMES.length,
      itemListElement: THEMES.map((th, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: th.titleTr,
        url: `https://minesminis.com/tema/${th.slug}`,
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
          <span style={{ color: 'var(--ink-1)' }}>Temalar</span>
        </nav>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          Temalar
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>
          İngilizce konularını tema bazlı keşfedin. Her tema ilgili konuları gruplar ve birlikte öğrenmenin avantajını sunar.
        </p>
        <div className="mm-grid-3">
          {THEMES.map((th) => (
            <Link key={th.slug} href={`/tema/${th.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 18 }}>
              <Folder size={20} color="var(--primary)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginTop: 8 }}>{th.titleTr}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{th.titleEn} · {th.count} konu</div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.5 }}>{th.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
