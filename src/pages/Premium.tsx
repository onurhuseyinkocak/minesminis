import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import PublicLayout from '../components/layout/PublicLayout';
import { Crown, Check, Star, Sparkles, Zap, MessageCircle, Gamepad2, BookOpen, Trophy } from 'lucide-react';
import './Premium.css';

interface PremiumFeature {
  icon: React.ReactNode;
  title: { tr: string; en: string };
  description: { tr: string; en: string };
}

const premiumFeatures: PremiumFeature[] = [
  { icon: <MessageCircle size={32} strokeWidth={2.5} />, title: { tr: 'Sinirsiz AI Sohbet', en: 'Unlimited AI Chat' }, description: { tr: 'AI ejderha rehberinizle istediginiz kadar Ingilizce pratik yapin!', en: 'Practice English as much as you want with your AI dragon guide!' } },
  { icon: <Gamepad2 size={32} strokeWidth={2.5} />, title: { tr: 'Tum Egitici Oyunlar', en: 'All Educational Games' }, description: { tr: 'Kelime eslestirme, hafiza oyunlari, hiz turlari ve daha fazlasi!', en: 'Word matching, memory games, speed rounds, and more!' } },
  { icon: <BookOpen size={32} strokeWidth={2.5} />, title: { tr: 'Kelime Pratigi', en: 'Word Practice' }, description: { tr: '100+ kelimeyle gorsel ve isitsel ogrenme deneyimi', en: 'Visual and auditory learning experience with 100+ words' } },
  { icon: <Trophy size={32} strokeWidth={2.5} />, title: { tr: 'Gunluk Gorevler', en: 'Daily Quests' }, description: { tr: 'Her gun yeni sorularla ogrenmeye devam et!', en: 'Keep learning with new questions every day!' } },
  { icon: <Zap size={32} strokeWidth={2.5} />, title: { tr: 'Cumle Kurucusu', en: 'Sentence Builder' }, description: { tr: 'Eglenirken Ingilizce cumle yapisini ogren', en: 'Learn English sentence structure while having fun' } },
  { icon: <Star size={32} strokeWidth={2.5} />, title: { tr: 'Balon Patlat', en: 'Balloon Pop' }, description: { tr: 'Zamana karsi heyecanli kelime yarismasi!', en: 'Exciting word race against the clock!' } },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, plan, subscriptionStatus, isLoading } = usePremium();
  const { lang } = useLanguage();

  const tr = lang === 'tr';

  return (
    <PublicLayout>
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-hero">
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Premium</span>
          </div>
          <h1>{isPremium ? (tr ? 'Premium Uyesiniz!' : 'You Are Premium!') : (tr ? 'Her Seyin Kilidini Ac!' : 'Unlock Everything!')}</h1>
          <p>
            {isPremium
              ? (tr ? 'Premium uyeliginiz icin tesekkurler! Tum ozelliklere sinirsiz erisimin keyfini cikarin.' : 'Thank you for your Premium membership! Enjoy unlimited access to all features.')
              : (tr ? 'Sinirsiz Ingilizce pratigi ve tum egitim iceriklerine erismek icin Premium\'a gecin.' : 'Upgrade to Premium for unlimited English practice and access to all educational content.')}
          </p>
          <div className="hero-sparkles">
            <Sparkles className="sparkle-1" size={24} />
            <Sparkles className="sparkle-2" size={20} />
            <Sparkles className="sparkle-3" size={16} />
          </div>
        </div>

        {isLoading ? (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>{tr ? 'Yukleniyor...' : 'Loading...'}</h2>
          </div>
        ) : isPremium ? (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>{tr ? 'Aktif' : 'Active'} {plan.charAt(0).toUpperCase() + plan.slice(1)} {tr ? 'Plani' : 'Plan'}</h2>
            <p>
              {tr
                ? 'Tum dunyalara, sinirsiz Mimi sohbetine, egitici oyunlara, ilerleme takibine ve daha fazlasina tam erisim.'
                : 'Full access to all worlds, unlimited Mimi chat, educational games, progress tracking, and more.'}
              {subscriptionStatus === 'active' && (tr ? ' Aboneliginiz aktif.' : ' Your subscription is active.')}
            </p>
            <button type="button" className="back-btn" onClick={() => navigate('/dashboard')}>
              {tr ? 'Panele Git' : 'Go to Dashboard'}
            </button>
          </div>
        ) : (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>{tr ? 'Premium\'a Yukselt' : 'Upgrade to Premium'}</h2>
            <p>{tr ? 'Sinirsiz Mimi sohbeti, tum 12 dunya, ilerleme takibi, basari rozetleri ve reklamsiz deneyimin kilidini ac!' : 'Unlock unlimited Mimi chat, all 12 worlds, progress tracking, achievement badges, and ad-free experience!'}</p>
            <button type="button" className="back-btn" onClick={() => navigate('/pricing')}>
              {tr ? 'Planlari ve Fiyatlari Gor' : 'View Plans & Pricing'}
            </button>
          </div>
        )}

        <div className="features-section animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-badge">{tr ? 'Premium Ayricaliklari' : 'Premium Perks'}</div>
          <h2>{tr ? 'Neden Premium?' : 'Why Premium?'}</h2>
          <div className="features-grid">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="feature-card bg-white/10 backdrop-blur-sm">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{tr ? feature.title.tr : feature.title.en}</h3>
                <p>{tr ? feature.description.tr : feature.description.en}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-section">
          <h2>{tr ? 'Ucretsiz vs Premium' : 'Free vs Premium'}</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-col">{tr ? 'Ozellik' : 'Feature'}</div>
              <div className="free-col">{tr ? 'Ucretsiz' : 'Free'}</div>
              <div className="premium-col">Premium</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Mimi ile Sohbet' : 'Chat with Mimi'}</div>
              <div className="free-col">{tr ? 'Gunluk 10 mesaj' : '10 messages/day'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Sinirsiz' : 'Unlimited'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Egitici oyunlar' : 'Educational games'}</div>
              <div className="free-col"><Check size={18} /> {tr ? 'Tumu' : 'All'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Tumu' : 'All'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Kelime pratigi' : 'Word practice'}</div>
              <div className="free-col"><Check size={18} /> {tr ? 'Tumu' : 'All'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Tumu' : 'All'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Gunluk gorev' : 'Daily quests'}</div>
              <div className="free-col">{tr ? 'Sinirli' : 'Limited'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Sinirsiz' : 'Unlimited'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Ilerleme takibi' : 'Progress tracking'}</div>
              <div className="free-col">{tr ? 'Temel' : 'Basic'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Gelismis' : 'Advanced'}</div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="login-prompt">
            <p>{tr ? 'MinesMinis\'ten en iyi sekilde yararlanmak icin giris yap.' : 'Sign in to get the most out of MinesMinis.'}</p>
            <button type="button" onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              {tr ? 'Giris Yap / Uye Ol' : 'Sign In / Sign Up'}
            </button>
          </div>
        )}
      </div>
    </div>
    </PublicLayout>
  );
}
