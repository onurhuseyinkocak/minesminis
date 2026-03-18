import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', displayName: 'Ali' },
    userProfile: null,
    isAdmin: false,
  }),
}));

// ============================================================
// Tests
// ============================================================

function renderWorldMap() {
  return render(
    <MemoryRouter>
      <WorldMap />
    </MemoryRouter>
  );
}

describe('WorldMap Page (Journey Path)', () => {
  it('renders the phase name as title', () => {
    renderWorldMap();
    // "Little Ears" appears in the title AND as a tab label
    const matches = screen.getAllByText('Little Ears');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders phase selector tabs for all 4 phases', () => {
    renderWorldMap();
    expect(screen.getByLabelText('Little Ears')).toBeInTheDocument();
    expect(screen.getByLabelText('Word Builders')).toBeInTheDocument();
    expect(screen.getByLabelText('Story Makers')).toBeInTheDocument();
    expect(screen.getByLabelText('Young Explorers')).toBeInTheDocument();
  });

  it('renders unit stops for phase 1 (6 units)', () => {
    renderWorldMap();
    // Phase 1 has 6 units — check a few unit titles
    expect(screen.getByText(/Snake, Ant & Tennis/)).toBeInTheDocument();
    expect(screen.getByText(/Mouse, Candles & Airplane/)).toBeInTheDocument();
    expect(screen.getByText(/Lollipop, Flat Tire & Ball/)).toBeInTheDocument();
  });

  it('shows progress percentage', () => {
    renderWorldMap();
    expect(screen.getByText(/% complete/)).toBeInTheDocument();
  });

  it('first unit has current status', () => {
    renderWorldMap();
    const firstStop = screen.getByLabelText(/Snake, Ant & Tennis - current/);
    expect(firstStop).toBeInTheDocument();
  });

  it('locked stops show locked status', () => {
    renderWorldMap();
    const lockedStops = screen.getAllByLabelText(/- locked$/);
    expect(lockedStops.length).toBeGreaterThan(0);
  });
});
