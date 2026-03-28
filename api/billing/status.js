/**
 * Billing Status API
 * GET /api/billing/status/:uid
 * Checks Supabase for active subscription.
 * Falls back to free plan if not found.
 */

import { createClient } from '@supabase/supabase-js';

let sb = null;
function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!sb) sb = createClient(url, key);
  return sb;
}

// Valid UUID v4 pattern
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const uid = req.query?.uid || (req.url?.split('/').pop());
  if (!uid) return res.status(400).json({ error: 'Missing uid' });

  const supabase = getSupabase();

  // ── 1. Check user_subscriptions (UUID users only) ──────────────────────────
  if (supabase && UUID_RE.test(uid)) {
    const { data: subs } = await supabase
      .from('user_subscriptions')
      .select('plan_id, end_date, status, payment_method')
      .eq('user_id', uid)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (subs && subs.length > 0) {
      const sub = subs[0];
      return res.status(200).json({
        status: 'active',
        plan: sub.plan_id || 'premium',
        active: true,
        expiresAt: sub.end_date || null,
        provider: sub.payment_method || null,
      });
    }

    // ── 2. Check profiles.is_premium (UUID users) ──────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, premium_until')
      .eq('id', uid)
      .maybeSingle();

    if (profile?.is_premium && profile?.premium_until) {
      const until = new Date(profile.premium_until);
      if (until > new Date()) {
        return res.status(200).json({
          status: 'active',
          plan: 'premium',
          active: true,
          expiresAt: profile.premium_until,
          provider: null,
        });
      }
    }
  }

  // ── 3. Check users.settings for Firebase UID users ────────────────────────
  if (supabase) {
    const { data: user } = await supabase
      .from('users')
      .select('settings')
      .eq('id', uid)
      .maybeSingle();

    if (user?.settings?.is_premium === true) {
      const until = user.settings.premium_until
        ? new Date(user.settings.premium_until)
        : null;

      if (!until || until > new Date()) {
        return res.status(200).json({
          status: 'active',
          plan: user.settings.premium_plan || 'premium',
          active: true,
          expiresAt: user.settings.premium_until || null,
          provider: user.settings.premium_provider || null,
        });
      }
    }
  }

  // ── Free plan fallback ─────────────────────────────────────────────────────
  return res.status(200).json({
    status: 'none',
    plan: 'free',
    active: false,
    expiresAt: null,
    features: {
      maxLessonsPerDay: 3,
      maxWordsPerSession: 10,
      unlimitedLessons: false,
    },
  });
}
