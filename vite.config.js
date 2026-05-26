/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// Solo genera stats.html cuando se ejecuta con ANALYZE=true npm run build
// En builds normales de producción, el visualizer no se incluye para evitar
// exponer el mapa interno del bundle (dependencias, chunks, nombres de módulos).
const shouldAnalyze = process.env.ANALYZE === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    shouldAnalyze && visualizer({ open: false, gzipSize: true, filename: 'dist/stats.html' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunk único de vendor: evita problemas de orden de inicialización
          // entre React, Emotion, MUI y React Router.
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/test/**',
        'src/vite-env.d.ts',
        'src/types/**',
        'src/main.tsx',
      ],
    },
  },
})
