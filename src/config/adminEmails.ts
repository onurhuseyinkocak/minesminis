/**
 * Admin yetkisi verilen e-posta adresleri.
 * Bu hesaplar giriş yaptığında doğrudan admin paneline yönlendirilir; şifre gerekmez.
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
