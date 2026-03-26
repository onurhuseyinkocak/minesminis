import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Settings() {
  const { lang } = useLanguage();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-cream-100 to-white"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/dashboard"
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-500 hover:text-primary-500 transition-colors"
            aria-label={lang === 'tr' ? 'Geri' : 'Back'}
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-ink-900">
            {lang === 'tr' ? 'Ayarlar' : 'Settings'}
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center">
            <SettingsIcon size={40} className="text-primary-400" />
          </div>
          <p className="font-display font-bold text-xl text-ink-900">
            {lang === 'tr' ? 'Çok yakında!' : 'Coming soon!'}
          </p>
          <p className="font-body text-ink-400 text-sm max-w-xs">
            {lang === 'tr'
              ? 'Ayarlar sayfası yakında burada olacak. Şimdilik profilinden ayarlarını düzenleyebilirsin.'
              : 'The settings page is on its way. For now, you can manage your preferences from your profile.'}
          </p>
          <Link
            to="/profile"
            className="mt-2 inline-flex items-center gap-2 bg-primary-500 text-white font-display font-bold px-6 py-3 rounded-full shadow-md hover:bg-primary-600 active:scale-95 transition-all duration-200"
          >
            {lang === 'tr' ? 'Profile Git' : 'Go to Profile'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
