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

// Mock lottie-react (imported transitively via LottieCharacter)
vi.mock('lottie-react', () => ({
  default: () => <div data-testid="lottie-react" />,
}));

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
    Play: icon,
    Flame: icon,
    Star: icon,
    Gamepad2: icon,
    Globe: icon,
    BookOpen: icon,
    Music: icon,
    Trophy: icon,
    Sparkles: icon,
    Sun: icon,
    Sunset: icon,
    Moon: icon,
  };
});

// Mock LottieCharacter
vi.mock('../../components/LottieCharacter', () => ({
  default: () => <span data-testid="lottie-character" />,
}));

// Mock dailyLessonService
vi.mock('../../services/dailyLessonService', () => ({
  isDailyLessonCompletedToday: vi.fn(() => false),
}));

// Mock usePageTitle
vi.mock('../../hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

// Mock soundLibrary
vi.mock('../../data/soundLibrary', () => ({
  SFX: {
    click: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    levelUp: vi.fn(),
    badge: vi.fn(),
  },
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

// Mock LanguageContext
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: vi.fn(),
    t: (key: string) => key,
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

  it('renders without crashing', () => {
    renderDashboard();
    // Dashboard uses kid-bg class on the root div
    expect(document.querySelector('.kid-bg')).toBeTruthy();
  });

  it('renders user name in greeting', () => {
    renderDashboard();
    expect(screen.getByText('Ali!')).toBeInTheDocument();
  });

  it('shows streak value', () => {
    renderDashboard();
    const streakElements = screen.getAllByText('7');
    expect(streakElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows level value', () => {
    renderDashboard();
    const levelElements = screen.getAllByText('5');
    expect(levelElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders action cards (Games, Learn, Books, Songs)', () => {
    renderDashboard();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Songs')).toBeInTheDocument();
  });

  it('action cards link to correct routes', () => {
    renderDashboard();
    const gamesLink = screen.getByText('Games').closest('a');
    expect(gamesLink).toHaveAttribute('href', '/games');

    const learnLink = screen.getByText('Learn').closest('a');
    expect(learnLink).toHaveAttribute('href', '/worlds');

    const booksLink = screen.getByText('Books').closest('a');
    expect(booksLink).toHaveAttribute('href', '/reading');

    const songsLink = screen.getByText('Songs').closest('a');
    expect(songsLink).toHaveAttribute('href', '/songs');
  });

  it('shows Day Streak label', () => {
    renderDashboard();
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
  });

  it('shows Level label', () => {
    renderDashboard();
    expect(screen.getByText('Level')).toBeInTheDocument();
  });

  it('renders LottieCharacter mascot', () => {
    renderDashboard();
    expect(screen.getByTestId('lottie-character')).toBeInTheDocument();
  });
});
