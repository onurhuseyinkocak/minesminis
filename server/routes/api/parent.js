import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';

const router = Router();
router.use(requireAuth);

/**
 * Verify parent owns the child (parent_children table).
 * Returns true if ownership confirmed, sends 403 and returns false otherwise.
 */
async function verifyParentOwnership(parentId, childId, res) {
  const { data, error } = await supabaseAdmin
    .from('parent_children')
    .select('id')
    .eq('parent_id', parentId)
    .eq('child_id', childId)
    .maybeSingle();

  if (error || !data) {
    res.status(403).json({ error: 'Access denied — not your child' });
    return false;
  }
  return true;
}

// GET /api/parent/children
router.get('/children', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;

    const { data: relations, error } = await supabaseAdmin
      .from('parent_children')
      .select('child_id')
      .eq('parent_id', uid);

    if (error) throw error;
    if (!relations || relations.length === 0) {
      return res.json({ children: [] });
    }

    const childIds = relations.map(r => r.child_id);

    const { data: children, error: childError } = await supabaseAdmin
      .from('users')
      .select('id, display_name, grade, xp, level, streak_days')
      .in('id', childIds);

    if (childError) throw childError;

    res.json({ children: children || [] });
  } catch (err) {
    console.error('[API] GET /parent/children error:', err.message);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

// GET /api/parent/children/:childId/progress
router.get('/children/:childId/progress', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const { childId } = req.params;

    if (!(await verifyParentOwnership(uid, childId, res))) return;

    const [userResult, profileResult] = await Promise.all([
      supabaseAdmin.from('users').select('*').eq('id', childId).maybeSingle(),
      supabaseAdmin.from('profiles').select('*').eq('id', childId).maybeSingle(),
    ]);

    res.json({
      user: userResult.data || null,
      profile: profileResult.data || null,
    });
  } catch (err) {
    console.error('[API] GET /parent/children/:childId/progress error:', err.message);
    res.status(500).json({ error: 'Failed to fetch child progress' });
  }
});

// GET /api/parent/children/:childId/activity
router.get('/children/:childId/activity', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Database not configured' });

    const { uid } = req.user;
    const { childId } = req.params;

    if (!(await verifyParentOwnership(uid, childId, res))) return;

    const { data: activities, error } = await supabaseAdmin
      .from('user_activities')
      .select('*')
      .eq('user_id', childId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json({ activities: activities || [] });
  } catch (err) {
    console.error('[API] GET /parent/children/:childId/activity error:', err.message);
    res.status(500).json({ error: 'Failed to fetch child activity' });
  }
});

export default router;
