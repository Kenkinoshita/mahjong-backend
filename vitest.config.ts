import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: [
      { find: '@common', replacement: '/common/src/' },
      { find: '@', replacement: '/src/' },
    ],
  },
});
