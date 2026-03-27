import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import LottieCharacter from '../components/LottieCharacter';
import PublicLayout from '../components/layout/PublicLayout';
import './Blog.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  published_at: string;
  created_at: string;
  cover_image_url?: string;
  category?: string;
  read_time_minutes?: number;
}

const POSTS_PER_PAGE = 9;

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

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function estimateReadTime(post: BlogPost): number {
  if (post.read_time_minutes) return post.read_time_minutes;
  const words = (post.excerpt || post.meta_description || '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { lang } = useLanguage();
  usePageTitle('Blog', 'Blog');

  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, meta_title, meta_description, published_at, created_at, cover_image_url, category, read_time_minutes')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(100);

      if (!error) {
        setPosts(data || []);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[];
  const filteredPosts = activeCategory ? posts.filter(p => p.category === activeCategory) : posts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagePosts = filteredPosts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);
  const featuredPost = page === 0 && pagePosts.length > 0 ? pagePosts[0] : null;
  const regularPosts = page === 0 && pagePosts.length > 0 ? pagePosts.slice(1) : pagePosts;

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    setPage(0);
  };

  return (
    <PublicLayout>
      <div className="blog-page">
        <header className="blog-header">
          <h1>Blog</h1>
          <p>
            {lang === 'tr'
              ? 'İngilizce öğrenme ipuçları ve MinesMinis haberleri'
              : 'English learning tips & MinesMinis news'}
          </p>
        </header>

        {!loading && !error && categories.length > 0 && (
          <nav className="blog-category-tabs" aria-label={lang === 'tr' ? 'Kategori filtresi' : 'Category filter'}>
            <button
              className={`blog-category-tab${activeCategory === null ? ' active' : ''}`}
              onClick={() => handleCategoryChange(null)}
            >
              {lang === 'tr' ? 'Tümü' : 'All'}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`blog-category-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
                style={activeCategory === cat ? { background: getCategoryColor(cat) } : undefined}
              >
                {cat}
              </button>
            ))}
          </nav>
        )}

        {loading ? (
          <div className="blog-loading">
            <Loader2 size={36} className="blog-loading-spinner" />
            <span>{lang === 'tr' ? 'Yükleniyor...' : 'Loading...'}</span>
          </div>
        ) : error ? (
          <div className="blog-empty">
            <span className="blog-empty-icon"><LottieCharacter state="thinking" size={120} /></span>
            <p className="blog-empty-title">{lang === 'tr' ? 'Bir hata oluştu' : 'Something went wrong'}</p>
            <p className="blog-empty-sub">{lang === 'tr' ? 'Blog yazıları yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.' : 'Failed to load blog posts. Please try again later.'}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            <span className="blog-empty-icon"><LottieCharacter state="wave" size={120} /></span>
            <p className="blog-empty-title">{lang === 'tr' ? 'Yakında Burada!' : 'Coming Soon!'}</p>
            <p className="blog-empty-sub">{lang === 'tr' ? 'Harika içerikler hazırlanıyor. Takipte kal!' : 'Amazing content is on the way. Stay tuned!'}</p>
          </div>
        ) : (
          <>
            {/* Featured post — first item on page 0 */}
            {featuredPost && (
              <article className="blog-card blog-card--featured">
                <Link to={`/blog/${featuredPost.slug}`} className="blog-card-link">
                  {featuredPost.cover_image_url && (
                    <div className="blog-card-image blog-card-image--featured">
                      <img src={featuredPost.cover_image_url} alt={featuredPost.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      {featuredPost.category && (
                        <span
                          className="blog-category-chip"
                          style={{ background: getCategoryColor(featuredPost.category) }}
                        >
                          {featuredPost.category}
                        </span>
                      )}
                      <span className="blog-featured-label">
                        {lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
                      </span>
                    </div>
                    <h2 className="blog-card-title">{featuredPost.title}</h2>
                    <p className="blog-excerpt">{featuredPost.excerpt || featuredPost.meta_description}</p>
                    <div className="blog-card-footer">
                      <span className="blog-date">
                        <Calendar size={13} />
                        <time dateTime={featuredPost.published_at}>
                          {formatDate(featuredPost.published_at, locale)}
                        </time>
                      </span>
                      <span className="blog-read-time">
                        <Clock size={13} />
                        {estimateReadTime(featuredPost)}{lang === 'tr' ? ' dk okuma' : ' min read'}
                      </span>
                      <span className="blog-read-more">
                        {lang === 'tr' ? 'Devamını oku' : 'Read more'}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Regular grid */}
            <div className="blog-grid">
              {regularPosts.map((p) => (
                <article key={p.id} className="blog-card">
                  <Link to={`/blog/${p.slug}`} className="blog-card-link">
                    <div className="blog-card-image">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} loading="lazy" />
                      ) : (
                        <div className="blog-card-image-placeholder" aria-hidden="true" />
                      )}
                    </div>
                    <div className="blog-card-body">
                      {p.category && (
                        <span
                          className="blog-category-chip"
                          style={{ background: getCategoryColor(p.category) }}
                        >
                          {p.category}
                        </span>
                      )}
                      <h2 className="blog-card-title">{p.title}</h2>
                      <p className="blog-excerpt">{p.excerpt || p.meta_description}</p>
                      <div className="blog-card-footer">
                        <span className="blog-date">
                          <Calendar size={13} />
                          <time dateTime={p.published_at}>
                            {formatDate(p.published_at, locale)}
                          </time>
                        </span>
                        <span className="blog-read-time">
                          <Clock size={13} />
                          {estimateReadTime(p)}{lang === 'tr' ? ' dk okuma' : ' min read'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="blog-pagination" aria-label={lang === 'tr' ? 'Sayfalama' : 'Pagination'}>
                <button
                  className="blog-pagination__btn"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  aria-label={lang === 'tr' ? 'Önceki sayfa' : 'Previous page'}
                >
                  &larr;
                </button>
                <div className="blog-pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`blog-pagination__page ${page === i ? 'active' : ''}`}
                      onClick={() => setPage(i)}
                      aria-label={`${lang === 'tr' ? 'Sayfa' : 'Page'} ${i + 1}`}
                      aria-current={page === i ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="blog-pagination__btn"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  aria-label={lang === 'tr' ? 'Sonraki sayfa' : 'Next page'}
                >
                  &rarr;
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
