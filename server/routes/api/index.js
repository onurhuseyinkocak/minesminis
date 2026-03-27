import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import meRoutes from './me.js';
import progressRoutes from './progress.js';
import gamificationRoutes from './gamification.js';
import parentRoutes from './parent.js';
import premiumRoutes from './premium.js';

const router = Router();

// Sub-routers
router.use('/me', meRoutes);
router.use('/progress', progressRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/parent', parentRoutes);
router.use('/premium', premiumRoutes);

// ---- Top-level /api/ routes ----

// POST /api/rewards/claim-daily
router.post('/rewards/claim-daily', requireAuth, async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const today = new Date().toISOString().split('T')[0];

    // Check last claim
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('last_daily_claim, xp')
      .eq('id', uid)
      .maybeSingle();

    if (profile?.last_daily_claim === today) {
      return res.json({ already_claimed: true });
    }

    const xp_bonus = 25;
    const newProfileXp = (profile?.xp || 0) + xp_bonus;

    // Update profiles
    await supabaseAdmin
      .from('profiles')
      .update({ last_daily_claim: today, xp: newProfileXp })
      .eq('id', uid);

    // Update users xp
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('xp, points')
      .eq('id', uid)
      .maybeSingle();

    const newUserXp = (user?.xp || 0) + xp_bonus;
    const newPoints = (user?.points || 0) + xp_bonus;
    const newLevel = Math.min(Math.floor(newUserXp / 100) + 1, 50);

    await supabaseAdmin
      .from('users')
      .update({ xp: newUserXp, points: newPoints, level: newLevel })
      .eq('id', uid);

    // Log activity
    await supabaseAdmin.from('user_activities').insert({
      user_id: uid,
      activity_type: 'daily_reward',
      activity_name: 'claim_daily',
      xp_earned: xp_bonus,
      metadata: { date: today },
    });

    console.log('[API] Daily reward claimed:', uid);

    res.json({
      success: true,
      xp_earned: xp_bonus,
      new_xp: newUserXp,
    });
  } catch (err) {
    console.error('[API] POST /rewards/claim-daily error:', err.message);
    res.status(500).json({ error: 'Failed to claim daily reward' });
  }
});

// GET /api/leaderboard
router.get('/leaderboard', requireAuth, async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, display_name, points, level, settings')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const leaderboard = (data || []).map((u, i) => ({
      rank: i + 1,
      uid: u.id,
      display_name: u.display_name,
      avatar_emoji: u.settings?.avatar_emoji || null,
      points: u.points || 0,
      level: u.level || 1,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error('[API] GET /leaderboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
