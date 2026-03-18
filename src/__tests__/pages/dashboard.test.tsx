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
    Play: icon,
    Flame: icon,
    Star: icon,
    Gamepad2: icon,
    BookOpen: icon,
    Video: icon,
    Music: icon,
    Clock: icon,
    CheckCircle: icon,
    Target: icon,
    School: icon,
    Award: icon,
    Loader2: icon,
    Gift: icon,
  };
});

vi.mock('../../components/MimiMascot', () => ({
  default: () => <span />,
}));

// Mock classroomService
vi.mock('../../services/classroomService', () => ({
  joinClassroom: vi.fn(() => ({ success: false })),
  getStudentClassroom: vi.fn(() => null),
}));

// Mock spacedRepetition
vi.mock('../../data/spacedRepetition', () => ({
  getDueWords: vi.fn(() => []),
}));

// Mock learningPathService
vi.mock('../../services/learningPathService', () => ({
  getNextAction: vi.fn(() => ({
    type: 'phonics-lesson',
    title: 'Learn the /s/ sound',
    titleTr: '/s/ sesini ogren',
    route: '/worlds/little-ears/p1-u1',
    description: 'Practice the snake sound!',
  })),
  getCurrentPhonicsSound: vi.fn(() => ({ id: 'g1_s', group: 1, grapheme: 's' })),
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

// Mock MimiGuide component
vi.mock('../../components/MimiGuide', () => ({
  default: () => null,
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

  it('renders without crashing', () => {
    renderDashboard();
    expect(document.querySelector('.dash')).toBeTruthy();
  });

  it('renders top bar with user name', () => {
    renderDashboard();
    expect(screen.getByText('Ali')).toBeInTheDocument();
  });

  it('shows XP in top bar', () => {
    renderDashboard();
    const xpText = (1250).toLocaleString();
    expect(screen.getByText(xpText)).toBeInTheDocument();
  });

  it('shows streak in top bar', () => {
    renderDashboard();
    const streakElements = screen.getAllByText('7');
    expect(streakElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders hero card with next action title', () => {
    renderDashboard();
    expect(screen.getByText('Learn the /s/ sound')).toBeInTheDocument();
  });

  it('renders play button with aria-label', () => {
    renderDashboard();
    expect(screen.getByLabelText('Start lesson')).toBeInTheDocument();
  });

  it('shows quick action buttons (Games, Words, Videos, Songs)', () => {
    renderDashboard();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Songs')).toBeInTheDocument();
  });

  it('quick actions link to correct routes', () => {
    renderDashboard();
    const gamesLink = screen.getByText('Games').closest('a');
    expect(gamesLink).toHaveAttribute('href', '/games');

    const wordsLink = screen.getByText('Words').closest('a');
    expect(wordsLink).toHaveAttribute('href', '/words');

    const videosLink = screen.getByText('Videos').closest('a');
    expect(videosLink).toHaveAttribute('href', '/videos');

    const songsLink = screen.getByText('Songs').closest('a');
    expect(songsLink).toHaveAttribute('href', '/songs');
  });

  it('shows achievements section heading', () => {
    renderDashboard();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });

  it('shows no-badges message when no badges earned', () => {
    renderDashboard();
    expect(screen.getByText('Play lessons to unlock badges and rewards!')).toBeInTheDocument();
  });

  it('shows Today section with Play Games', () => {
    renderDashboard();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Play Games')).toBeInTheDocument();
  });
});
