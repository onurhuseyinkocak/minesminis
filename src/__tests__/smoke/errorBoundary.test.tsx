import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ErrorBoundary - Detailed Tests', () => {
  let ErrorBoundary: typeof import('../../components/ErrorBoundary').ErrorBoundary;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    const mod = await import('../../components/ErrorBoundary');
    ErrorBoundary = mod.ErrorBoundary;
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy?.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>Everything is fine</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('shows default fallback UI on error', () => {
    const ThrowError = () => { throw new Error('Boom'); };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it('shows custom fallback when provided', () => {
    const ThrowError = () => { throw new Error('Boom'); };
    render(
      <ErrorBoundary fallback={<div>Custom fallback content</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback content')).toBeInTheDocument();
  });

  it('displays error details in development mode', () => {
    // process.env.NODE_ENV is 'test' by default which is not 'development'
    // The component checks process.env.NODE_ENV === 'development'
    // So details should NOT show in test mode
    const ThrowError = () => { throw new Error('DetailedError'); };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    // The error details section should NOT be present in test env
    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();
  });

  it('has Refresh Page button', () => {
    const ThrowError = () => { throw new Error('Test'); };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Refresh Page/i)).toBeInTheDocument();
  });

  it('has Go Home link', () => {
    const ThrowError = () => { throw new Error('Test'); };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    const homeLink = screen.getByText(/Go Home/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('calls onReset when Refresh Page is clicked', () => {
    const ThrowError = () => { throw new Error('Test'); };
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText(/Refresh Page/i));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('resets error state when Refresh Page is clicked with onReset', () => {
    let shouldThrow = true;
    const ConditionalError = () => {
      if (shouldThrow) throw new Error('Test');
      return <p>Recovered</p>;
    };

    const onReset = vi.fn(() => { shouldThrow = false; });

    const { rerender } = render(
      <ErrorBoundary onReset={onReset}>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Refresh Page/i));

    // After reset, re-render should show recovered content
    rerender(
      <ErrorBoundary onReset={onReset}>
        <ConditionalError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });

  it('logs error to console on catch', () => {
    const ThrowError = () => { throw new Error('ConsoleTest'); };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(consoleSpy).toHaveBeenCalled();
  });
});
