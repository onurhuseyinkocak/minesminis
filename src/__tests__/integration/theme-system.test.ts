import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

describe('Theme System — light/dark/system', () => {
  it('defaults to system theme when no localStorage entry', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('system');
  });

  it('reads stored theme from localStorage', () => {
    localStorage.setItem('mm_theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('applies data-theme="dark" when stored as dark', () => {
    localStorage.setItem('mm_theme', 'dark');
    renderHook(() => useTheme(), { wrapper });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('removes data-theme attribute when stored as light', () => {
    localStorage.setItem('mm_theme', 'light');
    renderHook(() => useTheme(), { wrapper });
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('setTheme changes theme and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
    expect(localStorage.getItem('mm_theme')).toBe('dark');
  });

  it('toggleTheme switches between light and dark', () => {
    localStorage.setItem('mm_theme', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.effectiveTheme).toBe('dark');
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.effectiveTheme).toBe('light');
  });

  it('updates meta theme-color to dark value when dark', () => {
    localStorage.setItem('mm_theme', 'dark');
    renderHook(() => useTheme(), { wrapper });
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#0C0F1A');
  });

  it('updates meta theme-color to light value when light', () => {
    localStorage.setItem('mm_theme', 'light');
    renderHook(() => useTheme(), { wrapper });
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#FFF8F2');
  });

  it('useTheme throws outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
