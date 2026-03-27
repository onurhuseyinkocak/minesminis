import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Bug, CheckCircle, Trash2, Download, RefreshCw,
  Search, ChevronDown, ChevronUp, Clock, Monitor, Globe, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { errorLogger, SEVERITY_COLORS, SEVERITY_BG } from '../../services/errorLogger';
import './ErrorMonitor.css';
import type { ErrorSeverity, ErrorLog } from '../../services/errorLogger';

const SEVERITY_LABELS: Record<ErrorSeverity, string> = {
  critical: 'Kritik',
  high: 'Yuksek',
  medium: 'Orta',
  low: 'Dusuk',
  info: 'Bilgi',
};

const SEVERITY_DOT_COLORS: Record<ErrorSeverity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#94a3b8',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Az önce';
  if (mins < 60) return `${mins}dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa önce`;
  const days = Math.floor(hours / 24);
  return `${days}g önce`;
}

function ErrorMonitor() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState(errorLogger.getStats());
  const [severityFilter, setSeverityFilter] = useState<ErrorSeverity | 'all'>('all');
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = useCallback(() => {
    const filters: Parameters<typeof errorLogger.getLogs>[0] = {};
    if (severityFilter !== 'all') filters.severity = severityFilter;
    if (resolvedFilter === 'unresolved') filters.resolved = false;
    if (resolvedFilter === 'resolved') filters.resolved = true;
    if (searchTerm) filters.search = searchTerm;
    setLogs(errorLogger.getLogs(filters));
    setStats(errorLogger.getStats());
  }, [severityFilter, resolvedFilter, searchTerm]);

  useEffect(() => {
    refresh();
    const unsub = errorLogger.subscribe(refresh);
    return unsub;
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  const handleResolve = (id: string) => {
    errorLogger.resolve(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    errorLogger.delete(id);
    refresh();
  };

  const handleResolveAll = () => {
    if (!confirm('Tum hatalari cozulmus olarak isaretlemek istiyor musunuz?')) return;
    errorLogger.resolveAll();
    refresh();
  };

  const handleClearAll = () => {
    if (!confirm('Tum hata loglarini silmek istiyor musunuz? Bu islem geri alinamaz.')) return;
    errorLogger.clearAll();
    refresh();
  };

  const handleExport = () => {
    const data = errorLogger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Hata loglari indirildi');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Bug size={28} /> Hata Monitoru</h1>
        <p>Canli hata takibi ve analizi</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid em-stats-strip">
        <div className="stat-card" style={{ '--stat-color': '#ef4444', '--stat-bg': '#fef2f2' } as React.CSSProperties}>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.bySeverity.critical}</span>
            <span className="stat-label">Kritik</span>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#f97316', '--stat-bg': '#fff7ed' } as React.CSSProperties}>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.bySeverity.high}</span>
            <span className="stat-label">Yuksek</span>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#3b82f6', '--stat-bg': '#eff6ff' } as React.CSSProperties}>
          <div className="stat-icon"><Bug size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.unresolved}</span>
            <span className="stat-label">Cozulmemis</span>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-bg': '#ecfdf5' } as React.CSSProperties}>
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.last24h}</span>
            <span className="stat-label">Son 24 Saat</span>
          </div>
        </div>
      </div>

      {/* Top Errors */}
      {stats.topErrors.length > 0 && (
        <div className="data-table-container em-top-errors">
          <h3 className="em-top-errors-title">En Sik Hatalar</h3>
          <div className="em-top-errors-list">
            {stats.topErrors.slice(0, 5).map((e, i) => (
              <div key={i} className="em-top-error-row" style={{
                background: SEVERITY_BG[e.severity],
                border: `1px solid ${SEVERITY_COLORS[e.severity]}20`,
              }}>
                <span className="em-top-error-count" style={{ background: SEVERITY_COLORS[e.severity] }}>
                  {e.count}
                </span>
                <span className="em-top-error-message">{e.message}</span>
                <span className="em-severity-badge" style={{ background: SEVERITY_COLORS[e.severity] }}>
                  {SEVERITY_LABELS[e.severity]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="data-table-container">
        <div className="table-header">
          <h2>{logs.length} Hata Logu</h2>
          <div className="table-actions em-toolbar-actions">
            {/* Search */}
            <div className="em-search-wrap">
              <Search size={16} className="em-search-icon" />
              <input
                type="text" placeholder="Hata ara..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input em-search-input"
              />
            </div>

            {/* Severity filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as ErrorSeverity | 'all')}
              className="em-select"
            >
              <option value="all">Tum Seviyeler</option>
              <option value="critical">Kritik</option>
              <option value="high">Yuksek</option>
              <option value="medium">Orta</option>
              <option value="low">Dusuk</option>
              <option value="info">Bilgi</option>
            </select>

            {/* Resolved filter */}
            <select
              value={resolvedFilter}
              onChange={(e) => setResolvedFilter(e.target.value as 'all' | 'unresolved' | 'resolved')}
              className="em-select"
            >
              <option value="all">Tumunu Goster</option>
              <option value="unresolved">Cozulmemis</option>
              <option value="resolved">Cozulmus</option>
            </select>

            {/* Auto refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`em-live-btn ${autoRefresh ? 'em-live-btn--active' : 'em-live-btn--paused'}`}
            >
              <RefreshCw size={14} className={autoRefresh ? 'spin-slow' : ''} />
              {autoRefresh ? 'Canli' : 'Durdur'}
            </button>

            {/* Actions */}
            <button type="button" className="edit-btn em-action-btn" onClick={handleResolveAll}>
              <CheckCircle size={14} /> Tumu Coz
            </button>
            <button type="button" className="edit-btn em-action-btn" onClick={handleExport}>
              <Download size={14} /> Indir
            </button>
            <button type="button" className="delete-btn" onClick={handleClearAll}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Error List */}
        <div className="em-list-wrap">
          {logs.length === 0 ? (
            <div className="no-data em-empty">
              <CheckCircle size={48} style={{ opacity: 0.3, color: '#22c55e' }} />
              <p className="em-empty-text">Hata bulunamadi - Her sey yolunda!</p>
            </div>
          ) : (
            <div className="em-log-list">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`em-log-card ${log.resolved ? 'em-log-card--resolved' : 'em-log-card--active'}`}
                  style={{ border: `1px solid ${log.resolved ? '#e2e8f0' : SEVERITY_COLORS[log.severity] + '30'}` }}
                >
                  {/* Header row */}
                  <div
                    className="em-log-header"
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  >
                    {/* Severity badge */}
                    <span
                      className="em-severity-pill"
                      style={{
                        background: SEVERITY_BG[log.severity],
                        color: SEVERITY_COLORS[log.severity],
                        border: `1px solid ${SEVERITY_COLORS[log.severity]}30`,
                      }}
                    >
                      <span className="em-severity-dot" style={{ background: SEVERITY_DOT_COLORS[log.severity] }} />
                      {SEVERITY_LABELS[log.severity].toUpperCase()}
                    </span>

                    {/* Message */}
                    <span className="em-log-message">{log.message}</span>

                    {/* Count badge */}
                    {log.count > 1 && (
                      <span className="em-count-badge" style={{ background: SEVERITY_COLORS[log.severity] }}>
                        x{log.count}
                      </span>
                    )}

                    {/* Time */}
                    <span className="em-log-time">{timeAgo(log.lastSeen)}</span>

                    {/* Resolved indicator */}
                    {log.resolved && <CheckCircle size={14} style={{ color: '#22c55e' }} />}

                    {/* Expand icon */}
                    {expandedId === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {/* Expanded details */}
                  {expandedId === log.id && (
                    <div className="em-detail-panel">
                      <div className="em-detail-meta">
                        <div className="em-detail-meta-item">
                          <Globe size={14} /> Sayfa: <strong className="em-detail-meta-val">{log.page || '-'}</strong>
                        </div>
                        <div className="em-detail-meta-item">
                          <Monitor size={14} /> Kaynak: <strong className="em-detail-meta-val">{log.component || '-'}</strong>
                        </div>
                        <div className="em-detail-meta-item">
                          <Clock size={14} /> Ilk: <strong className="em-detail-meta-val">{new Date(log.firstSeen).toLocaleString('tr-TR')}</strong>
                        </div>
                        <div className="em-detail-meta-item">
                          <User size={14} /> User: <strong className="em-detail-meta-val">{log.userId || 'Anonim'}</strong>
                        </div>
                      </div>

                      {/* Stack trace */}
                      {log.stack && (
                        <details className="em-details-block">
                          <summary className="em-details-summary">Stack Trace</summary>
                          <pre className="em-pre-stack">{log.stack}</pre>
                        </details>
                      )}

                      {/* Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="em-details-block">
                          <summary className="em-details-summary">Metadata</summary>
                          <pre className="em-pre-meta">{JSON.stringify(log.metadata, null, 2)}</pre>
                        </details>
                      )}

                      {/* Full message */}
                      <div className="em-message-box">{log.message}</div>

                      {/* Actions */}
                      <div className="em-inline-actions">
                        {!log.resolved && (
                          <button
                            className="em-resolve-btn"
                            onClick={(e) => { e.stopPropagation(); handleResolve(log.id); }}
                          >
                            <CheckCircle size={14} /> Cozuldu
                          </button>
                        )}
                        <button
                          className="delete-btn em-delete-inline"
                          onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                        >
                          <Trash2 size={14} /> Sil
                        </button>
                        <button
                          className="em-copy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(JSON.stringify(log, null, 2))
                              .then(() => toast.success('Panoya kopyalandi'))
                              .catch(() => toast.error('Kopyalama basarisiz'));
                          }}
                        >
                          Kopyala
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ErrorMonitor;
