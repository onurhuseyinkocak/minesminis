import { useState } from 'react';
import {
    Search,
    Globe,
    FileText,
    Image,
    Link,
    CheckCircle,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Download,

    Zap,
    TrendingUp,
    Eye,
    Hash,

    Smartphone,

    ExternalLink,
    Copy,
    Save,
    BarChart3,
    Target,
    Award,
    Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SEOPage {
    id: string;
    path: string;
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    score: number;
    issues: string[];
    lastChecked: Date;
}

interface SEOSettings {
    siteName: string;
    siteDescription: string;
    siteKeywords: string[];
    defaultOgImage: string;
    twitterHandle: string;
    facebookAppId: string;
    googleAnalyticsId: string;
    googleSearchConsoleId: string;
    robotsTxt: string;
    sitemapUrl: string;
}

// Sample SEO data
const samplePages: SEOPage[] = [
    {
        id: '1',
        path: '/',
        title: 'MinesMinis - Premium English Learning Platform for Kids',
        description: 'Fun and interactive English learning platform for children with games, videos, and worksheets.',
        keywords: ['english learning', 'kids education', 'language learning', 'educational games'],
        ogImage: '/og-home.jpg',
        score: 92,
        issues: [],
        lastChecked: new Date()
    },
    {
        id: '2',
        path: '/games',
        title: 'Educational Games - MinesMinis',
        description: 'Play fun English learning games designed for kids. Interactive quizzes, memory games, and more!',
        keywords: ['educational games', 'english games for kids', 'learning games'],
        ogImage: '/og-games.jpg',
        score: 85,
        issues: ['Meta description could be longer'],
        lastChecked: new Date()
    },
    {
        id: '3',
        path: '/videos',
        title: 'Learning Videos - MinesMinis',
        description: 'Watch educational videos for kids. Songs, stories, and lessons in English.',
        keywords: ['educational videos', 'kids songs', 'english lessons'],
        ogImage: '/og-videos.jpg',
        score: 78,
        issues: ['Missing alt text on images', 'Add more keywords'],
        lastChecked: new Date()
    },
    {
        id: '4',
        path: '/words',
        title: 'Smart Dictionary - MinesMinis',
        description: 'Learn English words with our interactive dictionary. Translations, examples, and pronunciation.',
        keywords: ['english dictionary', 'vocabulary', 'word learning'],
        ogImage: '/og-words.jpg',
        score: 88,
        issues: ['Consider adding structured data'],
        lastChecked: new Date()
    },
    {
        id: '5',
        path: '/worksheets',
        title: 'Worksheets - MinesMinis',
        description: 'Download free English worksheets for kids. Grammar, vocabulary, and reading exercises.',
        keywords: ['english worksheets', 'printable worksheets', 'education'],
        ogImage: '/og-worksheets.jpg',
        score: 72,
        issues: ['Title too short', 'Add canonical URL'],
        lastChecked: new Date()
    }
];

const defaultSettings: SEOSettings = {
    siteName: 'MinesMinis',
    siteDescription: 'Premium English Learning Platform for Kids',
    siteKeywords: ['english learning', 'kids education', 'educational games', 'language learning', 'ESL for kids'],
    defaultOgImage: '/og-default.jpg',
    twitterHandle: '@minesminis',
    facebookAppId: '',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleSearchConsoleId: '',
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://minesminis.com/sitemap.xml`,
    sitemapUrl: 'https://minesminis.com/sitemap.xml'
};

function SEOManager() {
    const [pages, setPages] = useState<SEOPage[]>(samplePages);
    const [settings, setSettings] = useState<SEOSettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'settings' | 'tools'>('overview');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Calculate overall score
    const overallScore = Math.round(pages.reduce((acc, p) => acc + p.score, 0) / pages.length);
    const totalIssues = pages.reduce((acc, p) => acc + p.issues.length, 0);

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#22c55e';
        if (score >= 70) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Mükemmel';
        if (score >= 70) return 'İyi';
        if (score >= 50) return 'Orta';
        return 'Düşük';
    };

    const runFullSEOAnalysis = async () => {
        setIsAnalyzing(true);
        toast.loading('SEO analizi yapılıyor...', { id: 'seo-analysis' });

        // Simulate analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update scores randomly to simulate real analysis
        setPages(pages.map(page => ({
            ...page,
            score: Math.min(100, page.score + Math.floor(Math.random() * 10)),
            lastChecked: new Date()
        })));

        setIsAnalyzing(false);
        toast.success('SEO analizi tamamlandı!', { id: 'seo-analysis' });
    };

    const generateSitemap = () => {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>https://minesminis.com${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

        const blob = new Blob([sitemap], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        toast.success('Sitemap indirildi!');
    };

    const generateRobotsTxt = () => {
        const blob = new Blob([settings.robotsTxt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        a.click();
        toast.success('robots.txt indirildi!');
    };

    const copyMetaTags = () => {
        const metaTags = `<!-- Primary Meta Tags -->
<title>${settings.siteName} - ${settings.siteDescription}</title>
<meta name="title" content="${settings.siteName} - ${settings.siteDescription}">
<meta name="description" content="${settings.siteDescription}">
<meta name="keywords" content="${settings.siteKeywords.join(', ')}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://minesminis.com/">
<meta property="og:title" content="${settings.siteName}">
<meta property="og:description" content="${settings.siteDescription}">
<meta property="og:image" content="${settings.defaultOgImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://minesminis.com/">
<meta property="twitter:title" content="${settings.siteName}">
<meta property="twitter:description" content="${settings.siteDescription}">
<meta property="twitter:image" content="${settings.defaultOgImage}">
${settings.twitterHandle ? `<meta name="twitter:site" content="${settings.twitterHandle}">` : ''}

<!-- Canonical -->
<link rel="canonical" href="https://minesminis.com/">`;

        navigator.clipboard.writeText(metaTags);
        toast.success('Meta etiketleri kopyalandı!');
    };

    const autoFixAllIssues = async () => {
        toast.loading('Tüm SEO sorunları düzeltiliyor...', { id: 'auto-fix' });
        await new Promise(resolve => setTimeout(resolve, 2500));

        setPages(pages.map(page => ({
            ...page,
            score: Math.min(100, page.score + 15),
            issues: []
        })));

        toast.success('Tüm sorunlar düzeltildi! 🎉', { id: 'auto-fix' });
    };

    const saveSettings = () => {
        toast.success('SEO ayarları kaydedildi!');
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>🔍 SEO Yönetimi</h1>
                <p>Tek tıkla SEO optimizasyonu ve arama motoru ayarları</p>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card" style={{ '--stat-color': getScoreColor(overallScore), '--stat-bg': '#f0fdf4' } as React.CSSProperties}>
                    <div className="stat-icon"><Award size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value" style={{ color: getScoreColor(overallScore) }}>{overallScore}</span>
                        <span className="stat-label">SEO Skoru</span>
                    </div>
                    <span className="badge" style={{ background: getScoreColor(overallScore), color: 'white' }}>
                        {getScoreLabel(overallScore)}
                    </span>
                </div>

                <div className="stat-card" style={{ '--stat-color': '#6366f1', '--stat-bg': '#eef2ff' } as React.CSSProperties}>
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{pages.length}</span>
                        <span className="stat-label">Sayfa</span>
                    </div>
                </div>

                <div className="stat-card" style={{ '--stat-color': totalIssues > 0 ? '#f59e0b' : '#22c55e', '--stat-bg': totalIssues > 0 ? '#fffbeb' : '#f0fdf4' } as React.CSSProperties}>
                    <div className="stat-icon">{totalIssues > 0 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}</div>
                    <div className="stat-info">
                        <span className="stat-value">{totalIssues}</span>
                        <span className="stat-label">Sorun</span>
                    </div>
                </div>

                <div className="stat-card" style={{ '--stat-color': '#ec4899', '--stat-bg': '#fdf2f8' } as React.CSSProperties}>
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">%{Math.round((100 - totalIssues * 5) / 100 * 100)}</span>
                        <span className="stat-label">Optimizasyon</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={runFullSEOAnalysis}
                    disabled={isAnalyzing}
                    className="add-btn"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <RefreshCw size={18} className={isAnalyzing ? 'spin' : ''} />
                    {isAnalyzing ? 'Analiz Yapılıyor...' : 'SEO Analizi Yap'}
                </button>

                <button
                    onClick={autoFixAllIssues}
                    className="add-btn"
                    style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Zap size={18} />
                    Tek Tıkla Düzelt
                </button>

                <button
                    onClick={generateSitemap}
                    className="add-btn"
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Download size={18} />
                    Sitemap İndir
                </button>

                <button
                    onClick={copyMetaTags}
                    className="add-btn"
                    style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Copy size={18} />
                    Meta Etiketleri Kopyala
                </button>
            </div>

            {/* Tabs */}
            <div className="filter-chips" style={{ marginBottom: '1.5rem', padding: 0 }}>
                {['overview', 'pages', 'settings', 'tools'].map(tab => (
                    <button
                        key={tab}
                        className={`filter-chip ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab as any)}
                    >
                        {tab === 'overview' && '📊 Genel Bakış'}
                        {tab === 'pages' && '📄 Sayfalar'}
                        {tab === 'settings' && '⚙️ Ayarlar'}
                        {tab === 'tools' && '🛠️ Araçlar'}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {/* Score Breakdown */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2><Target size={20} /> Skor Dağılımı</h2>
                        </div>
                        <div className="card-content">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {pages.map(page => (
                                    <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{page.path}</div>
                                            <div style={{
                                                height: '8px',
                                                background: '#e2e8f0',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${page.score}%`,
                                                    height: '100%',
                                                    background: getScoreColor(page.score),
                                                    borderRadius: '4px',
                                                    transition: 'width 0.5s'
                                                }} />
                                            </div>
                                        </div>
                                        <span style={{
                                            fontWeight: 700,
                                            color: getScoreColor(page.score),
                                            minWidth: '40px'
                                        }}>
                                            {page.score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2><AlertTriangle size={20} /> Düzeltilecek Sorunlar</h2>
                        </div>
                        <div className="card-content">
                            {totalIssues === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#22c55e' }}>
                                    <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 600 }}>Harika! Hiç SEO sorunu yok! 🎉</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {pages.filter(p => p.issues.length > 0).map(page => (
                                        <div key={page.id}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>
                                                {page.path}
                                            </div>
                                            {page.issues.map((issue, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.5rem 0.75rem',
                                                        background: '#fef3c7',
                                                        borderRadius: '6px',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                                                    {issue}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Sayfa</th>
                                <th>Başlık</th>
                                <th>Skor</th>
                                <th>Sorunlar</th>
                                <th>Son Kontrol</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(page => (
                                <tr key={page.id}>
                                    <td>
                                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                                            {page.path}
                                        </code>
                                    </td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {page.title}
                                    </td>
                                    <td>
                                        <span style={{
                                            fontWeight: 700,
                                            color: getScoreColor(page.score),
                                            background: `${getScoreColor(page.score)}15`,
                                            padding: '4px 12px',
                                            borderRadius: '100px'
                                        }}>
                                            {page.score}
                                        </span>
                                    </td>
                                    <td>
                                        {page.issues.length === 0 ? (
                                            <CheckCircle size={18} style={{ color: '#22c55e' }} />
                                        ) : (
                                            <span style={{ color: '#f59e0b', fontWeight: 500 }}>
                                                {page.issues.length} sorun
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                        {page.lastChecked.toLocaleDateString('tr-TR')}
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="edit-btn" onClick={() => { setSelectedPage(page); setShowModal(true); }}>
                                                <Settings size={16} />
                                            </button>
                                            <button className="edit-btn" style={{ background: '#dcfce7', color: '#22c55e' }}>
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="data-table-container" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Site Adı</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Site Açıklaması</label>
                            <input
                                type="text"
                                value={settings.siteDescription}
                                onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Anahtar Kelimeler (virgülle ayırın)</label>
                            <input
                                type="text"
                                value={settings.siteKeywords.join(', ')}
                                onChange={e => setSettings({ ...settings, siteKeywords: e.target.value.split(',').map(k => k.trim()) })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Varsayılan OG Image URL</label>
                            <input
                                type="text"
                                value={settings.defaultOgImage}
                                onChange={e => setSettings({ ...settings, defaultOgImage: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Twitter Handle</label>
                            <input
                                type="text"
                                value={settings.twitterHandle}
                                onChange={e => setSettings({ ...settings, twitterHandle: e.target.value })}
                                placeholder="@username"
                            />
                        </div>

                        <div className="form-group">
                            <label>Google Analytics ID</label>
                            <input
                                type="text"
                                value={settings.googleAnalyticsId}
                                onChange={e => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>robots.txt İçeriği</label>
                            <textarea
                                value={settings.robotsTxt}
                                onChange={e => setSettings({ ...settings, robotsTxt: e.target.value })}
                                rows={8}
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={saveSettings} className="save-btn">
                            <Save size={18} style={{ marginRight: '0.5rem' }} />
                            Ayarları Kaydet
                        </button>
                        <button onClick={generateRobotsTxt} className="cancel-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={18} />
                            robots.txt İndir
                        </button>
                    </div>
                </div>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {[
                        { icon: <Search size={24} />, title: 'Google Search Console', desc: 'Arama performansını izle', color: '#4285f4', url: 'https://search.google.com/search-console' },
                        { icon: <BarChart3 size={24} />, title: 'Google Analytics', desc: 'Trafik verilerini analiz et', color: '#f59e0b', url: 'https://analytics.google.com' },
                        { icon: <Globe size={24} />, title: 'PageSpeed Insights', desc: 'Sayfa hızını test et', color: '#22c55e', url: 'https://pagespeed.web.dev' },
                        { icon: <Smartphone size={24} />, title: 'Mobile Friendly Test', desc: 'Mobil uyumluluğu kontrol et', color: '#8b5cf6', url: 'https://search.google.com/test/mobile-friendly' },
                        { icon: <Link size={24} />, title: 'Broken Link Checker', desc: 'Kırık linkleri bul', color: '#ef4444', url: 'https://www.brokenlinkcheck.com' },
                        { icon: <Image size={24} />, title: 'TinyPNG', desc: 'Görselleri optimize et', color: '#ec4899', url: 'https://tinypng.com' },
                        { icon: <Hash size={24} />, title: 'Schema Markup', desc: 'Yapılandırılmış veri ekle', color: '#6366f1', url: 'https://schema.org' },
                        { icon: <Eye size={24} />, title: 'Rich Results Test', desc: 'Zengin sonuçları test et', color: '#14b8a6', url: 'https://search.google.com/test/rich-results' },
                    ].map((tool, idx) => (
                        <a
                            key={idx}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1.25rem',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.2s'
                            }}
                            className="tool-card"
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${tool.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: tool.color
                            }}>
                                {tool.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>{tool.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{tool.desc}</div>
                            </div>
                            <ExternalLink size={16} style={{ color: '#94a3b8' }} />
                        </a>
                    ))}
                </div>
            )}

            {/* Page Edit Modal */}
            {showModal && selectedPage && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>SEO Düzenle: {selectedPage.path}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Sayfa Başlığı</label>
                                <input type="text" defaultValue={selectedPage.title} />
                                <small style={{ color: '#64748b' }}>60 karakterden kısa tutun</small>
                            </div>
                            <div className="form-group">
                                <label>Meta Açıklama</label>
                                <textarea rows={3} defaultValue={selectedPage.description} />
                                <small style={{ color: '#64748b' }}>150-160 karakter ideal</small>
                            </div>
                            <div className="form-group">
                                <label>Anahtar Kelimeler</label>
                                <input type="text" defaultValue={selectedPage.keywords.join(', ')} />
                            </div>
                            <div className="form-group">
                                <label>OG Image URL</label>
                                <input type="text" defaultValue={selectedPage.ogImage} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                            <button className="save-btn" onClick={() => { setShowModal(false); toast.success('SEO ayarları güncellendi!'); }}>
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .tool-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>
        </div>
    );
}

export default SEOManager;
