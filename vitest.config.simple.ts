import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Modo inline - sem workers, sem pools, sem threads
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        isolate: false,
        useAtomics: false,
        minThreads: 1,
        maxThreads: 1,
      },
    },
    // Desabilita paralelismo completamente
    fileParallelism: false,
    maxConcurrency: 1,
    // Timeouts generosos
    testTimeout: 60000,
    hookTimeout: 60000,
    teardownTimeout: 60000,
    // Desabilita otimizações que podem causar problemas
    deps: {
      inline: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})