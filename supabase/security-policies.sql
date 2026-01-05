-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Enterprise-Grade Database Security
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Public profiles are readable by authenticated users
CREATE POLICY "Public profiles are readable" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system can insert users (via auth trigger)
CREATE POLICY "System can insert users" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- POSTS TABLE POLICIES
-- ============================================================

-- Anyone can read public posts
CREATE POLICY "Public posts are readable" ON public.posts
  FOR SELECT USING (visibility = 'everyone');

-- Authenticated users can read posts based on visibility
CREATE POLICY "Authenticated users read posts" ON public.posts
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (
      visibility = 'everyone' OR
      author_id = auth.uid()
    )
  );

-- Users can create posts
CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================================
-- WORKSHEETS TABLE POLICIES
-- ============================================================

-- Public worksheets are readable by everyone
CREATE POLICY "Public worksheets are readable" ON public.worksheets
  FOR SELECT USING (visibility = 'public');

-- Authenticated users can read all worksheets
CREATE POLICY "Authenticated read worksheets" ON public.worksheets
  FOR SELECT USING (auth.role() = 'authenticated');

-- Teachers can create worksheets
CREATE POLICY "Teachers can create worksheets" ON public.worksheets
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Teachers can update their own worksheets
CREATE POLICY "Teachers can update own worksheets" ON public.worksheets
  FOR UPDATE USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Teachers can delete their own worksheets
CREATE POLICY "Teachers can delete own worksheets" ON public.worksheets
  FOR DELETE USING (auth.uid() = uploaded_by);

-- ============================================================
-- GAMES TABLE POLICIES
-- ============================================================

-- Everyone can read games
CREATE POLICY "Games are publicly readable" ON public.games
  FOR SELECT USING (true);

-- Only teachers/admins can create games
CREATE POLICY "Teachers can create games" ON public.games
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- ============================================================
-- VIDEOS TABLE POLICIES
-- ============================================================

-- Everyone can read videos
CREATE POLICY "Videos are publicly readable" ON public.videos
  FOR SELECT USING (true);

-- Only teachers/admins can add videos
CREATE POLICY "Teachers can add videos" ON public.videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- ============================================================
-- FAVORITES TABLE POLICIES
-- ============================================================

-- Users can read their own favorites
CREATE POLICY "Users can read own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add to their own favorites
CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove from their own favorites
CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SECURITY FUNCTIONS
-- ============================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is premium
CREATE OR REPLACE FUNCTION public.is_premium()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM stripe.subscriptions s
    JOIN stripe.customers c ON s.customer_id = c.id
    JOIN public.users u ON u.email = c.email
    WHERE u.id = auth.uid() AND s.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUDIT LOGGING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON public.audit_log
  FOR SELECT USING (public.is_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- No one can update or delete audit logs (immutable)
-- (No UPDATE or DELETE policies = denied)

-- ============================================================
-- AUDIT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_users ON public.users;
CREATE TRIGGER audit_users
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_posts ON public.posts;
CREATE TRIGGER audit_posts
  AFTER INSERT OR UPDATE OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_worksheets ON public.worksheets;
CREATE TRIGGER audit_worksheets
  AFTER INSERT OR UPDATE OR DELETE ON public.worksheets
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- ============================================================
-- RATE LIMITING TABLE (for API abuse prevention)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP or user ID
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, action);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  SELECT count, window_start INTO v_count, v_window_start
  FROM public.rate_limits
  WHERE identifier = p_identifier AND action = p_action
  ORDER BY created_at DESC LIMIT 1;
  
  IF v_window_start IS NULL OR NOW() - v_window_start > (p_window_seconds || ' seconds')::INTERVAL THEN
    -- Reset window
    INSERT INTO public.rate_limits (identifier, action, count, window_start)
    VALUES (p_identifier, p_action, 1, NOW());
    RETURN TRUE;
  ELSIF v_count >= p_max_requests THEN
    RETURN FALSE;
  ELSE
    UPDATE public.rate_limits 
    SET count = count + 1
    WHERE identifier = p_identifier AND action = p_action;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CLEANUP OLD DATA
-- ============================================================

-- Function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old audit logs (keep 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.audit_log
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
