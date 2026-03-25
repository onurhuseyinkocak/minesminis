import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import PublicLayout from '../components/layout/PublicLayout';
import './Blog.css';
import { ArrowLeft } from 'lucide-react';

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
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPost = useCallback(async () => {
    setError(false);
    try {
      const result = await supabase
        .from('blog_posts')
        .select('*')
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

  const backLabel = lang === 'tr' ? 'Bloga don' : 'Back to Blog';

  if (loading) return (
    <PublicLayout>
      <div className="blog-page"><div className="blog-loading">{lang === 'tr' ? 'Yukleniyor...' : 'Loading...'}</div></div>
    </PublicLayout>
  );
  if (error) return (
    <PublicLayout>
      <div className="blog-page"><div className="blog-empty"><p>{lang === 'tr' ? 'Yazi yuklenirken bir hata olustu.' : 'An error occurred while loading the post.'}</p><Link to="/blog">{backLabel}</Link></div></div>
    </PublicLayout>
  );
  if (!post) return (
    <PublicLayout>
      <div className="blog-page"><div className="blog-empty"><p>{lang === 'tr' ? 'Yazi bulunamadi.' : 'Post not found.'}</p><Link to="/blog">{backLabel}</Link></div></div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
    <div className="blog-page blog-post-page">
      <Link to="/blog" className="blog-back"><ArrowLeft size={18} /> {backLabel}</Link>
      <article className="blog-post">
        <header>
          <h1>{post.title}</h1>
          <time dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </header>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || '') }}
        />
      </article>
    </div>
    </PublicLayout>
  );
}
