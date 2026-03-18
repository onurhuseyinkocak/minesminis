import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mock setup ──────────────────────────────────────────────────────────────

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
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light' as const,
    effectiveTheme: 'light' as const,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('../../services/mascotRoaming', () => ({
  mascotRoaming: {
    getCurrentState: () => ({ position: { x: 50, y: 50 }, state: 'idle', bubble: null }),
    onChange: () => vi.fn(),
    startRoaming: vi.fn(),
    stopRoaming: vi.fn(),
    updateMousePosition: vi.fn(),
    triggerCelebration: vi.fn(),
    onHover: vi.fn(),
  },
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
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
  useInView: () => true,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useTransform: () => ({ get: () => 0 }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

let Landing: React.FC;

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../pages/Landing');
  Landing = mod.default;
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Landing Page', () => {
  it('renders hero title in default language (EN)', () => {
    renderLanding();
    expect(screen.getByText('English Learning That Actually Works')).toBeInTheDocument();
  });

  it('shows audience tabs: Students, Teachers, Parents', () => {
    renderLanding();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('Parents')).toBeInTheDocument();
  });

  it('language toggle switches content to Turkish', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    expect(screen.getByText('Gercekten Ise Yarayan Ingilizce Ogrenme')).toBeInTheDocument();
  });

  it('language toggle switches back to English', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    fireEvent.click(screen.getByText('EN'));
    expect(screen.getByText('English Learning That Actually Works')).toBeInTheDocument();
  });

  it('renders language toggle buttons', () => {
    renderLanding();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('TR')).toBeInTheDocument();
  });

  it('renders method section with 4 phase cards', () => {
    renderLanding();
    expect(screen.getByText('A proven path to English fluency')).toBeInTheDocument();
    expect(screen.getByText('Sound Discovery')).toBeInTheDocument();
    expect(screen.getByText('Word Building')).toBeInTheDocument();
    expect(screen.getByText('Reading & Stories')).toBeInTheDocument();
    expect(screen.getByText('Independence')).toBeInTheDocument();
  });

  it('renders audience section with tab content', () => {
    renderLanding();
    expect(screen.getByText('Built for everyone who cares about learning')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('Parents')).toBeInTheDocument();
  });

  it('audience tabs switch content', () => {
    renderLanding();
    // Default tab is students
    expect(screen.getByText('42 phonics sounds with actions')).toBeInTheDocument();
    // Click teacher tab
    fireEvent.click(screen.getByText('Teachers'));
    expect(screen.getByText('Free classroom management')).toBeInTheDocument();
    // Click parent tab
    fireEvent.click(screen.getByText('Parents'));
    expect(screen.getByText('Real-time learning analytics')).toBeInTheDocument();
  });

  it('shows stats section with correct numbers', () => {
    renderLanding();
    expect(screen.getAllByText('42').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Phonics Sounds')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('Decodable Books')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Song Lessons')).toBeInTheDocument();
    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Learning Phases')).toBeInTheDocument();
  });

  it('bottom CTA section exists with Create Free Account', () => {
    renderLanding();
    expect(screen.getByText('Create Free Account')).toBeInTheDocument();
  });

  it('CTA section has correct title', () => {
    renderLanding();
    expect(screen.getByText("Ready to start your child's English journey?")).toBeInTheDocument();
  });

  it('navbar login button links to /login', () => {
    renderLanding();
    const loginLink = screen.getAllByText('Login').find(
      (el) => el.closest('a')?.getAttribute('href') === '/login'
    );
    expect(loginLink).toBeTruthy();
  });

  it('hero has Start Learning CTA', () => {
    renderLanding();
    expect(screen.getByText('Start Learning')).toBeInTheDocument();
  });

  it('hero has See How It Works link', () => {
    renderLanding();
    expect(screen.getByText('See How It Works')).toBeInTheDocument();
  });
});
