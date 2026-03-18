import { useState } from 'react';
import { Settings, Save, Bell, Palette, Shield, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

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
                                <option value="tr">🇹🇷 Türkçe</option>
                                <option value="en">🇬🇧 English</option>
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
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={settings.themeColor}
                                    onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                                    style={{ width: '50px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    value={settings.themeColor}
                                    onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                                    style={{ width: '100px' }}
                                />
                            </div>
                        </div>

                        <div className="color-preview" style={{
                            background: settings.themeColor,
                            padding: '1rem',
                            borderRadius: '8px',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 600
                        }}>
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
                                    🔧 Bakım Modu
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
                                    👥 Yeni Kayıtlara İzin Ver
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
                                    📢 Duyuru Bandı Aktif
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
                                        <option value="info">ℹ️ Bilgi</option>
                                        <option value="success">✅ Başarı</option>
                                        <option value="warning">⚠️ Uyarı</option>
                                        <option value="error">❌ Hata</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
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

            <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .settings-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .settings-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .settings-card-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .settings-card-body {
          padding: 1.5rem;
        }

        .toggle-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }

        .toggle-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          margin-top: 2px;
          cursor: pointer;
        }

        .toggle-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-text small {
          color: #64748b;
          font-size: 0.75rem;
        }

        .settings-actions {
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 640px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}

export default SiteSettings;
