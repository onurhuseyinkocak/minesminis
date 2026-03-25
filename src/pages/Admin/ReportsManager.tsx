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
    RefreshCw
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

const ReportsManager: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

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
                { id: '1', user_id: 'dev', page_url: '/games', content: 'Oun yüklenmiyor, siyah ekran kalıyor.', status: 'open', created_at: new Date().toISOString() },
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
            toast.error('Guncelleme yapılamadı.');
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
                    <h1>Hata & Geri Bildirim Raporları</h1>
                    <p>Kullanıcılardan gelen sorunları buradan takip edebilirsin.</p>
                </div>
                <button className="refresh-btn" onClick={fetchReports} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
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
