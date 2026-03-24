/**
 * PublicLayout — tutarlı nav + footer için tüm public sayfaların wrapper'ı.
 * Landing.tsx'deki nav ve footer tasarımıyla birebir aynı.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

type Lang = 'en' | 'tr';
const tl = (lang: Lang, tr: string, en: string) => (lang === 'tr' ? tr : en);

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [lang, setLang] = useState<Lang>('tr');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-body bg-white text-ink-900 min-h-screen flex flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════
          NAVBAR — Landing.tsx ile birebir aynı
          ══════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-ink-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="font-display font-black text-xl text-primary-500 flex-shrink-0">
            MinesMinis
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/#features"
              className="font-display font-semibold text-ink-500 hover:text-ink-900 transition-colors text-sm"
            >
              {tl(lang, 'Özellikler', 'Features')}
            </Link>
            <Link
              to="/#how"
              className="font-display font-semibold text-ink-500 hover:text-ink-900 transition-colors text-sm"
            >
              {tl(lang, 'Nasıl Çalışır?', 'How It Works?')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setLang(l => (l === 'tr' ? 'en' : 'tr'))}
              className="font-display font-bold text-sm text-ink-500 hover:text-ink-900 transition-colors px-2 py-1"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <Link
              to="/dashboard"
              className="bg-primary-500 hover:bg-primary-600 text-white font-display font-bold text-sm px-4 py-2 rounded-xl transition-all duration-150 shadow-primary"
            >
              {tl(lang, 'Başla', 'Start')}
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
                <Link
                  to="/#features"
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors py-2 px-3 rounded-xl hover:bg-primary-50"
                >
                  {tl(lang, 'Özellikler', 'Features')}
                </Link>
                <Link
                  to="/#how"
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-semibold text-ink-600 hover:text-primary-500 transition-colors py-2 px-3 rounded-xl hover:bg-primary-50"
                >
                  {tl(lang, 'Nasıl Çalışır?', 'How It Works?')}
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-display font-bold text-base py-3 rounded-xl text-center transition-colors shadow-primary mt-1"
                >
                  {tl(lang, 'Ücretsiz Başla', 'Start Free')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════
          CONTENT
          ══════════════════════════════════════ */}
      <main className="flex-1">
        {children}
      </main>

      {/* ══════════════════════════════════════
          FOOTER — Landing.tsx ile birebir aynı
          ══════════════════════════════════════ */}
      <footer className="bg-ink-900 py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="font-display font-black text-2xl text-primary-400">MinesMinis</span>
            <p className="font-body text-ink-400 text-sm">
              {tl(lang, 'Çocuklar için İngilizce', 'English for kids')}
            </p>
            <div className="flex gap-6 mt-2">
              <Link
                to="/privacy"
                className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm"
              >
                {tl(lang, 'Gizlilik', 'Privacy')}
              </Link>
              <Link
                to="/terms"
                className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm"
              >
                {tl(lang, 'Kullanım Şartları', 'Terms')}
              </Link>
              <Link
                to="/cookies"
                className="font-display font-semibold text-ink-500 hover:text-white transition-colors text-sm"
              >
                {tl(lang, 'Çerezler', 'Cookies')}
              </Link>
            </div>
            <p className="font-body text-ink-600 text-xs mt-2">
              © 2026 MinesMinis. {tl(lang, 'Tüm hakları saklıdır.', 'All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
