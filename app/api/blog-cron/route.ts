import { NextResponse } from 'next/server'
import { topics } from '../../../src/content/topics'
import { submitToIndexNow } from '../../../src/lib/indexnow'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim()

const TEACHER_PROMPTS: { title: string; topicId: string | null }[] = [
  { title: 'İlkokul İngilizce Dersinde TPR ile Renkler Nasıl Öğretilir', topicId: 'colors' },
  { title: '1. Sınıf İngilizce Greetings Ünitesi: Sınıf Etkinlikleri ve Oyunlar', topicId: 'greetings' },
  { title: 'Maarif Modeli 2. Sınıf İngilizce Family Ünitesi Ders Planı', topicId: 'family' },
  { title: 'İlkokul İngilizce Sayılar Öğretmek: 5 Etkili Etkinlik', topicId: 'numbers-1-10' },
  { title: 'Hava Durumu Konusunu Sınıfta Eğlenceli Anlatma Yöntemleri', topicId: 'weather' },
  { title: 'Hayvanlar Konusu için Drama ve Rol-Play Etkinlikleri', topicId: 'animals' },
  { title: 'Yiyecekler Ünitesinde Görsel Materyal Kullanımı', topicId: 'food' },
  { title: 'Çalışma Kâğıdı Tasarlarken Dikkat Edilmesi Gereken 7 Madde', topicId: null },
  { title: 'İlkokul İngilizce Sınıfında Disiplin ve Motivasyon İpuçları', topicId: null },
  { title: 'Maarif Modeli İngilizce Müfredatına Uygun Yıllık Plan Önerisi', topicId: null },
  { title: 'Phonics Öğretimine Nereden Başlamalı? 3. Sınıf Rehberi', topicId: null },
  { title: 'Öğrencilere İngilizce Şarkı Söyletmenin Avantajları', topicId: null },
]

const KIDS_PROMPTS: { title: string; topicId: string | null }[] = [
  { title: '4-5 Yaş Çocuğa Evde İngilizce Nasıl Öğretilir', topicId: null },
  { title: 'Çocuğa İngilizce Öğretmeye Kaç Yaşında Başlamalı?', topicId: null },
  { title: 'Çocuğunuzla Yapabileceğiniz 10 Eğlenceli İngilizce Oyun', topicId: null },
  { title: 'Çocuğun İngilizce Telaffuzunu Geliştirmek İçin Pratik Öneriler', topicId: null },
  { title: 'Anaokulu Çocukları İçin İngilizce Şarkı Listesi ve Hareketler', topicId: null },
  { title: 'İlkokul Çocuğuna Evde 15 Dakikalık İngilizce Rutini Nasıl Kurulur', topicId: null },
  { title: 'Çocuğum İngilizce Öğrenmek İstemiyor: Ne Yapmalıyım?', topicId: null },
  { title: 'Tablette İngilizce Öğrenme Güvenli mi? Ailelere Rehber', topicId: null },
  { title: 'Çocuğun İngilizce Kelime Hafızasını Güçlendirmenin 8 Yolu', topicId: null },
  { title: 'Aileler İçin Ücretsiz İngilizce Kaynak Listesi', topicId: null },
  { title: 'CEFR A1 Seviyesi Nedir? Çocuğunuzun Hangi Seviyede Olduğunu Anlama', topicId: null },
  { title: 'Çocuğa İngilizce Hikâye Okumanın Bilimsel Yararları', topicId: null },
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function tslug(text: string): string {
  return text
    .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u').replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c').replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 80)
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 2000, label = 'task'): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastError = e
      if (i === attempts - 1) break
      const msg = String(e)
      // 429 / rate limit: longer backoff
      const isRateLimited = /429|rate limit|queue full|too many/i.test(msg)
      const baseFactor = isRateLimited ? 4 : 1
      const delay = Math.min(60000, baseDelayMs * baseFactor * Math.pow(2, i)) + Math.floor(Math.random() * 1500)
      console.warn(`[${label}] attempt ${i + 1}/${attempts} failed: ${msg.slice(0, 200)}. Retrying in ${delay}ms`)
      await sleep(delay)
    }
  }
  throw lastError
}

async function callPollinations(prompt: string): Promise<string> {
  // Try POST first (no URL length limit, cleaner)
  try {
    const r = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'openai-fast',
        seed: Date.now() % 1000000,
      }),
      signal: AbortSignal.timeout(110000),
    })
    if (r.ok) {
      const ct = r.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const j = await r.json()
        const c = j.choices?.[0]?.message?.content || j.content || ''
        if (typeof c === 'string' && c.length > 200) return c.trim()
      } else {
        const t = (await r.text()).trim()
        if (t.length > 200) return t
      }
    }
  } catch (e) {
    console.warn('POST endpoint failed:', String(e).slice(0, 200))
  }
  // GET fallback
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-fast&seed=${Date.now() % 1000000}`
  const res = await fetch(url, { signal: AbortSignal.timeout(110000) })
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`)
  let text = (await res.text()).trim()
  if (text.startsWith('{') && text.includes('"content"')) {
    try {
      const parsed = JSON.parse(text)
      if (typeof parsed.content === 'string' && parsed.content.length > 200) text = parsed.content.trim()
    } catch {
      // ignore
    }
  }
  return text
}

async function generateContent(title: string, category: string, keywords: string[], topicId: string | null): Promise<string> {
  const role = category === 'teacher-resources' ? 'İngilizce öğretmeni' : 'çocuk eğitimi uzmanı'
  const linkHint = topicId
    ? `İçeride minesminis.com/konu/${topicId} ve minesminis.com/curriculum linkleri ver.`
    : 'İçeride minesminis.com/curriculum ve minesminis.com/blog linkleri ver.'
  const prompt = `Türkçe HTML yaz. Rol: ${role}. Başlık: "${title}". Anahtar kelimeler: ${keywords.slice(0, 5).join(', ')}. En az 800 kelime. Sadece h2, h3, p, ul, li, strong, a etiketleri. h1 KULLANMA. 3 alt başlık + 1 madde listesi + sonuç paragrafı. ${linkHint} Klişe giriş yok. html/head/body etiketi yok. <h2> ile başla. Sadece body içeriği.`

  let text = await callPollinations(prompt)
  text = text.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  if (text.length < 600) throw new Error(`Content too short (${text.length} chars)`)
  if (!/<(h[23]|p|ul|ol)[\s>]/i.test(text)) throw new Error('No HTML structural tags')
  // sanity: strip h1 if model leaks one
  text = text.replace(/<h1[^>]*>.*?<\/h1>/gi, '')
  return text
}

async function validateCoverUrl(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(60000) })
    return r.ok && r.headers.get('content-type')?.startsWith('image/') === true
  } catch {
    return false
  }
}

async function generateCover(title: string): Promise<string> {
  const prompt = `Bright, friendly, colorful flat illustration about teaching English to elementary school children — theme: ${title}. Cute kawaii-inspired characters, primary colors (purple, blue, yellow, orange), playful classroom or home setting, no text, no logos, child-safe, educational poster style.`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true&seed=${Date.now()}`
}

async function insertBlog(payload: Record<string, unknown>): Promise<void> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/mm_blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  })
  if (!r.ok) {
    const body = await r.text().catch(() => '')
    throw new Error(`Supabase insert HTTP ${r.status}: ${body.slice(0, 300)}`)
  }
}

async function logRun(generated: number, failed: number, durationMs: number, errorMessage?: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/mm_blog_gen_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        blogs_generated: generated,
        blogs_failed: failed,
        error_message: errorMessage?.slice(0, 2000),
        duration_ms: durationMs,
      }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (e) {
    console.warn('logRun failed:', e)
  }
}

async function generateSingleBlog(): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  // 50% kids / 50% teacher mix
  const isTeacher = Math.random() < 0.5
  const category = isTeacher ? 'teacher-resources' : 'teaching-english-to-kids'
  const pool = isTeacher ? TEACHER_PROMPTS : KIDS_PROMPTS
  const pick = pickRandom(pool)
  const title = pick.title

  // Build keyword list — mix with topic seo keywords if topicId
  const baseKeywords = isTeacher
    ? ['ilkokul ingilizce', 'maarif modeli', 'öğretmen kaynakları', 'ingilizce ders planı']
    : ['çocuklara ingilizce', 'evde ingilizce', 'aile rehberi', 'CEFR A1']
  const topicSeo = pick.topicId ? topics.find((t) => t.id === pick.topicId)?.seoKeywords || [] : []
  const keywords = Array.from(new Set([...baseKeywords, ...topicSeo])).slice(0, 8)

  const slugBase = tslug(title)

  try {
    // Generate content with retry (Pollinations sometimes 429/502/timeout)
    const contentHtml = await withRetry(
      () => generateContent(title, category, keywords, pick.topicId),
      5,
      6000,
      'pollinations-text',
    )

    // Generate + validate cover with retry
    let coverUrl = ''
    try {
      coverUrl = await withRetry(
        async () => {
          const url = await generateCover(title)
          const ok = await validateCoverUrl(url)
          if (!ok) throw new Error('Cover image validation failed (non-image response)')
          return url
        },
        2,
        3000,
        'pollinations-image',
      )
    } catch (e) {
      console.warn('Cover gen failed, proceeding without:', String(e).slice(0, 200))
    }

    const plain = contentHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const excerpt = (plain.slice(0, 200) + (plain.length > 200 ? '…' : '')).trim()
    const metaDesc = excerpt.slice(0, 158).trim()
    const readingTime = Math.max(3, Math.ceil(plain.split(/\s+/).length / 200))

    // Ensure unique slug
    const existing = await fetch(
      `${SUPABASE_URL}/rest/v1/mm_blogs?slug=eq.${encodeURIComponent(slugBase)}&select=id&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, signal: AbortSignal.timeout(10000) },
    ).then((r) => (r.ok ? r.json() : [])).catch(() => [])
    const slug = Array.isArray(existing) && existing.length > 0
      ? `${slugBase}-${Date.now().toString(36)}`
      : slugBase

    await withRetry(
      () =>
        insertBlog({
          title,
          slug,
          excerpt,
          content_html: contentHtml,
          meta_description: metaDesc,
          keywords,
          category,
          cover_url: coverUrl || null,
          status: 'published', // immediately live
          reading_time_min: readingTime,
          published_at: new Date().toISOString(),
        }),
      2,
      2000,
      'supabase-insert',
    )

    return { ok: true, slug }
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 500) }
  }
}

async function pingIndexNow(slugs: string[]): Promise<void> {
  if (slugs.length === 0) return
  try {
    const urls = slugs.map((s) => `https://minesminis.com/blog/${s}`)
    await submitToIndexNow(urls)
  } catch (e) {
    console.warn('IndexNow ping failed:', e)
  }
}

async function handler(req: Request) {
  const startTime = Date.now()
  const auth = req.headers.get('authorization')
  const isCron = process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`
  const isAdmin = req.headers.get('x-admin-key') && req.headers.get('x-admin-key') === process.env.BLOG_CRON_ADMIN_KEY

  if (!isCron && !isAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 })
  }

  // Optional ?count=3 for ad-hoc, default 1 per cron tick (3 ticks/day total)
  const url = new URL(req.url)
  const count = Math.max(1, Math.min(5, parseInt(url.searchParams.get('count') || '1', 10) || 1))

  const slugs: string[] = []
  const errors: string[] = []
  let generated = 0
  let failed = 0

  for (let i = 0; i < count; i++) {
    const out = await generateSingleBlog()
    if (out.ok) {
      generated++
      slugs.push(out.slug)
    } else {
      failed++
      errors.push(out.error)
    }
    if (i < count - 1) await sleep(2500)
  }

  // Fire-and-forget IndexNow ping (won't block response)
  await pingIndexNow(slugs)

  const durationMs = Date.now() - startTime
  await logRun(generated, failed, durationMs, errors.length ? errors.join(' | ') : undefined)

  return NextResponse.json({
    generated,
    failed,
    slugs,
    errors,
    duration_ms: durationMs,
  })
}

export { handler as GET, handler as POST }
