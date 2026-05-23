import type { Metadata } from 'next'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Cover from '../../src/components/Cover'
import { supabase } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Çalışma Kâğıtları — Yazdırılabilir İngilizce Worksheets',
  description:
    'Çocuklara İngilizce öğretmek için yazdırılabilir, ücretsiz çalışma kâğıtları. Boyama, eşleştirme, boşluk doldurma — sınıf ve evde kullanım için.',
  alternates: { canonical: 'https://minesminis.com/worksheets' },
}

export const revalidate = 600

export default async function WorksheetsPage() {
  let worksheets: any[] = []
  try {
    const { data } = await supabase.from('mm_worksheets').select('*').eq('published', true).order('created_at', { ascending: false })
    worksheets = data || []
  } catch {
    // ignore
  }

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Çalışma Kâğıtları</h1>
          <p className="mm-page-sub">
            {worksheets.length > 0 ? `${worksheets.length} çalışma kâğıdı — yazdırılabilir PDF` : 'Yazdırılabilir İngilizce çalışma kâğıtları — yakında daha fazlası'}
          </p>
        </div>
      </div>

      {worksheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Çalışma kâğıtları yakında</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
            Yazdırılabilir İngilizce çalışma kâğıtları hazırlanıyor.
          </p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {worksheets.map((w: any) => (
            <Link key={w.id} href={`/worksheets/${w.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                <Cover kind={w.cover_kind} />
                <div className="mm-card-cta"><Play size={18} /></div>
              </div>
              <div className="mm-card-body">
                <h2 className="mm-card-title">{w.title}</h2>
                <div className="mm-card-meta">
                  {w.page_count && <span className="mm-tag green">{w.page_count} sayfa</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
