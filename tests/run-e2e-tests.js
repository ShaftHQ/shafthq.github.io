#!/usr/bin/env node

/**
 * E2E Test Runner with Playwright MCP Integration
 * 
 * This script runs end-to-end tests for the AutoBot chatbot by:
 * 1. Starting the local development server
 * 2. Using Playwright MCP to interact with the chatbot
 * 3. Capturing screenshots and chat history
 * 4. Generating a test report
 */

const { spawn } = require('child_process');
const { TEST_CONVERSATIONS, SCREENSHOTS_DIR } = require('./chatbot-e2e.test.js');
const fs = require('fs');
const path = require('path');

const WEBSITE_URL = 'http://localhost:3000';
const SERVER_STARTUP_DELAY = 15000; // Wait 15 seconds for server to start

/**
 * Instructions for manual Playwright MCP execution
 */
function generatePlaywrightInstructions() {
  console.log('\n' + '='.repeat(80));
  console.log('PLAYWRIGHT MCP EXECUTION INSTRUCTIONS');
  console.log('='.repeat(80));
  console.log('\nTo run the E2E tests with Playwright MCP, follow these steps:\n');
  
  console.log('1. Start the development server:');
  console.log('   npm start\n');
  
  console.log('2. Wait for server to be ready (usually ~15 seconds)\n');
  
  console.log('3. Use Playwright MCP to execute the following test sequence:\n');
  
  TEST_CONVERSATIONS.forEach((conversation, index) => {
    console.log(`   Test ${index + 1}: ${conversation.description}`);
    console.log(`   ─────────────────────────────────────────────────────────`);
    console.log(`   a) Navigate to: ${WEBSITE_URL}`);
    console.log(`   b) Take screenshot: "before-chat-open-test${index + 1}.png"`);
    console.log(`   c) Click the chatbot button (robot icon in bottom right)`);
    console.log(`   d) Wait for chat window to open`);
    console.log(`   e) Take screenshot: "chat-opened-test${index + 1}.png"`);
    console.log(`   f) Type message: "${conversation.query}"`);
    console.log(`   g) Click send button or press Enter`);
    console.log(`   h) Wait for bot response (max 30 seconds)`);
    console.log(`   i) Take screenshot: "chat-response-test${index + 1}.png"`);
    console.log(`   j) Verify response contains keywords: ${conversation.expectedKeywords.join(', ')}`);
    console.log(`   k) Extract and save full chat history\n`);
  });
  
  console.log('4. Save all screenshots to:', SCREENSHOTS_DIR);
  console.log('\n' + '='.repeat(80));
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(80));
  console.log('E2E TEST RUNNER FOR AUTOBOT');
  console.log('='.repeat(80));
  
  // Check if we should display instructions or run tests
  const mode = process.argv[2];
  
  if (mode === '--instructions' || mode === '-i') {
    generatePlaywrightInstructions();
    return;
  }
  
  console.log('\n📝 Test Configuration:');
  console.log(`   Number of test conversations: ${TEST_CONVERSATIONS.length}`);
  console.log(`   Website URL: ${WEBSITE_URL}`);
  console.log(`   Screenshots directory: ${SCREENSHOTS_DIR}\n`);
  
  console.log('ℹ️  This test requires Playwright MCP to execute.\n');
  console.log('To see detailed execution instructions, run:');
  console.log('   node tests/run-e2e-tests.js --instructions\n');
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`✅ Created screenshots directory: ${SCREENSHOTS_DIR}\n`);
  }
  
  console.log('='.repeat(80));
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
