import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>Oops!</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-2)', textAlign: 'center', maxWidth: 300 }}>Something went wrong. Please reload the page.</div>
          <button
            className="mm-btn primary"
            onClick={() => window.location.reload()}
            style={{ marginTop: 8 }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
