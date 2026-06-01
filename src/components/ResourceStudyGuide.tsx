type ResourceKind = 'video' | 'song' | 'slide' | 'worksheet'

type ResourceStudyGuideProps = {
  kind: ResourceKind
  title: string
  category?: string
  level?: string
  duration?: string
  pageCount?: number
  itemCount?: number
}

const copy = {
  video: {
    label: 'Video etkinliği',
    goals: ['Dinleme dikkatini geliştirme', 'Sık geçen kelimeleri bağlam içinde tanıma', 'Kısa cümleleri tekrar ederek telaffuz pratiği yapma'],
    plan: ['İlk izlemede sadece anlamaya odaklanın.', 'İkinci izlemede duyulan 3 kelimeyi birlikte söyleyin.', 'Sonunda çocuktan videodaki bir nesneyi veya hareketi İngilizce adlandırmasını isteyin.'],
    teacher: 'Sınıfta kullanırken videoyu 30-60 saniyelik bölümlere ayırmak, özellikle başlangıç seviyesinde daha kalıcı öğrenme sağlar.',
  },
  song: {
    label: 'Şarkı etkinliği',
    goals: ['Ritimle kelime hatırlamayı güçlendirme', 'Kalıp ifadeleri doğal telaffuzla tekrar etme', 'İngilizce-Türkçe anlam eşleştirmesi yapma'],
    plan: ['Önce nakaratı dinleyin ve alkışla ritmi bulun.', 'Sonra her satırdan bir ana kelime seçip hareketle gösterin.', 'Son turda çocuk yalnızca bildiği kelimelere eşlik etsin.'],
    teacher: 'Şarkıları kısa hareketlerle eşleştirmek, pasif dinlemeyi aktif öğrenmeye dönüştürür.',
  },
  slide: {
    label: 'Sunum etkinliği',
    goals: ['Görsel ipuçlarından kelime çıkarımı yapma', 'Yeni kelimeyi Türkçe karşılığıyla ilişkilendirme', 'Sıralı tekrar ile kısa süreli hafızayı destekleme'],
    plan: ['Her slaytta önce görsele bakıp tahmin alın.', 'Kelimeyi yüksek sesle söyleyip Türkçe anlamı kontrol edin.', 'Son 3 slaytta çocuktan kelimeyi sizden önce söylemesini isteyin.'],
    teacher: 'Projeksiyon veya tablet kullanımında her slayta tek hedef kelime vermek dikkat dağılmasını azaltır.',
  },
  worksheet: {
    label: 'Çalışma kâğıdı etkinliği',
    goals: ['Yazılı kelime tanıma pratiği', 'Eşleştirme ve boyama ile anlam pekiştirme', 'İnce motor becerileriyle dil öğrenimini birleştirme'],
    plan: ['Sayfayı çözmeden önce görselleri birlikte adlandırın.', 'Çocuk çalışırken doğru cevabı hemen söylemek yerine iki seçenek sunun.', 'Bittiğinde bir kelimeyi cümle içinde kullanmasını isteyin.'],
    teacher: 'Yazdırılabilir materyaller en iyi 10-15 dakikalık kısa uygulamalar halinde kullanılır.',
  },
} as const

function resourceMeta({ category, duration, level, pageCount, itemCount }: ResourceStudyGuideProps) {
  const items = []
  if (category) items.push(category)
  if (level) items.push(level)
  if (duration) items.push(duration)
  if (typeof pageCount === 'number' && pageCount > 0) items.push(`${pageCount} sayfa`)
  if (typeof itemCount === 'number' && itemCount > 0) items.push(`${itemCount} öğe`)
  return items.join(' · ')
}

export default function ResourceStudyGuide(props: ResourceStudyGuideProps) {
  const data = copy[props.kind]
  const meta = resourceMeta(props)

  return (
    <article className="mm-study-guide" aria-labelledby="study-guide-title">
      <div className="mm-study-guide-head">
        <span className="mm-tag coral">{data.label}</span>
        {meta && <span className="mm-study-meta">{meta}</span>}
      </div>

      <h2 id="study-guide-title">{props.title} için öğrenme rehberi</h2>
      <p>
        Bu kaynak, 4-12 yaş arası çocukların İngilizceyi kısa tekrarlar, görsel ipuçları ve yetişkin eşliğiyle
        güvenli biçimde çalışması için hazırlanmıştır. Amaç tek oturumda ezber yaptırmak değil, kelimeyi oyun,
        ritim veya görsel bağlam içinde birkaç kez karşılaştırmaktır.
      </p>

      <div className="mm-study-grid">
        <section>
          <h3>Öğrenme hedefleri</h3>
          <ul>
            {data.goals.map((goal) => <li key={goal}>{goal}</li>)}
          </ul>
        </section>

        <section>
          <h3>10 dakikalık etkinlik</h3>
          <ol>
            {data.plan.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
      </div>

      <section>
        <h3>Öğretmen ve veli notu</h3>
        <p>{data.teacher} Çocuk cevabı bilmiyorsa ipucu verip tekrar denemesini beklemek, doğrudan düzeltmeden daha iyi sonuç verir.</p>
      </section>

      <section>
        <h3>Yaş uygunluğu ve güvenlik</h3>
        <p>
          minesminis kaynakları kayıt, yorum veya açık sohbet gerektirmez. Dış medya kullanılan sayfalarda içerik
          manuel incelenir; 10 yaş altı çocukların bu materyalleri veli ya da öğretmen eşliğinde kullanması önerilir.
        </p>
      </section>
    </article>
  )
}
