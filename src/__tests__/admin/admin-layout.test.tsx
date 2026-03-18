import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockSignOut = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../config/firebase', () => ({ auth: {}, googleProvider: {}, analytics: null }));
vi.mock('../../config/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }), single: () => Promise.resolve({ data: null, error: null }), order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
        order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
        not: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})), GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn((_a: unknown, cb: (u: null) => void) => { cb(null); return vi.fn(); }),
  signInWithEmailAndPassword: vi.fn(), createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(), signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(() => Promise.resolve(null)), signOut: vi.fn(),
}));
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));
vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), loading: vi.fn(), dismiss: vi.fn() }),
  Toaster: () => null,
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'admin-1', email: 'a@t.com' }, userProfile: { display_name: 'Admin', role: 'teacher', settings: {} },
    isAdmin: true, loading: false, profileLoading: false, showProfileSetup: false,
    setShowProfileSetup: vi.fn(), hasSkippedSetup: false, setHasSkippedSetup: vi.fn(),
    setUserProfile: vi.fn(), refreshUserProfile: vi.fn(),
    signUp: vi.fn(), signIn: vi.fn(), signInWithGoogle: vi.fn(), signInWithGoogleRedirect: vi.fn(),
    signOut: mockSignOut,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' as const, effectiveTheme: 'light' as const, setTheme: vi.fn(), toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/GamificationContext', () => ({
  useGamification: () => ({
    stats: { xp: 0, weekly_xp: 0, level: 1, streakDays: 0, lastLoginDate: null, lastDailyClaim: null, lastWeeklyReset: null, badges: [], wordsLearned: 0, gamesPlayed: 0, videosWatched: 0, worksheetsCompleted: 0, dailyChallengesCompleted: 0, mascotId: 'mimi_dragon' },
    loading: false, addXP: vi.fn(), getXPForNextLevel: () => 100, getXPProgress: () => 0,
    checkStreak: vi.fn(), getStreakBonus: () => 0, canClaimDaily: false, claimDailyReward: vi.fn(),
    getNextClaimTime: () => null, getDailyRewardForDay: () => ({ day: 1, xp: 10 }),
    allBadges: [], hasBadge: () => false, checkAndAwardBadges: vi.fn(), trackActivity: vi.fn(),
    showLevelUp: false, newLevel: 1, dismissLevelUp: vi.fn(),
  }),
  GamificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/PremiumContext', () => ({
  usePremium: () => ({ isPremium: false, subscription: null, customerId: null, loading: false, checkPremiumStatus: vi.fn(), createCheckout: vi.fn(), openCustomerPortal: vi.fn() }),
  PremiumProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../services/userService', () => ({ userService: { getUserProfile: vi.fn(() => Promise.resolve(null)), createOrUpdateUserProfile: vi.fn(() => Promise.resolve()) } }));
vi.mock('../../data/fallbackData', () => ({ fallbackGames: [], fallbackVideos: [], fallbackWorksheets: [] }));
vi.mock('../../data/wordsData', () => ({ kidsWords: [], KidsWord: {} }));
vi.mock('../../data/videoStore', () => ({ videoStore: { getAll: () => [], getByGrade: () => [], fetchVideos: vi.fn(() => Promise.resolve([])), getVideos: () => [], subscribe: vi.fn(() => vi.fn()), saveVideos: vi.fn() }, Video: {} }));
vi.mock('../../data/gameStore', () => ({ gameStore: { getAll: () => [], getGames: () => [], saveGames: vi.fn(), fetchGames: vi.fn(() => Promise.resolve([])), subscribe: vi.fn(() => vi.fn()) } }));
vi.mock('../../data/wordStore', () => ({ wordStore: { getAll: () => [], getWords: () => [], saveWords: vi.fn(), fetchWords: vi.fn(() => Promise.resolve([])), subscribe: vi.fn(() => vi.fn()) } }));
vi.mock('../../data/videosData', () => ({ gradeInfo: {} }));
vi.mock('../../data/worksheetsData', () => ({ Worksheet: {}, categories: [], grades: [] }));
vi.mock('../../utils/adminApi', () => ({ adminFetch: vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })), getAdminApiBase: () => 'http://localhost:3001' }));
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, LineChart: ({ children }: any) => <div>{children}</div>, Line: () => null, BarChart: ({ children }: any) => <div>{children}</div>, Bar: () => null, PieChart: ({ children }: any) => <div>{children}</div>, Pie: () => null, Cell: () => null, XAxis: () => null, YAxis: () => null, CartesianGrid: () => null, Tooltip: () => null, Legend: () => null, Area: () => null, AreaChart: ({ children }: any) => <div>{children}</div> }));
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_t, prop) => typeof prop === 'string' ? React.forwardRef(({ children, ...p }: any, ref: any) => { const fp: Record<string, unknown> = {}; for (const [k, v] of Object.entries(p)) { if (!k.startsWith('while') && !k.startsWith('animate') && !k.startsWith('initial') && !k.startsWith('exit') && !k.startsWith('variants') && !k.startsWith('transition') && !k.startsWith('layout') && k !== 'custom' && k !== 'whileInView' && k !== 'viewport') fp[k] = v; } return React.createElement(prop as string, { ...fp, ref }, children); }) : undefined }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => false, useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
}));

// ── Helpers ────────────────────────────────────────────────────────────────

let AdminLayout: React.FC;

beforeEach(async () => {
  vi.clearAllMocks();
  sessionStorage.clear();
  const mod = await import('../../pages/Admin/AdminLayout');
  AdminLayout = mod.default;
});

const renderLayout = (route = '/admin') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AdminLayout />
    </MemoryRouter>
  );

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AdminLayout - Login Screen', () => {
  it('shows login screen when not authenticated', () => {
    renderLayout();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Admin password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows split-screen login with visual panel', () => {
    renderLayout();
    expect(screen.getByText('MinesMinis')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });

  it('shows error on wrong password', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 403 }));
    renderLayout();
    const input = screen.getByPlaceholderText('Admin password');
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Invalid password. Please try again.')).toBeInTheDocument();
    });
    vi.restoreAllMocks();
  });

  it('clears error when typing after failed login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 403 }));
    renderLayout();
    const input = screen.getByPlaceholderText('Admin password');
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Invalid password. Please try again.')).toBeInTheDocument();
    });
    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.queryByText('Invalid password. Please try again.')).not.toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('authenticates with correct password and shows admin shell', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    renderLayout();
    const input = screen.getByPlaceholderText('Admin password');
    fireEvent.change(input, { target: { value: 'Wealthy*520' } });
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
    });
    expect(sessionStorage.getItem('admin_session')).toBe('1');
    vi.restoreAllMocks();
  });

  it('supports Enter key to submit password', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    renderLayout();
    const input = screen.getByPlaceholderText('Admin password');
    fireEvent.change(input, { target: { value: 'Wealthy*520' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(sessionStorage.getItem('admin_session')).toBe('1');
    });
    vi.restoreAllMocks();
  });

  it('uses adm-login CSS classes (no old admin-login classes)', () => {
    const { container } = renderLayout();
    expect(container.querySelector('.adm-login')).toBeInTheDocument();
    expect(container.querySelector('.adm-login-visual')).toBeInTheDocument();
    expect(container.querySelector('.adm-login-form-side')).toBeInTheDocument();
    expect(container.querySelector('.adm-login-box')).toBeInTheDocument();
    // No old classes
    expect(container.querySelector('.admin-login-screen')).toBeNull();
    expect(container.querySelector('.admin-login-card')).toBeNull();
  });
});

describe('AdminLayout - Shell (authenticated)', () => {
  beforeEach(() => {
    sessionStorage.setItem('admin_session', '1');
  });

  it('renders adm-shell container', () => {
    const { container } = renderLayout();
    expect(container.querySelector('.adm-shell')).toBeInTheDocument();
  });

  it('renders sidebar with brand', () => {
    renderLayout();
    const brands = screen.getAllByText('MinesMinis');
    expect(brands.length).toBeGreaterThanOrEqual(1);
  });

  it('renders sidebar navigation links', () => {
    renderLayout();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    // "Content" appears as both a nav section label and a nav link
    expect(screen.getAllByText('Content').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Curriculum')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Worksheets')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Mimi (AI Chat)')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
    expect(screen.getByText('Error Monitor')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders nav using adm-nav-link class', () => {
    const { container } = renderLayout();
    const navLinks = container.querySelectorAll('.adm-nav-link');
    expect(navLinks.length).toBe(14); // 14 nav items
  });

  it('does NOT render old sidebar classes', () => {
    const { container } = renderLayout();
    expect(container.querySelector('.admin-sidebar')).toBeNull();
    expect(container.querySelector('.admin-layout')).toBeNull();
    expect(container.querySelector('.admin-main')).toBeNull();
    expect(container.querySelector('.sidebar-nav')).toBeNull();
  });

  it('renders site link and logout button', () => {
    renderLayout();
    expect(screen.getByText('View Site')).toBeInTheDocument();
    const logoutBtns = screen.getAllByText(/Sign Out/);
    expect(logoutBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('renders adm-body content area', () => {
    const { container } = renderLayout();
    expect(container.querySelector('.adm-body')).toBeInTheDocument();
  });

  it('renders hamburger button for mobile', () => {
    const { container } = renderLayout();
    expect(container.querySelector('.adm-hamburger')).toBeInTheDocument();
  });

  it('opens sidebar when hamburger is clicked', () => {
    const { container } = renderLayout();
    const hamburger = container.querySelector('.adm-hamburger') as HTMLElement;
    fireEvent.click(hamburger);
    // Sidebar should have open class
    expect(container.querySelector('.adm-sidebar.open')).toBeInTheDocument();
    // Overlay should appear
    expect(container.querySelector('.adm-overlay.open')).toBeInTheDocument();
  });

  it('closes sidebar when overlay is clicked', () => {
    const { container } = renderLayout();
    const hamburger = container.querySelector('.adm-hamburger') as HTMLElement;
    fireEvent.click(hamburger);
    expect(container.querySelector('.adm-sidebar.open')).toBeInTheDocument();
    const overlay = container.querySelector('.adm-overlay.open') as HTMLElement;
    fireEvent.click(overlay);
    expect(container.querySelector('.adm-sidebar.open')).toBeNull();
  });

  it('renders routes - dashboard loads by default', () => {
    renderLayout();
    // Dashboard content should be present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});

describe('AdminLayout - Logout', () => {
  it('clears session and calls signOut on logout', () => {
    sessionStorage.setItem('admin_session', '1');
    renderLayout();
    // Find the Sign Out button in sidebar footer
    const logoutBtns = screen.getAllByText(/Sign Out/);
    // Mock window.location.href
    const originalHref = window.location.href;
    delete (window as any).location;
    (window as any).location = { href: originalHref };

    fireEvent.click(logoutBtns[0]);

    expect(sessionStorage.getItem('admin_session')).toBeNull();
    expect(mockSignOut).toHaveBeenCalled();
    expect(window.location.href).toBe('/admin');
  });
});
