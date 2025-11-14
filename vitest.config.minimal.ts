import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Configuração MÍNIMA - última tentativa
    run: true,
    // Sem pools, sem workers, sem nada
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        isolate: false,
      },
    },
    // Execução completamente sequencial
    fileParallelism: false,
    maxConcurrency: 1,
    // Timeouts muito altos
    testTimeout: 120000,
    hookTimeout: 120000,
    teardownTimeout: 120000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'node14'
  }
})