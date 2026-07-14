import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Tela de Sala — Painel Digital',
        short_name: 'Tela de Sala',
        description: 'Painel digital para organizar aulas, agenda, avisos, tarefas e cronômetro.',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        lang: 'pt-BR',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp}'],
        navigateFallback: '/index.html'
      }
    })
  ],
  server: {
    port: 5173,
    // Keep development startup working when another local project already uses 5173.
    strictPort: false
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
});
