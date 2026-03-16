import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    userProfile: null,
    isAdmin: false,
    loading: false,
    signOut: vi.fn(),
  }),
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light' as const,
    effectiveTheme: 'light' as const,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('../../contexts/GamificationContext', () => ({
  useGamification: () => ({
    stats: { xp: 0, level: 1, streakDays: 0 },
    getXPProgress: () => 0,
    getXPForNextLevel: () => 100,
    getStreakBonus: () => 0,
  }),
}));

vi.mock('../../contexts/PremiumContext', () => ({
  usePremium: () => ({
    isPremium: false,
  }),
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
        return React.forwardRef(({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }, ref: React.Ref<Element>) => {
          const filteredProps: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(props)) {
            if (!key.startsWith('while') && !key.startsWith('animate') && !key.startsWith('initial') && !key.startsWith('exit') && !key.startsWith('variants') && !key.startsWith('transition') && !key.startsWith('layout') && key !== 'custom' && key !== 'whileInView' && key !== 'viewport') {
              filteredProps[key] = value;
            }
          }
          return React.createElement(prop as string, { ...filteredProps, ref }, children);
        });
      }
      return undefined;
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Navbar', () => {
  it('renders navigation', async () => {
    const { default: Navbar } = await import('../../components/Navbar');
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });
});
