import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Menu, X } from 'lucide-react';
import UnifiedMascot from '../components/UnifiedMascot';
import './Landing.css';

type Lang = 'en' | 'tr';
const t = (lang: Lang, tr: string, en: string) => lang === 'tr' ? tr : en;

const STATS = [
  { value: '42', label: { tr: 'Fonetik Ses', en: 'Phonics Sounds' } },
  { value: '5K+', label: { tr: 'Kelime', en: 'Words' } },
  { value: '10K+', label: { tr: 'Öğrenci', en: 'Students' } },
  { value: '%100', label: { tr: 'Ücretsiz', en: 'Free' } },
];

const FEATURES = [
  {
    icon: '🎤',
    iconBg: '#FFF0E8',
    iconColor: '#FF6B35',
    title: { tr: 'Sesi Duy, Tekrar Et', en: 'Hear It, Repeat It' },
    desc: { tr: '42 fonetik ses animasyonlarla canlı öğretilir. Her ses bir hikayeye dönüşür.', en: '42 phonics sounds taught with animations. Every sound becomes a story.' },
  },
  {
    icon: '🎮',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    title: { tr: 'Oyunlarla Pekiştir', en: 'Practice Through Games' },
    desc: { tr: 'Kelime eşleştirme, yazım arısı, cümle kurma — öğrenmek oyun kadar eğlenceli.', en: 'Word match, spelling bee, sentence scramble — learning as fun as playing.' },
  },
  {
    icon: '📖',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    title: { tr: 'Hikayeler Oku', en: 'Read Stories' },
    desc: { tr: 'Çocuğun seviyesine göre fonetik hikayeler. Her bölümde kelime hazinesi büyür.', en: 'Phonics stories matched to your child\'s level. Vocabulary grows every chapter.' },
  },
  {
    icon: '⭐',
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    title: { tr: 'Ödüller Kazan', en: 'Earn Rewards' },
    desc: { tr: 'Yıldızlar, rozetler, seviye atlama — her ders bir başarı kutlaması.', en: 'Stars, badges, level-ups — every lesson is a celebration.' },
  },
];

const HOW_STEPS = [
  { num: '1', title: { tr: 'Seviyeni Bul', en: 'Find Your Level' }, desc: { tr: 'Kısa bir yerleştirme testiyle başlangıç noktanı belirle.', en: 'A quick placement test finds exactly where to start.' }, color: '#FF6B35' },
  { num: '2', title: { tr: 'Günlük Ders', en: 'Daily Lesson' }, desc: { tr: 'Günde 10 dakika — sesler, kelimeler, oyunlar, hikayeler.', en: '10 minutes a day — sounds, words, games, stories.' }, color: '#7C3AED' },
  { num: '3', title: { tr: 'İlerleme Gör', en: 'See Progress' }, desc: { tr: 'Tamamlanan sesler, kazanılan yıldızlar, büyüyen bahçe.', en: 'Completed sounds, earned stars, a growing garden.' }, color: '#16A34A' },
];

export default function Landing() {
  const [lang, setLang] = useState<Lang>('tr');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ld-root">
      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className="ld-nav">
        <div className="ld-nav__inner">
          <Link to="/" className="ld-logo">
            <UnifiedMascot state="idle" size={32} />
            <span>MinesMinis</span>
          </Link>

          <div className="ld-nav__links">
            <a href="#features">{t(lang, 'Özellikler', 'Features')}</a>
            <a href="#how">{t(lang, 'Nasıl Çalışır?', 'How It Works?')}</a>
          </div>

          <div className="ld-nav__right">
            <button className="ld-lang-btn" onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')}>
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <Link to="/dashboard" className="ld-nav-cta">
              {t(lang, 'Başla', 'Start')}
            </Link>
            <button className="ld-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="ld-mobile-menu">
            <a href="#features" onClick={() => setMenuOpen(false)}>{t(lang, 'Özellikler', 'Features')}</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>{t(lang, 'Nasıl Çalışır?', 'How It Works?')}</a>
            <Link to="/dashboard" className="ld-mobile-cta" onClick={() => setMenuOpen(false)}>
              {t(lang, 'Ücretsiz Başla', 'Start Free')}
            </Link>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="ld-hero">
        <div className="ld-hero__inner">
          {/* Text side */}
          <div className="ld-hero__text">
            <div className="ld-hero__badge">
              {t(lang, '🏆 10,000+ öğrenci kullanıyor', '🏆 Trusted by 10,000+ students')}
            </div>
            <h1 className="ld-hero__h1">
              {lang === 'tr'
                ? <>Çocuğunuz<br /><span>İngilizceyi</span><br />Sevecek</>
                : <>Your Child<br /><span>Will Love</span><br />English</>}
            </h1>
            <p className="ld-hero__sub">
              {t(lang,
                '42 fonetik sesle bilimsel olarak kanıtlanmış yöntem. Günde 10 dakika yeterli.',
                'Scientifically proven method with 42 phonics sounds. Just 10 minutes a day.'
              )}
            </p>
            <div className="ld-hero__actions">
              <Link to="/dashboard" className="ld-hero-cta-primary">
                {t(lang, 'Ücretsiz Başla', 'Start Free')}
                <ArrowRight size={20} />
              </Link>
              <a href="#how" className="ld-hero-cta-ghost">
                {t(lang, 'Nasıl çalışır?', 'How it works?')}
              </a>
            </div>
            <ul className="ld-hero__checks">
              {[
                t(lang, 'Kayıt gerekmez', 'No sign-up required'),
                t(lang, 'Tamamen ücretsiz', 'Completely free'),
                t(lang, '42 fonetik ses', '42 phonics sounds'),
              ].map(item => (
                <li key={item}><Check size={16} />{item}</li>
              ))}
            </ul>
          </div>

          {/* Mascot side */}
          <div className="ld-hero__visual">
            <div className="ld-hero__mascot-wrap">
              <div className="ld-hero__glow" />
              <UnifiedMascot state="waving" size={260} />
            </div>

            {/* Floating phonics bubbles */}
            <div className="ld-bubble ld-bubble--a">
              <span className="ld-bubble__letter">A</span>
              <span className="ld-bubble__word">Apple</span>
            </div>
            <div className="ld-bubble ld-bubble--b">
              <span className="ld-bubble__letter">B</span>
              <span className="ld-bubble__word">Bear</span>
            </div>
            <div className="ld-bubble ld-bubble--c">
              <span className="ld-bubble__letter">C</span>
              <span className="ld-bubble__word">Cat</span>
            </div>
            <div className="ld-bubble ld-bubble--d">
              <span className="ld-bubble__letter">D</span>
              <span className="ld-bubble__word">Dog</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════ */}
      <div className="ld-stats-band">
        {STATS.map(s => (
          <div key={s.value} className="ld-stats-band__item">
            <span className="ld-stats-band__value">{s.value}</span>
            <span className="ld-stats-band__label">{t(lang, s.label.tr, s.label.en)}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="ld-section ld-section--white">
        <div className="ld-section__inner">
          <p className="ld-section__eyebrow">{t(lang, 'Her şey tek bir uygulamada', 'Everything in one app')}</p>
          <h2 className="ld-section__h2">{t(lang, 'Neden MinesMinis?', 'Why MinesMinis?')}</h2>

          <div className="ld-features-grid">
            {FEATURES.map(f => (
              <div key={f.title.tr} className="ld-feature-card">
                <div className="ld-feature-card__icon" style={{ background: f.iconBg }}>
                  <span style={{ fontSize: 28 }}>{f.icon}</span>
                </div>
                <h3 className="ld-feature-card__title">{t(lang, f.title.tr, f.title.en)}</h3>
                <p className="ld-feature-card__desc">{t(lang, f.desc.tr, f.desc.en)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="how" className="ld-section ld-section--cream">
        <div className="ld-section__inner">
          <p className="ld-section__eyebrow">{t(lang, 'Basit, etkili, eğlenceli', 'Simple, effective, fun')}</p>
          <h2 className="ld-section__h2">{t(lang, 'Nasıl Çalışır?', 'How It Works?')}</h2>

          <div className="ld-steps">
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} className="ld-step">
                <div className="ld-step__num" style={{ background: step.color }}>{step.num}</div>
                {i < HOW_STEPS.length - 1 && <div className="ld-step__line" />}
                <div className="ld-step__body">
                  <h3 className="ld-step__title">{t(lang, step.title.tr, step.title.en)}</h3>
                  <p className="ld-step__desc">{t(lang, step.desc.tr, step.desc.en)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SOCIAL PROOF
      ══════════════════════════════════════════ */}
      <section className="ld-section ld-section--white">
        <div className="ld-section__inner">
          <h2 className="ld-section__h2">{t(lang, 'Aileler Ne Diyor?', 'What Parents Say?')}</h2>
          <div className="ld-testimonials">
            {[
              { quote: { tr: '"Kızım her gün kendi isteğiyle oturup ders yapıyor. Bunu beklemiyordum!"', en: '"My daughter sits down voluntarily every day. I didn\'t expect this!"' }, name: 'Ayşe K.', role: { tr: '7 yaşında kız çocuğu annesi', en: 'Mother of a 7-year-old girl' } },
              { quote: { tr: '"3 ayda ilk kitabı okumaya başladı. Fonetik sistemi gerçekten işe yarıyor."', en: '"Started reading her first book in 3 months. The phonics system really works."' }, name: 'Mehmet A.', role: { tr: '6 yaşında erkek çocuğu babası', en: 'Father of a 6-year-old boy' } },
              { quote: { tr: '"Oyun oynadığını zannediyor ama İngilizce öğreniyor. Harika tasarım."', en: '"He thinks he\'s playing games but he\'s learning English. Brilliant design."' }, name: 'Fatma T.', role: { tr: '8 yaşında erkek çocuğu annesi', en: 'Mother of an 8-year-old boy' } },
            ].map(r => (
              <div key={r.name} className="ld-testimonial">
                <div className="ld-testimonial__stars">{'★★★★★'}</div>
                <p className="ld-testimonial__quote">{t(lang, r.quote.tr, r.quote.en)}</p>
                <div className="ld-testimonial__author">
                  <div className="ld-testimonial__avatar">{r.name.charAt(0)}</div>
                  <div>
                    <div className="ld-testimonial__name">{r.name}</div>
                    <div className="ld-testimonial__role">{t(lang, r.role.tr, r.role.en)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BOTTOM
      ══════════════════════════════════════════ */}
      <section className="ld-cta-section">
        <div className="ld-cta-section__inner">
          <div className="ld-cta-mascot">
            <UnifiedMascot state="celebrating" size={120} />
          </div>
          <h2 className="ld-cta-section__h2">
            {t(lang, 'Bugün Ücretsiz Başla!', 'Start Free Today!')}
          </h2>
          <p className="ld-cta-section__sub">
            {t(lang,
              'Kredi kartı yok. Zorunlu kayıt yok. Sadece öğrenme var.',
              'No credit card. No mandatory sign-up. Just learning.'
            )}
          </p>
          <Link to="/dashboard" className="ld-cta-section__btn">
            {t(lang, 'Hemen Başla', 'Get Started Now')}
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="ld-footer">
        <div className="ld-footer__inner">
          <Link to="/" className="ld-footer__logo">
            <UnifiedMascot state="idle" size={28} />
            <span>MinesMinis</span>
          </Link>
          <p className="ld-footer__tagline">
            {t(lang, 'Çocuklar için İngilizce', 'English for kids')}
          </p>
          <div className="ld-footer__links">
            <a href="#">{t(lang, 'Gizlilik', 'Privacy')}</a>
            <a href="#">{t(lang, 'Kullanım Şartları', 'Terms')}</a>
            <a href="#">{t(lang, 'Çerezler', 'Cookies')}</a>
          </div>
          <p className="ld-footer__copy">© 2026 MinesMinis. {t(lang, 'Tüm hakları saklıdır.', 'All rights reserved.')}</p>
        </div>
      </footer>
    </div>
  );
}
