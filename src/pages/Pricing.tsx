import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import {
  Crown, Check, Star, Sparkles, Users, GraduationCap,
  ChevronDown, ChevronUp, Loader2, ExternalLink,
} from 'lucide-react';
import './Pricing.css';

// ── Plan variant IDs (set these to your Lemon Squeezy variant IDs) ──────────

const VARIANT_IDS = {
  premium_monthly: import.meta.env.VITE_LS_PREMIUM_MONTHLY || '',
  premium_yearly:  import.meta.env.VITE_LS_PREMIUM_YEARLY  || '',
  family_monthly:  import.meta.env.VITE_LS_FAMILY_MONTHLY  || '',
  family_yearly:   import.meta.env.VITE_LS_FAMILY_YEARLY   || '',
  classroom_monthly: import.meta.env.VITE_LS_CLASSROOM_MONTHLY || '',
  classroom_yearly:  import.meta.env.VITE_LS_CLASSROOM_YEARLY  || '',
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
      '1 world to explore',
      '5 lessons included',
      'Basic educational games',
      'Chat with Mimi (10/day)',
      'Daily challenges',
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
    badge: 'Most Popular',
    features: [
      'All 12 worlds unlocked',
      'Unlimited lessons',
      'All educational games',
      'Unlimited Mimi chat',
      'Progress tracking',
      'Achievement badges',
      'Ad-free experience',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    icon: <Users size={28} />,
    monthlyPrice: 119,
    yearlyPrice: 890,
    monthlyVariantId: VARIANT_IDS.family_monthly,
    yearlyVariantId: VARIANT_IDS.family_yearly,
    features: [
      'Everything in Premium',
      'Up to 4 children',
      'Parent dashboard',
      'Family progress overview',
      'Individual profiles',
      'Parental controls',
    ],
  },
  {
    id: 'classroom',
    name: 'Classroom',
    icon: <GraduationCap size={28} />,
    monthlyPrice: 299,
    yearlyPrice: 2290,
    monthlyVariantId: VARIANT_IDS.classroom_monthly,
    yearlyVariantId: VARIANT_IDS.classroom_yearly,
    features: [
      'Everything in Premium',
      'Up to 30 students',
      'Teacher dashboard',
      'Classroom / smart board mode',
      'Student analytics',
      'Assignment tracking',
      'Bulk student management',
    ],
  },
];

// ── FAQ data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! You can cancel your subscription anytime from your account settings. You will keep access until the end of your billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free plan lets you try MinesMinis with no time limit. Upgrade to Premium when you are ready for the full experience.',
  },
  {
    q: 'How does the Family plan work?',
    a: 'The Family plan allows up to 4 children to have their own profiles with individual progress tracking, all under one subscription managed by a parent.',
  },
  {
    q: 'Can I switch between plans?',
    a: 'Absolutely. You can upgrade, downgrade, or switch billing period anytime. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept credit/debit cards, Apple Pay, Google Pay, and more through our secure payment partner Lemon Squeezy.',
  },
  {
    q: 'Is my payment information safe?',
    a: 'Yes. All payments are processed securely by Lemon Squeezy. We never store your card details on our servers.',
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan: currentPlan, subscriptionStatus, checkoutUrl, customerPortalUrl, isLoading: subLoading } = usePremium();

  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      if (url) window.open(url, '_blank');
      return;
    }

    const variantId = isYearly ? plan.yearlyVariantId : plan.monthlyVariantId;
    if (!variantId) {
      navigate('/premium');
      return;
    }

    setLoadingPlan(plan.id);
    const url = await checkoutUrl(variantId);
    setLoadingPlan(null);

    if (url) {
      window.location.href = url;
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
    <div className="pricing-page">
      <div className="pricing-container">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="pricing-hero">
          <div className="pricing-hero-badge">
            <Sparkles size={18} />
            <span>Pricing</span>
          </div>
          <h1>Choose your learning adventure</h1>
          <p>Start free. Upgrade anytime to unlock the full MinesMinis experience.</p>
        </section>

        {/* ── Billing toggle ──────────────────────────────────────── */}
        <div className="billing-toggle">
          <button
            type="button"
            className={`toggle-btn ${!isYearly ? 'active' : ''}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`toggle-btn ${isYearly ? 'active' : ''}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly
            <span className="save-badge">Save up to 38%</span>
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

            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''} ${isCurrent ? 'plan-card--current' : ''}`}
              >
                {plan.badge && (
                  <div className="plan-badge">{plan.badge}</div>
                )}

                <div className="plan-icon">{plan.icon}</div>
                <h3 className="plan-name">{plan.name}</h3>

                <div className="plan-price">
                  {isFree ? (
                    <span className="price-amount">Free</span>
                  ) : (
                    <>
                      <span className="price-amount">{formatPrice(price)}</span>
                      <span className="price-period">/{isYearly ? 'year' : 'month'}</span>
                    </>
                  )}
                </div>

                {!isFree && isYearly && (
                  <div className="plan-per-month">
                    {formatPrice(perMonth)}/month
                    {savings > 0 && (
                      <span className="plan-savings">{savings}% off</span>
                    )}
                  </div>
                )}

                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <Check size={16} className="feature-check" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`plan-cta ${plan.highlight ? 'plan-cta--primary' : ''} ${isCurrent ? 'plan-cta--current' : ''}`}
                  disabled={subLoading || isLoadingThis}
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
                    <>Manage Plan <ExternalLink size={14} /></>
                  ) : isFree ? (
                    user ? 'Current Plan' : 'Get Started'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        {!user && (
          <section className="pricing-cta-section">
            <p>Sign up to start learning English with MinesMinis today.</p>
            <button
              type="button"
              className="pricing-cta-btn"
              onClick={() => navigate('/login', { state: { from: '/pricing' } })}
            >
              Create Free Account
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
