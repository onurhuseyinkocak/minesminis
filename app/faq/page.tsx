import type { Metadata } from 'next'
import FaqContent from './FaqContent'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular — İngilizce Öğrenme Kaynakları',
  description:
    'Çocuklara İngilizce öğretmek, minesminis platformunu kullanmak, çocuk gizliliği ve eğitim metodolojisi hakkında 25+ ailenin merak ettiği soruya kapsamlı yanıtlar.',
  alternates: { canonical: 'https://minesminis.com/faq' },
}

const faqEntries = [
  { q: 'minesminis ne için kuruldu?', a: 'Türkiye\'de yabancı dil eğitimi sınıf büyüklüğü, materyal kıtlığı ve evdeki destek farkı nedeniyle her çocuğa eşit ulaşmıyor. minesminis, özel kursa veya yurtdışı kaynaklara erişimi olmayan ailelerin çocuklarına kaliteli İngilizce kaynak sunmak için kuruldu.' },
  { q: 'Gerçekten ücretsiz mi? Sürpriz bir ücret çıkar mı?', a: 'Evet, tamamen ücretsiz. Kayıt, ödeme, abonelik veya gizli ek paket yok. Platformu sürdürülebilir tutmak için ileride sayfalarda Google AdSense bağlamsal reklamı görebilirsiniz; ama bu çocuğa kişiselleştirilmiş hedefleme yapmaz.' },
  { q: 'Çocuğum kaç yaşından itibaren kullanabilir?', a: 'İçeriklerin çoğunluğu 4-12 yaş aralığına yöneliktir. 4-6 yaş için renk, sayı, hayvan temalı sunumlar; 7-9 yaş için Maarif modeli 2-3. sınıf uyumlu konular; 10-12 yaş için CEFR A1 sonu / A2 başı kelime ve diyalog egzersizleri öne çıkar.' },
  { q: 'Hesap açmak gerekir mi?', a: 'Hayır. Platforma direkt anasayfadan girebilirsiniz. Sunumlar, videolar, şarkılar ve çalışma kâğıtları kayıtsız erişilebilir. Çocuk gizliliği için kayıt sistemini bilinçli olarak yapmadık.' },
  { q: 'Günde ne kadar süre kullanmak ideal?', a: '4-6 yaş için günde 15-20 dakika, 7-9 yaş için 20-30 dakika, 10-12 yaş için 30-45 dakika yeterli. Dil ediniminde "az ve düzenli" daima "uzun ama nadiren"den daha etkili.' },
  { q: 'Hangi sırayla başlamalı?', a: 'Yeni başlayan çocuk için önerimiz: önce renk + sayı + hayvan temalı sunumlardan başla, aynı temadaki şarkıyla pekiştir, çalışma kâğıdı ile elle yazarak tekrarla. Detay için müfredat yol haritası sayfası önerilir.' },
  { q: 'Sunumlardan, videolardan, şarkılardan hangisi en etkili?', a: 'Hepsi farklı bir öğrenme kanalını besler. Sunum görsel + kelime; video bağlam + hareket; şarkı ritim + hafıza; çalışma kâğıdı elle yazma + pekiştirme. Aynı temanın dört biçiminden geçen çocuk %40 daha çok kelime hatırlar.' },
  { q: 'Türk çocuğu kaç yaşında İngilizce öğrenmeye başlamalı?', a: 'Beyin esnekliği 7 yaş öncesi en yüksektir; ama 4 yaş öncesi yoğun dil maruziyeti ana dili (Türkçe) gelişimini geciktirebilir. Önerimiz: anaokulu (4-5 yaş) seviyesinde haftada 2-3 kez 15 dakikalık oyun-temelli maruziyet.' },
  { q: 'Çocuğum "anlamıyorum" diyor — vazgeçmesi normal mi?', a: 'Çok yaygındır. Çocuk genellikle "anlamıyorum" derken aslında "kelimenin Türkçe karşılığını söyle" demek ister. İpucu: ilk haftalarda her İngilizce kelimenin Türkçe karşılığını söylemek yerine görselle gösterin. Çocuk doğrudan kelimeyle nesneyi eşleştirmeyi öğrenir.' },
  { q: 'Telaffuz hatasını düzeltmeli miyim?', a: 'Erken yaşta sürekli düzeltme dil korkusu yaratır. Bunun yerine "düzeltici tekrar" tekniği önerilir: çocuk "dog" yerine "tog" derse, siz "Yes, the dog!" diyerek doğrusunu modelleyin.' },
  { q: 'Phonics nedir, neden önemli?', a: 'Phonics, harf-ses ilişkisi öğretim yöntemidir. İngilizcenin telaffuz mantığı Türkçe gibi düzenli değildir; Phonics 26 harfin ses örüntülerini öğretir, çocuk yeni kelimeyi doğru okuyabilir hale gelir.' },
  { q: 'Reklamlar çocuğum için güvenli mi?', a: 'Tüm reklamlar Google AdSense "Tag for Child-Directed Treatment" (TFAT) ve "Tag for Under Age of Consent" (TFUA) etiketleriyle yayınlanır. Davranışsal hedefleme kapalıdır.' },
  { q: 'Çocuğumun kişisel verileri toplanıyor mu?', a: 'Hayır. Ad, e-posta, doğum tarihi gibi hiçbir kişisel veri toplanmaz. Sadece sunucu güvenliği için 30 gün süreyle anonim teknik loglar tutulur.' },
  { q: 'YouTube videolarına güveniyor musunuz?', a: 'Videolar YouTube\'un restricted mode\'unda gömülü olarak sunulur. Ek olarak yayınladığımız her video manuel olarak izlenip onaylanır.' },
  { q: 'Hangi cihazlarda çalışıyor?', a: 'Modern tarayıcı çalıştıran her cihaz: Chrome, Safari, Firefox, Edge son sürümleri. iPad, iPhone, Android tablet, Mac, Windows PC.' },
  { q: 'İngilizce bilmiyorum — yardımcı olabilir miyim?', a: 'Kesinlikle evet. En kritik faktör ailenin İngilizce seviyesi değil, gösterdiği ilgi ve sabırdır. Çocuğunuzla birlikte sunumdan geçerken siz de bilmediğiniz kelimeleri sesli söyleyin.' },
  { q: 'Çocuğum İngilizce yerine Türkçe sözcükle cevaplıyor — sorun mu?', a: 'Hiç değil. "Kod karıştırma" (code-switching) olarak tanımlanır ve normaldir. Çocuk önce kavramı Türkçe ifade eder, sonra İngilizce kelimeye geçer.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.mm-faq-q', '.mm-faq-a'],
  },
  mainEntity: faqEntries.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FaqContent />
    </>
  )
}
