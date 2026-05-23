import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, BookOpen, Presentation, Video, Music, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 — Sayfa Bulunamadı',
  robots: { index: false, follow: true },
}

const quickLinks = [
  { icon: Presentation, label: 'Sunumlar', to: '/slides' },
  { icon: Video, label: 'Videolar', to: '/videos' },
  { icon: Music, label: 'Şarkılar', to: '/songs' },
  { icon: FileText, label: 'Çalışma kâğıtları', to: '/worksheets' },
  { icon: BookOpen, label: 'Blog', to: '/blog' },
  { icon: Search, label: 'Müfredat', to: '/curriculum' },
]

export default function NotFound() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', minHeight: '50vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #F3F0FF 0%, #FFE4DC 100%)', borderRadius: 28, padding: '48px 28px', textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 96, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: 8 }}>404</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink)', margin: '0 0 8px' }}>Bu sayfayı bulamadık</h1>
        <p style={{ fontSize: 14.5, color: 'var(--ink-2)', maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.6 }}>
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. Sorun değil — aşağıdaki bölümlerden eğitim içeriklerimize ulaşabilirsiniz.
        </p>
        <Link href="/" className="mm-btn primary" style={{ textDecoration: 'none' }}>
          <Home size={16} /> Anasayfa
        </Link>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)', marginBottom: 12 }}>Hızlı erişim</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 28 }}>
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'white', border: '1px solid var(--line)', color: 'var(--ink)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <link.icon size={18} />
            </div>
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 18, padding: 22, border: '1px solid var(--line)', lineHeight: 1.7, fontSize: 14.5, color: 'var(--ink-2)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 8px', color: 'var(--ink)' }}>Yine de bir hata gibi mi geliyor?</h3>
        <p style={{ margin: 0 }}>
          Bir bağlantıdan geldiyseniz ve sayfanın gerçekten var olması gerekiyorsa, lütfen <Link href="/contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>iletişim</Link> sayfasından hangi URL'i ziyaret ettiğinizi bize yazın. 1-3 iş günü içinde dönüş yaparız.
        </p>
      </div>
    </div>
  )
}
