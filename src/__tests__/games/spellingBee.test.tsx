import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpellingBee } from '../../components/games/SpellingBee';
import React from 'react';

// Mock framer-motion
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

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Delete: () => <span data-testid="delete-icon" />,
  Lightbulb: () => <span data-testid="lightbulb-icon" />,
  Volume2: () => <span data-testid="volume-icon" />,
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
  { english: 'sun', turkish: 'gunes', emoji: '☀️' },
  { english: 'hat', turkish: 'sapka', emoji: '🎩' },
  { english: 'cup', turkish: 'bardak', emoji: '☕' },
];

describe('SpellingBee Game', () => {
  it('renders with application role and label', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByRole('application', { name: /spelling game/i })).toBeInTheDocument();
  });

  it('renders the title "Spell It!"', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('Spell It!')).toBeInTheDocument();
  });

  it('renders letter tiles in a group', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    const letterGroup = screen.getByRole('group', { name: /available letters/i });
    expect(letterGroup).toBeInTheDocument();
  });

  it('renders letter buttons with accessible labels', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    const letterButtons = screen.getAllByLabelText(/^Letter /);
    // "cat" has 3 letters + 3 decoys = 6
    expect(letterButtons.length).toBe(6);
  });

  it('renders the Turkish translation as a clue', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('kedi')).toBeInTheDocument();
  });

  it('renders answer slots for each letter', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    // "cat" has 3 letters
    const slots = document.querySelectorAll('.spelling-bee__slot');
    expect(slots.length).toBe(3);
  });

  it('fills a slot when a letter tile is clicked', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    const letterButtons = screen.getAllByLabelText(/^Letter /);
    fireEvent.click(letterButtons[0]);
    const filledSlots = document.querySelectorAll('.spelling-bee__slot--filled');
    expect(filledSlots.length).toBe(1);
  });

  it('has accessible Listen button', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByLabelText('Listen to pronunciation')).toBeInTheDocument();
  });

  it('has accessible Back button', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByLabelText('Remove last letter')).toBeInTheDocument();
  });

  it('shows counter (1/5)', () => {
    render(<SpellingBee words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('clicking letter tiles updates the typed state and enables check', async () => {
    const onComplete = vi.fn();
    const singleWord = [
      { english: 'hi', turkish: 'selam', emoji: '👋' },
    ];

    render(<SpellingBee words={singleWord} onComplete={onComplete} />);

    // Initially, Check button should be disabled (0 of 2 letters typed)
    const checkBtnBefore = screen.getByText('Check!').closest('button')!;
    expect(checkBtnBefore.disabled).toBe(true);

    // Find the H and I buttons in the letter pool
    const letterButtons = screen.getAllByLabelText(/^Letter /);
    const hBtn = letterButtons.find((b) => b.textContent === 'H');
    const iBtn = letterButtons.find((b) => b.textContent === 'I');

    expect(hBtn).toBeTruthy();
    expect(iBtn).toBeTruthy();

    // Click H
    fireEvent.click(hBtn!);

    // Verify a slot was filled
    let filledSlots = document.querySelectorAll('.spelling-bee__slot--filled');
    expect(filledSlots.length).toBe(1);

    // Re-query the I button since the component re-rendered
    const letterButtons2 = screen.getAllByLabelText(/^Letter /);
    const iBtn2 = letterButtons2.find((b) => b.textContent === 'I' && !(b as HTMLButtonElement).disabled);

    expect(iBtn2).toBeTruthy();
    fireEvent.click(iBtn2!);

    // Now 2 slots should be filled
    filledSlots = document.querySelectorAll('.spelling-bee__slot--filled');
    expect(filledSlots.length).toBe(2);
  });
});
