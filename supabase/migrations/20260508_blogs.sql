-- Blog posts table for SEO content
CREATE TABLE IF NOT EXISTS mm_blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content_html text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  keywords text[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'teaching-english-to-kids',
  cover_url text,
  status text NOT NULL DEFAULT 'draft', -- draft, published, failed
  error_log text,
  reading_time_min int NOT NULL DEFAULT 5,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mm_blogs_slug ON mm_blogs(slug);
CREATE INDEX IF NOT EXISTS idx_mm_blogs_status ON mm_blogs(status);
CREATE INDEX IF NOT EXISTS idx_mm_blogs_category ON mm_blogs(category);
CREATE INDEX IF NOT EXISTS idx_mm_blogs_published_at ON mm_blogs(published_at DESC);

-- Blog generation log for tracking cron runs
CREATE TABLE IF NOT EXISTS mm_blog_gen_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  run_at timestamptz DEFAULT now(),
  blogs_generated int DEFAULT 0,
  blogs_failed int DEFAULT 0,
  error_message text,
  duration_ms int
);

-- RLS
ALTER TABLE mm_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_blog_gen_log ENABLE ROW LEVEL SECURITY;

-- Public read for published blogs
CREATE POLICY "Public read published blogs" ON mm_blogs
  FOR SELECT USING (status = 'published');

-- Authenticated full access
CREATE POLICY "Auth full access blogs" ON mm_blogs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth full access blog gen log" ON mm_blog_gen_log
  FOR ALL USING (auth.role() = 'authenticated');

-- Anon insert for API (cron job uses service role or anon with insert)
CREATE POLICY "Anon insert blogs" ON mm_blogs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon insert gen log" ON mm_blog_gen_log
  FOR INSERT WITH CHECK (true);

-- Allow anon to update blogs (for the cron job to set status)
CREATE POLICY "Anon update blogs" ON mm_blogs
  FOR UPDATE USING (true);
