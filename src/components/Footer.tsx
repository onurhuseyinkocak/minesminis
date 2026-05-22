import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      background: 'var(--surface)',
      padding: '32px 28px 28px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1080,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 24,
          marginBottom: 28,
        }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>İçerikler</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/slides" style={linkStyle}>Sunumlar</Link>
              <Link to="/videos" style={linkStyle}>Videolar</Link>
              <Link to="/songs" style={linkStyle}>Şarkılar</Link>
              <Link to="/worksheets" style={linkStyle}>Çalışma Kâğıtları</Link>
              <Link to="/blog" style={linkStyle}>Blog</Link>
            </nav>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Bilgi</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/about" style={linkStyle}>Hakkımızda</Link>
              <Link to="/curriculum" style={linkStyle}>Müfredat</Link>
              <Link to="/faq" style={linkStyle}>Sıkça Sorulan Sorular</Link>
              <Link to="/contact" style={linkStyle}>İletişim</Link>
            </nav>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Yasal</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/privacy" style={linkStyle}>Gizlilik Politikası</Link>
              <Link to="/terms" style={linkStyle}>Kullanım Koşulları</Link>
            </nav>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>İletişim</h4>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--ink-3)' }}>
              <a href="mailto:info@minesminis.com" style={linkStyle}>info@minesminis.com</a>
            </p>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              4-12 yaş çocuklar için ücretsiz İngilizce öğrenme platformu. Türkiye Maarif Modeli uyumlu.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          paddingTop: 18, borderTop: '1px solid var(--line)',
        }}>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500 }}>
            © 2026 minesminis. Tüm hakları saklıdır.
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
            Made with ❤️ for Turkish kids learning English
          </div>
        </div>
      </div>
    </footer>
  )
}

const linkStyle = {
  fontSize: 13.5,
  color: 'var(--ink-3)',
  textDecoration: 'none',
  fontWeight: 500,
} as const
