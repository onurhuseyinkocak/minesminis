import type { Metadata } from 'next'
import Link from 'next/link'
import { Layers, Map, Target, BookOpen, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Müfredat ve Yaş Bazlı Yol Haritası — CEFR A1 İngilizce',
  description:
    'Çocuğunuz için yaş bazlı İngilizce müfredat yol haritası. 4-12 yaş arası, CEFR A1 ve Maarif Modeli uyumlu, 16 haftalık program ve tema listesi.',
  alternates: { canonical: 'https://minesminis.com/curriculum' },
}

const ages = [
  { range: '4-5 yaş', grade: 'Anaokulu', weekly: 'Haftada 3 × 15 dk', goal: 'İngilizceyi sevimli bir oyun olarak tanımak', topics: ['Renkler (Colors)', 'Sayılar 1-10', 'Hayvanlar (Animals)', 'Aile (Family members)', 'Vücut bölümleri (Body parts)'], method: 'Görsel + ses + hareket. Şarkı ve sunum ağırlıklı. Çalışma kâğıdı isteğe bağlı.', color: '#FFE4DC' },
  { range: '6-7 yaş', grade: '1.-2. sınıf', weekly: 'Haftada 4 × 20 dk', goal: 'Temel kelime + basit cümleler', topics: ['Greetings (Selamlaşma)', 'Sayılar 11-20', 'Yiyecekler (Food)', 'Okul nesneleri (Classroom)', 'Hava durumu (Weather)', 'Mevsimler (Seasons)'], method: 'Sunum + şarkı + çalışma kâğıdı. "I have / I like / I see" gibi kalıp cümleler.', color: '#FFF4DC' },
  { range: '8-9 yaş', grade: '3.-4. sınıf', weekly: 'Haftada 5 × 25 dk', goal: 'Akıcı kalıp + günlük diyalog', topics: ['Daily routines', 'Hobbies & free time', 'Clothes', 'House & furniture', 'Jobs (Meslekler)', 'Transportation', 'Months & days'], method: 'Tüm 4 format. "Can you...?", "Do you like...?" gibi diyalog soruları. Phonics tanıtımı.', color: '#E5F6EC' },
  { range: '10-12 yaş', grade: '5.-6. sınıf', weekly: 'Haftada 5 × 30-45 dk', goal: 'Bağlamsal kelime + okuma + dinleme', topics: ['Stories & narratives', 'Past simple tense', 'Comparatives', 'Geography', 'Health & body', 'Future plans', 'Compound sentences'], method: 'Sunum + uzun video + okuma metinleri. CEFR A1 sonu / A2 başı seviye.', color: '#E8EDFF' },
]

const milestones = [
  { week: 'Hafta 1-2', goal: 'Renkler ve sayılar 1-10' },
  { week: 'Hafta 3-4', goal: 'Hayvanlar ve "I have a..."' },
  { week: 'Hafta 5-6', goal: 'Aile + "This is my..."' },
  { week: 'Hafta 7-8', goal: 'Vücut bölümleri + "My body"' },
  { week: 'Hafta 9-10', goal: 'Hava durumu + "It is sunny"' },
  { week: 'Hafta 11-12', goal: 'Yiyecekler + "I like..."' },
  { week: 'Hafta 13-14', goal: 'Okul nesneleri + "I have a..."' },
  { week: 'Hafta 15-16', goal: 'Mevsimler + "In spring I..."' },
]

const cefrLevels = [
  { level: 'A1', title: 'Başlangıç', desc: '500-700 kelime. Tanışma, kendini tanıtma, basit sorular. Çocuğunuz "Hello, my name is Ali. I am 7 years old." diyebilir.' },
  { level: 'A2', title: 'Temel', desc: '1000-1500 kelime. Günlük rutinler, hobiler, geçmiş zaman temel kullanımı. "Yesterday I played football with my friend." kalıplarını kurar.' },
  { level: 'B1', title: 'Eşik', desc: '2500+ kelime. Hikâye anlatma, fikir ifadesi, basit tartışma. Bu seviye genellikle ortaokul-lise dönemine denk gelir.' },
]

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.mm-page-sub'],
  },
  url: 'https://minesminis.com/curriculum',
}

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'İlkokul İngilizce Müfredatı — CEFR A1, Maarif Modeli Uyumlu',
  description: '4-12 yaş arası çocuklar için 16 haftalık ücretsiz İngilizce müfredat yol haritası. Maarif modeli uyumlu, CEFR A1 hedefli.',
  provider: { '@type': 'EducationalOrganization', name: 'minesminis', url: 'https://minesminis.com' },
  url: 'https://minesminis.com/curriculum',
  inLanguage: 'tr',
  isAccessibleForFree: true,
  educationalLevel: 'Primary School (Grade 1-4)',
  teaches: 'CEFR A1 English vocabulary, grammar and conversation',
  audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'Primary school students aged 4-12' },
  hasCourseInstance: [1, 2, 3, 4].map((g) => ({
    '@type': 'CourseInstance',
    name: `${g}. Sınıf`,
    courseMode: 'online',
    courseWorkload: 'PT2H',
    inLanguage: 'tr',
  })),
}
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://minesminis.com/' },
    { '@type': 'ListItem', position: 2, name: 'Müfredat', item: 'https://minesminis.com/curriculum' },
  ],
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Çocuğa Evde 16 Haftada İngilizce Öğretmek',
  description: 'Maarif modeli uyumlu, 4-12 yaş arası çocuk için kademeli 16 haftalık İngilizce öğretim planı. Haftada 3-4 gün, 15-25 dakika.',
  totalTime: 'P16W',
  inLanguage: 'tr',
  image: 'https://minesminis.com/images/minesminis-logo-512.png',
  supply: [
    { '@type': 'HowToSupply', name: 'minesminis.com — ücretsiz hesap gerekmez' },
    { '@type': 'HowToSupply', name: 'Tablet veya bilgisayar' },
    { '@type': 'HowToSupply', name: 'Yazıcı (çalışma kâğıtları için isteğe bağlı)' },
  ],
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Hafta 1-2: Renkler ve Sayılar 1-10', text: 'Renkler ve sayılar 1-10 sunumlarıyla başlayın. TPR ile renk gösterme + parmak sayma etkinlikleri. Hedef kelime: 22.', url: 'https://minesminis.com/konu/colors' },
    { '@type': 'HowToStep', position: 2, name: 'Hafta 3-4: Hayvanlar ve "I have a..."', text: 'Hayvan kelimeleri + "I have a cat" kalıbı. Sınıf veya ev hayvanları üzerinden pratik.', url: 'https://minesminis.com/konu/animals' },
    { '@type': 'HowToStep', position: 3, name: 'Hafta 5-6: Aile + "This is my..."', text: 'Aile üyeleri kelimeleri + "This is my mother" kalıbı. Aile fotoğrafı getirme etkinliği.', url: 'https://minesminis.com/konu/family' },
    { '@type': 'HowToStep', position: 4, name: 'Hafta 7-8: Vücut Bölümleri', text: '"Head, Shoulders, Knees and Toes" şarkısı ile TPR. Vücut bölümleri kelime + "Touch your..." komutu.', url: 'https://minesminis.com/konu/body-parts' },
    { '@type': 'HowToStep', position: 5, name: 'Hafta 9-10: Hava Durumu', text: 'Her sabah "How\'s the weather today?" rutini. Hava durumu kelimeleri + "It is sunny" kalıbı.', url: 'https://minesminis.com/konu/weather' },
    { '@type': 'HowToStep', position: 6, name: 'Hafta 11-12: Yiyecekler + "I like..."', text: 'Yiyecek kelimeleri + "I like apples" / "I don\'t like fish" kalıpları. Sevdiği yiyecekleri çizme etkinliği.', url: 'https://minesminis.com/konu/food' },
    { '@type': 'HowToStep', position: 7, name: 'Hafta 13-14: Okul Eşyaları', text: 'Okul eşyaları kelimeleri + "I have a pencil" kalıbı. Çantadan eşya çıkarma oyunu.', url: 'https://minesminis.com/konu/school-items' },
    { '@type': 'HowToStep', position: 8, name: 'Hafta 15-16: Mevsimler + Karma Tekrar', text: 'Mevsimler kelimeleri + önceki 7 konunun karma tekrarı. Mini sınıf gösterisi: çocuk öğrendiklerini sunsun.', url: 'https://minesminis.com/konu/seasons' },
  ],
}

export default function CurriculumPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <h1 className="mm-page-title">Müfredat ve Yol Haritası</h1>
      <p className="mm-page-sub" style={{ marginBottom: 24 }}>Çocuğunuza yaşına uygun, kademeli, bilim temelli bir İngilizce yolculuğu.</p>

      <article style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>Nasıl Yapılandırıldı?</h2>
        <p>minesminis müfredatı üç ana iskelet üzerine inşa edilmiştir:</p>
        <ol>
          <li><strong>Yaş + bilişsel gelişim:</strong> 4-5 yaşın dikkat süresi 7-9 yaşa göre çok farklı. Her yaş aralığı için süre, format ve karmaşıklık ayarlanmıştır.</li>
          <li><strong>CEFR A1 standardı:</strong> Avrupa Ortak Dil Çerçevesi'nin başlangıç seviyesi. Çocuğun beklenebilir kelime ve kalıp seti uluslararası standartla hizalı.</li>
          <li><strong>Maarif Modeli uyumu:</strong> Türkiye MEB'in 2. sınıftan itibaren İngilizce dersi müfredatıyla paralel temalar.</li>
        </ol>
        <p>Bu üç ekseni birleştirerek, çocuğun okul programıyla çelişmeyen, evde tamamlayıcı ve eğlenceli bir yolculuk sunmayı amaçlıyoruz.</p>
      </article>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 14 }}>
        <Users size={20} style={{ display: 'inline', verticalAlign: -3, marginRight: 8 }} />
        Yaş Bazlı Yol Haritası
      </h2>

      <div style={{ display: 'grid', gap: 14, marginBottom: 28 }}>
        {ages.map((age) => (
          <div key={age.range} style={{ background: 'white', borderRadius: 18, padding: 22, border: '1px solid var(--line)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ width: 90, height: 90, borderRadius: 18, background: age.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{age.range}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textAlign: 'center', marginTop: 2 }}>{age.grade}</div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}><Calendar size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />{age.weekly}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}><Target size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />{age.goal}</div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 8, lineHeight: 1.6 }}>
                <strong>Konular:</strong> {age.topics.join(' · ')}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.55, fontStyle: 'italic' }}>{age.method}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 14 }}>
        <Map size={20} style={{ display: 'inline', verticalAlign: -3, marginRight: 8 }} />
        16 Haftalık Önerilen Program
      </h2>
      <p style={{ marginBottom: 16, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Aşağıdaki tablo, 4-7 yaş çocuğu için ilk dört aylık bir başlangıç programıdır. Her hafta yeni bir mini-tema, 4 günlük tekrar ve 1 gün eğlenceli pekiştirme.
      </p>

      <div style={{ background: 'white', borderRadius: 18, border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 28 }}>
        {milestones.map((m, i) => (
          <div key={m.week} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
            <div style={{ minWidth: 90, fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{m.week}</div>
            <div style={{ flex: 1, fontSize: 14.5, color: 'var(--ink-2)' }}>{m.goal}</div>
            <ArrowRight size={16} style={{ color: 'var(--ink-3)', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 14 }}>
        <Layers size={20} style={{ display: 'inline', verticalAlign: -3, marginRight: 8 }} />
        CEFR Seviyeleri Açıklaması
      </h2>
      <p style={{ marginBottom: 16, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        CEFR (Common European Framework of Reference for Languages), dil seviyelerini A1-C2 arasında standartlaştıran sistem. minesminis temel olarak A1 hedefler; A2'ye geçişe başlangıç olur.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14, marginBottom: 28 }}>
        {cefrLevels.map((lvl) => (
          <div key={lvl.level} style={{ background: 'white', borderRadius: 16, padding: 18, border: '1px solid var(--line)' }}>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: 'var(--surface-2)', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
              {lvl.level}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 6px', color: 'var(--ink)' }}>{lvl.title}</h3>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{lvl.desc}</p>
          </div>
        ))}
      </div>

      <article style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 15, color: 'var(--ink-2)', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 0 }}>
          <BookOpen size={20} style={{ display: 'inline', verticalAlign: -3, marginRight: 8 }} />
          Tema İçeriklerine Yakından Bakış
        </h2>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Greetings (Selamlaşma)</h3>
        <p>Çocuğun bir İngilizceyi ilk kullanmaya cesaret ettiği yer genellikle selamlaşmadır. Tema kapsamında: <em>Hello, Hi, Good morning, Good afternoon, How are you?, Fine thank you, Goodbye, See you later</em>. Önerilen ilerleme: sunumda kelime tanıma → şarkıda ritim öğrenme → çalışma kâğıdında elle yazma.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Colors (Renkler)</h3>
        <p>Genellikle ilk konu olarak işlenir çünkü çocuk gözle hemen pekiştirebilir. Tema: <em>red, blue, yellow, green, orange, purple, pink, black, white, brown</em>. Aktif kalıp: <em>"This is red", "The car is blue"</em>. Çocuk evi gezerek "Find something red!" oyunuyla pekiştirir.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Numbers (Sayılar)</h3>
        <p>1-10 ezbere kolay; 11-20'de "thirteen vs thirty" gibi kafa karıştıran çiftler var. Bu yüzden ayrı modüllerle öğretilir. Şarkıyla ritim öğrenmek burada kritik.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Animals (Hayvanlar)</h3>
        <p>Çocuk için en sevilen tema. Çiftlik (cow, pig, sheep, horse), evcil (dog, cat, fish, bird), yaban (lion, tiger, elephant, monkey) olarak üç alt-tema halinde işlenir.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Family (Aile)</h3>
        <p>Bu temada çocuk kendi ailesini ifade etmeyi öğrenir: <em>mother, father, brother, sister, baby, grandmother, grandfather</em>. Kalıp: <em>"This is my mother. Her name is Ayşe."</em></p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Body Parts (Vücut Bölümleri)</h3>
        <p>Hareket eşliğinde öğretilmesi etkili olan tema. "Head, shoulders, knees and toes" şarkısı bu temada özellikle güçlüdür.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Food (Yiyecekler)</h3>
        <p>Çocuk her gün karşılaştığı için motivasyon doğal. Meyve, sebze, öğün alt-temalara ayrılır. <em>"I like apples", "I don't like carrots"</em> kalıbı kullanıma alınır.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Classroom (Sınıf Nesneleri)</h3>
        <p>Anasınıfı çocuğu için bağlam zengin. <em>book, pencil, eraser, ruler, bag, desk, chair, board</em>.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Weather (Hava Durumu)</h3>
        <p>Günlük diyalog için kritik. Çocuğa her sabah pencereye bakıp "What's the weather like today?" diye sormak güçlü bir günlük rutin yaratır.</p>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>Daily Routines (Günlük Rutinler)</h3>
        <p>Daha ileri seviye (8+ yaş). <em>wake up, brush my teeth, have breakfast, go to school, play, read, sleep</em>.</p>
      </article>

      <div style={{ padding: 24, borderRadius: 20, background: 'linear-gradient(135deg, #F3F0FF 0%, #E8EDFF 100%)', textAlign: 'center' }}>
        <Sparkles size={28} style={{ color: 'var(--primary)', marginBottom: 8 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 8px', color: 'var(--ink)' }}>İlk haftaya başlayalım</h3>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--ink-2)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Yukarıdaki müfredata göre çocuğunuzla başlayabilirsiniz. Tek bir konudan başlayın — örneğin renkler.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/slides" className="mm-btn primary" style={{ textDecoration: 'none' }}>Sunumlara Git</Link>
          <Link href="/blog" className="mm-btn" style={{ textDecoration: 'none' }}>Aileler için makaleler</Link>
        </div>
      </div>
    </div>
  )
}
