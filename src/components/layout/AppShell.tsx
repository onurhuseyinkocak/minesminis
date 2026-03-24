import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { LottieIcon, KidIcon } from '../ui';
import type { KidIconName } from '../ui';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showBottomNav?: boolean;
}

const NAV_ITEMS: { path: string; label: string; icon: KidIconName }[] = [
  { path: '/dashboard', label: 'Home', icon: 'home' },
  { path: '/worlds', label: 'Learn', icon: 'learn' },
  { path: '/games', label: 'Games', icon: 'games' },
  { path: '/words', label: 'Library', icon: 'library' },
  { path: '/stories', label: 'Stories', icon: 'stories' },
];

const EXTRA_NAV_ITEMS: { path: string; label: string; icon: KidIconName }[] = [
  { path: '/garden', label: 'Garden', icon: 'garden' },
  { path: '/reading', label: 'Reading', icon: 'reading' },
];

export default function AppShell({
  children,
  showSidebar = false,
  showBottomNav = true,
}: AppShellProps) {
  const location = useLocation();
  const { userProfile, signOut } = useAuth();
  const { stats } = useGamification();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const displayName = userProfile?.display_name || '';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className={`min-h-screen bg-cream-100 ${showBottomNav ? 'pb-20' : ''} lg:pb-0 ${showSidebar ? 'lg:pl-64' : ''}`}>
      {/* ========== MOBILE TOP BAR ========== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-card flex items-center justify-between px-4 h-14 lg:hidden">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
            <LottieIcon name="dragon" size={20} />
          </div>
          <span className="font-display font-extrabold text-lg text-ink-900">
            Mines<span className="text-primary-500">Minis</span>
          </span>
        </Link>

        {/* Stats + Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-orange-50 text-primary-500 font-bold px-2.5 py-1 rounded-full text-xs font-display">
            <KidIcon name="fire" size={14} />
            <span>{stats?.streakDays || 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-gold-50 text-gold-600 font-bold px-2.5 py-1 rounded-full text-xs font-display">
            <KidIcon name="star" size={14} />
            <span>{stats?.xp?.toLocaleString() || 0}</span>
          </div>
          <Link
            to="/profile"
            className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white font-display font-bold text-sm"
          >
            {initial}
          </Link>
        </div>
      </header>

      {/* ========== DESKTOP SIDEBAR ========== */}
      {showSidebar && (
        <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white shadow-card flex-col z-40">
          {/* Logo + Profile */}
          <div className="p-6 border-b border-ink-100">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <LottieIcon name="dragon" size={20} />
              </div>
              <span className="font-display font-extrabold text-xl text-ink-900">
                Mines<span className="text-primary-500">Minis</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center text-white font-display font-bold text-base flex-shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-ink-900 text-sm truncate">{displayName || 'Adventurer'}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-0.5 text-xs text-primary-500 font-bold">
                    <KidIcon name="fire" size={12} /> {stats?.streakDays || 0}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-gold-600 font-bold">
                    <KidIcon name="star" size={12} /> {stats?.xp?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {NAV_ITEMS.map(({ path, label, icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-xl text-sm font-display font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-primary-50 text-primary-600 font-bold border-r-4 border-primary-500'
                      : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <KidIcon name={icon} size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="h-px bg-ink-100 mx-6 my-3" />
            {EXTRA_NAV_ITEMS.map(({ path, label, icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-xl text-sm font-display font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-primary-50 text-primary-600 font-bold border-r-4 border-primary-500'
                      : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <KidIcon name={icon} size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-ink-100">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold text-ink-400 hover:text-error-500 hover:bg-error-50 transition-colors"
            >
              <KidIcon name="logout" size={18} />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <main className={`${showBottomNav ? 'pt-14 lg:pt-0' : ''}`}>
        {children}
      </main>

      {/* ========== MOBILE BOTTOM NAV ========== */}
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
        </nav>
      )}
    </div>
  );
}
