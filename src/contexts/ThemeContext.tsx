/**
 * THEME CONTEXT
 * MinesMinis — DARK MODE ONLY
 */
/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useTheme */
import { createContext, useContext, useEffect, ReactNode } from 'react';

interface ThemeContextType {
    theme: 'dark';
    effectiveTheme: 'dark';
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Force dark mode on mount — no light mode exists
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('mm_theme', 'dark');

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#0C0F1A');
        }
    }, []);

    const value: ThemeContextType = {
        theme: 'dark',
        effectiveTheme: 'dark',
        setTheme: () => {},    // no-op, always dark
        toggleTheme: () => {}, // no-op, always dark
    };

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
