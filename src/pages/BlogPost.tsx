import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { supabase } from '../config/supabase';
import { getBlogCoverUrl, getAvatarThumbnailUrl } from '../utils/imageTransform';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import PublicLayout from '../components/layout/PublicLayout';
import './Blog.css';

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Remove dangerous tags
  doc.querySelectorAll('script, style, iframe, object, embed, form, input').forEach(el => el.remove());
  // Remove event handlers and dangerous attributes
  doc.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || attr.name === 'srcdoc') el.removeAttribute(attr.name);
      if (['href', 'src', 'action'].includes(attr.name) && attr.value.trim().toLowerCase().startsWith('javascript:')) { el.removeAttribute(attr.name); }
    });
  });
  return doc.body.innerHTML;
}

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  published_at: string;
  created_at: string;
  cover_image_url?: string;
  category?: string;
  read_time_minutes?: number;
  author_name?: string;
  author_role?: string;
  author_avatar_url?: string;
  author_bio?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Tips': 'var(--accent-indigo)',
  'Grammar': 'var(--accent-emerald)',
  'Vocabulary': 'var(--accent-purple)',
  'News': 'var(--warning)',
  'Games': 'var(--accent-pink)',
  'Reading': 'var(--secondary)',
};

function getCategoryColor(cat?: string): string {
  if (!cat) return 'var(--primary)';
  return CATEGORY_COLORS[cat] ?? 'var(--primary)';
}

function estimateReadTime(content: string, readTimeMins?: number): number {
  if (readTimeMins) return readTimeMins;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 250));
}

const APP_NAME = 'MinesMinis';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  usePageTitle('Blog Yazısı', 'Blog Post');
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPost = useCallback(async () => {
    setError(false);
    try {
      const result = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, excerpt, meta_title, meta_description, published_at, created_at, cover_image_url, category, read_time_minutes, author')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .maybeSingle();

      if (result.error) {
        setError(true);
        setPost(null);
      } else {
        setPost(result.data);
      }
    } catch {
      setError(true);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetchPost();
  }, [slug, fetchPost]);

  // Dynamic SEO: update title + meta description once post is loaded
  useEffect(() => {
    if (!post) return;
    const seoTitle = post.meta_title || post.title;
    document.title = `${seoTitle} — ${APP_NAME}`;
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = post.meta_description || post.excerpt || '';
    return () => {
      document.title = APP_NAME;
      if (metaDesc) metaDesc.content = '';
    };
  }, [post]);

  const backLabel = lang === 'tr' ? 'Bloga Dön' : 'Back to Blog';
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';

  if (loading) return (
    <PublicLayout>
      <div className="blog-page blog-post-page">
        <div className="blog-loading">
          <Loader2 size={36} className="blog-loading-spinner" />
          <span>{lang === 'tr' ? 'Yükleniyor...' : 'Loading...'}</span>
        </div>
      </div>
    </PublicLayout>
  );

  if (error) return (
    <PublicLayout>
      <div className="blog-page blog-post-page">
        <Link to="/blog" className="blog-back"><ArrowLeft size={16} /> {backLabel}</Link>
        <div className="blog-empty">
          <p className="blog-empty-title">{lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred'}</p>
          <p className="blog-empty-sub">{lang === 'tr' ? 'Yazı yüklenirken bir hata oluştu.' : 'An error occurred while loading the post.'}</p>
        </div>
      </div>
    </PublicLayout>
  );

  if (!post) return (
    <PublicLayout>
      <div className="blog-page blog-post-page">
        <Link to="/blog" className="blog-back"><ArrowLeft size={16} /> {backLabel}</Link>
        <div className="blog-empty">
          <p className="blog-empty-title">{lang === 'tr' ? 'Yazı bulunamadı' : 'Post not found'}</p>
          <p className="blog-empty-sub">{lang === 'tr' ? 'Bu yazı mevcut değil veya kaldırılmış olabilir.' : 'This post may not exist or has been removed.'}</p>
        </div>
      </div>
    </PublicLayout>
  );

  const readTime = estimateReadTime(post.content || '', post.read_time_minutes);
  const authorInitial = post.author_name ? post.author_name.charAt(0).toUpperCase() : 'M';

  return (
    <PublicLayout>
      <div className="blog-page blog-post-page">
        <Link to="/blog" className="blog-back">
          <ArrowLeft size={16} /> {backLabel}
        </Link>

        <article className="blog-post">
          {/* Hero image */}
          {post.cover_image_url && (
            <div className="blog-post-hero">
              <img src={getBlogCoverUrl(post.cover_image_url) ?? post.cover_image_url} alt={post.title} loading="eager" />
            </div>
          )}

          <header>
            {/* Category + featured chips */}
            {post.category && (
              <div className="blog-post-category-row">
                <span
                  className="blog-category-chip"
                  style={{ background: getCategoryColor(post.category) }}
                >
                  {post.category}
                </span>
              </div>
            )}

            <h1>{post.title}</h1>

            <div className="blog-post-meta-row">
              <span className="blog-date">
                <Calendar size={14} />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </span>
              <span className="blog-read-time">
                <Clock size={14} />
                {readTime}{lang === 'tr' ? ' dk okuma' : ' min read'}
              </span>
            </div>
          </header>

          {/* Article body */}
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || '') }}
          />

          {/* Author bio */}
          <aside className="blog-author-bio" aria-label={lang === 'tr' ? 'Yazar hakkında' : 'About the author'}>
            <div className="blog-author-avatar">
              {post.author_avatar_url ? (
                <img src={getAvatarThumbnailUrl(post.author_avatar_url) ?? post.author_avatar_url ?? ''} alt={post.author_name ?? 'Author'} loading="lazy" width={48} height={48} />
              ) : (
                authorInitial
              )}
            </div>
            <div className="blog-author-info">
              <p className="blog-author-name">{post.author_name ?? 'MinesMinis Team'}</p>
              <p className="blog-author-role">{post.author_role ?? (lang === 'tr' ? 'İçerik Yazarı' : 'Content Writer')}</p>
              {post.author_bio && (
                <p className="blog-author-desc">{post.author_bio}</p>
              )}
            </div>
          </aside>
        </article>
      </div>
    </PublicLayout>
  );
}
