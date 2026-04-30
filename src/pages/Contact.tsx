import { useEffect } from 'react'
import { Mail, Globe, MessageCircle } from 'lucide-react'
import Layout from '../components/Layout'

export default function Contact() {
  useEffect(() => { document.title = 'Iletisim - minesminis' }, [])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Iletisim</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>Sorulariniz ve onerileriniz icin bize ulasin</p>

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
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>E-posta</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Genel sorular, icerik onerileri ve is birligi icin bize e-posta gonderebilirsiniz.
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
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>Geri Bildirim</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Platformumuz hakkinda geri bildirimleriniz bizim icin cok degerlidir.
                Ogretmenler, veliler ve ogrenciler icin daha iyi bir deneyim sunmak istiyoruz.
                Eksik gordugumuz konulari veya eklemek istediginiz ozellikleri bizimle paylasin.
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
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 4px', color: 'var(--ink)' }}>Web Sitemiz</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                minesminis, Turkiye'deki ilkokul ogrencileri icin ucretsiz Ingilizce egitim materyalleri sunan bir platformdur.
                Slaytlar, videolar ve sarkilarla eglenerek ogrenmek icin hemen kesfetmeye baslayin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
