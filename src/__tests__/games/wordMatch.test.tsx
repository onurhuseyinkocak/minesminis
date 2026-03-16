import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordMatch } from '../../components/games/WordMatch';
import React from 'react';

// Mock framer-motion: pass all props through to the real HTML element
vi.mock('framer-motion', () => {
  const MOTION_PROPS = new Set(['initial', 'animate', 'exit', 'transition', 'variants', 'whileTap', 'whileHover', 'whileFocus', 'whileInView', 'layout', 'layoutId']);
  const handler = {
    get(_target: Record<string, unknown>, prop: string) {
      return React.forwardRef((props: Record<string, unknown> & { children?: React.ReactNode }, ref: React.Ref<Element>) => {
        const domProps: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(props)) {
          if (!MOTION_PROPS.has(k) && k !== 'children') domProps[k] = v;
        }
        return React.createElement(prop, { ...domProps, ref }, props.children);
      });
    },
  };
  return {
    motion: new Proxy({}, handler),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="check-icon" />,
  Sparkles: () => <span data-testid="sparkles-icon" />,
}));

// Mock speechSynthesis
beforeEach(() => {
  Object.defineProperty(window, 'speechSynthesis', {
    value: { speak: vi.fn(), cancel: vi.fn() },
    writable: true,
    configurable: true,
  });
});

const mockWords = [
  { english: 'cat', turkish: 'kedi', emoji: '🐱' },
  { english: 'dog', turkish: 'kopek', emoji: '🐕' },
  { english: 'bird', turkish: 'kus', emoji: '🐦' },
];

describe('WordMatch Game', () => {
  it('renders the game with application role', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByRole('application', { name: /word matching game/i })).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('Match the Words!')).toBeInTheDocument();
  });

  it('renders English word column', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByLabelText('English words')).toBeInTheDocument();
  });

  it('renders Turkish translation column', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByLabelText('Turkish translations')).toBeInTheDocument();
  });

  it('renders English word buttons with accessible aria-labels', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    const englishButtons = screen.getAllByLabelText(/^English:/);
    expect(englishButtons.length).toBe(3);
  });

  it('renders Turkish word buttons with accessible aria-labels', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    const turkishButtons = screen.getAllByLabelText(/^Turkish:/);
    expect(turkishButtons.length).toBe(3);
  });

  it('shows round indicator', () => {
    render(<WordMatch words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText(/Round/)).toBeInTheDocument();
  });
});
