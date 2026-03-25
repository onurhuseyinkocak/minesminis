import { useState, useEffect } from 'react';
import { PenSquare, Plus, Edit2, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { adminFetch, getAdminApiBase } from '../../utils/adminApi';
import './BlogManager.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const emptyForm = (): Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published_at: '',
  meta_title: '',
  meta_description: '',
});

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    fetchPosts();
  }, []);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setPosts([]);
      } else {
        setPosts(data || []);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (post: BlogPost | null) => {
    setEditingPost(post);
    if (post) {
      setForm({
        title: post.title ?? '',
        slug: post.slug ?? '',
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        published_at: post.published_at ? post.published_at.slice(0, 10) : '',
        meta_title: post.meta_title ?? '',
        meta_description: post.meta_description ?? '',
      });
    } else {
      setForm(emptyForm());
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      addToast('Başlık ve slug zorunludur.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
        meta_title: form.meta_title.trim(),
        meta_description: form.meta_description.trim(),
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editingPost.id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? (data as BlogPost) : p)));
        addToast('Blog yazısı güncellendi.', 'success');
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw new Error(error.message);
        setPosts((prev) => [data as BlogPost, ...prev]);
        addToast('Blog yazısı oluşturuldu.', 'success');
      }
      closeEditor();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      addToast(`Kayıt başarısız: ${msg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    const confirmed = window.confirm(`"${post.title}" yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw new Error(error.message);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      addToast('Blog yazısı silindi.', 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      addToast(`Silme başarısız: ${msg}`, 'error');
    }
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
        const err = genRes.status === 401 || genRes.status === 403 ? 'Yetkisiz. Admin olarak giriş yapın.' : genRes.status === 429 ? 'Çok fazla istek. Bir dakika bekleyip tekrar deneyin.' : (genJson.error || 'Oluşturma başarısız');
        alert(err);
        return;
      }
      const post = genJson.post;
      const saveRes = await adminFetch('/api/admin/blog', {
        method: 'POST',
        body: JSON.stringify({
          title: post.title,
          slug: post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          content: post.content,
          excerpt: post.excerpt || post.content?.slice(0, 200),
          meta_title: post.meta_title || post.title,
          meta_description: post.meta_description || post.excerpt,
          published_at: post.published_at || new Date().toISOString(),
        }),
      });
      const saveJson = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) {
        alert(saveJson.error || 'Kayıt başarısız. Supabase migration (blog_posts) çalıştırıldı mı?');
        return;
      }
      await fetchPosts();
      addToast('Günlük blog yazısı oluşturuldu!', 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      alert(`API bağlantısı kurulamadı. Sunucu çalışıyor olmalı (npm run dev). Hata: ${msg}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="admin-page admin-blog-manager">
      {/* Toast notifications */}
      <div className="admin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

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
            <RefreshCw size={18} className={generating ? 'spin' : ''} />
            {generating ? 'Oluşturuluyor...' : 'Günlük Makale Oluştur'}
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => openEditor(null)}>
            <Plus size={18} /> Yeni Yazı
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loading-spinner" /><p>Yükleniyor...</p></div>
      ) : (
        <div className="admin-blog-list">
          {posts.length === 0 ? (
            <div className="admin-blog-empty">
              <PenSquare size={48} />
              <p>Henüz blog yazısı yok.</p>
              <p className="admin-blog-empty-hint">Günlük makale oluştur veya manuel ekle. Supabase&apos;te blog_posts tablosu gerekir.</p>
              <button className="admin-btn admin-btn-primary" onClick={handleGenerateDaily} disabled={generating}>
                Günlük Makale Oluştur
              </button>
            </div>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="admin-blog-card">
                <div className="admin-blog-card-main">
                  <h3>{p.title}</h3>
                  <p className="admin-blog-excerpt">{p.excerpt || p.content?.slice(0, 120)}</p>
                  <div className="admin-blog-meta">
                    <span>{new Date(p.created_at).toLocaleDateString('tr-TR')}</span>
                    {p.published_at && <span className="published">Yayında</span>}
                  </div>
                </div>
                <div className="admin-blog-card-actions">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn-icon" title="Görüntüle">
                    <ExternalLink size={18} />
                  </a>
                  <button className="admin-btn-icon" onClick={() => openEditor(p)} title="Düzenle">
                    <Edit2 size={18} />
                  </button>
                  <button className="admin-btn-icon admin-btn-icon-danger" onClick={() => handleDelete(p)} title="Sil">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showEditor && (
        <div className="admin-blog-editor-overlay" onClick={closeEditor}>
          <div className="admin-blog-editor" onClick={(e) => e.stopPropagation()}>
            <div className="admin-blog-editor-header">
              <h2>{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h2>
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
            </div>

            <div className="admin-blog-editor-footer">
              <button className="admin-btn admin-btn-secondary" onClick={closeEditor} disabled={saving}>
                İptal
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Kaydediliyor...' : (editingPost ? 'Güncelle' : 'Kaydet')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
