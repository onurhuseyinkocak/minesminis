/**
 * Admin yetkisi verilen e-posta adresleri.
 * Bu hesaplar giriş yaptığında doğrudan admin paneline yönlendirilir; şifre gerekmez.
 *
 * SECURITY NOTE: Hardcoding admin emails in client-side code is a known concern.
 * This list is exposed in the JS bundle. The real authorization gate is server-side
 * (requireAdminAuth in server.js checks Firebase token + Supabase role).
 * This client-side check only controls UI visibility, not actual access.
 * TODO: Move admin check entirely to server-side; use Supabase `role='admin'` field.
 */
export const ADMIN_EMAILS: string[] = [
  'mineteacheronline@gmail.com',
  'onurhuseyinkocak1@dream-mining.co',
].map((e) => e.toLowerCase());

export function isAdminEmail(email: string | null | undefined): boolean {
  const e = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!e) return false;
  return ADMIN_EMAILS.includes(e);
}
