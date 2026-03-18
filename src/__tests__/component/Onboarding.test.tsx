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
    updateUserProfile: vi.fn(() => Promise.resolve()),
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
  it('renders step 1: role selection with title', () => {
    renderOnboarding();
    expect(screen.getByText('How will you use MinesMinis?')).toBeInTheDocument();
  });

  it('renders three role options', () => {
    renderOnboarding();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Parent')).toBeInTheDocument();
  });

  it('shows role subtitles', () => {
    renderOnboarding();
    expect(screen.getByText("I'm learning English")).toBeInTheDocument();
    expect(screen.getByText('I teach English')).toBeInTheDocument();
    expect(screen.getByText('My child is learning')).toBeInTheDocument();
  });

  it('continue button is disabled until role is selected', () => {
    renderOnboarding();
    const continueBtn = screen.getByText(/Continue/i);
    expect(continueBtn.closest('button')).toBeDisabled();
  });

  it('continue button enables after selecting a role', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Student'));
    const continueBtn = screen.getByText(/Continue/i);
    expect(continueBtn.closest('button')).not.toBeDisabled();
  });

  it('renders progress dots (1 dot when no role selected)', () => {
    renderOnboarding();
    const dots = document.querySelectorAll('.onboarding-progress-dot');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it('first progress dot is active', () => {
    renderOnboarding();
    const dots = document.querySelectorAll('.onboarding-progress-dot');
    expect(dots[0].classList.contains('active')).toBe(true);
  });

  it('skip button is present', () => {
    renderOnboarding();
    expect(screen.getByText('Skip for now')).toBeInTheDocument();
  });

  // ── Student path ──────────────────────────────────────────────────────────

  it('clicking Student then Continue shows age selection', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Student'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText("What's your age group?")).toBeInTheDocument();
  });

  it('student age selection shows 4 age groups with phase names', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Student'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText('Little Ears')).toBeInTheDocument();
    expect(screen.getByText('Word Builders')).toBeInTheDocument();
    expect(screen.getByText('Story Makers')).toBeInTheDocument();
    expect(screen.getByText('Young Explorers')).toBeInTheDocument();
  });

  it('can navigate back from student age to role selection', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Student'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText(/Back/i));
    expect(screen.getByText('How will you use MinesMinis?')).toBeInTheDocument();
  });

  // ── Teacher path ──────────────────────────────────────────────────────────

  it('clicking Teacher then Continue shows school info', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Teacher'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText('About You')).toBeInTheDocument();
    expect(screen.getByText(/School/i)).toBeInTheDocument();
  });

  it('teacher About You shows grade level chips', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Teacher'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText('Pre-K')).toBeInTheDocument();
    expect(screen.getByText('Kindergarten')).toBeInTheDocument();
    expect(screen.getByText('1st Grade')).toBeInTheDocument();
  });

  it('teacher About You shows student count options', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Teacher'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText('1-10')).toBeInTheDocument();
    expect(screen.getByText('11-25')).toBeInTheDocument();
    expect(screen.getByText('26-40')).toBeInTheDocument();
    expect(screen.getByText('40+')).toBeInTheDocument();
  });

  // ── Parent path ───────────────────────────────────────────────────────────

  it('clicking Parent then Continue shows add child form', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Parent'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText('Add Your Child')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('parent add child form has name input and age select', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Parent'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByPlaceholderText("Child's name")).toBeInTheDocument();
    expect(screen.getByText('Age...')).toBeInTheDocument();
  });

  it('parent can see Add Another Child button', () => {
    renderOnboarding();
    fireEvent.click(screen.getByText('Parent'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText(/Add Another Child/i)).toBeInTheDocument();
  });
});
