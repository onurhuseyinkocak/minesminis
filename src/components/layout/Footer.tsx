import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Star, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import './Footer.css';

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/minesminis', label: 'Twitter', icon: Twitter },
  { href: 'https://instagram.com/minesminis', label: 'Instagram', icon: Instagram },
  { href: 'https://youtube.com/@minesminis', label: 'YouTube', icon: Youtube },
  { href: 'mailto:info@minesminis.com', label: 'Email', icon: Mail },
];

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand column */}
        <div className="footer__brand-col">
          <div className="footer__logo">
            <div className="footer__logo-icon" aria-hidden="true">
              <Star size={18} fill="var(--warning)" color="var(--warning)" />
            </div>
            <span className="footer__logo-text">
              <span>Mines</span><span>Minis</span>
            </span>
          </div>
          <p className="footer__tagline">
            {lang === 'tr' ? 'Çocuklar için İngilizce öğrenme' : 'English learning for kids'}
          </p>
          {/* Social icons */}
          <div className="footer__social" role="list" aria-label="Social media links">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="footer__social-icon"
                aria-label={label}
                role="listitem"
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Links: Legal section */}
        <div className="footer__section">
          <h3 className="footer__section-title">
            {lang === 'tr' ? 'Yasal' : 'Legal'}
          </h3>
          <ul className="footer__links" role="list">
            <li>
              <Link to="/privacy" className="footer__link">
                {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="footer__link">
                {lang === 'tr' ? 'Kullanım Koşulları' : 'Terms of Service'}
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="footer__link">
                {lang === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Links: Product section */}
        <div className="footer__section">
          <h3 className="footer__section-title">
            {lang === 'tr' ? 'Ürün' : 'Product'}
          </h3>
          <ul className="footer__links" role="list">
            <li>
              <Link to="/pricing" className="footer__link">
                {lang === 'tr' ? 'Fiyatlandırma' : 'Pricing'}
              </Link>
            </li>
            <li>
              <Link to="/blog" className="footer__link">
                Blog
              </Link>
            </li>
            <li>
              <a href="mailto:info@minesminis.com" className="footer__link">
                {lang === 'tr' ? 'İletişim' : 'Contact'}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright bar */}
      <div className="footer__bottom">
        <p className="footer__copy">
          &copy; {new Date().getFullYear()}{' '}
          <span className="footer__copy-brand">MinesMinis</span>.{' '}
          {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}
