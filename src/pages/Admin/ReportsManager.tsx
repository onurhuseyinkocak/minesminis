import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    ExternalLink,
    Trash2,
    Filter,
    Search,
    RefreshCw,
    Users,
    Gamepad2,
    Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';
import './ReportsManager.css';

interface Report {
    id: string;
    user_id: string | null;
    page_url: string;
    page_path?: string;
    content: string;
    status: 'open' | 'resolved';
    created_at: string;
    user_email?: string;
}

interface ActiveUser {
    user_id: string;
    display_name: string;
    email: string;
    activity_count: number;
}

interface GameTypeStat {
    game_type: string;
    play_count: number;
}

interface DailyActive {
    date: string;
    count: number;
}

const ReportsManager: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Real analytics state
    const [topUsers, setTopUsers] = useState<ActiveUser[]>([]);
    const [gameStats, setGameStats] = useState<GameTypeStat[]>([]);
    const [dailyActives, setDailyActives] = useState<DailyActive[]>([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            // Top 10 most active users by activity_logs count
            const { data: logData } = await supabase
                .from('activity_logs')
                .select('user_id');

            if (logData && logData.length > 0) {
                // Count per user
                const countMap: Record<string, number> = {};
                for (const row of logData as { user_id: string | null }[]) {
                    if (!row.user_id) continue;
                    countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1;
                }
                const sortedUserIds = Object.entries(countMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10);

                if (sortedUserIds.length > 0) {
                    const ids = sortedUserIds.map(([id]) => id);
                    const { data: usersData } = await supabase
                        .from('users')
                        .select('id, display_name, email')
                        .in('id', ids);

                    const usersMap: Record<string, { display_name: string; email: string }> = {};
                    for (const u of (usersData || []) as { id: string; display_name: string; email: string }[]) {
                        usersMap[u.id] = { display_name: u.display_name, email: u.email };
                    }

                    setTopUsers(sortedUserIds.map(([user_id, activity_count]) => ({
                        user_id,
                        display_name: usersMap[user_id]?.display_name || user_id.slice(0, 8) + '…',
                        email: usersMap[user_id]?.email || '-',
                        activity_count,
                    })));
                }
            }

            // Most played game types from activity_logs where type = 'game'
            const { data: gameData } = await supabase
                .from('activity_logs')
                .select('metadata')
                .eq('type', 'game');

            if (gameData && gameData.length > 0) {
                const typeCount: Record<string, number> = {};
                for (const row of gameData as { metadata: Record<string, unknown> | null }[]) {
                    const gameType = (row.metadata?.game_type as string) || (row.metadata?.type as string) || 'unknown';
                    typeCount[gameType] = (typeCount[gameType] ?? 0) + 1;
                }
                const sorted = Object.entries(typeCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([game_type, play_count]) => ({ game_type, play_count }));
                setGameStats(sorted.length > 0 ? sorted : [{ game_type: 'Games (total)', play_count: gameData.length }]);
            }

            // Daily active users for last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const { data: dailyData } = await supabase
                .from('activity_logs')
                .select('user_id, created_at')
                .gte('created_at', sevenDaysAgo.toISOString());

            if (dailyData) {
                const dayMap: Record<string, Set<string>> = {};
                for (let i = 0; i < 7; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const key = d.toISOString().slice(0, 10);
                    dayMap[key] = new Set();
                }
                for (const row of dailyData as { user_id: string | null; created_at: string }[]) {
                    const key = row.created_at.slice(0, 10);
                    if (key in dayMap && row.user_id) {
                        dayMap[key].add(row.user_id);
                    }
                }
                setDailyActives(
                    Object.entries(dayMap)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, set]) => ({ date, count: set.size }))
                );
            }
        } catch {
            // Analytics silently degrade — not critical
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch {
            // Simulated data for demo if table doesn't exist yet
            setReports([
                { id: '1', user_id: 'dev', page_url: '/games', content: 'Oyun yüklenmiyor, siyah ekran kalıyor.', status: 'open', created_at: new Date().toISOString() },
                { id: '2', user_id: null, page_url: '/words', content: 'Kelime telaffuzları bazen çalışmıyor.', status: 'resolved', created_at: new Date(Date.now() - 86400000).toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: string) => {
        try {
            const { error } = await supabase
                .from('reports')
                .update({ status: 'resolved' })
                .eq('id', id);

            if (error) throw error;

            setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
            toast.success('Rapor çözüldü olarak işaretlendi!');
        } catch {
            toast.error('Güncelleme yapılamadı.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu raporu silmek istediğine emin misin?')) return;

        try {
            const { error } = await supabase
                .from('reports')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setReports(prev => prev.filter(r => r.id !== id));
            toast.success('Rapor silindi.');
        } catch {
            toast.error('Silme işlemi başarısız.');
        }
    };

    const getPageDisplay = (r: Report) => r.page_path || (r.page_url?.startsWith('http') ? new URL(r.page_url).pathname : r.page_url) || '/';
    const getPageHref = (r: Report) => r.page_url?.startsWith('http') ? r.page_url : `${window.location.origin}${(r.page_path || r.page_url || '/').replace(/^\/?/, '/')}`;

    const filteredReports = reports.filter(report => {
        const matchesFilter = filter === 'all' || report.status === filter;
        const matchesSearch = report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.page_url.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="admin-manager-container">
            <div className="admin-section-header">
                <div>
                    <h1>Raporlar & Analitik</h1>
                    <p>Kullanıcı aktivitesi ve hata bildirimleri.</p>
                </div>
                <button type="button" className="refresh-btn" onClick={() => { fetchReports(); fetchAnalytics(); }} disabled={loading || analyticsLoading}>
                    <RefreshCw size={18} className={(loading || analyticsLoading) ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* ── Real Analytics Section ── */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} /> Kullanici Aktivitesi (activity_logs)
                </h2>

                {analyticsLoading ? (
                    <div className="admin-loading-state" style={{ minHeight: '80px' }}>
                        <div className="spinner" />
                        <p>Analitik yükleniyor...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

                        {/* Top 10 Active Users */}
                        <div style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: '10px', padding: '16px' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Users size={15} /> En Aktif 10 Kullanici
                            </h3>
                            {topUsers.length === 0 ? (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #888)' }}>Henuz aktivite logu yok.</p>
                            ) : (
                                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem' }}>
                                    {topUsers.map((u) => (
                                        <li key={u.user_id} style={{ marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 500 }}>{u.display_name}</span>
                                            <span style={{ color: 'var(--text-secondary, #888)', marginLeft: '6px' }}>({u.activity_count} aktivite)</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>

                        {/* Most Played Game Types */}
                        <div style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: '10px', padding: '16px' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Gamepad2 size={15} /> En Cok Oynanan Oyunlar
                            </h3>
                            {gameStats.length === 0 ? (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #888)' }}>Henuz oyun aktivitesi yok.</p>
                            ) : (
                                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem' }}>
                                    {gameStats.map((g) => (
                                        <li key={g.game_type} style={{ marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 500 }}>{g.game_type}</span>
                                            <span style={{ color: 'var(--text-secondary, #888)', marginLeft: '6px' }}>({g.play_count} oynama)</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>

                        {/* Daily Active Users — Last 7 Days */}
                        <div style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: '10px', padding: '16px' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Activity size={15} /> Gunluk Aktif Kullanici (Son 7 Gun)
                            </h3>
                            {dailyActives.length === 0 ? (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #888)' }}>Veri yok.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {dailyActives.map((d) => {
                                        const maxCount = Math.max(...dailyActives.map(x => x.count), 1);
                                        return (
                                            <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                                                <span style={{ width: '80px', color: 'var(--text-secondary, #888)', flexShrink: 0 }}>{d.date.slice(5)}</span>
                                                <div style={{ flex: 1, background: 'var(--bg-muted, #f3f4f6)', borderRadius: '4px', height: '14px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(d.count / maxCount) * 100}%`, background: 'var(--accent-blue, #6366f1)', height: '100%', borderRadius: '4px', transition: 'width 0.3s' }} />
                                                </div>
                                                <span style={{ width: '28px', textAlign: 'right', fontWeight: 500 }}>{d.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bug / Feedback Reports Section ── */}
            <div className="admin-section-header" style={{ borderTop: '1px solid var(--border, #e5e7eb)', paddingTop: '24px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Hata & Geri Bildirim Raporlari</h2>
                    <p>Kullanıcılardan gelen sorunları buradan takip edebilirsin.</p>
                </div>
            </div>

            <div className="admin-controls-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Raporlarda ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Hepsi
                    </button>
                    <button
                        className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                        onClick={() => setFilter('open')}
                    >
                        Açık
                    </button>
                    <button
                        className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
                        onClick={() => setFilter('resolved')}
                    >
                        Çözüldü
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading-state">
                    <div className="spinner"></div>
                    <p>Raporlar yükleniyor...</p>
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="admin-empty-state">
                    <AlertCircle size={48} />
                    <h3>Rapor Bulunamadı</h3>
                    <p>Henüz bildirilmiş bir sorun yok veya filtreye uygun sonuç bulunamadı.</p>
                </div>
            ) : (
                <div className="reports-grid">
                    {filteredReports.map((report) => (
                        <div key={report.id} className={`report-admin-card ${report.status}`}>
                            <div className="report-card-header">
                                <span className={`status-badge ${report.status}`}>
                                    {report.status === 'resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                    {report.status === 'resolved' ? 'Çözüldü' : 'Beklemede'}
                                </span>
                                <span className="report-date">
                                    {new Date(report.created_at).toLocaleString('tr-TR')}
                                </span>
                            </div>

                            <div className="report-card-body">
                                <p className="report-content">{report.content}</p>
                                <div className="report-metadata">
                                    <div className="metadata-item">
                                        <Filter size={14} />
                                        <span>Sayfa: <a href={getPageHref(report)} target="_blank" rel="noreferrer">{getPageDisplay(report)} <ExternalLink size={12} /></a></span>
                                    </div>
                                    {report.user_id && (
                                        <div className="metadata-item">
                                            <AlertCircle size={14} />
                                            <span>Kullanıcı ID: {report.user_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="report-card-actions">
                                {report.status === 'open' && (
                                    <button
                                        className="resolve-action-btn"
                                        onClick={() => handleResolve(report.id)}
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>Çözüldü Olarak İşaretle</span>
                                    </button>
                                )}
                                <button
                                    className="delete-action-btn"
                                    onClick={() => handleDelete(report.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportsManager;
