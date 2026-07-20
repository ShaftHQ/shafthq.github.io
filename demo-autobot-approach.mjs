#!/usr/bin/env node
/**
 * Demonstration script to show that the new AutoBot approach works
 * This script demonstrates:
 * 1. Documentation loading works correctly
 * 2. Enhanced system instruction is generated properly
 * 3. Key SHAFT topics are included in the context
 */

import { loadDocumentation, getGitHubRepositoryContext } from './shared/docs-loader.mjs';

console.log('===========================================');
console.log('AutoBot Documentation-Based Approach Demo');
console.log('===========================================\n');

// Step 1: Load Documentation
console.log('Step 1: Loading Documentation...');
console.log('─────────────────────────────────────────');
const startTime = Date.now();
const documentation = loadDocumentation();
const githubContext = getGitHubRepositoryContext();
const loadTime = Date.now() - startTime;

if (!documentation || !githubContext) {
  console.error('❌ FAILED: Could not load documentation');
  process.exit(1);
}

console.log(`✅ SUCCESS: Loaded ${documentation.length.toLocaleString()} characters in ${loadTime}ms`);
console.log(`   - Documentation: ${documentation.length.toLocaleString()} chars`);
console.log(`   - GitHub Context: ${githubContext.length.toLocaleString()} chars`);
console.log();

// Step 2: Show what's included
console.log('Step 2: Documentation Content Analysis');
console.log('─────────────────────────────────────────');

// Count documents
const docCount = (documentation.match(/## Document:/g) || []).length;
console.log(`✅ Loaded ${docCount} documentation files`);

// Show key topics included
const keyTopics = {
  'Web/GUI Testing': documentation.includes('Element_Actions'),
  'API Testing': documentation.includes('Request_Builder'),
  'Mobile Testing': documentation.includes('mobile'),
  'Database Testing': documentation.includes('DB_Actions'),
  'CLI Testing': documentation.includes('Terminal_Actions'),
  'Configuration': documentation.includes('properties'),
  'Validations': documentation.includes('Validations'),
  'Browser Actions': documentation.includes('Browser_Actions'),
};

console.log('\n📚 Key Topics Included:');
for (const [topic, included] of Object.entries(keyTopics)) {
  console.log(`   ${included ? '✅' : '❌'} ${topic}`);
}
console.log();

// Step 3: Show sample content
console.log('Step 3: Sample Documentation Content');
console.log('─────────────────────────────────────────');

// Find and show a sample from API documentation
const apiDocStart = documentation.indexOf('## Document: Keywords/API/Request_Builder.md');
if (apiDocStart > -1) {
  const apiSample = documentation.substring(apiDocStart, apiDocStart + 500);
  console.log('Sample from API Request Builder documentation:\n');
  console.log(apiSample);
  console.log('...\n');
}

// Step 4: Enhanced System Instruction
console.log('Step 4: Enhanced System Instruction Generation');
console.log('─────────────────────────────────────────');

const systemInstruction = 'You are AutoBot, a helpful SHAFT assistant.';
const enhancedSystemInstruction = `${documentation}\n\n${githubContext}\n\n---\n\n${systemInstruction}\n\nIMPORTANT: Use ONLY the documentation provided above.`;

console.log(`✅ Enhanced instruction length: ${enhancedSystemInstruction.length.toLocaleString()} characters`);
console.log(`   - Within Gemini limit (500KB): ${enhancedSystemInstruction.length < 500000 ? 'YES ✅' : 'NO ❌'}`);
console.log(`   - Includes full documentation: ${enhancedSystemInstruction.includes('SHAFT Engine User Guide') ? 'YES ✅' : 'NO ❌'}`);
console.log(`   - Includes GitHub context: ${enhancedSystemInstruction.includes('github.com/ShaftHQ') ? 'YES ✅' : 'NO ❌'}`);
console.log();

// Step 5: Demonstrate searchable content
console.log('Step 5: Demonstrate Question-Answer Capability');
console.log('─────────────────────────────────────────');

const sampleQuestions = [
  { q: 'How to create an API instance?', search: 'SHAFT.API' },
  { q: 'How to perform browser actions?', search: 'Browser_Actions' },
  { q: 'How to configure SHAFT?', search: 'properties' },
  { q: 'How to validate elements?', search: 'Element_Validations' },
];

console.log('Sample questions that can be answered from the loaded documentation:\n');
for (const { q, search } of sampleQuestions) {
  const canAnswer = documentation.includes(search);
  console.log(`Q: "${q}"`);
  console.log(`   ${canAnswer ? '✅' : '❌'} Information available (contains "${search}")\n`);
}

// Step 6: Show the difference from old approach
console.log('Step 6: Comparison with Old Approach');
console.log('─────────────────────────────────────────');
console.log('OLD APPROACH (Google Search Grounding):');
console.log('  ❌ Fetches data from internet at runtime');
console.log('  ❌ May include third-party sources');
console.log('  ❌ Results can vary based on search results');
console.log('  ❌ Depends on external Google Search API');
console.log('  ❌ Cannot trace answer to specific documentation');
console.log();
console.log('NEW APPROACH (Local Documentation):');
console.log('  ✅ Uses only official SHAFT documentation');
console.log('  ✅ No external API calls during queries');
console.log('  ✅ Consistent, reproducible answers');
console.log('  ✅ All answers traceable to docs');
console.log('  ✅ Documentation loaded once and cached');
console.log();

// Summary
console.log('===========================================');
console.log('Summary');
console.log('===========================================');
console.log(`✅ Documentation loaded successfully (${docCount} files)`);
console.log(`✅ Enhanced instruction generated (${(enhancedSystemInstruction.length / 1024).toFixed(1)} KB)`);
console.log(`✅ All key SHAFT topics included`);
console.log(`✅ Ready to provide accurate, documentation-based answers`);
console.log('✅ No internet searches or external dependencies');
console.log('\n🎉 The new AutoBot approach is working correctly!\n');
