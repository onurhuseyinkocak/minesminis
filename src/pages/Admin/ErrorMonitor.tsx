import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Bug, CheckCircle, Trash2, Download, RefreshCw,
  Search, ChevronDown, ChevronUp, Clock, Monitor, Globe, User
} from 'lucide-react';
import { errorLogger, SEVERITY_COLORS, SEVERITY_BG } from '../../services/errorLogger';
import type { ErrorSeverity, ErrorLog } from '../../services/errorLogger';

const SEVERITY_LABELS: Record<ErrorSeverity, string> = {
  critical: 'Kritik',
  high: 'Yuksek',
  medium: 'Orta',
  low: 'Dusuk',
  info: 'Bilgi',
};

const SEVERITY_ICONS: Record<ErrorSeverity, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🔵',
  info: '⚪',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Az once';
  if (mins < 60) return `${mins}dk once`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa once`;
  const days = Math.floor(hours / 24);
  return `${days}g once`;
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
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Bug size={28} /> Hata Monitoru</h1>
        <p>Canli hata takibi ve analizi</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ '--stat-color': 'var(--error)', '--stat-bg': 'var(--error-pale)' } as React.CSSProperties}>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.bySeverity.critical}</span>
            <span className="stat-label">Kritik</span>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--accent-orange)', '--stat-bg': 'var(--warning-pale)' } as React.CSSProperties}>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.bySeverity.high}</span>
            <span className="stat-label">Yuksek</span>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--accent-blue)', '--stat-bg': 'var(--info-pale)' } as React.CSSProperties}>
          <div className="stat-icon"><Bug size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.unresolved}</span>
            <span className="stat-label">Cozulmemis</span>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--accent-emerald)', '--stat-bg': 'var(--success-pale)' } as React.CSSProperties}>
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.last24h}</span>
            <span className="stat-label">Son 24 Saat</span>
          </div>
        </div>
      </div>

      {/* Top Errors */}
      {stats.topErrors.length > 0 && (
        <div className="data-table-container" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
            En Sik Hatalar
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.topErrors.slice(0, 5).map((e, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0.75rem', borderRadius: '8px',
                background: SEVERITY_BG[e.severity],
                border: `1px solid ${SEVERITY_COLORS[e.severity]}20`,
              }}>
                <span style={{
                  minWidth: '28px', height: '28px', borderRadius: '50%',
                  background: SEVERITY_COLORS[e.severity], color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800,
                }}>{e.count}</span>
                <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                  {e.message}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                  borderRadius: '100px', background: SEVERITY_COLORS[e.severity],
                  color: 'white',
                }}>{SEVERITY_LABELS[e.severity]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="data-table-container">
        <div className="table-header">
          <h2>{logs.length} Hata Logu</h2>
          <div className="table-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
              <input
                type="text" placeholder="Hata ara..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input" style={{ paddingLeft: '34px', fontSize: '0.8rem', height: '36px' }}
              />
            </div>

            {/* Severity filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as ErrorSeverity | 'all')}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--cloud)', fontSize: '0.8rem', cursor: 'pointer' }}
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
              style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--cloud)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <option value="all">Tumunu Goster</option>
              <option value="unresolved">Cozulmemis</option>
              <option value="resolved">Cozulmus</option>
            </select>

            {/* Auto refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--cloud)',
                background: autoRefresh ? 'var(--success-pale)' : 'var(--bg-card)', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600,
                color: autoRefresh ? 'var(--success)' : 'var(--slate)',
              }}
            >
              <RefreshCw size={14} className={autoRefresh ? 'spin-slow' : ''} />
              {autoRefresh ? 'Canli' : 'Durdur'}
            </button>

            {/* Actions */}
            <button className="edit-btn" onClick={handleResolveAll} style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
              <CheckCircle size={14} /> Tumu Coz
            </button>
            <button className="edit-btn" onClick={handleExport} style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
              <Download size={14} /> Indir
            </button>
            <button className="delete-btn" onClick={handleClearAll}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Error List */}
        <div style={{ padding: '0 1rem 1rem' }}>
          {logs.length === 0 ? (
            <div className="no-data" style={{ padding: '3rem' }}>
              <CheckCircle size={48} style={{ opacity: 0.3, color: 'var(--accent-green)' }} />
              <p style={{ color: 'var(--slate)', marginTop: '1rem' }}>Hata bulunamadi - Her sey yolunda!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.map((log) => (
                <div key={log.id} style={{
                  border: `1px solid ${log.resolved ? 'var(--cloud)' : SEVERITY_COLORS[log.severity] + '30'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  opacity: log.resolved ? 0.6 : 1,
                  background: log.resolved ? 'var(--bg-muted)' : 'var(--bg-card)',
                }}>
                  {/* Header row */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', cursor: 'pointer',
                    }}
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  >
                    {/* Severity badge */}
                    <span style={{
                      minWidth: '70px', padding: '0.2rem 0.5rem', borderRadius: '6px',
                      fontSize: '0.7rem', fontWeight: 800, textAlign: 'center',
                      background: SEVERITY_BG[log.severity],
                      color: SEVERITY_COLORS[log.severity],
                      border: `1px solid ${SEVERITY_COLORS[log.severity]}30`,
                    }}>
                      {SEVERITY_ICONS[log.severity]} {SEVERITY_LABELS[log.severity].toUpperCase()}
                    </span>

                    {/* Message */}
                    <span style={{
                      flex: 1, fontSize: '0.82rem', fontWeight: 500,
                      color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {log.message}
                    </span>

                    {/* Count badge */}
                    {log.count > 1 && (
                      <span style={{
                        background: SEVERITY_COLORS[log.severity],
                        color: 'white', fontSize: '0.65rem', fontWeight: 800,
                        padding: '0.1rem 0.45rem', borderRadius: '100px',
                        minWidth: '20px', textAlign: 'center',
                      }}>
                        x{log.count}
                      </span>
                    )}

                    {/* Time */}
                    <span style={{ fontSize: '0.72rem', color: 'var(--stone)', whiteSpace: 'nowrap' }}>
                      {timeAgo(log.lastSeen)}
                    </span>

                    {/* Resolved indicator */}
                    {log.resolved && <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />}

                    {/* Expand icon */}
                    {expandedId === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {/* Expanded details */}
                  {expandedId === log.id && (
                    <div style={{
                      padding: '0.75rem 1rem 1rem', borderTop: '1px solid var(--mist)',
                      background: 'var(--snow)', fontSize: '0.8rem',
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate)' }}>
                          <Globe size={14} /> Sayfa: <strong style={{ color: 'var(--charcoal)' }}>{log.page || '-'}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate)' }}>
                          <Monitor size={14} /> Kaynak: <strong style={{ color: 'var(--charcoal)' }}>{log.component || '-'}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate)' }}>
                          <Clock size={14} /> Ilk: <strong style={{ color: 'var(--charcoal)' }}>{new Date(log.firstSeen).toLocaleString('tr-TR')}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate)' }}>
                          <User size={14} /> User: <strong style={{ color: 'var(--charcoal)' }}>{log.userId || 'Anonim'}</strong>
                        </div>
                      </div>

                      {/* Stack trace */}
                      {log.stack && (
                        <details style={{ marginBottom: '0.75rem' }}>
                          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--slate)', marginBottom: '0.5rem' }}>
                            Stack Trace
                          </summary>
                          <pre style={{
                            background: 'var(--mist)', color: 'var(--charcoal)', padding: '0.75rem',
                            borderRadius: '8px', fontSize: '0.72rem', overflow: 'auto',
                            maxHeight: '200px', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                            border: '1px solid var(--cloud)',
                          }}>
                            {log.stack}
                          </pre>
                        </details>
                      )}

                      {/* Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details style={{ marginBottom: '0.75rem' }}>
                          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--slate)', marginBottom: '0.5rem' }}>
                            Metadata
                          </summary>
                          <pre style={{
                            background: 'var(--mist)', color: 'var(--charcoal)', padding: '0.75rem',
                            borderRadius: '8px', fontSize: '0.72rem', overflow: 'auto',
                          }}>
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}

                      {/* Full message */}
                      <div style={{
                        background: 'var(--error-pale)', padding: '0.75rem', borderRadius: '8px',
                        color: 'var(--accent-red-dark)', fontSize: '0.78rem', marginBottom: '0.75rem',
                        wordBreak: 'break-word',
                      }}>
                        {log.message}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!log.resolved && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleResolve(log.id); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '0.4rem 0.8rem', borderRadius: '8px', border: 'none',
                              background: 'var(--accent-green)', color: 'white', fontSize: '0.78rem',
                              fontWeight: 600, cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={14} /> Cozuldu
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                          className="delete-btn"
                          style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                        >
                          <Trash2 size={14} /> Sil
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--cloud)',
                            background: 'var(--bg-card)', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', color: 'var(--text-body)',
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

      <style>{`
        @keyframes spin-slow-kf {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow { animation: spin-slow-kf 2s linear infinite; }
      `}</style>
    </div>
  );
}

export default ErrorMonitor;
