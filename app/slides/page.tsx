import type { Metadata } from 'next'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Cover from '../../src/components/Cover'
import { supabase } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Sunumlar — Çocuklar İçin İngilizce Sunum Setleri',
  description:
    'Çocuklara İngilizce öğretmek için ücretsiz sunum setleri. Renkler, sayılar, hayvanlar, aile, vücut bölümleri ve daha fazlası — Maarif modeli uyumlu, CEFR A1 hizalı.',
  alternates: { canonical: 'https://minesminis.com/slides' },
}

export const revalidate = 600

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kcbblalwwfjevneegmcv.supabase.co'
const getThumbnailUrl = (id: string) => `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/slides/thumbnails/${id}.png`

export default async function SlidesPage() {
  let slides: any[] = []
  try {
    const { data } = await supabase.from('mm_slides').select('*').eq('published', true).order('created_at', { ascending: false })
    slides = data || []
  } catch {
    // ignore
  }

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Sunumlar</h1>
          <p className="mm-page-sub">
            {slides.length > 0 ? `${slides.length} sunum — ilkokul seviyesi` : 'Ücretsiz İngilizce sunum setleri — yakında daha fazlası'}
          </p>
        </div>
      </div>

      {slides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Sunumlar yakında eklenecek</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
            Şu sırada çocuklara özel sunum setleri hazırlanıyor. Bu arada diğer kaynaklarımıza göz atabilirsiniz.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <Link href="/curriculum" className="mm-btn primary" style={{ textDecoration: 'none' }}>Müfredat</Link>
            <Link href="/blog" className="mm-btn" style={{ textDecoration: 'none' }}>Blog Yazıları</Link>
          </div>
        </div>
      ) : (
        <div className="mm-grid-3">
          {slides.map((s: any) => (
            <Link key={s.id} href={`/slides/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                <img
                  src={getThumbnailUrl(s.id)}
                  alt={s.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="mm-card-cta"><Play size={18} /></div>
              </div>
              <div className="mm-card-body">
                <h2 className="mm-card-title">{s.title}</h2>
                <div className="mm-card-meta">
                  {s.level && <span className={`mm-tag ${s.level === 'Easy' ? 'green' : 'yellow'}`}>{s.level}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {slides.length === 0 && <Cover kind="school" />}
    </>
  )
}
