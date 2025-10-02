import React from "react";
import "../App.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📚 Eğitim Hakkında</h3>
          <ul>
            <li>Programlar</li>
            <li>Dersler</li>
            <li>Etkinlikler</li>
            <li>Kaynaklar</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🎨 Eğlenceli Köşe</h3>
          <ul>
            <li>Boyama Sayfaları</li>
            <li>Mini Oyunlar</li>
            <li>Bulmacalar</li>
            <li>Videolar</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>📞 İletişim</h3>
          <ul>
            <li>Email: info@egitim.com</li>
            <li>Telefon: +90 123 456 7890</li>
            <li>Adres: Eğlence Caddesi, Oyun Sokak No:5</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🌐 Bizi Takip Et</h3>
          <div className="social-icons">
            <span role="img" aria-label="facebook">👍</span>
            <span role="img" aria-label="twitter">🐦</span>
            <span role="img" aria-label="instagram">📸</span>
            <span role="img" aria-label="youtube">▶️</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MinesMinis | Çocuklar için güvenli ve eğlenceli eğitim.</p>
      </div>
    </footer>
  );
};

export default Footer;
