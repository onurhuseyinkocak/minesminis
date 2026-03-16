import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mock setup ──────────────────────────────────────────────────────────────

const mockSignOut = vi.fn();
const mockToggleTheme = vi.fn();

let mockAuthValue = {
  user: null as Record<string, unknown> | null,
  userProfile: null as Record<string, unknown> | null,
  isAdmin: false,
  loading: false,
  profileLoading: false,
  showProfileSetup: false,
  setShowProfileSetup: vi.fn(),
  hasSkippedSetup: false,
  setHasSkippedSetup: vi.fn(),
  setUserProfile: vi.fn(),
  refreshUserProfile: vi.fn(),
  signUp: vi.fn(),
  signIn: vi.fn(),
  signInWithGoogle: vi.fn(),
  signInWithGoogleRedirect: vi.fn(),
  signOut: mockSignOut,
};

vi.mock('../../config/firebase', () => ({
  auth: {},
  googleProvider: {},
  analytics: null,
}));

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
        }),
        order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
      }),
    }),
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn((_a: unknown, cb: (u: null) => void) => { cb(null); return vi.fn(); }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(() => Promise.resolve(null)),
  signOut: vi.fn(),
}));

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), loading: vi.fn(), dismiss: vi.fn() }),
  Toaster: () => null,
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthValue,
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light' as const,
    effectiveTheme: 'light' as const,
    setTheme: vi.fn(),
    toggleTheme: mockToggleTheme,
  }),
}));

vi.mock('../../contexts/GamificationContext', () => ({
  useGamification: () => ({
    stats: { xp: 0, weekly_xp: 0, level: 1, streakDays: 0, lastLoginDate: null, lastDailyClaim: null, lastWeeklyReset: null, badges: [], wordsLearned: 0, gamesPlayed: 0, videosWatched: 0, worksheetsCompleted: 0, dailyChallengesCompleted: 0, mascotId: 'mimi_dragon' },
    loading: false,
    addXP: vi.fn(),
    getXPForNextLevel: () => 100,
    getXPProgress: () => 50,
    checkStreak: vi.fn(),
    getStreakBonus: () => 0,
    canClaimDaily: false,
    claimDailyReward: vi.fn(),
    getNextClaimTime: () => null,
    getDailyRewardForDay: () => ({ day: 1, xp: 10 }),
    allBadges: [],
    hasBadge: () => false,
    checkAndAwardBadges: vi.fn(),
    trackActivity: vi.fn(),
    showLevelUp: false,
    newLevel: 1,
    dismissLevelUp: vi.fn(),
  }),
}));

vi.mock('../../contexts/PremiumContext', () => ({
  usePremium: () => ({
    isPremium: false,
    subscription: null,
    customerId: null,
    loading: false,
    checkPremiumStatus: vi.fn(),
    createCheckout: vi.fn(),
    openCustomerPortal: vi.fn(),
  }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const renderNavbar = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  );

// Lazy import after mocks are set up
let Navbar: React.FC;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../components/Navbar');
  Navbar = mod.default;
  // Reset auth to logged out by default
  mockAuthValue = {
    ...mockAuthValue,
    user: null,
    userProfile: null,
    isAdmin: false,
  };
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Navbar Component', () => {
  it('renders navigation elements', () => {
    renderNavbar();
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });

  it('renders logo linking to home when not authenticated', () => {
    renderNavbar();
    const logo = screen.getByLabelText('MinesMinis');
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute('href')).toBe('/');
  });

  it('renders logo linking to /games when authenticated', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    renderNavbar();
    const logo = screen.getByLabelText('MinesMinis');
    expect(logo.getAttribute('href')).toBe('/games');
  });

  it('shows login button when not authenticated', () => {
    renderNavbar();
    const loginLinks = screen.getAllByText('Login');
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('hides nav links when not authenticated', () => {
    renderNavbar();
    expect(screen.queryByText('Games')).not.toBeInTheDocument();
  });

  it('shows nav links when authenticated', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'TestUser' };
    renderNavbar();
    // Nav links appear in both desktop nav and possibly mobile bottom bar
    expect(screen.getAllByText('Games').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Sheets')).toBeInTheDocument();
  });

  it('shows admin icon for admin users', () => {
    mockAuthValue.user = { uid: 'u1', email: 'admin@test.com' };
    mockAuthValue.userProfile = { display_name: 'Admin' };
    mockAuthValue.isAdmin = true;
    renderNavbar();
    const adminLink = screen.getByTitle('Admin');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.getAttribute('href')).toBe('/admin');
  });

  it('does not show admin icon for non-admin users', () => {
    mockAuthValue.user = { uid: 'u1', email: 'user@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    mockAuthValue.isAdmin = false;
    renderNavbar();
    expect(screen.queryByTitle('Admin')).not.toBeInTheDocument();
  });

  it('theme toggle button calls toggleTheme', () => {
    renderNavbar();
    const themeBtn = screen.getByLabelText(/Switch to dark/i);
    fireEvent.click(themeBtn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows hamburger menu for authenticated users', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    renderNavbar();
    expect(screen.getByLabelText('Menu')).toBeInTheDocument();
  });

  it('does not show hamburger menu for unauthenticated users', () => {
    renderNavbar();
    expect(screen.queryByLabelText('Menu')).not.toBeInTheDocument();
  });

  it('mobile menu opens and shows navigation links on hamburger click', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    renderNavbar();
    fireEvent.click(screen.getByLabelText('Menu'));
    // Mobile menu should now be visible with links
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('shows user profile name when authenticated', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'JohnDoe' };
    renderNavbar();
    expect(screen.getAllByText('JohnDoe').length).toBeGreaterThan(0);
  });

  it('shows "Profile" when no display_name', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = null;
    renderNavbar();
    expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
  });

  it('logout button calls signOut', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    renderNavbar();
    const logoutBtn = screen.getByTitle('Logout');
    fireEvent.click(logoutBtn);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('favorites link is present for authenticated user', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    renderNavbar();
    const favLink = screen.getByTitle('Favorites');
    expect(favLink).toBeInTheDocument();
    expect(favLink.getAttribute('href')).toBe('/favorites');
  });

  it('profile link is present for authenticated user', () => {
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    renderNavbar();
    const profileLink = screen.getByTitle('Profile');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.getAttribute('href')).toBe('/profile');
  });

  it('renders bottom tab bar', () => {
    renderNavbar();
    // Bottom tab bar should have navigation
    const navs = screen.getAllByRole('navigation');
    // There should be at least 2 navigation landmarks (top + bottom)
    expect(navs.length).toBeGreaterThanOrEqual(2);
  });

  it('bottom tab bar shows different items for auth vs unauth', () => {
    // Unauthenticated: Home, Ataturk, Login
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();

    // Authenticated: Dashboard, Games, Favs, Profile
    mockAuthValue.user = { uid: 'u1', email: 'test@test.com' };
    mockAuthValue.userProfile = { display_name: 'User' };
    const { unmount } = renderNavbar();
    unmount();

    renderNavbar();
    expect(screen.getByText('Favs')).toBeInTheDocument();
  });
});
