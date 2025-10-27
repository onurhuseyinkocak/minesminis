import React from "react";
import "../App.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📚 Education</h3>
          <ul>
            <li>Programs</li>
            <li>Lessons</li>
            <li>Activities</li>
            <li>Resources</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🎨 Fun Corner</h3>
          <ul>
            <li>Coloring Pages</li>
            <li>Mini Games</li>
            <li>Puzzles</li>
            <li>Videos</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>📞 Contact</h3>
          <ul>
            <li>Email: info@minesminis.com</li>
            <li>Phone: +90 123 456 7890</li>
            <li>Address: Learning Street, Fun Avenue No:5</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🌐 Follow Us</h3>
          <div className="social-icons">
            <span role="img" aria-label="facebook">👍</span>
            <span role="img" aria-label="twitter">🐦</span>
            <span role="img" aria-label="instagram">📸</span>
            <span role="img" aria-label="youtube">▶️</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MinesMinis | Safe and fun education for kids.</p>
      </div>
    </footer>
  );
};

export default Footer;
