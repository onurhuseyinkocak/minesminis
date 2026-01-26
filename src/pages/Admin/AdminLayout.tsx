import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Gamepad2,
    Video,
    BookOpen,
    FileText,
    Users,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Crown,
    Search,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import AdminDashboard from './AdminDashboard';
import GamesManager from './GamesManager';
import VideosManager from './VideosManager';
import WordsManager from './WordsManager';
import WorksheetsManager from './WorksheetsManager';
import UsersManager from './UsersManager';
import SiteSettings from './SiteSettings';
import PremiumManager from './PremiumManager';
import SEOManager from './SEOManager';
import AdminMimi from './AdminMimi';
import ReportsManager from './ReportsManager';
import './Admin.css';

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/games', icon: Gamepad2, label: 'Oyunlar' },
    { path: '/admin/videos', icon: Video, label: 'Videolar' },
    { path: '/admin/words', icon: BookOpen, label: 'Kelimeler' },
    { path: '/admin/worksheets', icon: FileText, label: 'Çalışma Kağıtları' },
    { path: '/admin/users', icon: Users, label: 'Kullanıcılar' },
    { path: '/admin/premium', icon: Crown, label: 'Premium' },
    { path: '/admin/reports', icon: AlertCircle, label: 'Raporlar' },
    { path: '/admin/seo', icon: Search, label: 'SEO' },
    { path: '/admin/settings', icon: Settings, label: 'Ayarlar' },
];

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const { user, signOut } = useAuth();
    const [password, setPassword] = useState('');

    useEffect(() => {
        checkAdminStatus();
    }, [user]);

    const handleLogout = async () => {
        console.log("Logging out...");
        await signOut();
        setIsAdmin(false);
        setPassword('');
        // Force reload to ensure state is clear
        window.location.href = '/admin';
    };

    const checkAdminStatus = async () => {
        const isDev = import.meta.env.DEV;

        if (!user) {
            setIsAdmin(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .select('role, is_admin')
                .eq('id', user.id)
                .maybeSingle();

            if (error || !data) {
                console.error('Admin check warning:', error);
                // If no data or error, AND in dev mode, allow access ONLY via password check below
                // But for checkAdminStatus, we initially deny.
                // The password flow overrides this.
                // Actually, if we are already logged in as a user, we check permissions.
                // IF permissions fail, we revert to isAdmin=false so they see the login screen again.
                if (isDev) {
                    // In dev mode, if user is logged in but has no entry,
                    // we might want to let them see the login screen to enter the admin password manually.
                    // So we treat them as not-admin.
                    setIsAdmin(false);
                    return;
                }
                setIsAdmin(false);
                return;
            }

            setIsAdmin(data.role === 'admin' || data.is_admin === true);
        } catch (err) {
            console.error('Admin check failed:', err);
            setIsAdmin(false);
        }
    };

    const handlePasswordLogin = () => {
        if (password === 'admin123') {
            setIsAdmin(true);
        } else {
            alert('Access Denied: Invalid Password');
        }
    };

    if (isAdmin === null) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner"></div>
                <p>Yetki kontrol ediliyor...</p>
            </div>
        );
    }

    // Dedicated Admin Login Screen for unauthorized users
    if (!isAdmin) {
        return (
            <div className="admin-login-screen">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <span className="admin-login-icon">🛡️</span>
                        <h1>Admin Panel</h1>
                        <p>Secure Access Only</p>
                    </div>

                    <div className="admin-login-form">
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Enter Admin Password"
                                className="admin-password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handlePasswordLogin();
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="admin-login-btn"
                            onClick={handlePasswordLogin}
                        >
                            🔐 Authenticate
                        </button>
                    </div>
                </div>
                <style>{`
                    .admin-login-screen {
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #0f172a;
                        color: white;
                    }
                    .admin-login-card {
                        background: #1e293b;
                        padding: 3rem;
                        border-radius: 24px;
                        text-align: center;
                        width: 100%;
                        max-width: 400px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        border: 1px solid #334155;
                    }
                    .admin-login-icon {
                        font-size: 4rem;
                        display: block;
                        margin-bottom: 1rem;
                    }
                    .admin-login-header h1 {
                        font-size: 2rem;
                        margin-bottom: 0.5rem;
                        font-weight: 800;
                    }
                    .admin-login-header p {
                        color: #94a3b8;
                        margin-bottom: 2rem;
                    }
                    .input-group {
                        margin-bottom: 1rem;
                    }
                    .admin-password-input {
                        width: 100%;
                        padding: 1rem;
                        background: #334155;
                        border: 1px solid #475569;
                        border-radius: 12px;
                        color: white;
                        font-size: 1rem;
                        outline: none;
                        transition: border-color 0.2s;
                    }
                    .admin-password-input:focus {
                        border-color: #6366f1;
                    }
                    .admin-login-btn {
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-weight: 700;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .admin-login-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <div className="admin-mobile-header">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h1 className="mobile-title">🐻 Mimi's Admin</h1>
            </div>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">🐻</span>
                        {sidebarOpen && <span className="logo-text">Mimi's Admin</span>}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <ChevronRight className={`toggle-icon ${sidebarOpen ? 'open' : ''}`} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'collapsed' : ''}`
                            }
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <item.icon size={20} className="nav-icon" />
                            {sidebarOpen && <span className="nav-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Çıkış Yap</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="games" element={<GamesManager />} />
                    <Route path="videos" element={<VideosManager />} />
                    <Route path="words" element={<WordsManager />} />
                    <Route path="worksheets" element={<WorksheetsManager />} />
                    <Route path="users" element={<UsersManager />} />
                    <Route path="premium" element={<PremiumManager />} />
                    <Route path="reports" element={<ReportsManager />} />
                    <Route path="seo" element={<SEOManager />} />
                    <Route path="settings" element={<SiteSettings />} />
                </Routes>
            </main>

            {/* Admin Mimi Assistant */}
            <AdminMimi />
        </div>
    );
}

export default AdminLayout;
