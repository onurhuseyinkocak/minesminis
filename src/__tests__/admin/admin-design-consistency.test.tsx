import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Shared Mocks ─────────────────────────────────────────────────────────────

vi.mock('../../config/firebase', () => ({ auth: {}, googleProvider: {}, analytics: null }));
vi.mock('../../config/supabase', () => ({
  supabase: {
    from: () => ({
      select: (..._args: unknown[]) => ({
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
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({})), GoogleAuthProvider: vi.fn(), onAuthStateChanged: vi.fn((_a: unknown, cb: (u: null) => void) => { cb(null); return vi.fn(); }), signInWithEmailAndPassword: vi.fn(), createUserWithEmailAndPassword: vi.fn(), signInWithPopup: vi.fn(), signInWithRedirect: vi.fn(), getRedirectResult: vi.fn(() => Promise.resolve(null)), signOut: vi.fn() }));
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));
vi.mock('react-hot-toast', () => ({ default: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), loading: vi.fn(), dismiss: vi.fn() }), Toaster: () => null }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'a1', email: 'a@t.com' }, userProfile: { display_name: 'Admin', role: 'teacher', settings: {} }, isAdmin: true, loading: false, profileLoading: false, showProfileSetup: false, setShowProfileSetup: vi.fn(), hasSkippedSetup: false, setHasSkippedSetup: vi.fn(), setUserProfile: vi.fn(), refreshUserProfile: vi.fn(), signUp: vi.fn(), signIn: vi.fn(), signInWithGoogle: vi.fn(), signInWithGoogleRedirect: vi.fn(), signOut: vi.fn() }) }));
vi.mock('../../contexts/ThemeContext', () => ({ useTheme: () => ({ theme: 'light' as const, effectiveTheme: 'light' as const, setTheme: vi.fn(), toggleTheme: vi.fn() }) }));
vi.mock('../../contexts/GamificationContext', () => ({ useGamification: () => ({ stats: { xp: 0, weekly_xp: 0, level: 1, streakDays: 0, lastLoginDate: null, lastDailyClaim: null, lastWeeklyReset: null, badges: [], wordsLearned: 0, gamesPlayed: 0, videosWatched: 0, worksheetsCompleted: 0, dailyChallengesCompleted: 0, mascotId: 'mimi_dragon' }, loading: false, addXP: vi.fn(), getXPForNextLevel: () => 100, getXPProgress: () => 0, checkStreak: vi.fn(), getStreakBonus: () => 0, canClaimDaily: false, claimDailyReward: vi.fn(), getNextClaimTime: () => null, getDailyRewardForDay: () => ({ day: 1, xp: 10 }), allBadges: [], hasBadge: () => false, checkAndAwardBadges: vi.fn(), trackActivity: vi.fn(), showLevelUp: false, newLevel: 1, dismissLevelUp: vi.fn() }) }));
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

const DARK_THEME_PATTERNS = [
  '#0f172a',   // old dark bg
  'rgba(15,23,42',  // old dark bg rgba
  'rgba(15, 23, 42', // old dark bg rgba (spaced)
  'rgba(30,41,59',   // old dark card bg
  'rgba(30, 41, 59', // old dark card bg (spaced)
];

const OLD_ADMIN_CLASSES = [
  'admin-sidebar',
  'admin-layout',
  'admin-main',
  'sidebar-nav',
  'sidebar-header',
  'sidebar-footer',
  'mobile-overlay',
  'admin-mobile-header',
  'admin-login-screen',
  'admin-login-card',
];

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => { vi.clearAllMocks(); });

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Admin Design Consistency - No Dark Theme Artifacts', () => {
  const subPages = [
    { name: 'GamesManager', path: '../../pages/Admin/GamesManager' },
    { name: 'VideosManager', path: '../../pages/Admin/VideosManager' },
    { name: 'WordsManager', path: '../../pages/Admin/WordsManager' },
    { name: 'WorksheetsManager', path: '../../pages/Admin/WorksheetsManager' },
    { name: 'UsersManager', path: '../../pages/Admin/UsersManager' },
    { name: 'PremiumManager', path: '../../pages/Admin/PremiumManager' },
    { name: 'ReportsManager', path: '../../pages/Admin/ReportsManager' },
    { name: 'SEOManager', path: '../../pages/Admin/SEOManager' },
    { name: 'BlogManager', path: '../../pages/Admin/BlogManager' },
    { name: 'ErrorMonitor', path: '../../pages/Admin/ErrorMonitor' },
    { name: 'SiteSettings', path: '../../pages/Admin/SiteSettings' },
  ];

  for (const page of subPages) {
    it(`${page.name} - no dark theme background artifacts`, async () => {
      const mod = await import(page.path);
      const Component = mod.default;
      const { container } = wrap(<Component />);
      const html = container.innerHTML;
      for (const pattern of DARK_THEME_PATTERNS) {
        expect(html, `Found dark pattern "${pattern}" in ${page.name}`).not.toContain(pattern);
      }
    });

    it(`${page.name} - no old admin CSS classes`, async () => {
      const mod = await import(page.path);
      const Component = mod.default;
      const { container } = wrap(<Component />);
      for (const cls of OLD_ADMIN_CLASSES) {
        expect(container.querySelector(`.${cls}`), `Found old class ".${cls}" in ${page.name}`).toBeNull();
      }
    });

    it(`${page.name} - renders without crash`, async () => {
      const mod = await import(page.path);
      const Component = mod.default;
      const { container } = wrap(<Component />);
      expect(container.innerHTML.length).toBeGreaterThan(10);
    });
  }
});

describe('Admin Design Consistency - No Inline Dark Styles in Sub-Pages', () => {
  it('SEOManager has no dark code block backgrounds', async () => {
    const mod = await import('../../pages/Admin/SEOManager');
    const { container } = wrap(<mod.default />);
    const pres = container.querySelectorAll('pre');
    pres.forEach((pre) => {
      const bg = pre.style.background || pre.style.backgroundColor;
      expect(bg, 'Pre block has dark background').not.toContain('rgba(15');
      expect(bg, 'Pre block has dark background').not.toContain('#1e293b');
    });
  });

  it('ErrorMonitor has no dark code block backgrounds', async () => {
    const mod = await import('../../pages/Admin/ErrorMonitor');
    const { container } = wrap(<mod.default />);
    // ErrorMonitor may not have pre elements visible unless there are errors
    const html = container.innerHTML;
    // Stack trace pre blocks should use light background
    expect(html).not.toContain('background: #1e293b');
    expect(html).not.toContain("background: '#1e293b'");
  });

  it('ReportsManager has no data-theme="dark" selectors', async () => {
    const mod = await import('../../pages/Admin/ReportsManager');
    const { container } = wrap(<mod.default />);
    // Check the inline style element
    const styleEls = container.querySelectorAll('style');
    styleEls.forEach((s) => {
      expect(s.textContent).not.toContain('[data-theme="dark"]');
    });
  });
});

describe('Admin Design Consistency - CSS File Validation', () => {
  it('Admin.css uses ax- prefix for core classes', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/Admin.css', 'utf-8');
    expect(css).toContain('.ax-shell');
    expect(css).toContain('.ax-topbar');
    expect(css).toContain('.ax-nav');
    expect(css).toContain('.ax-body');
    expect(css).toContain('.ax-bento');
    expect(css).toContain('.ax-card');
    expect(css).toContain('.ax-metric');
    expect(css).toContain('.ax-login');
    expect(css).toContain('.ax-drawer');
    expect(css).toContain('.ax-strip');
  });

  it('Admin.css does NOT contain old sidebar/dark classes as primary selectors', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/Admin.css', 'utf-8');
    // These should not exist as standalone class definitions
    expect(css).not.toContain('.admin-sidebar {');
    expect(css).not.toContain('.admin-layout {');
    expect(css).not.toContain('.admin-main {');
    expect(css).not.toContain('.admin-mobile-header {');
    expect(css).not.toContain('.mobile-overlay {');
  });

  it('Admin.css uses light theme colors', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/Admin.css', 'utf-8');
    // Shell background should be light
    expect(css).toContain('background: #f0f2f5');
    // Cards should be white
    expect(css).toContain('background: #fff');
    // Accent color
    expect(css).toContain('#6c5ce7');
  });

  it('Admin.css has responsive breakpoints', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/Admin.css', 'utf-8');
    expect(css).toContain('@media (max-width: 1024px)');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('@media (max-width: 480px)');
  });
});
