import { Toaster } from 'react-hot-toast';
import React from 'react';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--charcoal)',
            color: 'var(--white)',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--white)',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'var(--white)',
            },
          },
        }}
      />
      {children}
    </>
  );
};
