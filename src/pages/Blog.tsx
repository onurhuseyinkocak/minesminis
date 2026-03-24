import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../config/supabase';
import LottieCharacter from '../components/LottieCharacter';
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
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, meta_title, meta_description, published_at, created_at')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(20);

      if (!error) setPosts(data || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-page">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Home
      </Link>
      <header className="blog-header">
        <h1>Blog</h1>
        <p>English learning tips & MinesMinis news / İngilizce öğrenme ipuçları ve MinesMinis haberleri</p>
      </header>

      {loading ? (
        <div className="blog-loading">Loading... / Yükleniyor...</div>
      ) : posts.length === 0 ? (
        <div className="blog-empty">
          <span className="blog-empty-icon"><LottieCharacter state="thinking" size={48} /></span>
          <p>Nothing here yet. Coming soon! / Henüz bir yazı hazırlanmadı. Yakında burada olacak!</p>
        </div>
      ) : (
        <div className="blog-list">
          {posts.map((p) => (
            <article key={p.id} className="blog-card">
              <Link to={`/blog/${p.slug}`} className="blog-card-link">
                <h2>{p.title}</h2>
                <p className="blog-excerpt">{p.excerpt || p.meta_description}</p>
                <time dateTime={p.published_at}>
                  {new Date(p.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
