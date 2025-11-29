
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8080,
    host: '::',
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 8080
    }
  },
  define: {
    // Make sure the token is properly defined with fallback
    __WS_TOKEN__: JSON.stringify(process.env.VITE_WS_TOKEN || 'development-token')
  }
}));
