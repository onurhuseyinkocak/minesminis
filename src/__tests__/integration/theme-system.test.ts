import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(ThemeProvider, null, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.body.classList.remove('light-theme', 'dark-theme');

  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
});

describe('Theme System — Dark Mode Only', () => {
  it('always returns dark theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('applies data-theme="dark" to document', () => {
    renderHook(() => useTheme(), { wrapper });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applies dark-theme body class', () => {
    renderHook(() => useTheme(), { wrapper });
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  it('persists dark to localStorage', () => {
    renderHook(() => useTheme(), { wrapper });
    expect(localStorage.getItem('mm_theme')).toBe('dark');
  });

  it('setTheme is a no-op (always dark)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    result.current.setTheme('light');
    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('toggleTheme is a no-op (always dark)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    result.current.toggleTheme();
    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('updates meta theme-color to dark value', () => {
    renderHook(() => useTheme(), { wrapper });
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#0C0F1A');
  });

  it('useTheme throws outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
