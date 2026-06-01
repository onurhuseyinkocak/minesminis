import { staticBlogs } from '../../src/content/staticBlogs'

export const revalidate = 3600

export async function GET() {
  const site = 'https://minesminis.com'
  const fortyEight = Date.now() - 48 * 60 * 60 * 1000
  const recent = staticBlogs.filter((b) => {
    if (!b.published_at) return false
    return new Date(b.published_at).getTime() > fortyEight
  })

  function esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const items = recent
    .map(
      (b) => `  <url>
    <loc>${site}/blog/${b.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>minesminis</news:name>
        <news:language>tr</news:language>
      </news:publication>
      <news:publication_date>${b.published_at}</news:publication_date>
      <news:title>${esc(b.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
