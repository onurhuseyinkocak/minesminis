'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FaqItem {
  q: string
  a: ReactNode
  cat: 'baslangic' | 'kullanim' | 'pedagoji' | 'guvenlik' | 'teknik' | 'aile' | 'ogretmen'
}

const categoryLabels: Record<FaqItem['cat'], string> = {
  baslangic: 'Başlangıç',
  kullanim: 'Kullanım',
  pedagoji: 'Pedagoji',
  guvenlik: 'Güvenlik',
  teknik: 'Teknik',
  aile: 'Aileler İçin',
  ogretmen: 'Öğretmenler İçin',
}

const items: FaqItem[] = [
  { cat: 'baslangic', q: 'minesminis ne için kuruldu?', a: 'Türkiye\'de yabancı dil eğitimi sınıf büyüklüğü, materyal kıtlığı ve evdeki destek farkı nedeniyle her çocuğa eşit ulaşmıyor. minesminis, özel kursa veya yurtdışı kaynaklara erişimi olmayan ailelerin çocuklarına kaliteli İngilizce kaynak sunmak için kuruldu.' },
  { cat: 'baslangic', q: 'Gerçekten ücretsiz mi? Sürpriz bir ücret çıkar mı?', a: 'Evet, tamamen ücretsiz. Kayıt, ödeme, abonelik veya gizli ek paket yok. Platformu sürdürülebilir tutmak için ileride sayfalarda Google AdSense bağlamsal reklamı görebilirsiniz; ama bu çocuğa kişiselleştirilmiş hedefleme yapmaz.' },
  { cat: 'baslangic', q: 'Çocuğum kaç yaşından itibaren kullanabilir?', a: 'İçeriklerin çoğunluğu 4-12 yaş aralığına yöneliktir. 4-6 yaş için kısa renk, sayı, hayvan temalı sunumlar; 7-9 yaş için Maarif Modeli 2-3.sınıf uyumlu konular; 10-12 yaş için CEFR A1 sonu / A2 başı kelime ve günlük diyalog egzersizleri öne çıkar.' },
  { cat: 'baslangic', q: 'Hesap açmak gerekir mi?', a: 'Hayır. Platforma direkt anasayfadan girebilirsiniz; sunumlar, videolar, şarkılar ve çalışma kâğıtları kayıtsız erişilebilir. Çocuk gizliliği için kayıt sistemini bilinçli olarak yapmadık.' },

  { cat: 'kullanim', q: 'Günde ne kadar süre kullanmak ideal?', a: '4-6 yaş için günde 15-20 dakika, 7-9 yaş için 20-30 dakika, 10-12 yaş için 30-45 dakika yeterli. Dil ediniminde "az ve düzenli" daima "uzun ama nadiren"den daha etkili.' },
  { cat: 'kullanim', q: 'Hangi sırayla başlamalı?', a: (<>Yeni başlayan çocuk için önerimiz: (1) renk + sayı + hayvan temalı sunumlardan başla, (2) aynı temadaki şarkıyla pekiştir, (3) çalışma kâğıdı ile elle yazarak tekrarla. Ayrıntı için <Link href="/curriculum" style={{ color: 'var(--accent)' }}>müfredat yol haritası</Link> sayfamıza göz atabilirsiniz.</>) },
  { cat: 'kullanim', q: 'Sunumlardan, videolardan, şarkılardan hangisi en etkili?', a: 'Hepsi farklı bir öğrenme kanalını besler. Sunum görsel + kelime; video bağlam + hareket; şarkı ritim + hafıza; çalışma kâğıdı elle yazma + pekiştirme. Aynı temanın dört biçiminden geçen çocuk, sadece tek biçimde gören çocuğa göre ortalama %40 daha çok kelime hatırlar.' },
  { cat: 'kullanim', q: 'Çalışma kâğıtlarını yazdırmam şart mı?', a: 'Hayır. Tablette/bilgisayarda ekran üzerinden doldurabilirsiniz. Ama elle yazmak, çocukların kelime ve harf hatırlamasını anlamlı biçimde artırır. Mümkünse yazıcıdan çıkartmanızı öneriyoruz.' },

  { cat: 'pedagoji', q: 'Türk çocuğu kaç yaşında İngilizce öğrenmeye başlamalı?', a: 'Dil edinim araştırmaları, "ne kadar erken o kadar iyi" mitini kısmen doğrular. Beyin esnekliği 7 yaş öncesi en yüksek; ama 4 yaş öncesi yoğun dil maruziyeti, ana dili (Türkçe) gelişimini geciktirebilir. Önerimiz: anaokulu (4-5 yaş) seviyesinde haftada 2-3 kez 15 dakikalık "oyun-temelli" maruziyet.' },
  { cat: 'pedagoji', q: 'Çocuğum "anlamıyorum" diyor — vazgeçmesi normal mi?', a: 'Çok yaygın bir durumdur. Çocuk genellikle "anlamıyorum" derken aslında "kelimenin Türkçe karşılığını söyle" demek ister. İpucu: ilk haftalarda her İngilizce kelimenin Türkçe karşılığını söylemek yerine, görselle gösterin, mimik yapın. Çocuk doğrudan kelimeyle nesneyi eşleştirmeyi öğrenir.' },
  { cat: 'pedagoji', q: 'Telaffuz konusunda çocuğum hatalı söylüyor — düzeltsek mi?', a: 'Erken yaşta sürekli "doğrusunu söyle" şeklinde düzeltme, çocukta dil korkusu yaratır. Bunun yerine "düzeltici tekrar" tekniği önerilir: çocuk "dog" yerine "tog" derse, siz "Yes, the dog!" diyerek doğrusunu modelleyin.' },
  { cat: 'pedagoji', q: 'Phonics nedir, neden önemli?', a: 'Phonics, harf-ses ilişkisi öğretim yöntemidir. İngilizcenin telaffuz mantığı Türkçe gibi düzenli değildir, ama Phonics 26 harfin temel ses örüntülerini öğretir. Çocuk yeni bir kelime gördüğünde tahminle doğru okuyabilir hâle gelir.' },

  { cat: 'guvenlik', q: 'Reklamlar çocuğum için güvenli mi?', a: 'Şu anda site reklam göstermiyor. Onay aşamasında AdSense\'i kapattık. Onay geldiğinde aktif olacak reklamlar: (1) yalnızca bağlamsal, (2) çocuk-yönlendirmeli treatment ile filtrelenmiş, (3) kişiselleştirilmiş hedefleme YAPMAZ.' },
  { cat: 'guvenlik', q: 'Çocuğumun kişisel verileri toplanıyor mu?', a: 'Hayır. Ad, e-posta, doğum tarihi gibi hiçbir kişisel veri toplanmaz. Sadece sunucu güvenliği için 30 gün süreyle anonim teknik loglar tutulur.' },
  { cat: 'guvenlik', q: 'YouTube videolarına güveniyor musunuz?', a: 'Videolar YouTube\'un restricted mode\'unda gömülü olarak sunulur — bu mod uygunsuz içeriği gizler. Ek olarak yayınladığımız her video manuel olarak izlenip onaylanır.' },
  { cat: 'guvenlik', q: 'Çocuğum yanlışlıkla yetişkin içeriğine maruz kalabilir mi?', a: 'Restricted mode + manuel inceleme + bağlamsal reklam filtresi ile risk minimumda. Yine de internet %100 garanti vermez. Bu yüzden 10 yaş altı çocukların yetişkin gözetimi altında kullanmasını öneriyoruz.' },

  { cat: 'teknik', q: 'Hangi cihazlarda çalışıyor?', a: 'Modern tarayıcı çalıştıran her cihaz. Chrome, Safari, Firefox, Edge\'in son sürümleri; iPad, iPhone, Android tablet, Mac, Windows PC.' },
  { cat: 'teknik', q: 'Çevrim dışı kullanılabilir mi?', a: 'Şu anda hayır. Sayfaları açtıktan sonra sınırlı çevrim dışı kullanım PWA özelliğiyle desteklenir ama içerikler (özellikle videolar) bağlantı gerektirir. Çalışma kâğıtlarını yazdırmak önerilir.' },
  { cat: 'teknik', q: 'Site açılmıyor / sayfa boş geliyor, ne yapmalıyım?', a: (<>Önce tarayıcınızı yenileyin (Ctrl+Shift+R / Cmd+Shift+R). Sonra tarayıcı önbelleğini temizleyin. Çözülmezse <Link href="/contact" style={{ color: 'var(--accent)' }}>iletişim</Link> sayfasından bize hangi cihaz/tarayıcıyla giriş yaptığınızı yazın.</>) },

  { cat: 'aile', q: 'Çocuğumla birlikte mi kullanmam gerek?', a: '10 yaş altı çocukların yetişkin gözetiminde kullanmasını öneriyoruz. 10 yaş üstü çocuk ise sınırlı bir ekran süresi planı dahilinde kendi başına da kullanabilir.' },
  { cat: 'aile', q: 'İngilizce bilmiyorum — yardımcı olabilir miyim?', a: 'Kesinlikle evet. Dil edinim araştırmalarında en kritik faktör ailenin İngilizce seviyesi değil, gösterdiği ilgi ve sabırdır. Çocuğunuzla birlikte sunumdan geçerken siz de bilmediğiniz kelimeleri sesli söyleyin.' },
  { cat: 'aile', q: 'Çocuğum İngilizce yerine Türkçe sözcükle cevaplıyor — sorun mu?', a: 'Hiç değil. Dil edinim araştırmaları bunu "kod karıştırma" (code-switching) olarak tanımlar ve normaldir. Çocuk önce kavramı Türkçe ifade eder, sonra İngilizce kelimeye geçer.' },

  { cat: 'ogretmen', q: 'Sınıfımda kullanabilir miyim?', a: 'Evet, ücretsiz olarak. Sunumları akıllı tahtada açabilirsiniz; çalışma kâğıtlarını yazdırıp dağıtabilirsiniz; videoları sınıfta birlikte izleyebilirsiniz.' },
  { cat: 'ogretmen', q: 'Bir konuyu kaç ders saatinde işlerim?', a: 'Tek bir tema (örn. "Renkler") için tipik plan: 1.ders sunum + söz, 2.ders şarkı + hareket, 3.ders çalışma kâğıdı + tekrar. Toplam 3 ders saati.' },
  { cat: 'ogretmen', q: 'Maarif Modeli ile uyumlu mu?', a: (<>Evet. Şu an yayınlanan içerikler özellikle MEB 2-3-4.sınıf İngilizce dersi kazanımlarıyla hizalıdır. Yeni içerikler eklendikçe müfredat haritasını <Link href="/curriculum" style={{ color: 'var(--accent)' }}>müfredat sayfasında</Link> güncelleriz.</>) },
  { cat: 'ogretmen', q: 'Bir tema için pilot öğrenci olabilir miyim?', a: 'Çok memnun oluruz! info@minesminis.com adresinden yazın. Sınıf-içi test geri bildirimi bizim için en değerli kaynak.' },
]

const categories: FaqItem['cat'][] = ['baslangic', 'kullanim', 'pedagoji', 'guvenlik', 'teknik', 'aile', 'ogretmen']

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: 'var(--ink)', textAlign: 'left', cursor: 'pointer' }}
      >
        <span style={{ flex: 1 }}>{item.q}</span>
        <ChevronDown
          size={18}
          style={{ color: 'var(--ink-3)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>{item.a}</div>
      )}
    </div>
  )
}

export default function FaqContent() {
  const [activeCat, setActiveCat] = useState<FaqItem['cat'] | 'all'>('all')
  const filtered = activeCat === 'all' ? items : items.filter((i) => i.cat === activeCat)

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof it.a === 'string' ? it.a : it.q,
      },
    })),
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <h1 className="mm-page-title">Sıkça Sorulan Sorular</h1>
      <p className="mm-page-sub" style={{ marginBottom: 20 }}>Aileler ve öğretmenlerin en çok sorduğu sorulara kapsamlı yanıtlar.</p>

      <div style={{ background: 'linear-gradient(135deg, #F3F0FF 0%, #E8EDFF 100%)', borderRadius: 18, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <HelpCircle size={28} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Sorduğunuz soru burada yoksa <Link href="/contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>iletişim</Link> sayfasından yazabilirsiniz.
        </p>
      </div>

      <div className="mm-chips" style={{ marginBottom: 16 }}>
        <button className={`mm-chip${activeCat === 'all' ? ' active' : ''}`} onClick={() => setActiveCat('all')} aria-pressed={activeCat === 'all'}>
          Tümü ({items.length})
        </button>
        {categories.map((c) => {
          const count = items.filter((i) => i.cat === c).length
          return (
            <button
              key={c}
              className={`mm-chip${activeCat === c ? ' active' : ''}`}
              onClick={() => setActiveCat(c)}
              aria-pressed={activeCat === c}
            >
              {categoryLabels[c]} ({count})
            </button>
          )
        })}
      </div>

      <div>
        {filtered.map((item, i) => (
          <FaqRow key={`${item.cat}-${i}`} item={item} />
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 22, borderRadius: 18, background: '#FFF4DC', borderLeft: '4px solid #D69E2E' }}>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <strong>Not:</strong> Bu sayfadaki yanıtlar, dil edinim araştırmaları (Krashen, Cummins, VanPatten), Türkiye'deki sınıf-içi öğretmen deneyimi ve aile geri bildirimleri temel alınarak hazırlanmıştır.
        </p>
      </div>
    </div>
  )
}
