import { useState } from 'react';
import {
    Save, Bell, Globe, Shield, CreditCard, BookOpen, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminSettings.css';

const DEFAULT_SETTINGS = {
    siteName: 'MinesMinis',
    siteDescription: 'Premium English education for children ages 1-10',
    defaultLanguage: 'tr',
    lemonSqueezyApiKey: '',
    planFree: 'Free - Limited content',
    planPremium: 'Premium - Full access',
    planClassroom: 'Classroom - Teacher + 30 students',
    defaultWorld: 'w1',
    featuredContentEnabled: true,
    announcementEnabled: false,
    announcementText: '',
    announcementType: 'info' as 'info' | 'success' | 'warning' | 'error',
    maintenanceMode: false,
    allowRegistration: true,
};

function AdminSettings() {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('siteSettings');
            if (saved) return { ...DEFAULT_SETTINGS, ...(JSON.parse(saved) as typeof DEFAULT_SETTINGS) };
        } catch {
            // ignore parse errors
        }
        return DEFAULT_SETTINGS;
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        setIsSaving(false);
        toast.success('Settings saved successfully');
    };

    return (
        <div className="adm-settings">
            <div className="adm-settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>Configure platform settings, billing, and notifications</p>
                </div>
                <button type="button" className="adm-action-btn primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <><div className="adm-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</>
                    ) : (
                        <><Save size={14} /> Save Changes</>
                    )}
                </button>
            </div>

            {/* General Settings */}
            <div className="adm-settings-section">
                <div className="adm-settings-section-header">
                    <Globe size={18} />
                    <span className="adm-settings-section-title">General</span>
                </div>
                <div className="adm-settings-section-body">
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Site Name
                            <small>Displayed across the platform</small>
                        </div>
                        <div className="adm-settings-input">
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Description
                            <small>Meta description for SEO</small>
                        </div>
                        <div className="adm-settings-input">
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Default Language
                        </div>
                        <div className="adm-settings-input">
                            <select
                                value={settings.defaultLanguage}
                                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                            >
                                <option value="tr">Turkish</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing */}
            <div className="adm-settings-section">
                <div className="adm-settings-section-header">
                    <CreditCard size={18} />
                    <span className="adm-settings-section-title">Billing</span>
                </div>
                <div className="adm-settings-section-body">
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Lemon Squeezy API Key
                            <small>For payment processing</small>
                        </div>
                        <div className="adm-settings-input">
                            <div className="adm-api-key-input">
                                <input
                                    type={showApiKey ? 'text' : 'password'}
                                    value={settings.lemonSqueezyApiKey}
                                    onChange={(e) => setSettings({ ...settings, lemonSqueezyApiKey: e.target.value })}
                                    placeholder="sk_live_..."
                                />
                                <button
                                    type="button"
                                    className="adm-api-key-toggle"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Subscription Plans
                            <small>Plan names and descriptions</small>
                        </div>
                        <div className="adm-settings-input adm-settings-input--stack">
                            <input
                                type="text"
                                value={settings.planFree}
                                onChange={(e) => setSettings({ ...settings, planFree: e.target.value })}
                                placeholder="Free plan description"
                            />
                            <input
                                type="text"
                                value={settings.planPremium}
                                onChange={(e) => setSettings({ ...settings, planPremium: e.target.value })}
                                placeholder="Premium plan description"
                            />
                            <input
                                type="text"
                                value={settings.planClassroom}
                                onChange={(e) => setSettings({ ...settings, planClassroom: e.target.value })}
                                placeholder="Classroom plan description"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="adm-settings-section">
                <div className="adm-settings-section-header">
                    <BookOpen size={18} />
                    <span className="adm-settings-section-title">Content</span>
                </div>
                <div className="adm-settings-section-body">
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Default World
                            <small>First world shown to new users</small>
                        </div>
                        <div className="adm-settings-input">
                            <select
                                value={settings.defaultWorld}
                                onChange={(e) => setSettings({ ...settings, defaultWorld: e.target.value })}
                            >
                                <option value="w1">Hello World</option>
                                <option value="w2">My Body</option>
                                <option value="w3">Colors & Shapes</option>
                                <option value="w4">Animals</option>
                                <option value="w5">My Family</option>
                                <option value="w6">Food & Drinks</option>
                            </select>
                        </div>
                    </div>
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Featured Content
                            <small>Show curated content on dashboard</small>
                        </div>
                        <div className="adm-settings-input">
                            <div className="adm-toggle-wrap">
                                <label className="adm-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.featuredContentEnabled}
                                        onChange={(e) => setSettings({ ...settings, featuredContentEnabled: e.target.checked })}
                                    />
                                    <span className="adm-toggle-track" />
                                </label>
                                <span className="adm-toggle-label">
                                    {settings.featuredContentEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="adm-settings-section">
                <div className="adm-settings-section-header">
                    <Bell size={18} />
                    <span className="adm-settings-section-title">Notifications</span>
                </div>
                <div className="adm-settings-section-body">
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Announcement Banner
                            <small>Show a banner across the site</small>
                        </div>
                        <div className="adm-settings-input">
                            <div className="adm-toggle-wrap adm-toggle-wrap--mb">
                                <label className="adm-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.announcementEnabled}
                                        onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                                    />
                                    <span className="adm-toggle-track" />
                                </label>
                                <span className="adm-toggle-label">
                                    {settings.announcementEnabled ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            {settings.announcementEnabled && (
                                <div className="adm-settings-announcement-fields">
                                    <textarea
                                        value={settings.announcementText}
                                        onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                                        placeholder="Announcement message..."
                                        rows={2}
                                    />
                                    <select
                                        value={settings.announcementType}
                                        onChange={(e) => setSettings({ ...settings, announcementType: e.target.value as 'info' | 'success' | 'warning' | 'error' })}
                                    >
                                        <option value="info">Info</option>
                                        <option value="success">Success</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="adm-settings-section">
                <div className="adm-settings-section-header">
                    <Shield size={18} />
                    <span className="adm-settings-section-title">Security & Access</span>
                </div>
                <div className="adm-settings-section-body">
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            Maintenance Mode
                            <small>Only admins can access the site</small>
                        </div>
                        <div className="adm-settings-input">
                            <div className="adm-toggle-wrap">
                                <label className="adm-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    />
                                    <span className="adm-toggle-track" />
                                </label>
                                <div>
                                    <span className="adm-toggle-label">
                                        {settings.maintenanceMode ? 'Active' : 'Inactive'}
                                    </span>
                                    {settings.maintenanceMode && (
                                        <div className="adm-toggle-desc adm-toggle-desc--danger">
                                            Site is currently in maintenance mode
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="adm-settings-field">
                        <div className="adm-settings-label">
                            User Registration
                            <small>Allow new users to sign up</small>
                        </div>
                        <div className="adm-settings-input">
                            <div className="adm-toggle-wrap">
                                <label className="adm-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.allowRegistration}
                                        onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                                    />
                                    <span className="adm-toggle-track" />
                                </label>
                                <span className="adm-toggle-label">
                                    {settings.allowRegistration ? 'Open' : 'Closed'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Save */}
            <div className="adm-settings-save">
                <button type="button" className="adm-action-btn primary adm-action-btn--save" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : (
                        <><Save size={14} /> Save All Settings</>
                    )}
                </button>
            </div>
        </div>
    );
}

export default AdminSettings;
