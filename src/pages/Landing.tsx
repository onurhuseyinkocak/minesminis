import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  X,
  Menu,
  CheckCircle,
  Play,
  Sparkles,
} from 'lucide-react';
import UnifiedMascot, { MascotState } from '../components/UnifiedMascot';
import BackgroundGradientAnimation from '../components/ui/BackgroundGradientAnimation';
import { LottieIcon } from '../components/ui/LottieIcon';
import { mascotRoaming } from '../services/mascotRoaming';
import './Landing.css';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Lang = 'en' | 'tr';
type AnimationState =
  | 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving'
  | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised'
  | 'love' | 'jumping' | 'following' | 'goingHome';

type AudienceTab = 'students' | 'teachers' | 'parents';

interface PhonicsCard {
  letter: string;
  word: string;
  iconClass: string;
  delay: number;
}

interface Phase {
  lottie: 'ear' | 'brain' | 'book' | 'rocket';
  title: string;
  age: string;
  desc: string;
  color: string;
  num: string;
}

interface StatItem {
  num: string;
  label: string;
  lottie: 'ear' | 'book' | 'music' | 'star';
  color: string;
}

interface AudienceItem {
  label: string;
  features: string[];
  iconClass: string;
}

/* ─── Content (EN + TR) ─────────────────────────────────────────────────── */

const content = {
  en: {
    navHow: 'How It Works',
    navFor: 'For You',
    navStats: 'Results',
    loginBtn: 'Login',
    heroBadge: 'Montessori + Phonics Method',
    heroTitle1: 'English Learning',
    heroTitle2: 'That Actually Works',
    heroSub: 'Research-backed phonics for Turkish children ages 3\u201310. 42 sounds. One dragon friend.',
    heroCtaPrimary: 'Start Learning',
    heroCtaSecondary: 'See How It Works',
    trustMontessori: 'Montessori-based',
    trustFree: 'Free to start',
    trustAge: 'Ages 3\u201310',
    methodLabel: 'The Method',
    methodTitle: 'A proven path to English fluency',
    methodSub: 'Four carefully designed phases guide children from first sounds to confident communication.',
    phase1Title: 'Sound Discovery',
    phase1Age: 'Ages 3\u20135',
    phase1Desc: 'Children identify and produce 42 English phonemes through playful activities.',
    phase2Title: 'Word Building',
    phase2Age: 'Ages 5\u20137',
    phase2Desc: 'Blending sounds into words and sentences with interactive games.',
    phase3Title: 'Reading & Stories',
    phase3Age: 'Ages 7\u20139',
    phase3Desc: 'Decodable books using only sounds the child has already mastered.',
    phase4Title: 'Independence',
    phase4Age: 'Ages 9\u201310',
    phase4Desc: 'Confident, independent communication in English.',
    audienceLabel: 'For Everyone',
    audienceTitle: 'Built for everyone who cares about learning',
    tabStudents: 'Students',
    tabTeachers: 'Teachers',
    tabParents: 'Parents',
    studentFeatures: [
      '42 phonics sounds with fun actions',
      'Interactive blending & word games',
      'Decodable reading library',
      'Learning garden that grows with you',
    ],
    teacherFeatures: [
      'Free classroom management tools',
      'Join codes for students',
      'Phonics progress tracking per child',
      'Curriculum-aligned activities',
    ],
    parentFeatures: [
      'Real-time learning analytics',
      'Daily time controls',
      'Multi-child support',
      'Weekly progress insights',
    ],
    statsLabel: 'By the numbers',
    stat1Num: '42', stat1Label: 'Phonics Sounds',
    stat2Num: '14', stat2Label: 'Decodable Books',
    stat3Num: '7', stat3Label: 'Song Lessons',
    stat4Num: '4', stat4Label: 'Learning Phases',
    ctaTitle: "Ready to start your child\u2019s English journey?",
    ctaSub: 'Free to begin. No credit card required.',
    ctaBtn: 'Create Free Account',
    ctaTrustSafe: 'Child-safe',
    ctaTrustPrivacy: 'KVKK compliant',
    ctaTrustFree: 'Free forever plan',
    footerTagline: 'Montessori + Phonics English for kids ages 3\u201310',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
  },
  tr: {
    navHow: 'Nas\u0131l \u00c7al\u0131\u015f\u0131r',
    navFor: 'Kimler \u0130\u00e7in',
    navStats: 'Sonu\u00e7lar',
    loginBtn: 'Giri\u015f Yap',
    heroBadge: 'Montessori + Fonetik Y\u00f6ntemi',
    heroTitle1: 'Ger\u00e7ekten \u0130\u015fe Yarayan',
    heroTitle2: '\u0130ngilizce \u00d6\u011frenme',
    heroSub: 'T\u00fcrkiye\u2019deki 3\u201310 ya\u015f aras\u0131 \u00e7ocuklar i\u00e7in ara\u015ft\u0131rmaya dayal\u0131 fonetik. 42 ses. Bir ejderha arkada\u015f.',
    heroCtaPrimary: '\u00d6\u011frenmeye Ba\u015fla',
    heroCtaSecondary: 'Nas\u0131l \u00c7al\u0131\u015ft\u0131\u011f\u0131n\u0131 G\u00f6r',
    trustMontessori: 'Montessori temelli',
    trustFree: '\u00dccretsiz ba\u015fla',
    trustAge: '3\u201310 ya\u015f',
    methodLabel: 'Y\u00f6ntem',
    methodTitle: '\u0130ngilizce ak\u0131c\u0131l\u0131\u011f\u0131na giden kan\u0131tlanm\u0131\u015f yol',
    methodSub: 'D\u00f6rt \u00f6zenle tasarlanm\u0131\u015f a\u015fama, \u00e7ocuklar\u0131 ilk seslerden g\u00fcvenli ileti\u015fime y\u00f6nlendirir.',
    phase1Title: 'Ses Ke\u015ffi',
    phase1Age: '3\u20135 Ya\u015f',
    phase1Desc: '\u00c7ocuklar e\u011flenceli aktivitelerle 42 \u0130ngilizce fonemi tan\u0131r ve \u00fcretir.',
    phase2Title: 'Kelime Kurma',
    phase2Age: '5\u20137 Ya\u015f',
    phase2Desc: 'Etkile\u015fimli oyunlarla sesleri kelimelere ve c\u00fcmlelere harmanlama.',
    phase3Title: 'Okuma & Hikayeler',
    phase3Age: '7\u20139 Ya\u015f',
    phase3Desc: '\u00c7ocu\u011fun \u00f6\u011frendi\u011fi seslerle olu\u015fturulmu\u015f okunabilir kitaplar.',
    phase4Title: 'Ba\u011f\u0131ms\u0131zl\u0131k',
    phase4Age: '9\u201310 Ya\u015f',
    phase4Desc: '\u0130ngilizce\u2019de g\u00fcvenli ve ba\u011f\u0131ms\u0131z ileti\u015fim kurma.',
    audienceLabel: 'Herkes \u0130\u00e7in',
    audienceTitle: '\u00d6\u011frenmeyi \u00f6nemseyen herkes i\u00e7in tasarland\u0131',
    tabStudents: '\u00d6\u011frenciler',
    tabTeachers: '\u00d6\u011fretmenler',
    tabParents: 'Veliler',
    studentFeatures: [
      'Hareketlerle 42 fonetik ses',
      'Etkile\u015fimli harmanlama oyunlar\u0131',
      'Okunabilir okuma k\u00fct\u00fcphanesi',
      'Seninle b\u00fcy\u00fcyen \u00f6\u011frenme bah\u00e7esi',
    ],
    teacherFeatures: [
      '\u00dccretsiz s\u0131n\u0131f y\u00f6netimi ara\u00e7lar\u0131',
      '\u00d6\u011frenciler i\u00e7in kat\u0131l\u0131m kodlar\u0131',
      '\u00c7ocuk ba\u015f\u0131na fonetik ilerleme takibi',
      'M\u00fcfredata uyumlu etkinlikler',
    ],
    parentFeatures: [
      'Ger\u00e7ek zamanl\u0131 \u00f6\u011frenme analiti\u011fi',
      'G\u00fcnl\u00fck s\u00fcre kontrolleri',
      '\u00c7oklu \u00e7ocuk deste\u011fi',
      'Haftal\u0131k ilerleme raporlar\u0131',
    ],
    statsLabel: 'Rakamlarla',
    stat1Num: '42', stat1Label: 'Fonetik Ses',
    stat2Num: '14', stat2Label: 'Okunabilir Kitap',
    stat3Num: '7', stat3Label: '\u015eark\u0131 Dersi',
    stat4Num: '4', stat4Label: '\u00d6\u011frenme A\u015famas\u0131',
    ctaTitle: '\u00c7ocu\u011funuzun \u0130ngilizce yolculu\u011funa ba\u015flamaya haz\u0131r m\u0131s\u0131n\u0131z?',
    ctaSub: 'Ba\u015flamak \u00fccretsiz. Kredi kart\u0131 gerekmez.',
    ctaBtn: '\u00dccretsiz Hesap Olu\u015ftur',
    ctaTrustSafe: '\u00c7ocuk g\u00fcvenli',
    ctaTrustPrivacy: 'KVKK uyumlu',
    ctaTrustFree: '\u00dccretsiz plan',
    footerTagline: '3\u201310 ya\u015f \u00e7ocuklar i\u00e7in Montessori + Fonetik \u0130ngilizce',
    footerPrivacy: 'Gizlilik',
    footerTerms: '\u015eartlar',
  },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

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

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AudienceTab>('students');

  /* Roaming Mimi state */
  const dragDistance = useRef(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 85, y: 75 });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [speechBubble, setSpeechBubble] = useState<{ message: string; duration: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showMimiModal, setShowMimiModal] = useState(false);

  /* Roaming Mimi logic */
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

  /* ─── Data ───────────────────────────────────────────────────────────── */

  const phonicsCards: PhonicsCard[] = [
    { letter: 'A', word: 'Apple', iconClass: 'apple', delay: 0 },
    { letter: 'B', word: 'Bear', iconClass: 'bear', delay: 0.4 },
    { letter: 'C', word: 'Cat', iconClass: 'cat', delay: 0.8 },
  ];

  const phases: Phase[] = [
    {
      lottie: 'ear',
      title: t.phase1Title,
      age: t.phase1Age,
      desc: t.phase1Desc,
      color: '#F59E0B',
      num: '01',
    },
    {
      lottie: 'brain',
      title: t.phase2Title,
      age: t.phase2Age,
      desc: t.phase2Desc,
      color: '#8B5CF6',
      num: '02',
    },
    {
      lottie: 'book',
      title: t.phase3Title,
      age: t.phase3Age,
      desc: t.phase3Desc,
      color: '#14B8A6',
      num: '03',
    },
    {
      lottie: 'rocket',
      title: t.phase4Title,
      age: t.phase4Age,
      desc: t.phase4Desc,
      color: '#3B82F6',
      num: '04',
    },
  ];

  const audienceData: Record<AudienceTab, AudienceItem> = {
    students: {
      label: t.tabStudents,
      features: t.studentFeatures,
      iconClass: 'students',
    },
    teachers: {
      label: t.tabTeachers,
      features: t.teacherFeatures,
      iconClass: 'teachers',
    },
    parents: {
      label: t.tabParents,
      features: t.parentFeatures,
      iconClass: 'parents',
    },
  };

  const stats: StatItem[] = [
    { num: t.stat1Num, label: t.stat1Label, lottie: 'ear', color: '#F59E0B' },
    { num: t.stat2Num, label: t.stat2Label, lottie: 'book', color: '#14B8A6' },
    { num: t.stat3Num, label: t.stat3Label, lottie: 'music', color: '#8B5CF6' },
    { num: t.stat4Num, label: t.stat4Label, lottie: 'star', color: '#3B82F6' },
  ];

  const tabIcons: Record<AudienceTab, React.ReactNode> = {
    students: <LottieIcon name="star" size={16} />,
    teachers: <LottieIcon name="book" size={16} />,
    parents: <LottieIcon name="heart" size={16} />,
  };

  /* ─── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="landing">
      {/* ===== NAVBAR ===== */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-nav__logo">
            <LottieIcon name="sparkle" size={22} />
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
          gradientBackgroundStart="rgb(8, 10, 20)"
          gradientBackgroundEnd="rgb(16, 18, 36)"
          firstColor="200, 140, 20"
          secondColor="100, 60, 200"
          thirdColor="20, 140, 100"
          fourthColor="60, 80, 200"
          fifthColor="180, 80, 160"
          pointerColor="245, 158, 11"
        >
          <div className="landing-hero__inner">
            <div className="landing-hero__text">
              <motion.div
                className="landing-hero__badge"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <LottieIcon name="sparkle" size={16} />
                <span>{t.heroBadge}</span>
              </motion.div>

              <motion.h1
                className="landing-hero__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
              >
                {t.heroTitle1}
                <br />
                <span className="landing-hero__title-highlight">{t.heroTitle2}</span>
              </motion.h1>

              <motion.p
                className="landing-hero__sub"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t.heroSub}
              </motion.p>

              <motion.div
                className="landing-hero__actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <Link to="/login" className="landing-btn landing-btn--primary">
                  {t.heroCtaPrimary} <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works" className="landing-btn landing-btn--outline">
                  <Play size={16} /> {t.heroCtaSecondary}
                </a>
              </motion.div>

              <motion.div
                className="landing-hero__trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="landing-hero__trust-item">
                  <LottieIcon name="star" size={18} />
                  <span>{t.trustMontessori}</span>
                </div>
                <div className="landing-hero__trust-item">
                  <LottieIcon name="check" size={18} />
                  <span>{t.trustFree}</span>
                </div>
                <div className="landing-hero__trust-item">
                  <LottieIcon name="heart" size={18} />
                  <span>{t.trustAge}</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="landing-hero__visual"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.25 }}
            >
              <div className="landing-hero__orb" />
              <div className="landing-hero__orb-secondary" />

              {phonicsCards.map((card, i) => (
                <motion.div
                  key={card.letter}
                  className={`landing-hero__phonics-card landing-hero__phonics-card--${i + 1}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + card.delay }}
                >
                  <div className={`landing-hero__phonics-icon landing-hero__phonics-icon--${card.iconClass}`}>
                    {card.letter}
                  </div>
                  <div className="landing-hero__phonics-text">
                    <strong>{card.letter}</strong>
                    <span>{card.word}</span>
                  </div>
                </motion.div>
              ))}

              <div className="landing-hero__mascot">
                <UnifiedMascot id="mimi_dragon" state="waving" size={220} />
              </div>
            </motion.div>
          </div>
        </BackgroundGradientAnimation>
      </section>

      {/* ===== SECTION 2: METHOD ===== */}
      <section className="landing-method" id="how-it-works">
        <div className="landing-method__inner">
          <motion.div
            className="landing-method__header"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="landing-section__label">
              {t.methodLabel}
            </div>
            <h2 className="landing-section__title">{t.methodTitle}</h2>
            <p className="landing-section__subtitle">{t.methodSub}</p>
          </motion.div>

          <div className="landing-method__grid">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.num}
                className="landing-method__card"
                style={{ '--phase-color': phase.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="landing-method__card-top">
                  <span className="landing-method__card-num">{phase.num}</span>
                  <div
                    className="landing-method__card-icon"
                    style={{ backgroundColor: `${phase.color}14`, color: phase.color }}
                  >
                    <LottieIcon name={phase.lottie} size={30} />
                  </div>
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
          <motion.div
            className="landing-audience__header"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="landing-section__label">
              {t.audienceLabel}
            </div>
            <h2 className="landing-section__title">{t.audienceTitle}</h2>
          </motion.div>

          <div className="landing-audience__tabs">
            {(['students', 'teachers', 'parents'] as const).map((tab) => (
              <button
                key={tab}
                className={`landing-audience__tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className={`landing-audience__tab-icon landing-audience__tab-icon--${audienceData[tab].iconClass}`}>
                  {tabIcons[tab]}
                </span>
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
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
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

      {/* ===== SECTION 4: STATS ===== */}
      <section className="landing-stats" id="results">
        <div className="landing-stats__inner">
          <motion.div
            className="landing-section__label landing-stats__label-top"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {t.statsLabel}
          </motion.div>
          <div className="landing-stats__grid">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="landing-stats__item"
                style={{ color: stat.color }}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="landing-stats__icon" style={{ color: stat.color }}>
                  <LottieIcon name={stat.lottie} size={38} />
                </div>
                <span className="landing-stats__number" style={{ color: stat.color }}>
                  {stat.num}
                </span>
                <span className="landing-stats__label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: CTA BANNER ===== */}
      <section className="landing-cta">
        <motion.div
          className="landing-cta__inner"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="landing-cta__mascot">
            <UnifiedMascot id="mimi_dragon" state="celebrating" size={110} />
          </div>
          <h2 className="landing-cta__title">{t.ctaTitle}</h2>
          <p className="landing-cta__sub">{t.ctaSub}</p>
          <Link to="/login" className="landing-btn landing-btn--cta-dark">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
          <div className="landing-cta__trust">
            <div className="landing-cta__trust-badge">
              <LottieIcon name="check" size={16} />
              <span>{t.ctaTrustSafe}</span>
            </div>
            <div className="landing-cta__trust-badge">
              <LottieIcon name="check" size={16} />
              <span>{t.ctaTrustPrivacy}</span>
            </div>
            <div className="landing-cta__trust-badge">
              <LottieIcon name="check" size={16} />
              <span>{t.ctaTrustFree}</span>
            </div>
          </div>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
              <h3>{lang === 'en' ? 'Come play with Mimi!' : 'Mimi ile oynayalim!'}</h3>
              <p>
                {lang === 'en'
                  ? 'Login to start your English adventure. Games, videos, words \u2014 all waiting for you!'
                  : '\u0130ngilizce macerana baslamak icin giris yap. Oyunlar, videolar, kelimeler \u2014 hepsi seni bekliyor!'}
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
