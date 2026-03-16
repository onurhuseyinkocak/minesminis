import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const FloatingThemeToggle: React.FC = () => {
    const { effectiveTheme, toggleTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    return (
        <motion.button
            className="floating-theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="toggle-icon-wrapper">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isDark ? 'dark' : 'light'}
                        initial={{ y: 20, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isDark ? (
                            <Moon className="theme-icon moon" size={24} />
                        ) : (
                            <Sun className="theme-icon sun" size={24} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="toggle-glow"></div>
        </motion.button>
    );
};

export default FloatingThemeToggle;
