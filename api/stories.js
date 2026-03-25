/**
 * PUBLIC STORIES API
 * GET /api/stories        — list published stories (summary)
 * GET /api/stories/:id    — full story with all scenes
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sb = getSupabase();
  if (!sb) return res.status(503).json({ error: 'Supabase not configured' });

  // ID can come from Vercel rewrite query param or from the URL path
  const storyId = (req.query && req.query.id) || null;

  try {
    if (storyId) {
      // Fetch single story with all scenes
      const { data: story, error: storyErr } = await sb
        .from('stories')
        .select('id, title, title_tr, summary, summary_tr, cover_scene, target_age, characters, location, theme, moral, moral_tr')
        .eq('id', storyId)
        .eq('published', true)
        .single();

      if (storyErr || !story) {
        return res.status(404).json({ error: 'Story not found' });
      }

      const { data: scenes, error: scenesErr } = await sb
        .from('story_scenes')
        .select('id, scene_order, text, text_tr, location, characters, mood, sound_effect, animation_cue, vocabulary, choices, camera_angle')
        .eq('story_id', storyId)
        .order('scene_order', { ascending: true });

      if (scenesErr) throw scenesErr;

      return res.status(200).json({ story: { ...story, scenes: scenes || [] } });
    } else {
      // Fetch list of published stories (no scenes — summary only)
      const { data: stories, error } = await sb
        .from('stories')
        .select('id, title, title_tr, summary, summary_tr, cover_scene, target_age, characters, location, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return res.status(200).json({ stories: stories || [] });
    }
  } catch (e) {
    console.error('Stories API error:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
