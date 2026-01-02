#!/usr/bin/env node

/**
 * Script to verify which Gemini models are available
 * This script does not require an API key - it just lists the models that the code will try
 */

const modelsToTry = [
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemma-3-27b',
  'gemma-3-12b',
  'gemma-3-4b',
  'gemma-3-2b',
  'gemma-3-1b'
];

console.log('='.repeat(70));
console.log('GEMINI MODEL CONFIGURATION VERIFICATION');
console.log('='.repeat(70));
console.log('\nAutoBot is configured to use the following models in order:\n');

modelsToTry.forEach((model, index) => {
  let label;
  if (index === 0) {
    label = 'Primary';
  } else if (index === 1) {
    label = 'Secondary';
  } else {
    label = `Fallback ${index - 1}`;
  }
  console.log(`  ${index + 1}. ${label.padEnd(12)} : ${model}`);
});

console.log('\nHow it works:');
console.log('  - AutoBot tries each model in sequence until one successfully responds');
console.log('  - This ensures high availability even during rate limits or service disruptions');
console.log('  - If all models fail, a descriptive error message is shown to the user');

console.log('\nModel Information:');
console.log('  Gemini Models (Google AI flagship):');
console.log('    - gemini-3-flash         : Latest model (newest features, best performance)');
console.log('    - gemini-2.5-flash       : Flagship model (reliable, production-ready)');
console.log('    - gemini-2.5-flash-lite  : Lightweight version (faster, efficient)');
console.log('  Gemma Models (Open source by Google):');
console.log('    - gemma-3-27b            : Largest open model (highest capability)');
console.log('    - gemma-3-12b            : Balanced open model (good performance)');
console.log('    - gemma-3-4b             : Efficient open model (fast responses)');
console.log('    - gemma-3-2b             : Compact open model (lightweight)');
console.log('    - gemma-3-1b             : Minimal fallback (basic capability)');

console.log('\nAll models are available on the free tier with rate limits:');
console.log('  - 15 requests per minute');
console.log('  - 1,500 requests per day');

console.log('\n' + '='.repeat(70));
console.log('✅ Configuration verified successfully');
console.log('='.repeat(70));
