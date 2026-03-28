/**
 * PublicLayout — tutarlı nav + footer için tüm public sayfaların wrapper'ı.
 * Landing.tsx ile tamamen aynı navbar ve footer.
 */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Footer from './Footer';

const tl = (lang: string, tr: string, en: string) => (lang === 'tr' ? tr : en);

const PawIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" className={className}>
    <ellipse cx="50" cy="66" rx="23" ry="19" />
    <ellipse cx="27" cy="43" rx="9" ry="12" transform="rotate(-20 27 43)" />
    <ellipse cx="43" cy="33" rx="9" ry="12" />
    <ellipse cx="59" cy="33" rx="9" ry="12" />
    <ellipse cx="75" cy="43" rx="9" ry="12" transform="rotate(20 75 43)" />
  </svg>
);

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-body bg-cream-50 text-ink-900 min-h-screen flex flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════
          NAVBAR — Landing.tsx ile birebir aynı
          ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PawIcon size={22} className="text-primary-500" />
            <span className="font-display font-black text-xl text-primary-500 tracking-tight">MinesMinis</span>
            <span className="font-display font-black text-[10px] uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full leading-none">BETA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link to="/#features" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {tl(lang, 'Özellikler', 'Features')}
            </Link>
            <Link to="/#compare" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {tl(lang, 'Karşılaştır', 'Compare')}
            </Link>
            <Link to="/#how" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {tl(lang, 'Nasıl Çalışır', 'How It Works')}
            </Link>
            <Link to="/#faq" className="font-display font-semibold text-sm text-ink-600 hover:text-primary-500 transition-colors">
              {tl(lang, 'SSS', 'FAQ')}
            </Link>
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
              {tl(lang, 'Ücretsiz Başla', 'Start Free')}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-xl text-ink-700 hover:bg-ink-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={tl(lang, 'Menüyü aç/kapat', 'Toggle menu')}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-ink-100 overflow-hidden"
            >
              <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
                {[
                  { href: '/#features', label: tl(lang, 'Özellikler', 'Features') },
                  { href: '/#compare', label: tl(lang, 'Karşılaştır', 'Compare') },
                  { href: '/#how', label: tl(lang, 'Nasıl Çalışır', 'How It Works') },
                  { href: '/#faq', label: tl(lang, 'SSS', 'FAQ') },
                ].map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display font-semibold text-base text-ink-700 py-3 border-b border-ink-50 min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </Link>
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
                    onClick={() => setMenuOpen(false)}
                  >
                    {tl(lang, 'Ücretsiz Başla', 'Start Free')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════
          CONTENT
          ══════════════════════════════════════ */}
      <main className="flex-1">
        {children}
      </main>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <Footer variant="full" />

    </div>
  );
}
