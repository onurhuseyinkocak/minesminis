/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + usePremium */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getApiBase } from '../utils/apiBase';
import { errorLogger } from '../services/errorLogger';

// ── Types ────────────────────────────────────────────────────────────────────

type Plan = 'free' | 'premium' | 'family' | 'classroom';
type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'none';

interface PremiumContextType {
  isPremium: boolean;
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  expiresAt: string | null;
  isLoading: boolean;
  checkoutUrl: (planId: string) => Promise<string | null>;
  customerPortalUrl: () => Promise<string | null>;
  refreshSubscription: () => Promise<void>;
}

// ── Feature gates per plan ───────────────────────────────────────────────────

export const PLAN_LIMITS: Record<Plan, {
  worlds: number;
  lessons: number;
  mimiChatsPerDay: number;
  allGames: boolean;
  progressTracking: boolean;
  badges: boolean;
  maxChildren: number;
  maxStudents: number;
  parentDashboard: boolean;
  teacherDashboard: boolean;
  classroomMode: boolean;
  analytics: boolean;
}> = {
  free: {
    worlds: 1,
    lessons: 5,
    mimiChatsPerDay: 10,
    allGames: false,
    progressTracking: false,
    badges: false,
    maxChildren: 0,
    maxStudents: 0,
    parentDashboard: false,
    teacherDashboard: false,
    classroomMode: false,
    analytics: false,
  },
  premium: {
    worlds: 12,
    lessons: Infinity,
    mimiChatsPerDay: Infinity,
    allGames: true,
    progressTracking: true,
    badges: true,
    maxChildren: 0,
    maxStudents: 0,
    parentDashboard: false,
    teacherDashboard: false,
    classroomMode: false,
    analytics: false,
  },
  family: {
    worlds: 12,
    lessons: Infinity,
    mimiChatsPerDay: Infinity,
    allGames: true,
    progressTracking: true,
    badges: true,
    maxChildren: 4,
    maxStudents: 0,
    parentDashboard: true,
    teacherDashboard: false,
    classroomMode: false,
    analytics: false,
  },
  classroom: {
    worlds: 12,
    lessons: Infinity,
    mimiChatsPerDay: Infinity,
    allGames: true,
    progressTracking: true,
    badges: true,
    maxChildren: 0,
    maxStudents: 30,
    parentDashboard: false,
    teacherDashboard: true,
    classroomMode: true,
    analytics: true,
  },
};

// ── Cache helpers ────────────────────────────────────────────────────────────

const CACHE_KEY = 'mm_subscription';

interface CachedSub {
  plan: Plan;
  status: SubscriptionStatus;
  expiresAt: string | null;
  ts: number;
}

function readCache(): CachedSub | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedSub = JSON.parse(raw);
    // Cache valid for 5 minutes
    if (Date.now() - data.ts > 5 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(plan: Plan, status: SubscriptionStatus, expiresAt: string | null) {
  try {
    const data: CachedSub = { plan, status, expiresAt, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage full or disabled — ignore
  }
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

// ── Context ──────────────────────────────────────────────────────────────────

const PremiumContext = createContext<PremiumContextType | null>(null);

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const API = getApiBase();

  const [plan, setPlan] = useState<Plan>('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('none');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPremium = plan !== 'free' && subscriptionStatus === 'active';

  // ── Fetch subscription from backend ──────────────────────────────────────

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      setPlan('free');
      setSubscriptionStatus('none');
      setExpiresAt(null);
      clearCache();
      setIsLoading(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/billing/status/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch subscription');

      const data = await res.json();
      const p = (data.plan || 'free') as Plan;
      const s = (data.status || 'none') as SubscriptionStatus;
      const e = data.expiresAt || null;

      setPlan(p);
      setSubscriptionStatus(s);
      setExpiresAt(e);
      writeCache(p, s, e);
    } catch (err) {
      errorLogger.log({ severity: 'medium', message: 'Subscription check failed', component: 'PremiumContext', metadata: { error: String(err) } });
      // Fall back to cached data
      const cached = readCache();
      if (cached) {
        setPlan(cached.plan);
        setSubscriptionStatus(cached.status);
        setExpiresAt(cached.expiresAt);
      } else {
        setPlan('free');
        setSubscriptionStatus('none');
        setExpiresAt(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, API]);

  // ── Hydrate from cache first, then fetch fresh ───────────────────────────

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setPlan(cached.plan);
      setSubscriptionStatus(cached.status);
      setExpiresAt(cached.expiresAt);
    }
    refreshSubscription();
  }, [refreshSubscription]);

  // ── Create checkout URL ──────────────────────────────────────────────────

  const checkoutUrl = useCallback(async (planId: string): Promise<string | null> => {
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
      const res = await fetch(`${API}/api/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify({
          variantId: planId,
          userId: user.uid,
          email: user.email,
          name: user.displayName || '',
        }),
      });

      if (!res.ok) throw new Error('Checkout creation failed');

      const data = await res.json();
      return data.url || null;
    } catch (err) {
      errorLogger.log({ severity: 'high', message: 'Checkout error', component: 'PremiumContext', metadata: { error: String(err) } });
      return null;
    }
  }, [user, API]);

  // ── Customer portal URL ──────────────────────────────────────────────────

  const customerPortalUrl = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
      const res = await fetch(`${API}/api/billing/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (!res.ok) throw new Error('Portal URL fetch failed');

      const data = await res.json();
      return data.url || null;
    } catch (err) {
      errorLogger.log({ severity: 'high', message: 'Portal error', component: 'PremiumContext', metadata: { error: String(err) } });
      return null;
    }
  }, [user, API]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <PremiumContext.Provider
      value={useMemo(() => ({
        isPremium,
        plan,
        subscriptionStatus,
        expiresAt,
        isLoading,
        checkoutUrl,
        customerPortalUrl,
        refreshSubscription,
      }), [isPremium, plan, subscriptionStatus, expiresAt, isLoading, checkoutUrl, customerPortalUrl, refreshSubscription])}
    >
      {children}
    </PremiumContext.Provider>
  );
}
