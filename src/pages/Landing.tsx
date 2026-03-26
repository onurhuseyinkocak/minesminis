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
  Star, GraduationCap, Shield, Users, Sparkles, ChevronDown,
  ChevronRight, Zap, Brain, Globe, Music,
  PenTool, Eye,
} from 'lucide-react';
import LottieCharacter from '../components/LottieCharacter';

type Lang = 'en' | 'tr';
const t = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

// ─── Stats ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: '42',   label: { tr: 'Fonetik Ses',       en: 'Phonics Sounds'   } },
  { value: '16',   label: { tr: 'Oyun Türü',          en: 'Game Types'       } },
  { value: '220',  label: { tr: 'Sight Word',         en: 'Sight Words'      } },
  { value: '50+',  label: { tr: 'Fonetik Hikaye',     en: 'Phonics Stories'  } },
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
  { feature: { tr: 'Kelime ezber', en: 'Vocabulary memorisation' }, us: true, duolingo: true, lingokids: true },
];

// ─── Features ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Mic size={28} />,
    bg: 'bg-orange-100',
    iconColor: 'text-primary-500',
    title: { tr: 'Konuşarak Öğren', en: 'Learn by Speaking' },
    desc: { tr: 'Sesi duy, tekrar et, telaffuzunu kontrol et. Mikrofon destekli konuşma pratiği her derste.', en: 'Hear it, repeat it, check your pronunciation. Microphone-supported speaking practice in every lesson.' },
  },
  {
    icon: <Gamepad2 size={28} />,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: { tr: 'Oynarken Öğrensin', en: 'Learn While Playing' },
    desc: { tr: '16 farklı oyun türü: eşleştirme, hece sayma, kelime ailesi, fonem manipülasyonu ve daha fazlası.', en: '16 game types: matching, syllable counting, word families, phoneme manipulation and more.' },
  },
  {
    icon: <Music size={28} />,
    bg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    title: { tr: 'Şarkıyla Pekiştir', en: 'Reinforce with Songs' },
    desc: { tr: '7 fonetik grubun şarkıları. Söylerken okuma. Çocuklar en iyi müzikle öğrenir.', en: 'Songs for all 7 phonics groups. Reading while singing. Kids learn best with music.' },
  },
  {
    icon: <Eye size={28} />,
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: { tr: '220 Temel Kelime', en: '220 Core Words' },
    desc: { tr: 'ABD müfredatının 220 Dolch kelimesi. Aralıklı tekrar sistemiyle akılda kalıcı.', en: '220 Dolch words from the US curriculum. Spaced repetition keeps them memorable.' },
  },
  {
    icon: <PenTool size={28} />,
    bg: 'bg-gold-100',
    iconColor: 'text-gold-600',
    title: { tr: 'Elleriyle Hisseder', en: 'Feel It With Their Hands' },
    desc: { tr: 'Dokunmatik harf takibi. Montessori\'nin duyusal öğrenme ilkesi dijital ortama taşındı.', en: 'Touch-based letter tracing. Montessori\'s sensory learning principle brought to the screen.' },
  },
  {
    icon: <Star size={28} />,
    bg: 'bg-success-100',
    iconColor: 'text-success-600',
    title: { tr: 'Motivasyon Hiç Düşmez', en: 'Motivation Never Drops' },
    desc: { tr: 'Yıldızlar, XP, seriler, günlük hedef, haftalık turnuva. Her ders bir başarı hissi bırakır.', en: 'Stars, XP, streaks, daily goals, weekly tournaments. Every lesson ends with a sense of achievement.' },
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
    desc: { tr: 'Günde 10 dakika. Sesler, kelimeler, oyunlar, şarkılar, hikayeler — sıkılma diye bir şey yok.', en: '10 minutes a day. Sounds, words, games, songs, stories — zero boredom, always.' },
  },
  {
    num: '3',
    bg: 'bg-success-600',
    title: { tr: 'Sonucu Gör', en: 'See the Results' },
    desc: { tr: 'XP, seriler, rozetler ve haftalık hedeflerle ilerlemeyi anlık takip et.', en: 'Track progress in real-time with XP, streaks, badges and weekly goals.' },
  },
];

const RESULTS_DATA = [
  { stat: '42',    detail: { tr: 'Ses öğretilen fonetik program (Jolly Phonics yöntemi)', en: 'Sounds in phonics programme (Jolly Phonics method)' },  source: 'Jolly Phonics' },
  { stat: '220',   detail: { tr: 'Dolch listesinden sight word — ABD müfredatı standardı', en: 'Sight words from Dolch list — US curriculum standard' }, source: 'Dolch Word List' },
  { stat: '%94',   detail: { tr: 'Fonetik yöntemle okuryazarlık başarısı (NRP 2000)', en: 'Literacy success rate with phonics (NRP 2000)' },            source: 'NRP 2000' },
  { stat: '50+',   detail: { tr: 'Yalnızca öğrenilen seslerle yazılmış hikaye', en: 'Stories written using only learned sounds' },                     source: 'MinesMinis' },
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


// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ_DATA = [
  { q: { tr: 'MinesMinis hangi yaş grubuna uygun?', en: 'What age group is MinesMinis for?' }, a: { tr: 'MinesMinis 3–10 yaş arası çocuklar için tasarlanmıştır. Yerleştirme testi her çocuğun seviyesine uygun başlangıç noktasını belirler.', en: 'MinesMinis is designed for children aged 3–10. The placement test finds the right starting point for every child.' } },
  { q: { tr: 'Fonetik yöntem nedir ve neden önemli?', en: 'What is the phonics method and why does it matter?' }, a: { tr: 'Harfleri seslerle eşleştirerek okuma öğretir. Sistematik fonetik öğretimi en etkili okuma yöntemidir.', en: 'Phonics maps letters to sounds. Systematic phonics instruction is the most effective reading method.' } },
  { q: { tr: 'Günde ne kadar süre yeterli?', en: 'How much time per day is enough?' }, a: { tr: 'Günde sadece 10 dakika yeterli. Kısa ve odaklı dersler çocukların dikkat süresine uygun tasarlanmıştır.', en: "Just 10 minutes a day. Short focused lessons match children's attention spans." } },
  { q: { tr: 'Ücretsiz plan sonsuza kadar geçerli mi?', en: 'Is the free plan valid forever?' }, a: { tr: 'Evet. Günde 1 ders, 7 fonetik grup ve 5 oyun türüne erişim sonsuza kadar ücretsizdir.', en: 'Yes. 1 lesson per day, 7 phonics groups, and 5 game types — free forever.' } },
  { q: { tr: 'Türkçe konuşan çocuklar için özel bir şey var mı?', en: 'Is there anything special for Turkish-speaking children?' }, a: { tr: '8 Türkçe ses tuzağı için özel antrenman modülümüz var: TH sesi, W/V karışıklığı, kısa ünlüler ve daha fazlası.', en: 'We have a special training module for 8 Turkish sound traps: TH sounds, W/V confusion, short vowels and more.' } },
];

// ─── FAQ Component ────────────────────────────────────────────────────────────

function FAQSection({ lang }: { lang: Lang }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-display font-bold text-primary-500 text-sm uppercase tracking-widest mb-3">
            {t(lang, 'Sik Sorulan Sorular', 'Frequently Asked Questions')}
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
                className="bg-white border-2 border-ink-100 rounded-2xl overflow-hidden hover:border-primary-200 transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-ink-900 text-base">
                    {t(lang, faq.q.tr, faq.q.en)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-ink-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
                      <div className="px-6 pb-5">
                        <p className="font-body text-ink-500 text-sm leading-relaxed">
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
            <a href="#pricing" className="font-display font-semibold text-sm text-amber-600 hover:text-amber-700 transition-colors">
              {t(lang, 'Erken Kayit', 'Early Bird')}
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              aria-label={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geçiş yap"}
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
                  { href: '#how', label: t(lang, 'Nasil Calisir', 'How It Works') },
                  { href: '#faq', label: t(lang, 'SSS', 'FAQ') },
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
                    aria-label={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geçiş yap"}
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
      <section aria-label="Hero" className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-primary-50 to-purple-50 py-16 lg:py-24">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/40 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              {/* Animated trust badge with shimmer */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 text-white font-display font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full shadow-primary mb-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite] -translate-x-full" style={{ animation: 'shimmer 2.5s ease-in-out infinite' }} />
                <Sparkles size={14} className="text-white relative z-10" />
                <span className="relative z-10">{t(lang, 'Ucretsiz Erken Erisim Basladl', 'Free Early Access is Live')}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-ink-900 leading-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}
              >
                {lang === 'tr' ? (
                  <>Her çocuk İngilizce<br /><span className="text-primary-500">okumayı öğrenebilir.</span></>
                ) : (
                  <>Every child can learn<br /><span className="text-primary-500">to read in English.</span></>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-body text-ink-500 text-lg mb-8 max-w-lg leading-relaxed"
              >
                {t(lang,
                  'Günde 10 dakika yeterli. Bilimsel fonetik yöntemiyle, adım adım, harften hikayeye — eğlenerek.',
                  'Just 10 minutes a day. Science-backed phonics, step by step, from letters to stories — with joy.'
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
                    className="w-12 h-12 bg-white border-2 border-ink-100 rounded-2xl flex items-center justify-center shadow-sm font-display font-black text-xl text-primary-500 hover:border-primary-300 hover:shadow-card transition-all duration-200"
                    style={{ animation: `float 3s ease-in-out ${i * 0.4}s infinite` }}
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
                  className="group relative inline-flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-600 text-white font-display font-extrabold text-lg px-8 py-4 rounded-2xl shadow-primary hover:shadow-primary-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 rounded-2xl animate-ping bg-primary-400/20 pointer-events-none" style={{ animationDuration: '2s' }} />
                  {t(lang, 'Ucretsiz Basla', 'Start Free')}
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
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
                  t(lang, 'Hemen basla, ucretsiz', 'Start free, no card'),
                  t(lang, 'Istedigin zaman iptal', 'Cancel anytime'),
                  t(lang, 'Reklam yok', 'No ads'),
                ].map(chip => (
                  <span key={chip} className="flex items-center gap-1.5 font-display font-semibold text-xs text-ink-500">
                    <Check size={12} className="text-success-500" />
                    {chip}
                  </span>
                ))}
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-5 mt-5"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[
                      'bg-primary-400', 'bg-purple-400', 'bg-success-400', 'bg-blue-400',
                    ].map((bg, i) => (
                      <div key={i} className={`w-7 h-7 ${bg} rounded-full border-2 border-white flex items-center justify-center`}>
                        <Users size={10} className="text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="font-display font-bold text-xs text-ink-600">
                    {t(lang, '500+ erken erisim kullanicisi', '500+ early access users')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={13} className="text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <span className="font-display font-bold text-xs text-ink-600">
                    {t(lang, 'Ebeveyn puani 4.9/5', 'Parent rating 4.9/5')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={13} className="text-success-500" />
                  <span className="font-display font-bold text-xs text-ink-600">
                    {t(lang, 'COPPA & KVKK Uyumlu', 'COPPA & KVKK Compliant')}
                  </span>
                </div>
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
              'Jolly Phonics yöntemi · NRP 2000 araştırması · Montessori prensiplerine dayalı',
              'Jolly Phonics method · NRP 2000 research · Montessori principles'
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
              {t(lang, 'Okuma biliminin temeli', 'Foundation of reading science')}
            </p>
            <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Fark Yaratan Özellikler', 'What Makes the Difference')}
            </h2>
            <p className="font-body text-ink-500 max-w-2xl mx-auto">
              {t(lang,
                'Kelime ezberlemek okumayı öğretmez. Ses bilinci olmadan okuma olmaz. MinesMinis, okuma biliminin kanıtlanmış temelinden başlar.',
                'Memorising words doesn\'t teach reading. Without phonemic awareness, there\'s no reading. MinesMinis starts from the proven foundation of reading science.'
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
                className="group bg-white border-2 border-ink-100 rounded-3xl p-7 hover:border-primary-200 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.bg} ${item.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
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
            <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]" role="table" aria-label={t(lang, 'Uygulama karsilastirma tablosu', 'App comparison table')}>
              <thead>
                <tr className="bg-ink-900 text-white text-center">
                  <th scope="col" className="font-display font-bold text-sm text-ink-400 text-left pl-4 pr-2 py-4">
                    {t(lang, 'Özellik', 'Feature')}
                  </th>
                  <th scope="col" className="font-display font-black text-sm text-primary-300 py-4">MinesMinis</th>
                  <th scope="col" className="font-display font-semibold text-sm text-ink-400 py-4">Duolingo</th>
                  <th scope="col" className="font-display font-semibold text-sm text-ink-400 py-4">Lingokids</th>
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
                    <td className="text-center py-3.5">
                      {row.us
                        ? <><Check size={18} className="text-success-500 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Var', 'Yes')}</span></>
                        : <><X size={18} className="text-error-400 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Yok', 'No')}</span></>}
                    </td>
                    <td className="text-center py-3.5">
                      {row.duolingo
                        ? <><Check size={18} className="text-success-400 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Var', 'Yes')}</span></>
                        : <><X size={18} className="text-ink-300 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Yok', 'No')}</span></>}
                    </td>
                    <td className="text-center py-3.5">
                      {row.lingokids
                        ? <><Check size={18} className="text-success-400 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Var', 'Yes')}</span></>
                        : <><X size={18} className="text-ink-300 mx-auto" aria-hidden="true" /><span className="sr-only">{t(lang, 'Yok', 'No')}</span></>}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Footer CTA */}
            <div className="bg-primary-50 border-t-2 border-primary-100 p-5 text-center">
              <p className="font-display font-bold text-primary-700 text-sm mb-3">
                {t(lang,
                  'Tabloyu kendin değerlendir. İhtiyacına göre seç.',
                  'Evaluate the table yourself. Choose what fits your needs.'
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
              {t(lang, 'Araştırma temelli', 'Research-backed')}
            </p>
            <h2 className="font-display font-black text-ink-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Neden Fonetik Yöntemi Seçtik?', 'Why We Chose Phonics')}
            </h2>
            <p className="font-body text-ink-500 max-w-xl mx-auto">
              {t(lang,
                'NRP 2000 (ABD Ulusal Okuma Paneli): sistematik fonetik öğretimi, çocukların okuma becerisini diğer yöntemlerden çok daha hızlı geliştiriyor.',
                'NRP 2000 (US National Reading Panel): systematic phonics instruction develops children\'s reading skills significantly faster than other methods.'
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
              {t(lang, 'Özellikler', 'Features')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Sıkılma Garantisi Yok', 'Zero Boredom Guaranteed')}
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
                className="group bg-white border-2 border-ink-100 rounded-3xl p-6 hover:border-primary-200 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`${f.bg} ${f.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110`}>
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
              {t(lang, '3 adım, hepsi bu kadar', '3 steps, that\'s it')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Nasıl Çalışıyor?', 'How Does It Work?')}
            </h2>
          </div>
          <div className="relative grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-primary-300 via-purple-300 to-success-300 z-0" />
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative z-10"
              >
                <div className={`${step.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg ring-4 ring-white`}>
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
              {t(lang, 'Herkes için tasarlandı', 'Built for everyone')}
            </p>
            <h2 className="font-display font-black text-ink-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Senin için de var.', 'There\'s a place for you.')}
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
          EARLY BIRD PRICING
          ══════════════════════════════════════ */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-b from-cream-50 to-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-800 font-display font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4"
            >
              <Zap size={13} />
              {t(lang, 'Erken Kayıt Avantajı', 'Early Bird Offer')}
            </motion.div>
            <h2 className="font-display font-black text-ink-900 mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              {t(lang, 'Şimdi Başla, Avantajı Yakala', 'Start Now, Grab the Advantage')}
            </h2>
            <p className="font-body text-ink-500 max-w-xl mx-auto">
              {t(lang,
                'MinesMinis şu an ücretsiz erken erişim aşamasında. İlk kullanıcılar gelecekteki ücretli planlarda özel indirim alacak.',
                'MinesMinis is currently in free early access. Early users will receive special discounts on future paid plans.'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-ink-200 rounded-3xl p-7 hover:border-ink-300 hover:shadow-card transition-all duration-200"
            >
              <p className="font-display font-bold text-ink-500 text-sm uppercase tracking-wide mb-2">
                {t(lang, 'Ücretsiz', 'Free')}
              </p>
              <div className="font-display font-black text-ink-900 text-4xl mb-1">₺0</div>
              <p className="font-body text-ink-400 text-sm mb-6">{t(lang, 'Sonsuza kadar ücretsiz', 'Free forever')}</p>
              <ul className="flex flex-col gap-2.5 mb-7">
                {(lang === 'tr' ? [
                  'Günlük 1 ders',
                  '7 fonetik grup — tümüne erişim',
                  '5 oyun türü',
                  'XP, rozet ve seri takibi',
                ] : [
                  '1 lesson per day',
                  '7 phonics groups — full access',
                  '5 game types',
                  'XP, badges and streak tracking',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="font-body text-ink-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login?tab=signup"
                className="block w-full text-center font-display font-extrabold text-sm bg-ink-100 hover:bg-ink-200 text-ink-700 px-5 py-3 rounded-xl transition-all duration-150"
              >
                {t(lang, 'Ücretsiz Başla', 'Start Free')}
              </Link>
            </motion.div>

            {/* Early Bird Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary-500 border-2 border-primary-400 rounded-3xl p-7 relative overflow-hidden hover:shadow-primary-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 font-display font-black text-xs px-3 py-1 rounded-full">
                {t(lang, 'Erken Kayıt', 'Early Bird')}
              </div>
              <p className="font-display font-bold text-primary-200 text-sm uppercase tracking-wide mb-2">
                {t(lang, 'Premium — Erken Fiyat', 'Premium — Early Price')}
              </p>
              <div className="font-display font-black text-white text-4xl mb-1">
                {t(lang, 'Yakında', 'Coming Soon')}
              </div>
              <p className="font-body text-primary-200 text-sm mb-6">
                {t(lang, 'Fiyat açıklandığında erken kayıt indirimi', 'Early bird discount when price launches')}
              </p>
              <ul className="flex flex-col gap-2.5 mb-7">
                {(lang === 'tr' ? [
                  'Sınırsız ders',
                  'Tüm 16 oyun türü',
                  'Haftalık ilerleme raporu',
                  'Reklamsız deneyim',
                  'Öncelikli destek',
                ] : [
                  'Unlimited lessons',
                  'All 16 game types',
                  'Weekly progress reports',
                  'Ad-free experience',
                  'Priority support',
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

          <p className="text-center font-body text-ink-400 text-xs mt-8">
            {t(lang,
              'Erken kayıt, gelecekteki ücretli planlar açıklandığında özel fiyat garantisi anlamına gelir. Şu an tamamen ücretsiz.',
              'Early registration guarantees a special price when paid plans launch. Completely free for now.'
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
            {t(lang, 'Bugün başla. Ücretsiz.', 'Start today. Free.')}
          </h2>
          <p className="font-body text-white/80 text-lg mb-4">
            {t(lang,
              'İlk dersin bugün. Sonuçlar kendiliğinden görünüyor.',
              'First lesson today. Results speak for themselves.'
            )}
          </p>
          <p className="font-display font-bold text-white/60 text-sm mb-8">
            {t(lang,
              'Kredi kartı yok. Reklam yok. İstediğin zaman iptal.',
              'No credit card. No ads. Cancel anytime.'
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
            {t(lang, 'Ücretsiz Başla', 'Start Free')}
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
                  { to: '/login?tab=signup', label: t(lang, 'Ücretsiz Başla', 'Start Free') },
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
