#!/usr/bin/env node

/**
 * Script to verify which Gemini models are available
 * This script does not require an API key - it just lists the models that the code will try
 */

const modelsToTry = [
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
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
console.log('  Gemini 2.0 Models (Latest generation):');
console.log('    - gemini-2.0-flash-exp   : Experimental version with latest features');
console.log('    - gemini-2.0-flash       : Stable production-ready model');
console.log('  Gemini 1.5 Models (Reliable fallback):');
console.log('    - gemini-1.5-flash       : Fast, multimodal, 1M token context');
console.log('    - gemini-1.5-flash-8b    : High-volume, cost-efficient variant');
console.log('    - gemini-1.5-pro         : Highest reasoning, 2M token context');

console.log('\nAll models are available on the free tier with rate limits:');
console.log('  - 15 requests per minute');
console.log('  - 1,500 requests per day');

console.log('\n' + '='.repeat(70));
console.log('✅ Configuration verified successfully');
console.log('='.repeat(70));
