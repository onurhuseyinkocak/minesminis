import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { updateDailyStreak } from '../../services/streakService.js';

const router = Router();
router.use(requireAuth);

/**
 * Calculate new level from XP (10 XP per correct answer, 100 XP per level, cap 50)
 */
function calcLevel(xp) {
  return Math.min(Math.floor(xp / 100) + 1, 50);
}

// POST /api/progress/game-complete
router.post('/game-complete', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const { game_type, score, total_possible, time_taken, accuracy } = req.body;

    // Validate
    if (!game_type || typeof game_type !== 'string') {
      return res.status(400).json({ error: 'game_type is required (string)' });
    }
    if (typeof score !== 'number' || score < 0 || score > 999) {
      return res.status(400).json({ error: 'score must be a number 0-999' });
    }
    if (typeof total_possible !== 'number' || total_possible < 1 || total_possible > 999) {
      return res.status(400).json({ error: 'total_possible must be a number 1-999' });
    }

    // Server-side XP calculation — NEVER trust client
    const calculated_xp = Math.min(score, total_possible) * 10;

    // 1. Insert game_scores
    await supabaseAdmin.from('game_scores').insert({
      user_id: uid,
      game_id: game_type,
      score,
      time_taken: time_taken || null,
      accuracy: accuracy || null,
    });

    // 2. Insert user_activities
    await supabaseAdmin.from('user_activities').insert({
      user_id: uid,
      activity_type: 'game',
      activity_name: game_type,
      xp_earned: calculated_xp,
      metadata: { score, total_possible },
    });

    // 3. Fetch current user XP
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('xp, points, level, settings')
      .eq('id', uid)
      .single();

    const newXp = (user?.xp || 0) + calculated_xp;
    const newPoints = (user?.points || 0) + calculated_xp;
    const newLevel = calcLevel(newXp);
    const levelChanged = newLevel !== (user?.level || 1);

    // Update games_played in settings JSONB
    const settings = user?.settings || {};
    settings.games_played = (settings.games_played || 0) + 1;

    // 4. Update users table
    await supabaseAdmin
      .from('users')
      .update({ xp: newXp, points: newPoints, level: newLevel, settings })
      .eq('id', uid);

    // 5. Update profiles table
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('xp, games_played')
      .eq('id', uid)
      .maybeSingle();

    await supabaseAdmin
      .from('profiles')
      .update({
        xp: (profile?.xp || 0) + calculated_xp,
        games_played: (profile?.games_played || 0) + 1,
        level: newLevel,
      })
      .eq('id', uid);

    // 6. Update streak
    const streakResult = await updateDailyStreak(uid, supabaseAdmin);

    // 7. Check level up already handled above
    console.log('[API] Game complete:', uid, game_type, 'xp:', calculated_xp);

    res.json({
      success: true,
      xp_earned: calculated_xp,
      new_xp: newXp,
      new_level: newLevel,
      level_changed: levelChanged,
      streak_updated: streakResult.streak_updated,
    });
  } catch (err) {
    console.error('[API] POST /progress/game-complete error:', err.message);
    res.status(500).json({ error: 'Failed to record game completion' });
  }
});

// POST /api/progress/lesson-complete
router.post('/lesson-complete', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const { lesson_id, score, time_taken } = req.body;

    if (!lesson_id || typeof lesson_id !== 'string') {
      return res.status(400).json({ error: 'lesson_id is required (string)' });
    }

    const xp_earned = 15;
    const now = new Date().toISOString();

    // Insert user_progress
    await supabaseAdmin.from('user_progress').insert({
      user_id: uid,
      challenge_id: lesson_id,
      status: 'completed',
      score: score || null,
      completed_at: now,
    });

    // Insert user_activities
    await supabaseAdmin.from('user_activities').insert({
      user_id: uid,
      activity_type: 'lesson',
      activity_name: lesson_id,
      xp_earned,
      metadata: { score, time_taken },
    });

    // Fetch & update XP
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('xp, level')
      .eq('id', uid)
      .single();

    const newXp = (user?.xp || 0) + xp_earned;
    const newLevel = calcLevel(newXp);

    await supabaseAdmin
      .from('users')
      .update({ xp: newXp, level: newLevel, points: newXp })
      .eq('id', uid);

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('xp')
      .eq('id', uid)
      .maybeSingle();

    await supabaseAdmin
      .from('profiles')
      .update({ xp: (profile?.xp || 0) + xp_earned, level: newLevel })
      .eq('id', uid);

    // Streak
    await updateDailyStreak(uid, supabaseAdmin);

    console.log('[API] Lesson complete:', uid, lesson_id);

    res.json({
      success: true,
      xp_earned,
      new_xp: newXp,
      new_level: newLevel,
    });
  } catch (err) {
    console.error('[API] POST /progress/lesson-complete error:', err.message);
    res.status(500).json({ error: 'Failed to record lesson completion' });
  }
});

// GET /api/progress/overview
router.get('/overview', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;

    const [userResult, profileResult, activitiesResult] = await Promise.all([
      supabaseAdmin
        .from('users')
        .select('xp, level, streak_days, badges, points')
        .eq('id', uid)
        .maybeSingle(),
      supabaseAdmin
        .from('profiles')
        .select('games_played, words_learned, videos_watched, worksheets_completed')
        .eq('id', uid)
        .maybeSingle(),
      supabaseAdmin
        .from('user_activities')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    const user = userResult.data || {};
    const profile = profileResult.data || {};

    res.json({
      xp: user.xp || 0,
      level: user.level || 1,
      streak_days: user.streak_days || 0,
      badges: user.badges || [],
      points: user.points || 0,
      stats: {
        games_played: profile.games_played || 0,
        words_learned: profile.words_learned || 0,
        videos_watched: profile.videos_watched || 0,
        worksheets_completed: profile.worksheets_completed || 0,
      },
      recent_activities: activitiesResult.data || [],
    });
  } catch (err) {
    console.error('[API] GET /progress/overview error:', err.message);
    res.status(500).json({ error: 'Failed to fetch progress overview' });
  }
});

export default router;
