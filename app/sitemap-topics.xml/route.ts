import { topics } from '../../src/content/topics'

export const revalidate = 3600
const SITE = 'https://minesminis.com'

const ageGradesMap: Record<string, number[]> = {
  '4-5': [1],
  '6-7': [1, 2],
  '8-9': [2, 3],
  '10-12': [3, 4],
}

export async function GET() {
  const now = new Date().toISOString()
  const urls: string[] = []

  for (const t of topics) {
    urls.push(`${SITE}/konu/${t.id}`)
  }
  for (const g of [1, 2, 3, 4]) {
    for (const t of topics) {
      if (t.gradeLevels.includes(g)) urls.push(`${SITE}/sinif/${g}/konu/${t.id}`)
    }
  }
  for (const [r, grades] of Object.entries(ageGradesMap)) {
    for (const t of topics) {
      if (t.gradeLevels.some((g) => grades.includes(g))) urls.push(`${SITE}/yas/${r}/konu/${t.id}`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`).join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
