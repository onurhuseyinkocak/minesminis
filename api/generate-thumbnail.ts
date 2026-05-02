import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const OPENAI_KEY = process.env.OPENAI_API_KEY
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL
  const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY

  // Auth check — verify Supabase JWT
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ') || !SUPABASE_URL || !SUPABASE_ANON) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.slice(7)
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON },
  })
  if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' })

  const { slideId, title, category, slidesData, fileUrl } = req.body || {}
  if (!slideId || !title) return res.status(400).json({ error: 'slideId and title required' })

  // Validate slideId to prevent path traversal
  if (!/^[a-zA-Z0-9-]{20,}$/.test(slideId)) {
    return res.status(400).json({ error: 'Invalid slideId format' })
  }
  if (!OPENAI_KEY || !SUPABASE_URL || !SUPABASE_ANON) {
    return res.status(500).json({ error: 'Missing env vars' })
  }

  // Build a content-aware prompt
  const words = (slidesData || []).map((s: { label: string }) => s.label).filter(Boolean).slice(0, 10)
  const contentHint = words.length > 0
    ? `The slides teach these English words: ${words.join(', ')}.`
    : fileUrl
      ? `It is a presentation file about "${title}".`
      : `The topic is "${title}".`

  const prompt = [
    `Create a colorful, child-friendly educational illustration for a children's English learning slide titled "${title}".`,
    category ? `Category: ${category}.` : '',
    contentHint,
    'Style: bright, playful, cartoon-like, suitable for young children (ages 4-10).',
    'No text, no letters, no words in the image. Only visual illustrations.',
    'White or very light background. Clean, simple composition.',
  ].filter(Boolean).join(' ')

  try {
    // Generate image with DALL-E 3
    const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', quality: 'standard' }),
    })

    if (!dalleRes.ok) {
      const err = await dalleRes.text()
      return res.status(500).json({ error: 'DALL-E failed', detail: err })
    }

    const dalleData = await dalleRes.json()
    const imageUrl = dalleData.data?.[0]?.url
    if (!imageUrl) return res.status(500).json({ error: 'No image URL returned' })

    // Download the generated image
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) return res.status(500).json({ error: 'Failed to download image' })
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer())

    // Upload to Supabase Storage: slides/thumbnails/{slideId}.png
    const storagePath = `thumbnails/${slideId}.png`
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/slides/${storagePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type': 'image/png',
          'x-upsert': 'true',
        },
        body: imgBuffer,
      }
    )

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      return res.status(500).json({ error: 'Storage upload failed', detail: err })
    }

    const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/slides/${storagePath}`
    return res.status(200).json({ thumbnailUrl })
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', detail: String(e) })
  }
}
