/**
 * THEME TOGGLE COMPONENT
 * Toggle between light and dark mode
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
    showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
    const { effectiveTheme, toggleTheme } = useTheme();

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
                        {isDark ? '🌙' : '☀️'}
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
