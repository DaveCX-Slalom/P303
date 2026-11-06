import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  test: { environment: 'jsdom', include: ['tests/**/*.test.js'], setupFiles: ['tests/setup.js'] },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'screenshots/*.png'],
      manifest: {
        name: 'Loyalty Pocket',
        short_name: 'Pocket',
        description: 'Member code, best offers, and points for Fieldmarket (fictional).',
        theme_color: '#1f5f3a',
        background_color: '#fbf6ea',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        categories: ['shopping', 'lifestyle'],
        shortcuts: [
          { name: 'Checkout mode', short_name: 'Checkout', url: '/checkout', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
          { name: 'Offers', url: '/offers', icons: [{ src: 'icon-192.png', sizes: '192x192' }] }
        ],
        screenshots: [
          { src: 'screenshots/pocket.png', sizes: '750x1624', type: 'image/png', form_factor: 'narrow', label: 'Member code, best offer and points' },
          { src: 'screenshots/offers.png', sizes: '750x1624', type: 'image/png', form_factor: 'narrow', label: 'Search, filter and clip offers' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        navigateFallback: '/index.html'
      }
    })
  ]
})
