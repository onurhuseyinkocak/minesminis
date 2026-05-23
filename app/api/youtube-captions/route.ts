import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('v') || ''
  if (!/^[\w-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 })
  }

  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    })
    if (!pageRes.ok) return NextResponse.json({ error: 'Failed to fetch YouTube page' }, { status: 502 })

    const html = await pageRes.text()
    const match = html.match(/"captionTracks":\[([^\]]*)\]/)
    if (!match) return NextResponse.json({ error: 'No captions found for this video' }, { status: 404 })

    let tracks: Array<{ baseUrl: string; languageCode: string; kind?: string }>
    try {
      tracks = JSON.parse(`[${match[1]}]`)
    } catch {
      return NextResponse.json({ error: 'Failed to parse caption tracks' }, { status: 500 })
    }

    const enTrack =
      tracks.find((t) => t.languageCode === 'en' && t.kind === 'asr') ||
      tracks.find((t) => t.languageCode === 'en')
    if (!enTrack) return NextResponse.json({ error: 'No English captions found' }, { status: 404 })

    const captionUrl = enTrack.baseUrl.replace(/\\u0026/g, '&') + '&fmt=srv3'
    const capRes = await fetch(captionUrl)
    if (!capRes.ok) return NextResponse.json({ error: 'Failed to fetch caption data' }, { status: 502 })

    const xml = await capRes.text()
    if (!xml || xml.length < 10) return NextResponse.json({ error: 'Empty caption data' }, { status: 404 })

    const entries: Array<{ start: number; dur: number; text: string }> = []
    const regex = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>([^<]*)<\/text>/g
    let m
    while ((m = regex.exec(xml)) !== null) {
      const text = m[3]
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\n/g, ' ')
        .trim()
      if (text && !text.match(/^\[.*\]$/)) {
        entries.push({ start: parseFloat(m[1]), dur: parseFloat(m[2]), text })
      }
    }

    return NextResponse.json({ entries, trackLang: enTrack.languageCode })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error', detail: String(e) }, { status: 500 })
  }
}
