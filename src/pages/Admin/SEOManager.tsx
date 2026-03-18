import { useState, useEffect } from 'react';
import {
    Globe,
    FileText,
    Download,
    Copy,
    ExternalLink,
    BarChart3,
    Smartphone,
    Link,
    Image,
    Hash,
    Eye,
    RefreshCw,
    Code
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

const SITE_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/games', priority: '0.9', changefreq: 'weekly' },
    { path: '/words', priority: '0.9', changefreq: 'weekly' },
    { path: '/videos', priority: '0.9', changefreq: 'weekly' },
    { path: '/worksheets', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/premium', priority: '0.8', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { path: '/terms', priority: '0.5', changefreq: 'yearly' },
    { path: '/cookies', priority: '0.5', changefreq: 'yearly' },
    { path: '/ataturk', priority: '0.7', changefreq: 'monthly' },
    { path: '/story', priority: '0.8', changefreq: 'weekly' },
];

interface SEOSettings {
    siteName: string;
    siteDescription: string;
    siteKeywords: string[];
    siteUrl: string;
    defaultOgImage: string;
    twitterHandle: string;
}

interface MetaInspection {
    url: string;
    title: string | null;
    metaDescription: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    canonical: string | null;
    status: 'ok' | 'error';
    error?: string;
}

const defaultSettings: SEOSettings = {
    siteName: 'MinesMinis',
    siteDescription: 'Premium English Learning Platform for Kids',
    siteKeywords: ['english learning', 'kids education', 'educational games', 'language learning', 'ESL for kids'],
    siteUrl: typeof window !== 'undefined' ? `${window.location.origin}` : 'https://minesminis.com',
    defaultOgImage: '/og-default.jpg',
    twitterHandle: '@minesminis',
};

import { getApiBase } from '../../utils/apiBase';

function SEOManager() {
    const [settings, setSettings] = useState<SEOSettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<'oneclick' | 'sitemap' | 'robots' | 'meta' | 'schema' | 'inspect' | 'tools'>('oneclick');
    const [blogSlugs, setBlogSlugs] = useState<string[]>([]);
    const [inspecting, setInspecting] = useState(false);
    const [inspectionResult, setInspectionResult] = useState<MetaInspection | null>(null);
    const [inspectUrl, setInspectUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSettings(s => ({ ...s, siteUrl: window.location.origin }));
        }
    }, []);

    useEffect(() => {
        const loadBlogSlugs = async () => {
            const { data } = await supabase.from('blog_posts').select('slug');
            if (data) setBlogSlugs(data.map((r: { slug?: string }) => r.slug).filter(Boolean) as string[]);
        };
        loadBlogSlugs();
    }, []);

    const generateSitemap = () => {
        const base = settings.siteUrl.replace(/\/$/, '');
        const today = new Date().toISOString().split('T')[0];
        const blogUrls = blogSlugs.map(slug => `  <url>
    <loc>${base}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
        const staticUrls = SITE_ROUTES.map(r => `  <url>
    <loc>${base}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;
        const blob = new Blob([sitemap], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        toast.success(`sitemap.xml indirildi (${SITE_ROUTES.length + blogSlugs.length} sayfa)`);
    };

    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${settings.siteUrl.replace(/\/$/, '')}/sitemap.xml`;

    const generateRobotsTxt = () => {
        const blob = new Blob([robotsTxt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        a.click();
        toast.success('robots.txt indirildi');
    };

    const inspectMeta = async () => {
        const url = inspectUrl || settings.siteUrl + '/';
        setInspecting(true);
        setInspectionResult(null);
        try {
            const res = await fetch(url, { mode: 'cors' });
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const getMeta = (name: string) => {
                const el = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
                return el?.getAttribute('content') || null;
            };
            setInspectionResult({
                url,
                title: doc.querySelector('title')?.textContent || null,
                metaDescription: getMeta('description') || getMeta('og:description'),
                ogTitle: getMeta('og:title'),
                ogDescription: getMeta('og:description'),
                ogImage: getMeta('og:image'),
                canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
                status: 'ok',
            });
            toast.success('Meta etiketleri incelendi');
        } catch (e) {
            setInspectionResult({
                url,
                title: null,
                metaDescription: null,
                ogTitle: null,
                ogDescription: null,
                ogImage: null,
                canonical: null,
                status: 'error',
                error: e instanceof Error ? e.message : 'Bağlantı hatası. Aynı domain üzerinde mi çalışıyorsunuz?',
            });
            toast.error('İnceleme başarısız');
        } finally {
            setInspecting(false);
        }
    };

    const generateMetaForPage = (path: string, title: string, description: string) => {
        const base = settings.siteUrl.replace(/\/$/, '');
        return `<!-- ${path} -->
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${base}${path}">
<meta property="og:url" content="${base}${path}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${base}${settings.defaultOgImage}">
<meta property="og:type" content="website">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;
    };

    const schemaOrgJSON = () => {
        const base = settings.siteUrl.replace(/\/$/, '');
        return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: settings.siteName,
            description: settings.siteDescription,
            url: base,
            potentialAction: {
                '@type': 'SearchAction',
                target: `${base}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        }, null, 2);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} kopyalandı`);
    };

    const [seoApplying, setSeoApplying] = useState(false);
    const handleOneClickSEO = async () => {
        setSeoApplying(true);
        try {
            const res = await fetch(`${getApiBase()}/api/seo/apply`, { method: 'POST' });
            const json = await res.json().catch(() => ({}));
            if (res.ok && json.ok) {
                toast.success('SEO uygulandı! Sitemap Google ve Bing\'e bildirildi.');
            } else if (res.status === 429) {
                toast.error('Çok fazla istek. Bir dakika bekleyip tekrar deneyin.');
            } else {
                toast.error(json.error || 'Hata oluştu. Backend çalışıyor mu?');
            }
        } catch {
            toast.error('Backend çalışmıyor. npm run dev ile başlatın.');
        } finally {
            setSeoApplying(false);
        }
    };

    const tabs = [
        { id: 'oneclick' as const, label: 'Tek Tıkla SEO', icon: <RefreshCw size={18} /> },
        { id: 'sitemap' as const, label: 'Sitemap', icon: <FileText size={18} /> },
        { id: 'robots' as const, label: 'robots.txt', icon: <Code size={18} /> },
        { id: 'meta' as const, label: 'Meta Etiketleri', icon: <Hash size={18} /> },
        { id: 'schema' as const, label: 'Schema.org', icon: <Link size={18} /> },
        { id: 'inspect' as const, label: 'Meta İncele', icon: <Eye size={18} /> },
        { id: 'tools' as const, label: 'Google Araçları', icon: <ExternalLink size={18} /> },
    ];

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>🔍 SEO Yönetimi</h1>
                <p>Gerçek SEO araçları — sitemap, robots.txt, meta etiketleri, Schema.org</p>
            </div>

            <div className="filter-chips" style={{ marginBottom: '1.5rem', padding: 0 }}>
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`filter-chip ${activeTab === t.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tek Tıkla SEO */}
            {activeTab === 'oneclick' && (
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2><RefreshCw size={20} /> Tek Tıkla SEO Uygula</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                            Sitemap Google ve Bing'e bildirilir. Sunucunuz /sitemap.xml ve /robots.txt adreslerini 7/24 sunar — bilgisayarınız kapalıyken bile (deploy edildiğinde).
                        </p>
                        <button className="add-btn" onClick={handleOneClickSEO} disabled={seoApplying} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={18} className={seoApplying ? 'spin' : ''} />
                            {seoApplying ? 'Uygulanıyor...' : 'SEO Uygula'}
                        </button>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>
                            Sunucu çalışırken <code>/sitemap.xml</code> ve <code>/robots.txt</code> her zaman güncel içerik sunar.
                        </p>
                    </div>
                </div>
            )}

            {/* Sitemap */}
            {activeTab === 'sitemap' && (
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2><FileText size={20} /> Sitemap.xml Oluştur</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                            Sitenizin tüm sayfalarını içeren sitemap.xml oluşturur. Google Search Console'a yükleyin.
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Site URL</label>
                            <input
                                type="text"
                                value={settings.siteUrl}
                                onChange={e => setSettings({ ...settings, siteUrl: e.target.value })}
                                className="search-input"
                                style={{ width: '100%', maxWidth: '400px' }}
                                placeholder="https://minesminis.com"
                            />
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
                            {SITE_ROUTES.length + blogSlugs.length} sayfa (statik + {blogSlugs.length} blog yazısı)
                        </p>
                        <button className="add-btn" onClick={generateSitemap} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={18} />
                            sitemap.xml İndir
                        </button>
                    </div>
                </div>
            )}

            {/* robots.txt */}
            {activeTab === 'robots' && (
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2><Code size={20} /> robots.txt</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                            Arama motorlarına hangi sayfaların taranacağını söyler. public/ klasörüne veya root'a koyun.
                        </p>
                        <pre style={{
                            background: '#f3f4f6',
                            padding: '1rem',
                            borderRadius: '8px',
                            overflow: 'auto',
                            fontSize: '0.85rem',
                            color: '#374151',
                            border: '1px solid #e5e7eb'
                        }}>{robotsTxt}</pre>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button className="add-btn" onClick={generateRobotsTxt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Download size={18} />
                                robots.txt İndir
                            </button>
                            <button className="cancel-btn" onClick={() => copyToClipboard(robotsTxt, 'robots.txt')}>
                                <Copy size={18} /> Kopyala
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Meta tags builder */}
            {activeTab === 'meta' && (
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2><Hash size={20} /> Meta Etiketleri Kodu</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                            index.html veya her sayfa için &lt;head&gt; içine ekleyeceğiniz meta etiketleri. Kopyalayıp yapıştırın.
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Site Adı</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                className="search-input"
                                style={{ width: '100%', maxWidth: '300px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Açıklama</label>
                            <input
                                type="text"
                                value={settings.siteDescription}
                                onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="search-input"
                                style={{ width: '100%', maxWidth: '500px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Anahtar Kelimeler (virgülle)</label>
                            <input
                                type="text"
                                value={settings.siteKeywords.join(', ')}
                                onChange={e => setSettings({ ...settings, siteKeywords: e.target.value.split(',').map(k => k.trim()) })}
                                className="search-input"
                                style={{ width: '100%', maxWidth: '500px' }}
                            />
                        </div>
                        {(['Ana Sayfa', 'Oyunlar', 'Kelimeler', 'Videolar', 'Çalışma Kağıtları', 'Blog', 'Premium'] as const).map((label, i) => {
                            const paths = ['/', '/games', '/words', '/videos', '/worksheets', '/blog', '/premium'];
                            const titles = [`${settings.siteName} - ${settings.siteDescription}`, `${settings.siteName} - Oyunlar`, `${settings.siteName} - Kelimeler`, `${settings.siteName} - Videolar`, `${settings.siteName} - Çalışma Kağıtları`, `${settings.siteName} - Blog`, `${settings.siteName} - Premium`];
                            const descs = [settings.siteDescription, 'Çocuklar için İngilizce öğrenme oyunları', 'İngilizce kelime sözlüğü ve telaffuz', 'Eğitici İngilizce videolar', 'İndirilebilir çalışma kağıtları', 'İngilizce öğrenme ipuçları', 'Premium üyelik avantajları'];
                            const code = generateMetaForPage(paths[i], titles[i], descs[i]);
                            return (
                                <div key={i} style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
                                        <button className="cancel-btn" style={{ padding: '0.35rem 0.75rem' }} onClick={() => copyToClipboard(code, label)}>
                                            <Copy size={14} /> Kopyala
                                        </button>
                                    </div>
                                    <pre style={{
                                        background: '#f3f4f6',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        color: '#374151',
                                        overflow: 'auto',
                                        border: '1px solid #e5e7eb'
                                    }}>{code}</pre>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Schema.org */}
            {activeTab === 'schema' && (
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2><Link size={20} /> Schema.org JSON-LD</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                            WebSite şeması — Google'ın sitenizi daha iyi anlamasına yardımcı olur. &lt;head&gt; içine script olarak ekleyin.
                        </p>
                        <pre style={{
                            background: '#f3f4f6',
                            padding: '1rem',
                            borderRadius: '8px',
                            overflow: 'auto',
                            fontSize: '0.85rem',
                            color: '#374151',
                            border: '1px solid #e5e7eb'
                        }}>{schemaOrgJSON()}</pre>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                            Kullanım: &lt;script type="application/ld+json"&gt;{schemaOrgJSON().slice(0, 50)}...&lt;/script&gt;
                        </p>
                        <button className="cancel-btn" style={{ marginTop: '1rem' }} onClick={() => copyToClipboard(schemaOrgJSON(), 'Schema.org JSON-LD')}>
                            <Copy size={18} /> Kopyala
                        </button>
                    </div>
                </div>
            )}

            {/* Meta Inspector */}
            {activeTab === 'inspect' && (
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2><Eye size={20} /> Meta Etiketleri İncele</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                            Bir sayfanın HTML'inden gerçek meta etiketlerini okur. Aynı domain üzerinde çalışır (CORS).
                        </p>
                        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                value={inspectUrl || settings.siteUrl + '/'}
                                onChange={e => setInspectUrl(e.target.value)}
                                placeholder={settings.siteUrl + '/'}
                                className="search-input"
                                style={{ flex: 1, minWidth: '250px' }}
                            />
                            <button className="add-btn" onClick={inspectMeta} disabled={inspecting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <RefreshCw size={18} className={inspecting ? 'spin' : ''} />
                                {inspecting ? 'İnceleniyor...' : 'İncele'}
                            </button>
                        </div>
                        {inspectionResult && (
                            <div style={{
                                background: inspectionResult.status === 'error' ? 'rgba(239,68,68,0.05)' : '#f9fafb',
                                border: `1px solid ${inspectionResult.status === 'error' ? 'rgba(239,68,68,0.3)' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                padding: '1rem'
                            }}>
                                {inspectionResult.status === 'error' ? (
                                    <p style={{ color: '#dc2626' }}>{inspectionResult.error}</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div><span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>URL:</span> <span style={{ color: '#1a1a2e' }}>{inspectionResult.url}</span></div>
                                        <div><span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>title:</span> {inspectionResult.title ? <span style={{ color: '#059669' }}>{inspectionResult.title}</span> : <span style={{ color: '#dc2626' }}>Yok</span>}</div>
                                        <div><span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>meta description:</span> {inspectionResult.metaDescription ? <span style={{ color: '#059669' }}>{inspectionResult.metaDescription}</span> : <span style={{ color: '#dc2626' }}>Yok</span>}</div>
                                        <div><span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>og:title:</span> {inspectionResult.ogTitle ? <span style={{ color: '#059669' }}>{inspectionResult.ogTitle}</span> : <span style={{ color: '#dc2626' }}>Yok</span>}</div>
                                        <div><span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>og:image:</span> {inspectionResult.ogImage ? <span style={{ color: '#059669' }}>{inspectionResult.ogImage}</span> : <span style={{ color: '#dc2626' }}>Yok</span>}</div>
                                        <div><span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>canonical:</span> {inspectionResult.canonical ? <span style={{ color: '#059669' }}>{inspectionResult.canonical}</span> : <span style={{ color: '#dc2626' }}>Yok</span>}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Google Tools */}
            {activeTab === 'tools' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[
                        { icon: <Globe size={24} />, title: 'Google Search Console', desc: 'Arama performansı, indexleme', url: 'https://search.google.com/search-console', color: '#4285f4' },
                        { icon: <BarChart3 size={24} />, title: 'Google Analytics', desc: 'Trafik analizi', url: 'https://analytics.google.com', color: '#f59e0b' },
                        { icon: <Globe size={24} />, title: 'PageSpeed Insights', desc: 'Sayfa hızı testi', url: 'https://pagespeed.web.dev', color: '#22c55e' },
                        { icon: <Smartphone size={24} />, title: 'Mobile Friendly Test', desc: 'Mobil uyumluluk', url: 'https://search.google.com/test/mobile-friendly', color: '#8b5cf6' },
                        { icon: <Link size={24} />, title: 'Kırık Link Kontrolü', desc: 'Broken link tespiti', url: 'https://www.brokenlinkcheck.com', color: '#ef4444' },
                        { icon: <Image size={24} />, title: 'TinyPNG', desc: 'Görsel sıkıştırma', url: 'https://tinypng.com', color: '#ec4899' },
                        { icon: <Eye size={24} />, title: 'Rich Results Test', desc: 'Zengin sonuç önizleme', url: 'https://search.google.com/test/rich-results', color: '#14b8a6' },
                    ].map((t, i) => (
                        <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" className="dashboard-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color }}>{t.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{t.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.desc}</div>
                            </div>
                            <ExternalLink size={16} style={{ color: '#94a3b8' }} />
                        </a>
                    ))}
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default SEOManager;
