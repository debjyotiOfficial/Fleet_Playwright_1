#!/usr/bin/env node

/**
 * Minimal Installation Script for Playwright
 * Installs only essential dependencies for limited disk space
 */

const { spawn } = require('child_process');
const fs = require('fs');

async function installMinimal() {
  console.log('🔧 Installing Playwright with minimal footprint...\n');

  const commands = [
    // Install only Playwright test (without all browsers initially)
    'npm install @playwright/test --no-optional --no-audit --no-fund',
    
    // Install only Chromium browser (smallest footprint)
    'npx playwright install chromium',
    
    // Install system dependencies only for Chromium
    'npx playwright install-deps chromium'
  ];

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    console.log(`\n📦 Step ${i + 1}/3: ${command}\n`);
    
    try {
      await executeCommand(command);
      console.log(`✅ Step ${i + 1} completed successfully\n`);
    } catch (error) {
      console.log(`❌ Step ${i + 1} failed: ${error.message}`);
      
      if (i === 0) {
        console.log('⚠️  Playwright installation failed. You can still run tests if Playwright is globally installed.');
        break;
      } else {
        console.log('⚠️  Browser installation failed. Tests may not run properly.');
      }
    }
  }

  // Create basic test runner script
  createTestRunner();
  
  console.log('\n🎉 Minimal setup completed!');
  console.log('\n📋 Available commands:');
  console.log('  npm test              - Run all tests (minimal config)');
  console.log('  npm run test:headed   - Run with browser UI');
  console.log('  npm run test:single   - Run tests sequentially');
  console.log('  npm run test:debug    - Debug mode');
  console.log('  node install-minimal.js - Rerun this setup');
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function createTestRunner() {
  const runnerScript = `#!/usr/bin/env node

const { spawn } = require('child_process');

async function runTests() {
  console.log('🚀 Running Fleet Management Tests...\\n');
  
  const args = process.argv.slice(2);
  const config = args.includes('--parallel') ? 'playwright.parallel.config.js' : 'playwright.minimal.config.js';
  
  const command = \`npx playwright test --config=\${config} \${args.filter(arg => arg !== '--parallel').join(' ')}\`;
  
  console.log(\`📋 Command: \${command}\\n\`);
  
  const child = spawn(command, { shell: true, stdio: 'inherit' });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log('\\n✅ Tests completed successfully!');
      console.log('📊 View reports: npm run report');
    } else {
      console.log(\`\\n❌ Tests failed with exit code \${code}\`);
    }
    process.exit(code);
  });
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = runTests;`;

  fs.writeFileSync('run-tests.js', runnerScript);
  console.log('📄 Created run-tests.js script');
}

// Run if called directly
if (require.main === module) {
  installMinimal().catch(console.error);
}

module.exports = installMinimal;