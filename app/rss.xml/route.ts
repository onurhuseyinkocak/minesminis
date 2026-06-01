import { staticBlogs } from '../../src/content/staticBlogs'
import { topics } from '../../src/content/topics'

export const revalidate = 3600

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const site = 'https://minesminis.com'
  const now = new Date().toUTCString()

  const items: { title: string; url: string; description: string; pubDate: string }[] = []

  for (const b of staticBlogs) {
    items.push({
      title: b.title,
      url: `${site}/blog/${b.slug}`,
      description: b.excerpt || b.title,
      pubDate: b.published_at ? new Date(b.published_at).toUTCString() : now,
    })
  }
  for (const t of topics) {
    items.push({
      title: `${t.titleTr} (${t.titleEn}) — İlkokul İngilizce`,
      url: `${site}/konu/${t.id}`,
      description: t.metaDescription,
      pubDate: now,
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>minesminis — Çocuklar İçin Ücretsiz İngilizce</title>
    <link>${site}</link>
    <description>Maarif modeli uyumlu, ilkokul (1-4. sınıf) İngilizce kaynakları, blog ve konu rehberleri.</description>
    <language>tr-TR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <pubDate>${i.pubDate}</pubDate>
      <description>${esc(i.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
