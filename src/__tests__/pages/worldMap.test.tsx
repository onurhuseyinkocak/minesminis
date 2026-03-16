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
    ChevronRight: icon,
    Sparkles: icon,
  };
});

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

describe('WorldMap Page', () => {
  it('renders the page title', () => {
    renderWorldMap();
    expect(screen.getByText('Choose Your World')).toBeInTheDocument();
  });

  it('renders all 12 world cards', () => {
    renderWorldMap();

    const worldNames = [
      'Hello World',
      'My Body',
      'Colors & Shapes',
      'Animals',
      'My Family',
      'Food & Drinks',
      'My Home',
      'Clothes',
      'Nature',
      'School',
      'City & Transport',
      'Adventures',
    ];

    for (const name of worldNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('first world (Hello World) is unlocked and has a link', () => {
    renderWorldMap();
    const link = screen.getByLabelText(/Hello World.*complete/);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/worlds/w1');
  });

  it('first world shows "Continue" as it is the current world', () => {
    renderWorldMap();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('other worlds show locked state', () => {
    renderWorldMap();
    // Locked worlds have aria-label ending with "- Locked"
    const lockedElements = screen.getAllByLabelText(/- Locked$/);
    expect(lockedElements.length).toBe(11); // 12 total - 1 unlocked = 11 locked
  });

  it('locked worlds do not have anchor links', () => {
    renderWorldMap();
    const lockedElements = screen.getAllByLabelText(/- Locked$/);
    for (const el of lockedElements) {
      expect(el.tagName.toLowerCase()).not.toBe('a');
    }
  });

  it('shows lesson count for each world', () => {
    renderWorldMap();
    // Each card shows "X/10 lessons"
    const lessonCountElements = screen.getAllByText(/\/10 lessons/);
    expect(lessonCountElements.length).toBe(12);
  });

  it('first world shows progress (3/10)', () => {
    renderWorldMap();
    expect(screen.getByText('3/10 lessons')).toBeInTheDocument();
  });

  it('locked worlds show 0/10 progress', () => {
    renderWorldMap();
    const zeroProgress = screen.getAllByText('0/10 lessons');
    expect(zeroProgress.length).toBe(11);
  });

  it('shows each world theme description', () => {
    renderWorldMap();
    expect(screen.getByText('Greetings & introductions')).toBeInTheDocument();
    expect(screen.getByText('Body parts & senses')).toBeInTheDocument();
    expect(screen.getByText('Farm, wild & pet animals')).toBeInTheDocument();
  });

  it('shows subtitle with Mimi message', () => {
    renderWorldMap();
    expect(
      screen.getByText(/Mimi is waiting for you/)
    ).toBeInTheDocument();
  });
});
