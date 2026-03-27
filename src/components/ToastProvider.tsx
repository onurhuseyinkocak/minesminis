import { Toaster, useToasterStore, toast } from 'react-hot-toast';
import React, { useEffect } from 'react';

const TOAST_LIMIT = 3;

/**
 * ToastProvider
 * - Renders the global Toaster with design-system styling
 * - Enforces a max-3 visible toast limit; oldest toasts are dismissed when the
 *   queue exceeds the limit (prevents stacking spam)
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts } = useToasterStore();

  // Dismiss oldest toasts when over the limit
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <>
      <Toaster
        position="bottom-center"
        gutter={8}
        containerStyle={{
          bottom: 'calc(var(--bottom-nav-height, 56px) + env(safe-area-inset-bottom, 0px))',
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-light)',
            padding: '12px 16px',
            maxWidth: '380px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--bg-card)',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'var(--bg-card)',
            },
          },
          loading: {
            iconTheme: {
              primary: 'var(--primary)',
              secondary: 'var(--bg-card)',
            },
          },
          blank: {
            iconTheme: {
              primary: 'var(--accent-indigo)',
              secondary: 'var(--bg-card)',
            },
          },
        }}
      />
      {children}
    </>
  );
};
