import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QuickQuiz } from '../../components/games/QuickQuiz';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const MOTION_PROPS = new Set(['initial', 'animate', 'exit', 'transition', 'variants', 'whileTap', 'whileHover', 'whileFocus', 'whileInView', 'layout', 'layoutId', 'mode']);
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
  Timer: () => <span data-testid="timer-icon" />,
  Zap: () => <span data-testid="zap-icon" />,
  Trophy: () => <span data-testid="trophy-icon" />,
  Sparkles: () => <span data-testid="sparkles-icon" />,
}));

// Enough words for quiz generation
const mockWords = [
  { english: 'cat', turkish: 'kedi', emoji: '🐱' },
  { english: 'dog', turkish: 'kopek', emoji: '🐕' },
  { english: 'bird', turkish: 'kus', emoji: '🐦' },
  { english: 'fish', turkish: 'balik', emoji: '🐟' },
  { english: 'lion', turkish: 'aslan', emoji: '🦁' },
  { english: 'bear', turkish: 'ayi', emoji: '🐻' },
  { english: 'frog', turkish: 'kurbaga', emoji: '🐸' },
  { english: 'duck', turkish: 'ordek', emoji: '🦆' },
];

describe('QuickQuiz Game', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with application role and label', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByRole('application', { name: /quick quiz game/i })).toBeInTheDocument();
  });

  it('renders the title "Quick Quiz!"', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('Quick Quiz!')).toBeInTheDocument();
  });

  it('renders answer options in a radiogroup', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup', { name: /answer options/i });
    expect(group).toBeInTheDocument();
  });

  it('renders 4 answer option buttons', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup');
    const buttons = group.querySelectorAll('button');
    expect(buttons.length).toBe(4);
  });

  it('shows options labeled A, B, C, D', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('shows question counter (1/5)', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('shows the timer at 10s', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    expect(screen.getByText('10s')).toBeInTheDocument();
  });

  it('selecting an answer shows feedback', async () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup');
    const buttons = group.querySelectorAll('button');

    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    // Either correct or wrong feedback should appear
    const feedback = document.querySelector('.quick-quiz__feedback');
    expect(feedback).toBeTruthy();
  });

  it('progresses to next question after answering', async () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup');
    const buttons = group.querySelectorAll('button');

    await act(async () => {
      fireEvent.click(buttons[0]);
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('calls onComplete after all 5 questions', async () => {
    const onComplete = vi.fn();
    render(<QuickQuiz words={mockWords} onComplete={onComplete} />);

    for (let i = 0; i < 5; i++) {
      await act(async () => {
        const group = screen.getByRole('radiogroup');
        const buttons = group.querySelectorAll('button');
        fireEvent.click(buttons[0]);
        vi.advanceTimersByTime(1600);
      });
    }

    expect(onComplete).toHaveBeenCalled();
  });

  it('calls onComplete with score and total of 5', async () => {
    const onComplete = vi.fn();
    render(<QuickQuiz words={mockWords} onComplete={onComplete} />);

    for (let i = 0; i < 5; i++) {
      await act(async () => {
        const group = screen.getByRole('radiogroup');
        const buttons = group.querySelectorAll('button');
        fireEvent.click(buttons[0]);
        vi.advanceTimersByTime(1600);
      });
    }

    expect(onComplete).toHaveBeenCalledWith(expect.any(Number), 5);
  });

  it('shows emoji for the current question', () => {
    render(<QuickQuiz words={mockWords} onComplete={vi.fn()} />);
    const emojis = mockWords.map((w) => w.emoji);
    const found = emojis.some((e) => screen.queryByText(e));
    expect(found).toBe(true);
  });
});
