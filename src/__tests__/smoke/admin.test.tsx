import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
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
        then: (resolve: (v: { data: never[]; error: null }) => void) => resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
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
    user: { uid: 'admin-123', email: 'admin@test.com' },
    userProfile: { display_name: 'Admin', role: 'teacher', settings: {} },
    isAdmin: true,
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

vi.mock('../../data/fallbackData', () => ({
  fallbackGames: [],
  fallbackVideos: [],
  fallbackWorksheets: [],
}));

vi.mock('../../data/wordsData', () => ({
  kidsWords: [],
  KidsWord: {},
}));

vi.mock('../../data/videoStore', () => ({
  videoStore: {
    getAll: () => [],
    getByGrade: () => [],
    fetchVideos: vi.fn(() => Promise.resolve([])),
    getVideos: () => [],
    subscribe: vi.fn(() => vi.fn()),
    saveVideos: vi.fn(),
  },
  Video: {},
}));

vi.mock('../../data/gameStore', () => ({
  gameStore: {
    getAll: () => [],
    getGames: () => [],
    saveGames: vi.fn(),
    fetchGames: vi.fn(() => Promise.resolve([])),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

vi.mock('../../data/wordStore', () => ({
  wordStore: {
    getAll: () => [],
    getWords: () => [],
    saveWords: vi.fn(),
    fetchWords: vi.fn(() => Promise.resolve([])),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

vi.mock('../../data/videosData', () => ({
  gradeInfo: {},
}));

vi.mock('../../data/worksheetsData', () => ({
  Worksheet: {},
  categories: [],
  grades: [],
}));

vi.mock('../../utils/adminApi', () => ({
  adminFetch: vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })),
  getAdminApiBase: () => 'http://localhost:3001',
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Area: () => null,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
        return React.forwardRef(({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }, ref: React.Ref<Element>) => {
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
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Admin Page Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AdminDashboard - renders dashboard', async () => {
    const { default: AdminDashboard } = await import('../../pages/Admin/AdminDashboard');
    wrap(<AdminDashboard />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('UsersManager - renders users section', async () => {
    const { default: UsersManager } = await import('../../pages/Admin/UsersManager');
    wrap(<UsersManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('PremiumManager - renders premium section', async () => {
    const { default: PremiumManager } = await import('../../pages/Admin/PremiumManager');
    wrap(<PremiumManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('GamesManager - renders games management', async () => {
    const { default: GamesManager } = await import('../../pages/Admin/GamesManager');
    wrap(<GamesManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('VideosManager - renders videos management', async () => {
    const { default: VideosManager } = await import('../../pages/Admin/VideosManager');
    wrap(<VideosManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('WordsManager - renders words management', async () => {
    const { default: WordsManager } = await import('../../pages/Admin/WordsManager');
    wrap(<WordsManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('WorksheetsManager - renders worksheets section', async () => {
    const { default: WorksheetsManager } = await import('../../pages/Admin/WorksheetsManager');
    wrap(<WorksheetsManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('BlogManager - renders blog management', async () => {
    const { default: BlogManager } = await import('../../pages/Admin/BlogManager');
    wrap(<BlogManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('ReportsManager - renders reports section', async () => {
    const { default: ReportsManager } = await import('../../pages/Admin/ReportsManager');
    wrap(<ReportsManager />);
    expect(document.body.textContent).toBeTruthy();
  });

  it('SEOManager - renders SEO section', async () => {
    const { default: SEOManager } = await import('../../pages/Admin/SEOManager');
    wrap(<SEOManager />);
    expect(document.body.textContent).toBeTruthy();
  });
});
