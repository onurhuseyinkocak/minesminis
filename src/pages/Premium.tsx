import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Crown, Check, Sparkles, Zap, MessageCircle, Gamepad2, BookOpen, Trophy, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: MessageCircle, title: { tr: 'Sinirsiz AI Sohbet', en: 'Unlimited AI Chat' }, color: '#8b5cf6' },
  { icon: Gamepad2, title: { tr: 'Tum Oyunlar', en: 'All Games' }, color: '#3b82f6' },
  { icon: BookOpen, title: { tr: 'Kelime Pratigi', en: 'Word Practice' }, color: '#10b981' },
  { icon: Trophy, title: { tr: 'Gunluk Gorevler', en: 'Daily Quests' }, color: '#f59e0b' },
  { icon: Zap, title: { tr: 'Cumle Kurucusu', en: 'Sentence Builder' }, color: '#ec4899' },
  { icon: Sparkles, title: { tr: 'Balon Patlat', en: 'Balloon Pop' }, color: '#6366f1' },
];

const comparison = [
  { label: { tr: 'Mimi ile Sohbet', en: 'Chat with Mimi' }, free: { tr: 'Gunluk 10', en: '10/day' }, premium: { tr: 'Sinirsiz', en: 'Unlimited' } },
  { label: { tr: 'Egitici Oyunlar', en: 'Games' }, free: true, premium: true },
  { label: { tr: 'Kelime Pratigi', en: 'Word Practice' }, free: true, premium: true },
  { label: { tr: 'Gunluk Gorev', en: 'Daily Quests' }, free: { tr: 'Sinirli', en: 'Limited' }, premium: { tr: 'Sinirsiz', en: 'Unlimited' } },
  { label: { tr: 'Ilerleme Takibi', en: 'Progress' }, free: { tr: 'Temel', en: 'Basic' }, premium: { tr: 'Gelismis', en: 'Advanced' } },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, plan, isLoading } = usePremium();
  const { lang } = useLanguage();
  usePageTitle('Premium', 'Premium');
  const tr = lang === 'tr';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 px-4 py-6 pb-24">
      <div className="max-w-sm mx-auto">
        {/* Hero */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-100 mb-3"
          >
            <Crown size={32} className="text-amber-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isPremium ? (tr ? 'Premium Uyesiniz!' : 'You Are Premium!') : (tr ? 'Her Seyin Kilidini Ac!' : 'Unlock Everything!')}
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            {isPremium
              ? (tr ? 'Tum ozelliklere sinirsiz erisimin keyfini cikarin.' : 'Enjoy unlimited access to all features.')
              : (tr ? 'Sinirsiz Ingilizce pratigi icin Premium\'a gecin.' : 'Upgrade to Premium for unlimited practice.')}
          </p>
        </div>

        {/* Status card */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-sm mb-6">
            <Loader2 size={32} className="text-amber-500 animate-spin" />
          </div>
        ) : isPremium ? (
          <div className="bg-white rounded-3xl p-6 flex flex-col items-center shadow-sm mb-6">
            <Crown size={40} className="text-amber-500 mb-3" />
            <p className="text-lg font-bold text-gray-800">
              {plan.charAt(0).toUpperCase() + plan.slice(1)} {tr ? 'Plani' : 'Plan'}
            </p>
            <button type="button" className="mt-4 min-h-[48px] px-6 bg-gray-100 text-gray-700 text-sm font-bold rounded-3xl" onClick={() => navigate('/dashboard')}>
              {tr ? 'Panele Git' : 'Go to Dashboard'}
            </button>
          </div>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="w-full min-h-[56px] bg-gradient-to-r from-amber-400 to-orange-500 text-white text-base font-bold rounded-3xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 mb-6"
            onClick={() => navigate('/pricing')}
          >
            <Crown size={20} />
            {tr ? 'Planlari ve Fiyatlari Gor' : 'View Plans & Pricing'}
          </motion.button>
        )}

        {/* Features grid */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
          {tr ? 'Premium Ayricaiklari' : 'Premium Perks'}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300, delay: i * 0.06 }}
                className="bg-white rounded-3xl p-4 flex flex-col items-center gap-2 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: feat.color + '18' }}>
                  <Icon size={24} style={{ color: feat.color }} />
                </div>
                <p className="text-xs font-bold text-gray-700 text-center leading-tight">
                  {tr ? feat.title.tr : feat.title.en}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
          {tr ? 'Ucretsiz vs Premium' : 'Free vs Premium'}
        </p>
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="grid grid-cols-3 text-center py-3 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400">{tr ? 'Ozellik' : 'Feature'}</span>
            <span className="text-xs font-bold text-gray-400">{tr ? 'Ucretsiz' : 'Free'}</span>
            <span className="text-xs font-bold text-amber-500">Premium</span>
          </div>
          {comparison.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-center py-3 border-b border-gray-50 last:border-0">
              <span className="text-xs font-medium text-gray-700 px-2">{tr ? row.label.tr : row.label.en}</span>
              <span className="text-xs text-gray-500">
                {row.free === true ? <Check size={16} className="text-emerald-500 mx-auto" /> : typeof row.free === 'object' ? (tr ? row.free.tr : row.free.en) : ''}
              </span>
              <span className="text-xs text-amber-600 font-medium">
                {row.premium === true ? <Check size={16} className="text-emerald-500 mx-auto" /> : typeof row.premium === 'object' ? (tr ? row.premium.tr : row.premium.en) : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Login prompt */}
        {!user && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">{tr ? 'Giris yap ve basla.' : 'Sign in to get started.'}</p>
            <button type="button" className="min-h-[48px] px-6 bg-orange-500 text-white text-sm font-bold rounded-3xl" onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              {tr ? 'Giris Yap / Uye Ol' : 'Sign In / Sign Up'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
