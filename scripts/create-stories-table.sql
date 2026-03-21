-- ============================================================
-- CREATE STORIES TABLE
-- Stores AI-generated interactive stories for children
-- Run this in the Supabase SQL Editor or via db:migrate
-- ============================================================

CREATE TABLE IF NOT EXISTS public.stories (
  id          UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT          NOT NULL,
  title_tr    TEXT,
  summary     TEXT,
  summary_tr  TEXT,
  moral       TEXT,
  moral_tr    TEXT,
  cover_scene TEXT,
  target_age  INTEGER[]     DEFAULT '{3,10}',
  vocabulary  JSONB         DEFAULT '[]',
  scenes      JSONB         DEFAULT '[]',
  status      TEXT          DEFAULT 'draft'
                            CHECK (status IN ('draft', 'published', 'archived')),
  created_at  TIMESTAMPTZ   DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_stories_status     ON public.stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION public.update_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stories_updated_at ON public.stories;
CREATE TRIGGER trg_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stories_updated_at();

-- Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous users) can read published stories
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stories'
      AND policyname = 'Anyone can read published stories'
  ) THEN
    CREATE POLICY "Anyone can read published stories"
      ON public.stories
      FOR SELECT
      USING (status = 'published');
  END IF;
END $$;

-- Service role (used by the server with SUPABASE_SERVICE_ROLE_KEY) has full access
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stories'
      AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access"
      ON public.stories
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
