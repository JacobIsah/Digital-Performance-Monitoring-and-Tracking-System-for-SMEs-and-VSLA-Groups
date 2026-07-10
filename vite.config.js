import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Precaches the app shell (JS/CSS/HTML) so the PWA opens and the field
      // officer can fill out forms with zero connectivity, per the
      // architecture spec's offline-first requirement. Form data itself is
      // NOT cached here — that's handled explicitly via IndexedDB in
      // src/db.js so we control exactly when/how it syncs (see src/syncEngine.js).
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Never let the service worker cache API calls — those must always
        // hit the network or fail explicitly, so the app's own offline
        // queue (not a stale cached response) is the source of truth.
        navigateFallbackDenylist: [/^\/api/],
      },
      manifest: {
        name: 'NEXODE Field Monitor',
        short_name: 'NEXODE Field',
        description: 'Offline-capable field data collection for VSLA and SME monitoring',
        theme_color: '#16233A',
        background_color: '#16233A',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
