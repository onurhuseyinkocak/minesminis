/**
 * Admin API helpers - admin panel şifre veya Firebase token ile backend istekleri.
 */
import { auth } from '../config/firebase';
import { getApiBase } from './apiBase';

const ADMIN_SESSION_KEY = 'admin_session';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Wealthy*520';

/**
 * Returns headers for admin API: şifre ile giriş yapıldıysa X-Admin-Password, yoksa Bearer token.
 */
export async function getAdminAuthHeaders(): Promise<HeadersInit> {
  if (typeof window !== 'undefined' && sessionStorage.getItem(ADMIN_SESSION_KEY) === '1') {
    return {
      'Content-Type': 'application/json',
      'X-Admin-Password': ADMIN_PASSWORD,
    };
  }
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  try {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

/**
 * Base URL for backend (same as getApiBase).
 */
export function getAdminApiBase(): string {
  return getApiBase();
}

/**
 * Fetch for admin API: sends Firebase ID token in Authorization header.
 */
export async function adminFetch(
  path: string,
  options: RequestInit & { method?: string; body?: BodyInit } = {}
): Promise<Response> {
  const base = getAdminApiBase();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(options.headers as HeadersInit);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const authHeaders = await getAdminAuthHeaders();
  const auth = authHeaders as Record<string, string>;
  if (auth.Authorization) headers.set('Authorization', auth.Authorization);
  if (auth['X-Admin-Password']) headers.set('X-Admin-Password', auth['X-Admin-Password']);
  return fetch(url, { ...options, headers });
}
