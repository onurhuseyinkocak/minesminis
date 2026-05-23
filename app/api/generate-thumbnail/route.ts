import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 60

const COVER_KINDS = ['rainbow', 'farm', 'farm2', 'family', 'numbers', 'school', 'weather', 'body', 'routine', 'abc', 'duck', 'bus', 'star', 'apple', 'fruit', 'hello', 'dance', 'days', 'happy', 'head', 'bingo', 'spider']

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
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Date.now()}`
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 5000) return null
    return buf
  } catch {
    return null
  }
}

async function generateWithDalle(prompt: string, apiKey: string): Promise<Buffer | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
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

export async function POST(req: NextRequest) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY
  const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').trim()
  const SUPABASE_ANON = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()

  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ') || !SUPABASE_URL || !SUPABASE_ANON) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = auth.slice(7)
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON },
  })
  if (!userRes.ok) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { itemId, title, category } = body
  if (!itemId || !title) return NextResponse.json({ error: 'itemId and title required' }, { status: 400 })
  if (!/^[a-zA-Z0-9-]{20,}$/.test(itemId)) {
    return NextResponse.json({ error: 'Invalid itemId format' }, { status: 400 })
  }

  const bucket = 'slides'
  const prompt = buildPrompt(title, category)

  let imageBuffer = await generateWithPollinations(prompt)
  let source = 'pollinations'

  if (!imageBuffer && OPENAI_KEY) {
    imageBuffer = await generateWithDalle(prompt, OPENAI_KEY)
    source = 'dalle'
  }

  if (!imageBuffer) {
    const randomCover = COVER_KINDS[Math.floor(Math.random() * COVER_KINDS.length)]
    return NextResponse.json({ thumbnailUrl: null, coverKind: randomCover, source: 'fallback' })
  }

  try {
    const storagePath = `thumbnails/${itemId}.png`
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${storagePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'image/png',
        'x-upsert': 'true',
      },
      body: imageBuffer,
    })

    if (!uploadRes.ok) {
      const randomCover = COVER_KINDS[Math.floor(Math.random() * COVER_KINDS.length)]
      return NextResponse.json({ thumbnailUrl: null, coverKind: randomCover, source: 'fallback' })
    }

    const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storagePath}`
    return NextResponse.json({ thumbnailUrl, source })
  } catch {
    const randomCover = COVER_KINDS[Math.floor(Math.random() * COVER_KINDS.length)]
    return NextResponse.json({ thumbnailUrl: null, coverKind: randomCover, source: 'fallback' })
  }
}
