import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, Gamepad2, BookOpen, BookText, Flower2, BookMarked } from 'lucide-react';
import TopNav from './TopNav';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showBottomNav?: boolean;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/worlds', label: 'Learn', icon: Globe },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/words', label: 'Library', icon: BookOpen },
  { path: '/stories', label: 'Stories', icon: BookText },
];

/** Extra nav items shown in sidebar but not bottom nav (space-limited) */
const EXTRA_NAV_ITEMS = [
  { path: '/garden', label: 'Garden', icon: Flower2 },
  { path: '/reading', label: 'Reading', icon: BookMarked },
];

export default function AppShell({
  children,
  showSidebar = false,
  showBottomNav = true,
}: AppShellProps) {
  const location = useLocation();
  const { userProfile, signOut } = useAuth();
  const { stats, getXPProgress } = useGamification();

  const xpPercent = getXPProgress();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`app-shell ${showSidebar ? 'app-shell--with-sidebar' : ''}`}>
      <TopNav
        userName={userProfile?.display_name || ''}
        avatarUrl={String(userProfile?.settings?.avatar_emoji || userProfile?.avatar_url || '')}
        xpPercent={xpPercent}
        streak={stats?.streakDays || 0}
        onLogout={signOut}
      />

      {showSidebar && (
        <aside className="app-shell__sidebar" aria-label="Main navigation">
          <nav>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`app-shell__sidebar-link ${isActive(path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
            {EXTRA_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`app-shell__sidebar-link ${isActive(path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      <div className="app-shell__main">
        <main className="app-shell__content">
          {children}
        </main>
      </div>

      {showBottomNav && (
        <nav className="app-shell__bottom-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`app-shell__bottom-nav-item ${isActive(path) ? 'active' : ''}`}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
