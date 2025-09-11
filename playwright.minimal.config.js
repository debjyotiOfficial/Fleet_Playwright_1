// Minimal Playwright configuration for limited disk space
const config = {
  testDir: './tests',
  testMatch: '**/*.spec.js',

  /* Maximum time one test can run for */
  timeout: 90 * 1000,
  expect: {
    timeout: 5000,
  },

  /* Run tests in parallel with limited workers */
  workers: 2,
  fullyParallel: true,
  retries: 1,

  /* Minimal reporter configuration */
  reporter: [
    ['html', { 
      outputFolder: 'test-reports/html',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-reports/results.json'
    }],
    ['line']
  ],

  /* Use settings optimized for smaller footprint */
  use: {
    /* Minimal tracing and screenshots */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off', // Disabled to save space
    
    /* Browser settings */
    headless: true, // Headless for CI/space efficiency
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    /* Timeouts */
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  /* Single browser project to save space */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],

  /* Output directory */
  outputDir: 'test-results/',
};

module.exports = config;