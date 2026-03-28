import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LottieIcon, KidIcon } from '../ui';
import type { KidIconName } from '../ui';
import { Users2, LayoutDashboard, Trophy } from 'lucide-react';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean; // kept for backwards compat, ignored on desktop now
  showBottomNav?: boolean;
}

/** All nav items for the DESKTOP top bar */
const NAV_ITEMS: { path: string; label: string; labelTr: string; icon: KidIconName }[] = [
  { path: '/dashboard', label: 'Home', labelTr: 'Ana Sayfa', icon: 'home' },
  { path: '/worlds', label: 'Learn', labelTr: 'Öğren', icon: 'learn' },
  { path: '/games', label: 'Games', labelTr: 'Oyunlar', icon: 'games' },
  { path: '/words', label: 'Library', labelTr: 'Kütüphane', icon: 'library' },
  { path: '/stories', label: 'Stories', labelTr: 'Hikayeler', icon: 'stories' },
];

/** Mobile bottom nav: max 5 items to prevent overflow */
const MOBILE_NAV_ITEMS: { path: string; label: string; labelTr: string; icon: KidIconName }[] = [
  { path: '/dashboard', label: 'Home', labelTr: 'Ana Sayfa', icon: 'home' },
  { path: '/worlds', label: 'Learn', labelTr: 'Öğren', icon: 'learn' },
  { path: '/games', label: 'Games', labelTr: 'Oyunlar', icon: 'games' },
  { path: '/stories', label: 'Stories', labelTr: 'Hikayeler', icon: 'stories' },
  { path: '/profile', label: 'Me', labelTr: 'Ben', icon: 'profile' },
];

export default function AppShell({
  children,
  showBottomNav = true,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const { stats } = useGamification();
  const { lang } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const displayName = userProfile?.display_name || '';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  const isTeacher = userProfile?.role === 'teacher';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus trap inside dropdown when open
  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!dropdownOpen) return;
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const menu = dropdownMenuRef.current;
    if (!menu) return;
    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen bg-cream-100">

      {/* ══════════════════════════════════════════════════
          DESKTOP TOP NAV (hidden on mobile)
          ══════════════════════════════════════════════════ */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 xl:px-10 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-ink-100'
            : 'bg-white/90 backdrop-blur-sm border-b border-ink-100/60'
        }`}
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <LottieIcon name="dragon" size={20} />
          </div>
          <span className="font-display font-extrabold text-xl text-ink-900">
            Mines<span className="text-primary-500">Minis</span>
          </span>
        </Link>

        {/* Center nav links */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label, labelTr, icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
                }`}
              >
                <KidIcon name={icon} size={18} />
                <span>{lang === 'tr' ? labelTr : label}</span>
              </Link>
            );
          })}
          <Link
            to="/leaderboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-150 ${
              isActive('/leaderboard')
                ? 'bg-primary-50 text-primary-600'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
            }`}
          >
            <Trophy size={18} />
            <span>{lang === 'tr' ? 'Turnuva' : 'Leaderboard'}</span>
          </Link>
          <Link
            to="/social/friends"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-150 ${
              isActive('/social/friends')
                ? 'bg-primary-50 text-primary-600'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
            }`}
          >
            <Users2 size={18} />
            <span>{lang === 'tr' ? 'Arkadaşlar' : 'Friends'}</span>
          </Link>
          {isTeacher && (
            <Link
              to="/teacher"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-150 ${
                isActive('/teacher')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>{lang === 'tr' ? 'Sınıfım' : 'My Class'}</span>
            </Link>
          )}
        </nav>

        {/* Right: streak + XP + avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-orange-50 text-primary-500 font-bold px-3 py-1.5 rounded-full text-sm font-display">
            <KidIcon name="fire" size={15} />
            <span>{stats?.streakDays || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gold-50 text-gold-600 font-bold px-3 py-1.5 rounded-full text-sm font-display">
            <KidIcon name="star" size={15} />
            <span>{stats?.xp?.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US') || 0} XP</span>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef} onKeyDown={handleDropdownKeyDown}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              aria-label={lang === 'tr' ? 'Kullanıcı menüsü' : 'User menu'}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              className="appshell-desktop-avatar"
            >
              {initial}
            </button>

            {dropdownOpen && (
              <div
                className="appshell-desktop-dropdown"
                role="menu"
                ref={dropdownMenuRef}
              >
                <div className="px-4 py-2 border-b border-ink-100 mb-1">
                  <p className="font-display font-bold text-sm text-ink-900 truncate">{displayName || 'Adventurer'}</p>
                </div>
                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors font-display font-semibold"
                >
                  <KidIcon name="profile" size={16} />
                  {lang === 'tr' ? 'Profil' : 'Profile'}
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors font-display font-semibold"
                >
                  <KidIcon name="learn" size={16} />
                  {lang === 'tr' ? 'Ayarlar' : 'Settings'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setDropdownOpen(false); signOut(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error-500 hover:bg-error-50 transition-colors font-display font-semibold"
                >
                  <KidIcon name="logout" size={16} />
                  {lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MOBILE TOP BAR (hidden on desktop)
          ══════════════════════════════════════════════════ */}
      <header className="appshell-mobile-topbar lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-1.5">
          <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
            <LottieIcon name="dragon" size={20} />
          </div>
          <span className="font-display font-extrabold text-lg text-ink-900">
            Mines<span className="text-primary-500">Minis</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-orange-50 text-primary-500 font-bold px-2.5 py-1 rounded-full text-xs font-display">
            <KidIcon name="fire" size={14} />
            <span>{stats?.streakDays || 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-gold-50 text-gold-600 font-bold px-2.5 py-1 rounded-full text-xs font-display">
            <KidIcon name="star" size={14} />
            <span>{stats?.xp?.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US') || 0} XP</span>
          </div>
          <Link
            to="/profile"
            className="appshell-mobile-avatar"
            aria-label="Go to profile"
          >
            {initial}
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════ */}
      <main id="main-content" className={`appshell-main${showBottomNav ? ' appshell-main--with-bottom-nav' : ''}`}>
        {children}
        {/* Legal footer — KVKK/GDPR compliance */}
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem 2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </Link>
          <Link to="/terms" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            {lang === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}
          </Link>
          <Link to="/cookies" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            {lang === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
          </Link>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════
          MOBILE BOTTOM NAV (hidden on desktop)
          ══════════════════════════════════════════════════ */}
      {showBottomNav && (
        <nav className="appshell-tabbar lg:hidden" aria-label="Main navigation">
          {MOBILE_NAV_ITEMS.map(({ path, label, labelTr, icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`appshell-tab ${active ? 'appshell-tab--active' : ''}`}
              >
                <div className={`appshell-tab__icon-wrap ${active ? 'appshell-tab__icon-wrap--active' : ''}`}>
                  <KidIcon name={icon} size={24} />
                </div>
                <span className="appshell-tab__label">
                  {lang === 'tr' ? labelTr : label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}

    </div>
  );
}
