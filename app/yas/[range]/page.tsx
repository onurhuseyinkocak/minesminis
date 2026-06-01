import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen, Clock, Target } from 'lucide-react'
import { topics, topicsByGrade } from '../../../src/content/topics'

type AgeKey = '4-5' | '6-7' | '8-9' | '10-12'

const AGES: Record<AgeKey, {
  titleTr: string
  metaDesc: string
  grades: number[]
  weekly: string
  goal: string
  method: string
  intro: string
  ageMin: number
  ageMax: number
}> = {
  '4-5': {
    titleTr: '4-5 Yaş İngilizce',
    metaDesc: '4-5 yaş çocuklar için İngilizce: oyun-temelli, kısa ve eğlenceli sunumlar, şarkılar. Renkler, sayılar 1-10, hayvanlar.',
    grades: [1],
    weekly: 'Haftada 3 × 15 dakika',
    goal: 'İngilizceyi sevimli bir oyun olarak tanımak.',
    method: 'TPR (Total Physical Response), şarkı + görsel ağırlıklı. Çalışma kâğıdı isteğe bağlı.',
    intro: '4-5 yaş okul öncesi grup için İngilizce, dil-edinimi pencerelerinin en aktif olduğu dönemdir. Bu yaşta amaç dilbilgisi değil, çocuğun İngilizceyle dostça karşılaşmasıdır.',
    ageMin: 4,
    ageMax: 5,
  },
  '6-7': {
    titleTr: '6-7 Yaş İngilizce',
    metaDesc: '6-7 yaş (1-2. sınıf) için İngilizce kaynaklar. Maarif modeli uyumlu sunum, video, şarkı, çalışma kâğıdı.',
    grades: [1, 2],
    weekly: 'Haftada 4 × 20 dakika',
    goal: 'Temel kelime hazinesi + basit kalıp cümleler.',
    method: 'Sunum + şarkı + çalışma kâğıdı dengeli. "I have / I like / I see" kalıpları.',
    intro: '6-7 yaş aralığı 1. ve 2. sınıf çocuklarını kapsar. Okuma-yazmaya yeni başlayan çocuk için İngilizce, okuldaki Türkçe okuryazarlığına paralel bir paralel dil deneyimi olur.',
    ageMin: 6,
    ageMax: 7,
  },
  '8-9': {
    titleTr: '8-9 Yaş İngilizce',
    metaDesc: '8-9 yaş (3. sınıf) için İngilizce: akıcı kalıp + günlük diyalog. Daily routines, hobbies, jobs, transportation.',
    grades: [2, 3],
    weekly: 'Haftada 5 × 25 dakika',
    goal: 'Akıcı kalıp cümleler + günlük diyalog.',
    method: 'Tüm formatlar: sunum + video + şarkı + çalışma kâğıdı. "Can you...?" "Do you like...?" sorular. Phonics tanıtımı.',
    intro: '8-9 yaş çocuk soyut düşünme başlar, bu da dil öğrenimini hızlandırır. Maarif 3. sınıf müfredatı bu yaşta günlük diyalog, hobi ve çevre konularını ön plana çıkarır.',
    ageMin: 8,
    ageMax: 9,
  },
  '10-12': {
    titleTr: '10-12 Yaş İngilizce',
    metaDesc: '10-12 yaş (4. sınıf+) için İngilizce: bağlamsal kelime + okuma + dinleme. Daily routines, jobs, festivals, vacation.',
    grades: [3, 4],
    weekly: 'Haftada 5 × 30-45 dakika',
    goal: 'Bağlamsal kelime hazinesi + okuma + dinleme becerileri.',
    method: 'Sunum + uzun video + okuma metinleri. CEFR A1 sonu / A2 başı seviye.',
    intro: '10-12 yaş çocuk artık dil yapısını farkındalıkla öğrenir. Bu dönem A1 seviyesinin tamamlanıp A2 köprüsünün atılması için kritiktir.',
    ageMin: 10,
    ageMax: 12,
  },
}

export async function generateStaticParams() {
  return Object.keys(AGES).map((range) => ({ range }))
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ range: string }> }): Promise<Metadata> {
  const { range } = await params
  const a = AGES[range as AgeKey]
  if (!a) return { title: 'Yaş aralığı bulunamadı', robots: { index: false } }
  return {
    title: `${a.titleTr} — Ücretsiz Maarif Modeli Kaynaklar`,
    description: a.metaDesc,
    keywords: [`${a.ageMin} yaş ingilizce`, `${a.ageMax} yaş ingilizce`, `${a.ageMin}-${a.ageMax} yaş ingilizce`, 'çocuklara ingilizce', 'maarif modeli ingilizce', 'ücretsiz ingilizce çocuk'],
    alternates: { canonical: `https://minesminis.com/yas/${range}` },
    openGraph: { type: 'website', title: a.titleTr, description: a.metaDesc, url: `https://minesminis.com/yas/${range}` },
  }
}

export default async function AgePage({ params }: { params: Promise<{ range: string }> }) {
  const { range } = await params
  const a = AGES[range as AgeKey]
  if (!a) notFound()

  const topicsForAge = topics.filter((t) => t.gradeLevels.some((g) => a.grades.includes(g)))

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${a.titleTr} — minesminis`,
    description: a.metaDesc,
    provider: { '@type': 'EducationalOrganization', name: 'minesminis', url: 'https://minesminis.com' },
    inLanguage: 'tr',
    educationalLevel: 'A1',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: `Children aged ${a.ageMin}-${a.ageMax}`,
    },
    isAccessibleForFree: true,
    url: `https://minesminis.com/yas/${range}`,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: a.weekly,
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Yaş Grupları', item: 'https://minesminis.com/curriculum' },
      { '@type': 'ListItem', position: 3, name: a.titleTr, item: `https://minesminis.com/yas/${range}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href="/curriculum" style={{ color: 'var(--ink-3)' }}>Yaş Grupları</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink-1)' }}>{a.titleTr}</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, margin: '0 0 8px' }}>
          {a.titleTr}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>{a.intro}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16 }}>
            <Clock size={18} color="var(--primary)" />
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500, marginTop: 8 }}>Önerilen süre</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginTop: 2 }}>{a.weekly}</div>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16 }}>
            <Target size={18} color="var(--primary)" />
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500, marginTop: 8 }}>Hedef</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginTop: 2, lineHeight: 1.3 }}>{a.goal}</div>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16 }}>
            <BookOpen size={18} color="var(--primary)" />
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500, marginTop: 8 }}>Maarif Sınıfları</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginTop: 2 }}>{a.grades.join(', ')}. Sınıf</div>
          </div>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>Yöntem</h2>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.65 }}>{a.method}</p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: '0 0 14px' }}>{a.titleTr} için Önerilen Konular</h2>
          <div className="mm-grid-3">
            {topicsForAge.map((t) => (
              <Link key={t.id} href={`/konu/${t.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{t.titleTr}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>{t.titleEn}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)' }}>
                  <span>{t.vocabulary.length} kelime</span>
                  <span>{t.structures.length} kalıp</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: '0 0 14px' }}>Eşleşen Maarif Sınıfları</h2>
          <div className="mm-grid-4">
            {a.grades.map((g) => (
              <Link key={g} href={`/sinif/${g}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 16, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{g}. Sınıf</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{topicsByGrade(g).length} ünite</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Diğer Yaş Grupları</h2>
          <div className="mm-grid-4">
            {(Object.keys(AGES) as AgeKey[]).filter((k) => k !== range).map((k) => (
              <Link key={k} href={`/yas/${k}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit', padding: 14, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{AGES[k].titleTr}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{AGES[k].grades.join(', ')}. Sınıf</div>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  )
}
