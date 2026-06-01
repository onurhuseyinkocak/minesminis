import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Printer } from 'lucide-react'
import { topics, topicsByGrade } from '../../src/content/topics'

export const metadata: Metadata = {
  title: 'Yazdırılabilir İngilizce Çalışma Kâğıtları',
  description: 'Tüm konular için A4 yazdırılabilir İngilizce çalışma kâğıtları. Kelime tablosu, IPA telaffuz, cümle kalıpları ve diyalog.',
  alternates: { canonical: 'https://minesminis.com/yazdir' },
}

export const revalidate = 86400

export default function PrintIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Yazdırılabilir Çalışma Kâğıtları',
    description: 'Tüm konular için yazdırılabilir İngilizce çalışma kâğıtları.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/yazdir',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topics.length,
      itemListElement: topics.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${t.titleTr} — Yazdırılabilir`,
        url: `https://minesminis.com/yazdir/${t.id}`,
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
          <span style={{ color: 'var(--ink-1)' }}>Yazdırılabilir Kâğıtlar</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          Yazdırılabilir Çalışma Kâğıtları
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>
          Tüm İngilizce konular için A4 yazdırılabilir özet sayfa. Kelime tablosu (IPA telaffuz dahil), cümle kalıpları ve örnek diyalog. Tarayıcının yazdırma fonksiyonu ile direkt yazdırabilirsiniz.
        </p>

        {[1, 2, 3, 4].map((g) => {
          const list = topicsByGrade(g)
          if (list.length === 0) return null
          return (
            <section key={g} style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>{g}. Sınıf Konuları</h2>
              <div className="mm-grid-3">
                {list.map((t) => (
                  <Link key={`${g}-${t.id}`} href={`/yazdir/${t.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
                    <Printer size={18} color="var(--primary)" />
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginTop: 8 }}>{t.titleTr}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{t.vocabulary.length} kelime</div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
