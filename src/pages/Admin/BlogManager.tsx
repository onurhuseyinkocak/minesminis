import { useState } from 'react';
import { PenSquare, Plus, Construction } from 'lucide-react';
import { adminFetch, getAdminApiBase } from '../../utils/adminApi';
import './BlogManager.css';

interface DraftForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  meta_title: string;
  meta_description: string;
}

const emptyForm = (): DraftForm => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published_at: '',
  meta_title: '',
  meta_description: '',
});

export default function BlogManager() {
  const [showEditor, setShowEditor] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState<DraftForm>(emptyForm());

  const closeEditor = () => {
    setShowEditor(false);
    setForm(emptyForm());
  };

  const handleGenerateDaily = async () => {
    setGenerating(true);
    try {
      const healthRes = await fetch(`${getAdminApiBase()}/api/health`).catch(() => null);
      if (!healthRes?.ok) {
        alert('Backend sunucusu erişilemiyor. Lütfen "npm run dev" ile hem frontend hem backend\'i başlatın (port 3001).');
        return;
      }
      const genRes = await adminFetch('/api/blog/generate', { method: 'POST' });
      const genJson = await genRes.json().catch(() => ({}));
      if (!genRes.ok || !genJson.ok) {
        const err =
          genRes.status === 401 || genRes.status === 403
            ? 'Yetkisiz. Admin olarak giriş yapın.'
            : genRes.status === 429
              ? 'Çok fazla istek. Bir dakika bekleyip tekrar deneyin.'
              : genJson.error || 'Oluşturma başarısız';
        alert(err);
        return;
      }
      alert('Blog yazısı oluşturuldu! blog_posts tablosu oluşturulduğunda buraya kaydedilecek.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      alert(`API bağlantısı kurulamadı. Hata: ${msg}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="admin-page admin-blog-manager">
      <div className="admin-header">
        <div>
          <h1><PenSquare size={28} /> Blog Yönetimi</h1>
          <p>SEO odaklı blog yazıları</p>
        </div>
        <div className="admin-blog-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleGenerateDaily}
            disabled={generating}
          >
            {generating ? 'Oluşturuluyor...' : 'Günlük Makale Oluştur'}
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowEditor(true)}>
            <Plus size={18} /> Yeni Yazı
          </button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div
        className="adm-coming-soon-notice"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          background: 'var(--bg-muted, #fff8e6)',
          border: '1px solid var(--warning, #f59e0b)',
          borderRadius: '10px',
          padding: '18px 20px',
          marginBottom: '24px',
        }}
      >
        <Construction size={24} style={{ color: 'var(--warning, #f59e0b)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1rem' }}>
            Blog feature is under development
          </strong>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary, #666)', lineHeight: '1.5' }}>
            The <code>blog_posts</code> table does not yet exist in Supabase. Once the database migration is run,
            blog posts will be stored and listed here. You can preview the editor form below, but saving is disabled
            until the table is available.
          </p>
        </div>
      </div>

      {/* Editor Preview */}
      {showEditor && (
        <div className="admin-blog-editor-overlay" onClick={closeEditor}>
          <div className="admin-blog-editor" onClick={(e) => e.stopPropagation()}>
            <div className="admin-blog-editor-header">
              <h2>Yeni Yazı (Preview — DB not available)</h2>
            </div>

            <div className="admin-blog-form">
              <div className="admin-blog-form-row">
                <label>Başlık *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Blog yazısı başlığı"
                />
              </div>

              <div className="admin-blog-form-row">
                <label>Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="url-dostu-slug"
                />
              </div>

              <div className="admin-blog-form-row">
                <label>Özet</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Kısa özet (liste görünümünde gösterilir)"
                />
              </div>

              <div className="admin-blog-form-row">
                <label>İçerik</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Blog yazısının tam içeriği..."
                  rows={8}
                />
              </div>

              <div className="admin-blog-form-row">
                <label>Yayın Tarihi</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                />
              </div>

              <div className="admin-blog-form-row">
                <label>Meta Başlık</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                  placeholder="SEO için meta başlık"
                />
              </div>

              <div className="admin-blog-form-row">
                <label>Meta Açıklama</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  placeholder="SEO için meta açıklama (155 karakter önerilir)"
                  rows={3}
                />
              </div>

              <div
                style={{
                  background: 'var(--bg-muted, #fff8e6)',
                  border: '1px solid var(--warning, #f59e0b)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary, #666)',
                }}
              >
                Saving is disabled — <code>blog_posts</code> table not yet created in Supabase.
                Run the migration to enable this feature.
              </div>
            </div>

            <div className="admin-blog-editor-footer">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={closeEditor}>
                Kapat
              </button>
              <button type="button" className="admin-btn admin-btn-primary" disabled title="blog_posts tablosu gerekli">
                Kaydet (Devre Disi)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
