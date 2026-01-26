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
          description: 'Unlimited learning adventure!',
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
      alert('Payment system is currently under maintenance. Please try again later.');
      return;
    }

    setCheckoutLoading(true);
    const url = await createCheckout(priceId);

    if (url) {
      window.location.href = url;
    } else {
      alert('Payment could not be initiated. Please check your internet connection.');
    }
    setCheckoutLoading(false);
  };

  const handleManageSubscription = async () => {
    setCheckoutLoading(true);
    const url = await openCustomerPortal();

    if (url) {
      window.location.href = url;
    } else {
      alert('An error occurred. Please try again.');
    }
    setCheckoutLoading(false);
  };

  const premiumFeatures = [
    { icon: <MessageCircle size={32} strokeWidth={2.5} />, title: 'Unlimited Chat with Mimi', description: 'Practice English as much as you want with our AI dragon Mimi!' },
    { icon: <Gamepad2 size={32} strokeWidth={2.5} />, title: 'All Educational Games', description: 'Word matching, memory games, speed rounds, and more!' },
    { icon: <BookOpen size={32} strokeWidth={2.5} />, title: 'Vocabulary Practice', description: 'Visual and audio learning experience with 100+ words' },
    { icon: <Trophy size={32} strokeWidth={2.5} />, title: 'Daily Challenges', description: 'Keep learning with new questions every day!' },
    { icon: <Zap size={32} strokeWidth={2.5} />, title: 'Sentence Builder', description: 'Learn English sentence structure while having fun' },
    { icon: <Star size={32} strokeWidth={2.5} />, title: 'Balloon Pop', description: 'Exciting timed vocabulary competition!' },
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
              <span>Premium Member</span>
            </div>

            <h1>Your MiniPremium Membership is Active!</h1>
            <p className="status-description">
              You have unlimited access to all premium features. Keep learning with Mimi!
            </p>

            <div className="subscription-info">
              {subscription && (
                <>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value status-active">Active</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Plan:</span>
                    <span className="info-value">
                      {subscription.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'Annual' : 'Monthly'}
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
              {checkoutLoading ? 'Loading...' : 'Manage Subscription'}
            </button>

            <button
              className="back-btn"
              onClick={() => navigate('/')}
            >
              Back to Home
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
          <h1>Unlimited AI Chat with Mimi!</h1>
          <p>All educational content is free. Upgrade to Premium for unlimited English practice with Mimi!</p>
          <div className="hero-sparkles">
            <Sparkles className="sparkle-1" size={24} />
            <Sparkles className="sparkle-2" size={20} />
            <Sparkles className="sparkle-3" size={16} />
          </div>
        </div>

        {/* Pricing Section - MOVED UP */}
        <div className="pricing-section animate-up">
          <div className="section-badge">💸 Best Value Plans</div>
          <h2>Choose Your Plan</h2>

          {/* Interval Toggle */}
          <div className="interval-toggle">
            <button
              className={`toggle-btn ${selectedInterval === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedInterval('month')}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${selectedInterval === 'year' ? 'active' : ''}`}
              onClick={() => setSelectedInterval('year')}
            >
              Annual
              <span className="save-badge">%{savings} Save</span>
            </button>
          </div>

          {/* Pricing Card */}
          <div className="pricing-card">
            <div className="pricing-header">
              <Crown className="crown-icon" size={40} />
              <h3>MiniPremium</h3>
              {selectedInterval === 'year' && (
                <div className="best-value">Best Value!</div>
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
              <span className="period">/month</span>
            </div>

            {selectedInterval === 'year' && (
              <div className="billed-yearly">
                Billed annually at ₺{yearlyCost.toFixed(2)}
              </div>
            )}

            <ul className="pricing-features">
              <li>Unlimited AI chat with Mimi</li>
              <li>Remove daily 10-message limit</li>
              <li>10+ educational games (Already Free!)</li>
              <li>100+ word sets (Already Free!)</li>
              <li>Daily challenges (Already Free!)</li>
              <li>All learning content (Always Free!)</li>
            </ul>

            <div className="pricing-cta">
              <button
                className="subscribe-btn"
                onClick={() => selectedPrice && handleSubscribe(selectedPrice.id)}
                disabled={checkoutLoading || !selectedPrice}
              >
                {checkoutLoading ? (
                  'Loading...'
                ) : (
                  <>
                    Get Started <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="guarantee">
                7-day money-back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid - MOVED DOWN */}
        <div className="features-section animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-badge">✨ Premium Perks</div>
          <h2>Why Choose Premium?</h2>
          <div className="features-grid">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="feature-card glass-morphism">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free vs Premium Comparison */}
        <div className="comparison-section">
          <h2>Free vs Premium</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-col">Feature</div>
              <div className="free-col">Free</div>
              <div className="premium-col">Premium</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Chat with Mimi</div>
              <div className="free-col">10 messages / day</div>
              <div className="premium-col"><Check size={18} /> Unlimited</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Educational games</div>
              <div className="free-col"><Check size={18} /> All</div>
              <div className="premium-col"><Check size={18} /> All</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Vocabulary practice</div>
              <div className="free-col"><Check size={18} /> All</div>
              <div className="premium-col"><Check size={18} /> All</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Daily challenge</div>
              <div className="free-col"><Check size={18} /></div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Speed round</div>
              <div className="free-col"><Check size={18} /></div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Progress tracking</div>
              <div className="free-col"><Check size={18} /></div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
          </div>
        </div>

        {/* Login prompt for non-logged in users */}
        {!user && (
          <div className="login-prompt">
            <p>You need to log in to access Premium features.</p>
            <button onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              Log In / Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
