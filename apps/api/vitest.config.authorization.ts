
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['test/users-authorization.e2e-spec.ts'],
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
