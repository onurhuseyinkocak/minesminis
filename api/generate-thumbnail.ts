import type { VercelRequest, VercelResponse } from '@vercel/node'

const COVER_KINDS = ['rainbow','farm','farm2','family','numbers','school','weather','body','routine','abc','duck','bus','star','apple','fruit','hello','dance','days','happy','head','bingo','spider']

function buildPrompt(title: string, category?: string): string {
  const subject = title.replace(/[^\w\s]/g, '').trim()
  return [
    `Cute kawaii illustration of ${subject}, children book style,`,
    category ? `${category} theme,` : '',
    'bright vivid colors, soft rounded shapes, clean white background, centered composition,',
    'no text no letters no words no numbers no watermarks no labels no titles, only illustration,',
    'child-safe friendly happy, digital art, high quality',
  ].filter(Boolean).join(' ')
}

async function generateWithPollinations(prompt: string): Promise<Buffer | null> {
  try {
    const encoded = encodeURIComponent(prompt)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${Date.now()}`
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 5000) return null // too small = error image
    return buf
  } catch {
    return null
  }
}

async function generateWithDalle(prompt: string, apiKey: string): Promise<Buffer | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', quality: 'standard' }),
      signal: AbortSignal.timeout(60000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const imageUrl = data.data?.[0]?.url
    if (!imageUrl) return null
    const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) })
    if (!imgRes.ok) return null
    return Buffer.from(await imgRes.arrayBuffer())
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const OPENAI_KEY = process.env.OPENAI_API_KEY
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL
  const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY

  // Auth check
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ') || !SUPABASE_URL || !SUPABASE_ANON) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.slice(7)
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON },
  })
  if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' })

  const { itemId, title, category, contentType, storageBucket } = req.body || {}
  if (!itemId || !title) return res.status(400).json({ error: 'itemId and title required' })

  // Validate itemId format
  if (!/^[a-zA-Z0-9-]{20,}$/.test(itemId)) {
    return res.status(400).json({ error: 'Invalid itemId format' })
  }

  const bucket = storageBucket || 'slides'
  const prompt = buildPrompt(title, category)

  // 1. Try Pollinations (primary — free)
  let imageBuffer = await generateWithPollinations(prompt)
  let source = 'pollinations'

  // 2. Try DALL-E 3 (fallback)
  if (!imageBuffer && OPENAI_KEY) {
    imageBuffer = await generateWithDalle(prompt, OPENAI_KEY)
    source = 'dalle'
  }

  // 3. Random cover fallback
  if (!imageBuffer) {
    const randomCover = COVER_KINDS[Math.floor(Math.random() * COVER_KINDS.length)]
    return res.status(200).json({ thumbnailUrl: null, coverKind: randomCover, source: 'fallback' })
  }

  // Upload to Supabase Storage
  try {
    const storagePath = `thumbnails/${itemId}.png`
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${bucket}/${storagePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type': 'image/png',
          'x-upsert': 'true',
        },
        body: imageBuffer,
      }
    )

    if (!uploadRes.ok) {
      const randomCover = COVER_KINDS[Math.floor(Math.random() * COVER_KINDS.length)]
      return res.status(200).json({ thumbnailUrl: null, coverKind: randomCover, source: 'fallback' })
    }

    const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storagePath}`
    return res.status(200).json({ thumbnailUrl, source })
  } catch {
    const randomCover = COVER_KINDS[Math.floor(Math.random() * COVER_KINDS.length)]
    return res.status(200).json({ thumbnailUrl: null, coverKind: randomCover, source: 'fallback' })
  }
}
