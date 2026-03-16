import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(ThemeProvider, null, children);
}

let matchMediaMatches = false;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  matchMediaMatches = false;

  // Reset matchMedia mock for each test
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matchMediaMatches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Ensure document elements exist for theme application
  document.documentElement.setAttribute('data-theme', 'light');
  document.body.classList.remove('light-theme', 'dark-theme');

  // Create meta theme-color if missing
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Theme System Integration', () => {

  // 1. Default theme loads from localStorage
  it('loads saved theme from localStorage', () => {
    localStorage.setItem('mm_theme', 'dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('defaults to system theme when no localStorage value', () => {
    // No mm_theme in localStorage
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Should be 'system' or 'light' depending on matchMedia
    expect(['light', 'system']).toContain(result.current.theme);
  });

  // 2. Theme toggle cycles light->dark->light
  it('toggleTheme switches from light to dark', () => {
    localStorage.setItem('mm_theme', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('toggleTheme switches from dark to light', () => {
    localStorage.setItem('mm_theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.effectiveTheme).toBe('light');
  });

  // 3. System theme follows media query
  it('system theme follows matchMedia preference', () => {
    matchMediaMatches = true; // prefer dark
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
    // effectiveTheme depends on matchMedia returning true
    expect(result.current.effectiveTheme).toBe('dark');
  });

  // 4. Theme persists across sessions
  it('setTheme persists to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(localStorage.getItem('mm_theme')).toBe('dark');
  });

  it('persisted theme survives re-render', () => {
    localStorage.setItem('mm_theme', 'dark');
    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');

    rerender();
    expect(result.current.theme).toBe('dark');
  });

  // 5. Dark mode applies correct CSS variables
  it('applies data-theme attribute to document element', () => {
    localStorage.setItem('mm_theme', 'dark');
    renderHook(() => useTheme(), { wrapper });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applies correct body class for light theme', () => {
    localStorage.setItem('mm_theme', 'light');
    renderHook(() => useTheme(), { wrapper });

    expect(document.body.classList.contains('light-theme')).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('applies correct body class for dark theme', () => {
    localStorage.setItem('mm_theme', 'dark');
    renderHook(() => useTheme(), { wrapper });

    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  // 6. Meta theme-color updates
  it('updates meta theme-color for dark mode', () => {
    localStorage.setItem('mm_theme', 'dark');
    renderHook(() => useTheme(), { wrapper });

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#13111C');
  });

  it('updates meta theme-color for light mode', () => {
    localStorage.setItem('mm_theme', 'light');
    renderHook(() => useTheme(), { wrapper });

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#6C5CE7');
  });

  // Edge cases
  it('useTheme throws outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('setting theme to system with light media query produces light', () => {
    matchMediaMatches = false; // prefer light
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.effectiveTheme).toBe('light');
  });

  it('multiple rapid toggles settle correctly', () => {
    localStorage.setItem('mm_theme', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme(); // -> dark
      result.current.toggleTheme(); // -> light
      result.current.toggleTheme(); // -> dark
    });

    expect(result.current.effectiveTheme).toBe('dark');
  });
});
