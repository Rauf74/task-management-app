import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',

    // Run tests in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter to use
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
    ],

    // Shared settings for all projects
    use: {
        // Base URL for tests
        baseURL: 'http://localhost:3000',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Screenshot on failure
        screenshot: 'only-on-failure',
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // Run backend and frontend before starting tests
    // Set reuseExistingServer: true to use manually started servers
    webServer: [
        {
            command: 'npm run dev',
            cwd: '../backend',
            url: 'http://localhost:4000/api/health',
            reuseExistingServer: true,
            timeout: 120 * 1000,
        },
        {
            command: 'npm run dev',
            url: 'http://localhost:3000',
            reuseExistingServer: true,
            timeout: 120 * 1000,
        },
    ],
});
