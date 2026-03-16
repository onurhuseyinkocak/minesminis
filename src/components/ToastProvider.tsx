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
            background: '#2d3436',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#00B894',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#FF6B6B',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
    </>
  );
};
