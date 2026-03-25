import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          &copy; {new Date().getFullYear()}{' '}
          <span className="footer__brand">MinesMinis</span>. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </p>

        <ul className="footer__links">
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
            <a href="mailto:info@minesminis.com" className="footer__link">
              {lang === 'tr' ? 'İletişim' : 'Contact'}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
