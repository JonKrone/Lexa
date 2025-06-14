import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'e2e',
    environment: 'node',
    testTimeout: 30000, // E2E tests can take longer
    include: ['tests/e2e/**/*.test.ts'],
    setupFiles: ['./tests/e2e/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    __DEBUG__: true,
  },
})
