import type { Metadata } from 'next'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Cover from '../../src/components/Cover'
import CategoryLearningGuide from '../../src/components/CategoryLearningGuide'
import { supabase } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Videolar — Çocuklar İçin İngilizce Eğitim Videoları',
  description:
    'Çocuklara İngilizce öğretmek için seçilmiş, YouTube restricted mode ile sunulan ücretsiz eğitim videoları. Renkler, hayvanlar, günlük rutinler ve daha fazlası.',
  alternates: { canonical: 'https://minesminis.com/videos' },
}

export const revalidate = 600

export default async function VideosPage() {
  let videos: any[] = []
  try {
    const { data } = await supabase.from('mm_videos').select('*').eq('published', true).order('created_at', { ascending: false })
    videos = data || []
  } catch {
    // ignore
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Çocuklar İçin İngilizce Eğitim Videoları',
    description: 'Maarif modeli uyumlu, çocuk-güvenli İngilizce eğitim videoları kütüphanesi.',
    inLanguage: 'tr',
    url: 'https://minesminis.com/videos',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.mm-page-sub'],
    },
    publisher: { '@type': 'EducationalOrganization', name: 'minesminis', url: 'https://minesminis.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: videos.length,
      itemListElement: videos.slice(0, 50).map((v: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: v.title,
        url: `https://minesminis.com/videos/${v.id}`,
      })),
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Videolar', item: 'https://minesminis.com/videos' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Videolar</h1>
          <p className="mm-page-sub">
            {videos.length > 0 ? `${videos.length} video — restricted mode ile güvenli` : 'Çocuklara özel İngilizce video seçme ve izleme rehberi'}
          </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Videolar manuel inceleme ile yayınlanır</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
            Her video çocuklara uygunluk, telaffuz kalitesi ve öğrenme hedefi açısından kontrol edilir.
          </p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {videos.map((v: any) => (
            <Link key={v.id} href={`/videos/${v.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                {v.thumbnail_url ? (
                  <img src={v.thumbnail_url} alt={v.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Cover kind={v.cover_kind} />
                )}
                <div className="mm-card-cta"><Play size={18} /></div>
              </div>
              <div className="mm-card-body">
                <h2 className="mm-card-title">{v.title}</h2>
                <div className="mm-card-meta">
                  {v.duration && <span className="mm-tag blue">{v.duration}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CategoryLearningGuide kind="videos" itemCount={videos.length} />
    </>
  )
}
