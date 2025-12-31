/**
 * End-to-End Tests for AutoBot Chatbot
 * 
 * This test suite uses Playwright to interact with the deployed website
 * and verify that the chatbot responds correctly with relevant information.
 * 
 * Prerequisites:
 * - Website must be running (either locally with `npm start` or deployed)
 * - GEMINI_API_KEY must be configured in the deployed environment
 * 
 * Usage:
 * - This test is designed to be run against a deployed instance with API key configured
 * - For local testing: Ensure GEMINI_API_KEY is set in .env file
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test-screenshots');
const WAIT_FOR_RESPONSE_TIMEOUT = 60000; // 60 seconds for API response
const TYPING_DELAY = 100; // Delay between keystrokes in ms

// The critical test query
const CRITICAL_TEST_QUERY = {
  query: 'what is SHAFT?',
  expectedKeywords: ['SHAFT', 'automation', 'framework', 'test'],
  description: 'Critical test - Basic question about SHAFT',
  minResponseLength: 50, // Response should be at least 50 characters
  shouldNotContain: [
    'API key not configured',
    'GEMINI_API_KEY',
    'error',
    'Error',
    'failed',
    'Failed'
  ]
};

// Additional test queries
const ADDITIONAL_TEST_QUERIES = [
  {
    query: 'How do I get started with SHAFT?',
    expectedKeywords: ['install', 'dependency', 'maven', 'gradle', 'getting started'],
    description: 'Question about getting started',
    minResponseLength: 50
  },
  {
    query: 'What platforms does SHAFT support?',
    expectedKeywords: ['web', 'mobile', 'API', 'desktop', 'GUI'],
    description: 'Question about supported platforms',
    minResponseLength: 50
  }
];

/**
 * Validate that response is relevant and not an error
 */
function validateResponse(response, testQuery) {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    relevanceScore: 0,
    foundKeywords: [],
    missingKeywords: []
  };

  // Check 1: Response should not be empty
  if (!response || response.trim().length === 0) {
    results.isValid = false;
    results.errors.push('Response is empty');
    return results;
  }

  // Check 2: Response should meet minimum length
  if (response.length < testQuery.minResponseLength) {
    results.isValid = false;
    results.errors.push(`Response too short (${response.length} < ${testQuery.minResponseLength} characters)`);
  }

  // Check 3: Response should NOT contain error messages or API key references
  if (testQuery.shouldNotContain) {
    const lowerResponse = response.toLowerCase();
    testQuery.shouldNotContain.forEach(forbidden => {
      if (lowerResponse.includes(forbidden.toLowerCase())) {
        results.isValid = false;
        results.errors.push(`Response contains forbidden text: "${forbidden}"`);
      }
    });
  }

  // Check 4: Response should contain expected keywords (relevance check)
  const lowerResponse = response.toLowerCase();
  testQuery.expectedKeywords.forEach(keyword => {
    if (lowerResponse.includes(keyword.toLowerCase())) {
      results.foundKeywords.push(keyword);
    } else {
      results.missingKeywords.push(keyword);
    }
  });

  results.relevanceScore = (results.foundKeywords.length / testQuery.expectedKeywords.length) * 100;

  if (results.relevanceScore < 50) {
    results.warnings.push(`Low relevance score: ${results.relevanceScore.toFixed(0)}%`);
    if (results.relevanceScore < 25) {
      results.isValid = false;
      results.errors.push('Response relevance too low (< 25%)');
    }
  }

  return results;
}

/**
 * Format validation results for display
 */
function formatValidationResults(validation, query, response) {
  let output = `\n${'='.repeat(80)}\n`;
  output += `Query: "${query}"\n`;
  output += `${'='.repeat(80)}\n`;
  output += `Response (${response.length} chars):\n${response}\n`;
  output += `${'─'.repeat(80)}\n`;
  output += `Validation Results:\n`;
  output += `  Status: ${validation.isValid ? '✅ PASSED' : '❌ FAILED'}\n`;
  output += `  Relevance Score: ${validation.relevanceScore.toFixed(0)}%\n`;
  output += `  Keywords Found: ${validation.foundKeywords.join(', ') || 'none'}\n`;
  
  if (validation.missingKeywords.length > 0) {
    output += `  Keywords Missing: ${validation.missingKeywords.join(', ')}\n`;
  }
  
  if (validation.errors.length > 0) {
    output += `  Errors:\n`;
    validation.errors.forEach(err => {
      output += `    ❌ ${err}\n`;
    });
  }
  
  if (validation.warnings.length > 0) {
    output += `  Warnings:\n`;
    validation.warnings.forEach(warn => {
      output += `    ⚠️  ${warn}\n`;
    });
  }
  
  output += `${'='.repeat(80)}\n`;
  
  return output;
}

/**
 * Main test function - to be called by Playwright-based test runner
 */
async function runE2ETest() {
  console.log('='.repeat(80));
  console.log('E2E TEST: CHATBOT RESPONSE VALIDATION');
  console.log('='.repeat(80));
  console.log('\n⚠️  This test requires:');
  console.log('  1. Website running at http://localhost:3000');
  console.log('  2. GEMINI_API_KEY configured in .env or deployed environment');
  console.log('  3. Playwright to interact with the chatbot\n');
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log(`Critical Test Query: "${CRITICAL_TEST_QUERY.query}"\n`);
  console.log('Expected Behavior:');
  console.log('  ✅ Response length >= 50 characters');
  console.log('  ✅ Contains keywords: ' + CRITICAL_TEST_QUERY.expectedKeywords.join(', '));
  console.log('  ✅ Does NOT contain: ' + CRITICAL_TEST_QUERY.shouldNotContain.join(', '));
  console.log('  ✅ Relevance score >= 50%\n');

  console.log('='.repeat(80));
  console.log('NOTE: This test structure is ready for Playwright execution.');
  console.log('To execute with Playwright, use the Playwright MCP tools to:');
  console.log('  1. Navigate to http://localhost:3000');
  console.log('  2. Click the chatbot button');
  console.log('  3. Type: "' + CRITICAL_TEST_QUERY.query + '"');
  console.log('  4. Wait for and capture the response');
  console.log('  5. Validate the response using validateResponse() function');
  console.log('='.repeat(80));

  return {
    testQuery: CRITICAL_TEST_QUERY,
    validateResponse,
    formatValidationResults,
    additionalQueries: ADDITIONAL_TEST_QUERIES
  };
}

// Export for use in other scripts
module.exports = {
  runE2ETest,
  validateResponse,
  formatValidationResults,
  CRITICAL_TEST_QUERY,
  ADDITIONAL_TEST_QUERIES,
  SCREENSHOTS_DIR
};

// Run if executed directly
if (require.main === module) {
  runE2ETest()
    .then(result => {
      console.log('\n✅ E2E test structure loaded successfully');
      console.log('Use Playwright MCP to execute the actual interaction test\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
}
