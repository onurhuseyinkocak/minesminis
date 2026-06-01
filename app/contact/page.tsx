import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle, Bug, Lightbulb, BookOpen, GraduationCap, Heart, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İletişim — Öneri, Geri Bildirim, İşbirliği',
  description:
    'minesminis ile iletişime geçin. İçerik önerisi, hata bildirimi, öğretmen işbirliği, aile geri bildirimi ve diğer konular için 7 iş günü içinde dönüş yapıyoruz.',
  alternates: { canonical: 'https://minesminis.com/contact' },
  openGraph: {
    type: 'website',
    title: 'minesminis İletişim',
    description: 'İçerik önerisi, hata bildirimi ve öğretmen işbirliği için bize ulaşın.',
    url: 'https://minesminis.com/contact',
  },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'minesminis İletişim',
  inLanguage: 'tr',
  url: 'https://minesminis.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'minesminis',
    url: 'https://minesminis.com',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'info@minesminis.com',
        availableLanguage: ['Turkish', 'English'],
        areaServed: 'TR',
      },
    ],
  },
}
const contactBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
    { '@type': 'ListItem', position: 2, name: 'İletişim', item: 'https://minesminis.com/contact' },
  ],
}

const reasons = [
  { icon: Lightbulb, title: 'İçerik Önerisi', desc: 'Çocuğunuzun veya öğrencilerinizin ihtiyaç duyduğu bir konu var mı? "Halloween sözlüğü", "Anaokulu için sayılar" gibi temalar için öneri yazın. Her öneri ekipte değerlendirilir.', cta: 'Öneri gönder', subject: 'Icerik Onerisi', color: '#F3F0FF', iconColor: 'var(--accent)' },
  { icon: Bug, title: 'Hata Bildirimi', desc: 'Bir sunum açılmıyor mu? Video oynatma hatası mı var? Yazım yanlışı mı fark ettiniz? Hatayı detaylı şekilde bize bildirirseniz hızlıca düzeltiriz.', cta: 'Hata bildir', subject: 'Hata Bildirimi', color: '#FFE4DC', iconColor: 'var(--primary)' },
  { icon: GraduationCap, title: 'Öğretmen İşbirliği', desc: 'Sınıfınızda minesminis kullanıyorsanız geri bildirimleriniz çok değerli. Pilot test, içerik geliştirme veya öğretmen rehberi kategorisinde işbirliği için iletişime geçin.', cta: 'İşbirliği yaz', subject: 'Ogretmen Isbirligi', color: '#E5F6EC', iconColor: 'var(--green)' },
  { icon: Heart, title: 'Aile Geri Bildirimi', desc: 'Çocuğunuzla birlikte kullanma deneyiminiz nasıl? Hangi içerik en çok ilgi çekti? Neyi geliştirsek faydası dokunur? Aile perspektifi bizim için altın değerinde.', cta: 'Geri bildirim', subject: 'Aile Geri Bildirimi', color: '#FFF4DC', iconColor: '#D69E2E' },
  { icon: BookOpen, title: 'Telif Hakkı / DMCA', desc: 'Bir içeriğin kaldırılması, telif hakkı bildirimi veya fikri mülkiyet konuları için. Kaldırma taleplerine 7 iş günü içinde dönüş yapıyoruz.', cta: 'Yasal bildirim', subject: 'DMCA - Telif Hakki Bildirimi', color: '#FFEDED', iconColor: '#D64545' },
  { icon: MessageCircle, title: 'Basın / Medya', desc: 'minesminis hakkında haber, röportaj veya tanıtım için. Basın kiti ve logo materyallerini paylaşabiliriz.', cta: 'Basın bağlantısı', subject: 'Basin / Medya', color: '#E8EDFF', iconColor: 'var(--accent)' },
]

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactBreadcrumb) }} />
      <h1 className="mm-page-title">İletişim</h1>
      <p className="mm-page-sub" style={{ marginBottom: 24 }}>Geri bildirim, soru, işbirliği — bizi şaşırtın.</p>

      <div style={{ background: 'linear-gradient(135deg, #F3F0FF 0%, #FFE4DC 100%)', borderRadius: 24, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Mail size={26} />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 4px', color: 'var(--ink)' }}>info@minesminis.com</h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            Tek e-posta adresi, tek pencere. Aşağıdaki konulardan biriyle ilgili yazıyorsanız konuya göre konu satırı seçerseniz daha hızlı dönüş alırsınız.
          </p>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', margin: '0 0 14px' }}>Bize ne için yazıyorsunuz?</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 24 }}>
        {reasons.map((r) => (
          <div key={r.title} style={{ background: 'white', borderRadius: 18, padding: 20, border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.iconColor }}>
              <r.icon size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 4px', color: 'var(--ink)' }}>{r.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{r.desc}</p>
            </div>
            <a
              href={`mailto:info@minesminis.com?subject=${encodeURIComponent(r.subject)}`}
              style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: r.iconColor, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
            >
              {r.cta} →
            </a>
          </div>
        ))}
      </div>

      <article style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>İletişim Hakkında Bilmek Faydalı Olanlar</h2>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)', marginTop: 16 }}>Yanıt süresi</h3>
        <p>E-postalara genellikle <strong>1-3 iş günü</strong> içinde dönüş yapıyoruz. Hafta sonu ve resmi tatillerde yanıt gecikebilir. Yasal konular ve telif hakkı bildirimleri için yanıt süresi 7 iş gününe kadar uzayabilir.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>İletişim öncesi sıkça sorulan sorular</h3>
        <p>
          Yazmadan önce <Link href="/faq" style={{ color: 'var(--accent)' }}>SSS</Link>, <Link href="/blog" style={{ color: 'var(--accent)' }}>blog</Link> ve <Link href="/about" style={{ color: 'var(--accent)' }}>hakkımızda</Link> sayfalarına göz atmanızı öneririz. Pek çok yaygın sorunun cevabı oralarda bulunuyor.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Çocuğunuzla ilgili özel veri talebi</h3>
        <p>
          KVKK ve COPPA gereği, çocuğunuzun siteyi ziyaretine ait teknik kayıtları (IP, ziyaret zamanı) silinme talebinde bulunabilirsiniz. Talep e-postanızda <em>"Veri silme talebi"</em> ifadesini kullanmanız işlemi hızlandırır. Detay için <Link href="/privacy" style={{ color: 'var(--accent)' }}>Gizlilik Politikası</Link>.
        </p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Hata bildirimi yazarken</h3>
        <p>Hata bildirimi en hızlı şu bilgilerle çözülür:</p>
        <ul>
          <li>Hangi sayfada gördünüz? (örn. <code>/slides/abc-123</code>)</li>
          <li>Hangi cihaz / tarayıcı? (örn. iPhone Safari, Windows Chrome)</li>
          <li>Hata mesajının ekran görüntüsü (varsa)</li>
          <li>Ne yaparken karşılaştınız? (sayfa açılınca / butona basınca / video oynayınca)</li>
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>İçerik önerisi yazarken</h3>
        <p>Yeni içerik önerisi yazarken aşağıdaki bilgileri eklerseniz öneri çok daha hızlı değerlendirilir:</p>
        <ul>
          <li>Hangi tema? (örn. "Halloween sözlüğü", "okul nesneleri")</li>
          <li>Hangi format? (sunum, video, şarkı, çalışma kâğıdı)</li>
          <li>Hangi yaş grubu? (4-6, 7-9, 10-12)</li>
          <li>Hangi sınıf seviyesi? (anaokulu, 1.sınıf, 2.sınıf...)</li>
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Telefon ya da sohbet?</h3>
        <p>Şu anda telefon veya canlı sohbet desteğimiz yoktur. Tüm iletişim e-posta üzerinden yürür.</p>

        <div style={{ marginTop: 20, padding: 16, borderRadius: 14, background: '#FFF8E7', borderLeft: '4px solid #D69E2E', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Clock size={18} style={{ color: '#D69E2E', flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            <strong>Acil bir durum mu var?</strong> Çocuğunuzun internet güvenliğiyle ilgili acil bir endişeniz varsa, lütfen yerel emniyet birimlerine veya 155 Polis İmdat hattına başvurun. minesminis platformu bir acil yardım hizmeti değildir.
          </p>
        </div>
      </article>
    </div>
  )
}
