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
  { icon: <MessageCircle size={32} strokeWidth={2.5} />, title: { tr: 'Sınırsız AI Sohbet', en: 'Unlimited AI Chat' }, description: { tr: 'AI ejderha rehberinizle istediğiniz kadar İngilizce pratik yapın!', en: 'Practice English as much as you want with your AI dragon guide!' } },
  { icon: <Gamepad2 size={32} strokeWidth={2.5} />, title: { tr: 'Tüm Eğitici Oyunlar', en: 'All Educational Games' }, description: { tr: 'Kelime eşleştirme, hafıza oyunları, hız turları ve daha fazlası!', en: 'Word matching, memory games, speed rounds, and more!' } },
  { icon: <BookOpen size={32} strokeWidth={2.5} />, title: { tr: 'Kelime Pratiği', en: 'Word Practice' }, description: { tr: '100+ kelimeyle görsel ve işitsel öğrenme deneyimi', en: 'Visual and auditory learning experience with 100+ words' } },
  { icon: <Trophy size={32} strokeWidth={2.5} />, title: { tr: 'Günlük Görevler', en: 'Daily Quests' }, description: { tr: 'Her gün yeni sorularla öğrenmeye devam et!', en: 'Keep learning with new questions every day!' } },
  { icon: <Zap size={32} strokeWidth={2.5} />, title: { tr: 'Cümle Kurucusu', en: 'Sentence Builder' }, description: { tr: 'Eğlenirken İngilizce cümle yapısını öğren', en: 'Learn English sentence structure while having fun' } },
  { icon: <Star size={32} strokeWidth={2.5} />, title: { tr: 'Balon Patlat', en: 'Balloon Pop' }, description: { tr: 'Zamana karşı heyecanlı kelime yarışması!', en: 'Exciting word race against the clock!' } },
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
          <h1>{isPremium ? (tr ? 'Premium Üyesiniz!' : 'You Are Premium!') : (tr ? 'Her Şeyin Kilidini Aç!' : 'Unlock Everything!')}</h1>
          <p>
            {isPremium
              ? (tr ? 'Premium üyeliğiniz için teşekkürler! Tüm özelliklere sınırsız erişimin keyfini çıkarın.' : 'Thank you for your Premium membership! Enjoy unlimited access to all features.')
              : (tr ? 'Sınırsız İngilizce pratiği ve tüm eğitim içeriklerine erişmek için Premium\'a geçin.' : 'Upgrade to Premium for unlimited English practice and access to all educational content.')}
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
            <h2>{tr ? 'Yükleniyor...' : 'Loading...'}</h2>
          </div>
        ) : isPremium ? (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>{tr ? 'Aktif' : 'Active'} {plan.charAt(0).toUpperCase() + plan.slice(1)} {tr ? 'Planı' : 'Plan'}</h2>
            <p>
              {tr
                ? 'Tüm dünyalara, sınırsız Mimi sohbetine, eğitici oyunlara, ilerleme takibine ve daha fazlasına tam erişim.'
                : 'Full access to all worlds, unlimited Mimi chat, educational games, progress tracking, and more.'}
              {subscriptionStatus === 'active' && (tr ? ' Aboneliğiniz aktif.' : ' Your subscription is active.')}
            </p>
            <button type="button" className="back-btn" onClick={() => navigate('/dashboard')}>
              {tr ? 'Panele Git' : 'Go to Dashboard'}
            </button>
          </div>
        ) : (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>{tr ? 'Premium\'a Yükselt' : 'Upgrade to Premium'}</h2>
            <p>{tr ? 'Sınırsız Mimi sohbeti, tüm 12 dünya, ilerleme takibi, başarı rozetleri ve reklamsız deneyimin kilidini aç!' : 'Unlock unlimited Mimi chat, all 12 worlds, progress tracking, achievement badges, and ad-free experience!'}</p>
            <button type="button" className="back-btn" onClick={() => navigate('/pricing')}>
              {tr ? 'Planları ve Fiyatları Gör' : 'View Plans & Pricing'}
            </button>
          </div>
        )}

        <div className="features-section animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-badge">{tr ? 'Premium Ayrıcalıkları' : 'Premium Perks'}</div>
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
          <h2>{tr ? 'Ücretsiz vs Premium' : 'Free vs Premium'}</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-col">{tr ? 'Özellik' : 'Feature'}</div>
              <div className="free-col">{tr ? 'Ücretsiz' : 'Free'}</div>
              <div className="premium-col">Premium</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Mimi ile Sohbet' : 'Chat with Mimi'}</div>
              <div className="free-col">{tr ? 'Günlük 10 mesaj' : '10 messages/day'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Sınırsız' : 'Unlimited'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Eğitici oyunlar' : 'Educational games'}</div>
              <div className="free-col"><Check size={18} /> {tr ? 'Tümü' : 'All'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Tümü' : 'All'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Kelime pratiği' : 'Word practice'}</div>
              <div className="free-col"><Check size={18} /> {tr ? 'Tümü' : 'All'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Tümü' : 'All'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'Günlük görev' : 'Daily quests'}</div>
              <div className="free-col">{tr ? 'Sınırlı' : 'Limited'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Sınırsız' : 'Unlimited'}</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">{tr ? 'İlerleme takibi' : 'Progress tracking'}</div>
              <div className="free-col">{tr ? 'Temel' : 'Basic'}</div>
              <div className="premium-col"><Check size={18} /> {tr ? 'Gelişmiş' : 'Advanced'}</div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="login-prompt">
            <p>{tr ? 'MinesMinis\'ten en iyi şekilde yararlanmak için giriş yap.' : 'Sign in to get the most out of MinesMinis.'}</p>
            <button type="button" onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              {tr ? 'Giriş Yap / Üye Ol' : 'Sign In / Sign Up'}
            </button>
          </div>
        )}
      </div>
    </div>
    </PublicLayout>
  );
}
