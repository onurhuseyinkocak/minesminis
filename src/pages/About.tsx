import { useState, useEffect } from 'react'
import { Presentation, Video, Music, BookOpen, Users, Heart } from 'lucide-react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

const values = [
  { icon: BookOpen, title: 'Free Education', desc: 'All content is completely free. No registration required — start learning right away.' },
  { icon: Users, title: 'Made for Kids', desc: 'Designed for children ages 4-12 with age-appropriate, safe content.' },
  { icon: Heart, title: 'Learn by Having Fun', desc: 'Learning English has never been this fun with slides, videos and songs.' },
]

export default function About() {
  const [counts, setCounts] = useState({ slides: 0, videos: 0, songs: 0 })

  useEffect(() => { document.title = 'About - minesminis' }, [])

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
    { icon: Presentation, label: 'Slide decks', value: counts.slides },
    { icon: Video, label: 'Educational videos', value: counts.videos },
    { icon: Music, label: 'English songs', value: counts.songs },
  ]

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">About</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>minesminis - English Learning Platform for Kids</p>

        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>Our Mission</h2>
          <p>
            minesminis is an educational platform designed to make learning English fun and effective for elementary school children.
            Our goal is to ensure every child has access to quality language learning opportunities.
          </p>
          <p>
            Our platform features content prepared by teachers and education specialists.
            It offers vocabulary and concept learning through interactive slides, visual learning with educational videos,
            and listening and repetition skills development through English songs.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>Why minesminis?</h2>
          <p>
            Research shows that the most effective way for children to learn is through play and fun.
            minesminis builds on this principle with colorful visuals, engaging animations and memorable songs
            to turn learning into an adventure.
          </p>
          <p>
            All content is prepared in accordance with the Common European Framework of Reference (CEFR) A1 level.
            Our growing content library covers essential topics like colors, numbers, animals, family, body parts,
            weather and daily routines.
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
