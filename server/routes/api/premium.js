import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';

const router = Router();
router.use(requireAuth);

// GET /api/premium/plans
router.get('/plans', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { data, error } = await supabaseAdmin
      .from('premium_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    res.json({ plans: data || [] });
  } catch (err) {
    console.error('[API] GET /premium/plans error:', err.message);
    res.status(500).json({ error: 'Failed to fetch premium plans' });
  }
});

// GET /api/premium/status
router.get('/status', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;

    const [profileResult, subscriptionResult] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('is_premium, premium_until')
        .eq('id', uid)
        .maybeSingle(),
      supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString())
        .maybeSingle(),
    ]);

    const profile = profileResult.data || {};

    res.json({
      is_premium: profile.is_premium || false,
      premium_until: profile.premium_until || null,
      active_subscription: subscriptionResult.data || null,
    });
  } catch (err) {
    console.error('[API] GET /premium/status error:', err.message);
    res.status(500).json({ error: 'Failed to fetch premium status' });
  }
});

export default router;
