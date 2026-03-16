import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './Blog.css';
import { ArrowLeft } from 'lucide-react';

function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  // Allow only newlines→br conversion on the sanitized text
  return div.innerHTML.replace(/\n/g, '<br />');
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
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .maybeSingle();

      if (!error && data) setPost(data);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetchPost();
  }, [slug, fetchPost]);

  if (loading) return <div className="blog-page"><div className="blog-loading">Yükleniyor...</div></div>;
  if (!post) return <div className="blog-page"><div className="blog-empty"><p>Yazı bulunamadı.</p><Link to="/blog">← Bloga dön</Link></div></div>;

  return (
    <div className="blog-page blog-post-page">
      <Link to="/blog" className="blog-back"><ArrowLeft size={18} /> Bloga dön</Link>
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
  );
}
