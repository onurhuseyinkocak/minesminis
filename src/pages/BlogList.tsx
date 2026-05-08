import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import AdBanner from '../components/AdBanner'
import { supabase } from '../lib/supabase'
import type { Blog } from '../lib/supabase'
import { useMeta } from '../hooks/useMeta'

const categories = [
  { id: 'all', label: 'Tumu' },
  { id: 'teacher-resources', label: 'Ogretmen Kaynaklari' },
  { id: 'teaching-english-to-kids', label: 'Cocuklara Ingilizce' },
]

function BlogCard({ blog }: { blog: Blog }) {
  const date = blog.published_at ? new Date(blog.published_at).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : ''

  return (
    <Link to={`/blog/${blog.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="mm-card-cover">
        {blog.cover_url ? (
          <img src={blog.cover_url} alt={blog.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7B68EE 0%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={48} color="white" style={{ opacity: 0.6 }} />
          </div>
        )}
      </div>
      <div className="mm-card-body">
        <div style={{ marginBottom: 6 }}>
          <span className={`mm-tag ${blog.category === 'teacher-resources' ? 'blue' : 'green'}`}>
            {blog.category === 'teacher-resources' ? 'Ogretmen' : 'Ingilizce'}
          </span>
        </div>
        <h3 className="mm-card-title" style={{ whiteSpace: 'normal', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any }}>
          {blog.title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '6px 0 0', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
          {blog.excerpt}
        </p>
        <div className="mm-card-meta" style={{ marginTop: 8 }}>
          {date && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {date}</span>}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {blog.reading_time_min} dk</span>
        </div>
      </div>
    </Link>
  )
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useMeta({
    title: 'Blog - minesminis | Ingilizce Ogretim Kaynaklari',
    description: 'Cocuklara Ingilizce ogretme teknikleri, Maarif modeli uyumlu ders kaynaklari, etkinlikler ve oyunlar. Ogretmenler icin ucretsiz kaynaklar.',
    url: 'https://minesminis.com/blog',
  })

  useEffect(() => {
    supabase
      .from('mm_blogs')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setBlogs(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = activeCategory === 'all' ? blogs
    : blogs.filter(b => b.category === activeCategory)

  return (
    <>
      <div className="mm-page-header">
        <div>
          <h1 className="mm-page-title">Blog</h1>
          <p className="mm-page-sub">Ogretmenler icin Ingilizce ogretim kaynaklari ve ipuclari</p>
        </div>
      </div>

      <AdBanner format="horizontal" />

      <div className="mm-chips">
        {categories.map(c => (
          <button
            key={c.id}
            className={`mm-chip${activeCategory === c.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(c.id)}
            aria-label={`Filter by ${c.label}`}
            aria-pressed={activeCategory === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      {error ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--primary)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Baglanti hatasi</p>
          <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Lutfen tekrar deneyin.</p>
          <button className="mm-btn primary" onClick={() => window.location.reload()} style={{ marginTop: 12 }}>Tekrar Dene</button>
        </div>
      ) : loading ? (
        <div className="mm-grid-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="mm-card mm-skeleton">
              <div className="mm-card-cover" style={{ background: 'var(--surface-2)' }} />
              <div className="mm-card-body">
                <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 8, width: '30%', marginBottom: 8 }} />
                <div style={{ height: 18, background: 'var(--surface-2)', borderRadius: 8, width: '90%' }} />
                <div style={{ height: 18, background: 'var(--surface-2)', borderRadius: 8, width: '60%', marginTop: 6 }} />
                <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 8, width: '40%', marginTop: 12 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Henuz icerik yok</p>
          <p style={{ fontSize: 14 }}>Yeni yazilar yakinda!</p>
        </div>
      ) : (
        <>
          <div className="mm-grid-3">
            {filtered.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <AdBanner format="auto" />
        </>
      )}

      {/* SEO: Structured Data */}
      {!loading && filtered.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': 'minesminis Blog',
          'description': 'Cocuklara Ingilizce ogretme kaynaklari, etkinlikler, oyunlar ve Maarif modeli uyumlu ders planlari.',
          'url': 'https://minesminis.com/blog',
          'blogPost': filtered.slice(0, 10).map(b => ({
            '@type': 'BlogPosting',
            'headline': b.title,
            'description': b.excerpt,
            'url': `https://minesminis.com/blog/${b.slug}`,
            'datePublished': b.published_at,
            'image': b.cover_url,
          })),
        }) }} />
      )}
    </>
  )
}
