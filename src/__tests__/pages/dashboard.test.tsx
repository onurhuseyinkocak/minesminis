import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Dashboard from '../../pages/Dashboard';

// ============================================================
// Mocks
// ============================================================

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, prop) => {
        return ({ children, className, ...rest }: Record<string, unknown> & { children?: React.ReactNode; className?: string }) => {
          const MOTION_KEYS = new Set(['variants', 'initial', 'animate', 'exit', 'transition', 'whileTap', 'whileHover', 'whileFocus', 'whileInView', 'layout', 'layoutId']);
          const domProps: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(rest)) {
            if (!MOTION_KEYS.has(k)) domProps[k] = v;
          }
          const Tag = typeof prop === 'string' ? prop : 'div';
          return <Tag className={className} {...domProps}>{children}</Tag>;
        };
      },
    }
  );
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

// Mock lucide-react (all icons used by Dashboard)
vi.mock('lucide-react', () => {
  const icon = () => <span />;
  return {
    Trophy: icon,
    BookOpen: icon,
    Flame: icon,
    GraduationCap: icon,
    Globe: icon,
    Pencil: icon,
    Gamepad2: icon,
    BookHeart: icon,
    Award: icon,
    Play: icon,
    Sparkles: icon,
    Gift: icon,
    BarChart3: icon,
    ChevronRight: icon,
    RefreshCw: icon,
  };
});

// Mock recharts
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => <div />,
}));

// Mock AuthContext
const mockUser = {
  displayName: 'Ali',
  uid: 'test-uid',
  email: 'ali@test.com',
};

const mockUserProfile = {
  display_name: 'Ali',
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    userProfile: mockUserProfile,
    isAdmin: false,
  }),
}));

// Mock GamificationContext
const mockStats = {
  xp: 1250,
  weekly_xp: 320,
  level: 5,
  streakDays: 7,
  lastLoginDate: new Date().toISOString(),
  lastDailyClaim: null,
  lastWeeklyReset: null,
  badges: [],
  wordsLearned: 42,
  gamesPlayed: 15,
  videosWatched: 3,
  worksheetsCompleted: 5,
  dailyChallengesCompleted: 2,
  mascotId: 'mimi_dragon',
};

vi.mock('../../contexts/GamificationContext', () => ({
  useGamification: () => ({
    stats: mockStats,
    loading: false,
    getXPProgress: () => 65,
    canClaimDaily: false,
    claimDailyReward: vi.fn(),
    allBadges: [],
    hasBadge: () => false,
  }),
  ALL_BADGES: [],
}));

// ============================================================
// Tests
// ============================================================

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders greeting with user name', () => {
    renderDashboard();
    // Greeting pattern: "Good morning/afternoon/evening, Ali!"
    expect(screen.getByText(/Ali!/)).toBeInTheDocument();
  });

  it('shows XP stat card', () => {
    renderDashboard();
    // toLocaleString may or may not add comma depending on environment
    const xpText = (1250).toLocaleString();
    expect(screen.getByText(xpText)).toBeInTheDocument();
    expect(screen.getByText('Total XP')).toBeInTheDocument();
  });

  it('shows words learned stat', () => {
    renderDashboard();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Words Learned')).toBeInTheDocument();
  });

  it('shows streak stat', () => {
    renderDashboard();
    expect(screen.getByText('Streak Days')).toBeInTheDocument();
    // The streak count appears in both the greeting bar and the stats row
    const streakElements = screen.getAllByText('7');
    expect(streakElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows continue learning card', () => {
    renderDashboard();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Greetings & Introductions')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('shows lesson progress text', () => {
    renderDashboard();
    // With no localStorage data, completedCount=0 so currentLesson=1
    expect(screen.getByText(/Lesson \d+ of 10/)).toBeInTheDocument();
  });

  it('shows quick actions', () => {
    renderDashboard();
    expect(screen.getByText('Explore Worlds')).toBeInTheDocument();
    expect(screen.getByText('Practice Words')).toBeInTheDocument();
    expect(screen.getByText('Play Games')).toBeInTheDocument();
    expect(screen.getByText("Mimi's Story")).toBeInTheDocument();
  });

  it('quick actions link to correct routes', () => {
    renderDashboard();
    const worldsLink = screen.getByText('Explore Worlds').closest('a');
    expect(worldsLink).toHaveAttribute('href', '/worlds');

    const gamesLink = screen.getByText('Play Games').closest('a');
    expect(gamesLink).toHaveAttribute('href', '/games');

    const practiceLink = screen.getByText('Practice Words').closest('a');
    expect(practiceLink).toHaveAttribute('href', '/practice');
  });

  it('shows daily challenge section', () => {
    renderDashboard();
    // One of the daily challenge titles should be present
    const challengeTitles = [
      'Learn 5 new words',
      'Play 3 games',
      'Watch a story video',
      'Complete a worksheet',
      'Practice 10 words',
      'Explore a new world',
      'Earn 50 XP today',
    ];
    const found = challengeTitles.some((t) => screen.queryByText(t));
    expect(found).toBe(true);
  });

  it('shows weekly progress chart', () => {
    renderDashboard();
    expect(screen.getByText('This Week')).toBeInTheDocument();
  });

  it('shows level and XP progress', () => {
    renderDashboard();
    expect(screen.getByText(/Level 5/)).toBeInTheDocument();
  });
});
