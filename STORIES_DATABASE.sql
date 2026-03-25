-- ==========================================================================
-- STORIES FEATURE — Database Migration
-- Run in Supabase Dashboard > SQL Editor
-- ==========================================================================

-- ── stories table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stories (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  title_tr     text NOT NULL DEFAULT '',
  summary      text NOT NULL DEFAULT '',
  summary_tr   text NOT NULL DEFAULT '',
  cover_scene  text NOT NULL DEFAULT 'forest-clearing',
  target_age   integer[] NOT NULL DEFAULT '{4,8}',
  published    boolean NOT NULL DEFAULT false,
  characters   text[] NOT NULL DEFAULT '{}',
  location     text NOT NULL DEFAULT '',
  theme        text NOT NULL DEFAULT '',
  moral        text NOT NULL DEFAULT '',
  moral_tr     text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── story_scenes table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.story_scenes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id      uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  scene_order   integer NOT NULL DEFAULT 1,
  text          text NOT NULL DEFAULT '',
  text_tr       text NOT NULL DEFAULT '',
  location      text NOT NULL DEFAULT '',
  characters    text[] NOT NULL DEFAULT '{}',
  mood          text NOT NULL DEFAULT 'neutral',
  camera_angle  text NOT NULL DEFAULT 'wide',
  sound_effect  text,
  animation_cue text,
  vocabulary    jsonb NOT NULL DEFAULT '[]',
  choices       jsonb NOT NULL DEFAULT '[]',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_stories_published ON public.stories(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_scenes_story ON public.story_scenes(story_id, scene_order);

-- ── RLS: Public can read published stories ─────────────────────────────────
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_scenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stories_public_read" ON public.stories;
CREATE POLICY "stories_public_read" ON public.stories
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "story_scenes_public_read" ON public.story_scenes;
CREATE POLICY "story_scenes_public_read" ON public.story_scenes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories s
      WHERE s.id = story_scenes.story_id AND s.published = true
    )
  );

-- ── Service role bypass (admin API uses service role key) ──────────────────
-- No need to add service-role policies — service_role bypasses RLS by default.
