import { useState, useEffect, useRef } from 'react';
import { Volume2, RefreshCw, Play, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TtsItem {
  id: string;
  text: string;
  instruction?: string;
}

interface BulkProgress {
  done: number;
  total: number;
  errors: number;
  running: boolean;
}

interface StatusResponse {
  ok: boolean;
  total: number;
  cached: number;
  missing: number;
  bulk: BulkProgress;
}

interface GenerateOneResponse {
  ok: boolean;
  url?: string;
  cached?: boolean;
  error?: string;
}

function getAdminHeaders(): Record<string, string> {
  const pw =
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('admin_pw') ?? ''
      : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (pw) headers['X-Admin-Password'] = pw;
  return headers;
}

function AudioManager() {
  const [items, setItems] = useState<TtsItem[]>([]);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [bulkStarting, setBulkStarting] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [itemResults, setItemResults] = useState<Record<string, 'ok' | 'error' | 'cached'>>({});
  const [ttsServerReachable, setTtsServerReachable] = useState<boolean | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load items from tts-items.json via a static fetch (bundled in public or served by API)
  useEffect(() => {
    fetch('/tts-items.json')
      .then((r) => r.json())
      .then((data: TtsItem[]) => setItems(data))
      .catch(() => {
        // If not in public, try fetching through the API status which knows the count
        setItems([]);
      });
  }, []);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const resp = await fetch('/api/tts/status', {
        headers: getAdminHeaders(),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data: StatusResponse = await resp.json();
      setStatus(data);

      // Check if bulk job finished — stop polling
      if (!data.bulk.running && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch {
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  const checkTtsServer = async () => {
    try {
      const resp = await fetch('http://localhost:7700/health', {
        signal: AbortSignal.timeout(3000),
      });
      setTtsServerReachable(resp.ok);
    } catch {
      setTtsServerReachable(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    checkTtsServer();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startBulk = async () => {
    setBulkStarting(true);
    try {
      const resp = await fetch('/api/tts/generate-bulk', {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data.error ?? 'Failed to start bulk generation');
        return;
      }
      // Start polling for progress
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(fetchStatus, 2000);
      await fetchStatus();
    } catch (err) {
      alert('Error starting bulk generation: ' + String(err));
    } finally {
      setBulkStarting(false);
    }
  };

  const generateOne = async (item: TtsItem) => {
    setGeneratingId(item.id);
    try {
      const resp = await fetch('/api/tts/generate-one', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ text: item.text, key: `${item.id}.wav`, instruction: item.instruction }),
      });
      const data: GenerateOneResponse = await resp.json();
      if (data.ok) {
        setItemResults((prev) => ({ ...prev, [item.id]: data.cached ? 'cached' : 'ok' }));
        // Refresh status after generating
        fetchStatus();
      } else {
        setItemResults((prev) => ({ ...prev, [item.id]: 'error' }));
        alert('Error: ' + (data.error ?? 'Unknown error'));
      }
    } catch (err) {
      setItemResults((prev) => ({ ...prev, [item.id]: 'error' }));
      alert('Error: ' + String(err));
    } finally {
      setGeneratingId(null);
    }
  };

  const bulkRunning = status?.bulk.running ?? false;
  const bulkDone = status?.bulk.done ?? 0;
  const bulkTotal = status?.bulk.total ?? 0;
  const bulkErrors = status?.bulk.errors ?? 0;
  const pct = bulkTotal > 0 ? Math.round((bulkDone / bulkTotal) * 100) : 0;

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <Volume2 size={20} />
        <h2>Audio Manager</h2>
        <p>Manage TTS audio generation via local Qwen3 model and Supabase Storage.</p>
      </div>

      {/* TTS Server Status */}
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {ttsServerReachable === null ? (
            <Loader2 size={16} className="spin" />
          ) : ttsServerReachable ? (
            <CheckCircle size={16} color="#22c55e" />
          ) : (
            <XCircle size={16} color="#ef4444" />
          )}
          <span style={{ fontWeight: 600 }}>
            Local TTS Server (localhost:7700):{' '}
            {ttsServerReachable === null ? 'Checking...' : ttsServerReachable ? 'Online' : 'Offline'}
          </span>
          {!ttsServerReachable && ttsServerReachable !== null && (
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              Run: ~/qwen-tts-env/bin/python tts-server.py
            </span>
          )}
          <button
            type="button"
            className="adm-btn-secondary"
            onClick={checkTtsServer}
            style={{ marginLeft: 'auto' }}
          >
            <RefreshCw size={14} />
            Recheck
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="adm-stats-grid" style={{ marginBottom: 20 }}>
        <div className="adm-stat-card">
          <div className="adm-stat-number">{status?.total ?? items.length}</div>
          <div className="adm-stat-label">Total Items Needed</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-number" style={{ color: '#22c55e' }}>{status?.cached ?? 0}</div>
          <div className="adm-stat-label">Generated</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-number" style={{ color: '#f59e0b' }}>{status?.missing ?? 0}</div>
          <div className="adm-stat-label">Missing</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-number">
            {status ? Math.round((status.cached / Math.max(status.total, 1)) * 100) : 0}%
          </div>
          <div className="adm-stat-label">Complete</div>
        </div>
      </div>

      {/* Bulk Controls */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="adm-btn-primary"
            onClick={startBulk}
            disabled={bulkStarting || bulkRunning || !ttsServerReachable}
          >
            {bulkStarting ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
            {bulkRunning ? 'Generating...' : 'Generate All Missing'}
          </button>
          <button
            type="button"
            className="adm-btn-secondary"
            onClick={fetchStatus}
            disabled={loadingStatus}
          >
            {loadingStatus ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
          {bulkRunning && (
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {bulkDone} / {bulkTotal} done · {bulkErrors} errors
            </span>
          )}
        </div>

        {/* Progress bar */}
        {(bulkRunning || bulkDone > 0) && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: 8, height: 8 }}>
              <div
                style={{
                  background: '#6366f1',
                  width: `${pct}%`,
                  height: 8,
                  borderRadius: 8,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            {bulkErrors > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#ef4444', fontSize: 13 }}>
                <AlertCircle size={14} />
                {bulkErrors} items failed — check server logs
              </div>
            )}
          </div>
        )}
      </div>

      {/* Items Table */}
      {items.length > 0 && (
        <div className="adm-card">
          <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600 }}>
            All TTS Items ({items.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Text</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const result = itemResults[item.id];
                  return (
                    <tr key={item.id}>
                      <td>
                        <code style={{ fontSize: 12 }}>{item.id}</code>
                      </td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.text}
                      </td>
                      <td>
                        {result === 'ok' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22c55e' }}>
                            <CheckCircle size={14} />
                            Generated
                          </span>
                        ) : result === 'cached' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366f1' }}>
                            <CheckCircle size={14} />
                            Cached
                          </span>
                        ) : result === 'error' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444' }}>
                            <XCircle size={14} />
                            Error
                          </span>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: 13 }}>Unknown</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="adm-btn-secondary"
                          onClick={() => generateOne(item)}
                          disabled={generatingId === item.id || bulkRunning || !ttsServerReachable}
                          style={{ padding: '4px 10px', fontSize: 13 }}
                        >
                          {generatingId === item.id ? (
                            <Loader2 size={13} className="spin" />
                          ) : (
                            <Play size={13} />
                          )}
                          Generate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default AudioManager;
