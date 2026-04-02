import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Gamepad2,
    Video,
    BookOpen,
    FileText,
    Crown,
    Activity,
    RefreshCw,
    Plus,
    BarChart3,
    ArrowUpRight,
    Server,
    Database,
    Wifi
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { supabase } from '../../config/supabase';
import { fallbackGames, fallbackVideos, fallbackWorksheets } from '../../data/fallbackData';
import { kidsWords } from '../../data/wordsData';
import './AdminDashboard.css';

interface UserSettings {
    is_premium?: boolean;
    [key: string]: unknown;
}

interface RecentUser {
    id: string;
    display_name: string;
    email?: string;
    settings?: UserSettings;
    role: string;
    created_at: string;
}

interface SupabaseUserRow {
    id: string;
    display_name: string;
    email?: string;
    settings?: UserSettings;
    role: string;
    created_at: string;
    is_online?: boolean;
}

const buildGrowthData = (dailyCounts: Record<string, number>) => {
    const days: { day: string; users: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        days.push({ day: label, users: dailyCounts[key] ?? 0 });
    }
    return days;
};

function AdminDashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeToday, setActiveToday] = useState(0);
    const [premiumUsers, setPremiumUsers] = useState(0);
    const [gamesCount, setGamesCount] = useState(0);
    const [videosCount, setVideosCount] = useState(0);
    const [wordsCount, setWordsCount] = useState(0);
    const [worksheetsCount, setWorksheetsCount] = useState(0);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [growthData, setGrowthData] = useState<{ day: string; users: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setDbStatus('checking');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [usersRes, userCountRes, gamesRes, videosRes, wordsRes, worksheetsRes, growthRes, premiumCountRes, activeTodayRes] = await Promise.allSettled([
            supabase.from('users').select('id, display_name, email, settings, role, created_at, is_online').order('created_at', { ascending: false }).limit(10),
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('games').select('*', { count: 'exact', head: true }),
            supabase.from('videos').select('*', { count: 'exact', head: true }),
            supabase.from('words').select('*', { count: 'exact', head: true }),
            supabase.from('worksheets').select('*', { count: 'exact', head: true }),
            supabase.from('users').select('created_at').gte('created_at', sevenDaysAgo.toISOString()),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
            supabase.from('users').select('*', { count: 'exact', head: true }).gte('updated_at', todayStart.toISOString()),
        ]);

        if (usersRes.status === 'fulfilled' && !usersRes.value.error && usersRes.value.data) {
            const data = usersRes.value.data as SupabaseUserRow[];
            setRecentUsers(data.slice(0, 6).map(({ id, display_name, email, settings, role, created_at }) => ({
                id, display_name, email, settings, role, created_at,
            })));
        }

        if (premiumCountRes.status === 'fulfilled' && !premiumCountRes.value.error) {
            setPremiumUsers(premiumCountRes.value.count ?? 0);
        }

        if (activeTodayRes.status === 'fulfilled' && !activeTodayRes.value.error) {
            setActiveToday(activeTodayRes.value.count ?? 0);
        }

        if (userCountRes.status === 'fulfilled' && !userCountRes.value.error) {
            setTotalUsers(userCountRes.value.count ?? 0);
        }

        if (gamesRes.status === 'fulfilled' && !gamesRes.value.error) {
            setGamesCount(gamesRes.value.count ?? fallbackGames.length);
        } else {
            setGamesCount(fallbackGames.length);
        }

        if (videosRes.status === 'fulfilled' && !videosRes.value.error) {
            setVideosCount(videosRes.value.count ?? fallbackVideos.length);
        } else {
            setVideosCount(fallbackVideos.length);
        }

        if (wordsRes.status === 'fulfilled' && !wordsRes.value.error) {
            setWordsCount(wordsRes.value.count ?? kidsWords.length);
        } else {
            setWordsCount(kidsWords.length);
        }

        if (worksheetsRes.status === 'fulfilled' && !worksheetsRes.value.error) {
            setWorksheetsCount(worksheetsRes.value.count ?? fallbackWorksheets.length);
        } else {
            setWorksheetsCount(fallbackWorksheets.length);
        }

        // System health: DB is healthy if at least one query succeeded
        const anySuccess = [userCountRes, gamesRes, videosRes, wordsRes, worksheetsRes].some(
            (r) => r.status === 'fulfilled' && !r.value.error
        );
        setDbStatus(anySuccess ? 'ok' : 'error');

        if (growthRes.status === 'fulfilled' && !growthRes.value.error && growthRes.value.data) {
            const dailyCounts: Record<string, number> = {};
            for (const row of growthRes.value.data as { created_at: string }[]) {
                const day = row.created_at.split('T')[0];
                dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
            }
            setGrowthData(buildGrowthData(dailyCounts));
        } else {
            setGrowthData(buildGrowthData({}));
        }

        setLoading(false);
    };

    const totalContent = gamesCount + videosCount + wordsCount + worksheetsCount;

    if (loading) {
        return (
            <div className="adm-loading">
                <div className="adm-spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="adm-dash">
            {/* Header */}
            <div className="adm-dash-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your MinesMinis platform</p>
                </div>
                <div className="adm-dash-actions">
                    <button type="button" className="adm-action-btn" onClick={loadDashboardData}>
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                    <Link to="/admin/content" className="adm-action-btn primary">
                        <Plus size={14} />
                        Add Content
                    </Link>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="adm-metrics-grid">
                <div className="adm-metric-card">
                    <div className="adm-metric-top">
                        <div className="adm-metric-icon blue"><Users size={18} /></div>
                    </div>
                    <div className="adm-metric-value">{totalUsers.toLocaleString()}</div>
                    <div className="adm-metric-label">Total Users</div>
                </div>

                <div className="adm-metric-card">
                    <div className="adm-metric-top">
                        <div className="adm-metric-icon green"><Activity size={18} /></div>
                        <span className="adm-metric-change up">
                            <ArrowUpRight size={10} /> Active
                        </span>
                    </div>
                    <div className="adm-metric-value">{activeToday}</div>
                    <div className="adm-metric-label">Active Today</div>
                </div>

                <div className="adm-metric-card">
                    <div className="adm-metric-top">
                        <div className="adm-metric-icon amber"><Crown size={18} /></div>
                    </div>
                    <div className="adm-metric-value">{premiumUsers}</div>
                    <div className="adm-metric-label">Premium Users</div>
                </div>

                <div className="adm-metric-card">
                    <div className="adm-metric-top">
                        <div className="adm-metric-icon purple"><BookOpen size={18} /></div>
                    </div>
                    <div className="adm-metric-value">{totalContent.toLocaleString()}</div>
                    <div className="adm-metric-label">Total Content</div>
                </div>
            </div>

            {/* User Growth Chart + Activity Feed */}
            <div className="adm-dash-row">
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">
                            <BarChart3 size={16} />
                            User Growth
                        </div>
                        <span className="adm-card-header-sub">Last 7 days</span>
                    </div>
                    <div className="adm-chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={growthData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-dark)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--primary-dark)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: 'var(--stone)' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: 'var(--stone)' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--cloud)',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="var(--primary-dark)"
                                    strokeWidth={2}
                                    fill="url(#growthGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">
                            <Activity size={16} />
                            Recent Signups
                        </div>
                        <button
                            className="adm-action-btn adm-action-btn-sm"
                            onClick={loadDashboardData}
                        >
                            <RefreshCw size={12} />
                        </button>
                    </div>
                    <div className="adm-card-body no-pad">
                        {recentUsers.length === 0 && (
                            <div className="adm-empty">No recent users</div>
                        )}
                        {recentUsers.map(user => (
                            <div key={user.id} className="adm-activity-item">
                                <div className={`adm-activity-dot ${user.role === 'admin' ? 'amber' : user.role === 'teacher' ? 'purple' : 'green'}`} />
                                <div className="adm-activity-content">
                                    <div className="adm-activity-text">
                                        <strong>{user.display_name || 'Anonymous'}</strong>
                                        {' '}registered
                                        {user.settings?.is_premium === true && (
                                            <Crown size={12} className="adm-crown-inline" />
                                        )}
                                    </div>
                                    <div className="adm-activity-time">
                                        {user.email && <span>{user.email} &middot; </span>}
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Inventory + Quick Actions + System Health */}
            <div className="adm-dash-row cols-3">
                {/* Content Inventory */}
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">Content Inventory</div>
                    </div>
                    <div className="adm-card-body no-pad">
                        <div className="adm-inventory-grid">
                            <div className="adm-inventory-item">
                                <div className="adm-inventory-icon warning">
                                    <Gamepad2 size={18} />
                                </div>
                                <div className="adm-inventory-info">
                                    <div className="adm-inventory-count">{gamesCount}</div>
                                    <div className="adm-inventory-label">Games</div>
                                </div>
                            </div>
                            <div className="adm-inventory-item">
                                <div className="adm-inventory-icon error">
                                    <Video size={18} />
                                </div>
                                <div className="adm-inventory-info">
                                    <div className="adm-inventory-count">{videosCount}</div>
                                    <div className="adm-inventory-label">Videos</div>
                                </div>
                            </div>
                            <div className="adm-inventory-item">
                                <div className="adm-inventory-icon success">
                                    <BookOpen size={18} />
                                </div>
                                <div className="adm-inventory-info">
                                    <div className="adm-inventory-count">{wordsCount}</div>
                                    <div className="adm-inventory-label">Words</div>
                                </div>
                            </div>
                            <div className="adm-inventory-item">
                                <div className="adm-inventory-icon purple">
                                    <FileText size={18} />
                                </div>
                                <div className="adm-inventory-info">
                                    <div className="adm-inventory-count">{worksheetsCount}</div>
                                    <div className="adm-inventory-label">Worksheets</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">Quick Actions</div>
                    </div>
                    <div className="adm-quick-grid">
                        <Link to="/admin/content" className="adm-quick-btn">
                            <Plus size={20} />
                            <span>Add Word</span>
                        </Link>
                        <Link to="/admin/curriculum" className="adm-quick-btn">
                            <BookOpen size={20} />
                            <span>Add Lesson</span>
                        </Link>
                        <Link to="/admin/analytics" className="adm-quick-btn">
                            <BarChart3 size={20} />
                            <span>Analytics</span>
                        </Link>
                    </div>
                </div>

                {/* System Health */}
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">System Health</div>
                    </div>
                    <div className="adm-card-body no-pad">
                        <div className="adm-health-bar">
                            <Server size={15} className="adm-icon-muted" />
                            <span className="adm-health-label">API Server</span>
                            <span className={`adm-health-status ${dbStatus === 'checking' ? 'checking' : dbStatus === 'ok' ? 'ok' : 'error'}`}>
                                {dbStatus === 'checking' ? 'Checking...' : dbStatus === 'ok' ? 'Operational' : 'Error'}
                            </span>
                        </div>
                        <div className="adm-health-bar">
                            <Database size={15} className="adm-icon-muted" />
                            <span className="adm-health-label">Database</span>
                            <span className={`adm-health-status ${dbStatus === 'checking' ? 'checking' : dbStatus === 'ok' ? 'ok' : 'error'}`}>
                                {dbStatus === 'checking' ? 'Checking...' : dbStatus === 'ok' ? 'Healthy' : 'Unreachable'}
                            </span>
                        </div>
                        <div className="adm-health-bar">
                            <Wifi size={15} className="adm-icon-muted" />
                            <span className="adm-health-label">CDN</span>
                            <span className={`adm-health-status ${dbStatus === 'checking' ? 'checking' : dbStatus === 'ok' ? 'ok' : 'error'}`}>
                                {dbStatus === 'checking' ? 'Checking...' : dbStatus === 'ok' ? 'Online' : 'Degraded'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
