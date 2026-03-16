import { useState } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    ExternalLink,
    Lock,
    GraduationCap,
    Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminUsersManager from './AdminUsersManager';
import AdminContentManager from './AdminContentManager';
import AdminCurriculumManager from './AdminCurriculumManager';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import './AdminLayout.css';

const ADMIN_SESSION_KEY = 'admin_session';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Wealthy*520';

const navSections = [
    {
        label: 'Overview',
        items: [
            { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        ]
    },
    {
        label: 'Manage',
        items: [
            { path: '/admin/users', icon: Users, label: 'Users' },
            { path: '/admin/content', icon: Package, label: 'Content' },
            { path: '/admin/curriculum', icon: GraduationCap, label: 'Curriculum' },
        ]
    },
    {
        label: 'System',
        items: [
            { path: '/admin/settings', icon: Settings, label: 'Settings' },
        ]
    }
];

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(() =>
        typeof window !== 'undefined' && sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
    );
    const { signOut } = useAuth();
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handlePasswordLogin = () => {
        setLoginError('');
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
            setIsAdmin(true);
            setPassword('');
        } else {
            setLoginError('Invalid password. Please try again.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setIsAdmin(false);
        setPassword('');
        signOut();
        window.location.href = '/admin';
    };

    const currentTime = new Date();

    // --- Login Screen ---
    if (!isAdmin) {
        return (
            <div className="adm-login">
                <div className="adm-login-visual">
                    <div className="adm-login-brand-mark">M</div>
                    <div className="adm-login-brand">
                        MinesMinis
                        <small>Administration</small>
                    </div>
                </div>
                <div className="adm-login-form-side">
                    <div className="adm-login-box">
                        <h2>Welcome back</h2>
                        <p>Enter your admin password to continue</p>

                        <div className="adm-input-group">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Admin password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordLogin(); }}
                                autoFocus
                            />
                        </div>

                        {loginError && <p className="adm-login-error">{loginError}</p>}

                        <button className="adm-login-submit" onClick={handlePasswordLogin}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Shell ---
    return (
        <div className="adm-shell">
            {/* Sidebar */}
            <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <Link to="/admin" className="adm-sidebar-brand" onClick={() => setSidebarOpen(false)}>
                    <div className="adm-sidebar-brand-mark">M</div>
                    <div className="adm-sidebar-brand-text">
                        MinesMinis
                        <small>Admin Panel</small>
                    </div>
                </Link>

                <nav className="adm-sidebar-nav">
                    {navSections.map((section) => (
                        <div key={section.label}>
                            <div className="adm-nav-section-label">{section.label}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) => `adm-nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="adm-sidebar-footer">
                    <Link
                        to="/dashboard"
                        className="adm-sidebar-footer-link"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <ExternalLink size={16} />
                        View Site
                    </Link>
                    <button className="adm-sidebar-footer-link danger" onClick={handleLogout}>
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="adm-overlay open" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="adm-main">
                <header className="adm-topbar">
                    <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}>
                        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <div className="adm-topbar-spacer" />

                    <span className="adm-topbar-badge">System Online</span>

                    <div className="adm-topbar-time">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {' '}
                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </header>

                <div className="adm-body">
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsersManager />} />
                        <Route path="content" element={<AdminContentManager />} />
                        <Route path="curriculum" element={<AdminCurriculumManager />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
