// src/pages/Discover/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/" className="logo-link">
          <div className="logo">
            🎯 EduConnect
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {[
          { icon: '🏠', label: 'Ana Sayfa', path: '/', active: location.pathname === '/' },
          { icon: '🔍', label: 'Keşfet', path: '/discover', active: location.pathname === '/discover' },
          { icon: '🔔', label: 'Bildirimler', path: '/notifications' },
          { icon: '✉️', label: 'Mesajlar', path: '/messages' },
          { icon: '📚', label: 'Materyaller', path: '/materials' },
          { icon: '⭐', label: 'Favoriler', path: '/favorites' },
          { icon: '👤', label: 'Profil', path: '/profile' }
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${item.active ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {user && (
        <button
          onClick={() => document.getElementById('post-input')?.focus()}
          className="post-button"
        >
          Paylaş
        </button>
      )}

      {user && (
        <div className="user-profile">
          <Link to="/profile" className="profile-link">
            <img 
              src={user.photoURL || '/default-avatar.png'} 
              alt={user.displayName || 'User'}
              className="profile-avatar"
            />
            <div className="profile-info">
              <div className="profile-name">
                {user.displayName || 'Kullanıcı'}
              </div>
              <div className="profile-handle">
                @{user.email?.split('@')[0]}
              </div>
            </div>
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Çıkış
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;