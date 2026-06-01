import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findTopic, topics } from '../../../src/content/topics'

export async function generateStaticParams() {
  return topics.map((t) => ({ topic: t.id }))
}

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params
  const t = findTopic(slug)
  if (!t) return { title: 'Bulunamadı', robots: { index: false } }
  return {
    title: `${t.titleTr} — Yazdırılabilir Çalışma Kâğıdı`,
    description: `${t.titleTr} İngilizce kelimeleri, IPA telaffuz ve örnek cümleler — A4 boyutunda yazdırılabilir.`,
    alternates: { canonical: `https://minesminis.com/yazdir/${t.id}` },
    robots: { index: true, follow: true },
  }
}

export default async function PrintTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params
  const t = findTopic(slug)
  if (!t) notFound()

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: 24, fontFamily: 'Georgia, serif', color: '#111' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 1.5cm; }
          body { background: white !important; }
          .mm-nav, .mm-bottom-nav, footer, .mm-skip-link, .mm-page-header { display: none !important; }
          .mm-page { padding: 0 !important; }
          .mm-shell { display: block !important; padding: 0 !important; }
          .mm-main { padding: 0 !important; }
          a { color: inherit; text-decoration: none; }
        }
      ` }} />

      <header style={{ borderBottom: '2px solid #333', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{t.titleTr}</h1>
            <p style={{ margin: '4px 0 0', fontSize: 16, color: '#444' }}>{t.titleEn}</p>
          </div>
          <div style={{ fontSize: 12, color: '#666', textAlign: 'right' }}>
            <div>minesminis.com</div>
            <div>{t.maarifUnit}</div>
            <div>{t.gradeLevels.join(', ')}. Sınıf · CEFR A1</div>
          </div>
        </div>
      </header>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>Kelimeler ({t.vocabulary.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #ccc' }}>İngilizce</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #ccc' }}>Türkçe</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #ccc' }}>Telaffuz</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #ccc' }}>Örnek</th>
            </tr>
          </thead>
          <tbody>
            {t.vocabulary.map((v, i) => (
              <tr key={i}>
                <td style={{ padding: '6px 8px', border: '1px solid #ccc', fontWeight: 600 }}>{v.en}</td>
                <td style={{ padding: '6px 8px', border: '1px solid #ccc' }}>{v.tr}</td>
                <td style={{ padding: '6px 8px', border: '1px solid #ccc', fontFamily: 'monospace' }}>/{v.ipa}/</td>
                <td style={{ padding: '6px 8px', border: '1px solid #ccc' }}>{v.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>Cümle Kalıpları</h2>
        {t.structures.map((s, i) => (
          <div key={i} style={{ marginBottom: 10, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#555' }}>{s.pattern}</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.example}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{s.tr}</div>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>Diyalog: {t.dialogue.context}</h2>
        {t.dialogue.lines.map((line, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{line.speaker}:</strong> {line.en}
            <div style={{ fontSize: 13, color: '#666', marginLeft: 14 }}>{line.tr}</div>
          </div>
        ))}
      </section>

      <footer style={{ borderTop: '1px solid #ccc', marginTop: 30, paddingTop: 12, fontSize: 11, color: '#666', textAlign: 'center' }}>
        <strong>minesminis.com</strong> — Çocuklar için ücretsiz İngilizce öğrenme platformu · İletişim: info@minesminis.com
      </footer>
    </div>
  )
}
