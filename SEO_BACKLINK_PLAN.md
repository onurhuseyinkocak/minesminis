# minesminis — Backlink + Distribution Plan

Bu doküman minesminis.com için **off-page SEO** stratejisini özetler. On-page SEO (schema, llms.txt, programmatic content) zaten yapıldı.

## 1. Türkiye Eğitim Portalları — Listing fırsatları

### Yüksek Otorite
- **Eba (eba.gov.tr)** — Resmi MEB portalı. "Öğretmen kaynakları" bölümünde ücretsiz kaynak olarak listeleniş başvurusu.
- **MEB Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü** — okul/ilçe milli eğitim listings için doğrudan iletişim.
- **Eğitim Bilişim Ağı (eba.gov.tr)** — içerik üretici kaydı.

### Öğretmen Toplulukları
- **Egitimhane.com** — öğretmenlerin kaynak paylaşım sitesi. Çalışma kâğıdı + sunum + şarkı linkleri.
- **Morpa Kampüs (morpa.com.tr)** — özel kurs / ev eğitimi alanı. "İlave kaynaklar" bölümü.
- **Okulistik (okulistik.com)** — özel okul kaynak portalı.
- **Ders Kitabı (derskitabi.com)** — kitap eşliği listings.

### Aile Toplulukları
- **Annebabaplatformu.com** — aileler için kaynak önerileri.
- **Mahmure.com, Pembelila.com** — anne blog/forum siteleri.

## 2. Sosyal Topluluklar (Facebook Grupları)

Doğrudan paylaşım yasak; tek tek "Bu kaynak işime yaradı" şeklinde organik yorum:
- **İngilizce Öğretmenleri Grubu** (50K+ üye)
- **Sınıf Öğretmenleri Türkiye** (200K+ üye)
- **Ev Okulu Türkiye / Evde Eğitim**
- **Maarif Modeli Müfredatı Öğretmen Paylaşımları**
- **İlkokul Öğretmenleri Yardımlaşma**

Strateji: Her topic page için (örn /konu/colors) ilgili öğretmen sorusu varsa cevap olarak link bırak. Spam değil yardım modu.

## 3. Pinterest — Görsel SEO

Pinterest Türkiye'de eğitim aramalarında etkin. Her topic page için 3 pin:
1. Kelime kartı (görsel + İngilizce + Türkçe)
2. Etkinlik fikri (örn "5 Renkler Sınıf Oyunu")
3. Yazdırılabilir çalışma kâğıdı önizleme

Hedef: 60 pin × 30 konu = 1800 pin. Her pin minesminis.com/konu/... linkli.

## 4. YouTube — Video Dağıtım

Mevcut /videos içeriklerini YouTube kanalına yükle:
- Kanal adı: "minesminis — Çocuklar İçin İngilizce"
- Açıklama metnin içinde kanonik URL link
- End screen + card → konu/[topic] sayfasına yönlendir
- "Subscribe + Visit Website" CTA

## 5. .edu.tr ve .gov.tr Backlink Fırsatları

- **Bilkent, Boğaziçi, ODTÜ Eğitim Fakülteleri** — staj öğrencilerine kaynak önerisi
- **İl Milli Eğitim Müdürlükleri web siteleri** — ücretsiz kaynak duyuru paylaşımı
- **YÖKDİL/YÖK Akademik** — eğitim platformları listings

## 6. Blog Outreach

Türk eğitim blog'larında guest post:
- Çocukgelisim.com
- Egitimajansi.com
- Pedagogtv.com
- Cocukediyor.com

Konu önerisi: "Maarif Modeli İngilizce Müfredatı Nasıl Öğretilmeli — Aile Rehberi"

## 7. AI Search Citation Strategy

Halihazırda:
- `llms.txt` ✓
- `llms-full.txt` ✓ (5000+ kelime)
- robots.txt'te GPTBot/ClaudeBot/PerplexityBot izinli ✓
- FAQPage / LearningResource / Course schema ✓

Ek adım:
- **Reddit r/turkce + r/Turkey** soru-cevap'larında doğal alıntı
- **Quora Türkçe** "çocuğa İngilizce nasıl öğretirim" sorularına cevap
- Cevaplarda kaynak: "minesminis.com/konu/[ilgili]" — AI'ların indexleyeceği veritabanları

## 8. IndexNow Otomasyonu (Bing + Yandex)

Sistem kuruldu:
- Key: `93a5ce89726a1b34519dce3d67ef74d5`
- Key file: `public/93a5ce89726a1b34519dce3d67ef74d5.txt`
- Endpoint: `POST /api/indexnow` (auth: `X-API-Key: $INDEXNOW_PROXY_KEY`)
- Bing + Yandex + IndexNow.org'a iletiyor

Kullanım örneği:
```bash
curl -X POST https://minesminis.com/api/indexnow \
  -H "X-API-Key: $INDEXNOW_PROXY_KEY" \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://minesminis.com/konu/greetings","https://minesminis.com/sinif/2"]}'
```

Admin panel'den yeni içerik publish edilince tetiklenecek.

## 9. Google Search Console — Sitemap Push

Manuel olarak ekle (bir kez):
1. https://search.google.com/search-console
2. "Add property" → minesminis.com
3. DNS TXT verify (Vercel DNS panel'inden)
4. Sitemap submit: `https://minesminis.com/sitemap.xml`
5. URL Inspection ile öncelikli sayfaları submit:
   - /sinif/1, /sinif/2, /sinif/3, /sinif/4
   - /konu/greetings, /konu/colors, /konu/numbers-1-10 (en yüksek search volume)
   - /curriculum, /faq

## 10. Bing Webmaster Tools

Manuel ekle (bir kez):
1. https://www.bing.com/webmasters
2. "Add a site" → minesminis.com
3. IndexNow zaten kuruldu; Bing otomatik bulacak
4. Sitemap submit: `https://minesminis.com/sitemap.xml`

## 11. Yandex Webmaster

Türkiye'de Yandex'in payı %2-3 ama yine de:
1. https://webmaster.yandex.com
2. Add site → meta tag verify (public/yandex_verify.html önerisi)
3. Sitemap submit

## 12. RSS Feed

`/rss.xml` endpoint mevcut. Feedburner gibi servislere kayıt:
- Feedly
- Inoreader
- NewsBlur

Feed URL: `https://minesminis.com/rss.xml`

## 13. Sosyal Sinyaller — sameAs Schema

Sosyal hesaplar açıldığında `app/layout.tsx` orgSchema.sameAs'e eklenecek:
- Instagram: @minesminis (planlı)
- Facebook: facebook.com/minesminis (planlı)
- YouTube: youtube.com/@minesminis (planlı)
- Pinterest: pinterest.com/minesminis (planlı)

## 14. Sıralama Önceliği (Aylık Plan)

**Ay 1**: Search Console + Bing Webmaster setup + IndexNow tetikle (tüm 19 konu + 4 sınıf URL)
**Ay 2**: Pinterest 30 pin + Reddit/Quora 10 organik cevap
**Ay 3**: Eğitim portalları (Egitimhane, Morpa) listing başvurusu
**Ay 4**: YouTube kanal + video upload + blog outreach
**Ay 5+**: Ölç + güçlüleri katla, zayıflarına yatırım kes

---

Son güncelleme: 2026-06-01
