import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import { findTopic, topics, topicsByGrade } from '../../../../../src/content/topics'
import SpeakWord from '../../../../../src/components/SpeakWord'

const VALID = [1, 2, 3, 4] as const

export async function generateStaticParams() {
  const out: { grade: string; topic: string }[] = []
  for (const g of VALID) {
    for (const t of topicsByGrade(g)) {
      out.push({ grade: String(g), topic: t.id })
    }
  }
  return out
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ grade: string; topic: string }> }): Promise<Metadata> {
  const { grade, topic: slug } = await params
  const g = parseInt(grade, 10)
  const t = findTopic(slug)
  if (!VALID.includes(g as 1 | 2 | 3 | 4) || !t || !t.gradeLevels.includes(g)) {
    return { title: 'Bulunamadı', robots: { index: false } }
  }
  // ADSENSE FIX: doorway duplicate — canonical tek kaynak /konu/*, bu sayfa noindex
  return {
    title: `${g}. Sınıf ${t.titleTr} (${t.titleEn}) — Maarif İngilizce Konu Anlatımı`,
    description: `${g}. sınıf ilkokul İngilizce ${t.titleTr.toLowerCase()} konusu. ${t.vocabulary.length} kelime, ${t.structures.length} cümle kalıbı, örnek diyalog ve SSS. Maarif modeli uyumlu, ücretsiz.`,
    keywords: [`${g}. sınıf ingilizce ${t.titleTr.toLowerCase()}`, `${g} sınıf ${t.titleEn.toLowerCase()}`, `${t.titleTr.toLowerCase()} ingilizce ilkokul`, `maarif ${t.titleEn.toLowerCase()}`, ...t.seoKeywords],
    alternates: { canonical: `https://minesminis.com/konu/${t.id}` },
    robots: { index: false, follow: true },
    openGraph: {
      type: 'article',
      title: `${g}. Sınıf ${t.titleTr}`,
      description: `${g}. sınıf ${t.titleTr} İngilizce konu anlatımı, kelime ve cümle kalıpları.`,
      url: `https://minesminis.com/konu/${t.id}`,
    },
  }
}

export default async function GradeTopicPage({ params }: { params: Promise<{ grade: string; topic: string }> }) {
  const { grade, topic: slug } = await params
  const g = parseInt(grade, 10)
  const t = findTopic(slug)
  if (!VALID.includes(g as 1 | 2 | 3 | 4) || !t || !t.gradeLevels.includes(g)) notFound()

  const related = topics.filter((x) => x.id !== t.id && x.gradeLevels.includes(g)).slice(0, 4)

  const learningSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${g}. Sınıf ${t.titleTr} (${t.titleEn})`,
    description: `${g}. sınıf ilkokul İngilizce ${t.titleTr} konusu. Maarif modeli uyumlu.`,
    inLanguage: 'tr',
    learningResourceType: 'Lesson',
    educationalLevel: `Primary School Grade ${g}`,
    educationalUse: 'Instruction',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    teaches: t.titleEn,
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    url: `https://minesminis.com/sinif/${g}/konu/${t.id}`,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: `${g}. Sınıf`, item: `https://minesminis.com/sinif/${g}` },
      { '@type': 'ListItem', position: 3, name: t.titleTr, item: `https://minesminis.com/sinif/${g}/konu/${t.id}` },
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article style={{ maxWidth: 860, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href={`/sinif/${g}`} style={{ color: 'var(--ink-3)' }}>{g}. Sınıf</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>{t.titleTr}</span>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <span className="mm-tag blue">{g}. Sınıf</span>
          <span className="mm-tag green">{t.maarifUnit}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {g}. Sınıf {t.titleTr} <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>· {t.titleEn}</span>
        </h1>

        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, margin: '0 0 28px' }}>{t.introTr}</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{g}. Sınıf {t.titleTr} Kelimeleri</h2>
          <div style={{ overflow: 'auto', border: '1px solid var(--line)', borderRadius: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>İngilizce</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Türkçe</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Okunuş</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Örnek</th>
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
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>Örnek Diyalog</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 10, fontStyle: 'italic' }}>{t.dialogue.context}</div>
          <div style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--primary)', borderRadius: 8, padding: '16px 18px' }}>
            {t.dialogue.lines.map((line, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>{line.speaker}</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{line.en}</div>
                <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>{line.tr}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>SSS — {g}. Sınıf {t.titleTr}</h2>
          {t.faq.map((f, i) => (
            <details key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>{f.q}</summary>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>{f.a}</p>
            </details>
          ))}
        </section>

        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 20, marginBottom: 24, fontSize: 14 }}>
          Bu konunun genel anlatımı için <Link href={`/konu/${t.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.titleTr} ana sayfası</Link>'na, {g}. sınıfın tüm konuları için <Link href={`/sinif/${g}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{g}. Sınıf İngilizce</Link> sayfasına göz atabilirsiniz.
        </div>

        {related.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{g}. Sınıfın Diğer Konuları</h2>
            <div className="mm-grid-4">
              {related.map((r) => (
                <Link key={r.id} href={`/sinif/${g}/konu/${r.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
                  <BookOpen size={20} color="var(--primary)" />
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 8 }}>{r.titleTr}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.titleEn}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
