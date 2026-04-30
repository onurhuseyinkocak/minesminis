import { useEffect } from 'react'
import Layout from '../components/Layout'

export default function Terms() {
  useEffect(() => { document.title = 'Kullanim Sartlari - minesminis' }, [])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 className="mm-page-title">Kullanim Kosullari</h1>
        <p className="mm-page-sub" style={{ marginBottom: 24 }}>Son guncelleme: 30 Nisan 2026</p>

        <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>1. Hizmet Tanimi</h2>
          <p>
            minesminis, 4-12 yas arasi cocuklarin Ingilizce ogrenmeleri icin ucretsiz egitim materyalleri sunan bir web platformudur.
            Platform; interaktif slaytlar, egitici videolar ve Ingilizce sarkilar icerir.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>2. Kullanim Sartlari</h2>
          <ul>
            <li>Platform ucretsizdir ve kayit gerektirmez.</li>
            <li>Icerikler egitim amacli olup ticari kullanimda izin alinmasi gerekir.</li>
            <li>Cocuklarin platformu bir yetiskin gozetiminde kullanmasi tavsiye edilir.</li>
            <li>Platformdaki icerikler telif hakki ile korunmaktadir.</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>3. Icerik Hakki</h2>
          <p>
            minesminis uzerindeki tum egitim materyalleri, gorseller ve tasarimlar minesminis'a aittir.
            Kullanicilar, icerikleri kisisel egitim amacli kullanabilir ancak ticari amacla cogaltamaz veya dagitamaz.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>4. Reklamlar</h2>
          <p>
            minesminis, platformu ucretsiz sunmak icin Google AdSense reklamlari kullanir.
            Reklamlar cocuklara uygun icerik politikalarina tabidir ve kisisellestirilmis reklam gosterilmez.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>5. Sorumluluk Sinirlamasi</h2>
          <p>
            minesminis, platformun kesintisiz veya hatasiz calisacagini garanti etmez.
            Icerikler "oldugu gibi" sunulur ve egitim amacli genel bilgi niteligindedir.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>6. Iletisim</h2>
          <p>
            Kullanim kosullari hakkinda sorulariniz icin <a href="mailto:info@minesminis.com" style={{ color: 'var(--accent)' }}>info@minesminis.com</a> adresine yazabilirsiniz.
          </p>
        </div>
      </div>
    </Layout>
  )
}
