import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, userProfile, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <span className="logo-emoji">🎯</span>
          <span className="logo-text gradient-text">MINESMINIS</span>
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-btn">
            <span className="nav-icon">🏠</span>
            <span>Ana Sayfa</span>
          </Link>
        </li>
        <li>
          <Link to="/games" className="nav-btn">
            <span className="nav-icon">🎮</span>
            <span>Oyunlar</span>
          </Link>
        </li>
        <li>
          <Link to="/words" className="nav-btn">
            <span className="nav-icon">📖</span>
            <span>Kelimeler</span>
          </Link>
        </li>
        <li>
          <Link to="/worksheets" className="nav-btn">
            <span className="nav-icon">📝</span>
            <span>Çalışma</span>
          </Link>
        </li>
        <li>
          <Link to="/discover" className="nav-btn">
            <span className="nav-icon">🔍</span>
            <span>Keşfet</span>
          </Link>
        </li>
        {user && (
          <li>
            <Link to="/favorites" className="nav-btn">
              <span className="nav-icon">⭐</span>
              <span>Favoriler</span>
            </Link>
          </li>
        )}
      </ul>

      <div className="navbar-actions">
        <div className="social-buttons">
          <a
            href="https://instagram.com/minesminis"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn insta"
          >
            📸 Instagram
          </a>
          <a
            href="https://www.youtube.com/channel/UCsammzIAT0BJdDzUXi5OD4Q"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn youtube"
          >
            ▶️ YouTube
          </a>
        </div>

        {user && (
          <div className="navbar-user">
            <Link to="/profile" className="profile-link">
              <div className="profile-avatar-nav">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt={userProfile.display_name} />
                ) : (
                  <div className="avatar-placeholder">
                    {userProfile?.display_name?.charAt(0).toUpperCase() || '👤'}
                  </div>
                )}
              </div>
              <span className="profile-name-nav">
                {userProfile?.display_name || 'Profil'}
              </span>
            </Link>
            <button onClick={signOut} className="logout-btn">
              <span>🚪</span>
              <span>Çıkış</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
