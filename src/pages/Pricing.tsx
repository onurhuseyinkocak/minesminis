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
import { usePageTitle } from '../hooks/usePageTitle';
import PublicLayout from '../components/layout/PublicLayout';
import { getApiBase } from '../utils/apiBase';
import { supabase } from '../config/supabase';
import { analytics } from '../services/analytics';
import { motion } from 'framer-motion';

// ── Stripe / LS Price IDs ───────────────────────────────────────────────────

const STRIPE_PRICES = {
  premium_monthly: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY || '',
  premium_yearly: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY || '',
  classroom_monthly: import.meta.env.VITE_STRIPE_CLASSROOM_MONTHLY || '',
  classroom_yearly: import.meta.env.VITE_STRIPE_CLASSROOM_YEARLY || '',
};

const LS_VARIANT_IDS = {
  premium_monthly: import.meta.env.VITE_LS_PREMIUM_MONTHLY || '',
  premium_yearly: import.meta.env.VITE_LS_PREMIUM_YEARLY || '',
};

function useIsTurkishUser(): boolean {
  const { lang } = useLanguage();
  const [isTR, setIsTR] = useState(() => {
    if (lang === 'tr') return true;
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Istanbul'; } catch { return false; }
  });
  useEffect(() => { if (lang === 'tr') setIsTR(true); }, [lang]);
  return isTR;
}

// ── Plans ───────────────────────────────────────────────────────────────────

interface PlanDef {
  id: string; planKey: 'free' | 'premium' | 'classroom'; nameKey: string; icon: ReactNode;
  priceTRY: { monthly: number; quarterly: number; yearly: number; lifetime: number };
  priceUSD: { monthly: number; quarterly: number; yearly: number; lifetime: number };
  stripePriceMonthly: string; stripePriceYearly: string;
  lsVariantMonthly: string; lsVariantYearly: string;
  iyzicoMonthly: number; iyzicoYearly: number;
  features: string[]; comingSoonFeatures?: string[]; highlight?: boolean; badge?: string;
}

const DEFAULT_DB_PRICES = { monthly: 49.99, quarterly: 129.99, yearly: 399.99, lifetime: 999.99 };

function buildPlans(dbPrices: typeof DEFAULT_DB_PRICES): PlanDef[] {
  return [
    { id: 'free', planKey: 'free', nameKey: 'pricing.planFree', icon: <Star size={28} />,
      priceTRY: { monthly: 0, quarterly: 0, yearly: 0, lifetime: 0 }, priceUSD: { monthly: 0, quarterly: 0, yearly: 0, lifetime: 0 },
      stripePriceMonthly: '', stripePriceYearly: '', lsVariantMonthly: '', lsVariantYearly: '', iyzicoMonthly: 0, iyzicoYearly: 0,
      features: ['pricing.featureFree1', 'pricing.featureFree2', 'pricing.featureFree3', 'pricing.featureFree4', 'pricing.featureFree5'] },
    { id: 'premium', planKey: 'premium', nameKey: 'pricing.planFamily', icon: <Crown size={28} />,
      priceTRY: { monthly: dbPrices.monthly, quarterly: dbPrices.quarterly, yearly: dbPrices.yearly, lifetime: dbPrices.lifetime },
      priceUSD: { monthly: 4.99, quarterly: 12.99, yearly: 39.99, lifetime: 99.99 },
      stripePriceMonthly: STRIPE_PRICES.premium_monthly, stripePriceYearly: STRIPE_PRICES.premium_yearly,
      lsVariantMonthly: LS_VARIANT_IDS.premium_monthly, lsVariantYearly: LS_VARIANT_IDS.premium_yearly,
      iyzicoMonthly: dbPrices.monthly, iyzicoYearly: dbPrices.yearly, highlight: true, badge: 'pricing.mostPopular',
      features: ['pricing.featurePremium1', 'pricing.featurePremium2', 'pricing.featurePremium3', 'pricing.featurePremium4', 'pricing.featureFamily2', 'pricing.featureFamily3', 'pricing.featurePremium7'] },
    { id: 'classroom', planKey: 'classroom', nameKey: 'pricing.planClassroom', icon: <GraduationCap size={28} />,
      priceTRY: { monthly: dbPrices.monthly * 2, quarterly: dbPrices.quarterly * 2, yearly: dbPrices.yearly * 2, lifetime: dbPrices.lifetime * 2 },
      priceUSD: { monthly: 9.99, quarterly: 24.99, yearly: 79.99, lifetime: 199.99 },
      stripePriceMonthly: STRIPE_PRICES.classroom_monthly, stripePriceYearly: STRIPE_PRICES.classroom_yearly,
      lsVariantMonthly: '', lsVariantYearly: '', iyzicoMonthly: dbPrices.monthly * 2, iyzicoYearly: dbPrices.yearly * 2,
      features: ['pricing.featureClassroom1', 'pricing.featureClassroom2', 'pricing.featureClassroom3', 'pricing.featureClassroom4', 'pricing.featureClassroom5', 'pricing.featureClassroom6', 'pricing.featureClassroom7'],
      comingSoonFeatures: ['pricing.featureClassroom4', 'pricing.featureClassroom6'] },
  ];
}

const FAQ_KEYS = [
  { q: 'pricing.faqQ1', a: 'pricing.faqA1' }, { q: 'pricing.faqQ2', a: 'pricing.faqA2' },
  { q: 'pricing.faqQ3', a: 'pricing.faqA3' }, { q: 'pricing.faqQ4', a: 'pricing.faqA4' },
  { q: 'pricing.faqQ5', a: 'pricing.faqA5' }, { q: 'pricing.faqQ6', a: 'pricing.faqA6' },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan: currentPlan, subscriptionStatus, checkoutUrl, customerPortalUrl, refreshSubscription, isLoading: subLoading } = usePremium();
  const { t, lang } = useLanguage();
  usePageTitle('Fiyatlandirma', 'Pricing');
  const isTR = useIsTurkishUser();
  const API = getApiBase();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dbPrices, setDbPrices] = useState(DEFAULT_DB_PRICES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.from('premium_plans').select('id, price').eq('is_active', true);
        if (cancelled || !data) return;
        const prices = { ...DEFAULT_DB_PRICES };
        for (const row of data as { id: string; price: number }[]) {
          if (row.id === 'monthly') prices.monthly = row.price;
          else if (row.id === 'quarterly') prices.quarterly = row.price;
          else if (row.id === 'yearly') prices.yearly = row.price;
          else if (row.id === 'lifetime') prices.lifetime = row.price;
        }
        setDbPrices(prices);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const PLANS = useMemo(() => buildPlans(dbPrices), [dbPrices]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') { toast.success(t('pricing.paymentSuccess')); refreshSubscription(); setSearchParams({}, { replace: true }); }
    else if (status === 'cancelled') { toast(t('pricing.checkoutCancelled')); setSearchParams({}, { replace: true }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCurrentPlan = (planId: string) => currentPlan === planId && subscriptionStatus === 'active';

  const handleStripeCheckout = useCallback(async (priceId: string, plan: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
      const res = await fetch(`${API}/api/payment/stripe/create-checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}) },
        body: JSON.stringify({ priceId, email: user.email, plan }),
      });
      if (!res.ok) throw new Error('Stripe checkout failed');
      const data = await res.json();
      if (data.url) { analytics.subscriptionStarted(plan, isYearly ? 'yearly' : 'monthly', 'stripe'); window.location.href = data.url; }
    } catch { toast.error(lang === 'tr' ? 'Odeme baslatilamadi.' : 'Could not start checkout.'); }
  }, [user, API, lang, isYearly]);

  const handleIyzicoCheckout = useCallback(async (price: number, plan: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
      const res = await fetch(`${API}/api/payment/iyzico/initialize`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}) },
        body: JSON.stringify({ price, userId: user.uid, email: user.email, plan }),
      });
      if (!res.ok) throw new Error('Iyzico init failed');
      const data = await res.json();
      if (data.checkoutFormContent) {
        analytics.subscriptionStarted(plan, isYearly ? 'yearly' : 'monthly', 'iyzico');
        const win = window.open('', '_blank', 'width=500,height=600');
        if (win) win.document.write(data.checkoutFormContent);
      }
    } catch { toast.error(lang === 'tr' ? 'Odeme baslatilamadi.' : 'Could not start checkout.'); }
  }, [user, API, lang, isYearly]);

  const handleSubscribe = useCallback(async (plan: PlanDef) => {
    if (!user) { navigate('/login', { state: { from: '/pricing' } }); return; }
    if (isCurrentPlan(plan.id)) {
      setLoadingPlan(plan.id);
      const url = await customerPortalUrl();
      setLoadingPlan(null);
      if (url) window.open(url, '_blank');
      else toast.error(t('pricing.portalError'));
      return;
    }
    setLoadingPlan(plan.id);
    if (isTR) { await handleIyzicoCheckout(isYearly ? plan.iyzicoYearly : plan.iyzicoMonthly, plan.planKey); }
    else {
      const priceId = isYearly ? plan.stripePriceYearly : plan.stripePriceMonthly;
      if (priceId) { await handleStripeCheckout(priceId, plan.planKey); }
      else {
        const variantId = isYearly ? plan.lsVariantYearly : plan.lsVariantMonthly;
        if (variantId) { const url = await checkoutUrl(variantId); if (url) window.open(url, '_blank'); else toast(t('pricing.paymentConfiguring')); }
        else toast(t('pricing.paymentConfiguring'));
      }
    }
    setLoadingPlan(null);
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

  const hasPaymentMethod = (plan: PlanDef): boolean => {
    if (plan.id === 'free') return true;
    if (isTR) return plan.iyzicoMonthly > 0;
    return !!(isYearly ? plan.stripePriceYearly : plan.stripePriceMonthly) || !!(isYearly ? plan.lsVariantYearly : plan.lsVariantMonthly);
  };

  const planNameMap = useMemo<Record<string, string>>(() => ({ free: t('pricing.planFree'), premium: t('pricing.planFamily'), classroom: t('pricing.planClassroom') }), [t]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 px-4 py-6 pb-24">
        <div className="max-w-lg mx-auto">

          {/* Hero */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              <Sparkles size={14} /> {t('pricing.badge')}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t('pricing.title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('pricing.subtitle')}</p>
          </div>

          {/* Billing toggle */}
          <div className="flex bg-white rounded-3xl p-1 max-w-xs mx-auto mb-6 shadow-sm">
            <button type="button" className={`flex-1 min-h-[48px] rounded-3xl text-sm font-bold transition-all ${!isYearly ? 'bg-orange-500 text-white shadow' : 'text-gray-500'}`} onClick={() => setIsYearly(false)}>
              {t('pricing.monthly')}
            </button>
            <button type="button" className={`flex-1 min-h-[48px] rounded-3xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${isYearly ? 'bg-orange-500 text-white shadow' : 'text-gray-500'}`} onClick={() => setIsYearly(true)}>
              {t('pricing.yearly')}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isYearly ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600'}`}>{t('pricing.saveUpTo')}</span>
            </button>
          </div>

          {/* Plan cards */}
          <div className="flex flex-col gap-4 mb-6">
            {PLANS.map((plan, i) => {
              const isCurrent = isCurrentPlan(plan.id);
              const isLoadingThis = loadingPlan === plan.id;
              const isFree = plan.id === 'free';
              const savings = yearlySavings(plan);
              const paymentReady = hasPaymentMethod(plan);

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300, delay: i * 0.08 }}
                  className={`bg-white rounded-3xl p-5 shadow-sm relative ${plan.highlight ? 'ring-2 ring-amber-400' : ''} ${isCurrent ? 'ring-2 ring-emerald-400' : ''}`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {t(plan.badge)}
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plan.highlight ? 'bg-amber-100 text-amber-500' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{planNameMap[plan.id] || plan.id}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-800">{isFree ? t('pricing.free') : formatPrice(plan)}</span>
                        {!isFree && <span className="text-xs text-gray-400">/{isYearly ? t('pricing.year') : t('pricing.month')}</span>}
                      </div>
                    </div>
                  </div>

                  {!isFree && isYearly && (
                    <p className="text-xs text-gray-500 mb-3">
                      {formatPerMonth(plan)}{t('pricing.perMonth')}
                      {savings > 0 && <span className="ml-1.5 text-emerald-600 font-bold">{savings}% {t('pricing.off')}</span>}
                    </p>
                  )}

                  <ul className="flex flex-col gap-1.5 mb-4">
                    {plan.features.map((f, fi) => {
                      const isComingSoon = plan.comingSoonFeatures?.includes(f);
                      return (
                        <li key={fi} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{t(f)}</span>
                          {isComingSoon && <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full ml-auto">{lang === 'tr' ? 'Yakinda' : 'Soon'}</span>}
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    type="button"
                    className={`w-full min-h-[48px] rounded-3xl text-sm font-bold transition-all ${
                      plan.highlight ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200' :
                      isCurrent ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    } disabled:opacity-40`}
                    disabled={subLoading || isLoadingThis || (!isFree && !isCurrent && !paymentReady)}
                    onClick={() => {
                      if (isFree) { if (!user) navigate('/login'); else navigate('/dashboard'); }
                      else handleSubscribe(plan);
                    }}
                  >
                    {isLoadingThis ? <Loader2 size={18} className="animate-spin mx-auto" /> :
                     isCurrent ? <>{t('pricing.managePlan')} <ExternalLink size={14} className="inline ml-1" /></> :
                     isFree ? (user ? t('pricing.currentPlan') : t('pricing.getStarted')) :
                     !paymentReady ? t('pricing.comingSoon') :
                     (lang === 'tr' ? 'Simdi Basla' : 'Start Now')}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-4 mb-4">
            {[
              { icon: <ShieldCheck size={16} />, label: `SSL ${lang === 'tr' ? 'Guvenli' : 'Secure'}` },
              { icon: <XCircle size={16} />, label: lang === 'tr' ? 'Iptal Kolayca' : 'Cancel Anytime' },
              { icon: <CreditCard size={16} />, label: isTR ? 'Iyzico' : 'Stripe' },
            ].map((b, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-gray-400">{b.icon} {b.label}</span>
            ))}
          </div>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-emerald-50 rounded-2xl py-3 px-4 mb-6">
            <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
            {lang === 'tr' ? '7 gun icinde tam iade -- risksiz deneyin' : '7-day money-back guarantee -- try it risk-free'}
          </div>

          {/* FAQ */}
          <p className="text-sm font-bold text-gray-700 mb-3">{t('pricing.faq')}</p>
          <div className="flex flex-col gap-2 mb-6">
            {FAQ_KEYS.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button type="button" className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{t(item.q)}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-gray-500 leading-relaxed">{t(item.a)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          {!user && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">{t('pricing.signUpCta')}</p>
              <button type="button" className="min-h-[48px] px-6 bg-orange-500 text-white text-sm font-bold rounded-3xl" onClick={() => navigate('/login', { state: { from: '/pricing' } })}>
                {t('pricing.createFreeAccount')}
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
