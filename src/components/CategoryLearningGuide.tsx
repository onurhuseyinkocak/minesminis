type CategoryKind = 'videos' | 'songs' | 'slides' | 'worksheets'

type CategoryLearningGuideProps = {
  kind: CategoryKind
  itemCount: number
}

const categoryCopy = {
  videos: {
    title: 'İngilizce videoları nasıl seçiyoruz?',
    intro:
      'Video içerikleri, çocukların kısa süreli dikkat aralığına uygun olacak şekilde seçilir. Öncelik; net telaffuz, yavaş tekrar, görsel destek ve sınıf içinde tekrar edilebilen kalıplardır.',
    topics: ['Renkler, sayılar ve hayvanlar', 'Günlük rutin cümleleri', 'Selamlaşma ve sınıf yönergeleri'],
    use: 'Bir videoyu tek seferde uzun izletmek yerine 2-3 dakikalık bölümler halinde izlemek daha verimlidir.',
  },
  songs: {
    title: 'İngilizce şarkılar hangi becerileri destekler?',
    intro:
      'Şarkılar, kelimeleri ritim ve tekrar yoluyla kalıcı hale getirir. Özellikle okul öncesi ve ilkokul başlangıç seviyesinde telaffuz, dinleme ve özgüven için güçlü bir pratik alanıdır.',
    topics: ['Nakaratla tekrar edilen kelimeler', 'Hareketli beden dili etkinlikleri', 'İngilizce-Türkçe anlam eşleştirme'],
    use: 'Şarkıdan önce 3 ana kelime seçip görselleştirmek, çocuğun dinlerken neye dikkat edeceğini bilmesini sağlar.',
  },
  slides: {
    title: 'Sunum setleri nasıl kullanılmalı?',
    intro:
      'Sunumlar, tek bir tema etrafında görsel kelime tekrarları sunar. Öğretmenler sınıfta projeksiyonla, aileler evde tablet veya bilgisayar ekranında kısa pratikler yapabilir.',
    topics: ['Tema bazlı kelime grupları', 'Görselden tahmin yürütme', 'Kısa soru-cevap çalışmaları'],
    use: 'Her slaytta önce tahmin almak, ardından İngilizce kelimeyi söylemek aktif katılımı artırır.',
  },
  worksheets: {
    title: 'Çalışma kâğıtları ne için uygundur?',
    intro:
      'Çalışma kâğıtları, ekrandan bağımsız tekrar yapmak isteyen aileler ve öğretmenler için hazırlanır. Boyama, eşleştirme ve tamamlama etkinlikleri dil öğrenimini somutlaştırır.',
    topics: ['Yazılı kelime tanıma', 'Eşleştirme ve sınıflandırma', 'Kısa ev ödevi veya sınıf pekiştirmesi'],
    use: 'Çalışma öncesi kelimeleri sözlü tekrar etmek, sayfa çözümünü ezber yerine anlamlı pratik haline getirir.',
  },
} as const

export default function CategoryLearningGuide({ kind, itemCount }: CategoryLearningGuideProps) {
  const data = categoryCopy[kind]

  return (
    <article className="mm-category-guide">
      <div className="mm-study-guide-head">
        <span className="mm-tag blue">{itemCount > 0 ? `${itemCount} kaynak` : 'Öğrenme rehberi'}</span>
      </div>
      <h2>{data.title}</h2>
      <p>{data.intro}</p>
      <div className="mm-study-grid">
        <section>
          <h3>Odak konular</h3>
          <ul>
            {data.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </section>
        <section>
          <h3>Uygulama önerisi</h3>
          <p>{data.use}</p>
          <p>minesminis içerikleri kayıt veya öğrenci profili gerektirmeden, veli ve öğretmen eşliğinde güvenli kullanım için düzenlenir.</p>
        </section>
      </div>
    </article>
  )
}
