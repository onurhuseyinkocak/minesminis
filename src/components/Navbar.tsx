import { useState } from "react";
import './Navbar.css';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
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

function Navbar() {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { to: "/games", icon: Gamepad2, label: t('nav.games') },
    { to: "/words", icon: BookOpen, label: t('nav.words') },
    { to: "/videos", icon: Video, label: t('nav.videos') },
    { to: "/story", icon: FileText, label: t('nav.stories') },
  ];

  const TAB_ITEMS_BEFORE = [
    { to: "/", icon: Home, label: t('nav.home') },
    { to: "/blog", icon: Shield, label: t('nav.blog') },
    { to: "/login", icon: UserCircle, label: t('common.login') },
  ];

  const TAB_ITEMS_AFTER = [
    { to: "/dashboard", icon: Home, label: t('nav.home') },
    { to: "/games", icon: Gamepad2, label: t('nav.games') },
    { to: "/words", icon: Heart, label: t('nav.words') },
    { to: "/profile", icon: UserCircle, label: t('common.profile') },
  ];

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
                to="/words"
                className={`nav-icon-btn ${isActive("/words") ? "active" : ""}`}
                title={t('nav.words')}
              >
                <BookOpen size={18} />
              </Link>
              <Link
                to="/profile"
                className={`nav-profile-btn ${isActive("/profile") ? "active" : ""}`}
                title={t('common.profile')}
              >
                <UserCircle size={20} />
                <span className="nav-profile-name">
                  {userProfile?.display_name || t('common.profile')}
                </span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-icon-btn nav-admin-btn" title={t('nav.admin')}>
                  <Shield size={18} />
                </Link>
              )}
              <Link
                to="/parent"
                className="nav-icon-btn"
                title={t('nav.parents')}
              >
                <ShieldCheck size={18} />
              </Link>
              <button
                className="nav-icon-btn nav-logout-btn"
                onClick={signOut}
                title={t('common.logout')}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-login-btn">
              <UserCircle size={18} />
              <span>{t('common.login')}</span>
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
                {userProfile?.display_name || t('common.profile')}
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
              <Link to="/words" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                <BookOpen size={20} /> <span>{t('nav.words')}</span>
              </Link>
              <Link to="/parent" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                <ShieldCheck size={20} /> <span>{t('nav.parents')}</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                  <Shield size={20} /> <span>{t('nav.adminPanel')}</span>
                </Link>
              )}
              <div className="nav-mobile-divider" />
              <button
                className="nav-mobile-link nav-mobile-logout"
                onClick={() => { signOut(); setMenuOpen(false); }}
              >
                <LogOut size={20} /> <span>{t('common.logout')}</span>
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
