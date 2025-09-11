// Enhanced Playwright configuration for parallel execution with comprehensive reporting
const config = {
  testDir: './tests',
  testMatch: '**/*.js',

  /* Maximum time one test can run for */
  timeout: 180 * 1000, // 3 minutes per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  /* Run tests in parallel - maximize workers for faster execution */
  workers: process.env.CI ? 2 : 4, // Use more workers locally
  fullyParallel: true, // Run all tests in parallel
  retries: process.env.CI ? 2 : 1, // Retry failed tests
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Reporter configuration for comprehensive reporting */
  reporter: [
    ['html', { 
      outputFolder: 'test-reports/html',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-reports/json/test-results.json'
    }],
    ['junit', { 
      outputFile: 'test-reports/junit.xml'
    }],
    ['line'], // Console output
    ['allure-playwright', {
      detail: true,
      outputFolder: 'test-reports/allure-results',
      suiteTitle: 'Fleet Management Test Suite'
    }]
  ],

  /* Global test setup */
  use: {
    /* Collect trace when retrying failed tests */
    trace: 'retain-on-failure',
    /* Capture screenshot on failure */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    /* Record video for failed tests */
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },
    /* Browser settings */
    headless: false, // Set to true for CI/headless execution
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    /* Action timeouts */
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  /* Configure projects for different browsers in parallel */
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.spec.js',
    },
    {
      name: 'firefox-desktop',
      use: {
        browserName: 'firefox',
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.spec.js',
    },
    {
      name: 'webkit-desktop',
      use: {
        browserName: 'webkit',
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.spec.js',
    },
    /* Mobile viewports for responsive testing */
    {
      name: 'mobile-chrome',
      use: {
        browserName: 'chromium',
        ...require('@playwright/test').devices['Pixel 5'],
      },
      testMatch: '**/TS001*.spec.js', // Run subset on mobile
    },
    {
      name: 'mobile-safari',
      use: {
        browserName: 'webkit',
        ...require('@playwright/test').devices['iPhone 12'],
      },
      testMatch: '**/TS001*.spec.js', // Run subset on mobile
    },
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
  
  /* Global test fixtures */
  globalSetup: require.resolve('./utils/global-setup.js'),
  globalTeardown: require.resolve('./utils/global-teardown.js'),
};

module.exports = config;