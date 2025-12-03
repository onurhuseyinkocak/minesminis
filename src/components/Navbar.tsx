import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, userProfile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-logo">
        <Link to="/" className="logo-link" aria-label="MinesMinis Home">
          <img 
            src="/images/minesminis-logo.svg" 
            alt="MinesMinis" 
            className="navbar-logo-img"
          />
        </Link>
      </div>

      <button
        className="hamburger-btn hide-desktop"
        onClick={toggleMenu}
        aria-label="Toggle Navigation Menu"
        aria-expanded={isMenuOpen}
      >
        <span className="hamburger-icon">{isMenuOpen ? '✕' : '☰'}</span>
      </button>

      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/games" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">🎮</span>
            <span>Games</span>
          </Link>
        </li>
        <li>
          <Link to="/words" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">📖</span>
            <span>Words</span>
          </Link>
        </li>
        <li>
          <Link to="/worksheets" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">📝</span>
            <span>Fun Sheets</span>
          </Link>
        </li>

        {user && (
          <li>
            <Link to="/favorites" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
              <span className="nav-icon favorite-heart">❤️</span>
              <span>Favorites</span>
            </Link>
          </li>
        )}
      </ul>

      <div className="navbar-actions hide-mobile">
        <div className="social-buttons">
          <a
            href="https://instagram.com/minesminis"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn insta"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>
          <a
            href="https://www.youtube.com/channel/UCsammzIAT0BJdDzUXi5OD4Q"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn youtube"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>YouTube</span>
          </a>

          {user ? (
            <button onClick={signOut} className="social-btn logout">
              <span>👋</span>
              <span>See You!</span>
            </button>
          ) : (
            <Link to="/login" className="social-btn login">
              <span>🎉</span>
              <span>Join Fun!</span>
            </Link>
          )}
        </div>

        {user && (
          <Link to="/profile" className="profile-link">
            <div className="profile-avatar-nav">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} alt={userProfile.display_name || 'User'} />
              ) : (
                <div className="avatar-placeholder">
                  {userProfile?.display_name?.charAt(0).toUpperCase() || '👤'}
                </div>
              )}
            </div>
            <span className="profile-name-nav">
              {userProfile?.display_name || 'My Space'}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
