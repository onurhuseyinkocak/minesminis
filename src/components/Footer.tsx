import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import ThemeToggle from "./ThemeToggle";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📚 Learn</h3>
          <ul>
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/words">Words</Link></li>
            <li><Link to="/videos">Videos</Link></li>
            <li><Link to="/worksheets">Fun Sheets</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🎨 Explore</h3>
          <ul>
            <li><Link to="/premium">Premium</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>📞 Contact</h3>
          <ul>
            <li>
              <a href="mailto:info@minesminis.com">
                info@minesminis.com
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/minesminis" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@minesminis" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🌐 Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/minesminis" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              📸
            </a>
            <a href="https://www.youtube.com/@minesminis" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              ▶️
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-theme-toggle">
          <ThemeToggle />
        </div>
        <p>© {currentYear} MinesMinis | Fun English learning for kids.</p>
      </div>
    </footer>
  );
};

export default Footer;
