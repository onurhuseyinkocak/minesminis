import { motion } from 'framer-motion';
import { Star, Heart, BookOpen, Award, Globe, Users, Sparkles, Quote } from 'lucide-react';

function Ataturk() {
  const timelineEvents = [
    {
      year: '1881',
      title: 'Birth of a Leader',
      description: 'Mustafa Kemal was born in Thessaloniki (now in Greece). His father Ali Riza Efendi gave him the middle name "Kemal" meaning "perfection".',
      icon: <Star size={20} />
    },
    {
      year: '1905',
      title: 'Military Career Begins',
      description: 'Graduated from the War Academy in Istanbul as a captain. He was already known for his intelligence and leadership skills.',
      icon: <Award size={20} />
    },
    {
      year: '1915',
      title: 'Hero of Gallipoli',
      description: 'Led the Ottoman forces to victory at Gallipoli against Allied powers. His famous words: "I am not ordering you to attack. I am ordering you to die."',
      icon: <Heart size={20} />
    },
    {
      year: '1919',
      title: 'War of Independence',
      description: 'Landed in Samsun on May 19th, sparking the Turkish War of Independence. United the nation against occupation forces.',
      icon: <Users size={20} />
    },
    {
      year: '1923',
      title: 'Republic of Turkey Founded',
      description: 'On October 29, 1923, the Republic of Turkey was proclaimed. Mustafa Kemal became the first President.',
      icon: <Globe size={20} />
    },
    {
      year: '1934',
      title: 'Receives the Name "Atatürk"',
      description: 'The Turkish Parliament granted him the surname "Atatürk" meaning "Father of the Turks" - a name no one else can ever use.',
      icon: <Sparkles size={20} />
    }
  ];

  const reforms = [
    { title: 'Education Reform', desc: 'Made education free and mandatory for all children, including girls', icon: '📚' },
    { title: 'Alphabet Reform', desc: 'Changed the alphabet from Arabic script to Latin letters in 1928', icon: '🔤' },
    { title: "Women's Rights", desc: 'Gave women the right to vote and be elected - before many European countries!', icon: '👩' },
    { title: 'Modern Laws', desc: 'Created new civil, criminal, and commercial laws based on European models', icon: '⚖️' },
    { title: 'Secular State', desc: 'Separated religion from government to ensure freedom for all beliefs', icon: '🏛️' },
    { title: 'Economic Growth', desc: 'Built railways, factories, and banks to develop the Turkish economy', icon: '🏭' }
  ];

  const quotes = [
    { text: "Peace at home, peace in the world.", turkish: "Yurtta sulh, cihanda sulh." },
    { text: "The future is in the skies.", turkish: "İstikbal göklerdedir." },
    { text: "A nation without art and artists cannot have a full existence.", turkish: "Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir." },
    { text: "Teachers are the one and only people who save nations.", turkish: "Öğretmenler! Yeni nesil sizin eseriniz olacaktır." }
  ];

  return (
    <div className="ataturk-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Star size={16} fill="currentColor" />
            <span>Father of Modern Turkey</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Mustafa Kemal
            <span className="highlight">Atatürk</span>
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            1881 - 1938
          </motion.p>
          
          <motion.p
            className="hero-desc"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            The visionary leader who transformed Turkey into a modern, democratic nation.
            His legacy continues to inspire millions around the world.
          </motion.p>
        </div>
        
        <div className="hero-pattern"></div>
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
          <div className="intro-icon">
            <BookOpen size={32} />
          </div>
          <h2>Who Was Atatürk?</h2>
          <p>
            Mustafa Kemal Atatürk was a military genius, a brilliant statesman, and the founder of the 
            Republic of Turkey. After World War I, when the Ottoman Empire was collapsing and foreign 
            powers occupied Turkish lands, he led the Turkish people in a War of Independence and 
            created a new, modern nation from the ashes of an empire.
          </p>
          <p>
            He didn't just save his country - he completely transformed it. In just 15 years, he 
            modernized Turkey's education, law, economy, and society. He gave women equal rights, 
            created a new alphabet, and built the foundations of a democratic state.
          </p>
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
        <h2>
          <Quote size={28} />
          Words of Wisdom
        </h2>
        <div className="quotes-grid">
          {quotes.map((quote, index) => (
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

      {/* Timeline */}
      <motion.section 
        className="timeline-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>
          <Sparkles size={28} />
          His Life Journey
        </h2>
        <div className="timeline">
          {timelineEvents.map((event, index) => (
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
                <div className="timeline-icon">{event.icon}</div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </motion.div>
          ))}
          <div className="timeline-line"></div>
        </div>
      </motion.section>

      {/* Reforms */}
      <motion.section 
        className="reforms-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>
          <Award size={28} />
          Revolutionary Reforms
        </h2>
        <p className="reforms-intro">
          Atatürk transformed Turkey through bold reforms that modernized every aspect of society.
          Here are some of his most important changes:
        </p>
        <div className="reforms-grid">
          {reforms.map((reform, index) => (
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

      {/* Legacy */}
      <motion.section 
        className="legacy-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="legacy-content">
          <h2>
            <Heart size={28} fill="currentColor" />
            His Eternal Legacy
          </h2>
          <p>
            Atatürk passed away on November 10, 1938, but his spirit lives on in the hearts of 
            the Turkish people. Every year on this day, the entire nation stops at 9:05 AM to 
            honor his memory with a moment of silence.
          </p>
          <p>
            His principles of democracy, secularism, and modernization continue to guide Turkey 
            today. His vision of a peaceful, progressive nation that respects all people regardless 
            of religion, gender, or background remains the foundation of the Turkish Republic.
          </p>
          <div className="legacy-quote">
            <Quote size={24} />
            <p>"The future belongs to those who prepare for it today."</p>
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
        <div className="banner-content">
          <h3>Ne Mutlu Türküm Diyene!</h3>
          <p>How happy is the one who says "I am a Turk!"</p>
        </div>
      </motion.section>

      <style>{`
        .ataturk-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: white;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
        }

        .hero-section h1 {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }

        .hero-section h1 .highlight {
          display: block;
          background: linear-gradient(90deg, #fbbf24, #f59e0b, #dc2626);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .hero-desc {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Introduction */
        .intro-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%);
        }

        .intro-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .intro-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
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
        }

        .quotes-section h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
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
        }

        .timeline-section h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 4rem;
          color: white;
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

        .timeline-item.left {
          left: 0;
          text-align: right;
        }

        .timeline-item.right {
          left: 50%;
          text-align: left;
        }

        .timeline-content {
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
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
          text-align: center;
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto 3rem;
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

        .reform-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

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
        }

        .legacy-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .legacy-content h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #dc2626;
        }

        .legacy-content p {
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
          margin-top: 3rem;
        }

        .legacy-quote svg {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .legacy-quote p {
          font-size: 1.3rem;
          font-style: italic;
          color: white;
          margin: 0;
        }

        /* Footer Banner */
        .footer-banner {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          padding: 4rem 2rem;
          text-align: center;
        }

        .banner-content h3 {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }

        .banner-content p {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }

          .timeline-line {
            left: 20px;
          }

          .timeline-item {
            width: 100%;
            left: 0 !important;
            text-align: left !important;
            padding-left: 60px;
            padding-right: 20px;
          }

          .timeline-year {
            left: 0 !important;
            right: auto !important;
          }

          .timeline-icon {
            margin-left: 0 !important;
          }

          .quotes-grid, .reforms-grid {
            grid-template-columns: 1fr;
          }

          .banner-content h3 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Ataturk;
