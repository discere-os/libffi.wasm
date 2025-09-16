import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'build', 'target', 'testsuite'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'src/**/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'target/',
        'testsuite/'
      ]
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  }
})