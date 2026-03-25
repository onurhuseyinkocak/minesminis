// TODO: merge with AdminSettings.tsx
import { useState } from 'react';
import { Settings, Save, Bell, Palette, Shield, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import './SiteSettings.css';

function SiteSettings() {
    const [settings, setSettings] = useState({
        siteName: "Mimi's Learning Platform",
        siteDescription: 'Çocuklar için eğlenceli İngilizce öğrenme platformu',
        maintenanceMode: false,
        allowRegistration: true,
        defaultLanguage: 'tr',
        themeColor: '#6366f1',
        announcementEnabled: false,
        announcementText: '',
        announcementType: 'info'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you would save to Supabase or a config file
        localStorage.setItem('siteSettings', JSON.stringify(settings));

        setIsSaving(false);
        toast.success('Ayarlar kaydedildi!');
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Settings size={28} /> Site Ayarları</h1>
                <p>Platform genel ayarlarını yapılandırın</p>
            </div>

            <div className="settings-grid">
                {/* General Settings */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Globe size={20} />
                        <h2>Genel Ayarlar</h2>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label>Site Adı</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Site Açıklaması</label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label>Varsayılan Dil</label>
                            <select
                                value={settings.defaultLanguage}
                                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                            >
                                <option value="tr">TR — Türkçe</option>
                                <option value="en">EN — English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Palette size={20} />
                        <h2>Görünüm</h2>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label>Ana Tema Rengi</label>
                            <div className="ss-color-row">
                                <input
                                    type="color"
                                    value={settings.themeColor}
                                    onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                                    className="ss-color-swatch"
                                />
                                <input
                                    type="text"
                                    value={settings.themeColor}
                                    onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                                    className="ss-color-text"
                                />
                            </div>
                        </div>

                        <div className="ss-color-preview" style={{ background: settings.themeColor }}>
                            Tema Rengi Önizleme
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Shield size={20} />
                        <h2>Güvenlik & Erişim</h2>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                />
                                <span className="toggle-text">
                                    Bakım Modu
                                    <small>Aktif olduğunda sadece adminler siteye erişebilir</small>
                                </span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.allowRegistration}
                                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                                />
                                <span className="toggle-text">
                                    Yeni Kayıtlara İzin Ver
                                    <small>Kapalıyken yeni kullanıcılar kayıt olamaz</small>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Announcements */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Bell size={20} />
                        <h2>Duyurular</h2>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.announcementEnabled}
                                    onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                                />
                                <span className="toggle-text">
                                    Duyuru Bandı Aktif
                                </span>
                            </label>
                        </div>

                        {settings.announcementEnabled && (
                            <>
                                <div className="form-group">
                                    <label>Duyuru Metni</label>
                                    <textarea
                                        value={settings.announcementText}
                                        onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                                        placeholder="Duyuru metnini girin..."
                                        rows={2}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Duyuru Türü</label>
                                    <select
                                        value={settings.announcementType}
                                        onChange={(e) => setSettings({ ...settings, announcementType: e.target.value })}
                                    >
                                        <option value="info">Bilgi</option>
                                        <option value="success">Başarı</option>
                                        <option value="warning">Uyarı</option>
                                        <option value="error">Hata</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button
                    className="save-btn ss-save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <div className="admin-loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Ayarları Kaydet
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}

export default SiteSettings;
