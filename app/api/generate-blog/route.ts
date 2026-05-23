import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 300

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').replace(/\\n/g, '').trim()
const SUPABASE_ANON = (process.env.VITE_SUPABASE_ANON_KEY || '').replace(/\\n/g, '').trim()

const TEACHER_KEYWORDS = [
  'ilkokul ingilizce ogretim kaynaklari', 'ingilizce ogretmen materyalleri', 'maarif modeli ingilizce kaynaklar',
  'ucretsiz ingilizce ogretim materyalleri', 'ingilizce oyun aktiviteleri ilkokul', 'ingilizce ders plani sablonu',
  'ingilizce calisma sayfalari PDF', 'ingilizce kelime kartlari', 'ilkokul 3 sinif ingilizce ders',
  'ilkokul 4 sinif ingilizce kaynaklari', 'ingilizce dinleme anlama etkinlikleri',
  'ingilizce konusma pratik egzersizleri', 'ingilizce yazma etkinlikleri cocuklar',
  'ingilizce gramer alistirmalari', 'maarif mufredat ingilizce',
]
const KIDS_KEYWORDS = [
  'cocuklara ingilizce nasil ogretilir', 'ingilizce ogrenme oyunlari cocuklar',
  'kucuk cocuklara ingilizce ogretme ipuclari', 'cocuk ingilizce konusmasi gelistirme',
  'TPR yontemi cocuklara ingilizce', 'ingilizce eglence etkinlikleri 6-8 yas',
  'cocuklar icin ingilizce videolar', 'ingilizce rol oynama aktiviteleri',
  'phonics ogretimi cocuklar', 'evde ingilizce ogretme',
]

const KONULAR = ['Renkler', 'Sayilar', 'Hayvanlar', 'Aile', 'Mevsimler', 'Hava Durumu', 'Yiyecekler', 'Vucut Bolumleri']
const SINIFLAR = ['1', '2', '3', '4']
const YONTEMLER = ['TPR (Total Physical Response)', 'Oyun Tabanli Ogrenme', 'Hikaye Tabanli Ogretim', 'Drama']

const TEACHER_TOPICS = [
  'Ilkokul Ingilizce Dersinde En Etkili 10 Oyun ve Aktivite',
  'Maarif Modeli Ingilizce Ogretimine Uyumlu Ders Plani Sablonlari',
  '3. Sinif Ingilizce: Mufredat Uyumlu Kaynak Paketi',
]
const KIDS_TOPICS = [
  'Cocuklara Ingilizce Ogretmeye Baslamak: Adim Adim Rehber',
  'En Eglenceli 15 Ingilizce Oyunu Cocuklar Icin',
  '6-8 Yas Grubu Icin En Iyi 20 Ingilizce Aktivitesi',
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function turkishSlugify(text: string): string {
  return text
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80)
}

async function generateContent(title: string, category: string, keywords: string[]): Promise<string> {
  const role = category === 'teacher-resources' ? 'ilkokul Ingilizce ogretmeni' : 'cocuk gelisimi uzmani egitimci'
  const prompt = `Turkce yaz. HTML formatinda yaz (h2, h3, p, ul, li, strong, em, a). h1 KULLANMA. En az 800 kelime.\n\nRol: ${role}. Hedef: Turkiye ilkokul Ingilizce egitimi.\n\nBaslik: "${title}"\nAnahtar kelimeler: ${keywords.join(', ')}\n\nYapi: 1) Giris 2) Alt baslikli ana icerik 3) Pratik etkinlikler 4) minesminis.com referansi 5) Sonuc\n\nSadece body icerigi ver, html/head/body etiketi KOYMA. Her alt basligi h2/h3 yap.`
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${Date.now()}&model=openai`
  const res = await fetch(url, { signal: AbortSignal.timeout(120000) })
  if (!res.ok) throw new Error(`Pollinations error: ${res.status}`)
  let text = await res.text()
  if (!text || text.length < 200) throw new Error('Generated content too short')
  text = text.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  if (!/<(h[23]|p|ul|ol)[\s>]/i.test(text)) throw new Error('Generated content is not valid HTML')
  return text
}

async function generateCover(title: string): Promise<string> {
  const prompt = `Educational illustration about ${title}, colorful flat design, teaching children English, cute style, no text, child-friendly`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true&seed=${Date.now()}`
}

async function generateSingleBlog(category: string): Promise<{ success: boolean; error?: string }> {
  const topics = category === 'teacher-resources' ? TEACHER_TOPICS : KIDS_TOPICS
  const keywordPool = category === 'teacher-resources' ? TEACHER_KEYWORDS : KIDS_KEYWORDS
  const title = pickRandom(topics)
  const keywords = Array.from({ length: 6 }, () => pickRandom(keywordPool)).filter((v, i, a) => a.indexOf(v) === i)
  const slug = turkishSlugify(title)

  try {
    const [contentHtml, coverUrl] = await Promise.all([
      generateContent(title, category, keywords),
      Promise.resolve(generateCover(title)),
    ])

    const plain = contentHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const excerpt = plain.slice(0, 200) + (plain.length > 200 ? '...' : '')
    const readingTime = Math.max(3, Math.ceil(plain.split(/\s+/).length / 200))

    const existing = await fetch(
      `${SUPABASE_URL}/rest/v1/mm_blogs?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
      { headers: { apikey: SUPABASE_ANON } },
    ).then((r) => r.json()).catch(() => [])
    const uniqueSlug = existing && existing.length > 0 ? slug + '-' + Math.random().toString(36).slice(2, 6) : slug

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/mm_blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title,
        slug: uniqueSlug,
        excerpt,
        content_html: contentHtml,
        meta_description: excerpt.slice(0, 160),
        keywords,
        category,
        cover_url: coverUrl,
        status: 'draft',
        reading_time_min: readingTime,
        published_at: new Date().toISOString(),
      }),
    })
    if (!insertRes.ok) throw new Error(`Supabase insert error: ${await insertRes.text()}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function handler(req: NextRequest) {
  const isPost = req.method === 'POST'
  const cronSecret = req.headers.get('authorization')
  const isCron = cronSecret === `Bearer ${process.env.CRON_SECRET}` || req.method === 'GET'

  if (!isCron && isPost) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON },
    })
    if (!userRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const results = { generated: 0, failed: 0, errors: [] as string[] }
  const categories = ['teacher-resources', 'teaching-english-to-kids', 'teaching-english-to-kids']

  for (const cat of categories) {
    const outcome = await generateSingleBlog(cat)
    if (outcome.success) {
      results.generated++
    } else {
      results.failed++
      if (outcome.error) results.errors.push(outcome.error)
    }
    if (results.generated + results.failed < 3) await new Promise((r) => setTimeout(r, 3000))
  }

  return NextResponse.json({
    message: `Generated ${results.generated} blogs, ${results.failed} failed`,
    ...results,
    duration_ms: Date.now() - startTime,
  })
}

export { handler as GET, handler as POST }
