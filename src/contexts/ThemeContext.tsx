/**
 * THEME CONTEXT
 * MinesMinis — Light theme
 */
/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useTheme */
import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';

interface ThemeContextType {
    theme: 'light';
    effectiveTheme: 'light';
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('mm_theme', 'light');

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#FFF8F2');
        }
    }, []);

    const value: ThemeContextType = useMemo(() => ({
        theme: 'light' as const,
        effectiveTheme: 'light' as const,
        setTheme: () => {},
        toggleTheme: () => {},
    }), []);

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
