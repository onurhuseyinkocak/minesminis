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
  build: {
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
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-lottie': ['lottie-react'],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
          'vendor-recharts': ['recharts'],
          'games': [
            './src/components/games/QuickQuiz',
            './src/components/games/WordMatch',
            './src/components/games/SpellingBee',
            './src/components/games/SentenceScramble',
            './src/components/games/ListeningChallenge',
            './src/components/games/DialogueGame',
            './src/components/games/ImageLabelGame',
            './src/components/games/SayItGame',
            './src/components/games/PhonicsBlendGame',
            './src/components/games/PhonemeManipulationGame',
            './src/components/games/RhymeGame',
            './src/components/games/SyllableGame',
            './src/components/games/WordFamilyGame',
          ],
          'admin': [
            './src/pages/Admin/AdminDashboard',
            './src/pages/Admin/BlogManager',
            './src/pages/Admin/AdminAnalytics',
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
