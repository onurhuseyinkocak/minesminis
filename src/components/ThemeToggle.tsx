/**
 * THEME TOGGLE COMPONENT
 * Toggle between light and dark mode.
 * Reads real effectiveTheme from ThemeContext — no hardcoding.
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
    const { toggleTheme, effectiveTheme } = useTheme();

    const isDark = effectiveTheme === 'dark';

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                <div className="toggle-thumb">
                    <span className="toggle-icon">
                        {isDark ? <Moon size={14} /> : <Sun size={14} />}
                    </span>
                </div>
            </div>
            {showLabel && (
                <span className="toggle-label">
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
};

export default ThemeToggle;
