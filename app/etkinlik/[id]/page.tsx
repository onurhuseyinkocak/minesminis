import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Users, BookOpen } from 'lucide-react'
import { findActivity, activities } from '../../../src/content/activities'
import { findTopic } from '../../../src/content/topics'
import Breadcrumb from '../../../src/components/Breadcrumb'

export async function generateStaticParams() {
  return activities.map((a) => ({ id: a.id }))
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const a = findActivity(id)
  if (!a) return { title: 'Etkinlik bulunamadı', robots: { index: false } }
  return {
    title: `${a.titleTr} (${a.titleEn}) — İlkokul İngilizce Sınıf Etkinliği`,
    description: a.shortDesc,
    keywords: a.seoKeywords,
    alternates: { canonical: `https://minesminis.com/etkinlik/${a.id}` },
    openGraph: {
      type: 'article',
      title: `${a.titleTr} — Sınıf Etkinliği`,
      description: a.shortDesc,
      url: `https://minesminis.com/etkinlik/${a.id}`,
    },
  }
}

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const a = findActivity(id)
  if (!a) notFound()

  const relatedTopics = a.topicIds.map((t) => findTopic(t)).filter(Boolean) as ReturnType<typeof findTopic>[]
  const otherActivities = activities.filter((x) => x.id !== a.id && x.topicIds.some((t) => a.topicIds.includes(t))).slice(0, 4)

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: a.titleTr,
    description: a.shortDesc,
    totalTime: `PT${a.durationMin}M`,
    inLanguage: 'tr',
    image: 'https://minesminis.com/images/minesminis-logo-512.png',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'TRY', value: '0' },
    supply: a.materials.map((m) => ({ '@type': 'HowToSupply', name: m })),
    step: a.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
    audience: { '@type': 'EducationalAudience', educationalRole: 'teacher', audienceType: 'İlkokul İngilizce öğretmenleri ve aileler' },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Etkinlikler', item: 'https://minesminis.com/etkinlikler' },
      { '@type': 'ListItem', position: 3, name: a.titleTr, item: `https://minesminis.com/etkinlik/${a.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article style={{ maxWidth: 800, margin: '0 auto' }}>
        <Breadcrumb
          items={[
            { name: 'Ana Sayfa', url: 'https://minesminis.com/' },
            { name: 'Etkinlikler', url: 'https://minesminis.com/etkinlikler' },
            { name: a.titleTr, url: `https://minesminis.com/etkinlik/${a.id}` },
          ]}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <span className="mm-tag blue">{a.type}</span>
          {a.gradeLevels.map((g) => (
            <Link key={g} href={`/sinif/${g}`} className="mm-tag green" style={{ textDecoration: 'none' }}>{g}. Sınıf</Link>
          ))}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {a.titleTr} <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>· {a.titleEn}</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, margin: '0 0 24px' }}>{a.shortDesc}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '14px 18px', background: 'var(--surface-2)', borderRadius: 12, marginBottom: 28, fontSize: 13.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={15} color="var(--primary)" />
            <strong>{a.durationMin} dakika</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={15} color="var(--primary)" />
            <strong>Sınıf veya grup</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={15} color="var(--primary)" />
            <strong>{a.type}</strong>
          </div>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Gerekli Malzemeler</h2>
          <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>
            {a.materials.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Adımlar</h2>
          <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8, fontSize: 15 }}>
            {a.steps.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{s}</li>
            ))}
          </ol>
        </section>

        {a.variations && (
          <section style={{ marginBottom: 32, padding: 16, background: 'var(--surface-2)', borderRadius: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Varyasyon</h2>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{a.variations}</p>
          </section>
        )}

        {a.teacherNote && (
          <section style={{ marginBottom: 32, padding: 16, background: 'rgba(123,104,238,0.08)', borderLeft: '3px solid var(--primary)', borderRadius: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: 'var(--primary)' }}>Öğretmen Notu</h2>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{a.teacherNote}</p>
          </section>
        )}

        {relatedTopics.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>İlgili Konular</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {relatedTopics.map((t) => (
                <Link key={t!.id} href={`/konu/${t!.id}`} className="mm-tag" style={{ textDecoration: 'none' }}>{t!.titleTr}</Link>
              ))}
            </div>
          </section>
        )}

        {otherActivities.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Benzer Etkinlikler</h2>
            <div className="mm-grid-2">
              {otherActivities.map((o) => (
                <Link key={o.id} href={`/etkinlik/${o.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{o.titleTr}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{o.durationMin} dk · {o.type}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
