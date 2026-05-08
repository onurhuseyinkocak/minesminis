import type { VercelRequest, VercelResponse } from '@vercel/node'

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').replace(/\\n/g, '').trim()
const SUPABASE_ANON = (process.env.VITE_SUPABASE_ANON_KEY || '').replace(/\\n/g, '').trim()

// SEO keyword pools — researched Turkish teacher search terms (high volume)
const TEACHER_KEYWORDS = [
  // High volume — core
  'ilkokul ingilizce ogretim kaynaklari', 'ingilizce ogretmen materyalleri', 'maarif modeli ingilizce kaynaklar',
  'ucretsiz ingilizce ogretim materyalleri', 'ingilizce oyun aktiviteleri ilkokul', 'ingilizce ders plani sablonu',
  'ingilizce calisma sayfalari PDF', 'ingilizce kelime kartlari', 'ilkokul 3 sinif ingilizce ders',
  'ilkokul 4 sinif ingilizce kaynaklari', 'ingilizce dinleme anlama etkinlikleri',
  // Medium volume — classroom focused
  'ingilizce konusma pratik egzersizleri', 'ingilizce yazma etkinlikleri cocuklar',
  'ingilizce gramer alistirmalari', 'ingilizce sozluk ogretme yontemleri',
  'ingilizce okuma metinleri ilkokul', 'ingilizce interaktif oyunlar sinif',
  'ingilizce dilbilgisi ogretimi rehberi', 'ingilizce hikaye okuma sinifta',
  'ingilizce sarki ve muzik etkinlikleri', 'ingilizce odev fikirleri ogretmenler',
  // Maarif & method specific
  'maarif mufredat ingilizce', '2 sinif ingilizce etkinlikleri', '3 sinif ingilizce etkinlikleri',
  '4 sinif ingilizce etkinlikleri', 'TPR yontemi ingilizce', 'ingilizce drama etkinlikleri',
  'ingilizce oyun tabanli ogrenme', 'dijital ingilizce ogretim araclari',
  'ingilizce sinif yonetimi ipuclari', 'ingilizce olcme degerlendirme kaynaklari',
]

const KIDS_KEYWORDS = [
  // High volume — parent & teacher searches
  'cocuklara ingilizce nasil ogretilir', 'ingilizce ogrenme oyunlari cocuklar',
  'kucuk cocuklara ingilizce ogretme ipuclari', 'cocuk ingilizce konusmasi gelistirme',
  'TPR yontemi cocuklara ingilizce', 'ingilizce eglence etkinlikleri 6-8 yas',
  'ingilizce eglence etkinlikleri 8-10 yas', 'kelime ogrenme oyunlari cocuklar',
  // Medium volume — specific activities
  'cocuklar icin ingilizce videolar', 'ingilizce rol oynama aktiviteleri',
  'ingilizce telaffuz calismalari cocuklar', 'renkler ve sekiller ingilizce ogretme',
  'hayvanlar ingilizce ogrenme oyunlari', 'yiyecek icecek ingilizce kelimeler',
  'ingilizce hikaye anlatma teknikleri', 'ingilizce karaoke sarkilari cocuklar',
  'gunluk ingilizce cumleler cocuklar', 'diyalog oyunlari ingilizce cocuklar',
  // Broad — catch-all
  'evde ingilizce ogretme', 'cocuk ingilizce aktiviteleri', 'ingilizce alfabe ogretimi',
  'ingilizce boyama etkinlikleri', 'cocuklara ingilizce baslatma yasi',
  'cocuklara ingilizce okuma ogretme', 'ingilizce flashcard cocuklar',
  'ingilizce beden hareketleri etkinligi', 'phonics ogretimi cocuklar',
  'cocuklara ingilizce motivasyon stratejileri', 'ingilizce dramatizasyon etkinlikleri',
]

// Topic templates — dynamic (filled with random konu/sinif/yontem)
const TEACHER_TOPICS_DYNAMIC = [
  'Maarif Modeli Uyumlu {sinif}. Sinif Ingilizce {konu} Etkinlikleri',
  '{konu} Konusunda Sinif Ici Ingilizce Oyunlari ve Etkinlikler',
  'Ilkokul {sinif}. Sinif Ingilizce {konu} Unitesi Ders Plani',
  '{yontem} Yontemiyle Etkili Ingilizce Ogretimi: Pratik Rehber',
  'Ingilizce {konu} Ogretimi Icin Ucretsiz Calisma Kagitlari',
  'Sinifta Kullanilabilecek {sayi} Eglenceli Ingilizce {konu} Etkinligi',
  'Dijital Araclarla Ingilizce {konu} Ogretimi: Ogretmen Rehberi',
  'Ingilizce {konu} Konusu Icin Drama ve Rol Yapma Etkinlikleri',
  'Ilkokul Ingilizce Derslerinde {konu} Nasil Ogretilir?',
  'Maarif Mufredat Uyumlu Ingilizce {konu} Etkinlik Fikirleri',
]

// Pre-researched SEO blog titles (high search intent)
const TEACHER_TOPICS_FIXED = [
  'Ilkokul Ingilizce Dersinde En Etkili 10 Oyun ve Aktivite',
  'Maarif Modeli Ingilizce Ogretimine Uyumlu Ders Plani Sablonlari',
  '3. Sinif Ingilizce: Mufredat Uyumlu Kaynak Paketi',
  '4. Sinif Ingilizce Ogrencileri Icin Ucretsiz Calisma Sayfalari',
  'Ingilizce Kelime Ogretiminde Gorsel Materyal Kullanimi',
  'Dinleme Anlamasi Becerisi: Ilkokul Seviyesi Etkinlik Ornekleri',
  'Ingilizce Konusma Kaygisi: Ogrenciler Icin 5 Pratik Yontemi',
  'Yaratici Ingilizce Yazma Etkinlikleri ve Proje Onerileri',
  'Ingilizce Basit Zamanlar: Ogretmen Icin Aciklamali Rehber',
  'Dijital Araclar ile Ingilizce Dersi: Web 2.0 Oyunlari',
  'Ingilizce Kitap Okuma Saati: Sinif Uygulamalari ve Etkinlikleri',
  'Ingilizce Sarkilar ve TPR Yaklasimi: Sinifta Muzik Kullanimi',
  'Ev Odevi Tasarlama: Ingilizce Dersinde Etkili Odev Fikirleri',
  'Sinava Hazirlik: Ingilizce Kisa Sinavlar ve Quiz Tasarimi',
  'Kapsayici Egitim: Tum Ogrenciler Icin Ingilizce Kaynaklari',
]

const KIDS_TOPICS_DYNAMIC = [
  'Cocuklara Ingilizce {konu} Ogretmenin {sayi} Eglenceli Yolu',
  'Evde Cocugunuzla Ingilizce {konu} Pratigi Yapmanin Yollari',
  'Ingilizce {konu} Ogretimi Icin En Iyi Sarkilar ve Videolar',
  'Cocuklar Icin Ingilizce {konu} Oyunlari: Eglenerek Ogren',
  '{konu} Konusunda Cocuklara Ingilizce Ogretme Teknikleri',
  'Kucuk Yaslardan Ingilizce {konu} Ogretmenin Onemi ve Yollari',
  'Cocuklara Ingilizce {konu} Ogretirken Yapilan {sayi} Yaygin Hata',
  'Ingilizce {konu} Flashcard Etkinlikleri: Basit ve Etkili',
  'Cocuklara Ingilizce {konu} Ogretmek Icin Hikaye Yontemi',
  'Ingilizce {konu} Konusunda Boyama ve Calisma Kagitlari',
]

const KIDS_TOPICS_FIXED = [
  'Cocuklara Ingilizce Ogretmeye Baslamak: Adim Adim Rehber',
  'En Eglenceli 15 Ingilizce Oyunu Cocuklar Icin',
  'Deneyimli Ogretmenlerin 10 Gizli Ipucu: Cocuklara Ingilizce',
  'Cocugunun Ingilizce Konusmasini Hizli Gelistirmenin Kanitlanmis Yollari',
  'TPR Yontemi Nedir ve Cocuklara Ingilizce Ogretmede Nasil Kullanilir?',
  '6-8 Yas Grubu Icin En Iyi 20 Ingilizce Aktivitesi',
  '8-10 Yas: Orta Seviye Ingilizce Ogrenme Stratejileri',
  'Konusma Pratigi: Ingilizce Diyalog Oyunlari Cocuklar Icin',
  'Kelime Ogrenmeyi Eglenceli Hale Getiren Oyunlar',
  '30 Gunde Ingilizce Konusma Seviyelerini Yukselt',
  'Gunluk Hayatta Kullanilan 50 Ingilizce Cumle Cocuklar Icin',
  'Rol Oynama ile Ingilizce Konusma Becerisini Gelistir',
  'Cocuklar Icin En Iyi 30 Ingilizce Ogrenme Videosu',
  'Telaffuz Sorunlarini Cozmek: Ingilizce Ses Egitimi',
  'Renkler, Sekiller, Sayilar: Ingilizce Temel Konular Cocuklar Icin',
  'Hayvan Dunyasi: Ingilizce Hayvan Kelime Oyunlari',
  'Leziz Ogrenme: Yiyecek-Icecek Ingilizce Aktiviteleri',
]

const KONULAR = ['Renkler', 'Sayilar', 'Hayvanlar', 'Aile', 'Mevsimler', 'Hava Durumu',
  'Yiyecekler', 'Vucut Bolumleri', 'Meslekler', 'Giysiler', 'Okul Esyalari',
  'Gunluk Rutinler', 'Selamlasmalar', 'Duygular', 'Hobiler', 'Ulasim Araclari',
  'Gunler ve Aylar', 'Alfabe', 'Sporlar', 'Ev Esyalari']

const YONTEMLER = ['TPR (Total Physical Response)', 'Oyun Tabanli Ogrenme', 'Hikaye Tabanli Ogretim',
  'CLIL', 'Drama', 'Sarki ve Tekerleme', 'Flashcard', 'Dijital Araclar']

const SINIFLAR = ['1', '2', '3', '4']

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateTitle(template: string): string {
  return template
    .replace('{konu}', pickRandom(KONULAR))
    .replace('{sinif}', pickRandom(SINIFLAR))
    .replace('{yontem}', pickRandom(YONTEMLER))
    .replace('{sayi}', String(Math.floor(Math.random() * 6) + 5))
}

// Turkish char to ASCII for slug
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

async function generateBlogContent(title: string, category: string, keywords: string[]): Promise<string> {
  const role = category === 'teacher-resources'
    ? 'ilkokul Ingilizce ogretmeni'
    : 'cocuk gelisimi uzmani egitimci'

  const prompt = `Turkce yaz. HTML formatinda yaz (h2, h3, p, ul, li, strong, em, a). h1 KULLANMA. En az 800 kelime.

Rol: ${role}. Hedef: Turkiye ilkokul Ingilizce egitimi.

Baslik: "${title}"
Anahtar kelimeler: ${keywords.join(', ')}

Yapi: 1) Giris 2) Alt baslikli ana icerik 3) Pratik etkinlikler 4) minesminis.com referansi (slides, videos, songs, worksheets sayfalarina link ver) 5) Sonuc

Kurallar:
- Sadece body icerigi ver, html/head/body etiketi KOYMA
- Her alt basligi h2 veya h3 yap
- minesminis.com linklerini <a href="https://minesminis.com/slides"> formatinda ekle
- Dogru, tutarli Turkce yaz
- Anahtar kelimeleri dogal yerlestir`

  const encoded = encodeURIComponent(prompt)
  const url = `https://text.pollinations.ai/${encoded}?seed=${Date.now()}&model=openai`

  const res = await fetch(url, {
    signal: AbortSignal.timeout(120000),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => 'no body')
    throw new Error(`Pollinations API error: ${res.status} - ${errBody.slice(0, 200)}`)
  }
  let text = await res.text()
  if (!text || text.length < 200) throw new Error('Generated content too short')

  // Clean up: remove markdown code fences if present
  text = text.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

  // Validate: must contain at least one HTML tag
  if (!/<(h[23]|p|ul|ol)[\s>]/i.test(text)) {
    throw new Error('Generated content is not valid HTML')
  }

  return text
}

async function generateCoverImage(title: string): Promise<string> {
  const prompt = `Educational illustration about ${title}, colorful flat design, teaching children English, cute kawaii style, bright colors, no text no letters, clean composition, digital art, child-friendly`
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=630&nologo=true&seed=${Date.now()}`

  // Just return the URL — Pollinations generates on access
  // Verify it works with a HEAD request
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) })
    if (res.ok) return url
  } catch {
    // If HEAD fails, still return URL — it might work on GET
  }
  return url
}

function generateExcerpt(html: string): string {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return text.slice(0, 200) + (text.length > 200 ? '...' : '')
}

function estimateReadingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(3, Math.ceil(words / 200))
}

async function generateSingleBlog(category: string, retries = 3): Promise<{ success: boolean; error?: string; blogId?: string }> {
  const dynamicTopics = category === 'teacher-resources' ? TEACHER_TOPICS_DYNAMIC : KIDS_TOPICS_DYNAMIC
  const fixedTopics = category === 'teacher-resources' ? TEACHER_TOPICS_FIXED : KIDS_TOPICS_FIXED
  const keywordPool = category === 'teacher-resources' ? TEACHER_KEYWORDS : KIDS_KEYWORDS
  // 60% chance fixed (SEO-researched), 40% dynamic (template-generated)
  const useFixed = Math.random() < 0.6
  const title = useFixed ? pickRandom(fixedTopics) : generateTitle(pickRandom(dynamicTopics))
  const keywords = Array.from({ length: 6 }, () => pickRandom(keywordPool))
    .filter((v, i, a) => a.indexOf(v) === i) // unique
  const slug = turkishSlugify(title)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Generate content and cover in parallel
      const [contentHtml, coverUrl] = await Promise.all([
        generateBlogContent(title, category, keywords),
        generateCoverImage(title),
      ])

      const excerpt = generateExcerpt(contentHtml)
      const readingTime = estimateReadingTime(contentHtml)
      const metaDescription = excerpt.slice(0, 160)

      // Insert into Supabase
      // Check slug uniqueness, append counter if needed
      let uniqueSlug = slug
      const { data: existing } = await fetch(
        `${SUPABASE_URL}/rest/v1/mm_blogs?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
        { headers: { 'apikey': SUPABASE_ANON } }
      ).then(r => r.json()).catch(() => [])
      if (existing && existing.length > 0) {
        uniqueSlug = slug + '-' + Math.random().toString(36).slice(2, 6)
      }

      const { data, error } = await fetch(`${SUPABASE_URL}/rest/v1/mm_blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title,
          slug: uniqueSlug,
          excerpt,
          content_html: contentHtml,
          meta_description: metaDescription,
          keywords,
          category,
          cover_url: coverUrl,
          status: 'published',
          reading_time_min: readingTime,
          published_at: new Date().toISOString(),
        }),
      }).then(async r => {
        if (!r.ok) {
          const errText = await r.text()
          return { data: null, error: errText }
        }
        return { data: await r.json(), error: null }
      })

      if (error) throw new Error(`Supabase insert error: ${error}`)

      return { success: true, blogId: data?.[0]?.id }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      if (attempt === retries) {
        // Log failed attempt
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/mm_blogs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON,
              'Authorization': `Bearer ${SUPABASE_ANON}`,
            },
            body: JSON.stringify({
              title,
              slug: slug + '-failed',
              status: 'failed',
              error_log: `${errMsg} (after ${retries} retries)`,
              category,
              keywords,
            }),
          })
        } catch {}
        return { success: false, error: errMsg }
      }
      // Wait before retry (exponential backoff)
      await new Promise(r => setTimeout(r, 2000 * attempt))
    }
  }
  return { success: false, error: 'Unknown error' }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow both GET (cron) and POST (manual trigger from admin)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify cron secret or admin auth
  const cronSecret = req.headers['authorization']
  const isAuthorized = cronSecret === `Bearer ${process.env.CRON_SECRET}` || req.method === 'GET'

  if (!isAuthorized && req.method === 'POST') {
    // Check admin auth for manual triggers
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON },
      })
      if (!userRes.ok) return res.status(401).json({ error: 'Unauthorized' })
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const startTime = Date.now()
  const results = { generated: 0, failed: 0, errors: [] as string[] }

  // Generate 3 blogs sequentially: 1 teacher + 2 kids
  // Sequential to avoid Pollinations rate limiting (429)
  const categories = [
    'teacher-resources',
    'teaching-english-to-kids',
    'teaching-english-to-kids',
  ]

  for (const cat of categories) {
    try {
      const outcome = await generateSingleBlog(cat)
      if (outcome.success) {
        results.generated++
      } else {
        results.failed++
        if (outcome.error) results.errors.push(outcome.error)
      }
    } catch (err: unknown) {
      results.failed++
      results.errors.push(err instanceof Error ? err.message : 'Unknown error')
    }
    // Small delay between blogs to respect rate limits
    if (results.generated + results.failed < 3) {
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  // Log the run
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/mm_blog_gen_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify({
        blogs_generated: results.generated,
        blogs_failed: results.failed,
        error_message: results.errors.length > 0 ? results.errors.join('; ') : null,
        duration_ms: Date.now() - startTime,
      }),
    })
  } catch {}

  return res.status(200).json({
    message: `Generated ${results.generated} blogs, ${results.failed} failed`,
    ...results,
    duration_ms: Date.now() - startTime,
  })
}
