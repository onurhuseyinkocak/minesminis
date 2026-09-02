import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import { topics, findTopic, type Topic } from '../../../src/content/topics'

type ThemeKey = 'gunluk-yasam' | 'doga' | 'beslenme' | 'beceriler' | 'okul' | 'iletisim'

const THEMES: Record<ThemeKey, { titleTr: string; titleEn: string; metaDesc: string; topicIds: string[] }> = {
  'gunluk-yasam': {
    titleTr: 'Günlük Yaşam',
    titleEn: 'Daily Life',
    metaDesc: 'İngilizce günlük yaşam konuları: aile, ev, kıyafetler, günlük rutinler, ulaşım. İlkokul çocukları için kelime, kalıp ve diyaloglar.',
    topicIds: ['family', 'house-rooms', 'clothes', 'daily-routines', 'transportation', 'kitchen-items', 'school-items'],
  },
  'doga': {
    titleTr: 'Doğa',
    titleEn: 'Nature',
    metaDesc: 'İngilizce doğa konuları: hayvanlar, hava durumu, mevsimler, vücut bölümleri. Maarif modeli uyumlu kaynaklar.',
    topicIds: ['animals', 'weather', 'seasons', 'body-parts'],
  },
  'beslenme': {
    titleTr: 'Beslenme',
    titleEn: 'Food and Drinks',
    metaDesc: 'İngilizce yiyecek-içecek konuları: meyveler, sebzeler, ana öğünler. Sağlıklı beslenme bağlamlı kelime ve kalıplar.',
    topicIds: ['food', 'fruits', 'vegetables'],
  },
  'beceriler': {
    titleTr: 'Beceriler ve İlgi Alanları',
    titleEn: 'Skills and Interests',
    metaDesc: 'İngilizce hobi, spor, meslek konuları. "I can" ve "I like" kalıpları, gerund yapı, 3-4. sınıf seviyesi.',
    topicIds: ['hobbies', 'sports', 'jobs'],
  },
  'okul': {
    titleTr: 'Okul ve Sayılar',
    titleEn: 'School and Numbers',
    metaDesc: 'İngilizce okul eşyaları, sayılar (1-10, sıra sayıları), zaman ifadeleri (gün, ay, saat). İlkokul müfredatı uyumlu.',
    topicIds: ['school-items', 'numbers-1-10', 'ordinal-numbers', 'days-of-week', 'months', 'time-telling', 'colors'],
  },
  'iletisim': {
    titleTr: 'İletişim ve Duygu',
    titleEn: 'Communication and Emotions',
    metaDesc: 'İngilizce selamlaşma, duygu ifadeleri, sınıf komutları, bayram-festival konuları. İletişim kalıpları.',
    topicIds: ['greetings', 'feelings', 'classroom', 'festivals', 'vacation', 'toys'],
  },
}

export async function generateStaticParams() {
  return Object.keys(THEMES).map((slug) => ({ slug }))
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const th = THEMES[slug as ThemeKey]
  if (!th) return { title: 'Tema bulunamadı', robots: { index: false } }
  return {
    title: `${th.titleTr} — ${th.titleEn} İngilizce Konuları`,
    description: th.metaDesc,
    alternates: { canonical: `https://minesminis.com/tema/${slug}` },
    openGraph: {
      type: 'website',
      title: `${th.titleTr} İngilizce Konuları — minesminis`,
      description: th.metaDesc,
      url: `https://minesminis.com/tema/${slug}`,
    },
  }
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const th = THEMES[slug as ThemeKey]
  if (!th) notFound()

  const list: Topic[] = th.topicIds.map((id) => findTopic(id)).filter(Boolean) as Topic[]
  const totalWords = list.reduce((s, t) => s + t.vocabulary.length, 0)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${th.titleTr} — ${th.titleEn}`,
    description: th.metaDesc,
    inLanguage: 'tr',
    url: `https://minesminis.com/tema/${slug}`,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((t, i) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Temalar', item: 'https://minesminis.com/konular' },
      { '@type': 'ListItem', position: 3, name: th.titleTr, item: `https://minesminis.com/tema/${slug}` },
    ],
  }

  const otherThemes = (Object.keys(THEMES) as ThemeKey[]).filter((k) => k !== slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href="/konular" style={{ color: 'var(--ink-3)' }}>Konular</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>{th.titleTr}</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {th.titleTr} <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>· {th.titleEn}</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 16, maxWidth: 720 }}>{th.metaDesc}</p>
        <article style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid var(--line)', lineHeight: 1.75, fontSize: 14.5, color: 'var(--ink-2)', marginBottom: 24 }}>
          <p style={{ marginTop: 0 }}><strong>{th.titleTr}</strong> teması, Maarif modeli müfredatta farklı sınıflara dağılmış {list.length} konuyu tek bir öğrenme yolunda toplar. Her konu kartı, o konunun <strong>özgün kaynak sayfasına</strong> (<code>/konu/{'{id}'}</code>) gider — kelime tablosu, IPA, cümle kalıpları, diyalog ve SSS orada tutulur. Bu tema sayfası, o konulara <em>tema temelli</em> bir giriş ve rehber sunar.</p>
          <p><strong>Nasıl çalışılır?</strong> Sıradan başlamak yerine, tema içinde en somut konudan başlayın (örn. Beslenme → Meyveler → Yiyecekler → Sebzeler). Her temada haftada 1 konu, 3 gün tekrar, 1 gün oyun pekiştirmesi önerilir. Yazdırılabilir kâğıtlar (<Link href="/yazdir" style={{ color: 'var(--primary)' }}>/yazdir</Link>) ve sınıf etkinlikleri (<Link href="/etkinlikler" style={{ color: 'var(--primary)' }}>/etkinlikler</Link>) bu temayla eşleşir.</p>
          <p style={{ marginBottom: 0 }}>Toplam <strong>{totalWords} kelime</strong> ve ortalama {Math.round(totalWords/list.length)} kelime/konu — CEFR A1 seviyesinde bir tema seti.</p>
        </article>

        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 16px', fontSize: 14 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--primary)' }}>{list.length}</strong> konu
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 16px', fontSize: 14 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--primary)' }}>{totalWords}</strong> kelime
          </div>
        </div>

        <div className="mm-grid-3" style={{ marginBottom: 36 }}>
          {list.map((t) => (
            <Link key={t.id} href={`/konu/${t.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 18 }}>
              <BookOpen size={20} color="var(--primary)" />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginTop: 8 }}>{t.titleTr}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{t.titleEn}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
                <span>{t.vocabulary.length} kelime</span>
                <span>{t.structures.length} kalıp</span>
              </div>
            </Link>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Diğer Temalar</h2>
        <div className="mm-grid-3">
          {otherThemes.map((k) => (
            <Link key={k} href={`/tema/${k}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{THEMES[k].titleTr}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{THEMES[k].titleEn}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
