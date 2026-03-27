/**
 * ERROR LOGGER SERVICE
 * Captures all client-side errors, logs them with severity levels,
 * persists to localStorage, and provides admin panel integration.
 */
import * as Sentry from '@sentry/react';

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ErrorLog {
  id: string;
  timestamp: number;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  component?: string;
  page?: string;
  userId?: string;
  userAgent: string;
  url: string;
  metadata?: Record<string, unknown>;
  count: number;
  firstSeen: number;
  lastSeen: number;
  resolved: boolean;
}

const STORAGE_KEY = 'mm_error_logs';
const MAX_LOGS = 500;

let errorLogs: ErrorLog[] = [];
let listeners: Array<() => void> = [];
let initialized = false;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getErrorFingerprint(message: string, component?: string, stack?: string): string {
  const key = `${message}|${component || ''}|${(stack || '').split('\n')[1] || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function loadLogs(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      errorLogs = JSON.parse(stored);
    }
  } catch {
    errorLogs = [];
  }
}

function saveLogs(): void {
  try {
    if (errorLogs.length > MAX_LOGS) {
      errorLogs = errorLogs.slice(-MAX_LOGS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(errorLogs));
  } catch {
    // Storage full - trim aggressively
    errorLogs = errorLogs.slice(-100);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(errorLogs));
    } catch { /* give up */ }
  }
}

function notifyListeners(): void {
  listeners.forEach(fn => fn());
}

function autoDetectSeverity(error: unknown): ErrorSeverity {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes('chunk') || lower.includes('module') || lower.includes('import')) return 'critical';
  if (lower.includes('auth') || lower.includes('firebase') || lower.includes('token')) return 'critical';
  if (lower.includes('supabase') || lower.includes('database') || lower.includes('query')) return 'high';
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('cors')) return 'high';
  if (lower.includes('render') || lower.includes('component') || lower.includes('hook')) return 'high';
  if (lower.includes('undefined') || lower.includes('null') || lower.includes('typeerror')) return 'medium';
  if (lower.includes('timeout') || lower.includes('abort')) return 'medium';
  if (lower.includes('warning') || lower.includes('deprecated')) return 'low';
  if (lower.includes('info') || lower.includes('log')) return 'info';
  return 'medium';
}

export const errorLogger = {
  init(): void {
    if (initialized) return;
    initialized = true;
    loadLogs();

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.log({
        severity: 'critical',
        message: event.message || 'Unhandled error',
        stack: event.error?.stack,
        page: window.location.pathname,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      this.log({
        severity: 'critical',
        message: error?.message || String(error) || 'Unhandled promise rejection',
        stack: error?.stack,
        page: window.location.pathname,
      });
    });

    // Capture console.error
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      origError.apply(console, args);
      const msg = args.map(a => {
        if (a instanceof Error) return a.message;
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a); } catch { return String(a); }
      }).join(' ');

      // Skip React internal warnings and our own logs
      if (msg.includes('mm_error_logs') || msg.includes('errorLogger')) return;

      this.log({
        severity: autoDetectSeverity(msg),
        message: msg.substring(0, 500),
        page: window.location.pathname,
        component: 'console.error',
      });
    };
  },

  log(entry: {
    severity?: ErrorSeverity;
    message: string;
    stack?: string;
    component?: string;
    page?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }): void {
    const now = Date.now();
    const fingerprint = getErrorFingerprint(entry.message, entry.component, entry.stack);

    // Deduplicate: increment count if same error exists
    const existing = errorLogs.find(e => getErrorFingerprint(e.message, e.component, e.stack) === fingerprint && !e.resolved);
    if (existing) {
      existing.count++;
      existing.lastSeen = now;
      if (entry.severity && severityWeight(entry.severity) > severityWeight(existing.severity)) {
        existing.severity = entry.severity;
      }
      saveLogs();
      notifyListeners();
      return;
    }

    const log: ErrorLog = {
      id: generateId(),
      timestamp: now,
      severity: entry.severity || autoDetectSeverity(entry.message),
      message: entry.message,
      stack: entry.stack,
      component: entry.component,
      page: entry.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
      userId: entry.userId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
      metadata: entry.metadata,
      count: 1,
      firstSeen: now,
      lastSeen: now,
      resolved: false,
    };

    errorLogs.push(log);
    saveLogs();
    notifyListeners();

    // Forward critical/error severity to Sentry when enabled
    if (log.severity === 'critical' || log.severity === 'high') {
      try {
        if (entry.stack) {
          const err = new Error(log.message);
          err.stack = entry.stack;
          Sentry.captureException(err, {
            level: log.severity === 'critical' ? 'fatal' : 'error',
            extra: entry.metadata,
            tags: { component: entry.component ?? 'unknown', page: log.page },
          });
        } else {
          Sentry.captureMessage(log.message, {
            level: log.severity === 'critical' ? 'fatal' : 'error',
            extra: entry.metadata,
            tags: { component: entry.component ?? 'unknown', page: log.page },
          });
        }
      } catch {
        // Never let Sentry crash the app
      }
    }
  },

  getLogs(filters?: {
    severity?: ErrorSeverity;
    resolved?: boolean;
    page?: string;
    search?: string;
    limit?: number;
  }): ErrorLog[] {
    let result = [...errorLogs];

    if (filters) {
      if (filters.severity) result = result.filter(e => e.severity === filters.severity);
      if (filters.resolved !== undefined) result = result.filter(e => e.resolved === filters.resolved);
      if (filters.page) result = result.filter(e => e.page?.includes(filters.page!));
      if (filters.search) {
        const s = filters.search.toLowerCase();
        result = result.filter(e =>
          e.message.toLowerCase().includes(s) ||
          e.component?.toLowerCase().includes(s) ||
          e.page?.toLowerCase().includes(s)
        );
      }
    }

    result.sort((a, b) => b.lastSeen - a.lastSeen);

    if (filters?.limit) result = result.slice(0, filters.limit);
    return result;
  },

  getStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    unresolved: number;
    last24h: number;
    topErrors: Array<{ message: string; count: number; severity: ErrorSeverity }>;
  } {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const bySeverity: Record<ErrorSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };

    errorLogs.forEach(e => {
      bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
    });

    const topErrors = [...errorLogs]
      .filter(e => !e.resolved)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(e => ({ message: e.message.substring(0, 100), count: e.count, severity: e.severity }));

    return {
      total: errorLogs.length,
      bySeverity,
      unresolved: errorLogs.filter(e => !e.resolved).length,
      last24h: errorLogs.filter(e => e.lastSeen > now - day).length,
      topErrors,
    };
  },

  resolve(id: string): void {
    const log = errorLogs.find(e => e.id === id);
    if (log) {
      log.resolved = true;
      saveLogs();
      notifyListeners();
    }
  },

  resolveAll(): void {
    errorLogs.forEach(e => { e.resolved = true; });
    saveLogs();
    notifyListeners();
  },

  delete(id: string): void {
    errorLogs = errorLogs.filter(e => e.id !== id);
    saveLogs();
    notifyListeners();
  },

  clearAll(): void {
    errorLogs = [];
    saveLogs();
    notifyListeners();
  },

  subscribe(fn: () => void): () => void {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },

  exportLogs(): string {
    return JSON.stringify(errorLogs, null, 2);
  },
};

function severityWeight(s: ErrorSeverity): number {
  const weights: Record<ErrorSeverity, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
  return weights[s] || 0;
}

export const SEVERITY_COLORS: Record<ErrorSeverity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280',
};

export const SEVERITY_BG: Record<ErrorSeverity, string> = {
  critical: '#fef2f2',
  high: '#fff7ed',
  medium: '#fefce8',
  low: '#eff6ff',
  info: '#f9fafb',
};
