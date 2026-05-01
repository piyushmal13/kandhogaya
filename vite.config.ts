import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  const supabaseUrl    = env.VITE_SUPABASE_URL    || process.env.VITE_SUPABASE_URL    || "";
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  const geminiKey      = env.GEMINI_API_KEY        || process.env.GEMINI_API_KEY        || "";

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'process.env.GEMINI_API_KEY':         JSON.stringify(geminiKey),
      'process.env.VITE_SUPABASE_URL':      JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      // ── Performance targets ──────────────────────────────────────────
      target:                 'es2020',          // modern browsers — smaller output
      chunkSizeWarningLimit:  600,               // warn at 600kb (tighter discipline)
      reportCompressedSize:   true,              // show gzip sizes in output
      cssCodeSplit:           true,              // CSS per-chunk (prevents FOUC)
      sourcemap:              false,             // no sourcemaps in prod (saves 30%)

      rollupOptions: {
        output: {
          // ── Granular vendor splitting ───────────────────────────────
          manualChunks: (id) => {
            // React core — tiny, always cached
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            // Router — separate so it's cached independently
            if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
              return 'vendor-router';
            }
            // Motion — large, but only needed for animated pages
            if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) {
              return 'vendor-motion';
            }
            // Charts — very large, only on dashboard/marketplace
            if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-')) {
              return 'vendor-charts';
            }
            // Supabase — isolate for long-term caching
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase';
            }
            // React Query — lightweight, separate chunk
            if (id.includes('node_modules/@tanstack/')) {
              return 'vendor-query';
            }
            // UI primitives — lucide, clsx, etc.
            if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) {
              return 'vendor-ui';
            }
          },

          // ── Asset naming — long-term cache fingerprinting ───────────
          chunkFileNames:  'assets/[name]-[hash].js',
          entryFileNames:  'assets/[name]-[hash].js',
          assetFileNames:  'assets/[name]-[hash][extname]',
        },

        // ── Tree shaking — discard dead code ────────────────────────
        treeshake: {
          moduleSideEffects: false,   // aggressive — assume no side effects
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      },
    },
  };
});
