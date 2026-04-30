import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      background: 'var(--surface)',
      padding: '24px 28px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>
          2026 minesminis. Tum haklari saklidir.
        </div>
        <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }} aria-label="Footer navigation">
          <Link to="/about" style={{ fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', fontWeight: 600 }}>Hakkimizda</Link>
          <Link to="/contact" style={{ fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', fontWeight: 600 }}>Iletisim</Link>
          <Link to="/privacy" style={{ fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', fontWeight: 600 }}>Gizlilik</Link>
          <Link to="/terms" style={{ fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', fontWeight: 600 }}>Kullanim Kosullari</Link>
        </nav>
      </div>
    </footer>
  )
}
