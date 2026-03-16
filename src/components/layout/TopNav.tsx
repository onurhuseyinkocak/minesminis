import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, Gamepad2, BookOpen, BookText, Menu, X } from 'lucide-react';
import './TopNav.css';

interface TopNavProps {
  /** User display name or initials for avatar fallback */
  userName?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Current XP value (0-100 percent) */
  xpPercent?: number;
  /** XP display label */
  xpLabel?: string;
  /** Current streak count */
  streak?: number;
}

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/worlds', label: 'Worlds', icon: Globe },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/words', label: 'Dictionary', icon: BookOpen },
  { path: '/story', label: 'Stories', icon: BookText },
];

export default function TopNav({
  userName = '',
  avatarUrl,
  xpPercent = 0,
  xpLabel = 'XP',
  streak = 0,
}: TopNavProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleOverlayClick = useCallback(() => setMobileOpen(false), []);

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      <header className={`topnav ${scrolled ? 'topnav--scrolled' : ''}`}>
        {/* Logo */}
        <Link to="/" className="topnav__logo" aria-label="MinesMinis Home">
          <div className="topnav__logo-icon" role="img" aria-hidden="true">
            🐲
          </div>
          <div className="topnav__logo-text">
            <span>Mines</span><span>Minis</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation">
          <ul className="topnav__links">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`topnav__link ${isActive(path) ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="topnav__user">
          {streak > 0 && (
            <div className="topnav__streak" title={`${streak} day streak`}>
              <span className="topnav__streak-icon">🔥</span>
              <span>{streak}</span>
            </div>
          )}

          <div className="topnav__xp" title={`${xpLabel}: ${xpPercent}%`}>
            <div className="topnav__xp-bar">
              <div
                className="topnav__xp-fill"
                style={{ width: `${Math.min(100, Math.max(0, xpPercent))}%` }}
              />
            </div>
            <span>{xpLabel}</span>
          </div>

          <button
            className="topnav__avatar"
            aria-label="Open profile"
            type="button"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName || 'User avatar'} />
            ) : (
              initials
            )}
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="topnav__hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`topnav__mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        className={`topnav__mobile-menu ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal={mobileOpen}
      >
        <div className="topnav__mobile-header">
          <Link to="/" className="topnav__logo" aria-label="MinesMinis Home">
            <div className="topnav__logo-icon" role="img" aria-hidden="true">
              🐲
            </div>
            <div className="topnav__logo-text">
              <span>Mines</span><span>Minis</span>
            </div>
          </Link>
          <button
            className="topnav__mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="topnav__mobile-links">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`topnav__mobile-link ${isActive(path) ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={22} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="topnav__mobile-user">
          <div className="topnav__avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName || 'User avatar'} />
            ) : (
              initials
            )}
          </div>
          {streak > 0 && (
            <div className="topnav__streak">
              <span className="topnav__streak-icon">🔥</span>
              <span>{streak} day streak</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
