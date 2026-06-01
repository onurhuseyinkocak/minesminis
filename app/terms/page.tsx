import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description:
    'minesminis platformunun kullanım koşulları: hizmet kapsamı, içerik hakları, sorumluluklar, çocuk gözetimi, üçüncü taraf bağlantılar ve fikri mülkiyet hakkında ayrıntılı bilgi.',
  alternates: { canonical: 'https://minesminis.com/terms' },
}

const lastUpdated = '25 Mayıs 2026'
const h2Style = { fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 16 }

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 className="mm-page-title">Kullanım Koşulları</h1>
      <p className="mm-page-sub" style={{ marginBottom: 24 }}>Son güncelleme: {lastUpdated}</p>

      <article style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
        <p>
          minesminis platformuna hoş geldiniz. Bu sayfa, minesminis.com web sitesinin ve sunduğu eğitim içeriklerinin kullanımıyla ilgili koşulları açıklar. Siteyi ziyaret ederek veya içeriği kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Çocuğunuzun siteyi kullanmasına izin vermeden önce bu maddeleri okumanızı öneririz.
        </p>

        <h2 style={h2Style}>1. Hizmet Tanımı</h2>
        <p>minesminis, 4-12 yaş çocuklarına yönelik ücretsiz bir İngilizce öğrenme platformudur. Hizmet kapsamında:</p>
        <ul>
          <li>Tematik İngilizce sunum setleri (slayt formatında, görsel-odaklı)</li>
          <li>Öğretici video koleksiyonları (gömülü YouTube üzerinden)</li>
          <li>Çocuklar için seçilmiş İngilizce şarkılar</li>
          <li>Yazdırılabilir çalışma kâğıtları (PDF formatında)</li>
          <li>Aileler ve öğretmenler için makaleler, rehberler, ipuçları</li>
        </ul>
        <p>minesminis bir okul, kurs veya sertifikalı bir eğitim kurumu değildir. Sunulan içerik, sınıf-içi öğretimin tamamlayıcısı veya evde dil pratiğini destekleyici nitelikte hazırlanmıştır.</p>

        <h2 style={h2Style}>2. Kullanım Koşulları</h2>
        <ul>
          <li><strong>Ücretsiz erişim:</strong> Platformun tamamı ücretsizdir. Kayıt, ödeme veya abonelik gerektirmez.</li>
          <li><strong>Eğitim amaçlı:</strong> İçerik yalnızca bireysel ve ticari olmayan eğitim amaçlı kullanılabilir.</li>
          <li><strong>Sınıf kullanımı:</strong> Türkiye'deki devlet ve özel okul öğretmenleri içerikleri sınıflarında ücretsiz kullanabilir.</li>
          <li><strong>Çocuk gözetimi:</strong> 10 yaş altı çocukların yetişkin gözetiminde kullanması önerilir.</li>
          <li><strong>Yasal kısıt:</strong> Platformu hukuka aykırı, taciz edici, virüslü ya da sistemi yormak amaçlı kullanmayın.</li>
        </ul>

        <h2 style={h2Style}>3. Fikri Mülkiyet Hakları</h2>
        <p>
          minesminis'te yer alan tüm özgün içerikler — sunumlar, çalışma kâğıtları, blog makaleleri, illüstrasyonlar ve tasarım sistemleri — minesminis'in fikri mülkiyetidir. Telif hakları Türkiye Cumhuriyeti 5846 Sayılı Fikir ve Sanat Eserleri Kanunu ile uluslararası anlaşmalarla korunur.
        </p>
        <p><strong>İzin verilen kullanım:</strong></p>
        <ul>
          <li>Bireysel ailelerin evde çocuklarıyla kullanması</li>
          <li>Öğretmenlerin kendi sınıflarında ders materyali olarak göstermesi</li>
          <li>Çalışma kâğıtlarının yazdırılarak öğrenciye dağıtılması</li>
          <li>Sunumlardan alıntıyla, kaynak gösterilerek akademik kullanım</li>
        </ul>
        <p><strong>İzin verilmeyen kullanım:</strong></p>
        <ul>
          <li>İçeriği başka bir web sitesinde ya da uygulamada yeniden yayınlamak</li>
          <li>Logoyla birlikte ticari ürün satışı</li>
          <li>Materyalleri ücretli bir kursta paylı paket olarak satmak</li>
          <li>İçerikten türetilmiş yapay zekâ eğitim verisi olarak kullanmak</li>
        </ul>

        <h2 style={h2Style}>4. Üçüncü Taraf İçerikleri</h2>
        <p>Platform üzerinde yer alan bazı içerikler üçüncü taraf hizmetlerden gömülerek sunulur:</p>
        <ul>
          <li><strong>YouTube videoları:</strong> Eğitsel YouTube içeriği <em>restricted mode</em> ile sunulur. Video içeriği YouTube tarafından oluşturulmuştur, telif hakları orijinal sahiplerine aittir.</li>
          <li><strong>Şarkılar:</strong> Çocuklar için bilinen melodilerin eğitim amaçlı uyarlamalarıdır. Mümkün olduğunda kamu malı kayıtlar veya lisanslı kaynaklar kullanılır.</li>
          <li><strong>Görseller:</strong> Site içi illüstrasyonlar minesminis tarafından üretilmiş veya lisanslı kaynaklardan alınmıştır.</li>
        </ul>
        <p>Eğer bir içeriğin telif sahibi siz iseniz ve içeriğin kaldırılmasını talep ediyorsanız <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a> adresine yazabilirsiniz. 7 iş günü içinde dönüş yapılır.</p>

        <h2 style={h2Style}>5. Reklamlar</h2>
        <p>minesminis'in ücretsiz kalabilmesi için ileride Google AdSense üzerinden reklam gösterimi yapılabilir. Onay sürecinde reklam gösterimi kapalıdır. Reklamlar aktif edilirse şu kurallar dahilinde sunulur:</p>
        <ul>
          <li>Yalnızca <strong>bağlamsal (contextual)</strong> reklamlar; davranışsal hedefleme yok.</li>
          <li>Çocuk/yaş kısıtlı içerik etiketiyle filtrelenir.</li>
          <li>Boş, hata, yönetim, iletişim, yasal metin veya medya içeriği eksik sayfalarda reklam gösterilmez.</li>
          <li>Reklam bileşenleri yalnızca içerik açısından incelenmiş blog, müfredat, sık sorulan sorular ve hakkımızda sayfalarında çalışacak şekilde sınırlandırılmıştır.</li>
          <li>Aileler reklamları görmemek için tarayıcı düzeyinde reklam engelleyici kullanabilir.</li>
        </ul>

        <h2 style={h2Style}>6. Sorumluluk Sınırlandırması</h2>
        <p>minesminis platformu "olduğu gibi" sunulur. Platformun her zaman kesintisiz, hatasız veya tüm cihazlarla uyumlu olacağı garanti edilmez. Aşağıdakiler için sorumluluk üstlenmiyoruz:</p>
        <ul>
          <li>Site kesintileri (sunucu bakımı, hosting kesintisi, ISP problemleri)</li>
          <li>Üçüncü taraf hizmetlerin (YouTube, Google Fonts) erişilemez olması</li>
          <li>Cihaz uyumsuzluğundan kaynaklı sorunlar</li>
          <li>Çocuğun siteyi yetişkin gözetimi olmaksızın kullanmasından doğan dolaylı etkiler</li>
        </ul>
        <p>İçerik genel bir eğitim referansıdır; profesyonel pedagog değerlendirmesi yerine geçmez.</p>

        <h2 style={h2Style}>7. Dış Bağlantılar</h2>
        <p>Site içinde başka web sitelerine bağlantılar bulunabilir (örneğin Maarif Modeli, MEB resmi sayfaları, akademik makaleler). Bu sitelerin içeriği üzerinde minesminis'in kontrolü yoktur ve onların içeriklerinden sorumlu değiliz.</p>

        <h2 style={h2Style}>8. Hesap Yok</h2>
        <p>minesminis'te kullanıcı hesabı sistemi yoktur. Bu nedenle "hesap askıya alma", "şifre kurtarma" veya benzeri prosedürler gündeme gelmez. Yönetici paneline ise sadece minesminis ekibi üyeleri erişebilir.</p>

        <h2 style={h2Style}>9. Değişiklikler</h2>
        <p>
          Bu kullanım koşulları herhangi bir zamanda güncellenebilir. Önemli değişiklikler yapıldığında bu sayfanın "Son güncelleme" tarihi yenilenir. Esaslı değişikliklerden önce anasayfada veya ilgili sayfalarda görünür bir duyuru yayınlamayı amaçlıyoruz.
        </p>

        <h2 style={h2Style}>10. Geçerli Hukuk</h2>
        <p>Bu koşullara ilişkin ihtilaflarda Türkiye Cumhuriyeti hukuku geçerlidir. Uyuşmazlıklar İstanbul Mahkemeleri'nde çözümlenir.</p>

        <h2 style={h2Style}>11. İletişim</h2>
        <p>
          Kullanım koşulları, içerik kaldırma talepleri, telif hakkı bildirimleri ve diğer hukuki konular için: <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a>. Daha fazla bilgi için <Link href="/privacy" style={{ color: 'var(--accent)' }}>Gizlilik Politikası</Link> ve <Link href="/contact" style={{ color: 'var(--accent)' }}>İletişim</Link> sayfalarımıza bakabilirsiniz.
        </p>
      </article>
    </div>
  )
}
