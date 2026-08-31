const { defineConfig, devices } = require('@playwright/test');
const configuredPort = process.env.SHAFT_DOCS_PORT ?? '3000';
if (!/^[1-9]\d{0,4}$/.test(configuredPort) || Number(configuredPort) > 65_535) {
  throw new Error('SHAFT_DOCS_PORT must be an integer from 1 to 65535');
}
const port = Number(configuredPort);
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: /.*\.spec\.(ts|js)$/,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `yarn serve --host 127.0.0.1 --port ${port} --no-open`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});
