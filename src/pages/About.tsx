import { useState, useEffect } from 'react'
import { Presentation, Video, Music, BookOpen, Users, Heart } from 'lucide-react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

const values = [
  { icon: BookOpen, title: 'Ucretsiz Egitim', desc: 'Tum icerikler tamamen ucretsiz. Kayit gerektirmez, hemen ogrenmeye baslayin.' },
  { icon: Users, title: 'Cocuklara Ozel', desc: '4-12 yas arasi cocuklar icin tasarlanmis, yas grubuna uygun, guvenli icerikler.' },
  { icon: Heart, title: 'Eglenerek Ogren', desc: 'Slaytlar, videolar ve sarkilarla Ingilizce ogrenmek hic bu kadar eglenceli olmamisti.' },
]

export default function About() {
  const [counts, setCounts] = useState({ slides: 0, videos: 0, songs: 0 })

  useEffect(() => { document.title = 'Hakkimizda - minesminis' }, [])

  useEffect(() => {
    Promise.all([
      supabase.from('mm_slides').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_videos').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_songs').select('id', { count: 'exact', head: true }).eq('published', true),
    ]).then(([s, v, so]) => {
      setCounts({ slides: s.count || 0, videos: v.count || 0, songs: so.count || 0 })
    })
  }, [])

  const stats = [
    { icon: Presentation, label: 'Slayt sunusu', value: counts.slides },
    { icon: Video, label: 'Egitici video', value: counts.videos },
    { icon: Music, label: 'Ingilizce sarki', value: counts.songs },
  ]

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Hakkimizda</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>minesminis - Cocuklar icin Ingilizce Ogrenme Platformu</p>

        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>Misyonumuz</h2>
          <p>
            minesminis, Turkiye'deki ilkokul cagindaki cocuklarin Ingilizce ogrenme surecini eglenceli ve etkili hale getirmek amaciyla
            kurulmus bir egitim platformudur. Amacimiz, her cocugun yabanci dil ogrenme firsatina erisebilmesini saglamaktir.
          </p>
          <p>
            Platformumuz, ogretmenler ve egitim uzmanlari tarafindan hazirlanan iceriklerle donatilmistir.
            Interaktif slaytlar ile kelime ve kavram ogrenimi, egitici videolarla gorsel ogrenme ve
            Ingilizce sarkilarla dinleme ve tekrar becerilerini gelistirme imkani sunar.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>Neden minesminis?</h2>
          <p>
            Arastirmalar, cocuklarin en etkili ogrenme yonteminin oyun ve eglence yoluyla oldugunu gostermektedir.
            minesminis, bu prensibi temel alarak rengarenk gorseller, dikkat cekici animasyonlar ve akilda kalici sarkilarla
            ogrenmeyi bir maceraya donusturur.
          </p>
          <p>
            Her icerik, Avrupa Dil Portfolyosu (CEFR) A1 seviyesine uygun olarak hazirlanmistir.
            Renkler, sayilar, hayvanlar, aile, vucut, hava durumu ve gunluk rutinler gibi temel konulari
            kapsayan zengin icerik kutuphanemiz surekli buyumektedir.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 18, padding: 20, border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <s.icon size={28} style={{ color: 'var(--primary)', marginBottom: 8 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--ink)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {values.map(v => (
            <div key={v.title} style={{
              background: 'white', borderRadius: 18, padding: 20, border: '1px solid var(--line)',
              display: 'flex', gap: 16, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0,
              }}>
                <v.icon size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>{v.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
