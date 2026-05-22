import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'

export default function Privacy() {
  useMeta({
    title: 'Gizlilik Politikası — minesminis | COPPA & KVKK Uyumlu',
    description: 'minesminis çocuk gizliliğini birinci öncelik kabul eder. COPPA ve KVKK uyumlu veri politikası, çerez kullanımı, üçüncü taraf hizmetler ve aile hakları hakkında ayrıntılı bilgi.',
    url: 'https://minesminis.com/privacy',
  })

  const lastUpdated = '23 Mayıs 2026'

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 className="mm-page-title">Gizlilik Politikası</h1>
      <p className="mm-page-sub" style={{ marginBottom: 24 }}>Son güncelleme: {lastUpdated}</p>

      <article style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
        <p>
          minesminis ("biz", "minesminis", "platform"), 4-12 yaş çocuklar için tasarlanmış ücretsiz bir İngilizce öğrenme platformudur. Çocukların güvenliği bizim için bir slogan değil, mimari bir karardır: <strong>varsayılan olarak hiçbir kişisel veri toplamayız</strong>. Aşağıdaki bölümlerde hangi verilerin toplanıp toplanmadığını, üçüncü taraflarla ne paylaşıldığını ve ailelerin hangi haklara sahip olduğunu ayrıntılı şekilde açıklıyoruz.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>1. Hangi Bilgileri Topluyoruz?</h2>
        <p>
          minesminis hizmetlerini kullanmak için <strong>hesap açmanız, e-posta girmeniz ya da kimliğinizi doğrulamanız gerekmez</strong>. Platform tamamen anonim kullanılabilir. Bu kararı bilinçli olarak verdik: çocuk gizliliği açısından en güvenli yaklaşım, baştan veri toplamamaktır.
        </p>
        <p>
          <strong>Toplanmayan veriler:</strong>
        </p>
        <ul>
          <li>İsim, soyisim, doğum tarihi</li>
          <li>E-posta adresi, telefon numarası</li>
          <li>Adres, konum, ülke (IP üzerinden hassas konum çıkarımı yapılmaz)</li>
          <li>Sosyal medya hesapları, profil bilgileri</li>
          <li>Çocuğa ait herhangi bir biyometrik, sağlık veya kimlik bilgisi</li>
          <li>Çocuğun ekran kaydı, fotoğrafı ya da ses kaydı</li>
        </ul>
        <p>
          <strong>Otomatik olarak işlenen sınırlı veriler:</strong> Web sitemiz, tüm web siteleri gibi, sunucu günlüklerinde teknik bilgiler tutar — IP adresi, tarayıcı türü, ziyaret edilen sayfa, ziyaret zamanı. Bu veriler sadece teknik istikrar (DDoS koruması, hata ayıklama) için kullanılır ve 30 gün sonra silinir.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>2. Çerezler (Cookies)</h2>
        <p>
          Çerez kullanımımız üç sınırlı kategoriyle sınırlıdır:
        </p>
        <ul>
          <li><strong>Zorunlu çerezler:</strong> Site teknik olarak işlevsel olsun diye. Örneğin sunucu yük dengelemesi.</li>
          <li><strong>Analitik çerezler:</strong> Hangi içeriğin daha çok okunduğunu görmek için tamamen anonim, IP-anonimleştirilmiş analitik. Kişiyi tanımlamaz.</li>
          <li><strong>Reklam çerezleri:</strong> Google AdSense, çocuk yönlendirmeli içerik için yalnızca <em>bağlamsal</em> reklam sunar. <strong>Kişiselleştirilmiş reklam ve davranış izlemesi kapalıdır.</strong></li>
        </ul>
        <p>
          Tarayıcınızdan çerezleri istediğiniz zaman silebilirsiniz. Sitemiz çerezsiz de çalışır.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>3. COPPA Uyumu (ABD)</h2>
        <p>
          ABD'deki çocuk gizliliği kanunu olan Children's Online Privacy Protection Act (COPPA), 13 yaş altı çocuklardan veri toplama konusunda katı kurallar koyar. minesminis aşağıdaki şekilde uyumludur:
        </p>
        <ul>
          <li>13 yaş altı çocuklardan <strong>bilinçli olarak hiçbir kişisel veri toplamayız</strong>.</li>
          <li>Kayıt sistemi yok; çocuktan ad/e-posta/telefon istenmiyor.</li>
          <li>Yetişkinlerle iletişim kanalları (yorum, mesajlaşma, sohbet) yok.</li>
          <li>Google AdSense'e "tag for child-directed treatment" parametresiyle başvurulur; kişiselleştirilmiş reklam disabled.</li>
          <li>Üçüncü taraf platformlarda (YouTube embed) <em>restricted mode</em> kullanılır.</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>4. KVKK Uyumu (Türkiye)</h2>
        <p>
          6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) açısından minesminis'in veri sorumlusu sıfatı vardır. KVKK uyumumuz şu temellere dayanır:
        </p>
        <ul>
          <li>Açık rıza temelli işleme — fakat zaten kişisel veri toplanmadığı için "rıza" çoğunlukla devre dışıdır.</li>
          <li>Veri minimizasyonu — yalnızca teknik olarak zorunlu sunucu günlükleri (30 gün retention).</li>
          <li>Bilgi talep hakkı — kullanıcı, hakkında tutulan teknik kayıtlar hakkında bilgi talep edebilir (info@minesminis.com).</li>
          <li>Silme talep hakkı — IP'ye ait sunucu günlükleri silinme talebine uygundur.</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>5. Üçüncü Taraf Hizmetler</h2>
        <p>
          Platformumuz aşağıdaki üçüncü taraf hizmetlerini kullanır. Her birinin kendi gizlilik politikası vardır:
        </p>
        <ul>
          <li>
            <strong>Vercel (Hosting):</strong> Site barındırma. Vercel sunucu günlüklerinde IP adresi, request bilgisi tutar. Vercel'in kendi gizlilik politikası uygulanır.
          </li>
          <li>
            <strong>Supabase (Veritabanı):</strong> İçerik (sunum, video meta, blog) depolanır. Kullanıcı kişisel verisi içermez.
          </li>
          <li>
            <strong>Google AdSense:</strong> Bağlamsal reklam gösterimi. <em>Child-directed treatment</em> ile yapılandırılmıştır; davranışsal hedefleme yapılmaz. AdSense onayı sonrası aktif olacaktır.
          </li>
          <li>
            <strong>YouTube (Embed):</strong> Video oynatma. YouTube'un restricted mode (sınırlı mod) kullanılır. Video oynatıldığında YouTube'un kendi gizlilik politikası geçerli olur — bu nedenle aileler için <em>"Videoları evde gözetimle izlettirin"</em> notunu ekliyoruz.
          </li>
          <li>
            <strong>Google Fonts:</strong> Yazı tipi yükleme. Google'ın IP loglama politikası uygulanır.
          </li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>6. Çocuğunuzla Birlikte Kullanım</h2>
        <p>
          Çocuk gizliliği teknik koruma kadar gözetim ile sağlanır. Önerilerimiz:
        </p>
        <ul>
          <li>10 yaş altı çocukların platformu yetişkin gözetiminde kullanması.</li>
          <li>YouTube embed'lerinde "videoyu YouTube'da aç" linkine tıklatmama (uygulamada bu linki kaldırdık).</li>
          <li>Reklamlara dikkat — bağlamsal olarak gösterilse de, çocuğa "reklam nedir, neden gösterilir" diye açıklayın.</li>
          <li>Çocuğun ekran süresini sınırlandırın — biz de günde 20-30 dakika tek seferlik kullanım öneriyoruz.</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>7. Veri Güvenliği</h2>
        <p>
          Toplanan sınırlı teknik veriler endüstri standardı korumalarla saklanır: HTTPS zorunlu (TLS 1.3), Strict-Transport-Security politikası, X-Frame-Options, Content-Security-Policy, hosting tarafında uçtan uca şifreli yedekleme. Bir veri ihlali durumunda KVKK gereği 72 saat içinde Kişisel Verileri Koruma Kurumu'na ve etkilenen kullanıcılara bildirim yapılır (kişisel veri tutulmadığı için bu pratikte oldukça olası değildir).
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>8. Aile / Veli Hakları</h2>
        <p>
          Veli veya yasal vasi olarak şu haklara sahipsiniz:
        </p>
        <ul>
          <li>Çocuğunuzun ziyaretiyle ilgili sunucu günlüklerinin silinmesini talep etmek.</li>
          <li>Bir içeriğin çocuğa uygun olmadığını düşünüyorsanız bildirim yapmak.</li>
          <li>minesminis'ten içerik kaldırılmasını talep etmek.</li>
          <li>Veri işleme uygulamamızla ilgili soru sormak.</li>
        </ul>
        <p>
          Tüm talepler için: <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a>. Geri dönüş süremiz 7 iş günüdür.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>9. Politika Güncellemeleri</h2>
        <p>
          Bu politika; yasal değişiklikler, yeni özellikler veya üçüncü taraf hizmet değişiklikleri nedeniyle güncellenebilir. Güncellemeleri bu sayfada <strong>"Son güncelleme"</strong> tarihiyle birlikte yayınlarız. Esaslı bir değişiklik olursa anasayfada belirgin bir duyuru göstereceğiz.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>10. İletişim</h2>
        <p>
          Bu gizlilik politikası hakkında sorularınız için: <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a>. Daha kapsamlı bilgi için <Link to="/contact" style={{ color: 'var(--accent)' }}>İletişim</Link> sayfamızı da inceleyebilirsiniz.
        </p>
      </article>
    </div>
  )
}
