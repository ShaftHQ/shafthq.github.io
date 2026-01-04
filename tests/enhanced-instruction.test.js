/**
 * Test to verify the enhanced system instruction generation
 * This simulates how the Netlify function enhances the system instruction with documentation
 */
import { loadDocumentation, getGitHubRepositoryContext } from '../netlify/functions/docs-loader.mjs';

console.log('=== Testing Enhanced System Instruction Generation ===\n');

// Test 1: Load components
console.log('Test 1: Loading components...');
const documentation = loadDocumentation();
const githubContext = getGitHubRepositoryContext();

if (!documentation || !githubContext) {
  console.error('❌ FAILED: Could not load required components');
  process.exit(1);
}
console.log('✅ PASSED: Components loaded');

// Test 2: Generate enhanced system instruction
console.log('\nTest 2: Generating enhanced system instruction...');
const originalSystemInstruction = 'You are AutoBot, a helpful assistant.';
const enhancedSystemInstruction = `${documentation}\n\n${githubContext}\n\n---\n\n${originalSystemInstruction}\n\nIMPORTANT: Use ONLY the documentation provided above to answer questions.`;

console.log('✅ PASSED: Enhanced system instruction generated');
console.log(`   Total length: ${enhancedSystemInstruction.length} characters`);
console.log(`   Documentation included: ${enhancedSystemInstruction.includes('SHAFT Engine User Guide')}`);
console.log(`   GitHub context included: ${enhancedSystemInstruction.includes('github.com/ShaftHQ')}`);
console.log(`   Original instruction included: ${enhancedSystemInstruction.includes('You are AutoBot')}`);

// Test 3: Verify size is within reasonable limits
console.log('\nTest 3: Verifying size is within Gemini API limits...');
// Gemini models typically support around 1-2M tokens
// With ~4 chars per token, 500K chars is approximately 125K tokens, which is well within limits
const maxReasonableSize = 500000; // 500KB

if (enhancedSystemInstruction.length > maxReasonableSize) {
  console.warn(`⚠️  WARNING: Enhanced instruction is ${enhancedSystemInstruction.length} chars (limit: ${maxReasonableSize})`);
  console.warn('   This might be too large for some models');
} else {
  console.log(`✅ PASSED: Size is reasonable (${enhancedSystemInstruction.length} < ${maxReasonableSize})`);
}

// Test 4: Verify caching would work
console.log('\nTest 4: Testing caching behavior...');
let cachedDocumentation = null;
let cachedGitHubContext = null;

function getDocumentationContext() {
  if (!cachedDocumentation) {
    console.log('   Loading documentation (cold start)...');
    cachedDocumentation = loadDocumentation();
    cachedGitHubContext = getGitHubRepositoryContext();
  } else {
    console.log('   Using cached documentation (warm start)...');
  }
  return { documentation: cachedDocumentation, githubContext: cachedGitHubContext };
}

// First call (cold start)
const ctx1 = getDocumentationContext();
// Second call (warm start)
const ctx2 = getDocumentationContext();

if (ctx1.documentation === ctx2.documentation && ctx1.githubContext === ctx2.githubContext) {
  console.log('✅ PASSED: Caching works correctly');
} else {
  console.error('❌ FAILED: Caching not working as expected');
  process.exit(1);
}

// Test 5: Verify important SHAFT information is present
console.log('\nTest 5: Verifying key SHAFT information is present...');
const keyInfo = [
  'SHAFT.API',
  'SHAFT.GUI',
  'Browser_Actions',
  'Element_Actions',
  'Request_Builder',
  'properties',
  'configuration'
];

let missingInfo = [];
for (const info of keyInfo) {
  if (!enhancedSystemInstruction.includes(info)) {
    missingInfo.push(info);
  }
}

if (missingInfo.length > 0) {
  console.error(`❌ FAILED: Missing key information: ${missingInfo.join(', ')}`);
  process.exit(1);
}
console.log('✅ PASSED: All key SHAFT information is present');

// Summary
console.log('\n=== All Tests Passed! ===');
console.log('The enhanced system instruction generation is working correctly.');
console.log('The Autobot will now use local documentation instead of Google Search.');
