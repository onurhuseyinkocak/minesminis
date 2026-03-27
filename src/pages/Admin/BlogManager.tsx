import { useState, useEffect, useCallback } from 'react';
import {
  PenSquare,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Save,
  X,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './BlogManager.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

interface DraftForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  meta_title: string;
  meta_description: string;
}

interface FormErrors {
  title?: string;
  slug?: string;
  content?: string;
}

const emptyForm = (): DraftForm => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published_at: new Date().toISOString().split('T')[0],
  meta_title: '',
  meta_description: '',
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function validateForm(form: DraftForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Baslik zorunlu';
  if (!form.slug.trim()) errors.slug = 'Slug zorunlu';
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = 'Slug sadece kucuk harf, rakam ve tire icermelidir';
  if (!form.content.trim()) errors.content = 'Icerik zorunlu';
  return errors;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState<DraftForm>(emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dbAvailable, setDbAvailable] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, meta_title, meta_description, content, published_at, created_at, cover_image_url, category, read_time_minutes, author')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setDbAvailable(false);
          setPosts([]);
        } else {
          toast.error(`Blog yazilari yuklenemedi: ${error.message}`);
        }
        return;
      }
      setDbAvailable(true);
      setPosts((data as unknown as BlogPost[]) || []);
    } catch {
      toast.error('Blog yazilari yuklenirken hata olustu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const closeEditor = () => {
    setShowEditor(false);
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setSlugManuallyEdited(false);
  };

  const openNewEditor = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setSlugManuallyEdited(false);
    setShowEditor(true);
  };

  const openEditEditor = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      published_at: post.published_at ? post.published_at.split('T')[0] : '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
    });
    setErrors({});
    setSlugManuallyEdited(true);
    setShowEditor(true);
  };

  const handleTitleChange = (title: string) => {
    setForm(f => {
      const updated = { ...f, title };
      if (!slugManuallyEdited) {
        updated.slug = generateSlug(title);
      }
      if (!f.meta_title) {
        updated.meta_title = title;
      }
      return updated;
    });
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setForm(f => ({ ...f, slug }));
  };

  const handleSave = async () => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Lutfen zorunlu alanlari doldurun');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt || form.content.slice(0, 200),
            content: form.content,
            published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
            meta_title: form.meta_title || form.title,
            meta_description: form.meta_description || form.excerpt || '',
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Blog yazisi guncellendi');
      } else {
        const res = await adminFetch('/api/admin/blog', {
          method: 'POST',
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt || form.content.slice(0, 200),
            content: form.content,
            published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
            meta_title: form.meta_title || form.title,
            meta_description: form.meta_description || form.excerpt || '',
          }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({ error: 'Bilinmeyen hata' }));
          const errMsg =
            res.status === 401 || res.status === 403
              ? 'Yetkisiz. Admin olarak giris yapin.'
              : res.status === 429
                ? 'Cok fazla istek. Bir dakika bekleyip tekrar deneyin.'
                : (json as { error?: string }).error || 'Kaydetme basarisiz';
          throw new Error(errMsg);
        }
        toast.success('Blog yazisi kaydedildi');
      }
      closeEditor();
      await loadPosts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (post: BlogPost) => {
    setDeleteTarget(post);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    const post = deleteTarget;
    setDeleteTarget(null);
    setDeleting(post.id);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      toast.success('Blog yazisi silindi');
      await loadPosts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Silme basarisiz';
      toast.error(msg);
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const isPublished = !!post.published_at;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          published_at: isPublished ? null : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (error) throw error;
      toast.success(isPublished ? 'Yazi yayin disina alindi' : 'Yazi yayinlandi');
      await loadPosts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Guncelleme basarisiz';
      toast.error(msg);
    }
  };

  const handleGenerateDaily = async () => {
    setGenerating(true);
    try {
      const genRes = await adminFetch('/api/blog/generate', { method: 'POST' });
      const genJson = await genRes.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!genRes.ok || !genJson.ok) {
        const err =
          genRes.status === 401 || genRes.status === 403
            ? 'Yetkisiz. Admin olarak giris yapin.'
            : genRes.status === 429
              ? 'Cok fazla istek. Bir dakika bekleyip tekrar deneyin.'
              : genJson.error || 'Olusturma basarisiz';
        toast.error(err);
        return;
      }
      toast.success('Blog yazisi AI ile olusturuldu!');
      await loadPosts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      toast.error(`API baglantisi kurulamadi: ${msg}`);
    } finally {
      setGenerating(false);
    }
  };

  const publishedCount = posts.filter(p => !!p.published_at).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div className="admin-page admin-blog-manager">
      <div className="admin-header">
        <div>
          <h1><PenSquare size={28} /> Blog Yonetimi</h1>
          <p>SEO odakli blog yazilari ({posts.length} yazi, {publishedCount} yayinda, {draftCount} taslak)</p>
        </div>
        <div className="admin-blog-actions">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={handleGenerateDaily}
            disabled={generating || !dbAvailable}
            title={!dbAvailable ? 'blog_posts tablosu gerekli' : ''}
          >
            <RefreshCw size={18} className={generating ? 'spin' : ''} />
            {generating ? 'Olusturuluyor...' : 'AI Makale Olustur'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={openNewEditor}
            disabled={!dbAvailable}
            title={!dbAvailable ? 'blog_posts tablosu gerekli' : ''}
          >
            <Plus size={18} /> Yeni Yazi
          </button>
        </div>
      </div>

      {/* DB not available notice */}
      {!dbAvailable && (
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
          <AlertCircle size={24} style={{ color: 'var(--warning, #f59e0b)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1rem' }}>
              blog_posts tablosu bulunamadi
            </strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary, #666)', lineHeight: '1.5' }}>
              Supabase veritabaninda <code>blog_posts</code> tablosu henuz olusturulmamis.
              Migration dosyasini calistirin veya Supabase Dashboard uzerinden tabloyu olusturun.
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="admin-blog-empty">
          <RefreshCw size={32} className="spin" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <p>Blog yazilari yukleniyor...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && dbAvailable && posts.length === 0 && (
        <div className="admin-blog-empty">
          <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <p>Henuz blog yazisi yok</p>
          <p className="admin-blog-empty-hint">
            "Yeni Yazi" butonuna tiklayarak ilk yaziyi olusturun veya AI ile otomatik olusturun.
          </p>
        </div>
      )}

      {/* Blog post list */}
      {!loading && posts.length > 0 && (
        <div className="admin-blog-list">
          {posts.map(post => (
            <div key={post.id} className="admin-blog-card">
              <div style={{ flex: 1 }}>
                <h3>
                  {post.title}
                  {!post.published_at && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'var(--bg-muted, #f59e0b20)',
                      color: 'var(--warning, #f59e0b)',
                      fontWeight: 600,
                      verticalAlign: 'middle',
                    }}>
                      TASLAK
                    </span>
                  )}
                </h3>
                <p className="admin-blog-excerpt">{post.excerpt || post.content?.slice(0, 150)}</p>
                <div className="admin-blog-meta">
                  <span>/{post.slug}</span>
                  {post.published_at && (
                    <span className="published">
                      Yayinlanma: {new Date(post.published_at).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                  {post.created_at && (
                    <span style={{ marginLeft: '0.75rem' }}>
                      Olusturulma: {new Date(post.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>
              </div>
              <div className="admin-blog-card-actions">
                <button
                  type="button"
                  className="admin-btn-icon"
                  onClick={() => handleTogglePublish(post)}
                  title={post.published_at ? 'Yayin disina al' : 'Yayinla'}
                >
                  {post.published_at ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-icon"
                  title="Onizle"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  type="button"
                  className="admin-btn-icon"
                  onClick={() => openEditEditor(post)}
                  title="Duzenle"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  className="admin-btn-icon admin-btn-icon-danger"
                  onClick={() => handleDelete(post)}
                  disabled={deleting === post.id}
                  title="Sil"
                >
                  {deleting === post.id ? <RefreshCw size={16} className="spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="admin-blog-editor-overlay" onClick={closeEditor}>
          <div className="admin-blog-editor" onClick={(e) => e.stopPropagation()}>
            <div className="admin-blog-editor-header">
              <h2>{editingId ? 'Yaziyi Duzenle' : 'Yeni Yazi'}</h2>
              <button type="button" className="admin-btn-icon" onClick={closeEditor} title="Kapat">
                <X size={18} />
              </button>
            </div>

            <div className="admin-blog-form">
              <div className="admin-blog-form-row">
                <label>Baslik *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Blog yazisi basligi"
                  style={errors.title ? { borderColor: '#ef4444' } : undefined}
                />
                {errors.title && <span className="admin-blog-field-error">{errors.title}</span>}
              </div>

              <div className="admin-blog-form-row">
                <label>Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="url-dostu-slug"
                  style={errors.slug ? { borderColor: '#ef4444' } : undefined}
                />
                {errors.slug && <span className="admin-blog-field-error">{errors.slug}</span>}
                {form.slug && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    /blog/{form.slug}
                  </span>
                )}
              </div>

              <div className="admin-blog-form-row">
                <label>Ozet</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Kisa ozet (liste gorunumunde gosterilir)"
                />
              </div>

              <div className="admin-blog-form-row">
                <label>Icerik *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Blog yazisinin tam icerigi..."
                  rows={12}
                  style={errors.content ? { borderColor: '#ef4444' } : undefined}
                />
                {errors.content && <span className="admin-blog-field-error">{errors.content}</span>}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {form.content.length} karakter
                </span>
              </div>

              <div className="admin-blog-form-row">
                <label>Yayin Tarihi</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Bos birakilirsa taslak olarak kaydedilir
                </span>
              </div>

              <div className="admin-blog-form-row">
                <label>Meta Baslik (SEO)</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                  placeholder="SEO icin meta baslik"
                />
                <span style={{ fontSize: '0.75rem', color: form.meta_title.length > 60 ? '#ef4444' : 'var(--text-muted)', textAlign: 'right' }}>
                  {form.meta_title.length}/60 karakter
                </span>
              </div>

              <div className="admin-blog-form-row">
                <label>Meta Aciklama (SEO)</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  placeholder="SEO icin meta aciklama (155 karakter onerilir)"
                  rows={3}
                />
                <span style={{ fontSize: '0.75rem', color: form.meta_description.length > 155 ? '#ef4444' : 'var(--text-muted)', textAlign: 'right' }}>
                  {form.meta_description.length}/155 karakter
                </span>
              </div>
            </div>

            <div className="admin-blog-editor-footer">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={closeEditor} disabled={saving}>
                Iptal
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <><RefreshCw size={16} className="spin" /> Kaydediliyor...</>
                ) : (
                  <><Save size={16} /> {editingId ? 'Guncelle' : 'Kaydet'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={doDelete}
        title="Blog Yazisini Sil"
        message={deleteTarget ? `"${deleteTarget.title}" yazisini silmek istediginize emin misiniz? Bu islem geri alinamaz.` : ''}
        confirmLabel="Evet, Sil"
        variant="danger"
        loading={deleting !== null}
      />
    </div>
  );
}
