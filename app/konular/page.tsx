import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, BookOpen } from 'lucide-react'
import { topics, topicsByGrade } from '../../src/content/topics'

export const metadata: Metadata = {
  title: 'Tüm İngilizce Konuları — Maarif Modeli Uyumlu İlkokul',
  description: '30 İngilizce konu: selamlaşma, aile, renkler, sayılar, hayvanlar, yiyecekler ve daha fazlası. Her konu için kelime, kalıp, diyalog ve SSS.',
  alternates: { canonical: 'https://minesminis.com/konular' },
  openGraph: {
    type: 'website',
    title: 'Tüm İngilizce Konuları — minesminis',
    description: '30 İngilizce konu sayfası, Maarif modeli uyumlu, CEFR A1 seviyesinde.',
    url: 'https://minesminis.com/konular',
  },
}

export const revalidate = 86400

export default function TopicsIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tüm İngilizce Konuları',
    description: '30 İngilizce konu — Maarif modeli uyumlu ilkokul müfredatı.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/konular',
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topics.length,
      itemListElement: topics.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.titleTr,
        url: `https://minesminis.com/konu/${t.id}`,
      })),
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Konular', item: 'https://minesminis.com/konular' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>Konular</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          Tüm İngilizce Konuları
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 20, maxWidth: 720 }}>
          Maarif modeli uyumlu {topics.length} İngilizce konu. Her konu için kelime tablosu, IPA telaffuz, cümle kalıpları, örnek diyalog ve sıkça sorulan sorular.
        </p>
        <article style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid var(--line)', lineHeight: 1.75, fontSize: 14.5, color: 'var(--ink-2)', marginBottom: 28 }}>
          <p style={{ marginTop: 0 }}><strong>Bu sayfa nasıl kullanılır?</strong> Aşağıda {topics.length} konuyu sınıf seviyesine göre grupladık. Her kart bir konunun ana sayfasına (<code>/konu/renkler</code> gibi) gider — o sayfada o konunun tüm kelimeleri, telaffuzları, örnek cümleleri ve sınıf etkinliği fikirlerini bulursunuz. <em>Sınıf-konusu</em> filtreli sayfalar (örn. <code>/sinif/3/konu/renkler</code>) aynı içeriğin sınıfa göre etiketlenmiş görünümüdür ve arama motorları için canonical kaynağa yönlendirilmiştir; tek özgün kaynak <code>/konu/*</code> sayfalarıdır.</p>
          <p>Öğretmenler için öneri: önce kendi sınıfınızın kartlarına bakın (ör. 2. sınıf → 10-12 konu). Çocuğun eksik kaldığı temayı seçin, önce <strong>Kelime Tablosu</strong> ile 8-10 kelime tanıtın, sonra <strong>Cümle Kalıpları</strong> ile 2 kalıp pratiği, en son <strong>Sınıf Etkinliği</strong> ile pekişme. Her tema 15-25 dakikada tamamlanacak şekilde tasarlandı.</p>
          <p style={{ marginBottom: 0 }}>Aileler için öneri: evde tek seferde bir tema seçin (“Bu hafta renkler”). Her gün aynı kelime tablosunu 5 dakika tekrar edin; 3. günde çocuk görseli görünce kelimeyi söylemeye başlar. Telaffuz için her kelimenin yanındaki hoparlör ikonuna tıklayın — İngiliz ana dili telaffuzu duyulacaktır.</p>
        </article>

        {[1, 2, 3, 4].map((g) => {
          const list = topicsByGrade(g)
          if (list.length === 0) return null
          return (
            <section key={g} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: 0 }}>{g}. Sınıf Konuları</h2>
                <Link href={`/sinif/${g}`} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>{g}. Sınıf sayfası →</Link>
              </div>
              <div className="mm-grid-3">
                {list.map((t) => (
                  <Link key={`${g}-${t.id}`} href={`/konu/${t.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
                    <BookOpen size={18} color="var(--primary)" />
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginTop: 8 }}>{t.titleTr}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{t.titleEn}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
                      <span>{t.vocabulary.length} kelime</span>
                      <span>{t.structures.length} kalıp</span>
                    </div>
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
