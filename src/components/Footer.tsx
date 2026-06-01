import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--line)',
        background: 'var(--surface)',
        padding: '36px 28px 28px',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 28,
            marginBottom: 28,
          }}
        >
          <div>
            <h4 style={headingStyle}>İçerikler</h4>
            <nav style={navStyle}>
              <Link href="/slides" style={linkStyle}>Sunumlar</Link>
              <Link href="/videos" style={linkStyle}>Videolar</Link>
              <Link href="/songs" style={linkStyle}>Şarkılar</Link>
              <Link href="/worksheets" style={linkStyle}>Çalışma Kâğıtları</Link>
              <Link href="/blog" style={linkStyle}>Blog</Link>
              <Link href="/konular" style={linkStyle}>Tüm Konular</Link>
            </nav>
          </div>

          <div>
            <h4 style={headingStyle}>Sınıflar</h4>
            <nav style={navStyle}>
              <Link href="/sinif/1" style={linkStyle}>1. Sınıf</Link>
              <Link href="/sinif/2" style={linkStyle}>2. Sınıf</Link>
              <Link href="/sinif/3" style={linkStyle}>3. Sınıf</Link>
              <Link href="/sinif/4" style={linkStyle}>4. Sınıf</Link>
              <Link href="/curriculum" style={linkStyle}>16 Haftalık Plan</Link>
            </nav>
          </div>

          <div>
            <h4 style={headingStyle}>Yaş Grupları</h4>
            <nav style={navStyle}>
              <Link href="/yas/4-5" style={linkStyle}>4-5 Yaş</Link>
              <Link href="/yas/6-7" style={linkStyle}>6-7 Yaş</Link>
              <Link href="/yas/8-9" style={linkStyle}>8-9 Yaş</Link>
              <Link href="/yas/10-12" style={linkStyle}>10-12 Yaş</Link>
            </nav>
          </div>

          <div>
            <h4 style={headingStyle}>Popüler Konular</h4>
            <nav style={navStyle}>
              <Link href="/konu/greetings" style={linkStyle}>Selamlaşmalar</Link>
              <Link href="/konu/colors" style={linkStyle}>Renkler</Link>
              <Link href="/konu/numbers-1-10" style={linkStyle}>Sayılar 1-10</Link>
              <Link href="/konu/animals" style={linkStyle}>Hayvanlar</Link>
              <Link href="/konu/family" style={linkStyle}>Aile</Link>
              <Link href="/konu/body-parts" style={linkStyle}>Vücut Bölümleri</Link>
            </nav>
          </div>

          <div>
            <h4 style={headingStyle}>Temalar</h4>
            <nav style={navStyle}>
              <Link href="/tema/gunluk-yasam" style={linkStyle}>Günlük Yaşam</Link>
              <Link href="/tema/doga" style={linkStyle}>Doğa</Link>
              <Link href="/tema/beslenme" style={linkStyle}>Beslenme</Link>
              <Link href="/tema/beceriler" style={linkStyle}>Beceriler</Link>
              <Link href="/tema/okul" style={linkStyle}>Okul ve Sayılar</Link>
              <Link href="/tema/iletisim" style={linkStyle}>İletişim</Link>
            </nav>
          </div>

          <div>
            <h4 style={headingStyle}>Bilgi</h4>
            <nav style={navStyle}>
              <Link href="/about" style={linkStyle}>Hakkımızda</Link>
              <Link href="/faq" style={linkStyle}>Sıkça Sorulanlar</Link>
              <Link href="/contact" style={linkStyle}>İletişim</Link>
              <Link href="/privacy" style={linkStyle}>Gizlilik</Link>
              <Link href="/terms" style={linkStyle}>Kullanım Koşulları</Link>
            </nav>
          </div>
        </div>

        <div style={{ marginBottom: 18, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 720 }}>
            <strong style={{ color: 'var(--ink)' }}>minesminis</strong> — Türkiye'nin Maarif Modeli uyumlu, 4-12 yaş çocuklar için ücretsiz İngilizce öğrenme platformu. CEFR A1 seviyesinde sunumlar, videolar, şarkılar, yazdırılabilir çalışma kâğıtları, aile ve öğretmen rehberleri. İletişim: <a href="mailto:info@minesminis.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>info@minesminis.com</a>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--line)',
          }}
        >
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500 }}>
            © 2026 minesminis. Tüm hakları saklıdır.
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
            Türkiye'deki çocuklara ücretsiz İngilizce için sevgiyle yapıldı.
          </div>
        </div>
      </div>
    </footer>
  )
}

const headingStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 13,
  color: 'var(--ink)',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
  fontWeight: 700,
}

const navStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 7,
}

const linkStyle = {
  fontSize: 13.5,
  color: 'var(--ink-3)',
  textDecoration: 'none',
  fontWeight: 500,
} as const
