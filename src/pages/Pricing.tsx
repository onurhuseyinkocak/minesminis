import { useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import {
  Crown, Check, Star, Sparkles, GraduationCap,
  ChevronDown, ChevronUp, Loader2, ExternalLink,
  ShieldCheck, XCircle, CreditCard,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PublicLayout from '../components/layout/PublicLayout';
import { getApiBase } from '../utils/apiBase';
import { supabase } from '../config/supabase';
import './Pricing.css';

// ── Stripe Price IDs (from env) ─────────────────────────────────────────────

const STRIPE_PRICES = {
  premium_monthly: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY || '',
  premium_yearly: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY || '',
  classroom_monthly: import.meta.env.VITE_STRIPE_CLASSROOM_MONTHLY || '',
  classroom_yearly: import.meta.env.VITE_STRIPE_CLASSROOM_YEARLY || '',
};

// ── Lemon Squeezy variant IDs (legacy) ──────────────────────────────────────

const LS_VARIANT_IDS = {
  premium_monthly: import.meta.env.VITE_LS_PREMIUM_MONTHLY || '',
  premium_yearly: import.meta.env.VITE_LS_PREMIUM_YEARLY || '',
};

// ── Detect if user is in Turkey ─────────────────────────────────────────────

function useIsTurkishUser(): boolean {
  const { lang } = useLanguage();
  const [isTR, setIsTR] = useState(() => {
    if (lang === 'tr') return true;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz === 'Europe/Istanbul';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (lang === 'tr') setIsTR(true);
  }, [lang]);

  return isTR;
}

// ── Plan definitions ────────────────────────────────────────────────────────

interface PlanDef {
  id: string;
  planKey: 'free' | 'premium' | 'classroom';
  nameKey: string;
  icon: ReactNode;
  priceTRY: { monthly: number; quarterly: number; yearly: number; lifetime: number };
  priceUSD: { monthly: number; quarterly: number; yearly: number; lifetime: number };
  stripePriceMonthly: string;
  stripePriceYearly: string;
  lsVariantMonthly: string;
  lsVariantYearly: string;
  iyzicoMonthly: number;
  iyzicoYearly: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

/** DB prices (defaults overridden by premium_plans fetch) */
const DEFAULT_DB_PRICES = {
  monthly: 49.99,
  quarterly: 129.99,
  yearly: 399.99,
  lifetime: 999.99,
};

function buildPlans(dbPrices: typeof DEFAULT_DB_PRICES): PlanDef[] {
  return [
    {
      id: 'free',
      planKey: 'free',
      nameKey: 'pricing.planFree',
      icon: <Star size={28} />,
      priceTRY: { monthly: 0, quarterly: 0, yearly: 0, lifetime: 0 },
      priceUSD: { monthly: 0, quarterly: 0, yearly: 0, lifetime: 0 },
      stripePriceMonthly: '',
      stripePriceYearly: '',
      lsVariantMonthly: '',
      lsVariantYearly: '',
      iyzicoMonthly: 0,
      iyzicoYearly: 0,
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
      planKey: 'premium',
      nameKey: 'pricing.planFamily',
      icon: <Crown size={28} />,
      priceTRY: {
        monthly: dbPrices.monthly,
        quarterly: dbPrices.quarterly,
        yearly: dbPrices.yearly,
        lifetime: dbPrices.lifetime,
      },
      priceUSD: { monthly: 4.99, quarterly: 12.99, yearly: 39.99, lifetime: 99.99 },
      stripePriceMonthly: STRIPE_PRICES.premium_monthly,
      stripePriceYearly: STRIPE_PRICES.premium_yearly,
      lsVariantMonthly: LS_VARIANT_IDS.premium_monthly,
      lsVariantYearly: LS_VARIANT_IDS.premium_yearly,
      iyzicoMonthly: dbPrices.monthly,
      iyzicoYearly: dbPrices.yearly,
      highlight: true,
      badge: 'pricing.mostPopular',
      features: [
        'pricing.featurePremium1',
        'pricing.featurePremium2',
        'pricing.featurePremium3',
        'pricing.featurePremium4',
        'pricing.featureFamily2',
        'pricing.featureFamily3',
        'pricing.featurePremium7',
      ],
    },
    {
      id: 'classroom',
      planKey: 'classroom',
      nameKey: 'pricing.planClassroom',
      icon: <GraduationCap size={28} />,
      priceTRY: {
        monthly: dbPrices.monthly * 2,
        quarterly: dbPrices.quarterly * 2,
        yearly: dbPrices.yearly * 2,
        lifetime: dbPrices.lifetime * 2,
      },
      priceUSD: { monthly: 9.99, quarterly: 24.99, yearly: 79.99, lifetime: 199.99 },
      stripePriceMonthly: STRIPE_PRICES.classroom_monthly,
      stripePriceYearly: STRIPE_PRICES.classroom_yearly,
      lsVariantMonthly: '',
      lsVariantYearly: '',
      iyzicoMonthly: dbPrices.monthly * 2,
      iyzicoYearly: dbPrices.yearly * 2,
      features: [
        'pricing.featureClassroom1',
        'pricing.featureClassroom2',
        'pricing.featureClassroom3',
        'pricing.featureClassroom4',
        'pricing.featureClassroom5',
        'pricing.featureClassroom6',
        'pricing.featureClassroom7',
      ],
    },
  ];
}

// ── Feature comparison table ────────────────────────────────────────────────

interface ComparisonRow {
  labelKey: string;
  free: string | boolean;
  premium: string | boolean;
  classroom: string | boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { labelKey: 'pricing.compLessons', free: '3/day', premium: true, classroom: true },
  { labelKey: 'pricing.compGames', free: 'basic', premium: true, classroom: true },
  { labelKey: 'pricing.compStories', free: false, premium: true, classroom: true },
  { labelKey: 'pricing.compChildren', free: '1', premium: '4', classroom: '-' },
  { labelKey: 'pricing.compStudents', free: '-', premium: '-', classroom: '30' },
  { labelKey: 'pricing.compProgress', free: false, premium: true, classroom: true },
  { labelKey: 'pricing.compOffline', free: false, premium: true, classroom: true },
  { labelKey: 'pricing.compClassroom', free: false, premium: false, classroom: true },
];

// ── FAQ data ────────────────────────────────────────────────────────────────

const FAQ_KEYS = [
  { q: 'pricing.faqQ1', a: 'pricing.faqA1' },
  { q: 'pricing.faqQ2', a: 'pricing.faqA2' },
  { q: 'pricing.faqQ3', a: 'pricing.faqA3' },
  { q: 'pricing.faqQ4', a: 'pricing.faqA4' },
  { q: 'pricing.faqQ5', a: 'pricing.faqA5' },
  { q: 'pricing.faqQ6', a: 'pricing.faqA6' },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    plan: currentPlan,
    subscriptionStatus,
    checkoutUrl,
    customerPortalUrl,
    refreshSubscription,
    isLoading: subLoading,
  } = usePremium();
  const { t, lang } = useLanguage();
  const isTR = useIsTurkishUser();
  const API = getApiBase();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [dbPrices, setDbPrices] = useState(DEFAULT_DB_PRICES);

  // Fetch actual prices from premium_plans table
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('premium_plans')
          .select('id, price')
          .eq('is_active', true);

        if (cancelled || !data) return;

        const prices = { ...DEFAULT_DB_PRICES };
        for (const row of data as { id: string; price: number }[]) {
          if (row.id === 'monthly') prices.monthly = row.price;
          else if (row.id === 'quarterly') prices.quarterly = row.price;
          else if (row.id === 'yearly') prices.yearly = row.price;
          else if (row.id === 'lifetime') prices.lifetime = row.price;
        }
        setDbPrices(prices);
      } catch {
        // Use defaults
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const PLANS = useMemo(() => buildPlans(dbPrices), [dbPrices]);

  // Handle checkout return status
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success(t('pricing.paymentSuccess'));
      refreshSubscription();
      setSearchParams({}, { replace: true });
    } else if (status === 'cancelled') {
      toast(t('pricing.checkoutCancelled'));
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCurrentPlan = (planId: string) =>
    currentPlan === planId && subscriptionStatus === 'active';

  // ── Stripe checkout ─────────────────────────────────────────────────────

  const handleStripeCheckout = useCallback(async (priceId: string, plan: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
      const res = await fetch(`${API}/api/payment/stripe/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify({
          priceId,
          email: user.email,
          plan,
        }),
      });
      if (!res.ok) throw new Error('Stripe checkout failed');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error(lang === 'tr' ? 'Ödeme başlatılamadı. Tekrar deneyin.' : 'Could not start checkout. Please try again.');
    }
  }, [user, API, lang]);

  // ── Iyzico checkout ─────────────────────────────────────────────────────

  const handleIyzicoCheckout = useCallback(async (price: number, plan: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
      const res = await fetch(`${API}/api/payment/iyzico/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify({
          price,
          userId: user.uid,
          email: user.email,
          plan,
        }),
      });
      if (!res.ok) throw new Error('Iyzico init failed');
      const data = await res.json();
      if (data.checkoutFormContent) {
        // Open iyzico form in a new window or inject into page
        const win = window.open('', '_blank', 'width=500,height=600');
        if (win) {
          win.document.write(data.checkoutFormContent);
        }
      }
    } catch {
      toast.error(lang === 'tr' ? 'Ödeme başlatılamadı. Tekrar deneyin.' : 'Could not start checkout. Please try again.');
    }
  }, [user, API, lang]);

  // ── Subscribe handler ─────────────────────────────────────────────────────

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
        toast.error(t('pricing.portalError'));
      }
      return;
    }

    setLoadingPlan(plan.id);

    if (isTR) {
      // Turkish users: Iyzico
      const price = isYearly ? plan.iyzicoYearly : plan.iyzicoMonthly;
      await handleIyzicoCheckout(price, plan.planKey);
    } else {
      // International users: Stripe
      const priceId = isYearly ? plan.stripePriceYearly : plan.stripePriceMonthly;
      if (priceId) {
        await handleStripeCheckout(priceId, plan.planKey);
      } else {
        // Fallback to Lemon Squeezy
        const variantId = isYearly ? plan.lsVariantYearly : plan.lsVariantMonthly;
        if (variantId) {
          const url = await checkoutUrl(variantId);
          if (url) {
            window.open(url, '_blank');
          } else {
            toast(t('pricing.paymentConfiguring'));
          }
        } else {
          toast(t('pricing.paymentConfiguring'));
        }
      }
    }

    setLoadingPlan(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isYearly, isTR, checkoutUrl, customerPortalUrl, navigate, currentPlan, subscriptionStatus, t, handleStripeCheckout, handleIyzicoCheckout]);

  const formatPrice = useCallback((plan: PlanDef) => {
    const prices = isTR ? plan.priceTRY : plan.priceUSD;
    const price = isYearly ? prices.yearly : prices.monthly;
    if (price === 0) return t('pricing.free');
    if (isTR) return `${price.toLocaleString('tr-TR')} TL`;
    return `$${price}`;
  }, [isTR, isYearly, t]);

  const formatPerMonth = useCallback((plan: PlanDef) => {
    const prices = isTR ? plan.priceTRY : plan.priceUSD;
    if (prices.yearly === 0) return '';
    const perMonth = Math.round((prices.yearly / 12) * 100) / 100;
    if (isTR) return `${Math.round(perMonth)} TL`;
    return `$${perMonth.toFixed(2)}`;
  }, [isTR]);

  const yearlySavings = (plan: PlanDef) => {
    const prices = isTR ? plan.priceTRY : plan.priceUSD;
    if (prices.monthly === 0) return 0;
    return Math.round(((prices.monthly * 12 - prices.yearly) / (prices.monthly * 12)) * 100);
  };

  const planNameMap = useMemo<Record<string, string>>(() => ({
    free: t('pricing.planFree'),
    premium: t('pricing.planFamily'),
    classroom: t('pricing.planClassroom'),
  }), [t]);

  // Check if a plan has a payment method configured
  const hasPaymentMethod = (plan: PlanDef): boolean => {
    if (plan.id === 'free') return true;
    if (isTR) return plan.iyzicoMonthly > 0;
    const priceId = isYearly ? plan.stripePriceYearly : plan.stripePriceMonthly;
    const lsId = isYearly ? plan.lsVariantYearly : plan.lsVariantMonthly;
    return !!(priceId || lsId);
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
          <div className="pricing-grid pricing-grid--3col">
            {PLANS.map((plan) => {
              const isCurrent = isCurrentPlan(plan.id);
              const isLoadingThis = loadingPlan === plan.id;
              const isFree = plan.id === 'free';
              const savings = yearlySavings(plan);
              const paymentReady = hasPaymentMethod(plan);

              return (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''} ${isCurrent ? 'plan-card--current' : ''}`}
                >
                  {plan.badge && (
                    <div className="plan-badge">{t(plan.badge)}</div>
                  )}

                  <div className="plan-icon">{plan.icon}</div>
                  <h3 className="plan-name">{planNameMap[plan.id] || plan.id}</h3>

                  <div className="plan-price">
                    {isFree ? (
                      <span className="price-amount">{t('pricing.free')}</span>
                    ) : (
                      <>
                        <span className="price-amount">{formatPrice(plan)}</span>
                        <span className="price-period">/{isYearly ? t('pricing.year') : t('pricing.month')}</span>
                      </>
                    )}
                  </div>

                  {!isFree && isYearly && (
                    <div className="plan-per-month">
                      {formatPerMonth(plan)}{t('pricing.perMonth')}
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
                    disabled={subLoading || isLoadingThis || (!isFree && !isCurrent && !paymentReady)}
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
                    ) : !paymentReady ? (
                      t('pricing.comingSoon')
                    ) : (
                      <>
                        {lang === 'tr' ? 'Şimdi Başla' : 'Start Now'}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Trust badges ──────────────────────────────────────── */}
          <div className="pricing-trust-badges">
            <div className="trust-badge">
              <ShieldCheck size={18} />
              <span>SSL {lang === 'tr' ? 'Güvenli' : 'Secure'}</span>
            </div>
            <div className="trust-badge">
              <XCircle size={18} />
              <span>{lang === 'tr' ? 'İptal Kolayca' : 'Cancel Anytime'}</span>
            </div>
            <div className="trust-badge">
              <CreditCard size={18} />
              <span>{isTR ? 'Iyzico' : 'Stripe'}</span>
            </div>
          </div>

          {/* ── Feature Comparison Toggle ─────────────────────────── */}
          <section className="pricing-comparison-section">
            <button
              type="button"
              className="comparison-toggle"
              onClick={() => setShowComparison(!showComparison)}
            >
              <span>{lang === 'tr' ? 'Özellik Karşılaştırması' : 'Feature Comparison'}</span>
              {showComparison ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showComparison && (
              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>{lang === 'tr' ? 'Özellik' : 'Feature'}</th>
                      <th>{t('pricing.planFree')}</th>
                      <th className="comparison-highlight">{t('pricing.planFamily')}</th>
                      <th>{t('pricing.planClassroom')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr key={i}>
                        <td>{t(row.labelKey)}</td>
                        {([row.free, row.premium, row.classroom] as Array<string | boolean>).map((val, ci) => (
                          <td key={ci} className={ci === 1 ? 'comparison-highlight' : ''}>
                            {val === true ? (
                              <Check size={18} className="feature-check" />
                            ) : val === false ? (
                              <span className="comp-dash">-</span>
                            ) : (
                              <span>{val}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

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
