# minesminis SEO #1 — Sabah Yapılacaklar

> Bu doküman senin sabah hazırlayacağın adımları özetler.
> Detaylı yol haritası: `~/Desktop/minesminis-SEO-yol-haritasi.key` (Keynote)

## ŞU AN MİNESMİNİS NE DURUMDA?

**Hepsi otomatik, canlı, çalışıyor:**

- 494+ URL Google'a tarama için hazır (sitemap.xml)
- 60+ AI bot izinli (ChatGPT, Claude, Perplexity, Gemini, Copilot)
- 80+ otomatik blog post yayında (cron her gün 3 yeni ekliyor)
- 57 İngilizce konu sayfası + 30 sınıf etkinliği + yazdırılabilir kâğıtlar
- AdSense entegrasyonu aktif (script live'da)
- IndexNow Bing+Yandex'e otomatik push (her gün 05:30)
- Vercel Cron — 06:00, 13:00, 19:00 blog gen + 05:30 IndexNow

---

## SENİN SABAH YAPMAN GEREKEN (1.5 saat toplam)

### 1. Google Search Console — 10 dk

URL: https://search.google.com/search-console

1. Microsoft veya Google hesabı ile giriş
2. "Add property" → "URL prefix" seç
3. minesminis.com gir
4. "HTML tag" yöntemi (verify kodu zaten kodda var: `uc57zPkk36HVf6lb1fPPBnvwTA5Gk_FBfYZDrhQVDqc`)
5. "Verify" → onaylanır
6. Sol menüde "Sitemaps" tab'ı
7. Şunları ekle (her birini ayrı):
   - `sitemap.xml`
   - `sitemap-topics.xml`
   - `sitemap-news.xml`
   - `sitemap-images.xml`
8. 2-7 gün içinde Google indeksleme başlar

### 2. Bing Webmaster Tools — 10 dk

URL: https://www.bing.com/webmasters

1. Microsoft hesabı ile giriş
2. "Add a site" → minesminis.com
3. "Import from Google Search Console" tıkla
4. Otomatik aktarılır
5. Sitemaps tab'ında `sitemap-index.xml` ekle

**Not:** IndexNow zaten otomatik bağlı, Bing günde 1 kez taze URL alıyor.

### 3. AdSense doğrulama — 5 dk

URL: https://www.google.com/adsense/

1. "Sites" bölümüne git
2. minesminis.com için durum kontrol et:
   - **"Ready"** veya **"Site Hazır"** → BAŞARILI, sıradaki adıma geç
   - **"Getting ready"** → 1-2 gün bekle, sonra tekrar bak
3. Ready olduktan sonra:
   - "Ads" → "By ad unit" → "Display ads"
   - 3 ad unit oluştur: **Banner**, **Rectangle**, **Vertical**
   - Her birinin **Slot ID**'sini kopyala
4. Vercel'e env vars ekle:
   ```
   NEXT_PUBLIC_ADSENSE_SLOT_BANNER=<slot-id-1>
   NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE=<slot-id-2>
   NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL=<slot-id-3>
   NEXT_PUBLIC_ADSENSE_ENABLED=true
   ```
5. Vercel'de "Redeploy"

### 4. Sosyal hesaplar — 30 dk

Aynı handle ile aç: `@minesminis` veya `minesminis`

- [ ] **Instagram** — anneler için en kritik
- [ ] **Pinterest** — pin-rich, ücretsiz organik trafik (Türkiye'de çok güçlü)
- [ ] **Facebook** — sayfa
- [ ] **YouTube** — kanal (videolar zaten içeride, repurpose)
- [ ] **TikTok** — kısa eğitim klipler

URL'leri WhatsApp/email ile bana ver, Claude'a şunu söyle:
> "Şu sosyal URL'leri orgSchema.sameAs'e ekle: ..."

### 5. Pinterest pin stratejisi — 30 dk başlangıç

**Hazır altyapı:**
- Pinterest RSS: https://minesminis.com/pinterest-rss.xml
- Her topic için OG image: https://minesminis.com/konu/colors/opengraph-image

**Yapacakların:**
1. Pinterest hesabı aç (yukarıda)
2. **Tailwind App** veya **Buffer** gibi scheduler dene (ücretsiz tier)
3. RSS feed'i bağla → otomatik pin yapar
4. **Veya** manuel: günde 5-10 pin paylaş
5. Pin tasarımı Canva'da ücretsiz:
   - Başlık: "Çocuğa İngilizce Renkleri Nasıl Öğretirim"
   - Görsel: OG image kullan, üzerine başlık koy
   - Açıklama: minesminis.com/konu/colors linki

### 6. Reddit + Quora — Haftalık 30 dk

**AI search'ün en çok kaynak aldığı yerler.** 1 ay sonra Claude/ChatGPT minesminis'i kaynak göstermeye başlar.

- r/Turkey + r/turkce + r/cocukbakimi (Reddit)
- Quora.com → "çocuğa İngilizce", "ilkokul İngilizce", "phonics" sorularını ara
- Cevaplarınızda DOĞAL olarak minesminis.com linki bırak
- Spam değil — gerçekten faydalı + 1 link

**Hedef:** Haftada 3-5 cevap

### 7. Eğitim portalı listings — Aylık 1-2 saat

`SEO_BACKLINK_PLAN.md` dosyasında 50+ fırsat detaylı yazılı. Öncelik:

- egitimhane.com → "Kaynak paylaş"
- morpa.com.tr → öğretmen yorumu
- okulistik.com → öğretmen alanı
- anneoluyorum.com → blog yorumu
- eba.gov.tr → öğretmen kaynak önerisi

---

## OTOMATIK ÇALIŞAN SİSTEM (Sen hiçbir şey yapmasan dahi)

| Saat | İşlem |
|------|-------|
| 05:30 | Tüm sitemap Bing/Yandex'e push (IndexNow) |
| 06:00 | 1 blog post otomatik üretilir + yayınlanır |
| 13:00 | 1 blog post daha |
| 19:00 | 1 blog post daha |

**Aylık çıktı:** ~90 blog post otomatik.
Manuel kontrol önerim: Her hafta bir kez blog liste sayfasına bak (`/blog`), uygunsuz/hatalı post varsa admin'den (`/admin`) "unpublish" yap.

---

## BEKLENTI (Gerçekçi)

| Süre | Beklenti |
|------|----------|
| 1 hafta | Google index başlar (~50-100 sayfa) |
| 2 hafta | AI search'lerde isim geçmeye başlar |
| 3-4 hafta | Long-tail aramalardan trafik gelmeye başlar |
| 30 gün | **200-500 organik ziyaretçi/gün** beklentisi |
| 90 gün | 1000-2000/gün |
| 6 ay | 2000-5000/gün |
| AdSense | Aylık 50-200 USD beklenti |

**Garanti değil** — niş + içerik kalitesi + rakip sayısı belirler. Ama bu altyapıyla başarı olasılığı yüksek.

---

## SORUN OLURSA

- Genel iletişim: info@minesminis.com
- Vercel panel: https://vercel.com/onurs-projects-d25c20cf/minesminis
- GitHub: https://github.com/onurhuseyinkocak/minesminis
- Admin panel: https://minesminis.com/admin

**Cron çalışmıyorsa:**
- Vercel → Project → Settings → Crons sekmesinde 4 cron olmalı
- Manuel tetikleme: `curl -X POST minesminis.com/api/blog-cron?count=1 -H "x-admin-key: $BLOG_CRON_ADMIN_KEY"`

**Blog hatalı geliyorsa:**
- Admin panelinden "unpublish" yap
- Aynı slug'la yeni gelirse otomatik unique slug ekler

---

## ÖNEMLI NOTLAR

1. **Vercel ücretsiz limitleri** 6-12 ay sana yeter. Ay sonunda Vercel dashboard'da bandwidth check et.
2. **GitHub backup:** Branch `nextjs-migration`. Otomatik push YOK. Önemli değişikliklerden sonra `git push` çalıştır.
3. **AdSense reklamı görmüyorsan:** AdSense panelinde domain "Ready" mi kontrol et. Ad blocker'ın olabilir.
4. **DNS değişikliği yapma** — Vercel'de domain ayarları işliyor, dokunma.

---

Son güncelleme: 2026-06-02 sabah
