import { useEffect } from 'react'
import { Mail, Globe, MessageCircle } from 'lucide-react'
import Layout from '../components/Layout'

export default function Contact() {
  useEffect(() => { document.title = 'Contact - minesminis' }, [])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Contact</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>Get in touch with us for questions and suggestions</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: 'white', borderRadius: 18, padding: 24, border: '1px solid var(--line)',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: '#E8EDFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0,
            }}>
              <Mail size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>Email</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                For general inquiries, content suggestions and collaboration, feel free to email us.
              </p>
              <a href="mailto:info@minesminis.com" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
                color: 'var(--accent)', fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}>
                info@minesminis.com
              </a>
            </div>
          </div>

          <div style={{
            background: 'white', borderRadius: 18, padding: 24, border: '1px solid var(--line)',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: '#E5F6EC',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', flexShrink: 0,
            }}>
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>Feedback</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Your feedback about our platform is very valuable to us.
                We want to provide a better experience for teachers, parents and students.
                Share any topics you think are missing or features you would like to see.
              </p>
            </div>
          </div>

          <div style={{
            background: 'white', borderRadius: 18, padding: 24, border: '1px solid var(--line)',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: '#FFE4DC',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0,
            }}>
              <Globe size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>Our Website</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                minesminis is a platform offering free English learning materials for elementary school students.
                Start exploring and learn through slides, videos and songs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
