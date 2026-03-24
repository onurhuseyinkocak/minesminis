import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  BookText,
  Gamepad2,
  Video,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  ChevronLeft,
  Menu,
  Search,
  Star,
} from 'lucide-react';
import './AdminShell.css';

interface AdminShellProps {
  children: React.ReactNode;
  adminName?: string;
  pageTitle?: string;
  hasNotifications?: boolean;
}

const ADMIN_NAV = {
  main: [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/curriculum', label: 'Curriculum', icon: BookOpen },
    { path: '/admin/words', label: 'Words', icon: BookText },
    { path: '/admin/games', label: 'Games', icon: Gamepad2 },
    { path: '/admin/videos', label: 'Videos', icon: Video },
  ],
  management: [
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/billing', label: 'Billing', icon: CreditCard },
  ],
  system: [
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ],
};

export default function AdminShell({
  children,
  adminName = 'Admin',
  pageTitle = 'Dashboard',
  hasNotifications = false,
}: AdminShellProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const initials = adminName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const renderNavItems = (items: typeof ADMIN_NAV.main) =>
    items.map(({ path, label, icon: Icon, ...rest }) => (
      <Link
        key={path}
        to={path}
        className={`admin-shell__nav-item ${isActive(path, (rest as Record<string, unknown>).exact as boolean | undefined) ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? label : undefined}
      >
        <Icon size={20} />
        <span className="admin-shell__nav-label">{label}</span>
      </Link>
    ));

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      <div
        className={`admin-shell__mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`admin-shell__sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Admin navigation"
      >
        <div className="admin-shell__sidebar-header">
          <div className="admin-shell__sidebar-logo"><Star size={22} fill="#E8A317" color="#E8A317" /></div>
          <div>
            <div className="admin-shell__sidebar-title">MinesMinis</div>
            <div className="admin-shell__sidebar-subtitle">Admin</div>
          </div>
        </div>

        <nav className="admin-shell__sidebar-nav">
          <div className="admin-shell__sidebar-section">
            <div className="admin-shell__sidebar-section-label">Content</div>
            {renderNavItems(ADMIN_NAV.main)}
          </div>

          <div className="admin-shell__sidebar-section">
            <div className="admin-shell__sidebar-section-label">Management</div>
            {renderNavItems(ADMIN_NAV.management)}
          </div>

          <div className="admin-shell__sidebar-section">
            <div className="admin-shell__sidebar-section-label">System</div>
            {renderNavItems(ADMIN_NAV.system)}
          </div>
        </nav>

        <button
          className="admin-shell__collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          <ChevronLeft size={18} />
          <span className="admin-shell__collapse-label">Collapse</span>
        </button>
      </aside>

      {/* Main body */}
      <div className="admin-shell__body">
        <header className="admin-shell__header">
          <div className="admin-shell__header-left">
            {/* Mobile hamburger */}
            <button
              className="admin-shell__header-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
              type="button"
              style={{ display: 'none' }}
              ref={(el) => {
                // Show only on mobile via CSS would be cleaner, but this ensures it renders
                if (el) {
                  el.style.display = '';
                  const mq = window.matchMedia('(min-width: 1024px)');
                  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
                    el.style.display = e.matches ? 'none' : 'flex';
                  };
                  handler(mq);
                  mq.addEventListener('change', handler);
                }
              }}
            >
              <Menu size={20} />
            </button>
            <h1 className="admin-shell__header-title">{pageTitle}</h1>
          </div>

          <div className="admin-shell__header-right">
            <button
              className="admin-shell__header-btn"
              aria-label="Search"
              type="button"
            >
              <Search size={20} />
            </button>

            <button
              className="admin-shell__header-btn"
              aria-label="Notifications"
              type="button"
            >
              <Bell size={20} />
              {hasNotifications && <span className="admin-shell__notification-dot" />}
            </button>

            <span className="admin-shell__header-name">{adminName}</span>

            <div className="admin-shell__header-avatar" title={adminName}>
              {initials}
            </div>
          </div>
        </header>

        <main className="admin-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}
