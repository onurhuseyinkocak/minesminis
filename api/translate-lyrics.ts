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

  const { lines } = req.body || {}
  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'lines array required' })
  }
  if (!OPENAI_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' })

  try {
    const prompt = [
      'Translate each English line to Turkish. Return ONLY a JSON array of objects with "en" and "tr" fields.',
      'Keep translations natural and child-friendly (this is for a children\'s English learning app).',
      'If a line is a chorus or repeated section, mark it with "highlight": true.',
      'Input lines:',
      ...lines.map((l: string, i: number) => `${i + 1}. ${l}`),
    ].join('\n')

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You translate English song lyrics to Turkish for children. Return valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!chatRes.ok) {
      const err = await chatRes.text()
      return res.status(500).json({ error: 'OpenAI failed', detail: err })
    }

    const chatData = await chatRes.json()
    const content = chatData.choices?.[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)
    // Handle both { lyrics: [...] } and direct array
    const lyrics = Array.isArray(parsed) ? parsed : (parsed.lyrics || parsed.lines || parsed.translations || [])

    return res.status(200).json({ lyrics })
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', detail: String(e) })
  }
}
