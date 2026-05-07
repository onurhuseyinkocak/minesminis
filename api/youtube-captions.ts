import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const videoId = req.query.v as string
  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: 'Invalid video ID' })
  }

  try {
    // 1. Fetch YouTube watch page to extract caption track URL
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    })
    if (!pageRes.ok) return res.status(502).json({ error: 'Failed to fetch YouTube page' })

    const html = await pageRes.text()

    // 2. Extract captionTracks JSON
    const match = html.match(/"captionTracks":\[([^\]]*)\]/)
    if (!match) return res.status(404).json({ error: 'No captions found for this video' })

    let tracks: Array<{ baseUrl: string; languageCode: string; kind?: string }>
    try {
      tracks = JSON.parse(`[${match[1]}]`)
    } catch {
      return res.status(500).json({ error: 'Failed to parse caption tracks' })
    }

    // 3. Find English caption track (prefer ASR auto-generated, then manual)
    const enTrack = tracks.find(t => t.languageCode === 'en' && t.kind === 'asr')
      || tracks.find(t => t.languageCode === 'en')
    if (!enTrack) return res.status(404).json({ error: 'No English captions found' })

    // 4. Fetch caption data in srv3 (XML) format
    const captionUrl = enTrack.baseUrl.replace(/\\u0026/g, '&') + '&fmt=srv3'
    const capRes = await fetch(captionUrl)
    if (!capRes.ok) return res.status(502).json({ error: 'Failed to fetch caption data' })

    const xml = await capRes.text()
    if (!xml || xml.length < 10) return res.status(404).json({ error: 'Empty caption data' })

    // 5. Parse srv3 XML: <text start="4.319" dur="7.641">word word word</text>
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
      if (text && !text.match(/^\[.*\]$/)) {  // Skip [Music], [Applause] etc
        entries.push({
          start: parseFloat(m[1]),
          dur: parseFloat(m[2]),
          text,
        })
      }
    }

    return res.status(200).json({ entries, trackLang: enTrack.languageCode })
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', detail: String(e) })
  }
}
