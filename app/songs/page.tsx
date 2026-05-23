import type { Metadata } from 'next'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Cover from '@/src/components/Cover'
import { supabase } from '@/src/lib/supabase'

export const metadata: Metadata = {
  title: 'Şarkılar — Çocuklar İçin İngilizce Şarkılar',
  description:
    'Çocuklara İngilizce öğretmek için seçilmiş, eğlenceli ve eğitici ücretsiz şarkılar. Head Shoulders Knees, Twinkle Star, Old MacDonald ve daha fazlası.',
  alternates: { canonical: 'https://minesminis.com/songs' },
}

export const revalidate = 600

export default async function SongsPage() {
  let songs: any[] = []
  try {
    const { data } = await supabase.from('mm_songs').select('*').eq('published', true).order('created_at', { ascending: false })
    songs = data || []
  } catch {
    // ignore
  }

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Şarkılar</h1>
          <p className="mm-page-sub">
            {songs.length > 0 ? `${songs.length} şarkı — birlikte söyleyin` : 'Çocuklara özel İngilizce şarkılar — yakında daha fazlası'}
          </p>
        </div>
      </div>

      {songs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Şarkılar yakında eklenecek</p>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
            Eğitsel İngilizce şarkıları seçimi devam ediyor.
          </p>
        </div>
      ) : (
        <div className="mm-grid-3">
          {songs.map((s: any) => (
            <Link key={s.id} href={`/songs/${s.id}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mm-card-cover">
                <Cover kind={s.cover_kind} />
                <div className="mm-card-cta"><Play size={18} /></div>
              </div>
              <div className="mm-card-body">
                <h2 className="mm-card-title">{s.title}</h2>
                <div className="mm-card-meta">
                  {s.duration && <span className="mm-tag lilac">{s.duration}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
