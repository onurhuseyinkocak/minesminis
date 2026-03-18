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
    expect(screen.getByText(/Learn English with MinesMinis/i)).toBeInTheDocument();
  });

  it('shows glint characters in carousel', () => {
    renderLanding();
    // Glints are rendered in the carousel via glint-slide class
    const glintSlides = document.querySelectorAll('.glint-slide');
    expect(glintSlides.length).toBeGreaterThanOrEqual(1);
  });

  it('language toggle switches content to Turkish', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    expect(screen.getByText(/MinesMinis ile/i)).toBeInTheDocument();
  });

  it('language toggle switches back to English', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    fireEvent.click(screen.getByText('EN'));
    expect(screen.getByText(/Learn English with MinesMinis/i)).toBeInTheDocument();
  });

  it('CTA links to /login', () => {
    renderLanding();
    // The CTA button has Rocket icon + text, use a flexible match
    const ctaLinks = document.querySelectorAll('a.magic-btn--primary');
    const loginCta = Array.from(ctaLinks).find(a => a.getAttribute('href') === '/login');
    expect(loginCta).toBeTruthy();
    expect(loginCta?.textContent).toContain('Start the Adventure');
  });

  it('character cards show visible characters', () => {
    renderLanding();
    const body = document.body.textContent || '';
    // Carousel shows 3 visible glints at a time (prev, active, next)
    expect(body).toContain('Mimi');
    expect(body).toContain('Nova');
    expect(body).toContain('Sparky');
  });

  it('character cards show info', () => {
    renderLanding();
    const body = document.body.textContent || '';
    // The Landing carousel renders g.story and g.benefit (Turkish fields from GLINTS config)
    expect(body).toMatch(/Sitenin ana maskotu|Tum oyunlardan/);
  });

  it('feature cards render in English', () => {
    renderLanding();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
  });

  it('feature cards render in Turkish', () => {
    renderLanding();
    fireEvent.click(screen.getByText('TR'));
    expect(screen.getByText('Oyunlar')).toBeInTheDocument();
    expect(screen.getByText('Kelimeler')).toBeInTheDocument();
    expect(screen.getByText('Videolar')).toBeInTheDocument();
    expect(screen.getByText('Hikayeler')).toBeInTheDocument();
  });

  it('renders language toggle buttons', () => {
    renderLanding();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('TR')).toBeInTheDocument();
  });

  it('shows stats section with activity count', () => {
    renderLanding();
    // Stats section shows "6" for Activity Types
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Activity Types')).toBeInTheDocument();
  });

  it('social proof section exists', () => {
    renderLanding();
    const body = document.body.textContent || '';
    // Stats section contains "Words to Learn" or "400+"
    expect(body).toMatch(/Words to Learn|400\+/);
  });

  it('bottom CTA section exists', () => {
    renderLanding();
    const body = document.body.textContent || '';
    // Bottom section has "Ready for the Adventure?" or "Start the Adventure"
    expect(body).toMatch(/Ready for the Adventure|Start the Adventure/i);
  });
});
