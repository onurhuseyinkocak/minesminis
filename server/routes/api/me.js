import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';

const router = Router();
router.use(requireAuth);

// GET /api/me — fetch current user + profile
router.get('/', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;

    const [userResult, profileResult] = await Promise.all([
      supabaseAdmin.from('users').select('*').eq('id', uid).maybeSingle(),
      supabaseAdmin.from('profiles').select('*').eq('id', uid).maybeSingle(),
    ]);

    if (userResult.error) throw userResult.error;
    if (profileResult.error) throw profileResult.error;

    if (!userResult.data) {
      return res.json({ user: null, profile: null, needs_bootstrap: true });
    }

    res.json({ user: userResult.data, profile: profileResult.data });
  } catch (err) {
    console.error('[API] GET /me error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// POST /api/me/bootstrap — initial user setup
router.post('/bootstrap', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid, email } = req.user;
    const { display_name, role, grade, avatar_emoji, mascotId } = req.body;

    if (!display_name || typeof display_name !== 'string' || display_name.trim().length === 0) {
      return res.status(400).json({ error: 'display_name is required' });
    }
    if (display_name.length > 30) {
      return res.status(400).json({ error: 'display_name max 30 characters' });
    }

    const userRole = ['student', 'parent', 'teacher'].includes(role) ? role : 'student';
    const now = new Date().toISOString();

    // Upsert users table
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, xp, level, points, streak_days, badges')
      .eq('id', uid)
      .maybeSingle();

    let userData;
    if (existingUser) {
      // UPDATE — preserve gamification values
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          email,
          display_name: display_name.trim(),
          role: userRole,
          grade: grade || null,
          last_login: now,
          is_online: true,
          settings: {
            setup_completed: true,
            avatar_emoji: avatar_emoji || null,
            mascotId: mascotId || 'mimi_cat',
          },
        })
        .eq('id', uid)
        .select()
        .single();
      if (error) throw error;
      userData = data;
    } else {
      // INSERT — fresh user
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          id: uid,
          email,
          display_name: display_name.trim(),
          role: userRole,
          grade: grade || null,
          last_login: now,
          is_online: true,
          points: 0,
          xp: 0,
          badges: [],
          streak_days: 0,
          level: 1,
          settings: {
            setup_completed: true,
            avatar_emoji: avatar_emoji || null,
            mascotId: mascotId || 'mimi_cat',
          },
        })
        .select()
        .single();
      if (error) throw error;
      userData = data;
    }

    // Upsert profiles table
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, xp, level, streak_days, badges, words_learned, games_played')
      .eq('id', uid)
      .maybeSingle();

    let profileData;
    if (existingProfile) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          email,
          display_name: display_name.trim(),
          role: userRole,
          grade: grade || null,
          avatar_emoji: avatar_emoji || null,
          onboarding_completed: true,
        })
        .eq('id', uid)
        .select()
        .single();
      if (error) throw error;
      profileData = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: uid,
          email,
          display_name: display_name.trim(),
          role: userRole,
          grade: grade || null,
          avatar_emoji: avatar_emoji || null,
          onboarding_completed: true,
          xp: 0,
          level: 1,
          streak_days: 0,
          badges: [],
          words_learned: 0,
          games_played: 0,
        })
        .select()
        .single();
      if (error) throw error;
      profileData = data;
    }

    console.log('[API] Bootstrap complete for', uid);
    res.json({ success: true, user: userData, profile: profileData });
  } catch (err) {
    console.error('[API] POST /me/bootstrap error:', err.message);
    res.status(500).json({ error: 'Failed to bootstrap user' });
  }
});

// PATCH /api/me/profile — partial profile update
router.patch('/profile', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const { display_name, grade, avatar_emoji, bio } = req.body;

    if (display_name !== undefined && (typeof display_name !== 'string' || display_name.length > 30)) {
      return res.status(400).json({ error: 'display_name max 30 characters' });
    }

    // Build update objects — only include provided fields
    const userUpdate = {};
    const profileUpdate = {};

    if (display_name !== undefined) {
      userUpdate.display_name = display_name.trim();
      profileUpdate.display_name = display_name.trim();
    }
    if (grade !== undefined) {
      userUpdate.grade = grade;
      profileUpdate.grade = grade;
    }
    if (avatar_emoji !== undefined) {
      profileUpdate.avatar_emoji = avatar_emoji;
    }
    if (bio !== undefined) {
      profileUpdate.bio = bio;
    }

    const promises = [];
    if (Object.keys(userUpdate).length > 0) {
      promises.push(
        supabaseAdmin.from('users').update(userUpdate).eq('id', uid)
      );
    }
    if (Object.keys(profileUpdate).length > 0) {
      promises.push(
        supabaseAdmin.from('profiles').update(profileUpdate).eq('id', uid)
      );
    }

    if (promises.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const results = await Promise.all(promises);
    for (const r of results) {
      if (r.error) throw r.error;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[API] PATCH /me/profile error:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
