import { NextResponse } from 'next/server'
import { submitToIndexNow } from '../../../../src/lib/indexnow'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const r = await fetch('https://minesminis.com/sitemap.xml', { next: { revalidate: 0 } })
    const xml = await r.text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith('https://minesminis.com/'))
    const results = await submitToIndexNow(urls.slice(0, 10000))
    return NextResponse.json({ submitted: urls.length, results })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
