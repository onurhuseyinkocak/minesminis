import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Read env at runtime (Vercel injects env when function runs; module-level const can be empty at cold start)
function getEnv() {
  return {
    adminPassword: process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '',
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '',
  };
}

/** For debugging: which env vars are set (names only, no values) */
export function getEnvStatus() {
  const e = getEnv();
  return {
    hasSupabaseUrl: !!e.supabaseUrl,
    hasSupabaseKey: !!e.supabaseKey,
    supabaseConfigured: !!(e.supabaseUrl && e.supabaseKey),
    hint: 'Vercel: Project Settings -> Environment Variables. Add SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY for Production, then Redeploy.',
  };
}

/** 503 response body when Supabase is not configured */
export function getSupabaseUnavailableResponse() {
  const st = getEnvStatus();
  return {
    error: 'Supabase yapılandırılmamış',
    hasSupabaseUrl: st.hasSupabaseUrl,
    hasSupabaseKey: st.hasSupabaseKey,
    hint: st.hint,
  };
}

let supabaseInstance = null;

export function checkAdmin(req) {
  const pw = req.headers['x-admin-password'];
  const { adminPassword } = getEnv();
  if (!pw || !adminPassword) return false;
  const a = Buffer.from(String(pw).trim());
  const b = Buffer.from(adminPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function getSupabase() {
  const { supabaseUrl, supabaseKey } = getEnv();
  if (!supabaseUrl || !supabaseKey) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

export function requireAdmin(req, res, next) {
  if (!checkAdmin(req)) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid X-Admin-Password' });
    return;
  }
  next();
}
