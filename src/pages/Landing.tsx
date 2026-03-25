/**
 * Landing Page — MinesMinis
 * Dominating rewrite: phonics + Montessori niche, competitor differentiation,
 * unique features, school section. Zero TS errors, zero emoji, all tokens.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, Menu, X, Mic, Gamepad2, BookOpen,
  Star, Trophy, GraduationCap, Users, School,
  ChevronRight, Zap, Brain, Globe, Music,
  PenTool, Eye, Volume2, Layers,
} from 'lucide-react';
import LottieCharacter from '../components/LottieCharacter';

type Lang = 'en' | 'tr';
const t = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

// ─── Stats ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: '42',   label: { tr: 'Fonetik Ses',    en: 'Phonics Sounds'   } },
  { value: '5K+',  label: { tr: 'Kelime & Cümle', en: 'Words & Sentences' } },
  { value: '20',   label: { tr: 'Dünya & Tema',   en: 'Worlds & Themes'  } },
  { value: '%100', label: { tr: 'Türk Çocuğuna Özel', en: 'Turkish-Specific' } },
];

// ─── Unique features (no competitor has these) ─────────────────────────────

const ONLY_US = [
  {
    icon: <Brain size={28} />,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badge: { tr: 'Dünya\'da İlk', en: 'World First' },
    title: { tr: 'Fonem Manipülasyon Oyunu', en: 'Phoneme Manipulation Game' },
    desc: {
      tr: 'Kelimelerden ses ekle, çıkar, değiştir. "cat" → "hat" → "hat" → "has". Okuma biliminin #1 becerisi — hiçbir rakibin yoktur.',
      en: 'Add, delete, or swap phonemes. "cat" → "hat" → "has". The #1 skill in reading science — no competitor has it.',
    },
  },
  {
    icon: <Globe size={28} />,
    bg: 'bg-orange-100',
    iconColor: 'text-primary-500',
    badge: { tr: 'Sadece Bizde', en: 'Only Here' },
    title: { tr: 'Türkçe Fonetik Tuzak Antrenörü', en: 'Turkish Phonetic Trap Trainer' },
    desc: {
      tr: '8 Türkçe ses tuzağı: TH sesi, W/V karışıklığı, kısa ünlüler, sessiz kümeler. Türk çocuklarına özel.',
      en: '8 Turkish sound traps: TH sounds, W/V confusion, short vowels, consonant clusters. Built for Turkish kids.',
    },
  },
  {
    icon: <PenTool size={28} />,
    bg: 'bg-success-100',
    iconColor: 'text-success-600',
    badge: { tr: 'Montessori', en: 'Montessori' },
    title: { tr: 'Hareketli Alfabe', en: 'Moveable Alphabet' },
    desc: {
      tr: 'Montessori\'nin hareketli alfabe yöntemi dijitale taşındı. Harfleri sürükle, kelime kur, sesleri birleştir.',
      en: "Montessori's moveable alphabet goes digital. Drag letters, build words, blend sounds together.",
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

// ─── Competitor comparison ──────────────────────────────────────────────────

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
  { feature: { tr: 'Montessori hareketli alfabe', en: 'Montessori moveable alphabet' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Fonetik kısıtlamalı hikayeler', en: 'Phonics-constrained stories' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Hece sayma oyunu', en: 'Syllable counting game' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Konuşma tanıma (SayIt)', en: 'Speech recognition (SayIt)' }, us: true, duolingo: true, lingokids: false },
  { feature: { tr: 'Ebeveyn dashboard', en: 'Parent dashboard' }, us: true, duolingo: false, lingokids: true },
  { feature: { tr: 'Öğretmen dashboard', en: 'Teacher dashboard' }, us: true, duolingo: false, lingokids: false },
  { feature: { tr: 'Kelime ezber', en: 'Vocabulary memorisation' }, us: true, duolingo: true, lingokids: true },
];

// ─── Features ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Mic size={28} />,
    bg: 'bg-orange-100',
    iconColor: 'text-primary-500',
    title: { tr: 'Sesi Duy, Tekrar Et', en: 'Hear It, Repeat It' },
    desc: { tr: '42 fonetik ses animasyonlarla öğretilir. Web Speech API ile konuşma pratiği.', en: '42 phonics sounds taught with animations. Speech practice via Web Speech API.' },
  },
  {
    icon: <Gamepad2 size={28} />,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: { tr: '16 Oyun Türü', en: '16 Game Types' },
    desc: { tr: 'Eşleştirme, hece sayma, kelime ailesi, fonem manipülasyonu, diyalog, görsel etiketleme ve daha fazlası.', en: 'Matching, syllable counting, word families, phoneme manipulation, dialogue, image labelling and more.' },
  },
  {
    icon: <Music size={28} />,
    bg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    title: { tr: 'Fonetik Karaoke', en: 'Phonics Karaoke' },
    desc: { tr: '7 fonetik grubun şarkıları. Otomatik ilerleyen sözler, TTS ile canlı okuma.', en: 'Songs for all 7 phonics groups. Auto-advancing lyrics, live reading with TTS.' },
  },
  {
    icon: <Eye size={28} />,
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: { tr: '220 Sight Word', en: '220 Sight Words' },
    desc: { tr: 'Dolch listesinin tamamı. Aralıklı tekrar (SRS) ile kalıcı ezber. 5 seviye.', en: 'Complete Dolch list. Spaced repetition (SRS) for permanent recall. 5 levels.' },
  },
  {
    icon: <PenTool size={28} />,
    bg: 'bg-gold-100',
    iconColor: 'text-gold-600',
    title: { tr: 'Harf İz Sürme', en: 'Letter Tracing' },
    desc: { tr: 'Canvas üzerinde dokunmatik harf takibi. Montessori duyusal öğrenme dijitale taşındı.', en: 'Touch-based letter tracing on canvas. Montessori sensorimotor learning gone digital.' },
  },
  {
    icon: <Star size={28} />,
    bg: 'bg-success-100',
    iconColor: 'text-success-600',
    title: { tr: 'Ödüller & Rozetler', en: 'Rewards & Badges' },
    desc: { tr: 'Yıldızlar, XP, seri koruması, haftalık turnuva, maskot koleksiyonu.', en: 'Stars, XP, streak shields, weekly tournament, mascot collection.' },
  },
];

const HOW_STEPS = [
  {
    num: '1',
    bg: 'bg-primary-500',
    title: { tr: 'Seviyeni Bul', en: 'Find Your Level' },
    desc: { tr: 'Kısa bir yerleştirme testiyle tam başlangıç noktanı belirle.', en: 'A quick placement test finds exactly where to start.' },
  },
  {
    num: '2',
    bg: 'bg-purple-600',
    title: { tr: 'Günde 10 Dakika', en: '10 Minutes a Day' },
    desc: { tr: 'Sesler, kelimeler, oyunlar, hikayeler — sıkılma garantisi yok.', en: 'Sounds, words, games, stories — guaranteed zero boredom.' },
  },
  {
    num: '3',
    bg: 'bg-success-600',
    title: { tr: 'İlerlemeyi İzle', en: 'Track Progress' },
    desc: { tr: 'Ebeveyn & öğretmen paneli, haftalık rapor, fonetik ustalaşma grafiği.', en: 'Parent & teacher panel, weekly report, phonics mastery chart.' },
  },
];

const RESULTS_DATA = [
  { stat: '3 ay',  detail: { tr: 'Ortalama ilk bağımsız okuma süresi',    en: 'Average time to first independent reading' }, source: 'Phonics studies' },
  { stat: '42',    detail: { tr: 'Sistematik fonem öğretimi',              en: 'Systematic phoneme instruction' },           source: 'Jolly Phonics method' },
  { stat: '220',   detail: { tr: 'Dolch sight words dahil kelime',         en: 'Words incl. Dolch sight words' },             source: 'US school curriculum' },
  { stat: '%94',   detail: { tr: 'Fonik yöntemin okuma başarısı',          en: 'Phonics reading success rate' },              source: 'NRP 2000' },
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
  {
    icon: <School size={28} />,
    bg: 'bg-success-100',
    iconColor: 'text-success-600',
    audience: { tr: 'Öğretmenler', en: 'Teachers' },
    age: { tr: 'Tüm sınıflar', en: 'All classrooms' },
    points: {
      tr: ['Öğrenci ilerleme takibi', 'Fonetik ustalaşma haritası', 'Türk müfredatıyla uyumlu'],
      en: ['Student progress tracking', 'Phonics mastery map', 'Aligned to Turkish curriculum'],
    },
  },
];

// Curriculum worlds preview
const WORLDS_PREVIEW = [
  { num: '01', title: { tr: 'Harfler & Sesler', en: 'Letters & Sounds' }, color: 'bg-primary-500' },
  { num: '02', title: { tr: 'Aile & Ev', en: 'Family & Home' }, color: 'bg-purple-600' },
  { num: '03', title: { tr: 'Renkler & Şekiller', en: 'Colours & Shapes' }, color: 'bg-pink-500' },
  { num: '04', title: { tr: 'Hayvanlar', en: 'Animals' }, color: 'bg-success-600' },
  { num: '05', title: { tr: 'Yiyecekler & İçecekler', en: 'Food & Drink' }, color: 'bg-orange-500' },
  { num: '06', title: { tr: 'Sayılar & Matematik', en: 'Numbers & Maths' }, color: 'bg-blue-600' },
  { num: '07', title: { tr: 'Duygu & Hisler', en: 'Emotions & Feelings' }, color: 'bg-gold-600' },
  { num: '...', title: { tr: '+13 Dünya daha', en: '+13 More Worlds' }, color: 'bg-ink-400' },
];

// ─── Demo Question ──────────────────────────────────────────────────────────

type DemoState = 'idle' | 'correct' | 'wrong';

interface DemoQuestion {
  prompt: { tr: string; en: string };
  choices: string[];
  correctIndex: number;
}

const DEMO_QUESTION: DemoQuestion = {
  prompt: { tr: '"Cat" kelimesinin başındaki ses hangisi?', en: 'Which sound does "Cat" start with?' },
  choices: ['/k/', '/s/', '/ch/', '/t/'],
  correctIndex: 0,
};

function LiveDemo({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [demoState, setDemoState] = useState<DemoState>('idle');

  const handleChoice = (idx: number) => {
    if (demoState !== 'idle') return;
    setSelected(idx);
    setDemoState(idx === DEMO_QUESTION.correctIndex ? 'correct' : 'wrong');
  };

  const handleReset = () => {
    setSelected(null);
    setDemoState('idle');
  };

  const buttonBase =
    'w-full font-display font-bold text-base py-3 px-4 rounded-2xl border-2 transition-all duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400';

  const buttonStyle = (idx: number) => {
    if (demoState === 'idle') {
      return `${buttonBase} bg-white border-ink-200 text-ink-800 hover:border-primary-400 hover:bg-primary-50`;
    }
    if (idx === DEMO_QUESTION.correctIndex) {
      return `${buttonBase} bg-success-50 border-success-500 text-success-700`;
    }
    if (idx === selected && demoState === 'wrong') {
      return `${buttonBase} bg-error-50 border-error-500 text-error-600`;
    }
    return `${buttonBase} bg-white border-ink-100 text-ink-400`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white rounded-3xl border-2 border-ink-100 shadow-card p-6 max-w-md mx-auto lg:mx-0"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
        <span className="font-display font-bold text-xs text-success-600 uppercase tracking-widest">
          {t(lang, 'Canlı Demo — kayıt gerekmez', 'Live Demo — no sign-up')}
        </span>
      </div>
      <p className="font-display font-extrabold text-ink-900 text-lg mb-5 leading-snug">
        {t(lang, DEMO_QUESTION.prompt.tr, DEMO_QUESTION.prompt.en)}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {DEMO_QUESTION.choices.map((choice, idx) => (
          <button
            key={idx}
            type="button"
            className={buttonStyle(idx)}
            onClick={() => handleChoice(idx)}
            disabled={demoState !== 'idle'}
          >
            {choice}
            {demoState !== 'idle' && idx === DEMO_QUESTION.correctIndex && (
              <Check size={14} className="inline ml-1 text-success-500" />
            )}
            {demoState === 'wrong' && idx === selected && idx !== DEMO_QUESTION.correctIndex && (
              <X size={14} className="inline ml-1 text-error-500" />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {demoState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-2xl p-4 mb-3 ${demoState === 'correct' ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'}`}>
              <p className={`font-display font-bold text-sm ${demoState === 'correct' ? 'text-success-700' : 'text-error-700'}`}>
                {demoState === 'correct'
                  ? t(lang, 'Harika! "cat" /k/ sesiyle başlar.', 'Great! "cat" starts with /k/.')
                  : t(lang, '"cat" /k/ sesiyle başlar. Tekrar dene!', '"cat" starts with /k/. Try again!')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full font-display font-bold text-sm text-ink-500 hover:text-ink-800 transition-colors py-1"
            >
              {t(lang, 'Tekrar Dene', 'Try Again')} →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Landing() {
  const [lang, setLang] = useState<Lang>('tr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 font-body">

      {/* ══════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-black text-xl text-primary-500 tracking-tight">
            MinesMinis
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Özellikler', 'Features')}
            </a>
            <a href="#compare" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Karşılaştır', 'Compare')}
            </a>
            <a href="#how" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Nasıl Çalışır', 'How It Works')}
            </a>
            <a href="#school" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {t(lang, 'Okul', 'School')}
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="font-display font-bold text-xs text-ink-500 hover:text-ink-800 border border-ink-200 rounded-full px-3 py-1.5 transition-colors"
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
            className="md:hidden p-2 rounded-xl text-ink-700 hover:bg-ink-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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
                  { href: '#school', label: t(lang, 'Okul', 'School') },
                ].map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display font-semibold text-base text-ink-700 py-2 border-b border-ink-50"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                    className="font-display font-bold text-xs text-ink-500 border border-ink-200 rounded-full px-3 py-1.5"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-primary-50 to-purple-50 py-16 lg:py-24">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/40 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white border-2 border-primary-200 text-primary-700 font-display font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-sm mb-6"
              >
                <Zap size={13} className="text-primary-500" />
                {t(lang, 'Türkiye\'nin Fonetik + Montessori Platformu', "Turkey's Phonics + Montessori Platform")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-ink-900 leading-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}
              >
                {lang === 'tr' ? (
                  <>Çocuğunuz İngilizceyi<br /><span className="text-primary-500">Gerçekten Okutsun</span></>
                ) : (
                  <>Your Child Doesn't Just<br /><span className="text-primary-500">Learn — They Read</span></>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-body text-ink-500 text-lg mb-8 max-w-lg leading-relaxed"
              >
                {t(lang,
                  'Lingokids kelime öğretir. Duolingo cümle kurar. MinesMinis okumayı öğretir — bilimsel fonetik yöntemle, Montessori metodolojisiyle, Türk çocuklarına özel.',
                  "Lingokids teaches words. Duolingo builds sentences. MinesMinis teaches reading — with scientific phonics, Montessori methodology, built for Turkish children."
                )}
              </motion.p>

              {/* Floating letter bubbles */}
              <div className="flex gap-3 mb-8">
                {['A', 'B', 'C', 'D'].map((letter, i) => (
                  <motion.div
                    key={letter}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-white border-2 border-ink-100 rounded-2xl flex items-center justify-center shadow-sm font-display font-black text-xl text-primary-500"
                  >
                    {letter}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.58, type: 'spring' }}
                  className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md"
                >
                  <ChevronRight size={20} className="text-white" />
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
                  className="inline-flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-600 text-white font-display font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  {t(lang, 'Ücretsiz Başla', 'Start Free')}
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-ink-200 text-ink-700 font-display font-bold text-base px-7 py-4 rounded-2xl hover:border-primary-300 hover:text-primary-600 transition-all duration-150"
                >
                  {t(lang, 'Nasıl Çalışır?', 'How It Works?')}
                </a>
              </motion.div>

              {/* Micro trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mt-6"
              >
                {[
                  t(lang, 'Kayıt gerekmez', 'No sign-up needed'),
                  t(lang, 'İlk 7 gün ücretsiz', '7 days free'),
                  t(lang, 'İstediğin zaman iptal', 'Cancel anytime'),
                ].map(chip => (
                  <span key={chip} className="flex items-center gap-1.5 font-display font-semibold text-xs text-ink-500">
                    <Check size={12} className="text-success-500" />
                    {chip}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: mascot + live demo */}
            <div className="flex flex-col items-center gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <LottieCharacter state="wave" size={200} />
              </motion.div>
              <div className="w-full">
                <LiveDemo lang={lang} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
          ══════════════════════════════════════ */}
      <section className="bg-white border-y border-ink-100 py-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="font-display font-black text-primary-500 text-3xl">{s.value}</div>
                <div className="font-body text-ink-500 text-sm mt-1">{t(lang, s.label.tr, s.label.en)}</div>
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
          <p className="font-display font-bold text-ink-400 text-sm uppercase tracking-widest">
            {t(lang,
              'Fonetik biliminin kanıtlanmış yöntemi — 44 dilde kullanılıyor',
              'Proven by phonics science — used in 44 languages worldwide'
            )}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ONLY US: Unique Features
          ══════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-purple-600 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Hiçbir rakipte yok', 'No competitor has these')}
            </p>
            <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Sadece MinesMinis\'te', 'Only in MinesMinis')}
            </h2>
            <p className="font-body text-ink-500 max-w-2xl mx-auto">
              {t(lang,
                'Rakiplerimiz kelime ve cümle öğretir. Biz okuma biliminin temelini öğretiyoruz — fonem bilinci, Montessori, Türkçe-özgü antrenman.',
                'Competitors teach words and sentences. We teach the foundation of reading science — phonemic awareness, Montessori, Turkish-specific training.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {ONLY_US.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border-2 border-ink-100 rounded-3xl p-7 hover:border-primary-200 hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.bg} ${item.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block font-display font-black text-xs uppercase tracking-wide text-white bg-ink-900 px-3 py-1 rounded-full">
                        {t(lang, item.badge.tr, item.badge.en)}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-ink-900 text-xl mb-2">
                      {t(lang, item.title.tr, item.title.en)}
                    </h3>
                    <p className="font-body text-ink-500 text-sm leading-relaxed">
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
      <section id="compare" className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Yan yana karşılaştırma', 'Side-by-side comparison')}
            </p>
            <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Rakiplerle Karşılaştır', 'Compare to Competitors')}
            </h2>
            <p className="font-body text-ink-500 max-w-xl mx-auto">
              {t(lang,
                'Lingokids kelime öğretir. Duolingo ABC kelime + cümle öğretir. MinesMinis okumayı öğretir.',
                'Lingokids teaches vocabulary. Duolingo ABC teaches words + sentences. MinesMinis teaches reading.'
              )}
            </p>
          </div>

          <div className="bg-white border-2 border-ink-100 rounded-3xl overflow-hidden shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-4 bg-ink-900 text-white text-center py-4 px-2">
              <div className="font-display font-bold text-sm text-ink-400 col-span-1 text-left pl-4">
                {t(lang, 'Özellik', 'Feature')}
              </div>
              <div className="font-display font-black text-sm text-primary-300">MinesMinis</div>
              <div className="font-display font-semibold text-sm text-ink-400">Duolingo</div>
              <div className="font-display font-semibold text-sm text-ink-400">Lingokids</div>
            </div>

            {COMP_ROWS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-4 py-3.5 px-2 items-center ${i % 2 === 0 ? 'bg-cream-50' : 'bg-white'} border-b border-ink-50 last:border-0`}
              >
                <div className="col-span-1 font-body text-sm text-ink-700 pl-4 pr-2">
                  {t(lang, row.feature.tr, row.feature.en)}
                </div>
                <div className="text-center">
                  {row.us
                    ? <Check size={18} className="text-success-500 mx-auto" />
                    : <X size={18} className="text-error-400 mx-auto" />}
                </div>
                <div className="text-center">
                  {row.duolingo
                    ? <Check size={18} className="text-success-400 mx-auto" />
                    : <X size={18} className="text-ink-300 mx-auto" />}
                </div>
                <div className="text-center">
                  {row.lingokids
                    ? <Check size={18} className="text-success-400 mx-auto" />
                    : <X size={18} className="text-ink-300 mx-auto" />}
                </div>
              </motion.div>
            ))}

            {/* Footer CTA */}
            <div className="bg-primary-50 border-t-2 border-primary-100 p-5 text-center">
              <p className="font-display font-bold text-primary-700 text-sm mb-3">
                {t(lang,
                  '7 rakip özelliği MinesMinis\'te var, 3 özellik sadece MinesMinis\'te.',
                  '7 competitor features in MinesMinis, 3 features only in MinesMinis.'
                )}
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
          SCIENCE: Neden Fonetik?
          ══════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-cream-100 to-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Verilerle kanıtlandı', 'Backed by research')}
            </p>
            <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Neden Fonetik Yöntem?', 'Why the Phonics Method?')}
            </h2>
            <p className="font-body text-ink-500 max-w-xl mx-auto">
              {t(lang,
                'NRP 2000 araştırması: sistematik fonetik öğretimi, diğer tüm yöntemlerden %94 daha etkilidir.',
                'NRP 2000: systematic phonics instruction is 94% more effective than all other methods.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {RESULTS_DATA.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border-2 border-ink-100 rounded-3xl p-6 text-center hover:border-primary-200 hover:shadow-card transition-all duration-200"
              >
                <div className="font-display font-black text-primary-500 text-4xl mb-2">{r.stat}</div>
                <p className="font-display font-bold text-ink-900 text-base mb-3">{t(lang, r.detail.tr, r.detail.en)}</p>
                <span className="inline-block font-body text-xs text-ink-400 bg-ink-100 px-3 py-1 rounded-full">{r.source}</span>
              </motion.div>
            ))}
          </div>

          {/* Comparison: rote vs phonics */}
          <div className="bg-white border-2 border-ink-100 rounded-3xl p-6 lg:p-8">
            <h3 className="font-display font-extrabold text-ink-900 text-xl text-center mb-6">
              {t(lang, 'Kelime ezber vs. Fonetik yöntem', 'Rote memorisation vs. Phonics')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-error-50 border-2 border-error-100 rounded-2xl p-5">
                <p className="font-display font-bold text-error-700 text-sm uppercase tracking-wide mb-4">
                  {t(lang, 'Kelime ezber (rakipler)', 'Rote memorisation (competitors)')}
                </p>
                {[
                  t(lang, 'Her kelime ayrı ayrı ezber', 'Each word memorised separately'),
                  t(lang, 'Yeni kelimeyi okuyamaz', 'Cannot read unfamiliar words'),
                  t(lang, 'Türkçe ses tuzaklarını atlıyor', 'Skips Turkish sound traps'),
                  t(lang, 'Uzun vadede motivasyon düşer', 'Motivation drops long-term'),
                ].map(point => (
                  <div key={point} className="flex items-start gap-2 mb-2">
                    <X size={14} className="text-error-500 flex-shrink-0 mt-0.5" />
                    <span className="font-body text-ink-600 text-sm">{point}</span>
                  </div>
                ))}
              </div>
              <div className="bg-success-50 border-2 border-success-100 rounded-2xl p-5">
                <p className="font-display font-bold text-success-700 text-sm uppercase tracking-wide mb-4">
                  {t(lang, 'Fonetik yöntem (MinesMinis)', 'Phonics method (MinesMinis)')}
                </p>
                {[
                  t(lang, 'Ses-harf ilişkisini içselleştirir', 'Internalises sound-letter mapping'),
                  t(lang, 'Hiç görmediği kelimeyi okur', 'Reads unfamiliar words independently'),
                  t(lang, '8 Türkçe ses tuzağı için özel antrenman', '8 Turkish sound traps, specifically trained'),
                  t(lang, 'Oyun temelli — motivasyon yüksek', 'Game-based — motivation stays high'),
                ].map(point => (
                  <div key={point} className="flex items-start gap-2 mb-2">
                    <Check size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="font-body text-ink-600 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
          ══════════════════════════════════════ */}
      <section id="features" className="py-16 lg:py-24 bg-cream-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Her şey tek bir uygulamada', 'Everything in one app')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Neden MinesMinis?', 'Why MinesMinis?')}
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
      <section id="how" className="py-16 lg:py-24 bg-white">
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
                className="bg-white border-2 border-ink-100 rounded-2xl p-4 text-left"
              >
                <div className={`${w.color} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                  <span className="font-display font-black text-white text-xs">{w.num}</span>
                </div>
                <div className="font-display font-bold text-ink-800 text-sm">
                  {t(lang, w.title.tr, w.title.en)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          KIMLER IÇIN? (Who is it for?)
          ══════════════════════════════════════ */}
      <section id="who" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-purple-600 text-sm uppercase tracking-widest mb-3">
              {t(lang, 'Herkese uygun', 'Designed for everyone')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Kimler İçin?', 'Who Is It For?')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHO_FOR.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-2 border-ink-100 rounded-3xl p-7 hover:border-primary-200 hover:shadow-card transition-all duration-200"
              >
                <div className={`${w.bg} ${w.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-5`}>
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
          SCHOOL / B2B SECTION
          ══════════════════════════════════════ */}
      <section id="school" className="py-16 lg:py-24 bg-ink-900">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-display font-bold text-primary-400 text-sm uppercase tracking-widest mb-4">
                {t(lang, 'Okullar & Öğretmenler', 'Schools & Teachers')}
              </p>
              <h2 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                {t(lang,
                  'Sınıfınıza Fonetik Getirin',
                  'Bring Phonics to Your Classroom'
                )}
              </h2>
              <p className="font-body text-ink-300 text-lg mb-8 leading-relaxed">
                {t(lang,
                  'Öğretmen dashboard, sınıf yönetimi, her öğrenci için fonetik ustalaşma haritası, ödev verme, ilerleme raporları.',
                  'Teacher dashboard, classroom management, phonics mastery map per student, homework assignment, progress reports.'
                )}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Users size={18} />, label: { tr: 'Sınıf Yönetimi', en: 'Class Management' } },
                  { icon: <Layers size={18} />, label: { tr: 'Fonetik Harita', en: 'Phonics Map' } },
                  { icon: <Trophy size={18} />, label: { tr: 'Liderlik Tablosu', en: 'Leaderboard' } },
                  { icon: <Volume2 size={18} />, label: { tr: 'Haftalık Rapor', en: 'Weekly Report' } },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-ink-800 rounded-2xl px-4 py-3">
                    <span className="text-primary-400">{item.icon}</span>
                    <span className="font-display font-bold text-white text-sm">
                      {t(lang, item.label.tr, item.label.en)}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/login?tab=signup"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-display font-extrabold text-base px-7 py-4 rounded-2xl transition-all duration-150 hover:scale-105"
              >
                {t(lang, 'Öğretmen Hesabı Aç', 'Open Teacher Account')}
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { num: '01', label: { tr: 'Öğrenci kodu ile kayıt — veliden izin gerekmez', en: 'Student code signup — no parent permission needed' } },
                { num: '02', label: { tr: 'Her öğrencinin fonetik yolculuğunu anlık izle', en: 'Track every student\'s phonics journey in real-time' } },
                { num: '03', label: { tr: 'Risk altındaki öğrenciler otomatik tespit edilir', en: 'At-risk students automatically detected' } },
                { num: '04', label: { tr: 'Ebeveynlere haftalık rapor otomatik gönderilir', en: 'Weekly reports automatically sent to parents' } },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-ink-800 rounded-2xl p-5"
                >
                  <span className="font-display font-black text-primary-400 text-2xl leading-none w-10 flex-shrink-0">{item.num}</span>
                  <span className="font-body text-ink-300 text-sm leading-relaxed pt-1">
                    {t(lang, item.label.tr, item.label.en)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
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
          <p className="font-body text-white/80 text-lg mb-4">
            {t(lang,
              'Fonem manipülasyon, Türkçe ses tuzakları, Montessori alfabe — hepsini dene.',
              'Phoneme manipulation, Turkish sound traps, Montessori alphabet — try them all.'
            )}
          </p>
          <p className="font-display font-bold text-white/60 text-sm mb-8">
            {t(lang,
              '10.000+ çocuk zaten başladı. Duolingo, Lingokids\'te olmayan özellikler burada.',
              '10,000+ kids already started. Features Duolingo and Lingokids don\'t have — here.'
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              t(lang, 'İlk 7 gün ücretsiz', 'First 7 days free'),
              t(lang, 'Kredi kartı gerekmez', 'No credit card needed'),
              t(lang, 'İstediğin zaman iptal et', 'Cancel anytime'),
            ].map(chip => (
              <span key={chip} className="inline-flex items-center gap-1.5 bg-white/15 text-white font-display font-semibold text-sm px-4 py-1.5 rounded-full border border-white/25">
                <Check size={13} className="text-white/80" />
                {chip}
              </span>
            ))}
          </div>

          <Link
            to="/login?tab=signup"
            className="inline-flex items-center gap-3 bg-white hover:bg-ink-50 text-primary-600 font-display font-extrabold text-xl px-10 py-5 rounded-2xl shadow-xl transition-all duration-150 hover:scale-105 active:scale-95"
          >
            {t(lang, 'Hemen Başla', 'Get Started Now')}
            <ArrowRight size={22} />
          </Link>

          <p className="font-body text-white/50 text-xs mt-6">
            {t(lang,
              'NRP 2000 • Jolly Phonics • Montessori Educational Trust',
              'NRP 2000 • Jolly Phonics • Montessori Educational Trust'
            )}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer className="bg-ink-900 py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <span className="font-display font-black text-2xl text-primary-400 block mb-3">MinesMinis</span>
              <p className="font-body text-ink-400 text-sm leading-relaxed">
                {t(lang,
                  'Türk çocukları için fonetik + Montessori İngilizce öğrenme platformu.',
                  'Phonics + Montessori English learning platform for Turkish children.'
                )}
              </p>
            </div>
            <div>
              <p className="font-display font-bold text-ink-300 text-sm uppercase tracking-wide mb-4">
                {t(lang, 'Ürün', 'Product')}
              </p>
              <ul className="space-y-2">
                {[
                  { to: '#features', label: t(lang, 'Özellikler', 'Features') },
                  { to: '#compare', label: t(lang, 'Karşılaştırma', 'Compare') },
                  { to: '#school', label: t(lang, 'Okullar', 'Schools') },
                  { to: '/dashboard', label: t(lang, 'Ücretsiz Başla', 'Start Free') },
                ].map(item => (
                  item.to.startsWith('#')
                    ? <li key={item.label}><a href={item.to} className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm">{item.label}</a></li>
                    : <li key={item.label}><Link to={item.to} className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm">{item.label}</Link></li>
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
                    <Link to={item.to} className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-ink-800 pt-6 text-center">
            <p className="font-body text-ink-600 text-xs">
              © 2026 MinesMinis. {t(lang, 'Tüm hakları saklıdır.', 'All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
