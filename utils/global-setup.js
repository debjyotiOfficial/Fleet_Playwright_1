// Global setup for test suite
const fs = require('fs');
const path = require('path');

async function globalSetup() {
  console.log('🚀 Starting Fleet Management Test Suite...');
  
  // Create necessary directories
  const dirs = [
    'test-reports',
    'test-reports/html', 
    'test-reports/json',
    'test-reports/screenshots',
    'test-results'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Log test environment info
  console.log(`📊 Test Environment:`);
  console.log(`   - Node.js: ${process.version}`);
  console.log(`   - Platform: ${process.platform}`);
  console.log(`   - Workers: ${process.env.WORKERS || 'auto'}`);
  console.log(`   - Timestamp: ${new Date().toISOString()}`);
  
  // Create test run metadata
  const metadata = {
    startTime: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    config: {
      parallel: true,
      retries: process.env.CI ? 2 : 1,
      timeout: 180000
    }
  };
  
  fs.writeFileSync(
    path.join('test-reports', 'test-run-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
}

module.exports = globalSetup;