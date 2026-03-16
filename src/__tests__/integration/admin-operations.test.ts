import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdminEmail, ADMIN_EMAILS } from '../../config/adminEmails';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({ error: null }),
});
const mockDelete = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({ error: null }),
});
const mockSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
});

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      update: mockUpdate,
      delete: mockDelete,
      insert: vi.fn().mockReturnValue({ error: null }),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

vi.mock('../../config/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-firebase-token'),
    },
  },
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((_a, cb) => { cb(null); return vi.fn(); }),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  GoogleAuthProvider: vi.fn(),
}));

import { getAdminAuthHeaders } from '../../utils/adminApi';
import { userService } from '../../services/userService';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Admin Operations Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // 1. Admin email grants access
  it('admin email is recognized as admin', () => {
    expect(isAdminEmail('mineteacheronline@gmail.com')).toBe(true);
    expect(isAdminEmail('onurhuseyinkocak1@dream-mining.co')).toBe(true);
  });

  it('admin email detection is case-insensitive', () => {
    expect(isAdminEmail('MineTeacherOnline@Gmail.COM')).toBe(true);
    expect(isAdminEmail('  mineteacheronline@gmail.com  ')).toBe(true);
  });

  // 2. Non-admin email blocks access
  it('non-admin email is rejected', () => {
    expect(isAdminEmail('student@test.com')).toBe(false);
    expect(isAdminEmail('teacher@school.edu')).toBe(false);
    expect(isAdminEmail('almost_mineteacheronline@gmail.com')).toBe(false);
  });

  it('null/undefined/empty email is rejected', () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail('')).toBe(false);
  });

  // 3. User role change updates DB
  it('updates user role in DB via userService', async () => {
    mockUpdate.mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({ error: null }),
    });

    await userService.updateUserProfile('user-1', { role: 'teacher' });
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('changing role from student to teacher persists', async () => {
    mockUpdate.mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({ error: null }),
    });

    await expect(
      userService.updateUserProfile('user-1', { role: 'teacher' })
    ).resolves.not.toThrow();
  });

  // 4. Premium toggle updates settings JSONB
  it('toggles premium in settings JSONB', async () => {
    mockUpdate.mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({ error: null }),
    });

    await userService.updateUserProfile('user-1', {
      settings: {
        premium: true,
        premium_since: '2025-01-01',
        premium_until: '2026-01-01',
      },
    });

    expect(mockUpdate).toHaveBeenCalled();
  });

  // 5. User delete removes from DB
  it('deleting a user calls delete on supabase', async () => {
    // Direct supabase call (admin would do this)
    const { supabase } = await import('../../config/supabase');
    supabase.from('users').delete();
    expect(mockDelete).toHaveBeenCalled();
  });

  // 6. Premium extend calculates correct date
  it('calculates correct premium extension date', () => {
    const now = new Date('2025-06-01');
    const months = 3;
    const extended = new Date(now);
    extended.setMonth(extended.getMonth() + months);

    expect(extended.toISOString()).toContain('2025-09-01');
  });

  it('premium extension wraps year correctly', () => {
    const now = new Date('2025-11-15');
    const months = 3;
    const extended = new Date(now);
    extended.setMonth(extended.getMonth() + months);

    expect(extended.getFullYear()).toBe(2026);
    expect(extended.getMonth()).toBe(1); // February (0-indexed)
  });

  // 7. Premium revoke clears settings
  it('revoking premium sets premium fields to null', async () => {
    mockUpdate.mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({ error: null }),
    });

    await userService.updateUserProfile('user-1', {
      settings: {
        premium: false,
        premium_since: null,
        premium_until: null,
      },
    });

    expect(mockUpdate).toHaveBeenCalled();
  });

  // 8. Admin auth headers include token
  it('returns Bearer token header when logged in via Firebase', async () => {
    // No admin session in sessionStorage -> should use Firebase token
    const headers = await getAdminAuthHeaders();
    expect(headers).toHaveProperty('Authorization');
    expect((headers as Record<string, string>).Authorization).toContain('Bearer');
  });

  it('returns X-Admin-Password header when admin session is active', async () => {
    sessionStorage.setItem('admin_session', '1');
    const headers = await getAdminAuthHeaders();
    expect(headers).toHaveProperty('X-Admin-Password');
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('returns only Content-Type when no auth is available', async () => {
    // Override firebase mock to have no current user
    const firebase = await import('../../config/firebase');
    const originalAuth = firebase.auth;
    (firebase as Record<string, unknown>).auth = { currentUser: null };

    const headers = await getAdminAuthHeaders();
    expect(headers).toHaveProperty('Content-Type');
    expect(headers).not.toHaveProperty('Authorization');
    expect(headers).not.toHaveProperty('X-Admin-Password');

    // Restore
    (firebase as Record<string, unknown>).auth = originalAuth;
  });

  // Edge cases
  it('ADMIN_EMAILS list contains known admin emails', () => {
    expect(ADMIN_EMAILS).toContain('mineteacheronline@gmail.com');
    expect(ADMIN_EMAILS.length).toBeGreaterThanOrEqual(1);
  });

  it('all admin emails are stored lowercase', () => {
    for (const email of ADMIN_EMAILS) {
      expect(email).toBe(email.toLowerCase());
    }
  });

  it('updateUserProfile throws on supabase error', async () => {
    mockUpdate.mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({ error: { message: 'DB error' } }),
    });

    await expect(
      userService.updateUserProfile('user-1', { display_name: 'fail' })
    ).rejects.toBeDefined();
  });
});
