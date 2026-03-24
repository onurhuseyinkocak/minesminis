import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import UnifiedMascot from '../components/UnifiedMascot';
import { KidIcon } from '../components/ui';
import type { KidIconName } from '../components/ui';
import './Landing.css';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Lang = 'en' | 'tr';

interface PhonicsCard {
  letter: string;
  word: { tr: string; en: string };
  color: string;
  delay: number;
}

interface Phase {
  num: number;
  title: { tr: string; en: string };
  age: string;
  desc: { tr: string; en: string };
  accent: string;
}

/* ─── Content ───────────────────────────────────────────────────────────── */

const content = {
  hero: {
    title: { tr: 'Çocuğunuz İngilizceyi Sevecek', en: 'Your Child Will Love English' },
    sub: {
      tr: '42 fonetik sesle eğlenceli öğrenme. Günde 10 dakika yeterli.',
      en: 'Fun learning with 42 phonics sounds. 10 minutes a day is enough.',
    },
    ctaPrimary: { tr: 'Ücretsiz Başla', en: 'Start Free' },
    ctaSecondary: { tr: 'Nasıl Çalışır?', en: 'How It Works?' },
  },
  nav: {
    learn: { tr: 'Öğren', en: 'Learn' },
    games: { tr: 'Oyunlar', en: 'Games' },
    stories: { tr: 'Hikayeler', en: 'Stories' },
    start: { tr: 'Başla', en: 'Start' },
  },
  trust: [
    { value: '4.9/5', label: { tr: 'Puan', en: 'Rating' } },
    { value: '10,000+', label: { tr: 'Çocuk', en: 'Kids' } },
    { value: '100%', label: { tr: 'Ücretsiz', en: 'Free' } },
  ],
  howItWorks: {
    title: { tr: 'Nasıl Çalışır?', en: 'How It Works?' },
    steps: [
      {
        icon: 'mic' as KidIconName,
        title: { tr: 'Sesi Duy', en: 'Hear the Sound' },
        desc: {
          tr: 'Her harfin sesini eğlenceli animasyonlarla duy ve tekrar et.',
          en: 'Hear each letter sound with fun animations and repeat.',
        },
      },
      {
        icon: 'learn' as KidIconName,
        title: { tr: 'Öğren & Oyna', en: 'Learn & Play' },
        desc: {
          tr: 'Oyunlar ve hikayelerle yeni kelimeleri öğren, pekiştir.',
          en: 'Learn new words through games and stories, then practice.',
        },
      },
      {
        icon: 'trophy' as KidIconName,
        title: { tr: 'Yıldız Kazan', en: 'Earn Stars' },
        desc: {
          tr: 'Her derste yıldız topla, seviyeni yükselt, ödülleri aç.',
          en: 'Collect stars each lesson, level up, and unlock rewards.',
        },
      },
    ],
  },
  method: {
    title: { tr: 'Kanıtlanmış Fonetik Yöntem', en: 'Proven Phonics Method' },
    subtitle: { tr: '42 Fonetik Ses Sistemi', en: '42 Phonics Sound System' },
    phases: [
      {
        num: 1,
        title: { tr: 'Temel Sesler', en: 'Basic Sounds' },
        age: '3-4',
        desc: {
          tr: 's, a, t, p, i, n gibi ilk harflerle başlangıç.',
          en: 'Start with first letters like s, a, t, p, i, n.',
        },
        accent: 'primary',
      },
      {
        num: 2,
        title: { tr: 'Ses Birleştirme', en: 'Sound Blending' },
        age: '4-5',
        desc: {
          tr: 'Sesleri birleştirip ilk kelimeleri okumayla tanışma.',
          en: 'Blend sounds together and start reading first words.',
        },
        accent: 'purple',
      },
      {
        num: 3,
        title: { tr: 'İleri Sesler', en: 'Advanced Sounds' },
        age: '5-6',
        desc: {
          tr: 'sh, ch, th gibi birleşik sesleri ve uzun kelimeleri öğrenme.',
          en: 'Learn blended sounds like sh, ch, th and longer words.',
        },
        accent: 'primary',
      },
      {
        num: 4,
        title: { tr: 'Akıcı Okuma', en: 'Fluent Reading' },
        age: '6-7',
        desc: {
          tr: 'Cümle kurma, hikaye okuma ve bağımsız öğrenme.',
          en: 'Sentence building, story reading and independent learning.',
        },
        accent: 'purple',
      },
    ] as Phase[],
  },
  stats: [
    { value: '42+', label: { tr: 'Ses', en: 'Sounds' } },
    { value: '5000+', label: { tr: 'Kelime', en: 'Words' } },
    { value: '10,000+', label: { tr: 'Çocuk', en: 'Kids' } },
    { value: '100%', label: { tr: 'Bedava', en: 'Free' } },
  ],
  cta: {
    title: { tr: 'Hemen Başla — Ücretsiz', en: 'Start Now — Free' },
    sub: {
      tr: 'Çocuğunuzun İngilizce yolculuğu bugün başlasın.',
      en: "Let your child's English journey start today.",
    },
    btn: { tr: 'Hemen Başla', en: 'Start Now' },
  },
  footer: {
    privacy: { tr: 'Gizlilik', en: 'Privacy' },
    terms: { tr: 'Kullanım Şartları', en: 'Terms' },
    cookies: { tr: 'Çerezler', en: 'Cookies' },
  },
};

const phonicsCards: PhonicsCard[] = [
  { letter: 'A', word: { tr: 'Apple', en: 'Apple' }, color: 'bg-primary-100 text-primary-600 border-primary-200', delay: 0 },
  { letter: 'B', word: { tr: 'Bear', en: 'Bear' }, color: 'bg-purple-100 text-purple-600 border-purple-200', delay: 0.5 },
  { letter: 'C', word: { tr: 'Cat', en: 'Cat' }, color: 'bg-success-100 text-success-600 border-success-200', delay: 1.0 },
  { letter: 'D', word: { tr: 'Dog', en: 'Dog' }, color: 'bg-gold-100 text-gold-600 border-gold-200', delay: 1.5 },
];

/* ─── Animation presets ─────────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const staggerChild = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: index * 0.1 },
});

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function Landing() {
  const [lang, setLang] = useState<Lang>('tr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = (obj: { tr: string; en: string }) => obj[lang];

  return (
    <div className="min-h-screen bg-white font-body text-ink-900 overflow-x-hidden">
      {/* ━━━ NAVBAR ━━━ */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <UnifiedMascot state="idle" size={36} />
            <span className="font-display font-extrabold text-xl text-primary-500">
              MinesMinis
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors">
              {t(content.nav.learn)}
            </a>
            <a href="#method" className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors">
              {t(content.nav.games)}
            </a>
            <a href="#cta" className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors">
              {t(content.nav.stories)}
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="font-display font-bold text-sm px-3 py-1.5 rounded-full border-2 border-ink-200 text-ink-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>

            {/* CTA */}
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex font-display font-bold text-sm px-5 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-primary"
            >
              {t(content.nav.start)}
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink-600"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-ink-100 px-4 pb-4"
          >
            <div className="flex flex-col gap-3 pt-3">
              <a href="#how-it-works" className="font-display font-semibold text-ink-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                {t(content.nav.learn)}
              </a>
              <a href="#method" className="font-display font-semibold text-ink-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                {t(content.nav.games)}
              </a>
              <a href="#cta" className="font-display font-semibold text-ink-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                {t(content.nav.stories)}
              </a>
              <Link
                to="/dashboard"
                className="font-display font-bold text-center px-5 py-2.5 rounded-full bg-primary-500 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(content.nav.start)}
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section className="landing-hero-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left */}
            <motion.div className="flex-1 text-center lg:text-left" {...fadeUp}>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-ink-900 to-primary-500 bg-clip-text text-transparent">
                {t(content.hero.title)}
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-ink-600 font-body max-w-lg mx-auto lg:mx-0">
                {t(content.hero.sub)}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 font-display font-extrabold text-xl px-10 py-4 rounded-full bg-primary-500 text-white hover:bg-primary-600 active:scale-95 transition-all duration-200 shadow-primary-lg hover:shadow-primary"
                >
                  {t(content.hero.ctaPrimary)}
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 font-display font-bold text-lg px-8 py-3.5 rounded-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 transition-colors"
                >
                  {t(content.hero.ctaSecondary)}
                </a>
              </div>
            </motion.div>

            {/* Right — Mascot + floating phonics cards */}
            <motion.div
              className="flex-1 relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Glow behind mascot */}
                <div className="absolute inset-0 rounded-full bg-primary-100/60 blur-3xl" />
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <UnifiedMascot state="waving" size={240} />
                </div>

                {/* Floating phonics cards */}
                {phonicsCards.map((card, i) => {
                  const positions = [
                    'top-0 -left-4',
                    'top-4 -right-4',
                    'bottom-8 -left-8',
                    'bottom-0 -right-8',
                  ];
                  return (
                    <motion.div
                      key={card.letter}
                      className={`absolute ${positions[i]} phonics-card-float`}
                      style={{ animationDelay: `${card.delay}s` }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                    >
                      <div className={`${card.color} phonics-card-float rounded-2xl px-4 py-3 shadow-lg font-display font-extrabold text-center border-2 border-white`}>
                        <div className="text-2xl">{card.letter}</div>
                        <div className="text-xs font-semibold mt-0.5">{t(card.word)}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Trust badges */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-10"
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {content.trust.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-card"
              >
                <KidIcon name="star" size={28} />
                <div>
                  <div className="font-display font-extrabold text-ink-900 text-lg">{badge.value}</div>
                  <div className="text-ink-500 text-sm font-body">{t(badge.label)}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section id="how-it-works" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-display font-extrabold text-3xl sm:text-4xl text-center text-ink-900 mb-4"
            {...fadeUp}
          >
            {t(content.howItWorks.title)}
          </motion.h2>
          <motion.div className="w-20 h-1.5 bg-primary-500 rounded-full mx-auto mt-4 mb-14" {...fadeUp} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.howItWorks.steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center border border-ink-100"
                {...staggerChild(i)}
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white font-display font-black text-sm flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <div className="mx-auto w-20 h-20 rounded-3xl bg-primary-100 flex items-center justify-center mb-6">
                  <KidIcon name={step.icon} size={48} />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-3">
                  {t(step.title)}
                </h3>
                <p className="text-ink-600 font-body leading-relaxed">
                  {t(step.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ METHOD (4 phases) ━━━ */}
      <section id="method" className="bg-cream-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900">
              {t(content.method.subtitle)}
            </h2>
            <p className="mt-3 text-ink-600 text-lg font-body">
              {t(content.method.title)}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {content.method.phases.map((phase, i) => {
              const isPrimary = phase.accent === 'primary';
              const accentBg = isPrimary ? 'bg-primary-500' : 'bg-purple-600';
              const accentLight = isPrimary ? 'bg-primary-50' : 'bg-purple-50';
              const accentText = isPrimary ? 'text-primary-500' : 'text-purple-600';

              return (
                <motion.div
                  key={phase.num}
                  className={`${accentLight} rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-card-hover transition-shadow`}
                  {...staggerChild(i)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${accentBg} w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-extrabold text-lg`}>
                      {phase.num}
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg ${accentText}`}>
                        {t(phase.title)}
                      </h3>
                      <span className="text-ink-400 text-sm font-body">
                        {lang === 'tr' ? 'Yaş' : 'Age'} {phase.age}
                      </span>
                    </div>
                  </div>
                  <p className="text-ink-600 font-body leading-relaxed">
                    {t(phase.desc)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                {...staggerChild(i)}
              >
                <div className="w-3 h-3 rounded-full bg-white/60 mx-auto mb-2" />
                <div className="font-display font-black text-5xl sm:text-6xl text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-white/80 font-body text-lg">
                  {t(stat.label)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section id="cta" className="bg-cream-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div className="flex-1 text-center lg:text-left" {...fadeUp}>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink-900">
                {t(content.cta.title)}
              </h2>
              <p className="mt-4 text-ink-600 text-lg font-body max-w-md mx-auto lg:mx-0">
                {t(content.cta.sub)}
              </p>
              <Link
                to="/dashboard"
                className="mt-8 inline-flex items-center gap-2 font-display font-bold text-lg px-8 py-4 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-primary-lg"
              >
                {t(content.cta.btn)}
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <UnifiedMascot state="celebrating" size={220} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="bg-ink-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <UnifiedMascot state="idle" size={28} />
              <div>
                <span className="font-display font-extrabold text-primary-500 block leading-tight">MinesMinis</span>
                <span className="font-body text-xs text-ink-400 leading-tight">{lang === 'tr' ? 'Çocuklar için İngilizce' : 'English for Kids'}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-ink-500 font-body">
              <a href="/privacy" className="hover:text-ink-700 transition-colors">
                {t(content.footer.privacy)}
              </a>
              <a href="/terms" className="hover:text-ink-700 transition-colors">
                {t(content.footer.terms)}
              </a>
              <a href="/cookies" className="hover:text-ink-700 transition-colors">
                {t(content.footer.cookies)}
              </a>
            </div>
            <p className="text-sm text-ink-400 font-body">
              {new Date().getFullYear()} MinesMinis. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
