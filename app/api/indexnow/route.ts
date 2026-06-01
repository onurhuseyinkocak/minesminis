import { NextResponse } from 'next/server'
import { submitToIndexNow } from '../../../src/lib/indexnow'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const auth = req.headers.get('x-api-key')
  const expected = process.env.INDEXNOW_PROXY_KEY
  if (!expected || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const { urls } = (await req.json()) as { urls?: string[] }
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls required' }, { status: 400 })
    }
    const safe = urls.filter((u) => /^https:\/\/minesminis\.com\//.test(u)).slice(0, 10000)
    const results = await submitToIndexNow(safe)
    return NextResponse.json({ submitted: safe.length, results })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    info: 'POST { urls: string[] } with header X-API-Key to push URLs to Bing/Yandex/IndexNow.',
  })
}
