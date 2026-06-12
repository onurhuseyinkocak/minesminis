import type { Metadata } from 'next'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Cover from '../../src/components/Cover'
import CategoryLearningGuide from '../../src/components/CategoryLearningGuide'
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

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Yazdırılabilir İngilizce Çalışma Kâğıtları',
    description: 'İlkokul İngilizce sınıfı ve evde kullanım için ücretsiz yazdırılabilir PDF çalışma kâğıtları.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/worksheets',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.mm-page-sub'],
    },
    publisher: { '@type': 'EducationalOrganization', name: 'minesminis', url: 'https://minesminis.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: worksheets.length,
      itemListElement: worksheets.slice(0, 50).map((w: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: w.title,
        url: `https://minesminis.com/worksheets/${w.id}`,
      })),
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Çalışma Kâğıtları', item: 'https://minesminis.com/worksheets' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Çalışma Kâğıtları</h1>
          <p className="mm-page-sub">
            {worksheets.length > 0 ? `${worksheets.length} çalışma kâğıdı — yazdırılabilir PDF` : 'Yazdırılabilir İngilizce çalışma kâğıdı rehberi'}
          </p>
        </div>
      </div>

      {worksheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Çalışma kâğıtları kısa pratik için tasarlanır</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
            Materyaller boyama, eşleştirme ve basit yazma etkinlikleriyle ekrandan bağımsız tekrar sağlar.
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

      <CategoryLearningGuide kind="worksheets" itemCount={worksheets.length} />
    </>
  )
}
