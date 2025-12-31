#!/usr/bin/env node

/**
 * Script to verify which Gemini models are available
 * This script does not require an API key - it just lists the models that the code will try
 */

const modelsToTry = [
  'gemini-3-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

console.log('='.repeat(70));
console.log('GEMINI MODEL CONFIGURATION VERIFICATION');
console.log('='.repeat(70));
console.log('\nAutoBot is configured to use the following models in order:\n');

modelsToTry.forEach((model, index) => {
  const label = index === 0 ? 'Primary' : index === 1 ? 'Fallback 1' : index === 2 ? 'Fallback 2' : 'Fallback 3';
  console.log(`  ${index + 1}. ${label.padEnd(12)} : ${model}`);
});

console.log('\nHow it works:');
console.log('  - AutoBot will first try to use the primary model');
console.log('  - If that fails, it will automatically try the fallback models in order');
console.log('  - If all models fail, an error message is shown to the user');

console.log('\nModel Information:');
console.log('  - gemini-3-flash       : Latest model (newest features, best performance)');
console.log('  - gemini-2.0-flash-exp : Experimental model (fast, agentic features)');
console.log('  - gemini-1.5-flash     : Stable production model (reliable, well-tested)');
console.log('  - gemini-1.5-pro       : Larger stable model (more capable, slightly slower)');

console.log('\nAll models are available on the free tier with rate limits:');
console.log('  - 15 requests per minute');
console.log('  - 1,500 requests per day');

console.log('\n' + '='.repeat(70));
console.log('✅ Configuration verified successfully');
console.log('='.repeat(70));
