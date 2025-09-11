// Global teardown for test suite
const fs = require('fs');
const path = require('path');

async function globalTeardown() {
  console.log('🏁 Fleet Management Test Suite Completed!');
  
  try {
    // Read test run metadata
    const metadataPath = path.join('test-reports', 'test-run-metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    // Update with end time
    metadata.endTime = new Date().toISOString();
    metadata.duration = new Date(metadata.endTime) - new Date(metadata.startTime);
    
    // Calculate test summary if results exist
    try {
      const resultsPath = path.join('test-reports', 'json', 'test-results.json');
      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
        metadata.summary = {
          total: results.suites?.reduce((acc, suite) => acc + (suite.specs?.length || 0), 0) || 0,
          passed: results.suites?.reduce((acc, suite) => 
            acc + (suite.specs?.filter(spec => 
              spec.tests?.every(test => test.results?.every(result => result.status === 'passed'))
            ).length || 0), 0) || 0,
          failed: results.suites?.reduce((acc, suite) => 
            acc + (suite.specs?.filter(spec => 
              spec.tests?.some(test => test.results?.some(result => result.status === 'failed'))
            ).length || 0), 0) || 0
        };
      }
    } catch (e) {
      console.log('Could not parse test results for summary');
    }
    
    // Write updated metadata
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    // Generate summary report
    console.log('\n📊 Test Execution Summary:');
    console.log(`   - Start Time: ${metadata.startTime}`);
    console.log(`   - End Time: ${metadata.endTime}`);
    console.log(`   - Duration: ${Math.round(metadata.duration / 1000)}s`);
    
    if (metadata.summary) {
      console.log(`   - Total Tests: ${metadata.summary.total}`);
      console.log(`   - Passed: ${metadata.summary.passed}`);
      console.log(`   - Failed: ${metadata.summary.failed}`);
      console.log(`   - Success Rate: ${metadata.summary.total > 0 ? Math.round((metadata.summary.passed / metadata.summary.total) * 100) : 0}%`);
    }
    
    console.log('\n📁 Reports Generated:');
    console.log(`   - HTML Report: test-reports/html/index.html`);
    console.log(`   - JSON Report: test-reports/json/test-results.json`);
    console.log(`   - JUnit Report: test-reports/junit.xml`);
    console.log(`   - Test Artifacts: test-results/`);
    
  } catch (error) {
    console.log('⚠️  Error in teardown:', error.message);
  }
}

module.exports = globalTeardown;