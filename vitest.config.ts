import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': resolve(__dirname, './attached_assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    env: {
      VITE_ADMIN_EMAILS: 'mineteacheronline@gmail.com,onurhuseyinkocak1@dream-mining.co',
    },
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*', 'src/__tests__/**'],
    },
  },
});
