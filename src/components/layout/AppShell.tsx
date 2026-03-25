import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LottieIcon, KidIcon } from '../ui';
import type { KidIconName } from '../ui';
import ParentGate, { hasParentGatePassed } from '../ParentGate';
import { Users2, LayoutDashboard } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean; // kept for backwards compat, ignored on desktop now
  showBottomNav?: boolean;
}

const NAV_ITEMS: { path: string; label: string; icon: KidIconName }[] = [
  { path: '/dashboard', label: 'Home', icon: 'home' },
  { path: '/worlds', label: 'Learn', icon: 'learn' },
  { path: '/games', label: 'Games', icon: 'games' },
  { path: '/words', label: 'Library', icon: 'library' },
  { path: '/stories', label: 'Stories', icon: 'stories' },
];

/** Action that triggered the ParentGate, used to resume after success. */
type GateAction = 'logout' | 'settings' | 'premium';

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

  // Parent Gate state
  const [gateAction, setGateAction] = useState<GateAction | null>(null);
  const [gateReason, setGateReason] = useState<string>('');

  /** Open the gate for the given action, skipping it if the session already passed. */
  const requestGate = useCallback(
    (action: GateAction, reason: string) => {
      setDropdownOpen(false);
      if (hasParentGatePassed()) {
        // Already verified this session — execute immediately
        if (action === 'logout') { signOut(); return; }
        if (action === 'settings') { navigate('/settings'); return; }
        if (action === 'premium') { navigate('/pricing'); return; }
      }
      setGateReason(reason);
      setGateAction(action);
    },
    [navigate, signOut]
  );

  const handleGateSuccess = useCallback(() => {
    setGateAction(null);
    if (gateAction === 'logout') { signOut(); return; }
    if (gateAction === 'settings') { navigate('/settings'); return; }
    if (gateAction === 'premium') { navigate('/pricing'); return; }
  }, [gateAction, navigate, signOut]);

  const handleGateCancel = useCallback(() => {
    setGateAction(null);
  }, []);

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
          {NAV_ITEMS.map(({ path, label, icon }) => {
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
                <span>{label}</span>
              </Link>
            );
          })}
          <Link
            to="/social/friends"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-150 ${
              isActive('/social/friends')
                ? 'bg-primary-50 text-primary-600'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
            }`}
          >
            <Users2 size={18} />
            <span>Friends</span>
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
              <span>Sınıfım</span>
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
            <span>{stats?.xp?.toLocaleString() || 0} XP</span>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-display font-bold text-sm hover:bg-primary-600 transition-colors"
            >
              {initial}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-ink-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-ink-100 mb-1">
                  <p className="font-display font-bold text-sm text-ink-900 truncate">{displayName || 'Adventurer'}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors font-display font-semibold"
                >
                  <KidIcon name="home" size={16} />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    requestGate(
                      'settings',
                      lang === 'tr' ? 'Ayarlara gitmek için' : 'To access Settings'
                    )
                  }
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors font-display font-semibold"
                >
                  <KidIcon name="learn" size={16} />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() =>
                    requestGate(
                      'logout',
                      lang === 'tr' ? 'Çıkış yapmak için' : 'To sign out'
                    )
                  }
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error-500 hover:bg-error-50 transition-colors font-display font-semibold"
                >
                  <KidIcon name="logout" size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MOBILE TOP BAR (hidden on desktop)
          ══════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-card flex items-center justify-between px-4 h-14 lg:hidden border-b border-ink-100">
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
            <KidIcon name="fire" size={13} />
            <span>{stats?.streakDays || 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-gold-50 text-gold-600 font-bold px-2.5 py-1 rounded-full text-xs font-display">
            <KidIcon name="star" size={13} />
            <span>{stats?.xp?.toLocaleString() || 0}</span>
          </div>
          <Link
            to="/profile"
            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-display font-bold text-sm"
          >
            {initial}
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════ */}
      <main className={`${showBottomNav ? 'pt-14 pb-20 lg:pt-16 lg:pb-8' : 'pt-14 lg:pt-16'}`}>
        {children}
      </main>

      {/* ══════════════════════════════════════════════════
          MOBILE BOTTOM NAV (hidden on desktop)
          ══════════════════════════════════════════════════ */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-ink-100 flex z-50 lg:hidden pb-[env(safe-area-inset-bottom)]">
          {NAV_ITEMS.map(({ path, label, icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors duration-200 ${
                  active ? 'text-primary-500' : 'text-ink-400'
                }`}
              >
                <div className={`p-1 rounded-full transition-colors duration-200 ${active ? 'bg-primary-50' : ''}`}>
                  <KidIcon name={icon} size={22} />
                </div>
                <span className={`text-[10px] font-display ${active ? 'font-bold' : 'font-semibold'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
          <Link
            to="/social/friends"
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors duration-200 ${
              isActive('/social/friends') ? 'text-primary-500' : 'text-ink-400'
            }`}
          >
            <div className={`p-1 rounded-full transition-colors duration-200 ${isActive('/social/friends') ? 'bg-primary-50' : ''}`}>
              <Users2 size={22} />
            </div>
            <span className={`text-[10px] font-display ${isActive('/social/friends') ? 'font-bold' : 'font-semibold'}`}>
              Friends
            </span>
          </Link>
          {isTeacher && (
            <Link
              to="/teacher"
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors duration-200 ${
                isActive('/teacher') ? 'text-primary-500' : 'text-ink-400'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors duration-200 ${isActive('/teacher') ? 'bg-primary-50' : ''}`}>
                <LayoutDashboard size={22} />
              </div>
              <span className={`text-[10px] font-display ${isActive('/teacher') ? 'font-bold' : 'font-semibold'}`}>
                Sınıfım
              </span>
            </Link>
          )}
        </nav>
      )}

      {/* ══════════════════════════════════════════════════
          PARENT GATE MODAL
          ══════════════════════════════════════════════════ */}
      {gateAction !== null && (
        <ParentGate
          reason={gateReason}
          onSuccess={handleGateSuccess}
          onCancel={handleGateCancel}
        />
      )}
    </div>
  );
}
