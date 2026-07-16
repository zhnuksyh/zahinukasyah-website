import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/zahinukasyah-website/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Zahin Ukasyah',
        short_name: 'Zahin',
        description: 'Personal portfolio of Zahin Ukasyah',
        theme_color: '#0a0a0b',
        background_color: '#0a0a0b',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // fonts are self-hosted (precached via woff2 below), so no runtime
        // caching of third-party font hosts is needed
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}'],
      },
    }),
  ],
});
