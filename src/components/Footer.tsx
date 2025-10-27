import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="footer-logo">MinesMinis</span>
          </h3>
          <p className="footer-description">
            Making learning English fun and exciting for children around the world!
          </p>
          <div className="footer-social">
            <a href="https://instagram.com/minesminis" target="_blank" rel="noopener noreferrer" className="social-link">
              <Instagram size={20} />
            </a>
            <a href="https://www.youtube.com/channel/UCsammzIAT0BJdDzUXi5OD4Q" target="_blank" rel="noopener noreferrer" className="social-link">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Learn</h4>
          <ul className="footer-links">
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/worksheets">Worksheets</Link></li>
            <li><Link to="/words">Dictionary</Link></li>
            <li><Link to="/videos">Videos</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <ul className="footer-links">
            <li><Link to="/discover">Discover</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <Mail size={16} />
              <span>info@minesminis.com</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+90 123 456 7890</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Istanbul, Turkey</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MinesMinis. Made with <Heart size={14} className="heart-icon" /> for children worldwide.</p>
      </div>
    </footer>
  );
};

export default Footer;
