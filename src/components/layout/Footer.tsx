import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          &copy; {new Date().getFullYear()}{' '}
          <span className="footer__brand">MinesMinis</span>. All rights reserved.
        </p>

        <ul className="footer__links">
          <li>
            <Link to="/privacy" className="footer__link">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="footer__link">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/contact" className="footer__link">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
