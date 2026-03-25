import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Globe, Gamepad2, BookOpen, BookText, Menu, X, User, LogOut, Settings, Flower2, BookMarked, Flame, Star } from 'lucide-react';
import './TopNav.css';
import ParentGate, { hasParentGatePassed } from '../ParentGate';

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
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/worlds', label: 'Learn', icon: Globe },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/words', label: 'Library', icon: BookOpen },
  { path: '/stories', label: 'Stories', icon: BookText },
];

/** Extra nav items shown in mobile slide-out menu */
const EXTRA_NAV_ITEMS = [
  { path: '/garden', label: 'Garden', icon: Flower2 },
  { path: '/reading', label: 'Reading', icon: BookMarked },
];

type GateAction = 'logout' | 'settings';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parent Gate state
  const [gateAction, setGateAction] = useState<GateAction | null>(null);
  const [gateReason, setGateReason] = useState<string>('');

  const requestGate = useCallback(
    (action: GateAction, reason: string) => {
      setDropdownOpen(false);
      setMobileOpen(false);
      if (hasParentGatePassed()) {
        if (action === 'logout' && onLogout) { onLogout(); return; }
        if (action === 'settings') { navigate('/settings'); return; }
      }
      setGateReason(reason);
      setGateAction(action);
    },
    [navigate, onLogout]
  );

  const handleGateSuccess = useCallback(() => {
    const action = gateAction;
    setGateAction(null);
    if (action === 'logout' && onLogout) { onLogout(); return; }
    if (action === 'settings') { navigate('/settings'); return; }
  }, [gateAction, navigate, onLogout]);

  const handleGateCancel = useCallback(() => {
    setGateAction(null);
  }, []);

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
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`topnav__link ${isActive(path) ? 'active' : ''}`}
                  aria-current={isActive(path) ? 'page' : undefined}
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
                  <User size={16} /> Profile
                </button>
                <button
                  type="button"
                  className="topnav__dropdown-item"
                  onClick={() => requestGate('settings', 'To access Settings')}
                >
                  <Settings size={16} /> Settings
                </button>
                {onLogout && (
                  <>
                    <div className="topnav__dropdown-divider" />
                    <button
                      type="button"
                      className="topnav__dropdown-item topnav__dropdown-item--danger"
                      onClick={() => requestGate('logout', 'To sign out')}
                    >
                      <LogOut size={16} /> Logout
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
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`topnav__mobile-link ${isActive(path) ? 'active' : ''}`}
                aria-current={isActive(path) ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={22} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
          {EXTRA_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`topnav__mobile-link ${isActive(path) ? 'active' : ''}`}
                aria-current={isActive(path) ? 'page' : undefined}
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
              <span>{streak} day streak</span>
            </div>
          )}
          <Link to="/profile" className="topnav__mobile-link" onClick={() => setMobileOpen(false)}>
            <User size={22} /> <span>Profile</span>
          </Link>
          {onLogout && (
            <button
              type="button"
              className="topnav__mobile-logout"
              onClick={() => requestGate('logout', 'To sign out')}
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>
      </div>

      {gateAction !== null && (
        <ParentGate
          reason={gateReason}
          onSuccess={handleGateSuccess}
          onCancel={handleGateCancel}
        />
      )}
    </>
  );
}
