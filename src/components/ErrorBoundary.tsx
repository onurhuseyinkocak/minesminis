import React, { ReactNode } from 'react';
import { AlertCircle, RotateCw, Home } from 'lucide-react';
import { errorLogger } from '../services/errorLogger';
import './ErrorBoundary.css';

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
        <div className="eb-page">
          <div className="eb-card">
            <div className="eb-icon-wrap">
              <AlertCircle size={36} className="eb-icon" aria-hidden="true" />
            </div>

            <h1 className="eb-title">{msg.title}</h1>

            <p className="eb-description">{msg.description}</p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="eb-details">
                <summary className="eb-details-summary">{msg.details}</summary>
                <pre className="eb-details-pre">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="eb-actions">
              <button
                type="button"
                className="eb-btn eb-btn--primary"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onReset?.();
                  if (!this.props.onReset) window.location.reload();
                }}
              >
                <RotateCw size={16} aria-hidden="true" />
                {msg.refresh}
              </button>
              <a
                href="/"
                className="eb-btn eb-btn--secondary"
              >
                <Home size={16} aria-hidden="true" />
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
