import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import { findTopic, topics } from '../../../src/content/topics'
import SpeakWord from '../../../src/components/SpeakWord'
import RelatedBlogs from '../../../src/components/RelatedBlogs'
import { activitiesForTopic } from '../../../src/content/activities'

export async function generateStaticParams() {
  return topics.map((t) => ({ topic: t.id }))
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params
  const t = findTopic(slug)
  if (!t) return { title: 'Konu bulunamadı', robots: { index: false } }
  return {
    title: `${t.titleTr} (${t.titleEn}) — İlkokul İngilizce Konu Anlatımı`,
    description: t.metaDescription,
    keywords: t.seoKeywords,
    alternates: { canonical: `https://minesminis.com/konu/${t.id}` },
    openGraph: {
      type: 'article',
      title: `${t.titleTr} (${t.titleEn})`,
      description: t.metaDescription,
      url: `https://minesminis.com/konu/${t.id}`,
      images: ['/images/minesminis-logo-512.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.titleTr} — ${t.titleEn}`,
      description: t.metaDescription,
      images: ['/images/minesminis-logo-512.png'],
    },
  }
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params
  const t = findTopic(slug)
  if (!t) notFound()

  const related = topics.filter((x) => x.id !== t.id && x.gradeLevels.some((g) => t.gradeLevels.includes(g))).slice(0, 4)
  const topicActivities = activitiesForTopic(t.id)

  const learningSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${t.titleTr} (${t.titleEn})`,
    description: t.metaDescription,
    inLanguage: 'tr',
    learningResourceType: 'Lesson',
    educationalLevel: `Primary School (Grade ${t.gradeLevels.join(', ')})`,
    educationalUse: 'Instruction',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    teaches: t.titleEn,
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'minesminis', url: 'https://minesminis.com' },
    url: `https://minesminis.com/konu/${t.id}`,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Konular', item: 'https://minesminis.com/blog' },
      { '@type': 'ListItem', position: 3, name: t.titleTr, item: `https://minesminis.com/konu/${t.id}` },
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
          <span>Konular</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>{t.titleTr}</span>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {t.gradeLevels.map((g) => (
            <Link key={g} href={`/sinif/${g}`} className="mm-tag blue" style={{ textDecoration: 'none' }}>
              {g}. Sınıf
            </Link>
          ))}
          <span className="mm-tag green">{t.maarifUnit}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {t.titleTr} <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>· {t.titleEn}</span>
        </h1>

        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, margin: '0 0 28px' }}>{t.introTr}</p>

        <section style={{ background: 'linear-gradient(135deg, #F3F0FF 0%, #E8EDFF 100%)', borderRadius: 12, padding: '16px 18px', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>Bu Konu Sonunda Çocuk Şunları Yapabilir</h2>
          <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.75, fontSize: 14.5, color: 'var(--ink-2)' }}>
            <li>"{t.titleTr}" temasında en az {t.vocabulary.length} kelimeyi tanır ve telaffuz eder.</li>
            <li>{t.structures.length} farklı cümle kalıbını kullanarak basit cümle kurar.</li>
            <li>Konuyla ilgili 4-6 satırlık diyaloğu anlar ve canlandırır.</li>
            <li>Sınıf veya ev ortamında "{t.titleTr}" konusunu pratik etkinliklerle pekiştirir.</li>
            <li>Maarif modeli "{t.maarifUnit}" hedeflerine uyum sağlar.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>Kelimeler</h2>
          <div style={{ overflow: 'auto', border: '1px solid var(--line)', borderRadius: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>İngilizce</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Türkçe</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Okunuş (IPA)</th>
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
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{t.titleTr} İçin Sınıf-içi ve Ev Etkinlikleri</h2>
          <div className="mm-grid-3">
            {[
              { title: 'TPR Hareket Oyunu', desc: `Öğretmen "${t.vocabulary[0]?.en || 'word'}" der, çocuklar bedenle gösterir. Her yeni kelimede bir hareket. Beden + kelime = hızlı pekişme.`, icon: '🎯' },
              { title: 'Eşleştirme Kartları', desc: `${t.titleTr} kelimelerini görsel + İngilizce + Türkçe üçlü olarak kartlara basın. Çocuk doğru eşleştirmeyi bulur.`, icon: '🃏' },
              { title: 'Çizim Etkinliği', desc: `Çocuk ${t.titleTr.toLowerCase()} ile ilgili bir resim çizer, İngilizce kelimeleri yanlarına yazar. Görsel + el motor pratiği.`, icon: '🎨' },
              { title: 'Şarkı + Tekrar', desc: `Konuyla ilgili 1-2 dakikalık ezgili şarkı çalın. Ritim çocuğun hafızasına yazılır. "${t.vocabulary[1]?.en || 'word'}" gibi kelimeler doğal pekişir.`, icon: '🎵' },
              { title: 'Diyalog Rol-Play', desc: 'Yukarıdaki örnek diyaloğu iki öğrenci sınıf önünde canlandırır. Bağlam + ses ile dil canlanır.', icon: '🎭' },
              { title: 'Çalışma Kâğıdı', desc: `${t.titleTr} konusu için sınıf veya evde yapılabilecek yazdırılabilir aktivite — minesminis.com/worksheets sayfasından indirebilirsiniz.`, icon: '📄' },
            ].map((a, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{a.title}</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{a.desc}</div>
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

        <section style={{ background: 'var(--surface-2)', borderRadius: 16, padding: 22, marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>{t.titleTr} için ücretsiz materyaller</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 14px' }}>Bu konuyu pekiştirmek için sunumlar, videolar, şarkılar ve çalışma kâğıtlarımıza göz at.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            <Link href="/slides" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Sunumlar</Link>
            <Link href="/videos" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Videolar</Link>
            <Link href="/songs" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Şarkılar</Link>
            <Link href="/worksheets" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Çalışma Kâğıtları</Link>
            <Link href={`/yazdir/${t.id}`} className="mm-btn" style={{ justifyContent: 'center', fontSize: 13, background: 'var(--primary)', color: '#fff' }}>📄 Yazdırılabilir</Link>
          </div>
        </section>

        {topicActivities.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{t.titleTr} İçin Hazır Etkinlikler</h2>
            <div className="mm-grid-2">
              {topicActivities.map((a) => (
                <Link key={a.id} href={`/etkinlik/${a.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="mm-tag blue" style={{ fontSize: 11 }}>{a.type}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.durationMin} dk</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{a.titleTr}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.4 }}>{a.shortDesc.slice(0, 100)}{a.shortDesc.length > 100 ? '…' : ''}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedBlogs topicKeywords={t.seoKeywords} topicLabel={t.titleTr} />

        {related.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>İlgili Konular</h2>
            <div className="mm-grid-4">
              {related.map((r) => (
                <Link key={r.id} href={`/konu/${r.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
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
