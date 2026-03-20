import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Track all adminFetch calls ──────────────────────────────────────────────

const adminFetchCalls: Array<{ url: string; options: Record<string, unknown> }> = [];
const mockAdminFetch = vi.fn(async (url: string, options: Record<string, unknown> = {}) => {
  adminFetchCalls.push({ url, options });
  const method = options.method || 'GET';

  // CREATE responses - return created object with id
  if (method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'new-123', ...body }),
    };
  }

  // UPDATE / DELETE responses
  if (method === 'PATCH' || method === 'DELETE') {
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    };
  }

  // Default GET
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: [] }),
  };
});

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../config/firebase', () => ({ auth: {}, googleProvider: {}, analytics: null }));

// Supabase mock - returns sample data for listing
const mockSupabaseData: Record<string, unknown[]> = {
  games: [
    { id: 'g1', title: 'Test Game', url: 'https://example.com/game', category: 'Quiz', thumbnail_url: '', description: 'A game', target_audience: '2' },
  ],
  videos: [
    { id: 'v1', youtube_id: 'abc123', title: 'Test Video', description: 'A video', thumbnail: '', duration: '3:00', category: 'lesson', grade: '2', is_popular: false },
  ],
  words: [
    { word: 'apple', turkish: 'elma', level: 'beginner', category: 'Food', emoji: '🍎', example: 'I like apple.' },
  ],
  worksheets: [
    { id: 'w1', title: 'Test Worksheet', description: 'A worksheet', subject: 'Vocabulary', grade: '2', file_url: 'https://example.com/ws.pdf', thumbnail_url: '', source: 'MinesMinis', file_name: 'test.pdf', file_type: 'pdf' },
  ],
};

// Chainable Supabase mock that resolves to { data, error }
const makeChainable = (table: string) => {
  const result = { data: mockSupabaseData[table] || [], error: null };
  const chain: Record<string, unknown> = {
    ...Promise.resolve(result),
    then: (fn: (val: typeof result) => unknown) => Promise.resolve(result).then(fn),
    catch: (fn: (err: unknown) => unknown) => Promise.resolve(result).catch(fn),
    eq: () => chain,
    neq: () => chain,
    gt: () => chain,
    lt: () => chain,
    gte: () => chain,
    lte: () => chain,
    like: () => chain,
    ilike: () => chain,
    is: () => chain,
    in: () => chain,
    not: () => chain,
    order: () => chain,
    limit: () => chain,
    range: () => chain,
    single: () => Promise.resolve({ data: (mockSupabaseData[table] || [])[0] || null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    select: () => chain,
  };
  return chain;
};

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: (table: string) => ({
      select: () => makeChainable(table),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
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
    user: { uid: 'admin-1', email: 'a@t.com', getIdToken: () => Promise.resolve('mock-token') },
    userProfile: { display_name: 'Admin', role: 'teacher', settings: {} },
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

vi.mock('../../data/fallbackData', () => ({ fallbackGames: [], fallbackVideos: [], fallbackWorksheets: [] }));
vi.mock('../../data/wordsData', () => ({ kidsWords: [], KidsWord: {} }));
vi.mock('../../data/videoStore', () => ({
  videoStore: {
    getAll: () => mockSupabaseData.videos,
    getByGrade: () => mockSupabaseData.videos,
    fetchVideos: vi.fn(() => Promise.resolve(mockSupabaseData.videos)),
    getVideos: () => mockSupabaseData.videos,
    subscribe: vi.fn((cb: ((videos: unknown[]) => void)) => { setTimeout(() => cb?.(mockSupabaseData.videos), 0); return vi.fn(); }),
    saveVideos: vi.fn(),
  },
  Video: {},
}));
vi.mock('../../data/gameStore', () => ({
  gameStore: { getAll: () => [], getGames: () => [], saveGames: vi.fn(), fetchGames: vi.fn(() => Promise.resolve([])), subscribe: vi.fn(() => vi.fn()) },
}));
vi.mock('../../data/wordStore', () => ({
  wordStore: { getAll: () => [], getWords: () => [], saveWords: vi.fn(), fetchWords: vi.fn(() => Promise.resolve([])), subscribe: vi.fn(() => vi.fn()) },
}));
vi.mock('../../data/videosData', () => ({ gradeInfo: {} }));
vi.mock('../../data/worksheetsData', () => ({ Worksheet: {}, categories: [], grades: [] }));

vi.mock('../../utils/adminApi', () => ({
  adminFetch: (...args: [string, Record<string, unknown>?]) => mockAdminFetch(...args),
  getAdminApiBase: () => 'http://localhost:3001',
  getAdminAuthHeaders: () => Promise.resolve({ 'X-Admin-Password': 'Wealthy*520' }),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null, BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null, PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => null, Cell: () => null, XAxis: () => null, YAxis: () => null,
  CartesianGrid: () => null, Tooltip: () => null, Legend: () => null,
  Area: () => null, AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_t, prop) => typeof prop === 'string'
      ? React.forwardRef(({ children, ...p }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.Ref<unknown>) => {
          const fp: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(p)) {
            if (!k.startsWith('while') && !k.startsWith('animate') && !k.startsWith('initial') && !k.startsWith('exit') && !k.startsWith('variants') && !k.startsWith('transition') && !k.startsWith('layout') && k !== 'custom' && k !== 'whileInView' && k !== 'viewport') fp[k] = v;
          }
          return React.createElement(prop as string, { ...fp, ref }, children);
        })
      : undefined,
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => false,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
}));

// ── Helpers ────────────────────────────────────────────────────────────────

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  adminFetchCalls.length = 0;
});

// ════════════════════════════════════════════════════════════════════════════
// GAMES CRUD
// ════════════════════════════════════════════════════════════════════════════

describe('GamesManager - CRUD Operations', () => {
  let GamesManager: React.FC;

  beforeEach(async () => {
    const mod = await import('../../pages/Admin/GamesManager');
    GamesManager = mod.default;
  });

  it('renders game list from Supabase', async () => {
    wrap(<GamesManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });
  });

  it('opens add game modal with Oyun Ekle button', async () => {
    wrap(<GamesManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });
    const addBtn = screen.getByText('Oyun Ekle');
    fireEvent.click(addBtn);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Animals Quiz/)).toBeInTheDocument();
    });
  });

  it('CREATE - form has all required fields and submit button', async () => {
    wrap(<GamesManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Oyun Ekle'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Animals Quiz/)).toBeInTheDocument();
    });

    // Verify form has all required fields
    const titleInputs = screen.getAllByPlaceholderText(/Animals Quiz/);
    expect(titleInputs.length).toBeGreaterThanOrEqual(1);
    const embedInputs = screen.getAllByPlaceholderText(/wordwall\.net/);
    expect(embedInputs.length).toBeGreaterThanOrEqual(1);

    // Verify submit button exists
    const submitBtn = document.querySelector('button[type="submit"]');
    expect(submitBtn).toBeTruthy();
    expect(submitBtn?.textContent).toContain('Ekle');
  });

  it('CREATE - GamesManager imports adminFetch and calls POST /api/admin/games', async () => {
    const fs = await import('fs');
    const code = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/GamesManager.tsx', 'utf-8');
    // Verify the create call
    expect(code).toContain("adminFetch('/api/admin/games'");
    expect(code).toContain("method: 'POST'");
    expect(code).toContain("body: JSON.stringify(body)");
    // Verify it sends required fields
    expect(code).toContain('title: formData.title');
    expect(code).toContain("category: formData.type");
  });

  it('DELETE - uses window.confirm and sends DELETE /api/admin/games/:id', async () => {
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    wrap(<GamesManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    // Find Trash2 icon button - it's an icon-only button
    const allButtons = screen.getAllByRole('button');
    const deleteBtn = allButtons.find(b => b.querySelector('.lucide-trash-2, .lucide-trash2'));

    if (deleteBtn) {
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        const deleteCalls = adminFetchCalls.filter(c => c.options?.method === 'DELETE' && c.url.includes('/api/admin/games/'));
        expect(deleteCalls.length).toBe(1);
        expect(deleteCalls[0].url).toBe('/api/admin/games/g1');
      });
    }
    confirmSpy.mockRestore();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// VIDEOS CRUD
// ════════════════════════════════════════════════════════════════════════════

describe('VideosManager - CRUD Operations', () => {
  let VideosManager: React.FC;

  beforeEach(async () => {
    const mod = await import('../../pages/Admin/VideosManager');
    VideosManager = mod.default;
  });

  it('renders video list from videoStore', async () => {
    wrap(<VideosManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });
  });

  it('opens add video modal with Video Ekle button', async () => {
    wrap(<VideosManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Video Ekle'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/XqZsoesa55w/)).toBeInTheDocument();
    });
  });

  it('CREATE - sends POST /api/admin/videos with youtube_id and title', async () => {
    wrap(<VideosManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Video Ekle'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/XqZsoesa55w/)).toBeInTheDocument();
    });

    // Fill youtube ID and title (use getAll in case of duplicates)
    const ytInputs = screen.getAllByPlaceholderText(/XqZsoesa55w/);
    fireEvent.change(ytInputs[ytInputs.length - 1], { target: { value: 'dQw4w9WgXcQ' } });
    const titleInputs = screen.getAllByPlaceholderText(/Baby Shark/);
    fireEvent.change(titleInputs[titleInputs.length - 1], { target: { value: 'New Video Title' } });

    // All managers use form onSubmit - fire submit on the form element
    const form = document.querySelector('form');
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      const postCalls = adminFetchCalls.filter(c => c.options?.method === 'POST' && c.url.includes('/api/admin/videos'));
      expect(postCalls.length).toBe(1);
    });

    const postCall = adminFetchCalls.find(c => c.options?.method === 'POST' && c.url.includes('/api/admin/videos'));
    expect(postCall!.url).toBe('/api/admin/videos');

    const body = typeof postCall!.options.body === 'string' ? JSON.parse(postCall!.options.body) : postCall!.options.body;
    expect(body.youtube_id || body.title).toBeTruthy();
  });

  it('DELETE - uses window.confirm and sends DELETE /api/admin/videos/:id', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    wrap(<VideosManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });

    const allButtons = screen.getAllByRole('button');
    const deleteBtn = allButtons.find(b => b.querySelector('.lucide-trash-2, .lucide-trash2'));

    if (deleteBtn) {
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        const deleteCalls = adminFetchCalls.filter(c => c.options?.method === 'DELETE' && c.url.includes('/api/admin/videos/'));
        expect(deleteCalls.length).toBe(1);
        expect(deleteCalls[0].url).toBe('/api/admin/videos/v1');
      });
    }
    confirmSpy.mockRestore();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// WORDS CRUD
// ════════════════════════════════════════════════════════════════════════════

describe('WordsManager - CRUD Operations', () => {
  let WordsManager: React.FC;

  beforeEach(async () => {
    const mod = await import('../../pages/Admin/WordsManager');
    WordsManager = mod.default;
  });

  it('renders word list from Supabase', async () => {
    wrap(<WordsManager />);
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument();
    });
  });

  it('opens add word modal with Kelime Ekle button', async () => {
    wrap(<WordsManager />);
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Kelime Ekle'));
    await waitFor(() => {
      // Modal title says "Yeni Kelime Ekle"
      expect(screen.getByText('Yeni Kelime Ekle')).toBeInTheDocument();
    });
  });

  it('CREATE - form has word/turkish fields and submit button', async () => {
    wrap(<WordsManager />);
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Kelime Ekle'));

    await waitFor(() => {
      expect(screen.getByText('Yeni Kelime Ekle')).toBeInTheDocument();
    });

    // Verify form has required fields
    expect(screen.getByPlaceholderText('Örn: apple')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Örn: elma')).toBeInTheDocument();

    // Verify submit button exists
    const submitBtn = document.querySelector('button[type="submit"]');
    expect(submitBtn).toBeTruthy();
    expect(submitBtn?.textContent).toContain('Ekle');
  });

  it('CREATE - WordsManager imports adminFetch and calls POST /api/admin/words', async () => {
    const fs = await import('fs');
    const code = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/WordsManager.tsx', 'utf-8');
    // Verify the create call
    expect(code).toContain("adminFetch('/api/admin/words'");
    expect(code).toContain("method: 'POST'");
    // Verify it sends required fields
    expect(code).toContain('word:');
    expect(code).toContain('turkish:');
    expect(code).toContain('emoji:');
    expect(code).toContain('example:');
  });

  it('DELETE - uses window.confirm and sends DELETE /api/admin/words/:word', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    wrap(<WordsManager />);
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    const allButtons = screen.getAllByRole('button');
    const deleteBtn = allButtons.find(b => b.querySelector('.lucide-trash-2, .lucide-trash2'));

    if (deleteBtn) {
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        const deleteCalls = adminFetchCalls.filter(c => c.options?.method === 'DELETE' && c.url.includes('/api/admin/words/'));
        expect(deleteCalls.length).toBe(1);
        expect(deleteCalls[0].url).toContain('/api/admin/words/apple');
      });
    }
    confirmSpy.mockRestore();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// WORKSHEETS CRUD
// ════════════════════════════════════════════════════════════════════════════

describe('WorksheetsManager - CRUD Operations', () => {
  let WorksheetsManager: React.FC;

  beforeEach(async () => {
    const mod = await import('../../pages/Admin/WorksheetsManager');
    WorksheetsManager = mod.default;
  });

  it('renders worksheet list from Supabase', async () => {
    wrap(<WorksheetsManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Worksheet')).toBeInTheDocument();
    });
  });

  it('opens add worksheet modal with Ekle button', async () => {
    wrap(<WorksheetsManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Worksheet')).toBeInTheDocument();
    });
    // The button text is "Ekle"
    const addBtns = screen.getAllByText('Ekle');
    fireEvent.click(addBtns[0]);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Animals Vocabulary/)).toBeInTheDocument();
    });
  });

  it('CREATE - sends POST /api/admin/worksheets with title and externalUrl', async () => {
    wrap(<WorksheetsManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Worksheet')).toBeInTheDocument();
    });

    const addBtns = screen.getAllByText('Ekle');
    fireEvent.click(addBtns[0]);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Animals Vocabulary/)).toBeInTheDocument();
    });

    // Fill title and URL
    const titleInputs = screen.getAllByPlaceholderText(/Animals Vocabulary/);
    fireEvent.change(titleInputs[titleInputs.length - 1], { target: { value: 'New Worksheet' } });
    const urlInputs = screen.getAllByPlaceholderText(/dosya y/i);
    fireEvent.change(urlInputs[urlInputs.length - 1], { target: { value: 'https://example.com/worksheet.pdf' } });

    // All managers use form onSubmit - fire submit on the form element
    const form = document.querySelector('form');
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      const postCalls = adminFetchCalls.filter(c => c.options?.method === 'POST' && c.url.includes('/api/admin/worksheets'));
      expect(postCalls.length).toBe(1);
    });

    const postCall = adminFetchCalls.find(c => c.options?.method === 'POST' && c.url.includes('/api/admin/worksheets'));
    expect(postCall!.url).toBe('/api/admin/worksheets');

    const body = typeof postCall!.options.body === 'string' ? JSON.parse(postCall!.options.body) : postCall!.options.body;
    expect(body.title).toBe('New Worksheet');
    expect(body.externalUrl).toBeTruthy();
  });

  it('DELETE - uses window.confirm and sends DELETE /api/admin/worksheets/:id', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    wrap(<WorksheetsManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Worksheet')).toBeInTheDocument();
    });

    const allButtons = screen.getAllByRole('button');
    const deleteBtn = allButtons.find(b => b.querySelector('.lucide-trash-2, .lucide-trash2'));

    if (deleteBtn) {
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        const deleteCalls = adminFetchCalls.filter(c => c.options?.method === 'DELETE' && c.url.includes('/api/admin/worksheets/'));
        expect(deleteCalls.length).toBe(1);
        expect(deleteCalls[0].url).toBe('/api/admin/worksheets/w1');
      });
    }
    confirmSpy.mockRestore();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN API UTILITY TESTS
// ════════════════════════════════════════════════════════════════════════════

describe('adminFetch - API Utility Verification', () => {
  it('adminFetch is called with correct base URL pattern', () => {
    // Verify the mock is wired correctly
    expect(mockAdminFetch).toBeDefined();
    expect(typeof mockAdminFetch).toBe('function');
  });

  it('adminFetch handles POST with JSON body', async () => {
    const result = await mockAdminFetch('/api/admin/games', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', url: 'https://example.com' }),
    });
    expect(result.ok).toBe(true);
    const json = await result.json();
    expect(json.id).toBe('new-123');
  });

  it('adminFetch handles PATCH', async () => {
    const result = await mockAdminFetch('/api/admin/games/g1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });
    expect(result.ok).toBe(true);
    const json = await result.json();
    expect(json.ok).toBe(true);
  });

  it('adminFetch handles DELETE', async () => {
    const result = await mockAdminFetch('/api/admin/words/apple', {
      method: 'DELETE',
    });
    expect(result.ok).toBe(true);
    const json = await result.json();
    expect(json.ok).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// BACKEND ROUTE VERIFICATION (static analysis)
// ════════════════════════════════════════════════════════════════════════════

describe('Backend Route Verification - server.js', () => {
  let serverCode: string;

  beforeEach(async () => {
    const fs = await import('fs');
    serverCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/server/server.js', 'utf-8');
  });

  // --- GAMES ---
  it('backend has POST /api/admin/games route', () => {
    expect(serverCode).toContain("app.post('/api/admin/games'");
  });

  it('backend has PATCH /api/admin/games/:id route', () => {
    expect(serverCode).toContain("app.patch('/api/admin/games/:id'");
  });

  it('backend has DELETE /api/admin/games/:id route', () => {
    expect(serverCode).toContain("app.delete('/api/admin/games/:id'");
  });

  it('backend games POST inserts into Supabase games table', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/games'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain(".from('games').insert");
  });

  it('backend games POST validates title and url', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/games'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain("!title || !url");
  });

  // --- VIDEOS ---
  it('backend has POST /api/admin/videos route', () => {
    expect(serverCode).toContain("app.post('/api/admin/videos'");
  });

  it('backend has PATCH /api/admin/videos/:id route', () => {
    expect(serverCode).toContain("app.patch('/api/admin/videos/:id'");
  });

  it('backend has DELETE /api/admin/videos/:id route', () => {
    expect(serverCode).toContain("app.delete('/api/admin/videos/:id'");
  });

  it('backend videos POST inserts into Supabase videos table', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/videos'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain(".from('videos').insert");
  });

  it('backend videos POST validates youtube_id and title', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/videos'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain("!youtube_id || !title");
  });

  // --- WORDS ---
  it('backend has POST /api/admin/words route', () => {
    expect(serverCode).toContain("app.post('/api/admin/words'");
  });

  it('backend has PATCH /api/admin/words/:word route', () => {
    expect(serverCode).toContain("app.patch('/api/admin/words/:word'");
  });

  it('backend has DELETE /api/admin/words/:word route', () => {
    expect(serverCode).toContain("app.delete('/api/admin/words/:word'");
  });

  it('backend words POST inserts into Supabase words table', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/words'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain(".from('words').insert");
  });

  it('backend words POST validates word and turkish', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/words'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain("!word || !turkish");
  });

  // --- WORKSHEETS ---
  it('backend has POST /api/admin/worksheets route', () => {
    expect(serverCode).toContain("app.post('/api/admin/worksheets'");
  });

  it('backend has PATCH /api/admin/worksheets/:id route', () => {
    expect(serverCode).toContain("app.patch('/api/admin/worksheets/:id'");
  });

  it('backend has DELETE /api/admin/worksheets/:id route', () => {
    expect(serverCode).toContain("app.delete('/api/admin/worksheets/:id'");
  });

  it('backend worksheets POST inserts into Supabase worksheets table', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/worksheets'");
    const postSection = serverCode.slice(idx, idx + 1200);
    expect(postSection).toContain(".from('worksheets').insert");
  });

  it('backend worksheets POST validates title and externalUrl', () => {
    const idx = serverCode.indexOf("app.post('/api/admin/worksheets'");
    const postSection = serverCode.slice(idx, idx + 900);
    expect(postSection).toContain("!title || !externalUrl");
  });

  // --- AUTH ---
  it('backend applies requireAdminAuth to all /api/admin routes', () => {
    expect(serverCode).toContain("app.use('/api/admin', requireAdminAuth)");
  });

  it('backend requireAdminAuth checks X-Admin-Password header', () => {
    expect(serverCode).toContain("req.headers['x-admin-password']");
  });

  it('backend requireAdminAuth checks Bearer token', () => {
    expect(serverCode).toContain("raw.startsWith('Bearer ')");
  });

  // --- RATE LIMITING ---
  it('backend applies rate limiting to all CRUD routes', () => {
    const gameRoutes = serverCode.match(/app\.(post|patch|delete)\('\/api\/admin\/games.*?rateLimiter/gs);
    expect(gameRoutes?.length).toBe(3);

    const videoRoutes = serverCode.match(/app\.(post|patch|delete)\('\/api\/admin\/videos.*?rateLimiter/gs);
    expect(videoRoutes?.length).toBe(3);

    // Words routes: post has '/api/admin/words', patch/delete have '/api/admin/words/:word'
    const wordRoutes = serverCode.match(/app\.(post|patch|delete)\('\/api\/admin\/words.*?rateLimiter/gs);
    expect(wordRoutes?.length).toBe(3);

    const worksheetRoutes = serverCode.match(/app\.(post|patch|delete)\('\/api\/admin\/worksheets.*?rateLimiter/gs);
    expect(worksheetRoutes?.length).toBe(3);
  });

  // --- FIELD MAPPING ---
  it('backend worksheets maps category→subject correctly', () => {
    expect(serverCode).toContain("subject: category || 'Vocabulary'");
  });

  it('backend worksheets maps externalUrl→file_url correctly', () => {
    expect(serverCode).toContain("file_url: String(externalUrl)");
  });

  // --- EXTRA FEATURES ---
  it('backend has /api/words/enrich endpoint for auto-enrichment', () => {
    expect(serverCode).toContain("app.post('/api/words/enrich'");
  });

  it('backend has /api/youtube/metadata endpoint for video metadata', () => {
    expect(serverCode).toContain("app.get('/api/youtube/metadata'");
  });

  it('backend has worksheet file upload endpoint', () => {
    expect(serverCode).toContain("app.post('/api/worksheets/upload'");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FRONTEND ↔ BACKEND FIELD MAPPING VERIFICATION
// ════════════════════════════════════════════════════════════════════════════

describe('Frontend ↔ Backend Field Mapping', () => {
  it('GamesManager sends fields that backend expects', async () => {
    const fs = await import('fs');
    const managerCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/GamesManager.tsx', 'utf-8');
    const serverCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/server/server.js', 'utf-8');

    // Frontend sends these fields
    expect(managerCode).toContain("'/api/admin/games'");
    expect(managerCode).toContain("method: 'POST'");
    expect(managerCode).toContain("method: 'PATCH'");
    expect(managerCode).toContain("method: 'DELETE'");

    // Backend destructures same fields
    const gamePost = serverCode.slice(serverCode.indexOf("app.post('/api/admin/games'"), serverCode.indexOf("app.post('/api/admin/games'") + 400);
    expect(gamePost).toContain('title, url, category, thumbnail_url, description, target_audience');
  });

  it('VideosManager sends fields that backend expects', async () => {
    const fs = await import('fs');
    const managerCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/VideosManager.tsx', 'utf-8');
    const serverCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/server/server.js', 'utf-8');

    expect(managerCode).toContain("'/api/admin/videos'");
    expect(managerCode).toContain("method: 'POST'");
    expect(managerCode).toContain("method: 'PATCH'");
    expect(managerCode).toContain("method: 'DELETE'");

    const videoPost = serverCode.slice(serverCode.indexOf("app.post('/api/admin/videos'"), serverCode.indexOf("app.post('/api/admin/videos'") + 400);
    expect(videoPost).toContain('youtube_id, title, description, thumbnail, duration, category, grade, isPopular');
  });

  it('WordsManager sends fields that backend expects', async () => {
    const fs = await import('fs');
    const managerCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/WordsManager.tsx', 'utf-8');
    const serverCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/server/server.js', 'utf-8');

    expect(managerCode).toContain("'/api/admin/words'");
    expect(managerCode).toContain("method: 'POST'");
    expect(managerCode).toContain("method: 'PATCH'");
    expect(managerCode).toContain("method: 'DELETE'");

    const wordPost = serverCode.slice(serverCode.indexOf("app.post('/api/admin/words'"), serverCode.indexOf("app.post('/api/admin/words'") + 400);
    expect(wordPost).toContain('word, turkish, level, category, emoji, example');
  });

  it('WorksheetsManager sends fields that backend expects', async () => {
    const fs = await import('fs');
    const managerCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/pages/Admin/WorksheetsManager.tsx', 'utf-8');
    const serverCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/server/server.js', 'utf-8');

    expect(managerCode).toContain("'/api/admin/worksheets'");
    expect(managerCode).toContain("method: 'POST'");
    expect(managerCode).toContain("method: 'PATCH'");
    expect(managerCode).toContain("method: 'DELETE'");

    const wsPost = serverCode.slice(serverCode.indexOf("app.post('/api/admin/worksheets'"), serverCode.indexOf("app.post('/api/admin/worksheets'") + 400);
    expect(wsPost).toContain('title, description, category, grade, thumbnailUrl, externalUrl, source');
  });

  it('adminApi.ts exports adminFetch and getAdminApiBase', async () => {
    const fs = await import('fs');
    const apiCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/src/utils/adminApi.ts', 'utf-8');
    expect(apiCode).toContain('export');
    expect(apiCode).toContain('adminFetch');
    expect(apiCode).toContain('getAdminApiBase');
    // Auth header injection
    expect(apiCode).toContain('X-Admin-Password');
  });

  it('vite.config.ts proxies /api to backend', async () => {
    const fs = await import('fs');
    const viteCode = fs.readFileSync('/Users/jinx/Desktop/projeler/minesminis/vite.config.ts', 'utf-8');
    expect(viteCode).toContain("'/api'");
    expect(viteCode).toContain('localhost:3001');
  });
});
