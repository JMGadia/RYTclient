import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

/* ============================================================
   Vite Configuration
   - Vue plugin integration
   - Path aliasing for cleaner imports
   - Dependency optimization exclusions
   - Development server proxy setup
============================================================ */
export default defineConfig({
  plugins: [
    vue(), // Enable Vue 3 support
  ],

  // --- PATH RESOLVING / ALIAS ---
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // '@' maps to 'src' folder
    },
  },

  // --- DEPENDENCY OPTIMIZATION ---
  optimizeDeps: {
    exclude: ['@aws-sdk/client-rekognition'], // Exclude from pre-bundling
  },

  // --- DEVELOPMENT SERVER ---
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Redirect API calls to backend
        changeOrigin: true,
      },
    },
  },
});
