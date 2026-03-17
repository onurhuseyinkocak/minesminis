import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Rocket, Book, Zap, Gamepad2, Video, FileText, Trophy, Languages, ArrowRight, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
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
    mimiClickMsg: 'Login to start your English adventure. Games, videos, words — all waiting for you!',
    heroTitle: 'Learn English with MinesMinis',
    heroSub: 'Fun games, videos, words and worksheets. Your child learns step by step.',
    heroCta: 'Login to start',
    featuresTitle: 'What you can do here',
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
    ataturkTitle: 'Mustafa Kemal Atatürk',
    loginBtn: 'Login',
  },
  tr: {
    mimiBubble: 'Merhaba! Ben Mimi 👋 Benimle oynamak için giriş yap!',
    mimiClickTitle: 'Mimi ile oynayalım! 🐲',
    mimiClickMsg: 'İngilizce macerana başlamak için giriş yap. Oyunlar, videolar, kelimeler — hepsi seni bekliyor!',
    heroTitle: 'MinesMinis ile İngilizce Öğren',
    heroSub: 'Eğlenceli oyunlar, videolar, kelimeler ve çalışma sayfaları. Çocuğunuz adım adım öğrenir.',
    heroCta: 'Başlamak için giriş yap',
    featuresTitle: 'Burada neler yapabilirsiniz',
    featuresSub: 'Çocuğunuzun eğlenceli İngilizce öğrenmesi için ihtiyaç duyduğu her şey.',
    featGames: 'Oyunlar',
    featGamesDesc: 'Eğlenceli öğrenme oyunları oyna',
    featWords: 'Kelimeler',
    featWordsDesc: 'Yeni kelimeler öğren',
    featVideos: 'Videolar',
    featVideosDesc: 'Öğrenme videoları izle',
    featSheets: 'Çalışma Sayfaları',
    featSheetsDesc: 'Çalışma sayfalarıyla pratik yap',
    featProgress: 'İlerleme',
    featProgressDesc: 'İlerlemeni takip et',
    featStories: 'Hikayeler',
    featStoriesDesc: 'Günlük hikayeler dinle',
    glintsTitle: 'Glintler',
    glintsSub: 'Öğrenme arkadaşını seç. Her biri sitede sana özel güçler verir.',
    ataturkBadge: 'Sevgili Liderimiz',
    ataturkTitle: 'Mustafa Kemal Atatürk',
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

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];

  // Mimi modal (on click → show info, redirect to login)
  const [showMimiModal, setShowMimiModal] = useState(false);

  // Roaming Mimi state
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
    { icon: Gamepad2, title: t.featGames, desc: t.featGamesDesc, color: '#8b5cf6', emoji: '🎮', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' },
    { icon: Book, title: t.featWords, desc: t.featWordsDesc, color: '#f59e0b', emoji: '📚', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
    { icon: Video, title: t.featVideos, desc: t.featVideosDesc, color: '#ef4444', emoji: '📺', gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' },
    { icon: FileText, title: t.featSheets, desc: t.featSheetsDesc, color: '#14b8a6', emoji: '📝', gradient: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)' },
    { icon: Trophy, title: t.featProgress, desc: t.featProgressDesc, color: '#ec4899', emoji: '🏆', gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' },
    { icon: BookOpen, title: t.featStories, desc: t.featStoriesDesc, color: '#8b5cf6', emoji: '📖', gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' },
  ];

  const funCards = [
    { emoji: '🌈', text: lang === 'en' ? 'Lots of fun!' : 'Bolca eğlence!' },
    { emoji: '✨', text: lang === 'en' ? 'Learn and play' : 'Öğren ve oyna' },
    { emoji: '🎯', text: lang === 'en' ? 'New words every day' : 'Her gün yeni kelimeler' },
    { emoji: '🦋', text: lang === 'en' ? 'Friendly friends' : 'Sevimli arkadaşlar' },
  ];

  return (
    <div className="landing-v2">
      {/* Language toggle */}
      <motion.div
        className="landing-v2-lang"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Languages size={16} />
        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'tr' ? 'active' : ''} onClick={() => setLang('tr')}>TR</button>
      </motion.div>

      {/* Hero + Glints - single grid, equal cells */}
      <section className="landing-v2-hero-grid landing-v2-unified-grid">
        <div className="hero-glow" />
        {/* Left: Hero (compact) */}
        <div className="hero-cell">
          <div className="hero-content">
            <Link to="/ataturk" className="landing-v2-ataturk-badge">
              <img src={ataturkFormal} alt="" />
              <div>
                <span className="badge-label">{t.ataturkBadge}</span>
                <span className="badge-name">{t.ataturkTitle}</span>
              </div>
              <ArrowRight size={18} />
            </Link>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {t.heroSub}
            </motion.p>
            <motion.div
              className="hero-cta-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/login" className="hero-cta-btn">
                <Rocket size={20} /> {t.heroCta}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right: Glints carousel - animasyonlu, peek, sohbet balonu */}
        <div className="glints-cell">
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
                        {t.loginBtn} →
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
      </section>

      {/* Features - premium cards */}
      <section className="landing-v2-features">
        <h2 className="section-title">{t.featuresTitle}</h2>
        <p className="section-sub">{t.featuresSub}</p>
        <div className="features-grid features-grid-premium">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card feature-card-premium"
              style={{ '--accent': f.color, '--gradient': f.gradient } as React.CSSProperties}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div className="feature-icon-premium">
                <f.icon size={32} strokeWidth={2.5} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Fun cards grid */}
        <div className="fun-cards-grid">
          {funCards.map((c, i) => (
            <motion.div
              key={c.text}
              className="fun-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <span className="fun-card-emoji">{c.emoji}</span>
              <span className="fun-card-text">{c.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA - login centered */}
      <section className="landing-v2-bottom-cta">
        <motion.div
          className="bottom-cta-box"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Zap size={28} />
          <h3>{lang === 'en' ? 'Ready to start?' : 'Başlamaya hazır mısın?'}</h3>
          <div className="bottom-cta-btn-wrap">
            <Link to="/login" className="bottom-cta-btn">
              {t.loginBtn} <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Roaming Mimi - clickable, redirects to login */}
      <motion.div
        className="landing-v2-mimi"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
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

      {/* Mimi click modal - info + redirect to login */}
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
