import type { Metadata } from 'next'
import Link from 'next/link'
import { Presentation, Video, Music, BookOpen, Users, Heart, Sparkles, Target, Award, ShieldCheck } from 'lucide-react'
import { supabase } from '../../src/lib/supabase'

export const metadata: Metadata = {
  title: 'Hakkımızda — Çocuklar İçin İngilizce Öğrenme Platformu',
  description:
    'minesminis nedir, neden kurulduk, hangi pedagojik yaklaşımı benimsiyoruz? Çocuklara İngilizce öğretiminde deneyim, CEFR A1 hizalı içerik, COPPA uyumlu güvenli platform.',
  alternates: { canonical: 'https://minesminis.com/about' },
}

// ISR — refresh counts every 10 minutes
export const revalidate = 600

const values = [
  { icon: BookOpen, title: 'Tamamen Ücretsiz Eğitim', desc: 'Tüm içeriklerimiz kayıt, ödeme veya abonelik istemeden ücretsiz olarak sunulur. Hiçbir aileyi geride bırakmamayı taahhüt ediyoruz.' },
  { icon: Users, title: 'Çocuğa Özel Tasarım', desc: '4-12 yaş aralığındaki çocuklar için gelişim psikolojisi ve dil edinim araştırmaları temel alınarak hazırlanmış güvenli içerik.' },
  { icon: Heart, title: 'Oyunla Öğrenme', desc: 'Çocukların doğal merakını besleyen interaktif sunumlar, görsel anlatım, ezgili şarkılar ve uygulamalı çalışma kâğıtları.' },
  { icon: Target, title: 'CEFR A1 Hizalı Müfredat', desc: 'Avrupa Ortak Dil Çerçevesi (CEFR) A1 seviyesi ile uyumlu kelime ve dilbilgisi yapıları. Türkiye Maarif Modeli ile paralel.' },
  { icon: ShieldCheck, title: 'COPPA & KVKK Uyumlu', desc: 'Çocuk gizliliği için Children\'s Online Privacy Protection Act ve KVKK standartlarına uygun. Kişisel veri toplamayız.' },
  { icon: Award, title: 'Öğretmen Onaylı', desc: 'Aktif sınıf öğretmenleri tarafından gözden geçirilen, çocukla denenmiş, etkililiği gözlemlenmiş eğitim içeriği.' },
]

async function getCounts() {
  try {
    const [s, v, so, w] = await Promise.all([
      supabase.from('mm_slides').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_videos').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_songs').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('mm_worksheets').select('id', { count: 'exact', head: true }).eq('published', true),
    ])
    return { slides: s.count || 0, videos: v.count || 0, songs: so.count || 0, worksheets: w.count || 0 }
  } catch {
    return { slides: 0, videos: 0, songs: 0, worksheets: 0 }
  }
}

export default async function AboutPage() {
  const counts = await getCounts()
  const stats = [
    { icon: Presentation, label: 'Sunum seti', value: counts.slides },
    { icon: Video, label: 'Eğitici video', value: counts.videos },
    { icon: Music, label: 'İngilizce şarkı', value: counts.songs },
    { icon: BookOpen, label: 'Çalışma kâğıdı', value: counts.worksheets },
  ]
  const hasContent = counts.slides + counts.videos + counts.songs + counts.worksheets > 0

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 className="mm-page-title">Hakkımızda</h1>
      <p className="mm-page-sub" style={{ marginBottom: 24 }}>Çocuklara İngilizce öğretmek için, çocuk gibi düşünerek tasarlandı.</p>

      <article style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)', marginBottom: 20 }}>
        <h2 style={h2Style}>Bir cümlede minesminis</h2>
        <p>
          <strong>minesminis</strong>, 4-12 yaş Türk çocukları için tasarlanmış ücretsiz bir İngilizce öğrenme platformudur. Sunum, video, şarkı ve çalışma kâğıdı biçiminde yapılandırılmış öğretim materyallerini öğretmenlere ve ailelere kayıtsız, ödeme gerektirmeyen, çocuk dostu bir ortamda sunuyoruz.
        </p>

        <h2 style={h2Style}>Misyonumuz</h2>
        <p>
          Türkiye'de yabancı dil öğretimi, sınıf büyüklüğü, materyal kıtlığı ve evdeki destek farklılıkları nedeniyle her çocuğa eşit ulaşmıyor. Özel kursa ya da yurtdışı kaynaklara erişimi olmayan ailelerin çocukları, dil edinimi açısından eşitsiz bir başlangıç yapıyor. minesminis bu eşitsizliği daraltmak için kuruldu.
        </p>
        <p>
          Hedefimiz net: her ailenin, eğitim seviyesi ya da bütçesi ne olursa olsun, çocuğuna kaliteli İngilizce kaynaklara erişebilmesini sağlamak. Bunu yaparken çocuk gelişim psikolojisi ve dil edinim araştırmalarını öğretmen deneyimiyle birleştiriyoruz.
        </p>

        <h2 style={h2Style}>Pedagojik Yaklaşımımız</h2>
        <p>minesminis'in eğitim tasarımı üç ilke üzerine kurulu:</p>
        <p>
          <strong>1. Anlamlı bağlam.</strong> Çocuklar izole kelimeleri değil, hikâye, durum ve görsel bağlamı hatırlar. Her sunumumuz bir sahneyle açılır: "Maya kahvaltıda ne yiyor?", "Sınıfta hangi nesneler var?". Kelime listelerinden değil yaşayan örneklerden başlıyoruz.
        </p>
        <p>
          <strong>2. Çoklu temsil.</strong> Aynı kavram (örneğin "renkler") sunumda görsel olarak, videoda hareketle, şarkıda ezgiyle, çalışma kâğıdında elle yazarak öğretilir. Bu çoklu temsil, dilbilim araştırmalarında "dual coding" olarak geçer ve uzun süreli hatırlamayı artırır.
        </p>
        <p>
          <strong>3. Düşük baskı, yüksek tekrar.</strong> Sınav baskısı dil öğreniminin doğal düşmanıdır. Platformda not, puan veya not karnesi yoktur. Bunun yerine her temanın altı yapısı (sunum → video → şarkı → çalışma kâğıdı) ile aynı içerik dört farklı şekilde tekrar ediyor.
        </p>

        <h2 style={h2Style}>İçerik Kapsamımız</h2>
        <p>Şu anda platformumuzda CEFR A1 seviyesi ve Türkiye Maarif Modeli 2-4. sınıf İngilizce müfredatı ile hizalı konularda kaynaklar bulunmaktadır:</p>
        <ul>
          <li><strong>Greetings &amp; Introductions</strong> — Selamlaşma, kendini tanıtma</li>
          <li><strong>Family &amp; Friends</strong> — Aile üyeleri, arkadaş ilişkileri</li>
          <li><strong>Numbers, Colors, Shapes</strong> — Sayılar, renkler, şekiller</li>
          <li><strong>Animals &amp; Pets</strong> — Çiftlik, yaban ve evcil hayvanlar</li>
          <li><strong>Body Parts</strong> — Vücudun bölümleri, his ifadeleri</li>
          <li><strong>Food &amp; Drinks</strong> — Yiyecekler, içecekler, beslenme</li>
          <li><strong>My Classroom</strong> — Okul nesneleri, sınıf dili</li>
          <li><strong>Daily Routines</strong> — Günlük rutin, saat, gün</li>
          <li><strong>Weather &amp; Seasons</strong> — Hava, mevsim, doğa</li>
          <li><strong>Home &amp; Furniture</strong> — Ev, oda, mobilya</li>
          <li><strong>Clothes &amp; Weather Dressing</strong> — Giysi seçimi, mevsime göre giyinme</li>
          <li><strong>Hobbies &amp; Free Time</strong> — Hobi, boş zaman, "I like / I don't like"</li>
        </ul>
        <p>İçerik kütüphanesi, sahadan gelen öğretmen geri bildirimleri ve aile talepleri doğrultusunda her ay güncellenmektedir. Her yeni başlık, çocukla pilot test yapıldıktan sonra yayınlanır.</p>

        <h2 style={h2Style}>Çocuk Güvenliği</h2>
        <p>Platformumuz çocuk güvenliğini birinci öncelik olarak kabul eder:</p>
        <ul>
          <li>Kayıt zorunluluğu yok — çocukların kişisel bilgisi toplanmaz.</li>
          <li>Yorum sistemi yok — bilinmeyen yetişkinlerle iletişim olmaz.</li>
          <li>Video içeriklerimiz YouTube'un sınırlı modunda (restricted mode) sunulur.</li>
          <li>Reklam gösterimi onay sürecinde kapalıdır; aktif edildiğinde yalnızca bağlamsal, yaşa uygun ve kişiselleştirilmemiş reklam istekleri kullanılır.</li>
          <li>COPPA (Children's Online Privacy Protection Act) ve KVKK gereklilikleriyle uyumluyuz.</li>
        </ul>
        <p>Daha ayrıntılı bilgi için <Link href="/privacy" style={{ color: 'var(--accent)' }}>Gizlilik Politikası</Link> sayfamızı inceleyebilirsiniz.</p>

        <h2 style={h2Style}>Kim Hazırlıyor?</h2>
        <p>
          minesminis, Türkiye'de İngilizce öğretmeni olarak çalışan ve farklı sosyoekonomik bölgelerde sınıf deneyimi olan bir öğretmenin kişisel çabasıyla başladı. İçerik üretimi, sınıf testi ve aile geri bildirimi döngüsüyle gelişiyor. Şu anda kullanıcı sayısı arttıkça gönüllü editörlerle çalışıyoruz; çocukla denenmemiş hiçbir materyal yayınlanmıyor.
        </p>
        <p>
          Yayınladığımız her tema şu süreçten geçer: (1) müfredat hizalama, (2) görsel/ses tasarımı, (3) sınıfta veya evde pilot, (4) öğretmen+aile geri bildirimi, (5) düzeltme, (6) yayın. Bu döngü ortalama 7-10 gün sürer.
        </p>

        <h2 style={h2Style}>Vizyonumuz</h2>
        <p>
          minesminis'in uzun vadeli vizyonu, Türk çocuklarının yabancı dil edinim deneyimini "korkulan ders"ten "günün en sevdiği etkinliği"ne dönüştürmektir. Bunu başardığımızda — ki pek çok ailede çoktan yaşandı — çocuklar İngilizce'yi sınav değil pencere olarak görmeye başlar. Hedefimiz, önümüzdeki üç yıl içinde 500.000 Türk çocuğa, en az 10 farklı temada nitelikli İngilizce kaynak ulaştırmak.
        </p>
      </article>

      {hasContent && (
        <div className="mm-grid-3" style={{ gap: 14, marginBottom: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: 18, padding: 20, border: '1px solid var(--line)', textAlign: 'center' }}>
              <s.icon size={28} style={{ color: 'var(--primary)', marginBottom: 8 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--ink)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 12 }}>Değerlerimiz</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {values.map((v) => (
          <div
            key={v.title}
            style={{ background: 'white', borderRadius: 18, padding: 20, border: '1px solid var(--line)', display: 'flex', gap: 16, alignItems: 'flex-start' }}
          >
            <div
              style={{
                width: 48, height: 48, borderRadius: 14, background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0,
              }}
            >
              <v.icon size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 4px', color: 'var(--ink)' }}>{v.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 24, borderRadius: 20, background: 'linear-gradient(135deg, #F3F0FF 0%, #E8EDFF 100%)', textAlign: 'center' }}>
        <Sparkles size={28} style={{ color: 'var(--primary)', marginBottom: 8 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 8px', color: 'var(--ink)' }}>Başlamaya hazır mısınız?</h3>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--ink-2)', maxWidth: 480, lineHeight: 1.6, marginLeft: 'auto', marginRight: 'auto' }}>
          Kayıt gerekmiyor. Çocuğunuzla birlikte sunumlardan, videolardan veya şarkılardan başlayabilirsiniz.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/slides" className="mm-btn primary" style={{ textDecoration: 'none' }}>Sunumlara Git</Link>
          <Link href="/blog" className="mm-btn" style={{ textDecoration: 'none' }}>Blog Yazıları</Link>
        </div>
      </div>
    </div>
  )
}

const h2Style = {
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  color: 'var(--ink)',
  marginTop: 16,
}
