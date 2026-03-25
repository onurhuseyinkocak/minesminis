import React, { ReactNode } from 'react';
import { AlertCircle, RotateCw, Home } from 'lucide-react';
import { errorLogger } from '../services/errorLogger';

interface Props {
  children: ReactNode;
  /** Custom fallback when error occurs. If not provided, uses default error UI. */
  fallback?: ReactNode;
  /** Called when user wants to dismiss (e.g. Close button) */
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Bilingual messages — class components cannot use hooks, so detect from DOM/localStorage
const MESSAGES = {
  tr: {
    title: 'Bir şeyler ters gitti',
    description: 'Beklenmedik bir hata oluştu. Lütfen sayfayı yenilemeyi veya ana sayfaya dönmeyi deneyin.',
    details: 'Hata Detayları (Geliştirme)',
    refresh: 'Sayfayı Yenile',
    home: 'Ana Sayfa',
  },
  en: {
    title: 'Something went wrong',
    description: 'We encountered an unexpected error. Please try refreshing the page or returning to the home page.',
    details: 'Error Details (Development Only)',
    refresh: 'Refresh Page',
    home: 'Go Home',
  },
};

function getErrorLang(): 'tr' | 'en' {
  try {
    const stored = localStorage.getItem('lang');
    if (stored === 'tr' || stored === 'en') return stored;
  } catch { /* localStorage may be unavailable */ }
  const htmlLang = document.documentElement.lang;
  if (htmlLang?.startsWith('tr')) return 'tr';
  return 'en';
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 * Prevents entire app from crashing on component errors
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorLogger.log({
      severity: 'critical',
      message: `ErrorBoundary caught an error: ${error.message}`,
      stack: error.stack,
      component: 'ErrorBoundary',
      metadata: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }
    if (this.state.hasError) {
      const msg = MESSAGES[getErrorLang()];
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-page)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '2rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-md)',
          }}>
            <h1 style={{
              fontSize: '2rem',
              color: 'var(--error)',
              marginBottom: '1rem',
            }}>
              <AlertCircle size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
              {msg.title}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}>
              {msg.description}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: '4px',
                textAlign: 'left',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {msg.details}
                </summary>
                <pre style={{
                  overflow: 'auto',
                  fontSize: '0.85rem',
                  color: 'var(--error)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onReset?.();
                  if (!this.props.onReset) window.location.reload();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--accent-indigo)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-purple)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-indigo)')}
              >
                <RotateCw size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                {msg.refresh}
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--slate)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--charcoal)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--slate)')}
              >
                <Home size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                {msg.home}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
