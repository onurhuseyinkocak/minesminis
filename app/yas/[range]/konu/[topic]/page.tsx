import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import { findTopic, topics } from '../../../../../src/content/topics'
import SpeakWord from '../../../../../src/components/SpeakWord'
import Breadcrumb from '../../../../../src/components/Breadcrumb'

type AgeKey = '4-5' | '6-7' | '8-9' | '10-12'

const AGES: Record<AgeKey, { titleTr: string; grades: number[] }> = {
  '4-5': { titleTr: '4-5 Yaş', grades: [1] },
  '6-7': { titleTr: '6-7 Yaş', grades: [1, 2] },
  '8-9': { titleTr: '8-9 Yaş', grades: [2, 3] },
  '10-12': { titleTr: '10-12 Yaş', grades: [3, 4] },
}

export async function generateStaticParams() {
  const out: { range: string; topic: string }[] = []
  for (const range of Object.keys(AGES) as AgeKey[]) {
    const grades = AGES[range].grades
    for (const t of topics) {
      if (t.gradeLevels.some((g) => grades.includes(g))) {
        out.push({ range, topic: t.id })
      }
    }
  }
  return out
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ range: string; topic: string }> }): Promise<Metadata> {
  const { range, topic: slug } = await params
  const a = AGES[range as AgeKey]
  const t = findTopic(slug)
  if (!a || !t || !t.gradeLevels.some((g) => a.grades.includes(g))) {
    return { title: 'Bulunamadı', robots: { index: false } }
  }
  return {
    title: `${a.titleTr} ${t.titleTr} (${t.titleEn}) — İlkokul İngilizce`,
    description: `${a.titleTr} çocuklar için ${t.titleTr} konusu. ${t.vocabulary.length} kelime, IPA telaffuz, cümle kalıbı, örnek diyalog ve SSS. Maarif modeli uyumlu, ücretsiz.`,
    keywords: [`${range} yaş ingilizce ${t.titleTr.toLowerCase()}`, `${range} yaş ${t.titleEn.toLowerCase()}`, `çocuklara ${t.titleTr.toLowerCase()} ingilizce`, ...t.seoKeywords],
    alternates: { canonical: `https://minesminis.com/yas/${range}/konu/${t.id}` },
    openGraph: {
      type: 'article',
      title: `${a.titleTr} ${t.titleTr}`,
      description: `${a.titleTr} grubuna özel ${t.titleTr} İngilizce konu anlatımı.`,
      url: `https://minesminis.com/yas/${range}/konu/${t.id}`,
    },
  }
}

export default async function AgeTopicPage({ params }: { params: Promise<{ range: string; topic: string }> }) {
  const { range, topic: slug } = await params
  const a = AGES[range as AgeKey]
  const t = findTopic(slug)
  if (!a || !t || !t.gradeLevels.some((g) => a.grades.includes(g))) notFound()

  const learningSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${a.titleTr} ${t.titleTr} (${t.titleEn})`,
    description: `${a.titleTr} ilkokul öğrencisi için ${t.titleTr} İngilizce.`,
    inLanguage: 'tr',
    learningResourceType: 'Lesson',
    educationalLevel: `Primary School ${a.titleTr}`,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: `Children ${range} years old` },
    teaches: t.titleEn,
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    url: `https://minesminis.com/yas/${range}/konu/${t.id}`,
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article style={{ maxWidth: 860, margin: '0 auto' }}>
        <Breadcrumb
          items={[
            { name: 'Ana Sayfa', url: 'https://minesminis.com/' },
            { name: a.titleTr, url: `https://minesminis.com/yas/${range}` },
            { name: t.titleTr, url: `https://minesminis.com/yas/${range}/konu/${t.id}` },
          ]}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <span className="mm-tag blue">{a.titleTr}</span>
          <span className="mm-tag green">{t.maarifUnit}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {a.titleTr} {t.titleTr} <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>· {t.titleEn}</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, margin: '0 0 28px' }}>{t.introTr}</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{a.titleTr} İçin {t.titleTr} Kelimeleri</h2>
          <div style={{ overflow: 'auto', border: '1px solid var(--line)', borderRadius: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>İngilizce</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Türkçe</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Okunuş</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Örnek</th>
                </tr>
              </thead>
              <tbody>
                {t.vocabulary.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <SpeakWord word={v.en} />
                        {v.en}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>{v.tr}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--ink-3)' }}>/{v.ipa}/</td>
                    <td style={{ padding: '10px 12px', color: 'var(--ink-2)' }}>{v.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>Cümle Kalıpları</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {t.structures.map((s, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, border: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>{s.pattern}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.example}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{s.tr}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>Sıkça Sorulanlar</h2>
          {t.faq.map((f, i) => (
            <details key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>{f.q}</summary>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>{f.a}</p>
            </details>
          ))}
        </section>

        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 20, fontSize: 14 }}>
          <strong>Genel anlatım:</strong> <Link href={`/konu/${t.id}`} style={{ color: 'var(--primary)' }}>{t.titleTr} ana sayfası</Link> · <strong>Tüm {a.titleTr} konuları:</strong> <Link href={`/yas/${range}`} style={{ color: 'var(--primary)' }}>{a.titleTr} sayfası</Link>
        </div>
      </article>
    </>
  )
}
