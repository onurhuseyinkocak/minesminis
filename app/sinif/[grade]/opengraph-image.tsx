import { ImageResponse } from 'next/og'
import { topicsByGrade } from '../../../src/content/topics'

export const runtime = 'edge'
export const alt = 'minesminis — Sınıf İngilizce sayfası'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG({ params }: { params: { grade: string } }) {
  const g = parseInt(params.grade, 10)
  const valid = g >= 1 && g <= 4
  const list = valid ? topicsByGrade(g) : []

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #7B68EE 0%, #9B87F5 50%, #B8A9FF 100%)',
          padding: 80,
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.85)', fontSize: 28, fontWeight: 600 }}>
          <div style={{ width: 14, height: 14, background: '#fff', borderRadius: 4 }} />
          minesminis.com
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#fff', fontSize: 108, fontWeight: 800, lineHeight: 1, letterSpacing: -3, marginBottom: 14, display: 'flex' }}>
            {valid ? `${g}. Sınıf İngilizce` : 'minesminis'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 38, fontWeight: 600, display: 'flex', marginBottom: 22 }}>
            Maarif Modeli Uyumlu Müfredat Rehberi
          </div>

          {list.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {list.slice(0, 6).map((t) => (
                <div key={t.id} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', padding: '8px 16px', borderRadius: 999, fontSize: 22, fontWeight: 600 }}>
                  {t.titleTr}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 600 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <span>{list.length} ünite</span>
            <span>{list.reduce((s, t) => s + t.vocabulary.length, 0)} kelime</span>
            <span>CEFR A1</span>
          </div>
          <div>Ücretsiz</div>
        </div>
      </div>
    ),
    size,
  )
}
