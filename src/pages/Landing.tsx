import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  X,
  Menu,
  BookOpen,
  Ear,
  Globe,
  Puzzle,
  GraduationCap,
  Users,
  Shield,
  CheckCircle,
  Play,
  Sparkles,
  Music,
  BookText,
  Layers,
} from 'lucide-react';
import UnifiedMascot, { MascotState } from '../components/UnifiedMascot';
import BackgroundGradientAnimation from '../components/ui/BackgroundGradientAnimation';
import { mascotRoaming } from '../services/mascotRoaming';
import './Landing.css';

type Lang = 'en' | 'tr';
type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following' | 'goingHome';

const content = {
  en: {
    // Nav
    navHow: 'How It Works',
    navFor: 'For You',
    navStats: 'Results',
    loginBtn: 'Login',
    // Hero
    heroBadge: 'Montessori + Phonics Method',
    heroTitle: 'English Learning That Actually Works',
    heroSub: 'Research-backed phonics for Turkish children ages 3-10. 42 sounds. One dragon friend.',
    heroCtaPrimary: 'Start Learning',
    heroCtaSecondary: 'See How It Works',
    // Method
    methodTitle: 'A proven path to English fluency',
    phase1Title: 'Sound Discovery',
    phase1Age: 'Ages 3-5',
    phase1Desc: 'Children identify and produce 42 English phonemes',
    phase2Title: 'Word Building',
    phase2Age: 'Ages 5-7',
    phase2Desc: 'Blending sounds into words and sentences',
    phase3Title: 'Reading & Stories',
    phase3Age: 'Ages 7-9',
    phase3Desc: 'Decodable books using only mastered sounds',
    phase4Title: 'Independence',
    phase4Age: 'Ages 9-10',
    phase4Desc: 'Confident communication in English',
    // Audience
    audienceTitle: 'Built for everyone who cares about learning',
    tabStudents: 'Students',
    tabTeachers: 'Teachers',
    tabParents: 'Parents',
    studentFeatures: [
      '42 phonics sounds with actions',
      'Interactive blending games',
      'Decodable reading library',
      'Learning garden that grows with you',
    ],
    teacherFeatures: [
      'Free classroom management',
      'Join codes for students',
      'Phonics progress tracking',
      'Curriculum-aligned activities',
    ],
    parentFeatures: [
      'Real-time learning analytics',
      'Daily time controls',
      'Multi-child support',
      'Weekly progress insights',
    ],
    // Stats
    stat1Num: '42', stat1Label: 'Phonics Sounds',
    stat2Num: '14', stat2Label: 'Decodable Books',
    stat3Num: '7', stat3Label: 'Song Lessons',
    stat4Num: '4', stat4Label: 'Learning Phases',
    // CTA
    ctaTitle: 'Ready to start your child\'s English journey?',
    ctaSub: 'Free to begin. No credit card required.',
    ctaBtn: 'Create Free Account',
    // Footer
    footerTagline: 'Montessori + Phonics English for kids ages 3-10',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
  },
  tr: {
    // Nav
    navHow: 'Nasıl Çalışır',
    navFor: 'Kimler İçin',
    navStats: 'Sonuçlar',
    loginBtn: 'Giriş Yap',
    // Hero
    heroBadge: 'Montessori + Fonetik Yöntemi',
    heroTitle: 'Gerçekten İşe Yarayan İngilizce Öğrenme',
    heroSub: 'Türkiye\'deki 3-10 yaş arası çocuklar için araştırmaya dayalı fonetik. 42 ses. Bir ejderha arkadaş.',
    heroCtaPrimary: 'Öğrenmeye Başla',
    heroCtaSecondary: 'Nasıl Çalıştığını Gör',
    // Method
    methodTitle: 'İngilizce akıcılığına giden kanıtlanmış yol',
    phase1Title: 'Ses Keşfi',
    phase1Age: '3-5 Yaş',
    phase1Desc: 'Çocuklar 42 İngilizce fonemi tanır ve üretir',
    phase2Title: 'Kelime Kurma',
    phase2Age: '5-7 Yaş',
    phase2Desc: 'Sesleri kelimelere ve cümlelere harmanlama',
    phase3Title: 'Okuma & Hikayeler',
    phase3Age: '7-9 Yaş',
    phase3Desc: 'Yalnızca öğrenilen seslerle okunabilir kitaplar',
    phase4Title: 'Bağımsızlık',
    phase4Age: '9-10 Yaş',
    phase4Desc: 'İngilizce\'de güvenle iletişim kurma',
    // Audience
    audienceTitle: 'Öğrenmeyi önemseyen herkes için tasarlandı',
    tabStudents: 'Öğrenciler',
    tabTeachers: 'Öğretmenler',
    tabParents: 'Veliler',
    studentFeatures: [
      'Hareketlerle 42 fonetik ses',
      'Etkileşimli harmanlama oyunları',
      'Okunabilir okuma kütüphanesi',
      'Seninle büyüyen öğrenme bahçesi',
    ],
    teacherFeatures: [
      'Ücretsiz sınıf yönetimi',
      'Öğrenciler için katılım kodları',
      'Fonetik ilerleme takibi',
      'Müfredata uyumlu etkinlikler',
    ],
    parentFeatures: [
      'Gerçek zamanlı öğrenme analitiği',
      'Günlük süre kontrolleri',
      'Çoklu çocuk desteği',
      'Haftalık ilerleme raporları',
    ],
    // Stats
    stat1Num: '42', stat1Label: 'Fonetik Ses',
    stat2Num: '14', stat2Label: 'Okunabilir Kitap',
    stat3Num: '7', stat3Label: 'Şarkı Dersi',
    stat4Num: '4', stat4Label: 'Öğrenme Aşaması',
    // CTA
    ctaTitle: 'Çocuğunuzun İngilizce yolculuğuna başlamaya hazır mısınız?',
    ctaSub: 'Başlamak ücretsiz. Kredi kartı gerekmez.',
    ctaBtn: 'Ücretsiz Hesap Oluştur',
    // Footer
    footerTagline: '3-10 yaş çocuklar için Montessori + Fonetik İngilizce',
    footerPrivacy: 'Gizlilik',
    footerTerms: 'Şartlar',
  },
};

const mapState = (state: AnimationState): MascotState => {
  switch (state) {
    case 'following':
    case 'walking':
    case 'goingHome':
      return 'walking';
    case 'singing':
      return 'laughing';
    case 'surprised':
      return 'surprised';
    case 'jumping':
      return 'jumping';
    case 'celebrating':
      return 'celebrating';
    case 'dancing':
      return 'dancing';
    case 'sleeping':
      return 'sleeping';
    case 'waving':
      return 'waving';
    case 'laughing':
      return 'laughing';
    case 'thinking':
      return 'thinking';
    case 'love':
      return 'love';
    default:
      return 'idle';
  }
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'parents'>('students');

  // Roaming Mimi state
  const dragDistance = useRef(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 85, y: 75 });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [speechBubble, setSpeechBubble] = useState<{ message: string; duration: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showMimiModal, setShowMimiModal] = useState(false);

  useEffect(() => {
    const initialState = mascotRoaming.getCurrentState();
    setPosition({ ...initialState.position });
    setAnimationState(initialState.state as AnimationState);
    setSpeechBubble(initialState.bubble);

    const unsubscribe = mascotRoaming.onChange((newPos, newState, _, newBubble) => {
      setPosition({ ...newPos });
      setAnimationState(newState as AnimationState);
      setSpeechBubble(newBubble);
    });

    mascotRoaming.startRoaming();

    return () => {
      unsubscribe();
      mascotRoaming.stopRoaming();
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    mascotRoaming.updateMousePosition(x, y);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleMimiClick = () => {
    if (dragDistance.current > 5) return;
    mascotRoaming.triggerCelebration();
    setShowMimiModal(true);
  };

  const handleGoToLogin = () => {
    setShowMimiModal(false);
    navigate('/login');
  };

  const phases = [
    { icon: <Ear size={24} />, title: t.phase1Title, age: t.phase1Age, desc: t.phase1Desc, color: '#f59e0b' },
    { icon: <Puzzle size={24} />, title: t.phase2Title, age: t.phase2Age, desc: t.phase2Desc, color: '#8b5cf6' },
    { icon: <BookOpen size={24} />, title: t.phase3Title, age: t.phase3Age, desc: t.phase3Desc, color: '#14b8a6' },
    { icon: <Globe size={24} />, title: t.phase4Title, age: t.phase4Age, desc: t.phase4Desc, color: '#3b82f6' },
  ];

  const audienceData = {
    students: {
      label: t.tabStudents,
      icon: <GraduationCap size={20} />,
      features: t.studentFeatures,
    },
    teachers: {
      label: t.tabTeachers,
      icon: <Users size={20} />,
      features: t.teacherFeatures,
    },
    parents: {
      label: t.tabParents,
      icon: <Shield size={20} />,
      features: t.parentFeatures,
    },
  };

  const stats = [
    { num: t.stat1Num, label: t.stat1Label, icon: <Music size={20} /> },
    { num: t.stat2Num, label: t.stat2Label, icon: <BookText size={20} /> },
    { num: t.stat3Num, label: t.stat3Label, icon: <Play size={20} /> },
    { num: t.stat4Num, label: t.stat4Label, icon: <Layers size={20} /> },
  ];

  return (
    <div className="landing">
      {/* ===== NAVBAR ===== */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-nav__logo">
            <Sparkles size={20} />
            <span>Mines<strong>Minis</strong></span>
          </Link>

          <div className="landing-nav__links">
            <a href="#how-it-works">{t.navHow}</a>
            <a href="#for-you">{t.navFor}</a>
            <a href="#results">{t.navStats}</a>
            <Link to="/pricing">{lang === 'en' ? 'Pricing' : 'Fiyatlar'}</Link>
          </div>

          <div className="landing-nav__right">
            <div className="landing-nav__lang-pill">
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={lang === 'tr' ? 'active' : ''}
                onClick={() => setLang('tr')}
              >
                TR
              </button>
            </div>
            <Link to="/login" className="landing-nav__cta">
              {t.loginBtn} <ArrowRight size={16} />
            </Link>
            <button
              className="landing-nav__hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="landing-nav__mobile-menu">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>{t.navHow}</a>
              <a href="#for-you" onClick={() => setMobileMenuOpen(false)}>{t.navFor}</a>
              <a href="#results" onClick={() => setMobileMenuOpen(false)}>{t.navStats}</a>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                {lang === 'en' ? 'Pricing' : 'Fiyatlar'}
              </Link>
              <Link
                to="/login"
                className="landing-nav__cta"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.loginBtn} <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="landing-hero">
        <BackgroundGradientAnimation
          containerClassName="landing-hero__gradient"
          interactive={true}
        >
          <div className="landing-hero__inner">
            <div className="landing-hero__text">
              <motion.div
                className="landing-hero__badge"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BookOpen size={14} />
                <span>{t.heroBadge}</span>
              </motion.div>

              <h1 className="landing-hero__title">
                {t.heroTitle}
              </h1>

              <p className="landing-hero__sub">
                {t.heroSub}
              </p>

              <motion.div
                className="landing-hero__actions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="/login" className="landing-btn landing-btn--primary">
                  {t.heroCtaPrimary} <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works" className="landing-btn landing-btn--outline">
                  <Play size={16} /> {t.heroCtaSecondary}
                </a>
              </motion.div>
            </div>

            <motion.div
              className="landing-hero__visual"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="landing-hero__orb">
                <div className="landing-hero__orb-inner" />
              </div>
              <div className="landing-hero__mascot">
                <UnifiedMascot id="mimi_dragon" state="waving" size={160} />
              </div>
            </motion.div>
          </div>
        </BackgroundGradientAnimation>
      </section>

      {/* ===== SECTION 2: METHOD ===== */}
      <section className="landing-method" id="how-it-works">
        <div className="landing-method__inner">
          <motion.h2
            className="landing-section__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.methodTitle}
          </motion.h2>

          <div className="landing-method__grid">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                className="landing-method__card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div
                  className="landing-method__card-icon"
                  style={{ backgroundColor: `${phase.color}14`, color: phase.color }}
                >
                  {phase.icon}
                </div>
                <h3 className="landing-method__card-title">{phase.title}</h3>
                <span className="landing-method__card-age" style={{ color: phase.color }}>
                  {phase.age}
                </span>
                <p className="landing-method__card-desc">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: AUDIENCE TABS ===== */}
      <section className="landing-audience" id="for-you">
        <div className="landing-audience__inner">
          <motion.h2
            className="landing-section__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.audienceTitle}
          </motion.h2>

          <div className="landing-audience__tabs">
            {(['students', 'teachers', 'parents'] as const).map((tab) => (
              <button
                key={tab}
                className={`landing-audience__tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {audienceData[tab].icon}
                <span>{audienceData[tab].label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="landing-audience__card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ul className="landing-audience__list">
                {audienceData[activeTab].features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <CheckCircle size={20} className="landing-audience__check" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ===== SECTION 4: NUMBERS ===== */}
      <section className="landing-stats" id="results">
        <div className="landing-stats__inner">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="landing-stats__item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="landing-stats__number">{stat.num}</span>
              <span className="landing-stats__label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5: CTA ===== */}
      <section className="landing-cta">
        <motion.div
          className="landing-cta__inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="landing-cta__title">{t.ctaTitle}</h2>
          <p className="landing-cta__sub">{t.ctaSub}</p>
          <Link to="/login" className="landing-btn landing-btn--primary">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <Sparkles size={16} />
            <span>Mines<strong>Minis</strong></span>
          </div>
          <p className="landing-footer__tagline">{t.footerTagline}</p>
          <div className="landing-footer__links">
            <Link to="/privacy">{t.footerPrivacy}</Link>
            <Link to="/terms">{t.footerTerms}</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <p className="landing-footer__copy">
            &copy; {new Date().getFullYear()} MinesMinis
          </p>
        </div>
      </footer>

      {/* ===== ROAMING MIMI ===== */}
      <div ref={constraintsRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
        <motion.div
          className="landing-mimi"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          whileDrag={{ scale: 1.15 }}
          onDragStart={() => mascotRoaming.stopRoaming()}
          onDrag={(_e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
            dragDistance.current = Math.abs(info.offset.x) + Math.abs(info.offset.y);
          }}
          onDragEnd={() => {
            setTimeout(() => { dragDistance.current = 0; }, 100);
            mascotRoaming.startRoaming();
          }}
          style={{
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            cursor: 'grab',
            pointerEvents: 'auto',
            transition: animationState === 'following'
              ? 'left 0.3s ease-out, top 0.3s ease-out'
              : (animationState === 'walking' || animationState === 'goingHome')
                ? 'left 4s cubic-bezier(0.25, 0.1, 0.25, 1), top 4s cubic-bezier(0.25, 0.1, 0.25, 1)'
                : 'none',
          }}
        >
          <div
            className="landing-mimi__click"
            onClick={handleMimiClick}
            onMouseEnter={() => { setIsHovered(true); mascotRoaming.onHover(); }}
            onMouseLeave={() => setIsHovered(false)}
          >
            {speechBubble && (
              <div className="landing-mimi__bubble">{speechBubble.message}</div>
            )}
            <UnifiedMascot
              id="mimi_dragon"
              state={mapState(animationState)}
              isHovered={isHovered}
              size={90}
            />
          </div>
        </motion.div>
      </div>

      {/* ===== MIMI MODAL ===== */}
      <AnimatePresence>
        {showMimiModal && (
          <motion.div
            className="landing-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMimiModal(false)}
          >
            <motion.div
              className="landing-modal"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="landing-modal__close"
                onClick={() => setShowMimiModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="landing-modal__mascot">
                <UnifiedMascot id="mimi_dragon" state="celebrating" size={100} />
              </div>
              <h3>{lang === 'en' ? 'Come play with Mimi!' : 'Mimi ile oynayalım!'}</h3>
              <p>
                {lang === 'en'
                  ? 'Login to start your English adventure. Games, videos, words -- all waiting for you!'
                  : 'İngilizce macerana başlamak için giriş yap. Oyunlar, videolar, kelimeler -- hepsi seni bekliyor!'}
              </p>
              <button className="landing-btn landing-btn--primary" onClick={handleGoToLogin}>
                {t.loginBtn} <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
