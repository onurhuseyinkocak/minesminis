import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Languages, ArrowRight, Star, BookOpen, Shield, Monitor,
  Gamepad2, Sparkles, GraduationCap, Heart,
} from 'lucide-react';
import { Button } from '../components/ui';
import Footer from '../components/layout/Footer';
import './Landing.css';

type Lang = 'en' | 'tr';

const content = {
  en: {
    navCta: 'Get Started',
    heroBadge: 'Premium English for Ages 1-10',
    heroTitle1: 'Little Words,',
    heroTitle2: 'Big Worlds',
    heroSub: 'A magical English learning journey guided by Mimi the dragon. Curriculum-based, research-backed, and designed for curious little minds.',
    heroCta: 'Start Your Adventure',
    heroSecondary: 'Learn More',
    worldsTag: 'Explore Worlds',
    worldsTitle: 'Every World is a New Adventure',
    worldsSub: 'From first words to confident sentences, Mimi guides your child through themed worlds full of games, stories, and discovery.',
    world1: 'Hello World',
    world1Desc: 'First words, greetings, colors and numbers',
    world1Age: 'Ages 1-3',
    world2: 'My Family',
    world2Desc: 'Family members, home, daily routines',
    world2Age: 'Ages 3-5',
    world3: 'Animal Kingdom',
    world3Desc: 'Animals, nature, habitats and sounds',
    world3Age: 'Ages 4-7',
    world4: 'Story Town',
    world4Desc: 'Reading, storytelling, creative expression',
    world4Age: 'Ages 6-10',
    howTag: 'How It Works',
    howTitle: 'Start Learning in 3 Simple Steps',
    howStep1: 'Choose Age Group',
    howStep1Desc: 'We tailor the experience to your child\'s level and learning style.',
    howStep2: 'Meet Mimi',
    howStep2Desc: 'Your child\'s friendly dragon guide who makes learning feel like play.',
    howStep3: 'Start the Adventure',
    howStep3Desc: 'Explore worlds, play games, and watch English skills blossom.',
    featTag: 'Why MinesMinis',
    featTitle: 'Built for Real Learning',
    feat1: 'Curriculum-Based',
    feat1Desc: 'Aligned with national education standards. Every game teaches purposefully.',
    feat2: 'Smart Board Ready',
    feat2Desc: 'Works beautifully on classroom smart boards with large touch targets.',
    feat3: 'Safe for Kids',
    feat3Desc: 'No ads, no external links, no data collection. COPPA compliant.',
    feat4: 'Fun & Engaging',
    feat4Desc: 'Games, stories, songs and rewards that keep children motivated.',
    trustTitle: 'Trusted by Parents & Teachers',
    trustStat1: '1,000+',
    trustLabel1: 'Active Learners',
    trustStat2: '50+',
    trustLabel2: 'Schools',
    trustStat3: '4.9',
    trustLabel3: 'Parent Rating',
    ctaTitle: 'Ready to Begin the Adventure?',
    ctaSub: 'Join thousands of families learning English the fun way with Mimi.',
    ctaBtn: 'Start Free Today',
  },
  tr: {
    navCta: 'Basla',
    heroBadge: '1-10 Yas Arasi Premium Ingilizce',
    heroTitle1: 'Kucuk Kelimeler,',
    heroTitle2: 'Buyuk Dunyalar',
    heroSub: 'Ejderha Mimi rehberliginde sihirli bir Ingilizce ogrenme yolculugu. Mufredata dayali, arastirmalarla desteklenmis ve merakli kucuk beyinler icin tasarlanmis.',
    heroCta: 'Maceraya Basla',
    heroSecondary: 'Daha Fazla',
    worldsTag: 'Dunyelari Kesfet',
    worldsTitle: 'Her Dunya Yeni Bir Macera',
    worldsSub: 'Ilk kelimelerden guveni cumlelerine, Mimi cocugunuzu oyunlar, hikayeler ve kesflerle dolu tematik dunyalarda yonlendirir.',
    world1: 'Merhaba Dunya',
    world1Desc: 'Ilk kelimeler, selamlasmalar, renkler ve sayilar',
    world1Age: '1-3 Yas',
    world2: 'Ailem',
    world2Desc: 'Aile uyeleri, ev, gunluk rutinler',
    world2Age: '3-5 Yas',
    world3: 'Hayvanlar Alemi',
    world3Desc: 'Hayvanlar, doga, yasam alanlari ve sesler',
    world3Age: '4-7 Yas',
    world4: 'Hikaye Kasabasi',
    world4Desc: 'Okuma, hikaye anlatma, yaratici ifade',
    world4Age: '6-10 Yas',
    howTag: 'Nasil Calisir',
    howTitle: '3 Basit Adimda Ogrenmeye Basla',
    howStep1: 'Yas Grubunu Sec',
    howStep1Desc: 'Deneyimi cocugunuzun seviyesine ve ogrenme tarzina gore uyarliyoruz.',
    howStep2: 'Mimi ile Tanis',
    howStep2Desc: 'Cocugunuzun ogrenmeyi oyun gibi hissettiren sevimli ejderha rehberi.',
    howStep3: 'Maceraya Basla',
    howStep3Desc: 'Dunyelari kesfet, oyunlar oyna ve Ingilizce becerilerin cicelenmesini izle.',
    featTag: 'Neden MinesMinis',
    featTitle: 'Gercek Ogrenme Icin Tasarlandi',
    feat1: 'Mufredata Dayali',
    feat1Desc: 'Ulusal egitim standartlariyla uyumlu. Her oyun amacli ogretir.',
    feat2: 'Akilli Tahta Uyumlu',
    feat2Desc: 'Sinif akilli tahtalarinda buyuk dokunma hedefleriyle harika calisir.',
    feat3: 'Cocuklar Icin Guvenli',
    feat3Desc: 'Reklam yok, harici link yok, veri toplama yok. COPPA uyumlu.',
    feat4: 'Eglenceli & Ilgi Cekici',
    feat4Desc: 'Cocuklari motive eden oyunlar, hikayeler, sarkilar ve oduller.',
    trustTitle: 'Ebeveynler ve Ogretmenler Tarafindan Guveniliyor',
    trustStat1: '1.000+',
    trustLabel1: 'Aktif Ogrenci',
    trustStat2: '50+',
    trustLabel2: 'Okul',
    trustStat3: '4.9',
    trustLabel3: 'Ebeveyn Puani',
    ctaTitle: 'Maceraya Baslamaya Hazir misin?',
    ctaSub: 'Mimi ile eglenceli yoldan Ingilizce ogrenen binlerce aileye katil.',
    ctaBtn: 'Ucretsiz Basla',
  },
};

/* Animated counter hook */
const useAnimatedCounter = (target: number, duration: number, inView: boolean) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Landing = () => {
  const [lang, setLang] = useState<Lang>('tr');
  const t = content[lang];

  const trustRef = useRef<HTMLDivElement>(null);
  const trustInView = useInView(trustRef, { once: true });
  const animatedLearners = useAnimatedCounter(1000, 1500, trustInView);
  const animatedSchools = useAnimatedCounter(50, 1200, trustInView);

  const worlds = [
    { emoji: '🌍', name: t.world1, desc: t.world1Desc, age: t.world1Age, bg: 'var(--success-pale)' },
    { emoji: '🏠', name: t.world2, desc: t.world2Desc, age: t.world2Age, bg: 'var(--warning-pale)' },
    { emoji: '🦁', name: t.world3, desc: t.world3Desc, age: t.world3Age, bg: 'var(--info-pale)' },
    { emoji: '📖', name: t.world4, desc: t.world4Desc, age: t.world4Age, bg: 'var(--error-pale)' },
  ];

  const howSteps = [
    { icon: '🎂', title: t.howStep1, desc: t.howStep1Desc },
    { icon: '🐉', title: t.howStep2, desc: t.howStep2Desc },
    { icon: '🚀', title: t.howStep3, desc: t.howStep3Desc },
  ];

  const features = [
    { icon: <GraduationCap size={28} />, title: t.feat1, desc: t.feat1Desc, variant: 'amber' as const },
    { icon: <Monitor size={28} />, title: t.feat2, desc: t.feat2Desc, variant: 'teal' as const },
    { icon: <Shield size={28} />, title: t.feat3, desc: t.feat3Desc, variant: 'green' as const },
    { icon: <Gamepad2 size={28} />, title: t.feat4, desc: t.feat4Desc, variant: 'blue' as const },
  ];

  return (
    <div className="landing-page">
      {/* Language Toggle */}
      <div className="landing-lang-toggle">
        <Languages size={16} />
        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'tr' ? 'active' : ''} onClick={() => setLang('tr')}>TR</button>
      </div>

      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-brand">
          <Sparkles size={24} color="var(--primary)" />
          <span className="landing-nav-logo">Mines<span>Minis</span></span>
        </Link>
        <Link to="/login" className="landing-nav-cta">
          <Button variant="primary" size="sm" icon={<ArrowRight size={16} />}>
            {t.navCta}
          </Button>
        </Link>
      </nav>

      {/* ===== HERO ===== */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-text">
            <motion.div
              className="landing-hero-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Star size={14} /> {t.heroBadge}
            </motion.div>

            <motion.h1
              className="landing-hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t.heroTitle1}<br />
              <span className="highlight">{t.heroTitle2}</span>
            </motion.h1>

            <motion.p
              className="landing-hero-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.heroSub}
            </motion.p>

            <motion.div
              className="landing-hero-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/login">
                <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
                  {t.heroCta}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg" icon={<BookOpen size={20} />}>
                  {t.heroSecondary}
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="landing-hero-illustration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="landing-hero-mimi">
              <motion.span
                className="landing-hero-mimi-emoji"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                🐉
              </motion.span>
              <span className="landing-hero-float">✨</span>
              <span className="landing-hero-float">⭐</span>
              <span className="landing-hero-float">🌟</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WORLDS PREVIEW ===== */}
      <section className="landing-worlds">
        <div className="landing-worlds-inner">
          <div className="landing-section-header">
            <motion.div className="landing-section-tag" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <BookOpen size={16} /> {t.worldsTag}
            </motion.div>
            <motion.h2 className="landing-section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              {t.worldsTitle}
            </motion.h2>
            <motion.p className="landing-section-sub" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
              {t.worldsSub}
            </motion.p>
          </div>

          <div className="landing-worlds-grid">
            {worlds.map((w, i) => (
              <motion.div
                key={w.name}
                className="landing-world-card mm-card mm-card--elevated"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="landing-world-visual" style={{ background: w.bg }}>
                  {w.emoji}
                </div>
                <div className="landing-world-info">
                  <h3 className="landing-world-name">{w.name}</h3>
                  <p className="landing-world-desc">{w.desc}</p>
                  <span className="landing-world-age">{w.age}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="landing-how" id="how-it-works">
        <div className="landing-how-inner">
          <div className="landing-section-header">
            <motion.div className="landing-section-tag" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Heart size={16} /> {t.howTag}
            </motion.div>
            <motion.h2 className="landing-section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              {t.howTitle}
            </motion.h2>
          </div>

          <div className="landing-how-grid">
            <div className="landing-how-connector" />
            <div className="landing-how-connector" />
            {howSteps.map((s, i) => (
              <motion.div
                key={s.title}
                className="landing-how-step"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="landing-how-number">{i + 1}</div>
                <div className="landing-how-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="landing-features">
        <div className="landing-features-inner">
          <div className="landing-section-header">
            <motion.div className="landing-section-tag" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Sparkles size={16} /> {t.featTag}
            </motion.div>
            <motion.h2 className="landing-section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              {t.featTitle}
            </motion.h2>
          </div>

          <div className="landing-features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="landing-feature-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className={`landing-feature-icon landing-feature-icon--${f.variant}`}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="landing-trust" ref={trustRef}>
        <div className="landing-trust-inner">
          <motion.h2
            className="landing-trust-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t.trustTitle}
          </motion.h2>
          <motion.div
            className="landing-trust-stats"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div className="landing-trust-stat">
              <span className="landing-trust-stat-number">{animatedLearners.toLocaleString()}+</span>
              <span className="landing-trust-stat-label">{t.trustLabel1}</span>
            </div>
            <div className="landing-trust-stat">
              <span className="landing-trust-stat-number">{animatedSchools}+</span>
              <span className="landing-trust-stat-label">{t.trustLabel2}</span>
            </div>
            <div className="landing-trust-stat">
              <span className="landing-trust-stat-number">{t.trustStat3}</span>
              <span className="landing-trust-stat-label">{t.trustLabel3}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="landing-cta">
        <motion.div
          className="landing-cta-inner"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="landing-cta-mimi"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            🐉
          </motion.div>
          <h2 className="landing-cta-title">{t.ctaTitle}</h2>
          <p className="landing-cta-sub">{t.ctaSub}</p>
          <Link to="/login">
            <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
              {t.ctaBtn}
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
