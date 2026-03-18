import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mock setup ──────────────────────────────────────────────────────────────

const mockSignIn = vi.fn(() => Promise.resolve({ error: null }));
const mockSignUp = vi.fn(() => Promise.resolve({ error: null }));
const mockSignInWithGoogle = vi.fn(() => Promise.resolve({ error: null }));

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
  sendPasswordResetEmail: vi.fn(),
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
    signUp: mockSignUp,
    signIn: mockSignIn,
    signInWithGoogle: mockSignInWithGoogle,
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

let Login: React.FC;

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../pages/Login');
  Login = mod.default;
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Login Page', () => {
  it('renders login form by default', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('shows email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    const pwFields = screen.getAllByPlaceholderText(/••••••••/);
    expect(pwFields.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Sign In and Create Account tabs', () => {
    renderLogin();
    // "Sign In" appears in both tab and submit button, so use getAllByText
    expect(screen.getAllByText('Sign In').length).toBeGreaterThanOrEqual(1);
    // "Create Account" appears in tab
    expect(screen.getAllByText('Create Account').length).toBeGreaterThanOrEqual(1);
  });

  it('switches to signup form on Create Account tab click', async () => {
    renderLogin();
    // Click the first "Create Account" (the tab)
    const joinTabs = screen.getAllByText('Create Account');
    fireEvent.click(joinTabs[0]);
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('switches back to login form on Sign In tab click', () => {
    renderLogin();
    fireEvent.click(screen.getAllByText('Create Account')[0]);
    fireEvent.click(screen.getAllByText('Sign In')[0]);
    expect(screen.queryByText('Confirm Password')).not.toBeInTheDocument();
  });

  it('has required email field', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('has password field with minLength 6', () => {
    renderLogin();
    const pwInputs = screen.getAllByPlaceholderText(/••••••••/);
    const pwInput = pwInputs[0];
    expect(pwInput).toHaveAttribute('minLength', '6');
  });

  it('shows confirm password in signup mode', () => {
    renderLogin();
    fireEvent.click(screen.getAllByText('Create Account')[0]);
    const pwFields = screen.getAllByPlaceholderText(/••••••••/);
    expect(pwFields.length).toBe(2);
  });

  it('renders Google login button', () => {
    renderLogin();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('calls signInWithGoogle on Google button click', async () => {
    renderLogin();
    const googleBtn = screen.getByText('Continue with Google');
    fireEvent.click(googleBtn);
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('shows language toggle (EN | TR)', () => {
    renderLogin();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('TR')).toBeInTheDocument();
  });

  it('switches language to Turkish', () => {
    renderLogin();
    fireEvent.click(screen.getByText('TR'));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Tekrar Hosgeldin/i);
  });

  it('switches language back to English', () => {
    renderLogin();
    fireEvent.click(screen.getByText('TR'));
    fireEvent.click(screen.getByText('EN'));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('shows "or" divider between form and Google', () => {
    renderLogin();
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  it('shows hint text with link to sign up', () => {
    renderLogin();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('shows hint text with link to login in signup mode', () => {
    renderLogin();
    fireEvent.click(screen.getAllByText('Create Account')[0]);
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it('submit button shows Sign In text in login mode', () => {
    renderLogin();
    const submitBtns = screen.getAllByRole('button');
    const loginSubmit = submitBtns.find(b => b.getAttribute('type') === 'submit');
    expect(loginSubmit?.textContent).toContain('Sign In');
  });

  it('submit button shows Create Account text in signup mode', () => {
    renderLogin();
    fireEvent.click(screen.getAllByText('Create Account')[0]);
    const submitBtns = screen.getAllByRole('button');
    const signupSubmit = submitBtns.find(b => b.getAttribute('type') === 'submit');
    expect(signupSubmit?.textContent).toContain('Create Account');
  });

  it('shows side panel with feature list', () => {
    renderLogin();
    expect(screen.getByText('MinesMinis')).toBeInTheDocument();
    expect(screen.getByText('English learning that works')).toBeInTheDocument();
    expect(screen.getByText('42 phonics sounds')).toBeInTheDocument();
    expect(screen.getByText('Research-backed method')).toBeInTheDocument();
    expect(screen.getByText('Free to start')).toBeInTheDocument();
  });
});
