import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import { topics, topicsByGrade } from '../../../src/content/topics'

const VALID = [1, 2, 3, 4] as const

export async function generateStaticParams() {
  return VALID.map((g) => ({ grade: String(g) }))
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const { grade } = await params
  const g = parseInt(grade, 10)
  if (!VALID.includes(g as 1 | 2 | 3 | 4)) return { title: 'Sınıf bulunamadı', robots: { index: false } }
  const t = topicsByGrade(g)
  const wordCount = t.reduce((sum, x) => sum + x.vocabulary.length, 0)
  return {
    title: `${g}. Sınıf İngilizce — Maarif Modeli Konuları, Kelimeler ve Etkinlikler`,
    description: `${g}. sınıf İngilizce müfredatı: ${t.length} ünite, ${wordCount}+ kelime. Maarif modeli uyumlu, ücretsiz sunum, video, şarkı ve çalışma kâğıtları.`,
    alternates: { canonical: `https://minesminis.com/sinif/${g}` },
    openGraph: {
      type: 'website',
      title: `${g}. Sınıf İngilizce — Maarif Modeli Rehberi`,
      description: `${g}. sınıf İngilizce konularını öğren: ${t.map((x) => x.titleTr).slice(0, 5).join(', ')} ve daha fazlası.`,
      url: `https://minesminis.com/sinif/${g}`,
    },
  }
}

export default async function GradePage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params
  const g = parseInt(grade, 10)
  if (!VALID.includes(g as 1 | 2 | 3 | 4)) notFound()
  const t = topicsByGrade(g)
  const wordCount = t.reduce((sum, x) => sum + x.vocabulary.length, 0)
  const structureCount = t.reduce((sum, x) => sum + x.structures.length, 0)

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${g}. Sınıf İngilizce — Maarif Modeli Müfredatı`,
    description: `${g}. sınıf ilkokul öğrencileri için ${t.length} ünitelik tam İngilizce müfredatı. ${wordCount} kelime, ${structureCount} cümle kalıbı.`,
    provider: { '@type': 'EducationalOrganization', name: 'minesminis', url: 'https://minesminis.com' },
    inLanguage: 'tr',
    educationalLevel: `Primary School Grade ${g}`,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    isAccessibleForFree: true,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT1H',
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Sınıflar', item: 'https://minesminis.com/curriculum' },
      { '@type': 'ListItem', position: 3, name: `${g}. Sınıf`, item: `https://minesminis.com/sinif/${g}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href="/curriculum" style={{ color: 'var(--ink-3)' }}>Müfredat</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>{g}. Sınıf</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {g}. Sınıf İngilizce
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 700 }}>
          Maarif modeli {g}. sınıf İngilizce müfredatı ile birebir uyumlu konular. Her ünite kelime, cümle kalıbı, örnek diyalog ve sıkça sorulan sorularla birlikte.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>{t.length}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>Ünite</div>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>{wordCount}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>Kelime</div>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>{structureCount}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>Cümle Kalıbı</div>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>A1</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>CEFR Seviye</div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: '0 0 14px' }}>Üniteler</h2>
        <div className="mm-grid-3" style={{ marginBottom: 36 }}>
          {t.map((x) => (
            <Link key={x.id} href={`/konu/${x.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 18 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'rgba(123,104,238,0.1)', padding: '3px 8px', borderRadius: 6, marginBottom: 8 }}>
                <BookOpen size={11} /> {x.maarifUnit}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{x.titleTr}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 10 }}>{x.titleEn}</div>
              <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-3)' }}>
                <span>{x.vocabulary.length} kelime</span>
                <span>{x.structures.length} kalıp</span>
                <span>{x.faq.length} SSS</span>
              </div>
            </Link>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Diğer Sınıflar</h2>
        <div className="mm-grid-4" style={{ marginBottom: 30 }}>
          {VALID.filter((v) => v !== g).map((v) => (
            <Link key={v} href={`/sinif/${v}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{v}. Sınıf</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{topicsByGrade(v).length} ünite</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
