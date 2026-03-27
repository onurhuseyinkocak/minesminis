import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    allowedHosts: true as const,
    // Disable HMR in production to prevent ws://localhost leaking into prod bundles
    hmr: process.env.NODE_ENV !== 'production',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    // SPA fallback: serve index.html for any path that isn't an asset,
    // preventing 404 on hard refresh of deep routes like /worlds/1
    strictPort: false,
  },
  build: {
    // Target modern browsers (aligns with browserslist)
    target: ['chrome96', 'firefox90', 'safari15', 'edge96', 'ios15'],
    // Security: Disable source maps in production
    sourcemap: false,
    // Security: Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Security: Add integrity checks
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/analytics'],
          'vendor-lottie': ['lottie-react'],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
          'vendor-recharts': ['recharts'],
          'vendor-sentry': ['@sentry/react'],
          'games': [
            './src/components/games/QuickQuiz.tsx',
            './src/components/games/WordMatch.tsx',
            './src/components/games/SpellingBee.tsx',
            './src/components/games/SentenceScramble.tsx',
            './src/components/games/ListeningChallenge.tsx',
            './src/components/games/DialogueGame.tsx',
            './src/components/games/ImageLabelGame.tsx',
            './src/components/games/SayItGame.tsx',
            './src/components/games/PhonicsBlendGame.tsx',
            './src/components/games/PhonemeManipulationGame.tsx',
            './src/components/games/RhymeGame.tsx',
            './src/components/games/SyllableGame.tsx',
            './src/components/games/WordFamilyGame.tsx',
          ],
          'admin': [
            './src/pages/Admin/AdminDashboard.tsx',
            './src/pages/Admin/BlogManager.tsx',
            './src/pages/Admin/AdminAnalytics.tsx',
            './src/pages/Admin/AdminContentManager.tsx',
            './src/pages/Admin/AdminCurriculumManager.tsx',
            './src/pages/Admin/AdminUsersManager.tsx',
            './src/pages/Admin/WordsManager.tsx',
            './src/pages/Admin/VideosManager.tsx',
            './src/pages/Admin/GamesManager.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  // Security: Define environment variables that are safe to expose
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})
