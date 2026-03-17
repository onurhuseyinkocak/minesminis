import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Rocket, ArrowRight, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import UnifiedMascot, { MascotState } from '../components/UnifiedMascot';
import { mascotRoaming } from '../services/mascotRoaming';
import ataturkFormal from '@assets/ataturk_images/ataturk-formal.png';
import { GLINTS } from '../config/GlintsConfig';
import './Landing.css';

type Lang = 'en' | 'tr';
type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following' | 'goingHome';

const content = {
  en: {
    mimiBubble: 'Hi! I\'m Mimi 👋 Login to play with me!',
    mimiClickTitle: 'Come play with Mimi! 🐲',
    mimiClickMsg: 'Login to start your English adventure. Games, videos, words \u2014 all waiting for you!',
    heroTitle: 'Learn English with MinesMinis',
    heroSub: 'Fun games, videos, words and worksheets. Your child learns step by step.',
    heroCta: 'Start the Adventure',
    featuresTitle: 'Magical Activities',
    featuresSub: 'Everything your child needs to learn English in a fun way.',
    featGames: 'Games',
    featGamesDesc: 'Play fun learning games',
    featWords: 'Words',
    featWordsDesc: 'Learn new words',
    featVideos: 'Videos',
    featVideosDesc: 'Watch learning videos',
    featSheets: 'Worksheets',
    featSheetsDesc: 'Practice with worksheets',
    featProgress: 'Progress',
    featProgressDesc: 'Track your progress',
    featStories: 'Stories',
    featStoriesDesc: 'Listen to daily stories',
    glintsTitle: 'The Glints',
    glintsSub: 'Choose your learning buddy. Each one gives you special powers on the site.',
    ataturkBadge: 'Our Beloved Leader',
    ataturkTitle: 'Mustafa Kemal Atat\u00fcrk',
    loginBtn: 'Login',
  },
  tr: {
    mimiBubble: 'Merhaba! Ben Mimi 👋 Benimle oynamak için giriş yap!',
    mimiClickTitle: 'Mimi ile oynayalım! 🐲',
    mimiClickMsg: '\u0130ngilizce macerana başlamak için giriş yap. Oyunlar, videolar, kelimeler \u2014 hepsi seni bekliyor!',
    heroTitle: 'MinesMinis ile \u0130ngilizce \u00d6\u011fren',
    heroSub: 'E\u011flenceli oyunlar, videolar, kelimeler ve çalışma sayfaları. \u00c7ocu\u011funuz adım adım \u00f6\u011frenir.',
    heroCta: 'Maceraya Başla',
    featuresTitle: 'Sihirli Aktiviteler',
    featuresSub: '\u00c7ocu\u011funuzun e\u011flenceli \u0130ngilizce \u00f6\u011frenmesi için ihtiyaç duydu\u011fu her şey.',
    featGames: 'Oyunlar',
    featGamesDesc: 'E\u011flenceli \u00f6\u011frenme oyunları oyna',
    featWords: 'Kelimeler',
    featWordsDesc: 'Yeni kelimeler \u00f6\u011fren',
    featVideos: 'Videolar',
    featVideosDesc: '\u00d6\u011frenme videoları izle',
    featSheets: '\u00c7alışma Sayfaları',
    featSheetsDesc: '\u00c7alışma sayfalarıyla pratik yap',
    featProgress: '\u0130lerleme',
    featProgressDesc: '\u0130lerlemeni takip et',
    featStories: 'Hikayeler',
    featStoriesDesc: 'G\u00fcnl\u00fck hikayeler dinle',
    glintsTitle: 'Glintler',
    glintsSub: '\u00d6\u011frenme arkadaşını seç. Her biri sitede sana \u00f6zel g\u00fcçler verir.',
    ataturkBadge: 'Sevgili Liderimiz',
    ataturkTitle: 'Mustafa Kemal Atat\u00fcrk',
    loginBtn: 'Giriş Yap',
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

const PARTICLES = ['⭐','✨','🌟','💫','🎈','🦋','🌈','🎵','📚','🎮'];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];

  // Mimi modal (on click -> show info, redirect to login)
  const [showMimiModal, setShowMimiModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Roaming Mimi state
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
    mascotRoaming.triggerCelebration();
    setShowMimiModal(true);
  };

  const handleGoToLogin = () => {
    setShowMimiModal(false);
    navigate('/login');
  };

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

  const features = [
    { emoji: '🎮', title: t.featGames, desc: t.featGamesDesc, color: '#8b5cf6' },
    { emoji: '📚', title: t.featWords, desc: t.featWordsDesc, color: '#f59e0b' },
    { emoji: '🎥', title: t.featVideos, desc: t.featVideosDesc, color: '#ef4444' },
    { emoji: '📝', title: t.featSheets, desc: t.featSheetsDesc, color: '#14b8a6' },
    { emoji: '🏆', title: t.featProgress, desc: t.featProgressDesc, color: '#ec4899' },
    { emoji: '📖', title: t.featStories, desc: t.featStoriesDesc, color: '#6366f1' },
  ];

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
            <a href="#features">{lang === 'en' ? 'Features' : '\u00d6zellikler'}</a>
            <a href="#characters">{lang === 'en' ? 'Characters' : 'Karakterler'}</a>
            <Link to="/pricing">{lang === 'en' ? 'Pricing' : 'Fiyatlar'}</Link>
            <Link to="/ataturk">Atat\u00fcrk</Link>
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
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Features' : '\u00d6zellikler'}</a>
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

      {/* ===== HERO — "Mimi Welcomes You" ===== */}
      <section className="magic-hero">
        {/* Floating emoji particles */}
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
              <motion.div
                className="magic-hero__wave"
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.div>

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
              className="magic-hero__cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/login" className="magic-btn magic-btn--primary">
                <Rocket size={20} /> {t.heroCta}
                <motion.span
                  className="magic-btn__sparkle"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  \u2728
                </motion.span>
              </Link>
              <a href="#features" className="magic-btn magic-btn--ghost">
                {lang === 'en' ? 'Learn more' : 'Daha fazla'} <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>

          {/* Right: Glints carousel — KEPT AS IS */}
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
                          {t.loginBtn} \u2192
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

      {/* ===== FEATURES — "Magical Activities" ===== */}
      <section className="magic-features" id="features">
        <motion.h2
          className="magic-features__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <span className="magic-features__emoji">🎪</span> {t.featuresTitle}
        </motion.h2>
        <motion.p
          className="magic-features__sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
        >
          {t.featuresSub}
        </motion.p>

        <div className="magic-features__grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="magic-feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              style={{ '--card-color': f.color } as React.CSSProperties}
            >
              <div className="magic-feature-card__icon">
                <motion.span
                  className="magic-feature-card__emoji"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  {f.emoji}
                </motion.span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="magic-feature-card__glow" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SOCIAL PROOF — Stats ===== */}
      <section className="magic-stats">
        <div className="magic-stats__inner">
          <motion.div
            className="magic-stats__item"
            whileInView={{ scale: [0.5, 1.1, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="magic-stats__number">1,000+</span>
            <span className="magic-stats__label">{lang === 'en' ? 'Happy Learners' : 'Mutlu \u00d6\u011frenci'}</span>
          </motion.div>
          <motion.div
            className="magic-stats__item"
            whileInView={{ scale: [0.5, 1.1, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="magic-stats__number">12</span>
            <span className="magic-stats__label">{lang === 'en' ? 'Magical Worlds' : 'Sihirli D\u00fcnya'}</span>
          </motion.div>
          <motion.div
            className="magic-stats__item"
            whileInView={{ scale: [0.5, 1.1, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="magic-stats__number">120+</span>
            <span className="magic-stats__label">{lang === 'en' ? 'Fun Lessons' : 'E\u011flenceli Ders'}</span>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA — "Start Your Magic Journey" ===== */}
      <section className="magic-cta">
        <motion.div
          className="magic-cta__card"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
        >
          <h2>{lang === 'en' ? 'Ready for the Adventure?' : 'Maceraya Hazır mısın?'}</h2>
          <p>{lang === 'en' ? 'Mimi and friends are waiting for you!' : 'Mimi ve arkadaşları seni bekliyor!'}</p>
          <Link to="/login" className="magic-btn magic-btn--primary magic-btn--large">
            {t.heroCta} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <Sparkles size={18} /> Mines<strong>Minis</strong>
            <p>{lang === 'en' ? 'Premium English for kids ages 1-10' : '1-10 yaş arası çocuklar için premium \u0130ngilizce'}</p>
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
          onDragEnd={() => mascotRoaming.startRoaming()}
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
