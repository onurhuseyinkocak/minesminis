import { topics } from '../../src/content/topics'

export const revalidate = 3600

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kcbblalwwfjevneegmcv.supabase.co').trim()
const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim()

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET() {
  const site = 'https://minesminis.com'
  const now = new Date().toUTCString()

  // Topic items (use OG image generator)
  const topicItems = topics.map((t) => ({
    title: `${t.titleTr} — Ücretsiz İngilizce Konu Anlatımı`,
    url: `${site}/konu/${t.id}`,
    description: t.metaDescription,
    image: `${site}/konu/${t.id}/opengraph-image`,
    pubDate: now,
  }))

  // Blog items (DB + static)
  const blogItems: { title: string; url: string; description: string; image: string; pubDate: string }[] = []
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/mm_blogs?status=eq.published&select=title,slug,excerpt,cover_url,published_at&order=published_at.desc&limit=50`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }, next: { revalidate: 3600 } },
      )
      if (r.ok) {
        const rows = (await r.json()) as any[]
        for (const b of rows) {
          blogItems.push({
            title: b.title,
            url: `${site}/blog/${b.slug}`,
            description: b.excerpt || b.title,
            image: b.cover_url || `${site}/images/minesminis-logo-512.png`,
            pubDate: b.published_at ? new Date(b.published_at).toUTCString() : now,
          })
        }
      }
    } catch {
      // ignore
    }
  }

  const items = [...blogItems, ...topicItems]
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <pubDate>${i.pubDate}</pubDate>
      <description><![CDATA[<img src="${i.image}" alt="${esc(i.title)}" /><p>${esc(i.description)}</p>]]></description>
      <media:content url="${esc(i.image)}" medium="image" />
      <media:thumbnail url="${esc(i.image)}" />
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>minesminis — Çocuklar İçin İngilizce (Pinterest Feed)</title>
    <link>${site}</link>
    <description>Maarif modeli uyumlu, çocuklar için ücretsiz İngilizce konuları, etkinlikler ve rehberler. Pinterest pin-ready feed.</description>
    <language>tr-TR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${site}/pinterest-rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  })
}
