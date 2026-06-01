import { ImageResponse } from 'next/og'
import { findTopic } from '../../../src/content/topics'

export const runtime = 'edge'
export const alt = 'minesminis — İngilizce konu sayfası'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG({ params }: { params: { topic: string } }) {
  const t = findTopic(params.topic)
  const title = t ? t.titleTr : 'minesminis'
  const subtitle = t ? t.titleEn : 'Çocuklara Ücretsiz İngilizce'
  const grade = t ? `${t.gradeLevels.join(', ')}. Sınıf` : ''
  const wordCount = t ? t.vocabulary.length : 0

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
          {grade && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 999, fontSize: 22, fontWeight: 700 }}>
                {grade}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 999, fontSize: 22, fontWeight: 700 }}>
                İlkokul İngilizce
              </div>
            </div>
          )}

          <div style={{ color: '#fff', fontSize: 92, fontWeight: 800, lineHeight: 1, letterSpacing: -2, marginBottom: 12, display: 'flex' }}>
            {title}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 44, fontWeight: 600, display: 'flex' }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {wordCount > 0 && <span>{wordCount} kelime</span>}
            <span>Maarif modeli uyumlu</span>
            <span>Ücretsiz</span>
          </div>
          <div>CEFR A1</div>
        </div>
      </div>
    ),
    size,
  )
}
