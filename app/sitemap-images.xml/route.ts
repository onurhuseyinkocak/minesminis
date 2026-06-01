import { staticBlogs } from '../../src/content/staticBlogs'

export const revalidate = 3600

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kcbblalwwfjevneegmcv.supabase.co').trim()
const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim()

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET() {
  const site = 'https://minesminis.com'
  const entries: { pageUrl: string; imageUrl: string; title: string }[] = []

  // Static blog covers
  for (const b of staticBlogs) {
    if ((b as any).cover_url) {
      entries.push({
        pageUrl: `${site}/blog/${b.slug}`,
        imageUrl: (b as any).cover_url,
        title: b.title,
      })
    }
  }

  // Homepage hero + category images
  entries.push({ pageUrl: `${site}/`, imageUrl: `${site}/images/hero-bg.webp`, title: 'minesminis ana sayfa' })
  for (const cat of ['slides', 'videos', 'songs', 'worksheets']) {
    entries.push({ pageUrl: `${site}/${cat}`, imageUrl: `${site}/images/cat-${cat}.webp`, title: `minesminis ${cat}` })
  }

  // DB blog covers
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/mm_blogs?status=eq.published&select=slug,title,cover_url&order=published_at.desc&limit=200`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }, next: { revalidate: 3600 } },
      )
      if (r.ok) {
        const rows = (await r.json()) as { slug: string; title: string; cover_url?: string }[]
        for (const row of rows) {
          if (row.cover_url) {
            entries.push({
              pageUrl: `${site}/blog/${row.slug}`,
              imageUrl: row.cover_url,
              title: row.title,
            })
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const items = entries
    .map(
      (e) => `  <url>
    <loc>${e.pageUrl}</loc>
    <image:image>
      <image:loc>${esc(e.imageUrl)}</image:loc>
      <image:title>${esc(e.title)}</image:title>
    </image:image>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items}
</urlset>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
