import { Link } from 'react-router-dom';
import { Gamepad2, BookOpen, Video, FileText, Mail, Instagram, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Wave separator */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,20 C360,60 720,0 1080,30 C1260,45 1380,20 1440,20 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-inner">
          {/* Top row: Logo + Nav + Social */}
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <img src="/images/mine-logo.jpg" alt="" className="footer-logo-img" />
                <span className="footer-logo-text">Mine's <span>Minis</span></span>
              </Link>
              <p className="footer-tagline">
                Made with <Heart size={14} className="footer-heart" /> for young learners
              </p>
            </div>

            <nav className="footer-nav">
              <Link to="/games"><Gamepad2 size={15} /> Games</Link>
              <Link to="/words"><BookOpen size={15} /> Words</Link>
              <Link to="/videos"><Video size={15} /> Videos</Link>
              <Link to="/worksheets"><FileText size={15} /> Sheets</Link>
            </nav>

            <div className="footer-social">
              <a href="https://www.instagram.com/minesminis" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.youtube.com/@minesminis" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Bottom row: Copyright + Legal + Email */}
          <div className="footer-bottom">
            <p className="footer-copy">&copy; {year} MinesMinis</p>
            <nav className="footer-legal">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
            </nav>
            <a href="mailto:info@minesminis.com" className="footer-email">
              <Mail size={14} /> info@minesminis.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
