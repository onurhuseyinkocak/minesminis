import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, BookOpen, Award, Globe, Users, Sparkles, Quote, Languages, Zap } from 'lucide-react';

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
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="gallery-scroll">
          {[ataturkMilitary, ataturkSoldier, ataturkCommander, ataturkSaluting, ataturkPortrait2, ataturkHorse].map((img, i) => (
            <motion.div
              key={i}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="intro-content">
          <motion.img
            src={ataturkVector}
            alt="Atatürk"
            className="intro-image ataturk-photo"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="quotes-header">
          <motion.img
            src={ataturkFormal}
            alt="Atatürk"
            className="quotes-portrait ataturk-photo"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
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
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          />
          <motion.img
            src={ataturkRepublic}
            alt="Atatürk Republic"
            className="timeline-img-right ataturk-photo"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
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
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="reforms-header">
          <motion.img
            src={ataturkFlag}
            alt="Turkish Flag with Atatürk"
            className="reforms-flag ataturk-photo"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="legacy-content">
          <motion.img
            src={ataturkSaluting}
            alt="Atatürk Saluting"
            className="legacy-image ataturk-photo"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
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
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={ataturkSilhouette}
          alt="Atatürk"
          className="footer-silhouette"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
        />
        <div className="banner-content">
          <h3>{t.footerMain}</h3>
          <img src={ataturkSignature} alt="İmza" className="footer-signature" />
        </div>
      </motion.section>

      <style>{`
        .ataturk-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%);
          color: white;
          position: relative;
          overflow-x: hidden;
          padding: 2.5rem 1.5rem;
        }

        /* Language Toggle */
        .language-toggle {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(26, 26, 46, 0.95);
          backdrop-filter: blur(10px);
          padding: 10px 20px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .language-toggle svg { color: #dc2626; }

        .language-toggle button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .language-toggle button:hover { color: white; }
        .language-toggle button.active { 
          color: white; 
          background: rgba(220, 38, 38, 0.3);
        }

        .language-toggle .divider { color: rgba(255,255,255,0.3); }

        /* Mimi Respect */
        .mimi-respect {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mimi-dragon { animation: bounce 2s infinite; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .mimi-action {
          font-size: 2rem;
          animation: point 0.5s ease-out;
        }

        @keyframes point {
          0% { transform: scale(0) rotate(-45deg); }
          100% { transform: scale(1) rotate(0); }
        }

        .mimi-hearts {
          display: flex;
          gap: 5px;
          font-size: 1.5rem;
        }

        .mimi-hearts span:nth-child(2) { animation-delay: 0.2s; }
        .mimi-hearts span:nth-child(3) { animation-delay: 0.4s; }

        /* Hero Section Redesign */
        .hero-section {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          background: #0a0a0f;
          overflow: hidden;
          padding: 4rem 2rem;
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.05) 0%, transparent 50%);
          z-index: 2;
        }

        .hero-silhouette {
          position: absolute;
          left: 5%;
          bottom: 0;
          height: 90%;
          object-fit: contain;
          opacity: 0.05;
          z-index: 1;
        }

        .hero-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-image-col {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .portrait-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
        }

        .hero-portrait {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 40px rgba(0,0,0,0.8));
          position: relative;
          z-index: 2;
        }

        .portrait-glow {
          position: absolute;
          inset: 10%;
          background: radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%);
          filter: blur(40px);
          z-index: 1;
        }

        .hero-content-col {
          text-align: left;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-content-col h1 {
          font-size: clamp(3rem, 5vw, 5.5rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 1.5rem;
          color: white;
        }

        .hero-content-col .highlight {
          display: block;
          background: linear-gradient(90deg, #fbbf24, #f59e0b, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 10px rgba(0,0,0,0.3));
        }

        .hero-subtitle {
          font-size: 2.2rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: 8px;
          margin-bottom: 2.5rem;
          border-left: 4px solid #dc2626;
          padding-left: 20px;
        }

        .hero-desc-box {
          position: relative;
          max-width: 650px;
        }

        .hero-desc {
          font-size: 1.25rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2.5rem;
          font-weight: 400;
        }

        .hero-signature {
          max-width: 300px;
          filter: brightness(0) invert(1);
          opacity: 0.8;
          display: block;
        }

        /* Gallery Strip */
        .gallery-strip {
          background: linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%);
          padding: 3rem 0;
          overflow: hidden;
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .gallery-scroll {
          display: flex;
          gap: 2rem;
          padding: 1rem 2rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
        }

        .gallery-scroll::-webkit-scrollbar { height: 8px; }
        .gallery-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .gallery-scroll::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #dc2626, #fbbf24); border-radius: 10px; }

        .gallery-item {
          flex: 0 0 auto;
          scroll-snap-align: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .gallery-item:hover {
          border-color: rgba(220, 38, 38, 0.5);
          box-shadow: 0 10px 40px rgba(220, 38, 38, 0.2);
        }

        .gallery-item img {
          height: 200px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
        }

        /* Introduction */
        .intro-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .intro-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 4rem;
          align-items: center;
        }

        .intro-image {
          max-width: 300px;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));
        }

        .intro-text { text-align: left; }

        .intro-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 8px 30px rgba(220, 38, 38, 0.3);
        }

        .intro-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          background: linear-gradient(90deg, #fff, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .intro-section p {
          font-size: 1.15rem;
          line-height: 1.9;
          color: rgba(255,255,255,0.85);
          margin-bottom: 1.5rem;
        }

        /* Quotes */
        .quotes-section {
          padding: 6rem 2rem;
          background: #1a1a2e;
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .quotes-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .quotes-portrait {
          max-height: 300px;
          margin-bottom: 2rem;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.4));
        }

        .quotes-section h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .quotes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .quote-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .quote-card:hover {
          border-color: rgba(220, 38, 38, 0.5);
          box-shadow: 0 8px 30px rgba(220, 38, 38, 0.15);
        }

        .quote-icon {
          font-size: 4rem;
          font-family: Georgia, serif;
          color: #dc2626;
          opacity: 0.5;
          position: absolute;
          top: 10px;
          left: 20px;
          line-height: 1;
        }

        .quote-text {
          font-size: 1.1rem;
          font-style: italic;
          color: white;
          line-height: 1.7;
          margin-bottom: 1rem;
          padding-top: 1rem;
        }

        .quote-turkish {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1rem;
        }

        /* Timeline */
        .timeline-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          position: relative;
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .timeline-section h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: white;
        }

        .timeline-images {
          position: absolute;
          left: 0;
          right: 0;
          top: 150px;
          display: flex;
          justify-content: space-between;
          padding: 0 2rem;
          pointer-events: none;
          opacity: 0.3;
        }

        .timeline-img-left, .timeline-img-right {
          max-height: 300px;
          object-fit: contain;
        }

        .timeline {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #dc2626, #fbbf24);
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .timeline-item {
          position: relative;
          width: 50%;
          padding: 0 40px 60px;
        }

        .timeline-item.left { left: 0; text-align: right; }
        .timeline-item.right { left: 50%; text-align: left; }

        .timeline-content {
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .timeline-year {
          position: absolute;
          top: -12px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          color: white;
          padding: 6px 16px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .timeline-item.left .timeline-year { right: 20px; }
        .timeline-item.right .timeline-year { left: 20px; }

        .timeline-icon {
          width: 40px;
          height: 40px;
          background: rgba(220, 38, 38, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .timeline-item.left .timeline-icon { margin-left: auto; }

        .timeline-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.75rem;
        }

        .timeline-content p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
        }

        /* Reforms */
        .reforms-section {
          padding: 6rem 2rem;
          background: #1a1a2e;
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .reforms-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .reforms-flag {
          max-width: 400px;
          margin-bottom: 2rem;
          filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.3));
        }

        .reforms-section h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .reforms-intro {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .reforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .reform-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .reform-card:hover {
          border-color: rgba(251, 191, 36, 0.5);
          box-shadow: 0 8px 30px rgba(251, 191, 36, 0.15);
        }

        .reform-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

        .reform-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.75rem;
        }

        .reform-card p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
        }

        /* Legacy */
        .legacy-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%);
          margin: 0 auto 3rem;
          max-width: 1400px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .legacy-content {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 4rem;
          align-items: center;
        }

        .legacy-image {
          max-width: 250px;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));
        }

        .legacy-text { text-align: left; }

        .legacy-text h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #dc2626;
        }

        .legacy-text p {
          font-size: 1.15rem;
          line-height: 1.9;
          color: rgba(255,255,255,0.85);
          margin-bottom: 1.5rem;
        }

        .legacy-quote {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.05));
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .legacy-quote svg { color: #dc2626; margin-bottom: 1rem; }

        .legacy-quote p {
          font-size: 1.3rem;
          font-style: italic;
          color: white;
          margin: 0;
        }

        /* Footer Banner */
        .footer-banner {
          position: relative;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          padding: 5rem 2rem;
          text-align: center;
          overflow: hidden;
        }

        .footer-silhouette {
          position: absolute;
          right: -10%;
          bottom: -10%;
          height: 150%;
          object-fit: contain;
          pointer-events: none;
        }

        .banner-content {
          position: relative;
          z-index: 2;
        }

        .banner-content h3 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .banner-content p {
          font-size: 1.3rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
        }

        .footer-signature {
          max-width: 200px;
          filter: brightness(0) invert(1);
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-content-col {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-image-col {
            order: -1;
            margin-bottom: 2rem;
          }

          .portrait-wrapper {
            max-width: 320px;
          }

          .hero-subtitle {
            border-left: none;
            padding-left: 0;
            font-size: 1.6rem;
            letter-spacing: 4px;
          }

          .hero-desc {
            font-size: 1.15rem;
          }

          .intro-content, .legacy-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          
          .intro-image, .legacy-image {
            margin: 0 auto;
            max-width: 250px;
          }
          
          .intro-text, .legacy-text {
            text-align: center;
          }
          
          .intro-icon, .legacy-text h2 {
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
          }

          .timeline-images { display: none; }
          .hero-silhouette { display: none; }
        }

        @media (max-width: 768px) {
          .language-toggle {
            top: auto;
            bottom: 80px;
            right: 10px;
            font-size: 0.85rem;
            padding: 8px 16px;
          }
          
          .hero-content-col h1 { font-size: 2.8rem; }
          .hero-subtitle { font-size: 1.3rem; }
          
          .gallery-item img { height: 150px; }
          
          .timeline-item {
            width: 100%;
            left: 0 !important;
            text-align: left !important;
            padding-left: 30px;
          }
          
          .timeline-line { left: 10px; }
          .timeline-item .timeline-year { left: 30px !important; right: auto !important; }
          .timeline-item .timeline-icon { margin-left: 0 !important; }
          
          .banner-content h3 { font-size: 2rem; }
          .banner-content p { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}

export default Ataturk;
