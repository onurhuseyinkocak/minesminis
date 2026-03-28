import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

/* ------------------------------------------------------------------ */
/*  PawIcon — inline SVG, no import needed                              */
/* ------------------------------------------------------------------ */
const PawIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" className={className}>
    <ellipse cx="50" cy="66" rx="23" ry="19" />
    <ellipse cx="27" cy="43" rx="9" ry="12" transform="rotate(-20 27 43)" />
    <ellipse cx="43" cy="33" rx="9" ry="12" />
    <ellipse cx="59" cy="33" rx="9" ry="12" />
    <ellipse cx="75" cy="43" rx="9" ry="12" transform="rotate(20 75 43)" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Static data                                                         */
/* ------------------------------------------------------------------ */
const SOCIAL_LINKS = [
  { href: 'https://twitter.com/minesminis',    label: 'Twitter',   icon: Twitter   },
  { href: 'https://instagram.com/minesminis',  label: 'Instagram', icon: Instagram },
  { href: 'https://youtube.com/@minesminis',   label: 'YouTube',   icon: Youtube   },
  { href: 'mailto:info@minesminis.com',        label: 'Email',     icon: Mail      },
] as const;

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */
interface FooterProps {
  /** full  — 4-column layout for public/marketing pages              */
  /** minimal — single-row copyright + 3 legal links for app shell   */
  variant?: 'full' | 'minimal';
}

/* ================================================================== */
/*  Footer                                                              */
/* ================================================================== */
export default function Footer({ variant = 'full' }: FooterProps) {
  const { lang } = useLanguage();
  const tl = (tr: string, en: string) => (lang === 'tr' ? tr : en);
  const year = new Date().getFullYear();

  /* ---- MINIMAL variant ------------------------------------------- */
  if (variant === 'minimal') {
    return (
      <footer className="footer footer--minimal" role="contentinfo">
        <div className="footer-minimal__inner">
          <p className="footer-minimal__copy">
            &copy; {year}{' '}
            <span className="footer-minimal__brand">MinesMinis</span>
            {' — '}
            {tl('Tüm hakları saklıdır.', 'All rights reserved.')}
          </p>
          <nav className="footer-minimal__links" aria-label={tl('Yasal bağlantılar', 'Legal links')}>
            <Link to="/privacy" className="footer-minimal__link">
              {tl('Gizlilik', 'Privacy')}
            </Link>
            <Link to="/terms" className="footer-minimal__link">
              {tl('Şartlar', 'Terms')}
            </Link>
            <Link to="/cookies" className="footer-minimal__link">
              {tl('Çerezler', 'Cookies')}
            </Link>
          </nav>
        </div>
      </footer>
    );
  }

  /* ---- FULL variant ---------------------------------------------- */
  return (
    <footer className="footer footer--full" role="contentinfo">
      <div className="footer__inner">

        {/* ── Column 1: Brand ──────────────────────────────────────── */}
        <div className="footer__col footer__col--brand">
          <Link to="/" className="footer__logo" aria-label="MinesMinis ana sayfa">
            <span className="footer__logo-icon">
              <PawIcon size={18} />
            </span>
            <span className="footer__logo-text">MinesMinis</span>
          </Link>

          <p className="footer__tagline">
            {tl(
              'Türkçe konuşan çocuklar için bilim temelli fonetik İngilizce öğrenme platformu.',
              'Science-based phonics English learning for Turkish-speaking children.',
            )}
          </p>

          {/* Badges */}
          <div className="footer__badges">
            <span className="footer__badge footer__badge--beta">
              {tl('Beta Aşaması', 'Beta Phase')}
            </span>
            <span className="footer__badge footer__badge--coppa">
              COPPA / KVKK
            </span>
          </div>

          {/* Social icons */}
          <div className="footer__social" role="list" aria-label={tl('Sosyal medya bağlantıları', 'Social media links')}>
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="footer__social-btn"
                aria-label={label}
                role="listitem"
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Icon size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Column 2: Ürün ───────────────────────────────────────── */}
        <div className="footer__col">
          <h3 className="footer__col-title">{tl('Ürün', 'Product')}</h3>
          <ul className="footer__link-list" role="list">
            <li><Link to="/#features"       className="footer__link">{tl('Özellikler', 'Features')}</Link></li>
            <li><Link to="/#compare"        className="footer__link">{tl('Karşılaştır', 'Compare')}</Link></li>
            <li><Link to="/pricing"         className="footer__link">{tl('Fiyatlandırma', 'Pricing')}</Link></li>
            <li><Link to="/blog"            className="footer__link">Blog</Link></li>
          </ul>
        </div>

        {/* ── Column 3: Öğren ──────────────────────────────────────── */}
        <div className="footer__col">
          <h3 className="footer__col-title">{tl('Öğren', 'Learn')}</h3>
          <ul className="footer__link-list" role="list">
            <li><Link to="/games"    className="footer__link">{tl('Oyunlar', 'Games')}</Link></li>
            <li><Link to="/stories"  className="footer__link">{tl('Hikayeler', 'Stories')}</Link></li>
            <li><Link to="/words"    className="footer__link">{tl('Kelimeler', 'Words')}</Link></li>
            <li><Link to="/worlds"   className="footer__link">{tl('Videolar', 'Videos')}</Link></li>
          </ul>
        </div>

        {/* ── Column 4: Yasal ──────────────────────────────────────── */}
        <div className="footer__col">
          <h3 className="footer__col-title">{tl('Yasal', 'Legal')}</h3>
          <ul className="footer__link-list" role="list">
            <li><Link to="/privacy"  className="footer__link">{tl('Gizlilik Politikası', 'Privacy Policy')}</Link></li>
            <li><Link to="/terms"    className="footer__link">{tl('Kullanım Şartları', 'Terms of Service')}</Link></li>
            <li><Link to="/cookies"  className="footer__link">{tl('Çerez Politikası', 'Cookie Policy')}</Link></li>
            <li>
              <a href="mailto:info@minesminis.com" className="footer__link">
                {tl('İletişim', 'Contact')}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Copyright bar ──────────────────────────────────────────── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copy">
            &copy; {year}{' '}
            <span className="footer__copy-brand">MinesMinis</span>.{' '}
            {tl('Tüm hakları saklıdır.', 'All rights reserved.')}
          </p>
          <div className="footer__bottom-badges">
            <span className="footer__badge footer__badge--coppa">COPPA {tl('Uyumlu', 'Compliant')}</span>
            <span className="footer__badge footer__badge--kvkk">KVKK {tl('Uyumlu', 'Compliant')}</span>
            <span className="footer__badge footer__badge--beta">Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
