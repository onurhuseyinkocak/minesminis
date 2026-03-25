import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Globe, Gamepad2, BookOpen, BookText, Menu, X, User, LogOut, Settings, Flower2, BookMarked, Flame, Star } from 'lucide-react';
import './TopNav.css';
import { useLanguage } from '../../contexts/LanguageContext';

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
  /** Logout handler */
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { path: '/dashboard', i18nKey: 'nav.home', icon: Home },
  { path: '/worlds', i18nKey: 'nav.learn', icon: Globe },
  { path: '/games', i18nKey: 'nav.games', icon: Gamepad2 },
  { path: '/words', i18nKey: 'nav.library', icon: BookOpen },
  { path: '/stories', i18nKey: 'nav.stories', icon: BookText },
];

/** Extra nav items shown in mobile slide-out menu */
const EXTRA_NAV_ITEMS = [
  { path: '/garden', i18nKey: 'nav.garden', icon: Flower2 },
  { path: '/reading', i18nKey: 'nav.reading', icon: BookMarked },
];

export default function TopNav({
  userName = '',
  avatarUrl,
  xpPercent = 0,
  xpLabel = 'XP',
  streak = 0,
  onLogout,
}: TopNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const isEmoji = avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('/');
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      <header className={`topnav ${scrolled ? 'topnav--scrolled' : ''}`}>
        {/* Logo */}
        <Link to="/" className="topnav__logo" aria-label="MinesMinis Home">
          <div className="topnav__logo-icon" role="img" aria-hidden="true">
            <Star size={22} fill="#E8A317" color="#E8A317" />
          </div>
          <div className="topnav__logo-text">
            <span>Mines</span><span>Minis</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation">
          <ul className="topnav__links">
            {NAV_ITEMS.map(({ path, i18nKey, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`topnav__link ${isActive(path) ? 'active' : ''}`}
                  aria-current={isActive(path) ? 'page' : undefined}
                >
                  <Icon size={18} />
                  <span>{t(i18nKey)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="topnav__user">
          {streak > 0 && (
            <div className="topnav__streak" title={`${streak} day streak`}>
              <span className="topnav__streak-icon"><Flame size={16} color="#FF6B35" /></span>
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

          <div className="topnav__avatar-wrapper" ref={dropdownRef}>
            <button
              className="topnav__avatar"
              aria-label="User menu"
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
            >
              {isEmoji ? (
                <span className="topnav__avatar-emoji">{avatarUrl}</span>
              ) : avatarUrl ? (
                <img src={avatarUrl} alt={userName || 'User avatar'} />
              ) : (
                initials
              )}
            </button>
            {dropdownOpen && (
              <div className="topnav__dropdown">
                <div className="topnav__dropdown-header">
                  <span className="topnav__dropdown-name">{userName || 'User'}</span>
                </div>
                <button
                  type="button"
                  className="topnav__dropdown-item"
                  onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                >
                  <User size={16} /> {t('common.profile')}
                </button>
                <button
                  type="button"
                  className="topnav__dropdown-item"
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                >
                  <Settings size={16} /> {t('common.settings')}
                </button>
                {onLogout && (
                  <>
                    <div className="topnav__dropdown-divider" />
                    <button
                      type="button"
                      className="topnav__dropdown-item topnav__dropdown-item--danger"
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                    >
                      <LogOut size={16} /> {t('common.logout')}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

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
              <Star size={22} fill="#E8A317" color="#E8A317" />
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
          {NAV_ITEMS.map(({ path, i18nKey, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`topnav__mobile-link ${isActive(path) ? 'active' : ''}`}
                aria-current={isActive(path) ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={22} />
                <span>{t(i18nKey)}</span>
              </Link>
            </li>
          ))}
          {EXTRA_NAV_ITEMS.map(({ path, i18nKey, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`topnav__mobile-link ${isActive(path) ? 'active' : ''}`}
                aria-current={isActive(path) ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={22} />
                <span>{t(i18nKey)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="topnav__mobile-user">
          <div className="topnav__avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
            {isEmoji ? (
              <span className="topnav__avatar-emoji">{avatarUrl}</span>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt={userName || 'User avatar'} />
            ) : (
              initials
            )}
          </div>
          {streak > 0 && (
            <div className="topnav__streak">
              <span className="topnav__streak-icon"><Flame size={16} color="#FF6B35" /></span>
              <span>{streak} {t('common.dayStreak')}</span>
            </div>
          )}
          <Link to="/profile" className="topnav__mobile-link" onClick={() => setMobileOpen(false)}>
            <User size={22} /> <span>{t('common.profile')}</span>
          </Link>
          {onLogout && (
            <button
              type="button"
              className="topnav__mobile-logout"
              onClick={() => { setMobileOpen(false); onLogout(); }}
            >
              <LogOut size={20} /> {t('common.logout')}
            </button>
          )}
        </div>
      </div>

    </>
  );
}
