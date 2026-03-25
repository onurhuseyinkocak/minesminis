import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { Crown, Check, Star, Sparkles, Zap, MessageCircle, Gamepad2, BookOpen, Trophy } from 'lucide-react';
import './Premium.css';

const premiumFeatures = [
  { icon: <MessageCircle size={32} strokeWidth={2.5} />, title: 'Sınırsız AI Sohbet', description: 'AI ejderha rehberinizle istediğiniz kadar İngilizce pratik yapın!' },
  { icon: <Gamepad2 size={32} strokeWidth={2.5} />, title: 'Tüm Eğitici Oyunlar', description: 'Kelime eşleştirme, hafıza oyunları, hız turları ve daha fazlası!' },
  { icon: <BookOpen size={32} strokeWidth={2.5} />, title: 'Kelime Pratiği', description: '100+ kelimeyle görsel ve işitsel öğrenme deneyimi' },
  { icon: <Trophy size={32} strokeWidth={2.5} />, title: 'Günlük Görevler', description: 'Her gün yeni sorularla öğrenmeye devam et!' },
  { icon: <Zap size={32} strokeWidth={2.5} />, title: 'Cümle Kurucusu', description: 'Eğlenirken İngilizce cümle yapısını öğren' },
  { icon: <Star size={32} strokeWidth={2.5} />, title: 'Balon Patlat', description: 'Zamana karşı heyecanlı kelime yarışması!' },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, plan, subscriptionStatus, isLoading } = usePremium();

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-hero">
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Premium</span>
          </div>
          <h1>{isPremium ? 'Premium Üyesiniz!' : 'Her Şeyin Kilidini Aç!'}</h1>
          <p>
            {isPremium
              ? 'Premium üyeliğiniz için teşekkürler! Tüm özelliklere sınırsız erişimin keyfini çıkarın.'
              : 'Sınırsız İngilizce pratiği ve tüm eğitim içeriklerine erişmek için Premium\'a geçin.'}
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
            <h2>Yükleniyor...</h2>
          </div>
        ) : isPremium ? (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>Active {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</h2>
            <p>
              Tüm dünyalara, sınırsız Mimi sohbetine, eğitici oyunlara, ilerleme takibine ve daha fazlasına tam erişiminiz var.
              {subscriptionStatus === 'active' && ' Aboneliğiniz aktif.'}
            </p>
            <button type="button" className="back-btn" onClick={() => navigate('/dashboard')}>
              Panele Git
            </button>
          </div>
        ) : (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>Premium'a Yükselt</h2>
            <p>Sınırsız Mimi sohbeti, tüm 12 dünya, ilerleme takibi, başarı rozetleri ve reklamsız deneyimin kilidini aç!</p>
            <button type="button" className="back-btn" onClick={() => navigate('/pricing')}>
              View Plans &amp; Pricing
            </button>
          </div>
        )}

        <div className="features-section animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-badge">Premium Ayrıcalıkları</div>
          <h2>Neden Premium?</h2>
          <div className="features-grid">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="feature-card bg-white/10 backdrop-blur-sm">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-section">
          <h2>Ücretsiz vs Premium</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-col">Özellik</div>
              <div className="free-col">Ücretsiz</div>
              <div className="premium-col">Premium</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Mimi ile Sohbet</div>
              <div className="free-col">Günlük 10 mesaj</div>
              <div className="premium-col"><Check size={18} /> Sınırsız</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Eğitici oyunlar</div>
              <div className="free-col"><Check size={18} /> Tümü</div>
              <div className="premium-col"><Check size={18} /> Tümü</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Kelime pratiği</div>
              <div className="free-col"><Check size={18} /> Tümü</div>
              <div className="premium-col"><Check size={18} /> Tümü</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Günlük görev</div>
              <div className="free-col">Sınırlı</div>
              <div className="premium-col"><Check size={18} /> Sınırsız</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">İlerleme takibi</div>
              <div className="free-col">Temel</div>
              <div className="premium-col"><Check size={18} /> Gelişmiş</div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="login-prompt">
            <p>MinesMinis'ten en iyi şekilde yararlanmak için giriş yap.</p>
            <button type="button" onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              Giriş Yap / Üye Ol
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
