# Fleet Management System - Playwright Test Suite

This repository contains automated test suites for the Fleet Management System using Playwright with JavaScript.

## 📁 Project Structure

```
Fleet_Playwright_1/
├── tests/                          # Test specification files
│   ├── TS001_listOfDevice.spec.js
│   ├── TS003_ChangeTimezone.spec.js
│   ├── TS004_viewEditUser.spec.js
│   ├── TS005_subgroup.spec.js
│   ├── TS006_trackInfoDisplayOptions.spec.js
│   ├── TS007_pulsingIcon.spec.js
│   ├── TS009_changeAlertSettings.spec.js
│   ├── TS010_scheduledReports.spec.js
│   ├── TS011_addEditMaintenanceContact.spec.js
│   └── TS013_viewVehicleService.spec.js
├── fixtures/
│   └── tlr-config.json             # Test configuration and data
├── utils/
│   ├── test-helpers.js             # Common test utilities
│   ├── config-loader.js            # Configuration loader
│   ├── global-setup.js             # Global test setup
│   └── global-teardown.js          # Global test teardown
├── test-reports/                   # Generated test reports
├── test-results/                   # Test artifacts (screenshots, videos)
├── playwright.config.js            # BrowserStack configuration
├── playwright.local.config.js      # Local development configuration
├── playwright.parallel.config.js   # Parallel execution configuration
├── playwright.minimal.config.js    # Minimal disk space configuration
├── run-tests-parallel.js           # Parallel test runner script
├── install-minimal.js              # Minimal installation script
└── package.json                    # Project dependencies and scripts
```

## 🚀 Quick Start

### Option 1: Minimal Installation (Recommended for limited disk space)
```bash
# Run minimal installation script
node install-minimal.js

# Run tests
npm test
```

### Option 2: Full Installation
```bash
# Install all dependencies
npm install

# Install browsers
npm run setup

# Run tests
npm test
```

## 📋 Available Commands

### Test Execution
```bash
# Run all tests (minimal config)
npm test

# Run tests with browser UI (headed mode)
npm run test:headed

# Run tests in parallel
npm run test:parallel

# Run tests locally (full config)
npm run test:local

# Run tests with BrowserStack
npm run test:browserstack

# Run tests sequentially (single worker)
npm run test:single

# Debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui

# Custom parallel runner
npm run run-parallel
```

### Reporting
```bash
# View HTML reports
npm run report

# Clean up test artifacts
npm run clean
```

### Browser Management
```bash
# Install browsers
npm run install-browsers

# Install system dependencies
npm run install-deps

# Full setup (browsers + dependencies)
npm run setup
```

## ⚙️ Configuration Files

### 1. `playwright.minimal.config.js` (Default)
- **Use case**: Limited disk space, CI/CD pipelines
- **Features**: Single browser (Chromium), minimal artifacts
- **Workers**: 2
- **Video**: Disabled

### 2. `playwright.local.config.js`
- **Use case**: Local development
- **Features**: Multiple browsers, full reporting
- **Workers**: 2
- **Video**: On failure

### 3. `playwright.parallel.config.js`
- **Use case**: Maximum performance
- **Features**: All browsers, comprehensive reporting
- **Workers**: 4
- **Video**: On failure

### 4. `playwright.config.js`
- **Use case**: BrowserStack integration
- **Features**: Cloud testing
- **Workers**: 1

## 🧪 Test Structure

### Test Configuration (`fixtures/tlr-config.json`)
Contains:
- **URLs**: Environment endpoints
- **Credentials**: Login information
- **Selectors**: UI element selectors
- **Test Data**: Expected values and test datasets
- **Timeouts**: Action and wait timeouts

### Test Helpers (`utils/test-helpers.js`)
Provides:
- Login automation
- Navigation utilities
- Storage management
- Wait helpers

### Test Files
All test files follow the naming convention: `TS[number]_[description].spec.js`

## 📊 Reporting

Tests generate multiple report formats:

1. **HTML Report**: `test-reports/html/index.html`
   - Interactive web interface
   - Screenshots and videos
   - Test timeline

2. **JSON Report**: `test-reports/results.json`
   - Machine-readable results
   - Integration with CI/CD

3. **JUnit XML**: `test-reports/junit.xml`
   - CI/CD integration
   - Jenkins, Azure DevOps compatible

## 🔧 Troubleshooting

### Disk Space Issues
```bash
# Use minimal configuration
npm test

# Clean up artifacts
npm run clean

# Use minimal installation
node install-minimal.js
```

### Browser Issues
```bash
# Reinstall browsers
npx playwright install

# Install system dependencies
npx playwright install-deps

# Check browser status
npx playwright install --dry-run
```

### Test Failures
```bash
# Run single test for debugging
npx playwright test tests/TS001_listOfDevice.spec.js --debug

# Run with trace
npx playwright test --trace on

# Generate trace viewer
npx playwright show-trace trace.zip
```

## 🌐 Environment Support

### URLs
- **Main**: `https://www.gpsandfleet3.net/gpsandfleet/`
- **Backup**: `https://www.gpsandfleet-server1.com/gpsandfleet/`
- **Tracking**: `https://www.tracking.gpsandfleet.io/gpsandfleet/`

### Browsers
- **Chromium** (Chrome)
- **Firefox**
- **WebKit** (Safari)
- **Mobile Chrome**
- **Mobile Safari**

## 📝 Writing New Tests

1. Create test file in `tests/` directory
2. Use `TestHelpers` class for common operations
3. Follow existing naming conventions
4. Add selectors to `tlr-config.json`
5. Include proper error handling

Example:
```javascript
const { test, expect } = require('@playwright/test');
const TestHelpers = require('../utils/test-helpers');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.clearStorageAndSetTimeouts();
  });

  test('should perform action', async ({ page }) => {
    const helpers = new TestHelpers(page);
    const config = await helpers.getConfig();
    
    await helpers.login();
    // Add test steps here
  });
});
```

## BrowserStack Integration

* Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` as environment variables
* Run `npm run test:browserstack` for cloud testing
* View results on [BrowserStack Automate dashboard](https://www.browserstack.com/automate)

## 🤝 Contributing

1. Create feature branch
2. Add tests with proper documentation
3. Update configuration if needed
4. Test with minimal configuration
5. Submit pull request

## 📄 License

ISC License
