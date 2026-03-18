import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mock external dependencies ──────────────────────────────────────────────

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
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        not: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn((_auth: unknown, cb: (u: null) => void) => { cb(null); return vi.fn(); }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(() => Promise.resolve(null)),
  signOut: vi.fn(),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  }),
  Toaster: () => null,
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    userProfile: null,
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
    signOut: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light' as const,
    effectiveTheme: 'light' as const,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/GamificationContext', () => ({
  useGamification: () => ({
    stats: { xp: 0, weekly_xp: 0, level: 1, streakDays: 0, lastLoginDate: null, lastDailyClaim: null, lastWeeklyReset: null, badges: [], wordsLearned: 0, gamesPlayed: 0, videosWatched: 0, worksheetsCompleted: 0, dailyChallengesCompleted: 0, mascotId: 'mimi_dragon' },
    loading: false,
    addXP: vi.fn(),
    getXPForNextLevel: () => 100,
    getXPProgress: () => 0,
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
  GamificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  calculateLevel: (xp: number) => 1,
  getXPForLevel: (level: number) => 100,
  getTotalXPForLevel: (level: number) => (level - 1) * 100,
  ALL_BADGES: [],
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
  PremiumProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../services/userService', () => ({
  userService: {
    getUserProfile: vi.fn(() => Promise.resolve(null)),
    createOrUpdateUserProfile: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('../../services/petService', () => ({
  getUserPet: vi.fn(() => Promise.resolve(null)),
  createPet: vi.fn(() => Promise.resolve()),
  feedPet: vi.fn(),
  playWithPet: vi.fn(),
  sleepPet: vi.fn(),
  updatePetStats: vi.fn(),
}));

vi.mock('../../data/fallbackData', () => ({
  fallbackGames: [],
  fallbackVideos: [],
  fallbackWorksheets: [],
}));

vi.mock('../../data/wordsData', () => ({
  kidsWords: [],
}));

vi.mock('../../data/videoStore', () => ({
  videoStore: {
    getAll: () => [],
    getByGrade: () => [],
    fetchVideos: vi.fn(() => Promise.resolve([])),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (prop === 'div' || prop === 'button' || prop === 'h1' || prop === 'h2' || prop === 'p' || prop === 'span' || prop === 'section' || prop === 'a' || prop === 'form' || prop === 'li' || prop === 'ul' || prop === 'nav' || prop === 'img' || prop === 'input' || prop === 'textarea') {
        return React.forwardRef(({ children, ...props }: any, ref: any) => {
          const filteredProps: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(props)) {
            if (!key.startsWith('while') && !key.startsWith('animate') && !key.startsWith('initial') && !key.startsWith('exit') && !key.startsWith('variants') && !key.startsWith('transition') && !key.startsWith('layout') && key !== 'custom' && key !== 'whileInView' && key !== 'viewport') {
              filteredProps[key] = value;
            }
          }
          return React.createElement(prop as string, { ...filteredProps, ref }, children);
        });
      }
      return undefined;
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => false,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useTransform: () => ({ get: () => 0 }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Page Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Landing - renders hero title', async () => {
    const { default: Landing } = await import('../../pages/Landing');
    wrap(<Landing />);
    // default lang is 'en' based on source
    expect(screen.getByText(/Learn English with MinesMinis/i)).toBeInTheDocument();
  });

  it('Login - renders login form', async () => {
    const { default: Login } = await import('../../pages/Login');
    wrap(<Login />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  it('Games - renders games content', async () => {
    const { default: Games } = await import('../../pages/Games');
    wrap(<Games />);
    // ContentPageHeader with title "Games" or Turkish fallback
    expect(document.querySelector('.games, [class*="games"], [class*="Games"]') || document.body.textContent).toBeTruthy();
  });

  it('Words - renders words content', async () => {
    const { default: Words } = await import('../../pages/Words');
    wrap(<Words />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('Videos - renders video content', async () => {
    const { default: Videos } = await import('../../pages/Videos');
    wrap(<Videos />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('Worksheets - renders worksheet content', async () => {
    const { default: Worksheets } = await import('../../pages/Worksheets');
    wrap(<Worksheets />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('Profile - renders profile section', async () => {
    const { default: Profile } = await import('../../pages/Profile');
    wrap(<Profile />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('Favorites - renders favorites content', async () => {
    const { default: Favorites } = await import('../../pages/Favorites');
    wrap(<Favorites />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('Premium - renders premium content', async () => {
    const { default: Premium } = await import('../../pages/Premium');
    wrap(<Premium />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Unlimited AI Chat/i);
  });

  it('Blog - renders blog section', async () => {
    const { default: Blog } = await import('../../pages/Blog');
    wrap(<Blog />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('StudentDashboard - renders dashboard', async () => {
    const { default: StudentDashboard } = await import('../../pages/Student/StudentDashboard');
    wrap(<StudentDashboard />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('Onboarding - renders step 1 with character selection', async () => {
    const { default: Onboarding } = await import('../../pages/Onboarding');
    wrap(<Onboarding />);
    expect(screen.getByText(/How old are you/i)).toBeInTheDocument();
  });
});
