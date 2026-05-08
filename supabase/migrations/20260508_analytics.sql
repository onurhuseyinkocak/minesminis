-- Analytics tables for MinesMinis
-- Created: 2026-05-08
-- Purpose: Track page views and generate daily stats

-- Page views table
CREATE TABLE IF NOT EXISTS mm_page_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path text NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_page_views_created ON mm_page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON mm_page_views(session_id);

-- Row-level security
ALTER TABLE mm_page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (for anonymous tracking)
CREATE POLICY "Anyone can insert page views" ON mm_page_views
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read page views
CREATE POLICY "Authenticated can read page views" ON mm_page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Daily stats view
CREATE OR REPLACE VIEW mm_daily_stats AS
SELECT
  date_trunc('day', created_at)::date as day,
  count(*) as views,
  count(DISTINCT session_id) as unique_visitors
FROM mm_page_views
GROUP BY date_trunc('day', created_at)::date
ORDER BY day DESC;
