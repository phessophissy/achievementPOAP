import { defineConfig } from 'vitest/config';
import { getClarinetVitestsArgv, vitestSetupFilePath } from '@hirosystems/clarinet-sdk/vitest';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    environment: 'clarinet',
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true },
      threads: { singleThread: true },
    },
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
        manifestPath: './Clarinet.toml',
      },
    },
  },
});
