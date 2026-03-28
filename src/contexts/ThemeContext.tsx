/**
 * THEME CONTEXT
 * MinesMinis — Supports light / dark / system theme
 * Persists to localStorage under key 'mm_theme'.
 * 'system' reads prefers-color-scheme at runtime.
 */
/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useTheme */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

interface ThemeContextType {
    /** User's explicit choice: 'light' | 'dark' | 'system' */
    theme: ThemeChoice;
    /** Resolved theme after applying system preference */
    effectiveTheme: EffectiveTheme;
    setTheme: (theme: ThemeChoice) => void;
    toggleTheme: () => void;
}

const LS_KEY = 'mm_theme';

function getStoredTheme(): ThemeChoice {
    try {
        const val = localStorage.getItem(LS_KEY);
        // MinesMinis is light-mode only — force light, clear any stale dark value
        if (val === 'dark') {
            localStorage.setItem(LS_KEY, 'light');
            return 'light';
        }
        if (val === 'light' || val === 'system') return val;
    } catch {
        // storage unavailable
    }
    return 'light';
}

function getSystemPreference(): EffectiveTheme {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function applyTheme(effective: EffectiveTheme) {
    if (effective === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', effective === 'dark' ? '#0C0F1A' : '#FFF8F2');
    }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeChoice>(getStoredTheme);
    const [systemPref, setSystemPref] = useState<EffectiveTheme>(getSystemPreference);

    const effectiveTheme: EffectiveTheme = theme === 'system' ? systemPref : theme;

    // Listen to OS-level changes when user chose 'system'
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            setSystemPref(e.matches ? 'dark' : 'light');
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Apply theme to DOM whenever effective theme changes
    useEffect(() => {
        applyTheme(effectiveTheme);
    }, [effectiveTheme]);

    const setTheme = useCallback((next: ThemeChoice) => {
        setThemeState(next);
        try { localStorage.setItem(LS_KEY, next); } catch { /* ignore */ }
    }, []);

    const toggleTheme = useCallback(() => {
        // Light → Dark → System cycle
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    }, [theme, setTheme]);

    const value: ThemeContextType = useMemo(() => ({
        theme,
        effectiveTheme,
        setTheme,
        toggleTheme,
    }), [theme, effectiveTheme, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
