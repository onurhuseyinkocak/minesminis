/* eslint-disable react-refresh/only-export-components -- context file */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePremium, PLAN_LIMITS } from './PremiumContext';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { withRetry } from '../utils/retryUtils';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Subscription {
  plan: 'free' | 'premium' | 'family' | 'classroom';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'expired' | 'none';
  expiresAt: string | null;
  childrenAllowed: number;
  provider: 'stripe' | 'iyzico' | 'lemonsqueezy' | null;
}

interface SubscriptionContextType {
  subscription: Subscription;
  isPremium: () => boolean;
  isClassroom: () => boolean;
  canAddChild: () => boolean;
  maxLessonsPerDay: number;
  hasAllGames: boolean;
  hasProgressTracking: boolean;
  hasParentDashboard: boolean;
  hasTeacherDashboard: boolean;
  maxStudents: number;
  isLoading: boolean;
}

// ── Context ──────────────────────────────────────────────────────────────────

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function useSubscription(): SubscriptionContextType {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return ctx;
}

// ── Supabase direct check ────────────────────────────────────────────────────

interface SupabaseSub {
  planId: string | null;
  provider: 'stripe' | 'iyzico' | null;
  expiresAt: string | null;
  isActive: boolean;
}

async function fetchSubFromSupabase(userId: string): Promise<SupabaseSub | null> {
  try {
    // Run both queries in parallel — avoids waterfall when subscription table is empty
    const [{ data: subRows }, { data: profile }] = await Promise.all([
      withRetry(() =>
        supabase
          .from('user_subscriptions')
          .select('plan_id, payment_method, end_date')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
      ),
      withRetry(() =>
        supabase
          .from('profiles')
          .select('is_premium, premium_until')
          .eq('id', userId)
          .maybeSingle()
      ),
    ]);

    // Prefer user_subscriptions (primary source)
    if (subRows && subRows.length > 0) {
      const sub = subRows[0] as Record<string, unknown>;
      return {
        planId: (sub.plan_id as string) ?? null,
        provider: (sub.payment_method as 'stripe' | 'iyzico') ?? null,
        expiresAt: (sub.end_date as string) ?? null,
        isActive: true,
      };
    }

    // Fallback: profiles table
    if (profile) {
      const p = profile as Record<string, unknown>;
      const isPrem = p.is_premium === true;
      const premUntil = p.premium_until as string | null;
      if (isPrem && premUntil && new Date(premUntil) > new Date()) {
        return {
          planId: 'premium',
          provider: null,
          expiresAt: premUntil,
          isActive: true,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const {
    plan,
    subscriptionStatus,
    expiresAt,
    isPremium: premiumActive,
    isLoading,
  } = usePremium();

  // Direct Supabase fallback state
  const [supabaseSub, setSupabaseSub] = useState<SupabaseSub | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setSupabaseSub(null);
      return;
    }
    let cancelled = false;
    fetchSubFromSupabase(user.uid).then((sub) => {
      if (!cancelled) setSupabaseSub(sub);
    });
    return () => { cancelled = true; };
  }, [user?.uid]);

  const value = useMemo<SubscriptionContextType>(() => {
    // Determine effective premium status:
    // Backend API result (premiumActive) OR direct Supabase check
    const effectivePremium = premiumActive || (supabaseSub?.isActive === true);
    const effectivePlan = effectivePremium ? (plan !== 'free' ? plan : 'premium') : plan;
    const limits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free;

    const subscription: Subscription = {
      plan: effectivePlan,
      status: effectivePremium
        ? 'active'
        : subscriptionStatus === 'none' ? 'none'
        : subscriptionStatus === 'cancelled' ? 'canceled'
        : subscriptionStatus,
      expiresAt: expiresAt ?? supabaseSub?.expiresAt ?? null,
      childrenAllowed: limits.maxChildren,
      provider: supabaseSub?.provider ?? null,
    };

    return {
      subscription,
      isPremium: () => effectivePremium,
      isClassroom: () => effectivePlan === 'classroom' && effectivePremium,
      canAddChild: () => {
        if ((effectivePlan === 'family' || effectivePlan === 'premium') && effectivePremium) return limits.maxChildren > 0;
        return false;
      },
      maxLessonsPerDay: limits.lessons === Infinity ? Infinity : limits.lessons,
      hasAllGames: limits.allGames,
      hasProgressTracking: limits.progressTracking,
      hasParentDashboard: limits.parentDashboard,
      hasTeacherDashboard: limits.teacherDashboard,
      maxStudents: limits.maxStudents,
      isLoading,
    };
  }, [plan, subscriptionStatus, expiresAt, premiumActive, isLoading, supabaseSub]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
