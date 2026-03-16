// ============================================================
// Lemon Squeezy Billing Routes
// ============================================================

import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// ── Config ───────────────────────────────────────────────────────────────────

const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';
const LS_API_KEY = () => process.env.LEMONSQUEEZY_API_KEY || '';
const LS_STORE_ID = () => process.env.LEMONSQUEEZY_STORE_ID || '';
const LS_WEBHOOK_SECRET = () => process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function lsApiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${LS_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${LS_API_KEY()}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Lemon Squeezy API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * Get or create admin Supabase client (lazy, same pattern as server.js)
 */
let _supabase = null;
async function getSupabase() {
  if (_supabase) return _supabase;
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  _supabase = createClient(url, key);
  return _supabase;
}

/**
 * Map Lemon Squeezy variant ID to plan name.
 * Falls back to 'premium' if variant is unknown.
 */
function variantToPlan(variantId) {
  const map = {};
  const envPrefixes = [
    ['VITE_LS_PREMIUM_MONTHLY', 'premium'],
    ['VITE_LS_PREMIUM_YEARLY', 'premium'],
    ['VITE_LS_FAMILY_MONTHLY', 'family'],
    ['VITE_LS_FAMILY_YEARLY', 'family'],
    ['VITE_LS_CLASSROOM_MONTHLY', 'classroom'],
    ['VITE_LS_CLASSROOM_YEARLY', 'classroom'],
  ];
  for (const [env, plan] of envPrefixes) {
    const id = process.env[env];
    if (id) map[id] = plan;
  }
  return map[String(variantId)] || 'premium';
}

// ── Auth middleware (verify Firebase token) ──────────────────────────────────

async function requireAuth(req, res, next) {
  const raw = req.headers.authorization;
  const token = raw && raw.startsWith('Bearer ') ? raw.slice(7).trim() : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { verifyIdToken, isFirebaseAdminReady } = await import('../firebaseAdmin.js');
    if (!isFirebaseAdminReady()) {
      return res.status(503).json({ error: 'Auth not configured' });
    }
    const decoded = await verifyIdToken(token);
    if (!decoded || !decoded.uid) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = decoded.uid;
    next();
  } catch (err) {
    console.error('Billing auth error:', err);
    return res.status(403).json({ error: 'Authentication failed' });
  }
}

// ============================================================
// POST /checkout — Create a Lemon Squeezy checkout
// ============================================================

router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const { variantId, email, name } = req.body;
    const userId = req.userId;

    if (!variantId) {
      return res.status(400).json({ error: 'variantId is required' });
    }
    if (!LS_API_KEY() || !LS_STORE_ID()) {
      return res.status(503).json({ error: 'Billing not configured' });
    }

    const successUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/pricing?status=success';
    const cancelUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/pricing?status=cancelled';

    const payload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_options: {
            embed: false,
            media: false,
            button_color: '#2563eb',
          },
          checkout_data: {
            email: email || undefined,
            name: name || undefined,
            custom: {
              user_id: userId,
            },
          },
          product_options: {
            redirect_url: successUrl,
            receipt_link_url: successUrl,
            enabled_variants: [parseInt(variantId, 10)],
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: LS_STORE_ID(),
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: String(variantId),
            },
          },
        },
      },
    };

    const result = await lsApiFetch('/checkouts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const checkoutUrl = result.data?.attributes?.url;
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned');
    }

    console.log(`[Billing] Checkout created for user ${userId}, variant ${variantId}`);
    res.json({ url: checkoutUrl });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

// ============================================================
// POST /portal — Get customer portal URL
// ============================================================

router.post('/portal', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    if (!LS_API_KEY()) {
      return res.status(503).json({ error: 'Billing not configured' });
    }

    // Look up the customer's Lemon Squeezy customer ID from Supabase
    const sb = await getSupabase();
    if (!sb) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { data: userData, error: userError } = await sb
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;

    const customerId = userData?.settings?.subscription?.lsCustomerId;
    if (!customerId) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    // Fetch customer from Lemon Squeezy to get portal URL
    const customer = await lsApiFetch(`/customers/${customerId}`);
    const portalUrl = customer.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      return res.status(404).json({ error: 'Portal URL not available' });
    }

    console.log(`[Billing] Portal URL requested for user ${userId}`);
    res.json({ url: portalUrl });
  } catch (err) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to get portal URL' });
  }
});

// ============================================================
// GET /status/:userId — Check subscription status
// ============================================================

router.get('/status/:userId', requireAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Security: users can only check their own status
    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const sb = await getSupabase();
    if (!sb) {
      return res.json({ plan: 'free', status: 'none', expiresAt: null });
    }

    const { data: userData, error: userError } = await sb
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;

    const sub = userData?.settings?.subscription;
    if (!sub || !sub.status || sub.status === 'none') {
      return res.json({ plan: 'free', status: 'none', expiresAt: null });
    }

    // Check if subscription has expired
    if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
      // Update status in DB
      const updatedSettings = {
        ...userData.settings,
        subscription: { ...sub, status: 'expired' },
      };
      await sb.from('users').update({ settings: updatedSettings }).eq('id', userId);
      return res.json({ plan: sub.plan || 'free', status: 'expired', expiresAt: sub.expiresAt });
    }

    res.json({
      plan: sub.plan || 'free',
      status: sub.status || 'none',
      expiresAt: sub.expiresAt || null,
    });
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

// ============================================================
// POST /webhook — Handle Lemon Squeezy webhooks
// ============================================================

router.post('/webhook', async (req, res) => {
  try {
    const secret = LS_WEBHOOK_SECRET();
    if (!secret) {
      console.error('[Billing Webhook] LEMONSQUEEZY_WEBHOOK_SECRET not set');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    // ── Verify signature ─────────────────────────────────────────────────────
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-signature'] || '';
    const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature.toString()))) {
      console.warn('[Billing Webhook] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // ── Parse event ──────────────────────────────────────────────────────────
    const event = req.body;
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data || {};
    const userId = customData.user_id;
    const attrs = event.data?.attributes || {};

    console.log(`[Billing Webhook] Event: ${eventName}, User: ${userId}`);

    if (!userId) {
      console.warn('[Billing Webhook] No user_id in custom_data');
      return res.json({ received: true });
    }

    const sb = await getSupabase();
    if (!sb) {
      console.error('[Billing Webhook] Supabase not configured');
      return res.status(503).json({ error: 'Database not configured' });
    }

    // ── Get current user settings ────────────────────────────────────────────
    const { data: userData, error: fetchError } = await sb
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const currentSettings = userData?.settings || {};
    const variantId = attrs.variant_id || attrs.first_subscription_item?.variant_id;
    const plan = variantToPlan(variantId);

    // ── Build subscription data ──────────────────────────────────────────────
    let subscriptionUpdate = currentSettings.subscription || {};

    switch (eventName) {
      case 'subscription_created':
        subscriptionUpdate = {
          plan,
          status: 'active',
          lsSubscriptionId: String(event.data?.id || ''),
          lsCustomerId: String(attrs.customer_id || ''),
          variantId: String(variantId || ''),
          expiresAt: attrs.renews_at || attrs.ends_at || null,
          createdAt: new Date().toISOString(),
        };
        break;

      case 'subscription_updated':
        subscriptionUpdate = {
          ...subscriptionUpdate,
          plan,
          status: attrs.status === 'active' ? 'active'
            : attrs.status === 'cancelled' ? 'cancelled'
            : attrs.status === 'expired' ? 'expired'
            : subscriptionUpdate.status || 'active',
          variantId: String(variantId || subscriptionUpdate.variantId || ''),
          expiresAt: attrs.renews_at || attrs.ends_at || subscriptionUpdate.expiresAt || null,
          updatedAt: new Date().toISOString(),
        };
        break;

      case 'subscription_cancelled':
        subscriptionUpdate = {
          ...subscriptionUpdate,
          status: 'cancelled',
          expiresAt: attrs.ends_at || subscriptionUpdate.expiresAt || null,
          cancelledAt: new Date().toISOString(),
        };
        break;

      case 'subscription_expired':
        subscriptionUpdate = {
          ...subscriptionUpdate,
          status: 'expired',
          expiredAt: new Date().toISOString(),
        };
        break;

      default:
        console.log(`[Billing Webhook] Unhandled event: ${eventName}`);
        return res.json({ received: true });
    }

    // ── Save to Supabase ─────────────────────────────────────────────────────
    const updatedSettings = {
      ...currentSettings,
      subscription: subscriptionUpdate,
    };

    const { error: updateError } = await sb
      .from('users')
      .update({ settings: updatedSettings })
      .eq('id', userId);

    if (updateError) throw updateError;

    console.log(`[Billing Webhook] Updated user ${userId}: ${eventName} -> plan=${subscriptionUpdate.plan}, status=${subscriptionUpdate.status}`);
    res.json({ received: true });
  } catch (err) {
    console.error('[Billing Webhook] Error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
