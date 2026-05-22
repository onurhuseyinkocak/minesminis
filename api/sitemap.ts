import type { VercelRequest, VercelResponse } from '@vercel/node'

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_ANON = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()
const SITE_URL = 'https://minesminis.com'

// Slugs of statically bundled blog posts in src/content/blogs/.
// Keep in sync with src/content/blogs/index.ts. If you add a new static post,
// also append its slug here so the sitemap stays accurate.
const STATIC_BLOG_SLUGS: { slug: string; published_at: string }[] = [
  { slug: 'maarif-modeli-ilkokul-ingilizce-mufredat-rehberi', published_at: '2026-05-20' },
  { slug: '4-6-yas-ingilizce-ogretime-baslamak-bilim', published_at: '2026-05-18' },
  { slug: 'evde-15-dakikalik-ingilizce-rutini-1-aylik-plan', published_at: '2026-05-16' },
  { slug: 'phonics-turkce-cocuga-ingilizce-telaffuz', published_at: '2026-05-14' },
  { slug: 'ingilizce-korkusu-yenmek-5-ebeveyn-tekniki', published_at: '2026-05-10' },
  { slug: 'cefr-a1-seviyesi-cocuk-kelime-listesi', published_at: '2026-05-08' },
]

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/slides', priority: '0.9', changefreq: 'weekly' },
    { url: '/videos', priority: '0.9', changefreq: 'weekly' },
    { url: '/songs', priority: '0.9', changefreq: 'weekly' },
    { url: '/worksheets', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/curriculum', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  ]

  // Static blog slugs (bundled at build time)
  const staticBlogUrls = STATIC_BLOG_SLUGS.map(b => ({
    url: `/blog/${b.slug}`,
    lastmod: b.published_at.split('T')[0],
  }))

  // Fetch dynamic blog slugs from Supabase
  let dbBlogUrls: { url: string; lastmod: string }[] = []
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const blogRes = await fetch(
        `${SUPABASE_URL}/rest/v1/mm_blogs?status=eq.published&select=slug,published_at&order=published_at.desc`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } },
      )
      if (blogRes.ok) {
        const blogs = await blogRes.json()
        dbBlogUrls = blogs.map((b: any) => ({
          url: `/blog/${b.slug}`,
          lastmod: b.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        }))
      }
    } catch {
      // Network failure — fall back to static + main pages
    }
  }

  // Deduplicate (in case a DB blog and static blog share a slug)
  const seenSlugs = new Set<string>()
  const blogUrls = [...dbBlogUrls, ...staticBlogUrls].filter(b => {
    if (seenSlugs.has(b.url)) return false
    seenSlugs.add(b.url)
    return true
  })

  // Fetch dynamic content slugs
  let contentUrls: { url: string; lastmod?: string }[] = []
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const headers = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
      const [slides, videos, songs, worksheets] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/mm_slides?published=eq.true&select=id`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${SUPABASE_URL}/rest/v1/mm_videos?published=eq.true&select=id`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${SUPABASE_URL}/rest/v1/mm_songs?published=eq.true&select=id`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${SUPABASE_URL}/rest/v1/mm_worksheets?published=eq.true&select=id`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      ])
      contentUrls = [
        ...slides.map((s: any) => ({ url: `/slides/${s.id}` })),
        ...videos.map((v: any) => ({ url: `/videos/${v.id}` })),
        ...songs.map((s: any) => ({ url: `/songs/${s.id}` })),
        ...worksheets.map((w: any) => ({ url: `/worksheets/${w.id}` })),
      ]
    } catch {
      // Network failure — fall back without content URLs
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${blogUrls.map(b => `  <url>
    <loc>${SITE_URL}${b.url}</loc>
    <lastmod>${b.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${contentUrls.map(c => `  <url>
    <loc>${SITE_URL}${c.url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return res.status(200).send(xml)
}
