import { useState, useEffect } from 'react';
import { PenSquare, Plus, Edit2, ExternalLink, RefreshCw } from 'lucide-react';
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

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Blog table may not exist, using empty list:', error);
        setPosts([]);
      } else {
        setPosts(data || []);
      }
    } catch (e) {
      console.error('Blog fetch error:', e);
      setPosts([]);
    } finally {
      setLoading(false);
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
      alert('Günlük blog yazısı oluşturuldu!');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      console.error('Blog API error:', e);
      alert(`API bağlantısı kurulamadı. Sunucu çalışıyor olmalı (npm run dev). Hata: ${msg}`);
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
            <RefreshCw size={18} className={generating ? 'spin' : ''} />
            {generating ? 'Oluşturuluyor...' : 'Günlük Makale Oluştur'}
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => { setEditingPost(null); setShowEditor(true); }}>
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
                  <button className="admin-btn-icon" onClick={() => { setEditingPost(p); setShowEditor(true); }} title="Düzenle">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showEditor && (
        <div className="admin-blog-editor-overlay" onClick={() => setShowEditor(false)}>
          <div className="admin-blog-editor" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h2>
            <p className="admin-blog-editor-hint">SEO için: meta_title, meta_description ve slug önemli. Supabase blog_posts tablosuna kaydedilir.</p>
            <button className="admin-btn" onClick={() => setShowEditor(false)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}
