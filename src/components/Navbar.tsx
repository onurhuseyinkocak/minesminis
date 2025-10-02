import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/" className="logo-link">MINESMINIS</Link>
      </div>

      {/* Orta Menü */}
      <ul className="nav-links">
        <li><Link to="/" className="nav-btn">Home</Link></li>
        <li><Link to="/games" className="nav-btn">Games</Link></li>
        <li><Link to="/words" className="nav-btn">Words</Link></li>
      </ul>

      {/* Sağdaki Sosyal Medya Butonları */}
      <div className="social-buttons">
        <a 
          href="https://instagram.com/minesminis" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-btn insta"
        >
          Instagram
        </a>
        <a 
          href="https://www.youtube.com/channel/UCsammzIAT0BJdDzUXi5OD4Q" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-btn youtube"
        >
          YouTube
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
