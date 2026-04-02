import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'en' as const,
    setLang: vi.fn(),
    t: (key: string) => key,
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

vi.mock('../../components/LottieCharacter', () => ({
  default: () => <div data-testid="lottie-character" />,
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
        return React.forwardRef(({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.Ref<unknown>) => {
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
  it('renders hero heading', () => {
    renderLanding();
    expect(screen.getByText(/Learning English/)).toBeInTheDocument();
    expect(screen.getByText(/can be this fun/)).toBeInTheDocument();
  });

  it('renders hero subtitle with phonics description', () => {
    renderLanding();
    expect(screen.getByText(/Just 10 minutes a day/)).toBeInTheDocument();
  });

  it('renders Start Free CTA link', () => {
    renderLanding();
    const startLinks = screen.getAllByText('Start Free');
    expect(startLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders How It Works link', () => {
    renderLanding();
    expect(screen.getByText('How It Works?')).toBeInTheDocument();
  });

  it('navbar has Log In link pointing to /login', () => {
    renderLanding();
    const loginLink = screen.getAllByText('Log In').find(
      (el) => el.closest('a')?.getAttribute('href') === '/login'
    );
    expect(loginLink).toBeTruthy();
  });

  it('renders MinesMinis brand name in navbar', () => {
    renderLanding();
    const matches = screen.getAllByText('MinesMinis');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders BETA badge', () => {
    renderLanding();
    expect(screen.getByText('BETA')).toBeInTheDocument();
  });
});
