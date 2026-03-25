import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import {
  Crown, Check, Star, Sparkles,
  ChevronDown, ChevronUp, Loader2, ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PublicLayout from '../components/layout/PublicLayout';
import './Pricing.css';

// ── Plan variant IDs (set these to your Lemon Squeezy variant IDs) ──────────

const VARIANT_IDS = {
  premium_monthly: import.meta.env.VITE_LS_PREMIUM_MONTHLY || '',
  premium_yearly:  import.meta.env.VITE_LS_PREMIUM_YEARLY  || '',
};

// ── Plan definitions ─────────────────────────────────────────────────────────

interface PlanDef {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyVariantId: string;
  yearlyVariantId: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    icon: <Star size={28} />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyVariantId: '',
    yearlyVariantId: '',
    features: [
      'pricing.featureFree1',
      'pricing.featureFree2',
      'pricing.featureFree3',
      'pricing.featureFree4',
      'pricing.featureFree5',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: <Crown size={28} />,
    monthlyPrice: 79,
    yearlyPrice: 590,
    monthlyVariantId: VARIANT_IDS.premium_monthly,
    yearlyVariantId: VARIANT_IDS.premium_yearly,
    highlight: true,
    badge: 'pricing.mostPopular',
    features: [
      'pricing.featurePremium1',
      'pricing.featurePremium2',
      'pricing.featurePremium3',
      'pricing.featurePremium4',
      'pricing.featurePremium5',
      'pricing.featurePremium6',
      'pricing.featurePremium7',
    ],
  },
];

// ── FAQ data ─────────────────────────────────────────────────────────────────

const FAQ_KEYS = [
  { q: 'pricing.faqQ1', a: 'pricing.faqA1' },
  { q: 'pricing.faqQ2', a: 'pricing.faqA2' },
  { q: 'pricing.faqQ3', a: 'pricing.faqA3' },
  { q: 'pricing.faqQ4', a: 'pricing.faqA4' },
  { q: 'pricing.faqQ5', a: 'pricing.faqA5' },
  { q: 'pricing.faqQ6', a: 'pricing.faqA6' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan: currentPlan, subscriptionStatus, checkoutUrl, customerPortalUrl, refreshSubscription, isLoading: subLoading } = usePremium();
  const { t } = useLanguage();

  const planNameMap: Record<string, string> = {
    free: t('pricing.planFree'),
    premium: t('pricing.planPremium'),
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Handle checkout return status
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success('Payment successful! Your subscription is being activated.');
      refreshSubscription();
      setSearchParams({}, { replace: true });
    } else if (status === 'cancelled') {
      toast('Checkout cancelled. You can subscribe anytime.');
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCurrentPlan = (planId: string) =>
    currentPlan === planId && subscriptionStatus === 'active';

  const handleSubscribe = useCallback(async (plan: PlanDef) => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    if (isCurrentPlan(plan.id)) {
      // Already on this plan — open portal
      setLoadingPlan(plan.id);
      const url = await customerPortalUrl();
      setLoadingPlan(null);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast.error('Could not open subscription portal. Please try again.');
      }
      return;
    }

    const variantId = isYearly ? plan.yearlyVariantId : plan.monthlyVariantId;
    if (!variantId) {
      toast('Payment system is being configured. Please check back soon!');
      return;
    }

    setLoadingPlan(plan.id);

    // Try server-side checkout first; fall back to hosted checkout URL
    let url = await checkoutUrl(variantId);

    if (!url) {
      // Fallback: direct Lemon Squeezy hosted checkout
      const params = new URLSearchParams();
      params.set('checkout[custom][user_id]', user.uid);
      if (user.email) params.set('checkout[email]', user.email);
      if (user.displayName) params.set('checkout[name]', user.displayName);
      url = `https://minesminis.lemonsqueezy.com/buy/${variantId}?${params.toString()}`;
    }

    setLoadingPlan(null);

    if (url) {
      window.open(url, '_blank');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isYearly, checkoutUrl, customerPortalUrl, navigate, currentPlan, subscriptionStatus]);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `${price.toLocaleString('tr-TR')} TL`;
  };

  const yearlySavings = (plan: PlanDef) => {
    if (plan.monthlyPrice === 0) return 0;
    return Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100);
  };

  return (
    <PublicLayout>
    <div className="pricing-page">
      <div className="pricing-container">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="pricing-hero">
          <div className="pricing-hero-badge">
            <Sparkles size={18} />
            <span>{t('pricing.badge')}</span>
          </div>
          <h1>{t('pricing.title')}</h1>
          <p>{t('pricing.subtitle')}</p>
        </section>

        {/* ── Billing toggle ──────────────────────────────────────── */}
        <div className="billing-toggle">
          <button
            type="button"
            className={`toggle-btn ${!isYearly ? 'active' : ''}`}
            onClick={() => setIsYearly(false)}
          >
            {t('pricing.monthly')}
          </button>
          <button
            type="button"
            className={`toggle-btn ${isYearly ? 'active' : ''}`}
            onClick={() => setIsYearly(true)}
          >
            {t('pricing.yearly')}
            <span className="save-badge">{t('pricing.saveUpTo')}</span>
          </button>
        </div>

        {/* ── Plan cards ──────────────────────────────────────────── */}
        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const perMonth = isYearly && plan.yearlyPrice > 0
              ? Math.round(plan.yearlyPrice / 12)
              : plan.monthlyPrice;
            const savings = yearlySavings(plan);
            const isCurrent = isCurrentPlan(plan.id);
            const isLoadingThis = loadingPlan === plan.id;
            const isFree = plan.id === 'free';
            const variantId = isYearly ? plan.yearlyVariantId : plan.monthlyVariantId;
            const variantMissing = !isFree && !isCurrent && !variantId;

            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''} ${isCurrent ? 'plan-card--current' : ''}`}
              >
                {plan.badge && (
                  <div className="plan-badge">{t(plan.badge)}</div>
                )}

                <div className="plan-icon">{plan.icon}</div>
                <h3 className="plan-name">{planNameMap[plan.id] || plan.name}</h3>

                <div className="plan-price">
                  {isFree ? (
                    <span className="price-amount">{t('pricing.free')}</span>
                  ) : (
                    <>
                      <span className="price-amount">{formatPrice(price)}</span>
                      <span className="price-period">/{isYearly ? t('pricing.year') : t('pricing.month')}</span>
                    </>
                  )}
                </div>

                {!isFree && isYearly && (
                  <div className="plan-per-month">
                    {formatPrice(perMonth)}{t('pricing.perMonth')}
                    {savings > 0 && (
                      <span className="plan-savings">{savings}% {t('pricing.off')}</span>
                    )}
                  </div>
                )}

                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <Check size={16} className="feature-check" />
                      <span>{t(f)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`plan-cta ${plan.highlight ? 'plan-cta--primary' : ''} ${isCurrent ? 'plan-cta--current' : ''}`}
                  disabled={subLoading || isLoadingThis || variantMissing}
                  onClick={() => {
                    if (isFree) {
                      if (!user) navigate('/login');
                      else navigate('/dashboard');
                    } else {
                      handleSubscribe(plan);
                    }
                  }}
                >
                  {isLoadingThis ? (
                    <Loader2 size={18} className="spin" />
                  ) : isCurrent ? (
                    <>{t('pricing.managePlan')} <ExternalLink size={14} /></>
                  ) : isFree ? (
                    user ? t('pricing.currentPlan') : t('pricing.getStarted')
                  ) : variantMissing ? (
                    t('pricing.comingSoon')
                  ) : (
                    `${t('pricing.subscribeTo')} ${planNameMap[plan.id] || plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="pricing-faq">
          <h2>{t('pricing.faq')}</h2>
          <div className="faq-list">
            {FAQ_KEYS.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{t(item.q)}</span>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{t(item.a)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        {!user && (
          <section className="pricing-cta-section">
            <p>{t('pricing.signUpCta')}</p>
            <button
              type="button"
              className="pricing-cta-btn"
              onClick={() => navigate('/login', { state: { from: '/pricing' } })}
            >
              {t('pricing.createFreeAccount')}
            </button>
          </section>
        )}
      </div>
    </div>
    </PublicLayout>
  );
}
