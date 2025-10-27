import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, GamepadIcon, FileText, Video, Users, Heart, LogOut } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const { user, userProfile, signOut } = useAuth();

  const navItems = [
    { path: "/games", icon: GamepadIcon, label: "Games", color: "#8B5CF6" },
    { path: "/worksheets", icon: FileText, label: "Worksheets", color: "#06B6D4" },
    { path: "/words", icon: BookOpen, label: "Dictionary", color: "#84CC16" },
    { path: "/videos", icon: Video, label: "Videos", color: "#FB923C" },
    { path: "/discover", icon: Users, label: "Discover", color: "#EC4899" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo">MinesMinis</span>
        </Link>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="nav-item">
              <item.icon size={20} style={{ color: item.color }} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <div className="social-buttons">
            <a
              href="https://instagram.com/minesminis"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn insta"
              title="Instagram"
            >
              <span>📸</span>
            </a>
            <a
              href="https://www.youtube.com/channel/UCsammzIAT0BJdDzUXi5OD4Q"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn youtube"
              title="YouTube"
            >
              <span>▶️</span>
            </a>
          </div>

          {user && userProfile ? (
            <div className="navbar-user">
              <Link to="/favorites" className="favorites-btn" title="Favorites">
                <Heart size={20} />
              </Link>
              <Link to="/profile" className="user-profile-link">
                <img
                  src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.display_name}&background=8B5CF6&color=fff`}
                  alt={userProfile.display_name}
                  className="user-avatar"
                />
                <span className="user-name">{userProfile.display_name}</span>
              </Link>
              <button onClick={signOut} className="logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
