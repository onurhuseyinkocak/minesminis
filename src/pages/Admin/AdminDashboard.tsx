import { useState, useEffect } from 'react';
import {
    Gamepad2,
    Video,
    BookOpen,
    FileText,
    Users,
    TrendingUp,
    DollarSign,
    Crown,
    Calendar,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    PieChart,
    Clock,
    Target,
    Zap,
    AlertTriangle,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { getAllGames } from '../../data/gamesData';
import { videos } from '../../data/videosData';
import { worksheetsData } from '../../data/worksheetsData';
import { kidsWords } from '../../data/wordsData';

interface RecentUser {
    id: string;
    display_name: string;
    avatar_emoji: string | null;
    role: string;
    created_at: string;
    is_premium: boolean;
}

interface FinancialStats {
    totalRevenue: number;
    monthlyRevenue: number;
    previousMonthRevenue: number;
    growthPercentage: number;
    premiumUsers: number;
    newPremiumThisMonth: number;
    averageRevenuePerUser: number;
    projectedAnnualRevenue: number;
}

interface ActivityLog {
    id: string;
    action: string;
    user: string;
    timestamp: Date;
    type: 'success' | 'warning' | 'info';
}

// Sample financial data for development - REMOVED

function AdminDashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [financialStats] = useState<FinancialStats>({
        totalRevenue: 0,
        monthlyRevenue: 0,
        previousMonthRevenue: 0,
        growthPercentage: 0,
        premiumUsers: 0,
        newPremiumThisMonth: 0,
        averageRevenuePerUser: 0,
        projectedAnnualRevenue: 0
    });
    const [activityLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const gamesCount = getAllGames().length;
    const videosCount = videos.length;
    const wordsCount = kidsWords.length;
    const worksheetsCount = worksheetsData.length;

    useEffect(() => {
        loadDashboardData();

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load users
            const { data: users, error } = await supabase
                .from('users')
                .select('id, display_name, avatar_emoji, role, created_at, is_premium')
                .order('created_at', { ascending: false })
                .limit(10);

            if (!error && users) {
                setTotalUsers(users.length); // Note: This only counts loaded users, for total count we might need count query
                setRecentUsers(users.slice(0, 4));
            }

            // In production, load real financial data from Supabase
            // For now, initialized with zeros until backend implementation
        } catch (error) {
            console.error('Dashboard load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    const formatTimeAgo = (date: Date) => {
        const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
        if (minutes < 1) return 'Az önce';
        if (minutes < 60) return `${minutes} dk önce`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} saat önce`;
        return `${Math.floor(hours / 24)} gün önce`;
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-loading-spinner"></div>
                    <p>Dashboard yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page admin-dashboard">
            {/* Header with time */}
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>👋 Hoş Geldiniz, Admin!</h1>
                    <p>Mimi's Learning Platform yönetim paneli</p>
                </div>
                <div style={{ textAlign: 'right', color: '#64748b' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                        {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                        {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </div>

            {/* Financial Stats Row */}
            <div className="dashboard-section">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <DollarSign size={24} style={{ color: '#10b981' }} />
                    Finansal Özet
                </h2>
                <div className="stats-grid financial-stats">
                    <div className="stat-card stat-card-large" style={{ '--stat-color': '#10b981', '--stat-bg': 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' } as React.CSSProperties}>
                        <div className="stat-icon"><DollarSign size={28} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{formatCurrency(financialStats.totalRevenue)}</span>
                            <span className="stat-label">Toplam Gelir</span>
                        </div>
                        <div className="stat-badge success">
                            <TrendingUp size={14} /> Tüm Zamanlar
                        </div>
                    </div>

                    <div className="stat-card stat-card-large" style={{ '--stat-color': '#6366f1', '--stat-bg': 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' } as React.CSSProperties}>
                        <div className="stat-icon"><Calendar size={28} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{formatCurrency(financialStats.monthlyRevenue)}</span>
                            <span className="stat-label">Bu Ay Gelir</span>
                        </div>
                        <div className={`stat-badge ${financialStats.growthPercentage >= 0 ? 'success' : 'danger'}`}>
                            {financialStats.growthPercentage >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            %{Math.abs(financialStats.growthPercentage).toFixed(1)}
                        </div>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-bg': '#fffbeb' } as React.CSSProperties}>
                        <div className="stat-icon"><Crown size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{financialStats.premiumUsers}</span>
                            <span className="stat-label">Premium Üye</span>
                        </div>
                        <small style={{ color: '#22c55e', fontWeight: 600 }}>+{financialStats.newPremiumThisMonth} bu ay</small>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-bg': '#f5f3ff' } as React.CSSProperties}>
                        <div className="stat-icon"><Target size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{formatCurrency(financialStats.averageRevenuePerUser)}</span>
                            <span className="stat-label">Ortalama Gelir/Kullanıcı</span>
                        </div>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#ec4899', '--stat-bg': '#fdf2f8' } as React.CSSProperties}>
                        <div className="stat-icon"><BarChart3 size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{formatCurrency(financialStats.projectedAnnualRevenue)}</span>
                            <span className="stat-label">Yıllık Projeksiyon</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Stats Row */}
            <div className="dashboard-section">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <PieChart size={24} style={{ color: '#6366f1' }} />
                    İçerik İstatistikleri
                </h2>
                <div className="stats-grid">
                    <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-bg': '#fffbeb' } as React.CSSProperties}>
                        <div className="stat-icon"><Gamepad2 size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{gamesCount}</span>
                            <span className="stat-label">Oyun</span>
                        </div>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#ef4444', '--stat-bg': '#fef2f2' } as React.CSSProperties}>
                        <div className="stat-icon"><Video size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{videosCount}</span>
                            <span className="stat-label">Video</span>
                        </div>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#22c55e', '--stat-bg': '#f0fdf4' } as React.CSSProperties}>
                        <div className="stat-icon"><BookOpen size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{wordsCount}</span>
                            <span className="stat-label">Kelime</span>
                        </div>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#6366f1', '--stat-bg': '#eef2ff' } as React.CSSProperties}>
                        <div className="stat-icon"><FileText size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{worksheetsCount}</span>
                            <span className="stat-label">Çalışma Kağıdı</span>
                        </div>
                    </div>

                    <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-bg': '#f5f3ff' } as React.CSSProperties}>
                        <div className="stat-icon"><Users size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{totalUsers}</span>
                            <span className="stat-label">Kullanıcı</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Activity */}
                <div className="dashboard-section" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <Activity size={20} style={{ color: '#6366f1' }} />
                        Son Aktiviteler
                        <button
                            onClick={loadDashboardData}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        >
                            <RefreshCw size={16} />
                        </button>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {activityLogs.map(log => (
                            <div
                                key={log.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    borderLeft: `3px solid ${log.type === 'success' ? '#22c55e' : log.type === 'warning' ? '#f59e0b' : '#6366f1'}`
                                }}
                            >
                                {log.type === 'success' && <CheckCircle size={18} style={{ color: '#22c55e' }} />}
                                {log.type === 'warning' && <AlertTriangle size={18} style={{ color: '#f59e0b' }} />}
                                {log.type === 'info' && <Zap size={18} style={{ color: '#6366f1' }} />}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '0.875rem' }}>{log.action}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{log.user}</div>
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} />
                                    {formatTimeAgo(log.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="dashboard-section" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <Users size={20} style={{ color: '#8b5cf6' }} />
                        Son Kayıtlar
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentUsers.map(user => (
                            <div
                                key={user.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px'
                                }}
                            >
                                <span style={{ fontSize: '1.75rem' }}>{user.avatar_emoji || '👤'}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {user.display_name}
                                        {user.is_premium && <Crown size={14} style={{ color: '#f59e0b' }} />}
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                        {user.role === 'teacher' ? '👩‍🏫 Öğretmen' : user.role === 'admin' ? '🛡️ Admin' : '📚 Öğrenci'}
                                    </div>
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="dashboard-section" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '1.5rem',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>%{financialStats.growthPercentage.toFixed(1)}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Aylık Büyüme</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{((financialStats.premiumUsers / totalUsers) * 100).toFixed(0)}%</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Premium Oranı</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{gamesCount + videosCount + wordsCount + worksheetsCount}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Toplam İçerik</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>99.9%</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
