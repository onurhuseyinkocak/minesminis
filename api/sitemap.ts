import type { VercelRequest, VercelResponse } from '@vercel/node'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || ''
const SITE_URL = 'https://minesminis.com'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/slides', priority: '0.9', changefreq: 'weekly' },
    { url: '/videos', priority: '0.9', changefreq: 'weekly' },
    { url: '/songs', priority: '0.9', changefreq: 'weekly' },
    { url: '/worksheets', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', priority: '0.4', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  ]

  // Fetch dynamic blog slugs
  let blogUrls: { url: string; lastmod: string }[] = []
  try {
    const blogRes = await fetch(`${SUPABASE_URL}/rest/v1/mm_blogs?status=eq.published&select=slug,published_at&order=published_at.desc`, {
      headers: { 'apikey': SUPABASE_ANON },
    })
    if (blogRes.ok) {
      const blogs = await blogRes.json()
      blogUrls = blogs.map((b: any) => ({
        url: `/blog/${b.slug}`,
        lastmod: b.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      }))
    }
  } catch {}

  // Fetch dynamic content slugs
  let contentUrls: { url: string }[] = []
  try {
    const [slides, videos, songs, worksheets] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/mm_slides?published=eq.true&select=id`, { headers: { 'apikey': SUPABASE_ANON } }).then(r => r.json()).catch(() => []),
      fetch(`${SUPABASE_URL}/rest/v1/mm_videos?published=eq.true&select=id`, { headers: { 'apikey': SUPABASE_ANON } }).then(r => r.json()).catch(() => []),
      fetch(`${SUPABASE_URL}/rest/v1/mm_songs?published=eq.true&select=id`, { headers: { 'apikey': SUPABASE_ANON } }).then(r => r.json()).catch(() => []),
      fetch(`${SUPABASE_URL}/rest/v1/mm_worksheets?published=eq.true&select=id`, { headers: { 'apikey': SUPABASE_ANON } }).then(r => r.json()).catch(() => []),
    ])
    contentUrls = [
      ...slides.map((s: any) => ({ url: `/slides/${s.id}` })),
      ...videos.map((v: any) => ({ url: `/videos/${v.id}` })),
      ...songs.map((s: any) => ({ url: `/songs/${s.id}` })),
      ...worksheets.map((w: any) => ({ url: `/worksheets/${w.id}` })),
    ]
  } catch {}

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

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return res.status(200).send(xml)
}
