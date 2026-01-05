/**
 * THEME CONTEXT
 * Dark Mode & Theme Management for MinesMinis
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    effectiveTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('mm_theme') as Theme | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState('system');
            setEffectiveTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                setEffectiveTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Apply theme
    useEffect(() => {
        let effective: 'light' | 'dark';

        if (theme === 'system') {
            effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            effective = theme;
        }

        setEffectiveTheme(effective);

        // Apply to document
        document.documentElement.setAttribute('data-theme', effective);
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${effective}-theme`);

        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', effective === 'dark' ? '#1a1a2e' : '#667eea');
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('mm_theme', newTheme);
    };

    const toggleTheme = () => {
        const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
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
