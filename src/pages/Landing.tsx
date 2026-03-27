/**
 * Landing Page — MinesMinis
 * Cat-themed, professional school-grade tone, beta-honest, no fake data.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, Menu, X, Mic, Gamepad2, BookOpen,
  Star, GraduationCap, Shield, Sparkles, ChevronDown,
  Zap, Brain, Globe, Music, PenTool, Eye,
} from 'lucide-react';
import LottieCharacter from '../components/LottieCharacter';

type Lang = 'en' | 'tr';
const t = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

/* ── Inline paw print SVG ─────────────────────────────────── */
const PawIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" className={className}>
    <ellipse cx="50" cy="66" rx="23" ry="19" />
    <ellipse cx="27" cy="43" rx="9" ry="12" transform="rotate(-20 27 43)" />
    <ellipse cx="43" cy="33" rx="9" ry="12" />
    <ellipse cx="59" cy="33" rx="9" ry="12" />
    <ellipse cx="75" cy="43" rx="9" ry="12" transform="rotate(20 75 43)" />
  </svg>
);

// ─── Unique features ──────────────────────────────────────────────────────────

const ONLY_US = [
  {
    icon: <Brain size={28} />,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badge: { tr: 'Okuma Bilimi', en: 'Reading Science' },
    title: { tr: 'Fonem Manipülasyon Oyunu', en: 'Phoneme Manipulation Game' },
    desc: {
      tr: 'Kelimelerden ses ekle, çıkar, değiştir. "cat" → "hat" → "has". Sistematik fonetik öğretimin temel becerisi.',
      en: 'Add, delete, or swap phonemes. "cat" → "hat" → "has". The core skill of systematic phonics instruction.',
    },
  },
  {
    icon: <Globe size={28} />,
    bg: 'bg-primary-100',
    iconColor: 'text-primary-500',
    badge: { tr: 'Türkçe Konuşanlara Özel', en: 'For Turkish Speakers' },
    title: { tr: 'Türkçe Fonetik Tuzak Antrenörü', en: 'Turkish Phonetic Trap Trainer' },
    desc: {
      tr: '8 Türkçe ses tuzağı: TH sesi, W/V karışıklığı, kısa ünlüler, ünsüz kümeler. Türkçe konuşan çocuklara özel.',
      en: '8 Turkish sound traps: TH sounds, W/V confusion, short vowels, consonant clusters. Built for Turkish-speaking children.',
    },
  },
  {
    icon: <PenTool size={28} />,
    bg: 'bg-success-100',
    iconColor: 'text-success-600',
    badge: { tr: 'Dijital Yöntem', en: 'Digital Method' },
    title: { tr: 'Hareketli Alfabe', en: 'Moveable Alphabet' },
    desc: {
      tr: 'Harfleri ekranda sürükle, kelime kur, sesleri birleştir. Dil yapısını keşfederek öğrenme.',
      en: 'Drag letters on screen, build words, blend sounds. Learning by discovering language structure.',
    },
  },
  {
    icon: <BookOpen size={28} />,
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: { tr: '50+ Hikaye', en: '50+ Stories' },
    title: { tr: 'Fonetik Kısıtlamalı Hikayeler', en: 'Phonics-Constrained Stories' },
    desc: {
      tr: 'Her hikaye yalnızca öğrenilen sesleri kullanır. Çocuk gerçekten okur — tahmin etmez.',
      en: 'Every story uses only learned sounds. Children actually read — they don\'t guess.',
    },
  },
];

// ─── Competitor comparison ────────────────────────────────────────────────────

interface CompRow {
  feature: { tr: string; en: string };
  us: boolean;
  duolingo: boolean;
  lingokids: boolean;
}

const COMP_ROWS: CompRow[] = [
  { feature: { tr: 'Fonetik yöntem (42 ses)', en: 'Phonics method (42 sounds)' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Fonem manipülasyon oyunu', en: 'Phoneme manipulation game' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Türk fonetik tuzak antrenörü', en: 'Turkish phonetic trap trainer' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Hareketli alfabe (sürükle-bırak)', en: 'Moveable alphabet (drag-and-drop)' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Fonetik kısıtlamalı hikayeler', en: 'Phonics-constrained stories' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Hece sayma oyunu', en: 'Syllable counting game' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Konuşma tanıma (SayIt)', en: 'Speech recognition (SayIt)' }, us: true, duolingo: true, lingokids: false },
  { feature: { tr: 'Kelime & oyun içeriği', en: 'Vocabulary & game content' }, us: true, duolingo: true, lingokids: true },
];

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Mic size={28} />,
    gradient: 'from-orange-50 via-amber-50 to-orange-100',
    border: 'border-orange-200',
    iconBg: 'bg-primary-500',
    iconColor: 'text-white',
    title: { tr: 'Konuşarak Öğren', en: 'Learn by Speaking' },
    desc: { tr: 'Sesi duy, tekrar et, telaffuzunu kontrol et. Her derste mikrofon destekli konuşma pratiği.', en: 'Hear it, repeat it, check your pronunciation. Microphone-supported speaking practice every lesson.' },
  },
  {
    icon: <Gamepad2 size={28} />,
    gradient: 'from-purple-50 via-violet-50 to-purple-100',
    border: 'border-purple-200',
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    title: { tr: 'Oynarken Öğrensin', en: 'Learn While Playing' },
    desc: { tr: '16 farklı oyun türü: eşleştirme, hece sayma, kelime ailesi, fonem manipülasyonu ve daha fazlası.', en: '16 game types: matching, syllable counting, word families, phoneme manipulation and more.' },
  },
  {
    icon: <Music size={28} />,
    gradient: 'from-pink-50 via-rose-50 to-pink-100',
    border: 'border-pink-200',
    iconBg: 'bg-pink-500',
    iconColor: 'text-white',
    title: { tr: 'Şarkıyla Pekiştir', en: 'Reinforce with Songs' },
    desc: { tr: '7 fonetik grubun şarkıları. Söylerken oku. Çocuklar en iyi müzikle öğrenir.', en: 'Songs for all 7 phonics groups. Read while singing. Kids learn best with music.' },
  },
  {
    icon: <Eye size={28} />,
    gradient: 'from-blue-50 via-sky-50 to-blue-100',
    border: 'border-blue-200',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    title: { tr: '220 Temel Kelime', en: '220 Core Words' },
    desc: { tr: '220 Dolch kelimesi — ABD müfredatı standardı. Aralıklı tekrar sistemiyle kalıcı öğrenme.', en: '220 Dolch words from the US curriculum. Spaced repetition makes them stick.' },
  },
  {
    icon: <PenTool size={28} />,
    gradient: 'from-amber-50 via-yellow-50 to-amber-100',
    border: 'border-amber-200',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    title: { tr: 'Harf Takibi', en: 'Letter Tracing' },
    desc: { tr: 'Ekranda harfi çiz, kas hafızasını etkinleştir. Dokunmatik ve mouse destekli — her cihazda çalışır.', en: 'Trace letters on screen, activate muscle memory. Touch and mouse-supported — works on any device.' },
  },
  {
    icon: <Star size={28} />,
    gradient: 'from-green-50 via-emerald-50 to-green-100',
    border: 'border-green-200',
    iconBg: 'bg-success-600',
    iconColor: 'text-white',
    title: { tr: 'Motivasyon Sistemi', en: 'Motivation System' },
    desc: { tr: 'Yıldızlar, XP, seriler, günlük hedef. Her ders bir başarı hissiyle biter.', en: 'Stars, XP, streaks, daily goals. Every lesson ends with a sense of achievement.' },
  },
];

const HOW_STEPS = [
  {
    num: '1',
    bg: 'bg-primary-500',
    title: { tr: 'Seviyeni Bul', en: 'Find Your Level' },
    desc: { tr: 'Ücretsiz kaydol. Kısa bir yerleştirme testi tam başlangıç noktanı belirler.', en: 'Sign up free. A quick placement test finds exactly where to start.' },
  },
  {
    num: '2',
    bg: 'bg-purple-600',
    title: { tr: 'Her Gün Oyna', en: 'Play Every Day' },
    desc: { tr: 'Günde 10 dakika. Sesler, kelimeler, oyunlar, şarkılar, hikayeler.', en: '10 minutes a day. Sounds, words, games, songs, stories.' },
  },
  {
    num: '3',
    bg: 'bg-success-600',
    title: { tr: 'Sonucu Gör', en: 'See the Results' },
    desc: { tr: 'XP, seriler, rozetler ve ilerleme takibiyle her adımı gör.', en: 'Track every step with XP, streaks, badges and progress tracking.' },
  },
];

const WHO_FOR = [
  {
    icon: <Star size={28} />,
    bg: 'bg-primary-100',
    iconColor: 'text-primary-500',
    audience: { tr: 'Küçük Çocuklar', en: 'Young Learners' },
    age: { tr: '3 – 6 yaş', en: 'Ages 3 – 6' },
    points: {
      tr: ['Harfleri seslerle tanır', 'Harf iz sürme ile duyusal öğrenme', 'Kısa, odaklanmış dersler'],
      en: ['Connects letters to sounds', 'Sensory learning via letter tracing', 'Short, focused lessons'],
    },
  },
  {
    icon: <GraduationCap size={28} />,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    audience: { tr: 'Öğrenciler', en: 'Students' },
    age: { tr: '7 – 10 yaş', en: 'Ages 7 – 10' },
    points: {
      tr: ['Okuma akıcılığı kazanır', '16 oyun türüyle motivasyon yüksek', 'Türkçe fonetik tuzakları aşar'],
      en: ['Builds reading fluency', 'Motivated with 16 game types', 'Overcomes Turkish phonetic traps'],
    },
  },
];

const WORLDS_PREVIEW = [
  { num: '01', title: { tr: 'Harfler & Sesler', en: 'Letters & Sounds' }, color: 'bg-primary-500' },
  { num: '02', title: { tr: 'Aile & Ev', en: 'Family & Home' }, color: 'bg-purple-600' },
  { num: '03', title: { tr: 'Renkler & Şekiller', en: 'Colours & Shapes' }, color: 'bg-pink-500' },
  { num: '04', title: { tr: 'Hayvanlar', en: 'Animals' }, color: 'bg-success-600' },
  { num: '05', title: { tr: 'Yiyecekler & İçecekler', en: 'Food & Drink' }, color: 'bg-orange-500' },
  { num: '06', title: { tr: 'Sayılar & Matematik', en: 'Numbers & Maths' }, color: 'bg-blue-600' },
  { num: '07', title: { tr: 'Duygular', en: 'Emotions' }, color: 'bg-gold-600' },
  { num: '...', title: { tr: '+13 Dünya daha', en: '+13 More Worlds' }, color: 'bg-ink-700' },
];

const FAQ_DATA = [
  { q: { tr: 'MinesMinis hangi yaş grubuna uygun?', en: 'What age group is MinesMinis for?' }, a: { tr: 'MinesMinis 3–10 yaş arası çocuklar için tasarlanmıştır. Yerleştirme testi her çocuğun seviyesine uygun başlangıç noktasını belirler.', en: 'MinesMinis is designed for children aged 3–10. The placement test finds the right starting point for every child.' } },
  { q: { tr: 'Fonetik yöntem nedir ve neden önemli?', en: 'What is the phonics method and why does it matter?' }, a: { tr: 'Harfleri seslerle eşleştirerek okuma öğretir. Sistematik fonetik öğretimi, araştırmalarla desteklenmiş en etkili okuma yöntemidir.', en: 'Phonics maps letters to sounds. Systematic phonics instruction is the most research-backed reading method.' } },
  { q: { tr: 'Günde ne kadar süre yeterli?', en: 'How much time per day is enough?' }, a: { tr: 'Günde sadece 10 dakika yeterli. Kısa ve odaklı dersler çocukların dikkat süresine uygun tasarlanmıştır.', en: "Just 10 minutes a day. Short focused lessons match children's attention spans." } },
  { q: { tr: 'Ücretsiz plan sonsuza kadar geçerli mi?', en: 'Is the free plan valid forever?' }, a: { tr: 'Evet. Temel içeriklere erişim sonsuza kadar ücretsizdir. Beta süresince tüm özellikler açık.', en: 'Yes. Core content access is free forever. All features are open during the beta period.' } },
  { q: { tr: 'Türkçe konuşan çocuklar için özel bir şey var mı?', en: 'Is there anything special for Turkish-speaking children?' }, a: { tr: '8 Türkçe ses tuzağı için özel antrenman modülümüz var: TH sesi, W/V karışıklığı, kısa ünlüler ve daha fazlası.', en: 'We have a special training module for 8 Turkish sound traps: TH sounds, W/V confusion, short vowels and more.' } },
];

function FAQSection({ lang }: { lang: Lang }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-cream-50 scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
            {t(lang, 'Sık Sorulan Sorular', 'Frequently Asked Questions')}
          </p>
          <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
            {t(lang, 'Merak Edilenler', 'Common Questions')}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQ_DATA.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border-2 border-ink-100 rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-card transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center justify-between text-left px-6 py-5 gap-4 transition-colors duration-200 ${isOpen ? 'bg-primary-50' : ''}`}
                  aria-expanded={isOpen}
                >
                  <span className={`font-display font-bold text-base transition-colors duration-200 ${isOpen ? 'text-primary-700' : 'text-ink-900'}`}>
                    {t(lang, faq.q.tr, faq.q.en)}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : 'text-ink-400'}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1">
                        <p className="font-body text-ink-600 text-sm leading-relaxed">
                          {t(lang, faq.a.tr, faq.a.en)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Landing() {
  const [lang, setLang] = useState<Lang>('tr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  React.useEffect(() => {
    document.title = lang === 'tr'
      ? 'MinesMinis — Çocuklar için İngilizce Öğrenme'
      : 'MinesMinis — English Learning for Kids';
    return () => { document.title = 'MinesMinis'; };
  }, [lang]);

  return (
    <div className="min-h-screen bg-cream-50 font-body">

      {/* ══════════════════════════════════════
          BETA BANNER
          ══════════════════════════════════════ */}
      <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4 text-center">
        <p className="font-display font-bold text-amber-800 text-sm flex flex-wrap items-center justify-center gap-2">
          <Sparkles size={13} className="text-amber-600" />
          {t(lang,
            'MinesMinis şu an Beta aşamasındadır — tüm özellikler ücretsiz, geri bildiriminiz değerli.',
            'MinesMinis is currently in Beta — all features are free, your feedback matters.'
          )}
        </p>
      </div>

      {/* ══════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PawIcon size={22} className="text-primary-500" />
            <span className="font-display font-black text-xl text-primary-500 tracking-tight">MinesMinis</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <a href="#features" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Özellikler', 'Features')}
            </a>
            <a href="#compare" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Karşılaştır', 'Compare')}
            </a>
            <a href="#how" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Nasıl Çalışır', 'How It Works')}
            </a>
            <a href="#faq" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'SSS', 'FAQ')}
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              aria-label={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geçiş yap"}
              className="font-display font-bold text-xs text-ink-500 hover:text-ink-800 border border-ink-200 rounded-full px-3 py-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <Link
              to="/login?tab=signup"
              className="font-display font-extrabold text-sm bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm"
            >
              {t(lang, 'Ücretsiz Başla', 'Start Free')}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-xl text-ink-700 hover:bg-ink-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={t(lang, 'Menüyü aç/kapat', 'Toggle menu')}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-ink-100 overflow-hidden"
            >
              <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
                {[
                  { href: '#features', label: t(lang, 'Özellikler', 'Features') },
                  { href: '#compare', label: t(lang, 'Karşılaştır', 'Compare') },
                  { href: '#how', label: t(lang, 'Nasıl Çalışır', 'How It Works') },
                  { href: '#faq', label: t(lang, 'SSS', 'FAQ') },
                ].map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display font-semibold text-base text-ink-700 py-3 border-b border-ink-50 min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                    className="font-display font-bold text-xs text-ink-500 hover:text-ink-800 border border-ink-200 rounded-full px-3 py-2.5 min-h-[44px] flex items-center justify-center transition-colors duration-150"
                  >
                    {lang === 'tr' ? 'EN' : 'TR'}
                  </button>
                  <Link
                    to="/login?tab=signup"
                    className="font-display font-extrabold text-sm bg-primary-500 text-white px-5 py-2.5 rounded-xl flex-1 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(lang, 'Ücretsiz Başla', 'Start Free')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section id="main-content" aria-label="Hero" className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-primary-50 to-purple-50 py-14 lg:py-24">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/40 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />
        {/* Floating paw prints — hidden on mobile to reduce noise */}
        <PawIcon size={48} className="hidden sm:block absolute top-12 left-8 text-primary-200 opacity-40 rotate-[-15deg] pointer-events-none" />
        <PawIcon size={28} className="hidden sm:block absolute top-24 right-16 text-primary-300 opacity-30 rotate-[20deg] pointer-events-none" />
        <PawIcon size={36} className="hidden sm:block absolute bottom-16 left-1/4 text-primary-200 opacity-25 rotate-[8deg] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left: copy */}
            <div>
              {/* Beta badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-800 font-display font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
              >
                <Zap size={12} />
                {t(lang, 'Beta — Ücretsiz Erken Erişim', 'Beta — Free Early Access')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-ink-900 leading-[1.15] tracking-tight mb-5"
                style={{ fontSize: 'clamp(2.25rem, 6vw, 3.5rem)' }}
              >
                {lang === 'tr' ? (
                  <>İngilizce öğrenmek<br /><span className="text-primary-500">bu kadar eğlenceli.</span></>
                ) : (
                  <>Learning English<br /><span className="text-primary-500">can be this fun.</span></>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-body text-ink-500 text-base lg:text-lg mb-7 max-w-lg leading-relaxed"
              >
                {t(lang,
                  'Günde 10 dakika yeterli. Bilimsel fonetik yöntemiyle, adım adım, harften hikayeye — Mimi ile.',
                  'Just 10 minutes a day. Science-backed phonics, step by step, from letters to stories — with Mimi.'
                )}
              </motion.p>

              {/* Floating letter bubbles */}
              <div className="flex flex-wrap gap-2.5 mb-7">
                {['A', 'B', 'C', 'D'].map((letter, i) => (
                  <motion.div
                    key={letter}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-11 h-11 bg-white border-2 border-ink-100 rounded-2xl flex items-center justify-center shadow-sm font-display font-black text-lg text-primary-500 hover:border-primary-300 hover:shadow-card transition-all duration-200"
                  >
                    {letter}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.58, type: 'spring' }}
                  className="w-11 h-11 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors duration-200"
                >
                  <PawIcon size={20} className="text-white" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to="/login?tab=signup"
                  className="group inline-flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-600 text-white font-display font-extrabold text-lg px-8 py-4 rounded-2xl shadow-primary hover:shadow-primary-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t(lang, 'Ücretsiz Başla', 'Start Free')}
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-ink-200 text-ink-700 font-display font-bold text-base px-7 py-4 rounded-2xl hover:border-primary-300 hover:text-primary-600 transition-all duration-150 sm:flex-shrink-0"
                >
                  {t(lang, 'Nasıl Çalışır?', 'How It Works?')}
                </a>
              </motion.div>

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6"
              >
                {[
                  t(lang, 'Kayıt ücretsiz', 'Free sign-up'),
                  t(lang, 'Reklam yok', 'No ads'),
                  t(lang, 'COPPA & KVKK Uyumlu', 'COPPA & KVKK Compliant'),
                ].map(chip => (
                  <span key={chip} className="flex items-center gap-1.5 font-display font-semibold text-sm text-ink-500">
                    <Check size={12} className="text-success-500 flex-shrink-0" />
                    {chip}
                  </span>
                ))}
              </motion.div>

              {/* Privacy note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 mt-3"
              >
                <Shield size={13} className="text-success-500 flex-shrink-0" />
                <span className="font-display font-bold text-sm text-ink-400">
                  {t(lang, 'Çocuk gizliliği önceliğimiz — COPPA & KVKK uyumlu', "Children's privacy first — COPPA & KVKK compliant")}
                </span>
              </motion.div>

              {/* Mobile-only compact Mimi strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="sm:hidden flex items-center gap-3 mt-5 p-3 bg-white/70 border-2 border-primary-100 rounded-2xl"
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute -top-3 left-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-primary-400 rotate-[-8deg] z-10" />
                  <div className="absolute -top-3 right-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-primary-400 rotate-[8deg] z-10" />
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-orange-100 rounded-2xl border-2 border-primary-200 flex items-center justify-center overflow-hidden">
                    <LottieCharacter state="wave" size={64} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-display font-black text-sm text-ink-800">Mimi</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      t(lang, '42 Ses', '42 Sounds'),
                      t(lang, '16 Oyun', '16 Games'),
                    ].map(pill => (
                      <span key={pill} className="inline-flex items-center gap-1 bg-primary-50 text-primary-600 font-display font-bold text-xs px-2 py-0.5 rounded-full border border-primary-200">
                        <PawIcon size={9} className="text-primary-400" />
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Mimi cat mascot — shown at sm+ */}
            <div className="hidden sm:flex flex-col items-center justify-center gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                className="relative"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-primary-300/20 blur-3xl scale-125 pointer-events-none" />
                {/* Cat ears decoration */}
                <div className="relative">
                  <div className="absolute -top-6 left-6 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[32px] border-l-transparent border-r-transparent border-b-primary-400 rotate-[-8deg] z-10" style={{ filter: 'drop-shadow(0 -2px 4px var(--primary-glow))' }} />
                  <div className="absolute -top-6 right-6 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[32px] border-l-transparent border-r-transparent border-b-primary-400 rotate-[8deg] z-10" style={{ filter: 'drop-shadow(0 -2px 4px var(--primary-glow))' }} />
                  <div className="w-56 h-56 lg:w-72 lg:h-72 bg-gradient-to-br from-primary-50 to-orange-100 rounded-[40px] border-4 border-primary-200 shadow-xl flex items-center justify-center overflow-hidden">
                    <LottieCharacter state="wave" size={220} />
                  </div>
                </div>
                {/* Name badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border-2 border-primary-200 rounded-full px-5 py-2 shadow-md flex items-center gap-2 whitespace-nowrap">
                  <PawIcon size={14} className="text-primary-500" />
                  <span className="font-display font-black text-sm text-ink-800">Mimi</span>
                </div>
              </motion.div>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-2 mt-6"
              >
                {[
                  t(lang, '42 Fonetik Ses', '42 Phonics Sounds'),
                  t(lang, '16 Oyun Türü', '16 Game Types'),
                  t(lang, '220 Kelime', '220 Words'),
                ].map(pill => (
                  <span key={pill} className="inline-flex items-center gap-1.5 bg-white border-2 border-primary-100 text-primary-700 font-display font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                    <PawIcon size={11} className="text-primary-400" />
                    {pill}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
          ══════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-orange-400 py-10 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '42',  label: { tr: 'Fonetik Ses', en: 'Phonics Sounds' } },
              { value: '16',  label: { tr: 'Oyun Türü',   en: 'Game Types'     } },
              { value: '220', label: { tr: 'Sight Word',  en: 'Sight Words'    } },
              { value: '50+', label: { tr: 'Hikaye',      en: 'Stories'        } },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="font-display font-black text-white" style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)' }}>{s.value}</div>
                <div className="font-display font-semibold text-white/90 text-sm mt-1.5 leading-snug">{t(lang, s.label.tr, s.label.en)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SCHOOL TRUST BANNER
          ══════════════════════════════════════ */}
      <section className="bg-ink-900 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display font-bold text-ink-300 text-sm uppercase tracking-widest leading-relaxed">
            {t(lang,
              'Jolly Phonics yöntemi · NRP 2000 araştırması · Bilim temelli sistematik okuma öğretimi',
              'Jolly Phonics method · NRP 2000 research · Science of Reading — systematic instruction'
            )}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          UNIQUE FEATURES
          ══════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-purple-400 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Okuma biliminin temeli', 'Foundation of reading science')}
            </p>
            <h2 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Rakiplerde Olmayan Özellikler', 'Features No Competitor Has')}
            </h2>
            <p className="font-body text-ink-400 max-w-2xl mx-auto">
              {t(lang,
                'Kelime ezberlemek okumayı öğretmez. Ses bilinci olmadan okuma olmaz. MinesMinis, okuma biliminin kanıtlanmış temelinden başlar.',
                "Memorising words doesn't teach reading. Without phonemic awareness, there's no reading. MinesMinis starts from the proven foundation of reading science."
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {ONLY_US.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-ink-800 border-2 border-ink-700 rounded-3xl p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.bg} ${item.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block font-display font-bold text-xs text-primary-300 bg-primary-900/60 border border-primary-700 px-3 py-1 rounded-full tracking-wide">
                        {t(lang, item.badge.tr, item.badge.en)}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-white text-xl mb-2">
                      {t(lang, item.title.tr, item.title.en)}
                    </h3>
                    <p className="font-body text-ink-400 text-sm leading-relaxed">
                      {t(lang, item.desc.tr, item.desc.en)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPETITOR COMPARISON
          ══════════════════════════════════════ */}
      <section id="compare" className="py-16 lg:py-24 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Özellik karşılaştırması', 'Feature comparison')}
            </p>
            <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Hangi Uygulama Ne Öğretiyor?', 'What Does Each App Teach?')}
            </h2>
            <p className="font-body text-ink-500 max-w-xl mx-auto">
              {t(lang,
                'Her İngilizce uygulaması aynı şeyi yapmıyor. Özellikler, yöntemler ve hedefler farklı.',
                'Not every English app does the same thing. Features, methods, and goals differ.'
              )}
            </p>
          </div>

          <div className="bg-white border-2 border-ink-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto -mx-0.5 px-0.5">
              <table className="w-full min-w-[420px]" role="table" aria-label={t(lang, 'Uygulama karsilastirma tablosu', 'App comparison table')}>
                <thead>
                  <tr className="bg-ink-900 text-white text-center">
                    <th scope="col" className="font-display font-bold text-sm text-ink-300 text-left pl-4 pr-2 py-4">
                      {t(lang, 'Özellik', 'Feature')}
                    </th>
                    <th scope="col" className="font-display font-black text-sm text-primary-300 py-4 w-28 text-center">MinesMinis</th>
                    <th scope="col" className="font-display font-semibold text-sm text-ink-400 py-4 w-24 text-center">Duolingo</th>
                    <th scope="col" className="font-display font-semibold text-sm text-ink-400 py-4 w-24 pr-4 text-center">Lingokids</th>
                  </tr>
                </thead>
                <tbody>
                  {COMP_ROWS.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={`${i % 2 === 0 ? 'bg-cream-50' : 'bg-white'} border-b border-ink-50 last:border-0`}
                    >
                      <td className="font-body text-sm text-ink-700 pl-4 pr-2 py-3.5">
                        {t(lang, row.feature.tr, row.feature.en)}
                      </td>
                      <td className="w-28 text-center py-3.5">
                        {row.us
                          ? <><Check size={18} className="text-success-500 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Var', 'Yes')}</span></>
                          : <><X size={18} className="text-error-400 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Yok', 'No')}</span></>}
                      </td>
                      <td className="w-24 text-center py-3.5">
                        {row.duolingo
                          ? <><Check size={18} className="text-success-400 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Var', 'Yes')}</span></>
                          : <><X size={18} className="text-ink-300 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Yok', 'No')}</span></>}
                      </td>
                      <td className="w-24 pr-4 text-center py-3.5">
                        {row.lingokids
                          ? <><Check size={18} className="text-success-400 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Var', 'Yes')}</span></>
                          : <><X size={18} className="text-ink-300 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Yok', 'No')}</span></>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-primary-50 border-t-2 border-primary-100 p-5 text-center">
              <p className="font-display font-bold text-primary-700 text-sm mb-3">
                {t(lang, 'Tabloyu kendin değerlendir. İhtiyacına göre seç.', 'Evaluate the table yourself. Choose what fits your needs.')}
              </p>
              <Link
                to="/login?tab=signup"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-display font-extrabold text-sm px-6 py-3 rounded-xl transition-all duration-150 hover:scale-105"
              >
                {t(lang, 'Ücretsiz Dene', 'Try Free')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
          ══════════════════════════════════════ */}
      <section id="features" className="py-16 lg:py-24 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Özellikler', 'Features')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Her Ders Bir Macera', 'Every Lesson Is an Adventure')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`group bg-gradient-to-br ${f.gradient} border-2 ${f.border} rounded-3xl p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1`}
              >
                <div className={`${f.iconBg} ${f.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-extrabold text-ink-900 text-xl mb-2">
                  {t(lang, f.title.tr, f.title.en)}
                </h3>
                <p className="font-body text-ink-600 text-sm leading-relaxed">
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
      <section id="how" className="py-16 lg:py-24 bg-gradient-to-b from-cream-100 to-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, '3 adım, hepsi bu kadar', '3 steps, that\'s it')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Nasıl Çalışır?', 'How Does It Work?')}
            </h2>
          </div>
          <div className="relative grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-primary-300 via-purple-300 to-success-300 z-0" />
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative z-10"
              >
                <div className={`${step.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg ring-4 ring-white`}>
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
          CURRICULUM WORLDS PREVIEW
          ══════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-primary-50 to-cream-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
            {t(lang, '20 Dünya, 100+ Ders', '20 Worlds, 100+ Lessons')}
          </p>
          <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
            {t(lang, 'Tam Müfredat', 'Full Curriculum')}
          </h2>
          <p className="font-body text-ink-500 mb-12 max-w-xl mx-auto">
            {t(lang,
              'Harflerden hikayelere, hayvanlardan bilime — sistematik bir öğrenme yolculuğu.',
              'From letters to stories, animals to science — a systematic learning journey.'
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {WORLDS_PREVIEW.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border-2 border-ink-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-card transition-all duration-200"
              >
                <div className={`${w.color} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                  <span className="font-display font-black text-white text-xs">{w.num}</span>
                </div>
                <div className="font-display font-bold text-ink-800 text-sm leading-snug">
                  {t(lang, w.title.tr, w.title.en)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHO IS IT FOR?
          ══════════════════════════════════════ */}
      <section id="who" className="py-16 lg:py-24 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-purple-600 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Kimler için?', 'Who is it for?')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Her Seviyeye Uygun', 'Right for Every Level')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {WHO_FOR.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border-2 border-ink-100 rounded-3xl p-7 hover:border-primary-200 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`${w.bg} ${w.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110`}>
                  {w.icon}
                </div>
                <h3 className="font-display font-extrabold text-ink-900 text-xl mb-1">
                  {t(lang, w.audience.tr, w.audience.en)}
                </h3>
                <p className="font-display font-semibold text-ink-400 text-sm mb-4">
                  {t(lang, w.age.tr, w.age.en)}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {(lang === 'tr' ? w.points.tr : w.points.en).map(point => (
                    <li key={point} className="flex items-start gap-2">
                      <Check size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                      <span className="font-body text-ink-600 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          EARLY BIRD / BETA PRICING
          ══════════════════════════════════════ */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-b from-cream-50 to-white scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-800 font-display font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4"
            >
              <Zap size={13} />
              {t(lang, 'Beta Dönemi', 'Beta Period')}
            </motion.div>
            <h2 className="font-display font-black text-ink-900 mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Şimdi Ücretsiz, Hep Avantajlı', 'Free Now, Always Advantaged')}
            </h2>
            <p className="font-body text-ink-500 max-w-xl mx-auto">
              {t(lang,
                'Beta aşamasında tüm özellikler açık ve tamamen ücretsiz. Erken kayıt olanlara gelecekteki planlar için öncelik tanınacak.',
                'All features are open and completely free during Beta. Early registrants will get priority for future plans.'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Beta Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-ink-200 rounded-3xl p-7 hover:border-ink-300 hover:shadow-card transition-all duration-200"
            >
              <p className="font-display font-bold text-ink-500 text-sm uppercase tracking-wide mb-2">
                {t(lang, 'Beta — Ücretsiz', 'Beta — Free')}
              </p>
              <div className="font-display font-black text-ink-900 text-4xl mb-1.5">₺0</div>
              <p className="font-body text-ink-400 text-sm mb-5">{t(lang, 'Beta süresince tüm özellikler açık', 'All features open during Beta')}</p>
              <ul className="flex flex-col gap-2.5 mb-7">
                {(lang === 'tr' ? [
                  'Tüm fonetik dersler',
                  '16 oyun türü',
                  'XP, rozet ve seri takibi',
                  'İlerleme raporları',
                ] : [
                  'All phonics lessons',
                  '16 game types',
                  'XP, badges and streaks',
                  'Progress reports',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="font-body text-ink-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login?tab=signup"
                className="block w-full text-center font-display font-extrabold text-sm bg-ink-800 hover:bg-ink-900 text-white px-5 py-3 rounded-xl transition-all duration-150"
              >
                {t(lang, 'Ücretsiz Başla', 'Start Free')}
              </Link>
            </motion.div>

            {/* Early Bird */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary-500 border-2 border-primary-400 rounded-3xl p-7 relative overflow-hidden hover:shadow-primary-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 font-display font-black text-xs px-3 py-1 rounded-full">
                {t(lang, 'Erken Erişim', 'Early Access')}
              </div>
              <p className="font-display font-bold text-primary-200 text-sm uppercase tracking-wide mb-2">
                {t(lang, 'Erken Kayıt Avantajı', 'Early Registration Benefit')}
              </p>
              <div className="font-display font-black text-white text-2xl leading-tight mb-1">
                {t(lang, 'Öncelikli Erişim', 'Priority Access')}
              </div>
              <p className="font-body text-primary-200 text-sm mb-6">
                {t(lang, 'Gelecekteki planlar açıklandığında erken kayıt indirimi', 'Early bird discount when paid plans launch')}
              </p>
              <ul className="flex flex-col gap-2.5 mb-7">
                {(lang === 'tr' ? [
                  'Beta süresince tüm özellikler açık',
                  'Yeni özelliklere öncelikli erişim',
                  'Geri bildiriminiz ürünü şekillendirir',
                  'Fiyat açıklandığında erken indirim garantisi',
                ] : [
                  'All features open during Beta',
                  'Priority access to new features',
                  'Your feedback shapes the product',
                  'Early discount guaranteed when pricing launches',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={14} className="text-white flex-shrink-0 mt-0.5" />
                    <span className="font-body text-primary-100 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login?tab=signup"
                className="block w-full text-center font-display font-extrabold text-sm bg-white hover:bg-primary-50 text-primary-600 px-5 py-3 rounded-xl transition-all duration-150 hover:scale-105"
              >
                {t(lang, 'Erken Kaydı Garantile', 'Lock In Early Access')}
              </Link>
            </motion.div>
          </div>

          <p className="text-center font-body text-ink-400 text-sm mt-8">
            {t(lang,
              'Beta aşamasında kredi kartı gerekmez. Tamamen ücretsiz.',
              'No credit card required during Beta. Completely free.'
            )}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
          ══════════════════════════════════════ */}
      <FAQSection lang={lang} />

      {/* ══════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-500 to-primary-600 py-16 lg:py-24">
        {/* Background paw prints */}
        <PawIcon size={80} className="absolute top-8 left-8 text-white/10 rotate-[-20deg] pointer-events-none" />
        <PawIcon size={50} className="absolute bottom-12 right-12 text-white/10 rotate-[15deg] pointer-events-none" />
        <PawIcon size={35} className="absolute top-1/2 left-1/3 text-white/10 rotate-[5deg] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 blur-xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Cat ears on Mimi in CTA */}
              <div className="absolute -top-5 left-5 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[22px] border-l-transparent border-r-transparent border-b-white/80 rotate-[-8deg] z-10" />
              <div className="absolute -top-5 right-5 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[22px] border-l-transparent border-r-transparent border-b-white/80 rotate-[8deg] z-10" />
              <div className="w-32 h-32 bg-white/15 border-2 border-white/30 rounded-[32px] flex items-center justify-center overflow-hidden">
                <LottieCharacter state="wave" size={130} />
              </div>
            </div>
          </div>
          <h2 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {t(lang, 'Bugün başla. Ücretsiz.', 'Start today. Free.')}
          </h2>
          <p className="font-body text-white/80 text-lg mb-4">
            {t(lang,
              'Mimi seninle İngilizce öğrenmeye hazır.',
              "Mimi is ready to learn English with you."
            )}
          </p>
          <p className="font-display font-bold text-white/60 text-sm mb-8">
            {t(lang,
              'Beta aşaması — tüm özellikler ücretsiz. Kredi kartı gerekmez.',
              'Beta phase — all features free. No credit card required.'
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              t(lang, 'Beta — ücretsiz erişim', 'Beta — free access'),
              t(lang, 'Reklam yok', 'No ads'),
              t(lang, 'COPPA & KVKK uyumlu', 'COPPA & KVKK compliant'),
            ].map(chip => (
              <span key={chip} className="inline-flex items-center gap-1.5 bg-white/15 text-white font-display font-semibold text-sm px-4 py-1.5 rounded-full border border-white/25">
                <PawIcon size={12} className="text-white/70" />
                {chip}
              </span>
            ))}
          </div>

          <Link
            to="/login?tab=signup"
            className="inline-flex items-center gap-3 bg-white hover:bg-primary-50 text-primary-600 font-display font-extrabold text-lg lg:text-xl px-10 py-5 rounded-2xl shadow-xl transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
          >
            {t(lang, 'Ücretsiz Başla', 'Start Free')}
            <ArrowRight size={22} />
          </Link>

          <p className="font-body text-white/60 text-sm mt-6">
            {t(lang,
              'NRP 2000 (ABD Ulusal Okuma Paneli) • Jolly Phonics • Science of Reading',
              'NRP 2000 (US National Reading Panel) • Jolly Phonics • Science of Reading'
            )}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer className="bg-ink-900 py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PawIcon size={20} className="text-primary-400" />
                <span className="font-display font-black text-xl text-primary-400">MinesMinis</span>
              </div>
              <p className="font-body text-ink-400 text-sm leading-relaxed mb-3">
                {t(lang,
                  'Türkçe konuşan çocuklar için bilim temelli fonetik İngilizce öğrenme platformu.',
                  'Science-based phonics English learning platform for Turkish-speaking children.'
                )}
              </p>
              <span className="inline-block font-display font-bold text-amber-600 text-xs bg-amber-900/30 border border-amber-800 px-3 py-1 rounded-full">
                {t(lang, 'Beta Aşaması', 'Beta Phase')}
              </span>
            </div>
            <div>
              <p className="font-display font-bold text-ink-300 text-sm uppercase tracking-wide mb-4">
                {t(lang, 'Ürün', 'Product')}
              </p>
              <ul className="space-y-2">
                {[
                  { to: '#features', label: t(lang, 'Özellikler', 'Features') },
                  { to: '#compare', label: t(lang, 'Karşılaştırma', 'Compare') },
                  { to: '/login?tab=signup', label: t(lang, 'Ücretsiz Başla', 'Start Free') },
                ].map(item => (
                  item.to.startsWith('#')
                    ? <li key={item.label}><a href={item.to} className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm py-3 min-h-[44px] flex items-center">{item.label}</a></li>
                    : <li key={item.label}><Link to={item.to} className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm py-3 min-h-[44px] flex items-center">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display font-bold text-ink-300 text-sm uppercase tracking-wide mb-4">
                {t(lang, 'Yasal', 'Legal')}
              </p>
              <ul className="space-y-2">
                {[
                  { to: '/privacy', label: t(lang, 'Gizlilik', 'Privacy') },
                  { to: '/terms', label: t(lang, 'Kullanım Şartları', 'Terms') },
                  { to: '/cookies', label: t(lang, 'Çerezler', 'Cookies') },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm py-3 min-h-[44px] flex items-center">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display font-bold text-ink-300 text-sm uppercase tracking-wide mb-4">
                {t(lang, 'İletişim', 'Contact')}
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:support@minesminis.com"
                    className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm py-3 min-h-[44px] flex items-center"
                  >
                    support@minesminis.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:privacy@minesminis.com"
                    className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm py-3 min-h-[44px] flex items-center"
                  >
                    privacy@minesminis.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-ink-800 pt-6 text-center">
            <p className="font-body text-ink-500 text-sm">
              © 2026 MinesMinis. {t(lang, 'Tüm hakları saklıdır.', 'All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
