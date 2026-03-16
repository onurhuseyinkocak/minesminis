import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Minimal mocks for legal pages (they only use Link from react-router-dom)

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
        return React.forwardRef(({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }, ref: React.Ref<Element>) => {
          const filteredProps: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(props)) {
            if (!key.startsWith('while') && !key.startsWith('animate') && !key.startsWith('initial') && !key.startsWith('exit') && !key.startsWith('variants') && !key.startsWith('transition') && !key.startsWith('layout') && key !== 'custom') {
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

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Legal Pages Smoke Tests', () => {
  it('PrivacyPolicy - renders privacy content', async () => {
    const { default: PrivacyPolicy } = await import('../../pages/Legal/PrivacyPolicy');
    wrap(<PrivacyPolicy />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Privacy Policy/i);
    expect(screen.getByText(/1. Introduction/i)).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('TermsOfService - renders terms content', async () => {
    const { default: TermsOfService } = await import('../../pages/Legal/TermsOfService');
    wrap(<TermsOfService />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Terms of Service/i);
    expect(screen.getByText('1. Acceptance')).toBeInTheDocument();
  });

  it('CookiePolicy - renders cookie content', async () => {
    const { default: CookiePolicy } = await import('../../pages/Legal/CookiePolicy');
    wrap(<CookiePolicy />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Cookie Policy/i);
    expect(screen.getByText(/What Are Cookies/i)).toBeInTheDocument();
  });
});
