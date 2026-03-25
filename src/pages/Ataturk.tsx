import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Heart, BookOpen, Award, Globe, Users, Sparkles, Quote, Languages, Zap, ArrowLeft } from 'lucide-react';
import './Ataturk.css';

import ataturkFormal from '@assets/ataturk_images/ataturk-formal.png';
import ataturkMilitary from '@assets/ataturk_images/ataturk-military.png';
import ataturkSignature from '@assets/ataturk_images/ataturk-signature.png';
import ataturkHorse from '@assets/ataturk_images/ataturk-horse.png';
import ataturkSilhouette from '@assets/ataturk_images/ataturk-silhouette.png';
import ataturkFlag from '@assets/ataturk_images/ataturk-flag.png';
import ataturkSaluting from '@assets/ataturk_images/ataturk-saluting.png';
import ataturkPortrait2 from '@assets/ataturk_images/ataturk-portrait2.png';
import ataturkSoldier from '@assets/ataturk_images/ataturk-soldier.png';
import ataturkVector from '@assets/ataturk_images/ataturk-vector.png';
import ataturkCommander from '@assets/ataturk_images/ataturk-commander.png';
import ataturkRepublic from '@assets/ataturk_images/ataturk-republic.png';

type Language = 'en' | 'tr';

const content = {
  en: {
    badge: 'Our Beloved Leader',
    heroDesc: 'The visionary leader who transformed our homeland into a modern, democratic nation. His legacy lives in our hearts and continues to guide us.',
    whoTitle: 'Who Is Atatürk?',
    whoPara1: 'Mustafa Kemal Atatürk was a military genius, a brilliant statesman, and the founder of our Republic. After World War I, when our homeland was under threat and foreign powers occupied our lands, he led our people in a War of Independence and created our modern nation from the ashes of an empire.',
    whoPara2: "He didn't just save our country - he completely transformed it. In just 15 years, he modernized our education, law, economy, and society. He gave our women equal rights, created our new alphabet, and built the foundations of our democratic state. We owe everything to him.",
    quotesTitle: 'Words of Our Leader',
    timelineTitle: 'His Life Journey',
    reformsTitle: 'Revolutionary Reforms',
    reformsIntro: 'Atatürk transformed our nation through bold reforms that modernized every aspect of our society. Here are some of his most important changes that shaped our country:',
    legacyTitle: 'Our Eternal Leader',
    legacyPara1: 'Atatürk passed away on November 10, 1938, but his spirit lives forever in our hearts. Every year on this day, our entire nation stops at 9:05 AM to honor his memory with a moment of silence. He will always be our beloved leader.',
    legacyPara2: 'His principles of democracy, secularism, and modernization continue to guide our country today. His vision of a peaceful, progressive nation that respects all people regardless of religion, gender, or background remains the foundation of our Republic.',
    legacyQuote: '"The future belongs to those who prepare for it today."',
    footerMain: 'Ne Mutlu Türküm Diyene!',
    galleryTitle: 'Photo Gallery',
    timeline: [
      { year: '1881', title: 'Birth of Our Leader', desc: 'Mustafa Kemal was born in Thessaloniki. His father Ali Riza Efendi gave him the middle name "Kemal" meaning "perfection" - and perfect he was for our nation.' },
      { year: '1905', title: 'Military Career Begins', desc: 'Graduated from the War Academy in Istanbul as a captain. He was already known for his intelligence and leadership skills that would later save our nation.' },
      { year: '1915', title: 'Hero of Gallipoli', desc: 'Led our forces to victory at Gallipoli against Allied powers. His famous words: "I am not ordering you to attack. I am ordering you to die." showed his dedication to our homeland.' },
      { year: '1919', title: 'Our War of Independence', desc: 'Landed in Samsun on May 19th, sparking our War of Independence. He united our nation against occupation forces and gave us hope.' },
      { year: '1923', title: 'Our Republic Founded', desc: 'On October 29, 1923, our Republic was proclaimed. Mustafa Kemal became our first President and the father of our nation.' },
      { year: '1934', title: 'Receives the Name "Atatürk"', desc: 'Our Parliament granted him the surname "Atatürk" meaning "Father of the Turks" - a name no one else can ever use. He truly is our father.' }
    ],
    reforms: [
      { title: 'Education Reform', desc: 'Made education free and mandatory for all our children, including girls', icon: <BookOpen size={24} /> },
      { title: 'Alphabet Reform', desc: 'Changed our alphabet from Arabic script to Latin letters in 1928', icon: <Languages size={24} /> },
      { title: "Women's Rights", desc: 'Gave our women the right to vote and be elected - before many European countries!', icon: <Users size={24} /> },
      { title: 'Modern Laws', desc: 'Created new civil, criminal, and commercial laws for our modern nation', icon: <Award size={24} /> },
      { title: 'Secular State', desc: 'Separated religion from government to ensure freedom for all our citizens', icon: <Globe size={24} /> },
      { title: 'Economic Growth', desc: 'Built railways, factories, and banks to develop our economy', icon: <Zap size={24} /> }
    ],
    quotes: [
      { text: "Peace at home, peace in the world.", turkish: "Yurtta sulh, cihanda sulh." },
      { text: "The future is in the skies.", turkish: "İstikbal göklerdedir." },
      { text: "A nation without art and artists cannot have a full existence.", turkish: "Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir." },
      { text: "Teachers are the one and only people who save nations.", turkish: "Öğretmenler! Yeni nesil sizin eseriniz olacaktır." }
    ]
  },
  tr: {
    badge: 'Sevgili Liderimiz',
    heroDesc: 'Vatanımızı modern, demokratik bir devlete dönüştüren vizyoner liderimiz. Mirası kalbimizde yaşıyor ve bize yol göstermeye devam ediyor.',
    whoTitle: 'Atatürk Kimdir?',
    whoPara1: 'Mustafa Kemal Atatürk, askeri bir deha, parlak bir devlet adamı ve Cumhuriyetimizin kurucusudur. Birinci Dünya Savaşı\'ndan sonra, vatanımız tehdit altındayken ve yabancı güçler topraklarımızı işgal ederken, milletimizi bir Kurtuluş Savaşı\'nda liderlik ederek modern ulusumuzu bir imparatorluğun küllerinden yarattı.',
    whoPara2: 'Sadece ülkemizi kurtarmakla kalmadı - onu tamamen dönüştürdü. Sadece 15 yıl içinde eğitimimizi, hukukumuzu, ekonomimizi ve toplumumuzu modernleştirdi. Kadınlarımıza eşit haklar verdi, yeni alfabemizi oluşturdu ve demokratik devletimizin temellerini attı. Her şeyimizi ona borçluyuz.',
    quotesTitle: 'Liderimizin Sözleri',
    timelineTitle: 'Hayat Yolculuğu',
    reformsTitle: 'Devrimci Reformlar',
    reformsIntro: 'Atatürk, toplumumuzun her alanını modernleştiren cesur reformlarla vatanımızı dönüştürdü. İşte ülkemizi şekillendiren en önemli değişiklikler:',
    legacyTitle: 'Ölümsüz Liderimiz',
    legacyPara1: 'Atatürk 10 Kasım 1938\'de aramızdan ayrıldı, ancak ruhu kalbimizde sonsuza dek yaşıyor. Her yıl bu günde, tüm milletimiz saat 9:05\'te onun anısına bir dakikalık saygı duruşunda bulunuyor. O her zaman sevgili liderimiz olacak.',
    legacyPara2: 'Demokrasi, laiklik ve modernleşme ilkeleri bugün ülkemize yol göstermeye devam ediyor. Din, cinsiyet veya geçmişe bakılmaksızın tüm insanlara saygı duyan barışçıl, ilerici bir ulus vizyonu, Cumhuriyetimizin temeli olmaya devam ediyor.',
    legacyQuote: '"Gelecek, bugün ona hazırlananlarındır."',
    footerMain: 'Ne Mutlu Türküm Diyene!',
    galleryTitle: 'Fotoğraf Galerisi',
    timeline: [
      { year: '1881', title: 'Liderimizin Doğuşu', desc: 'Mustafa Kemal, Selanik\'te doğdu. Babası Ali Rıza Efendi ona "mükemmellik" anlamına gelen "Kemal" ikinci adını verdi - milletimiz için gerçekten mükemmeldi.' },
      { year: '1905', title: 'Askeri Kariyer Başlıyor', desc: 'İstanbul\'daki Harp Akademisi\'nden yüzbaşı olarak mezun oldu. Daha sonra milletimizi kurtaracak zekası ve liderlik becerileriyle tanınıyordu.' },
      { year: '1915', title: 'Çanakkale Kahramanı', desc: 'Çanakkale\'de kuvvetlerimizi İtilaf güçlerine karşı zafere taşıdı. "Size savaşmanızı emretmiyorum. Ölmenizi emrediyorum" sözleri vatanımıza olan bağlılığını gösterdi.' },
      { year: '1919', title: 'Kurtuluş Savaşımız', desc: '19 Mayıs\'ta Samsun\'a çıkarak Kurtuluş Savaşımızı başlattı. Milletimizi işgal kuvvetlerine karşı birleştirdi ve bize umut verdi.' },
      { year: '1923', title: 'Cumhuriyetimiz Kuruluyor', desc: '29 Ekim 1923\'te Cumhuriyetimiz ilan edildi. Mustafa Kemal ilk Cumhurbaşkanımız ve milletimizin babası oldu.' },
      { year: '1934', title: '"Atatürk" Soyadını Alıyor', desc: 'Meclisimiz ona "Türklerin Babası" anlamına gelen "Atatürk" soyadını verdi - başka kimsenin kullanamayacağı bir isim. O gerçekten babamızdır.' }
    ],
    reforms: [
      { title: 'Eğitim Reformu', desc: 'Kız çocuklarımız dahil tüm çocuklarımız için eğitimi ücretsiz ve zorunlu hale getirdi', icon: <BookOpen size={24} /> },
      { title: 'Alfabe Reformu', desc: '1928\'de alfabemizi Arap harflerinden Latin harflerine değiştirdi', icon: <Languages size={24} /> },
      { title: 'Kadın Hakları', desc: 'Kadınlarımıza birçok Avrupa ülkesinden önce seçme ve seçilme hakkı verdi!', icon: <Users size={24} /> },
      { title: 'Modern Yasalar', desc: 'Modern ulusumuz için yeni medeni, ceza ve ticaret kanunları oluşturdu', icon: <Award size={24} /> },
      { title: 'Laik Devlet', desc: 'Tüm vatandaşlarımıza özgürlük sağlamak için dini devletten ayırdı', icon: <Globe size={24} /> },
      { title: 'Ekonomik Büyüme', desc: 'Ekonomimizi geliştirmek için demiryolları, fabrikalar ve bankalar kurdu', icon: <Zap size={24} /> }
    ],
    quotes: [
      { text: "Yurtta sulh, cihanda sulh.", turkish: "Peace at home, peace in the world." },
      { text: "İstikbal göklerdedir.", turkish: "The future is in the skies." },
      { text: "Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir.", turkish: "A nation without art and artists cannot have a full existence." },
      { text: "Öğretmenler! Yeni nesil sizin eseriniz olacaktır.", turkish: "Teachers are the one and only people who save nations." }
    ]
  }
};

const timelineIcons = [Star, Award, Heart, Users, Globe, Sparkles];

function Ataturk() {
  const [lang, setLang] = useState<Language>('en');

  const t = content[lang];

  return (
    <div className="ataturk-page">
      {/* Back Button */}
      <Link to="/" className="ataturk-back-btn">
        <ArrowLeft size={18} />
        <span>Home</span>
      </Link>

      {/* Language Toggle */}
      <motion.div
        className="language-toggle"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Languages size={20} />
        <button
          className={lang === 'en' ? 'active' : ''}
          onClick={() => setLang('en')}
        >
          English
        </button>
        <span className="divider">|</span>
        <button
          className={lang === 'tr' ? 'active' : ''}
          onClick={() => setLang('tr')}
        >
          Türkçe
        </button>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <motion.img
            src={ataturkSilhouette}
            alt="Atatürk Silhouette"
            className="hero-silhouette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ delay: 0.5, duration: 2 }}
          />
          <div className="hero-pattern"></div>
        </div>

        <div className="hero-container">
          <div className="hero-grid">
            <motion.div
              className="hero-image-col"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div className="portrait-wrapper">
                <img
                  src={ataturkFormal}
                  alt="Atatürk"
                  className="hero-portrait ataturk-photo"
                />
                <div className="portrait-glow"></div>
              </div>
            </motion.div>

            <motion.div
              className="hero-content-col"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div className="hero-badge">
                <Star size={16} fill="currentColor" />
                <span>{t.badge}</span>
              </div>

              <h1>
                Mustafa Kemal
                <span className="highlight">Atatürk</span>
              </h1>

              <p className="hero-subtitle">1881 - 1938</p>

              <div className="hero-desc-box">
                <p className="hero-desc">{t.heroDesc}</p>
                <motion.img
                  src={ataturkSignature}
                  alt="Atatürk İmza"
                  className="hero-signature"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Photo Gallery Strip */}
      <motion.section
        className="gallery-strip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="gallery-scroll">
          {[ataturkMilitary, ataturkSoldier, ataturkCommander, ataturkSaluting, ataturkPortrait2, ataturkHorse].map((img, i) => (
            <motion.div
              key={i}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <img src={img} alt={`Atatürk ${i + 1}`} className="ataturk-photo" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Introduction */}
      <motion.section
        className="intro-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="intro-content">
          <motion.img
            src={ataturkVector}
            alt="Atatürk"
            className="intro-image ataturk-photo"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          />
          <div className="intro-text">
            <div className="intro-icon">
              <BookOpen size={32} />
            </div>
            <h2>{t.whoTitle}</h2>
            <p>{t.whoPara1}</p>
            <p>{t.whoPara2}</p>
          </div>
        </div>
      </motion.section>

      {/* Famous Quotes */}
      <motion.section
        className="quotes-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="quotes-header">
          <motion.img
            src={ataturkFormal}
            alt="Atatürk"
            className="quotes-portrait ataturk-photo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          <h2>
            <Quote size={28} />
            {t.quotesTitle}
          </h2>
        </div>
        <div className="quotes-grid">
          {t.quotes.map((quote, index) => (
            <motion.div
              key={index}
              className="quote-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <div className="quote-icon">"</div>
              <p className="quote-text">{quote.text}</p>
              <p className="quote-turkish">{quote.turkish}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Timeline with Images */}
      <motion.section
        className="timeline-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <h2>
          <Sparkles size={28} />
          {t.timelineTitle}
        </h2>

        <div className="timeline-images">
          <motion.img
            src={ataturkHorse}
            alt="Atatürk on Horse"
            className="timeline-img-left ataturk-photo"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          />
          <motion.img
            src={ataturkRepublic}
            alt="Atatürk Republic"
            className="timeline-img-right ataturk-photo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          />
        </div>

        <div className="timeline">
          {t.timeline.map((event, index) => {
            const IconComponent = timelineIcons[index];
            return (
              <motion.div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{event.year}</div>
                  <div className="timeline-icon">
                    <IconComponent size={20} />
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                </div>
              </motion.div>
            );
          })}
          <div className="timeline-line"></div>
        </div>
      </motion.section>

      {/* Reforms with Flag */}
      <motion.section
        className="reforms-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="reforms-header">
          <motion.img
            src={ataturkFlag}
            alt="Turkish Flag with Atatürk"
            className="reforms-flag ataturk-photo"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          />
          <h2>
            <Award size={28} />
            {t.reformsTitle}
          </h2>
          <p className="reforms-intro">{t.reformsIntro}</p>
        </div>

        <div className="reforms-grid">
          {t.reforms.map((reform, index) => (
            <motion.div
              key={index}
              className="reform-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <span className="reform-icon">{reform.icon}</span>
              <h3>{reform.title}</h3>
              <p>{reform.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Legacy with Image */}
      <motion.section
        className="legacy-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="legacy-content">
          <motion.img
            src={ataturkSaluting}
            alt="Atatürk Saluting"
            className="legacy-image ataturk-photo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          <div className="legacy-text">
            <h2>
              <Heart size={28} fill="currentColor" />
              {t.legacyTitle}
            </h2>
            <p>{t.legacyPara1}</p>
            <p>{t.legacyPara2}</p>
            <div className="legacy-quote">
              <Quote size={24} />
              <p>{t.legacyQuote}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer Banner */}
      <motion.section
        className="footer-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <motion.img
          src={ataturkSilhouette}
          alt="Atatürk"
          className="footer-silhouette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
        <div className="banner-content">
          <h3>{t.footerMain}</h3>
          <img src={ataturkSignature} alt="İmza" className="footer-signature" />
        </div>
      </motion.section>

    </div>
  );
}

export default Ataturk;
