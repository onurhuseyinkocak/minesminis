import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Gamepad2,
  Video,
  BookOpen,
  FileText,
  Home,
  Heart,
  UserCircle,
  LogOut,
  Shield,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import XPBar from "./XPBar";

const NAV_ITEMS = [
  { to: "/games", icon: Gamepad2, label: "Games" },
  { to: "/words", icon: BookOpen, label: "Words" },
  { to: "/videos", icon: Video, label: "Videos" },
  { to: "/worksheets", icon: FileText, label: "Sheets" },
] as const;

const TAB_ITEMS_BEFORE = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/ataturk", icon: Shield, label: "Ataturk" },
  { to: "/login", icon: UserCircle, label: "Login" },
];

const TAB_ITEMS_AFTER = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/games", icon: Gamepad2, label: "Games" },
  { to: "/favorites", icon: Heart, label: "Favs" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

function Navbar() {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    const p = location.pathname;
    if (path === "/dashboard") return p === "/" || p === "/dashboard";
    return p.startsWith(path);
  };

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="nav-top" aria-label="Main Navigation">
        {/* Left: Logo */}
        <Link to={user ? "/games" : "/"} className="nav-logo" aria-label="MinesMinis">
          <div className="nav-logo-icon">
            <img src="/images/mine-logo.jpg" alt="" className="nav-logo-img" />
          </div>
          <span className="nav-logo-text">
            <span className="nav-logo-mine">Mine's</span>
            <span className="nav-logo-minis">Minis</span>
          </span>
        </Link>

        {/* Center: Nav Links (auth only) */}
        {user && (
          <ul className="nav-links">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link ${isActive(to) ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right: Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button
            className="nav-theme-btn"
            onClick={toggleTheme}
            aria-label={effectiveTheme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {effectiveTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <XPBar compact />
              <Link
                to="/favorites"
                className={`nav-icon-btn ${isActive("/favorites") ? "active" : ""}`}
                title="Favorites"
              >
                <Heart size={18} />
              </Link>
              <Link
                to="/profile"
                className={`nav-profile-btn ${isActive("/profile") ? "active" : ""}`}
                title="Profile"
              >
                <UserCircle size={20} />
                <span className="nav-profile-name">
                  {userProfile?.display_name || "Profile"}
                </span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-icon-btn nav-admin-btn" title="Admin">
                  <Shield size={18} />
                </Link>
              )}
              <Link
                to="/parent-dashboard"
                className="nav-icon-btn"
                title="Parents"
              >
                <ShieldCheck size={18} />
              </Link>
              <button
                className="nav-icon-btn nav-logout-btn"
                onClick={signOut}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-login-btn">
              <UserCircle size={18} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile slide menu */}
      {user && menuOpen && (
        <div className="nav-mobile-overlay" onClick={() => setMenuOpen(false)}>
          <div className="nav-mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="nav-mobile-header">
              <span className="nav-mobile-user">
                <UserCircle size={24} />
                {userProfile?.display_name || "Profile"}
              </span>
              <button className="nav-mobile-close" onClick={() => setMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="nav-mobile-links">
              {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`nav-mobile-link ${isActive(to) ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="nav-mobile-divider" />
              <Link to="/favorites" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                <Heart size={20} /> <span>Favorites</span>
              </Link>
              <Link to="/parent-dashboard" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                <ShieldCheck size={20} /> <span>Parents</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                  <Shield size={20} /> <span>Admin Panel</span>
                </Link>
              )}
              <div className="nav-mobile-divider" />
              <button
                className="nav-mobile-link nav-mobile-logout"
                onClick={() => { signOut(); setMenuOpen(false); }}
              >
                <LogOut size={20} /> <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      <nav className="nav-tabbar" aria-label="Mobile Navigation">
        {(user ? TAB_ITEMS_AFTER : TAB_ITEMS_BEFORE).map(({ to, icon: Icon, label }) => {
          const active = to === "/" || to === "/dashboard"
            ? location.pathname === "/" || location.pathname === "/dashboard"
            : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`nav-tab ${active ? "active" : ""}`}>
              <Icon size={22} className="nav-tab-icon" />
              <span className="nav-tab-label">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="nav-spacer" aria-hidden="true" />
    </>
  );
}

export default Navbar;
