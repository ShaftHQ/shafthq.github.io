/**
 * Simple test to verify the documentation loader works correctly
 * This test does not require a Gemini API key
 */
import { loadDocumentation, getGitHubRepositoryContext } from '../netlify/functions/docs-loader.mjs';

console.log('=== Testing Documentation Loader ===\n');

// Test 1: Load documentation
console.log('Test 1: Loading documentation...');
const docs = loadDocumentation();
if (!docs) {
  console.error('❌ FAILED: Documentation loader returned null');
  process.exit(1);
}
console.log('✅ PASSED: Documentation loaded successfully');
console.log(`   Length: ${docs.length} characters`);
console.log(`   Sample: ${docs.substring(0, 100)}...`);

// Test 2: Verify documentation structure
console.log('\nTest 2: Verifying documentation structure...');
if (!docs.includes('SHAFT Engine User Guide')) {
  console.error('❌ FAILED: Documentation does not contain expected header');
  process.exit(1);
}
if (!docs.includes('Document:')) {
  console.error('❌ FAILED: Documentation does not contain document markers');
  process.exit(1);
}
console.log('✅ PASSED: Documentation structure is valid');

// Test 3: Load GitHub context
console.log('\nTest 3: Loading GitHub context...');
const github = getGitHubRepositoryContext();
if (!github) {
  console.error('❌ FAILED: GitHub context loader returned null');
  process.exit(1);
}
console.log('✅ PASSED: GitHub context loaded successfully');
console.log(`   Length: ${github.length} characters`);

// Test 4: Verify GitHub context structure
console.log('\nTest 4: Verifying GitHub context structure...');
if (!github.includes('github.com/ShaftHQ/SHAFT_ENGINE')) {
  console.error('❌ FAILED: GitHub context does not contain repository URL');
  process.exit(1);
}
console.log('✅ PASSED: GitHub context structure is valid');

// Test 5: Check documentation contains key topics
console.log('\nTest 5: Checking for key documentation topics...');
const expectedTopics = [
  'SHAFT',
  'API',
  'Web',
  'Mobile',
  'configuration',
  'properties'
];

let missingTopics = [];
for (const topic of expectedTopics) {
  if (!docs.toLowerCase().includes(topic.toLowerCase())) {
    missingTopics.push(topic);
  }
}

if (missingTopics.length > 0) {
  console.error(`❌ FAILED: Documentation is missing topics: ${missingTopics.join(', ')}`);
  process.exit(1);
}
console.log('✅ PASSED: All expected topics found in documentation');

// Summary
console.log('\n=== All Tests Passed! ===');
console.log(`Total documentation size: ${docs.length} characters`);
console.log(`GitHub context size: ${github.length} characters`);
console.log('The documentation loader is working correctly.');
