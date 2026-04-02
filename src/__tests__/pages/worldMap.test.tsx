import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import WorldMap from '../../pages/WorldMap';

// ============================================================
// Mocks
// ============================================================

// Mock framer-motion
vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, prop) => {
        return ({ children, className, ...rest }: Record<string, unknown> & { children?: React.ReactNode; className?: string }) => {
          const Tag = typeof prop === 'string' ? prop : 'div';
          return <Tag className={className} {...rest}>{children}</Tag>;
        };
      },
    }
  );
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

// Mock lucide-react
vi.mock('lucide-react', () => {
  const icon = () => <span />;
  return {
    Lock: icon,
    Check: icon,
    Star: icon,
    ChevronRight: icon,
    Sparkles: icon,
  };
});

// Mock LanguageContext
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'en' as const,
    setLang: vi.fn(),
    t: (key: string) => key,
  }),
}));

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', displayName: 'Ali' },
    userProfile: null,
    isAdmin: false,
  }),
}));

// Mock ProgressContext
vi.mock('../../contexts/ProgressContext', () => ({
  useProgress: () => ({
    isUnitCompleted: () => false,
    isUnitUnlocked: (unitId: string) => unitId === 'p1-u1',
    currentUnitId: 'p1-u1',
    completedUnits: [],
    totalProgress: 0,
  }),
}));

// Mock usePageTitle
vi.mock('../../hooks/usePageTitle', () => ({
  usePageTitle: () => {},
}));

// Mock LottieCharacter
vi.mock('../../components/LottieCharacter', () => ({
  default: () => <div data-testid="lottie-character" />,
}));

// ============================================================
// Helpers
// ============================================================

function renderWorldMap() {
  let result: ReturnType<typeof render>;
  // Trigger requestAnimationFrame callback so isReady becomes true
  act(() => {
    result = render(
      <MemoryRouter>
        <WorldMap />
      </MemoryRouter>
    );
  });
  // Flush rAF
  act(() => {
    vi.runAllTimers();
  });
  return result!;
}

beforeEach(() => {
  vi.useFakeTimers();
  // Mock requestAnimationFrame to fire immediately
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0);
    return 0;
  });
});

// ============================================================
// Tests
// ============================================================

describe('WorldMap Page (Journey Path)', () => {
  it('renders the phase name as title', () => {
    renderWorldMap();
    // "Little Ears" appears as a phase button label
    const matches = screen.getAllByText('Little Ears');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders phase buttons for all 4 phases', () => {
    renderWorldMap();
    expect(screen.getByText('Little Ears')).toBeInTheDocument();
    expect(screen.getByText('Word Builders')).toBeInTheDocument();
    expect(screen.getByText('Story Makers')).toBeInTheDocument();
    expect(screen.getByText('Young Explorers')).toBeInTheDocument();
  });

  it('renders unit cards for phase 1', () => {
    renderWorldMap();
    // Phase 1 unit titles
    expect(screen.getByText(/Snake, Ant & Tennis/)).toBeInTheDocument();
    expect(screen.getByText(/Mouse, Candles & Airplane/)).toBeInTheDocument();
    expect(screen.getByText(/Lollipop, Flat Tire & Ball/)).toBeInTheDocument();
  });

  it('renders Mimi speech bubble', () => {
    renderWorldMap();
    expect(screen.getByText("Let's learn!")).toBeInTheDocument();
  });

  it('renders unit card titles as headings', () => {
    renderWorldMap();
    const heading = screen.getByText(/Snake, Ant & Tennis/);
    expect(heading.tagName).toBe('H3');
  });
});
