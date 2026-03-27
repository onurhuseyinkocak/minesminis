/**
 * Admin email check — client-side UI gate only.
 *
 * SECURITY: Admin emails are NOT stored in the client bundle.
 * The actual email list is read from VITE_ADMIN_EMAILS env var at build time
 * (set in your deployment secrets, never commit real values).
 * The real authorization gate remains server-side (requireAdminAuth in server.js).
 *
 * TODO: Move admin check entirely to server-side; use Supabase `role='admin'` field.
 */

// Populated at build time from VITE_ADMIN_EMAILS secret (comma-separated).
// Falls back to empty — unknown users are never granted admin UI access.
const _raw = import.meta.env.VITE_ADMIN_EMAILS ?? '';
export const ADMIN_EMAILS: string[] = _raw
  ? _raw
      .split(',')
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean)
  : [];

export function isAdminEmail(email: string | null | undefined): boolean {
  const e = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!e) return false;
  return ADMIN_EMAILS.includes(e);
}
