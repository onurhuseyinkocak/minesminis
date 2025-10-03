// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();

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
        <li><Link to="/worksheets" className="nav-btn">Worksheets</Link></li>
        {/* YENİ LİNKLER */}
        <li><Link to="/discover" className="nav-btn">Discover</Link></li>
        {user && (
          <li><Link to="/favorites" className="nav-btn">Favorites</Link></li>
        )}
      </ul>

      {/* Sağdaki Sosyal Medya Butonları + Giriş Butonu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* SOSYAL MEDYA BUTONLARI */}
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

        {/* AUTH BUTONLARI */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/profile" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold'
            }}>
              <img 
                src={user.photoURL || '/default-avatar.png'} 
                alt={user.displayName || 'User'}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%'
                }}
              />
              <span style={{ fontSize: '14px' }}>
                {user.displayName?.split(' ')[0] || 'Profile'}
              </span>
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" 
              alt="Google" 
              style={{ width: '18px', height: '18px' }}
            />
            Google Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;