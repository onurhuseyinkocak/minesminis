// ============================================================
// Payment Routes — Stripe + Iyzico
// ============================================================

import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// ── Lazy Supabase client ────────────────────────────────────────────────────

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

// ── Lazy Stripe client ──────────────────────────────────────────────────────

let _stripe = null;
async function getStripe() {
  if (_stripe) return _stripe;
  const key = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!key) return null;
  const Stripe = (await import('stripe')).default;
  _stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' });
  return _stripe;
}

// ── Lazy Iyzico client ──────────────────────────────────────────────────────

let _iyzipay = null;
async function getIyzipay() {
  if (_iyzipay) return _iyzipay;
  const apiKey = (process.env.IYZICO_API_KEY || '').trim();
  const secretKey = (process.env.IYZICO_SECRET_KEY || '').trim();
  const baseUrl = (process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com').trim();
  if (!apiKey || !secretKey) return null;
  const Iyzipay = (await import('iyzipay')).default;
  _iyzipay = new Iyzipay({ apiKey, secretKey, uri: baseUrl });
  return _iyzipay;
}

// ── Auth middleware ─────────────────────────────────────────────────────────

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
    console.error('[Payment] Auth error:', err);
    return res.status(403).json({ error: 'Authentication failed' });
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const FRONTEND_URL = () => process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Plan ID to duration mapping (months).
 */
const PLAN_DURATIONS = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
  lifetime: 1200, // 100 years
};

/**
 * Update subscription data in Supabase.
 * - Inserts into user_subscriptions table
 * - Updates profiles.is_premium + profiles.premium_until
 * - Updates users.settings subscription info
 */
async function updateSubscription(userId, subData) {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  const now = new Date();
  const planId = subData.plan || 'monthly';
  const durationMonths = PLAN_DURATIONS[planId] || 1;
  const endDate = subData.expiresAt
    ? new Date(subData.expiresAt)
    : new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);

  // 1) Insert into user_subscriptions table
  if (subData.status === 'active') {
    const { error: insertErr } = await sb.from('user_subscriptions').insert({
      user_id: userId,
      plan_id: planId,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
      payment_method: subData.provider || 'stripe',
      payment_id: subData.stripeSubscriptionId || subData.iyzicoRef || null,
      amount_paid: subData.amountPaid || null,
      currency: subData.currency || 'TRY',
      auto_renew: true,
    });
    if (insertErr) {
      console.error('[Payment] user_subscriptions insert error:', insertErr.message);
    }
  }

  // If canceling, update existing active subscriptions
  if (subData.status === 'canceled' || subData.status === 'cancelled') {
    await sb.from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: now.toISOString(),
        cancellation_reason: 'user_cancelled',
        auto_renew: false,
      })
      .eq('user_id', userId)
      .eq('status', 'active');
  }

  // 2) Update profiles table: is_premium + premium_until
  const isPremiumNow = subData.status === 'active';
  try {
    const { data: profile } = await sb.from('profiles').select('id').eq('id', userId).maybeSingle();
    if (profile) {
      await sb.from('profiles').update({
        is_premium: isPremiumNow,
        premium_until: isPremiumNow ? endDate.toISOString() : null,
        updated_at: now.toISOString(),
      }).eq('id', userId);
    }
  } catch {
    // profiles row may not exist — ignore
  }

  // 3) Update users.settings with subscription info
  try {
    const { data: userData } = await sb.from('users').select('settings').eq('id', userId).maybeSingle();
    const currentSettings = userData?.settings || {};
    await sb.from('users').update({
      settings: {
        ...currentSettings,
        subscription_plan: planId,
        subscription_status: subData.status || 'active',
        subscription: {
          ...(currentSettings.subscription || {}),
          ...subData,
          updatedAt: now.toISOString(),
        },
      },
    }).eq('id', userId);
  } catch {
    // Silent — settings update is non-critical
  }

  console.log(`[Payment] Subscription updated for user ${userId}: plan=${planId}, status=${subData.status}`);
}

// ============================================================
// STRIPE ROUTES
// ============================================================

/**
 * POST /stripe/create-checkout
 * Creates a Stripe Checkout Session and returns the URL.
 */
router.post('/stripe/create-checkout', requireAuth, async (req, res) => {
  try {
    const { priceId, email, plan } = req.body;
    const userId = req.userId;

    if (!priceId || typeof priceId !== 'string') {
      return res.status(400).json({ error: 'priceId is required' });
    }
    if (!plan || typeof plan !== 'string') {
      return res.status(400).json({ error: 'plan is required' });
    }

    const stripe = await getStripe();
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe not configured' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL()}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL()}/pricing?status=cancelled`,
      customer_email: email || undefined,
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },
    });

    console.log(`[Payment] Stripe checkout created for user ${userId}, plan=${plan}`);
    res.json({ url: session.url });
  } catch (err) {
    console.error('[Payment] Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /stripe/webhook
 * Handles Stripe webhook events.
 * NOTE: This route needs raw body — configure express.raw() in server.js for this path.
 */
router.post('/stripe/webhook', async (req, res) => {
  const stripe = await getStripe();
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

  if (!webhookSecret) {
    console.error('[Payment] STRIPE_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    // req.body should be raw buffer for Stripe signature verification
    const rawBody = typeof req.body === 'string' ? req.body : (Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body));
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[Payment] Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  console.log(`[Payment] Stripe webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || 'premium';

        if (!userId) {
          console.warn('[Payment] No userId in session metadata');
          break;
        }

        const subscription = session.subscription
          ? await stripe.subscriptions.retrieve(session.subscription)
          : null;

        await updateSubscription(userId, {
          plan,
          status: 'active',
          provider: 'stripe',
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          expiresAt: subscription?.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          createdAt: new Date().toISOString(),
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const statusMap = {
          active: 'active',
          trialing: 'trialing',
          past_due: 'past_due',
          canceled: 'canceled',
          unpaid: 'past_due',
        };

        await updateSubscription(userId, {
          status: statusMap[subscription.status] || subscription.status,
          expiresAt: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await updateSubscription(userId, {
          plan: 'free',
          status: 'canceled',
          expiresAt: null,
          canceledAt: new Date().toISOString(),
        });
        break;
      }

      default:
        console.log(`[Payment] Unhandled Stripe event: ${event.type}`);
    }
  } catch (err) {
    console.error(`[Payment] Error processing Stripe webhook ${event.type}:`, err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
});

// ============================================================
// IYZICO ROUTES
// ============================================================

/**
 * POST /iyzico/initialize
 * Initializes an Iyzico payment form for Turkish users.
 */
router.post('/iyzico/initialize', requireAuth, async (req, res) => {
  try {
    const { price, userId: bodyUserId, email, plan, buyerName, buyerSurname, buyerPhone, buyerCity, buyerCountry, buyerAddress, buyerIdentityNumber } = req.body;
    const userId = req.userId;

    if (!price || !plan) {
      return res.status(400).json({ error: 'price and plan are required' });
    }

    const iyzipay = await getIyzipay();
    if (!iyzipay) {
      return res.status(503).json({ error: 'Iyzico not configured' });
    }

    const conversationId = `mm_${userId}_${Date.now()}`;
    const basketId = `basket_${userId}_${plan}`;

    const request = {
      locale: 'tr',
      conversationId,
      price: String(price),
      paidPrice: String(price),
      currency: 'TRY',
      basketId,
      paymentGroup: 'SUBSCRIPTION',
      callbackUrl: `${FRONTEND_URL()}/api/payment/iyzico/callback`,
      enabledInstallments: [1],
      buyer: {
        id: userId,
        name: buyerName || 'Kullanici',
        surname: buyerSurname || 'MinesMinis',
        gsmNumber: buyerPhone || '+905000000000',
        email: email || 'user@minesminis.com',
        identityNumber: buyerIdentityNumber || '11111111111',
        registrationAddress: buyerAddress || 'Istanbul, Turkey',
        ip: req.ip || '127.0.0.1',
        city: buyerCity || 'Istanbul',
        country: buyerCountry || 'Turkey',
      },
      shippingAddress: {
        contactName: `${buyerName || 'Kullanici'} ${buyerSurname || 'MinesMinis'}`,
        city: buyerCity || 'Istanbul',
        country: buyerCountry || 'Turkey',
        address: buyerAddress || 'Istanbul, Turkey',
      },
      billingAddress: {
        contactName: `${buyerName || 'Kullanici'} ${buyerSurname || 'MinesMinis'}`,
        city: buyerCity || 'Istanbul',
        country: buyerCountry || 'Turkey',
        address: buyerAddress || 'Istanbul, Turkey',
      },
      basketItems: [
        {
          id: `plan_${plan}`,
          name: `MinesMinis ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          category1: 'Education',
          category2: 'Subscription',
          itemType: 'VIRTUAL',
          price: String(price),
        },
      ],
    };

    // Store plan info for callback
    const sb = await getSupabase();
    if (sb) {
      const { data: userData } = await sb
        .from('users')
        .select('settings')
        .eq('id', userId)
        .maybeSingle();

      const currentSettings = userData?.settings || {};
      await sb
        .from('users')
        .update({
          settings: {
            ...currentSettings,
            pendingPayment: {
              conversationId,
              plan,
              price,
              provider: 'iyzico',
              createdAt: new Date().toISOString(),
            },
          },
        })
        .eq('id', userId);
    }

    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (result.status !== 'success') {
      console.error('[Payment] Iyzico init failed:', result.errorMessage);
      return res.status(400).json({
        error: result.errorMessage || 'Iyzico initialization failed',
      });
    }

    console.log(`[Payment] Iyzico checkout initialized for user ${userId}, plan=${plan}`);
    res.json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
      tokenExpireTime: result.tokenExpireTime,
    });
  } catch (err) {
    console.error('[Payment] Iyzico init error:', err);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

/**
 * POST /iyzico/callback
 * Handles Iyzico 3DS callback after payment completion.
 */
router.post('/iyzico/callback', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.redirect(`${FRONTEND_URL()}/pricing?status=cancelled`);
    }

    const iyzipay = await getIyzipay();
    if (!iyzipay) {
      return res.redirect(`${FRONTEND_URL()}/pricing?status=error`);
    }

    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
      console.warn('[Payment] Iyzico payment failed:', result.errorMessage || result.paymentStatus);
      return res.redirect(`${FRONTEND_URL()}/pricing?status=cancelled`);
    }

    // Find user by conversationId pattern (mm_{userId}_{timestamp})
    const conversationId = result.conversationId || '';
    const userIdMatch = conversationId.match(/^mm_(.+?)_\d+$/);

    if (!userIdMatch) {
      console.error('[Payment] Could not extract userId from conversationId:', conversationId);
      return res.redirect(`${FRONTEND_URL()}/pricing?status=success`);
    }

    const userId = userIdMatch[1];
    const sb = await getSupabase();

    if (!sb) {
      return res.redirect(`${FRONTEND_URL()}/pricing?status=success`);
    }

    // Get pending payment info
    const { data: userData } = await sb
      .from('users')
      .select('settings')
      .eq('id', userId)
      .maybeSingle();

    const pending = userData?.settings?.pendingPayment;
    const plan = pending?.plan || 'premium';

    // Calculate expiry (30 days for monthly, 365 for yearly)
    const priceNum = parseFloat(pending?.price || result.price || '0');
    const isYearly = priceNum > 500; // Rough heuristic: yearly plans > 500 TL
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (isYearly ? 365 : 30));

    await updateSubscription(userId, {
      plan,
      status: 'active',
      provider: 'iyzico',
      iyzicoRef: result.paymentId || result.token,
      expiresAt: expiryDate.toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Clear pending payment
    const currentSettings = userData?.settings || {};
    delete currentSettings.pendingPayment;
    await sb.from('users').update({ settings: currentSettings }).eq('id', userId);

    console.log(`[Payment] Iyzico payment successful for user ${userId}, plan=${plan}`);
    return res.redirect(`${FRONTEND_URL()}/pricing?status=success`);
  } catch (err) {
    console.error('[Payment] Iyzico callback error:', err);
    return res.redirect(`${FRONTEND_URL()}/pricing?status=error`);
  }
});

export default router;
