// pwa.config.ts

// 1. IMPORT THE TYPE DEFINITIONS FROM THE PLUGIN
import type { VitePWAOptions } from 'vite-plugin-pwa';

// 2. ANNOTATE YOUR OBJECT with the Partial<VitePWAOptions> type.
//    'Partial' makes all properties of VitePWAOptions optional.
export const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
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
    theme_color: '#1e40af', // Example: a nice blue
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
    icons: [
      {
        src: '/public/atmwalimulogo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/public/atmwalimulogo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/public/atmwalimulogo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
};