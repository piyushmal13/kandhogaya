import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { reinitializeSupabase } from './lib/supabase';

async function initConfig() {
  // Try to fetch runtime config if baked-in ones are missing
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!bakedUrl || bakedUrl.includes('placeholder')) {
    try {
      // Add a 2-second timeout to the fetch to prevent blocking the app
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const res = await fetch('/api/config', { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const config = await res.json();
        if (config.supabaseUrl && config.supabaseAnonKey) {
          reinitializeSupabase(config.supabaseUrl, config.supabaseAnonKey);
        }
      }
    } catch (e) {
      console.warn("[Config Discovery]: Failed to fetch runtime config from /api/config. This is expected if environment variables are already set in Vercel.");
    }
  }
}

// Start config discovery in background
initConfig();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
