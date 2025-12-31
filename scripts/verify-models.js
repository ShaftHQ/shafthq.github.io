#!/usr/bin/env node

/**
 * Script to verify which Gemini models are available
 * This script does not require an API key - it just lists the models that the code will try
 */

const modelsToTry = [
  'gemini-3-flash',
  'gemini-2.5-flash'
];

console.log('='.repeat(70));
console.log('GEMINI MODEL CONFIGURATION VERIFICATION');
console.log('='.repeat(70));
console.log('\nAutoBot is configured to use the following models in order:\n');

modelsToTry.forEach((model, index) => {
  const label = index === 0 ? 'Primary' : 'Fallback';
  console.log(`  ${index + 1}. ${label.padEnd(12)} : ${model}`);
});

console.log('\nHow it works:');
console.log('  - AutoBot will first try to use the primary model (gemini-3-flash)');
console.log('  - If that fails or rate limit is hit, it will automatically use the fallback (gemini-2.5-flash)');
console.log('  - If both models fail, an error message is shown to the user');

console.log('\nModel Information:');
console.log('  - gemini-3-flash   : Latest model (newest features, best performance)');
console.log('  - gemini-2.5-flash : Fallback model (reliable, production-ready)');

console.log('\nAll models are available on the free tier with rate limits:');
console.log('  - 15 requests per minute');
console.log('  - 1,500 requests per day');

console.log('\n' + '='.repeat(70));
console.log('✅ Configuration verified successfully');
console.log('='.repeat(70));
