import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, Gamepad2, BookOpen, BookText } from 'lucide-react';
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
  { path: '/', label: 'Home', icon: Home },
  { path: '/worlds', label: 'Worlds', icon: Globe },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/words', label: 'Dictionary', icon: BookOpen },
  { path: '/story', label: 'Stories', icon: BookText },
];

export default function AppShell({
  children,
  showSidebar = false,
  showBottomNav = true,
}: AppShellProps) {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { stats, getXPProgress } = useGamification();

  const xpPercent = getXPProgress();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`app-shell ${showSidebar ? 'app-shell--with-sidebar' : ''}`}>
      <TopNav
        userName={userProfile?.display_name || ''}
        avatarUrl={userProfile?.avatar_url || ''}
        xpPercent={xpPercent}
        streak={stats?.streakDays || 0}
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
