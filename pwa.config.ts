// pwa.config.ts

import type { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    skipWaiting: true,
    clientsClaim: true,

    // --- FIX #1: ADDED THIS LINE TO SOLVE THE BUILD ERROR ---
    // Increases the file size limit for precaching from 2MB to 3MB.
    // This allows your large image to be included in the service worker.
    maximumFileSizeToCacheInBytes: 3145728, // 3 * 1024 * 1024 bytes

    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,woff,woff2}'],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith('/api'),
        handler: 'CacheFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 15, // 15 Minutes
          },
        },
      },
    ],
  },
  manifest: {
    name: 'Mwalimu Companion',
    short_name: 'MwalimuApp',
    description: 'A companion app for teachers.',
    theme_color: '#1e40af',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
    icons: [
      // --- FIX #2: CORRECTED ICON PATHS ---
      // Files in the 'public' folder are served from the root '/'.
      // You should not include '/public' in the path.
      {
        src: '/atmwalimulogo.png', // Corrected from '/public/atmwalimulogo.png'
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/atmwalimulogo.png', // Corrected from '/public/atmwalimulogo.png'
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/atmwalimulogo.png', // Corrected from '/public/atmwalimulogo.png'
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
};