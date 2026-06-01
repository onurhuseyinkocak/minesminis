import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import { activities } from '../../src/content/activities'

export const metadata: Metadata = {
  title: 'İngilizce Sınıf Etkinlikleri — Maarif Modeli Uygun',
  description: '20+ pratik İngilizce sınıf etkinliği: TPR, oyun, şarkı, rol-play, çizim, drama. Her etkinlik için adım adım anlatım.',
  alternates: { canonical: 'https://minesminis.com/etkinlikler' },
  openGraph: {
    type: 'website',
    title: 'İngilizce Sınıf Etkinlikleri',
    description: 'İlkokul İngilizce öğretmeni ve aileler için pratik etkinlik kütüphanesi.',
    url: 'https://minesminis.com/etkinlikler',
  },
}

export const revalidate = 86400

export default function ActivitiesIndexPage() {
  const byType: Record<string, typeof activities> = {}
  for (const a of activities) {
    if (!byType[a.type]) byType[a.type] = []
    byType[a.type].push(a)
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'İngilizce Sınıf Etkinlikleri',
    description: 'İlkokul İngilizce dersleri için pratik etkinlik kütüphanesi.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/etkinlikler',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: activities.length,
      itemListElement: activities.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.titleTr,
        url: `https://minesminis.com/etkinlik/${a.id}`,
      })),
    },
  }

  const typeLabels: Record<string, string> = {
    TPR: 'TPR (Hareketle Öğrenme)',
    Game: 'Oyun',
    Song: 'Şarkı',
    Craft: 'El Sanatı',
    RolePlay: 'Rol Oynama',
    Worksheet: 'Çalışma Kâğıdı',
    Drawing: 'Çizim',
    Listening: 'Dinleme',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>Etkinlikler</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          İngilizce Sınıf Etkinlikleri
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>
          İlkokul İngilizce öğretmenleri ve aileler için 20+ pratik etkinlik. Her birinde adım adım anlatım, malzeme listesi, varyasyon ve öğretmen notu.
        </p>

        {Object.entries(byType).map(([type, list]) => (
          <section key={type} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>{typeLabels[type] || type}</h2>
            <div className="mm-grid-3">
              {list.map((a) => (
                <Link key={a.id} href={`/etkinlik/${a.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
                  <BookOpen size={18} color="var(--primary)" />
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginTop: 8 }}>{a.titleTr}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{a.shortDesc.slice(0, 80)}{a.shortDesc.length > 80 ? '…' : ''}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 12, color: 'var(--ink-3)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {a.durationMin} dk</span>
                    <span>·</span>
                    <span>{a.gradeLevels.join(', ')}. Sınıf</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
