import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mock setup ──────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockSetHasSkippedSetup = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
        }),
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
  useAuth: () => ({
    user: { uid: 'u1', email: 'test@test.com' },
    userProfile: null,
    isAdmin: false,
    loading: false,
    profileLoading: false,
    showProfileSetup: true,
    setShowProfileSetup: vi.fn(),
    hasSkippedSetup: false,
    setHasSkippedSetup: mockSetHasSkippedSetup,
    setUserProfile: vi.fn(),
    refreshUserProfile: vi.fn(() => Promise.resolve()),
    signUp: vi.fn(),
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithGoogleRedirect: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light' as const,
    effectiveTheme: 'light' as const,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
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
}));

vi.mock('../../services/userService', () => ({
  userService: {
    getUserProfile: vi.fn(() => Promise.resolve(null)),
    createOrUpdateUserProfile: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('../../services/petService', () => ({
  createPet: vi.fn(() => Promise.resolve()),
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
        return React.forwardRef(({ children, ...props }: any, ref: any) => {
          const filteredProps: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(props)) {
            if (!key.startsWith('while') && !key.startsWith('animate') && !key.startsWith('initial') && !key.startsWith('exit') && !key.startsWith('variants') && !key.startsWith('transition') && !key.startsWith('layout') && key !== 'custom') {
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
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

let Onboarding: React.FC;

const renderOnboarding = () =>
  render(
    <MemoryRouter>
      <Onboarding />
    </MemoryRouter>
  );

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../pages/Onboarding');
  Onboarding = mod.default;
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding Page', () => {
  it('renders step 1: age selection title', () => {
    renderOnboarding();
    expect(screen.getByText(/How old are you/i)).toBeInTheDocument();
  });

  it('renders 4 age group cards', () => {
    renderOnboarding();
    expect(screen.getByText('Toddler')).toBeInTheDocument();
    expect(screen.getByText('Preschool')).toBeInTheDocument();
    expect(screen.getByText('Early Primary')).toBeInTheDocument();
    expect(screen.getByText('Late Primary')).toBeInTheDocument();
  });

  it('next button is disabled until age group is selected', () => {
    renderOnboarding();
    const nextBtn = screen.getByText(/Continue/i);
    expect(nextBtn.closest('button')).toBeDisabled();
  });

  it('next button enables after selecting an age group', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Toddler'));
    const nextBtn = screen.getByText(/Continue/i);
    expect(nextBtn.closest('button')).not.toBeDisabled();
  });

  it('advances to step 2 when clicking next after age selection', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Toddler'));
    fireEvent.click(screen.getByText(/Continue/i));
    // Step 2 should show "Meet Mimi!" (not step 1 "How old are you?")
    expect(screen.getByText(/Meet Mimi/i)).toBeInTheDocument();
  });

  it('renders progress dots', () => {
    renderOnboarding();
    // Progress dots: should show 5 step indicators
    expect(document.querySelectorAll('.onboarding-progress-dot').length).toBe(5);
  });

  it('first progress dot is active', () => {
    renderOnboarding();
    const dots = document.querySelectorAll('.onboarding-progress-dot');
    expect(dots[0].classList.contains('active')).toBe(true);
  });

  it('step 2: shows Meet Mimi intro', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Toddler'));
    fireEvent.click(screen.getByText(/Continue/i));
    // Step 2 shows Mimi intro speech
    const body = document.body.textContent || '';
    expect(body).toMatch(/dragon friend|Mimi/);
  });

  it('can navigate back from step 2 to step 1', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Toddler'));
    fireEvent.click(screen.getByText(/Continue/i));
    // Find and click back button
    const backBtn = screen.getByText(/Back/i);
    fireEvent.click(backBtn);
    expect(screen.getByText(/How old are you/i)).toBeInTheDocument();
  });

  it('step 3: shows companion selection', () => {
    renderOnboarding();
    // Go to step 3: select age -> next -> next (step 2 "Let's Go!")
    fireEvent.click(screen.getByText('Toddler'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText(/Let's Go/i));
    // Step 3 should show "Choose Your Companion!"
    expect(screen.getByText(/Choose Your Companion/i)).toBeInTheDocument();
  });

  it('step 3: shows all 4 mascot characters', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Toddler'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText(/Let's Go/i));
    // All 4 mascot names should be visible
    expect(screen.getByText('Mimi')).toBeInTheDocument();
    expect(screen.getByText('Nova')).toBeInTheDocument();
    expect(screen.getByText('Bubbles')).toBeInTheDocument();
    expect(screen.getByText('Sparky')).toBeInTheDocument();
  });

  it('each mascot shows power info', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Toddler'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText(/Let's Go/i));
    const body = document.body.textContent || '';
    // English power/benefit text from GLINTS config
    expect(body).toContain('Guardian of Harmony');
    expect(body).toContain('Star Explorer');
    expect(body).toContain('Ocean Sorcerer');
    expect(body).toContain('Electric Genius');
  });
});
