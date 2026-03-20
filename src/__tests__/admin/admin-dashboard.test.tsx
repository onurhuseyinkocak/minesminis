import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../config/firebase', () => ({ auth: {}, googleProvider: {}, analytics: null }));

const mockSelect = (..._args: unknown[]) => ({
  eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }), single: () => Promise.resolve({ data: null, error: null }), order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
  order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
  not: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
  limit: () => Promise.resolve({ data: [], error: null }),
});

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: () => ({
      select: mockSelect,
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
    signUp: vi.fn(), signIn: vi.fn(), signInWithGoogle: vi.fn(), signInWithGoogleRedirect: vi.fn(), signOut: vi.fn(),
  }),
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' as const, effectiveTheme: 'light' as const, setTheme: vi.fn(), toggleTheme: vi.fn() }),
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
}));

vi.mock('../../data/fallbackData', () => ({ fallbackGames: [{ id: '1' }, { id: '2' }], fallbackVideos: [{ id: '1' }], fallbackWorksheets: [{ id: '1' }, { id: '2' }, { id: '3' }] }));
vi.mock('../../data/wordsData', () => ({ kidsWords: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }] }));

vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_t, prop) => typeof prop === 'string' ? React.forwardRef(({ children, ...p }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.Ref<unknown>) => { const fp: Record<string, unknown> = {}; for (const [k, v] of Object.entries(p)) { if (!k.startsWith('while') && !k.startsWith('animate') && !k.startsWith('initial') && !k.startsWith('exit') && !k.startsWith('variants') && !k.startsWith('transition') && !k.startsWith('layout') && k !== 'custom' && k !== 'whileInView' && k !== 'viewport') fp[k] = v; } return React.createElement(prop as string, { ...fp, ref }, children); }) : undefined }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ── Helpers ────────────────────────────────────────────────────────────────

let AdminDashboard: React.FC;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../pages/Admin/AdminDashboard');
  AdminDashboard = mod.default;
});

const renderDashboard = async () => {
  const result = render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
  await waitFor(() => {
    expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
  });
  return result;
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AdminDashboard - Layout and Structure', () => {
  it('renders page title', async () => {
    await renderDashboard();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders page subtitle', async () => {
    await renderDashboard();
    expect(screen.getByText(/Overview of your MinesMinis platform/)).toBeInTheDocument();
  });

  it('uses adm-dash class as root container', async () => {
    const { container } = await renderDashboard();
    expect(container.querySelector('.adm-dash')).toBeInTheDocument();
  });

  it('uses adm-dash-row grid layout', async () => {
    const { container } = await renderDashboard();
    const rows = container.querySelectorAll('.adm-dash-row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it('renders metric cards with adm-metric-card class', async () => {
    const { container } = await renderDashboard();
    const metrics = container.querySelectorAll('.adm-metric-card');
    expect(metrics.length).toBe(4);
  });

  it('renders metric labels for key stats', async () => {
    await renderDashboard();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Today')).toBeInTheDocument();
    expect(screen.getByText('Premium Users')).toBeInTheDocument();
    expect(screen.getByText('Total Content')).toBeInTheDocument();
  });

  it('renders content inventory with correct labels', async () => {
    await renderDashboard();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Worksheets')).toBeInTheDocument();
  });

  it('renders fallback counts when supabase returns empty', async () => {
    await renderDashboard();
    // fallback: 2 games, 1 video, 4 words, 3 worksheets
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders Recent Signups section', async () => {
    await renderDashboard();
    expect(screen.getByText('Recent Signups')).toBeInTheDocument();
  });

  it('renders empty state when no recent users', async () => {
    await renderDashboard();
    expect(screen.getByText('No recent users')).toBeInTheDocument();
  });

  it('renders refresh button', async () => {
    const { container } = await renderDashboard();
    const refreshBtns = container.querySelectorAll('.adm-action-btn');
    expect(refreshBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('renders total content count', async () => {
    await renderDashboard();
    // 2 games + 1 video + 4 words + 3 worksheets = 10
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders cards with adm-card class', async () => {
    const { container } = await renderDashboard();
    const cards = container.querySelectorAll('.adm-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('renders section headers with adm-card-header class', async () => {
    const { container } = await renderDashboard();
    const headers = container.querySelectorAll('.adm-card-header');
    expect(headers.length).toBeGreaterThanOrEqual(2);
  });

  it('does NOT contain old dark-theme inline styles', async () => {
    const { container } = await renderDashboard();
    const html = container.innerHTML;
    expect(html).not.toContain('#0f172a');
    expect(html).not.toContain('rgba(30, 41, 59');
    expect(html).not.toContain('rgba(30,41,59');
  });

  it('does NOT use old CSS classes', async () => {
    const { container } = await renderDashboard();
    expect(container.querySelector('.admin-dashboard')).toBeNull();
    expect(container.querySelector('.stats-grid')).toBeNull();
    expect(container.querySelector('.stat-card')).toBeNull();
    expect(container.querySelector('.dashboard-section')).toBeNull();
    expect(container.querySelector('.ax-page')).toBeNull();
    expect(container.querySelector('.ax-bento')).toBeNull();
    expect(container.querySelector('.ax-metric')).toBeNull();
  });
});

describe('AdminDashboard - Design Validation', () => {
  it('metric values use adm-metric-value class', async () => {
    const { container } = await renderDashboard();
    const vals = container.querySelectorAll('.adm-metric-value');
    expect(vals.length).toBe(4);
  });

  it('metric labels use adm-metric-label class', async () => {
    const { container } = await renderDashboard();
    const labels = container.querySelectorAll('.adm-metric-label');
    expect(labels.length).toBe(4);
  });

  it('metric icons use adm-metric-icon class', async () => {
    const { container } = await renderDashboard();
    const icons = container.querySelectorAll('.adm-metric-icon');
    expect(icons.length).toBe(4);
  });

  it('empty state uses adm-empty class', async () => {
    const { container } = await renderDashboard();
    const empties = container.querySelectorAll('.adm-empty');
    expect(empties.length).toBe(1);
  });

  it('renders User Growth chart section', async () => {
    await renderDashboard();
    expect(screen.getByText('User Growth')).toBeInTheDocument();
  });

  it('renders Content Inventory section', async () => {
    await renderDashboard();
    expect(screen.getByText('Content Inventory')).toBeInTheDocument();
  });

  it('renders Quick Actions section', async () => {
    await renderDashboard();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('renders System Health section', async () => {
    await renderDashboard();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('renders system health statuses', async () => {
    await renderDashboard();
    expect(screen.getByText('API Server')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('CDN')).toBeInTheDocument();
  });
});
