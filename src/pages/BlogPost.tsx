import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react'
import AdBanner from '../components/AdBanner'
import { supabase } from '../lib/supabase'
import type { Blog } from '../lib/supabase'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [related, setRelated] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('mm_blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return }
        setBlog(data)
        setLoading(false)

        // Set page meta
        document.title = `${data.title} - minesminis Blog`
        const meta = document.querySelector('meta[name="description"]')
        if (meta) meta.setAttribute('content', data.meta_description || data.excerpt)

        // Fetch related posts
        supabase
          .from('mm_blogs')
          .select('id, title, slug, excerpt, cover_url, category, published_at, reading_time_min')
          .eq('status', 'published')
          .eq('category', data.category)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3)
          .then(({ data: relatedData }) => {
            if (relatedData) setRelated(relatedData as Blog[])
          })
      })
  }, [slug])

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="mm-skeleton" style={{ height: 32, width: '60%', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 16 }} />
        <div className="mm-skeleton" style={{ height: 300, background: 'var(--surface-2)', borderRadius: 16, marginBottom: 24 }} />
        <div className="mm-skeleton" style={{ height: 16, width: '90%', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 12 }} />
        <div className="mm-skeleton" style={{ height: 16, width: '75%', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 12 }} />
        <div className="mm-skeleton" style={{ height: 16, width: '80%', background: 'var(--surface-2)', borderRadius: 8 }} />
      </div>
    )
  }

  if (notFound || !blog) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: 'var(--primary)' }}>404</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-2)', marginBottom: 16 }}>Yazi bulunamadi</div>
        <Link to="/blog" className="mm-btn primary">Blog'a Don</Link>
      </div>
    )
  }

  const date = blog.published_at ? new Date(blog.published_at).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : ''

  return (
    <>
      <article style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Back link */}
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', textDecoration: 'none', fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          <ArrowLeft size={16} /> Blog'a Don
        </Link>

        {/* Category + Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className={`mm-tag ${blog.category === 'teacher-resources' ? 'blue' : 'green'}`}>
            {blog.category === 'teacher-resources' ? 'Ogretmen Kaynaklari' : 'Cocuklara Ingilizce'}
          </span>
          {date && <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {date}</span>}
          <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {blog.reading_time_min} dk okuma</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.8, margin: '0 0 20px' }}>
          {blog.title}
        </h1>

        {/* Cover */}
        {blog.cover_url && (
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, aspectRatio: '16/9' }}>
            <img src={blog.cover_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <AdBanner format="horizontal" />

        {/* Content */}
        <div
          className="mm-blog-content"
          style={{
            fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.75, color: 'var(--ink)',
            marginTop: 24,
          }}
          dangerouslySetInnerHTML={{ __html: blog.content_html }}
        />

        {/* Keywords */}
        {blog.keywords && blog.keywords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            {blog.keywords.map((kw, i) => (
              <span key={i} className="mm-tag">{kw}</span>
            ))}
          </div>
        )}

        <AdBanner format="auto" />

        {/* Internal Links — SEO */}
        <div style={{ background: 'var(--surface-2)', borderRadius: 16, padding: 24, marginTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>
            Ucretsiz Ingilizce Kaynaklari
          </h3>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.5 }}>
            minesminis'te cocuklara Ingilizce ogretmek icin hazir materyalleri kesfet:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <Link to="/slides" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Sunumlar</Link>
            <Link to="/videos" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Videolar</Link>
            <Link to="/songs" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Sarkilar</Link>
            <Link to="/worksheets" className="mm-btn" style={{ justifyContent: 'center', fontSize: 13 }}>Calisma Kagitlari</Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>
            Ilgili Yazilar
          </h2>
          <div className="mm-grid-3">
            {related.map(r => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="mm-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mm-card-cover">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt={r.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7B68EE 0%, #B8A9FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={36} color="white" style={{ opacity: 0.6 }} />
                    </div>
                  )}
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-title" style={{ whiteSpace: 'normal', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any }}>{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': blog.title,
        'description': blog.meta_description || blog.excerpt,
        'image': blog.cover_url,
        'datePublished': blog.published_at,
        'dateModified': blog.updated_at,
        'author': { '@type': 'Organization', 'name': 'minesminis' },
        'publisher': { '@type': 'Organization', 'name': 'minesminis', 'url': 'https://minesminis.com' },
        'url': `https://minesminis.com/blog/${blog.slug}`,
        'keywords': blog.keywords?.join(', '),
        'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://minesminis.com/blog/${blog.slug}` },
      }) }} />
    </>
  )
}
