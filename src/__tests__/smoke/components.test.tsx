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
    getXPProgress: () => 50,
    checkStreak: vi.fn(),
    getStreakBonus: () => 0,
    canClaimDaily: false,
    claimDailyReward: vi.fn(),
    getNextClaimTime: () => null,
    getDailyRewardForDay: () => ({ day: 1, xp: 10 }),
    allBadges: [
      { id: 'streak_3', name: '3 Day Streak', description: 'Login 3 days', icon: 'F', category: 'streak', requirement: 3, requirementType: 'streak' },
    ],
    hasBadge: () => false,
    checkAndAwardBadges: vi.fn(),
    trackActivity: vi.fn(),
    showLevelUp: false,
    newLevel: 1,
    dismissLevelUp: vi.fn(),
  }),
  GamificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
  updatePetStats: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('@lottiefiles/react-lottie-player', () => ({
  Player: ({ children }: { children: React.ReactNode }) => <div data-testid="lottie-player">{children}</div>,
}));

vi.mock('lottie-react', () => ({
  default: () => <div data-testid="lottie-react" />,
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
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useTransform: () => ({ get: () => 0 }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Component Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Navbar - renders navigation', async () => {
    const { default: Navbar } = await import('../../components/Navbar');
    wrap(<Navbar />);
    // Has main navigation landmark
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });

  it('SplashScreen - renders loading content', async () => {
    const { default: SplashScreen } = await import('../../components/SplashScreen');
    render(<SplashScreen onComplete={vi.fn()} />);
    expect(screen.getByText(/Mine's/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn English, Have Fun/i)).toBeInTheDocument();
  });

  it('ErrorBoundary - renders children when no error', async () => {
    const { ErrorBoundary } = await import('../../components/ErrorBoundary');
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('ErrorBoundary - shows fallback on error', async () => {
    const { ErrorBoundary } = await import('../../components/ErrorBoundary');
    const ThrowingComponent = () => { throw new Error('Test error'); };
    // Suppress console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('XPBar - renders xp info', async () => {
    const { default: XPBar } = await import('../../components/XPBar');
    render(<XPBar />);
    expect(document.querySelector('.xp-bar-container')).toBeInTheDocument();
    expect(document.querySelector('.level-number')).toBeInTheDocument();
  });

  it('XPBar compact - renders level badge', async () => {
    const { default: XPBar } = await import('../../components/XPBar');
    render(<XPBar compact />);
    expect(document.querySelector('.xp-bar-compact')).toBeInTheDocument();
  });


  it('Leaderboard - renders leaderboard', async () => {
    const { default: Leaderboard } = await import('../../components/Leaderboard');
    wrap(<Leaderboard />);
    expect(screen.getByText(/Weekly/i)).toBeInTheDocument();
  });

  it('DailyReward - renders reward button', async () => {
    const { default: DailyReward } = await import('../../components/DailyReward');
    render(<DailyReward />);
    // Should render the trigger button with gift emoji
    expect(document.querySelector('.daily-reward-trigger')).toBeInTheDocument();
  });

  it('LevelUpModal - renders nothing when not showing', async () => {
    const { default: LevelUpModal } = await import('../../components/LevelUpModal');
    const { container } = render(<LevelUpModal />);
    // showLevelUp is false in mock, so nothing renders
    expect(container.innerHTML).toBe('');
  });

it('UnifiedMascot - renders SVG mascot', async () => {
    const { default: UnifiedMascot } = await import('../../components/UnifiedMascot');
    const { container } = render(<UnifiedMascot state="idle" />);
    // Should render an SVG element
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('ReportButton - renders report icon', async () => {
    const { default: ReportButton } = await import('../../components/ReportButton');
    wrap(<ReportButton />);
    expect(screen.getByLabelText(/Sorun Bildir/i)).toBeInTheDocument();
  });

  it('ConfettiEffect - renders without crash', async () => {
    const { default: ConfettiEffect } = await import('../../components/ConfettiEffect');
    const { container } = render(<ConfettiEffect isActive={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

});
