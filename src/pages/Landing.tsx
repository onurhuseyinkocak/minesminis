import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight, Menu, BookOpen, Ear, Globe, Blocks, Users, GraduationCap, BarChart3, Shield, Clock, Baby, Brain, Repeat, MessageCircle, CheckCircle } from 'lucide-react';
import UnifiedMascot, { MascotState } from '../components/UnifiedMascot';
import { mascotRoaming } from '../services/mascotRoaming';
import ataturkFormal from '@assets/ataturk_images/ataturk-formal.png';
import { GLINTS } from '../config/GlintsConfig';
import './Landing.css';

type Lang = 'en' | 'tr';
type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following' | 'goingHome';

const content = {
  en: {
    // Mimi
    mimiBubble: 'Hi! I\'m Mimi \u{1F44B} Login to play with me!',
    mimiClickTitle: 'Come play with Mimi! \u{1F409}',
    mimiClickMsg: 'Login to start your English adventure. Games, videos, words \u2014 all waiting for you!',
    // Hero
    heroTitle: 'Montessori + Phonics English Learning',
    heroSub: 'Where Turkish children ages 3-10 learn English through sounds, stories, and play \u2014 guided by their dragon friend Mimi',
    ctaStudent: "I'm a Student \u2014 Start Learning",
    ctaTeacher: "I'm a Teacher \u2014 Free Classroom Tools",
    ctaParent: "I'm a Parent \u2014 Track Progress",
    // How it works
    howTitle: 'How It Works',
    howSub: 'A research-backed journey through four learning phases',
    phase1Title: 'Little Ears',
    phase1Age: 'Ages 3-5',
    phase1Tag: 'Sound Discovery',
    phase1Desc: 'Children discover English sounds through games and songs',
    phase2Title: 'Word Builders',
    phase2Age: 'Ages 5-7',
    phase2Tag: 'Phonics & Blending',
    phase2Desc: 'Children blend sounds into words: s-a-t \u2192 sat!',
    phase3Title: 'Story Makers',
    phase3Age: 'Ages 7-9',
    phase3Tag: 'Reading & Creating',
    phase3Desc: 'Children read stories and build sentences',
    phase4Title: 'Young Explorers',
    phase4Age: 'Ages 9-10',
    phase4Tag: 'Independence',
    phase4Desc: 'Children communicate confidently in English',
    // For each role
    roleTitle: 'Built for Everyone',
    roleSub: 'Students, teachers, and parents each get the tools they need',
    roleStudentTitle: 'For Students',
    roleStudentItems: [
      '42 English sounds with fun actions',
      'Interactive blending & spelling games',
      'Stories you can actually read with sounds you know',
      'Earn XP, badges, level up with Mimi',
    ],
    roleTeacherTitle: 'For Teachers',
    roleTeacherItems: [
      'Free classroom management tool',
      'Create classrooms with join codes',
      'Assign phonics units to your class',
      'Track every student\'s sound mastery',
      'Weekly progress reports',
    ],
    roleParentTitle: 'For Parents',
    roleParentItems: [
      'See exactly which sounds your child has mastered',
      'Daily activity reports',
      'Set screen time limits',
      'Multi-child support (up to 4)',
    ],
    // Methodology
    methTitle: 'Research-Backed Methods That Work',
    methSub: 'Every feature is grounded in proven language acquisition science',
    meth1: 'Synthetic Phonics',
    meth1Desc: 'Jolly Phonics approach \u2014 learn sounds, then blend them into words',
    meth2: 'Montessori Learning',
    meth2Desc: 'Self-paced, hands-on discovery at each child\'s own speed',
    meth3: 'Total Physical Response',
    meth3Desc: 'TPR \u2014 children learn by moving, acting, and doing',
    meth4: 'Comprehensible Input',
    meth4Desc: 'Krashen\'s i+1 \u2014 always just one step ahead',
    meth5: 'Spaced Repetition',
    meth5Desc: 'SM-2 algorithm ensures long-term retention',
    // Glints
    glintsTitle: 'The Glints',
    glintsSub: 'Choose your learning buddy. Each one gives you special powers on the site.',
    // Stats
    stat1Num: '42', stat1Label: 'English Sounds',
    stat2Num: '4', stat2Label: 'Learning Phases',
    stat3Num: '400+', stat3Label: 'Words to Learn',
    // Ataturk
    ataturkBadge: 'Our Beloved Leader',
    ataturkTitle: 'Mustafa Kemal Atat\u00fcrk',
    // Bottom CTA
    bottomCtaTitle: 'Ready to Start?',
    bottomCtaSub: 'Pick your role and begin the journey with Mimi',
    // Nav
    loginBtn: 'Login',
    navHow: 'How It Works',
    navFor: 'For You',
    navMethod: 'Method',
  },
  tr: {
    // Mimi
    mimiBubble: 'Merhaba! Ben Mimi \u{1F44B} Benimle oynamak i\u00e7in giri\u015f yap!',
    mimiClickTitle: 'Mimi ile oynayal\u0131m! \u{1F409}',
    mimiClickMsg: '\u0130ngilizce macerana ba\u015flamak i\u00e7in giri\u015f yap. Oyunlar, videolar, kelimeler \u2014 hepsi seni bekliyor!',
    // Hero
    heroTitle: 'Montessori + Fonetik \u0130ngilizce \u00d6\u011frenme',
    heroSub: '3-10 ya\u015f T\u00fcrk \u00e7ocuklar\u0131n ejderha arkada\u015flar\u0131 Mimi ile sesler, hikayeler ve oyunla \u0130ngilizce \u00f6\u011frendi\u011fi platform',
    ctaStudent: '\u00d6\u011frenciyim \u2014 \u00d6\u011frenmeye Ba\u015fla',
    ctaTeacher: '\u00d6\u011fretmenim \u2014 \u00dccretsiz S\u0131n\u0131f Ara\u00e7lar\u0131',
    ctaParent: 'Veliyim \u2014 \u0130lerlemeyi Takip Et',
    // How it works
    howTitle: 'Nas\u0131l \u00c7al\u0131\u015f\u0131r?',
    howSub: 'Ara\u015ft\u0131rmaya dayal\u0131 d\u00f6rt \u00f6\u011frenme a\u015famas\u0131',
    phase1Title: 'K\u00fc\u00e7\u00fck Kulaklar',
    phase1Age: '3-5 Ya\u015f',
    phase1Tag: 'Ses Ke\u015ffi',
    phase1Desc: '\u00c7ocuklar oyunlar ve \u015fark\u0131larla \u0130ngilizce sesleri ke\u015ffeder',
    phase2Title: 'Kelime Kuranlar',
    phase2Age: '5-7 Ya\u015f',
    phase2Tag: 'Fonetik & Harmanlanma',
    phase2Desc: '\u00c7ocuklar sesleri kelimelere d\u00f6n\u00fc\u015ft\u00fcr\u00fcr: s-a-t \u2192 sat!',
    phase3Title: 'Hikaye Yazarlar\u0131',
    phase3Age: '7-9 Ya\u015f',
    phase3Tag: 'Okuma & Yaratma',
    phase3Desc: '\u00c7ocuklar hikayeler okur ve c\u00fcmleler kurar',
    phase4Title: 'Gen\u00e7 Ka\u015fifler',
    phase4Age: '9-10 Ya\u015f',
    phase4Tag: 'Ba\u011f\u0131ms\u0131zl\u0131k',
    phase4Desc: '\u00c7ocuklar \u0130ngilizce\'yi g\u00fcvenle konu\u015fur',
    // For each role
    roleTitle: 'Herkes \u0130\u00e7in Tasarland\u0131',
    roleSub: '\u00d6\u011frenciler, \u00f6\u011fretmenler ve veliler i\u00e7in \u00f6zel ara\u00e7lar',
    roleStudentTitle: '\u00d6\u011frenciler \u0130\u00e7in',
    roleStudentItems: [
      'E\u011flenceli hareketlerle 42 \u0130ngilizce ses',
      'Etkile\u015fimli harmanlanma ve heceleme oyunlar\u0131',
      'Bildi\u011fin seslerle okuyabilece\u011fin hikayeler',
      'XP kazan, rozet topla, Mimi ile seviye atla',
    ],
    roleTeacherTitle: '\u00d6\u011fretmenler \u0130\u00e7in',
    roleTeacherItems: [
      '\u00dccretsiz s\u0131n\u0131f y\u00f6netim arac\u0131',
      'Kat\u0131l\u0131m kodlar\u0131 ile s\u0131n\u0131f olu\u015ftur',
      'S\u0131n\u0131f\u0131na fonetik \u00fcniteleri ata',
      'Her \u00f6\u011frencinin ses hakimiyetini takip et',
      'Haftal\u0131k ilerleme raporlar\u0131',
    ],
    roleParentTitle: 'Veliler \u0130\u00e7in',
    roleParentItems: [
      '\u00c7ocu\u011funuzun hangi seslerde ustala\u015ft\u0131\u011f\u0131n\u0131 g\u00f6r\u00fcn',
      'G\u00fcnl\u00fck aktivite raporlar\u0131',
      'Ekran s\u00fcresi limitleri belirleyin',
      '\u00c7oklu \u00e7ocuk deste\u011fi (4\'e kadar)',
    ],
    // Methodology
    methTitle: 'Kan\u0131tlanm\u0131\u015f Y\u00f6ntemler',
    methSub: 'Her \u00f6zellik, kan\u0131tlanm\u0131\u015f dil edinim bilimlerine dayanmaktad\u0131r',
    meth1: 'Sentetik Fonetik',
    meth1Desc: 'Jolly Phonics yakla\u015f\u0131m\u0131 \u2014 sesleri \u00f6\u011fren, sonra kelimelere d\u00f6n\u00fc\u015ft\u00fcr',
    meth2: 'Montessori \u00d6\u011frenme',
    meth2Desc: '\u00c7ocu\u011funun h\u0131z\u0131nda, uygulayarak ke\u015ffetme',
    meth3: 'Toplam Fiziksel Tepki',
    meth3Desc: 'TPR \u2014 \u00e7ocuklar hareket ederek, oynayarak \u00f6\u011frenir',
    meth4: 'Anla\u015f\u0131l\u0131r Girdi',
    meth4Desc: 'Krashen\'in i+1 \u2014 her zaman bir ad\u0131m ileride',
    meth5: 'Aral\u0131kl\u0131 Tekrar',
    meth5Desc: 'SM-2 algoritmas\u0131 uzun vadeli hat\u0131rlamay\u0131 sa\u011flar',
    // Glints
    glintsTitle: 'Glintler',
    glintsSub: '\u00d6\u011frenme arkada\u015f\u0131n\u0131 se\u00e7. Her biri sitede sana \u00f6zel g\u00fc\u00e7ler verir.',
    // Stats
    stat1Num: '42', stat1Label: '\u0130ngilizce Ses',
    stat2Num: '4', stat2Label: '\u00d6\u011frenme A\u015famas\u0131',
    stat3Num: '400+', stat3Label: '\u00d6\u011frenilecek Kelime',
    // Ataturk
    ataturkBadge: 'Sevgili Liderimiz',
    ataturkTitle: 'Mustafa Kemal Atat\u00fcrk',
    // Bottom CTA
    bottomCtaTitle: 'Ba\u015flamaya Haz\u0131r m\u0131s\u0131n?',
    bottomCtaSub: 'Rol\u00fcn\u00fc se\u00e7 ve Mimi ile yolculu\u011fa ba\u015fla',
    // Nav
    loginBtn: 'Giri\u015f Yap',
    navHow: 'Nas\u0131l \u00c7al\u0131\u015f\u0131r',
    navFor: 'Kimler \u0130\u00e7in',
    navMethod: 'Y\u00f6ntem',
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

const PARTICLES = ['\u2b50','\u2728','\ud83c\udf1f','\ud83d\udcab','\ud83c\udf88','\ud83e\udd8b','\ud83c\udf08','\ud83c\udfb5','\ud83d\udcda','\ud83c\udfae'];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];

  // Mimi modal
  const [showMimiModal, setShowMimiModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'teacher' | 'parent'>('student');

  // Roaming Mimi state
  const dragDistance = useRef(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 85, y: 75 });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [speechBubble, setSpeechBubble] = useState<{ message: string; duration: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  // Glints carousel
  const glintList = Object.values(GLINTS);
  const [activeGlintIndex, setActiveGlintIndex] = useState(0);
  const touchStartX = React.useRef(0);

  const goPrev = () => setActiveGlintIndex((i) => (i - 1 + glintList.length) % glintList.length);
  const goNext = () => setActiveGlintIndex((i) => (i + 1) % glintList.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goNext();
      else goPrev();
    }
  };

  const phases = [
    { emoji: '\ud83d\udc23', title: t.phase1Title, age: t.phase1Age, tag: t.phase1Tag, desc: t.phase1Desc, color: '#f59e0b', icon: <Ear size={28} /> },
    { emoji: '\ud83e\uddf1', title: t.phase2Title, age: t.phase2Age, tag: t.phase2Tag, desc: t.phase2Desc, color: '#8b5cf6', icon: <Blocks size={28} /> },
    { emoji: '\ud83d\udcd6', title: t.phase3Title, age: t.phase3Age, tag: t.phase3Tag, desc: t.phase3Desc, color: '#14b8a6', icon: <BookOpen size={28} /> },
    { emoji: '\ud83c\udf0d', title: t.phase4Title, age: t.phase4Age, tag: t.phase4Tag, desc: t.phase4Desc, color: '#3b82f6', icon: <Globe size={28} /> },
  ];

  const methodologies = [
    { icon: <BookOpen size={24} />, title: t.meth1, desc: t.meth1Desc, color: '#ef4444' },
    { icon: <Brain size={24} />, title: t.meth2, desc: t.meth2Desc, color: '#8b5cf6' },
    { icon: <Users size={24} />, title: t.meth3, desc: t.meth3Desc, color: '#f59e0b' },
    { icon: <MessageCircle size={24} />, title: t.meth4, desc: t.meth4Desc, color: '#14b8a6' },
    { icon: <Repeat size={24} />, title: t.meth5, desc: t.meth5Desc, color: '#3b82f6' },
  ];

  const roleData = {
    student: { title: t.roleStudentTitle, items: t.roleStudentItems, icon: <GraduationCap size={24} />, color: '#8b5cf6' },
    teacher: { title: t.roleTeacherTitle, items: t.roleTeacherItems, icon: <Users size={24} />, color: '#14b8a6' },
    parent: { title: t.roleParentTitle, items: t.roleParentItems, icon: <Shield size={24} />, color: '#f59e0b' },
  };

  return (
    <div className="magic-landing">
      {/* ===== NAVBAR ===== */}
      <nav className="landing-navbar">
        <div className="landing-navbar__inner">
          <Link to="/" className="landing-navbar__logo">
            <Sparkles size={22} />
            <span>Mines<strong>Minis</strong></span>
          </Link>
          <div className="landing-navbar__links">
            <a href="#how-it-works">{t.navHow}</a>
            <a href="#for-you">{t.navFor}</a>
            <a href="#methodology">{t.navMethod}</a>
            <a href="#characters">{lang === 'en' ? 'Characters' : 'Karakterler'}</a>
            <Link to="/pricing">{lang === 'en' ? 'Pricing' : 'Fiyatlar'}</Link>
          </div>
          <div className="landing-navbar__right">
            <div className="landing-navbar__lang">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'tr' ? 'active' : ''} onClick={() => setLang('tr')}>TR</button>
            </div>
            <Link to="/login" className="landing-navbar__cta">
              {t.loginBtn} <ArrowRight size={16} />
            </Link>
            <button className="landing-navbar__hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="landing-navbar__mobile-menu">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>{t.navHow}</a>
              <a href="#for-you" onClick={() => setMobileMenuOpen(false)}>{t.navFor}</a>
              <a href="#methodology" onClick={() => setMobileMenuOpen(false)}>{t.navMethod}</a>
              <a href="#characters" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Characters' : 'Karakterler'}</a>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Pricing' : 'Fiyatlar'}</Link>
              <Link to="/ataturk" onClick={() => setMobileMenuOpen(false)}>Atat\u00fcrk</Link>
              <Link to="/login" className="landing-navbar__cta" onClick={() => setMobileMenuOpen(false)}>
                {t.loginBtn} <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="magic-hero">
        <div className="magic-hero__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="magic-hero__particle"
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-20, -200],
                x: Math.random() * 40 - 20,
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
              style={{ left: `${Math.random() * 100}%` }}
            >
              {PARTICLES[i % 10]}
            </motion.span>
          ))}
        </div>

        <div className="magic-hero__glow" />

        <div className="magic-hero__content">
          {/* Left: text */}
          <div className="magic-hero__text">
            {/* Ataturk badge */}
            <Link to="/ataturk" className="landing-v2-ataturk-badge">
              <img src={ataturkFormal} alt="" />
              <div>
                <span className="badge-label">{t.ataturkBadge}</span>
                <span className="badge-name">{t.ataturkTitle}</span>
              </div>
              <ArrowRight size={14} />
            </Link>

            <div className="magic-hero__title-row">
              <motion.h1
                className="magic-hero__title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {t.heroTitle}
              </motion.h1>
            </div>

            <motion.p
              className="magic-hero__sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.heroSub}
            </motion.p>

            <motion.div
              className="magic-hero__roles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/login" className="magic-role-btn magic-role-btn--student">
                <span className="magic-role-btn__emoji">{'\ud83c\udf92'}</span> {t.ctaStudent}
              </Link>
              <Link to="/login" className="magic-role-btn magic-role-btn--teacher">
                <span className="magic-role-btn__emoji">{'\ud83d\udc69\u200d\ud83c\udfeb'}</span> {t.ctaTeacher}
              </Link>
              <Link to="/login" className="magic-role-btn magic-role-btn--parent">
                <span className="magic-role-btn__emoji">{'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67'}</span> {t.ctaParent}
              </Link>
            </motion.div>
          </div>

          {/* Right: Glints carousel */}
          <div className="glints-cell" id="characters">
            <h3 className="glints-cell-title">
              <Sparkles size={18} /> {t.glintsTitle}
            </h3>
            <p className="glints-cell-sub">{t.glintsSub}</p>

            <div className="glints-carousel">
              <button
                type="button"
                className="glints-nav prev"
                onClick={goPrev}
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              <div
                className="glints-carousel-track"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {glintList.map((g, idx) => {
                  const offset = (idx - activeGlintIndex + glintList.length) % glintList.length;
                  const isPrev = offset === glintList.length - 1;
                  const isActive = offset === 0;
                  const isNext = offset === 1;
                  const visible = isPrev || isActive || isNext;

                  if (!visible) return null;

                  return (
                    <motion.div
                      key={g.id}
                      className={`glint-slide ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
                      style={{ '--glint-color': g.color } as React.CSSProperties}
                      initial={false}
                      animate={{
                        x: isPrev ? -130 : isNext ? 130 : 0,
                        y: '-50%',
                        scale: isActive ? 1 : 0.78,
                        opacity: isActive ? 1 : 0.55,
                        zIndex: isActive ? 3 : isPrev ? 1 : 2,
                      }}
                      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    >
                      {isActive && (
                        <motion.div
                          className="glint-speech-bubble"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          {g.story}
                        </motion.div>
                      )}
                      <motion.div
                        className="glint-visual"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="glint-glow" style={{ backgroundColor: g.color }} />
                        <UnifiedMascot id={g.id} state="idle" size={isActive ? 140 : 90} />
                      </motion.div>
                      <span className="glint-slide-name">{g.name}</span>
                      <span className="glint-slide-benefit">{g.benefit}</span>
                      {isActive && (
                        <button
                          type="button"
                          className="glint-select-hint"
                          onClick={() => navigate('/login')}
                        >
                          {t.loginBtn} {'\u2192'}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <button
                type="button"
                className="glints-nav next"
                onClick={goNext}
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="glints-dots">
              {glintList.map((g, idx) => (
                <button
                  key={g.id}
                  type="button"
                  className={`dot ${idx === activeGlintIndex ? 'active' : ''}`}
                  style={{ backgroundColor: idx === activeGlintIndex ? g.color : undefined }}
                  onClick={() => setActiveGlintIndex(idx)}
                  aria-label={g.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: HOW IT WORKS ===== */}
      <section className="landing-how" id="how-it-works">
        <motion.h2
          className="landing-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t.howTitle}
        </motion.h2>
        <motion.p
          className="landing-section-sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t.howSub}
        </motion.p>

        <div className="landing-how__timeline">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              className="landing-how__phase"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ '--phase-color': phase.color } as React.CSSProperties}
            >
              <div className="landing-how__phase-num">{i + 1}</div>
              <div className="landing-how__phase-icon">
                <span className="landing-how__phase-emoji">{phase.emoji}</span>
                <div className="landing-how__phase-lucide">{phase.icon}</div>
              </div>
              <div className="landing-how__phase-body">
                <h3 className="landing-how__phase-title">{phase.title}</h3>
                <span className="landing-how__phase-age">{phase.age}</span>
                <span className="landing-how__phase-tag">{phase.tag}</span>
                <p className="landing-how__phase-desc">{phase.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 3: FOR EACH ROLE ===== */}
      <section className="landing-roles" id="for-you">
        <motion.h2
          className="landing-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t.roleTitle}
        </motion.h2>
        <motion.p
          className="landing-section-sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t.roleSub}
        </motion.p>

        <div className="landing-roles__tabs">
          {(['student', 'teacher', 'parent'] as const).map((role) => (
            <button
              key={role}
              className={`landing-roles__tab ${activeRoleTab === role ? 'active' : ''}`}
              onClick={() => setActiveRoleTab(role)}
              style={{ '--tab-color': roleData[role].color } as React.CSSProperties}
            >
              {roleData[role].icon}
              <span>{roleData[role].title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoleTab}
            className="landing-roles__card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{ '--role-color': roleData[activeRoleTab].color } as React.CSSProperties}
          >
            <ul className="landing-roles__list">
              {roleData[activeRoleTab].items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CheckCircle size={20} style={{ color: roleData[activeRoleTab].color, flexShrink: 0 }} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/login" className="landing-roles__cta" style={{ background: roleData[activeRoleTab].color }}>
              {t.loginBtn} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ===== SECTION 4: METHODOLOGY CREDENTIALS ===== */}
      <section className="landing-methodology" id="methodology">
        <motion.h2
          className="landing-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t.methTitle}
        </motion.h2>
        <motion.p
          className="landing-section-sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t.methSub}
        </motion.p>

        <div className="landing-methodology__grid">
          {methodologies.map((m, i) => (
            <motion.div
              key={i}
              className="landing-methodology__card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ '--meth-color': m.color } as React.CSSProperties}
            >
              <div className="landing-methodology__icon" style={{ color: m.color }}>
                {m.icon}
              </div>
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5: STATS ===== */}
      <section className="magic-stats">
        <div className="magic-stats__inner">
          <motion.div
            className="magic-stats__item"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="magic-stats__number">{t.stat1Num}</span>
            <span className="magic-stats__label">{t.stat1Label}</span>
          </motion.div>
          <motion.div
            className="magic-stats__item"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="magic-stats__number">{t.stat2Num}</span>
            <span className="magic-stats__label">{t.stat2Label}</span>
          </motion.div>
          <motion.div
            className="magic-stats__item"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="magic-stats__number">{t.stat3Num}</span>
            <span className="magic-stats__label">{t.stat3Label}</span>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 6: BOTTOM CTA ===== */}
      <section className="magic-cta">
        <motion.div
          className="magic-cta__card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>{t.bottomCtaTitle}</h2>
          <p>{t.bottomCtaSub}</p>
          <div className="magic-cta__roles">
            <Link to="/login" className="magic-role-btn magic-role-btn--student">
              <span className="magic-role-btn__emoji">{'\ud83c\udf92'}</span> {t.ctaStudent}
            </Link>
            <Link to="/login" className="magic-role-btn magic-role-btn--teacher">
              <span className="magic-role-btn__emoji">{'\ud83d\udc69\u200d\ud83c\udfeb'}</span> {t.ctaTeacher}
            </Link>
            <Link to="/login" className="magic-role-btn magic-role-btn--parent">
              <span className="magic-role-btn__emoji">{'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67'}</span> {t.ctaParent}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <Sparkles size={18} /> Mines<strong>Minis</strong>
            <p>{lang === 'en' ? 'Montessori + Phonics English for kids ages 3-10' : '3-10 ya\u015f arasi \u00e7ocuklar i\u00e7in Montessori + Fonetik \u0130ngilizce'}</p>
          </div>
          <div className="landing-footer__links">
            <Link to="/privacy">{lang === 'en' ? 'Privacy' : 'Gizlilik'}</Link>
            <Link to="/terms">{lang === 'en' ? 'Terms' : '\u015eartlar'}</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <p className="landing-footer__copy">&copy; {new Date().getFullYear()} MinesMinis</p>
        </div>
      </footer>

      {/* ===== ROAMING MIMI ===== */}
      <div ref={constraintsRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
        <motion.div
          className="landing-v2-mimi"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          whileDrag={{ scale: 1.15 }}
          onDragStart={() => mascotRoaming.stopRoaming()}
          onDrag={(_e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => { dragDistance.current = Math.abs(info.offset.x) + Math.abs(info.offset.y); }}
          onDragEnd={() => { setTimeout(() => { dragDistance.current = 0; }, 100); mascotRoaming.startRoaming(); }}
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
            className="landing-v2-mimi-click"
            onClick={handleMimiClick}
            onMouseEnter={() => { setIsHovered(true); mascotRoaming.onHover(); }}
            onMouseLeave={() => setIsHovered(false)}
          >
            {speechBubble && (
              <div className="landing-v2-mimi-bubble">{speechBubble.message}</div>
            )}
            <UnifiedMascot
              id="mimi_dragon"
              state={mapState(animationState)}
              isHovered={isHovered}
              size={100}
            />
          </div>
        </motion.div>
      </div>

      {/* ===== MIMI MODAL ===== */}
      <AnimatePresence>
        {showMimiModal && (
          <motion.div
            className="landing-v2-mimi-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMimiModal(false)}
          >
            <motion.div
              className="landing-v2-mimi-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowMimiModal(false)} aria-label="Close">
                <X size={22} />
              </button>
              <div className="modal-mascot">
                <UnifiedMascot id="mimi_dragon" state="celebrating" size={100} />
              </div>
              <h3>{t.mimiClickTitle}</h3>
              <p>{t.mimiClickMsg}</p>
              <button className="modal-login-btn" onClick={handleGoToLogin}>
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
