import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { Crown, Check, Star, Sparkles, Zap, MessageCircle, Gamepad2, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import './Premium.css';

interface Plan {
  id: string;
  name: string;
  description: string;
  prices: {
    id: string;
    unit_amount: number;
    currency: string;
    recurring: { interval: string };
    metadata?: { plan_name?: string; discount_percent?: string };
  }[];
}

function getBackendUrl(): string {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    if (hostname.includes('replit') || hostname.includes('.dev') || hostname.includes('.app')) {
      const protocol = window.location.protocol;
      const parts = hostname.split('.');
      if (parts.length > 0) {
        const firstPart = parts[0];
        const portMatch = firstPart.match(/^(\d+)-(.+)$/);
        if (portMatch) {
          parts[0] = `3001-${portMatch[2]}`;
          return `${protocol}//${parts.join('.')}`;
        }
      }
    }
  }

  return 'http://localhost:3001';
}

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, subscription, loading: premiumLoading, createCheckout, openCustomerPortal, checkPremiumStatus } = usePremium();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('year');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const backendUrl = getBackendUrl();

  useEffect(() => {
    fetchPlans();

    // Check for success query param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      checkPremiumStatus();
    }
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/stripe/plans`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      } else {
        throw new Error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans, using fallback:', error);
      // Fallback mock data if server is down
      setPlans([
        {
          id: 'prod_fallback',
          name: 'MiniPremium',
          description: 'Sınırsız öğrenme macerası!',
          prices: [
            { id: 'price_monthly', unit_amount: 9999, currency: 'try', recurring: { interval: 'month' } },
            { id: 'price_yearly', unit_amount: 79999, currency: 'try', recurring: { interval: 'year' } }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/premium' } });
      return;
    }

    if (priceId.startsWith('price_')) {
      alert('Ödeme sistemi şu an bakımda. Lütfen daha sonra tekrar deneyiniz.');
      return;
    }

    setCheckoutLoading(true);
    const url = await createCheckout(priceId);

    if (url) {
      window.location.href = url;
    } else {
      alert('Ödeme başlatılamadı. Lütfen internet bağlantınızı kontrol edin.');
    }
    setCheckoutLoading(false);
  };

  const handleManageSubscription = async () => {
    setCheckoutLoading(true);
    const url = await openCustomerPortal();

    if (url) {
      window.location.href = url;
    } else {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
    setCheckoutLoading(false);
  };

  const premiumFeatures = [
    { icon: <MessageCircle size={24} />, title: 'Mimi ile Sınırsız Sohbet', description: 'AI ejderhamız Mimi ile istediğin kadar İngilizce pratik yap!' },
    { icon: <Gamepad2 size={24} />, title: 'Tüm Eğitici Oyunlar', description: 'Kelime eşleştirme, hafıza oyunu, hız turu ve daha fazlası!' },
    { icon: <BookOpen size={24} />, title: 'Kelime Pratikleri', description: '100+ kelime ile görsel ve sesli öğrenme deneyimi' },
    { icon: <Trophy size={24} />, title: 'Günlük Meydan Okumalar', description: 'Her gün yeni sorularla öğrenmeye devam et!' },
    { icon: <Zap size={24} />, title: 'Cümle Kurma Oyunu', description: 'İngilizce cümle yapısını eğlenerek öğren' },
    { icon: <Star size={24} />, title: 'Balon Patlatma', description: 'Heyecanlı zamanlı kelime yarışması!' },
  ];

  // Get the premium product
  const premiumPlan = plans.find(p => p.name === 'MiniPremium') || plans[0];

  // Get prices for selected interval
  const monthlyPrice = premiumPlan?.prices?.find(p => p.recurring?.interval === 'month');
  const yearlyPrice = premiumPlan?.prices?.find(p => p.recurring?.interval === 'year');
  const selectedPrice = selectedInterval === 'month' ? monthlyPrice : yearlyPrice;

  // Calculate savings
  const monthlyCost = monthlyPrice ? monthlyPrice.unit_amount / 100 : 99.99;
  const yearlyCost = yearlyPrice ? yearlyPrice.unit_amount / 100 : 799.99;
  const yearlyMonthlyCost = yearlyCost / 12;
  const savings = Math.round(((monthlyCost * 12 - yearlyCost) / (monthlyCost * 12)) * 100);

  if (loading || premiumLoading) {
    return (
      <div className="premium-page">
        <div className="premium-loading">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // If already premium, show status
  if (isPremium) {
    return (
      <div className="premium-page">
        <div className="premium-container">
          <div className="premium-status-card">
            <div className="status-badge premium-active">
              <Crown size={32} />
              <span>Premium Üye</span>
            </div>

            <h1>MiniPremium Üyeliğiniz Aktif!</h1>
            <p className="status-description">
              Tüm premium özelliklere sınırsız erişiminiz var. Mimi ile öğrenmeye devam edin!
            </p>

            <div className="subscription-info">
              {subscription && (
                <>
                  <div className="info-item">
                    <span className="info-label">Durum:</span>
                    <span className="info-value status-active">Aktif</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Plan:</span>
                    <span className="info-value">
                      {subscription.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'Yıllık' : 'Aylık'}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              className="manage-btn"
              onClick={handleManageSubscription}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Yükleniyor...' : 'Aboneliği Yönet'}
            </button>

            <button
              className="back-btn"
              onClick={() => navigate('/')}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <div className="premium-container">
        {/* Hero Section */}
        <div className="premium-hero">
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Premium</span>
          </div>
          <h1>MiniPremium ile Öğrenmeyi Süper Eğlenceli Yap!</h1>
          <p>Mimi ejderhanla sınırsız İngilizce pratik yap, tüm oyunların kilidini aç!</p>
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <h2>Premium Özellikler</h2>
          <div className="features-grid">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pricing-section">
          <h2>Planını Seç</h2>

          {/* Interval Toggle */}
          <div className="interval-toggle">
            <button
              className={`toggle-btn ${selectedInterval === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedInterval('month')}
            >
              Aylık
            </button>
            <button
              className={`toggle-btn ${selectedInterval === 'year' ? 'active' : ''}`}
              onClick={() => setSelectedInterval('year')}
            >
              Yıllık
              <span className="save-badge">%{savings} Tasarruf</span>
            </button>
          </div>

          {/* Pricing Card */}
          <div className="pricing-card">
            <div className="pricing-header">
              <Crown className="crown-icon" size={40} />
              <h3>MiniPremium</h3>
              {selectedInterval === 'year' && (
                <div className="best-value">En İyi Değer!</div>
              )}
            </div>

            <div className="pricing-amount">
              <span className="currency">₺</span>
              <span className="amount">
                {selectedInterval === 'month'
                  ? monthlyCost.toFixed(2).split('.')[0]
                  : yearlyMonthlyCost.toFixed(0)
                }
              </span>
              <span className="period">/ay</span>
            </div>

            {selectedInterval === 'year' && (
              <div className="billed-yearly">
                Yıllık ₺{yearlyCost.toFixed(2)} olarak faturalandırılır
              </div>
            )}

            <ul className="pricing-features">
              <li><Check size={18} /> Mimi ile sınırsız AI sohbet</li>
              <li><Check size={18} /> 10+ eğitici oyun</li>
              <li><Check size={18} /> 100+ kelime pratik seti</li>
              <li><Check size={18} /> Günlük meydan okumalar</li>
              <li><Check size={18} /> Sesli telaffuz desteği</li>
              <li><Check size={18} /> İlerleme takibi</li>
            </ul>

            <button
              className="subscribe-btn"
              onClick={() => selectedPrice && handleSubscribe(selectedPrice.id)}
              disabled={checkoutLoading || !selectedPrice}
            >
              {checkoutLoading ? (
                'Yükleniyor...'
              ) : (
                <>
                  Hemen Başla <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="guarantee">
              7 gün içinde memnun kalmazsan tam iade garantisi
            </p>
          </div>
        </div>

        {/* Free vs Premium Comparison */}
        <div className="comparison-section">
          <h2>Ücretsiz vs Premium</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-col">Özellik</div>
              <div className="free-col">Ücretsiz</div>
              <div className="premium-col">Premium</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Mimi ile sohbet</div>
              <div className="free-col">Günde 3 mesaj</div>
              <div className="premium-col"><Check size={18} /> Sınırsız</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Eğitici oyunlar</div>
              <div className="free-col">2 oyun</div>
              <div className="premium-col"><Check size={18} /> Tümü (10+)</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Kelime pratikleri</div>
              <div className="free-col">10 kelime</div>
              <div className="premium-col"><Check size={18} /> 100+ kelime</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Günlük meydan okuma</div>
              <div className="free-col">-</div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Hız turu</div>
              <div className="free-col">-</div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">İlerleme takibi</div>
              <div className="free-col">-</div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
          </div>
        </div>

        {/* Login prompt for non-logged in users */}
        {!user && (
          <div className="login-prompt">
            <p>Premium üyelik için giriş yapmanız gerekiyor.</p>
            <button onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              Giriş Yap / Kayıt Ol
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
