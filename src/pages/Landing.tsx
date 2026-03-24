/**
 * Landing Page — MinesMinis
 * Full Tailwind, zero custom CSS.
 * Design: bold, playful, kids-first.
 * Opus critique fixes applied.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Menu, X, Mic, Gamepad2, BookOpen, Star, Trophy } from 'lucide-react';
import LottieCharacter from '../components/LottieCharacter';

type Lang = 'en' | 'tr';
const t = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

const STATS = [
  { value: '42',    label: { tr: 'Fonetik Ses',  en: 'Phonics Sounds' } },
  { value: '5K+',   label: { tr: 'Kelime',        en: 'Words' } },
  { value: '10K+',  label: { tr: 'Öğrenci',       en: 'Students' } },
  { value: '%100',  label: { tr: 'Ücretsiz',      en: 'Free' } },
];

const FEATURES = [
  {
    icon: <Mic size={28} />,
    bg: 'bg-orange-100',
    iconColor: 'text-primary-500',
    title: { tr: 'Sesi Duy, Tekrar Et', en: 'Hear It, Repeat It' },
    desc: { tr: '42 fonetik ses animasyonlarla canlı öğretilir. Her ses bir hikayeye dönüşür.', en: '42 phonics sounds taught with animations. Every sound becomes a story.' },
  },
  {
    icon: <Gamepad2 size={28} />,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: { tr: 'Oyunlarla Pekiştir', en: 'Practice Through Games' },
    desc: { tr: 'Kelime eşleştirme, yazım arısı, cümle kurma — öğrenmek oyun kadar eğlenceli.', en: 'Word match, spelling bee, sentence scramble — learning as fun as playing.' },
  },
  {
    icon: <BookOpen size={28} />,
    bg: 'bg-success-100',
    iconColor: 'text-success-600',
    title: { tr: 'Hikayeler Oku', en: 'Read Stories' },
    desc: { tr: 'Çocuğun seviyesine göre fonetik hikayeler. Her bölümde kelime hazinesi büyür.', en: 'Phonics stories matched to your child\'s level. Vocabulary grows every chapter.' },
  },
  {
    icon: <Star size={28} />,
    bg: 'bg-gold-100',
    iconColor: 'text-gold-600',
    title: { tr: 'Ödüller Kazan', en: 'Earn Rewards' },
    desc: { tr: 'Yıldızlar, rozetler, seviye atlama — her ders bir başarı kutlaması.', en: 'Stars, badges, level-ups — every lesson is a celebration.' },
  },
];

const HOW_STEPS = [
  {
    num: '1',
    bg: 'bg-primary-500',
    title: { tr: 'Seviyeni Bul', en: 'Find Your Level' },
    desc: { tr: 'Kısa bir yerleştirme testiyle başlangıç noktanı belirle.', en: 'A quick placement test finds exactly where to start.' },
  },
  {
    num: '2',
    bg: 'bg-purple-600',
    title: { tr: 'Günlük Ders', en: 'Daily Lesson' },
    desc: { tr: 'Günde 10 dakika — sesler, kelimeler, oyunlar, hikayeler.', en: '10 minutes a day — sounds, words, games, stories.' },
  },
  {
    num: '3',
    bg: 'bg-success-600',
    title: { tr: 'İlerleme Gör', en: 'See Progress' },
    desc: { tr: 'Tamamlanan sesler, kazanılan yıldızlar, büyüyen bahçe.', en: 'Completed sounds, earned stars, a growing garden.' },
  },
];

const TESTIMONIALS = [
  {
    quote: { tr: '"Kızım her gün kendi isteğiyle oturup ders yapıyor. Bunu beklemiyordum!"', en: '"My daughter sits down voluntarily every day. I didn\'t expect this!"' },
    name: 'Ayşe K.',
    role: { tr: '7 yaşında kız çocuğu annesi', en: 'Mother of a 7-year-old girl' },
    initial: 'A',
  },
  {
    quote: { tr: '"3 ayda ilk kitabı okumaya başladı. Fonetik sistemi gerçekten işe yarıyor."', en: '"Started reading her first book in 3 months. The phonics system really works."' },
    name: 'Mehmet A.',
    role: { tr: '6 yaşında erkek çocuğu babası', en: 'Father of a 6-year-old boy' },
    initial: 'M',
  },
  {
    quote: { tr: '"Oyun oynadığını zannediyor ama İngilizce öğreniyor. Harika tasarım."', en: '"He thinks he\'s playing games but he\'s learning English. Brilliant design."' },
    name: 'Fatma T.',
    role: { tr: '8 yaşında erkek çocuğu annesi', en: 'Mother of an 8-year-old boy' },
    initial: 'F',
  },
];

// App mockup screen cards — show what the app looks like
const APP_PREVIEWS = [
  { bg: 'from-primary-400 to-primary-600', label: 'Günlük Ders', icon: <BookOpen size={20} className="text-white" />, desc: 'cat • dog • run • jump • play' },
  { bg: 'from-purple-500 to-purple-700', label: 'Word Match', icon: <Gamepad2 size={20} className="text-white" />, desc: '8/10 correct!' },
  { bg: 'from-success-500 to-success-700', label: 'Streak: 7 gün', icon: <Trophy size={20} className="text-white" />, desc: '5/5 · 240 XP' },
];

export default function Landing() {
  const [lang, setLang] = useState<Lang>('tr');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-body bg-white text-ink-900 overflow-x-hidden">

      {/* ══════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-ink-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="font-display font-black text-xl text-primary-500 flex-shrink-0">
            MinesMinis
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="font-display font-semibold text-ink-500 hover:text-ink-900 transition-colors text-sm">
              {t(lang, 'Özellikler', 'Features')}
            </a>
            <a href="#how" className="font-display font-semibold text-ink-500 hover:text-ink-900 transition-colors text-sm">
              {t(lang, 'Nasıl Çalışır?', 'How It Works?')}
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')}
              className="font-display font-bold text-sm text-ink-500 hover:text-ink-900 transition-colors px-2 py-1"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <Link
              to="/dashboard"
              className="bg-primary-500 hover:bg-primary-600 text-white font-display font-bold text-sm px-4 py-2 rounded-xl transition-all duration-150 shadow-primary"
            >
              {t(lang, 'Başla', 'Start')}
            </Link>
            <button
              className="lg:hidden p-2 rounded-xl text-ink-600 hover:bg-ink-50 transition-colors"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — animated */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-ink-100 lg:hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-2 bg-white">
                <a href="#features" onClick={() => setMenuOpen(false)} className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors py-2 px-3 rounded-xl hover:bg-primary-50">
                  {t(lang, 'Özellikler', 'Features')}
                </a>
                <a href="#how" onClick={() => setMenuOpen(false)} className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors py-2 px-3 rounded-xl hover:bg-primary-50">
                  {t(lang, 'Nasıl Çalışır?', 'How It Works?')}
                </a>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-display font-bold text-base py-3 rounded-xl text-center transition-colors shadow-primary mt-1"
                >
                  {t(lang, 'Ücretsiz Başla', 'Start Free')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-white to-purple-50">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30 blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 font-display font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-primary-100">
                <Trophy size={14} />
                {t(lang, '10.000+ öğrenci kullanıyor', 'Trusted by 10,000+ students')}
              </div>

              <h1 className="font-display font-black leading-tight text-ink-900 mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                {lang === 'tr'
                  ? <><span className="text-primary-500">Çocuğunuz</span><br />İngilizceyi<br />Sevecek</>
                  : <>Your Child<br /><span className="text-primary-500">Will Love</span><br />English</>
                }
              </h1>

              <p className="font-body text-ink-500 text-lg lg:text-xl mb-8 max-w-md mx-auto lg:mx-0">
                {t(lang,
                  '42 fonetik sesle bilimsel olarak kanıtlanmış yöntem. Günde sadece 10 dakika.',
                  'Scientifically proven method with 42 phonics sounds. Just 10 minutes a day.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-display font-extrabold text-lg px-8 py-4 rounded-2xl shadow-primary-lg transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  {t(lang, 'Ücretsiz Başla', 'Start Free')}
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-ink-50 text-ink-700 font-display font-bold text-lg px-8 py-4 rounded-2xl border-2 border-ink-200 transition-colors"
                >
                  {t(lang, 'Nasıl çalışır?', 'How it works?')}
                </a>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start">
                {[
                  t(lang, 'Kredi kartı gerekmez', 'No credit card'),
                  t(lang, 'Tamamen ücretsiz', 'Completely free'),
                  t(lang, '42 fonetik ses', '42 phonics sounds'),
                ].map(item => (
                  <li key={item} className="flex items-center gap-1.5 font-display font-semibold text-sm text-ink-500">
                    <Check size={14} className="text-success-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: mascot + floating bubbles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative flex items-center justify-center"
            >
              {/* Glow behind mascot */}
              <div className="absolute inset-0 bg-primary-100 rounded-full opacity-30 blur-3xl scale-75 pointer-events-none" />

              <LottieCharacter state="wave" size={240} />

              {/* Floating letter bubbles */}
              {[
                { letter: 'A', word: 'Apple',  color: 'bg-primary-500', cls: 'absolute -top-4 left-4 lg:-left-8', delay: 0 },
                { letter: 'B', word: 'Bear',   color: 'bg-purple-500',  cls: 'absolute top-4 -right-2 lg:-right-8', delay: 0.3 },
                { letter: 'C', word: 'Cat',    color: 'bg-success-500', cls: 'absolute bottom-16 left-0 lg:-left-4', delay: 0.6 },
                { letter: 'D', word: 'Dog',    color: 'bg-gold-500',    cls: 'absolute bottom-8 right-4 lg:-right-4', delay: 0.9 },
              ].map(({ letter, word, color, cls, delay }) => (
                <motion.div
                  key={letter}
                  className={`${cls} ${color} rounded-2xl px-3 py-2 shadow-lg flex flex-col items-center min-w-[52px]`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
                >
                  <span className="font-display font-black text-white text-lg leading-none">{letter}</span>
                  <span className="font-display font-semibold text-white/80 text-xs">{word}</span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
          ══════════════════════════════════════ */}
      <div className="bg-primary-500 py-6">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.value} className="text-center">
                <div className="font-display font-black text-white text-3xl lg:text-4xl">{s.value}</div>
                <div className="font-display font-semibold text-white/80 text-sm mt-1">{t(lang, s.label.tr, s.label.en)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          APP PREVIEW (what the app looks like)
          ══════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-ink-900 to-ink-800 py-16 lg:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <p className="font-display font-bold text-primary-400 text-sm uppercase tracking-widest mb-3">
            {t(lang, 'Uygulamanın içi', 'Inside the app')}
          </p>
          <h2 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
            {t(lang, 'Böyle görünüyor', 'This is what it looks like')}
          </h2>
          <p className="font-body text-ink-300 mb-12 max-w-xl mx-auto">
            {t(lang, 'Oyun gibi tasarlandı. Çocuklar öğrendiklerini bile fark etmiyor.', 'Designed like a game. Kids don\'t even realize they\'re learning.')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {APP_PREVIEWS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${p.bg} rounded-3xl p-6 text-left shadow-xl`}
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <div className="font-display font-bold text-white text-lg mb-1">{p.label}</div>
                <div className="font-body text-white/70 text-sm">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
          ══════════════════════════════════════ */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Her şey tek bir uygulamada', 'Everything in one app')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Neden MinesMinis?', 'Why MinesMinis?')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border-2 border-ink-100 rounded-3xl p-6 hover:border-primary-200 hover:shadow-card transition-all duration-200"
              >
                <div className={`${f.bg} ${f.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-extrabold text-ink-900 text-xl mb-2">
                  {t(lang, f.title.tr, f.title.en)}
                </h3>
                <p className="font-body text-ink-500 text-sm leading-relaxed">
                  {t(lang, f.desc.tr, f.desc.en)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════ */}
      <section id="how" className="py-16 lg:py-24 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Basit, etkili, eğlenceli', 'Simple, effective, fun')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Nasıl Çalışır?', 'How It Works?')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`${step.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <span className="font-display font-black text-white text-2xl">{step.num}</span>
                </div>
                <h3 className="font-display font-extrabold text-ink-900 text-xl mb-2">
                  {t(lang, step.title.tr, step.title.en)}
                </h3>
                <p className="font-body text-ink-500 text-sm leading-relaxed">
                  {t(lang, step.desc.tr, step.desc.en)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2 className="font-display font-black text-ink-900 text-center mb-12" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
            {t(lang, 'Aileler Ne Diyor?', 'What Parents Say?')}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-ink-50 rounded-3xl p-6 border border-ink-100"
              >
                <div className="flex gap-0.5 mb-4">
                  {[0,1,2,3,4].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p className="font-body text-ink-700 text-sm leading-relaxed mb-5">
                  {t(lang, r.quote.tr, r.quote.en)}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                    {r.initial}
                  </div>
                  <div>
                    <div className="font-display font-bold text-ink-900 text-sm">{r.name}</div>
                    <div className="font-body text-ink-400 text-xs">{t(lang, r.role.tr, r.role.en)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 blur-xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <LottieCharacter state="wave" size={120} />
          </div>
          <h2 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {t(lang, 'Bugün Ücretsiz Başla!', 'Start Free Today!')}
          </h2>
          <p className="font-body text-white/80 text-lg mb-8">
            {t(lang,
              'Kredi kartı yok. Zorunlu kayıt yok. Sadece öğrenme var.',
              'No credit card. No mandatory sign-up. Just learning.'
            )}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 bg-white hover:bg-ink-50 text-primary-600 font-display font-extrabold text-xl px-10 py-5 rounded-2xl shadow-xl transition-all duration-150 hover:scale-105 active:scale-95"
          >
            {t(lang, 'Hemen Başla', 'Get Started Now')}
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer className="bg-ink-900 py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="font-display font-black text-2xl text-primary-400">MinesMinis</span>
            <p className="font-body text-ink-400 text-sm">
              {t(lang, 'Çocuklar için İngilizce', 'English for kids')}
            </p>
            <div className="flex gap-6 mt-2">
              <Link to="/privacy" className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm">
                {t(lang, 'Gizlilik', 'Privacy')}
              </Link>
              <Link to="/terms" className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm">
                {t(lang, 'Kullanım Şartları', 'Terms')}
              </Link>
              <Link to="/cookies" className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm">
                {t(lang, 'Çerezler', 'Cookies')}
              </Link>
            </div>
            <p className="font-body text-ink-600 text-xs mt-2">
              © 2026 MinesMinis. {t(lang, 'Tüm hakları saklıdır.', 'All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
