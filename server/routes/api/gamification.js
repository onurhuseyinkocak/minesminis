import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';

const router = Router();
router.use(requireAuth);

// GET /api/gamification/summary
router.get('/summary', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const today = new Date().toISOString().split('T')[0];

    const [userResult, profileResult, streakResult] = await Promise.all([
      supabaseAdmin.from('users').select('xp, level, streak_days, badges, points').eq('id', uid).maybeSingle(),
      supabaseAdmin.from('profiles').select('is_premium, words_learned, games_played').eq('id', uid).maybeSingle(),
      supabaseAdmin.from('daily_streaks').select('id').eq('user_id', uid).eq('streak_date', today).maybeSingle(),
    ]);

    const user = userResult.data || {};
    const profile = profileResult.data || {};

    res.json({
      xp: user.xp || 0,
      level: user.level || 1,
      streak_days: user.streak_days || 0,
      badges: user.badges || [],
      points: user.points || 0,
      is_premium: profile.is_premium || false,
      words_learned: profile.words_learned || 0,
      games_played: profile.games_played || 0,
      today_active: !!streakResult.data,
    });
  } catch (err) {
    console.error('[API] GET /gamification/summary error:', err.message);
    res.status(500).json({ error: 'Failed to fetch gamification summary' });
  }
});

export default router;
