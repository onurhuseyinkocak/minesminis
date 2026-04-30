import { useEffect } from 'react'
import Layout from '../components/Layout'

export default function Privacy() {
  useEffect(() => { document.title = 'Gizlilik Politikasi - minesminis' }, [])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Gizlilik Politikasi</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>Son guncelleme: 30 Nisan 2026</p>

        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>1. Genel Bakis</h2>
          <p>
            minesminis (minesminis.com), 4-12 yas arasi cocuklar icin tasarlanmis ucretsiz bir Ingilizce ogrenme platformudur.
            Cocuklarin guvenligi bizim icin en onemli onceliktir. Bu gizlilik politikasi, sitemizi kullanirken hangi verilerin toplandigini
            ve nasil kullanildigini aciklar.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>2. Toplanan Veriler</h2>
          <p>
            minesminis, kullanicilardan kisisel bilgi toplamaz. Hesap olusturma, e-posta kaydi veya sosyal medya girisi gerektirmez.
            Sitemiz tamamen anonim olarak kullanilabilir.
          </p>
          <ul>
            <li>Kisisel bilgi (ad, e-posta, telefon) toplanmaz</li>
            <li>Konum bilgisi toplanmaz</li>
            <li>Cocuklara yonelik kisisel veri toplanmaz</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>3. Cerezler ve Analitik</h2>
          <p>
            Sitemizde Google AdSense reklamlari gosterilmektedir. Google, reklam sunmak icin cerezler kullanabilir.
            Bu cerezler kisisel bilgi toplamaz ve yalnizca reklam gosterimini iyilestirmek icin kullanilir.
            Cocuklara yonelik icerik sundugumuz icin, kisisellestirilmis reklamlar devre disidir.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>4. COPPA Uyumlulugu</h2>
          <p>
            minesminis, ABD Cocuk Cevrimici Gizliligi Koruma Yasasi (COPPA) ve ilgili uluslararasi mevzuata uygun olarak
            faaliyet gostermektedir. 13 yasindan kucuk cocuklardan bilerek kisisel bilgi toplamiyoruz.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>5. Ucuncu Taraf Hizmetleri</h2>
          <ul>
            <li><strong>Google AdSense:</strong> Icerik temelli reklamlar icin kullanilir. Cocuk icerigi oldugu icin kisisellestirilmis reklam gosterilmez.</li>
            <li><strong>YouTube:</strong> Video icerikler YouTube uzerinden gomulu olarak gosterilir. YouTube'un kendi gizlilik politikasi gecerlidir.</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>6. Veli Haklari</h2>
          <p>
            Veliler, cocuklarinin site kullanimi hakkinda bilgi talep edebilir. Herhangi bir sorunuz icin
            bize <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a> adresinden ulasabilirsiniz.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>7. Degisiklikler</h2>
          <p>
            Bu gizlilik politikasi zaman zaman guncellenebilir. Onemli degisiklikler yapildiginda bu sayfa uzerinden bilgilendirileceksiniz.
          </p>
        </div>
      </div>
    </Layout>
  )
}
