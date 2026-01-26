import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import './Settings.css';

const Settings: React.FC = () => {
    return (
        <div className="settings-page">
            <h1 className="settings-title">Settings</h1>
            <section className="settings-section">
                <h2>Appearance</h2>
                <div className="setting-item">
                    <label htmlFor="dark-mode-toggle" className="setting-label">Dark Mode</label>
                    <ThemeToggle />
                </div>
            </section>
            <section className="settings-section">
                <h2>Extras (placeholders)</h2>
                <div className="setting-item">
                    <label className="setting-label">Sound Effects</label>
                    <input type="checkbox" disabled />
                </div>
                <div className="setting-item">
                    <label className="setting-label">Animation Speed</label>
                    <select disabled>
                        <option>Normal</option>
                        <option>Fast</option>
                    </select>
                </div>
            </section>
        </div>
    );
};

export default Settings;
