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
    expect(screen.getByText('Montessori + Phonics English Learning')).toBeInTheDocument();
  });

  it('shows three role CTA buttons', () => {
    renderLanding();
    expect(screen.getAllByText(/I'm a Student/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/I'm a Teacher/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/I'm a Parent/i).length).toBeGreaterThanOrEqual(1);
  });

  it('language toggle switches content to Turkish', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    expect(screen.getByText('Montessori + Fonetik \u0130ngilizce \u00d6\u011frenme')).toBeInTheDocument();
  });

  it('language toggle switches back to English', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    fireEvent.click(screen.getByText('EN'));
    expect(screen.getByText('Montessori + Phonics English Learning')).toBeInTheDocument();
  });

  it('renders language toggle buttons', () => {
    renderLanding();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('TR')).toBeInTheDocument();
  });

  it('renders How It Works section with 4 phases', () => {
    renderLanding();
    // "How It Works" appears in both nav and section heading
    expect(screen.getAllByText('How It Works').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Little Ears')).toBeInTheDocument();
    expect(screen.getByText('Word Builders')).toBeInTheDocument();
    expect(screen.getByText('Story Makers')).toBeInTheDocument();
    expect(screen.getByText('Young Explorers')).toBeInTheDocument();
  });

  it('renders For Each Role tabbed section', () => {
    renderLanding();
    expect(screen.getByText('Built for Everyone')).toBeInTheDocument();
    expect(screen.getByText('For Students')).toBeInTheDocument();
    expect(screen.getByText('For Teachers')).toBeInTheDocument();
    expect(screen.getByText('For Parents')).toBeInTheDocument();
  });

  it('role tabs switch content', () => {
    renderLanding();
    // Default tab is student
    expect(screen.getByText('42 English sounds with fun actions')).toBeInTheDocument();
    // Click teacher tab
    fireEvent.click(screen.getByText('For Teachers'));
    expect(screen.getByText('Free classroom management tool')).toBeInTheDocument();
    // Click parent tab
    fireEvent.click(screen.getByText('For Parents'));
    expect(screen.getByText(/See exactly which sounds your child has mastered/)).toBeInTheDocument();
  });

  it('renders Methodology section', () => {
    renderLanding();
    expect(screen.getByText('Research-Backed Methods That Work')).toBeInTheDocument();
    expect(screen.getByText('Synthetic Phonics')).toBeInTheDocument();
    expect(screen.getByText('Montessori Learning')).toBeInTheDocument();
    expect(screen.getByText('Total Physical Response')).toBeInTheDocument();
    expect(screen.getByText('Comprehensible Input')).toBeInTheDocument();
    expect(screen.getByText('Spaced Repetition')).toBeInTheDocument();
  });

  it('shows stats section with correct numbers', () => {
    renderLanding();
    // Stats numbers may appear in multiple places, so use getAllByText
    expect(screen.getAllByText('42').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('English Sounds')).toBeInTheDocument();
    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Learning Phases')).toBeInTheDocument();
    expect(screen.getByText('400+')).toBeInTheDocument();
    expect(screen.getByText('Words to Learn')).toBeInTheDocument();
  });

  it('shows glint characters in carousel', () => {
    renderLanding();
    const glintSlides = document.querySelectorAll('.glint-slide');
    expect(glintSlides.length).toBeGreaterThanOrEqual(1);
  });

  it('bottom CTA section exists with role buttons', () => {
    renderLanding();
    expect(screen.getByText('Ready to Start?')).toBeInTheDocument();
  });

  it('CTA role buttons link to /login', () => {
    renderLanding();
    const roleBtns = document.querySelectorAll('a.magic-role-btn');
    expect(roleBtns.length).toBeGreaterThanOrEqual(3);
    roleBtns.forEach((btn) => {
      expect(btn.getAttribute('href')).toBe('/login');
    });
  });

  it('navbar login button links to /login', () => {
    renderLanding();
    const loginLink = screen.getAllByText('Login').find(
      (el) => el.closest('a')?.getAttribute('href') === '/login'
    );
    expect(loginLink).toBeTruthy();
  });
});
