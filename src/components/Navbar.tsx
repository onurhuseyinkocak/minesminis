import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, userProfile, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">MINESMINIS</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/" className="nav-btn">Home</Link></li>
        <li><Link to="/games" className="nav-btn">Games</Link></li>
        <li><Link to="/words" className="nav-btn">Words</Link></li>
        <li><Link to="/worksheets" className="nav-btn">Worksheets</Link></li>
        <li><Link to="/discover" className="nav-btn">Discover</Link></li>
        {user && (
          <li><Link to="/favorites" className="nav-btn">Favorites</Link></li>
        )}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

        {user && (
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
                src={userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=' + (userProfile?.display_name || 'User')}
                alt={userProfile?.display_name || 'User'}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%'
                }}
              />
              <span style={{ fontSize: '14px' }}>
                {userProfile?.display_name || 'Profile'}
              </span>
            </Link>
            <button
              onClick={signOut}
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
        )}
      </div>
    </nav>
  );
}

export default Navbar;