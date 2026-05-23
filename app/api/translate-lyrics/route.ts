import { NextResponse, type NextRequest } from 'next/server'

async function verifyAuth(req: NextRequest, supabaseUrl: string, supabaseAnon: string): Promise<boolean> {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ') || !supabaseUrl || !supabaseAnon) return false
  const token = auth.slice(7)
  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: supabaseAnon },
    })
    return r.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY
  const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').trim()
  const SUPABASE_ANON = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()

  if (!(await verifyAuth(req, SUPABASE_URL, SUPABASE_ANON))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const lines = body?.lines
  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'lines array required' }, { status: 400 })
  }
  if (!OPENAI_KEY) {
    return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 })
  }

  try {
    const prompt = [
      'Translate each English line to Turkish. Return ONLY a JSON array of objects with "en" and "tr" fields.',
      "Keep translations natural and child-friendly (this is for a children's English learning app).",
      'If a line is a chorus or repeated section, mark it with "highlight": true.',
      'Input lines:',
      ...lines.map((l: string, i: number) => `${i + 1}. ${l}`),
    ].join('\n')

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
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
      return NextResponse.json({ error: 'OpenAI failed', detail: err }, { status: 500 })
    }

    const chatData = await chatRes.json()
    const content = chatData.choices?.[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)
    const lyrics = Array.isArray(parsed) ? parsed : parsed.lyrics || parsed.lines || parsed.translations || []
    return NextResponse.json({ lyrics })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error', detail: String(e) }, { status: 500 })
  }
}
