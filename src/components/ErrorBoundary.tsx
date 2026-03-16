import React, { ReactNode } from 'react';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h1 style={{
              fontSize: '2rem',
              color: '#d32f2f',
              marginBottom: '1rem',
            }}>
              🚨 Something went wrong
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}>
              We encountered an unexpected error. Please try refreshing the page or returning to the home page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                textAlign: 'left',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  overflow: 'auto',
                  fontSize: '0.85rem',
                  color: '#d32f2f',
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
                  backgroundColor: '#6C5CE7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5A4BD1')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6C5CE7')}
              >
                🔄 Refresh Page
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6B7280',
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
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4B5563')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6B7280')}
              >
                🏠 Go Home
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
